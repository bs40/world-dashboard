import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: { label: string; href: string };
  children?: ReactNode;
  className?: string;
  as?: "h2" | "h3";
}

export function SectionHeader({ title, action, children, className, as = "h2" }: SectionHeaderProps) {
  const Heading = as;
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <Heading className="label-caps text-frost">{title}</Heading>
      <div className="flex items-center gap-3">
        {children}
        {action && (
          <Link
            href={action.href}
            className="label-caps-sm flex items-center gap-0.5 text-cyan transition-colors hover:text-cyanpale"
          >
            {action.label}
            <ChevronRight className="h-3 w-3" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
