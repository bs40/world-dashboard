// Core domain types for World Dashboard.
// All mock data in /data conforms to these shapes so live adapters
// under /lib/sources and /lib/api can swap in real content later.

export type Category =
  | "politics"
  | "conflicts"
  | "economy"
  | "environment"
  | "society"
  | "technology"
  | "health"
  | "science";

export type Severity = "low" | "moderate" | "high" | "extreme";

export type Trend = "up" | "down" | "flat";

export interface NewsSource {
  id: string;
  name: string;
  region: string;
  category: string;
  trustTier: "primary" | "high" | "standard";
  rssUrl?: string;
  apiUrl?: string;
  enabled: boolean;
}

export interface NewsStory {
  id: string;
  headline: string;
  summary?: string;
  category: Category;
  sourceId: string;
  publishedAgoMin: number; // minutes ago, relative for demo data
  sourcesCount?: number;
  image?: string; // path under /public
  location?: { lat: number; lon: number; label: string };
  live?: boolean;
  featured?: boolean;
}

export interface LiveUpdate {
  id: string;
  location: string;
  text: string;
  agoMin: number;
  breaking?: boolean;
}

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  changePct: number;
  spark: number[];
}

export interface GlobalMetric {
  id: string;
  label: string;
  value: string;
  sub: string;
  icon: string;
  trend?: Trend;
  changeLabel?: string;
}

export interface RegionIndicator {
  label: string;
  value: string;
  change?: string;
  trend?: Trend;
}

export interface RegionStat {
  label: string;
  value: string;
  note?: string;
}

export interface Region {
  id: string;
  name: string;
  countries: number;
  population: string;
  indicators: RegionIndicator[];
  stats: RegionStat[];
  headlines: NewsStory[];
  mapWindow: { lonMin: number; lonMax: number; latMin: number; latMax: number };
  summary: string;
}

export interface TopicKeyFact {
  text: string;
}

export interface Topic {
  slug: string;
  name: string;
  category: Category;
  overview: string;
  keyFacts: string[];
  relatedTopics: string[];
  relatedDatasets: string[];
  followerLabel: string;
}

export interface Conflict {
  id: string;
  name: string;
  parties: string;
  status: "ongoing" | "escalating" | "stable" | "de-escalating";
  intensity: Severity;
  displaced: string;
  trend: number[];
  since: string;
  region: string;
  location: { lat: number; lon: number };
  image?: string;
}

export interface ConflictDevelopment {
  id: string;
  title: string;
  agoH: number;
  image: string;
  sourcesCount: number;
}

export interface Report {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  date: string;
  image: string;
  kind: "featured" | "daily" | "weekly" | "special";
  summary?: string;
}

export interface Dataset {
  id: string;
  name: string;
  icon: string;
  provider: string;
  series?: number[];
}

export interface MapMarker {
  id: string;
  lat: number;
  lon: number;
  label: string;
  detail?: string;
  category: Category;
  severity?: Severity;
  agoLabel?: string;
}

export interface SearchItem {
  id: string;
  title: string;
  kind: "country" | "region" | "topic" | "story" | "report" | "dataset";
  href: string;
  meta?: string;
}

export type SavedKind = "story" | "report" | "topic" | "region" | "dataset";

export interface SavedItem {
  id: string;
  kind: SavedKind;
  title: string;
  href: string;
  meta?: string;
  savedAt: number;
}
