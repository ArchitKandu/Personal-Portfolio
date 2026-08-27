"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { SectionId } from "@/lib/content";
import { rememberReturnSection } from "@/lib/return-to";

/**
 * Returns to a section of the home page without putting a fragment in the URL:
 * the target is handed over out of band and applied on arrival.
 */
export function HomeSectionLink({
  section,
  children,
  className,
}: {
  section: SectionId;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/"
      // The provider positions the page on arrival; letting Next scroll to the
      // top first would only add a jump.
      scroll={false}
      onClick={() => rememberReturnSection(section)}
      className={className}
    >
      {children}
    </Link>
  );
}
