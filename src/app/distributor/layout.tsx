import type { Metadata } from "next";
import { noIndexFollow } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Distributor dashboard",
  robots: noIndexFollow(),
};

export default function DistributorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
