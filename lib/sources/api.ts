import type { NewsSource, NewsStory } from "@/types";

/**
 * JSON API adapter (server-side only).
 *
 * For sources exposing an official news API. Credentials must come from
 * environment variables (process.env.NEWS_API_KEY etc.) and this module must
 * only be imported from server components or route handlers so keys are never
 * bundled to the client.
 */
export async function fetchApiStories(source: NewsSource): Promise<NewsStory[]> {
  if (!source.apiUrl) return [];
  // Live fetching intentionally not implemented in the demo build.
  return [];
}
