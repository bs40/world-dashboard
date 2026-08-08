"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Compass, Database, FileText, Newspaper, Target, Trash2 } from "lucide-react";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Panel } from "@/components/ui/Panel";
import { useSaved } from "@/lib/saved";
import type { SavedKind } from "@/types";

const KIND_ICON: Record<SavedKind, typeof Newspaper> = {
  story: Newspaper,
  report: FileText,
  topic: Target,
  region: Compass,
  dataset: Database,
};

const TABS = [
  { id: "all", label: "All" },
  { id: "story", label: "Stories" },
  { id: "report", label: "Reports" },
  { id: "topic", label: "Topics" },
  { id: "region", label: "Regions" },
  { id: "dataset", label: "Datasets" },
];

export function SavedList() {
  const { items, remove, hydrated } = useSaved();
  const [tab, setTab] = useState("all");

  const filtered = items.filter((i) => tab === "all" || i.kind === tab);

  return (
    <div className="space-y-4 p-4 lg:p-5">
      <h1 className="font-display text-xl font-semibold tracking-wide text-frost">SAVED</h1>
      <FilterTabs tabs={TABS} active={tab} onChange={setTab} ariaLabel="Saved item type" />

      {!hydrated ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-14 rounded" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Panel className="flex flex-col items-center justify-center py-16 text-center">
          <Bookmark className="h-8 w-8 text-steel-dim" aria-hidden />
          <p className="mt-3 text-sm text-steel">Nothing saved yet.</p>
          <p className="label-caps-sm mt-1 max-w-xs text-steel-dim">
            Use the bookmark icon on stories, reports, topics and regions to collect them here.
            Saved items persist in this browser.
          </p>
        </Panel>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <li key={item.id}>
                <Panel padded={false} hover className="flex items-center gap-3 px-4 py-3">
                  <Icon className="h-4 w-4 shrink-0 text-cyan" aria-hidden />
                  <Link href={item.href} className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-frost hover:text-cyanpale">
                      {item.title}
                    </span>
                    <span className="label-caps-sm text-steel-dim">
                      {item.kind}
                      {item.meta ? ` · ${item.meta}` : ""}
                    </span>
                  </Link>
                  <button
                    aria-label={`Remove ${item.title} from saved`}
                    onClick={() => remove(item.id)}
                    className="rounded p-1.5 text-steel-dim transition-colors hover:text-sev"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
