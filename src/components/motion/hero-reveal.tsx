"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { useMotionSafe } from "@/hooks/use-motion-safe";
import { REVEAL_OFFSET, revealTransition } from "@/lib/motion";

type HeroRevealProps = {
  children: ReactNode;
  /** Position in the hero load sequence, in seconds. */
  at: number;
  className?: string;
};

/**
 * The hero plays on load rather than on scroll, so its pieces animate from a
 * fixed schedule instead of an IntersectionObserver.
 */
export function HeroReveal({ children, at, className }: HeroRevealProps) {
  const motionSafe = useMotionSafe();

  return (
    <motion.div
      data-reveal
      className={className}
      initial={motionSafe ? { opacity: 0, y: REVEAL_OFFSET } : false}
      animate={motionSafe ? { opacity: 1, y: 0 } : undefined}
      transition={revealTransition(at)}
    >
      {children}
    </motion.div>
  );
}
