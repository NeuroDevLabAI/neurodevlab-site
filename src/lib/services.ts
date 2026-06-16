export const SERVICE_KEYS = [
  "automations",
  "integrations",
  "bots",
  "scraping",
  "scripts",
  "webapps",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];
