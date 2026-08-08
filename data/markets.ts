import type { MarketIndex } from "@/types";
import { demoSeries } from "@/lib/utils";

export const indices: MarketIndex[] = [
  { id: "gmi", name: "GMI", value: 4276.15, changePct: 1.28, spark: demoSeries(11, 24, 4200, 22, 3) },
  { id: "sp", name: "S&P 500", value: 5321.41, changePct: 1.19, spark: demoSeries(23, 24, 5240, 24, 3.4) },
  { id: "ftse", name: "FTSE 100", value: 8275.66, changePct: -0.23, spark: demoSeries(31, 24, 8300, 18, -1) },
  { id: "nikkei", name: "NIKKEI 225", value: 38629.31, changePct: 0.73, spark: demoSeries(47, 24, 38400, 120, 9) },
  { id: "dax", name: "DAX", value: 18742.35, changePct: 0.55, spark: demoSeries(53, 24, 18600, 60, 6) },
  { id: "cac", name: "CAC 40", value: 8102.35, changePct: 0.34, spark: demoSeries(61, 24, 8060, 28, 1.8) },
];

export const energyMix = [
  { name: "Oil", value: 31, color: "var(--color-steel)" },
  { name: "Coal", value: 26, color: "var(--color-steel-dim)" },
  { name: "Gas", value: 23, color: "var(--color-cyan)" },
  { name: "Renewables", value: 17, color: "var(--color-pos)" },
  { name: "Nuclear", value: 3, color: "var(--color-tech)" },
];

export const tradeFlows = [
  { route: "N. America → Europe", value: 2.1 },
  { route: "Asia → N. America", value: 1.8 },
  { route: "Europe → Asia", value: 1.6 },
  { route: "Asia → Europe", value: 1.5 },
  { route: "N. America → Asia", value: 1.1 },
];

export const techAdoption = [
  { name: "AI", value: 62 },
  { name: "5G", value: 58 },
  { name: "Blockchain", value: 34 },
  { name: "Quantum", value: 18 },
];
