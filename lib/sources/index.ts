import type { NewsSource, NewsStory } from "@/types";
import { enabledSources, sources } from "@/data/sources";
import { fetchRssStories } from "./rss";
import { fetchApiStories, hasApiCredentials } from "./api";

/**
 * Source ingestion layer.
 *
 * Fans out across every enabled source, normalises the results and merges
 * duplicate coverage so a story carried by several publishers appears once
 * with an accurate "N sources reporting" count.
 *
 * Server-side only — never import this from a client component.
 */

export interface SourceStatus {
  id: string;
  name: string;
  ok: boolean;
  count: number;
  error?: string;
}

export interface IngestResult {
  stories: NewsStory[];
  statuses: SourceStatus[];
  fetchedAt: string;
}

/** Cap on stories returned to the browser — well above what any view renders. */
const MAX_STORIES = 240;

/**
 * Prefer a credentialled API over RSS when one is configured — it returns
 * richer text and larger images — and fall back to the public feed otherwise.
 */
export async function ingestSource(source: NewsSource): Promise<NewsStory[]> {
  if (!source.enabled) return [];
  if (hasApiCredentials(source)) return fetchApiStories(source);
  if (source.rssUrl) return fetchRssStories(source);
  if (source.apiUrl) return fetchApiStories(source);
  return [];
}

// ── duplicate detection ──────────────────────────────────────

const STOPWORDS = new Set([
  "after", "about", "again", "against", "amid", "among", "before", "being", "between",
  "could", "during", "from", "have", "into", "more", "most", "over", "said", "says",
  "should", "since", "than", "that", "their", "them", "there", "these", "they", "this",
  "those", "through", "under", "until", "what", "when", "where", "which", "while",
  "will", "with", "would", "your", "first", "just", "like", "make", "many", "much",
  "near", "next", "only", "other", "some", "such", "take", "time", "very", "were",
]);

/** Significant lowercase words used to compare headlines. */
function signature(headline: string): Set<string> {
  return new Set(
    headline
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w))
  );
}

function overlapRatio(a: Set<string>, b: Set<string>): number {
  const smaller = a.size <= b.size ? a : b;
  const larger = smaller === a ? b : a;
  if (smaller.size === 0) return 0;
  let shared = 0;
  for (const word of smaller) if (larger.has(word)) shared++;
  return shared / smaller.size;
}

const TIER_RANK = { primary: 0, high: 1, standard: 2 } as const;

/** Prefer the copy with an image, then the higher-trust publisher, then the newer item. */
function preferred(a: NewsStory, b: NewsStory): NewsStory {
  if (Boolean(a.image) !== Boolean(b.image)) return a.image ? a : b;
  const rankA = TIER_RANK[sources.find((s) => s.id === a.sourceId)?.trustTier ?? "standard"];
  const rankB = TIER_RANK[sources.find((s) => s.id === b.sourceId)?.trustTier ?? "standard"];
  if (rankA !== rankB) return rankA < rankB ? a : b;
  return a.publishedAgoMin <= b.publishedAgoMin ? a : b;
}

/**
 * Merge near-identical headlines across feeds. Conservative by design: an
 * unrelated pair sharing a couple of words stays separate.
 */
function dedupe(stories: NewsStory[]): NewsStory[] {
  const kept: { story: NewsStory; sig: Set<string>; publishers: Set<string> }[] = [];
  const seenLinks = new Set<string>();

  for (const story of stories) {
    if (story.link) {
      if (seenLinks.has(story.link)) continue;
      seenLinks.add(story.link);
    }
    const sig = signature(story.headline);
    let merged = false;

    if (sig.size >= 3) {
      for (const entry of kept) {
        if (entry.sig.size < 3) continue;
        if (overlapRatio(sig, entry.sig) >= 0.65) {
          entry.publishers.add(story.sourceId);
          entry.story = preferred(entry.story, story);
          merged = true;
          break;
        }
      }
    }

    if (!merged) {
      kept.push({ story, sig, publishers: new Set([story.sourceId]) });
    }
  }

  return kept.map(({ story, publishers }) => ({
    ...story,
    sourcesCount: publishers.size > 1 ? publishers.size : undefined,
  }));
}

// ── public API ───────────────────────────────────────────────

/**
 * Look up a single live story plus same-category neighbours.
 * Cheap in practice — the upstream feed fetches are cached by rss.ts.
 */
export async function findLiveStory(
  id: string
): Promise<{ story: NewsStory; related: NewsStory[] } | undefined> {
  const { stories } = await ingestAll();
  const story = stories.find((s) => s.id === id);
  if (!story) return undefined;
  const related = stories
    .filter((s) => s.id !== id && s.category === story.category)
    .slice(0, 4);
  return { story, related };
}

export async function ingestAll(): Promise<IngestResult> {
  const targets = enabledSources;
  const settled = await Promise.allSettled(targets.map(ingestSource));

  const statuses: SourceStatus[] = settled.map((result, i) => ({
    id: targets[i].id,
    name: targets[i].name,
    ok: result.status === "fulfilled",
    count: result.status === "fulfilled" ? result.value.length : 0,
    error:
      result.status === "rejected"
        ? String(result.reason instanceof Error ? result.reason.message : result.reason).slice(0, 200)
        : undefined,
  }));

  const all = settled
    .filter((r): r is PromiseFulfilledResult<NewsStory[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const stories = dedupe(all)
    .sort((a, b) => a.publishedAgoMin - b.publishedAgoMin)
    .slice(0, MAX_STORIES);

  return { stories, statuses, fetchedAt: new Date().toISOString() };
}
