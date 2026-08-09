import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchCisaKevThreatFeed, summarise, OFFLINE_SAMPLE_DATE } from './cisaKevApi';
import { CisaKevEntry } from '../types/ledger';

const CISA_PUBLISHED_FIELDS = [
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

function record(over: Partial<CisaKevEntry> = {}): Record<string, unknown> {
  return {
    cveID: 'CVE-2026-0001',
    vendorProject: 'Example',
    product: 'Thing',
    vulnerabilityName: 'Example Vulnerability',
    dateAdded: '2026-01-01',
    shortDescription: 'A description.',
    requiredAction: 'Apply the vendor fix.',
    dueDate: '2026-01-15',
    knownRansomwareCampaignUse: 'Unknown',
    ...over
  };
}

function mockFeed(vulnerabilities: unknown[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ vulnerabilities })
    }))
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('entries carry only what CISA publishes', () => {
  it('drops fields the catalogue does not define', async () => {
    mockFeed([record({ severity: 'CRITICAL', sectorImpact: 'Defence' } as never)]);
    const { entries } = await fetchCisaKevThreatFeed();
    for (const key of Object.keys(entries[0])) {
      expect(CISA_PUBLISHED_FIELDS).toContain(key);
    }
  });

  it('rejects malformed records rather than filling in defaults', async () => {
    const broken = record();
    delete broken.cveID;
    mockFeed([broken, record({ cveID: 'CVE-2026-0002' })]);
    const { entries } = await fetchCisaKevThreatFeed();
    expect(entries).toHaveLength(1);
    expect(entries[0].cveID).toBe('CVE-2026-0002');
  });

  it('shows the most recently added entries first', async () => {
    mockFeed([
      record({ cveID: 'CVE-2026-0100', dateAdded: '2026-01-01' }),
      record({ cveID: 'CVE-2026-0300', dateAdded: '2026-03-01' }),
      record({ cveID: 'CVE-2026-0200', dateAdded: '2026-02-01' })
    ]);
    const { entries } = await fetchCisaKevThreatFeed();
    expect(entries.map((e) => e.cveID)).toEqual([
      'CVE-2026-0300',
      'CVE-2026-0200',
      'CVE-2026-0100'
    ]);
  });
});

describe('provenance is never misreported', () => {
  it('marks a successful retrieval as live and timestamps it', async () => {
    mockFeed([record()]);
    const { index } = await fetchCisaKevThreatFeed();
    expect(index.source).toBe('live');
    expect(index.retrievedAt).not.toBeNull();
    expect(index.catalogueSize).toBe(1);
  });

  it('marks a failed retrieval as an offline sample with no timestamp', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 503 }))
    );
    const { entries, index } = await fetchCisaKevThreatFeed();
    expect(index.source).toBe('offline-sample');
    expect(index.retrievedAt).toBeNull();
    expect(index.catalogueSize).toBeNull();
    expect(entries.length).toBeGreaterThan(0);
  });

  it('falls back when the feed returns nothing usable', async () => {
    mockFeed([{ nonsense: true }]);
    const { index } = await fetchCisaKevThreatFeed();
    expect(index.source).toBe('offline-sample');
  });

  it('publishes a snapshot date for the offline sample', () => {
    expect(OFFLINE_SAMPLE_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('summary counts are derived, not asserted', () => {
  const entry = (over: Partial<CisaKevEntry>): CisaKevEntry => ({
    cveID: 'CVE-2026-0001',
    vendorProject: 'Example',
    product: 'Thing',
    vulnerabilityName: 'Example Vulnerability',
    dateAdded: '2026-01-01',
    shortDescription: 'A description.',
    requiredAction: 'Apply the vendor fix.',
    dueDate: '2026-01-15',
    knownRansomwareCampaignUse: 'Unknown',
    ...over
  });

  const base: CisaKevEntry[] = [
    entry({ knownRansomwareCampaignUse: 'Known', dueDate: '2000-01-01' }),
    entry({ knownRansomwareCampaignUse: 'Unknown', dueDate: '2999-01-01' })
  ];

  it('counts only entries CISA links to ransomware', () => {
    expect(summarise(base, 'live', 10, null).ransomwareLinked).toBe(1);
  });

  it('counts only entries whose remediation date has passed', () => {
    expect(summarise(base, 'live', 10, null).pastDue).toBe(1);
  });

  it('reports how many entries are actually shown', () => {
    expect(summarise(base, 'live', 1662, null).shown).toBe(2);
  });
});
