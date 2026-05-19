---
phase: 05-inference-engine
plan: 01
subsystem: inference-engine
tags: [typescript, vitest, inference, semantic-noise, descriptor-clustering]

requires:
  - phase: 04-corpus-analysis
    provides: frequency/co-occurrence maps, alias candidates, pair keys, and similarity primitives
provides:
  - Seed/corpus profile builder that preserves seed authority and emits corpus candidates
  - Semantic noise scoring with curated downweighting and seed exception audit records
  - Deterministic descriptor clusters with seed-anchored and corpus-native candidate outputs
affects: [inference, tests, phase-6-compilation]

tech-stack:
  added: []
  patterns:
    - Pure inference calculators with explicit options for curated data inputs
    - Review queue outputs for conflicts, semantic noise, and corpus-native candidates
    - Sparse co-occurrence key decoding for cluster evidence

key-files:
  created:
    - src/types/inference.ts
    - src/inference/index.ts
    - src/inference/types.ts
    - src/inference/noise.ts
    - src/inference/seed_profile.ts
    - src/inference/descriptor_clusters.ts
    - data/inference/semantic_noise.v1.json
    - src/tests/inference/seed_profile.test.ts
    - src/tests/inference/noise.test.ts
    - src/tests/inference/descriptor_clusters.test.ts
    - src/tests/fixtures/inference/seed_corpus_conflict.json
    - src/tests/fixtures/inference/noise_and_clusters.json
  modified:
    - src/types/index.ts

key-decisions:
  - "Curated semantic noise remains explicit data under data/inference and is passed into pure functions through options."
  - "Corpus-derived descriptors and clusters are candidates with review evidence, never seed mutations."
  - "Descriptor clustering uses deterministic bucket rules from sparse co-occurrence plus existing string similarity primitives, not graph community detection."

patterns-established:
  - "Seed authority: seed descriptors are source: seed/status: curated; corpus-only descriptors are source: corpus/status: candidate/corpus_derived."
  - "Semantic noise audit: curated noise is downweighted, seed-owned noise keeps weight 1 with seed_exception review output."
  - "Cluster evidence: membership_signals distinguishes cooccurrence and similarity support."

requirements-completed: [INFR-01, INFR-02]

duration: 7 min
completed: 2026-05-19
---

# Phase 05 Plan 01: Merge de seed e corpus / Clustering básico Summary

**Seed/corpus inference layer with reviewable corpus candidates, semantic-noise audit decisions, and deterministic descriptor clusters from sparse co-occurrence plus similarity signals.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-05-19T16:23:37Z
- **Completed:** 2026-05-19T16:30:06Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments

- Added Phase 5 inference contracts for profiles, inferred descriptors, review queue items, noise decisions, corpus noise suggestions, and descriptor clusters.
- Implemented `buildSeedCorpusProfiles` without mutating curated seed or corpus-analysis maps; seed descriptors stay curated and corpus-only descriptors are reviewable candidates.
- Implemented `scoreSemanticNoise` and `suggestCorpusSemanticNoise` with curated downweighting, seed exceptions, and review-only corpus suggestions.
- Implemented `buildDescriptorClusters` with seed-anchor and corpus-native cluster outputs, explicit co-occurrence/similarity membership signals, deterministic ordering, and sparse pair decoding.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wave 0 tests and inference contracts for seed/corpus boundaries** - `c085ace` (test)
2. **Task 2: Implement seed/corpus profile builder and semantic noise audit** - `faef464` (feat)
3. **Task 3: Implement deterministic descriptor clustering** - `23202da` (feat)

**Plan metadata:** pending final docs commit

_Note: Task 1 followed the RED gate with intentionally failing tests against not-yet-implemented functions; Tasks 2 and 3 are GREEN implementation commits._

## Files Created/Modified

- `src/types/inference.ts` - Inference output, review, noise audit, profile, and cluster contracts.
- `src/types/index.ts` - Exports Phase 5 inference types through the project type barrel.
- `src/inference/index.ts` - Barrel exports for Phase 5 inference functions and option types.
- `src/inference/types.ts` - Shared inference option types.
- `src/inference/noise.ts` - Pure semantic-noise scoring and corpus suggestion helpers.
- `src/inference/seed_profile.ts` - Pure seed/corpus profile builder with review queue outputs.
- `src/inference/descriptor_clusters.ts` - Deterministic seed-anchor and corpus-native descriptor clustering.
- `data/inference/semantic_noise.v1.json` - Explicit curated semantic-noise policy input.
- `src/tests/inference/seed_profile.test.ts` - Seed authority, corpus candidates, conflicts, and determinism tests.
- `src/tests/inference/noise.test.ts` - Noise downweight, seed exception, and review-only suggestion tests.
- `src/tests/inference/descriptor_clusters.test.ts` - Cluster-kind, membership-signal, and determinism tests.
- `src/tests/fixtures/inference/seed_corpus_conflict.json` - Seed/corpus conflict and candidate descriptor fixture.
- `src/tests/fixtures/inference/noise_and_clusters.json` - Semantic noise and clustering fixture data.

## Verification

- `cd src && npm run build` - passed
- `cd src && npm test -- tests/inference/seed_profile.test.ts tests/inference/noise.test.ts tests/inference/descriptor_clusters.test.ts` - passed (10 tests)

## Decisions Made

- Curated semantic noise is a versioned data input (`data/inference/semantic_noise.v1.json`) and not hidden inside scoring code.
- Corpus-derived noise suggestions are review-only and do not affect descriptor weights unless already present in the curated noise list.
- Corpus-native clusters remain candidates with `corpus_derived: true`; seed-anchor clusters use accepted seed-owned status.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed exact optional property typing for noise options**
- **Found during:** Task 2 (Implement seed/corpus profile builder and semantic noise audit)
- **Issue:** `npm run build` failed because optional properties were passed with explicit `undefined` values under `exactOptionalPropertyTypes`.
- **Fix:** Added a helper that conditionally includes optional noise option keys only when values are defined.
- **Files modified:** `src/inference/seed_profile.ts`
- **Verification:** `cd src && npm run build` and seed/noise tests passed.
- **Committed in:** `faef464`

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug).
**Impact on plan:** Required TypeScript strict-mode correctness; no scope expansion.

## Issues Encountered

- Graphify commit hooks updated generated files under `graphify-out/` after task commits. These were not part of plan 05-01 and were intentionally not staged.

## Known Stubs

None - no placeholder/TODO/unimplemented stubs remain in Phase 5 inference files. Empty arrays in implementation are local accumulators/default option values, not UI/data-source stubs.

## Threat Flags

None - no new network endpoints, auth paths, file access paths, schema migrations, or trust boundaries were introduced beyond the plan's inference-function boundaries.

## TDD Gate Compliance

- RED gate: `c085ace` (`test(05-01): add failing inference boundary tests`) produced failing tests due to planned functions not implemented.
- GREEN gate: `faef464` and `23202da` implemented the tested behavior and made all inference tests pass.
- REFACTOR gate: no separate refactor commit was needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for 05-02 dimensional calculators and explicit curated inputs.
- Phase 6 can consume Phase 5 profile/cluster contracts as reviewable inputs; no seed mutation occurs in this layer.

## Self-Check: PASSED

- Created files listed in key-files exist on disk.
- Task commits `c085ace`, `faef464`, and `23202da` exist in git history.
- Plan verification commands passed.

---
*Phase: 05-inference-engine*
*Completed: 2026-05-19*
