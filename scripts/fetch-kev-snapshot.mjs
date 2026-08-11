/**
 * Take a copy of the CISA KEV catalogue for the published site to serve.
 *
 * The app cannot fetch that catalogue from a browser. The endpoint returns
 * 200 but sends no Access-Control-Allow-Origin header, so every browser
 * blocks the request before it is made, on any origin. A "live feed" that
 * can never load is not a feature.
 *
 * This runs during the deploy, where CORS does not apply, and writes the
 * records into public/ so the app can read them from its own origin. The
 * result is still a snapshot and the interface still says so, with the date
 * it was taken. It is refreshed on a schedule rather than pretending to be
 * live.
 *
 *   node scripts/fetch-kev-snapshot.mjs
 *
 * Failure is not fatal. A deploy should not be blocked because CISA is
 * having a bad afternoon; the app falls back to the sample compiled into
 * the bundle and labels it accordingly.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FEED_URL =
  'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const TIMEOUT_MS = 30_000;

// Only what the panel renders. Shipping the whole catalogue would add
// megabytes to a page that shows three records.
const KEEP = 25;
const FIELDS = [
  'cveID',
  'vendorProject',
  'product',
  'vulnerabilityName',
  'dateAdded',
  'shortDescription',
  'requiredAction',
  'dueDate',
  'knownRansomwareCampaignUse',
  'cwes',
  'notes'
];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'public', 'kev-snapshot.json');

async function main() {
  const response = await fetch(FEED_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`HTTP ${response.status} from CISA`);

  const catalogue = await response.json();
  const all = catalogue?.vulnerabilities;
  if (!Array.isArray(all) || all.length === 0) {
    throw new Error('the catalogue held no vulnerabilities array');
  }

  const newest = [...all]
    .sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)))
    .slice(0, KEEP)
    .map((entry) => Object.fromEntries(FIELDS.filter((f) => f in entry).map((f) => [f, entry[f]])));

  const snapshot = {
    // Read back by the app and shown to the reader, so it is never
    // mistaken for live data.
    retrievedAt: new Date().toISOString(),
    catalogueSize: all.length,
    source: FEED_URL,
    vulnerabilities: newest
  };

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  console.log(
    `Wrote ${newest.length} of ${all.length} records to public/kev-snapshot.json`
  );
}

main().catch((error) => {
  console.warn(`Could not take a KEV snapshot: ${error.message}`);
  console.warn('The app will show its built-in sample and say that is what it is.');
});
