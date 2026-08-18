// Cookie consent state — plain localStorage + a same-tab CustomEvent, no
// external CMP. Two toggleable categories; "necessary" (first-party
// analytics with no cookies, the site itself) is always on and never asked
// about, since it doesn't set any cookies in the first place.
export interface ConsentState {
  analytics: boolean;
  advertising: boolean;
}

export const DEFAULT_CONSENT: ConsentState = { analytics: false, advertising: false };

const STORAGE_KEY = "convert-hub-consent";
const CONSENT_EVENT = "convert-hub-consent-change";

// useSyncExternalStore requires getSnapshot to return the same reference
// when nothing has changed - JSON.parse-ing on every call would build a new
// object each time and send React into an infinite re-render loop ("The
// result of getSnapshot should be cached", "Maximum update depth exceeded").
// Caching against the raw string keeps the reference stable until the
// underlying value actually changes.
let cachedRaw: string | null = null;
let cachedSnapshot: ConsentState | null = null;

export function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  if (!raw) {
    cachedSnapshot = null;
    return cachedSnapshot;
  }
  try {
    const parsed = JSON.parse(raw);
    cachedSnapshot = { analytics: Boolean(parsed.analytics), advertising: Boolean(parsed.advertising) };
  } catch {
    cachedSnapshot = null;
  }
  return cachedSnapshot;
}

export function setStoredConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
}

export function onConsentChange(callback: (state: ConsentState) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => callback((e as CustomEvent<ConsentState>).detail);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

// For useSyncExternalStore — the React-recommended way to read a value that
// lives outside React and can legitimately differ between server and client,
// without the extra render pass (and lint warning) a useState+useEffect pair
// would cause. Server snapshot is `null` ("no decision yet"); the client
// re-syncs to the real value right after hydration with no mismatch error.
export function subscribeToConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

export function getConsentSnapshot(): ConsentState | null {
  return getStoredConsent();
}

export function getServerConsentSnapshot(): ConsentState | null {
  return null;
}

// Fired by the footer's "Cookie Settings" link to reopen the banner/manager
// without a page reload — the banner listens for this itself.
export const REOPEN_CONSENT_EVENT = "convert-hub-consent-reopen";

export function reopenConsentManager() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REOPEN_CONSENT_EVENT));
}
