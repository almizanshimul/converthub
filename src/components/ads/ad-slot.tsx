/**
 * Provider-agnostic ad slot (section 29). Renders nothing until a real
 * network (AdSense, Ad Manager, ...) is wired up — kept as a stable
 * layout placeholder so ad integration doesn't require template changes.
 */
export function AdSlot({ slot }: { slot: string }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;

  return (
    <div data-ad-slot={slot} className="flex min-h-[90px] items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
      Ad slot: {slot}
    </div>
  );
}
