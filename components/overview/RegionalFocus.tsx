"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { fallbackFor } from "@/lib/imagery";
import { WorldMap } from "@/components/maps/WorldMap";
import { getRegion, regionalFocusStories, regions } from "@/data/regions";
import { useFeed } from "@/lib/feed";
import { formatAgo, storyHref } from "@/lib/utils";
import type { MapMarker, NewsStory } from "@/types";

export function RegionalFocus() {
  const [active, setActive] = useState("americas");
  const region = getRegion(active);
  const { stories: feedStories } = useFeed();

  /** Live stories for this region, falling back to bundled samples. */
  const stories = useMemo(() => {
    const live = feedStories.filter((s) => s.isLive && s.regionId === active).slice(0, 3);
    if (live.length > 0) return live;
    return (regionalFocusStories[active] ?? []).map(
      (s, i): NewsStory => ({
        id: `${active}-demo-${i}`,
        headline: s.text,
        category: "politics",
        sourceId: "global-wire",
        publishedAgoMin: s.agoMin,
        image: s.image,
        location: { lat: s.lat, lon: s.lon, label: s.country },
      })
    );
  }, [feedStories, active]);

  const markers: MapMarker[] = stories
    .filter((s) => s.location)
    .map((s) => ({
      id: s.id,
      lat: s.location!.lat,
      lon: s.location!.lon,
      label: s.location!.label,
      detail: s.headline,
      category: s.category,
      agoLabel: formatAgo(s.publishedAgoMin),
    }));

  return (
    <Panel padded={false}>
      <div className="flex items-center gap-2 border-b border-edge-soft px-4">
        <h2 className="label-caps shrink-0 border-r border-edge-soft py-3 pr-4 text-frost">
          Regional focus
        </h2>
        <FilterTabs
          ariaLabel="Regional focus"
          tabs={regions.map((r) => ({ id: r.id, label: r.name }))}
          active={active}
          onChange={setActive}
          className="border-b-0"
        />
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_1fr]">
        <WorldMap
          markers={markers}
          window={region.mapWindow}
          ariaLabel={`${region.name} map`}
          className="min-h-48"
          grid
        />
        <ul className="divide-y divide-edge-soft">
          {stories.map((s) => (
            <li key={s.id} className="group relative flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <EditorialImage
                src={s.image ?? fallbackFor(s.category)}
                fallbackSrc={fallbackFor(s.category)}
                alt=""
                className="h-11 w-14 shrink-0 rounded-sm"
              />
              <div className="min-w-0">
                <div className="text-sm font-medium text-frost">
                  {s.location?.label ?? s.sourceName}
                </div>
                <div className="truncate text-xs text-steel transition-colors group-hover:text-cyanpale">
                  <Link href={storyHref(s)} className="outline-none after:absolute after:inset-0">
                    {s.headline}
                  </Link>
                </div>
              </div>
              <span className="label-caps-sm ml-auto shrink-0 text-steel-dim">
                {formatAgo(s.publishedAgoMin)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
