"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { CALENDLY_URL } from "@/lib/config";

/**
 * Inline Calendly embed (lazy-mounted via IntersectionObserver so it never
 * delays first paint / hero LCP). Dark-themed via Calendly query params. The
 * iframe is allow-listed in the CSP frame-src.
 */
export function CalendlyEmbed({
  title,
  openLabel,
  fallbackLabel,
}: {
  title: string;
  openLabel: string;
  fallbackLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const src =
    `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=09090b` +
    `&text_color=fafafa&primary_color=8b5cf6&locale=${locale}`;

  return (
    <div ref={ref}>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
        {show ? (
          <iframe
            src={src}
            title={title}
            loading="lazy"
            className="h-[700px] w-full"
          />
        ) : (
          <div className="flex h-[700px] w-full animate-pulse items-center justify-center text-sm text-subtle">
            {title}
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-subtle">
        {fallbackLabel}{" "}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-2 underline-offset-2 hover:underline"
        >
          {openLabel}
        </a>
      </p>
    </div>
  );
}
