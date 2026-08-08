import type { Topic } from "@/types";
import { demoSeries } from "@/lib/utils";

export const topics: Topic[] = [
  {
    slug: "climate-change",
    name: "Climate Change",
    category: "environment",
    overview:
      "Rising global temperatures, extreme weather events, and environmental degradation continue to impact ecosystems, economies, and communities worldwide.",
    keyFacts: [
      "2024 is on track to be one of the warmest years on record",
      "Sea levels rising 3.6 mm per year on average",
      "20M+ people displaced by climate disasters in 2023",
    ],
    relatedTopics: ["energy", "migration", "public-health"],
    relatedDatasets: ["temperature-anomaly", "co2-emissions", "sea-level"],
    followerLabel: "2.4M following",
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    category: "technology",
    overview:
      "Rapid advances in machine intelligence are reshaping labour markets, security doctrine, and regulation, with governments racing to set common standards.",
    keyFacts: [
      "62% of surveyed countries have national AI strategies",
      "Global AI investment exceeded $180B in 2023",
      "Regulatory frameworks under negotiation in 40+ jurisdictions",
    ],
    relatedTopics: ["cybersecurity", "global-economy", "democracy"],
    relatedDatasets: ["ai-adoption", "compute-index", "research-output"],
    followerLabel: "3.1M following",
  },
  {
    slug: "global-economy",
    name: "Global Economy",
    category: "economy",
    overview:
      "Growth is stabilising after a period of elevated inflation, but trade fragmentation, debt loads and demographic shifts cloud the medium-term outlook.",
    keyFacts: [
      "Global GDP growth projected at 2.8% for 2024",
      "Average inflation cooled to 3.6% across major economies",
      "Global trade volume up 1.7% in Q1 2024",
    ],
    relatedTopics: ["artificial-intelligence", "energy", "migration"],
    relatedDatasets: ["gdp-growth", "trade-volume", "debt-to-gdp"],
    followerLabel: "1.9M following",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    category: "technology",
    overview:
      "State-linked intrusions and ransomware campaigns keep threat levels elevated, driving new disclosure rules and cross-border response exercises.",
    keyFacts: [
      "Cyber threat level assessed at MEDIUM globally",
      "Ransomware payments fell 18% year over year",
      "60+ countries participated in joint response drills",
    ],
    relatedTopics: ["artificial-intelligence", "democracy", "conflicts"],
    relatedDatasets: ["incident-count", "threat-index"],
    followerLabel: "870K following",
  },
  {
    slug: "energy",
    name: "Energy",
    category: "environment",
    overview:
      "The transition to low-carbon power is accelerating unevenly: renewables set records while grids, storage and permitting lag demand growth.",
    keyFacts: [
      "Renewables reached 34% of global generation",
      "Grid investment gap estimated at $600B annually",
      "Coal use declined in 60% of major economies",
    ],
    relatedTopics: ["climate-change", "global-economy"],
    relatedDatasets: ["energy-mix", "renewables-share"],
    followerLabel: "1.2M following",
  },
  {
    slug: "public-health",
    name: "Public Health",
    category: "health",
    overview:
      "Health systems balance pandemic preparedness with chronic disease burdens; vaccine innovation and antimicrobial resistance top the agenda.",
    keyFacts: [
      "WHO approved a new malaria vaccine for broad rollout",
      "Life expectancy recovering toward pre-2020 trend",
      "AMR linked to ~1.3M deaths annually",
    ],
    relatedTopics: ["climate-change", "society"],
    relatedDatasets: ["life-expectancy", "vaccination-rates"],
    followerLabel: "980K following",
  },
  {
    slug: "space",
    name: "Space",
    category: "science",
    overview:
      "Commercial launch cadence, lunar programmes and orbital congestion define a new era of space activity and the governance questions that follow.",
    keyFacts: [
      "Record 220+ orbital launches in 2023",
      "Active satellites surpassed 9,000",
      "Debris-tracking coverage remains incomplete below 10 cm",
    ],
    relatedTopics: ["technology", "artificial-intelligence"],
    relatedDatasets: ["launch-count", "satellite-census"],
    followerLabel: "640K following",
  },
  {
    slug: "democracy",
    name: "Democracy",
    category: "politics",
    overview:
      "A record election year tests institutions worldwide amid information manipulation, declining trust and contested transitions.",
    keyFacts: [
      "Over 60 national elections scheduled in 2024",
      "Trust in media declined in 2/3 of surveyed countries",
      "Election observation missions active in 40+ states",
    ],
    relatedTopics: ["cybersecurity", "society", "migration"],
    relatedDatasets: ["press-freedom", "democracy-index"],
    followerLabel: "760K following",
  },
  {
    slug: "migration",
    name: "Migration",
    category: "society",
    overview:
      "Conflict, climate stress and labour demand drive record human mobility, prompting new regional compacts and border policy shifts.",
    keyFacts: [
      "110M+ people forcibly displaced worldwide",
      "Climate-linked displacement rose for the fifth year",
      "Remittances reached $860B in 2023",
    ],
    relatedTopics: ["climate-change", "democracy", "conflicts"],
    relatedDatasets: ["displacement", "remittances"],
    followerLabel: "540K following",
  },
];

export function getTopic(slug: string): Topic {
  return topics.find((t) => t.slug === slug) ?? topics[0];
}

// Global temperature anomaly 1880–2024 (°C vs 1901–1960 average), stylised
// from the public NASA GISTEMP shape for demo purposes.
export const temperatureAnomaly = Array.from({ length: 145 }, (_, i) => {
  const year = 1880 + i;
  let base: number;
  if (year < 1940) base = -0.25 + (year - 1880) * 0.002;
  else if (year < 1975) base = -0.05 + Math.sin((year - 1940) / 8) * 0.06;
  else base = -0.02 + (year - 1975) * 0.022;
  const wobble = demoSeries(year, 1, 0, 0.09)[0];
  return { year, anomaly: Number((base + wobble).toFixed(2)) };
});

export const extremeWeatherStats = [
  { label: "Storms", value: 215, icon: "wind" },
  { label: "Floods", value: 178, icon: "droplets" },
  { label: "Heatwaves", value: 142, icon: "thermometer" },
  { label: "Wildfires", value: 93, icon: "flame" },
  { label: "Droughts", value: 64, icon: "sun" },
];

export const climateNews = [
  {
    id: "brazil-floods",
    headline: "Record floods hit Brazil's southern states",
    agoH: 3,
    sourcesCount: 22,
    image: "/images/storm.svg",
  },
  {
    id: "pacific-action",
    headline: "Pacific islands call for urgent climate action",
    agoH: 5,
    sourcesCount: 16,
    image: "/images/ocean.svg",
  },
  {
    id: "finance-gap",
    headline: "New report highlights climate finance gap",
    agoH: 8,
    sourcesCount: 30,
    image: "/images/assembly.svg",
  },
  {
    id: "arctic-ice",
    headline: "Arctic sea ice hits second-lowest May level",
    agoH: 11,
    sourcesCount: 18,
    image: "/images/aurora.svg",
  },
];
