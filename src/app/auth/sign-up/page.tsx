import type { Metadata } from "next";
import Link from "next/link";
import { signUpAction } from "@/app/auth/actions";
import {
  AuthBrandAside,
  AuthBrandLead,
  AuthBrandSupport,
  AuthMobileBrandMark,
  AuthShellMain,
} from "@/components/auth-brand-aside";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Create account",
  description: `Create your ${siteConfig.name} shopper account to track purchases and updates.`,
};

function signUpErrorMessage(raw: string | undefined) {
  if (!raw) return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    decoded = raw;
  }
  if (/password/i.test(decoded) && /short|least|characters/i.test(decoded)) {
    return "Use at least eight characters for your password.";
  }
  return decoded;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;
  const awaitingEmail = notice === "confirm_email";

  return (
    <main className="flex flex-1 flex-col lg:grid lg:min-h-[calc(100svh-9rem)] lg:grid-cols-2 xl:grid-cols-[1.05fr_min(32rem,1fr)]">
      <AuthBrandAside>
        <AuthBrandLead>Save your wellness journey.</AuthBrandLead>
        <AuthBrandSupport>
          A customer account unlocks linked order history, profile personalization, and a faster experience when we add
          more tools.
        </AuthBrandSupport>
      </AuthBrandAside>

      <AuthShellMain>
        <div className="w-full max-w-[440px]">
          <AuthMobileBrandMark />

          <div className="rounded-2xl border border-brand-charcoal/[0.07] bg-white/95 p-8 shadow-[0_32px_64px_-28px_rgba(13,59,15,0.22)] backdrop-blur-sm sm:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-charcoal/45">
              New shopper account
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-green-dark sm:text-[2rem]">
              Join {siteConfig.name}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
              Create credentials you&apos;ll reuse at checkout—use the same email when you buy so purchases save to your
              account.
            </p>

            {awaitingEmail ? (
              <div
                className="mt-6 rounded-xl border border-brand-green/22 bg-brand-green/8 px-4 py-3.5 text-sm text-brand-green-dark"
                role="status"
              >
                Check your inbox to confirm your email. After verifying,{" "}
                <Link href="/auth/sign-in" className="font-semibold underline-offset-4 hover:underline">
                  sign in here
                </Link>
                .
              </div>
            ) : null}

            {error ? (
              <div
                className="mt-6 rounded-xl border border-red-200/90 bg-red-50/90 px-4 py-3.5 text-sm text-red-900"
                role="alert"
              >
                {signUpErrorMessage(error)}
              </div>
            ) : null}

            <form action={signUpAction} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="block text-sm font-medium text-brand-charcoal">
                  Full name
                </label>
                <input
                  id="signup-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-brand-charcoal/35 focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
                  placeholder="As it should appear on receipts"
                  minLength={2}
                  maxLength={120}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-email" className="block text-sm font-medium text-brand-charcoal">
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-brand-charcoal/35 focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
                  placeholder="You will use this to sign in"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-password" className="block text-sm font-medium text-brand-charcoal">
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-brand-charcoal/35 focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
                  placeholder="At least eight characters"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-green px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-green/15 outline-none transition-[background-color,box-shadow] hover:bg-brand-green-dark focus-visible:ring-4 focus-visible:ring-brand-green/25"
              >
                Create account
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-brand-charcoal/50">
            Already registered?{" "}
            <Link href="/auth/sign-in" className="font-semibold text-brand-green hover:text-brand-green-dark">
              Sign in
            </Link>{" "}
            ·{" "}
            <Link href="/" className="font-medium text-brand-charcoal/60 hover:text-brand-green-dark">
              Back to store
            </Link>
          </p>
        </div>
      </AuthShellMain>
    </main>
  );
}
