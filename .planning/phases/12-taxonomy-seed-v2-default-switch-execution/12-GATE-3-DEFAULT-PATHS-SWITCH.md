gate_3_result: pass
phase: 12-taxonomy-seed-v2-default-switch-execution
plan: 04
checked_at: 2026-05-25T02:17:00Z
source_scope: src/cli/parse_args.ts DEFAULT_PATHS only
atomic_switch: true
protected_defaults_preserved: true

# Phase 12 Gate 3 DEFAULT_PATHS Switch

Gate 3 switched the CLI compile defaults from v1 to v2 after Gate 2 official v2 publication passed.

## Field Switch Table

| Field | Before | After |
|-------|--------|-------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` | `data/taxonomy/taxonomy-seed.v2.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` | `data/inference/curated_relations.v2.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` | `data/inference/accord_map.v2.json` |
| `outputDir` | `data/compiled/v1` | `data/compiled/v2` |
| `version` | `1.0.0` | `2.0.0` |

## Preserved Defaults

| Field | Value |
|-------|-------|
| `aliasPath` | `data/taxonomy/descriptor_aliases.seed.json` |
| `corpusPath` | `data/enriched_materials.json` |
| `noisePath` | `data/inference/semantic_noise.v1.json` |

## Diff Scope

- Modified `src/cli/parse_args.ts` only in the five approved `DEFAULT_PATHS` fields.
- Updated `src/tests/curation/v1_v2_comparison.test.ts` to assert the approved v2 defaults and version.
- Updated `src/tests/curation/taxonomy_seed_v2.test.ts` to replace the obsolete v1 default seed assertion with the approved v2 default seed assertion discovered during full post-switch validation.
- No parser flag behavior, generated-at validation, error handling, exports, seed/input files, or compiled artifacts were edited.

## Evidence Commands

- `git log --oneline --grep='build(data): publish compiled v2 taxonomy artifacts' -1`
- `cd src && npm test -- tests/cli/parse_args.test.ts tests/curation/v1_v2_comparison.test.ts`
- `node -e "const fs=require('fs'); const s=fs.readFileSync('src/cli/parse_args.ts','utf8'); const required=[\"seedPath: 'data/taxonomy/taxonomy-seed.v2.json'\",\"relationsPath: 'data/inference/curated_relations.v2.json'\",\"accordsPath: 'data/inference/accord_map.v2.json'\",\"outputDir: 'data/compiled/v2'\",\"version: '2.0.0'\"]; const preserved=[\"aliasPath: 'data/taxonomy/descriptor_aliases.seed.json'\",\"corpusPath: 'data/enriched_materials.json'\",\"noisePath: 'data/inference/semantic_noise.v1.json'\"]; for (const x of required.concat(preserved)) { if (!s.includes(x)) { console.error(x); process.exit(1); } }"`
- `git diff --exit-code -- data/compiled/v1 data/compiled/v2 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json`
- `node -e "const {execSync}=require('child_process'); const allowed=new Set(['src/cli/parse_args.ts','src/tests/curation/v1_v2_comparison.test.ts','src/tests/curation/taxonomy_seed_v2.test.ts','.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-3-DEFAULT-PATHS-SWITCH.md']); const files=execSync('git diff --name-only',{encoding:'utf8'}).trim().split(/\\n/).filter(Boolean); const bad=files.filter((f)=>!allowed.has(f)); if (bad.length) { console.error(bad.join('\\n')); process.exit(1); }"`

## Decision Trace

SWITCH-D-15, SWITCH-D-18, SWITCH-D-19, SWITCH-D-20, SWITCH-D-21, SWITCH-D-22, SWITCH-D-23, SWITCH-D-30, SWITCH-D-54.
