import type { Metadata } from "next";
import Link from "next/link";
import { signInAction } from "@/app/auth/actions";
import {
  AuthBrandAside,
  AuthBrandLead,
  AuthBrandSupport,
  AuthMobileBrandMark,
  AuthShellMain,
} from "@/components/auth-brand-aside";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in for ${siteConfig.name} shoppers, distributors, and administrators.`,
};

function signInErrorMessage(raw: string | undefined) {
  if (!raw) return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    decoded = raw;
  }
  if (/invalid path specified in request url/i.test(decoded)) {
    return (
      <>
        <p className="font-semibold text-red-950">Sign-in request was rejected by Supabase.</p>
        <p className="mt-2 text-sm leading-relaxed text-red-900/90">
          Most often this is a <strong>project URL</strong> mistake on the server: use only your Project URL like{" "}
          <span className="font-mono text-[0.8rem]">https://&lt;ref&gt;.supabase.co</span> — do not append{" "}
          <span className="font-mono text-[0.8rem]">/auth/v1</span>. Check Vercel → Environment Variables, redeploy, and in
          Supabase → Authentication → URL Configuration add your production URL (e.g.{" "}
          <span className="font-mono text-[0.8rem]">https://your-site.vercel.app</span>) to Site URL / Redirect URLs.
        </p>
      </>
    );
  }
  if (/invalid login credentials/i.test(decoded)) {
    return (
      <>
        <p className="font-semibold text-red-950">We couldn&apos;t verify your sign-in.</p>
        <p className="mt-2 text-sm leading-relaxed text-red-900/90">
          Check your email and password, then try again. If you&apos;ve forgotten your password,{" "}
          <Link
            href="/auth/forgot-password"
            className="font-semibold text-red-950 underline decoration-red-900/30 underline-offset-2 hover:decoration-red-950"
          >
            reset it here
          </Link>
          .
        </p>
      </>
    );
  }
  return decoded;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; notice?: string }>;
}) {
  const { next, error, notice } = await searchParams;
  const passwordUpdated = notice === "password_updated";

  return (
    <main className="flex flex-1 flex-col lg:grid lg:min-h-[calc(100svh-9rem)] lg:grid-cols-2 xl:grid-cols-[1.05fr_min(32rem,1fr)]">
      <AuthBrandAside>
        <AuthBrandLead>Trusted wellness for shoppers and professional tools for partners.</AuthBrandLead>
        <AuthBrandSupport>
          Sign in with your shopper account or partner credentials—your session stays encrypted across the storefront,
          dashboards, and account portal.
        </AuthBrandSupport>
      </AuthBrandAside>

      <AuthShellMain>
        <div className="w-full max-w-[440px]">
          <AuthMobileBrandMark />

          <div className="rounded-2xl border border-brand-charcoal/[0.07] bg-white/95 p-8 shadow-[0_32px_64px_-28px_rgba(13,59,15,0.22)] backdrop-blur-sm sm:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-charcoal/45">
              Secure access
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-brand-green-dark sm:text-[2rem]">
              Welcome back
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
              Shoppers unlock order history inside{" "}
              <Link href="/account" prefetch={false} className="font-semibold text-brand-green hover:text-brand-green-dark">
                My account
              </Link>
              . Partners and admins continue straight to secure dashboards.
            </p>

            {passwordUpdated ? (
              <div
                className="mt-6 rounded-xl border border-brand-green/20 bg-brand-green/6 px-4 py-3.5 text-sm text-brand-green-dark"
                role="status"
              >
                Your password was updated. Sign in with your new credentials.
              </div>
            ) : null}

            {error ? (
              <div
                className="mt-6 rounded-xl border border-red-200/90 bg-red-50/90 px-4 py-3.5 text-sm text-red-900"
                role="alert"
              >
                {signInErrorMessage(error)}
              </div>
            ) : null}

            <form action={signInAction} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="signin-email" className="block text-sm font-medium text-brand-charcoal">
                  Email address
                </label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-brand-charcoal/35 focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor="signin-password" className="block text-sm font-medium text-brand-charcoal">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-brand-green hover:text-brand-green-dark"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="signin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-brand-charcoal/35 focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
                  placeholder="Enter your password"
                />
              </div>
              {next ? <input name="next" type="hidden" value={next} /> : null}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-green px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-green/15 outline-none transition-[background-color,box-shadow] hover:bg-brand-green-dark focus-visible:ring-4 focus-visible:ring-brand-green/25"
              >
                Sign in
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-brand-charcoal/50">
            New shopper?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-brand-green hover:text-brand-green-dark">
              Create an account
            </Link>
            <span aria-hidden className="text-brand-charcoal/25">
              {" "}
              ·{" "}
            </span>
            <Link href="/" className="font-medium text-brand-charcoal/60 hover:text-brand-green-dark">
              Back to store
            </Link>
          </p>
        </div>
      </AuthShellMain>
    </main>
  );
}
