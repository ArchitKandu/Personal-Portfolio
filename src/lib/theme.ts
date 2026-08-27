/**
 * Bridges the CSS design tokens into the WebGL scenes, which cannot consume
 * Tailwind utilities. Colours stay defined once, in `globals.css`.
 */

export const THEME_TOKENS = {
  glow: "--color-glow",
  accent: "--color-accent",
} as const;

/**
 * The page background, for the one consumer that cannot read a CSS variable:
 * the `theme-color` meta tag, which the browser applies to its own chrome
 * before any stylesheet is parsed. Keep it in step with `--color-ground`.
 */
export const GROUND_COLOR = "#0b0910";

export type ThemeToken = keyof typeof THEME_TOKENS;

/** Reads a token from the document root. Client-only by design. */
export function readThemeColor(token: ThemeToken): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(THEME_TOKENS[token])
    .trim();
}
