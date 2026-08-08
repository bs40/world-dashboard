import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, RefreshCw } from "lucide-react";
import { WorldMap } from "@/components/maps/WorldMap";
import { NewsCard } from "@/components/news/NewsCard";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { fallbackFor } from "@/lib/imagery";
import { Panel } from "@/components/ui/Panel";
import { SaveButton } from "@/components/ui/SaveButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { StatusPill } from "@/components/ui/StatusPill";
import { allStories, getArticle } from "@/data/articles";
import { getSource } from "@/data/sources";
import { findLiveStory } from "@/lib/sources";
import { formatAgo, storyHref } from "@/lib/utils";
import type { Category, NewsStory } from "@/types";

const CATEGORY_LABEL: Record<Category, string> = {
  politics: "Politics",
  conflicts: "Conflicts",
  economy: "Economy",
  environment: "Environment",
  society: "Society",
  technology: "Technology",
  health: "Health",
  science: "Science",
};

const CATEGORY_TONE = {
  politics: "cyan",
  conflicts: "sev",
  economy: "pos",
  environment: "pos",
  society: "warn",
  technology: "tech",
  health: "sev",
  science: "tech",
} as const;

/** Demo articles are prerendered; live ones render on demand. */
export function generateStaticParams() {
  return allStories.map((s) => ({ id: s.id }));
}

// Only the prerendered demo ids exist here; live stories always route through
// the client-rendered /news/story/?id= page instead (see storyHref).
export const dynamicParams = false;

async function resolve(id: string): Promise<
  | { kind: "demo"; story: NewsStory; body: string[]; related: NewsStory[] }
  | { kind: "live"; story: NewsStory; related: NewsStory[] }
  | { kind: "expired" }
  | undefined
> {
  const demo = getArticle(id);
  if (demo) return { kind: "demo", ...demo };

  if (id.startsWith("live-")) {
    const live = await findLiveStory(id);
    if (live) return { kind: "live", ...live };
    // The id is well-formed but the item has rotated out of the feed window.
    return { kind: "expired" };
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resolved = await resolve(id);
  if (!resolved || resolved.kind === "expired") return { title: "Story" };
  return { title: resolved.story.headline };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = await resolve(id);
  if (!resolved) notFound();

  if (resolved.kind === "expired") {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Link
          href="/news"
          className="label-caps-sm inline-flex items-center gap-1.5 text-steel transition-colors hover:text-cyanpale"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All stories
        </Link>
        <Panel className="mt-4 flex flex-col items-center py-14 text-center">
          <RefreshCw className="h-7 w-7 text-steel-dim" aria-hidden />
          <h1 className="mt-3 font-display text-lg text-frost">This story has rotated out</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-steel">
            Publisher feeds only carry a rolling window of recent items, and this one has
            since dropped off. The newsroom always shows what is currently live.
          </p>
          <Link
            href="/news"
            className="label-caps mt-5 rounded-sm border border-cyan/40 bg-cyan/10 px-4 py-2 text-cyanpale transition-colors hover:bg-cyan/20"
          >
            Back to top stories
          </Link>
        </Panel>
      </div>
    );
  }

  const { story, related } = resolved;
  const source = getSource(story.sourceId);
  const loc = story.location;
  const isLive = resolved.kind === "live";

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 lg:p-6">
      <Link
        href="/news"
        className="label-caps-sm inline-flex items-center gap-1.5 text-steel transition-colors hover:text-cyanpale"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All stories
      </Link>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* ── Article ── */}
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={CATEGORY_TONE[story.category]}>
              {CATEGORY_LABEL[story.category]}
            </StatusPill>
            {isLive ? (
              <StatusPill tone="pos" pulse>
                Live feed
              </StatusPill>
            ) : (
              <span className="label-caps-sm text-steel-dim">Demo article · illustrative content</span>
            )}
          </div>

          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-frost lg:text-4xl">
            {story.headline}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-edge-soft py-2.5">
            <SourceBadge sourceId={story.sourceId} />
            <span className="label-caps-sm text-steel-dim">{formatAgo(story.publishedAgoMin)}</span>
            {loc && (
              <span className="label-caps-sm flex items-center gap-1 text-steel-dim">
                <MapPin className="h-3 w-3" aria-hidden />
                {loc.label}
              </span>
            )}
            {story.sourcesCount && story.sourcesCount > 1 && (
              <span className="label-caps-sm text-steel-dim">
                {story.sourcesCount} sources reporting
              </span>
            )}
            <SaveButton
              id={`story-${story.id}`}
              kind="story"
              title={story.headline}
              href={storyHref(story)}
              meta={CATEGORY_LABEL[story.category]}
              className="ml-auto"
            />
          </div>

          <figure className="mt-5">
            <EditorialImage
              src={story.image ?? fallbackFor(story.category)}
              fallbackSrc={fallbackFor(story.category)}
              alt=""
              className="h-64 w-full rounded-sm md:h-80"
              eager
            />
            <figcaption className="label-caps-sm mt-1.5 text-steel-dim">
              {isLive
                ? `Image: ${story.sourceName ?? source?.name ?? "publisher"} — shown via their public news feed`
                : "Illustration · procedural imagery, World Dashboard"}
            </figcaption>
          </figure>

          {isLive ? (
            <div className="mt-6 max-w-2xl">
              {story.summary && (
                <p className="text-lg leading-relaxed text-frost/95">{story.summary}</p>
              )}
              <div className="panel mt-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="label-caps text-frost">Read the full story</div>
                  <p className="mt-1 text-xs leading-relaxed text-steel">
                    World Dashboard shows the headline and the summary {story.sourceName ?? "the publisher"}{" "}
                    provides in its news feed. The full article stays with them.
                  </p>
                </div>
                {story.link && (
                  <a
                    href={story.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-caps group inline-flex shrink-0 items-center gap-2 rounded-sm border border-cyan/50 bg-cyan/10 px-4 py-2.5 text-cyanpale shadow-glow transition-colors hover:bg-cyan/20"
                  >
                    {story.sourceName ?? "Publisher"}
                    <ExternalLink
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <>
              {story.summary && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel">{story.summary}</p>
              )}
              <div className="mt-6 max-w-2xl space-y-5">
                {resolved.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "text-base leading-relaxed text-frost/95 first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-cyan"
                        : "text-[15px] leading-relaxed text-frost/85"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          )}

          <div className="label-caps-sm mt-8 flex items-center gap-2 border-t border-edge-soft pt-3 text-steel-dim">
            <span aria-hidden className="h-1 w-1 rounded-full bg-cyan" />
            {isLive
              ? "Headline and summary syndicated from the publisher's news feed"
              : `Reporting compiled from ${story.sourcesCount ?? "multiple"} monitored sources · demo content`}
          </div>
        </article>

        {/* ── Right rail ── */}
        <aside className="space-y-4">
          {loc && (
            <section aria-labelledby="story-location">
              <SectionHeader title="Location" as="h2" />
              <Panel padded={false}>
                <WorldMap
                  markers={[
                    {
                      id: story.id,
                      lat: loc.lat,
                      lon: loc.lon,
                      label: loc.label,
                      detail: story.headline,
                      category: story.category,
                      severity: story.category === "conflicts" ? "high" : "moderate",
                    },
                  ]}
                  window={{
                    lonMin: loc.lon - 32,
                    lonMax: loc.lon + 32,
                    latMin: Math.max(-56, loc.lat - 18),
                    latMax: Math.min(78, loc.lat + 18),
                  }}
                  className="min-h-40"
                  ariaLabel={`Map showing ${loc.label}`}
                />
                <div className="label-caps-sm flex items-center gap-1.5 border-t border-edge-soft px-3 py-2 text-steel-dim">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {loc.label}
                  {isLive && <span className="text-steel-dim">· inferred from headline</span>}
                </div>
              </Panel>
            </section>
          )}

          {source && (
            <section aria-labelledby="story-source">
              <SectionHeader title="Source" as="h2" />
              <Panel>
                <div className="text-sm font-medium text-frost">{story.sourceName ?? source.name}</div>
                <div className="label-caps-sm mt-1 text-steel-dim">
                  {source.region} · {source.category}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusPill tone={source.trustTier === "primary" ? "cyan" : "neutral"}>
                    {source.trustTier} tier
                  </StatusPill>
                  {source.homepage && (
                    <a
                      href={source.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-caps-sm inline-flex items-center gap-1 text-cyan transition-colors hover:text-cyanpale"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  )}
                </div>
              </Panel>
            </section>
          )}

          {related.length > 0 && (
            <section aria-labelledby="related-coverage">
              <SectionHeader title="Related coverage" as="h2" />
              <div className="space-y-2">
                {related.map((s) => (
                  <NewsCard key={s.id} story={s} />
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
