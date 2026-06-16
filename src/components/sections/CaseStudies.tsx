import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export async function CaseStudies() {
  const t = await getTranslations("CaseStudies");

  return (
    <section className="relative z-10 border-t border-border bg-bg/40">
      <Container className="py-24">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={i * 0.06} className="h-full">
              <div className="flex h-full min-h-[208px] flex-col justify-between rounded-2xl border border-dashed border-border bg-surface/40 p-6">
                <span className="eyebrow">{t("metricLabel")}</span>
                <div className="font-mono text-3xl text-subtle">—</div>
                <div>
                  <p className="text-sm font-medium text-muted">
                    {t("comingSoon")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-subtle">
                    {t("comingSoonDesc")}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
