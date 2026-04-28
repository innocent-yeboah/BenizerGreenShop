import type { ReactNode } from "react";
import Link from "next/link";

export function AuthBrandAside({ children }: { children: ReactNode }) {
  return (
    <aside className="relative hidden overflow-hidden bg-linear-to-br from-brand-green-dark via-brand-green to-[#153018] lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-14 xl:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_-10%,rgba(255,236,179,0.18),transparent_55%)]" />
      <div className="relative">
        <Link
          href="/"
          className="inline-flex text-sm font-semibold text-white/85 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-brand-gold-light/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-green-dark"
        >
          ← Return to store
        </Link>
        <div className="mt-12 max-w-md space-y-6">{children}</div>
      </div>
      <p className="relative text-xs text-white/40">© {new Date().getFullYear()}</p>
    </aside>
  );
}

export function AuthBrandLead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`font-accent text-2xl leading-snug text-white/95 xl:text-[1.65rem] xl:leading-snug ${className}`}
    >
      {children}
    </p>
  );
}

export function AuthBrandSupport({ children }: { children: ReactNode }) {
  return <p className="max-w-sm text-sm leading-relaxed text-white/70">{children}</p>;
}

export function AuthMobileBrandMark() {
  return (
    <div className="mb-8 lg:hidden">
      <Link
        href="/"
        className="inline-flex text-sm font-semibold text-brand-green hover:text-brand-green-dark"
      >
        ← Return to store
      </Link>
    </div>
  );
}

export function AuthShellMain({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-b from-[#fafbf9] via-white to-brand-cream/15 px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
      {children}
    </div>
  );
}
