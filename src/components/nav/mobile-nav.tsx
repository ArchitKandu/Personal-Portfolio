"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useActiveSection } from "@/components/providers/active-section-provider";
import { useMotionSafe } from "@/hooks/use-motion-safe";
import { SECTIONS, SITE, type SectionId } from "@/lib/content";
import { EASE_EMPHASIS } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FOCUSABLE = "button, a[href]";
const RULE = "h-px w-6.5 bg-ink";

/** Bar plus full-screen drawer, shown below the desktop breakpoint. */
export function MobileNav() {
  const { active, scrollToSection } = useActiveSection();
  const [open, setOpen] = useState(false);
  const motionSafe = useMotionSafe();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Locks the page behind the drawer and restores the scroll position on close,
  // which some browsers otherwise drop when `overflow` is released.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const scrollY = window.scrollY;
    const trigger = triggerRef.current;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
      window.scrollTo(0, scrollY);
      // Focusing without scrolling keeps the position we just restored.
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const first = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const nodes = drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const goTo = (id: SectionId) => {
    close();
    // Waits for the scroll lock to lift before moving the page.
    window.setTimeout(() => scrollToSection(id), 60);
  };

  return (
    <div className="lg:hidden">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-line-soft bg-ground/92 px-4.5 py-3.25 backdrop-blur-sm">
        <span className="font-mono text-eyebrow tracking-mark text-ink">AK</span>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="site-drawer"
          className="flex size-11 cursor-pointer flex-col items-center justify-center gap-1.25"
        >
          <span className={RULE} />
          <span className={RULE} />
          <span className={RULE} />
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onKeyDown={onKeyDown}
            initial={motionSafe ? { x: "100%" } : false}
            animate={{ x: "0%" }}
            exit={motionSafe ? { x: "100%" } : undefined}
            transition={{ duration: 0.28, ease: EASE_EMPHASIS }}
            className="fixed inset-0 z-100 flex flex-col overflow-y-auto bg-ground px-4.5 pt-3.25 pb-8.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-eyebrow tracking-mark text-ink">
                AK
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="relative size-11 cursor-pointer"
              >
                <span className="absolute top-1/2 left-1/2 -ml-2.75 h-px w-5.5 rotate-45 bg-ink" />
                <span className="absolute top-1/2 left-1/2 -ml-2.75 h-px w-5.5 -rotate-45 bg-ink" />
              </button>
            </div>

            <nav aria-label="Sections" className="mt-8.5 flex flex-col">
              {SECTIONS.map((section, index) => (
                <motion.button
                  key={section.id}
                  type="button"
                  onClick={() => goTo(section.id)}
                  aria-current={active === section.id ? "true" : undefined}
                  initial={motionSafe ? { opacity: 0, x: 14 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: EASE_EMPHASIS,
                    delay: 0.06 + index * 0.04,
                  }}
                  className={cn(
                    "block min-h-12 w-full cursor-pointer border-b border-line-soft py-2.75 text-left text-title",
                    active === section.id ? "text-ink" : "text-muted",
                  )}
                >
                  {section.nav}
                </motion.button>
              ))}
            </nav>

            <a
              href={SITE.resume}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="mt-6.5 inline-flex min-h-11 items-center justify-center self-start rounded-full bg-accent px-7 text-cta-sm text-ground"
            >
              Resume
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
