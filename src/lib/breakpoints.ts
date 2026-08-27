/**
 * The one definition of the two breakpoints the layout branches on. These
 * mirror Tailwind's default `md` and `lg` screens, which are rem-based so they
 * scale with the reader's font size — anything reading them in JavaScript has
 * to use the same units or the two can disagree.
 */
export const MEDIA = {
  md: "(min-width: 48rem)",
  lg: "(min-width: 64rem)",
} as const;

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const COARSE_POINTER = "(pointer: coarse)";
