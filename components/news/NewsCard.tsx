import Link from "next/link";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { fallbackFor } from "@/lib/imagery";
import { SaveButton } from "@/components/ui/SaveButton";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { cn, formatAgo, storyHref } from "@/lib/utils";
import type { NewsStory } from "@/types";

const CATEGORY_LABEL: Record<string, string> = {
  politics: "Politics",
  conflicts: "Conflicts",
  economy: "Business",
  environment: "Environment",
  society: "Society",
  technology: "Technology",
  health: "Health",
  science: "Science",
};

interface NewsCardProps {
  story: NewsStory;
  layout?: "row" | "stack";
  showSummary?: boolean;
  className?: string;
}

export function NewsCard({ story, layout = "row", showSummary = false, className }: NewsCardProps) {
  return (
    <article
      className={cn(
        "group panel panel-hover relative overflow-hidden",
        layout === "row" ? "flex gap-3 p-2.5" : "flex flex-col",
        className
      )}
    >
      <EditorialImage
        src={story.image ?? fallbackFor(story.category)}
        fallbackSrc={fallbackFor(story.category)}
        alt=""
        className={cn(layout === "row" ? "h-16 w-24 shrink-0 rounded-sm" : "h-36 w-full")}
      />
      <div className={cn("min-w-0 flex-1", layout === "stack" && "p-3")}>
        <h3 className="text-sm font-medium leading-snug text-frost transition-colors group-hover:text-cyanpale">
          {story.live && (
            <span className="label-caps-sm mr-1.5 inline-flex items-center gap-1 text-sev">
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-sev" />
              Live
            </span>
          )}
          {/* Stretched link: makes the whole card clickable */}
          <Link href={storyHref(story)} className="outline-none after:absolute after:inset-0">
            {story.headline}
          </Link>
        </h3>
        {showSummary && story.summary && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-steel">{story.summary}</p>
        )}
        <div className="label-caps-sm mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-steel-dim">
          <span>{formatAgo(story.publishedAgoMin)}</span>
          <span aria-hidden>·</span>
          <span>{story.sourceName ?? CATEGORY_LABEL[story.category]}</span>
          {story.sourcesCount && story.sourcesCount > 1 && (
            <>
              <span aria-hidden>·</span>
              <span>{story.sourcesCount} sources</span>
            </>
          )}
        </div>
      </div>
      <SaveButton
        id={`story-${story.id}`}
        kind="story"
        title={story.headline}
        href={storyHref(story)}
        meta={CATEGORY_LABEL[story.category]}
        className={cn(
          "relative z-10",
          layout === "stack" && "absolute right-2 top-2 bg-ink/50 backdrop-blur-sm"
        )}
      />
    </article>
  );
}

export function NewsListItem({ story, className }: { story: NewsStory; className?: string }) {
  return (
    <article className={cn("group relative flex items-start justify-between gap-3 py-2.5", className)}>
      <div className="min-w-0">
        <h4 className="text-sm leading-snug text-frost transition-colors group-hover:text-cyanpale">
          <Link href={storyHref(story)} className="outline-none after:absolute after:inset-0">
            {story.headline}
          </Link>
        </h4>
        <div className="label-caps-sm mt-1 flex items-center gap-2 text-steel-dim">
          <span>{formatAgo(story.publishedAgoMin)}</span>
          {story.sourcesCount && story.sourcesCount > 1 && (
            <>
              <span aria-hidden>·</span>
              <span>{story.sourcesCount} sources</span>
            </>
          )}
          <SourceBadge sourceId={story.sourceId} />
        </div>
      </div>
      <SaveButton
        id={`story-${story.id}`}
        kind="story"
        title={story.headline}
        href={storyHref(story)}
        className="relative z-10"
      />
    </article>
  );
}
