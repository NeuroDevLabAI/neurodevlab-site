"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { BriefCta } from "@/components/ui/BriefCta";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const c = useTranslations("Cta");
  return (
    <Container className="flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
      <span className="font-mono text-sm text-accent-2">{t("code")}</span>
      <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        {t("title")}{" "}
        <span className="text-gradient">{t("titleAccent")}</span>
      </h1>
      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <BriefCta label={c("primaryShort")} source="not_found" />
        <Link
          href="/"
          className="rounded-full border border-border px-6 py-3 text-[15px] text-fg transition-colors hover:bg-surface"
        >
          {t("home")}
        </Link>
      </div>
    </Container>
  );
}
