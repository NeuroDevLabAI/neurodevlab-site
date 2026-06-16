"use client";

import { useTranslations } from "next-intl";

/**
 * Feature C (labels) — capability chips floating over the hero neural field,
 * each standing for one node/capability. Decorative reinforcement of the
 * Services section (aria-hidden), shown on lg+ only so it never crowds mobile or
 * the hero copy. Float animation is frozen by the global reduced-motion rule;
 * hover glow stays (not motion, just emphasis). pointer-events isolated to the
 * chips so the hero CTA underneath stays clickable.
 */
const CHIPS = [
  { key: "automation", top: "20%", left: "60%", delay: "0s", tone: "accent" },
  { key: "integrations", top: "34%", left: "82%", delay: "-2.2s", tone: "blue" },
  { key: "sourcing", top: "52%", left: "66%", delay: "-4.1s", tone: "blue" },
  { key: "delivery", top: "66%", left: "85%", delay: "-1.3s", tone: "accent" },
  { key: "learning", top: "78%", left: "62%", delay: "-3.4s", tone: "accent" },
  { key: "security", top: "44%", left: "92%", delay: "-5s", tone: "blue" },
] as const;

export function NeuralCapabilities() {
  const t = useTranslations("Capabilities");

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[6] hidden lg:block"
    >
      {CHIPS.map((c) => (
        <span
          key={c.key}
          style={{ top: c.top, left: c.left, animationDelay: c.delay }}
          className="animate-float pointer-events-auto absolute inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-bg-elevated/70 px-3 py-1.5 text-xs text-muted backdrop-blur-sm transition-[transform,border-color,color,box-shadow] duration-200 ease-out hover:scale-[1.06] hover:border-accent/50 hover:text-fg hover:shadow-[0_0_24px_-6px_rgba(139,92,246,0.5)]"
        >
          <span
            className={
              "h-1.5 w-1.5 rounded-full " +
              (c.tone === "accent" ? "bg-accent" : "bg-accent-2")
            }
          />
          {t(c.key)}
        </span>
      ))}
    </div>
  );
}
