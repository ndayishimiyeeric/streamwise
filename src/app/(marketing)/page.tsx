import { cn } from "@/lib/utils";

import { About } from "./_components/about";
import { Contact } from "./_components/contact";
import { CTA } from "./_components/cta";
import { Feature } from "./_components/features";
import Hero from "./_components/hero";
import { Pricing } from "./_components/pricing";
import SectionWrapper from "./_components/section-wrapper";
import { styles } from "./_components/styles";

const FeaturesSection = SectionWrapper({ Component: Feature, idName: "features" });
const PricingSection = SectionWrapper({ Component: Pricing, idName: "pricing" });
const HeroSection = SectionWrapper({ Component: Hero, idName: "home" });
const ContactSection = SectionWrapper({ Component: Contact, idName: "contact" });

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden pb-30 pt-20">
      <HeroSection />
      <div className={cn(styles.paddingX, styles.flexStart, "")}>
        <div className={cn(styles.boxWidth, "")}>
          <FeaturesSection />
          <About />
          <CTA />
          <PricingSection />
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
