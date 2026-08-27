"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useMotionSafe } from "@/hooks/use-motion-safe";
import {
  GROUP_CAP,
  GROUP_STEP,
  REVEAL_OFFSET,
  REVEAL_VIEWPORT,
  revealTransition,
} from "@/lib/motion";

type RevealState = {
  /** Seconds of stagger the enclosing group resolved to. */
  delay: number;
  /** Whether the group has been scrolled into view yet. */
  inView: boolean;
};

/**
 * A masked line of type sits entirely outside its `overflow: hidden` parent
 * until it animates, so its own IntersectionObserver would never fire — it is
 * clipped, therefore not intersecting, therefore never revealed. The enclosing
 * group is observed instead and shares its state down here.
 */
const RevealContext = createContext<RevealState>({ delay: 0, inView: true });

export function useRevealState(): RevealState {
  return useContext(RevealContext);
}

/**
 * Siblings inside one visual group stage in, capped so long groups do not
 * accumulate a noticeable wait. Narrow viewports use a shorter ramp.
 */
export function useGroupDelay(order: number): number {
  const breakpoint = useBreakpoint();
  const narrow = breakpoint !== null && breakpoint !== "lg";
  const step = narrow ? GROUP_STEP.narrow : GROUP_STEP.lg;
  const cap = narrow ? GROUP_CAP.narrow : GROUP_CAP.lg;
  return Math.min(order, cap) * step;
}

type RevealProps = {
  children: ReactNode;
  /** Position within the enclosing group, used to derive the stagger. */
  order?: number;
  className?: string;
};

/**
 * Fades and lifts its contents into place the first time they scroll into view.
 * The hidden state only exists once React is running — see the `noscript`
 * override in the root layout, which keeps the page readable without scripts.
 */
export function Reveal({ children, order = 0, className }: RevealProps) {
  const motionSafe = useMotionSafe();
  const delay = useGroupDelay(order);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      initial={motionSafe ? { opacity: 0, y: REVEAL_OFFSET } : false}
      animate={motionSafe && inView ? { opacity: 1, y: 0 } : undefined}
      transition={revealTransition(delay)}
    >
      <RevealContext.Provider
        value={{
          delay: motionSafe ? delay : 0,
          inView: motionSafe ? inView : true,
        }}
      >
        {children}
      </RevealContext.Provider>
    </motion.div>
  );
}
