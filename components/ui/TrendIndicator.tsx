import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trend } from "@/types";

interface TrendIndicatorProps {
  trend: Trend;
  label?: string;
  /** When a downward move is good news (e.g. inflation), invert colouring. */
  positiveIsDown?: boolean;
  className?: string;
}

export function TrendIndicator({ trend, label, positiveIsDown = false, className }: TrendIndicatorProps) {
  const good = trend === "flat" ? null : positiveIsDown ? trend === "down" : trend === "up";
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs numeric",
        good === null ? "text-steel" : good ? "text-pos" : "text-sev",
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label && <span>{label}</span>}
      <span className="sr-only">
        {trend === "up" ? "trending up" : trend === "down" ? "trending down" : "stable"}
      </span>
    </span>
  );
}
