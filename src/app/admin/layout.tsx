import type { Metadata } from "next";
import { noIndexFollow } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexFollow(),
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
