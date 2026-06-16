"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BriefCta } from "@/components/ui/BriefCta";
import { track } from "@/lib/track";
import { EXIT_INTENT_ENABLED } from "@/lib/config";

const KEY = "nd_exit_intent_seen";

/**
 * Subtle exit-intent: desktop (fine-pointer) only, fires at most once per
 * session when the cursor leaves through the top of the viewport. Mobile keeps
 * the sticky CTA instead. Disable globally via NEXT_PUBLIC_EXIT_INTENT=false.
 * Full modal focus management (move-in, trap, restore) for WCAG 2.4.3.
 */
export function ExitIntent() {
  const t = useTranslations("ExitIntent");
  const c = useTranslations("Cta");
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!EXIT_INTENT_ENABLED) return;
    if (sessionStorage.getItem(KEY)) return;
    if (!window.matchMedia("(pointer:fine)").matches) return;

    function trigger() {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
      restoreRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      track("exit_intent_shown");
      document.removeEventListener("mouseout", onLeave);
    }
    function onLeave(e: MouseEvent) {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    }

    const armed = window.setTimeout(
      () => document.addEventListener("mouseout", onLeave),
      4000,
    );
    return () => {
      window.clearTimeout(armed);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  function close() {
    setOpen(false);
    restoreRef.current?.focus?.();
  }

  // Focus move-in, Escape, and Tab trap while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    const focusables = () =>
      node
        ? Array.from(
            node.querySelectorAll<HTMLElement>(
              'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => el.getAttribute("aria-hidden") !== "true")
        : [];

    (focusables()[0] || node)?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) {
        e.preventDefault();
        return;
      }
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
      aria-describedby="exit-desc"
    >
      {/* Backdrop: mouse-dismiss only, hidden from assistive tech (X + Esc cover keyboard). */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-default bg-bg/70 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl border border-border bg-bg-elevated p-7 shadow-2xl outline-none"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface hover:text-fg"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        <h2 id="exit-title" className="text-xl font-semibold tracking-tight">
          {t("title")}
        </h2>
        <p id="exit-desc" className="mt-2 text-sm leading-relaxed text-muted">
          {t("message")}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <BriefCta
            label={c("primaryShort")}
            source="exit_intent"
            className="w-full"
            onClick={close}
          />
          <button
            type="button"
            onClick={close}
            className="text-sm text-subtle transition-colors hover:text-muted"
          >
            {t("dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
