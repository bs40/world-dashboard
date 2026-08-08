import type { Metadata } from "next";
import { Suspense } from "react";
import { RegionExplorer } from "@/components/regions/RegionExplorer";

export const metadata: Metadata = { title: "Regions" };

export default function RegionsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-5">
          <div className="skeleton h-10 w-64 rounded" />
          <div className="skeleton h-80 w-full rounded" />
        </div>
      }
    >
      <RegionExplorer />
    </Suspense>
  );
}
