"use client";

import { useMemo } from "react";
import Link from "next/link";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { fallbackFor } from "@/lib/imagery";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { developments } from "@/data/conflicts";
import { useFeed } from "@/lib/feed";
import { formatAgo, storyHref } from "@/lib/utils";
import type { NewsStory } from "@/types";

/** Live conflict coverage, falling back to bundled samples when unavailable. */
export function ConflictDevelopments() {
  const { stories } = useFeed();

  const items = useMemo<NewsStory[]>(() => {
    const live = stories.filter((s) => s.isLive && s.category === "conflicts").slice(0, 4);
    if (live.length > 0) return live;
    return developments.map((d) => ({
      id: d.id,
      headline: d.title,
      category: "conflicts",
      sourceId: "international-desk",
      publishedAgoMin: d.agoH * 60,
      sourcesCount: d.sourcesCount,
      image: d.image,
    }));
  }, [stories]);

  return (
    <div className="mt-4">
      <SectionHeader title="Recent developments" action={{ label: "View all", href: "/news" }} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Panel key={item.id} padded={false} hover className="group relative overflow-hidden">
            <EditorialImage
              src={item.image ?? fallbackFor("conflicts")}
              fallbackSrc={fallbackFor("conflicts")}
              alt=""
              className="h-20 w-full"
            />
            <div className="p-2.5">
              <h3 className="line-clamp-2 text-xs font-medium leading-snug text-frost group-hover:text-cyanpale">
                <Link href={storyHref(item)} className="outline-none after:absolute after:inset-0">
                  {item.headline}
                </Link>
              </h3>
              <div className="label-caps-sm mt-1 text-steel-dim">
                {formatAgo(item.publishedAgoMin)}
                {item.sourceName ? ` · ${item.sourceName}` : ""}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
