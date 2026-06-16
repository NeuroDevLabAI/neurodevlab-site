import { routing } from "@/i18n/routing";

/** Centralized site configuration. Anything secret stays in env vars. */

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

export const SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "https://neurodevlab.vercel.app",
);

export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/neurodevlab-ai/30min";

export const GITHUB_URL = "https://github.com/NeuroDevLabAI";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "neurodevlab.ai@gmail.com";

export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";

export const LOCATION = "Lausanne, Switzerland";

/**
 * Availability badge state. Green ("available") by default; set
 * NEXT_PUBLIC_ACCEPTING_CLIENTS=false to flip to red ("at capacity").
 * Honest scarcity number for "currently accepting N new clients".
 */
export const ACCEPTING_CLIENTS =
  process.env.NEXT_PUBLIC_ACCEPTING_CLIENTS !== "false";
export const CLIENT_SLOTS = Number(
  process.env.NEXT_PUBLIC_CLIENT_SLOTS || "3",
);

/** Exit-intent popup (desktop, once per session). Disable with =false. */
export const EXIT_INTENT_ENABLED =
  process.env.NEXT_PUBLIC_EXIT_INTENT !== "false";

/** Live stats — wired to the VPS API later; static defaults for now. */
export const STATS = {
  missions: Number(process.env.NEXT_PUBLIC_STAT_MISSIONS || "0"),
  clients: Number(process.env.NEXT_PUBLIC_STAT_CLIENTS || "0"),
  technologies: Number(process.env.NEXT_PUBLIC_STAT_TECHNOLOGIES || "15"),
};

/** Locale → HTML lang / og:locale helpers. */
export const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  fr: "fr_CH",
  de: "de_CH",
  it: "it_CH",
  es: "es_ES",
};

/**
 * Build canonical + hreflang alternates for a given page path.
 * `path` is "" for home, "/services", "/contact", etc.
 */
export function buildAlternates(locale: string, path = "") {
  const urlFor = (loc: string) => {
    const prefix = loc === routing.defaultLocale ? "" : `/${loc}`;
    return `${SITE_URL}${prefix}${path}`;
  };
  const languages: Record<string, string> = { "x-default": `${SITE_URL}${path}` };
  for (const loc of routing.locales) languages[loc] = urlFor(loc);
  return { canonical: urlFor(locale), languages };
}
