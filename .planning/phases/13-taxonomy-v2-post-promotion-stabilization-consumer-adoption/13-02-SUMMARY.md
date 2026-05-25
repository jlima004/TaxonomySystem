---
phase: 13-taxonomy-v2-post-promotion-stabilization-consumer-adoption
plan: 02
subsystem: runtime-smoke-validation
tags: [taxonomy-v2, smoke-validation, cli-defaults, v1-fallback, protected-diff]
requires:
  - phase: 13-taxonomy-v2-post-promotion-stabilization-consumer-adoption
    plan: 01
    provides: classified consumer/default/path/artifact inventory and no active smoke blockers
provides:
  - default-v2 smoke compile evidence under /tmp
  - explicit-v1 fallback smoke compile evidence under /tmp
  - protected diff evidence for official artifacts, inputs and parse_args defaults
affects: [phase-13, post-promotion-stabilization, cli-runtime-confidence]
tech-stack:
  added: []
  patterns: [bounded-smoke-output, protected-diff-gate, evidence-only-plan]
key-files:
  created:
    - .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-02-SMOKE-VALIDATION.md
    - .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-02-SUMMARY.md
  modified: []
key-decisions:
  - "Default CLI/compiler behavior remains coherent with v2 DEFAULT_PATHS and can compile to /tmp/opencode/taxonomy-phase13-smoke/default-v2."
  - "Explicit v1 fallback works with complete flags and writes only to /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback."
  - "Official v1/v2 compiled artifacts, seed/inference/alias inputs and src/cli/parse_args.ts remained diff-clean."
patterns-established:
  - "Smoke compiles must force /tmp output and be paired with protected pre/post diff gates."
requirements-completed: [POST-02, POST-03, POST-04, POST-06]
duration: "~3 min"
completed: 2026-05-25
---

# Phase 13 Plan 02: Smoke Validation Summary

**Runtime smoke validation passed for v2 default and explicit v1 fallback without protected-path drift.**

## Performance

- **Started:** 2026-05-25T14:35:55Z
- **Completed:** 2026-05-25T14:37:27Z
- **Tasks:** 3
- **Files modified:** 2 Phase 13 evidence docs only

## Accomplishments

- Ran `npm run typecheck`, `npm test` and `npm run build` from `src/` in the requested order.
- Asserted compiled `DEFAULT_PATHS` still point to v2 seed, v2 relations, v2 accords, `data/compiled/v2` and version `2.0.0`.
- Ran default-v2 smoke compile only to `/tmp/opencode/taxonomy-phase13-smoke/default-v2` with fixed `generated_at`.
- Ran explicit-v1 fallback smoke compile only to `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback` with complete explicit v1 flags and fixed `generated_at`.
- Verified both smoke output directories contain `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json` with expected versions.
- Ran protected diff gates before validation, after validation, after default smoke and after explicit fallback.

## Files Created/Modified

- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-02-SMOKE-VALIDATION.md` - command evidence, output assertions and protected diff results.
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-02-SUMMARY.md` - plan close-out summary.

## Verification

- `cd src && npm run typecheck` - pass.
- `cd src && npm test` - pass, 53 test files and 373 tests passed.
- `cd src && npm run build` - pass.
- `cd src && npm run compile -- --out /tmp/opencode/taxonomy-phase13-smoke/default-v2 --generated-at 2026-01-01T00:00:00.000Z` - pass, `taxonomy.json.version = 2.0.0`.
- `cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z` - pass, `taxonomy.json.version = 1.0.0`.
- `git diff --exit-code -- data/compiled/v1 data/compiled/v2 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json src/cli/parse_args.ts` - pass.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Preexisting dirty `graphify-out/*` files remain in the working tree and were not touched, staged, reverted or included in this plan.

## User Setup Required

None.

## Next Phase Readiness

Ready for Phase 13 Plan 03 generated artifact contamination policy work. Plan 13-02 leaves default-v2 and explicit-v1 fallback smoke evidence complete with protected diff clean.
