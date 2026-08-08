"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getIntervalSnapshot,
  setRefreshInterval,
  subscribeInterval,
  DEFAULT_INTERVAL,
  type RefreshInterval,
} from "@/lib/prefs";
import { topStories as demoStories } from "@/data/news";
import type { LiveTvStream, NewsStory } from "@/types";

/**
 * Live feed store.
 *
 * Implemented as a module-level store consumed through useSyncExternalStore
 * rather than provider + effects: fetching is a genuinely external system, one
 * poll serves every subscriber regardless of how many components read it, and
 * the server and first client render agree without a hydration dance.
 */

export type FeedStatus = "loading" | "live" | "demo" | "error";

interface FeedApiResponse {
  ok: boolean;
  stories: NewsStory[];
  fetchedAt: string;
  sources: { live: number; total: number };
  liveTv?: LiveTvStream[];
  error?: string;
}

interface FeedState {
  stories: NewsStory[];
  status: FeedStatus;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  sourcesLive: number;
  sourcesTotal: number;
  liveTv: LiveTvStream[];
}

const INITIAL: FeedState = {
  stories: [],
  status: "loading",
  isRefreshing: false,
  lastUpdated: null,
  sourcesLive: 0,
  sourcesTotal: 0,
  liveTv: [],
};

let state: FeedState = INITIAL;
const listeners = new Set<() => void>();
let started = false;
let timerId: ReturnType<typeof setInterval> | undefined;
let inFlight = false;

function emit(patch: Partial<FeedState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

// On the static Bunny deployment this points at the Edge Script; locally it
// stays same-origin. Inlined at build time (NEXT_PUBLIC_*).
const NEWS_ENDPOINT = process.env.NEXT_PUBLIC_NEWS_ENDPOINT || "/api/news";

async function load() {
  if (inFlight) return;
  inFlight = true;
  try {
    const res = await fetch(NEWS_ENDPOINT, { cache: "no-store" });
    const data = (await res.json()) as FeedApiResponse;
    if (data.ok && data.stories.length > 0) {
      emit({
        stories: data.stories,
        status: "live",
        sourcesLive: data.sources?.live ?? 0,
        sourcesTotal: data.sources?.total ?? 0,
        liveTv: data.liveTv ?? [],
        lastUpdated: new Date(data.fetchedAt),
        isRefreshing: false,
      });
    } else {
      emit({
        stories: [],
        status: "demo",
        sourcesLive: data.sources?.live ?? 0,
        sourcesTotal: data.sources?.total ?? 0,
        liveTv: data.liveTv ?? [],
        lastUpdated: new Date(),
        isRefreshing: false,
      });
    }
  } catch {
    emit({ stories: [], status: "error", lastUpdated: new Date(), isRefreshing: false });
  } finally {
    inFlight = false;
  }
}

function restartTimer() {
  if (timerId) clearInterval(timerId);
  const minutes = getIntervalSnapshot();
  timerId = setInterval(() => {
    emit({ isRefreshing: true });
    void load();
  }, minutes * 60_000);
}

function onVisibilityChange() {
  if (document.visibilityState !== "visible") return;
  emit({ isRefreshing: true });
  void load();
}

function start() {
  if (started) return;
  started = true;
  void load();
  restartTimer();
  // Re-arm the timer whenever the user picks a different cadence.
  subscribeInterval(restartTimer);
  document.addEventListener("visibilitychange", onVisibilityChange);
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  start();
  return () => {
    listeners.delete(onStoreChange);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => INITIAL;

export function refreshFeed() {
  emit({ isRefreshing: true });
  void load();
}

export interface FeedValue extends FeedState {
  isLive: boolean;
  intervalMin: RefreshInterval;
  setIntervalMin: (value: RefreshInterval) => void;
  refresh: () => void;
}

export function useFeed(): FeedValue {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const intervalMin = useSyncExternalStore(
    subscribeInterval,
    getIntervalSnapshot,
    () => DEFAULT_INTERVAL
  );

  return useMemo(
    () => ({
      ...snapshot,
      // Fall back to bundled content whenever the feeds return nothing.
      stories: snapshot.stories.length > 0 ? snapshot.stories : demoStories,
      isLive: snapshot.status === "live" && snapshot.stories.length > 0,
      intervalMin,
      setIntervalMin: setRefreshInterval,
      refresh: refreshFeed,
    }),
    [snapshot, intervalMin]
  );
}

/** Stories in a category, newest first. */
export function useStoriesByCategory(category: string | "all", limit?: number): NewsStory[] {
  const { stories } = useFeed();
  return useMemo(() => {
    const filtered = category === "all" ? stories : stories.filter((s) => s.category === category);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [stories, category, limit]);
}
