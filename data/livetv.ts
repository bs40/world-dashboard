import type { LiveTvChannel } from "@/types";

/**
 * 24/7 live news channels embedded via YouTube's player — the distribution
 * path these broadcasters offer publicly (embedding verified enabled via
 * oEmbed for each). The current live video id is resolved server-side
 * (lib/sources/livetv.ts) so the embed survives stream restarts; the
 * fallback ids below are the streams that were live when this shipped.
 */
export const liveTvChannels: LiveTvChannel[] = [
  {
    id: "dw",
    name: "DW News",
    handle: "@dwnews",
    fallbackVideoId: "LuKwFajn37U",
  },
  {
    id: "france24",
    name: "France 24",
    handle: "@France24_en",
    fallbackVideoId: "HvZt-nh9sGg",
  },
  {
    id: "sky",
    name: "Sky News",
    handle: "@SkyNews",
    fallbackVideoId: "YDvsBbKfLPA",
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    handle: "@aljazeeraenglish",
    fallbackVideoId: "gCNeDWCI0vo",
  },
];
