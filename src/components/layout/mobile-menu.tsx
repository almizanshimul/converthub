"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

export function MobileMenu({ children, toggleLabel }: { children: ReactNode; toggleLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={toggleLabel}
        aria-expanded={open}
        className="rounded-md p-2 text-foreground hover:bg-primary/10"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        // Layouts persist across client-side navigation in the App Router,
        // so without this the panel would stay open after tapping a link.
        // Closing on any bubbled click (nav links, language switcher) is
        // simpler than threading an onClick through every child.
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-x-0 top-full z-40 flex flex-col gap-4 border-b border-border bg-card px-4 py-4 shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
}
