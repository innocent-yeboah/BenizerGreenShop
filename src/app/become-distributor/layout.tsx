import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { defaultSocialCardMetadata } from "@/lib/page-share-metadata";

const becomeDescription = clampMetaDescription(
  `Join ${siteConfig.name} as an approved distributor: referral links, commissions, and premium organic wellness products — apply to get started.`,
);

export const metadata: Metadata = {
  title: "Become a distributor",
  description: becomeDescription,
  alternates: { canonical: "/become-distributor" },
  ...defaultSocialCardMetadata({
    path: "/become-distributor",
    title: "Become a distributor",
    description: becomeDescription,
  }),
};

export default function BecomeDistributorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
