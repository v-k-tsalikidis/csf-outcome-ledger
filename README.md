# CSF Outcome Ledger

> Research-stage, independent portfolio project. No implementation or compliance claim is made yet.

CSF Outcome Ledger is a proposed local-first workspace for recording why a security activity or evidence artifact supports a NIST Cybersecurity Framework 2.0 outcome.

The project is deliberately not another maturity-score dashboard. Its primary artifact is a human-approved mapping decision with source provenance, rationale, review history, and freshness state. It will keep evidence metadata in the browser and will not require source documents to be uploaded to a service.

## Current Status

**Research**

The problem statement, comparable solutions, methodology boundaries, privacy posture, and release gates are being defined before implementation.

## Proposed Core Workflow

1. Define the assessment scope and select relevant CSF 2.0 outcomes.
2. Record a security activity, claim, or evidence reference.
3. Review candidate outcomes and make an explicit mapping decision.
4. Record the relationship, rationale, reviewer, and review date.
5. Distinguish supported, unsupported, stale, unresolved, and out-of-scope records.
6. Export the decision ledger and Current/Target Profile views.

## Design Commitments

- Local-first and usable without an account.
- No source-document upload or cloud processing in the baseline release.
- No mandatory AI and no opaque automated judgment.
- No aggregate "compliance percentage."
- Versioned CSF source data and reproducible mapping records.
- Human-readable and machine-readable exports.
- WCAG-informed, keyboard-accessible, responsive interface.
- Public and synthetic demonstration data only.

## Documentation

- [Differentiation brief](docs/DIFFERENTIATION_BRIEF.md)
- [Research sources](docs/RESEARCH_SOURCES.md)
- [Methodology specification](docs/METHODOLOGY_SPEC.md)
- [Release gate](docs/RELEASE_GATE.md)

## Independence And Use

This is an independent educational and portfolio project. It is not affiliated with, endorsed by, or connected to NIST, NATO, the European Union, the Hellenic Army, or any employer. It is not an audit, certification, legal opinion, or guarantee of conformity.

Only public, synthetic, demo, or intentionally sanitized data will be committed to this repository.
