"use client";

import { useLocale } from "next-intl";
import { CALENDLY_URL } from "@/lib/config";
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
 * The single, repeated primary CTA. Opens the Calendly booking page and fires
 * the `click_calendly` Plausible goal (tagged with locale + source) so every
 * placement is measured. Keyboard + screen-reader friendly.
 */
export function CalendlyButton({
  label,
  source,
  variant = "primary",
  className,
  arrow = true,
}: {
  label: string;
  source: string;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  const locale = useLocale();
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-source={source}
      onClick={() => track("click_calendly", { source, locale })}
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
    </a>
  );
}
