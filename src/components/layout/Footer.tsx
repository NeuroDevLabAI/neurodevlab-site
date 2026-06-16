import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAIL, GITHUB_URL, LOCATION } from "@/lib/config";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  const triune = [t("neuro"), t("dev"), t("lab")];

  return (
    <footer className="relative z-10 border-t border-border bg-bg/60">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {t("tagline")}
            </p>
            <ul className="mt-5 space-y-1.5">
              {triune.map((line) => (
                <li key={line} className="font-mono text-xs text-subtle">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow mb-4">{t("navHeading")}</h2>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">
                  {nav("home")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition-colors hover:text-fg">
                  {nav("services")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-fg">
                  {nav("contact")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow mb-4">{t("contactHeading")}</h2>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-fg"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-fg"
                >
                  github.com/NeuroDevLabAI
                </a>
              </li>
              <li>{LOCATION}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-subtle sm:flex-row sm:items-center">
          <p>
            © {year} NeuroDevLab. {t("rights")}
          </p>
          <p className="font-mono">{LOCATION}</p>
        </div>
      </Container>
    </footer>
  );
}
