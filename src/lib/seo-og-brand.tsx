import type { CSSProperties } from "react";
import { getPublicAppUrl } from "@/lib/app-url";
import { siteConfig } from "@/lib/site-data";
import { truncateForOgImage } from "@/lib/seo";

const greenLight = "#A5D6A7";

/** Shared markup for programmatic OG + Twitter share images ({@see opengraph-image} / twitter-image routes). */
export function SeoOgBrandRoot() {
  const base = getPublicAppUrl().replace(/\/$/, "");
  const blurb = truncateForOgImage(siteConfig.description, 168);
  const subline =
    truncateForOgImage(
      `${siteConfig.tagline} · Ghana · Nationwide fulfilment · Shop MiiraCare & organic wellness.`,
      92,
    ) || siteConfig.tagline;

  const label = base.replace(/^https:\/\//, "");

  const commonText: CSSProperties = {
    fontFamily: "ui-sans-serif, system-ui, Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif",
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "relative",
        background: "linear-gradient(148deg, #0d2818 0%, #1B5E20 42%, #2E7D32 100%)",
        paddingLeft: 72,
        paddingRight: 72,
      }}
    >
      <div
        style={{
          ...commonText,
          fontSize: 60,
          fontWeight: 800,
          color: "#F1FAEE",
          lineHeight: 1.08,
          letterSpacing: -0.5,
          maxWidth: 1040,
        }}
      >
        {siteConfig.name}
      </div>
      <div
        style={{
          ...commonText,
          marginTop: 14,
          fontSize: 28,
          fontWeight: 600,
          color: "#FFC107",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {subline}
      </div>
      <div
        style={{
          ...commonText,
          marginTop: 22,
          fontSize: 24,
          color: "rgba(241,250,238,0.92)",
          lineHeight: 1.45,
          maxWidth: 980,
        }}
      >
        {blurb}
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 44,
          left: 72,
          right: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(165,214,167,0.35)",
          paddingTop: 20,
        }}
      >
        <span style={{ ...commonText, fontSize: 17, fontWeight: 700, color: greenLight }}>
          {label}
        </span>
        <span style={{ ...commonText, fontSize: 16, fontWeight: 600, color: `${greenLight}b8` }}>
          Trusted wellness · Nationwide fulfilment
        </span>
      </div>
    </div>
  );
}