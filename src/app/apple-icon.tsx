import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          background: "#09090b",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="9" fill="#0f0f14" />
          <path
            d="M10 22 L10 13 L22 19 L22 10"
            stroke="#8b5cf6"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="13" r="2.4" fill="#8b5cf6" />
          <circle cx="22" cy="19" r="2.4" fill="#38bdf8" />
          <circle cx="22" cy="10" r="1.8" fill="#fafafa" />
          <circle cx="10" cy="22" r="1.8" fill="#fafafa" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
