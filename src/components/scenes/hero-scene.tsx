"use client";

import dynamic from "next/dynamic";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useIntro } from "@/hooks/use-intro";

/** Three.js only ships once a viewport actually asks for the scene. */
const StackColumn = dynamic(() => import("@/components/scenes/stack-column"), {
  ssr: false,
});

/**
 * On desktop the column lives in a full-viewport sticky layer behind the type,
 * which is what lets it travel in from the loader and drift on scroll. The
 * layer consumes no layout height, so it can mount whenever it is ready.
 */
export function HeroSceneLayer() {
  const breakpoint = useBreakpoint();
  const intro = useIntro();

  if (breakpoint !== "lg") return null;

  return (
    <div className="sticky-layer pointer-events-none z-0 intro:z-61">
      <StackColumn breakpoint={breakpoint} intro={intro} />
    </div>
  );
}

/**
 * Below 1024px the column sits in the hero flow instead: there is no
 * full-viewport object for it to travel across, so it assembles in place.
 *
 * Its box is sized in CSS so the hero is its final height from the first paint;
 * only the canvas waits on the breakpoint.
 */
export function HeroSceneInline() {
  const breakpoint = useBreakpoint();
  const intro = useIntro();

  return (
    <div className="lg:hidden">
      <div className="mt-7.5 h-57.5 w-full md:mt-10 md:h-80">
        {breakpoint === "sm" || breakpoint === "md" ? (
          <StackColumn breakpoint={breakpoint} intro={intro} />
        ) : null}
      </div>
      <div className="mt-3.5 flex items-center justify-center gap-2 font-mono text-eyebrow-xs font-medium tracking-badge text-muted uppercase">
        <span>Scroll</span>
        <span aria-hidden="true" className="text-eyebrow leading-none">
          ⌄
        </span>
      </div>
    </div>
  );
}

/** Opaque layer the opening sequence plays behind. Rendered only during it. */
export function IntroVeil() {
  return (
    <div
      aria-hidden="true"
      className="sticky-layer pointer-events-none z-60 hidden bg-ground intro:block"
    />
  );
}
