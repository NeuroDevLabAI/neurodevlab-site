import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { Founder } from "@/components/sections/Founder";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { SocialProof } from "@/components/sections/SocialProof";
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
      <Stats />
      <Services />
      <Founder />
      <CaseStudies />
      <SocialProof />
      <FinalCta />
    </>
  );
}
