import type { NewsSource, NewsStory } from "@/types";

/**
 * RSS adapter (server-side only).
 *
 * Fetches and parses an RSS/Atom feed into NewsStory records. Only use feeds
 * the publisher offers for syndication and respect their terms of service.
 *
 * Implementation notes for going live:
 *  - fetch(source.rssUrl, { next: { revalidate: 300 } }) for ISR-style caching
 *  - parse with an XML parser (e.g. fast-xml-parser) — avoid regex parsing
 *  - map <item> title/pubDate/category into NewsStory
 *  - derive publishedAgoMin from pubDate at request time
 */
export async function fetchRssStories(source: NewsSource): Promise<NewsStory[]> {
  if (!source.rssUrl) return [];
  // Live parsing intentionally not implemented in the demo build.
  // Returning [] keeps the pipeline total — demo content covers the UI.
  return [];
}
