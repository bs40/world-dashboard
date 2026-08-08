"use client";

import { cn } from "@/lib/utils";

interface BarRankingProps {
  items: { name: string; value: number; color?: string }[];
  max?: number;
  unit?: string;
  showRank?: boolean;
  className?: string;
}

/**
 * Horizontal ranking bars (Top Risks, trade flows, adoption). Pure CSS —
 * crisper than a chart library for label-plus-bar rows.
 */
export function BarRanking({ items, max, unit = "", showRank = true, className }: BarRankingProps) {
  const ceiling = max ?? Math.max(...items.map((i) => i.value)) * 1.1;
  return (
    <ol className={cn("space-y-2.5", className)}>
      {items.map((item, idx) => (
        <li key={item.name} className="group flex items-center gap-2.5">
          {showRank && (
            <span className="numeric w-4 shrink-0 text-right text-xs text-steel-dim">{idx + 1}</span>
          )}
          <span className="w-36 shrink-0 truncate text-xs text-frost">{item.name}</span>
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-edge-soft/60"
            role="meter"
            aria-valuenow={item.value}
            aria-valuemin={0}
            aria-valuemax={Math.round(ceiling * 10) / 10}
            aria-label={item.name}
          >
            <div
              className="h-full rounded-full transition-all duration-500 group-hover:brightness-125"
              style={{
                width: `${Math.min(100, (item.value / ceiling) * 100)}%`,
                background: item.color ?? "linear-gradient(90deg, var(--color-sev), var(--color-elev))",
              }}
            />
          </div>
          <span className="numeric w-10 shrink-0 text-right text-xs text-cyanpale">
            {item.value}
            {unit}
          </span>
        </li>
      ))}
    </ol>
  );
}
