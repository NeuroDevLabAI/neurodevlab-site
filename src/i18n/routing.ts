import { defineRouting } from "next-intl/routing";

/**
 * Supported locales. EN is the default and is served without a prefix
 * (`localePrefix: "as-needed"`), so `/` = English, `/fr`, `/de`, `/it`, `/es`.
 *
 * Locale detection (navigator.language equivalent) is handled by the
 * next-intl middleware via the Accept-Language header, with EN as the
 * guaranteed fallback (defaultLocale).
 */
export const routing = defineRouting({
  locales: ["en", "fr", "de", "it", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
