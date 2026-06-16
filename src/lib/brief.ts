/**
 * Shared brief-form contract. Pure constants only (NO zod import) so the client
 * form can import the option lists without pulling validation code into the
 * browser bundle. The server route builds the zod schema from these same values.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Select options — `value` is submitted, `labelKey` is the i18n key (Contact namespace). */
export const PROJECT_TYPE_OPTIONS = [
  { value: "automation", labelKey: "projectTypeAutomation" },
  { value: "integration", labelKey: "projectTypeIntegration" },
  { value: "bot", labelKey: "projectTypeBot" },
  { value: "scraping", labelKey: "projectTypeScraping" },
  { value: "webapp", labelKey: "projectTypeWebapp" },
  { value: "other", labelKey: "projectTypeOther" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "lt500", labelKey: "budgetLt500" },
  { value: "500", labelKey: "budget500" },
  { value: "1500", labelKey: "budget1500" },
  { value: "gt3500", labelKey: "budgetGt3500" },
  { value: "unsure", labelKey: "budgetUnsure" },
] as const;

export const PROJECT_TYPE_VALUES = PROJECT_TYPE_OPTIONS.map((o) => o.value);
export const BUDGET_VALUES = BUDGET_OPTIONS.map((o) => o.value);

/** Server-side English labels for the Telegram/email notification (locale-independent for the CEO). */
export const PROJECT_TYPE_LABELS: Record<string, string> = {
  automation: "Automation / workflow",
  integration: "API integration",
  bot: "Bot (Telegram/Discord)",
  scraping: "Web scraping / data",
  webapp: "Web app",
  other: "Something else",
};

export const BUDGET_LABELS: Record<string, string> = {
  lt500: "< 500 CHF",
  "500": "500–1'500 CHF",
  "1500": "1'500–3'500 CHF",
  gt3500: "> 3'500 CHF",
  unsure: "Not sure yet",
};
