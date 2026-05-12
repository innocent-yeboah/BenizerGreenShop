import { getPublicAppUrl } from "@/lib/app-url";
import { products, siteConfig } from "@/lib/site-data";

/** ItemList covering the public product catalogue (/products); supports catalog-style rich results hints. */
export function CatalogJsonLd() {
  const base = getPublicAppUrl().replace(/\/$/, "");

  const itemListElement = products.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: p.shortTitle,
    item: `${base}/products/${p.slug}`,
  }));

  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Wellness catalogue — ${siteConfig.name}`,
    description: clampPlainDescription(),
    url: `${base}/products`,
    numberOfItems: products.length,
    itemListElement,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
  );
}

function clampPlainDescription(): string {
  return `${siteConfig.name} curated wellness products with nationwide fulfilment.`.slice(0, 300);
}
