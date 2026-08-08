"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, Database, HeartPulse, Mic, Users, Zap } from "lucide-react";
import { DataRow } from "@/components/ui/DataRow";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ReportCard } from "@/components/reports/ReportCard";
import { explorerDatasets, featuredReport, insightFeed, keyTakeaways, recentReports } from "@/data/reports";

const TABS = [
  { id: "featured", label: "Featured" },
  { id: "daily", label: "Daily Brief" },
  { id: "weekly", label: "Weekly Reports" },
  { id: "special", label: "Special Reports" },
  { id: "explorer", label: "Data Explorer" },
];

const DATASET_ICONS: Record<string, typeof Users> = {
  users: Users,
  zap: Zap,
  book: BookOpen,
  heart: HeartPulse,
  mic: Mic,
};

export function InsightsHub() {
  const [tab, setTab] = useState("featured");

  const visibleReports =
    tab === "featured" || tab === "daily" || tab === "explorer"
      ? recentReports
      : recentReports.filter((r) => r.kind === (tab === "weekly" ? "weekly" : "special"));

  return (
    <div className="space-y-5 p-4 lg:p-5">
      <h1 className="font-display text-2xl font-semibold tracking-wide text-frost">
        INSIGHTS &amp; REPORTS
      </h1>

      <FilterTabs tabs={TABS} active={tab} onChange={setTab} ariaLabel="Report collections" />

      {tab === "daily" && (
        <Panel className="text-sm leading-relaxed text-steel">
          <span className="label-caps-sm mb-1 block text-cyan">Daily brief</span>
          The daily intelligence brief is compiled each morning at 06:00 UTC from overnight
          coverage across all connected sources. Today&apos;s edition is included in the featured
          Weekly Outlook below.
        </Panel>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* Featured report */}
        <Panel padded={false} className="flex flex-col overflow-hidden">
          <div className="relative min-h-[380px] flex-1">
            <EditorialImage src={featuredReport.image} alt="" className="absolute inset-0" overlay={false} />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-center p-7 lg:p-9">
              <span className="label-caps text-cyan">{featuredReport.kicker}</span>
              <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-frost lg:text-5xl">
                WEEKLY OUTLOOK
              </h2>
              <p className="numeric mt-2 text-sm text-steel">{featuredReport.dateRange}</p>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-frost/85">
                {featuredReport.summary}
              </p>
              <button className="label-caps group mt-6 inline-flex w-fit items-center gap-2 rounded-sm border border-cyan/50 bg-cyan/10 px-5 py-3 text-cyanpale shadow-glow transition-colors hover:bg-cyan/20">
                Read report
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
            </div>
          </div>
          <ul className="grid grid-cols-2 divide-edge-soft border-t border-edge-soft sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
            {featuredReport.categories.map((cat) => (
              <li key={cat.name} className="label-caps-sm flex items-center justify-center gap-1.5 px-2 py-3 text-steel">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: cat.color }} />
                <span className="truncate">{cat.name}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Right rail: takeaways + data explorer */}
        <div className="space-y-4">
          <Panel>
            <SectionHeader title="Key takeaways" as="h2" />
            <ol className="space-y-3">
              {keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="numeric flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan/40 text-sm text-cyanpale"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-frost/90">{t}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel>
            <div className="mb-3 flex items-center gap-2.5">
              <Database className="h-4 w-4 text-cyan" aria-hidden />
              <div>
                <h2 className="label-caps text-frost">Data explorer</h2>
                <p className="label-caps-sm text-steel-dim">Explore global datasets</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {explorerDatasets.map((d) => {
                const Icon = DATASET_ICONS[d.icon] ?? Database;
                return (
                  <DataRow
                    key={d.id}
                    icon={<Icon className="h-3.5 w-3.5" />}
                    label={d.name}
                    meta={d.provider}
                  />
                );
              })}
            </div>
            <div className="mt-3 text-right">
              <button className="label-caps-sm inline-flex items-center gap-1 text-cyan transition-colors hover:text-cyanpale">
                View all data
                <ArrowRight className="h-3 w-3" aria-hidden />
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {/* Recent reports */}
      <section aria-labelledby="recent-reports">
        <SectionHeader title="Recent reports" action={{ label: "View all", href: "/insights" }} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {visibleReports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </section>

      {/* Insight feed */}
      <section aria-label="Insight feed">
        <Panel padded={false} className="flex items-stretch overflow-hidden">
          <div className="label-caps flex shrink-0 items-center gap-2 border-r border-edge-soft bg-panel2 px-4 text-cyanpale">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
            Insight feed
          </div>
          <ul className="flex flex-1 items-center gap-6 overflow-x-auto px-4 py-3">
            {insightFeed.map((item, i) => (
              <li key={i} className="flex shrink-0 items-center gap-2 text-xs text-steel">
                <span className="text-frost/90">{item.text}</span>
                <span className="label-caps-sm text-cyan">{item.agoH}h ago</span>
                {i < insightFeed.length - 1 && <span aria-hidden className="ml-4 h-1 w-1 rounded-full bg-edge" />}
              </li>
            ))}
          </ul>
          <button
            aria-label="More insight feed items"
            className="flex shrink-0 items-center border-l border-edge-soft px-3 text-steel transition-colors hover:text-frost"
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </Panel>
      </section>
    </div>
  );
}
