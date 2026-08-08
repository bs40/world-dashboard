import Link from "next/link";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { fallbackFor } from "@/lib/imagery";
import { SaveButton } from "@/components/ui/SaveButton";
import { cn, formatAgo, storyHref } from "@/lib/utils";
import type { NewsStory } from "@/types";

interface HeroStoryProps {
  story: NewsStory;
  className?: string;
  heightClass?: string;
}

/** Large lead-story card with cinematic image and gradient scrim. */
export function HeroStory({ story, className, heightClass = "h-72" }: HeroStoryProps) {
  return (
    <article className={cn("group panel panel-hover relative overflow-hidden", heightClass, className)}>
      <EditorialImage
        src={story.image ?? fallbackFor(story.category)}
        fallbackSrc={fallbackFor(story.category)}
        alt=""
        className="absolute inset-0"
        overlay={false}
        eager
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/5" />
      <SaveButton
        id={`story-${story.id}`}
        kind="story"
        title={story.headline}
        href={storyHref(story)}
        className="absolute right-3 top-3 z-10 rounded bg-ink/50 backdrop-blur-sm"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h2 className="max-w-xl font-display text-xl font-semibold leading-tight text-frost transition-colors group-hover:text-cyanpale md:text-2xl">
          <Link href={storyHref(story)} className="outline-none after:absolute after:inset-0">
            {story.headline}
          </Link>
        </h2>
        {story.summary && (
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-frost/75">{story.summary}</p>
        )}
        <div className="label-caps-sm mt-3 flex flex-wrap items-center gap-2 text-steel">
          {story.sourceName && (
            <>
              <span className="text-cyanpale">{story.sourceName}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <span>{formatAgo(story.publishedAgoMin)}</span>
          {story.sourcesCount && story.sourcesCount > 1 && (
            <>
              <span aria-hidden>·</span>
              <span>{story.sourcesCount} sources</span>
            </>
          )}
          {story.location && (
            <>
              <span aria-hidden>·</span>
              <span>{story.location.label}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
