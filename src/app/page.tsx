import { DesktopNav } from "@/components/nav/desktop-nav";
import { MobileNav } from "@/components/nav/mobile-nav";
import { SectionIndicator } from "@/components/nav/section-indicator";
import { ActiveSectionProvider } from "@/components/providers/active-section-provider";
import { HeroSceneLayer, IntroVeil } from "@/components/scenes/hero-scene";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { JourneySection } from "@/components/sections/journey-section";
import { StackSection } from "@/components/sections/stack-section";
import { WorkSection } from "@/components/sections/work-section";

export default function Home() {
  return (
    <ActiveSectionProvider>
      <div className="relative">
        <IntroVeil />
        <HeroSceneLayer />

        {/* Everything readable sits above the scene layer. */}
        <div className="relative z-1">
          <DesktopNav />
          <SectionIndicator />
          <MobileNav />

          <main>
            <HeroSection />
            <AboutSection />
            <StackSection />
            <JourneySection />
            <WorkSection />
            <ContactSection />
          </main>
        </div>
      </div>
    </ActiveSectionProvider>
  );
}
