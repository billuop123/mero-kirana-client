import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "आफ्नो Kirana — Simple POS for Nepali kirana shops";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#111827",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#14532d",
            color: "#4ade80",
            fontSize: 18,
            fontWeight: 600,
            padding: "8px 20px",
            borderRadius: 999,
            marginBottom: 32,
            border: "1px solid #166534",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
          Made for Nepal
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-2px",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          आफ्नो Kirana
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Bill customers, track inventory & manage udhari — all in one place.
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            display: "flex",
            gap: 32,
            color: "#6b7280",
            fontSize: 18,
          }}
        >
          <span>⚡ Fast Billing</span>
          <span>📦 Inventory</span>
          <span>🤝 Udhari</span>
          <span>📊 Reports</span>
        </div>
      </div>
    ),
    size
  );
}
