"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Tv } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { liveTvChannels } from "@/data/livetv";
import { useFeed } from "@/lib/feed";
import {
  getTvChannelServerSnapshot,
  getTvChannelSnapshot,
  setTvChannel,
  subscribeTvChannel,
} from "@/lib/prefs";
import { cn } from "@/lib/utils";

/**
 * 24/7 broadcaster stream embedded through YouTube's own player (the
 * distribution channel these broadcasters offer). The current live video id
 * arrives with the feed payload, resolved server-side, so the embed survives
 * stream restarts; the bundled fallback id covers the payload not being
 * loaded yet. Captions: the player's CC button (cc_load_policy requests
 * them on by default where the stream provides them).
 */
export function LiveTvPanel() {
  const { liveTv } = useFeed();
  const selectedId = useSyncExternalStore(
    subscribeTvChannel,
    getTvChannelSnapshot,
    getTvChannelServerSnapshot
  );

  const channels = useMemo(
    () =>
      liveTvChannels.map((ch) => ({
        ...ch,
        videoId: liveTv.find((s) => s.id === ch.id)?.videoId ?? ch.fallbackVideoId,
      })),
    [liveTv]
  );

  const active = channels.find((ch) => ch.id === selectedId) ?? channels[0];
  const src =
    `https://www.youtube-nocookie.com/embed/${active.videoId}` +
    `?autoplay=1&mute=1&playsinline=1&rel=0&cc_load_policy=1&cc_lang_pref=en&hl=en`;

  return (
    <section aria-label="Live television">
      <SectionHeader title="Live TV" as="h2">
        <StatusPill tone="sev" pulse>
          On air
        </StatusPill>
      </SectionHeader>
      <Panel padded={false} className="overflow-hidden">
        <div
          className="flex items-center gap-1 overflow-x-auto border-b border-edge-soft px-2 py-1.5"
          role="group"
          aria-label="Choose channel"
        >
          <Tv className="ml-1 h-3.5 w-3.5 shrink-0 text-cyan" aria-hidden />
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setTvChannel(ch.id)}
              aria-pressed={ch.id === active.id}
              className={cn(
                "label-caps-sm whitespace-nowrap rounded-sm border px-2.5 py-1 transition-colors",
                ch.id === active.id
                  ? "border-cyan/40 bg-cyan/10 text-cyanpale"
                  : "border-transparent text-steel hover:text-frost"
              )}
            >
              {ch.name}
            </button>
          ))}
        </div>
        <div className="relative aspect-video bg-ink">
          <iframe
            key={active.videoId}
            src={src}
            title={`${active.name} — live stream`}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="label-caps-sm border-t border-edge-soft px-3 py-2 text-steel-dim">
          {active.name} via YouTube · subtitles: CC button in the player
        </p>
      </Panel>
    </section>
  );
}
