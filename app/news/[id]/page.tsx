import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { WorldMap } from "@/components/maps/WorldMap";
import { NewsCard } from "@/components/news/NewsCard";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Panel } from "@/components/ui/Panel";
import { SaveButton } from "@/components/ui/SaveButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { StatusPill } from "@/components/ui/StatusPill";
import { allStories, getArticle } from "@/data/articles";
import { getSource } from "@/data/sources";
import { formatAgo } from "@/lib/utils";
import type { Category } from "@/types";

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

export function generateStaticParams() {
  return allStories.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = getArticle(id);
  return { title: article ? article.story.headline : "Story" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) notFound();

  const { story, body, related } = article;
  const source = getSource(story.sourceId);
  const loc = story.location;

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
            {story.live && (
              <StatusPill tone="sev" pulse>
                Live coverage
              </StatusPill>
            )}
            <span className="label-caps-sm text-steel-dim">Demo article · illustrative content</span>
          </div>

          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-frost lg:text-4xl">
            {story.headline}
          </h1>

          {story.summary && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-steel">{story.summary}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-edge-soft py-2.5">
            <SourceBadge sourceId={story.sourceId} />
            <span className="label-caps-sm text-steel-dim">{formatAgo(story.publishedAgoMin)}</span>
            {loc && (
              <span className="label-caps-sm flex items-center gap-1 text-steel-dim">
                <MapPin className="h-3 w-3" aria-hidden />
                {loc.label}
              </span>
            )}
            {story.sourcesCount && (
              <span className="label-caps-sm text-steel-dim">{story.sourcesCount} sources reporting</span>
            )}
            <SaveButton
              id={`story-${story.id}`}
              kind="story"
              title={story.headline}
              href={`/news/${story.id}`}
              meta={CATEGORY_LABEL[story.category]}
              className="ml-auto"
            />
          </div>

          {story.image && (
            <figure className="mt-5">
              <EditorialImage src={story.image} alt="" className="h-64 w-full rounded-sm md:h-80" />
              <figcaption className="label-caps-sm mt-1.5 text-steel-dim">
                Illustration · procedural imagery, World Dashboard
              </figcaption>
            </figure>
          )}

          <div className="mt-6 max-w-2xl space-y-5">
            {body.map((paragraph, i) => (
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

          <div className="label-caps-sm mt-8 flex items-center gap-2 border-t border-edge-soft pt-3 text-steel-dim">
            <span aria-hidden className="h-1 w-1 rounded-full bg-cyan" />
            Reporting compiled from {story.sourcesCount ?? "multiple"} monitored sources · demo content
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
                </div>
              </Panel>
            </section>
          )}

          {source && (
            <section aria-labelledby="story-source">
              <SectionHeader title="Source" as="h2" />
              <Panel>
                <div className="text-sm font-medium text-frost">{source.name}</div>
                <div className="label-caps-sm mt-1 text-steel-dim">
                  {source.region} · {source.category}
                </div>
                <div className="mt-2">
                  <StatusPill tone={source.trustTier === "primary" ? "cyan" : "neutral"}>
                    {source.trustTier} tier
                  </StatusPill>
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
