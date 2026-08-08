import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DataRowProps {
  icon?: ReactNode;
  label: string;
  meta?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

/** Compact interactive list row used in Data Explorer style lists. */
export function DataRow({ icon, label, meta, onClick, className }: DataRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-sm border border-edge-soft bg-panel2/50 px-3 py-2.5 text-left transition-colors hover:border-edge hover:bg-panel2",
        className
      )}
    >
      {icon && (
        <span className="flex h-6 w-6 items-center justify-center text-cyan" aria-hidden>
          {icon}
        </span>
      )}
      <span className="flex-1 text-sm text-frost">{label}</span>
      {meta && <span className="label-caps-sm text-steel-dim">{meta}</span>}
      <ChevronRight
        className="h-3.5 w-3.5 text-steel-dim transition-transform group-hover:translate-x-0.5 group-hover:text-cyan"
        aria-hidden
      />
    </button>
  );
}
