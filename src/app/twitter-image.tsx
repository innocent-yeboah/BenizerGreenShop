import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-data";
import { SeoOgBrandRoot } from "@/lib/seo-og-brand";
import { OG_SHARE_SIZE } from "@/lib/seo";

export const alt = `${siteConfig.name} — wellness & distributor partnerships`;

export const size = OG_SHARE_SIZE;

export const contentType = "image/png";

/** Social card image for `/twitter-image`; matches OG layout for identical previews everywhere. */
export default function TwitterImage() {
  return new ImageResponse(<SeoOgBrandRoot />, { ...size });
}
