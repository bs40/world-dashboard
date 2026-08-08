import type { GlobalMetric } from "@/types";
import { demoSeries } from "@/lib/utils";

export const globalStats = [
  { label: "Population", value: "7.9B" },
  { label: "Countries", value: "195" },
  { label: "Continents", value: "6" },
  { label: "News coverage", value: "24/7" },
];

export const planetMetrics: GlobalMetric[] = [
  {
    id: "temp",
    label: "Global temp",
    value: "+1.32°C",
    sub: "vs 1950–1980",
    icon: "thermometer",
    trend: "up",
  },
  {
    id: "sea",
    label: "Sea level",
    value: "+3.6 mm/yr",
    sub: "1993–2023",
    icon: "waves",
    trend: "up",
  },
  {
    id: "co2",
    label: "CO₂ levels",
    value: "420.7 ppm",
    sub: "May 2024",
    icon: "cloud",
    trend: "up",
  },
  {
    id: "gdp",
    label: "World GDP",
    value: "$105.3T",
    sub: "Nominal",
    icon: "chart",
    trend: "up",
  },
  {
    id: "internet",
    label: "Internet users",
    value: "5.4B",
    sub: "67.1% of pop.",
    icon: "wifi",
    trend: "up",
  },
];

export const analyticsCards = [
  {
    id: "risk",
    label: "Global Risk Index",
    value: "4.7",
    unit: "/10",
    status: "Moderate",
    statusColor: "warn" as const,
    spark: demoSeries(7, 20, 4.4, 0.12, 0.012),
  },
  {
    id: "econ",
    label: "Economic Outlook",
    value: "2.8",
    unit: "%",
    status: "Global GDP growth",
    statusColor: "pos" as const,
    spark: demoSeries(13, 20, 2.6, 0.08, 0.008),
  },
  {
    id: "inflation",
    label: "Inflation Avg",
    value: "3.6",
    unit: "%",
    status: "vs last quarter",
    statusColor: "pos" as const,
    spark: demoSeries(17, 20, 4.4, 0.1, -0.04),
  },
  {
    id: "food",
    label: "Food Security",
    value: "68",
    unit: "/100",
    status: "Stable",
    statusColor: "pos" as const,
    spark: demoSeries(19, 20, 67, 0.6, 0.04),
  },
  {
    id: "cyber",
    label: "Cyber Threat Level",
    value: "MEDIUM",
    unit: "",
    status: "Elevated",
    statusColor: "elev" as const,
    spark: demoSeries(29, 20, 5.4, 0.3, 0.02),
  },
];

export const topRisks = [
  { name: "Extreme Weather", score: 8.2 },
  { name: "Geopolitical Conflict", score: 7.8 },
  { name: "Economic Instability", score: 6.4 },
  { name: "Food Insecurity", score: 6.2 },
  { name: "Cyber Warfare", score: 5.7 },
];

// 30-day global sentiment: three series (positive / neutral / negative) in %.
export const sentimentSeries = Array.from({ length: 30 }, (_, i) => {
  const pos = demoSeries(101, 30, 38, 1.6)[i];
  const neg = demoSeries(203, 30, 27, 1.8)[i];
  const neu = 100 - pos - neg;
  const dayOfSeries = 24 + i;
  return {
    day: dayOfSeries <= 30 ? `Apr ${dayOfSeries}` : `May ${dayOfSeries - 30}`,
    positive: Number(pos.toFixed(1)),
    neutral: Number(neu.toFixed(1)),
    negative: Number(neg.toFixed(1)),
  };
});

export const dataInsights = [
  {
    id: "population-growth",
    label: "Population growth",
    sub: "Top 5 countries",
    kind: "bars" as const,
    bars: [
      { name: "India", value: 1.44 },
      { name: "China", value: 1.42 },
      { name: "Nigeria", value: 0.23 },
      { name: "Indonesia", value: 0.28 },
      { name: "Pakistan", value: 0.24 },
    ],
  },
  {
    id: "renewables",
    label: "Renewable energy",
    sub: "% of total generation",
    kind: "line" as const,
    value: "34%",
    change: "+2.1% vs 2023",
    trend: "up" as const,
    spark: demoSeries(41, 18, 28, 0.5, 0.35),
  },
  {
    id: "trade",
    label: "Global trade",
    sub: "Trillion USD",
    kind: "line" as const,
    value: "24.7",
    change: "+3.2% vs 2023",
    trend: "up" as const,
    spark: demoSeries(43, 18, 22.4, 0.4, 0.13),
  },
  {
    id: "co2",
    label: "CO₂ emissions",
    sub: "Metric tons (B)",
    kind: "line" as const,
    value: "37.1",
    change: "-1.3% vs 2023",
    trend: "down" as const,
    spark: demoSeries(51, 18, 37.6, 0.2, -0.03),
  },
  {
    id: "wildlife",
    label: "Wildlife at risk",
    sub: "Species",
    kind: "donut" as const,
    value: "28,944",
    change: "+12% vs 2023",
    trend: "up" as const,
  },
];
