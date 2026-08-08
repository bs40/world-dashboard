"use client";

interface TooltipEntry {
  dataKey?: string | number;
  name?: string | number;
  value?: number | string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  formatter?: (value: number, name: string) => string;
}

/** Shared themed tooltip for all Recharts panels. */
export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="panel pointer-events-none border-edge px-2.5 py-1.5 text-xs shadow-glow">
      {label !== undefined && <div className="label-caps-sm mb-1 text-steel">{label}</div>}
      <div className="space-y-0.5">
        {payload.map((entry, i) => (
          <div key={`${String(entry.dataKey)}-${i}`} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: entry.color ?? "var(--color-cyan)" }}
            />
            <span className="text-steel">{entry.name}</span>
            <span className="numeric ml-auto pl-3 text-frost">
              {formatter
                ? formatter(Number(entry.value), String(entry.name))
                : Number(entry.value).toLocaleString("en-US")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
