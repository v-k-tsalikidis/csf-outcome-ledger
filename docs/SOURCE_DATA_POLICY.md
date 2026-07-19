# Source-Data Policy

**Status:** Verified research baseline  
**Verification date:** 2026-07-19

## Authoritative Baseline

The first implementation will derive its CSF Core dataset from the official NIST `usnistgov/oscal-content` repository.

| Field | Value |
| --- | --- |
| Repository | `https://github.com/usnistgov/oscal-content` |
| Repository tag | `v1.5.0` |
| Tag commit | `78650f02ad9321bb7b817846f8fbd4f2bcd620de` |
| Source path | `nist.gov/CSF/v2.0/json/NIST_CSF_v2.0_catalog.json` |
| Git blob SHA | `7b8b2d8b45cbf6fca093fcc5ae9f17ca9938b425` |
| Downloaded size | `349827` bytes |
| SHA-256 | `4836943f21d393f2821df85ada4e6f3c0617243b4ddf44263fe68205400210b4` |
| Catalog title | `Electronic Version of NIST Cybersecurity Framework 2.0` |
| Catalog version | `1.2.0` |
| Catalog last modified | `2026-05-11T16:01:09.00000-00:00` |
| OSCAL version | `v1.2.2` |

Pinned raw URL:

`https://raw.githubusercontent.com/usnistgov/oscal-content/v1.5.0/nist.gov/CSF/v2.0/json/NIST_CSF_v2.0_catalog.json`

## Transformation Rules

The build step will:

1. Download or read the pinned OSCAL JSON.
2. Verify its SHA-256 before transformation.
3. Read the six top-level Function groups.
4. Read Category controls under each Function.
5. Exclude a Category or Subcategory when its properties contain `status=withdrawn`.
6. Preserve active Function, Category, and Subcategory identifiers, labels, titles, and statement prose.
7. Normalize data into the project's smaller runtime schema without changing official outcome text.
8. Sort records using the official `sort-id` property.
9. Produce a transformation manifest containing source URL, tag, commit, source hash, normalized hash, script version, timestamp, and record counts.
10. Fail the build when required metadata is absent, duplicate active identifiers exist, the source hash changes, or the active Subcategory count is not the expected value for the pinned dataset.

## Verified Counts

- Functions: `6`
- Active Subcategories: `106`

The raw OSCAL catalog also retains withdrawn legacy Categories and Subcategories. They must not appear as active CSF 2.0 outcomes in the application.

## Update Policy

- Runtime builds never consume `main` or another moving reference.
- A source update is a deliberate pull request with a new pinned tag and hashes.
- The transformation output is diffed by identifier and official statement text.
- A changed or removed outcome marks dependent mapping decisions as requiring review.
- Source updates receive dedicated regression fixtures and release notes.
- Implementation Examples and Informative References may have a different update cadence and are out of scope for the first Core-only dataset.

## Attribution And Claims

The project will attribute NIST and the OSCAL content source in the repository and generated reports. It will not use NIST logos or imply endorsement, certification, or official status.

Licensing and public-domain notices will be verified before the normalized dataset is committed to a public release.
