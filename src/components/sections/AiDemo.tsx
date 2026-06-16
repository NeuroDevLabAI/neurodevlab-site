"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BriefCta } from "@/components/ui/BriefCta";
import { track } from "@/lib/track";

/**
 * Feature D — live AI demo. The LLM call is server-only (/api/demo); this
 * component never sees the key. Any failure degrades to a friendly message that
 * routes the visitor to the brief — never a broken state. Below the fold, so it
 * doesn't touch hero LCP. The answer is rendered as plain text (the server
 * prompt forbids markdown). prefers-reduced-motion is respected (no animation
 * beyond the shared Reveal, which is itself gated).
 */
type State = "idle" | "loading" | "done" | "busy" | "error";

const EXAMPLE_KEYS = ["example1", "example2", "example3"] as const;

export function AiDemo() {
  const t = useTranslations("AiDemo");
  const [state, setState] = useState<State>("idle");
  const [answer, setAnswer] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function ask(prompt: string) {
    const value = prompt.trim();
    if (value.length < 3 || state === "loading") return;
    setState("loading");
    setAnswer("");
    track("demo_used");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });
      if (res.ok) {
        const data = (await res.json()) as { text?: string };
        setAnswer(data.text || "");
        setState(data.text ? "done" : "error");
      } else if (res.status === 429) {
        setState("busy");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ask(inputRef.current?.value || "");
  }

  function runExample(text: string) {
    if (inputRef.current) inputRef.current.value = text;
    ask(text);
  }

  return (
    <section id="demo" className="relative z-10 scroll-mt-24 border-t border-border bg-bg/40">
      <Container className="py-24">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-10 rounded-3xl border border-border bg-surface/40 p-6 sm:p-8">
            <form onSubmit={onSubmit}>
              <label htmlFor="demo-input" className="sr-only">
                {t("inputLabel")}
              </label>
              <textarea
                id="demo-input"
                ref={inputRef}
                rows={3}
                maxLength={600}
                placeholder={t("placeholder")}
                className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors focus:border-accent-2"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-strong px-6 py-3 text-[15px] font-medium text-white shadow-[0_10px_34px_-12px_rgba(139,92,246,0.6)] transition-[transform,background-color] duration-200 ease-out hover:bg-accent-strong-hover hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === "loading" && (
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin"
                    />
                  )}
                  {state === "loading" ? t("sending") : t("send")}
                </button>
                <p className="text-xs text-subtle">{t("poweredBy")}</p>
              </div>
            </form>

            {/* Example chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-subtle">{t("exampleLabel")}:</span>
              {EXAMPLE_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => runExample(t(k))}
                  disabled={state === "loading"}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-border-strong hover:text-fg disabled:opacity-50"
                >
                  {t(k)}
                </button>
              ))}
            </div>

            {/* Result / status */}
            <div aria-live="polite" className="mt-6">
              {state === "done" && answer && (
                <div className="rounded-2xl border border-accent/25 bg-accent/[0.05] p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
                    {answer}
                  </p>
                  <div className="mt-5 flex flex-col gap-2 border-t border-accent/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-subtle">{t("disclaimer")}</span>
                    <BriefCta
                      label={t("ctaAfter")}
                      source="demo"
                      onClick={() => track("demo_cta")}
                    />
                  </div>
                </div>
              )}
              {(state === "busy" || state === "error") && (
                <p role="status" className="rounded-2xl border border-border bg-surface/60 p-5 text-sm text-muted">
                  {state === "busy" ? t("errorBusy") : t("errorGeneric")}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
