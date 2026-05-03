"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateCustomerProfileSchema } from "@/lib/schemas";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

export const updateCustomerProfileAction = actionClient
  .schema(updateCustomerProfileSchema)
  .action(async ({ parsedInput }: { parsedInput: z.infer<typeof updateCustomerProfileSchema> }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Sign in again to continue.");

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: parsedInput.fullName })
      .eq("id", user.id);

    if (error) throw new Error(error.message);

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return { ok: true as const };
  });
