"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Droplets, Flame, Plus, Sun, Thermometer, Wind, Check } from "lucide-react";
import { AnomalyBars } from "@/components/charts/AnomalyBars";
import { WorldMap } from "@/components/maps/WorldMap";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSaved } from "@/lib/saved";
import { climateNews, extremeWeatherStats, getTopic, temperatureAnomaly, topics } from "@/data/topics";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "news", label: "News" },
  { id: "data", label: "Data" },
  { id: "solutions", label: "Solutions" },
  { id: "experts", label: "Experts" },
];

const WEATHER_ICONS: Record<string, typeof Wind> = {
  wind: Wind,
  droplets: Droplets,
  thermometer: Thermometer,
  flame: Flame,
  sun: Sun,
};

const AFFECTED_HEAT = [
  { lat: 28, lon: 77, intensity: 5, label: "South Asia" },
  { lat: -10, lon: -55, intensity: 4, label: "Amazon basin" },
  { lat: 15, lon: 10, intensity: 4, label: "Sahel" },
  { lat: -25, lon: 135, intensity: 3, label: "Australia" },
  { lat: 38, lon: -100, intensity: 3, label: "US plains" },
  { lat: 40, lon: 15, intensity: 3, label: "Mediterranean" },
  { lat: -2, lon: 38, intensity: 4, label: "East Africa" },
  { lat: 65, lon: -45, intensity: 4, label: "Greenland" },
];

export function TopicExplorer() {
  const params = useSearchParams();
  const requested = params.get("topic") ?? "climate-change";
  const [slug, setSlug] = useState(requested);
  const [tab, setTab] = useState("overview");
  const { isSaved, toggle } = useSaved();

  // Render-phase adjustment: when the URL param changes, adopt it as selection.
  const [prevRequested, setPrevRequested] = useState(requested);
  if (requested !== prevRequested) {
    setPrevRequested(requested);
    setSlug(requested);
  }

  const topic = getTopic(slug);
  const followed = isSaved(`topic-${topic.slug}`);
  const isClimate = topic.slug === "climate-change";

  return (
    <div className="space-y-4 p-4 lg:p-5">
      <div className="label-caps-sm text-steel-dim">Topic deep dive</div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-3xl font-semibold tracking-wide text-frost">
            {topic.name.toUpperCase()}
          </h1>
          <button
            onClick={() =>
              toggle({
                id: `topic-${topic.slug}`,
                kind: "topic",
                title: topic.name,
                href: `/topics?topic=${topic.slug}`,
                meta: topic.followerLabel,
              })
            }
            aria-pressed={followed}
            className={cn(
              "label-caps-sm flex items-center gap-1.5 rounded-sm border px-3 py-1.5 transition-colors",
              followed
                ? "border-cyan/50 bg-cyan/15 text-cyanpale"
                : "border-edge bg-panel text-steel hover:border-cyan/40 hover:text-frost"
            )}
          >
            {followed ? <Check className="h-3 w-3" aria-hidden /> : <Plus className="h-3 w-3" aria-hidden />}
            {followed ? "Following" : "Follow"}
          </button>
          <span className="label-caps-sm hidden text-steel-dim sm:block">{topic.followerLabel}</span>
        </div>
      </div>

      {/* Topic switcher */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Browse topics">
        {topics.map((t) => (
          <Link
            key={t.slug}
            href={`/topics?topic=${t.slug}`}
            aria-current={t.slug === topic.slug ? "page" : undefined}
            className={cn(
              "label-caps-sm rounded-sm border px-2.5 py-1 transition-colors",
              t.slug === topic.slug
                ? "border-cyan/40 bg-cyan/10 text-cyanpale"
                : "border-edge-soft bg-panel text-steel hover:border-edge hover:text-frost"
            )}
          >
            {t.name}
          </Link>
        ))}
        <Link
          href="/topics/conflicts"
          className="label-caps-sm rounded-sm border border-sev/30 bg-sev/5 px-2.5 py-1 text-sev/90 transition-colors hover:bg-sev/10"
        >
          Conflict tracker
        </Link>
      </div>

      <FilterTabs tabs={TABS} active={tab} onChange={setTab} ariaLabel="Topic sections" />

      {tab !== "overview" && (
        <Panel className="text-sm leading-relaxed text-steel">
          <span className="label-caps-sm mb-1 block text-cyan">
            {TABS.find((t) => t.id === tab)?.label}
          </span>
          {tab === "news" && "Full topic newsfeed attaches here from the source ingestion layer (/lib/sources)."}
          {tab === "data" && "Every related dataset becomes explorable here via the dataset adapters (/lib/api/datasets.ts)."}
          {tab === "solutions" && "Policy responses, technology pathways and mitigation tracking are curated here."}
          {tab === "experts" && "Analyst commentary and expert-network briefings appear here."}
        </Panel>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* Overview + key facts */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Panel>
              <SectionHeader title="Overview" as="h2" />
              <p className="text-sm leading-relaxed text-frost/90">{topic.overview}</p>
              <div className="label-caps mt-4 border-t border-edge-soft pt-3 text-steel">Key facts</div>
              <ul className="mt-2 space-y-2">
                {topic.keyFacts.map((fact) => (
                  <li key={fact} className="flex items-start gap-2 text-xs leading-relaxed text-steel">
                    <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                    {fact}
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Extreme weather / topic stats */}
            <Panel>
              <SectionHeader
                title={isClimate ? "Extreme weather events" : "Signal metrics"}
                as="h2"
              >
                <span className="label-caps-sm text-steel-dim">Last 12 months</span>
              </SectionHeader>
              <div className="grid grid-cols-5 gap-2">
                {extremeWeatherStats.map((s) => {
                  const Icon = WEATHER_ICONS[s.icon];
                  return (
                    <div key={s.label} className="rounded-sm border border-edge-soft bg-panel2/50 p-2 text-center">
                      <Icon className="mx-auto h-4 w-4 text-elev" aria-hidden />
                      <div className="numeric mt-1.5 text-lg text-frost">{s.value}</div>
                      <div className="label-caps-sm text-steel-dim">{s.label}</div>
                    </div>
                  );
                })}
              </div>
              <p className="label-caps-sm mt-3 text-steel-dim">
                Counted events with significant humanitarian or economic impact · demo data
              </p>
            </Panel>
          </div>

          {/* Temperature anomaly chart */}
          <Panel>
            <SectionHeader title="Global temperature anomaly" as="h2">
              <span className="label-caps-sm text-steel-dim">°C vs 1901–1960 average</span>
            </SectionHeader>
            <AnomalyBars data={temperatureAnomaly} height={230} />
          </Panel>

          {/* Latest news */}
          <section aria-labelledby="topic-news">
            <SectionHeader title="Latest news" action={{ label: "View all", href: "/news" }} />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {climateNews.map((n) => (
                <Panel key={n.id} padded={false} hover className="group relative overflow-hidden">
                  <EditorialImage src={n.image} alt="" className="h-24 w-full" />
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-xs font-medium leading-snug text-frost group-hover:text-cyanpale">
                      <Link href={`/news/${n.id}`} className="outline-none after:absolute after:inset-0">
                        {n.headline}
                      </Link>
                    </h3>
                    <div className="label-caps-sm mt-1.5 text-steel-dim">
                      {n.agoH}h ago · {n.sourcesCount} sources
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </section>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <section aria-labelledby="affected-regions">
            <SectionHeader title="Affected regions" as="h2" />
            <Panel padded={false}>
              <WorldMap heat={AFFECTED_HEAT} interactive={false} grid={false} className="min-h-40" ariaLabel="Affected regions map" />
              <div className="label-caps-sm flex items-center gap-3 border-t border-edge-soft px-3 py-2 text-steel-dim">
                {[
                  ["High impact", "var(--color-sev)"],
                  ["Moderate", "var(--color-warn)"],
                  ["Low", "var(--color-pos)"],
                ].map(([label, color]) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </Panel>
          </section>

          <section aria-labelledby="related-datasets">
            <SectionHeader title="Related datasets" as="h2" action={{ label: "Explore", href: "/insights" }} />
            <Panel padded={false}>
              <ul className="divide-y divide-edge-soft">
                {topic.relatedDatasets.map((d) => (
                  <li key={d} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs capitalize text-frost">{d.replace(/-/g, " ")}</span>
                    <span className="label-caps-sm text-steel-dim">Series</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </section>

          <section aria-labelledby="related-topics">
            <SectionHeader title="Related topics" as="h2" />
            <div className="flex flex-wrap gap-1.5">
              {topic.relatedTopics.map((slug2) => {
                const rel = topics.find((t) => t.slug === slug2);
                if (!rel) return null;
                return (
                  <Link
                    key={slug2}
                    href={`/topics?topic=${slug2}`}
                    className="label-caps-sm rounded-sm border border-edge-soft bg-panel px-2.5 py-1.5 text-steel transition-colors hover:border-cyan/40 hover:text-cyanpale"
                  >
                    {rel.name}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
