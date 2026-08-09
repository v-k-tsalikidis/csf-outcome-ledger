import {
  OutcomeDecision,
  MappingStatus,
  NistOutcome,
  EvidenceRecord,
  RiskContext
} from '../types/ledger';

/**
 * Validation for an imported ledger file.
 *
 * An export can be edited by hand, mailed around, and re-imported. Before
 * this existed the importer wrote whatever the file contained straight
 * into typed state, so a malformed or tampered file silently corrupted the
 * ledger and the corruption only surfaced later, in a report someone had
 * already relied on.
 *
 * Anything that does not parse is rejected and reported, rather than
 * coerced into something that looks valid.
 */

const MAPPING_STATUSES: MappingStatus[] = [
  'SUPPORTED',
  'UNSUPPORTED',
  'STALE',
  'OUT_OF_SCOPE'
];

export interface ImportResult {
  decisions: Record<string, OutcomeDecision>;
  outcomes: NistOutcome[] | null;
  rejected: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const TREATMENTS = ['MITIGATE', 'ACCEPT', 'TRANSFER', 'AVOID'];

function strings(raw: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((k) => typeof raw[k] === 'string');
}

/**
 * Evidence is the part that matters most. A record missing its hash or its
 * reviewer is not evidence, it is a claim, so a partial one is dropped
 * rather than half-loaded.
 */
function parseEvidence(raw: unknown): EvidenceRecord | undefined {
  if (!isRecord(raw)) return undefined;
  const required = [
    'id',
    'documentName',
    'referenceHash',
    'reviewerName',
    'reviewDate',
    'expiryDate',
    'rationale'
  ];
  if (!strings(raw, required)) return undefined;
  return {
    id: raw.id as string,
    documentName: raw.documentName as string,
    referenceHash: raw.referenceHash as string,
    reviewerName: raw.reviewerName as string,
    reviewDate: raw.reviewDate as string,
    expiryDate: raw.expiryDate as string,
    rationale: raw.rationale as string
  };
}

function parseRiskContext(raw: unknown): RiskContext | undefined {
  if (!isRecord(raw)) return undefined;
  if (!strings(raw, ['scenario', 'likelihood', 'impact', 'treatment', 'targetDate'])) {
    return undefined;
  }
  if (!RISK_LEVELS.includes(raw.likelihood as string)) return undefined;
  if (!RISK_LEVELS.includes(raw.impact as string)) return undefined;
  if (!TREATMENTS.includes(raw.treatment as string)) return undefined;
  return {
    scenario: raw.scenario as string,
    likelihood: raw.likelihood as RiskContext['likelihood'],
    impact: raw.impact as RiskContext['impact'],
    treatment: raw.treatment as RiskContext['treatment'],
    targetDate: raw.targetDate as string
  };
}

function parseDecision(id: string, raw: unknown): OutcomeDecision | string {
  if (!isRecord(raw)) return `${id}: not an object`;
  const status = raw.status;
  if (typeof status !== 'string') return `${id}: missing status`;
  if (!MAPPING_STATUSES.includes(status as MappingStatus)) {
    return `${id}: unknown status "${status}"`;
  }
  const outcomeId = typeof raw.outcomeId === 'string' ? raw.outcomeId : id;
  const lastUpdated =
    typeof raw.lastUpdated === 'string' ? raw.lastUpdated : new Date().toISOString();

  return {
    outcomeId,
    status: status as MappingStatus,
    lastUpdated,
    evidence: parseEvidence(raw.evidence),
    riskContext: parseRiskContext(raw.riskContext)
  };
}

/**
 * Accept a parsed JSON file in either shape: a wrapper carrying
 * `decisions` and optionally `outcomes`, or a bare map of decisions as
 * older exports produced.
 */
export function validateImport(data: unknown): ImportResult {
  if (!isRecord(data)) {
    return { decisions: {}, outcomes: null, rejected: ['file is not a JSON object'] };
  }

  const source = isRecord(data.decisions) ? data.decisions : data;
  const decisions: Record<string, OutcomeDecision> = {};
  const rejected: string[] = [];

  for (const [id, raw] of Object.entries(source)) {
    const parsed = parseDecision(id, raw);
    if (typeof parsed === 'string') rejected.push(parsed);
    else decisions[id] = parsed;
  }

  const outcomes =
    Array.isArray(data.outcomes) && data.outcomes.every(isRecord)
      ? (data.outcomes as unknown as NistOutcome[])
      : null;

  return { decisions, outcomes, rejected };
}
