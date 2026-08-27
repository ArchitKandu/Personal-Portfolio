"use client";

import dynamic from "next/dynamic";

import { useBreakpoint } from "@/hooks/use-breakpoint";

const CommitGraph = dynamic(() => import("@/components/scenes/commit-graph"), {
  ssr: false,
});

/**
 * Ambient graph beside the About copy. Desktop only — below that width there is
 * no column left to give it, and it would only compete with the text.
 *
 * The space it occupies is reserved in CSS rather than by mounting, so the
 * section is its final height from the first paint. Only the canvas itself waits
 * for the breakpoint, which keeps a WebGL context off narrow devices.
 */
export function AboutScene() {
  const breakpoint = useBreakpoint();

  return (
    <div className="mt-9 hidden h-105 w-full self-end lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:block">
      {breakpoint === "lg" ? <CommitGraph /> : null}
    </div>
  );
}
