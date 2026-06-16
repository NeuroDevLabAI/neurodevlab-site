import Script from "next/script";
import { PLAUSIBLE_DOMAIN } from "@/lib/config";

/**
 * Plausible analytics (cookieless, GDPR/nLPD-friendly). Renders only when
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, so no script ships in dev / when off.
 * Uses the tagged-events variant to support custom conversion goals.
 */
export function Analytics() {
  if (!PLAUSIBLE_DOMAIN) return null;
  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.tagged-events.js"
      strategy="afterInteractive"
    />
  );
}
