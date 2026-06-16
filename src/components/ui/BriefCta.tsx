"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/track";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent-strong text-white shadow-[0_10px_34px_-10px_rgba(139,92,246,0.65)] hover:bg-accent-strong-hover hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "border border-border bg-surface/50 text-fg hover:border-border-strong hover:bg-surface-2",
};

/**
 * Primary, async-first CTA — routes to the structured brief (/contact) instead
 * of opening Calendly. Calendly is now the discreet *secondary* path. Fires the
 * `cta_brief` Plausible goal (tagged with source + locale) so every placement is
 * measured. Optional "magnetic" pull toward the cursor on desktop, hard-gated by
 * prefers-reduced-motion and a fine pointer (WCAG 2.3.3; never on touch).
 */
export function BriefCta({
  label,
  source,
  href = "/contact",
  variant = "primary",
  magnetic = false,
  arrow = true,
  className,
  onClick,
}: {
  label: string;
  source: string;
  href?: "/contact";
  variant?: Variant;
  magnetic?: boolean;
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const locale = useLocale();
  const wrapRef = useRef<HTMLSpanElement>(null);

  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    if (!magnetic) return;
    const el = wrapRef.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  }

  function reset() {
    const el = wrapRef.current;
    if (el) el.style.transform = "";
  }

  return (
    <span
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn(
        "inline-block transition-transform duration-200 ease-out will-change-transform",
        magnetic && "motion-reduce:!transform-none",
      )}
    >
      <Link
        href={href}
        data-source={source}
        onClick={() => {
          track("cta_brief", { source, locale });
          onClick?.();
        }}
        className={cn(
          "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium transition-[transform,background-color,border-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
          styles[variant],
          className,
        )}
      >
        {label}
        {arrow && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Link>
    </span>
  );
}
