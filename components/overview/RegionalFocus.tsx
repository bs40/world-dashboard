"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { WorldMap } from "@/components/maps/WorldMap";
import { getRegion, regionalFocusStories, regions } from "@/data/regions";
import { formatAgo } from "@/lib/utils";
import type { MapMarker } from "@/types";

export function RegionalFocus() {
  const [active, setActive] = useState("americas");
  const region = getRegion(active);
  const stories = regionalFocusStories[active] ?? [];

  const markers: MapMarker[] = stories.map((s, i) => ({
    id: `${active}-${i}`,
    lat: s.lat,
    lon: s.lon,
    label: s.country,
    detail: s.text,
    category: "politics",
    agoLabel: formatAgo(s.agoMin),
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
          {stories.map((s, i) => (
            <li key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <EditorialImage src={s.image} alt="" className="h-11 w-14 shrink-0 rounded-sm" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-frost">{s.country}</div>
                <div className="truncate text-xs text-steel">{s.text}</div>
              </div>
              <span className="label-caps-sm ml-auto shrink-0 text-steel-dim">{formatAgo(s.agoMin)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
