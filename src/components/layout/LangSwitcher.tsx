"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { track } from "@/lib/track";
import { cn } from "@/lib/cn";

export function LangSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Lang");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function choose(loc: string) {
    setOpen(false);
    if (loc !== locale) {
      track("locale_switch", { from: locale, to: loc });
      router.replace(pathname, { locale: loc });
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("label")}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-border px-2.5 text-sm text-muted transition-colors hover:text-fg"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="font-mono text-xs">{locale.toUpperCase()}</span>
      </button>
      {open && (
        <ul
          role="menu"
          aria-label={t("label")}
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-bg-elevated p-1 shadow-2xl"
        >
          {routing.locales.map((loc) => (
            <li key={loc} role="none">
              <button
                type="button"
                role="menuitem"
                aria-current={loc === locale ? "true" : undefined}
                onClick={() => choose(loc)}
                className={cn(
                  "flex min-h-[40px] w-full items-center justify-between rounded-lg px-3 text-sm transition-colors hover:bg-surface",
                  loc === locale ? "text-fg" : "text-muted",
                )}
              >
                <span>{t(loc)}</span>
                {loc === locale && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12.5l4.5 4.5L19 6.5"
                      stroke="#a78bfa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
