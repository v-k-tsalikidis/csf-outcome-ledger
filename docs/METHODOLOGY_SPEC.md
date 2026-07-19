# Methodology Specification

**Version:** 0.1-draft  
**Status:** Research

## 1. Purpose

CSF Outcome Ledger records explicit, reviewable decisions about how security activities, claims, and evidence metadata relate to selected NIST CSF 2.0 outcomes.

The tool supports Organizational Profile preparation. It does not perform an audit, certify compliance, or determine risk acceptance.

## 2. Core Invariants

1. A claim is not evidence.
2. A candidate mapping is not an accepted mapping.
3. Every accepted mapping has a human decision, rationale, reviewer, and timestamp.
4. Evidence contents are not stored; only user-entered metadata and optional local references are retained.
5. A mapping can become stale when its evidence, scope, review date, or framework source version changes.
6. Aggregate compliance or maturity percentages are not produced.
7. Out-of-scope and not-applicable decisions require rationale.
8. Exported records include schema and source-data versions.

## 3. Proposed Record Types

### Assessment Scope

- stable identifier;
- title and purpose;
- organizational or system boundary;
- assumptions and exclusions;
- profile owner;
- created and reviewed dates.

### Activity Or Claim

- stable identifier;
- concise statement;
- responsible role;
- cadence or trigger;
- applicable scope;
- current-state declaration;
- source and revision metadata.

### Evidence Reference

- stable identifier;
- title and evidence type;
- issuing or responsible role;
- date produced and date reviewed;
- optional local reference label;
- source fingerprint supplied or generated locally;
- sensitivity label;
- no document body.

### Mapping Decision

- activity or evidence reference;
- CSF outcome identifier;
- state: `candidate`, `accepted`, `rejected`, or `needs-review`;
- support: `none`, `partial`, or `sufficient`;
- rationale basis: `syntactic`, `semantic`, or `functional`;
- relationship note;
- human rationale;
- reviewer and decision timestamp;
- review-due date;
- CSF source-data version;
- superseded decision identifier when revised.

### Target Decision

- CSF outcome identifier;
- applicability;
- priority: `low`, `medium`, `high`, or `critical`;
- target goal;
- rationale;
- accountable role;
- target date.

## 4. Derived States

Derived labels are descriptive workflow states, not compliance grades:

- **Unsupported claim:** a current-state claim has no accepted evidence mapping.
- **Evidence supported:** at least one current, accepted mapping has sufficient support.
- **Partially supported:** accepted mappings exist but are explicitly partial.
- **Unresolved:** candidate mappings await a human decision.
- **Stale:** the review is overdue, a source fingerprint changed, or the CSF source version no longer matches.
- **Out of scope:** excluded by an approved scope decision with rationale.
- **Target gap:** a selected Target outcome is not supported at the required state.

## 5. Mapping Semantics

The baseline method is informed by NIST IR 8477 and IR 8278 Rev. 1 but will not claim OLIR conformance.

- `syntactic`: similar or identical terminology is the primary reason for the candidate relationship.
- `semantic`: the concepts have substantially related meaning.
- `functional`: the activity or evidence contributes to achieving the outcome in practice.

The support state remains a separate human judgment. Similar words alone cannot establish sufficient support.

## 6. Current And Target Profile Views

The Current view shows selected outcomes and the state of accepted evidence decisions. The Target view records desired outcomes, priorities, goals, accountable roles, and dates.

The interface may summarize counts by workflow state. It must not average ordinal values into a universal score or label the result as a NIST compliance percentage.

## 7. Source Data

- The CSF Core will be built from an official NIST machine-readable export.
- The normalized local dataset will include provenance, retrieval date, hash, and transformation manifest.
- Framework data updates will be reviewed and versioned.
- Existing user decisions will be marked for review when referenced outcome text changes.

## 8. Privacy And Security

- Baseline operation is browser-local.
- No account, analytics, telemetry, document upload, or external API is required.
- Synthetic examples are bundled.
- Exports may contain sensitive organizational metadata; the UI must warn users before export.
- Clear-data and full-export controls are required.
- Security headers and static deployment guidance will be documented.

## 9. Non-Goals

- Certification, audit attestation, legal advice, or automatic conformity decisions.
- Enterprise multi-user workflow, SSO, ticketing, or evidence-document repository.
- LLM-based document analysis.
- Automated risk acceptance.
- OSCAL Assessment Results export in v0.1.
- Cross-framework control harmonization in v0.1.

## 10. Open Research Questions

- Exact relationship vocabulary for activity-to-outcome decisions.
- How source fingerprints work without retaining document content.
- Whether browser storage should use IndexedDB from the first implementation.
- The minimum interoperable profile export fields.
- The policy for framework updates and backward-compatible decision migration.
