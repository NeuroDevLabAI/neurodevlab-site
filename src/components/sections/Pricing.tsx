import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BriefCta } from "@/components/ui/BriefCta";
import { OFFERS, type Offer } from "@/lib/pricing";

/**
 * T1 — launch pricing (CEO-validated 2026-06-16). CHF only (LOI1), no
 * conversion shown. C4 guarantee sits right by the prices + CTA. Prices live in
 * lib/pricing.ts; copy in the Pricing i18n namespace.
 */
export async function Pricing() {
  const t = await getTranslations("Pricing");
  const c = await getTranslations("Cta");
  const g = await getTranslations("Guarantee");

  function priceLine(o: Offer) {
    const amount = `${o.price} CHF`;
    if (o.kind === "from") return { lead: t("from"), amount, trail: "" };
    if (o.kind === "perMonth")
      return { lead: t("from"), amount, trail: t("perMonth") };
    // quote
    return { lead: t("quotePrefix"), amount: `${t("from")} ${amount}`, trail: "", paren: true };
  }

  return (
    <section id="pricing" className="relative z-10 scroll-mt-24 border-t border-border bg-bg/40">
      <Container className="py-24">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map((o, i) => {
            const p = priceLine(o);
            return (
              <Reveal key={o.key} delay={i * 0.06} className="h-full">
                <article
                  className={
                    "relative flex h-full flex-col rounded-2xl border bg-surface p-6 transition-[transform,border-color] duration-200 ease-out hover:-translate-y-0.5 " +
                    (o.popular ? "border-accent/50" : "border-border hover:border-border-strong")
                  }
                >
                  {o.popular && (
                    <span className="absolute -top-2.5 left-6 rounded-full border border-accent/40 bg-bg-elevated px-2.5 py-0.5 text-[11px] font-medium text-accent-hover">
                      {t("popular")}
                    </span>
                  )}
                  <h3 className="text-base font-medium text-fg">{t(`${o.key}.name`)}</h3>
                  <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-muted">
                    {t(`${o.key}.desc`)}
                  </p>
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide text-subtle">{p.lead}</p>
                    <p className="mt-1">
                      <span className="tnum text-2xl font-semibold tracking-tight text-fg">
                        {p.amount}
                      </span>
                      {p.trail && <span className="ml-1 text-sm text-muted">{p.trail}</span>}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* C4 guarantee — visible right by the prices + CTA. */}
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl border border-accent/25 bg-accent/[0.06] px-6 py-8 text-center">
            <p className="inline-flex items-center gap-2.5 text-base font-medium text-fg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent">
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
            <BriefCta label={c("primary")} source="pricing" magnetic />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
