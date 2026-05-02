import { getPublicAppUrl } from "@/lib/app-url";
import { siteConfig, type Product } from "@/lib/site-data";

export function ProductJsonLd({ product }: { product: Product }) {
  const base = getPublicAppUrl().replace(/\/$/, "");
  const pageUrl = `${base}/products/${product.slug}`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((src) => (src.startsWith("http") ? src : `${base}${src}`)),
    description: [product.shortBenefit, product.tagline].join(" · "),
    sku: product.slug,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "GHS",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
