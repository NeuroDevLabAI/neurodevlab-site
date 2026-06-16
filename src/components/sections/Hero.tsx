import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { BriefCta } from "@/components/ui/BriefCta";
import { CalendlyButton } from "@/components/ui/CalendlyButton";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { NeuralBackground } from "@/components/hero/NeuralBackground";
import { NeuralCapabilities } from "@/components/hero/NeuralCapabilities";
import { ACCEPTING_CLIENTS, CLIENT_SLOTS } from "@/lib/config";

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Hero renders WITHOUT scroll-reveal wrappers so the LCP content (h1 +
 * subheadline) paints straight from SSR — fast and resilient without JS.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const a = await getTranslations("Availability");
  const c = await getTranslations("Cta");

  return (
    <section className="relative isolate overflow-hidden">
      <NeuralBackground className="absolute inset-0 h-full w-full opacity-70 mask-fade-y" />
      <NeuralCapabilities />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg"
      />
      <Container className="relative z-10 flex min-h-[92svh] flex-col justify-center pt-28 pb-24">
        <div className="max-w-3xl">
          <AvailabilityBadge
            available={ACCEPTING_CLIENTS}
            label={ACCEPTING_CLIENTS ? a("open") : a("closed")}
          />
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]">
            {t("headlineLead")}{" "}
            <span className="text-gradient">{t("headlineResult")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {t("subheadline")}
          </p>
          <div className="mt-9 flex flex-col items-start gap-3">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <BriefCta label={c("primary")} source="hero" magnetic />
              <CalendlyButton
                label={c("secondary")}
                source="hero_secondary"
                variant="secondary"
                arrow={false}
                className="px-5 py-2.5 text-sm"
              />
            </div>
            <span className="text-sm text-subtle">{c("micro")}</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <PinIcon />
              {t("location")}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-subtle sm:inline-block" />
            <span className="inline-flex items-center gap-2">
              <ClockIcon />
              {t("responseTime")}
            </span>
          </div>
          {ACCEPTING_CLIENTS && CLIENT_SLOTS > 0 && (
            <p className="mt-4 text-sm text-subtle">
              {a("accepting", { count: CLIENT_SLOTS })}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
