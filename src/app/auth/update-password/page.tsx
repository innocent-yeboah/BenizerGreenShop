import type { Metadata } from "next";
import Link from "next/link";
import { UpdatePasswordForm } from "@/app/auth/update-password/update-password-form";
import { AuthBrandAside, AuthBrandLead, AuthMobileBrandMark, AuthShellMain } from "@/components/auth-brand-aside";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Set new password",
  description: `Choose a new password for your ${siteConfig.name} account.`,
};

export default function UpdatePasswordPage() {
  return (
    <main className="flex flex-1 flex-col lg:grid lg:min-h-[calc(100svh-9rem)] lg:grid-cols-2 xl:grid-cols-[1.05fr_min(32rem,1fr)]">
      <AuthBrandAside>
        <AuthBrandLead>
          Choose a strong password you don&apos;t use elsewhere. You&apos;ll use it the next time you sign in.
        </AuthBrandLead>
      </AuthBrandAside>

      <AuthShellMain>
        <div className="w-full max-w-[440px]">
          <AuthMobileBrandMark />

          <div className="rounded-2xl border border-brand-charcoal/[0.07] bg-white/95 p-8 shadow-[0_32px_64px_-28px_rgba(13,59,15,0.22)] backdrop-blur-sm sm:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-charcoal/45">
              Security
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-green-dark sm:text-[2rem]">
              Create a new password
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
              For your protection, this page only works from the link in your email.
            </p>

            <UpdatePasswordForm />
          </div>

          <p className="mt-8 text-center text-sm text-brand-charcoal/50">
            <Link href="/auth/sign-in" className="font-medium text-brand-green hover:text-brand-green-dark">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </AuthShellMain>
    </main>
  );
}
