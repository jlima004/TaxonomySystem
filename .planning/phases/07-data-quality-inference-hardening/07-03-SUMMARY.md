---
phase: 07-data-quality-inference-hardening
plan: 03
subsystem: inference
tags: [typescript, inference, taxonomy, review-queue]
requires:
  - phase: 07-02
    provides: alias-aware analysis inputs for placement/review
provides:
  - conservative placement scoring with locked thresholds/formula
  - deterministic merged review_queue in similarity output
  - review-only seed taxonomy gap suggestions
affects: [compiler, inference, quality-gates]
tech-stack:
  added: []
  patterns: [pure scoring function, deterministic review sorting, review-only seed expansion]
key-files:
  created: [src/inference/placement_scoring.ts, src/compiler/review_queue.ts, src/tests/inference/placement_scoring.test.ts, src/tests/inference/seed_expansion_review.test.ts]
  modified: [src/types/inference.ts, src/compiler/compile_taxonomy.ts, src/compiler/compile_all.ts, src/tests/compiler/compile_taxonomy.test.ts, src/tests/compiler/compile_all.test.ts]
key-decisions:
  - "compileTaxonomy now returns taxonomy plus placement_review_queue for deterministic downstream merge"
  - "seed expansion remains review-only via seed_taxonomy_gap_suggestion items"
patterns-established:
  - "Use one shared comparator for merged review queue ordering"
  - "Keep review_queue exclusively in similarity output artifact"
requirements-completed: [DQ-04, DQ-06, DQ-08]
duration: 31min
completed: 2026-05-22
---

# Phase 7 Plan 03: Conservative placement and deterministic review queue Summary

**Conservative candidate placement now uses support/normalized/score thresholds while rejected and seed-gap evidence is emitted deterministically into similarity_matrix review_queue only.**

## Performance

- **Duration:** 31 min
- **Started:** 2026-05-22T15:12:00Z
- **Completed:** 2026-05-22T15:43:00Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments
- Added pure inference placement scorer with locked Phase 7 thresholds and hard-exclusion behavior.
- Replaced permissive taxonomy placement with conservative scoring and explicit failed-placement review evidence.
- Centralized deterministic review queue sorting/merge and added review-only seed taxonomy gap suggestions.

## Task Commits

1. **Task 1: Implement conservative placement scoring as pure inference logic** - `76765cd` (test), `2d93d08` (feat)
2. **Task 2: Integrate placement decisions and review queue items** - `726d0db` (test), `1427547` (feat)
3. **Task 3: Add review-only seed gap suggestions without seed mutation** - `408439a` (test), `9ccd6f0` (feat)

## Files Created/Modified
- `src/inference/placement_scoring.ts` - placement scoring formula + thresholds.
- `src/compiler/compile_taxonomy.ts` - conservative inclusion + placement review item generation.
- `src/compiler/review_queue.ts` - deterministic queue sort + seed-gap review producer.
- `src/compiler/compile_all.ts` - merged queue assembly into similarity artifact.
- `src/tests/inference/placement_scoring.test.ts` - scoring contract tests.
- `src/tests/compiler/compile_taxonomy.test.ts` - placement integration tests.
- `src/tests/compiler/compile_all.test.ts` - merged queue and no-seed-mutation tests.
- `src/tests/inference/seed_expansion_review.test.ts` - review-only seed gap test.

## Decisions Made
- Kept taxonomy artifact free of review_queue; only similarity carries merged review signals.
- Implemented seed expansion as review-only signals, with no seed hierarchy mutation path.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Ready for 07-04 curated relations/accord bootstrap and quality-gate hardening.

## Self-Check: PASSED
