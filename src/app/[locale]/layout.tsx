import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { routing } from "@/i18n/routing";
import {
  SITE_URL,
  OG_LOCALES,
  buildAlternates,
  CONTACT_EMAIL,
  GITHUB_URL,
} from "@/lib/config";
import { SiteBackground } from "@/components/layout/SiteBackground";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { ExitIntent } from "@/components/interactions/ExitIntent";
import { Analytics } from "@/components/Analytics";
import { ScrollTracking } from "@/components/ScrollTracking";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const ogImage = `/og?locale=${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("homeTitle"), template: "%s" },
    description: t("homeDescription"),
    applicationName: "NeuroDevLab",
    authors: [{ name: "NeuroDevLab" }],
    creator: "NeuroDevLab",
    alternates: buildAlternates(locale, ""),
    openGraph: {
      type: "website",
      siteName: "NeuroDevLab",
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: buildAlternates(locale, "").canonical,
      locale: OG_LOCALES[locale],
      alternateLocale: Object.values(OG_LOCALES).filter(
        (l) => l !== OG_LOCALES[locale],
      ),
      images: [{ url: ogImage, width: 1200, height: 630, alt: "NeuroDevLab" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const cta = await getTranslations("Cta");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    name: "NeuroDevLab",
    description: meta("homeDescription"),
    url: SITE_URL,
    image: `${SITE_URL}/og?locale=${locale}`,
    logo: `${SITE_URL}/icon-512.png`,
    email: CONTACT_EMAIL,
    areaServed: ["Switzerland", "Europe"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lausanne",
      addressCountry: "CH",
    },
    geo: { "@type": "GeoCoordinates", latitude: 46.5197, longitude: 6.6323 },
    priceRange: "$$",
    sameAs: [GITHUB_URL],
    knowsAbout: [
      "AI automation",
      "n8n",
      "Make",
      "Zapier",
      "API integration",
      "Telegram bots",
      "Web scraping",
      "Python",
      "Next.js",
    ],
  };

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-fg antialiased">
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: ".reveal{opacity:1 !important;transform:none !important}",
            }}
          />
        </noscript>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:border focus:border-border focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-sm focus:text-fg"
          >
            {nav("skip")}
          </a>
          <SiteBackground />
          <ScrollProgress />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <StickyCTA label={cta("primaryShort")} />
          <ExitIntent />
          <ScrollTracking />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
