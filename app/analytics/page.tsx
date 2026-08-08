import type { Metadata } from "next";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Sparkline } from "@/components/charts/Sparkline";
import { BarRanking } from "@/components/charts/BarRanking";
import { DonutChart } from "@/components/charts/DonutChart";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { WorldMap } from "@/components/maps/WorldMap";
import { conflictZones } from "@/data/conflicts";
import { energyMix, indices, techAdoption, tradeFlows } from "@/data/markets";
import { analyticsCards, sentimentSeries, topRisks } from "@/data/metrics";
import { cn, signed } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-4 p-4 lg:p-5">
      <h1 className="font-display text-xl font-semibold tracking-wide text-frost">
        GLOBAL ANALYTICS
      </h1>

      {/* Top metric cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {analyticsCards.map((card) => (
          <MetricCard
            key={card.id}
            label={card.label}
            value={card.value}
            unit={card.unit}
            status={card.status}
            statusColor={card.statusColor}
            spark={card.spark}
            sparkColor={
              card.statusColor === "elev"
                ? "var(--color-elev)"
                : card.statusColor === "warn"
                  ? "var(--color-warn)"
                  : "var(--color-pos)"
            }
          />
        ))}
      </div>

      {/* Main visualisation row */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
        <Panel>
          <SectionHeader title="Global sentiment" as="h2">
            <span className="label-caps-sm text-steel-dim">30 day trend</span>
          </SectionHeader>
          <TimeSeriesChart
            data={sentimentSeries}
            xKey="day"
            height={230}
            kind="line"
            yUnit="%"
            series={[
              { key: "positive", name: "Positive", color: "var(--color-pos)" },
              { key: "neutral", name: "Neutral", color: "var(--color-steel)" },
              { key: "negative", name: "Negative", color: "var(--color-sev)" },
            ]}
          />
        </Panel>

        <Panel>
          <SectionHeader title="Top risks" as="h2" action={{ label: "View all", href: "/insights" }} />
          <BarRanking items={topRisks.map((r) => ({ name: r.name, value: r.score }))} max={10} className="mt-4" />
          <p className="label-caps-sm mt-5 border-t border-edge-soft pt-3 text-steel-dim">
            Composite score /10 · demo data
          </p>
        </Panel>

        <Panel padded={false}>
          <div className="px-4 pt-4">
            <SectionHeader title="Risk heat map" as="h2" />
          </div>
          <WorldMap heat={conflictZones} interactive={false} className="min-h-44 px-2" grid={false} ariaLabel="Global risk heat map" />
          <div className="label-caps-sm flex flex-wrap items-center gap-3 border-t border-edge-soft px-4 py-2.5 text-steel-dim">
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
      </div>

      {/* Secondary row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Panel>
          <SectionHeader title="Market overview" as="h2" />
          <ul className="divide-y divide-edge-soft">
            {indices.map((idx) => (
              <li key={idx.id} className="flex items-center gap-3 py-2">
                <span className="label-caps-sm w-20 shrink-0 text-steel">{idx.name}</span>
                <span className="numeric text-sm text-frost">
                  {idx.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className={cn("numeric ml-auto text-xs", idx.changePct >= 0 ? "text-pos" : "text-sev")}>
                  {signed(idx.changePct)}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <SectionHeader title="Energy mix" as="h2">
            <span className="label-caps-sm text-steel-dim">Global</span>
          </SectionHeader>
          <DonutChart data={energyMix} height={140} />
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
            {energyMix.map((e) => (
              <li key={e.name} className="flex items-center gap-1.5 text-xs">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} />
                <span className="text-steel">{e.name}</span>
                <span className="numeric ml-auto text-frost">{e.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <SectionHeader title="Global trade flow" as="h2">
            <span className="label-caps-sm text-steel-dim">Trillion USD</span>
          </SectionHeader>
          <BarRanking
            items={tradeFlows.map((t) => ({
              name: t.route,
              value: t.value,
              color: "linear-gradient(90deg, var(--color-cyan), var(--color-cyanpale))",
            }))}
            max={2.5}
            showRank={false}
            className="mt-3"
          />
        </Panel>

        <Panel>
          <SectionHeader title="Technology adoption" as="h2">
            <span className="label-caps-sm text-steel-dim">% of countries</span>
          </SectionHeader>
          <ul className="mt-3 space-y-3.5">
            {techAdoption.map((t) => (
              <li key={t.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-frost">{t.name}</span>
                  <span className="numeric text-cyanpale">{t.value}%</span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-edge-soft/60"
                  role="meter"
                  aria-valuenow={t.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${t.name} adoption`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-tech/60 to-tech"
                    style={{ width: `${t.value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-edge-soft pt-3">
            <div className="label-caps-sm mb-1 text-steel-dim">Composite adoption index</div>
            <Sparkline
              data={[31, 33, 34, 36, 39, 41, 44, 47, 49, 52, 55, 58]}
              width={220}
              height={32}
              stroke="var(--color-tech)"
              className="w-full"
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
