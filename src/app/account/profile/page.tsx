import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserWithRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function AccountProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-brand-charcoal/80">
        Connect Supabase to manage profile details.
      </p>
    );
  }

  const current = await getCurrentUserWithRole();
  if (!current?.user) {
    redirect("/auth/sign-in?next=/account/profile");
  }

  return (
    <section className="surface-card rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-brand-green-dark">Your profile</h2>
      <p className="mt-2 text-sm text-brand-charcoal/72">
        The name below appears in greetings across your signed-in journey.
      </p>
      <div className="mt-8">
        <ProfileForm initialFullName={current.fullName ?? ""} email={current.user.email ?? ""} />
      </div>
    </section>
  );
}
