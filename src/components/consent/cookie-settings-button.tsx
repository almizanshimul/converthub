"use client";

import { reopenConsentManager } from "@/lib/consent";

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={reopenConsentManager}
      className="text-sm text-muted-foreground hover:text-foreground"
    >
      {label}
    </button>
  );
}
