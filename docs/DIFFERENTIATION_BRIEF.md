# Differentiation Brief

**Project:** CSF Outcome Ledger  
**Status:** Research  
**Research date:** 2026-07-19

## Problem

Organizations can create NIST CSF 2.0 Current and Target Profiles, but the reasoning behind individual mapping and status decisions is often lost in spreadsheets, narrative documents, or aggregate dashboard scores. A number may show that a gap exists without preserving who made the decision, what evidence was considered, why the relationship was accepted, or when it should be reviewed again.

The operational need is a compact decision trail between:

- an assessment scope;
- a security activity or claim;
- evidence metadata;
- a CSF 2.0 outcome;
- a human mapping decision;
- a target priority or goal; and
- the review state of that decision over time.

## Target Users

- Small security or GRC teams that do not need an enterprise platform.
- Practitioners preparing or reviewing an Organizational Profile.
- Consultants and students who need a transparent, reproducible mapping exercise.
- Technical owners who must explain how operational practices relate to risk-management outcomes.

## Comparable Solutions

### NIST CSF 2.0 Reference Tool

**Strengths:** authoritative Core data, search, filtering, implementation examples, informative references, and JSON/Excel export.

**Boundary:** it is a reference browser, not a local lifecycle for organizational mapping decisions and evidence reviews.

### NIST Organizational Profile Template

**Strengths:** official, flexible, and directly supports side-by-side Current and Target Profile work.

**Boundary:** a spreadsheet does not inherently validate provenance, preserve mapping-decision history, detect stale reviews, or provide a constrained evidence vocabulary.

### CSF Profile Assessment Database

**Strengths:** ownership, findings, scoring, artifacts, remediation tracking, and exports.

**Boundary:** it is a broader assessment database with a 0-10 scoring model and optional platform integrations. This project will stay narrower and will treat decision traceability, not scoring, as the main product.

### AI-Assisted Evidence And Gap Analysis Tool

**Strengths:** local/offline options, document ingestion, evidence-bound AI proposals, human review, Current/Target Profiles, and detailed reports.

**Boundary:** its central workflow analyzes document contents with retrieval and AI. This project will not ingest document contents or make AI coverage judgments; it will record metadata and explicit human mapping decisions.

## Unique Angle

CSF Outcome Ledger will be an **evidence-metadata and mapping-decision ledger**, not an automated assessor.

Its distinguishing behavior will be:

- no retention of source-document contents;
- explicit separation of a claim from evidence that supports it;
- OLIR-informed rationale and relationship semantics;
- mandatory human approval for every accepted mapping;
- source/version fingerprints and review-due dates;
- stale-decision and framework-drift detection;
- transparent Current/Target Profile construction;
- no aggregate compliance or maturity score.

## Strengths To Adopt

- Official, versioned NIST source data.
- Current and Target Profile concepts.
- Human review before a mapping becomes authoritative within the workspace.
- Deterministic export and synthetic worked examples.
- Local-first operation and a self-contained report.

## Weaknesses To Avoid

- Treating CSF outcomes as a universal checklist.
- Averaging ordinal assessments into a misleading percentage.
- Equating CSF Tiers with maturity levels.
- Claiming that a mapping demonstrates certification or conformity.
- Uploading sensitive policies, reports, or operational evidence.
- Hiding mapping logic behind an LLM response.
- Building a generic chart-first dashboard without an auditable decision trail.

## Public-Safe Scope

The repository will contain only synthetic examples. Evidence records will be metadata-only and will use fictional organizations, systems, owners, and review events. The project will not include employer data, internal procedures, sensitive control details, credentials, personal data, or operational material.

## Recruiter Signal

The project should demonstrate:

- practical NIST CSF 2.0 understanding;
- careful GRC and assurance reasoning;
- framework mapping and provenance design;
- privacy and data-minimization judgment;
- accessible frontend product design;
- schema-driven TypeScript engineering;
- deterministic testing and release discipline.

## Decision

Proceed to methodology and interaction design. Do not start feature implementation until the data model, mapping semantics, privacy model, source-version policy, and v0.1 release gate are accepted.
