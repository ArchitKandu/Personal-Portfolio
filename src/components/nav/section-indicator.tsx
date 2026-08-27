"use client";

import { useActiveSection } from "@/components/providers/active-section-provider";
import { INDICATOR_SECTIONS } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Numbered progress rail pinned to the right edge. It takes no layout height,
 * so it never affects the grid it floats over.
 */
export function SectionIndicator() {
  const { active, scrollToSection } = useActiveSection();

  return (
    <div className="pointer-events-none sticky top-1/2 z-35 hidden h-0 items-center justify-end lg:flex">
      <div className="pointer-events-auto flex -translate-y-1/2 flex-col items-center gap-0.5 pr-rail">
        {INDICATOR_SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              aria-label={`Go to ${section.nav}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "flex size-11 flex-none cursor-pointer items-center justify-center font-mono text-eyebrow transition-colors duration-200",
                isActive ? "text-accent" : "text-faint",
              )}
            >
              {section.num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
