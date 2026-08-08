"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

export interface SeriesDef {
  key: string;
  name: string;
  color: string;
}

interface TimeSeriesChartProps {
  data: Record<string, string | number>[];
  series: SeriesDef[];
  xKey: string;
  height?: number;
  kind?: "line" | "area";
  yDomain?: [number | "auto" | "dataMin", number | "auto" | "dataMax"];
  /** Unit suffix appended to axis ticks and tooltip values (serialisable, so server components can pass it). */
  yUnit?: string;
  showYAxis?: boolean;
  xTickInterval?: number | "preserveStartEnd";
}

const axisStyle = {
  fontSize: 10,
  fontFamily: "var(--font-display)",
  fill: "var(--color-steel-dim)",
  letterSpacing: "0.08em",
};

export function TimeSeriesChart({
  data,
  series,
  xKey,
  height = 220,
  kind = "line",
  yDomain,
  yUnit,
  showYAxis = true,
  xTickInterval = "preserveStartEnd",
}: TimeSeriesChartProps) {
  const Chart = kind === "area" ? AreaChart : LineChart;
  const yFormatter = yUnit ? (v: number) => `${v}${yUnit}` : undefined;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 8, right: 4, bottom: 0, left: showYAxis ? -18 : 4 }}>
        <CartesianGrid stroke="var(--color-edge-soft)" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={axisStyle}
          tickLine={false}
          axisLine={{ stroke: "var(--color-edge-soft)" }}
          interval={xTickInterval}
          minTickGap={32}
        />
        {showYAxis && (
          <YAxis
            tick={axisStyle}
            tickLine={false}
            axisLine={false}
            domain={yDomain ?? ["auto", "auto"]}
            tickFormatter={yFormatter}
            width={48}
          />
        )}
        <Tooltip
          content={<ChartTooltip formatter={yFormatter ? (v) => yFormatter(v) : undefined} />}
          cursor={{ stroke: "var(--color-edge)", strokeDasharray: "2 3" }}
        />
        {series.map((s) =>
          kind === "area" ? (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={1.5}
              fill={s.color}
              fillOpacity={0.07}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
          ) : (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
          )
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
