import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";
import { OG_SHARE_SIZE } from "@/lib/seo";

/**
 * Inner pages reuse the programmatic 1200×630 brand assets so Facebook, LinkedIn, X/Twitter,
 * and WhatsApp show a consistent preview (not only the favicon zone).
 */
export function defaultSocialCardMetadata(input: {
  path: string;
  /** HTML <title> / tab title stem (often short). */
  title: string;
  description: string;
  /** Larger headline on the share card — defaults to `title`. */
  ogTitle?: string;
  /** Image alt — defaults from titles. */
  imageAlt?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const ogTitle = input.ogTitle ?? `${input.title} · ${siteConfig.name}`;
  const imageAlt =
    input.imageAlt ?? `${input.title} — ${siteConfig.name} organic wellness`;

  const images = [
    {
      url: "/opengraph-image",
      width: OG_SHARE_SIZE.width,
      height: OG_SHARE_SIZE.height,
      alt: imageAlt,
      type: "image/png" as const,
    },
  ];

  return {
    openGraph: {
      url: input.path,
      type: "website",
      locale: "en_GH",
      siteName: siteConfig.name,
      title: ogTitle,
      description: input.description,
      images,
      countryName: "Ghana",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      images: [{ url: "/twitter-image", width: OG_SHARE_SIZE.width, height: OG_SHARE_SIZE.height, alt: imageAlt }],
    },
  };
}
