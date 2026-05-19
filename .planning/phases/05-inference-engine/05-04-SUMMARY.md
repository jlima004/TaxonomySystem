---
phase: 05-inference-engine
plan: 04
subsystem: inference-engine
tags: [typescript, vitest, inference, similarity-graph, sparse-graph]

requires:
  - phase: 05-inference-engine
    provides: Dimension calculators and final-score helpers from 05-02/05-03
provides:
  - Deterministic sparse SimilarityGraph builder with final_score > threshold pruning
  - Multi-dimensional graph edges preserving semantic, tradition, accord, and alias evidence separately
  - Graph-level review_queue typed as readonly ReviewQueueItem[]
affects: [inference, similarity-scoring, phase-06-compilation]

tech-stack:
  added: []
  patterns:
    - Pure graph orchestration with explicit curated relation and accord inputs
    - Deterministic generated_at injection with fixed default timestamp
    - Sparse edge emission after final-score composition only

key-files:
  created:
    - src/inference/build_similarity_graph.ts
    - src/tests/inference/build_similarity_graph.test.ts
    - src/tests/fixtures/inference/sparse_graph_threshold.json
  modified:
    - src/inference/index.ts
    - src/types/similarity.ts

key-decisions:
  - "SimilarityGraph now stores review_queue inside the graph as readonly ReviewQueueItem[] for Phase 6 consumption."
  - "buildSimilarityGraph defaults generated_at to 1970-01-01T00:00:00.000Z unless options.generatedAt is provided."
  - "Sparse graph density is computed from possible unique pairs and returns 0 when fewer than two subfamilies exist."

patterns-established:
  - "Graph edge dimensions preserve semantic_overlap, tradition, accord_compatibility, and alias_evidence separately."
  - "Graph edges keep score equal to final_score for compatibility with existing consumers."
  - "Review queue items for weak alias evidence remain advisory and never canonicalize seed descriptors."

requirements-completed: [INFR-03, INFR-04]

duration: 4 min
completed: 2026-05-19
---

# Phase 05 Plan 04: Sparse Similarity Graph Summary

**Deterministic sparse SimilarityGraph composition with separated semantic/tradition/accord/alias dimensions, compact evidence, strict final_score thresholding, and graph-level review_queue.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-19T16:46:38Z
- **Completed:** 2026-05-19T16:51:11Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added Wave 0 graph tests and fixture coverage for exact-threshold exclusion, above-threshold sparse emission, deterministic generated timestamps, density edge cases, separated dimension scores, compact evidence, and graph-level `review_queue` typing.
- Implemented `buildSimilarityGraph(seed, analysis, inputs, options)` as a pure orchestrator over Phase 5 dimension calculators and final-score helpers.
- Exported the graph builder from `src/inference/index.ts` and extended `SimilarityGraph` with `readonly review_queue: readonly ReviewQueueItem[]`.
- Verified full Phase 5 inference tests and the full project test suite.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wave 0 sparse graph composition tests** - `c4daaf6` (test)
2. **Task 2: Compose sparse subfamily similarity graph** - `44a7186` (feat)

**Plan metadata:** pending final docs commit

_Note: Task 1 followed the RED gate with failing tests because `buildSimilarityGraph` was not implemented/exported yet; Task 2 is the GREEN implementation commit._

## Files Created/Modified

- `src/inference/build_similarity_graph.ts` - Builds deterministic sparse graph edges from seed subfamilies, corpus analysis, curated relations, accord maps, and score options.
- `src/inference/index.ts` - Exports `buildSimilarityGraph` and its input/option types.
- `src/types/similarity.ts` - Adds graph-level `review_queue` typed as `readonly ReviewQueueItem[]`.
- `src/tests/inference/build_similarity_graph.test.ts` - Covers strict threshold behavior, compact evidence, deterministic output, score compatibility, generated_at defaulting, and density zero for fewer than two subfamilies.
- `src/tests/fixtures/inference/sparse_graph_threshold.json` - Fixture for above-threshold and exact-threshold graph pairs.

## Verification

- `cd src && npm test -- tests/inference/build_similarity_graph.test.ts` - passed (4 tests)
- `cd src && npm run build` - passed
- `cd src && npm run build && npm test -- tests/inference/ && npm run build && npm test` - passed (9 inference files / 31 tests; full suite 37 files / 212 tests)

## Decisions Made

- Similarity graph generation remains purely functional: curated relation and accord data are explicit inputs and no graph builder data constants are embedded.
- `generated_at` is deterministic by construction: `options.generatedAt ?? '1970-01-01T00:00:00.000Z'`; no internal `new Date()` is used.
- Edge evidence is compact and artifact-friendly while preserving separated dimension scores and weak alias review items.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected exact-threshold fixture descriptors**
- **Found during:** Task 2 (Compose sparse subfamily similarity graph)
- **Issue:** The initial RED fixture gave both exact-threshold subfamilies the same descriptor, which would add semantic overlap and prevent the pair from representing exactly `final_score === 0.25`.
- **Fix:** Changed the exact-threshold fixture descriptors to distinct markers and set the curated tradition relation to produce a composed final score of exactly `0.25`, so strict threshold exclusion is tested correctly.
- **Files modified:** `src/tests/fixtures/inference/sparse_graph_threshold.json`
- **Verification:** `cd src && npm test -- tests/inference/build_similarity_graph.test.ts` and full suite passed.
- **Committed in:** `44a7186`

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug).
**Impact on plan:** The fix made the planned threshold test truthful; no scope expansion.

## Issues Encountered

- Graphify hooks continued to update `graphify-out/` generated files after commits. These files were unrelated to plan 05-04 and intentionally left unstaged.

## Known Stubs

None - no placeholder/TODO/unimplemented stubs remain in Phase 5 graph files. Empty arrays/maps in tests are intentional minimal fixture inputs for missing optional dimensions and single-subfamily density behavior.

## Threat Flags

None - no new network endpoints, auth paths, file access patterns, schema migrations, or additional trust boundaries were introduced beyond the plan's graph-builder trust boundaries.

## TDD Gate Compliance

- RED gate: `c4daaf6` (`test(05-04): add failing similarity graph tests`) produced failing tests because `buildSimilarityGraph` was not implemented/exported.
- GREEN gate: `44a7186` implemented graph composition and made graph tests, build, inference tests, and full suite pass.
- REFACTOR gate: no separate refactor commit was needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 5 inference engine is complete and ready for Phase 6 compilation and CLI work.
- Phase 6 can consume `SimilarityGraph` with sparse `edges`, separated dimensions, `score === final_score`, deterministic `generated_at`, and graph-level `review_queue`.

## Self-Check: PASSED

- Created files listed in key-files exist on disk.
- Task commits `c4daaf6` and `44a7186` exist in git history.
- Plan verification commands passed.

---
*Phase: 05-inference-engine*
*Completed: 2026-05-19*
