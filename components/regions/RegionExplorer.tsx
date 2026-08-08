"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SaveButton } from "@/components/ui/SaveButton";
import { TrendIndicator } from "@/components/ui/TrendIndicator";
import { NewsListItem } from "@/components/news/NewsCard";
import { WorldMap } from "@/components/maps/WorldMap";
import { getRegion, regions } from "@/data/regions";

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "politics", label: "Politics" },
  { id: "economy", label: "Economy" },
  { id: "environment", label: "Environment" },
  { id: "security", label: "Security" },
  { id: "society", label: "Society" },
];

const TAB_NOTES: Record<string, string> = {
  politics: "Political indicators and election coverage for this region will surface here as live sources are connected.",
  economy: "Deeper economic series (GDP components, trade balances, sector output) attach here via the dataset adapters.",
  environment: "Emissions, energy mix and climate-risk exposure layers for this region attach here.",
  security: "Security incidents and defence-posture tracking attach here from the conflict data pipeline.",
  society: "Demographics, migration and social-cohesion indicators attach here.",
};

export function RegionExplorer() {
  const params = useSearchParams();
  const requested = params.get("region") ?? "europe";
  const [regionId, setRegionId] = useState(requested);
  const [tab, setTab] = useState("summary");

  // Render-phase adjustment: when the URL param changes, adopt it as selection.
  const [prevRequested, setPrevRequested] = useState(requested);
  if (requested !== prevRequested) {
    setPrevRequested(requested);
    setRegionId(requested);
  }

  const region = getRegion(regionId);

  return (
    <div className="space-y-4 p-4 lg:p-5">
      <div className="label-caps-sm text-steel-dim">Region detail</div>

      {/* Region header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-wide text-frost">
              {region.name.toUpperCase()}
            </h1>
            <SaveButton
              id={`region-${region.id}`}
              kind="region"
              title={region.name}
              href={`/regions?region=${region.id}`}
              meta={`${region.countries} countries`}
            />
          </div>
          <div className="label-caps-sm mt-1 flex items-center gap-2 text-steel">
            <span>{region.countries} countries</span>
            <span aria-hidden>·</span>
            <span>{region.population} population</span>
            <span aria-hidden>·</span>
            <button className="text-cyan transition-colors hover:text-cyanpale">View subregions</button>
          </div>
        </div>

        <label className="relative">
          <span className="sr-only">Select region</span>
          <select
            value={regionId}
            onChange={(e) => {
              setRegionId(e.target.value);
              setTab("summary");
            }}
            className="label-caps appearance-none rounded-sm border border-edge bg-panel py-2 pl-3 pr-9 text-frost outline-none transition-colors hover:border-cyan/40"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-steel" />
        </label>
      </div>

      <FilterTabs tabs={TABS} active={tab} onChange={setTab} ariaLabel="Region sections" />

      {tab !== "summary" && (
        <Panel className="text-sm leading-relaxed text-steel">
          <span className="label-caps-sm mb-1 block text-cyan">{TABS.find((t) => t.id === tab)?.label}</span>
          {TAB_NOTES[tab]}
        </Panel>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_260px]">
        {/* Map */}
        <Panel padded={false} className="overflow-hidden">
          <WorldMap
            window={region.mapWindow}
            markers={region.headlines
              .map((h, i) => ({
                id: h.id,
                lat: region.mapWindow.latMin + (region.mapWindow.latMax - region.mapWindow.latMin) * (0.3 + (i % 3) * 0.2),
                lon: region.mapWindow.lonMin + (region.mapWindow.lonMax - region.mapWindow.lonMin) * (0.25 + (i % 4) * 0.17),
                label: h.headline.split(" ").slice(0, 2).join(" "),
                detail: h.headline,
                category: h.category,
              }))}
            className="min-h-80"
            ariaLabel={`Map of ${region.name}`}
          />
          <p className="label-caps-sm border-t border-edge-soft px-4 py-2 text-steel-dim">
            {region.summary}
          </p>
        </Panel>

        {/* Key indicators + headlines */}
        <div className="space-y-4">
          <section aria-labelledby="key-indicators">
            <SectionHeader title="Key indicators" as="h2" />
            <Panel padded={false}>
              <ul className="divide-y divide-edge-soft">
                {region.indicators.map((ind) => (
                  <li key={ind.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span className="text-xs text-steel">{ind.label}</span>
                    <span className="flex items-center gap-2">
                      <span className="numeric text-sm text-frost">{ind.value}</span>
                      {ind.trend && ind.change && (
                        <TrendIndicator
                          trend={ind.trend}
                          label={ind.change}
                          positiveIsDown={/unemployment|inflation/i.test(ind.label)}
                        />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </section>

          <section aria-labelledby="latest-headlines">
            <SectionHeader title="Latest headlines" as="h2" action={{ label: "View all", href: "/news" }} />
            <Panel padded={false} className="px-4">
              <div className="divide-y divide-edge-soft">
                {region.headlines.map((h) => (
                  <NewsListItem key={h.id} story={h} />
                ))}
              </div>
            </Panel>
          </section>
        </div>

        {/* Regional stats */}
        <section aria-labelledby="regional-stats">
          <SectionHeader title="Regional stats" as="h2" />
          <Panel padded={false}>
            <ul className="divide-y divide-edge-soft">
              {region.stats.map((stat) => (
                <li key={stat.label} className="px-4 py-3">
                  <div className="text-xs text-steel">{stat.label}</div>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="numeric text-xl text-frost">{stat.value}</span>
                    {stat.note && <span className="label-caps-sm text-steel-dim">{stat.note}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      </div>
    </div>
  );
}
