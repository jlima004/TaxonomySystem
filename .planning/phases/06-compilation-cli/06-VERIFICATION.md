---
phase: 06-compilation-cli
verified: 2026-05-21T17:29:03Z
status: passed
score: 20/20 must-haves verified
overrides_applied: 0
---

# Phase 6: Compilation & CLI Verification Report

**Phase Goal:** Unir tudo e materializar a taxonomia v1 pronta para ser consumida pela próxima camada de inteligência.
**Verified:** 2026-05-21T17:29:03Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Executar o CLI gera 3 arquivos (`taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`) | ✓ VERIFIED | `cd src && npm run compile -- --generated-at "2026-01-01T00:00:00.000Z"` exited 0 and wrote all three files to `../data/compiled/v1/`. |
| 2 | Output segue rigidamente os schemas predefinidos, sem `null`/`undefined` em locais não permitidos | ✓ VERIFIED | `validateAllOutputs()` against generated files returned `{ok:true, errors:0, warnings:0}`; independent traversal found `nulls=0`, `undefined=0`, trailing newline in all 3 artifacts. |
| 3 | Validadores retornam structured errors com artifact name, JSON path, error code e message | ✓ VERIFIED | `CompilerValidationError` contains `artifact`, `code`, `path`, `message`; tests in `validate_output.test.ts` pass in full suite. |
| 4 | No `null` nos outputs a menos que schema permita | ✓ VERIFIED | `findNullsDeep()` used by all validators; generated artifacts scan found zero nulls. |
| 5 | Campos opcionais são omitidos, não serializados como null | ✓ VERIFIED | Generated outputs have no nulls; `writeJsonDeterministic()` serializes object payloads only after validator success. |
| 6 | Zero runtime dependencies — validators/compiler/CLI use TypeScript and Node built-ins only | ✓ VERIFIED | `src/package.json` has no `dependencies`; only `devDependencies`. Source imports are local modules and `node:*` built-ins. |
| 7 | Validators follow existing `src/types/taxonomy.ts` and `src/types/similarity.ts` output shapes | ✓ VERIFIED | Validators enforce taxonomy families/subfamilies/descriptors/stats and similarity threshold/dimensions/edges/review_queue/stats; generated artifacts validate successfully. |
| 8 | `CompiledAliases` is wrapper `{ version, schema_version, generated_at, aliases }` | ✓ VERIFIED | `src/compiler/types.ts` defines exact wrapper; `data/compiled/v1/descriptor_aliases.json` lines 2-5 show wrapper fields. |
| 9 | Alias validator uses wrapper format, not raw `Record<string,string>` | ✓ VERIFIED | `validateCompiledAliases()` requires `version`, `schema_version`, `generated_at`, and `aliases`; missing wrapper fields are errors. |
| 10 | `taxonomy.json` includes seed and corpus descriptors per subfamily, seed first, then corpus, sorted by id | ✓ VERIFIED | `compileTaxonomy()` builds seed descriptors then corpus descriptors and returns `[...seedDescriptors, ...corpusDescriptors]`; artifact spot-check found both source types and no seed after corpus. |
| 11 | `descriptor_aliases.json` uses wrapper and contains only curated seed aliases, never corpus candidates | ✓ VERIFIED | `compileAliases(aliasSeed, ...)` only consumes alias seed; generated alias artifact has 7 mappings matching seed count and wrapper fields. |
| 12 | `similarity_matrix.json` preserves edges, dimensions, evidence, review_queue, and stats from SimilarityGraph | ✓ VERIFIED | `compileAll()` assigns `similarity = buildSimilarityGraph(...)`; generated artifact has dimensions, edges, review_queue, stats with `edge_count === edges.length`. |
| 13 | `semantic_noise.v1.json` is explicit pipeline input passed to `buildSeedCorpusProfiles` | ✓ VERIFIED | CLI loads `args.noisePath`; `compileAll()` maps `inputs.noiseConfig` to `curatedNoiseDescriptors`/`downweightValue` and calls `buildSeedCorpusProfiles`. |
| 14 | All-or-nothing: if validation fails, no file is written and non-zero is returned | ✓ VERIFIED | `writeCompileResults()` throws before `mkdir/write` when `!result.ok`; `src/tests/cli/compile.test.ts` asserts validation failure returns 1 and writes no output. |
| 15 | Escrita via temp-file + rename | ✓ VERIFIED | `writeCompileResults()` writes `.taxonomy.json.tmp`, `.descriptor_aliases.json.tmp`, `.similarity_matrix.json.tmp`, then `rename()`s to final names. |
| 16 | Arquivos não relacionados no output dir são preservados | ✓ VERIFIED | Writer never deletes output dir contents; `compile_all.test.ts` creates `keep.txt` and verifies it remains after write. |
| 17 | Output deterministic: stable sorting, injectable `--generated-at`, pretty JSON + trailing newline | ✓ VERIFIED | Determinism command diffed all 3 outputs across two fixed-timestamp runs with no differences; writer uses `JSON.stringify(payload, null, 2) + '\n'`. |
| 18 | CLI via compiled JS, no `npx tsx` | ✓ VERIFIED | `src/package.json` script is `compile: node dist/cli/compile.js`; grep found no `tsx` usage in compiler/CLI. |
| 19 | `--generated-at <iso>` flag works; default is current UTC in CLI only | ✓ VERIFIED | `parseCompileArgs()` parses/validates `--generated-at`; `runCompileCli()` resolves `args.generatedAt ?? new Date().toISOString()`; grep found `new Date()` only in CLI. |
| 20 | Phase requirements COMP-01..COMP-04 are all implemented and covered | ✓ VERIFIED | COMP-01 taxonomy compiler/artifact; COMP-02 aliases compiler/artifact; COMP-03 similarity graph artifact; COMP-04 validators. See requirements table below. |

**Score:** 20/20 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `src/compiler/types.ts` | Shared compiler types, alias wrapper, helpers | ✓ VERIFIED | Exports `CompiledAliases`, validation result/error, `makeCompilerError`, `combineResults`, `findNullsDeep`; substantive and imported by validators/compiler. |
| `src/compiler/validate_output.ts` | Validators for taxonomy, aliases, similarity, all outputs | ✓ VERIFIED | Substantive validators with deep null rejection and invariant checks; wired through `compileAll()` and tests. |
| `src/compiler/compile_taxonomy.ts` | Generates `CompiledTaxonomy` | ✓ VERIFIED | Implements seed/corpus descriptor placement, stats, sorting, generatedAt injection; output artifact validates. |
| `src/compiler/compile_aliases.ts` | Generates wrapper aliases from seed | ✓ VERIFIED | Builds sorted alias map from `DescriptorAliasSeed` only. |
| `src/compiler/compile_all.ts` | Pure orchestration | ✓ VERIFIED | Integrates analysis, noise config, taxonomy, aliases, similarity, validation; no filesystem I/O. |
| `src/compiler/write_outputs.ts` | Validating deterministic writer | ✓ VERIFIED | Validates before write, temp-file + rename, cleanup temps, trailing newline. |
| `src/cli/parse_args.ts` | Manual zero-dependency CLI parser | ✓ VERIFIED | Handles all planned flags and validation for generated-at. |
| `src/cli/compile.ts` | Compiled-JS CLI entrypoint | ✓ VERIFIED | Loads inputs, analyzes corpus, compiles, validates, writes outputs; integration-tested. |
| `src/compiler/index.ts`, `src/cli/index.ts` | Barrel exports | ✓ VERIFIED | Export public compiler and CLI API. |
| `src/tests/compiler/*.test.ts`, `src/tests/cli/*.test.ts` | Unit/integration coverage | ✓ VERIFIED | Full suite: 43 files, 294 tests passed. |
| `data/compiled/v1/taxonomy.json` | Generated taxonomy v1 | ✓ VERIFIED | 3 families, 6 subfamilies, 366 descriptors, schema-valid. |
| `data/compiled/v1/descriptor_aliases.json` | Generated alias wrapper | ✓ VERIFIED | 7 curated mappings, schema-valid wrapper. |
| `data/compiled/v1/similarity_matrix.json` | Generated sparse similarity graph | ✓ VERIFIED | Threshold 0.25, 4 dimensions, 0 edges, review queue/stats present and schema-valid. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `src/cli/compile.ts` | input data files | loaders + `readFile()` | ✓ WIRED | Loads seed, aliases, corpus, relations, accords, noise before compilation. |
| `src/cli/compile.ts` | `compileAll()` | direct import/call | ✓ WIRED | Passes seed, aliasSeed, analysis, graphInputs, noiseConfig, version, generatedAt, threshold. |
| `compileAll()` | `buildSeedCorpusProfiles()` | `profileOptions` from noise config | ✓ WIRED | Explicitly passes `curatedNoiseDescriptors` and `downweightValue`. |
| `compileAll()` | validators | `validateAllOutputs()` | ✓ WIRED | `result.ok` is validation result; writer refuses invalid results. |
| `compileAll()` | `buildSimilarityGraph()` | direct import/call | ✓ WIRED | Similarity payload comes from graph builder with threshold/generatedAt. |
| `writeCompileResults()` | output artifacts | temp files then `rename()` | ✓ WIRED | Writes three temp files and renames to final names. |
| `src/package.json` | compiled CLI | `node dist/cli/compile.js` | ✓ WIRED | `npm run compile` executes built JS and generated artifacts successfully. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|---|---|---|---|---|
| `taxonomy.json` | `families`, descriptors, stats | `loadTaxonomySeed()` + `loadCorpus()` → `analyzeCorpus()` → `buildSeedCorpusProfiles()` → `compileTaxonomy()` | Yes: generated 3 families / 366 descriptors | ✓ FLOWING |
| `descriptor_aliases.json` | `aliases` | `loadAliasSeed()` → `compileAliases()` | Yes: generated 7 curated mappings | ✓ FLOWING |
| `similarity_matrix.json` | `dimensions`, `edges`, `review_queue`, `stats` | `buildSimilarityGraph()` with relations/accords/analysis | Yes: valid sparse graph; 0 edges is data-derived from empty curated relations/accord inputs, not a stub | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|---|---|---|---|
| Build emits compiled JS | `cd src && npm run build` | exit 0 | ✓ PASS |
| Typecheck is clean | `cd src && npm run typecheck` | exit 0 | ✓ PASS |
| Test suite passes | `cd src && npx vitest run` | 43 files, 294 tests passed | ✓ PASS |
| CLI generates production artifacts | `cd src && npm run compile -- --generated-at "2026-01-01T00:00:00.000Z"` | exit 0; wrote three files | ✓ PASS |
| Deterministic output | two fixed-timestamp compiles to `/tmp/taxonomy-verification-run{1,2}` + `diff` for all 3 files | no diff output; command exit 0 | ✓ PASS |
| Generated artifacts validate | Node script importing `src/dist/compiler/validate_output.js` and running `validateAllOutputs()` | `{ok:true, errors:0, warnings:0}` | ✓ PASS |
| Generated artifacts contain no null/undefined | Node traversal of all 3 JSON artifacts | `nulls=0`, `undefined=0`, trailing newline true | ✓ PASS |

### Probe Execution

| Probe | Command | Result | Status |
|---|---|---|---|
| Conventional probes | `glob scripts/**/tests/probe-*.sh` | none found | SKIPPED |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| COMP-01 | `06-02-PLAN.md` | Compiler generates `taxonomy.json` (families, subfamilies, canonical descriptors) | ✓ SATISFIED | `compileTaxonomy()` implemented; `data/compiled/v1/taxonomy.json` generated with stats and descriptor invariants. |
| COMP-02 | `06-02-PLAN.md` | Compiler generates `descriptor_aliases.json` (alias mapping) | ✓ SATISFIED | `compileAliases()` implemented; generated wrapper has 7 curated mappings. |
| COMP-03 | `06-02-PLAN.md` | Compiler generates `similarity_matrix.json` (sparse graph, >0.25 threshold) | ✓ SATISFIED | `compileAll()` calls `buildSimilarityGraph()` with `threshold: 0.25`; generated graph has threshold/dimensions/edges/review_queue/stats. |
| COMP-04 | `06-01-PLAN.md` | Schema validator ensures output JSONs match defined types | ✓ SATISFIED | `validateCompiledTaxonomy`, `validateCompiledAliases`, `validateSimilarityGraph`, `validateAllOutputs`; generated outputs validate ok. |

No orphaned Phase 6 requirements found in `.planning/REQUIREMENTS.md`: COMP-01, COMP-02, COMP-03, COMP-04 are all claimed by phase plans and satisfied.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---:|---|---|---|
| `src/cli/compile.ts` | 20, 79-131 | `console.log` progress output | ℹ️ Info | Expected CLI user feedback, not stub behavior. |
| `src/cli/compile.ts` | 77 | `new Date()` | ℹ️ Info | Expected and intentionally isolated to CLI default `generatedAt`; compiler modules have no `new Date()`. |

No `TBD`, `FIXME`, `XXX`, `TODO`, `HACK`, `PLACEHOLDER`, or placeholder implementation markers were found in `src/compiler` or `src/cli`.

### Human Verification Required

None. This phase produces CLI/compiler artifacts with fully runnable automated checks; no visual, realtime, external-service, or subjective UX behavior requires human UAT.

### Gaps Summary

No blocking gaps found. The CLI, compiler, validators, tests, and generated artifacts substantively achieve the phase goal: materializing v1 taxonomy outputs for the next intelligence layer.

### Post-Verification Semantic Findings

These findings were recorded after Phase 6 technical verification. They do not change the Phase 6 status because the verified contract was structural validity, determinism, schema compliance and CLI compilation. They do constrain future curation/hardening work before treating v1 outputs as final curated semantic truth.

| Finding | Current v1 Observation | Future Hardening Direction |
|---|---|---|
| Noisy `olfactory.descriptors` | Corpus descriptors include technical/textual tokens such as `substantivity:400`, `substantivity:232`, `hour(s)`, `at`, `in`, `de`, `dipropylene`, `glycol`, `General comment At 100.00 %. lime`, `General comment At 0.10 % in dipropylene glycol. sulfurous`, `Odor strength none`, and `recommend smelling in a 10.00 % solution or less`. | Add descriptor sanitation before Phase 4 and separate olfactive descriptor text from comments, solvents, usage, concentration and substantivity metadata. |
| Semantic noise list too small | `data/inference/semantic_noise.v1.json` covers terms like `note`, `nuance`, `effect`, `type`, `quality`, but not real normalized corpus noise such as `at`, `in`, `de`, `hour_s`, `dipropylene`, `glycol`, `substantivity_*`, `general_comment_*`, `odor_strength_*`, `recommend_smelling_*`. | Evolve the input from a flat list into explicit categories such as `hard_exclude`, `pattern_exclude` and `downweight`, preserving Phase 5 compatibility. |
| Corpus candidate placement permissive | `compileTaxonomy` uses co-occurrence placement with default `minCooccurrenceSupport = 1`; current `taxonomy.json` has 366 descriptors, 21 seed descriptors and 345 corpus candidates. The artifact is hybrid and candidates are marked review-required rather than curated. | Raise placement evidence requirements, add normalized support/placement score, penalize semantic noise and route weak candidates to review instead of taxonomy. |
| Alias-aware statistics absent | Curated aliases are correctly emitted in `descriptor_aliases.json`, including `orange flower -> orange_blossom`, but `taxonomy.json` still shows `orange_blossom` with frequency 0. | Apply curated alias canonicalization before frequency/co-occurrence and seed profile generation; review zero-frequency seeds such as `bitter_orange`, `sweet_orange`, `jasmine`, `orange_blossom` and `tree_moss`. |
| Similarity graph empty due to empty curated inputs | `similarity_matrix.json` is valid but has `edges: []`, `review_queue: []` and `density: 0`; likely driven by empty `curated_relations.v1.json` and `accord_map.v1.json`. | Bootstrap curated relations/accords, add positive graph tests, and emit review warnings when curated graph inputs are empty. |
| Review queue underused | Phase 5/6 support `review_queue`, but current artifacts do not populate it with actual curation issues. | Add future review item types such as `seed_descriptor_zero_frequency`, `hard_excluded_descriptor_detected`, `corpus_candidate_low_support`, `corpus_candidate_high_frequency_generic`, `empty_curated_relations`, `empty_accord_map`, `alias_frequency_merge_opportunity`, `suspicious_descriptor_from_ingestion`, and `technical_token_in_descriptor_field`. |
| Seed taxonomy small | Current seed has 3 families, 6 subfamilies and 21 seed descriptors, sufficient for MVP validation but too small to distribute noisy corpus candidates well. | Evaluate future taxonomy expansion candidates including Gourmand, Spicy, Green, Fruity, Animalic, Amber/Resinous, Marine/Ozonic, Musky and Leather/Tobacco. |

---

_Verified: 2026-05-21T17:29:03Z_
_Verifier: the agent (gsd-verifier)_
