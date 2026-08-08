import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Banknote, Flag, Users } from "lucide-react";
import { Sparkline } from "@/components/charts/Sparkline";
import { WorldMap } from "@/components/maps/WorldMap";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Panel } from "@/components/ui/Panel";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { conflicts, conflictZones, developments, globalImpact } from "@/data/conflicts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Conflict Tracker" };

const STATUS_TONE = {
  ongoing: "warn",
  escalating: "sev",
  stable: "pos",
  "de-escalating": "pos",
} as const;

const IMPACT = [
  { icon: Users, label: "People affected", value: globalImpact.peopleAffected },
  { icon: Banknote, label: "Economic impact", value: globalImpact.economicImpact },
  { icon: AlertTriangle, label: "Active conflicts", value: String(globalImpact.activeConflicts) },
  { icon: Flag, label: "Countries involved", value: String(globalImpact.countriesInvolved) },
];

export default function ConflictsPage() {
  return (
    <div className="space-y-4 p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold tracking-wide text-frost">
          CONFLICT TRACKER
        </h1>
        <p className="label-caps-sm text-steel-dim">
          All figures are demo values · not verified statistics
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_260px]">
        {/* Active conflicts */}
        <section aria-labelledby="active-conflicts">
          <SectionHeader title="Active conflicts" as="h2" />
          <div className="space-y-2">
            {conflicts.map((c) => (
              <Panel key={c.id} padded={false} hover className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <EditorialImage src={c.image!} alt="" className="h-9 w-12 shrink-0 rounded-sm" />
                    <div>
                      <h3 className="text-sm font-medium text-frost">{c.name}</h3>
                      <div className="label-caps-sm text-steel-dim">
                        {c.region} · since {c.since}
                      </div>
                    </div>
                  </div>
                  <StatusPill tone={STATUS_TONE[c.status]} pulse={c.status === "escalating"}>
                    {c.status}
                  </StatusPill>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-edge-soft pt-2.5">
                  <div>
                    <span className="label-caps-sm block text-steel-dim">Displaced</span>
                    <span className="numeric text-sm text-frost">{c.displaced}</span>
                  </div>
                  <Sparkline
                    data={c.trend}
                    width={80}
                    height={22}
                    stroke={
                      c.intensity === "extreme"
                        ? "var(--color-sev)"
                        : c.intensity === "high"
                          ? "var(--color-elev)"
                          : "var(--color-warn)"
                    }
                  />
                  <RiskBadge severity={c.intensity} />
                </div>
              </Panel>
            ))}
          </div>
        </section>

        {/* Intensity map */}
        <section aria-labelledby="conflict-map" className="min-w-0">
          <SectionHeader title="Conflict intensity map" as="h2" />
          <Panel padded={false}>
            <WorldMap heat={conflictZones} interactive={false} className="min-h-96" ariaLabel="Conflict intensity map" />
            <div className="label-caps-sm flex flex-wrap items-center gap-4 border-t border-edge-soft px-4 py-2.5 text-steel-dim">
              {[
                ["No conflict", "var(--color-edge)"],
                ["Low", "var(--color-pos)"],
                ["Medium", "var(--color-warn)"],
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

          {/* Recent developments */}
          <div className="mt-4">
            <SectionHeader title="Recent developments" action={{ label: "View all", href: "/news" }} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {developments.map((d) => (
                <Panel key={d.id} padded={false} hover className="group relative overflow-hidden">
                  <EditorialImage src={d.image} alt="" className="h-20 w-full" />
                  <div className="p-2.5">
                    <h3 className="line-clamp-2 text-xs font-medium leading-snug text-frost group-hover:text-cyanpale">
                      <Link href={`/news/${d.id}`} className="outline-none after:absolute after:inset-0">
                        {d.title}
                      </Link>
                    </h3>
                    <div className="label-caps-sm mt-1 text-steel-dim">
                      {d.agoH}h ago · {d.sourcesCount} sources
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        {/* Global impact */}
        <section aria-labelledby="global-impact">
          <SectionHeader title="Global impact" as="h2" />
          <Panel padded={false}>
            <ul className="divide-y divide-edge-soft">
              {IMPACT.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className="flex items-center gap-3 px-4 py-3.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-edge-soft bg-panel2 text-elev"
                      aria-hidden
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <div className={cn("numeric text-lg text-frost")}>{item.value}</div>
                      <div className="label-caps-sm text-steel-dim">{item.label}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="label-caps-sm border-t border-edge-soft px-4 py-2.5 text-steel-dim">
              Aggregated across tracked conflicts · demo data
            </p>
          </Panel>
        </section>
      </div>
    </div>
  );
}
