import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalArticle } from "@/components/legal/LegalArticle";
import { OG_LOCALES, buildAlternates } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const alt = buildAlternates(locale, "/legal/privacy");
  return {
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    alternates: alt,
    openGraph: {
      title: t("privacyTitle"),
      description: t("privacyDescription"),
      url: alt.canonical,
      locale: OG_LOCALES[locale],
      images: [{ url: `/og?locale=${locale}`, width: 1200, height: 630 }],
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LegalPrivacy");

  const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    h: t(`s${n}h`),
    b: t(`s${n}b`),
  }));

  return <LegalArticle title={t("title")} intro={t("intro")} sections={sections} />;
}
