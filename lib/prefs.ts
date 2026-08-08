/**
 * Sticky user preferences backed by localStorage.
 *
 * Exposed through useSyncExternalStore rather than an effect so the server
 * render and the first client render agree, and so a change made in one
 * component is seen immediately by every other subscriber (and by other tabs).
 */

const INTERVAL_KEY = "world-dashboard:refresh-interval";
const THEME_KEY = "world-dashboard:theme";

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

// ── live TV channel preference ───────────────────────────────

const TV_KEY = "world-dashboard:live-tv";
const DEFAULT_TV = "dw";

let tvCached = DEFAULT_TV;
let tvLoaded = false;
const tvListeners = new Set<() => void>();

export function subscribeTvChannel(onStoreChange: () => void) {
  tvListeners.add(onStoreChange);
  return () => {
    tvListeners.delete(onStoreChange);
  };
}

export function getTvChannelSnapshot(): string {
  if (!tvLoaded) {
    try {
      tvCached = localStorage.getItem(TV_KEY) ?? DEFAULT_TV;
    } catch {
      tvCached = DEFAULT_TV;
    }
    tvLoaded = true;
  }
  return tvCached;
}

export const getTvChannelServerSnapshot = () => DEFAULT_TV;

export function setTvChannel(id: string) {
  tvCached = id;
  tvLoaded = true;
  try {
    localStorage.setItem(TV_KEY, id);
  } catch {
    // Storage unavailable — applies for this session only.
  }
  tvListeners.forEach((l) => l());
}

// ── theme preference (dark | light | system) ─────────────────
// The resolved theme is applied as data-theme on <html>; a pre-hydration
// script in layout.tsx does the same before React loads to avoid a flash.

export type ThemePref = "dark" | "light" | "system";
export const THEME_PREFS: ThemePref[] = ["dark", "light", "system"];
const DEFAULT_THEME: ThemePref = "dark";

let themeCached: ThemePref = DEFAULT_THEME;
let themeLoaded = false;
let systemListenerArmed = false;
const themeListeners = new Set<() => void>();

function isTheme(value: string | null): value is ThemePref {
  return value === "dark" || value === "light" || value === "system";
}

function loadTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    themeCached = isTheme(raw) ? raw : DEFAULT_THEME;
  } catch {
    themeCached = DEFAULT_THEME;
  }
  themeLoaded = true;
}

export function resolveTheme(pref: ThemePref): "dark" | "light" {
  if (pref !== "system") return pref;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme() {
  document.documentElement.dataset.theme = resolveTheme(themeCached);
}

export function subscribeTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);
  if (!systemListenerArmed) {
    systemListenerArmed = true;
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", () => {
        if (themeCached === "system") applyTheme();
      });
  }
  return () => {
    themeListeners.delete(onStoreChange);
  };
}

export function getThemeSnapshot(): ThemePref {
  if (!themeLoaded) loadTheme();
  return themeCached;
}

export const getThemeServerSnapshot = (): ThemePref => DEFAULT_THEME;

export function setTheme(value: ThemePref) {
  themeCached = value;
  themeLoaded = true;
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    // Storage unavailable — applies for this session only.
  }
  applyTheme();
  themeListeners.forEach((l) => l());
}
