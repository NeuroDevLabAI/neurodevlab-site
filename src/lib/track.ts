/**
 * Plausible custom-event helper. Safe no-op when Plausible isn't loaded
 * (e.g. analytics disabled, dev, or blocked).
 *
 * Canonical goal names (create these exactly in the Plausible dashboard):
 *   click_calendly · form_submit · locale_switch · exit_intent_shown ·
 *   scroll_50 · scroll_90 · time_on_page_30s
 */
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Props; callback?: () => void },
    ) => void;
  }
}

export function track(event: string, props?: Props): void {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible(event, props ? { props } : undefined);
  }
}

export {};
