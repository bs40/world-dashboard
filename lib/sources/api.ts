import type { Category, NewsSource, NewsStory } from "@/types";
import { geocodeText } from "@/lib/geocode";

/**
 * JSON API adapter — server-side only.
 *
 * Currently implements the Guardian Open Platform Content API, which returns
 * richer material than the public RSS feed: a proper trail text, larger image
 * assets and reliable section metadata.
 *
 * The key is read from process.env.GUARDIAN_API_KEY and is never bundled to
 * the client. When no key is configured, sources fall back to their RSS feed
 * automatically (see hasApiCredentials / lib/sources/index.ts), so the app
 * works with or without one.
 */

const FETCH_TIMEOUT_MS = 12_000;
const REVALIDATE_SECONDS = 240;

export function guardianKey(): string | undefined {
  const key = process.env.GUARDIAN_API_KEY?.trim();
  return key ? key : undefined;
}

/** True when this source has working credentials for its API endpoint. */
export function hasApiCredentials(source: NewsSource): boolean {
  if (!source.apiUrl) return false;
  if (source.apiUrl.includes("content.guardianapis.com")) return Boolean(guardianKey());
  return false;
}

// ── Guardian response shapes (only the fields used here) ─────

interface GuardianAsset {
  file?: string;
  typeData?: { width?: string; secureFile?: string };
}

interface GuardianElement {
  type?: string;
  relation?: string;
  assets?: GuardianAsset[];
}

interface GuardianResult {
  id?: string;
  sectionId?: string;
  sectionName?: string;
  webPublicationDate?: string;
  webTitle?: string;
  webUrl?: string;
  fields?: { trailText?: string; thumbnail?: string; headline?: string };
  elements?: GuardianElement[];
}

interface GuardianResponse {
  response?: { status?: string; results?: GuardianResult[]; message?: string };
}

const SECTION_CATEGORY: Record<string, Category> = {
  world: "politics",
  politics: "politics",
  "us-news": "politics",
  "uk-news": "politics",
  australia_news: "politics",
  business: "economy",
  money: "economy",
  environment: "environment",
  science: "science",
  technology: "technology",
  society: "society",
  education: "society",
  global_development: "society",
  healthcare_network: "health",
  sport: "society",
};

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(input: string, max = 220): string {
  if (input.length <= max) return input;
  const cut = input.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : max).trimEnd()}…`;
}

function hashId(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/** Largest main-image asset, falling back to the small thumbnail field. */
function pickImage(result: GuardianResult): string | undefined {
  const main = result.elements?.find((e) => e.type === "image" && e.relation === "main");
  let best: string | undefined;
  let bestWidth = -1;
  for (const asset of main?.assets ?? []) {
    const url = asset.typeData?.secureFile ?? asset.file;
    if (!url) continue;
    const width = Number(asset.typeData?.width ?? 0);
    // Cap the size we request so cards stay light.
    if (width > bestWidth && width <= 1200) {
      bestWidth = width;
      best = url;
    }
  }
  return best ?? result.fields?.thumbnail;
}

export async function fetchApiStories(source: NewsSource): Promise<NewsStory[]> {
  if (!source.apiUrl) return [];
  if (!source.apiUrl.includes("content.guardianapis.com")) return [];

  const key = guardianKey();
  if (!key) return [];

  const url = new URL(source.apiUrl);
  url.searchParams.set("api-key", key);
  url.searchParams.set("order-by", "newest");
  url.searchParams.set("page-size", "50");
  url.searchParams.set("show-fields", "trailText,thumbnail,headline");
  url.searchParams.set("show-elements", "image");

  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "user-agent": "WorldDashboard/1.0 (+https://github.com/bs40/world-dashboard)" },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    // 401/403 almost always means a bad or exhausted key — surface it clearly.
    throw new Error(
      res.status === 401 || res.status === 403
        ? `${source.id}: Guardian API rejected the key (HTTP ${res.status})`
        : `${source.id}: Guardian API HTTP ${res.status}`
    );
  }

  const data = (await res.json()) as GuardianResponse;
  if (data.response?.status !== "ok") {
    throw new Error(`${source.id}: ${data.response?.message ?? "Guardian API error"}`);
  }

  const now = Date.now();
  const stories: NewsStory[] = [];

  for (const result of data.response.results ?? []) {
    const headline = stripHtml(result.fields?.headline ?? result.webTitle ?? "");
    if (!headline) continue;

    const summary = truncate(stripHtml(result.fields?.trailText ?? ""));
    const published = result.webPublicationDate ? new Date(result.webPublicationDate) : undefined;
    const publishedAgoMin =
      published && !Number.isNaN(published.getTime())
        ? Math.max(0, Math.round((now - published.getTime()) / 60000))
        : 0;

    stories.push({
      id: `live-${hashId(result.id ?? result.webUrl ?? headline)}`,
      headline,
      summary: summary || undefined,
      category:
        SECTION_CATEGORY[result.sectionId ?? ""] ?? source.defaultCategory ?? "politics",
      sourceId: source.id,
      sourceName: source.name,
      publishedAgoMin,
      publishedAt: published?.toISOString(),
      image: pickImage(result),
      location: geocodeText(`${headline} ${summary}`),
      link: result.webUrl,
      isLive: true,
    });
  }

  return stories;
}
