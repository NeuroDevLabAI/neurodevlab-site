import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Short founder section, placed between Services and Case Studies.
 * Photo lives at /public/founder.jpg (drop the real file there before go-live).
 * The framed container reads as intentional even if the image 404s.
 */
export async function Founder() {
  const t = await getTranslations("Founder");

  return (
    <section className="relative z-10 border-t border-border">
      <Container className="py-24">
        <Reveal>
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface ring-1 ring-accent/20 sm:h-40 sm:w-40">
              <Image
                src="/founder.jpg"
                alt={t("name")}
                width={160}
                height={160}
                sizes="160px"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="eyebrow">{t("eyebrow")}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("name")}{" "}
                <span className="text-muted">— {t("role")}</span>
              </h2>
              <p className="mt-4 max-w-xl text-muted">{t("bio")}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
