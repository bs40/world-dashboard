import type { NewsSource } from "@/types";

/**
 * Live news sources.
 *
 * Every entry below points at a feed the publisher offers publicly for
 * syndication — the intended use of RSS. Items are shown as headline +
 * publisher-supplied summary + publisher-supplied thumbnail, always with
 * attribution and a link back to the original article. Full article text is
 * never reproduced.
 *
 * To add a source: append an entry with an `rssUrl`. To silence one without
 * deleting it, set `enabled: false`. Feeds are fetched server-side only
 * (see /lib/sources), so nothing here reaches the browser as a direct request.
 */
export const sources: NewsSource[] = [
  // ── BBC News ────────────────────────────────────────────────
  {
    id: "bbc-world",
    name: "BBC News",
    region: "Worldwide",
    category: "world",
    trustTier: "primary",
    rssUrl: "https://feeds.bbci.co.uk/news/world/rss.xml",
    defaultCategory: "politics",
    homepage: "https://www.bbc.co.uk/news",
    enabled: true,
  },
  {
    id: "bbc-business",
    name: "BBC Business",
    region: "Worldwide",
    category: "finance",
    trustTier: "primary",
    rssUrl: "https://feeds.bbci.co.uk/news/business/rss.xml",
    defaultCategory: "economy",
    homepage: "https://www.bbc.co.uk/news/business",
    enabled: true,
  },
  {
    id: "bbc-tech",
    name: "BBC Technology",
    region: "Worldwide",
    category: "technology",
    trustTier: "primary",
    rssUrl: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    defaultCategory: "technology",
    homepage: "https://www.bbc.co.uk/news/technology",
    enabled: true,
  },
  {
    id: "bbc-science",
    name: "BBC Science & Environment",
    region: "Worldwide",
    category: "science",
    trustTier: "primary",
    rssUrl: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    defaultCategory: "environment",
    homepage: "https://www.bbc.co.uk/news/science_and_environment",
    enabled: true,
  },
  {
    id: "bbc-health",
    name: "BBC Health",
    region: "Worldwide",
    category: "health",
    trustTier: "primary",
    rssUrl: "https://feeds.bbci.co.uk/news/health/rss.xml",
    defaultCategory: "health",
    homepage: "https://www.bbc.co.uk/news/health",
    enabled: true,
  },

  // ── The Guardian ────────────────────────────────────────────
  // Guardian entries carry both endpoints: with GUARDIAN_API_KEY set they use
  // the Content API (richer text, larger images); without it, the public RSS.
  {
    id: "guardian-world",
    name: "The Guardian",
    region: "Worldwide",
    category: "world",
    trustTier: "primary",
    rssUrl: "https://www.theguardian.com/world/rss",
    apiUrl: "https://content.guardianapis.com/search?section=world",
    defaultCategory: "politics",
    homepage: "https://www.theguardian.com/world",
    enabled: true,
  },
  {
    id: "guardian-business",
    name: "Guardian Business",
    region: "Worldwide",
    category: "finance",
    trustTier: "primary",
    rssUrl: "https://www.theguardian.com/uk/business/rss",
    apiUrl: "https://content.guardianapis.com/search?section=business",
    defaultCategory: "economy",
    homepage: "https://www.theguardian.com/uk/business",
    enabled: true,
  },
  {
    id: "guardian-environment",
    name: "Guardian Environment",
    region: "Worldwide",
    category: "environment",
    trustTier: "primary",
    rssUrl: "https://www.theguardian.com/environment/rss",
    apiUrl: "https://content.guardianapis.com/search?section=environment",
    defaultCategory: "environment",
    homepage: "https://www.theguardian.com/environment",
    enabled: true,
  },
  {
    id: "guardian-tech",
    name: "Guardian Technology",
    region: "Worldwide",
    category: "technology",
    trustTier: "primary",
    rssUrl: "https://www.theguardian.com/uk/technology/rss",
    apiUrl: "https://content.guardianapis.com/search?section=technology",
    defaultCategory: "technology",
    homepage: "https://www.theguardian.com/uk/technology",
    enabled: true,
  },

  // ── International broadcasters & agencies ───────────────────
  {
    id: "aljazeera",
    name: "Al Jazeera",
    region: "Middle East",
    category: "world",
    trustTier: "high",
    rssUrl: "https://www.aljazeera.com/xml/rss/all.xml",
    defaultCategory: "politics",
    homepage: "https://www.aljazeera.com",
    enabled: true,
  },
  {
    id: "france24",
    name: "France 24",
    region: "Europe",
    category: "world",
    trustTier: "high",
    rssUrl: "https://www.france24.com/en/rss",
    defaultCategory: "politics",
    homepage: "https://www.france24.com/en/",
    enabled: true,
  },
  {
    id: "dw",
    name: "Deutsche Welle",
    region: "Europe",
    category: "world",
    trustTier: "high",
    rssUrl: "https://rss.dw.com/rdf/rss-en-all",
    defaultCategory: "politics",
    homepage: "https://www.dw.com/en/",
    enabled: true,
  },
  {
    id: "npr-world",
    name: "NPR World",
    region: "Americas",
    category: "world",
    trustTier: "high",
    rssUrl: "https://feeds.npr.org/1004/rss.xml",
    defaultCategory: "politics",
    homepage: "https://www.npr.org/sections/world/",
    enabled: true,
  },
  {
    id: "cbc-world",
    name: "CBC World",
    region: "Americas",
    category: "world",
    trustTier: "high",
    rssUrl: "https://rss.cbc.ca/lineup/world.xml",
    defaultCategory: "politics",
    homepage: "https://www.cbc.ca/news/world",
    enabled: true,
  },

  // ── Institutions & science ──────────────────────────────────
  {
    id: "un-news",
    name: "UN News",
    region: "Worldwide",
    category: "institution",
    trustTier: "primary",
    rssUrl: "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
    defaultCategory: "society",
    homepage: "https://news.un.org/en/",
    enabled: true,
  },
  {
    id: "sciencedaily",
    name: "ScienceDaily",
    region: "Worldwide",
    category: "science",
    trustTier: "standard",
    rssUrl: "https://www.sciencedaily.com/rss/top/science.xml",
    defaultCategory: "science",
    homepage: "https://www.sciencedaily.com",
    enabled: true,
  },
];

/**
 * Neutral placeholder publishers used only by the bundled demo content
 * (/data/news.ts, /data/regions.ts). They are deliberately fictional: demo
 * stories must never be attributed to a real newsroom. These are never
 * fetched — they carry no feed URL and are excluded from ingestion.
 */
export const demoSources: NewsSource[] = [
  { id: "global-wire", name: "Global Wire", region: "Worldwide", category: "wire", trustTier: "primary", enabled: false },
  { id: "public-broadcaster", name: "Public Broadcaster", region: "Europe", category: "broadcast", trustTier: "primary", enabled: false },
  { id: "financial-desk", name: "Financial Desk", region: "Worldwide", category: "finance", trustTier: "high", enabled: false },
  { id: "international-desk", name: "International Desk", region: "Worldwide", category: "world", trustTier: "high", enabled: false },
  { id: "science-desk", name: "Science Desk", region: "Worldwide", category: "science", trustTier: "high", enabled: false },
  { id: "regional-monitor", name: "Regional Monitor", region: "Asia-Pacific", category: "world", trustTier: "standard", enabled: false },
  { id: "policy-observer", name: "Policy Observer", region: "Americas", category: "politics", trustTier: "standard", enabled: false },
  { id: "climate-bureau", name: "Climate Bureau", region: "Worldwide", category: "environment", trustTier: "high", enabled: false },
];

export function getSource(id: string): NewsSource | undefined {
  return sources.find((s) => s.id === id) ?? demoSources.find((s) => s.id === id);
}

/** Only real, feed-backed sources are ever ingested. */
export const enabledSources = sources.filter((s) => s.enabled);
