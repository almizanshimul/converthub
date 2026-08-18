"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import {
  subscribeToConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  type ConsentState,
} from "@/lib/consent";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function applyGoogleConsent(state: ConsentState) {
  window.gtag?.("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.advertising ? "granted" : "denied",
    ad_user_data: state.advertising ? "granted" : "denied",
    ad_personalization: state.advertising ? "granted" : "denied",
  });
}

function applyClarityConsent(state: ConsentState) {
  window.clarity?.("consent", state.analytics);
}

// Renders nothing unless the corresponding env var is actually set — same
// "off until a real account is wired up" rule as ad-slot.tsx. Google
// Consent Mode v2 defaults to fully denied before the visitor has made a
// choice (Google's own recommended default), then updates in place when
// the consent banner records a decision, so GTM/GA4 never fire non-essential
// pings before consent. Clarity has its own separate consent call.
export function TrackingScripts() {
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);

  useEffect(() => {
    if (!consent) return;
    applyGoogleConsent(consent);
    applyClarityConsent(consent);
  }, [consent]);

  return (
    <>
      {ADSENSE_CLIENT_ID && consent?.advertising && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      {(GA4_ID || GTM_ID) && (
        <>
          {/* beforeInteractive is reserved for the true root layout (app/layout.tsx) in
              the App Router — using it here wouldn't be honored. Declaring this ahead of
              the GA4/GTM loaders below is enough: Next preserves script order within a
              strategy, so consent defaults are still set before either tag can fire. */}
          <Script id="consent-mode-default" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
              window.gtag = gtag;`}
          </Script>
          {GA4_ID && (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
              <Script id="ga4-init" strategy="afterInteractive">
                {`window.gtag('js', new Date()); window.gtag('config', '${GA4_ID}');`}
              </Script>
            </>
          )}
          {GTM_ID && (
            <Script id="gtm-init" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
          )}
        </>
      )}
      {CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
            window.clarity('consent', false);`}
        </Script>
      )}
    </>
  );
}
