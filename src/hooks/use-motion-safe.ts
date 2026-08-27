"use client";

import { useSyncExternalStore } from "react";

import { REDUCED_MOTION } from "@/lib/breakpoints";

function subscribe(onChange: () => void) {
  const list = window.matchMedia(REDUCED_MOTION);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

const getSnapshot = () => !window.matchMedia(REDUCED_MOTION).matches;

/**
 * The server cannot know the reader's preference, so it assumes motion is fine
 * and React reconciles it on the client.
 */
const getServerSnapshot = () => true;

/**
 * Whether animation is welcome. Read through `useSyncExternalStore` rather than
 * an effect, so the preference is applied in a normal post-hydration render
 * instead of a mismatch between the server and client trees.
 */
export function useMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
