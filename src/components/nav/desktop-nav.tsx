"use client";

import { useActiveSection } from "@/components/providers/active-section-provider";
import { SECTIONS, SITE } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Floating pill bar, desktop only. The rail handles narrow viewports. */
export function DesktopNav() {
  const { active, scrollToSection } = useActiveSection();

  return (
    <div className="pointer-events-none sticky top-4.5 z-40 hidden justify-center lg:flex">
      <nav
        aria-label="Sections"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-surface/92 py-2 pr-2.5 pl-2.5 backdrop-blur-nav"
      >
        {/* <span className="mr-4 text-meta leading-none font-medium text-ink">
          AK
        </span> */}

        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "min-h-11 cursor-pointer rounded-full px-4 text-pill transition-colors duration-200 hover:bg-elevated hover:text-ink",
                isActive ? "bg-elevated text-ink" : "text-muted",
              )}
            >
              {section.nav}
            </button>
          );
        })}

        <a
          href={SITE.resume}
          target="_blank"
          rel="noreferrer"
          className="ml-3 inline-flex h-11 items-center rounded-full border border-accent px-5.5 text-pill text-accent transition-colors duration-200 hover:bg-elevated"
        >
          Resume
        </a>
      </nav>
    </div>
  );
}
