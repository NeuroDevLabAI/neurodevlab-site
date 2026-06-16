import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BriefCta } from "@/components/ui/BriefCta";
import { CalendlyButton } from "@/components/ui/CalendlyButton";

export async function FinalCta() {
  const t = await getTranslations("FinalCta");
  const c = await getTranslations("Cta");
  const g = await getTranslations("Guarantee");

  return (
    <section className="relative z-10">
      <Container className="py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-4/5 -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]"
            />
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">{t("subtitle")}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <BriefCta label={c("primary")} source="final_cta" magnetic />
              <CalendlyButton
                label={c("secondary")}
                source="final_cta_secondary"
                variant="secondary"
                arrow={false}
                className="px-5 py-2.5 text-sm"
              />
            </div>
            <p className="mx-auto mt-6 inline-flex items-center gap-2 text-sm text-subtle">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {g("text")}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
