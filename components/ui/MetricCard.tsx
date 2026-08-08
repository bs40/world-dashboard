import { Sparkline } from "@/components/charts/Sparkline";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const STATUS_COLORS = {
  pos: "text-pos",
  warn: "text-warn",
  elev: "text-elev",
  sev: "text-sev",
  cyan: "text-cyanpale",
} as const;

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  status?: string;
  statusColor?: keyof typeof STATUS_COLORS;
  spark?: number[];
  sparkColor?: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  status,
  statusColor = "cyan",
  spark,
  sparkColor,
  icon,
  className,
}: MetricCardProps) {
  return (
    <div className={cn("panel panel-hover p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="label-caps-sm text-steel">{label}</span>
        {icon && <span className="text-cyan/70" aria-hidden>{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="numeric text-2xl font-medium text-frost">{value}</span>
        {unit && <span className="numeric text-sm text-steel">{unit}</span>}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        {status && <span className={cn("label-caps-sm", STATUS_COLORS[statusColor])}>{status}</span>}
        {spark && <Sparkline data={spark} stroke={sparkColor ?? "var(--color-cyan)"} />}
      </div>
    </div>
  );
}
