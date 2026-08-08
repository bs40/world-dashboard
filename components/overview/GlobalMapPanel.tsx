"use client";

import { useMemo, useState } from "react";
import {
  Cpu,
  Droplets,
  Globe2,
  HeartPulse,
  Landmark,
  Leaf,
  LineChart,
  Thermometer,
  TrendingUp,
  Users,
  Wifi,
  Cloud,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { WorldMap, CATEGORY_COLORS } from "@/components/maps/WorldMap";
import { globalStats, planetMetrics } from "@/data/metrics";
import { topStories } from "@/data/news";
import { cn, formatAgo } from "@/lib/utils";
import type { Category, MapMarker } from "@/types";

const FILTERS: { id: Category; label: string; icon: typeof Landmark }[] = [
  { id: "politics", label: "Politics", icon: Landmark },
  { id: "conflicts", label: "Conflicts", icon: Globe2 },
  { id: "economy", label: "Economy", icon: TrendingUp },
  { id: "environment", label: "Environment", icon: Leaf },
  { id: "society", label: "Society", icon: Users },
  { id: "technology", label: "Technology", icon: Cpu },
  { id: "health", label: "Health", icon: HeartPulse },
];

const METRIC_ICONS: Record<string, typeof Thermometer> = {
  thermometer: Thermometer,
  waves: Droplets,
  cloud: Cloud,
  chart: LineChart,
  wifi: Wifi,
};

export function GlobalMapPanel() {
  const [activeFilters, setActiveFilters] = useState<Set<Category>>(new Set());

  const markers = useMemo<MapMarker[]>(
    () =>
      topStories
        .filter((s) => s.location)
        .filter((s) => activeFilters.size === 0 || activeFilters.has(s.category))
        .map((s) => ({
          id: s.id,
          lat: s.location!.lat,
          lon: s.location!.lon,
          label: s.location!.label,
          detail: s.headline,
          category: s.category,
          severity: s.category === "conflicts" ? "high" : "moderate",
          agoLabel: formatAgo(s.publishedAgoMin),
        })),
    [activeFilters]
  );

  const toggleFilter = (id: Category) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Panel padded={false} className="flex flex-col">
      <div className="flex items-center justify-between border-b border-edge-soft px-4 py-3">
        <h2 className="label-caps text-frost">Global overview</h2>
        <span className="label-caps-sm text-steel-dim">
          {markers.length} active markers · demo data
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4 lg:flex-row">
        {/* Stats rail */}
        <dl className="grid shrink-0 grid-cols-4 gap-3 lg:w-28 lg:grid-cols-1 lg:content-start">
          {globalStats.map((stat) => (
            <div key={stat.label}>
              <dd className="numeric text-xl font-medium text-frost">{stat.value}</dd>
              <dt className="label-caps-sm text-steel-dim">{stat.label}</dt>
            </div>
          ))}
        </dl>

        {/* Map */}
        <div className="relative min-w-0 flex-1">
          <WorldMap markers={markers} ariaLabel="Global activity map" className="min-h-64" />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5 lg:w-36 lg:flex-col lg:content-start" role="group" aria-label="Map category filters">
          {FILTERS.map((f) => {
            const active = activeFilters.has(f.id);
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => toggleFilter(f.id)}
                aria-pressed={active}
                className={cn(
                  "label-caps-sm flex items-center gap-2 rounded-sm border px-2.5 py-1.5 transition-colors",
                  active
                    ? "border-cyan/40 bg-cyan/10 text-frost"
                    : "border-edge-soft bg-panel2/60 text-steel hover:border-edge hover:text-frost"
                )}
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: CATEGORY_COLORS[f.id] }}
                />
                <Icon className="h-3 w-3" aria-hidden />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Planet metrics row */}
      <div className="grid grid-cols-2 divide-edge-soft border-t border-edge-soft sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
        {planetMetrics.map((m) => {
          const Icon = METRIC_ICONS[m.icon] ?? LineChart;
          return (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-edge-soft bg-panel2 text-cyan" aria-hidden>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <div className="label-caps-sm truncate text-steel-dim">{m.label}</div>
                <div className="numeric text-sm text-frost">{m.value}</div>
                <div className="label-caps-sm truncate text-steel-dim">{m.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
