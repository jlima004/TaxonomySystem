---
phase: 08-taxonomy-seed-expansion-curation
plan: 04
subsystem: curation-inference-inputs
tags: [taxonomy, relations, accords, curation, vitest]

requires:
  - phase: 08-taxonomy-seed-expansion-curation
    provides: taxonomy-seed.v2.json and approved candidate review workbook entries from 08-02/08-03
provides:
  - Versioned v2 curated relation input companion file retaining applicable manual v1 bootstrap records
  - Versioned v2 accord map companion file retaining applicable manual v1 bootstrap records
  - Validation tests for v2 relation/accord endpoints, manual score bounds, traceability, and neutral missing semantics
  - Explicit relation and accord gap rationale for the new v2 `vanilla` subfamily
affects: [phase-08, relation-curation, accord-curation, taxonomy-seed-v2]

tech-stack:
  added: []
  patterns: [Vitest file-backed curation contract tests, manual-score JSON companion inputs, workbook gap ledger]

key-files:
  created: [src/tests/curation/relation_accord_v2.test.ts, data/inference/curated_relations.v2.json, data/inference/accord_map.v2.json]
  modified: [.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md]

key-decisions:
  - "V2 relation and accord files retain only applicable v1 manual bootstrap records because all v1 subfamily endpoints still exist in taxonomy-seed.v2.json."
  - "The new v2 `vanilla` subfamily has no approved manual relation or accord score, so missing coverage remains absent/undefined and is documented as explicit gap rationale instead of score 0."
  - "Legacy alias target mismatches are registered only as a soft 08-05 validation finding and are not corrected in 08-04."

patterns-established:
  - "Relation/accord tests load v2 inference JSON when present and fall back to inline fixtures before data creation."
  - "Manual relation/accord gaps are recorded in candidate-review.md rather than represented as zero-valued data records."

requirements-completed: [CUR-06]

duration: 3min 19s
completed: 2026-05-23
---

# Phase 8 Plan 04: V2 Relation And Accord Companion Inputs Summary

**V2 manual relation and accord companion inputs with explicit vanilla gap rationale and neutral missing-score semantics.**

## Performance

- **Duration:** 3min 19s
- **Started:** 2026-05-23T00:28:45Z
- **Completed:** 2026-05-23T00:32:04Z
- **Tasks:** 2
- **Files modified:** 3 created, 1 modified

## Accomplishments

- Added `src/tests/curation/relation_accord_v2.test.ts` to validate v2 relation/accord files when present, while remaining runnable before data creation through inline fixtures.
- Created `data/inference/curated_relations.v2.json` with version `2.0.0` and retained applicable v1 manual relation bootstrap records.
- Created `data/inference/accord_map.v2.json` with version `2.0.0` and retained applicable v1 manual accord bootstrap records.
- Added a relation/accord ledger to `candidate-review.md` documenting retained Phase 7 manual bootstrap evidence and explicit `vanilla` relation/accord gaps.
- Confirmed no relation or accord score was derived from corpus, co-occurrence, review queue frequency, or candidate frequency.

## Task Commits

1. **Task 1: Add v2 relation and accord validation tests** - `4fbf87d` (test)
2. **Task 2: Create v2 curated relation and accord files** - `7f20740` (feat)

**Plan metadata:** committed after summary/state updates.

## Files Created/Modified

- `src/tests/curation/relation_accord_v2.test.ts` - Focused Vitest coverage for v2 inference input validation, endpoint existence, manual score bounds, traceability, and neutral missing semantics.
- `data/inference/curated_relations.v2.json` - Version `2.0.0` curated relation input companion retaining applicable manual v1 bootstrap relation records.
- `data/inference/accord_map.v2.json` - Version `2.0.0` accord map companion retaining applicable manual v1 bootstrap accord records.
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md` - Added retained bootstrap traceability and explicit `vanilla` relation/accord gap rationale.

## Relation/Accord Outcome

- **Records added for new v2 subfamily:** None.
- **Retained records:** Existing v1 manual bootstrap relation/accord records were carried into v2 because their endpoints still exist in `taxonomy-seed.v2.json`.
- **Gap-only outcome for new subfamily:** `vanilla` has no approved manual relation or accord score. Relation/accord coverage remains absent and neutral/undefined, with explicit gap rationale in `candidate-review.md`.
- **Zero placeholders:** None. No `score: 0` records were added.

## Verification

| Command / Check | Result |
|---|---|
| `cd src && npm test -- tests/curation/relation_accord_v2.test.ts tests/inference/tradition_score.test.ts tests/inference/accord_compatibility.test.ts` | PASS — 3 files, 11 tests passed |
| Protected-file diff: `git diff -- data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/compiled/v1` | PASS — no diff |
| V2 inference semantic check for version, endpoint existence, [0,1] scores, and no zero placeholders | PASS |

## Decisions Made

- Retained applicable v1 bootstrap relation/accord records rather than creating new records for `vanilla`, because only the seed expansion for `vanilla` is approved and no relation/accord score is approved.
- Documented `vanilla` relation and accord gaps explicitly to satisfy CUR-D-51 through CUR-D-64 without fabricating zero-valued or corpus-derived scores.

## Deviations from Plan

None - plan executed as written within the run-specific constraints.

## Issues Encountered

- Initial test implementation treated inline fixture evidence as if it had to appear in the workbook. This was corrected before the Task 1 commit so fixture-only pre-data validation remains possible while real v2 files still require workbook traceability.

## Known Stubs

None.

## Threat Flags

None. The only trust-boundary files created are the planned relation/accord JSON inputs, covered by the plan threat model and focused tests.

## 08-05 Handoff - Soft Finding

- **Category:** Alias quality
- **Finding:** Some legacy aliases in `data/taxonomy/descriptor_aliases.seed.json` point to targets absent from minimal `taxonomy-seed.v2.json`.
- **Disposition:** Soft warning for 08-05 validation only.
- **Constraint:** Do not remove legacy aliases, do not add descriptors to v2, and do not correct aliases without curatorial approval.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 08-04 is complete.
- Execution is intentionally stopped before 08-05 for human review.
- Checkpoint before 08-05 remains pending; do not execute 08-05 until explicitly approved.

## Self-Check: PASSED

- Found `src/tests/curation/relation_accord_v2.test.ts`.
- Found `data/inference/curated_relations.v2.json`.
- Found `data/inference/accord_map.v2.json`.
- Found task commits `4fbf87d` and `7f20740` in git history.
- Confirmed `data/taxonomy/taxonomy-seed.v1.json`, `data/taxonomy/taxonomy-seed.v2.json`, `data/taxonomy/descriptor_aliases.seed.json`, and `data/compiled/v1/` have no working-tree diff from this plan.

---
*Phase: 08-taxonomy-seed-expansion-curation*
*Completed: 2026-05-23*
