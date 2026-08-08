"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface AnomalyBarsProps {
  data: { year: number; anomaly: number }[];
  height?: number;
}

/** Warming-stripes style diverging bar chart for temperature anomaly. */
export function AnomalyBars({ data, height = 240 }: AnomalyBarsProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -22 }} barCategoryGap={0}>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fill: "var(--color-steel-dim)", fontFamily: "var(--font-display)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--color-edge-soft)" }}
          ticks={[1880, 1920, 1960, 2000, 2024]}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--color-steel-dim)", fontFamily: "var(--font-display)" }}
          tickLine={false}
          axisLine={false}
          domain={[-0.6, 1.4]}
          tickFormatter={(v) => Number(v).toFixed(1)}
          width={44}
        />
        <Tooltip
          content={<ChartTooltip formatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(2)}°C`} />}
          cursor={{ fill: "rgb(34 184 240 / 0.06)" }}
        />
        <Bar dataKey="anomaly" name="Anomaly" isAnimationActive={false}>
          {data.map((d) => (
            <Cell
              key={d.year}
              fill={d.anomaly >= 0 ? "var(--color-sev)" : "var(--color-cyan)"}
              fillOpacity={0.4 + Math.min(0.6, Math.abs(d.anomaly) * 0.55)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
