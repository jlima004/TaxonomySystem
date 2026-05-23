---
phase: 09-taxonomy-seed-v2-expansion-round-2
plan: "04"
subsystem: curation-validation
tags: [taxonomy, curation, validation, compile, candidate-v2]

requires:
  - phase: 09-taxonomy-seed-v2-expansion-round-2
    provides: Round 2 v2 seed, relation, and accord candidate inputs from plans 09-01 through 09-03
provides:
  - v1-vs-v2-expanded comparison report with 10 validation metrics
  - candidate-only promotion readiness assessment for future default-switch planning
affects: [taxonomy-seed-v2, curation-reporting, future-promotion-readiness]

tech-stack:
  added: []
  patterns: [temporary compile outputs, fixed generated_at validation, protected-default drift check]

key-files:
  created:
    - .planning/phases/09-taxonomy-seed-v2-expansion-round-2/curation/v1-v2-comparison.md
    - .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-SUMMARY.md
  modified: []

key-decisions:
  - "v2-expanded remains candidate-only; defaults and protected v1 artifacts were verified unchanged."
  - "fresh_spice remains deferred because no approved seed endpoint exists, while vanilla is partially resolved through warm_spice."

patterns-established:
  - "Comparison validation compiles v1 and v2 to /tmp/opencode rather than writing into data/compiled/v1."
  - "Promotion readiness is documented as future criteria only and does not change CLI defaults."

requirements-completed: [EXP2-06, EXP2-07]

duration: 3m21s
completed: 2026-05-23
---

# Phase 09 Plan 04: v1-v2 Comparison Validation Summary

**Candidate v2 validation report with 10 metrics, zero hard failures, and confirmed preservation of v1 defaults/artifacts**

## Performance

- **Duration:** 3m21s
- **Started:** 2026-05-23T15:36:10Z
- **Completed:** 2026-05-23T15:39:31Z
- **Tasks:** 4/4 completed
- **Files modified:** 1 tracked report created, plus this summary

## Accomplishments

- Compiled v1 baseline to `/tmp/opencode/taxonomy-phase9-comparison/v1-baseline` and v2 candidate to `/tmp/opencode/taxonomy-phase9-comparison/v2-candidate` with fixed `generated_at` timestamps.
- Created `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/curation/v1-v2-comparison.md` documenting all 10 required validation metrics.
- Confirmed hard failures: none.
- Confirmed v2-expanded now includes green, fruity, and spicy coverage while `fresh_spice` remains absent/deferred.
- Confirmed the vanilla gap is partially resolved via `warm_spice` relation/accord coverage.
- Confirmed expected v2 input counts: `relation_count=11`, `accord_count=10`.
- Confirmed aliases have no Round 2 additions and `ylang ylang -> ylang_ylang` remains a deferred legacy alias soft finding.
- Ran all curation tests: 5 test files, 25 tests passed.
- Verified protected v1 artifacts and CLI defaults remained unchanged; v2 remains candidate, not default.

## Task Commits

1. **Task 1: Compile baselines and candidates to temporary directories** - no commit (temporary outputs only)
2. **Task 2: Generate Phase 9 v1-vs-v2 comparison report** - `6e51e6d` (docs)
3. **Task 3: Execute all curation validation tests** - no commit (verification only)
4. **Task 4: Verify protected files remain unchanged** - no commit (verification only)

**Plan metadata:** committed separately after state updates.

## Files Created/Modified

- `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/curation/v1-v2-comparison.md` - side-by-side v1/v2 validation report with the 10 agreed metrics, hard/soft gate outcomes, protected-file checks, and future promotion criteria.
- `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-SUMMARY.md` - execution summary and validation evidence for Plan 09-04.

## Validations Performed

- `npm run compile` for v1 using `taxonomy-seed.v1.json`, v1 relations, v1 accords, outputting only to `/tmp/opencode/taxonomy-phase9-comparison/v1-baseline`.
- `npm run compile` for v2 using `taxonomy-seed.v2.json`, v2 relations, v2 accords, outputting only to `/tmp/opencode/taxonomy-phase9-comparison/v2-candidate`.
- Report existence/content check for `Families`, `Subfamilies`, and `Review queue` sections.
- `npm test -- tests/curation/` from `src/`: 5 files and 25 tests passed.
- `git diff --exit-code data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` returned clean.
- Explicit default check confirmed `src/cli/parse_args.ts` still defaults to v1 seed, v1 relations, v1 accords, `data/compiled/v1`, and version `1.0.0`.

## Generated Temporary Directories

- `/tmp/opencode/taxonomy-phase9-comparison/v1-baseline`
- `/tmp/opencode/taxonomy-phase9-comparison/v2-candidate`

## Decisions Made

- v2 remains candidate-only; no default path, compiled v1 artifact, or CLI default was changed.
- `fresh_spice` remains absent/deferred because no approved seed endpoint exists in v2.
- The legacy alias `ylang ylang -> ylang_ylang` remains a soft finding/deferred cleanup rather than an automatic correction.

## Deviations from Plan

None - plan executed exactly as written.

## Auth Gates

None.

## Known Stubs

None.

## Threat Flags

None.

## Issues Encountered

None. Pre-existing uncommitted workspace changes unrelated to Plan 09-04 were left untouched.

## Deferred Issues

- Existing unrelated modified/untracked files were present before/during this plan and were not touched: `graphify-out/*`, `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md`, and `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-01-SUMMARY.md`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 9 validation is complete. Any future v2 default switch must be handled by a separate plan with explicit human approval and migration/rollback criteria.

## Self-Check: PASSED

- FOUND: `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/curation/v1-v2-comparison.md`
- FOUND: `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-SUMMARY.md`
- FOUND: task commit `6e51e6d`

---
*Phase: 09-taxonomy-seed-v2-expansion-round-2*
*Completed: 2026-05-23*
