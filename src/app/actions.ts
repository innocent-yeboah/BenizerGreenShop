"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import {
  checkoutSchema,
  distributorLeadSchema,
  orderLookupSchema,
  productLeadSchema,
} from "@/lib/schemas";
import { initiateMoolrePayment, moolreConfigured } from "@/lib/moolre/initiate-payment";
import { getPublicAppUrl } from "@/lib/app-url";
import { distributorPackages, products, siteConfig } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  distributorApplicationAdminNotificationEmail,
  distributorApplicationConfirmationEmail,
  orderCheckoutConfirmationEmail,
} from "@/lib/email-templates";
import { parseOrderItemsJson } from "@/lib/order-email-notify";
import { getTransactionalAdminEmail, sendTransactionalEmail } from "@/lib/transactional-email";

const adminEmail = getTransactionalAdminEmail();

function requireAdminDb() {
  const supabase = createAdminClient();
  if (!supabase) {
    throw new Error(
      "Supabase service role is missing. Set SUPABASE_SERVICE_ROLE_KEY on Vercel (Production + Preview) to store leads and orders.",
    );
  }
  return supabase;
}

export const lookupOrder = actionClient
  .schema(orderLookupSchema)
  .action(async ({ parsedInput }: { parsedInput: z.infer<typeof orderLookupSchema> }) => {
    const supabase = requireAdminDb();
    const ref = parsedInput.reference.trim();
    const email = parsedInput.email.trim().toLowerCase();
    const { data: order, error } = await supabase
      .from("orders")
      .select("payment_reference,status,customer_name,total_amount,items,created_at,payment_gateway")
      .eq("payment_reference", ref)
      .ilike("customer_email", email)
      .maybeSingle();

    if (error || !order?.payment_reference) {
      return { found: false as const };
    }

    const items = parseOrderItemsJson(order.items);
    return {
      found: true as const,
      order: {
        reference: order.payment_reference as string,
        status: order.status as string,
        customerName: String(order.customer_name ?? ""),
        totalAmount: Number(order.total_amount ?? 0),
        items,
        createdAt: order.created_at as string,
        paymentGateway: (order.payment_gateway as string | null) ?? null,
      },
    };
  });

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

    await sendTransactionalEmail({
      to: [adminEmail.trim().toLowerCase()],
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
      sendTransactionalEmail({
        to: [adminEmail.trim().toLowerCase()],
        subject: adminMail.subject,
        html: adminMail.html,
        text: adminMail.text,
        context: "distributor-lead-admin",
      }),
      sendTransactionalEmail({
        to: [parsedInput.email.trim().toLowerCase()],
        subject: applicantMail.subject,
        html: applicantMail.html,
        text: applicantMail.text,
        context: "distributor-lead-applicant",
      }),
    ]);
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

    let customerUserId: string | undefined;
    if (isSupabaseConfigured()) {
      try {
        const userClient = await createClient();
        const {
          data: { user },
        } = await userClient.auth.getUser();
        const emailCheckout = parsedInput.customerEmail.trim().toLowerCase();
        if (
          user?.id &&
          user.email &&
          user.email.toLowerCase() === emailCheckout
        ) {
          customerUserId = user.id;
        }
      } catch {
        // Checkout must work when session lookup fails or cookies are unreadable server-side.
      }
    }

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
      ...(customerUserId ? { user_id: customerUserId } : {}),
    };

    let { error } = await supabase.from("orders").insert(insertPayload);

    if (error?.message && customerUserId && /user_id/i.test(error.message)) {
      const { user_id, ...withoutUserLink } = insertPayload;
      void user_id;
      ({ error } = await supabase.from("orders").insert(withoutUserLink));
    }

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
    await sendTransactionalEmail({
      to: [parsedInput.customerEmail.trim().toLowerCase()],
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
