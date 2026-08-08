import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatAgo(min: number): string {
  if (min < 1) return "now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function signed(n: number, digits = 2): string {
  const s = n.toFixed(digits);
  return n > 0 ? `+${s}` : s;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Deterministic pseudo-random series generator for demo charts (stable across renders/SSR). */
export function demoSeries(
  seed: number,
  points: number,
  base: number,
  amplitude: number,
  drift = 0
): number[] {
  const out: number[] = [];
  let v = base;
  let s = seed;
  for (let i = 0; i < points; i++) {
    s = (s * 16807) % 2147483647;
    const r = (s / 2147483647) * 2 - 1;
    v = v + r * amplitude + drift;
    out.push(Number(v.toFixed(3)));
  }
  return out;
}
