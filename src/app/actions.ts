"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { canSendWithCurrentResendSender, getResend, getResendFrom, isResendDebugEnabled } from "@/lib/resend";
import {
  checkoutSchema,
  distributorLeadSchema,
  productLeadSchema,
} from "@/lib/schemas";
import { initiateMoolrePayment, moolreConfigured } from "@/lib/moolre/initiate-payment";
import { getPublicAppUrl } from "@/lib/app-url";
import { distributorPackages, products, siteConfig } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  distributorApplicationAdminNotificationEmail,
  distributorApplicationConfirmationEmail,
  orderCheckoutConfirmationEmail,
} from "@/lib/email-templates";

const resend = getResend();
const resendFrom = getResendFrom();
const resendDebug = isResendDebugEnabled();
const resendReplyTo = (process.env.RESEND_REPLY_TO || process.env.ADMIN_EMAIL || siteConfig.email).trim();

const adminEmail = process.env.ADMIN_EMAIL || siteConfig.email;

function requireAdminDb() {
  const supabase = createAdminClient();
  if (!supabase) {
    throw new Error(
      "Supabase service role is missing. Set SUPABASE_SERVICE_ROLE_KEY on Vercel (Production + Preview) to store leads and orders.",
    );
  }
  return supabase;
}

async function sendEmailSafe(params: {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  context: string;
}) {
  if (!resend) {
    if (resendDebug) {
      console.info(`[${params.context}] Resend disabled: RESEND_API_KEY is missing.`);
    }
    return;
  }

  if (resendDebug) {
    console.info(`[${params.context}] Email attempt`, {
      from: resendFrom,
      replyTo: resendReplyTo,
      to: params.to,
      subject: params.subject,
    });
  }

  if (!canSendWithCurrentResendSender({ from: resendFrom, to: params.to })) {
    console.warn(
      `[${params.context}] Email skipped: sandbox sender ${resendFrom} cannot deliver to ${params.to.join(", ")}. ` +
        "Set RESEND_FROM to a verified domain or add RESEND_SANDBOX_ALLOWLIST for testing.",
    );
    return;
  }

  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: resendReplyTo,
    });
    if (resendDebug) {
      console.info(`[${params.context}] Email accepted by Resend`, {
        id: result?.data?.id ?? null,
        error: result?.error?.message ?? null,
      });
    }
  } catch (e) {
    console.error(`[${params.context}] Resend send failed:`, e);
  }
}

export const submitProductLead = actionClient
  .schema(productLeadSchema)
  .action(async ({ parsedInput }: { parsedInput: z.infer<typeof productLeadSchema> }) => {
    const supabase = requireAdminDb();
    await supabase.from("leads").insert({
      name: parsedInput.name,
      email: parsedInput.email,
      phone: parsedInput.phone,
      type: "buyer",
      product_interest: parsedInput.productInterest,
      message: `${parsedInput.message} (preferred: ${parsedInput.preferredContact})`,
      status: "new",
    });

    await sendEmailSafe({
      to: [adminEmail],
      subject: `New product lead: ${parsedInput.productInterest}`,
      html: `<p>${parsedInput.name} submitted a buyer lead.</p><p>${parsedInput.email} / ${parsedInput.phone}</p>`,
      text: [
        "New product lead",
        `Name: ${parsedInput.name}`,
        `Email: ${parsedInput.email}`,
        `Phone: ${parsedInput.phone}`,
        `Product interest: ${parsedInput.productInterest}`,
        `Preferred contact: ${parsedInput.preferredContact}`,
      ].join("\n"),
      context: "product-lead-admin",
    });
    revalidatePath("/admin/leads");
    return { success: true };
  });

export const submitDistributorLead = actionClient
  .schema(distributorLeadSchema)
  .action(async ({ parsedInput }: { parsedInput: z.infer<typeof distributorLeadSchema> }) => {
    const pkg = distributorPackages.find((p) => p.tier === parsedInput.packageTier);
    const qtyPart = pkg?.quantityNote ?? (pkg ? `${pkg.boxes} box${pkg.boxes === 1 ? "" : "es"}` : "");
    const packageLine = pkg
      ? `${pkg.name} (${currencyFormatter.format(pkg.price)} · ~$${pkg.usdApprox} · ${qtyPart} · ${pkg.pv} PV)`
      : parsedInput.packageTier;

    const supabase = requireAdminDb();
    await supabase.from("leads").insert({
      name: parsedInput.name,
      email: parsedInput.email,
      phone: parsedInput.phone,
      type: "distributor",
      message: `Preferred package: ${packageLine}. Why join: ${parsedInput.whyJoin}. Sales exp: ${parsedInput.salesExperience || "n/a"}`,
      status: "new",
    });

    if (resend) {
      const adminMail = distributorApplicationAdminNotificationEmail({
        applicantName: parsedInput.name,
        applicantEmail: parsedInput.email,
        applicantPhone: parsedInput.phone,
        packageLine,
        whyJoin: parsedInput.whyJoin,
        salesExperience: parsedInput.salesExperience,
      });
      const applicantMail = distributorApplicationConfirmationEmail({
        applicantName: parsedInput.name,
        packageLine,
        siteUrl: getPublicAppUrl(),
      });

      await Promise.all([
        sendEmailSafe({
          to: [adminEmail],
          subject: adminMail.subject,
          html: adminMail.html,
          text: adminMail.text,
          context: "distributor-lead-admin",
        }),
        sendEmailSafe({
          to: [parsedInput.email],
          subject: applicantMail.subject,
          html: applicantMail.html,
          text: applicantMail.text,
          context: "distributor-lead-applicant",
        }),
      ]);
    }
    revalidatePath("/admin/distributors");
    return { success: true };
  });

export const createCheckoutSession = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput }: { parsedInput: z.infer<typeof checkoutSchema> }) => {
    const enrichedItems = parsedInput.items.map((item) => {
      const product = products.find((p) => p.slug === item.itemSlug);
      if (!product) throw new Error(`Product not found: ${item.itemSlug}`);
      return {
        slug: product.slug,
        title: product.shortTitle,
        quantity: item.quantity,
        unitPrice: product.price,
        total: item.quantity * product.price,
      };
    });

    const amount = enrichedItems.reduce((sum, item) => sum + item.total, 0);
    const ref = `BGS-${Date.now()}`;
    const supabase = requireAdminDb();

    const gateway = moolreConfigured()
      ? "moolre"
      : process.env.PAYSTACK_SECRET_KEY
        ? "paystack"
        : "manual";

    const insertPayload = {
      payment_reference: ref,
      payment_gateway: gateway,
      customer_name: parsedInput.customerName,
      customer_email: parsedInput.customerEmail,
      customer_phone: parsedInput.customerPhone,
      total_amount: amount,
      status: "pending",
      items: enrichedItems,
      distributor_referral_code: parsedInput.distributorCode || null,
    };

    const { error } = await supabase.from("orders").insert(insertPayload);
    if (error) {
      // Backward compatibility for pre-migration databases.
      await supabase.from("orders").insert({
        customer_name: parsedInput.customerName,
        customer_email: parsedInput.customerEmail,
        customer_phone: parsedInput.customerPhone,
        total_amount: amount,
        status: "pending",
        items: enrichedItems,
        distributor_referral_code: parsedInput.distributorCode || null,
      });
    }

    const appUrl = getPublicAppUrl();
    let checkoutUrl = `/cart/success?reference=${ref}`;

    if (moolreConfigured()) {
      const moolre = await initiateMoolrePayment({
        amountGhs: amount,
        email: parsedInput.customerEmail,
        reference: ref,
        callbackUrl: `${appUrl}/api/moolre/webhook`,
        redirectUrl: `${appUrl}/cart/success?reference=${ref}`,
        description: `Benizer Green Shop — ${enrichedItems.map((i) => i.title).join(", ")}`,
        metadata: {
          customer_name: parsedInput.customerName,
          customer_phone: parsedInput.customerPhone,
          distributor_code: parsedInput.distributorCode ?? "",
          items: enrichedItems,
        },
      });
      if ("error" in moolre) {
        throw new Error(moolre.error);
      }
      checkoutUrl = moolre.authorizationUrl;
    } else if (process.env.PAYSTACK_SECRET_KEY) {
      const initializeResponse = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: parsedInput.customerEmail,
            amount: Math.round(amount * 100),
            reference: ref,
            currency: "GHS",
            callback_url: `${appUrl}/cart/success?reference=${ref}`,
            metadata: {
              customer_name: parsedInput.customerName,
              customer_phone: parsedInput.customerPhone,
              distributor_code: parsedInput.distributorCode,
              items: enrichedItems,
            },
          }),
        },
      );

      if (initializeResponse.ok) {
        const payload = await initializeResponse.json();
        checkoutUrl = payload?.data?.authorization_url || checkoutUrl;
      }
    }

    const customerMail = orderCheckoutConfirmationEmail({
      customerName: parsedInput.customerName,
      reference: ref,
      amountGhs: amount,
      items: enrichedItems,
      checkoutUrl,
      appUrl,
    });
    await sendEmailSafe({
      to: [parsedInput.customerEmail],
      subject: customerMail.subject,
      html: customerMail.html,
      text: customerMail.text,
      context: "checkout-customer",
    });

    return {
      success: true,
      checkoutUrl,
      reference: ref,
      amount,
      items: enrichedItems,
      whatsappMessage: "Hello! I'm interested in your health supplements.",
      whatsappLink: `https://wa.me/${siteConfig.whatsappAi.replace("+", "")}`,
    };
  });
