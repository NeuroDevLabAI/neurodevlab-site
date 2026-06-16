"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BriefCta } from "@/components/ui/BriefCta";
import { track } from "@/lib/track";
import { EXPRESS_PRICE_CHF } from "@/lib/pricing";

/**
 * Feature B — savings calculator. 100% client, no deps, no perf risk.
 * Inputs are sliders + synced number fields, hard-clamped to [min,max] so there
 * is no path to negative or absurd values (zod-equivalent bounds enforced on
 * every change). Outputs ease toward their target (count-up feel) and snap under
 * prefers-reduced-motion. Always CHF (LOI1). ROI is indicative, vs an Express
 * automation, and capped so it never reads as a fantasy number.
 */

const WEEKS_PER_MONTH = 4.33;
const ROI_CAP = 99;

type FieldKey = "tasks" | "minutes" | "rate";
const BOUNDS: Record<FieldKey, { min: number; max: number; step: number; def: number }> = {
  tasks: { min: 0, max: 100, step: 1, def: 10 },
  minutes: { min: 0, max: 240, step: 5, def: 15 },
  rate: { min: 20, max: 300, step: 5, def: 60 },
};

function clamp(v: number, k: FieldKey): number {
  const { min, max } = BOUNDS[k];
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

function formatInt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'"); // Swiss apostrophe grouping
}

/**
 * Eases a displayed number toward `target` (count-up feel on every change);
 * effectively instant under reduced-motion. All state/ref writes happen inside
 * the rAF callback — never synchronously in the effect body, never during
 * render — so it stays React-strict / lint clean.
 */
function useAnimatedNumber(target: number): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    const dur = reduced ? 0 : 420;
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);
    const tick = (now: number) => {
      const p = dur === 0 ? 1 : Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = from + (target - from) * eased;
      fromRef.current = val; // ref write in callback, not during render
      setDisplay(val); // setState in rAF callback, not synchronously in effect
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return display;
}

function Field({
  k,
  label,
  hint,
  value,
  onChange,
}: {
  k: FieldKey;
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const { min, max, step } = BOUNDS[k];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={`calc-${k}`} className="text-sm font-medium text-muted">
          {label}
        </label>
        <input
          id={`calc-${k}-num`}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(clamp(parseFloat(e.target.value), k))}
          aria-label={label}
          className="tnum w-20 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-right text-sm text-fg outline-none focus:border-accent-2"
        />
      </div>
      <input
        id={`calc-${k}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(clamp(parseFloat(e.target.value), k))}
        aria-label={label}
        className="nd-range mt-3 w-full"
      />
      {hint && <p className="mt-1.5 text-xs text-subtle">{hint}</p>}
    </div>
  );
}

export function Calculator() {
  const t = useTranslations("Calculator");
  const [tasks, setTasks] = useState(BOUNDS.tasks.def);
  const [minutes, setMinutes] = useState(BOUNDS.minutes.def);
  const [rate, setRate] = useState(BOUNDS.rate.def);
  const usedRef = useRef(false);

  function onAnyChange(setter: (v: number) => void) {
    return (v: number) => {
      setter(v);
      if (!usedRef.current) {
        usedRef.current = true;
        track("calc_used");
      }
    };
  }

  const hoursPerMonth = (tasks * minutes * WEEKS_PER_MONTH) / 60;
  const chfPerMonth = hoursPerMonth * rate;
  const chfPerYear = chfPerMonth * 12;
  const roiRaw = chfPerYear > 0 ? chfPerYear / EXPRESS_PRICE_CHF : 0;
  const roiCapped = roiRaw > ROI_CAP;

  const aHours = useAnimatedNumber(hoursPerMonth);
  const aMonth = useAnimatedNumber(chfPerMonth);
  const aYear = useAnimatedNumber(chfPerYear);
  const aRoi = useAnimatedNumber(Math.min(roiRaw, ROI_CAP));

  const results = [
    { label: t("resultHours"), value: formatInt(aHours), accent: false },
    { label: t("resultMonth"), value: formatInt(aMonth), suffix: " CHF", accent: true },
    { label: t("resultYear"), value: formatInt(aYear), suffix: " CHF", accent: true },
    {
      label: t("roi"),
      value: roiCapped ? t("roiCapped") : `${formatInt(aRoi)}×`,
      hint: roiCapped ? undefined : t("roiSuffix"),
      accent: false,
    },
  ];

  return (
    <section id="calculator" className="relative z-10 scroll-mt-24 border-t border-border">
      <Container className="py-24">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-12 grid gap-8 rounded-3xl border border-border bg-surface/40 p-6 sm:p-9 lg:grid-cols-2 lg:gap-12">
            {/* Inputs */}
            <div className="space-y-7">
              <Field k="tasks" label={t("tasksLabel")} value={tasks} onChange={onAnyChange(setTasks)} />
              <Field k="minutes" label={t("minutesLabel")} value={minutes} onChange={onAnyChange(setMinutes)} />
              <Field
                k="rate"
                label={t("rateLabel")}
                hint={t("rateHint")}
                value={rate}
                onChange={onAnyChange(setRate)}
              />
            </div>

            {/* Outputs */}
            <div className="flex flex-col">
              <div className="grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {results.map((r) => (
                  <div key={r.label} className="flex flex-col justify-center bg-bg-elevated px-5 py-6">
                    <p
                      className={
                        "tnum text-2xl font-semibold tracking-tight sm:text-3xl " +
                        (r.accent ? "text-gradient" : "text-fg")
                      }
                    >
                      {r.value}
                      {r.suffix && <span className="text-lg text-muted">{r.suffix}</span>}
                    </p>
                    <p className="mt-1.5 text-xs leading-snug text-muted">{r.label}</p>
                    {r.hint && <p className="mt-0.5 text-[11px] text-subtle">{r.hint}</p>}
                  </div>
                ))}
              </div>

              <p className="sr-only" aria-live="polite">
                {t("srSummary", { hours: formatInt(hoursPerMonth), month: formatInt(chfPerMonth) })}
              </p>

              <div className="mt-6 flex flex-col items-start gap-3">
                <BriefCta label={t("cta")} source="calculator" />
                <p className="text-xs leading-relaxed text-subtle">{t("disclaimer")}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
