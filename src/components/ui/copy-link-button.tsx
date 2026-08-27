"use client";

import { useEffect, useRef, useState } from "react";

const CONFIRMATION_MS = 2000;

/** Copies the current URL, with a short confirmation in place of the label. */
export function CopyLinkButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      return;
    }
    setCopied(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), CONFIRMATION_MS);
  };

  return (
    <button type="button" onClick={copy} className={className}>
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}
