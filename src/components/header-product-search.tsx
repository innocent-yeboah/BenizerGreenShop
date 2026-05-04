"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

/** Minimal magnifying-glass control — expands to product search (matches storefront header icons). */
export function HeaderProductSearch() {
  const router = useRouter();
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      >
        <Search className="size-[22px]" strokeWidth={1.5} aria-hidden />
        <span className="sr-only">{open ? "Close search" : "Search products"}</span>
      </button>

      {open ? (
        <div
          id={`${id}-panel`}
          className="absolute right-0 top-full z-60 mt-2 w-[min(calc(100vw-2rem),22rem)] rounded-xl border border-neutral-200 bg-white p-3 shadow-lg shadow-black/10"
        >
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const q = String(new FormData(e.currentTarget).get("q") || "").trim();
              setOpen(false);
              router.push(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
            }}
          >
            <label htmlFor={`${id}-q`} className="sr-only">
              Search products
            </label>
            <input
              id={`${id}-q`}
              name="q"
              type="search"
              placeholder="Search products…"
              enterKeyHint="search"
              autoCapitalize="off"
              autoCorrect="off"
              autoFocus
              className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
            >
              <Search className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
