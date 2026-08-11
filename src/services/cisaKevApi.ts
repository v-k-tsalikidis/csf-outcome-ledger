import { CisaKevEntry, ThreatIndex, ThreatFeedSource } from '../types/ledger';

const CISA_KEV_FEED_URL =
  'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

const FEED_TIMEOUT_MS = 8000;
const ENTRIES_SHOWN = 3;

/**
 * Three real records from the CISA catalogue, kept verbatim so the panel
 * has something truthful to show when the feed cannot be reached — the
 * browser blocking it on CORS, or no network at all.
 *
 * These are a dated snapshot, not live data, and the UI says so. They are
 * never presented as a current feed. Refresh them by copying records from
 * the catalogue rather than by writing plausible-looking ones.
 */
const OFFLINE_SAMPLE: CisaKevEntry[] = [
  {
    cveID: 'CVE-2026-8037',
    vendorProject: 'Progress',
    product: 'LoadMaster',
    vulnerabilityName: 'Progress LoadMaster Command Injection Vulnerability',
    dateAdded: '2026-08-07',
    shortDescription:
      'Progress LoadMaster contains a command injection vulnerability that allows an un-authenticated attacker to execute arbitrary commands on the LoadMaster appliance by exploiting unsanitized input in multiple command endpoints.',
    requiredAction:
      'Apply mitigations in accordance with vendor instructions, or discontinue use of the product if mitigations are unavailable.',
    dueDate: '2026-08-10',
    knownRansomwareCampaignUse: 'Unknown',
    cwes: ['CWE-77']
  },
  {
    cveID: 'CVE-2026-63077',
    vendorProject: 'JetBrains',
    product: 'TeamCity',
    vulnerabilityName:
      'JetBrains TeamCity Deserialization of Untrusted Data Vulnerability',
    dateAdded: '2026-08-05',
    shortDescription:
      'JetBrains TeamCity contains a deserialization of untrusted data vulnerability that could allow unauthenticated remote code execution via the agent polling protocol.',
    requiredAction:
      'Apply mitigations in accordance with vendor instructions, or discontinue use of the product if mitigations are unavailable.',
    dueDate: '2026-08-08',
    knownRansomwareCampaignUse: 'Unknown',
    cwes: ['CWE-502']
  },
  {
    cveID: 'CVE-2026-18556',
    vendorProject: 'N-able',
    product: 'N-central',
    vulnerabilityName:
      'N-able N-central Authentication Bypass Using an Alternate Path or Channel Vulnerability',
    dateAdded: '2026-08-04',
    shortDescription:
      'N-able N-central contains an authentication bypass using an alternate path or channel that allows for authentication bypass.',
    requiredAction:
      'Apply mitigations in accordance with vendor instructions, or discontinue use of the product if mitigations are unavailable.',
    dueDate: '2026-08-07',
    knownRansomwareCampaignUse: 'Unknown',
    cwes: ['CWE-288']
  }
];

/** The snapshot date of OFFLINE_SAMPLE, shown so nobody mistakes it for live data. */
export const OFFLINE_SAMPLE_DATE = '2026-08-07';

/** Keep only the fields CISA publishes, and drop anything malformed. */
function normalise(raw: unknown): CisaKevEntry | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const v = raw as Record<string, unknown>;
  const required = [
    'cveID',
    'vendorProject',
    'product',
    'vulnerabilityName',
    'dateAdded',
    'shortDescription',
    'requiredAction',
    'dueDate',
    'knownRansomwareCampaignUse'
  ] as const;
  for (const key of required) {
    if (typeof v[key] !== 'string') return null;
  }
  return {
    cveID: v.cveID as string,
    vendorProject: v.vendorProject as string,
    product: v.product as string,
    vulnerabilityName: v.vulnerabilityName as string,
    dateAdded: v.dateAdded as string,
    shortDescription: v.shortDescription as string,
    requiredAction: v.requiredAction as string,
    dueDate: v.dueDate as string,
    knownRansomwareCampaignUse: v.knownRansomwareCampaignUse as string,
    cwes: Array.isArray(v.cwes) ? (v.cwes as string[]) : undefined,
    notes: typeof v.notes === 'string' ? v.notes : undefined
  };
}

/**
 * Counts that can be justified from the entries themselves.
 *
 * `pastDue` compares the CISA remediation due date against today. It says
 * that the deadline has passed, not that any particular organisation is
 * non-compliant, which the catalogue cannot know.
 */
export function summarise(
  entries: CisaKevEntry[],
  source: ThreatFeedSource,
  catalogueSize: number | null,
  retrievedAt: string | null
): ThreatIndex {
  const today = new Date().toISOString().slice(0, 10);
  return {
    source,
    ransomwareLinked: entries.filter(
      (e) => e.knownRansomwareCampaignUse.toLowerCase() === 'known'
    ).length,
    pastDue: entries.filter((e) => e.dueDate && e.dueDate < today).length,
    shown: entries.length,
    catalogueSize,
    retrievedAt
  };
}

/** Pick the newest usable records out of a catalogue array. */
function topEntries(catalogue: unknown[]): CisaKevEntry[] {
  return catalogue
    .map(normalise)
    .filter((e): e is CisaKevEntry => e !== null)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, ENTRIES_SHOWN);
}

async function getJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as unknown;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Read the copy the deploy took, which lives beside the bundle.
 *
 * BASE_URL rather than a leading slash: the app is published under
 * /CSF-Outcome-Ledger/ on GitHub Pages and at the root elsewhere, and a
 * hardcoded path is wrong in one of those two places.
 */
async function fetchBuildSnapshot(): Promise<{
  entries: CisaKevEntry[];
  index: ThreatIndex;
} | null> {
  try {
    const data = await getJson(`${import.meta.env.BASE_URL}kev-snapshot.json`);
    if (typeof data !== 'object' || data === null) return null;
    const snapshot = data as Record<string, unknown>;
    const entries = topEntries((snapshot.vulnerabilities as unknown[]) ?? []);
    if (entries.length === 0) return null;
    return {
      entries,
      index: summarise(
        entries,
        'build-snapshot',
        typeof snapshot.catalogueSize === 'number' ? snapshot.catalogueSize : null,
        typeof snapshot.retrievedAt === 'string' ? snapshot.retrievedAt : null
      )
    };
  } catch {
    return null;
  }
}

/**
 * Try for the freshest records that can honestly be obtained, and say which
 * of the three it managed. Nothing here ever presents a snapshot as live.
 */
export async function fetchCisaKevThreatFeed(): Promise<{
  entries: CisaKevEntry[];
  index: ThreatIndex;
}> {
  try {
    const data = await getJson(CISA_KEV_FEED_URL);
    const catalogue =
      typeof data === 'object' && data !== null
        ? (((data as Record<string, unknown>).vulnerabilities as unknown[]) ?? [])
        : [];

    const entries = topEntries(catalogue);
    if (entries.length === 0) throw new Error('feed contained no usable records');

    return {
      entries,
      index: summarise(entries, 'live', catalogue.length, new Date().toISOString())
    };
  } catch (error) {
    // Expected in a browser: the CISA endpoint sends no CORS header, so the
    // request never leaves. The deploy takes its own copy for exactly this.
    console.warn('CISA KEV feed not reachable from the browser:', error);
  }

  const snapshot = await fetchBuildSnapshot();
  if (snapshot) return snapshot;

  // Nothing to read anywhere. The panel says so, with the date.
  return {
    entries: OFFLINE_SAMPLE,
    index: summarise(OFFLINE_SAMPLE, 'offline-sample', null, null)
  };
}
