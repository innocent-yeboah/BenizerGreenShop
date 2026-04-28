"use server";

import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import {
  checkoutSchema,
  distributorLeadSchema,
  productLeadSchema,
} from "@/lib/schemas";
import { initiateMoolrePayment, moolreConfigured } from "@/lib/moolre/initiate-payment";
import { distributorPackages, products, siteConfig } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const adminEmail = process.env.ADMIN_EMAIL || siteConfig.email;

export const submitProductLead = actionClient
  .schema(productLeadSchema)
  .action(async ({ parsedInput }) => {
    const supabase = createAdminClient();
    if (supabase) {
      await supabase.from("leads").insert({
        name: parsedInput.name,
        email: parsedInput.email,
        phone: parsedInput.phone,
        type: "buyer",
        product_interest: parsedInput.productInterest,
        message: `${parsedInput.message} (preferred: ${parsedInput.preferredContact})`,
        status: "new",
      });
    }

    if (resend) {
      await resend.emails.send({
        from: "Benizer Leads <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New Product Lead: ${parsedInput.productInterest}`,
        html: `<p>${parsedInput.name} submitted a buyer lead.</p><p>${parsedInput.email} / ${parsedInput.phone}</p>`,
      });
    }
    revalidatePath("/admin/leads");
    return { success: true };
  });

export const submitDistributorLead = actionClient
  .schema(distributorLeadSchema)
  .action(async ({ parsedInput }) => {
    const pkg = distributorPackages.find((p) => p.tier === parsedInput.packageTier);
    const packageLine = pkg
      ? `${pkg.name} (${currencyFormatter.format(pkg.price)})`
      : parsedInput.packageTier;

    const supabase = createAdminClient();
    if (supabase) {
      await supabase.from("leads").insert({
        name: parsedInput.name,
        email: parsedInput.email,
        phone: parsedInput.phone,
        type: "distributor",
        message: `Preferred package: ${packageLine}. Why join: ${parsedInput.whyJoin}. Sales exp: ${parsedInput.salesExperience || "n/a"}`,
        status: "new",
      });
    }

    if (resend) {
      await resend.emails.send({
        from: "Benizer Distributors <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New Distributor Application — ${packageLine}`,
        html: `<p>${parsedInput.name} applied for <strong>${packageLine}</strong>.</p><p>${parsedInput.email} / ${parsedInput.phone}</p><p>Why join: ${parsedInput.whyJoin}</p>`,
      });
    }
    revalidatePath("/admin/distributors");
    return { success: true };
  });

export const createCheckoutSession = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput }) => {
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
    const supabase = createAdminClient();

    const gateway = moolreConfigured()
      ? "moolre"
      : process.env.PAYSTACK_SECRET_KEY
        ? "paystack"
        : "manual";

    if (supabase) {
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
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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

    if (resend) {
      await resend.emails.send({
        from: "Benizer Orders <onboarding@resend.dev>",
        to: [parsedInput.customerEmail],
        subject: "Order initiated - Benizer Green Shop",
        html: `<p>Your order reference is <strong>${ref}</strong>.</p><p>Total: GHS ${amount}</p>`,
      });
    }

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
