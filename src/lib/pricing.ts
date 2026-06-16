/**
 * Launch pricing — validated by the CEO on 2026-06-16. CHF only (LOI1), no
 * conversion shown. These are LAUNCH prices: to be revised upward once enough
 * social proof exists (see CLAUDE.md). Numbers are pre-formatted with the Swiss
 * thousands apostrophe; the offer copy lives in i18n (Pricing namespace).
 */
export type PriceKind = "from" | "quote" | "perMonth";

export type Offer = {
  key: "express" | "system" | "custom" | "maintenance";
  price: string; // Swiss-formatted, no currency (currency added by the UI)
  kind: PriceKind;
  popular?: boolean;
};

export const OFFERS: Offer[] = [
  { key: "express", price: "490", kind: "from" },
  { key: "system", price: "1'500", kind: "from", popular: true },
  { key: "custom", price: "3'500", kind: "quote" },
  { key: "maintenance", price: "150", kind: "perMonth" },
];

/** Reference cost used by the savings calculator's ROI (Express automation). */
export const EXPRESS_PRICE_CHF = 490;
