"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_FALLBACK } from "@/lib/imagery";

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  /** Shown if `src` fails to load — e.g. a publisher CDN blocking hotlinks. */
  fallbackSrc?: string;
  eager?: boolean;
}

/**
 * Editorial imagery wrapper.
 *
 * Sources are either local procedural SVGs or thumbnails supplied by a
 * publisher's own RSS feed. A cool-toned overlay harmonises both with the
 * interface, and any load failure falls back to local artwork so a card never
 * renders as a broken image.
 *
 * Plain <img> is deliberate: local SVGs need no optimisation, and proxying
 * publisher images through Next's optimiser would both strip their CDN caching
 * and put this app in the middle of serving another party's photography.
 */
export function EditorialImage({
  src,
  alt,
  className,
  overlay = true,
  fallbackSrc = DEFAULT_FALLBACK,
  eager = false,
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? fallbackSrc : src;

  return (
    <div className={cn("relative overflow-hidden bg-panel2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={resolved}
        src={resolved}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent mix-blend-multiply"
        />
      )}
    </div>
  );
}
