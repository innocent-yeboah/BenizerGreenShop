import type { Metadata } from "next";
import { noIndexFollow } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Track your order",
  robots: noIndexFollow(),
};

export default function OrderStatusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
