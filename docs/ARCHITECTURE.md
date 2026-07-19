# Architecture

**Status:** Draft architecture baseline  
**Version:** 0.1

## 1. Architectural Goals

- Keep methodology and state derivation independent from the interface.
- Run the baseline application entirely in the browser.
- Store evidence metadata, never source-document contents.
- Preserve mapping decisions as append-only history through supersession.
- Make all imports and exports schema validated and versioned.
- Build runtime framework data deterministically from a pinned NIST source.
- Keep the application deployable as static files without an application server.

## 2. Proposed Layers

### Framework Data Build

A Node/TypeScript build script verifies the pinned NIST OSCAL source, filters withdrawn elements, normalizes active CSF records, and writes:

- the compact runtime dataset;
- a source and transformation manifest;
- deterministic count and hash evidence.

The application never fetches moving framework data at runtime.

### Domain Core

Pure TypeScript modules own:

- record validation;
- mapping state transitions;
- derived-state calculation;
- staleness and framework-drift checks;
- Current and Target Profile projections;
- import/export migrations;
- deterministic report models.

The domain core has no React, browser-storage, or network dependency.

### Persistence

An adapter stores the validated workspace in IndexedDB. A memory adapter supports tests.

Required behaviors:

- atomic workspace update;
- full JSON export;
- validated import with preview;
- explicit clear-data action;
- schema migration before write;
- no telemetry or synchronization.

### Interface

The proposed implementation stack is React, TypeScript, and Vite. The interface consumes the domain core and persistence adapters.

Primary work surfaces:

1. **Scope** - boundary, purpose, assumptions, exclusions, and owner role.
2. **Outcome Explorer** - versioned CSF Functions, Categories, and active Subcategories.
3. **Activity And Evidence Ledger** - claims, practices, and metadata-only evidence references.
4. **Decision Queue** - candidate, accepted, rejected, stale, and needs-review mappings.
5. **Profile And Export** - Current/Target views, gaps, warnings, JSON, and Markdown outputs.

The first screen is the workspace, not a marketing page.

## 3. State Transition Rules

```text
candidate -> accepted
candidate -> rejected
candidate -> needs-review
needs-review -> accepted
needs-review -> rejected
accepted -> superseded by a new decision
rejected -> superseded by a new decision
```

Accepted and rejected records are historical decisions. They are not edited in place when the judgment changes.

## 4. Derived-State Precedence

For an outcome within scope:

1. `stale` when all accepted supporting decisions are stale and no current accepted support exists;
2. `supported` when at least one current accepted decision has sufficient support;
3. `partial` when current accepted support exists but none is sufficient;
4. `unresolved` when candidates or needs-review decisions exist and no accepted support exists;
5. `unsupported` otherwise.

`out-of-scope` is derived from the approved Target decision and bypasses support aggregation. `target-gap` is an additional flag when an included Target outcome is not currently supported at the required state.

## 5. Staleness Rules

A mapping decision is stale when any of the following is true:

- `reviewDueAt` is before the evaluation date;
- the referenced subject fingerprint differs from the fingerprint recorded in the decision;
- the active framework dataset version differs and the outcome fingerprint changed;
- the referenced activity or evidence record no longer exists;
- the decision was superseded.

Superseded decisions remain visible in history but do not contribute to the current projection.

## 6. Data Boundaries

The workspace may contain organizational metadata and must be treated as potentially sensitive even though document contents are excluded.

The baseline application:

- sends no data to a server;
- loads no analytics;
- requires no account;
- includes no remote fonts or third-party runtime scripts;
- warns before export;
- provides a full clear-data operation;
- ships only fictional demo records.

## 7. Export Model

The canonical export is the full versioned workspace JSON. Markdown and profile-oriented CSV are projections generated from that canonical record.

Every export includes:

- schema version;
- framework source version and hashes;
- export timestamp;
- assessment scope;
- unresolved and stale-decision warnings;
- non-certification disclaimer.

OSCAL Assessment Results are a future interoperability path, not a v0.1 claim.

## 8. Verification Strategy

- JSON Schema validation for persisted and imported data.
- Unit tests for each state transition and derived-state precedence rule.
- Property-style fixtures for malformed imports, duplicate identifiers, missing references, and time boundaries.
- Round-trip tests for canonical exports.
- Golden-file tests for normalized framework data and Markdown reports.
- Browser tests for keyboard workflows, focus, responsive layout, and local persistence.
- Privacy checks confirming that no network request occurs during the core workflow.

## 9. Architecture Decisions Still Required

- Exact schema-validation library and bundle impact.
- IndexedDB adapter library versus a small native wrapper.
- Whether source fingerprints are manually entered, calculated from user-selected local files without retaining them, or both.
- CSV compatibility fields for NIST Organizational Profile workflows.
