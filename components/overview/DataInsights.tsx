import { Sparkline } from "@/components/charts/Sparkline";
import { DonutChart } from "@/components/charts/DonutChart";
import { TrendIndicator } from "@/components/ui/TrendIndicator";
import { dataInsights } from "@/data/metrics";
import { cn } from "@/lib/utils";

export function DataInsights() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {dataInsights.map((card) => (
        <div key={card.id} className="panel panel-hover flex flex-col p-4">
          <div className="label-caps-sm text-steel">{card.label}</div>
          <div className="label-caps-sm text-steel-dim">{card.sub}</div>

          {card.kind === "bars" && card.bars && (
            <ul className="mt-3 space-y-1.5">
              {card.bars.map((b) => {
                const max = Math.max(...card.bars!.map((x) => x.value));
                return (
                  <li key={b.name} className="flex items-center gap-2">
                    <span className="w-16 truncate text-[11px] text-steel">{b.name}</span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-edge-soft/60">
                      <div
                        className="h-full rounded-full bg-cyan/70"
                        style={{ width: `${(b.value / max) * 100}%` }}
                      />
                    </div>
                    <span className="numeric w-8 text-right text-[11px] text-cyanpale">{b.value}B</span>
                  </li>
                );
              })}
            </ul>
          )}

          {card.kind === "line" && (
            <>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="numeric text-2xl text-frost">{card.value}</span>
              </div>
              <div className="mt-1">
                <Sparkline
                  data={card.spark!}
                  width={160}
                  height={36}
                  stroke={card.trend === "down" ? "var(--color-pos)" : "var(--color-cyan)"}
                  className="w-full"
                />
              </div>
              <div
                className={cn(
                  "label-caps-sm mt-auto flex items-center gap-1 pt-2",
                  card.id === "co2" ? "text-pos" : "text-steel"
                )}
              >
                <TrendIndicator trend={card.trend!} positiveIsDown={card.id === "co2"} />
                {card.change}
              </div>
            </>
          )}

          {card.kind === "donut" && (
            <>
              <div className="mt-1">
                <DonutChart
                  height={104}
                  centerValue={card.value}
                  data={[
                    { name: "Threatened", value: 28, color: "var(--color-env)" },
                    { name: "Stable", value: 72, color: "rgb(18 52 74 / 0.8)" },
                  ]}
                  unit="%"
                />
              </div>
              <div className="label-caps-sm mt-auto flex items-center gap-1 pt-2 text-sev">
                <TrendIndicator trend={card.trend!} positiveIsDown />
                {card.change}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
