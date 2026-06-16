import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { TrustSignals } from "@/components/sections/TrustSignals";
import { Services } from "@/components/sections/Services";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Calculator } from "@/components/sections/Calculator";
import { AiDemo } from "@/components/sections/AiDemo";
import { HowIWork } from "@/components/sections/HowIWork";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Founder } from "@/components/sections/Founder";
import { FinalCta } from "@/components/sections/FinalCta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustSignals />
      <Services />
      <BeforeAfter />
      <Calculator />
      <AiDemo />
      <HowIWork />
      <Pricing />
      <Faq />
      <Founder />
      <FinalCta />
    </>
  );
}
