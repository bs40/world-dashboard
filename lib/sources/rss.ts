import { XMLParser } from "fast-xml-parser";
import type { Category, NewsSource, NewsStory } from "@/types";
import { geocodeText } from "@/lib/geocode";

/**
 * RSS/Atom adapter — server-side only.
 *
 * Fetches a publisher's syndication feed and normalises items into NewsStory
 * records. Handles RSS 2.0, RDF and Atom, and pulls the largest thumbnail the
 * publisher advertises. Only the headline, the publisher's own summary and the
 * publisher's thumbnail are used; full article text is never reproduced and
 * every item keeps a link back to the original.
 */

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  processEntities: true,
  trimValues: true,
});

type XmlNode = Record<string, unknown>;

const FETCH_TIMEOUT_MS = 12_000;
/** Server-side cache window. Kept below the shortest client poll (5 min). */
export const FEED_REVALIDATE_SECONDS = 240;

// ── small helpers ────────────────────────────────────────────

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function isNode(value: unknown): value is XmlNode {
  return typeof value === "object" && value !== null;
}

/** Read a node that may be a bare string, a number, or { "#text": ... }. */
function text(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (isNode(value) && "#text" in value) return text(value["#text"]);
  return "";
}

function attr(node: unknown, name: string): string | undefined {
  if (!isNode(node)) return undefined;
  const v = node[`@_${name}`];
  return v === undefined || v === null ? undefined : String(v);
}

function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(input: string, max = 220): string {
  if (input.length <= max) return input;
  const cut = input.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : max).trimEnd()}…`;
}

/** FNV-1a — stable, short, URL-safe ids derived from the item's guid or link. */
function hashId(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

// ── image extraction ─────────────────────────────────────────

function looksLikeImage(url: string | undefined, type?: string): boolean {
  if (!url) return false;
  if (type && type.startsWith("image/")) return true;
  if (type && !type.startsWith("image/")) return false;
  return /\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(url);
}

/** Pick the candidate advertising the largest width. */
function largest(nodes: unknown[]): string | undefined {
  let bestUrl: string | undefined;
  let bestWidth = -1;
  for (const node of nodes) {
    const url = attr(node, "url");
    if (!url) continue;
    const type = attr(node, "type");
    const medium = attr(node, "medium");
    if (medium && medium !== "image") continue;
    if (type && !type.startsWith("image/")) continue;
    const width = Number(attr(node, "width") ?? 0);
    if (width > bestWidth) {
      bestWidth = width;
      bestUrl = url;
    }
  }
  return bestUrl;
}

/**
 * Request a larger rendition where the publisher's image CDN exposes size in
 * the path. BBC advertises 240px thumbnails but serves the same asset at
 * larger widths from the same public URL pattern.
 */
function upgradeImageUrl(url: string): string {
  return url.replace(/(ichef\.bbci\.co\.uk\/(?:ace|news)\/[a-z_]+\/)(\d{2,4})\//i, "$1800/");
}

function extractImage(item: XmlNode): string | undefined {
  const thumb = largest(toArray(item["media:thumbnail"]));
  if (thumb) return upgradeImageUrl(thumb);

  const content = largest(toArray(item["media:content"]));
  if (content) return upgradeImageUrl(content);

  const group = item["media:group"];
  if (isNode(group)) {
    const inGroup = largest(toArray(group["media:content"]));
    if (inGroup) return upgradeImageUrl(inGroup);
  }

  for (const enc of toArray(item.enclosure)) {
    const url = attr(enc, "url");
    if (looksLikeImage(url, attr(enc, "type"))) return upgradeImageUrl(url!);
  }

  // Last resort: an <img> embedded in the description or full-content field.
  const html = `${text(item.description)} ${text(item["content:encoded"])}`;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && looksLikeImage(match[1])) return upgradeImageUrl(match[1]);

  return undefined;
}

// ── category inference ───────────────────────────────────────

const CATEGORY_KEYWORDS: [Category, RegExp][] = [
  [
    "conflicts",
    /\b(war|warfare|missile|airstrike|air strike|troops|ceasefire|militant|militia|offensive|rebels?|insurgen\w*|invasion|gunmen|shelling|bombard\w*|hostages?|armed forces|frontline|front line|drone strike)\b/i,
  ],
  [
    "health",
    /\b(vaccines?|virus|outbreak|epidemic|pandemic|disease|hospitals?|cancer|patients?|ebola|measles|malaria|mental health|WHO|antibiotics?|obesity|dementia)\b/i,
  ],
  [
    "environment",
    /\b(climate|wildfires?|floods?|drought|heatwave|emissions|hurricane|typhoon|cyclone|pollution|renewables?|biodiversity|wildlife|glacier|deforestation|carbon|solar power|wind farm)\b/i,
  ],
  [
    "economy",
    /\b(inflation|markets?|GDP|economy|economic|trade|tariffs?|jobs|unemployment|stocks?|shares|central bank|interest rates?|recession|exports?|imports?|budget|profits?|earnings)\b/i,
  ],
  [
    "technology",
    /\b(AI|artificial intelligence|chips?|semiconductors?|software|cyber\w*|hack\w*|data breach|robots?|smartphones?|quantum|algorithm|startup|social media|internet)\b/i,
  ],
  [
    "science",
    /\b(researchers?|scientists?|study finds|discovery|space|NASA|telescope|physics|fossils?|astronomers?|astronomy|eclipse|comet|asteroid|genome|experiment)\b/i,
  ],
  [
    "society",
    /\b(migrants?|migration|refugees?|asylum|protests?|education|schools?|housing|poverty|human rights|inequality|census|welfare)\b/i,
  ],
  [
    "politics",
    /\b(elections?|president|prime minister|parliament|government|vote[sd]?|summit|sanctions|diplomat\w*|treaty|minister|senate|congress|referendum)\b/i,
  ],
];

function inferCategory(title: string, summary: string, fallback: Category): Category {
  const hay = `${title} ${summary}`;
  for (const [category, pattern] of CATEGORY_KEYWORDS) {
    if (pattern.test(hay)) return category;
  }
  return fallback;
}

// ── feed shape handling ──────────────────────────────────────

function extractItems(parsed: XmlNode): XmlNode[] {
  // RSS 2.0
  const rss = parsed.rss;
  if (isNode(rss) && isNode(rss.channel)) {
    return toArray(rss.channel.item).filter(isNode);
  }
  // RDF (e.g. Deutsche Welle)
  const rdf = parsed["rdf:RDF"];
  if (isNode(rdf)) {
    return toArray(rdf.item).filter(isNode);
  }
  // Atom
  const feed = parsed.feed;
  if (isNode(feed)) {
    return toArray(feed.entry).filter(isNode);
  }
  return [];
}

function itemLink(item: XmlNode): string {
  const raw = item.link;
  if (typeof raw === "string") return raw;
  // Atom uses <link href="..."/>, sometimes several with rel attributes.
  for (const node of toArray(raw)) {
    if (typeof node === "string") return node;
    const rel = attr(node, "rel");
    if (rel && rel !== "alternate") continue;
    const href = attr(node, "href");
    if (href) return href;
  }
  return text(raw);
}

function itemDate(item: XmlNode): Date | undefined {
  const candidates = [item.pubDate, item["dc:date"], item.published, item.updated, item.date];
  for (const candidate of candidates) {
    const value = text(candidate);
    if (!value) continue;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return undefined;
}

// ── public API ───────────────────────────────────────────────

export async function fetchRssStories(source: NewsSource): Promise<NewsStory[]> {
  if (!source.rssUrl) return [];

  const res = await fetch(source.rssUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      "user-agent": "WorldDashboard/1.0 (+https://github.com/bs40/world-dashboard) RSS reader",
      accept: "application/rss+xml, application/xml, text/xml, application/atom+xml;q=0.9, */*;q=0.8",
    },
    next: { revalidate: FEED_REVALIDATE_SECONDS },
  });

  if (!res.ok) throw new Error(`${source.id}: HTTP ${res.status}`);

  const xml = await res.text();
  const parsed = parser.parse(xml) as XmlNode;
  const items = extractItems(parsed);
  const now = Date.now();

  const stories: NewsStory[] = [];
  for (const item of items) {
    const headline = stripHtml(text(item.title));
    if (!headline) continue;

    const link = itemLink(item).trim();
    const guid = text(item.guid) || text(item.id) || link || headline;

    const rawSummary = text(item.description) || text(item.summary) || text(item["content:encoded"]);
    const summary = truncate(
      stripHtml(rawSummary)
        .replace(/\s*Continue reading\.\.\.\s*$/i, "")
        .replace(/\s*Read more\s*$/i, "")
    );

    const published = itemDate(item);
    const publishedAgoMin = published
      ? Math.max(0, Math.round((now - published.getTime()) / 60000))
      : 0;

    // Skip anything implausibly old for a live dashboard (stale feed entries).
    if (publishedAgoMin > 60 * 24 * 7) continue;

    const category = inferCategory(headline, summary, source.defaultCategory ?? "politics");
    const location = geocodeText(`${headline} ${summary}`);

    stories.push({
      id: `live-${hashId(guid)}`,
      headline,
      summary: summary || undefined,
      category,
      sourceId: source.id,
      sourceName: source.name,
      publishedAgoMin,
      publishedAt: published?.toISOString(),
      image: extractImage(item),
      location,
      regionId: location?.region,
      link: link || undefined,
      isLive: true,
    });
  }

  return stories;
}
