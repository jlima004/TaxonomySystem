---
phase: 10-taxonomy-seed-v2-expansion-round-3
plan: "04"
subsystem: data-curation
tags: [taxonomy, v2, validation, comparison, curation, round-3]

requires:
  - phase: 10-taxonomy-seed-v2-expansion-round-3
    provides: "10-03 approved Round 3 relation and accord inputs for v2 candidate validation"
provides:
  - "Round 3 v1-v2 comparison and validation report"
  - "Temporary explicit-path v1 baseline and v2 candidate compile outputs"
  - "Hard/soft gate validation that v2 remains candidate-only with v1/defaults preserved"
affects: [phase-10-validation, taxonomy-v2-candidate, promotion-readiness]

tech-stack:
  added: []
  patterns: ["temporary explicit-path compilation", "candidate-only validation report", "protected default diff gate"]

key-files:
  created:
    - .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md
    - .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-SUMMARY.md
  modified:
    - src/tests/curation/taxonomy_seed_v2.test.ts

key-decisions:
  - "Compiled v1 and v2 only to temporary /tmp/opencode comparison directories; no official v2 artifact was created."
  - "Kept v2 candidate-only and documented promotion readiness criteria as future-only."
  - "Recorded zero hard failures and documented soft findings for graph density, legacy ylang alias target, inherited zero-frequency seeds, and remaining review queue."

patterns-established:
  - "Round validation reports should cite actual temporary compile outputs, curation tests, determinism checks, and protected-file diff checks."
  - "Report metrics should distinguish hard gate failures from soft promotion-readiness findings."

requirements-completed: [EXP3-08]

duration: 13 min
completed: 2026-05-24
---

# Phase 10 Plan 04: Round 3 Validation Summary

**Candidate-only v1-v2 validation for Round 3, with temporary compiles, zero hard failures, and promotion criteria documented as future-only**

## Performance

- **Duration:** 13 min
- **Started:** 2026-05-24T07:14:35Z
- **Completed:** 2026-05-24T07:27:24Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Compiled v1 baseline and v2 Round 3 candidate to temporary comparison paths under `/tmp/opencode/taxonomy-phase10-comparison/`.
- Created the Round 3 comparison report with hard gates, soft findings, coverage counts, amber/resinous coverage, animalic coverage, fresh spice status, graph coverage, review queue quality, alias quality, zero-frequency seeds, and future promotion criteria.
- Verified curation tests pass, protected v1/default files are unchanged, no official `data/compiled/v2` exists, and v2 remains candidate-only.

## Metrics Captured

| Metric | v1 baseline | v2 Round 3 candidate | Delta |
|---|---:|---:|---:|
| Families | 3 | 10 | +7 |
| Subfamilies | 6 | 18 | +12 |
| Total compiled descriptors | 177 | 303 | +126 |
| Seed descriptors | 21 | 39 | +18 |
| Corpus-derived candidates | 156 | 264 | +108 |
| Review queue total | 427 | 317 | -110 |
| Input relations | 6 | 14 | +8 |
| Input accords | 5 | 19 | +14 |
| Compiled graph edges | 6 | 13 | +7 |

## Task Commits

Repository-file changes for Tasks 2 and the compile-blocking type fix were committed atomically:

1. **Task 1: Temporary v1/v2 compiles** - no repository commit; outputs are intentionally under `/tmp/opencode/taxonomy-phase10-comparison/`.
2. **Task 2: Round 3 comparison report** - `68c2463` (test/docs)
3. **Task 3: Curation validation and protected-file checks** - verified in working tree; no additional repository file changes required.

**Plan metadata:** pending final docs commit.

## Files Created/Modified

- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md` - Round 3 v1-v2 comparison and validation report.
- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-SUMMARY.md` - Execution summary.
- `src/tests/curation/taxonomy_seed_v2.test.ts` - Minimal type fix so the compile prebuild passes under `exactOptionalPropertyTypes`.

## Decisions Made

- Used only explicit compile commands with `--out /tmp/opencode/taxonomy-phase10-comparison/...`; did not run the default compile path.
- Treated the TypeScript test-helper type mismatch as a blocking compile issue and fixed it minimally without changing curation behavior.
- Kept all promotion criteria documented only; no default-path or official compiled artifact mutation was made.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Test helper optional property type blocked compile prebuild**

- **Found during:** Task 1 (temporary v1 compile)
- **Issue:** `npm run compile` runs `npm run build` first, and TypeScript failed because `ApprovedSeedEntry.round?: string` could not accept an explicitly returned `round: string | undefined` under `exactOptionalPropertyTypes`.
- **Fix:** Changed the helper type to `readonly round: string | undefined`, matching the parser's actual return shape for legacy and Round 3 approvals.
- **Files modified:** `src/tests/curation/taxonomy_seed_v2.test.ts`
- **Verification:** Re-ran both explicit compiles successfully, then ran `npm test -- tests/curation/` successfully.
- **Committed in:** `68c2463`

---

**Total deviations:** 1 auto-fixed (1 blocking).  
**Impact on plan:** The fix was required for the planned compile commands to run and did not alter runtime behavior or curation assertions.

## Issues Encountered

- Initial v1 temporary compile failed during `tsc` prebuild because of the test-helper type mismatch above; resolved with the minimal type fix.
- The report marker verification first attempted `rg`, but `rg` was not installed in the shell environment; re-ran the plan-specified `grep -q` checks successfully.
- Graphify hook/background rebuild changed unrelated `graphify-out/*` files during commit; those changes were preserved and not staged.

## Verification Results

- `npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase10-comparison/v1-baseline --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z` - PASS.
- `npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v2.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v2.json --accords ../data/inference/accord_map.v2.json --out /tmp/opencode/taxonomy-phase10-comparison/v2-candidate --version 2.0.0-round-3-candidate --generated-at 2026-01-01T00:00:00.000Z` - PASS.
- `cmp -s` across repeated v2 candidate artifacts - PASS.
- `test -d /tmp/opencode/taxonomy-phase10-comparison/v1-baseline && test -d /tmp/opencode/taxonomy-phase10-comparison/v2-candidate && test ! -d data/compiled/v2` - PASS.
- `grep -q` report marker checks for `amber/resinous coverage`, `animalic coverage`, `fresh spice status`, and `v2 remains candidate` - PASS.
- `cd src && npm test -- tests/curation/` - PASS (5 files, 28 tests).
- `git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts && test ! -d data/compiled/v2` - PASS.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 10 is complete: 4/4 plans executed.
- v2 remains candidate-only and is validated as a Round 3 candidate with zero hard failures.
- Any future v2 default promotion requires a separate approved migration/default-switch plan.

## Self-Check: PASSED

- Found expected report and summary files.
- Found task commit `68c2463`.
- Verified curation suite, temporary output paths, report markers, protected file diffs, and absence of `data/compiled/v2`.

---
*Phase: 10-taxonomy-seed-v2-expansion-round-3*
*Completed: 2026-05-24*
