---
phase: 12-taxonomy-seed-v2-default-switch-execution
plan: 04
subsystem: taxonomy-defaults
tags: [taxonomy, default-paths, v2, validation]
requires:
  - phase: 12-taxonomy-seed-v2-default-switch-execution
    provides: Gate 2 official compiled v2 artifact publication
provides:
  - Atomic v2 DEFAULT_PATHS switch
  - Gate 3 source switch evidence
  - Gate 4 post-switch validation evidence
affects: [12-05-rollback-docs-closure]
key-files:
  created:
    - .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-3-DEFAULT-PATHS-SWITCH.md
    - .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-4-POST-SWITCH-VALIDATION.md
    - .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-04-SUMMARY.md
  modified:
    - src/cli/parse_args.ts
    - src/tests/curation/v1_v2_comparison.test.ts
    - src/tests/curation/taxonomy_seed_v2.test.ts
key-decisions:
  - "Switched all five approved DEFAULT_PATHS fields from v1 to v2 atomically."
  - "Preserved aliasPath, corpusPath, noisePath, parser behavior, v1 artifacts and seed/input files."
  - "Updated only stale/default-sensitive curation tests required for the post-switch contract."
commits:
  - d2a482d feat(cli): switch taxonomy defaults to v2
requirements-completed: [SWITCH-03, SWITCH-04, SWITCH-07, SWITCH-08, SWITCH-11]
completed: 2026-05-25
---

# Phase 12 Plan 04 Summary

**Gate 3 and Gate 4 passed: CLI compile defaults now point to v2, default v2 compile succeeds, explicit v1 fallback compile succeeds, and protected artifacts remain unchanged.**

## Accomplishments

- Changed exactly the five approved `DEFAULT_PATHS` defaults in `src/cli/parse_args.ts`: `seedPath`, `relationsPath`, `accordsPath`, `outputDir`, and `version`.
- Preserved `aliasPath`, `corpusPath`, `noisePath`, parser flags, generated-at validation, error handling and exports.
- Updated curation tests that asserted pre-switch v1 defaults so they now assert the approved v2 default contract.
- Recorded Gate 3 evidence in `12-GATE-3-DEFAULT-PATHS-SWITCH.md`.
- Recorded Gate 4 evidence in `12-GATE-4-POST-SWITCH-VALIDATION.md`.
- Verified default compile writes v2 outputs to `data/compiled/v2` without dirtying official artifacts.
- Verified explicit v1 compile writes to `/tmp/opencode/taxonomy-phase12-switch/post-switch-v1-fallback`, not `data/compiled/v1`.

## Verification

- `npm test -- tests/cli/parse_args.test.ts tests/curation/v1_v2_comparison.test.ts tests/curation/taxonomy_seed_v2.test.ts`: pass, 23 tests.
- `npm run typecheck`: pass.
- `npm test`: pass, 53 files and 373 tests.
- `npm run build`: pass.
- Built `DEFAULT_PATHS` import assertion: pass.
- Default v2 compile with fixed `generated_at`: pass.
- Explicit v1 fallback compile to `/tmp`: pass.
- Protected path diff check: pass.

## Deviations from Plan

- `src/tests/curation/taxonomy_seed_v2.test.ts` also required a narrow update because the full suite still contained a pre-switch assertion that v1 was the default seed path. The change is limited to the approved v2 default assertion and preserves the separate test proving v1 remains present and versioned as `1.0.0`.

## Next Phase Readiness

Plan 12-05 may proceed after this default switch and post-switch validation evidence is reviewed.

---
*Phase: 12-taxonomy-seed-v2-default-switch-execution*
*Completed: 2026-05-25*
