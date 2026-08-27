"use client";

import { LineReveal } from "@/components/motion/line-reveal";
import { HeroReveal } from "@/components/motion/hero-reveal";
import { useActiveSection } from "@/components/providers/active-section-provider";
import { HeroSceneInline } from "@/components/scenes/hero-scene";
import { Grid12 } from "@/components/ui/section";
import { UtilityLinks } from "@/components/ui/utility-links";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useIntro } from "@/hooks/use-intro";
import { HERO, SITE } from "@/lib/content";
import { INTRO_STAGGER_OFFSET } from "@/lib/intro";

/** Where each piece of the hero enters, in milliseconds after load. */
const SCHEDULE = {
  eyebrow: 0,
  name: 120,
  lead: 380,
  primaryCta: 500,
  secondaryCta: 560,
  links: 640,
} as const;

/** Narrow viewports run the same sequence slightly quicker. */
const NARROW_SCALE = 0.8;

const CTA_BASE =
  "min-h-11 w-full cursor-pointer rounded-full px-3 py-3.75 text-center text-cta-sm transition duration-200 md:px-8.5 md:py-4 md:text-cta";

export function HeroSection() {
  const { scrollToSection } = useActiveSection();
  const breakpoint = useBreakpoint();
  const intro = useIntro();

  const scale = breakpoint !== null && breakpoint !== "lg" ? NARROW_SCALE : 1;
  const offset = intro ? INTRO_STAGGER_OFFSET : 0;
  /** Converts a schedule step into the seconds motion expects. */
  const at = (ms: number) => (ms / 1000) * scale + offset;

  return (
    <section
      id="hero"
      className="relative scroll-mt-24 lg:-mt-15.5 lg:flex lg:min-h-235 lg:items-center"
    >
      <div className="mx-auto w-full max-w-page px-4.5 py-9.5 md:px-8 md:py-16 lg:px-gutter lg:py-section">
        <Grid12>
          <div className="lg:col-span-8">
            <HeroReveal
              at={at(SCHEDULE.eyebrow)}
              className="flex items-center gap-3.5 font-mono text-eyebrow-xs font-medium text-accent uppercase md:text-eyebrow"
            >
              <span className="size-2 flex-none animate-beacon rounded-full bg-accent" />
              <span>{SITE.availability}</span>
            </HeroReveal>

            <h1 className="mt-5.5 text-display-sm font-extralight text-ink md:mt-8.5 md:text-display-md lg:text-display">
              <LineReveal
                trigger="mount"
                delay={at(SCHEDULE.name)}
                lines={[HERO.firstName, HERO.lastName]}
                lineClassNames={["", "font-medium"]}
              />
            </h1>

            <HeroReveal at={at(SCHEDULE.lead)}>
              <p className="mt-9.5 max-w-lead text-body-xs font-light text-ink text-pretty md:text-lead">
                {HERO.lead}
              </p>
            </HeroReveal>

            <div className="mt-6.5 flex flex-col gap-2 xs:flex-row xs:gap-2.25 md:mt-11 md:gap-3.5">
              <HeroReveal
                at={at(SCHEDULE.primaryCta)}
                className="xs:flex-1 md:flex-none"
              >
                <button
                  type="button"
                  onClick={() => scrollToSection("work")}
                  className={`${CTA_BASE} bg-accent font-medium text-ground hover:brightness-105`}
                >
                  View my work
                </button>
              </HeroReveal>
              <HeroReveal
                at={at(SCHEDULE.secondaryCta)}
                className="xs:flex-1 md:flex-none"
              >
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className={`${CTA_BASE} border border-line font-normal text-ink hover:border-accent hover:bg-elevated`}
                >
                  Let’s connect
                </button>
              </HeroReveal>
            </div>

            <HeroReveal
              at={at(SCHEDULE.links)}
              className="mt-5 md:mt-10"
            >
              <UtilityLinks
                links={[
                  { label: "architkandu.com", href: SITE.url },
                  { label: "GitHub", href: SITE.github },
                  { label: "LinkedIn", href: SITE.linkedin },
                  { label: "Email", href: `mailto:${SITE.email}` },
                ]}
              />
            </HeroReveal>
          </div>
        </Grid12>

        <HeroReveal
          at={at(SCHEDULE.links)}
          className="mt-16 hidden items-center gap-3.5 font-mono text-eyebrow font-medium text-muted uppercase lg:flex"
        >
          <span>Scroll</span>
          <span
            aria-hidden="true"
            className="h-px w-11 bg-linear-to-r from-muted to-transparent"
          />
        </HeroReveal>

        <HeroSceneInline />
      </div>
    </section>
  );
}
