import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, Grid12, Section } from "@/components/ui/section";
import { UtilityLinks } from "@/components/ui/utility-links";
import { CONTACT, SITE, SOCIAL_LINKS } from "@/lib/content";

export function ContactSection() {
  return (
    <Section id="contact">
      {/* Phones centre the whole block; wider viewports keep it left-aligned. */}
      <Grid12 className="justify-items-center text-center md:justify-items-stretch md:text-left">
        <Reveal order={0} className="lg:col-span-12">
          <Eyebrow>05 — Contact</Eyebrow>
        </Reveal>

        <Reveal order={1} className="lg:col-span-9 lg:col-start-1">
          <h2 className="mt-5 text-headline-sm font-light text-ink md:mt-7.5 md:text-headline-md lg:text-headline-lg">
            <LineReveal lines={CONTACT.headline} />
          </h2>
        </Reveal>

        <Reveal order={2} className="lg:col-span-7 lg:col-start-1">
          <a
            href={`mailto:${SITE.email}`}
            className="mt-6.5 inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-4 text-cta-sm font-medium text-ground transition duration-200 hover:brightness-105 md:mt-12 md:px-10 md:py-4.5 md:text-cta-lg"
          >
            {SITE.email}
          </a>
        </Reveal>

        <Reveal order={3} className="lg:col-span-12">
          <UtilityLinks
            center
            className="mt-9 md:justify-start md:gap-1.5"
            links={[
              ...SOCIAL_LINKS,
              { label: SITE.phone, href: SITE.phoneHref, phoneHidden: true },
            ]}
          />
        </Reveal>
      </Grid12>

      <footer className="mt-14 flex flex-col items-center justify-center gap-2.5 border-t border-line pt-8 text-center font-mono text-eyebrow-xs font-medium text-muted uppercase md:mt-30 md:flex-row md:justify-between md:gap-0 md:text-left md:text-eyebrow">
        <span>{`${SITE.name} — ${SITE.role}`}</span>
        <span>{SITE.location}</span>
      </footer>
    </Section>
  );
}
