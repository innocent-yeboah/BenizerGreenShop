"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useId } from "react";

export function InlineMobileProductSearch() {
  const router = useRouter();
  const id = useId();

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") || "").trim();
        router.push(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      }}
    >
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          name="q"
          type="search"
          placeholder="Search products..."
          enterKeyHint="search"
          className="min-w-0 flex-1 rounded-xl border border-brand-green/22 bg-white px-3 py-2.5 text-sm text-brand-charcoal shadow-inner outline-none focus:border-brand-green/45 focus:ring-2 focus:ring-brand-green/15"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <button
          type="submit"
          aria-label="Search"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-dark text-white shadow-sm hover:bg-brand-green"
        >
          <Search className="size-5" aria-hidden strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
