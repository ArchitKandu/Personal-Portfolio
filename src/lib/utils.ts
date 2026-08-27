import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges conditional class lists and resolves conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Zero-pads a one-based index into the `01`, `02` form used across the site. */
export function ordinal(index: number): string {
  return `0${index + 1}`.slice(-2);
}
