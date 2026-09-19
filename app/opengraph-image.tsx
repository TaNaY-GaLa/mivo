import { ImageResponse } from "next/og";

export const alt = "Mivo — Things you'll want to keep around.";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "serif",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          MIVO
        </div>

        <div
          style={{
            fontSize: "32px",
            fontWeight: 300,
            color: "#a3a3a3",
            fontFamily: "sans-serif",
            marginBottom: "36px",
          }}
        >
          Things you&apos;ll want to keep around.
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            padding: "14px 32px",
            borderRadius: "9999px",
            border: "1px solid #262626",
            fontSize: "18px",
            color: "#d4d4d4",
            fontFamily: "sans-serif",
          }}
        >
          <span>Audio & Desk</span>
          <span>•</span>
          <span>Carry & Accessories</span>
          <span>•</span>
          <span>India</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
