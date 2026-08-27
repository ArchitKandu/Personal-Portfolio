"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import {
  Eyebrow,
  Grid12,
  Section,
  SectionHeading,
} from "@/components/ui/section";
import { useMotionSafe } from "@/hooks/use-motion-safe";
import { MILESTONES } from "@/lib/content";
import { EASE_EMPHASIS } from "@/lib/motion";
import { cn } from "@/lib/utils";

const HEADLINE = ["From coursework", "to core team."] as const;

/** Newest first, in both the rail and the accordion. */
const ORDER = [...MILESTONES.keys()].reverse();

/** Phones show the first few points of a milestone; the rest need the desktop. */
const PHONE_BULLET_LIMIT = 4;

export function JourneySection() {
  const motionSafe = useMotionSafe();
  // Defaults to the current role, which is the one people are looking for.
  const [selected, setSelected] = useState(MILESTONES.length - 1);
  const [expanded, setExpanded] = useState(0);

  const stage = MILESTONES[selected];

  return (
    <Section id="journey">
      <Grid12>
        <Reveal order={0} className="lg:col-span-12">
          <Eyebrow>03 — Journey</Eyebrow>
        </Reveal>
        <Reveal order={1} className="lg:col-span-7 lg:col-start-1">
          <SectionHeading>
            <LineReveal lines={HEADLINE} />
          </SectionHeading>
        </Reveal>
        <Reveal order={2} className="lg:col-span-7 lg:col-start-1">
          <p className="mt-6.5 text-body-xs font-light text-muted text-pretty md:text-body">
            Four milestones, education and work on one line. Select one to read
            the detail.
          </p>
        </Reveal>
      </Grid12>

      {/*
        Below 1024px the rail and detail pane collapse into an accordion, one
        open at a time, with the current role open on arrival.
      */}
      <div className="mt-7.5 border-t border-line lg:hidden">
        {ORDER.map((index, position) => {
          const milestone = MILESTONES[index];
          const open = expanded === position;
          const panelId = `journey-panel-${position}`;

          return (
            <Reveal key={milestone.title} order={position}>
              <div className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setExpanded(open ? -1 : position)}
                  className="flex min-h-15 w-full cursor-pointer items-start justify-between gap-4 px-0.5 py-4 text-left"
                >
                  <span className="flex flex-col gap-1.75">
                    <span className="font-mono text-eyebrow-xs font-medium text-muted">
                      {milestone.dates}
                    </span>
                    <span className="text-copy-lg leading-tight font-light text-ink">
                      {milestone.title}
                    </span>
                    <span className="font-mono text-eyebrow-xs font-medium text-muted uppercase">
                      {milestone.org}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex-none text-body-sm leading-none font-light transition-[transform,color] duration-300 ease-emphasis",
                      open ? "rotate-45 text-accent" : "text-muted",
                    )}
                  >
                    +
                  </span>
                </button>

                <motion.div
                  id={panelId}
                  role="region"
                  initial={false}
                  animate={{ height: open ? "auto" : 0 }}
                  transition={{ duration: motionSafe ? 0.36 : 0, ease: EASE_EMPHASIS }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      "flex flex-col gap-3 px-0.5 pb-5 transition-opacity duration-280 ease-in",
                      open ? "opacity-100 delay-90" : "opacity-0",
                    )}
                  >
                    {milestone.bullets.map((bullet, bulletIndex) => (
                      <div
                        key={bullet}
                        className={cn(
                          "gap-3",
                          bulletIndex >= PHONE_BULLET_LIMIT
                            ? "hidden md:flex"
                            : "flex",
                        )}
                      >
                        <span className="mt-1.75 size-1 flex-none rounded-full bg-glow/55" />
                        <span className="text-mini font-light text-muted text-pretty">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <Grid12 className="mt-16">
          <div className="flex flex-col lg:col-span-4 lg:sticky lg:top-24">
            {ORDER.map((index, position) => {
              const milestone = MILESTONES[index];
              const active = selected === index;

              return (
                <Reveal key={milestone.title} order={position}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(index)}
                    onFocus={() => setSelected(index)}
                    className="relative block w-full cursor-pointer text-left"
                  >
                    <span
                      className={cn(
                        "absolute top-5 left-0 z-1 size-2.75 rounded-full",
                        active ? "bg-accent" : "bg-glow",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute top-5 left-1.25 w-px bg-line",
                        position === ORDER.length - 1 ? "bottom-full" : "-bottom-5",
                      )}
                    />
                    <span
                      className={cn(
                        "ml-7.25 flex flex-col items-start gap-3 rounded-card border px-5 pt-3.5 pb-4 transition-colors duration-200 hover:bg-elevated",
                        active
                          ? "border-accent/35 bg-elevated"
                          : "border-transparent",
                      )}
                    >
                      <span className="font-mono text-eyebrow font-medium text-muted">
                        {milestone.dates}
                      </span>
                      <span
                        className={cn(
                          "text-title text-ink",
                          active ? "font-normal" : "font-light",
                        )}
                      >
                        {milestone.short}
                      </span>
                      <span className="font-mono text-eyebrow font-medium text-muted uppercase">
                        {milestone.kind}
                      </span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>

          <div className="rounded-panel border border-line-strong bg-surface px-11.5 py-11 lg:col-span-8 lg:col-start-5">
            <div className="flex items-baseline justify-between gap-6">
              <div>
                <h3 className="text-title-lg font-normal text-ink">
                  {stage.title}
                </h3>
                <p className="mt-2.5 font-mono text-eyebrow font-medium text-accent uppercase">
                  {stage.org}
                </p>
              </div>
              <p className="font-mono text-eyebrow font-medium whitespace-nowrap text-muted">
                {stage.dates}
              </p>
            </div>

            {stage.note ? (
              <p className="mt-5.5 inline-flex min-h-11 items-center rounded-full border border-line bg-elevated px-4.5 font-mono text-eyebrow font-medium text-ink">
                {stage.note}
              </p>
            ) : null}

            <div aria-hidden="true" className="my-8.5 h-px bg-line" />

            <ul className="flex flex-col gap-5">
              {stage.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-4">
                  <span className="mt-2.25 size-1.5 flex-none rounded-full bg-glow" />
                  <span className="text-body-sm font-light text-ink text-pretty">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Grid12>
      </div>
    </Section>
  );
}
