import type { Metadata } from "next";

/**
 * Clamp for meta descriptions (search snippets). Google often shows ~150–160 characters.
 */
export function clampMetaDescription(text: string, max = 158): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

export const seoKeywords = [
  "Benizer Green Shop",
  "Benizer Green Shop Ghana",
  "benizergreenshop.com",
  "organic supplements Ghana",
  "organic supplements",
  "natural wellness",
  "Ghana health supplements",
  "wellness distributor Ghana",
  "wellness distributor",
  "premium supplements",
  "buy supplements online Ghana",
  "Miira Cell",
  "MiiraCare",
  "MiiraCoffee",
  "organic nutrition",
  "supplements Ghana",
  "Ayurvedic wellness Ghana",
  "cellular health supplements",
];

/** Shared dimensions for `opengraph-image` and `twitter-image` routes (Next.js OG). */
export const OG_SHARE_SIZE = { width: 1200, height: 630 } as const;

/** Keep generated share images readable (long site descriptions wrap poorly). */
export function truncateForOgImage(text: string, maxChars: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  return `${t.slice(0, maxChars - 1).trim()}…`;
}

export function homeMetaDescription(siteName: string): string {
  return clampMetaDescription(
    `${siteName} — authentic MiiraCare organic supplements & functional coffee across Ghana. ` +
      "Shop curated wellness formulas or partner as a distributor with nationwide fulfilment.",
  );
}

export function noIndexFollow(): NonNullable<Metadata["robots"]> {
  return { index: false, follow: true };
}
