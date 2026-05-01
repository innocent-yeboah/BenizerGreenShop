import { z } from "zod";
import { distributorPackageTiers } from "@/lib/site-data";

export const productLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  productInterest: z.string().min(2),
  preferredContact: z.enum(["phone", "email", "whatsapp"]),
  message: z.string().min(6),
});

export const distributorLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  packageTier: z.enum(distributorPackageTiers),
  salesExperience: z.string().optional(),
  whyJoin: z.string().min(10),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  items: z
    .array(
      z.object({
        itemSlug: z.string().min(2),
        quantity: z.number().int().positive().max(10),
      }),
    )
    .min(1),
  distributorCode: z.string().optional(),
});

export const orderLookupSchema = z.object({
  reference: z.string().min(4, "Enter your order reference."),
  email: z.string().email("Enter the email used at checkout."),
});
