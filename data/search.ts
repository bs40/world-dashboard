import type { SearchItem } from "@/types";
import { topStories } from "./news";
import { regions } from "./regions";
import { topics } from "./topics";
import { recentReports, explorerDatasets } from "./reports";

const countries: SearchItem[] = [
  "United States", "China", "India", "Germany", "France", "United Kingdom",
  "Japan", "Brazil", "Nigeria", "Indonesia", "Ukraine", "Kenya", "Mexico",
  "Canada", "Australia", "South Africa", "Saudi Arabia", "South Korea",
].map((name) => ({
  id: `country-${name.toLowerCase().replace(/\s+/g, "-")}`,
  title: name,
  kind: "country",
  href: "/regions",
  meta: "Country",
}));

export const searchIndex: SearchItem[] = [
  ...regions.map((r): SearchItem => ({
    id: `region-${r.id}`,
    title: r.name,
    kind: "region",
    href: `/regions?region=${r.id}`,
    meta: `${r.countries} countries · ${r.population}`,
  })),
  ...topics.map((t): SearchItem => ({
    id: `topic-${t.slug}`,
    title: t.name,
    kind: "topic",
    href: `/topics?topic=${t.slug}`,
    meta: "Topic",
  })),
  {
    id: "topic-conflicts",
    title: "Conflict Tracker",
    kind: "topic",
    href: "/topics/conflicts",
    meta: "Live tracker",
  },
  ...topStories.map((s): SearchItem => ({
    id: `story-${s.id}`,
    title: s.headline,
    kind: "story",
    href: `/news/${s.id}`,
    meta: "News story",
  })),
  ...recentReports.map((r): SearchItem => ({
    id: `report-${r.id}`,
    title: r.title,
    kind: "report",
    href: "/insights",
    meta: r.date,
  })),
  ...explorerDatasets.map((d): SearchItem => ({
    id: `dataset-${d.id}`,
    title: d.name,
    kind: "dataset",
    href: "/insights",
    meta: d.provider,
  })),
  ...countries,
];
