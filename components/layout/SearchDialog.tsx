"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Database, FileText, Globe2, Newspaper, Search, Target, X } from "lucide-react";
import { searchIndex } from "@/data/search";
import { cn } from "@/lib/utils";
import type { SearchItem } from "@/types";

const KIND_ICON: Record<SearchItem["kind"], typeof Globe2> = {
  country: Globe2,
  region: Compass,
  topic: Target,
  story: Newspaper,
  report: FileText,
  dataset: Database,
};

interface SearchDialogContextValue {
  open: () => void;
}

const SearchDialogContext = createContext<SearchDialogContextValue | null>(null);

export function useSearchDialog() {
  const ctx = useContext(SearchDialogContext);
  if (!ctx) throw new Error("useSearchDialog must be used within SearchDialogProvider");
  return ctx;
}

export function SearchDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setHighlighted(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 8);
    return searchIndex
      .filter((item) => item.title.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query]);

  const go = useCallback(
    (item: SearchItem) => {
      close();
      router.push(item.href);
    },
    [close, router]
  );

  return (
    <SearchDialogContext.Provider value={{ open }}>
      {children}
      {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.14 }}
              role="dialog"
              aria-modal="true"
              aria-label="Universal search"
              className="panel w-full max-w-xl border-edge shadow-glow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-edge-soft px-4 py-3">
                <Search className="h-4 w-4 text-cyan" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHighlighted(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlighted((h) => Math.min(h + 1, results.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlighted((h) => Math.max(h - 1, 0));
                    } else if (e.key === "Enter" && results[highlighted]) {
                      go(results[highlighted]);
                    }
                  }}
                  placeholder="Search countries, regions, topics, stories, reports, datasets…"
                  className="flex-1 bg-transparent text-sm text-frost outline-none placeholder:text-steel-dim"
                  aria-label="Search"
                />
                <kbd className="label-caps-sm hidden rounded border border-edge px-1.5 py-0.5 text-steel-dim sm:block">
                  Esc
                </kbd>
                <button aria-label="Close search" onClick={close} className="p-1 text-steel hover:text-frost sm:hidden">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <ul role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-steel">No matches for “{query}”.</li>
                )}
                {results.map((item, idx) => {
                  const Icon = KIND_ICON[item.kind];
                  return (
                    <li key={item.id} role="option" aria-selected={idx === highlighted}>
                      <button
                        onClick={() => go(item)}
                        onMouseEnter={() => setHighlighted(idx)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left transition-colors",
                          idx === highlighted ? "bg-cyan/10 text-frost" : "text-steel hover:text-frost"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-cyan/70" aria-hidden />
                        <span className="flex-1 truncate text-sm">{item.title}</span>
                        {item.meta && <span className="label-caps-sm shrink-0 text-steel-dim">{item.meta}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
    </SearchDialogContext.Provider>
  );
}
