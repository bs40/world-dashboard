import type { Region } from "@/types";

// Regional intelligence demo data. Add a region by appending to this array —
// the /regions page and search index pick it up automatically.
export const regions: Region[] = [
  {
    id: "europe",
    name: "Europe",
    countries: 50,
    population: "748M",
    summary:
      "Policy attention centres on energy transition funding, enlargement talks and a fragmented electoral map ahead of autumn votes.",
    mapWindow: { lonMin: -12, lonMax: 42, latMin: 34, latMax: 62 },
    indicators: [
      { label: "GDP (Nominal)", value: "$23.5T", change: "+1.4% vs 2023", trend: "up" },
      { label: "GDP per Capita", value: "$31,320", change: "+1.1% vs 2023", trend: "up" },
      { label: "Unemployment Rate", value: "6.2%", change: "-0.3% vs 2023", trend: "down" },
      { label: "Inflation Rate", value: "2.6%", change: "-0.7% vs 2023", trend: "down" },
      { label: "Human Development Index", value: "0.92", change: "Very high", trend: "flat" },
    ],
    stats: [
      { label: "Renewable Energy", value: "44%", note: "of generation" },
      { label: "Internet Penetration", value: "92%" },
      { label: "Press Freedom Index", value: "24.5", note: "score" },
      { label: "Global Innovation Index", value: "2", note: "ranking" },
    ],
    headlines: [
      {
        id: "eu-green-fund",
        headline: "EU approves €50B fund for green energy transition",
        category: "environment",
        sourceId: "public-broadcaster",
        publishedAgoMin: 60,
        sourcesCount: 36,
      },
      {
        id: "fr-elections",
        headline: "France announces snap elections after political shake-up",
        category: "politics",
        sourceId: "global-wire",
        publishedAgoMin: 180,
        sourcesCount: 52,
      },
      {
        id: "eu-migration",
        headline: "New migration pact agreed by EU member states",
        category: "society",
        sourceId: "international-desk",
        publishedAgoMin: 240,
        sourcesCount: 41,
      },
      {
        id: "eu-heatwave",
        headline: "Heatwave across Southern Europe raises health concerns",
        category: "environment",
        sourceId: "climate-bureau",
        publishedAgoMin: 300,
        sourcesCount: 19,
      },
    ],
  },
  {
    id: "americas",
    name: "Americas",
    countries: 35,
    population: "1.04B",
    summary:
      "Trade realignment and nearshoring continue to reshape supply chains while several economies navigate post-inflation rate cycles.",
    mapWindow: { lonMin: -130, lonMax: -30, latMin: -56, latMax: 62 },
    indicators: [
      { label: "GDP (Nominal)", value: "$34.2T", change: "+2.1% vs 2023", trend: "up" },
      { label: "GDP per Capita", value: "$32,880", change: "+1.7% vs 2023", trend: "up" },
      { label: "Unemployment Rate", value: "5.4%", change: "-0.2% vs 2023", trend: "down" },
      { label: "Inflation Rate", value: "3.9%", change: "-1.2% vs 2023", trend: "down" },
      { label: "Human Development Index", value: "0.84", change: "High", trend: "flat" },
    ],
    stats: [
      { label: "Renewable Energy", value: "36%", note: "of generation" },
      { label: "Internet Penetration", value: "83%" },
      { label: "Press Freedom Index", value: "38.2", note: "score" },
      { label: "Global Innovation Index", value: "3", note: "ranking" },
    ],
    headlines: [
      {
        id: "us-jobs-regional",
        headline: "U.S. job growth exceeds expectations in April",
        category: "economy",
        sourceId: "financial-desk",
        publishedAgoMin: 45,
        sourcesCount: 44,
      },
      {
        id: "mx-vote",
        headline: "Mexico publishes election results in regional vote",
        category: "politics",
        sourceId: "policy-observer",
        publishedAgoMin: 60,
        sourcesCount: 21,
      },
      {
        id: "br-amazon",
        headline: "Amazon deforestation rates decline for second year",
        category: "environment",
        sourceId: "climate-bureau",
        publishedAgoMin: 120,
        sourcesCount: 33,
      },
      {
        id: "ca-housing",
        headline: "Canada announces new national housing plan",
        category: "society",
        sourceId: "policy-observer",
        publishedAgoMin: 180,
        sourcesCount: 17,
      },
    ],
  },
  {
    id: "asia",
    name: "Asia",
    countries: 48,
    population: "4.75B",
    summary:
      "Manufacturing output recovers unevenly; heat stress and water security dominate the climate agenda across South and Southeast Asia.",
    mapWindow: { lonMin: 40, lonMax: 150, latMin: -12, latMax: 58 },
    indicators: [
      { label: "GDP (Nominal)", value: "$41.6T", change: "+3.8% vs 2023", trend: "up" },
      { label: "GDP per Capita", value: "$8,760", change: "+3.2% vs 2023", trend: "up" },
      { label: "Unemployment Rate", value: "4.6%", change: "flat vs 2023", trend: "flat" },
      { label: "Inflation Rate", value: "3.1%", change: "-0.9% vs 2023", trend: "down" },
      { label: "Human Development Index", value: "0.75", change: "High", trend: "flat" },
    ],
    stats: [
      { label: "Renewable Energy", value: "29%", note: "of generation" },
      { label: "Internet Penetration", value: "71%" },
      { label: "Press Freedom Index", value: "51.6", note: "score" },
      { label: "Global Innovation Index", value: "1", note: "ranking" },
    ],
    headlines: [
      {
        id: "asia-heat",
        headline: "Extreme heatwave spreads across South Asia",
        category: "environment",
        sourceId: "climate-bureau",
        publishedAgoMin: 15,
        sourcesCount: 58,
      },
      {
        id: "chip-hubs",
        headline: "Semiconductor supply chains shift toward regional hubs",
        category: "technology",
        sourceId: "financial-desk",
        publishedAgoMin: 420,
        sourcesCount: 39,
      },
      {
        id: "asean-trade",
        headline: "ASEAN economies agree framework on digital trade",
        category: "economy",
        sourceId: "regional-monitor",
        publishedAgoMin: 300,
        sourcesCount: 22,
      },
      {
        id: "taiwan-drills",
        headline: "Military drills conclude in waters east of Taiwan",
        category: "conflicts",
        sourceId: "international-desk",
        publishedAgoMin: 18,
        sourcesCount: 61,
      },
    ],
  },
  {
    id: "africa",
    name: "Africa",
    countries: 54,
    population: "1.46B",
    summary:
      "Rapid urbanisation and a young workforce drive growth prospects while flooding in the east and conflict in the Sahel strain response capacity.",
    mapWindow: { lonMin: -20, lonMax: 52, latMin: -36, latMax: 38 },
    indicators: [
      { label: "GDP (Nominal)", value: "$3.1T", change: "+3.4% vs 2023", trend: "up" },
      { label: "GDP per Capita", value: "$2,190", change: "+2.0% vs 2023", trend: "up" },
      { label: "Unemployment Rate", value: "7.9%", change: "-0.1% vs 2023", trend: "down" },
      { label: "Inflation Rate", value: "12.4%", change: "-2.6% vs 2023", trend: "down" },
      { label: "Human Development Index", value: "0.55", change: "Medium", trend: "up" },
    ],
    stats: [
      { label: "Renewable Energy", value: "24%", note: "of generation" },
      { label: "Internet Penetration", value: "43%" },
      { label: "Press Freedom Index", value: "55.1", note: "score" },
      { label: "Global Innovation Index", value: "5", note: "ranking" },
    ],
    headlines: [
      {
        id: "ea-floods",
        headline: "Floods displace thousands in East Africa",
        category: "environment",
        sourceId: "global-wire",
        publishedAgoMin: 45,
        sourcesCount: 27,
      },
      {
        id: "sudan-aid",
        headline: "Humanitarian corridors under negotiation in Sudan",
        category: "conflicts",
        sourceId: "international-desk",
        publishedAgoMin: 200,
        sourcesCount: 31,
      },
      {
        id: "afcfta",
        headline: "Continental free trade area adds two more signatories",
        category: "economy",
        sourceId: "regional-monitor",
        publishedAgoMin: 380,
        sourcesCount: 14,
      },
      {
        id: "solar-sahel",
        headline: "Large-scale solar projects announced across the Sahel",
        category: "environment",
        sourceId: "climate-bureau",
        publishedAgoMin: 460,
        sourcesCount: 12,
      },
    ],
  },
  {
    id: "oceania",
    name: "Oceania",
    countries: 14,
    population: "45M",
    summary:
      "Pacific island states press for urgent climate finance while Australia and New Zealand recalibrate trade and security partnerships.",
    mapWindow: { lonMin: 110, lonMax: 180, latMin: -48, latMax: -5 },
    indicators: [
      { label: "GDP (Nominal)", value: "$2.0T", change: "+1.9% vs 2023", trend: "up" },
      { label: "GDP per Capita", value: "$44,120", change: "+1.2% vs 2023", trend: "up" },
      { label: "Unemployment Rate", value: "4.1%", change: "+0.2% vs 2023", trend: "up" },
      { label: "Inflation Rate", value: "3.4%", change: "-1.5% vs 2023", trend: "down" },
      { label: "Human Development Index", value: "0.90", change: "Very high", trend: "flat" },
    ],
    stats: [
      { label: "Renewable Energy", value: "38%", note: "of generation" },
      { label: "Internet Penetration", value: "90%" },
      { label: "Press Freedom Index", value: "21.7", note: "score" },
      { label: "Global Innovation Index", value: "4", note: "ranking" },
    ],
    headlines: [
      {
        id: "pacific-climate",
        headline: "Pacific islands call for urgent climate action",
        category: "environment",
        sourceId: "climate-bureau",
        publishedAgoMin: 200,
        sourcesCount: 16,
      },
      {
        id: "reef-recovery",
        headline: "Reef monitoring shows localised coral recovery",
        category: "environment",
        sourceId: "science-desk",
        publishedAgoMin: 510,
        sourcesCount: 9,
      },
      {
        id: "au-trade",
        headline: "Australia signs expanded trade agreement with ASEAN",
        category: "economy",
        sourceId: "regional-monitor",
        publishedAgoMin: 620,
        sourcesCount: 11,
      },
      {
        id: "nz-energy",
        headline: "New Zealand accelerates geothermal expansion",
        category: "environment",
        sourceId: "public-broadcaster",
        publishedAgoMin: 700,
        sourcesCount: 7,
      },
    ],
  },
];

export function getRegion(id: string): Region {
  return regions.find((r) => r.id === id) ?? regions[0];
}

export const regionalFocusStories: Record<string, { country: string; text: string; agoMin: number; image: string; lat: number; lon: number }[]> = {
  americas: [
    { country: "Mexico", text: "Election results in regional vote", agoMin: 60, image: "/images/plaza.svg", lat: 19.4, lon: -99.1 },
    { country: "Brazil", text: "Amazon deforestation rates decline", agoMin: 120, image: "/images/forest.svg", lat: -3.5, lon: -62.2 },
    { country: "Canada", text: "New housing plan announced", agoMin: 180, image: "/images/housing.svg", lat: 45.4, lon: -75.7 },
  ],
  europe: [
    { country: "France", text: "Snap elections announced", agoMin: 180, image: "/images/assembly.svg", lat: 48.9, lon: 2.35 },
    { country: "EU", text: "€50B green energy fund approved", agoMin: 60, image: "/images/windfarm.svg", lat: 50.85, lon: 4.35 },
    { country: "Spain", text: "Heatwave raises health concerns", agoMin: 300, image: "/images/heatwave.svg", lat: 40.4, lon: -3.7 },
  ],
  asia: [
    { country: "India", text: "Extreme heatwave spreads", agoMin: 15, image: "/images/heatwave.svg", lat: 28.6, lon: 77.2 },
    { country: "Taiwan", text: "Military drills conclude", agoMin: 18, image: "/images/ocean.svg", lat: 23.7, lon: 121 },
    { country: "ASEAN", text: "Digital trade framework agreed", agoMin: 300, image: "/images/skyline.svg", lat: 1.35, lon: 103.8 },
  ],
  africa: [
    { country: "Kenya", text: "Floods displace thousands", agoMin: 45, image: "/images/storm.svg", lat: -1.29, lon: 36.8 },
    { country: "Sudan", text: "Humanitarian corridors negotiated", agoMin: 200, image: "/images/camp.svg", lat: 15.5, lon: 32.6 },
    { country: "Sahel", text: "Large-scale solar projects announced", agoMin: 460, image: "/images/desert.svg", lat: 16.3, lon: -0.1 },
  ],
  oceania: [
    { country: "Fiji", text: "Climate finance summit convenes", agoMin: 200, image: "/images/ocean.svg", lat: -17.7, lon: 178 },
    { country: "Australia", text: "Expanded ASEAN trade agreement", agoMin: 620, image: "/images/skyline.svg", lat: -33.9, lon: 151.2 },
    { country: "New Zealand", text: "Geothermal expansion accelerates", agoMin: 700, image: "/images/aurora.svg", lat: -38.1, lon: 176.3 },
  ],
};
