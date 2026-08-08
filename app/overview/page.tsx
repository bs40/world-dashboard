import type { Metadata } from "next";
import Link from "next/link";
import { GlobalMapPanel } from "@/components/overview/GlobalMapPanel";
import { RegionalFocus } from "@/components/overview/RegionalFocus";
import { DataInsights } from "@/components/overview/DataInsights";
import {
  EditorsPicks,
  FeaturedStoryCard,
  LiveFeedPanel,
  TopStoriesList,
} from "@/components/overview/LiveStoryPanels";
import { Sparkline } from "@/components/charts/Sparkline";
import { WorldMap } from "@/components/maps/WorldMap";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { conflictZones } from "@/data/conflicts";
import { indices } from "@/data/markets";
import { trendingTopics } from "@/data/news";
import { cn, signed } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <div className="grid gap-4 p-4 lg:p-5 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
      {/* ── Left column ─────────────────────────────── */}
      <div className="space-y-4">
        <section aria-labelledby="top-stories">
          <SectionHeader title="Top stories" as="h2" action={{ label: "All news", href: "/news" }} />
          <TopStoriesList />
        </section>

        <section aria-labelledby="markets">
          <SectionHeader title="Markets" action={{ label: "View all", href: "/analytics" }} />
          <Panel padded={false}>
            <div className="label-caps-sm border-b border-edge-soft px-4 py-2 text-steel-dim">
              Global indices · demo data
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
          <FeaturedStoryCard />
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
          <SectionHeader title="Live feed" action={{ label: "All news", href: "/news" }} />
          <LiveFeedPanel />
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
          <EditorsPicks />
        </section>
      </div>
    </div>
  );
}
