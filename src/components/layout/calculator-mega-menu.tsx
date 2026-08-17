"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getCalculatorIcon } from "@/lib/icons";
import type { Locale } from "@/lib/i18n/config";

export interface MegaMenuCalculator {
  slug: string;
  name: string;
  description: string | null;
  category: string;
}

export function CalculatorMegaMenu({
  locale,
  label,
  viewAllLabel,
  calculators,
}: {
  locale: Locale;
  label: string;
  viewAllLabel: string;
  calculators: MegaMenuCalculator[];
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

  if (calculators.length === 0) {
    return (
      <Link href={`/${locale}/calculator`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
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
        <div className="absolute inset-s-0 top-full z-40 mt-3 w-[min(90vw,640px)] rounded-lg border border-border bg-card p-4 shadow-lg">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {calculators.map((calc) => {
              const Icon = getCalculatorIcon(calc.category);
              return (
                <Link
                  key={calc.slug}
                  href={`/${locale}/calculator/${calc.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-primary/10"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{calc.name}</span>
                    {calc.description && <span className="line-clamp-2 block text-xs text-muted-foreground">{calc.description}</span>}
                  </span>
                </Link>
              );
            })}
          </div>
          <Link
            href={`/${locale}/calculator`}
            onClick={() => setOpen(false)}
            className="mt-3 block border-t border-border pt-3 text-center text-sm font-medium text-primary hover:underline"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
