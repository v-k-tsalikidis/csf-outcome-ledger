export type FunctionCategory =
  'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER' | 'GOVERN';

export type MappingStatus = 'SUPPORTED' | 'UNSUPPORTED' | 'STALE' | 'OUT_OF_SCOPE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Sp80053Control {
  code: string; // e.g. "AC-2"
  title: string; // e.g. "Account Management"
  family: string;
}

export interface Iso27001Control {
  code: string; // e.g. "A.5.15"
  title: string;
}

export interface DoraArticle {
  article: string; // e.g. "Art. 9"
  title: string;
}

export interface Nis2Article {
  article: string; // e.g. "Art. 21.2"
  title: string;
}

export interface NistOutcome {
  id: string; // e.g. "PR.AA-01"
  function: FunctionCategory;
  category: string;
  description: string;
  sp80053Controls: Sp80053Control[];
  iso27001Controls: Iso27001Control[];
  doraMapping: DoraArticle;
  nis2Mapping: Nis2Article;
}

export interface EvidenceRecord {
  id: string;
  documentName: string;
  referenceHash: string; // SHA-256 hash computed locally
  reviewerName: string;
  reviewDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  rationale: string;
}

export interface RiskContext {
  scenario: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  treatment: 'MITIGATE' | 'ACCEPT' | 'TRANSFER' | 'AVOID';
  targetDate: string;
}

export interface OutcomeDecision {
  outcomeId: string;
  status: MappingStatus;
  evidence?: EvidenceRecord;
  riskContext?: RiskContext;
  lastUpdated: string;
}

/**
 * One record of the CISA Known Exploited Vulnerabilities catalogue.
 *
 * These are exactly the fields CISA publishes. Nothing is added here.
 * A previous version of this file carried `sectorImpact` and `severity`,
 * which CISA does not publish and which this application was inventing;
 * presenting derived values as catalogue data is the kind of unsupported
 * claim this whole tool exists to argue against.
 */
export interface CisaKevEntry {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
  knownRansomwareCampaignUse: string;
  cwes?: string[];
  notes?: string;
}

/** Where the displayed entries actually came from. */
export type ThreatFeedSource = 'live' | 'offline-sample';

/**
 * Counts derived from the retrieved entries, and the provenance of those
 * entries. There is deliberately no overall threat level: CISA does not
 * publish one, and inventing a headline severity is the dashboard habit
 * this project rejects.
 */
export interface ThreatIndex {
  source: ThreatFeedSource;
  /** Entries shown that CISA links to a known ransomware campaign. */
  ransomwareLinked: number;
  /** Entries shown whose CISA remediation due date has passed. */
  pastDue: number;
  /** Entries shown in the panel. */
  shown: number;
  /** Size of the whole catalogue; null when the live feed was unavailable. */
  catalogueSize: number | null;
  /** ISO timestamp of a successful retrieval; null for the offline sample. */
  retrievedAt: string | null;
}
