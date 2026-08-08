"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutGrid, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClockUTC } from "./ClockUTC";
import { useSearchDialog } from "./SearchDialog";

const NAV = [
  { label: "Overview", href: "/overview" },
  { label: "News", href: "/news" },
  { label: "Analytics", href: "/analytics" },
  { label: "Regions", href: "/regions" },
  { label: "Topics", href: "/topics" },
  { label: "Insights", href: "/insights" },
];

export function Header() {
  const pathname = usePathname();
  const { open } = useSearchDialog();

  return (
    <header className="sticky top-0 z-40 border-b border-edge-soft bg-ink/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-6 px-4 lg:px-6">
        <Link href="/overview" className="flex items-center gap-3" aria-label="World Dashboard home">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-cyan/40 bg-cyan/10 font-display text-lg font-bold text-cyan shadow-glow"
          >
            W
          </span>
          <span className="hidden leading-tight lg:block">
            <span className="font-display text-sm font-semibold tracking-[0.22em] text-frost">
              WORLD DASHBOARD
            </span>
            <span className="label-caps-sm block text-steel-dim">Global perspective. Real time.</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "label-caps relative block px-4 py-[18px] transition-colors",
                      active ? "bg-cyan/5 text-frost" : "text-steel hover:text-frost"
                    )}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ClockUTC />
          <div className="ml-2 flex items-center">
            <button
              aria-label="Search (Ctrl+K)"
              onClick={open}
              className="rounded p-2 text-steel transition-colors hover:text-frost"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
            <button aria-label="Notifications" className="relative rounded p-2 text-steel transition-colors hover:text-frost">
              <Bell className="h-4 w-4" aria-hidden />
              <span aria-hidden className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan" />
            </button>
            <button aria-label="Applications" className="rounded p-2 text-steel transition-colors hover:text-frost">
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
