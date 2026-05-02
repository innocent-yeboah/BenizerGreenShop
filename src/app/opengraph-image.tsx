import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-data";

export const alt = `${siteConfig.name} — organic wellness`;

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(148deg, #0d2818 0%, #1B5E20 42%, #2E7D32 100%)",
          paddingLeft: 72,
          paddingRight: 72,
        }}
      >
        <div style={{ fontSize: 62, fontWeight: 800, color: "#F1FAEE", lineHeight: 1.08 }}>
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 20, fontSize: 30, fontWeight: 600, color: "#FFC107" }}>
          {siteConfig.tagline}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            color: "rgba(241,250,238,0.92)",
            maxWidth: 900,
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
