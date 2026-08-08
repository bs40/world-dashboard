"use client";

import { Bookmark } from "lucide-react";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/utils";
import type { SavedKind } from "@/types";

interface SaveButtonProps {
  id: string;
  kind: SavedKind;
  title: string;
  href: string;
  meta?: string;
  className?: string;
}

export function SaveButton({ id, kind, title, href, meta, className }: SaveButtonProps) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);
  return (
    <button
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ id, kind, title, href, meta });
      }}
      className={cn(
        "rounded p-1 transition-colors",
        saved ? "text-cyan" : "text-steel-dim hover:text-frost",
        className
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} aria-hidden />
    </button>
  );
}
