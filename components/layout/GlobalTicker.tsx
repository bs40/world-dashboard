"use client";

import Link from "next/link";
import { Radio } from "lucide-react";
import { useFeed } from "@/lib/feed";
import { storyHref } from "@/lib/utils";
import { tickerItems } from "@/data/news";

/** Bottom scrolling ticker. Duplicated content creates a seamless loop. */
export function GlobalTicker() {
  const { stories, isLive } = useFeed();

  const items = isLive
    ? stories.slice(0, 14).map((s) => ({ text: s.headline, href: storyHref(s) }))
    : tickerItems.map((text) => ({ text, href: "/news" }));

  const doubled = [...items, ...items];

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex h-9 items-stretch border-t border-edge-soft bg-navy/95 backdrop-blur-md">
      <div className="label-caps flex shrink-0 items-center gap-2 border-r border-edge-soft bg-panel px-4 text-cyanpale">
        <Radio className="h-3.5 w-3.5 animate-pulse-dot text-cyan" aria-hidden />
        <span className="hidden sm:inline">Global ticker</span>
        <span className="sm:hidden">Live</span>
      </div>
      <div className="relative flex-1 overflow-hidden" aria-label="Breaking headlines ticker">
        <div className="absolute inset-y-0 flex animate-ticker items-center whitespace-nowrap will-change-transform hover:[animation-play-state:paused]">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center text-xs text-steel">
              <Link href={item.href} className="px-4 transition-colors hover:text-frost">
                {item.text}
              </Link>
              <span aria-hidden className="h-1 w-1 rounded-full bg-edge" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
