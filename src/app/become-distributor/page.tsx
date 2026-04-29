"use client";

import { useState } from "react";
import { submitDistributorLead } from "@/app/actions";
import { distributorPackages, type DistributorPackageTier } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";

export default function BecomeDistributorPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="container-shell py-14">
      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
            Transform Your Future
          </p>
          <h1 className="mt-2 text-4xl font-bold text-brand-green-dark">
            Become A Registered Distributor
          </h1>
          <p className="mt-3 text-brand-charcoal/80">
            Build recurring income with premium wellness products, flexible sales
            channels, and structured training support.
          </p>
          <ul className="mt-6 space-y-2 rounded-2xl border border-brand-green/15 bg-white p-5 text-sm shadow-sm">
            <li>- Earn commissions on personal sales</li>
            <li>- Get a unique referral code and link</li>
            <li>- Access ready-to-use marketing resources</li>
          </ul>
        </div>
        <form
          className="rounded-2xl border border-brand-green/20 bg-white p-6 shadow-sm"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const result = await submitDistributorLead({
              name: String(formData.get("name") || ""),
              email: String(formData.get("email") || ""),
              phone: String(formData.get("phone") || ""),
              packageTier: String(formData.get("packageTier") || "") as DistributorPackageTier,
              salesExperience: String(formData.get("salesExperience") || ""),
              whyJoin: String(formData.get("whyJoin") || ""),
            });
            setMessage(result?.data?.success ? "Application submitted. We will contact you shortly." : "Unable to submit application.");
          }}
        >
          <h2 className="text-xl font-bold text-brand-green-dark">Distributor Application</h2>
          <div className="mt-4 space-y-3">
            <input name="name" placeholder="Full name" className="w-full rounded-lg border border-brand-green/20 p-3" required />
            <input name="email" type="email" placeholder="Email" className="w-full rounded-lg border border-brand-green/20 p-3" required />
            <input name="phone" placeholder="Phone" className="w-full rounded-lg border border-brand-green/20 p-3" required />
            <div>
              <label htmlFor="packageTier" className="mb-1.5 block text-sm font-medium text-brand-charcoal">
                Preferred distributor package
              </label>
              <select
                id="packageTier"
                name="packageTier"
                required
                defaultValue=""
                className="w-full rounded-lg border border-brand-green/20 bg-white p-3 text-sm text-brand-charcoal"
              >
                <option value="" disabled>
                  Select a package
                </option>
                {distributorPackages.map((p) => {
                  const qtyLabel =
                    p.quantityNote ?? `${p.boxes} ${p.boxes === 1 ? "box" : "boxes"}`;
                  return (
                  <option key={p.tier} value={p.tier}>
                    {p.name} — {currencyFormatter.format(p.price)} (~${p.usdApprox}) · {qtyLabel} · {p.pv} PV
                  </option>
                  );
                })}
              </select>
            </div>
            <input name="salesExperience" placeholder="Sales experience (optional)" className="w-full rounded-lg border border-brand-green/20 p-3" />
            <textarea name="whyJoin" placeholder="Why do you want to join?" className="w-full rounded-lg border border-brand-green/20 p-3" rows={4} required />
            <button className="btn-primary w-full rounded-lg px-4 py-3">
              Submit Application
            </button>
            {message ? <p className="text-sm text-brand-green">{message}</p> : null}
          </div>
        </form>
      </section>
    </main>
  );
}
