"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { SavedItem } from "@/types";

const STORAGE_KEY = "world-dashboard:saved";
const EMPTY: SavedItem[] = [];

// Module-level store backed by localStorage. Consumed via useSyncExternalStore
// so SSR renders the empty state and the client re-renders once hydrated.
let cache: SavedItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as SavedItem[]) : EMPTY;
  } catch {
    cache = EMPTY; // corrupt or unavailable storage — start clean
  }
  loaded = true;
}

function emit() {
  listeners.forEach((l) => l());
}

function write(next: SavedItem[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable; state stays in-memory.
  }
  emit();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
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

function getSnapshot(): SavedItem[] {
  if (!loaded) load();
  return cache;
}

const getServerSnapshot = () => EMPTY;
const getHydrated = () => true;
const getServerHydrated = () => false;

interface SavedContextValue {
  items: SavedItem[];
  isSaved: (id: string) => boolean;
  toggle: (item: Omit<SavedItem, "savedAt">) => void;
  remove: (id: string) => void;
  hydrated: boolean;
}

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribe, getHydrated, getServerHydrated);

  const isSaved = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback(
    (item: Omit<SavedItem, "savedAt">) => {
      write(
        items.some((i) => i.id === item.id)
          ? items.filter((i) => i.id !== item.id)
          : [{ ...item, savedAt: Date.now() }, ...items]
      );
    },
    [items]
  );

  const remove = useCallback(
    (id: string) => write(items.filter((i) => i.id !== id)),
    [items]
  );

  return (
    <SavedContext.Provider value={{ items, isSaved, toggle, remove, hydrated }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within SavedProvider");
  return ctx;
}
