# Phase 11 Rollback, Validation, And Release Gates

## Scope: Future-Only Runbook

This document implements PROMO-09 and PROMO-10 as planning-only guidance for a separate future promotion phase.

- All commands below are future-only examples and require separate approval before use.
- Phase 11 does not execute rollback, does not execute default switching, and does not mutate protected code/data/artifact paths.

## Rollback Principles

For PROMO-09 and PROMO-D-43 through PROMO-D-47:

- Rollback must be documented and testable before any future switch.
- **git-only rollback is insufficient** as the primary rollback strategy.
- Rollback must restore runtime defaults and validate preserved v1 inputs/artifacts.
- No future promotion proceeds without approved rollback commands and validation gates.

## Rollback Restores

Future rollback must restore all required defaults:

- `seedPath` to `data/taxonomy/taxonomy-seed.v1.json`
- `relationsPath` to `data/inference/curated_relations.v1.json`
- `accordsPath` to `data/inference/accord_map.v1.json`
- `outputDir` to `data/compiled/v1`
- `version` to `1.0.0`

These values match current `DEFAULT_PATHS` baseline in `src/cli/parse_args.ts` and are mandatory rollback truth.

## Rollback Commands To Be Approved Separately

Future-only command categories (do not run in Phase 11):

1. Restore default-path settings to v1 values (`seedPath`, `relationsPath`, `accordsPath`, `outputDir`, `version`).
2. Validate protected v1 files and baseline artifacts still exist and were not deleted.
3. Re-run compile/tests against restored v1 defaults.
4. Confirm v2 is no longer configured as default after rollback.

Approval note: these commands require explicit approval in the future execution phase and are not executed here.

## Rollback Validation Checklist

Future rollback is considered valid only when all checks pass:

1. v1 compile pass.
2. Test suite pass.
3. `DEFAULT_PATHS` point to v1 defaults.
4. v1 input files exist:
   - `data/taxonomy/taxonomy-seed.v1.json`
   - `data/inference/curated_relations.v1.json`
   - `data/inference/accord_map.v1.json`
5. v1 compiled baseline exists: `data/compiled/v1`.
6. v2 is no longer default after rollback.
7. No protected v1 file was deleted.
8. `data/compiled/v1` plus v1 inputs remain available and auditable.

## Hard Gate Groups

For PROMO-10 and PROMO-D-48 through PROMO-D-53, future promotion requires all hard gate groups:

1. technical gates (typecheck/tests/build/compile/schema/quality/determinism)
2. curation traceability gates
3. alias gates
4. graph gates
5. review queue gates
6. protected files/default drift gates
7. migration gates
8. rollback gates
9. human approval gate

## Soft Gates Requiring Disposition

Before any future promotion, each soft finding must be dispositioned:

- low graph density
- high remaining review_queue
- increased `seed_corpus_conflict`
- inherited zero-frequency seeds
- remaining pending/deferred candidates
- legacy alias exceptions
- future curation backlog

## Release Checklist

Required 10-item checklist for future promotion:

1. readiness report approved
2. hard gates pass
3. soft findings have disposition
4. migration plan approved
5. rollback plan approved
6. expected diffs reviewed
7. v1/v2 artifacts compared
8. v1 baseline preserved
9. `data/compiled/v2` strategy defined
10. final human approval persisted

## Final Persisted Human Approval Policy

- Final persisted human approval is a hard gate.
- **chat approval is insufficient**.
- Promotion may occur only in a separate future phase when all hard gates pass and all soft gates are explicitly accepted, blocked, or assigned follow-up.

## Phase 11 Document Completion Matrix

| Requirement | Coverage artifact | Status |
|---|---|---|
| PROMO-09 | Rollback principles, restore targets, future-only rollback command categories, rollback checklist | covered |
| PROMO-10 | Hard/soft gates, release checklist, final persisted approval policy | covered |

## No-Switch Protected Path Verification

This plan remains documentation-only:

- `src/cli/parse_args.ts` unchanged
- `data/compiled/v1` unchanged
- `data/taxonomy/taxonomy-seed.v1.json` unchanged
- `data/inference/curated_relations.v1.json` unchanged
- `data/inference/accord_map.v1.json` unchanged
- `data/compiled/v2` remains nonexistent

No rollback or switch commands are executed in Phase 11.
