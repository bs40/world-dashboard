"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { fallbackFor } from "@/lib/imagery";
import { StatusPill } from "@/components/ui/StatusPill";
import { NewsCard } from "@/components/news/NewsCard";
import { useFeed } from "@/lib/feed";
import { cn, formatAgo, storyHref } from "@/lib/utils";
import type { NewsStory } from "@/types";

const TOP_STORIES_COUNT = 5;

interface OverviewPlan {
  top: NewsStory[];
  liveLead?: NewsStory;
  liveRecent: NewsStory[];
  picks: NewsStory[];
  featured?: NewsStory;
}

/**
 * Assign stories to Overview panels without repeats.
 *
 * Every panel reads from the same feed, so without a shared plan the newest
 * photo-led story would headline three panels at once. This claims stories in
 * priority order and never hands the same one out twice. Pure and
 * deterministic, so each panel computing it independently gets the same result.
 */
function planOverview(stories: NewsStory[]): OverviewPlan {
  const used = new Set<string>();
  const claim = (story?: NewsStory) => {
    if (!story) return undefined;
    used.add(story.id);
    return story;
  };
  const find = (test: (s: NewsStory) => boolean) =>
    claim(stories.find((s) => !used.has(s.id) && test(s)));
  const take = (n: number, test: (s: NewsStory) => boolean = () => true) => {
    const out: NewsStory[] = [];
    for (const s of stories) {
      if (out.length >= n) break;
      if (used.has(s.id) || !test(s)) continue;
      used.add(s.id);
      out.push(s);
    }
    return out;
  };

  const top = take(TOP_STORIES_COUNT);
  const liveLead = find((s) => Boolean(s.image && s.location)) ?? find((s) => Boolean(s.image));
  const liveRecent = take(3);
  const picks = [
    ...take(4, (s) =>
      Boolean(s.image) &&
      ["science", "environment", "society", "health", "technology"].includes(s.category)
    ),
  ];
  if (picks.length < 4) picks.push(...take(4 - picks.length, (s) => Boolean(s.image)));
  const featured = find((s) => Boolean(s.image && s.summary)) ?? find((s) => Boolean(s.image));

  return { top, liveLead, liveRecent, picks, featured };
}

function useOverviewPlan() {
  const { stories, status, isLive } = useFeed();
  const plan = useMemo(() => planOverview(stories), [stories]);
  return { plan, status, isLive };
}

/** Left column — newest headlines across every feed. */
export function TopStoriesList() {
  const { plan, status } = useOverviewPlan();
  const top = plan.top;

  if (status === "loading") {
    return (
      <div className="space-y-2">
        {Array.from({ length: TOP_STORIES_COUNT }).map((_, i) => (
          <div key={i} className="skeleton h-[76px] rounded-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {top.map((story) => (
        <NewsCard key={story.id} story={story} />
      ))}
    </div>
  );
}

/** Left column — a single photo-led story below Markets. */
export function FeaturedStoryCard() {
  const { plan, status } = useOverviewPlan();
  const featured = plan.featured;

  if (status === "loading" || !featured) return <div className="skeleton h-56 rounded-sm" />;

  return (
    <Panel padded={false} hover className="group relative overflow-hidden">
      <EditorialImage
        src={featured.image ?? fallbackFor(featured.category)}
        fallbackSrc={fallbackFor(featured.category)}
        alt=""
        className="h-36 w-full"
      />
      <div className="p-3">
        <h3 className="text-sm font-medium leading-snug text-frost group-hover:text-cyanpale">
          <Link href={storyHref(featured)} className="outline-none after:absolute after:inset-0">
            {featured.headline}
          </Link>
        </h3>
        <div className="label-caps-sm mt-1.5 text-steel-dim">
          {formatAgo(featured.publishedAgoMin)}
          {featured.sourceName ? ` · ${featured.sourceName}` : ""}
        </div>
      </div>
    </Panel>
  );
}

/** Right column — lead breaking item plus a rolling list of recent wires. */
export function LiveFeedPanel() {
  const { plan, status, isLive } = useOverviewPlan();
  const lead = plan.liveLead;
  const recent = plan.liveRecent;

  if (status === "loading" || !lead) return <div className="skeleton h-72 rounded-sm" />;

  return (
    <Panel padded={false} className="overflow-hidden">
      <div className="group relative">
        <div className="relative h-44">
          <EditorialImage
            src={lead.image ?? fallbackFor(lead.category)}
            fallbackSrc={fallbackFor(lead.category)}
            alt=""
            className="absolute inset-0"
          />
          <StatusPill
            tone={isLive ? "sev" : "warn"}
            pulse={isLive}
            className="absolute left-3 top-3 bg-ink/70 backdrop-blur-sm"
          >
            {isLive ? "Live" : "Demo"}
            {lead.location ? ` · ${lead.location.label}` : ""}
          </StatusPill>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium leading-snug text-frost transition-colors group-hover:text-cyanpale">
            <Link href={storyHref(lead)} className="outline-none after:absolute after:inset-0">
              {lead.headline}
            </Link>
          </h3>
          <div className="label-caps-sm mt-1 text-steel-dim">
            {formatAgo(lead.publishedAgoMin)}
            {lead.sourceName ? ` · ${lead.sourceName}` : ""}
          </div>
        </div>
      </div>

      <ul className="divide-y divide-edge-soft border-t border-edge-soft">
        {recent.map((story) => (
          <li key={story.id} className="group relative flex items-start gap-2 px-3 py-2">
            <span
              aria-hidden
              className={cn(
                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                story.category === "conflicts" ? "animate-pulse-dot bg-sev" : "bg-cyan"
              )}
            />
            <div className="min-w-0">
              <div className="label-caps-sm text-steel-dim">
                {story.location?.label ?? story.sourceName}
              </div>
              <div className="text-xs leading-snug text-frost transition-colors group-hover:text-cyanpale">
                <Link href={storyHref(story)} className="outline-none after:absolute after:inset-0">
                  {story.headline}
                </Link>
              </div>
            </div>
            <span className="label-caps-sm ml-auto shrink-0 text-steel-dim">
              {formatAgo(story.publishedAgoMin)}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** Right column — photo-led picks drawn from slower-burn categories. */
export function EditorsPicks() {
  const { plan, status } = useOverviewPlan();
  const picks = plan.picks;

  if (status === "loading" || picks.length === 0) {
    return <div className="skeleton h-64 rounded-sm" />;
  }

  const [hero, ...rest] = picks;

  return (
    <div className="space-y-2">
      <Panel padded={false} hover className="group relative overflow-hidden">
        <EditorialImage
          src={hero.image ?? fallbackFor(hero.category)}
          fallbackSrc={fallbackFor(hero.category)}
          alt=""
          className="h-32 w-full"
        />
        <div className="p-3">
          <h3 className="text-sm font-medium leading-snug text-frost group-hover:text-cyanpale">
            <Link href={storyHref(hero)} className="outline-none after:absolute after:inset-0">
              {hero.headline}
            </Link>
          </h3>
          <div className="label-caps-sm mt-1 text-steel-dim">
            {hero.sourceName ?? "Feed"} · {formatAgo(hero.publishedAgoMin)}
          </div>
        </div>
      </Panel>

      {rest.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {rest.map((pick) => (
            <Panel key={pick.id} padded={false} hover className="group relative overflow-hidden">
              <EditorialImage
                src={pick.image ?? fallbackFor(pick.category)}
                fallbackSrc={fallbackFor(pick.category)}
                alt=""
                className="h-16 w-full"
              />
              <div className="p-2">
                <h4 className="line-clamp-3 text-[11px] leading-tight text-frost group-hover:text-cyanpale">
                  <Link href={storyHref(pick)} className="outline-none after:absolute after:inset-0">
                    {pick.headline}
                  </Link>
                </h4>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
