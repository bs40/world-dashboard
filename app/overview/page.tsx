import type { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";
import { GlobalMapPanel } from "@/components/overview/GlobalMapPanel";
import { RegionalFocus } from "@/components/overview/RegionalFocus";
import { DataInsights } from "@/components/overview/DataInsights";
import { Sparkline } from "@/components/charts/Sparkline";
import { WorldMap } from "@/components/maps/WorldMap";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { StatusPill } from "@/components/ui/StatusPill";
import { NewsCard } from "@/components/news/NewsCard";
import { conflictZones } from "@/data/conflicts";
import { indices } from "@/data/markets";
import { editorsPicks, liveUpdates, topStories, trendingTopics } from "@/data/news";
import { cn, formatAgo, signed } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  const leftStories = topStories.filter((s) => ["peace-talks", "heatwave-asia", "markets-inflation", "energy-treaty", "sudan-crisis"].includes(s.id));
  const featured = topStories.find((s) => s.id === "us-jobs")!;
  const liveLead = topStories.find((s) => s.id === "peace-talks")!;

  return (
    <div className="grid gap-4 p-4 lg:p-5 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
      {/* ── Left column ─────────────────────────────── */}
      <div className="space-y-4">
        <section aria-labelledby="top-stories">
          <SectionHeader title="Top stories" as="h2" />
          <div className="space-y-2">
            {leftStories.map((story) => (
              <NewsCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        <section aria-labelledby="markets">
          <SectionHeader title="Markets" action={{ label: "View all", href: "/analytics" }} />
          <Panel padded={false}>
            <div className="label-caps-sm border-b border-edge-soft px-4 py-2 text-steel-dim">
              Global indices
            </div>
            <ul className="divide-y divide-edge-soft">
              {indices.slice(0, 5).map((idx) => (
                <li key={idx.id} className="flex items-center gap-3 px-4 py-2">
                  <span className="label-caps-sm w-14 shrink-0 text-steel">{idx.name}</span>
                  <span className="numeric text-sm text-frost">
                    {idx.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={cn(
                      "numeric ml-auto text-xs",
                      idx.changePct >= 0 ? "text-pos" : "text-sev"
                    )}
                  >
                    {signed(idx.changePct)}%
                  </span>
                  <Sparkline
                    data={idx.spark}
                    width={56}
                    height={18}
                    stroke={idx.changePct >= 0 ? "var(--color-pos)" : "var(--color-sev)"}
                  />
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section aria-label="Featured story">
          <Panel padded={false} hover className="group relative overflow-hidden">
            <EditorialImage src={featured.image!} alt="" className="h-36 w-full" />
            <div className="p-3">
              <h3 className="text-sm font-medium leading-snug text-frost group-hover:text-cyanpale">
                <Link href={`/news/${featured.id}`} className="outline-none after:absolute after:inset-0">
                  {featured.headline}
                </Link>
              </h3>
              <div className="label-caps-sm mt-1.5 text-steel-dim">
                {formatAgo(featured.publishedAgoMin)} · Financial Desk
              </div>
            </div>
          </Panel>
        </section>
      </div>

      {/* ── Centre column ───────────────────────────── */}
      <div className="min-w-0 space-y-4">
        <GlobalMapPanel />
        <RegionalFocus />
        <section aria-labelledby="data-insights">
          <SectionHeader title="Data insights" />
          <DataInsights />
        </section>
      </div>

      {/* ── Right column ────────────────────────────── */}
      <div className="space-y-4">
        <section aria-labelledby="live-feed">
          <SectionHeader title="Live feed" />
          <Panel padded={false} className="overflow-hidden">
            <div className="group relative">
              <div className="relative h-44">
                <EditorialImage src="/images/city-dusk.svg" alt="" className="absolute inset-0" />
                <StatusPill tone="sev" pulse className="absolute left-3 top-3 bg-ink/70 backdrop-blur-sm">
                  Live · {liveLead.location?.label}
                </StatusPill>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium leading-snug text-frost transition-colors group-hover:text-cyanpale">
                  <Link href={`/news/${liveLead.id}`} className="outline-none after:absolute after:inset-0">
                    Explosions reported in Kyiv overnight
                  </Link>
                </h3>
                <div className="label-caps-sm mt-1 text-steel-dim">{formatAgo(2)}</div>
              </div>
            </div>
            <ul className="divide-y divide-edge-soft border-t border-edge-soft">
              {liveUpdates.slice(0, 3).map((u) => (
                <li key={u.id} className="flex items-start gap-2 px-3 py-2">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      u.breaking ? "animate-pulse-dot bg-sev" : "bg-cyan"
                    )}
                  />
                  <div className="min-w-0">
                    <div className="label-caps-sm text-steel-dim">{u.location}</div>
                    <div className="text-xs leading-snug text-frost">{u.text}</div>
                  </div>
                  <span className="label-caps-sm ml-auto shrink-0 text-steel-dim">{formatAgo(u.agoMin)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section aria-labelledby="conflicts-overview">
          <SectionHeader title="Conflicts overview" action={{ label: "View all", href: "/topics/conflicts" }} />
          <Panel padded={false}>
            <WorldMap heat={conflictZones} interactive={false} className="min-h-36" grid={false} ariaLabel="Conflict heat map" />
            <div className="label-caps-sm flex flex-wrap items-center gap-3 border-t border-edge-soft px-3 py-2 text-steel-dim">
              {[
                ["Low", "var(--color-pos)"],
                ["Moderate", "var(--color-warn)"],
                ["High", "var(--color-elev)"],
                ["Extreme", "var(--color-sev)"],
              ].map(([label, color]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </Panel>
        </section>

        <section aria-labelledby="trending">
          <SectionHeader title="Trending topics" action={{ label: "View all", href: "/topics" }} />
          <Panel padded={false}>
            <ul className="divide-y divide-edge-soft">
              {trendingTopics.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/topics?topic=${t.slug}`}
                    className="group flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="text-sm text-frost transition-colors group-hover:text-cyanpale">
                      {t.name}
                    </span>
                    <div className="ml-auto h-1 w-24 overflow-hidden rounded-full bg-edge-soft/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan/50 to-cyan"
                        style={{ width: `${t.heat}%` }}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section aria-labelledby="editors-picks">
          <SectionHeader title="Editor's picks" />
          <div className="space-y-2">
            <Panel padded={false} hover className="group relative overflow-hidden">
              <div className="relative h-32">
                <EditorialImage src={editorsPicks[0].image!} alt="" className="absolute inset-0" />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Play className="h-8 w-8 text-frost drop-shadow" />
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium leading-snug text-frost group-hover:text-cyanpale">
                  <Link href={`/news/${editorsPicks[0].id}`} className="outline-none after:absolute after:inset-0">
                    {editorsPicks[0].headline}
                  </Link>
                </h3>
                <div className="label-caps-sm mt-1 text-steel-dim">
                  Science Desk · {formatAgo(editorsPicks[0].publishedAgoMin)}
                </div>
              </div>
            </Panel>
            <div className="grid grid-cols-3 gap-2">
              {editorsPicks.slice(1).map((pick) => (
                <Panel key={pick.id} padded={false} hover className="group relative overflow-hidden">
                  <EditorialImage src={pick.image!} alt="" className="h-16 w-full" />
                  <div className="p-2">
                    <h4 className="line-clamp-3 text-[11px] leading-tight text-frost group-hover:text-cyanpale">
                      <Link href={`/news/${pick.id}`} className="outline-none after:absolute after:inset-0">
                        {pick.headline}
                      </Link>
                    </h4>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
