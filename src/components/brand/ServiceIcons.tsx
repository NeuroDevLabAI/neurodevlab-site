import type { ServiceKey } from "@/lib/services";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Crisp line glyphs (currentColor) — no emoji, no raster. */
export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceKey;
  className?: string;
}) {
  switch (name) {
    case "automations":
      return (
        <svg {...base} className={className} aria-hidden="true">
          <circle cx="6" cy="5.5" r="2.2" />
          <circle cx="6" cy="18.5" r="2.2" />
          <circle cx="18" cy="12" r="2.2" />
          <path d="M8.1 6.6 15.7 10.9M8.1 17.4 15.7 13.1" />
        </svg>
      );
    case "integrations":
      return (
        <svg {...base} className={className} aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
        </svg>
      );
    case "bots":
      return (
        <svg {...base} className={className} aria-hidden="true">
          <rect x="4" y="8" width="16" height="11" rx="3" />
          <path d="M12 8V5" />
          <circle cx="12" cy="3.6" r="1.1" />
          <path d="M2.5 13v2M21.5 13v2" />
          <path d="M9.3 13h.01M14.7 13h.01" />
        </svg>
      );
    case "scraping":
      return (
        <svg {...base} className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "scripts":
      return (
        <svg {...base} className={className} aria-hidden="true">
          <rect x="2.5" y="4" width="19" height="16" rx="3" />
          <path d="M7 9.5l3 2.5-3 2.5" />
          <path d="M13 15h4" />
        </svg>
      );
    case "webapps":
      return (
        <svg {...base} className={className} aria-hidden="true">
          <rect x="2.5" y="5" width="19" height="14" rx="3" />
          <path d="M2.5 9.2h19" />
          <circle cx="6" cy="7.1" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="8.3" cy="7.1" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
