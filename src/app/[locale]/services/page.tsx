import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceIcon } from "@/components/brand/ServiceIcons";
import { FinalCta } from "@/components/sections/FinalCta";
import { SERVICE_KEYS } from "@/lib/services";
import { OG_LOCALES, buildAlternates } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const alt = buildAlternates(locale, "/services");
  return {
    title: t("servicesTitle"),
    description: t("servicesDescription"),
    alternates: alt,
    openGraph: {
      title: t("servicesTitle"),
      description: t("servicesDescription"),
      url: alt.canonical,
      locale: OG_LOCALES[locale],
      images: [{ url: `/og?locale=${locale}`, width: 1200, height: 630 }],
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ServicesPage");

  const steps = [
    { n: "01", title: t("step1Title"), desc: t("step1Desc") },
    { n: "02", title: t("step2Title"), desc: t("step2Desc") },
    { n: "03", title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <div className="pt-28">
      <Container className="py-16">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{t("subtitle")}</p>
        </Reveal>
      </Container>

      <Container className="pb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {SERVICE_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 0.05} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent">
                  <ServiceIcon name={key} className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-medium text-fg">
                  {t(`${key}.title`)}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {t(`${key}.long`)}
                </p>
                <p className="mt-5 flex items-baseline gap-2 border-t border-border pt-4 text-sm">
                  <span className="eyebrow">{t("outcomeLabel")}</span>
                  <span className="text-fg">{t(`${key}.outcome`)}</span>
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="py-20">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("processTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-muted">{t("processSubtitle")}</p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-surface/50 p-6">
                <span className="font-mono text-sm text-accent-2">{s.n}</span>
                <h3 className="mt-3 text-lg font-medium text-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <FinalCta />
    </div>
  );
}
