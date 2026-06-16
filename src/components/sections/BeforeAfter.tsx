"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Feature E — the same task, manual (slow, step by step) vs automated (instant).
 * Plays once when scrolled into view: the manual column grinds through 5 steps
 * while the automated column is already done. Replayable.
 *
 * Under prefers-reduced-motion the whole thing is shown at once as a calm static
 * comparison: `play()` reads the media query and jumps straight to the end state,
 * and the spinner is CSS-gated (`motion-safe`/`motion-reduce`). All setState runs
 * inside callbacks (IO / timers / click), never synchronously in the effect body
 * — React-strict / lint clean. Pure state + CSS, negligible perf cost.
 */
const MANUAL_STEPS = ["manualStep1", "manualStep2", "manualStep3", "manualStep4", "manualStep5"] as const;
const AUTO_STEPS = ["autoStep1", "autoStep2"] as const;
const STEP_MS = 620;

export function BeforeAfter() {
  const t = useTranslations("BeforeAfter");
  const ref = useRef<HTMLDivElement>(null);
  const [mStep, setMStep] = useState(0);
  const [aDone, setADone] = useState(false);
  const timers = useRef<number[]>([]);

  const play = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    // Clear in place (don't reassign the ref) so the effect-cleanup snapshot keeps
    // pointing at the live array and actually clears these timers on unmount.
    timers.current.length = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMStep(MANUAL_STEPS.length);
      setADone(true);
      return;
    }
    setMStep(0);
    setADone(false);
    // Automated finishes almost immediately…
    timers.current.push(window.setTimeout(() => setADone(true), 460));
    // …while the manual column slowly ticks through each step.
    for (let i = 1; i <= MANUAL_STEPS.length; i++) {
      timers.current.push(window.setTimeout(() => setMStep(i), i * STEP_MS));
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !fired) {
          fired = true;
          play();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    const pending = timers.current;
    return () => {
      io.disconnect();
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, [play]);

  const manualPct = (mStep / MANUAL_STEPS.length) * 100;
  const manualBusy = mStep < MANUAL_STEPS.length;

  return (
    <section className="relative z-10">
      <Container className="py-24">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div ref={ref} className="mt-12 grid gap-4 md:grid-cols-2">
            {/* Manual — slow */}
            <div className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">{t("manualLabel")}</span>
                {manualBusy && (
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full border-2 border-subtle/40 border-t-subtle motion-safe:animate-spin motion-reduce:hidden"
                  />
                )}
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-subtle/60 transition-[width] duration-500 ease-out"
                  style={{ width: `${manualPct}%` }}
                />
              </div>
              <ul className="mt-5 space-y-2.5">
                {MANUAL_STEPS.map((key, i) => {
                  const shown = i < mStep;
                  return (
                    <li
                      key={key}
                      className={
                        "flex items-center gap-2.5 text-sm transition-opacity duration-300 " +
                        (shown ? "text-muted opacity-100" : "text-subtle opacity-35")
                      }
                    >
                      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-subtle">
                        {shown ? "✓" : "•"}
                      </span>
                      {t(key)}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 border-t border-border pt-4 font-mono text-sm text-subtle">
                {t("manualTime")}
              </p>
            </div>

            {/* Automated — instant */}
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/[0.05] p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-fg">{t("autoLabel")}</span>
                <span
                  aria-hidden="true"
                  className={"text-accent transition-opacity duration-300 " + (aDone ? "opacity-100" : "opacity-0")}
                >
                  ✓
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                  style={{ width: aDone ? "100%" : "0%" }}
                />
              </div>
              <ul className="mt-5 space-y-2.5">
                {AUTO_STEPS.map((key) => (
                  <li
                    key={key}
                    className={
                      "flex items-center gap-2.5 text-sm transition-opacity duration-300 " +
                      (aDone ? "text-fg opacity-100" : "text-subtle opacity-40")
                    }
                  >
                    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-accent">✓</span>
                    {t(key)}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-accent/20 pt-4 font-mono text-sm text-accent">
                {t("autoTime")}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-6">
          <button
            type="button"
            onClick={play}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M5 3v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("replay")}
          </button>
        </div>
      </Container>
    </section>
  );
}
