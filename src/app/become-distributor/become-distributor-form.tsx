"use client";

import { useState } from "react";
import { submitDistributorLead } from "@/app/actions";
import { distributorPackages, type DistributorPackageTier } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";

export function BecomeDistributorForm() {
  const [message, setMessage] = useState("");

  return (
    <section id="apply" className="scroll-mt-28">
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
          setMessage(
            result?.data?.success ? "Application submitted. We will contact you shortly." : "Unable to submit application.",
          );
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
                const qtyLabel = p.quantityNote ?? `${p.boxes} ${p.boxes === 1 ? "box" : "boxes"}`;
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
          <button type="submit" className="btn-primary w-full rounded-lg px-4 py-3">
            Submit Application
          </button>
          {message ? <p className="text-sm text-brand-green">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}
