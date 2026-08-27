import type { ReactNode } from "react";

import type { SectionId } from "@/lib/content";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: SectionId;
  children: ReactNode;
  className?: string;
  /** The hero has no rule above it. */
  divider?: boolean;
};

/**
 * One section of the page: the anchor target, the top rule, and the shared
 * gutter and rhythm that every band of content sits inside.
 */
export function Section({
  id,
  children,
  className,
  divider = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24",
        divider && "border-t border-line",
        className,
      )}
    >
      <div className="mx-auto max-w-page px-4.5 py-9.5 md:px-8 md:py-16 lg:px-gutter lg:py-section">
        {children}
      </div>
    </section>
  );
}

/**
 * The twelve-column grid the whole page is aligned to. It collapses to a
 * single flowing column below the desktop breakpoint.
 */
export function Grid12({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-0 lg:grid-cols-12 lg:gap-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small monospaced section label, e.g. `01 — About`. */
export function Eyebrow({
  children,
  className,
  tone = "accent",
}: {
  children: ReactNode;
  className?: string;
  tone?: "accent" | "muted";
}) {
  return (
    <div
      className={cn(
        "font-mono text-eyebrow-xs uppercase md:text-eyebrow",
        tone === "accent" ? "text-accent" : "text-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Shared heading scale for sections 01 through 04. `measure="long"` drops the
 * desktop step so a longer heading still sets as two lines rather than wrapping
 * inside its column.
 */
export function SectionHeading({
  children,
  className,
  measure = "default",
}: {
  children: ReactNode;
  className?: string;
  measure?: "default" | "long";
}) {
  return (
    <h2
      className={cn(
        "mt-5 text-headline-xs font-light text-ink md:mt-7.5 md:text-headline-md",
        measure === "long" ? "lg:text-headline-long" : "lg:text-headline",
        className,
      )}
    >
      {children}
    </h2>
  );
}
