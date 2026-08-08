import type { Metadata } from "next";
import { Suspense } from "react";
import { LiveArticle } from "@/components/news/LiveArticle";

export const metadata: Metadata = { title: "Story" };

/**
 * Client-rendered article route for live stories (/news/story/?id=live-…).
 * Live items rotate too fast to prerender, so this static-export-safe page
 * resolves the story from the client feed store.
 */
export default function LiveStoryPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-4 p-6">
          <div className="skeleton h-10 w-2/3 rounded" />
          <div className="skeleton h-72 w-full rounded" />
        </div>
      }
    >
      <LiveArticle />
    </Suspense>
  );
}
