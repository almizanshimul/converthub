"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  DEFAULT_CONSENT,
  setStoredConsent,
  subscribeToConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  REOPEN_CONSENT_EVENT,
  type ConsentState,
} from "@/lib/consent";
import type { Locale } from "@/lib/i18n/config";
import type { dictionary } from "@/lib/i18n/dictionary";

interface Labels {
  message: string;
  acceptAll: string;
  rejectNonEssential: string;
  customize: string;
  savePreferences: string;
  necessaryTitle: string;
  necessaryDescription: string;
  analyticsTitle: string;
  analyticsDescription: string;
  advertisingTitle: string;
  advertisingDescription: string;
  privacyPolicyLink: string;
}

export function CookieConsentBanner({ locale, dict }: { locale: Locale; dict: (typeof dictionary)[Locale] }) {
  // null = no decision recorded yet (server always sees this — see
  // getServerConsentSnapshot — so the banner shows by default and hides
  // itself right after hydration if the client turns out to already have one).
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const [forceOpen, setForceOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    function reopen() {
      setDraft(consent ?? DEFAULT_CONSENT);
      setExpanded(true);
      setForceOpen(true);
    }
    window.addEventListener(REOPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_CONSENT_EVENT, reopen);
  }, [consent]);

  if (consent !== null && !forceOpen) return null;

  function save(state: ConsentState) {
    setStoredConsent(state);
    setForceOpen(false);
    setExpanded(false);
  }

  const labels: Labels = dict.consent;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted-foreground">
          {labels.message}{" "}
          <Link href={`/${locale}/privacy`} className="font-medium text-primary hover:underline">
            {labels.privacyPolicyLink}
          </Link>
        </p>

        {expanded && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm opacity-70">
              <input type="checkbox" checked disabled className="mt-0.5" />
              <span>
                <span className="block font-medium text-foreground">{labels.necessaryTitle}</span>
                <span className="block text-xs text-muted-foreground">{labels.necessaryDescription}</span>
              </span>
            </label>
            <label className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
              <input
                type="checkbox"
                checked={draft.analytics}
                onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))}
                className="mt-0.5"
              />
              <span>
                <span className="block font-medium text-foreground">{labels.analyticsTitle}</span>
                <span className="block text-xs text-muted-foreground">{labels.analyticsDescription}</span>
              </span>
            </label>
            <label className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
              <input
                type="checkbox"
                checked={draft.advertising}
                onChange={(e) => setDraft((d) => ({ ...d, advertising: e.target.checked }))}
                className="mt-0.5"
              />
              <span>
                <span className="block font-medium text-foreground">{labels.advertisingTitle}</span>
                <span className="block text-xs text-muted-foreground">{labels.advertisingDescription}</span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => save({ analytics: true, advertising: true })}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {labels.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: false, advertising: false })}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-primary/10"
          >
            {labels.rejectNonEssential}
          </button>
          {expanded ? (
            <button
              type="button"
              onClick={() => save(draft)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-primary/10"
            >
              {labels.savePreferences}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {labels.customize}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
