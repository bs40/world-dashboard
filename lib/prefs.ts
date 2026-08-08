/**
 * Sticky user preferences backed by localStorage.
 *
 * Exposed through useSyncExternalStore rather than an effect so the server
 * render and the first client render agree, and so a change made in one
 * component is seen immediately by every other subscriber (and by other tabs).
 */

const INTERVAL_KEY = "world-dashboard:refresh-interval";

export const REFRESH_INTERVALS = [5, 15, 30, 60] as const;
export type RefreshInterval = (typeof REFRESH_INTERVALS)[number];
export const DEFAULT_INTERVAL: RefreshInterval = 15;

let cached: RefreshInterval = DEFAULT_INTERVAL;
let loaded = false;
const listeners = new Set<() => void>();

function isValid(value: number): value is RefreshInterval {
  return (REFRESH_INTERVALS as readonly number[]).includes(value);
}

function load() {
  try {
    const raw = localStorage.getItem(INTERVAL_KEY);
    const parsed = raw === null ? NaN : Number(raw);
    cached = isValid(parsed) ? parsed : DEFAULT_INTERVAL;
  } catch {
    cached = DEFAULT_INTERVAL;
  }
  loaded = true;
}

export function subscribeInterval(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === INTERVAL_KEY) {
      loaded = false;
      onStoreChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function getIntervalSnapshot(): RefreshInterval {
  if (!loaded) load();
  return cached;
}

export function getIntervalServerSnapshot(): RefreshInterval {
  return DEFAULT_INTERVAL;
}

export function setRefreshInterval(value: RefreshInterval) {
  cached = value;
  loaded = true;
  try {
    localStorage.setItem(INTERVAL_KEY, String(value));
  } catch {
    // Storage unavailable — the choice still applies for this session.
  }
  listeners.forEach((l) => l());
}
