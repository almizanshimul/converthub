import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

const DAYS = 30;
const EVENT_TYPES = ["converter_use", "calculator_use", "search", "language_select"] as const;

// A plain helper (not a component/hook) so the `new Date()` call doesn't trip
// react-hooks/purity, which flags impure calls inside components unconditionally
// — even after `connection()` has already opted the render into request-time
// evaluation, which is the documented, correct way to do this in Next.js.
async function getSinceDate() {
  await connection();
  return new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);
}

export default async function AdminAnalyticsPage() {
  const since = await getSinceDate();

  const [eventCounts, topConverters, calculatorUseEvents, searchEvents, languageEvents, totalEvents] = await Promise.all([
    Promise.all(EVENT_TYPES.map((type) => prisma.analyticsEvent.count({ where: { eventType: type, createdAt: { gte: since } } }))),
    prisma.converter.findMany({ where: { viewCount: { gt: 0 } }, orderBy: { viewCount: "desc" }, take: 10, select: { name: true, slug: true, viewCount: true } }),
    prisma.analyticsEvent.findMany({ where: { eventType: "calculator_use", createdAt: { gte: since } }, select: { entityId: true } }),
    prisma.analyticsEvent.findMany({
      where: { eventType: "search", createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { metadata: true, createdAt: true },
    }),
    prisma.analyticsEvent.findMany({ where: { eventType: "language_select", createdAt: { gte: since } }, select: { metadata: true } }),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
  ]);

  const calcCounts = new Map<string, number>();
  for (const e of calculatorUseEvents) {
    if (!e.entityId) continue;
    calcCounts.set(e.entityId, (calcCounts.get(e.entityId) ?? 0) + 1);
  }
  const topCalcIds = [...calcCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const calcNames = await prisma.calculator.findMany({
    where: { id: { in: topCalcIds.map(([id]) => id) } },
    select: { id: true, name: true },
  });
  const calcNameById = new Map(calcNames.map((c) => [c.id, c.name]));

  const langCounts = new Map<string, number>();
  for (const e of languageEvents) {
    const to = (e.metadata as { to?: string } | null)?.to;
    if (to) langCounts.set(to, (langCounts.get(to) ?? 0) + 1);
  }
  const topLanguages = [...langCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Last {DAYS} days · {totalEvents} events logged · first-party, no cookies
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {EVENT_TYPES.map((type, i) => (
          <Card key={type} className="p-4">
            <p className="text-xs text-muted-foreground">{type}</p>
            <p className="mt-1 text-2xl font-semibold">{eventCounts[i]}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold">Top converters (all-time views)</h2>
          <ul className="mt-3 space-y-1.5">
            {topConverters.map((c) => (
              <li key={c.slug} className="flex justify-between gap-4 text-sm">
                <span className="truncate">{c.name}</span>
                <span className="shrink-0 text-muted-foreground">{c.viewCount}</span>
              </li>
            ))}
            {topConverters.length === 0 && <li className="text-sm text-muted-foreground">No views recorded yet.</li>}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold">Top calculators ({DAYS}d)</h2>
          <ul className="mt-3 space-y-1.5">
            {topCalcIds.map(([id, count]) => (
              <li key={id} className="flex justify-between gap-4 text-sm">
                <span className="truncate">{calcNameById.get(id) ?? id}</span>
                <span className="shrink-0 text-muted-foreground">{count}</span>
              </li>
            ))}
            {topCalcIds.length === 0 && <li className="text-sm text-muted-foreground">No usage recorded yet.</li>}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold">Language switches ({DAYS}d)</h2>
          <ul className="mt-3 space-y-1.5">
            {topLanguages.map(([lang, count]) => (
              <li key={lang} className="flex justify-between gap-4 text-sm">
                <span>{lang}</span>
                <span className="shrink-0 text-muted-foreground">{count}</span>
              </li>
            ))}
            {topLanguages.length === 0 && <li className="text-sm text-muted-foreground">No switches recorded yet.</li>}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold">Recent searches</h2>
          <ul className="mt-3 space-y-1.5">
            {searchEvents.map((e, i) => {
              const meta = e.metadata as { q?: string; resultCount?: number } | null;
              return (
                <li key={i} className="flex justify-between gap-4 text-sm">
                  <span className="truncate">{meta?.q}</span>
                  <span className="shrink-0 text-muted-foreground">{meta?.resultCount ?? 0} results</span>
                </li>
              );
            })}
            {searchEvents.length === 0 && <li className="text-sm text-muted-foreground">No searches recorded yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
