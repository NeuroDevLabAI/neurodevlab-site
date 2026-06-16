import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CalendlyEmbed } from "@/components/contact/CalendlyEmbed";
import { ContactForm } from "@/components/contact/ContactForm";
import { OG_LOCALES, buildAlternates } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const alt = buildAlternates(locale, "/contact");
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: alt,
    openGraph: {
      title: t("contactTitle"),
      description: t("contactDescription"),
      url: alt.canonical,
      locale: OG_LOCALES[locale],
      images: [{ url: `/og?locale=${locale}`, width: 1200, height: 630 }],
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <div className="pt-28">
      <Container className="py-12">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Reveal>
              <h2 className="mb-4 text-lg font-medium text-fg">
                {t("calendlyTitle")}
              </h2>
              <CalendlyEmbed
                title={t("calendlyTitle")}
                openLabel={t("calendlyOpen")}
                fallbackLabel={t("calendlyFallback")}
              />
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-7">
                <h2 className="text-lg font-medium text-fg">
                  {t("formHeading")}
                </h2>
                <div className="mt-5">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}
