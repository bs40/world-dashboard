"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
  THEME_PREFS,
} from "@/lib/prefs";

const ICONS = { dark: Moon, light: Sun, system: Monitor } as const;
const LABELS = { dark: "Dark theme", light: "Light theme", system: "System theme" } as const;

/** Cycles dark → light → system. Preference persists in localStorage. */
export function ThemeToggle() {
  const pref = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const Icon = ICONS[pref];
  const next = THEME_PREFS[(THEME_PREFS.indexOf(pref) + 1) % THEME_PREFS.length];

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`${LABELS[pref]} — switch to ${LABELS[next].toLowerCase()}`}
      title={LABELS[pref]}
      className="rounded p-2 text-steel transition-colors hover:text-frost"
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
