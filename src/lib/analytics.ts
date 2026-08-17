"use server";

import { after } from "next/server";
import { prisma } from "@/lib/prisma";

// First-party event log (see the AnalyticsEvent model) — no third-party
// script, no cookie, nothing that needs its own consent banner. Wrapped in
// `after()` so a slow or failed write never adds latency to, or breaks, the
// page/action it's attached to; also keeps callers from being forced into
// dynamic rendering just because they log an event on render.
export async function logEvent(
  eventType: string,
  options?: { entityType?: string; entityId?: string; metadata?: Record<string, unknown> },
) {
  after(async () => {
    try {
      await prisma.analyticsEvent.create({
        data: {
          eventType,
          entityType: options?.entityType,
          entityId: options?.entityId,
          // Prisma's generated JSON input type doesn't structurally match a
          // plain Record<string, unknown> — this is always plain serializable
          // JSON at runtime either way (see the identical cast in auto-translate.ts).
          metadata: options?.metadata as unknown as object | undefined,
        },
      });
    } catch (err) {
      console.error("analytics logEvent failed:", err);
    }
  });
}

export async function incrementConverterView(converterId: string) {
  after(async () => {
    try {
      await prisma.converter.update({ where: { id: converterId }, data: { viewCount: { increment: 1 } } });
    } catch (err) {
      console.error("incrementConverterView failed:", err);
    }
  });
}
