import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Become a distributor",
  description: clampMetaDescription(
    `Join ${siteConfig.name} as an approved distributor: referral links, commissions, and premium organic wellness products — apply to get started.`,
  ),
  alternates: { canonical: "/become-distributor" },
};

export default function BecomeDistributorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
