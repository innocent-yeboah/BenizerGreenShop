import { getPublicAppUrl } from "@/lib/app-url";
import { siteConfig } from "@/lib/site-data";

/** Organization + WebSite + OnlineStore — supports rich snippets and Merchant knowledge panels. */
export function SeoJsonLd() {
  const url = getPublicAppUrl().replace(/\/$/, "");
  const phone = siteConfig.whatsappAi.startsWith("+")
    ? siteConfig.whatsappAi
    : `+${siteConfig.whatsappAi}`;

  const logoUrl = `${url}/branding/benizer-seal.png`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: siteConfig.name,
    alternateName: ["Benizer", "Benizer Green Shop Ghana"],
    url,
    logo: { "@type": "ImageObject", url: logoUrl },
    image: logoUrl,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "GH",
    },
    knowsAbout: [
      "Organic supplements",
      "Cellular wellness",
      "Premium functional coffee",
      "Ghana ecommerce health products",
      "Authorized MiiraCare retailer",
      "Independent distributor fulfilment",
    ],
    areaServed: [{ "@type": "Country", name: "Ghana" }],
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.tiktok,
    ].filter(Boolean),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        areaServed: "GH",
        availableLanguage: ["English"],
        telephone: phone,
        email: siteConfig.email,
        url: `${url}/contact`,
      },
    ],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: siteConfig.name,
    url,
    description: siteConfig.description,
    inLanguage: "en-GH",
    publisher: { "@id": `${url}/#organization` },
    isPartOf: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const onlineStore = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${url}/#store`,
    name: `${siteConfig.name} — official shop`,
    url,
    description: siteConfig.description,
    currenciesAccepted: "GHS",
    seller: { "@id": `${url}/#organization` },
    parentOrganization: { "@id": `${url}/#organization` },
    areaServed: "GH",
  };

  const graph = [organization, webSite, onlineStore];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
