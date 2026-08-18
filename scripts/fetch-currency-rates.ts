/**
 * Manual/CLI trigger for a currency-rates refresh (upserts Currency +
 * ExchangeRate rows). The site no longer depends on this running on a
 * schedule — src/lib/currency-rates.ts's ensureFreshRates() refreshes
 * automatically the first time the currency page is requested each day.
 * Use this script for an out-of-band refresh, e.g. right after deploying,
 * or to force an update mid-day.
 *
 * Uses the keyed v6 endpoint when EXCHANGERATE_API_KEY is set in .env
 * (falls back to their free keyless endpoint otherwise — fewer guarantees,
 * but no signup needed). Either way it's an aggregator (pulls from
 * multiple banks/providers), not a single central bank, so it's cited on
 * the currency page as exactly that rather than overclaimed as "official
 * central bank data."
 *
 * Safe to re-run any time: every currency/rate is upserted, and any row
 * with isManualOverride=true is left untouched instead of being clobbered
 * by the next fetch.
 *
 *   npx tsx scripts/fetch-currency-rates.ts
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { fetchAndStoreRates } from "../src/lib/currency-rates";

async function main() {
  const stats = await fetchAndStoreRates();
  console.log(`Endpoint: ${stats.endpoint}`);
  console.log(`Currencies/rates: ${stats.created} created, ${stats.updated} updated, ${stats.preserved} manual overrides preserved, ${stats.skipped} skipped (no ISO 4217 match).`);
  console.log(`Provider's rates as of: ${stats.providerTimestamp}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
