"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bookmark,
  Compass,
  Globe,
  Lightbulb,
  Newspaper,
  Settings,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Overview", href: "/overview", icon: Globe },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Regions", href: "/regions", icon: Compass },
  { label: "Topics", href: "/topics", icon: Target },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Settings", href: "/settings", icon: Settings },
];

/**
 * Left navigation. Full labels on xl screens, icon rail on md–lg,
 * hidden on mobile (the header nav + bottom of pages carry navigation).
 */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 border-r border-edge-soft bg-navy/40 md:block md:w-14 xl:w-44">
      <nav aria-label="Sections" className="flex h-full flex-col gap-1 p-2">
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              title={item.label}
              className={cn(
                "group flex items-center gap-3 rounded-sm border px-2.5 py-2.5 transition-colors",
                active
                  ? "border-cyan/30 bg-cyan/10 text-frost shadow-glow"
                  : "border-transparent text-steel hover:bg-panel hover:text-frost"
              )}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", active ? "text-cyan" : "text-steel-dim group-hover:text-steel")}
                aria-hidden
              />
              <span className="label-caps-sm hidden xl:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
