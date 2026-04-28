import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/auth/actions";
import { AuthBrandAside, AuthBrandLead, AuthMobileBrandMark, AuthShellMain } from "@/components/auth-brand-aside";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Forgot password",
  description: `Reset your ${siteConfig.name} account password.`,
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;
  const isSent = sent === "1";

  return (
    <main className="flex flex-1 flex-col lg:grid lg:min-h-[calc(100svh-9rem)] lg:grid-cols-2 xl:grid-cols-[1.05fr_min(32rem,1fr)]">
      <AuthBrandAside>
        <AuthBrandLead>
          Account security is a priority. We&apos;ll email you a single-use link to choose a new password.
        </AuthBrandLead>
      </AuthBrandAside>

      <AuthShellMain>
        <div className="w-full max-w-[440px]">
          <AuthMobileBrandMark />

          <div className="rounded-2xl border border-brand-charcoal/[0.07] bg-white/95 p-8 shadow-[0_32px_64px_-28px_rgba(13,59,15,0.22)] backdrop-blur-sm sm:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-charcoal/45">
              Password recovery
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-green-dark sm:text-[2rem]">
              Reset your password
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
              Enter the email associated with your account. If it matches an active profile, you&apos;ll receive
              instructions within a few minutes.
            </p>

            {error === "missing_email" ? (
              <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950" role="alert">
                Please enter a valid email address.
              </p>
            ) : null}

            {isSent ? (
              <div
                className="mt-6 rounded-xl border border-brand-green/20 bg-brand-green/6 px-4 py-3.5 text-sm text-brand-green-dark"
                role="status"
              >
                <p className="font-semibold">Check your inbox</p>
                <p className="mt-2 leading-relaxed text-brand-charcoal/80">
                  If an account exists for that email, we&apos;ve sent a secure link to reset your password. The link
                  expires after a short time for your protection.
                </p>
              </div>
            ) : null}

            {!isSent ? (
              <form action={requestPasswordResetAction} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="block text-sm font-medium text-brand-charcoal">
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-brand-charcoal/35 focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
                    placeholder="name@company.com"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-brand-green px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-green/15 outline-none transition-[background-color,box-shadow] hover:bg-brand-green-dark focus-visible:ring-4 focus-visible:ring-brand-green/25"
                >
                  Send reset link
                </button>
              </form>
            ) : (
              <p className="mt-8 text-center">
                <Link
                  href="/auth/sign-in"
                  className="text-sm font-semibold text-brand-green hover:text-brand-green-dark"
                >
                  Return to sign in
                </Link>
              </p>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-brand-charcoal/50">
            <Link href="/auth/sign-in" className="font-medium text-brand-green hover:text-brand-green-dark">
              ← Back to sign in
            </Link>
            <span className="mx-2 text-brand-charcoal/30">·</span>
            <Link href="/" className="font-medium text-brand-green hover:text-brand-green-dark">
              Store home
            </Link>
          </p>
        </div>
      </AuthShellMain>
    </main>
  );
}
