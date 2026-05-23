---
phase: 08-taxonomy-seed-expansion-curation
plan: 05
subsystem: validation
tags: [taxonomy, integration-test, comparison, report, quality-gates]

requires:
  - phase: 08-taxonomy-seed-expansion-curation
    provides: v2 seed, curated aliases, v2 curated relations, and v2 accord map
provides:
  - Automated deterministic v1-vs-v2 comparison guard test
  - Human-readable v1-vs-v2 curation comparison report with separated hard/soft findings
  - Phase 8 Nyquist validation sign-off
affects: [phase-08, validation, quality-gates]

tech-stack:
  added: []
  patterns: [Deterministic CLI explicit path compilation, Vitest file-backed integration tests, markdown comparison sidecar]

key-files:
  created:
    - src/tests/curation/v1_v2_comparison.test.ts
    - .planning/phases/08-taxonomy-seed-expansion-curation/curation/v1-v2-comparison.md
  modified:
    - .planning/phases/08-taxonomy-seed-expansion-curation/08-VALIDATION.md

key-decisions:
  - "Default CLI paths remain pointed at v1 artifacts; v2 candidate generation requires explicit CLI arguments."
  - "Quality gates separate hard errors from soft curation warnings, ensuring expected curation gaps (like empty edges for new subfamilies) don't fail the build by default."
  - "Soft findings like legacy alias mismatches and intentionally missing relation/accord scores are preserved for human curatorial review without blocking validation."

patterns-established:
  - "Side-by-side explicit-path deterministic compilation using `--generated-at`."
  - "Separation of validation findings into actionable curation warnings vs strict schema/determinism failures."

requirements-completed: [CUR-07]

duration: 16m 56s
completed: 2026-05-23
---

# Phase 8 Plan 05: Validation And Comparison Summary

**Validate Phase 8 output with deterministic v1-vs-v2 comparison, separating hard failures from soft curation warnings.**

## Performance

- **Duration:** 16m 56s
- **Started:** 2026-05-23T00:45:25Z
- **Completed:** 2026-05-23T01:03:00Z
- **Tasks:** 3
- **Files modified:** 2 created, 1 modified

## Accomplishments

- Added `src/tests/curation/v1_v2_comparison.test.ts` to enforce deterministic side-by-side compilation with explicit flags without modifying default paths.
- Ran v1 and v2 compilations pointing to temporary `/tmp/opencode/taxonomy-phase8-comparison/` output directories to prevent tracked artifact mutation.
- Generated a comprehensive Markdown comparison report detailing edge coverage, review queue quality, generic pressure, and alias metrics.
- Captured user-specified soft findings verbatim in the report regarding missing legacy alias targets, explicitly recorded gap rationale for `vanilla`, and the intentional minimal scope of v2.
- Updated `08-VALIDATION.md` to indicate full Nyquist compliance and Wave 0 completion for Phase 8.
- Paused at a human verification checkpoint, receiving explicit user approval before finalizing.

## Task Commits

1. **Task 1: Add deterministic v1-v2 comparison test** - `4ef3877` (test)
2. **Task 2: Produce v1-v2 curation comparison report** - `8987ce1` (docs)

**Plan metadata:** committed after summary/state updates.

## Files Created/Modified

- `src/tests/curation/v1_v2_comparison.test.ts` - New integration test guarding CLI deterministic behavior, default preservation, and quality gate separation.
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/v1-v2-comparison.md` - Generated human-readable curation validation sidecar.
- `.planning/phases/08-taxonomy-seed-expansion-curation/08-VALIDATION.md` - Validation strategy updated with requirement checkmarks and `nyquist_compliant: true`.

## Curation Outcome

- **Hard Failures:** None. Schema, determinism, and data invariants pass for both v1 and v2.
- **Soft Findings:** 
  1. Legacy `ylang ylang` alias points to a target not present in the minimal v2 seed.
  2. The new `vanilla` subfamily has no graph edges, correctly reflecting the manual relation/accord gap rather than a zero-filled placeholder.
  3. The v2 expansion is intentionally minimal (only adding `gourmand`/`vanilla`/`vanilla`).

## Verification

| Command / Check | Result |
|---|---|
| `cd src && npm run typecheck` | PASS |
| `cd src && npm test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts tests/curation/alias_seed_v2.test.ts tests/curation/relation_accord_v2.test.ts tests/curation/v1_v2_comparison.test.ts` | PASS — 25 tests |
| `cd src && npm run build` | PASS |
| Baseline v1 explicit path compilation | PASS — exit 0, outputs to `/tmp/opencode/taxonomy-phase8-comparison/v1-baseline` |
| Candidate v2 explicit path compilation | PASS — exit 0, outputs to `/tmp/opencode/taxonomy-phase8-comparison/v2-candidate` |
| Protected-file diff: `git diff -- data/taxonomy/taxonomy-seed.v1.json data/compiled/v1 src/cli/parse_args.ts` | PASS — no diff |

## Decisions Made

- Did not promote `v2-candidate` artifacts to `data/compiled/v1` or `data/compiled/v2`. The plan objective explicitly required compiling to temporary non-tracked paths.
- Did not mutate legacy aliases or add descriptors to resolve the `ylang ylang` soft finding, per user and curation instructions.

## Deviations from Plan

None.

## Known Stubs

None.

## Threat Flags

None. The comparison report is generated from local deterministic compiler execution over existing approved input files.

## User Setup Required

None.

## Next Phase Readiness

- Phase 8 execution is functionally complete.
- Human review of the Phase 8 comparison report has been granted.
- The project is ready to formally wrap Phase 8 and potentially plan Phase 9 (or sub-phases for further curation waves).

## Self-Check: PASSED

- Found `src/tests/curation/v1_v2_comparison.test.ts`.
- Found `.planning/phases/08-taxonomy-seed-expansion-curation/curation/v1-v2-comparison.md`.
- Found `08-VALIDATION.md` updated with compliance flags.
- Task commits exist in git history.
- Confirmed `data/taxonomy/taxonomy-seed.v1.json`, `src/cli/parse_args.ts`, and `data/compiled/v1/` remain completely unchanged.
