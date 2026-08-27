"use client";

import { motion } from "motion/react";

import { useRevealState } from "@/components/motion/reveal";
import { useMotionSafe } from "@/hooks/use-motion-safe";
import { LINE_STEP, lineTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LineRevealProps = {
  lines: readonly string[];
  /** `mount` is for the hero, which plays on load rather than on scroll. */
  trigger?: "inView" | "mount";
  /** Seconds. Defaults to the delay resolved by the enclosing `Reveal`. */
  delay?: number;
  /** Per-line classes, for headings whose lines differ in weight. */
  lineClassNames?: readonly string[];
};

/**
 * Renders each line of a heading inside an overflow mask so the type can slide
 * up from below its own baseline. The caller owns the heading element, which
 * keeps the semantics and the type tokens where they belong.
 *
 * Scroll-triggered lines take their cue from the enclosing `Reveal`, because a
 * masked line is clipped out of view until it has already moved.
 */
export function LineReveal({
  lines,
  trigger = "inView",
  delay,
  lineClassNames,
}: LineRevealProps) {
  const motionSafe = useMotionSafe();
  const { delay: inheritedDelay, inView } = useRevealState();
  const base = delay ?? inheritedDelay;
  const started = trigger === "mount" || inView;

  return (
    <>
      {lines.map((line, index) => (
        <span key={line} className="line-mask">
          <motion.span
            className={cn("block", lineClassNames?.[index])}
            initial={motionSafe ? { y: "100%" } : false}
            animate={motionSafe && started ? { y: "0%" } : undefined}
            transition={lineTransition(base + index * LINE_STEP)}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}
