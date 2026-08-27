"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { REDUCED_MOTION } from "@/lib/breakpoints";
import { SECTIONS, type SectionId } from "@/lib/content";
import { consumeReturnSection } from "@/lib/return-to";

/** Distance kept between the viewport top and a section once scrolled to. */
const SCROLL_OFFSET = 40;

type ActiveSectionValue = {
  active: SectionId;
  scrollToSection: (id: SectionId) => void;
};

const ActiveSectionContext = createContext<ActiveSectionValue | null>(null);

/** Where the page has to sit for `element` to be the section being read. */
function offsetOf(element: HTMLElement): number {
  return element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
}

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>(SECTIONS[0].id);

  // Restores the section a case study was opened from. Runs before paint, so
  // the reader never sees the top of the page flash past on the way back.
  useIsomorphicLayoutEffect(() => {
    const pending = consumeReturnSection();
    if (!pending) return;
    const element = document.getElementById(pending);
    if (element) window.scrollTo({ top: offsetOf(element), behavior: "auto" });
  }, []);

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    // The section occupying most of the middle band wins, which keeps the
    // highlight stable while a long section scrolls past.
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let winner: string | null = null;
        let best = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > best) {
            best = ratio;
            winner = id;
          }
        }
        if (winner) setActive(winner as SectionId);
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "-30% 0px -30% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Scrolling rather than following an anchor, so navigating between sections
  // never leaves a fragment behind in the address bar.
  const scrollToSection = useCallback((id: SectionId) => {
    const element = document.getElementById(id);
    if (!element) return;
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    window.scrollTo({
      top: offsetOf(element),
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  const value = useMemo(
    () => ({ active, scrollToSection }),
    [active, scrollToSection],
  );

  return (
    <ActiveSectionContext.Provider value={value}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection(): ActiveSectionValue {
  const value = useContext(ActiveSectionContext);
  if (!value) {
    throw new Error("useActiveSection must be used inside ActiveSectionProvider");
  }
  return value;
}
