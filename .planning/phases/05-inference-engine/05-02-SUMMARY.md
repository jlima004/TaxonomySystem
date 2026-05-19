---
phase: 05-inference-engine
plan: 02
subsystem: inference-engine
tags: [typescript, vitest, inference, semantic-overlap, tradition-score, accord-compatibility, alias-evidence]

requires:
  - phase: 05-inference-engine
    provides: Seed/corpus profiles, descriptor clusters, and inference review contracts from 05-01
provides:
  - Normalized semantic overlap dimension with sorted shared descriptor evidence
  - Tradition dimension preserving curated relation, seed proximity, and corpus support as separated evidence
  - Accord compatibility dimension from explicit curated input data with missing entries as undefined
  - Weak alias evidence dimension that never canonicalizes seed descriptors
  - Versioned curated relation and accord JSON input placeholders
affects: [inference, similarity-scoring, phase-05-plan-03, phase-05-plan-04, phase-06-compilation]

tech-stack:
  added: []
  patterns:
    - Pure dimension calculators with explicit curated inputs
    - Lightweight curated JSON input validation before scoring
    - Missing optional dimensions return undefined rather than numeric zero

key-files:
  created:
    - src/inference/semantic_overlap.ts
    - src/inference/curated_input_validation.ts
    - src/inference/tradition_score.ts
    - src/inference/accord_compatibility.ts
    - src/inference/alias_evidence.ts
    - data/inference/curated_relations.v1.json
    - data/inference/accord_map.v1.json
    - src/tests/fixtures/inference/scoring_dimensions.json
    - src/tests/inference/semantic_overlap.test.ts
    - src/tests/inference/tradition_score.test.ts
    - src/tests/inference/accord_compatibility.test.ts
    - src/tests/inference/alias_evidence.test.ts
  modified:
    - src/types/inference.ts
    - src/inference/index.ts

key-decisions:
  - "Curated tradition and accord data remain explicit function inputs and versioned JSON files; calculators do not import data constants."
  - "Missing accord/tradition entries return undefined/neutral, not 0, preserving downstream renormalization semantics."
  - "Alias candidates are emitted only as weak evidence with canonical ids unchanged."

patterns-established:
  - "Dimension calculators return normalized score plus explainable evidence payloads."
  - "Curated input validators reject missing versions, non-array collections, empty ids, and out-of-range scores before scoring."
  - "TDD RED/GREEN sequence uses failing planned exports first, then minimal pure implementations."

requirements-completed: [INFR-03, INFR-04]

duration: 5 min
completed: 2026-05-19
---

# Phase 05 Plan 02: Calculadoras dimensionais e inputs curados explícitos Summary

**Normalized semantic overlap, tradition, accord, and weak alias evidence calculators with explicit validated curated inputs.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-19T16:32:54Z
- **Completed:** 2026-05-19T16:37:34Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments

- Added Wave 0 tests for semantic overlap, tradition score, accord compatibility, and dedicated weak alias evidence behavior.
- Implemented pure scoring dimensions with normalized scores in `[0,1]` and separated evidence payloads.
- Added explicit `data/inference/curated_relations.v1.json` and `data/inference/accord_map.v1.json` inputs without hardcoding domain relations in TypeScript calculators.
- Added curated input validation coverage for missing versions, non-array collections, empty ids, and out-of-range scores.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wave 0 scoring tests** - `0e1649f` (test)
2. **Task 2: Implement dimension calculators and explicit curated inputs** - `b10d59f` (feat)
3. **Task 2 validation acceptance coverage** - `089feea` (test)

**Plan metadata:** pending final docs commit

_Note: Task 1 followed the RED gate with intentionally failing tests against not-yet-exported planned calculators; Task 2 is the GREEN implementation plus validation coverage._

## Files Created/Modified

- `src/types/inference.ts` - Added dimension score/evidence and curated relation/accord input contracts.
- `src/inference/semantic_overlap.ts` - Computes weighted descriptor overlap with sorted shared descriptor evidence.
- `src/inference/curated_input_validation.ts` - Shared explicit curated input validation and pair-key helpers.
- `src/inference/tradition_score.ts` - Computes tradition evidence from curated relations, seed proximity, and corpus support.
- `src/inference/accord_compatibility.ts` - Computes accord compatibility from explicit accord maps, returning `undefined` when absent.
- `src/inference/alias_evidence.ts` - Computes weak alias evidence without mutating or canonicalizing profile descriptors.
- `src/inference/index.ts` - Exports the four dimension calculators.
- `data/inference/curated_relations.v1.json` - Versioned explicit curated relation input shell.
- `data/inference/accord_map.v1.json` - Versioned explicit curated accord input shell.
- `src/tests/fixtures/inference/scoring_dimensions.json` - Positive relation/accord fixture plus descriptor profiles and alias candidate.
- `src/tests/inference/*.test.ts` - Dimension behavior and validation coverage.

## Verification

- `cd src && npm run build` - passed
- `cd src && npm test -- tests/inference/semantic_overlap.test.ts tests/inference/tradition_score.test.ts tests/inference/accord_compatibility.test.ts tests/inference/alias_evidence.test.ts` - passed (11 tests)

## Decisions Made

- Curated relation and accord calculators validate explicit input objects at call time rather than importing bundled data files.
- Tradition score priority is curated relation first, then seed proximity, then corpus support, while retaining all available evidence separately.
- Alias evidence is deliberately dampened (`weak: true`) and exposes `canonical_ids_unchanged: true` for downstream review.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected Wave 0 semantic overlap expected score**
- **Found during:** Task 2 (Implement dimension calculators and explicit curated inputs)
- **Issue:** The initial RED test used an incorrect expected weighted-Jaccard value for the fixture.
- **Fix:** Updated the expected score to `0.4`, matching `sum(min(shared weights)) / sum(max(union weights))` while preserving the plan's normalized overlap behavior.
- **Files modified:** `src/tests/inference/semantic_overlap.test.ts`
- **Verification:** Plan-level build and dimension tests passed.
- **Committed in:** `b10d59f`

**2. [Rule 2 - Missing Critical] Added explicit validation acceptance coverage**
- **Found during:** Task 2 (Implement dimension calculators and explicit curated inputs)
- **Issue:** Calculator validation existed, but acceptance criteria required proving rejection of missing `version`, non-array `relations`/`accords`, empty ids, and out-of-range scores.
- **Fix:** Added relation and accord tests covering each malformed curated input class.
- **Files modified:** `src/tests/inference/tradition_score.test.ts`, `src/tests/inference/accord_compatibility.test.ts`
- **Verification:** Plan-level build and dimension tests passed.
- **Committed in:** `089feea`

---

**Total deviations:** 2 auto-fixed (1 Rule 1 bug, 1 Rule 2 missing critical validation proof).
**Impact on plan:** Both fixes tightened correctness and acceptance coverage without expanding scope beyond plan 05-02.

## Issues Encountered

- Graphify hooks continued to update `graphify-out/` generated files after commits. These files were unrelated to plan 05-02 and intentionally left unstaged.

## Known Stubs

None - empty arrays in `data/inference/curated_relations.v1.json` and `data/inference/accord_map.v1.json` are intentional baseline explicit input shells required by the plan; positive relation/accord fixture coverage lives in `scoring_dimensions.json`.

## Threat Flags

None - no new network endpoints, auth paths, file access patterns, schema migrations, or additional trust boundaries were introduced beyond the plan's curated JSON input boundary.

## TDD Gate Compliance

- RED gate: `0e1649f` (`test(05-02): add failing dimension scoring tests`) produced failing tests because planned calculator exports did not exist yet.
- GREEN gate: `b10d59f` implemented the calculator exports and made dimension tests/build pass.
- REFACTOR gate: no separate refactor commit was needed; `089feea` added validation acceptance coverage.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for 05-03 final-score composition and available-dimension weight renormalization.
- 05-03 can consume dimension calculators and explicit curated inputs without needing to interpret missing tradition/accord data as zero.

## Self-Check: PASSED

- Created files listed in key-files exist on disk.
- Task commits `0e1649f`, `b10d59f`, and `089feea` exist in git history.
- Plan verification commands passed.

---
*Phase: 05-inference-engine*
*Completed: 2026-05-19*
