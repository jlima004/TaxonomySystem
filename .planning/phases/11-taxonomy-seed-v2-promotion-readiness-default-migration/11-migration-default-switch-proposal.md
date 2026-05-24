# Phase 11 Migration And Default-Switch Proposal

## Scope: Proposal Only

This document implements planning coverage for **PROMO-07** and **PROMO-08** as a proposal-only artifact.

- Phase 11 is documentation-only and does **not** execute migration.
- Phase 11 does **not** alter `DEFAULT_PATHS`.
- Phase 11 does **not** edit `src/cli/parse_args.ts`.
- Phase 11 does **not** create official `data/compiled/v2`.
- Any real default switch requires a separate future approved plan and final persisted human approval.

Linked readiness decisions: PROMO-D-32 through PROMO-D-42.

## Future Generated Artifact Strategy

For **PROMO-07** and **PROMO-D-37** through **PROMO-D-42**, the recommended future promotion strategy is:

1. Publish official v2 compiled artifacts under `data/compiled/v2`.
2. Preserve `data/compiled/v1` as baseline/archive.
3. Keep v1 inputs available for rollback to v1 defaults.
4. Require explicit future approval before any writes to official v2 paths.

This phase does not execute the strategy.

## Official Artifact Layout Proposal

Future approved promotion is expected to maintain this side-by-side official layout:

- `data/compiled/v1/taxonomy.json`
- `data/compiled/v1/descriptor_aliases.json`
- `data/compiled/v1/similarity_matrix.json`
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

`data/compiled/v1` remains preserved baseline/archive; it is not a replacement target for v2 writes.

## Side-By-Side Compile Strategy

Future execution must compile v1 and v2 to explicit non-default locations first (future-only dry-run validation), then publish only after all gates pass.

Future-only examples (do not run in Phase 11):

- `/tmp/opencode/taxonomy-phase11-readiness/v1-baseline`
- `/tmp/opencode/taxonomy-phase11-readiness/v2-candidate`

Any future command examples must stay under `/tmp/opencode/taxonomy-phase11-readiness/*` during readiness checks and must not write official paths in this phase.

## Phase 11 Forbidden Writes

Phase 11 must not write or alter:

- `src/cli/parse_args.ts`
- `data/compiled/v1`
- `data/taxonomy/taxonomy-seed.v1.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/accord_map.v1.json`
- `data/compiled/v2` (must remain nonexistent)

Creation of `data/compiled/v2` is future-only and requires a separate approved promotion plan plus final human approval.

## Current Defaults Inventory

Read-only inventory from `src/cli/parse_args.ts` (`DEFAULT_PATHS`):

| Field | Current default value |
|---|---|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` |
| `outputDir` | `data/compiled/v1` |
| `version` | `1.0.0` |

## Expected Future Diff Inventory

For **PROMO-08** and **PROMO-D-32** through **PROMO-D-36** plus **PROMO-D-52**, candidate future changes are listed as proposal rows only.

| Target | Current | Future proposal (separate phase only) | Phase 11 action |
|---|---|---|---|
| `src/cli/parse_args.ts` `seedPath` | `taxonomy-seed.v1.json` | switch to `taxonomy-seed.v2.json` | no change |
| `src/cli/parse_args.ts` `relationsPath` | `curated_relations.v1.json` | switch to `curated_relations.v2.json` | no change |
| `src/cli/parse_args.ts` `accordsPath` | `accord_map.v1.json` | switch to `accord_map.v2.json` | no change |
| `src/cli/parse_args.ts` `outputDir` | `data/compiled/v1` | switch to `data/compiled/v2` | no change |
| `src/cli/parse_args.ts` `version` | `1.0.0` | switch to `2.0.0` | no change |
| CLI docs | v1-default examples | update examples/flags for v2 default | no change |
| Release notes | no default-switch release record | add approved migration + rollback notes | no change |
| Default-output documentation | `data/compiled/v1` as default output | document versioned output strategy with v2 default | no change |

Phase 11 must not edit `src/cli/parse_args.ts` or documentation defaults.

## Future Promotion Commands To Be Approved Separately

All commands below are **future-only proposal commands** and require separate approval:

1. Pre-publish compile checks to temporary paths under `/tmp/opencode/taxonomy-phase11-readiness/*`.
2. Explicit pre-switch diff checks proving protected v1/default files remain unchanged.
3. Controlled publish to official v2 paths only after approval.
4. Rollback command set restoring v1 defaults if post-switch checks fail.

## Pre-Switch Validation Commands

Future-only validation examples (not executed in Phase 11):

- `test ! -d data/compiled/v2`
- `git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts`
- `test -d /tmp/opencode/taxonomy-phase11-readiness/v1-baseline`
- `test -d /tmp/opencode/taxonomy-phase11-readiness/v2-candidate`

## Post-Switch Validation Commands

Future-only post-switch checks for the separate promotion phase:

- verify `DEFAULT_PATHS` values match approved v2 defaults
- verify v1 baseline/archive files remain present and unchanged
- verify v2 official artifacts exist and are schema-valid
- verify rollback commands restore v1 defaults and pass validation

## Files That Must Never Be Removed

Never-remove protections for migration safety and rollback:

- `data/taxonomy/taxonomy-seed.v1.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/accord_map.v1.json`
- `data/compiled/v1`
- rollback instructions and rollback validation checklist artifacts

These protections remain mandatory before and after any future default switch.
