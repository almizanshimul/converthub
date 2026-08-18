"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRightLeft, LandPlot, Globe, Calculator, Hash, Coins } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

interface SearchResult {
  type: "converter" | "calculator" | "category" | "country" | "land-unit" | "currency";
  label: string;
  sublabel?: string;
  href: string;
}

const typeIcon: Record<SearchResult["type"], typeof Search> = {
  converter: ArrowRightLeft,
  calculator: Hash,
  category: Calculator,
  country: Globe,
  "land-unit": LandPlot,
  currency: Coins,
};

export function SearchBox({
  locale,
  placeholder,
  noResultsLabel,
  clearLabel,
}: {
  locale: Locale;
  placeholder: string;
  noResultsLabel: string;
  clearLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clearing `results` when the query goes short happens in the input's
    // onChange below (a normal event handler) instead of here — setting
    // state synchronously in an effect body triggers an extra render pass.
    if (query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, locale]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setOpen(true);
            if (value.trim().length < 2) setResults(null);
          }}
          onFocus={() => setOpen(true)}
          type="search"
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-8 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
        />
        {query && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {results === null ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">{noResultsLabel}</p>
          ) : (
            <ul className="py-1">
              {results.map((r, i) => {
                const Icon = typeIcon[r.type];
                return (
                  <li key={`${r.type}-${r.href}-${i}`}>
                    <Link
                      href={r.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="flex-1 truncate">{r.label}</span>
                      {r.sublabel && <span className="shrink-0 truncate text-xs text-muted-foreground">{r.sublabel}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
