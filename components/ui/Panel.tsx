import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  padded?: boolean;
}

export function Panel({
  children,
  hover = false,
  glow = false,
  padded = true,
  className,
  ...rest
}: PanelProps) {
  return (
    <div
      className={cn(
        "panel",
        hover && "panel-hover",
        glow && "edge-glow",
        padded && "p-4",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
