import { AdSenseUnit } from "./adsense-unit";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

/**
 * Provider-agnostic ad slot (section 29). Renders nothing until
 * NEXT_PUBLIC_ADS_ENABLED is "true" — kept as a stable layout placeholder so
 * ad integration doesn't require template changes.
 *
 * With a real NEXT_PUBLIC_ADSENSE_CLIENT_ID configured, renders an actual
 * AdSense auto-relaxed unit (works without a per-slot numeric ad-unit ID from
 * the AdSense dashboard) instead of the dashed placeholder. The loader script
 * itself only gets injected once the visitor has granted advertising consent
 * (see src/components/consent/tracking-scripts.tsx) — this markup being
 * present without that script loaded is inert.
 */
export function AdSlot({ slot }: { slot: string }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;

  if (ADSENSE_CLIENT_ID) {
    return <AdSenseUnit clientId={ADSENSE_CLIENT_ID} slot={slot} />;
  }

  return (
    <div data-ad-slot={slot} className="flex min-h-[90px] items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
      Ad slot: {slot}
    </div>
  );
}
