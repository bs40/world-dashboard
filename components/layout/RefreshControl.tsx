"use client";

import { ChevronDown, RefreshCw } from "lucide-react";
import { useFeed } from "@/lib/feed";
import { REFRESH_INTERVALS, type RefreshInterval } from "@/lib/prefs";
import { cn } from "@/lib/utils";

function clockTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

/**
 * Live-feed status and the sticky refresh-interval picker. The chosen cadence
 * persists in localStorage, so it survives reloads and applies across tabs.
 */
export function RefreshControl() {
  const {
    status,
    isLive,
    isRefreshing,
    lastUpdated,
    sourcesLive,
    sourcesTotal,
    intervalMin,
    setIntervalMin,
    refresh,
  } = useFeed();

  const label =
    status === "loading"
      ? "Connecting"
      : isLive
        ? "Live"
        : status === "error"
          ? "Offline"
          : "Demo";

  const tone = isLive ? "text-pos" : status === "loading" ? "text-cyan" : "text-warn";

  return (
    <div className="flex items-center gap-1.5">
      {/* Status */}
      <span
        className={cn("label-caps-sm hidden items-center gap-1.5 sm:flex", tone)}
        title={
          isLive
            ? `${sourcesLive} of ${sourcesTotal} feeds responding`
            : "Showing bundled demo content — live feeds unavailable"
        }
      >
        <span className="relative flex h-1.5 w-1.5" aria-hidden>
          {isLive && (
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-current" />
          )}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
        {label}
        {isLive && sourcesTotal > 0 && (
          <span className="text-steel-dim">
            {sourcesLive}/{sourcesTotal}
          </span>
        )}
      </span>

      {/* Last updated */}
      {lastUpdated && (
        <span className="numeric hidden text-[11px] text-steel-dim lg:block" title={lastUpdated.toISOString()}>
          {clockTime(lastUpdated)}
        </span>
      )}

      {/* Interval picker */}
      <label className="relative">
        <span className="sr-only">Auto-refresh interval</span>
        <select
          value={intervalMin}
          onChange={(e) => setIntervalMin(Number(e.target.value) as RefreshInterval)}
          className="label-caps-sm cursor-pointer appearance-none rounded-sm border border-edge-soft bg-panel py-1.5 pl-2.5 pr-7 text-steel outline-none transition-colors hover:border-cyan/40 hover:text-frost"
          title="How often new stories are pulled from the feeds"
        >
          {REFRESH_INTERVALS.map((min) => (
            <option key={min} value={min}>
              {min} min
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-steel-dim"
        />
      </label>

      {/* Manual refresh */}
      <button
        onClick={refresh}
        disabled={isRefreshing}
        aria-label="Refresh stories now"
        className="rounded p-2 text-steel transition-colors hover:text-frost disabled:opacity-50"
      >
        <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} aria-hidden />
      </button>
    </div>
  );
}
