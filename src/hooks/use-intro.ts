"use client";

import { useState } from "react";

/**
 * Reports whether the opening veil was still up when React took over. The
 * decision itself is made pre-paint by `INTRO_SCRIPT`, so this only reads it
 * once and never changes afterwards — a slow hydration simply lands the hero
 * in its resting state.
 *
 * The value affects animation timing only, never markup, so the server's
 * `false` and the client's first read agree on everything that is rendered.
 */
export function useIntro(): boolean {
  const [playing] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.hasAttribute("data-intro"),
  );

  return playing;
}
