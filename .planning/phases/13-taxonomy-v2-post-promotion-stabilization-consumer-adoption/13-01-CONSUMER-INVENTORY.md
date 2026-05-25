# Phase 13 Plan 01 Consumer Inventory

**Plan:** 13-01  
**Created:** 2026-05-25  
**Scope:** read-only inventory and docs consistency audit for POST-01, POST-05 and POST-06.

## Search Scope

The inventory covered tracked repository surfaces under `README.md`, `src`, and `.planning`, excluding `src/node_modules` after the first fallback search showed dependency matches that are not in-repo consumers.

Targets came from POST-D-08, STAB-D-01, STAB-D-02 and STAB-D-04:

- `DEFAULT_PATHS`
- `taxonomy-seed.v1.json`
- `taxonomy-seed.v2.json`
- `curated_relations.v1.json`
- `curated_relations.v2.json`
- `accord_map.v1.json`
- `accord_map.v2.json`
- `data/compiled/v1`
- `data/compiled/v2`
- `version: 1.0.0`
- `version: 2.0.0`
- `npm run compile`
- `--seed`, `--relations`, `--accords`, `--out`, `--version`

## Command Run

Primary planned command:

```bash
rg -n "DEFAULT_PATHS|taxonomy-seed\.v1\.json|taxonomy-seed\.v2\.json|curated_relations\.v1\.json|curated_relations\.v2\.json|accord_map\.v1\.json|accord_map\.v2\.json|data/compiled/v1|data/compiled/v2|version: 1\.0\.0|version: 2\.0\.0|npm run compile|--seed|--relations|--accords|--out|--version" README.md src .planning
```

Result: `rg` was unavailable in this environment (`rg: command not found`), so the inventory used this equivalent tracked-file fallback:

```bash
git ls-files README.md src .planning | grep -Ev '^src/node_modules/' | xargs grep -nE "DEFAULT_PATHS|taxonomy-seed\.v1\.json|taxonomy-seed\.v2\.json|curated_relations\.v1\.json|curated_relations\.v2\.json|accord_map\.v1\.json|accord_map\.v2\.json|data/compiled/v1|data/compiled/v2|version: 1\.0\.0|version: 2\.0\.0|npm run compile|--seed|--relations|--accords|--out|--version"
```

The full fallback output was captured by the tool runner at `/home/jlima/.local/share/opencode/tool-output/tool_e5f81d7f7001RksrlYo1EhE4b0`.

## Inventory Findings

| surface | file | line | matched_target | reference_kind | classification | blocking | evidence | recommended_disposition |
|---|---|---:|---|---|---|---|---|---|
| Current user docs | `README.md` | 57 | `npm run compile` | default compile command | n/a | no | Current default is v2, so bare compile is coherent after Phase 12. | Keep; Plan 13-02 validates smoke behavior with `/tmp` override. |
| Current user docs | `README.md` | 69 | `data/compiled/v2`, `data/compiled/v1` | official artifacts | baseline/archive | no | README says v2 is default and v1 is baseline/archive. | Keep. |
| Current user docs | `README.md` | 73 | `taxonomy-seed.v2.json`, `data/compiled/v2`, `DEFAULT_PATHS` | promotion/default status | n/a | no | README says Phase 12 promoted v2 to operational default. | Keep. |
| Current user docs | `README.md` | 77-81 | `taxonomy-seed.v2.json`, `curated_relations.v2.json`, `accord_map.v2.json`, `data/compiled/v2`, `2.0.0` | v2 default contract | n/a | no | README lists current CLI/compiler defaults as v2. | Keep. |
| Current user docs | `README.md` | 83-90 | `data/compiled/v2`, `data/compiled/v1`, `taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json` | v2 official artifacts and v1 preserved inputs | baseline/archive | no | README says official v2 artifacts exist and v1 artifacts/inputs remain preserved. | Keep. |
| Current user docs | `README.md` | 98-103 | `data/compiled/v2`, `data/compiled/v1` | known limitation / versioned artifacts | baseline/archive | no | README says soft findings are not resolved and v2 does not physically replace v1. | Keep. |
| CLI source | `src/cli/parse_args.ts` | 15-24 | `DEFAULT_PATHS`, v2 seed/relation/accord/output/version | default source of truth | n/a | no | `DEFAULT_PATHS` points to `taxonomy-seed.v2.json`, `curated_relations.v2.json`, `accord_map.v2.json`, `data/compiled/v2`, version `2.0.0`. | Keep read-only; Plan 13-02 validates. |
| CLI source | `src/cli/parse_args.ts` | 33-43 | `--seed`, `--relations`, `--accords`, `--out`, `--version` | explicit CLI flags | explicit_fallback | no | Parser supports explicit override flags needed by v1 fallback. | Keep. |
| CLI source | `src/cli/compile.ts` | 15-32 | `npm run compile`, `DEFAULT_PATHS`, CLI flags | CLI help/default messaging | explicit_fallback | no | Help prints current dynamic defaults from `DEFAULT_PATHS` and documents explicit flags. | Keep; no source edit authorized. |
| CLI source | `src/cli/compile.ts` | 79 | `DEFAULT_PATHS`, output dir | default output resolution | n/a | no | Default output path maps to official v2 output when no override is provided; smoke plans must use `/tmp`. | Keep; Plan 13-02 validates with `/tmp`. |
| CLI source | `src/cli/index.ts` | 3 | `DEFAULT_PATHS` | exported API | n/a | no | CLI index exports default paths for tests/consumers. | Keep. |
| Compiler/inference source | `src/inference/build_similarity_graph.ts` | 178 | `curated_relations.v1.json`, `accord_map.v1.json` | issue metadata label | legacy_context | no | Label is generic legacy issue metadata for empty curated inputs, not current default behavior. | Keep; not a default/fallback consumer. |
| CLI tests | `src/tests/cli/parse_args.test.ts` | 2-51 | `DEFAULT_PATHS`, flags, `2.0.0` | argument/default contract tests | explicit_fallback | no | Tests verify default parse behavior and explicit CLI flags. | Keep. |
| CLI tests | `src/tests/cli/compile.test.ts` | 52-101 | explicit flags, `--version` | temporary compile fixtures | explicit_fallback | no | Tests use explicit temp fixture paths and output. | Keep. |
| Compiler tests | `src/tests/compiler/compile_all.test.ts` | 64-67 | `taxonomy-seed.v2.json` | curation guard | n/a | no | Test asserts compile does not create seed v2. | Keep. |
| Curation tests | `src/tests/curation/taxonomy_seed_v2.test.ts` | 42-43, 219-291 | `taxonomy-seed.v1.json`, `taxonomy-seed.v2.json`, `DEFAULT_PATHS` | v2 default and v1 preserved test | baseline/archive | no | Tests assert v2 default seed and v1 still present/versioned as `1.0.0`. | Keep. |
| Curation tests | `src/tests/curation/v1_v2_comparison.test.ts` | 78-99 | explicit flags, `DEFAULT_PATHS`, v2 defaults | v1/v2 comparison test | explicit_fallback | no | Tests compile v1 via explicit paths and assert v2 defaults. | Keep. |
| Curation tests | `src/tests/curation/alias_seed_v2.test.ts` | 35 | `taxonomy-seed.v2.json` | v2 curation contract | n/a | no | Test reads v2 seed as curated default candidate/current source. | Keep. |
| Curation tests | `src/tests/curation/relation_accord_v2.test.ts` | 29-31 | `taxonomy-seed.v2.json`, `curated_relations.v2.json`, `accord_map.v2.json` | v2 relation/accord contract | n/a | no | Test validates v2 curated inputs. | Keep. |
| Inference tests | `src/tests/inference/build_similarity_graph.test.ts` | 154, 198-200 | `curated_relations.v1.json`, `taxonomy-seed.v1.json`, `accord_map.v1.json` | legacy fixture / baseline input | legacy_context | no | Test fixture reads v1 baseline files for graph behavior. | Keep. |
| Current planning state | `.planning/STATE.md` | 103-110 | `data/compiled/v2`, `data/compiled/v1`, `DEFAULT_PATHS`, protected paths | current Phase 12/13 state | baseline/archive | no | State says v2 default is active, v1 preserved, and Phase 13 protects source/artifact paths. | Keep. |
| Current roadmap | `.planning/ROADMAP.md` | 242-263, 267-289, 456-472 | `DEFAULT_PATHS`, `data/compiled/v1`, `data/compiled/v2`, protected paths | current roadmap/status | baseline/archive | no | Roadmap says v2 default is active, v1 preserved, Phase 13 is stabilization only. Some progress rows still show 0/0 plans from pre-execution planning state. | Non-blocking planning-status follow-up; no edit in this plan. |
| Current requirements | `.planning/REQUIREMENTS.md` | 119-130, 261-267 | POST requirements | Phase 13 requirement status | n/a | no | Requirements define consumer audit, docs alignment and protected source policy. | Keep. |
| Phase 12 release docs | `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-RELEASE-MIGRATION-NOTES.md` | 7-65 | `DEFAULT_PATHS`, v2 defaults, v1 rollback defaults, explicit v1 fallback command | release/migration guidance | explicit_fallback | no | Release notes state v2 default, v1 preserved, and explicit v1 fallback command. | Keep. |
| Phase 12 rollback evidence | `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-5-ROLLBACK-DRY-RUN.md` | 1-17, 37-55, 80-127 | rollback v1 defaults and explicit v1 compile | explicit rollback evidence | explicit_fallback | no | Rollback was validated only in temporary context and main defaults remained v2. | Keep. |
| Phase 13 planning | `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/*` | multiple | all targets | active stabilization plan/context | baseline/archive | no | Phase 13 context/plans define the current inventory, smoke, policy and closure workflow. | Keep. |
| Historical Phase 2-7 planning | `.planning/phases/02-*` through `.planning/phases/07-*` | multiple | v1 seed/input/artifact paths and flags | historical implementation context | legacy_context | no | These files document original v1 builder and hardening work before v2 promotion. | Keep as historical planning record. |
| Historical Phase 8-10 planning | `.planning/phases/08-*` through `.planning/phases/10-*` | multiple | v1/v2 candidate paths, protected v1/default references, explicit comparison commands | historical curation context | legacy_context | no | These files document v2 candidate expansion before promotion and explicitly say defaults remained v1 at that time. | Keep as historical planning record. |
| Historical Phase 11 planning | `.planning/phases/11-*` | multiple | v2 promotion readiness, default switch proposal, v1 rollback and soft findings | migration-planning context | legacy_context | no | Documentation-only readiness/migration planning before the Phase 12 switch. | Keep as historical planning record. |
| Historical Phase 12 plans/gates | `.planning/phases/12-*` except release notes/rollback above | multiple | default switch commands, v1/v2 paths, artifact publication | release execution history | legacy_context | no | Phase 12 gate documents are historical evidence of the switch, not stale current guidance. | Keep. |
| Future backlog | `.planning/future/DATA-QUALITY-INFERENCE-HARDENING.md` | 16-85 | `data/compiled/v1`, `curated_relations.v1.json`, `accord_map.v1.json` | future/historical backlog | legacy_context | no | Backlog describes historical v1 semantic limitations and explicitly says not to mutate v1 inputs/artifacts now. | Keep as backlog evidence. |

## V1-Reference Classification Summary

Every v1 reference found by the inventory is classified as one of the allowed STAB-D-04 categories:

| classification | surfaces | result |
|---|---|---|
| `baseline/archive` | README, STATE, ROADMAP, Phase 13 context/preflight, requirements, current tests preserving v1 | Valid current references to preserved v1 inputs/artifacts or v1 baseline status. |
| `explicit_fallback` | CLI flags/help, Phase 12 release notes, Phase 12 rollback dry-run, CLI/parser tests, v1/v2 comparison tests | Valid references to complete explicit v1 fallback or CLI override behavior. |
| `legacy_context` | Historical Phase 2-12 planning docs, future backlog, graph fixture labels | Valid historical references that do not communicate current user-facing default state. |
| `stale_reference` | none found in current/user-facing docs | No current docs were found saying v1 is still default, removed, physically replaced, or resolved. |

## Docs Consistency Audit

Blocking scope per STAB-D-14 through STAB-D-18: README, CLI help/default strings, Phase 12 release/migration notes, Phase 13 context and preflight. Historical planning docs are treated as `legacy_context` unless they communicate current state incorrectly.

| rule | result | blocker | evidence | disposition |
|---|---|---|---|---|
| Current docs say or imply v1 is still default | pass | no | README lines 75-81 and Phase 12 release notes lines 7-15 list v2 defaults. CLI help uses dynamic `DEFAULT_PATHS`, which currently point to v2. | Keep. |
| Current docs say v1 was removed | pass | no | README line 90 and release notes line 33 state `data/compiled/v1` remains preserved. | Keep. |
| Current docs say v2 physically replaced `data/compiled/v1` | pass | no | README line 103 and release notes lines 33 and 87-88 explicitly deny physical replacement/removal. | Keep. |
| Current docs hide official `data/compiled/v2` | pass | no | README lines 83-88 and release notes lines 25-31 list official v2 artifacts. | Keep. |
| Current docs hide explicit v1 fallback | pass | no | README line 90 links rollback evidence; release notes lines 57-65 include the explicit v1 command. | Keep. |
| Current docs claim accepted soft findings were resolved | pass | no | README lines 98-102 and release notes lines 67-73 say soft findings remain accepted with policy. | Keep. |
| Current docs present Phase 13 as new curation | pass | no | Phase 13 context lines 27-46 and preflight lines 20-32 forbid curation and protected source edits. | Keep. |
| Current docs document a default compile path that writes to the wrong place | pass | no | README shows `npm run compile`; after Phase 12 this is coherent with v2 default. Plan 13-02 owns smoke validation with `/tmp` output to avoid official artifact writes during tests. | Keep; validate in 13-02. |

Messaging assertion: README and Phase 12 release notes state v2 default, preserved v1 baseline/archive and explicit v1 fallback. CLI help/default strings are sourced from `DEFAULT_PATHS`, which currently point to v2. Phase 13 context/preflight define stabilization-only execution and do not authorize curation.

## Follow-Ups

| type | item | reason | route |
|---|---|---|---|
| follow_up | ROADMAP progress still says Phase 13 has `0/0` plans and `not_ready_for_execution` in some status rows despite preflight approval and plan files existing. | Non-blocking planning status drift; not a user-facing default/fallback inconsistency. | Let GSD state/roadmap updates after execution reconcile, or address in later tracking cleanup. |
| follow_up | CLI help title still says `Taxonomy Compiler v1`. | Product/milestone label, not a default-path claim; could confuse readers but defaults printed below are v2. | Consider docs/help wording in a separate docs cleanup plan if desired. |

No active blockers were found for POST-01, POST-05 or POST-06.

## Protected-Boundary Confirmation

This plan audited files only. It did not edit source code, README, taxonomy inputs, compiled artifacts, `src/cli/parse_args.ts`, `graphify-out/*`, `.planning/STATE.md`, `.planning/ROADMAP.md` or `.planning/REQUIREMENTS.md`.

Allowed write performed by this artifact: `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-01-CONSUMER-INVENTORY.md`.

Protected diff verification is recorded in the plan summary after task verification.
