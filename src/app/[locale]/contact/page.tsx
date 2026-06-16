import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CalendlyButton } from "@/components/ui/CalendlyButton";
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
  const c = await getTranslations("Cta");
  const g = await getTranslations("Guarantee");

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
          {/* Primary path — the structured brief. */}
          <div className="lg:col-span-3">
            <Reveal>
              <div
                id="brief"
                className="scroll-mt-28 rounded-2xl border border-border bg-surface/40 p-6 sm:p-7"
              >
                <h2 className="text-lg font-medium text-fg">{t("formHeading")}</h2>
                <div className="mt-5">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Secondary path — discreet, async-first model: a call is the exception. */}
          <div className="lg:col-span-2">
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-border bg-surface/25 p-6 sm:p-7">
                <h2 className="text-lg font-medium text-fg">
                  {t("secondaryHeading")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t("secondarySubtitle")}
                </p>
                <div className="mt-5">
                  <CalendlyButton
                    label={c("secondaryShort")}
                    source="contact_secondary"
                    variant="secondary"
                    className="w-full"
                  />
                </div>
                <p className="mt-6 flex items-start gap-2 border-t border-border pt-5 text-sm text-subtle">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-accent"
                  >
                    <path
                      d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {g("text")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}
