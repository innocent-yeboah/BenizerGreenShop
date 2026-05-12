import { getPublicAppUrl } from "@/lib/app-url";

type Crumb = { name: string; path: string };

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const base = getPublicAppUrl().replace(/\/$/, "");
  const structured = items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${base}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
  }));

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: structured,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
  );
}
