import { getPublicAppUrl } from "@/lib/app-url";
import { siteConfig } from "@/lib/site-data";

/** Organization + WebSite schema for richer search results */
export function SeoJsonLd() {
  const url = getPublicAppUrl().replace(/\/$/, "");
  const phone = siteConfig.whatsappAi.startsWith("+")
    ? siteConfig.whatsappAi
    : `+${siteConfig.whatsappAi}`;

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: siteConfig.name,
      url,
      logo: `${url}/benizer-logo.svg`,
      image: `${url}/benizer-logo.svg`,
      slogan: siteConfig.tagline,
      description: siteConfig.description,
      email: siteConfig.email,
      telephone: phone,
      areaServed: { "@type": "Country", name: "Ghana" },
      sameAs: [
        siteConfig.social.facebook,
        siteConfig.social.instagram,
        siteConfig.social.tiktok,
      ].filter(Boolean),
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          areaServed: "GH",
          availableLanguage: ["English"],
          telephone: phone,
          email: siteConfig.email,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${url}/#website`,
      name: siteConfig.name,
      url,
      description: siteConfig.description,
      publisher: { "@id": `${url}/#organization` },
      inLanguage: "en-GH",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${url}/products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
