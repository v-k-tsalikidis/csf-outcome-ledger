# Mapping Examples

**Methodology version:** 0.1-draft  
**Dataset baseline:** NIST OSCAL Content `v1.5.0`

These synthetic examples test the proposed mapping vocabulary. They are not assessment results and do not describe a real organization.

## Example 1: A Policy Is Not Operational Proof

**Activity or claim**

> Daily backups are required for business data.

**Evidence metadata**

- Type: policy
- Title: Fictional Data Protection Policy
- Revision: 3
- Review state: current

**Candidate outcome**

`PR.DS-11` - Backups of data are created, protected, maintained, and tested.

**Decision**

- State: `accepted`
- Support: `partial`
- Rationale basis: `semantic`
- Rationale: The policy establishes an expectation to create backups, but it does not demonstrate that backups are protected, maintained, or tested in operation.

**Derived state**

`Partially supported`

**Why this matters**

Keyword similarity cannot turn a policy requirement into sufficient evidence that the full outcome is achieved.

## Example 2: Operational Records Support A Backup Outcome

**Activity**

> The service owner reviews backup-job results weekly and completes a quarterly restore test.

**Evidence metadata**

- Type: operational record
- Title: Fictional Backup Job Review - 2026 Q2
- Produced: 2026-07-02
- Fingerprint: supplied by the user
- Review due: 2027-01-02

**Candidate outcome**

`PR.DS-11` - Backups of data are created, protected, maintained, and tested.

**Decision**

- State: `accepted`
- Support: `sufficient`
- Rationale basis: `functional`
- Rationale: The described review and restore-test records provide operational support for creation, maintenance, and testing. The assessor must separately verify that protection of backup data is within the evidence scope.

**Derived state**

`Evidence supported`, subject to the recorded scope and review date.

**Boundary**

The tool records the human decision and metadata. It does not inspect the source record or independently prove its accuracy.

## Example 3: Similar Security Language Does Not Establish A Mapping

**Activity**

> Personnel complete annual phishing-awareness training.

**Candidate outcome**

`DE.CM-01` - Networks and network services are monitored to find potentially adverse events.

**Decision**

- State: `rejected`
- Support: `none`
- Rationale basis: `functional`
- Rationale: Awareness training does not perform network or network-service monitoring. The activity may be relevant elsewhere in the CSF Core, but it does not support this outcome.

**Derived state**

No accepted support for `DE.CM-01`.

**Why this matters**

A mapper should preserve negative decisions so the same weak suggestion is not repeatedly accepted or reviewed without context.

## Example 4: Policy Plus Enforcement Can Change The Decision

**Activity**

> The cybersecurity policy is approved annually, communicated to personnel, and exceptions are reviewed by the designated risk owner.

**Evidence metadata**

- Type: policy
- Type: approval record
- Type: exception-review record
- Review state: current

**Candidate outcome**

`GV.PO-01` - Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced.

**Decision**

- State: `accepted`
- Support: `sufficient`
- Rationale basis: `functional`
- Rationale: The combined records support establishment, communication, governance context, and an enforcement mechanism. The decision remains scoped to the records and review period identified by the assessor.

**Derived state**

`Evidence supported`

## Example 5: Freshness Is Part Of The Decision

**Evidence metadata**

- Type: inventory export
- Title: Fictional Hardware Inventory
- Produced: 2025-01-10
- Review due: 2026-01-10

**Candidate outcome**

`ID.AM-01` - Inventories of hardware managed by the organization are maintained.

**Previous decision**

- State: `accepted`
- Support: `sufficient`
- Rationale basis: `functional`

**Current derived state**

`Stale`

**Reason**

The review-due date has passed. The historical decision is preserved, but it cannot be presented as current support without re-review.

## Example 6: A Source Change Requires Re-Review

An evidence reference was accepted using source fingerprint `A`. The user later records fingerprint `B` for the same reference.

**Derived state**

`Stale`

**Required action**

Create a new decision that supersedes the earlier one. The earlier decision remains in history and is not silently overwritten.

## Vocabulary Decision

The examples support the following baseline:

- Decision state: `candidate`, `accepted`, `rejected`, `needs-review`
- Support state: `none`, `partial`, `sufficient`
- Rationale basis: `syntactic`, `semantic`, `functional`
- Derived state: `unsupported`, `partial`, `supported`, `unresolved`, `stale`, `out-of-scope`, `target-gap`

`Sufficient` means sufficient for the recorded mapping decision and scope. It does not mean certified, fully compliant, risk-free, or independently verified by the application.
