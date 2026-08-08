"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { WorldMap } from "@/components/maps/WorldMap";
import { HeroStory } from "./HeroStory";
import { NewsCard } from "./NewsCard";
import { useFeed } from "@/lib/feed";
import { sources } from "@/data/sources";
import { cn, formatAgo, storyHref } from "@/lib/utils";
import type { Category, MapMarker } from "@/types";

const TABS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "politics", label: "Politics" },
  { id: "economy", label: "Economy" },
  { id: "technology", label: "Technology" },
  { id: "environment", label: "Environment" },
  { id: "health", label: "Health" },
  { id: "society", label: "Society" },
];

export function NewsRoom() {
  const [tab, setTab] = useState("all");
  const { stories, status, isLive } = useFeed();

  const filtered = useMemo(
    () =>
      stories.filter(
        (s) => tab === "all" || s.category === tab || (tab === "politics" && s.category === "conflicts")
      ),
    [stories, tab]
  );

  // Lead with the newest story that actually carries a photograph.
  const lead = filtered.find((s) => s.featured) ?? filtered.find((s) => s.image) ?? filtered[0];
  const others = filtered.filter((s) => s.id !== lead?.id);
  const secondary = others.slice(0, 3);
  const rest = others.slice(3, 15);

  const liveUpdates = useMemo(
    () => stories.filter((s) => s.location).slice(0, 5),
    [stories]
  );

  const markers: MapMarker[] = useMemo(
    () =>
      filtered
        .filter((s) => s.location)
        .slice(0, 60)
        .map((s) => ({
          id: s.id,
          lat: s.location!.lat,
          lon: s.location!.lon,
          label: s.location!.label,
          detail: s.headline,
          category: s.category as Category,
          severity: s.category === "conflicts" ? "high" : "moderate",
          agoLabel: formatAgo(s.publishedAgoMin),
        })),
    [filtered]
  );

  return (
    <div className="space-y-4 p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold tracking-wide text-frost">TOP STORIES</h1>
        <div className="flex items-center gap-2">
          <FilterTabs tabs={TABS} active={tab} onChange={setTab} ariaLabel="Story category" className="border-b-0" variant="chip" />
          {tab !== "all" && (
            <button
              onClick={() => setTab("all")}
              className="label-caps-sm flex items-center gap-1 text-steel hover:text-frost"
              aria-label="Clear filters"
            >
              <X className="h-3 w-3" aria-hidden />
              Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Lead + secondary stack */}
        <div className="space-y-3">
          {status === "loading" ? (
            <div className="skeleton h-80 rounded-sm" />
          ) : lead ? (
            <HeroStory story={lead} heightClass="h-80" />
          ) : (
            <Panel className="flex h-80 items-center justify-center text-sm text-steel">
              No stories in this category yet.
            </Panel>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            {secondary.map((s) => (
              <NewsCard key={s.id} story={s} layout="stack" />
            ))}
          </div>
          {rest.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {rest.map((s) => (
                <NewsCard key={s.id} story={s} />
              ))}
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <section aria-labelledby="live-updates">
            <SectionHeader title="Live updates" as="h2">
              <StatusPill tone="sev" pulse>
                Live
              </StatusPill>
            </SectionHeader>
            <Panel padded={false}>
              <ul className="divide-y divide-edge-soft">
                {liveUpdates.map((u) => (
                  <li key={u.id} className="group relative flex items-start gap-2.5 px-4 py-2.5">
                    <span
                      className={cn(
                        "label-caps-sm mt-0.5 shrink-0 rounded-sm px-1 py-px",
                        u.category === "conflicts" ? "bg-sev/15 text-sev" : "bg-cyan/10 text-cyan"
                      )}
                    >
                      {u.publishedAgoMin < 90 ? "Live" : "Wire"}
                    </span>
                    <div className="min-w-0">
                      <div className="label-caps-sm text-steel-dim">
                        {u.location?.label ?? u.sourceName}
                      </div>
                      <p className="text-xs leading-snug text-frost transition-colors group-hover:text-cyanpale">
                        <Link href={storyHref(u)} className="outline-none after:absolute after:inset-0">
                          {u.headline}
                        </Link>
                      </p>
                    </div>
                    <span className="label-caps-sm ml-auto shrink-0 text-steel-dim">
                      {formatAgo(u.publishedAgoMin)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </section>

          <section aria-labelledby="news-map">
            <SectionHeader title="News map" as="h2" />
            <Panel padded={false}>
              <WorldMap markers={markers} className="min-h-56" ariaLabel="Active stories map" />
              <div className="label-caps-sm flex flex-wrap items-center gap-3 border-t border-edge-soft px-3 py-2 text-steel-dim">
                {[
                  ["Major event", "var(--color-sev)"],
                  ["Ongoing", "var(--color-warn)"],
                  ["Developing", "var(--color-cyan)"],
                ].map(([label, color]) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </Panel>
          </section>

          <section aria-labelledby="media-sources">
            <SectionHeader title="Media sources" as="h2" />
            <Panel>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {sources.map((s) => (
                  <li key={s.id} className="label-caps-sm flex items-center gap-1.5 text-steel" title={`${s.region} · ${s.trustTier}`}>
                    <span
                      aria-hidden
                      className={cn(
                        "h-1 w-1 rounded-full",
                        s.trustTier === "primary" ? "bg-cyan" : s.trustTier === "high" ? "bg-cyanpale/70" : "bg-steel"
                      )}
                    />
                    {s.name}
                  </li>
                ))}
              </ul>
              <p className="label-caps-sm mt-3 border-t border-edge-soft pt-2 text-steel-dim">
                {isLive
                  ? "Headlines and thumbnails via publisher RSS · full articles at the source"
                  : "Live feeds unavailable — showing bundled demo content"}
              </p>
            </Panel>
          </section>
        </div>
      </div>
    </div>
  );
}
