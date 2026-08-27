"use client";

import { useEffect, useState } from "react";

import { MEDIA } from "@/lib/breakpoints";

export type Breakpoint = "sm" | "md" | "lg";

function resolve(): Breakpoint {
  if (window.matchMedia(MEDIA.lg).matches) return "lg";
  if (window.matchMedia(MEDIA.md).matches) return "md";
  return "sm";
}

/**
 * Returns the active breakpoint, or `null` until the first client render.
 * Layout that can be expressed in CSS should use responsive utilities instead;
 * this is for behaviour that genuinely has to branch in JavaScript, such as
 * where the WebGL scene is mounted.
 */
export function useBreakpoint(): Breakpoint | null {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const lists = [window.matchMedia(MEDIA.lg), window.matchMedia(MEDIA.md)];
    const update = () => setBreakpoint(resolve());

    update();
    lists.forEach((list) => list.addEventListener("change", update));
    return () => {
      lists.forEach((list) => list.removeEventListener("change", update));
    };
  }, []);

  return breakpoint;
}
