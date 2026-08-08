import { getSource } from "@/data/sources";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  sourceId: string;
  className?: string;
}

export function SourceBadge({ sourceId, className }: SourceBadgeProps) {
  const source = getSource(sourceId);
  if (!source) return null;
  return (
    <span
      className={cn("label-caps-sm inline-flex items-center gap-1 text-steel", className)}
      title={`${source.name} · ${source.region}`}
    >
      <span
        aria-hidden
        className={cn(
          "h-1 w-1 rounded-full",
          source.trustTier === "primary" && "bg-cyan",
          source.trustTier === "high" && "bg-cyanpale/70",
          source.trustTier === "standard" && "bg-steel"
        )}
      />
      {source.name}
    </span>
  );
}
