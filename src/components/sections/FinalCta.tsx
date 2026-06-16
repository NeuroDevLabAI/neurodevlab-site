import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CalendlyButton } from "@/components/ui/CalendlyButton";

export async function FinalCta() {
  const t = await getTranslations("FinalCta");

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
            <div className="mt-9 flex justify-center">
              <CalendlyButton label={t("cta")} source="final_cta" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
