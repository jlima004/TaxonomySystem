# Phase 13 Plan 02 Smoke Validation

**Plan:** 13-02  
**Created:** 2026-05-25  
**Scope:** safe CLI/runtime smoke validation for post-promotion v2 default and explicit v1 fallback.  
**Smoke root:** `/tmp/opencode/taxonomy-phase13-smoke`

## Protected Preflight

Command:

```bash
git diff --exit-code -- data/compiled/v1 data/compiled/v2 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json src/cli/parse_args.ts
```

Result: exit code 0. No diff in protected v1/v2 compiled artifacts, seed inputs, alias seed, inference inputs or `src/cli/parse_args.ts`.

## Validation Suite

All commands were run from `src/` in this order. No package install, watch-mode command, curation command, `graphify-out/*` mutation or official compiled artifact write was run.

| timestamp_utc | command | exit_code | concise result |
|---|---|---:|---|
| 2026-05-25T14:35:55Z | `npm run typecheck` | 0 | `tsc --noEmit` completed with no diagnostics. |
| 2026-05-25T14:35:55Z | `npm test` | 0 | Vitest completed: 53 test files passed, 373 tests passed. |
| 2026-05-25T14:36:10Z | `npm run build` | 0 | `tsc` completed successfully. |

Post-validation protected diff command:

```bash
git diff --exit-code -- data/compiled/v1 data/compiled/v2 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json src/cli/parse_args.ts
```

Result: exit code 0.

## Default V2 Assertion

Command run from `src/` after build:

```bash
node -e "import('./dist/cli/parse_args.js').then(({DEFAULT_PATHS})=>{const expected={seedPath:'data/taxonomy/taxonomy-seed.v2.json',relationsPath:'data/inference/curated_relations.v2.json',accordsPath:'data/inference/accord_map.v2.json',outputDir:'data/compiled/v2',version:'2.0.0'}; for (const [k,v] of Object.entries(expected)) if (DEFAULT_PATHS[k]!==v) throw new Error(k+'='+DEFAULT_PATHS[k]); console.log('defaults v2 ok')})"
```

Result: exit code 0, `defaults v2 ok`.

Asserted values:

| field | expected | result |
|---|---|---|
| `seedPath` | `data/taxonomy/taxonomy-seed.v2.json` | pass |
| `relationsPath` | `data/inference/curated_relations.v2.json` | pass |
| `accordsPath` | `data/inference/accord_map.v2.json` | pass |
| `outputDir` | `data/compiled/v2` | pass |
| `version` | `2.0.0` | pass |

## Default V2 Smoke Compile

Command run from `src/`:

```bash
npm run compile -- --out /tmp/opencode/taxonomy-phase13-smoke/default-v2 --generated-at 2026-01-01T00:00:00.000Z
```

Result: exit code 0.

Output directory: `/tmp/opencode/taxonomy-phase13-smoke/default-v2`.

Concise stdout summary:

- `precompile` ran `npm run build` successfully.
- Loaded v2 defaults: 10 families, 18 subfamilies, 14 curated relations, 19 curated accords.
- Compiled taxonomy: 10 families, 303 descriptors.
- Wrote only `/tmp/opencode/taxonomy-phase13-smoke/default-v2/taxonomy.json`, `/tmp/opencode/taxonomy-phase13-smoke/default-v2/descriptor_aliases.json` and `/tmp/opencode/taxonomy-phase13-smoke/default-v2/similarity_matrix.json`.
- `validation_status=ok`.
- `quality_gate_status=PASS`.

Artifact assertions:

| artifact | assertion | result |
|---|---|---|
| `/tmp/opencode/taxonomy-phase13-smoke/default-v2/taxonomy.json` | exists | pass |
| `/tmp/opencode/taxonomy-phase13-smoke/default-v2/descriptor_aliases.json` | exists | pass |
| `/tmp/opencode/taxonomy-phase13-smoke/default-v2/similarity_matrix.json` | exists | pass |
| `taxonomy.json.version` | `2.0.0` | pass |
| `taxonomy.json.generated_at` | `2026-01-01T00:00:00.000Z` | pass |
| `taxonomy.stats.family_count` | 10 | pass |
| `taxonomy.stats.descriptor_count` | 303 | pass |
| `similarity_matrix.stats.edge_count` | 13 | pass |
| `similarity_matrix.review_queue.length` | 317 | pass |

Post-default-smoke protected diff result: exit code 0 for the protected diff gate.

## Explicit V1 Fallback Smoke Compile

Command run from `src/`:

```bash
npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z
```

Result: exit code 0.

Output directory: `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback`.

Complete explicit fallback flags used:

- `--seed ../data/taxonomy/taxonomy-seed.v1.json`
- `--aliases ../data/taxonomy/descriptor_aliases.seed.json`
- `--relations ../data/inference/curated_relations.v1.json`
- `--accords ../data/inference/accord_map.v1.json`
- `--out /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback`
- `--version 1.0.0`
- `--generated-at 2026-01-01T00:00:00.000Z`

Concise stdout summary:

- `precompile` ran `npm run build` successfully.
- Loaded explicit v1 inputs: 3 families, 6 subfamilies, 6 curated relations, 5 curated accords.
- Compiled taxonomy: 3 families, 177 descriptors.
- Wrote only `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback/taxonomy.json`, `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback/descriptor_aliases.json` and `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback/similarity_matrix.json`.
- `validation_status=ok`.
- `quality_gate_status=PASS`.

Artifact assertions:

| artifact | assertion | result |
|---|---|---|
| `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback/taxonomy.json` | exists | pass |
| `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback/descriptor_aliases.json` | exists | pass |
| `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback/similarity_matrix.json` | exists | pass |
| `taxonomy.json.version` | `1.0.0` | pass |
| `taxonomy.json.generated_at` | `2026-01-01T00:00:00.000Z` | pass |
| `taxonomy.stats.family_count` | 3 | pass |
| `taxonomy.stats.descriptor_count` | 177 | pass |
| `similarity_matrix.stats.edge_count` | 6 | pass |
| `similarity_matrix.review_queue.length` | 427 | pass |

Independence assertion: pass. The fallback used complete explicit v1 paths and did not edit or depend on changing `DEFAULT_PATHS`; `DEFAULT_PATHS` were reasserted as v2 after the fallback compile.

## Final Protected Diff Gate

Command:

```bash
git diff --exit-code -- data/compiled/v1 data/compiled/v2 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json src/cli/parse_args.ts
```

Result: exit code 0.

Protected path assertion: pass. Official `data/compiled/v1`, official `data/compiled/v2`, v1/v2 taxonomy seeds, descriptor alias seed, v1/v2 curated relations, v1/v2 accord maps and `src/cli/parse_args.ts` remain diff-clean.

## Result

Plan 13-02 smoke validation passed:

- `npm run typecheck` passed.
- `npm test` passed.
- `npm run build` passed.
- Default v2 smoke compile wrote only to `/tmp/opencode/taxonomy-phase13-smoke/default-v2` and produced version `2.0.0` artifacts.
- Explicit v1 fallback wrote only to `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback` and produced version `1.0.0` artifacts.
- Protected source/input/artifact diff remained clean throughout.
