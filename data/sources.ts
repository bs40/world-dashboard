import type { NewsSource } from "@/types";

// Neutral demo sources. Real outlets can be configured here later by
// setting rssUrl / apiUrl and flipping `enabled` — see /lib/sources.
export const sources: NewsSource[] = [
  {
    id: "global-wire",
    name: "Global Wire",
    region: "Worldwide",
    category: "wire",
    trustTier: "primary",
    enabled: true,
  },
  {
    id: "public-broadcaster",
    name: "Public Broadcaster",
    region: "Europe",
    category: "broadcast",
    trustTier: "primary",
    enabled: true,
  },
  {
    id: "financial-desk",
    name: "Financial Desk",
    region: "Worldwide",
    category: "finance",
    trustTier: "high",
    enabled: true,
  },
  {
    id: "international-desk",
    name: "International Desk",
    region: "Worldwide",
    category: "world",
    trustTier: "high",
    enabled: true,
  },
  {
    id: "science-desk",
    name: "Science Desk",
    region: "Worldwide",
    category: "science",
    trustTier: "high",
    enabled: true,
  },
  {
    id: "regional-monitor",
    name: "Regional Monitor",
    region: "Asia-Pacific",
    category: "world",
    trustTier: "standard",
    enabled: true,
  },
  {
    id: "policy-observer",
    name: "Policy Observer",
    region: "Americas",
    category: "politics",
    trustTier: "standard",
    enabled: true,
  },
  {
    id: "climate-bureau",
    name: "Climate Bureau",
    region: "Worldwide",
    category: "environment",
    trustTier: "high",
    enabled: true,
  },
];

export function getSource(id: string): NewsSource | undefined {
  return sources.find((s) => s.id === id);
}
