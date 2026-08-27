import Link from "next/link";

import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import {
  Eyebrow,
  Grid12,
  Section,
  SectionHeading,
} from "@/components/ui/section";
import { PROJECTS, SITE } from "@/lib/content";
import { ordinal } from "@/lib/utils";

const HEADLINE = ["Things I’ve built", "outside the product."] as const;

export function WorkSection() {
  return (
    <Section id="work">
      <Grid12>
        <Reveal order={0} className="lg:col-span-12">
          <Eyebrow>04 — Selected work</Eyebrow>
        </Reveal>
        <Reveal order={1} className="lg:col-span-7 lg:col-start-1">
          <SectionHeading>
            <LineReveal lines={HEADLINE} />
          </SectionHeading>
        </Reveal>
        <Reveal
          order={2}
          className="lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:-mb-1.5 lg:self-end lg:justify-self-end"
        >
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center pr-2 font-mono text-eyebrow font-medium text-muted uppercase transition-colors duration-220 hover:text-accent lg:mt-0 lg:pl-2"
          >
            All repositories ↗
          </a>
        </Reveal>
      </Grid12>

      {/*
        A numbered index rather than a gallery: no imagery to art-direct, and it
        absorbs any number of projects without the layout changing shape.
      */}
      <div className="mt-14 border-b border-line">
        {PROJECTS.map((project, index) => (
          <Reveal key={project.slug} order={index}>
            <Link
              href={`/work/${project.slug}`}
              className="group grid grid-cols-work items-baseline gap-x-3 border-t border-line px-0.5 py-4 transition-colors duration-220 hover:border-accent/35 hover:bg-surface md:flex md:gap-5.5 md:px-3.5 md:py-5.5"
            >
              <span className="col-start-1 row-start-1 font-mono text-eyebrow-sm tracking-num text-faint transition-colors duration-220 group-hover:text-accent md:flex-none md:text-eyebrow">
                {ordinal(index)}
              </span>
              <span className="col-start-2 row-start-1 text-row-sm font-light text-ink md:min-w-52 md:flex-none md:text-row">
                {project.name}
              </span>
              <span className="col-start-2 row-start-2 mt-1.5 text-mini font-normal text-muted md:mt-0 md:min-w-0 md:flex-1 md:text-body-xs md:whitespace-nowrap">
                {project.summary}
              </span>
              <span className="hidden font-mono text-eyebrow font-medium tracking-tag text-faint uppercase lg:block lg:flex-none">
                {project.tags.slice(0, 2).join(" · ")}
              </span>
              <span
                aria-hidden="true"
                className="col-start-3 row-span-2 row-start-1 self-center text-copy-lg font-normal text-muted transition duration-220 group-hover:translate-x-1.5 group-hover:text-accent md:flex-none md:self-baseline"
              >
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
