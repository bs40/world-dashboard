import type { NewsSource, NewsStory } from "@/types";
import { sources } from "@/data/sources";
import { fetchRssStories } from "./rss";
import { fetchApiStories } from "./api";

/**
 * Source ingestion layer.
 *
 * Every enabled source resolves through an adapter based on which endpoints
 * it declares. Sources with neither rssUrl nor apiUrl fall back to the demo
 * content in /data/news.ts, so the UI is always populated.
 *
 * To go live: add rssUrl/apiUrl to entries in /data/sources.ts and implement
 * parsing in ./rss.ts or ./api.ts. Fetching should stay server-side (route
 * handlers / server components) so keys never reach the client — see
 * /lib/api/README notes in each adapter.
 */
export async function ingestSource(source: NewsSource): Promise<NewsStory[]> {
  if (!source.enabled) return [];
  if (source.rssUrl) return fetchRssStories(source);
  if (source.apiUrl) return fetchApiStories(source);
  return []; // demo sources have no live endpoint yet
}

export async function ingestAll(): Promise<NewsStory[]> {
  const results = await Promise.allSettled(sources.map(ingestSource));
  return results
    .filter((r): r is PromiseFulfilledResult<NewsStory[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .sort((a, b) => a.publishedAgoMin - b.publishedAgoMin);
}
