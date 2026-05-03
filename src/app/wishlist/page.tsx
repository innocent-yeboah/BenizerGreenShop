import type { Metadata } from "next";
import { WishlistGrid } from "@/app/wishlist/wishlist-grid";
import { clampMetaDescription, noIndexFollow } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Wishlist",
  description: clampMetaDescription(`Saved items on ${siteConfig.name}.`),
  robots: noIndexFollow(),
};

export default function WishlistPage() {
  return <WishlistGrid />;
}
