"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export interface MegaMenuLandGroup {
  country: { slug: string; name: string };
  regions: { slug: string; name: string }[];
}

export function LandMegaMenu({
  locale,
  label,
  viewAllLabel,
  groups,
}: {
  locale: Locale;
  label: string;
  viewAllLabel: string;
  groups: MegaMenuLandGroup[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (groups.length === 0) {
    return (
      <Link href={`/${locale}/land`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
        {label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
          open ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute inset-s-0 top-full z-40 mt-3 w-[min(90vw,560px)] rounded-lg border border-border bg-card p-4 shadow-lg">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.country.slug}>
                <Link
                  href={`/${locale}/land/${group.country.slug}`}
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary"
                >
                  {group.country.name}
                </Link>
                <ul className="mt-2 space-y-0.5">
                  {group.regions.map((region) => (
                    <li key={region.slug}>
                      <Link
                        href={`/${locale}/land/${group.country.slug}/${region.slug}`}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-2 py-1 text-sm text-foreground transition-colors hover:bg-primary/10"
                      >
                        {region.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link
            href={`/${locale}/land`}
            onClick={() => setOpen(false)}
            className="mt-4 block border-t border-border pt-3 text-center text-sm font-medium text-primary hover:underline"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
