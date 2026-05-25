gate_4_result: pass
phase: 12-taxonomy-seed-v2-default-switch-execution
plan: 04
checked_at: 2026-05-25T02:17:00Z
default_v2_compile: pass
explicit_v1_fallback_compile: pass
protected_paths_clean: true
official_v2_diff_clean: true

# Phase 12 Gate 4 Post-Switch Validation

Gate 4 validated the post-switch CLI behavior after `DEFAULT_PATHS` moved atomically to v2.

## Commands

| Command | Result |
|---------|--------|
| `npm run typecheck` | pass |
| `npm test` | pass, 53 files and 373 tests |
| `npm run build` | pass |
| `node -e "import('./dist/cli/parse_args.js').then(...)"` | pass, built defaults match v2 |
| `npm run compile -- --generated-at 2026-01-01T00:00:00.000Z` | pass, wrote default v2 outputs to `../data/compiled/v2` |
| `npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase12-switch/post-switch-v1-fallback --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z` | pass, wrote explicit v1 fallback outputs to `/tmp/opencode/taxonomy-phase12-switch/post-switch-v1-fallback` |
| `git diff --exit-code -- data/compiled/v2 data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json` | pass |

## Default V2 Assertion

Built `DEFAULT_PATHS` values matched the approved v2 defaults before default compile:

| Field | Value |
|-------|-------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v2.json` |
| `relationsPath` | `data/inference/curated_relations.v2.json` |
| `accordsPath` | `data/inference/accord_map.v2.json` |
| `outputDir` | `data/compiled/v2` |
| `version` | `2.0.0` |

Default compile output summary:

| Artifact | Value |
|----------|-------|
| `data/compiled/v2/taxonomy.json` version | `2.0.0` |
| `generated_at` | `2026-01-01T00:00:00.000Z` |
| families | 10 |
| descriptors | 303 |
| review queue | 317 medium items |
| quality gate | PASS |

## Explicit V1 Fallback Assertion

The explicit v1 compile used only explicit v1 input flags and wrote to `/tmp/opencode/taxonomy-phase12-switch/post-switch-v1-fallback`, not `data/compiled/v1`.

Fallback output summary:

| Artifact | Value |
|----------|-------|
| `/tmp/opencode/taxonomy-phase12-switch/post-switch-v1-fallback/taxonomy.json` version | `1.0.0` |
| `generated_at` | `2026-01-01T00:00:00.000Z` |
| families | 3 |
| descriptors | 177 |
| review queue | 427 medium items |
| quality gate | PASS |

## Protected Diff Result

Protected paths and official artifacts remained diff-clean after validation:

- `data/compiled/v1`
- `data/compiled/v2`
- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v1.json`
- `data/inference/accord_map.v2.json`

## Validation Note

The first full `npm test` run exposed one stale pre-switch assertion in `src/tests/curation/taxonomy_seed_v2.test.ts` that expected v1 to remain the default seed path. That assertion was updated to the approved v2 default seed path, then the focused suite and full Gate 4 chain passed.

## Decision Trace

SWITCH-D-21, SWITCH-D-23, SWITCH-D-31, SWITCH-D-32, SWITCH-D-33, SWITCH-D-34, SWITCH-D-35, SWITCH-D-36, SWITCH-D-50, SWITCH-D-51, SWITCH-D-52, SWITCH-D-57, SWITCH-D-59, SWITCH-D-60, SWITCH-D-62, SWITCH-D-64.
