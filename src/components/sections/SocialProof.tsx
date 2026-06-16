import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Cold-start social proof: honest empty slots that fill automatically as real,
 * consented references arrive. No invented logos or testimonials (2026 buyers
 * and EU regulators penalize faked proof).
 */
export async function SocialProof() {
  const t = await getTranslations("SocialProof");

  return (
    <section className="relative z-10">
      <Container className="py-20">
        <Reveal>
          <div className="rounded-3xl border border-border bg-surface/40 px-6 py-14 text-center">
            <h2 className="mx-auto max-w-2xl text-xl font-medium text-fg sm:text-2xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              {t("subtitle")}
            </p>
            <div
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
              aria-hidden="true"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-24 rounded-lg border border-dashed border-border bg-bg/30"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
