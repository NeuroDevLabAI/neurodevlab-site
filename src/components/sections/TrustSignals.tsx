import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GITHUB_URL, STATS } from "@/lib/config";

/**
 * C2 — trust signals that are *real and verifiable today*. No invented logos,
 * counts or testimonials (2026 buyers + EU/CH regulators penalize faked proof).
 * Replaces the old numeric Stats strip, which showed 0 missions / 0 clients — a
 * negative signal at cold start (same rationale as hiding empty case studies).
 */
function Icon({ name }: { name: string }) {
  const base = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "github":
      return (
        <svg {...base}>
          <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.3 2.3 5.3 2.6 5.3 2.6a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.9 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
        </svg>
      );
    case "location":
      return (
        <svg {...base}>
          <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
      );
    case "response":
      return (
        <svg {...base}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "privacy":
      return (
        <svg {...base}>
          <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "production":
      return (
        <svg {...base}>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
          <circle cx="12" cy="12" r="3.2" />
        </svg>
      );
    default:
      return (
        <svg {...base}>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      );
  }
}

export async function TrustSignals() {
  const t = await getTranslations("TrustSignals");

  const items = [
    { key: "github", title: t("github"), desc: t("githubDesc"), href: GITHUB_URL },
    { key: "location", title: t("location"), desc: t("locationDesc") },
    { key: "response", title: t("response"), desc: t("responseDesc") },
    { key: "privacy", title: t("privacy"), desc: t("privacyDesc") },
    { key: "production", title: t("production"), desc: t("productionDesc") },
    {
      key: "tech",
      title: t("tech", { count: STATS.technologies }),
      desc: t("subtitle"),
    },
  ];

  return (
    <section className="relative z-10">
      <Container className="py-16 sm:py-20">
        <Reveal>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => {
            const inner = (
              <div className="flex h-full items-start gap-3.5 bg-surface px-5 py-5 transition-colors duration-200 group-hover:bg-surface-2">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated text-accent">
                  <Icon name={it.key} />
                </span>
                <div>
                  <p className="text-sm font-medium text-fg">{it.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{it.desc}</p>
                </div>
              </div>
            );
            return (
              <Reveal key={it.key} delay={i * 0.05} className="group h-full">
                {it.href ? (
                  <a
                    href={it.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
