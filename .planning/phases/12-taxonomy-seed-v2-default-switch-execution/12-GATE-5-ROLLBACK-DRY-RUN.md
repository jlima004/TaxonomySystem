rollback_success: true
phase: 12-taxonomy-seed-v2-default-switch-execution
plan: 05
checked_at: 2026-05-25T02:34:04Z
temporary_context: /tmp/opencode/taxonomy-phase12-switch/rollback-worktree.3hTgEn
temporary_defaults_asserted: true
temporary_seedPath: data/taxonomy/taxonomy-seed.v1.json
temporary_relationsPath: data/inference/curated_relations.v1.json
temporary_accordsPath: data/inference/accord_map.v1.json
temporary_outputDir: data/compiled/v1
temporary_version: 1.0.0
temporary_v1_compile_exit: 0
temporary_targeted_tests_exit: 0
temporary_build_exit: 0
main_defaults_after_dry_run: v2
data_compiled_v2_preserved: true
data_compiled_v1_preserved: true

# Phase 12 Gate 5 Rollback Dry-Run

Gate 5 validated rollback behavior in a detached temporary worktree without permanently reverting the main branch and without deleting official v2 artifacts.

## Temporary Context

Rollback validation used this detached worktree:

```text
/tmp/opencode/taxonomy-phase12-switch/rollback-worktree.3hTgEn
```

Only the temporary worktree changed `src/cli/parse_args.ts`. The main working tree remained on the approved v2 defaults after the dry-run.

The ignored corpus file was linked into the temporary worktree so compile validation could run against the same local corpus without copying or editing repository data.

## Temporary Rollback Defaults

The temporary rollback context restored exactly these five default values:

| Field | Rollback value |
|-------|----------------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` |
| `outputDir` | `data/compiled/v1` |
| `version` | `1.0.0` |

Assertion command result: pass.

```bash
node -e "import('./src/dist/cli/parse_args.js').then(({DEFAULT_PATHS})=>{const expected={seedPath:'data/taxonomy/taxonomy-seed.v1.json',relationsPath:'data/inference/curated_relations.v1.json',accordsPath:'data/inference/accord_map.v1.json',outputDir:'data/compiled/v1',version:'1.0.0'}; for (const [key,value] of Object.entries(expected)) if (DEFAULT_PATHS[key]!==value) throw new Error(key + '=' + DEFAULT_PATHS[key]); console.log('temporary rollback defaults asserted')})"
```

## Validation Commands

The first full test run in the rollback context intentionally failed only the two post-switch tests that assert v2 must remain the default. This confirms the dry-run actually exercised v1 rollback defaults rather than silently leaving v2 in place.

```bash
npm run typecheck
```

Result: pass, exit 0.

```bash
npm test
```

Result: expected fail, exit 1. Failing assertions were limited to:

- `tests/curation/taxonomy_seed_v2.test.ts`: expected v2 default seed path.
- `tests/curation/v1_v2_comparison.test.ts`: expected v2 default path contract.

Rollback-compatible validation then passed:

```bash
npm run build && npm test -- tests/cli/parse_args.test.ts tests/compiler/validate_output.test.ts tests/curation/alias_seed_v2.test.ts tests/curation/relation_accord_v2.test.ts
```

Result: pass, 4 test files and 69 tests.

Explicit v1 compile command:

```bash
npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase12-switch/rollback-v1-validation --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z
```

Result: pass, exit 0.

## Rollback Output Metadata

`/tmp/opencode/taxonomy-phase12-switch/rollback-v1-validation` contains:

| File | SHA-256 |
|------|---------|
| `taxonomy.json` | `9df09661a556494211e910f95ffb8ad84cc579296bbc4007af831767289633c7` |
| `descriptor_aliases.json` | `b18be557a1d3a509985328b360827ae75983c6b03238107166b2061db3e18b1c` |
| `similarity_matrix.json` | `7500a84a6ce8d5cbe2963347c43e314a7fa2273528e4439e8de1814d9a768e1f` |

Compile summary:

| Metric | Value |
|--------|------:|
| families | 3 |
| descriptors | 177 |
| similarity edges | 6 |
| review queue | 427 medium items |
| validation status | ok |
| quality gate | PASS |

## Preservation Assertions

Official v2 artifacts remained present in the temporary worktree and in the main working tree:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

Official v1 artifacts remained present:

- `data/compiled/v1/taxonomy.json`
- `data/compiled/v1/descriptor_aliases.json`
- `data/compiled/v1/similarity_matrix.json`

Main branch defaults after dry-run were asserted as v2:

```bash
node -e "import('./src/dist/cli/parse_args.js').then(({DEFAULT_PATHS})=>{const expected={seedPath:'data/taxonomy/taxonomy-seed.v2.json',relationsPath:'data/inference/curated_relations.v2.json',accordsPath:'data/inference/accord_map.v2.json',outputDir:'data/compiled/v2',version:'2.0.0'}; for (const [key,value] of Object.entries(expected)) if (DEFAULT_PATHS[key]!==value) throw new Error(key + '=' + DEFAULT_PATHS[key]); console.log('main defaults remain v2')})"
```

Result: pass.

## Environment Note

The temporary worktree initially had no `node_modules`, so `npm run typecheck` failed with `tsc: not found` before validation could start. Dependencies were installed only inside the temporary worktree with `npm ci --ignore-scripts`; no dependency or lockfile changes were made in the main working tree.

## Gate Outcome

Gate 5 result: pass.

`rollback_success: true` is recorded because rollback defaults were asserted in a temporary context, v1 compile succeeded to `/tmp`, official v2 artifacts remained present, v1 baseline artifacts remained present, and the main working tree stayed on v2 defaults.

Decision trace: SWITCH-D-37, SWITCH-D-38, SWITCH-D-39, SWITCH-D-40, SWITCH-D-41, SWITCH-D-42, SWITCH-D-43, SWITCH-D-55, SWITCH-D-64.
