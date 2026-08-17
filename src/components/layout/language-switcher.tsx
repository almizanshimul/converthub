"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { getFlagSrc } from "@/lib/flags";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");
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

  return (
    <div ref={ref} className="relative text-sm">
      <button
        type="button"
        // Stops the click from bubbling to MobileMenu's panel-level
        // close-on-click handler — otherwise opening this dropdown inside
        // the mobile panel would immediately close the panel underneath it.
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-medium transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary ${
          open ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground"
        }`}
      >
        <img src={getFlagSrc(localeMeta[locale].flagCountry)} alt="" className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover" />
        {localeMeta[locale].nativeLabel}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute inset-e-0 top-full z-40 mt-1 min-w-36 overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg"
        >
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}/${rest}`}
              role="option"
              aria-selected={l === locale}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between gap-3 px-3 py-2 transition-colors ${
                l === locale ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <span className="flex items-center gap-2">
                <img src={getFlagSrc(localeMeta[l].flagCountry)} alt="" className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover" />
                {localeMeta[l].nativeLabel}
              </span>
              {l === locale && <Check className="h-3.5 w-3.5" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
