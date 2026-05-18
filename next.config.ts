import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // Common legacy/bookmark URLs that otherwise 404 in Search Console.
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/store", destination: "/products", permanent: true },
      { source: "/catalog", destination: "/products", permanent: true },
      { source: "/login", destination: "/auth/sign-in", permanent: true },
      { source: "/sign-in", destination: "/auth/sign-in", permanent: true },
      { source: "/sign-up", destination: "/auth/sign-up", permanent: true },
      { source: "/register", destination: "/auth/sign-up", permanent: true },
      // Canonical apex → www for every path.
      {
        source: "/:path*",
        has: [{ type: "host", value: "benizergreenshop.com" }],
        destination: "https://www.benizergreenshop.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Browsers still request /favicon.ico — serve raster seal-derived icon.
    return [{ source: "/favicon.ico", destination: "/favicon-32.png" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
