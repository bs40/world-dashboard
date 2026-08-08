import type { LiveTvChannel, LiveTvStream } from "@/types";
import { liveTvChannels } from "@/data/livetv";

/**
 * Resolve the current live video id for each TV channel (server-side only).
 *
 * A channel's /live URL redirects to the current stream's watch page, so the
 * id is read from the final URL, with an HTML fallback. Results are cached
 * in-module for 30 minutes — stream ids only change when a broadcaster
 * restarts its stream (weeks/months apart). Any failure falls back to the
 * last-known id from /data/livetv.ts, so the embed always renders.
 */

const TTL_MS = 30 * 60_000;
const FETCH_TIMEOUT_MS = 10_000;

let cache: { at: number; streams: LiveTvStream[] } | null = null;
let pending: Promise<LiveTvStream[]> | null = null;

function extractVideoId(finalUrl: string, html: string): string | undefined {
  const fromUrl = finalUrl.match(/[?&]v=([\w-]{11})/);
  if (fromUrl) return fromUrl[1];
  const canonical = html.match(/rel="canonical"\s+href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/);
  if (canonical) return canonical[1];
  const inline = html.match(/"videoId":"([\w-]{11})"/);
  return inline?.[1];
}

async function resolveChannel(channel: LiveTvChannel): Promise<LiveTvStream> {
  try {
    const res = await fetch(`https://www.youtube.com/${channel.handle}/live`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        // Pre-set consent cookies so EU points of presence get the page
        // rather than the consent interstitial.
        cookie: "CONSENT=YES+1; SOCS=CAI",
        "accept-language": "en",
        "user-agent": "Mozilla/5.0 (compatible; WorldDashboard/1.0; +https://github.com/bs40/world-dashboard)",
      },
    });
    if (res.ok) {
      const videoId = extractVideoId(res.url, await res.text());
      if (videoId) {
        return { id: channel.id, name: channel.name, videoId, resolved: true };
      }
    }
  } catch {
    // Fall through to the last-known id.
  }
  return { id: channel.id, name: channel.name, videoId: channel.fallbackVideoId, resolved: false };
}

export async function resolveLiveTv(): Promise<LiveTvStream[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.streams;
  if (!pending) {
    pending = Promise.all(liveTvChannels.map(resolveChannel))
      .then((streams) => {
        cache = { at: Date.now(), streams };
        return streams;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}
