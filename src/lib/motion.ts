import type { Transition } from "motion/react";

/** Mirrors `--ease-emphasis` in `globals.css`. */
export const EASE_EMPHASIS = [0.22, 1, 0.36, 1] as const;

/** Shared timings, in seconds, for the reveal system. */
export const REVEAL_DURATION = 0.6;
export const LINE_DURATION = 0.7;
export const LINE_STEP = 0.08;

/** Stagger applied to siblings inside one reveal group. */
export const GROUP_STEP = { lg: 0.07, narrow: 0.05 } as const;
export const GROUP_CAP = { lg: 5, narrow: 3 } as const;

export const REVEAL_OFFSET = 20;

export const revealTransition = (delay: number): Transition => ({
  duration: REVEAL_DURATION,
  ease: EASE_EMPHASIS,
  delay,
});

export const lineTransition = (delay: number): Transition => ({
  duration: LINE_DURATION,
  ease: EASE_EMPHASIS,
  delay,
});

/** Matches the design's IntersectionObserver threshold and bottom margin. */
export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -12% 0px",
} as const;
