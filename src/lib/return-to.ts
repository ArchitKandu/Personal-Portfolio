import { SECTIONS, type SectionId } from "@/lib/content";

/**
 * Carries "put me back at this section" across a navigation without writing it
 * into the URL. A section is a reading position, not an address, so the address
 * bar stays clean.
 *
 * The handoff is held in memory, which survives the client-side navigation this
 * is used for, and mirrored into session storage so a reload on the way still
 * lands in the right place. Either channel alone is enough.
 */
const KEY = "ak-return-to";

let pending: SectionId | null = null;

function isSectionId(value: string | null): value is SectionId {
  return value !== null && SECTIONS.some((section) => section.id === value);
}

export function rememberReturnSection(id: SectionId): void {
  pending = id;
  try {
    window.sessionStorage.setItem(KEY, id);
  } catch {
    // Blocked storage is fine — the in-memory handoff still applies.
  }
}

/** Reads the pending section and clears it, so it only applies once. */
export function consumeReturnSection(): SectionId | null {
  const fromMemory = pending;
  pending = null;

  let fromStorage: string | null = null;
  try {
    fromStorage = window.sessionStorage.getItem(KEY);
    if (fromStorage !== null) window.sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clean up.
  }

  if (fromMemory) return fromMemory;
  // Never trust a stored value enough to look it up blindly.
  return isSectionId(fromStorage) ? fromStorage : null;
}
