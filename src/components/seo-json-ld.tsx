import { getPublicAppUrl } from "@/lib/app-url";
import { siteConfig } from "@/lib/site-data";

/** Organization + WebSite schema for richer search results */
export function SeoJsonLd() {
  const url = getPublicAppUrl();

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url,
      logo: `${url}/benizer-logo.png`,
      description: siteConfig.description,
      email: siteConfig.email,
      sameAs: [siteConfig.social.tiktok].filter(Boolean),
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: siteConfig.email,
          telephone: siteConfig.whatsappDirect,
          availableLanguage: ["English"],
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url,
      description: siteConfig.description,
      publisher: { "@type": "Organization", name: siteConfig.name, url },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
