import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Square home-screen icon matching the in-logo mark (green tile + gold B). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B5E20",
          borderRadius: 36,
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#FFC107",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            lineHeight: 1,
            marginTop: -6,
          }}
        >
          B
        </span>
      </div>
    ),
    { ...size },
  );
}
