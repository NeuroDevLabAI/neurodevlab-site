import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CONTACT_EMAIL } from "@/lib/config";

/**
 * Shared renderer for the legal pages (T4). Long-form prose, readable measure,
 * a contact block that injects CONTACT_EMAIL from config (single source of
 * truth — the email is never hardcoded in the translated strings).
 */
export async function LegalArticle({
  title,
  intro,
  sections,
}: {
  title: string;
  intro?: string;
  sections: { h: string; b: string }[];
}) {
  const t = await getTranslations("Legal");

  return (
    <div className="pt-28">
      <Container className="py-12">
        <Reveal>
          <p className="eyebrow">{t("updated")}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
          )}
        </Reveal>

        <div className="mt-12 max-w-2xl space-y-8">
          {sections.map((s, i) => (
            <Reveal key={i} delay={Math.min(i, 4) * 0.04}>
              <section>
                <h2 className="text-lg font-medium text-fg">{s.h}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.b}</p>
              </section>
            </Reveal>
          ))}

          <Reveal>
            <section className="rounded-2xl border border-border bg-surface/40 p-6">
              <h2 className="text-lg font-medium text-fg">{t("contactHeading")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t("contactBody")}{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-accent-2 underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>
          </Reveal>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-2 transition-colors hover:text-fg"
          >
            <span aria-hidden="true">←</span> {t("backHome")}
          </Link>
        </div>
      </Container>
    </div>
  );
}
