"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
  unit?: string;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, height = 160, unit = "%", centerLabel, centerValue }: DonutChartProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}${unit}`} />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="66%"
            outerRadius="92%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="numeric text-lg text-frost">{centerValue}</span>}
          {centerLabel && <span className="label-caps-sm text-steel-dim">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
