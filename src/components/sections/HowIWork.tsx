import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * C1 — "How I work" replaces the empty Case Studies / Social Proof sections,
 * which read as a negative signal at cold start. Honest process, no fake proof.
 */
export async function HowIWork() {
  const t = await getTranslations("HowIWork");

  const steps = [
    { n: "01", title: t("step1Title"), desc: t("step1Desc") },
    { n: "02", title: t("step2Title"), desc: t("step2Desc") },
    { n: "03", title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <section className="relative z-10 border-t border-border">
      <Container className="py-24">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-surface/50 p-6">
                <span className="font-mono text-sm text-accent-2">{s.n}</span>
                <h3 className="mt-3 text-lg font-medium text-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
