import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import { AboutScene } from "@/components/scenes/about-scene";
import {
  Eyebrow,
  Grid12,
  Section,
  SectionHeading,
} from "@/components/ui/section";
import { ABOUT } from "@/lib/content";
import { cn } from "@/lib/utils";

const PARAGRAPH = "text-body-xs font-light text-pretty md:text-body-lg";

export function AboutSection() {
  return (
    <Section id="about">
      <Grid12>
        <div className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <Reveal order={0}>
            <Eyebrow>01 — About</Eyebrow>
          </Reveal>

          <Reveal order={1}>
            <SectionHeading measure="long">
              <LineReveal lines={ABOUT.headline} />
            </SectionHeading>
          </Reveal>

          <Reveal order={2}>
            {/* The phone gets a shorter version of the same paragraph. */}
            <p className={cn(PARAGRAPH, "mt-8.5 text-ink md:hidden")}>
              {ABOUT.bodyShort}
            </p>
            <p className={cn(PARAGRAPH, "mt-8.5 hidden text-ink md:block")}>
              {ABOUT.body}
            </p>
          </Reveal>

          <Reveal order={3}>
            <p className={cn(PARAGRAPH, "mt-5.5 text-muted")}>{ABOUT.aside}</p>
          </Reveal>

          <Reveal order={4}>
            <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line md:mt-15 md:grid-cols-3">
              {ABOUT.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="bg-surface px-4.5 py-3.75 md:px-6.5 md:pt-7 md:pb-6.5"
                >
                  <dd className="text-stat-sm font-light text-ink md:min-h-2lh md:text-stat">
                    {fact.value}
                  </dd>
                  <dt className="mt-2 font-mono text-eyebrow-xs font-medium leading-normal text-muted uppercase md:mt-3.5 md:text-eyebrow">
                    {fact.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal
          order={5}
          className="mt-8.5 rounded-2xl border border-line bg-surface px-8.5 py-8 transition-colors duration-200 hover:border-accent/35 hover:bg-elevated lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:sticky lg:top-24 lg:mt-0"
        >
          <h3 className="font-mono text-eyebrow font-medium text-muted uppercase">
            Now
          </h3>
          <dl className="mt-5.5 flex flex-col">
            {ABOUT.now.map((row, index) => (
              <div
                key={row.key}
                className={cn(
                  "flex justify-between gap-5 py-3",
                  index < ABOUT.now.length - 1 && "border-b border-line",
                )}
              >
                <dt className="text-xs font-normal text-muted md:text-meta">
                  {row.key}
                </dt>
                <dd className="text-right text-xs font-normal text-ink md:text-copy">
                  <span className="md:hidden">{row.valueShort}</span>
                  <span className="hidden md:inline">{row.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <AboutScene />
      </Grid12>
    </Section>
  );
}
