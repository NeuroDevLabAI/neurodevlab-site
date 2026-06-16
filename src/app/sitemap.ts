import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";

const PATHS = [
  "",
  "/services",
  "/contact",
  "/legal/notice",
  "/legal/privacy",
] as const;

function urlFor(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => {
    const languages: Record<string, string> = {};
    for (const loc of routing.locales) languages[loc] = urlFor(loc, path);
    languages["x-default"] = urlFor(routing.defaultLocale, path);
    return {
      url: urlFor(routing.defaultLocale, path),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.8,
      alternates: { languages },
    };
  });
}
