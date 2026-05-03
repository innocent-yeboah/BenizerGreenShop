import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Shield } from "lucide-react";
import { ProfileForm } from "./profile-form";
import { getCurrentUserWithRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function AccountProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-brand-charcoal/80">Connect Supabase to manage profile details.</p>
    );
  }

  const current = await getCurrentUserWithRole();
  if (!current?.user) {
    redirect("/auth/sign-in?next=/account/profile");
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-brand-green-dark md:text-3xl">
          Profile &amp; security
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-charcoal/70">
          Keep your display name current for a smoother checkout. Your sign-in email is managed by our auth provider.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-[0_18px_42px_-38px_rgba(13,59,15,0.4)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-brand-green/10 bg-brand-cream/25 px-6 py-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-green-dark shadow-sm ring-1 ring-brand-green/10">
            <Mail className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-bold text-brand-green-dark">Contact</h2>
            <p className="text-xs text-brand-charcoal/55">Shown on receipts and in your account greetings.</p>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <ProfileForm initialFullName={current.fullName ?? ""} email={current.user.email ?? ""} />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-[0_18px_42px_-38px_rgba(13,59,15,0.4)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-brand-green/10 bg-brand-cream/25 px-6 py-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-green-dark shadow-sm ring-1 ring-brand-green/10">
            <Shield className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-bold text-brand-green-dark">Password &amp; sign-in</h2>
            <p className="text-xs text-brand-charcoal/55">We never store your password in plain text.</p>
          </div>
        </div>
        <div className="space-y-5 p-6 md:p-8">
          <p className="max-w-xl text-sm leading-relaxed text-brand-charcoal/72">
            Request a secure link to choose a new password. It will be sent to{" "}
            <span className="font-medium">{current.user.email}</span>.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center justify-center rounded-full border border-brand-green-dark/25 bg-white px-6 py-3 text-sm font-semibold text-brand-green-dark shadow-sm transition-colors hover:border-brand-green/40 hover:bg-brand-cream/40"
            >
              Send reset link
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
