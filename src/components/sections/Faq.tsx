"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { track } from "@/lib/track";

/**
 * T2 — FAQ as an accessible disclosure list (button + aria-expanded + region).
 * One item open at a time. The chevron + height transition are gated by the
 * global reduced-motion rule in globals.css.
 */
const IDS = ["1", "2", "3", "4", "5"] as const;

export function Faq() {
  const t = useTranslations("Faq");
  const [open, setOpen] = useState<string | null>("1");

  return (
    <section id="faq" className="relative z-10 scroll-mt-24">
      <Container className="py-24">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="mx-auto mt-10 max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/40">
            {IDS.map((id) => {
              const isOpen = open === id;
              return (
                <li key={id}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${id}`}
                      id={`faq-btn-${id}`}
                      onClick={() => {
                        const next = isOpen ? null : id;
                        setOpen(next);
                        if (next) track("faq_open", { id });
                      }}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[15px] font-medium text-fg transition-colors hover:bg-surface-2 sm:px-6"
                    >
                      {t(`q${id}`)}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className={
                          "shrink-0 text-subtle transition-transform duration-200 ease-out " +
                          (isOpen ? "rotate-180" : "")
                        }
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${id}`}
                    hidden={!isOpen}
                    className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6"
                  >
                    {t(`a${id}`)}
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
