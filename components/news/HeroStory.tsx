import Link from "next/link";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { SaveButton } from "@/components/ui/SaveButton";
import { formatAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
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
      {story.image && <EditorialImage src={story.image} alt="" className="absolute inset-0" overlay={false} />}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/5" />
      <SaveButton
        id={`story-${story.id}`}
        kind="story"
        title={story.headline}
        href={`/news/${story.id}`}
        className="absolute right-3 top-3 z-10 rounded bg-ink/50 backdrop-blur-sm"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h2 className="max-w-xl font-display text-xl font-semibold leading-tight text-frost transition-colors group-hover:text-cyanpale md:text-2xl">
          <Link href={`/news/${story.id}`} className="outline-none after:absolute after:inset-0">
            {story.headline}
          </Link>
        </h2>
        {story.summary && (
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-frost/75">{story.summary}</p>
        )}
        <div className="label-caps-sm mt-3 flex items-center gap-2 text-steel">
          <span>{formatAgo(story.publishedAgoMin)}</span>
          {story.sourcesCount && (
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
