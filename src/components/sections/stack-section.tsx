"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import {
  Eyebrow,
  Grid12,
  Section,
  SectionHeading,
} from "@/components/ui/section";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import {
  findStackCategory,
  PRIMARY_STACK,
  STACK_CATEGORIES,
  STACK_DEFAULT,
  STACK_NOTES,
} from "@/lib/content";
import { buildStackWeb, STAGE_HEIGHT } from "@/lib/stack-web";
import { cn } from "@/lib/utils";

/** The stage width at a 1440px viewport, used until it is measured. */
const DEFAULT_STAGE_WIDTH = 1248;

/** How far the stage tilts toward the pointer, in degrees. */
const TILT = { x: 5, y: 7 } as const;

const CORE_TICKS = [0, 45, 90, 135, 180, 225, 270, 315] as const;

const HEADLINE = ["The technologies", "I build with."] as const;

export function StackSection() {
  const breakpoint = useBreakpoint();
  const [skill, setSkill] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [stageWidth, setStageWidth] = useState(DEFAULT_STAGE_WIDTH);
  const stageRef = useRef<HTMLDivElement>(null);

  // `null` is the pre-hydration render, which is prerendered at desktop width.
  const showWeb = breakpoint === null || breakpoint === "lg";

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0].contentRect.width);
      if (width > 0) setStageWidth(width);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // The relaxation pass is the only expensive work on the page, so it is kept
  // to one run per stage width and skipped entirely on narrow viewports.
  const web = useMemo(
    () => (showWeb ? buildStackWeb(stageWidth) : null),
    [showWeb, stageWidth],
  );

  const activeCategory = skill ? findStackCategory(skill) : STACK_DEFAULT.category;
  const activeSkill = skill ?? STACK_DEFAULT.skill;
  const activeNote = skill
    ? (STACK_NOTES[skill] ?? `${findStackCategory(skill)} — part of my working stack.`)
    : STACK_DEFAULT.note;

  const onPointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <Section id="stack">
      <Grid12>
        <Reveal order={0} className="lg:col-span-12">
          <Eyebrow>02 — Stack</Eyebrow>
        </Reveal>
        <Reveal order={1} className="lg:col-span-7 lg:col-start-1">
          <SectionHeading>
            <LineReveal lines={HEADLINE} />
          </SectionHeading>
        </Reveal>
        <Reveal order={2} className="lg:col-span-7 lg:col-start-1">
          <p className="mt-6.5 text-body-xs font-light text-muted text-pretty md:text-body">
            <span className="lg:hidden">
              Grouped by category. Heavier borders mark what I reach for daily.
            </span>
            <span className="hidden lg:inline">
              Grouped by category. Select a technology — click, tap or keyboard
              focus — to see where it sits in my work. Larger nodes with heavier
              borders are what I use daily.
            </span>
          </p>
        </Reveal>
      </Grid12>

      {/*
        Below 1024px the radial web becomes stacked category groups: the labels
        collide at that width and panning would fight the page scroll.
      */}
      <div className="mt-3.5 lg:hidden">
        {STACK_CATEGORIES.map((category, index) => (
          <Reveal key={category.name} order={index} className="mt-5">
            <div className="font-mono text-eyebrow-xs font-medium tracking-badge text-muted uppercase">
              {category.name}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.items.map((item) => {
                const primary = PRIMARY_STACK.includes(item);
                return (
                  <span
                    key={item}
                    className={cn(
                      "inline-flex items-center rounded-full font-mono font-medium whitespace-nowrap",
                      primary
                        ? "border-2 border-accent/42 px-3.5 py-2 text-eyebrow text-ink"
                        : "border border-line px-3 py-1.75 text-tag text-muted",
                    )}
                  >
                    {item}
                  </span>
                );
              })}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="hidden lg:block">
        <Reveal className="mt-12 perspective-stage">
          <div
            ref={stageRef}
            onMouseMove={onPointerMove}
            className="preserve-3d relative w-full transition-transform duration-600 ease-stage"
            style={{
              height: `${STAGE_HEIGHT}px`,
              transform: `rotateX(${-tilt.y * TILT.x}deg) rotateY(${tilt.x * TILT.y}deg)`,
            }}
          >
            {web?.edges.map((edge, index) => (
              <span
                key={`edge-${index}`}
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute h-px origin-top-left bg-linear-to-r",
                  edge.spoke
                    ? "from-glow/28 to-glow/6"
                    : "from-glow/5 to-glow/22",
                )}
                style={{
                  left: `${edge.x}px`,
                  top: `${edge.y}px`,
                  width: `${edge.length}px`,
                  transform: `translateZ(${edge.depth}px) rotate(${edge.angle}rad)`,
                }}
              />
            ))}

            {web ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute flex items-center justify-center"
                style={{
                  left: `${web.core.x - web.core.size / 2}px`,
                  top: `${web.core.y - web.core.size / 2}px`,
                  width: `${web.core.size}px`,
                  height: `${web.core.size}px`,
                  transform: `translateZ(${web.core.depth}px)`,
                }}
              >
                {CORE_TICKS.map((angle) => (
                  <span
                    key={angle}
                    className="absolute top-1/2 left-1/2 h-21 w-px origin-top bg-linear-to-b from-glow/22 to-transparent to-70%"
                    style={{ transform: `rotate(${angle}deg)` }}
                  />
                ))}
                <span className="absolute inset-0 rounded-full border border-dashed border-glow/32" />
                <span className="absolute inset-6.5 rounded-full border border-glow/22" />
                <span className="absolute inset-13 rounded-full border border-glow/14 bg-ground" />
                <span className="relative flex flex-col items-center gap-1.25 font-mono text-eyebrow font-medium text-ink uppercase">
                  <span className="size-1.75 rounded-full bg-accent" />
                  <span>Stack</span>
                  <span className="text-eyebrow text-muted">
                    {web.nodes.length}
                  </span>
                </span>
              </span>
            ) : null}

            {web?.hubs.map((hub) => (
              <span
                key={hub.label}
                aria-hidden="true"
                className="absolute flex items-center justify-center rounded-full border border-dashed border-glow/35 bg-ground font-mono text-eyebrow font-medium text-muted uppercase"
                style={{
                  left: `${hub.x - hub.width / 2}px`,
                  top: `${hub.y - hub.height / 2}px`,
                  width: `${hub.width}px`,
                  height: `${hub.height}px`,
                  transform: `translateZ(${hub.depth}px)`,
                }}
              >
                {hub.label}
              </span>
            ))}

            {web?.nodes.map((node) => {
              const selected = skill === node.label;
              return (
                <button
                  key={node.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSkill(node.label)}
                  onFocus={() => setSkill(node.label)}
                  onMouseEnter={() => setSkill(node.label)}
                  className={cn(
                    "absolute inline-flex cursor-pointer items-center justify-center rounded-full font-mono font-medium whitespace-nowrap text-ink transition-colors duration-160 hover:border-accent/50",
                    node.primary
                      ? "border-2 px-5 text-cta"
                      : "px-3.5 text-meta",
                    selected
                      ? "border-2 border-accent bg-accent/12"
                      : node.primary
                        ? "border-accent/40 bg-surface"
                        : "border border-line bg-surface",
                  )}
                  style={{
                    left: `${node.x - node.width / 2}px`,
                    top: `${node.y - node.height / 2}px`,
                    minWidth: `${node.width}px`,
                    minHeight: `${node.height}px`,
                    transform: `translateZ(${node.depth}px)`,
                  }}
                >
                  {node.label}
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      <Reveal className="hidden lg:block">
        <Grid12 className="mt-12">
          <div
            aria-live="polite"
            className="rounded-card border border-line bg-surface px-7.5 py-7 lg:col-span-6"
          >
            <h3 className="font-mono text-eyebrow font-medium text-muted uppercase">
              {activeCategory}
            </h3>
            <p className="mt-3.5 text-title-xl font-light text-ink">
              {activeSkill}
            </p>
            <p className="mt-3.5 text-copy font-normal text-muted text-pretty">
              {activeNote}
            </p>
          </div>
        </Grid12>
      </Reveal>
    </Section>
  );
}
