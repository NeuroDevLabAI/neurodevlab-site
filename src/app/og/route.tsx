import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const ALLOWED = new Set(["en", "fr", "de", "it", "es"]);

/** Dynamic 1200x630 Open Graph card. Satori: display:flex only, no grid. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("locale") || "en";
  const locale = ALLOWED.has(raw) ? raw : "en";
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const tagline = messages.Meta.ogTagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "180px",
            height: "6px",
            borderRadius: "3px",
            background: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: "92px", fontWeight: 700, letterSpacing: "-3px" }}>
            <span style={{ color: "#fafafa" }}>Neuro</span>
            <span style={{ color: "#a1a1aa" }}>Dev</span>
            <span style={{ color: "#fafafa" }}>Lab</span>
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "34px",
              lineHeight: 1.3,
              color: "#a1a1aa",
              maxWidth: "920px",
            }}
          >
            {tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "24px",
            color: "#71717a",
          }}
        >
          <span>Lausanne, Switzerland</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "6px",
                backgroundColor: "#8b5cf6",
                marginRight: "12px",
              }}
            />
            <span>neurodevlab.ai</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
