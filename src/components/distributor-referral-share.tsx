"use client";

import { useCallback, useState } from "react";

type Props = {
  referralUrl: string;
  referralCode: string;
};

export function DistributorReferralShare({ referralUrl, referralCode }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: textarea copy not worth extra UI for MVP */
    }
  }, [referralUrl]);

  return (
    <section className="surface-card mt-8 rounded-xl p-5 md:p-6">
      <h2 className="text-sm font-semibold text-brand-green-dark">Share your shop link</h2>
      <p className="mt-1 text-sm text-brand-charcoal/75">
        Customers who use this link have your code saved for{" "}
        <span className="whitespace-nowrap font-semibold">30 days</span> — it pre-fills at checkout.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="referral-share-url" className="sr-only">
          Referral link
        </label>
        <input
          id="referral-share-url"
          readOnly
          spellCheck={false}
          value={referralUrl}
          className="min-w-0 flex-1 rounded-lg border border-brand-green/25 bg-white px-3 py-2.5 font-mono text-sm text-brand-charcoal"
          onFocus={(event) => event.target.select()}
        />
        <button
          type="button"
          onClick={copy}
          className="btn-primary shrink-0 justify-center rounded-lg px-4 py-2.5 text-sm font-semibold"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      <p className="mt-3 text-xs text-brand-charcoal/55">
        Your referral code{" "}
        <span className="font-mono font-semibold text-brand-charcoal/80">{referralCode}</span> is baked
        into the URL as <span className="font-mono">?ref=</span>.
      </p>
    </section>
  );
}
