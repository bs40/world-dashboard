import type { Category } from "@/types";

// Plain module (no "use client") so both server and client components can
// resolve fallback artwork.

/** Local procedural artwork used when a publisher image is missing or blocked. */
const CATEGORY_FALLBACK: Record<string, string> = {
  politics: "/images/assembly.svg",
  conflicts: "/images/convoy.svg",
  economy: "/images/trading.svg",
  environment: "/images/forest.svg",
  society: "/images/housing.svg",
  technology: "/images/circuit.svg",
  health: "/images/lab.svg",
  science: "/images/lab.svg",
};

export const DEFAULT_FALLBACK = "/images/skyline.svg";

export function fallbackFor(category?: Category): string {
  return (category && CATEGORY_FALLBACK[category]) || DEFAULT_FALLBACK;
}
