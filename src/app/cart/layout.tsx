import type { Metadata } from "next";
import { noIndexFollow } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cart",
  robots: noIndexFollow(),
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
