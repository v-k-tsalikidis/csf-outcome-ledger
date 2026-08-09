import { describe, it, expect } from 'vitest';
import { validateImport } from './importValidation';

const evidence = {
  id: 'ev-1',
  documentName: 'Access Control Policy v3',
  referenceHash: 'a'.repeat(64),
  reviewerName: 'Reviewer',
  reviewDate: '2026-01-10',
  expiryDate: '2027-01-10',
  rationale: 'The policy states the control and names an owner.'
};

const risk = {
  scenario: 'Credential reuse across administrative accounts',
  likelihood: 'MEDIUM',
  impact: 'HIGH',
  treatment: 'MITIGATE',
  targetDate: '2026-06-30'
};

const decision = (over: Record<string, unknown> = {}) => ({
  outcomeId: 'PR.AA-01',
  status: 'SUPPORTED',
  lastUpdated: '2026-01-10T00:00:00.000Z',
  ...over
});

describe('a file that cannot be trusted is not loaded', () => {
  it('rejects anything that is not an object', () => {
    const result = validateImport('not json');
    expect(result.decisions).toEqual({});
    expect(result.rejected).toHaveLength(1);
  });

  it('rejects a decision with an unknown status instead of coercing it', () => {
    const result = validateImport({ 'PR.AA-01': decision({ status: 'TOTALLY_FINE' }) });
    expect(result.decisions).toEqual({});
    expect(result.rejected[0]).toContain('unknown status');
  });

  it('keeps the good records and reports the bad ones', () => {
    const result = validateImport({
      'PR.AA-01': decision(),
      'PR.AA-02': { status: 42 },
      'PR.AA-03': decision({ outcomeId: 'PR.AA-03' })
    });
    expect(Object.keys(result.decisions).sort()).toEqual(['PR.AA-01', 'PR.AA-03']);
    expect(result.rejected).toHaveLength(1);
  });
});

describe('evidence is kept only when it is complete', () => {
  it('accepts a full evidence record', () => {
    const result = validateImport({ 'PR.AA-01': decision({ evidence }) });
    expect(result.decisions['PR.AA-01'].evidence?.referenceHash).toBe(
      evidence.referenceHash
    );
  });

  it('drops evidence that is missing its hash', () => {
    const partial = { ...evidence } as Record<string, unknown>;
    delete partial.referenceHash;
    const result = validateImport({ 'PR.AA-01': decision({ evidence: partial }) });
    expect(result.decisions['PR.AA-01'].evidence).toBeUndefined();
  });

  it('drops evidence that is missing its reviewer', () => {
    const partial = { ...evidence } as Record<string, unknown>;
    delete partial.reviewerName;
    const result = validateImport({ 'PR.AA-01': decision({ evidence: partial }) });
    expect(result.decisions['PR.AA-01'].evidence).toBeUndefined();
  });
});

describe('risk context is checked against its allowed values', () => {
  it('accepts a well-formed risk context', () => {
    const result = validateImport({ 'PR.AA-01': decision({ riskContext: risk }) });
    expect(result.decisions['PR.AA-01'].riskContext?.treatment).toBe('MITIGATE');
  });

  it('drops an invented treatment', () => {
    const result = validateImport({
      'PR.AA-01': decision({ riskContext: { ...risk, treatment: 'IGNORE' } })
    });
    expect(result.decisions['PR.AA-01'].riskContext).toBeUndefined();
  });

  it('drops an invented likelihood', () => {
    const result = validateImport({
      'PR.AA-01': decision({ riskContext: { ...risk, likelihood: 'CATASTROPHIC' } })
    });
    expect(result.decisions['PR.AA-01'].riskContext).toBeUndefined();
  });
});

describe('both export shapes are accepted', () => {
  it('reads a wrapper carrying decisions and outcomes', () => {
    const result = validateImport({
      decisions: { 'PR.AA-01': decision() },
      outcomes: [{ id: 'PR.AA-01', name: 'Identities are managed' }]
    });
    expect(Object.keys(result.decisions)).toEqual(['PR.AA-01']);
    expect(result.outcomes).toHaveLength(1);
  });

  it('reads a bare map of decisions from an older export', () => {
    const result = validateImport({ 'PR.AA-01': decision() });
    expect(Object.keys(result.decisions)).toEqual(['PR.AA-01']);
    expect(result.outcomes).toBeNull();
  });
});
