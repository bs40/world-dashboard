import type { Metadata } from "next";
import { Suspense } from "react";
import { TopicExplorer } from "@/components/topics/TopicExplorer";

export const metadata: Metadata = { title: "Topics" };

export default function TopicsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-5">
          <div className="skeleton h-10 w-72 rounded" />
          <div className="skeleton h-64 w-full rounded" />
        </div>
      }
    >
      <TopicExplorer />
    </Suspense>
  );
}
