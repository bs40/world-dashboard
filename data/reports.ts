import type { Dataset, Report } from "@/types";

export const featuredReport = {
  id: "weekly-outlook",
  kicker: "Featured report",
  title: "Weekly Outlook",
  dateRange: "May 20 – May 26, 2024",
  summary: "Key trends, risks and opportunities shaping the week ahead.",
  image: "/images/earth-night.svg",
  categories: [
    { name: "Global Economy", color: "var(--color-cyan)" },
    { name: "Climate & Environment", color: "var(--color-pos)" },
    { name: "Geopolitics", color: "var(--color-warn)" },
    { name: "Technology", color: "var(--color-tech)" },
    { name: "Health", color: "var(--color-sev)" },
    { name: "Society", color: "var(--color-elev)" },
  ],
};

export const keyTakeaways = [
  "Geopolitical tensions remain elevated in multiple regions.",
  "Markets expected to react to inflation data and central bank signals.",
  "Extreme weather events likely to affect food prices.",
  "AI regulation framework is gaining momentum globally.",
];

export const recentReports: Report[] = [
  {
    id: "global-risk-q2",
    title: "Global Risk Report Q2 2024",
    category: "Risk Analysis",
    categoryColor: "var(--color-warn)",
    date: "May 19, 2024",
    image: "/images/skyline.svg",
    kind: "special",
    summary: "Quarterly assessment of systemic risks across six domains.",
  },
  {
    id: "sustainable-future",
    title: "Sustainable Future Index",
    category: "Sustainability",
    categoryColor: "var(--color-pos)",
    date: "May 15, 2024",
    image: "/images/windfarm.svg",
    kind: "special",
    summary: "Country rankings on energy transition and resilience.",
  },
  {
    id: "tech-trends",
    title: "Technology Trends 2024",
    category: "Technology",
    categoryColor: "var(--color-tech)",
    date: "May 12, 2024",
    image: "/images/circuit.svg",
    kind: "special",
    summary: "Adoption curves for AI, 5G, quantum and blockchain.",
  },
  {
    id: "health-update",
    title: "Global Health Update",
    category: "Health",
    categoryColor: "var(--color-sev)",
    date: "May 10, 2024",
    image: "/images/lab.svg",
    kind: "weekly",
    summary: "Vaccine rollouts, AMR and health-system capacity.",
  },
  {
    id: "econ-forecast",
    title: "Economic Forecast Q2",
    category: "Economy",
    categoryColor: "var(--color-cyan)",
    date: "May 8, 2024",
    image: "/images/chart-report.svg",
    kind: "weekly",
    summary: "Growth, inflation and trade projections by region.",
  },
];

export const explorerDatasets: Dataset[] = [
  { id: "global-population", name: "Global Population", icon: "users", provider: "UN DESA" },
  { id: "energy-consumption", name: "Energy Consumption", icon: "zap", provider: "IEA / OWID" },
  { id: "education-access", name: "Education Access", icon: "book", provider: "UNESCO" },
  { id: "healthcare-systems", name: "Healthcare Systems", icon: "heart", provider: "WHO" },
  { id: "press-freedom", name: "Press Freedom", icon: "mic", provider: "RSF" },
];

export const insightFeed = [
  { text: "UN report: Global hunger declines for third year", agoH: 1 },
  { text: "New climate accord signed by 48 countries", agoH: 2 },
  { text: "Global trade volume up 1.7% in Q1 2024", agoH: 3 },
  { text: "WHO approves new malaria vaccine", agoH: 4 },
  { text: "Renewables reach 34% of global generation", agoH: 6 },
];
