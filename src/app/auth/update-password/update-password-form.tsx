"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) {
        setReady(true);
      }
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
        setReady(true);
        setChecking(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const password = String(new FormData(form).get("password") || "");
    const confirm = String(new FormData(form).get("confirm") || "");

    if (password.length < 8) {
      setMessage("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/auth/sign-in?notice=password_updated");
    router.refresh();
  }

  if (checking) {
    return (
      <p className="text-sm text-brand-charcoal/70" role="status">
        Verifying your reset link…
      </p>
    );
  }

  if (!ready) {
    return (
      <div className="space-y-4 text-sm text-brand-charcoal/80">
        <p>This link is invalid or has expired. Request a new reset email to continue.</p>
        <Link href="/auth/forgot-password" className="inline-flex font-semibold text-brand-green hover:text-brand-green-dark">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label htmlFor="new-password" className="block text-sm font-medium text-brand-charcoal">
          New password
        </label>
        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-brand-charcoal/35 focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
          placeholder="At least 8 characters"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm-password" className="block text-sm font-medium text-brand-charcoal">
          Confirm password
        </label>
        <input
          id="confirm-password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-brand-charcoal/35 focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
          placeholder="Re-enter password"
        />
      </div>
      {message ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-brand-green px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-green/15 outline-none transition-[background-color,box-shadow] hover:bg-brand-green-dark focus-visible:ring-4 focus-visible:ring-brand-green/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
