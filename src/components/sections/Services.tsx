import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceIcon } from "@/components/brand/ServiceIcons";
import { SERVICE_KEYS } from "@/lib/services";
import { Link } from "@/i18n/navigation";

export async function Services() {
  const t = await getTranslations("Services");

  return (
    <section id="services" className="relative z-10">
      <Container className="py-24 sm:py-28">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 0.06} className="h-full">
              <article className="group h-full rounded-2xl border border-border bg-surface p-6 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent">
                  <ServiceIcon name={key} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-fg">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`${key}.desc`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-2 transition-colors hover:text-fg"
            >
              {t("learnMore")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
