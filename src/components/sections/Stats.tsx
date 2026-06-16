import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/ui/Counter";
import { STATS } from "@/lib/config";

type Item = {
  key: string;
  label: string;
  value?: number;
  suffix?: string;
  staticValue?: string;
};

export async function Stats() {
  const t = await getTranslations("Stats");

  const items: Item[] = [
    { key: "missions", label: t("missions"), value: STATS.missions },
    { key: "clients", label: t("clients"), value: STATS.clients },
    { key: "technologies", label: t("technologies"), value: STATS.technologies, suffix: "+" },
    { key: "availability", label: t("availability"), staticValue: t("availabilityValue") },
  ];

  return (
    <section className="relative z-10">
      <Container className="py-10">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.key} delay={i * 0.06} className="bg-surface">
              <div className="px-6 py-7">
                <dd className="tnum text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                  {it.staticValue !== undefined ? (
                    it.staticValue
                  ) : (
                    <Counter value={it.value ?? 0} suffix={it.suffix} />
                  )}
                </dd>
                <dt className="mt-2 text-sm text-muted">{it.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
