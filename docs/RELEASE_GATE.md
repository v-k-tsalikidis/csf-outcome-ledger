# Release Gate

## Research Gate

- [x] Real-world problem and target users documented.
- [x] Official NIST sources identified.
- [x] Comparable open-source tools reviewed.
- [x] Differentiation and non-goals documented.
- [x] Public-safe data boundary documented.
- [x] Mapping semantics accepted after worked examples.
- [x] Official CSF dataset acquisition and transformation policy verified.
- [x] Product name and repository slug confirmed: `CSF Outcome Ledger` / `csf-outcome-ledger`.

## Architecture Gate

- [x] Versioned schema for scope, activity, evidence, mapping, target, and canonical export records.
- [ ] Local persistence threat/privacy model.
- [x] Source-data provenance and update-manifest policy.
- [ ] Import/export validation and migration strategy.
- [ ] Architecture decision records for framework and persistence choices.

## Implementation Gate

- [ ] Complete workflow for scope, activity, evidence metadata, mapping decision, and Target goal.
- [ ] Deterministic derived-state engine.
- [ ] No source-document content retained.
- [ ] Clear-data and full-export controls.
- [ ] Synthetic worked example.
- [ ] Machine-readable and Markdown exports.
- [ ] Input validation and recoverable error states.

## Quality Gate

- [ ] Unit tests for state derivation and mapping transitions.
- [ ] Schema and migration tests.
- [ ] Import/export round-trip tests.
- [ ] Accessibility review: keyboard, focus, semantics, contrast, reduced motion, and zoom.
- [ ] Responsive browser QA at mobile and desktop viewports.
- [ ] Privacy, security, legal, licensing, attribution, and non-affiliation review.
- [ ] Dependency and license review.
- [ ] CI passes on supported runtime versions.

## Release Gate

- [ ] README and tutorial match actual behavior.
- [ ] Methodology, limitations, privacy, accessibility, and source provenance are complete.
- [ ] Repository description, topics, license, and screenshots are ready.
- [ ] Version and release notes prepared.
- [ ] Final review against the differentiation brief.
- [ ] Public demo contains only synthetic data.

The project may be described as **portfolio-ready** only after every applicable item is checked and evidenced. Any non-applicable item must include a written rationale.
