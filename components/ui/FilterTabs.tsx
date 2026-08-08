"use client";

import { cn } from "@/lib/utils";

interface FilterTabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  variant?: "underline" | "chip";
  ariaLabel?: string;
  className?: string;
}

export function FilterTabs({
  tabs,
  active,
  onChange,
  variant = "underline",
  ariaLabel = "Filter",
  className,
}: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-1 overflow-x-auto",
        variant === "underline" && "border-b border-edge-soft",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "label-caps-sm whitespace-nowrap px-3 py-2 transition-colors",
              variant === "underline" && [
                "-mb-px border-b-2",
                isActive
                  ? "border-cyan bg-cyan/5 text-frost"
                  : "border-transparent text-steel hover:text-frost",
              ],
              variant === "chip" && [
                "rounded border",
                isActive
                  ? "border-cyan/40 bg-cyan/10 text-cyanpale"
                  : "border-edge-soft bg-panel text-steel hover:border-edge hover:text-frost",
              ]
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
