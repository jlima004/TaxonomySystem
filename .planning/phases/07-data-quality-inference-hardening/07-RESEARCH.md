# Phase 7: Data Quality & Inference Hardening - Research

**Researched:** 2026-05-21 [VERIFIED: system date]
**Domain:** TypeScript zero-runtime-dependency data-quality hardening for corpus analysis, inference scoring, compilation, and compiled JSON artifact quality gates [VERIFIED: .planning/phases/07-data-quality-inference-hardening/07-CONTEXT.md]
**Confidence:** HIGH for codebase structure and planning boundaries; MEDIUM for exact thresholds because they are locked by context but still need implementation validation against corpus effects [VERIFIED: codebase + CONTEXT.md]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

## Implementation Decisions

Downstream plans and research must use only the decision IDs in this `07-CONTEXT.md` as canonical. Earlier discussion summaries used a different temporary numbering sequence and must not be mixed into Phase 7 plans.

### Descriptor Sanitation
- **DQ-D-01:** Apply strict pre-analysis descriptor sanitation after `normalizeDescriptor` and before frequency, co-occurrence, alias candidate pool, seed/corpus profiles, and placement scoring. Hard-excluded technical descriptors do not enter Phase 4 statistics.
- **DQ-D-02:** Do not remove generic but valid olfactive descriptors in the sanitizer. Generic descriptors are handled by semantic noise downweighting, not sanitation removal.
- **DQ-D-03:** The initial hard-exclude terms are `at`, `in`, `de`, `hour_s`, `dipropylene`, and `glycol`.
- **DQ-D-04:** The initial pattern-exclude rules are `^substantivity_\\d+$`, `^general_comment_`, `^odor_strength_`, `^recommend_smelling_`, and `.*_at_\\d+_\\d+.*`.
- **DQ-D-05:** Sanitizer output must include deterministic audit trail entries with `raw`, `normalized`, `reason`, `matched_rule`, and source/material id when available. The analysis wrapper must preserve the original raw descriptor and pass an input object such as `sanitizeDescriptor({ raw, normalized, material_id, source })`; a sanitizer that receives only `normalized` is insufficient for auditability.
- **DQ-D-06:** Sanitizer must be a pure function with no I/O and no runtime dependencies.

### Semantic Noise Schema v2
- **DQ-D-07:** Evolve `semantic_noise.v1.json` into a categorized v2 schema with `hard_exclude`, `pattern_exclude`, `downweight`, and a default downweight value.
- **DQ-D-08:** Preserve compatibility with the flat v1 noise list by interpreting legacy noise descriptors as downweight entries with the default weight.
- **DQ-D-09:** Seed descriptors are protected from automatic downweighting. If a seed descriptor matches a noise rule, preserve its semantic weight and emit an audit warning/review item.
- **DQ-D-10:** Corpus-derived noise suggestions are review-only by default and must not alter weights automatically.
- **DQ-D-11:** `hard_exclude` is reserved for obvious technical/noisy descriptors, not valid olfactive descriptors.
- **DQ-D-12:** `downweight` reduces influence in clustering, placement, and scoring but does not remove the descriptor.

### Alias-Aware Analysis
- **DQ-D-13:** Apply curated aliases before statistics using the pipeline `normalizeDescriptor(raw) -> sanitizeDescriptor(normalized) -> canonicalizeDescriptor(normalized, aliasSeed) -> frequency/co-occurrence/alias pool/seed profiles`.
- **DQ-D-14:** `canonicalizeDescriptor` uses only curated aliases from `data/taxonomy/descriptor_aliases.seed.json`. Alias seed keys and values must also be normalized with `normalizeDescriptor` before comparison so curated aliases such as `orange flower -> orange_blossom` match reliably.
- **DQ-D-15:** Alias candidates from Phase 4 remain weak evidence and never participate in automatic canonicalization or authoritative alias merging.
- **DQ-D-16:** Frequency, co-occurrence, alias candidate pool, seed profiles, and placement scoring operate on curated-alias-canonicalized descriptors.
- **DQ-D-17:** Alias application must preserve deterministic audit trail entries with `raw`, `normalized`, `canonical`, and `alias_source: curated_seed`.

### Candidate Placement Scoring
- **DQ-D-18:** Replace simple placement by co-occurrence support `>= 1` with conservative placement scoring.
- **DQ-D-19:** Hard-excluded descriptors are completely blocked from placement.
- **DQ-D-20:** Default v1 placement thresholds are `support >= 3`, `normalized_support >= 0.05`, and `placement_score >= 0.35`.
- **DQ-D-21:** `support` is the sum of co-occurrence between the candidate and seed descriptors in the target subfamily.
- **DQ-D-22:** `normalized_support = support / frequency(candidate)`.
- **DQ-D-23:** Initial score formula: `placement_score = 0.60 * min(1, support / 10) + 0.30 * min(1, normalized_support / 0.20) - 0.10 * noise_penalty`, where `noise_penalty = 0` for non-noisy descriptors and `1 - downweight_value` for downweighted descriptors.
- **DQ-D-24:** Semantic noise penalizes placement score but does not remove valid descriptors automatically.
- **DQ-D-25:** Candidates that fail conservative placement stay out of `taxonomy.json` and become `review_queue` items with evidence and suggested action.
- **DQ-D-26:** Placement should be implemented as a pure function such as `scoreCandidatePlacement(candidate, subfamily, evidence, options)`. The design is inference-owned, even if initial integration remains near `compile_taxonomy.ts` to reduce scope.

### Curated Relations And Accord Bootstrap
- **DQ-D-27:** Phase 7 should populate `curated_relations.v1.json` and `accord_map.v1.json` with a minimal manual bootstrap.
- **DQ-D-28:** Do not generate relations or accords automatically by heuristic in v1 hardening.
- **DQ-D-29:** Empty curated relation/accord inputs remain technically valid but generate review warnings: `empty_curated_relations` and `empty_accord_map`.
- **DQ-D-30:** When curated relation or accord inputs exist, tests must require `similarity_matrix.json.edges.length > 0`.
- **DQ-D-31:** Missing accord/tradition data remains neutral/undefined and never becomes automatic zero.
- **DQ-D-32:** Corpus/co-occurrence may support edge evidence summaries but must not define tradition or accord compatibility alone.
- **DQ-D-33:** Initial relation bootstrap candidates are `floral_rose <-> floral_white`, `citrus_fresh <-> citrus_bitter`, `woody_dry <-> woody_mossy`, `citrus_fresh <-> floral_white`, `woody_dry <-> floral_rose`, and `woody_mossy <-> floral_rose`.
- **DQ-D-34:** Initial accord bootstrap candidates are `citrus_fresh + floral_white`, `citrus_fresh + floral_rose`, `woody_dry + floral_rose`, `woody_dry + citrus_fresh`, and `woody_mossy + floral_rose`.

### Review Queue Population
- **DQ-D-35:** `similarity_matrix.json` remains the only final artifact with a `review_queue`.
- **DQ-D-36:** `taxonomy.json` does not duplicate the review queue; it only keeps compact descriptor flags such as `source`, `status`, `review_required`, and `corpus_derived`.
- **DQ-D-37:** The CLI prints a concise review summary with total review items, counts by severity, counts by type, validation status, and quality gate status.
- **DQ-D-38:** Review items are warnings/review data by default. Quality gates separately decide which issues fail compilation.
- **DQ-D-39:** Review queue ordering must be deterministic.
- **DQ-D-40:** Initial review item types are `seed_descriptor_zero_frequency`, `hard_excluded_descriptor_detected`, `corpus_candidate_low_support`, `corpus_candidate_high_frequency_generic`, `empty_curated_relations`, `empty_accord_map`, `alias_frequency_merge_opportunity`, `suspicious_descriptor_from_ingestion`, and `technical_token_in_descriptor_field`.

### Artifact Quality Gates
- **DQ-D-41:** `npm run compile` should run schema validation, deterministic payload ordering guarantees, and essential hard semantic gates by default. Byte-for-byte determinism between two runs belongs in tests/CI or `compile:quality`, not as a heavy default CLI check.
- **DQ-D-42:** Soft warnings and review queue items do not fail compilation by default.
- **DQ-D-43:** `npm run compile:quality` may emit a more detailed quality report with warning breakdown, candidates, rejected noise, and quality metrics, without creating extra artifacts by default. Detailed reports are console-only by default; any persisted report should require an explicit future flag.
- **DQ-D-44:** Hard gates fail the build for invalid schema, invalid null/undefined, hard-exclude terms in `taxonomy.json`, descriptor status/source inconsistency, alias candidates in `descriptor_aliases.json`, `final_score` outside `[0,1]`, divergent `generated_at` across artifacts, required descriptor id uniqueness violations, and nondeterministic output in tests/CI.
- **DQ-D-45:** Soft warnings/review items include seed descriptor zero frequency, empty curated inputs, low-support corpus candidates, high-frequency generic corpus candidates, alias frequency merge opportunities, sanitizer rejections, candidates excluded for low score, and `edges: []` when curated inputs are empty.
- **DQ-D-46:** If curated relations or accords are non-empty but `similarity_matrix.json` still has no edges, emit at least a high-severity warning. This may become a hard gate later.

### Seed Taxonomy Expansion
- **DQ-D-47:** Phase 7 prepares future `taxonomy-seed.v2.json` curation but does not perform broad seed expansion.
- **DQ-D-48:** Seed taxonomy expansion remains manual/curated; corpus evidence can suggest gaps but never creates seed truth automatically.
- **DQ-D-49:** Phase 7 may emit review-only gaps and suggestions for future families/subfamilies.
- **DQ-D-50:** Broad seed expansion should be planned as a separate phase or subphase after pipeline hardening.
- **DQ-D-51:** Minimal curated relations/accord bootstrap is allowed in Phase 7 and does not count as broad seed taxonomy expansion.

### the agent's Discretion
- Exact TypeScript module names and internal file organization, provided the pure-function, strict typing, deterministic ordering, and zero-runtime-dependency constraints are preserved.
- Exact review item evidence payload shape per item type, provided each item includes type, severity, affected entity, evidence, and suggested action.
- Exact `compile:quality` console/report formatting, provided no extra final artifacts are created by default.
- Exact plan wave boundaries, with the recommended split: `07-01 Descriptor sanitation + semantic noise v2`, `07-02 Alias-aware analysis`, `07-03 Conservative placement + review_queue`, and `07-04 Curated relations/accord bootstrap + quality gates`.

### Deferred Ideas (OUT OF SCOPE)
- Broad `taxonomy-seed.v2.json` expansion is deferred to a manual curation phase/subphase after pipeline hardening.
- Candidate future seed categories include Gourmand, Spicy, Green, Fruity, Animalic, Amber/Resinous, Marine/Ozonic, Musky, and Tobacco/Leather.
- Automatic corpus-derived family/subfamily creation remains out of scope.
- Turning graph-empty-with-curated-inputs into a hard failure is deferred; Phase 7 starts with high-severity warning unless planning decides otherwise.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DQ-01 | Descriptor sanitation before corpus statistics. [VERIFIED: .planning/REQUIREMENTS.md] | Implement a pure sanitizer after `normalizeDescriptor` and before `computeFrequencyAndCoOccurrence`; audit raw/normalized/reason/matched_rule/material/source. [VERIFIED: src/analyzer/cooccurrence.ts + 07-CONTEXT.md] |
| DQ-02 | Semantic noise schema expansion. [VERIFIED: .planning/REQUIREMENTS.md] | Replace flat-only `SemanticNoiseOptions.curatedNoiseDescriptors` loading with v2 compatibility helper that maps v1 `noise_descriptors` to `downweight` entries. [VERIFIED: src/inference/noise.ts + data/inference/semantic_noise.v1.json + 07-CONTEXT.md] |
| DQ-03 | Alias-aware frequency and co-occurrence. [VERIFIED: .planning/REQUIREMENTS.md] | Add curated alias canonicalization before frequency/co-occurrence/alias pool; never use alias candidates for canonicalization. [VERIFIED: src/analyzer/analyze_corpus.ts + src/analyzer/alias_candidates.ts + 07-CONTEXT.md] |
| DQ-04 | Candidate placement scoring. [VERIFIED: .planning/REQUIREMENTS.md] | Replace `minCooccurrenceSupport ?? 1` placement with conservative pure scoring thresholds and route failures to review. [VERIFIED: src/compiler/compile_taxonomy.ts + 07-CONTEXT.md] |
| DQ-05 | Curated relations/accord bootstrap. [VERIFIED: .planning/REQUIREMENTS.md] | Populate `data/inference/curated_relations.v1.json` and `data/inference/accord_map.v1.json`; tests require positive edges when curated inputs are non-empty. [VERIFIED: data/inference/*.json + src/inference/build_similarity_graph.ts + 07-CONTEXT.md] |
| DQ-06 | Review queue population. [VERIFIED: .planning/REQUIREMENTS.md] | Keep review queue only in `similarity_matrix.json`; merge sanitizer/noise/placement/empty-input/alias opportunities deterministically. [VERIFIED: src/types/similarity.ts + src/inference/build_similarity_graph.ts + 07-CONTEXT.md] |
| DQ-07 | Artifact quality gates. [VERIFIED: .planning/REQUIREMENTS.md] | Extend validation/compile flow with hard semantic gates and soft warning summary, preserving all-or-nothing writes. [VERIFIED: src/compiler/validate_output.ts + src/compiler/write_outputs.ts + 07-CONTEXT.md] |
| DQ-08 | Seed taxonomy expansion evaluation. [VERIFIED: .planning/REQUIREMENTS.md] | Emit review-only gap suggestions; do not modify seed hierarchy or create automatic families/subfamilies. [VERIFIED: 07-CONTEXT.md] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

No `AGENTS.md` exists at the project root, so no additional project-level directives were found. [VERIFIED: file read returned not found]

## Summary

Phase 7 is a hardening pass over an already working TypeScript compiler pipeline: `loadCorpus` → `analyzeCorpus` → `buildSeedCorpusProfiles`/`buildSimilarityGraph` → `compileAll` → three deterministic artifacts under `data/compiled/v1/`. [VERIFIED: src/cli/compile.ts + src/compiler/compile_all.ts + data/compiled/v1/*.json] The existing baseline passes `npm run typecheck` and `npm test` with 294 tests across 43 files, so plans should add narrow, behavior-first tests before changing pipeline semantics. [VERIFIED: npm test + npm run typecheck]

The core planning insight is that Phase 7 must move two transformations earlier: strict sanitation and curated alias canonicalization must happen before frequency/co-occurrence, because the current analyzer directly normalizes raw descriptor strings into maps. [VERIFIED: src/analyzer/cooccurrence.ts + src/analyzer/analyze_corpus.ts + 07-CONTEXT.md] Downstream inference/compilation should consume the already-sanitized and alias-canonicalized `CorpusAnalysis` rather than re-filtering final artifacts. [VERIFIED: 07-CONTEXT.md]

**Primary recommendation:** Plan four dependent waves in this order: `07-01 Descriptor sanitation + semantic noise v2`, `07-02 Alias-aware analysis`, `07-03 Conservative placement + review_queue`, and `07-04 Curated relations/accord bootstrap + quality gates`. [VERIFIED: .planning/phases/07-data-quality-inference-hardening/07-CONTEXT.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Descriptor sanitation | Analysis core | CLI summary | The analyzer is where raw `olfactory.descriptors` become frequency/co-occurrence maps, so sanitation must happen before those maps are built. [VERIFIED: src/analyzer/cooccurrence.ts + 07-CONTEXT.md] |
| Semantic noise v2 | Inference core | Data config loader | Current noise scoring lives in `src/inference/noise.ts`, while CLI reads JSON from `data/inference/semantic_noise.v1.json`. [VERIFIED: src/inference/noise.ts + src/cli/compile.ts] |
| Curated alias canonicalization | Analysis core | Alias seed loader | Alias keys/values come from `descriptor_aliases.seed.json`, but canonicalization must affect analysis maps before inference and compilation. [VERIFIED: data/taxonomy/descriptor_aliases.seed.json + 07-CONTEXT.md] |
| Candidate placement scoring | Inference/Compiler boundary | Similarity review queue | Current placement is inside `compile_taxonomy.ts`; context says scoring is inference-owned but may integrate near compilation initially. [VERIFIED: src/compiler/compile_taxonomy.ts + 07-CONTEXT.md] |
| Curated relation/accord bootstrap | Data inputs | Graph builder | `buildSimilarityGraph` already consumes explicit `curatedRelations` and `accordMap` inputs and emits sparse graph edges. [VERIFIED: src/inference/build_similarity_graph.ts] |
| Review queue | Similarity graph artifact | CLI summary | `SimilarityGraph` contains `review_queue`, and context locks it as the only final artifact review queue location. [VERIFIED: src/types/similarity.ts + 07-CONTEXT.md] |
| Quality gates | Compiler validation | CLI exit/reporting | Current `compileAll` validates all outputs before writing and CLI exits non-zero on validation errors. [VERIFIED: src/compiler/compile_all.ts + src/cli/compile.ts] |

## Current Pipeline and Artifact Structure

```text
CLI compile command
  -> parseCompileArgs(default paths)
  -> loadTaxonomySeed / loadAliasSeed / loadCorpus / read inference JSON
  -> analyzeCorpus(corpus)
       -> computeFrequencyAndCoOccurrence(corpus)
            -> normalizeDescriptor(raw)
            -> frequency Map + cooccurrence Map
       -> optional findAliasCandidates(frequency)
  -> compileAll({ seed, aliasSeed, analysis, graphInputs, noiseConfig })
       -> buildSeedCorpusProfiles(seed, analysis, noise options)
       -> compileTaxonomy(seed, profileResult, analysis)
       -> compileAliases(aliasSeed)
       -> buildSimilarityGraph(seed, analysis, curatedRelations, accordMap)
       -> validateAllOutputs(taxonomy, aliases, similarity)
  -> writeCompileResults(result, data/compiled/v1)
``` 
[VERIFIED: src/cli/compile.ts + src/analyzer/analyze_corpus.ts + src/analyzer/cooccurrence.ts + src/compiler/compile_all.ts + src/compiler/write_outputs.ts]

Current compiled artifact facts: `taxonomy.json` has 3 families, 6 subfamilies, and 366 descriptors; `descriptor_aliases.json` has 7 mappings; `similarity_matrix.json` has 0 edges, density 0, and an empty review queue. [VERIFIED: node artifact summary command]

Current data-quality evidence: `taxonomy.json` currently contains hard-exclude candidates `at`, `in`, `de`, `hour_s`, `dipropylene`, `glycol`, `substantivity_232`, `substantivity_400`, and `general_comment_at_100_00_lime`; zero-frequency seed descriptors include `bitter_orange`, `sweet_orange`, `jasmine`, `orange_blossom`, and `tree_moss`. [VERIFIED: node artifact summary command]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js built-ins | Node v24.14.0 available | Filesystem, path, process, JSON parsing | Existing CLI uses `node:fs/promises`, `node:path`, and `node:url`; no runtime packages are required. [VERIFIED: node --version + src/cli/compile.ts + src/compiler/write_outputs.ts] |
| TypeScript | installed 5.9.3; package range `^5.8.0`; registry latest 6.0.3 | Strict typing and build/typecheck | Project uses strict TS with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`; existing `npm run typecheck` passes. [VERIFIED: npm list + npm view + src/tsconfig.json + npm run typecheck] |
| Vitest | installed 3.2.4; package range `^3.2.0`; registry latest 4.1.7 | Unit/integration tests | Existing test suite uses `describe`, `it`, and `expect`; Vitest v3.2.4 docs show the same pattern and npm script execution. [VERIFIED: npm list + npm view] [CITED: https://github.com/vitest-dev/vitest/blob/v3.2.4/docs/guide/index.md] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@types/node` | installed 25.7.0; package range `^25.7.0`; registry latest 25.9.1 | Node type declarations for TS | Keep as dev-only support for Node built-ins and CLI tests. [VERIFIED: npm list + npm view + src/package.json] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Runtime validation package | Zod/Joi/Ajv | Do not add: project has locked zero runtime dependencies and already has hand-written pure validators. [VERIFIED: src/package.json + src/compiler/validate_output.ts + 07-CONTEXT.md] |
| External stemming/stopword packages | Natural/lodash/etc. | Do not add: normalization and semantic noise are domain-specific and locked to pure zero-dependency functions. [VERIFIED: .planning/phases/03-normalization-pipeline/03-CONTEXT.md + 07-CONTEXT.md] |

**Installation:** No new packages should be installed for Phase 7. [VERIFIED: 07-CONTEXT.md + src/package.json]

## Package Legitimacy Audit

No external package installation is recommended for this phase, so the Package Legitimacy Gate is not applicable. Existing dev dependencies were already present in `src/package.json` and were registry-checked with `npm view`. [VERIFIED: src/package.json + npm view]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| None newly recommended | — | — | — | — | N/A | No install step required. [VERIFIED: 07-CONTEXT.md] |

**Packages removed due to slopcheck [SLOP] verdict:** none. [VERIFIED: no new packages recommended]
**Packages flagged as suspicious [SUS]:** none. [VERIFIED: no new packages recommended]

## Architecture Patterns

### System Architecture Diagram

```text
data/enriched_materials.json + seed/alias/inference JSON
        |
        v
loadCorpus/loadSeed/loadAlias/readJson
        |
        v
normalizeDescriptor(raw)
        |
        v
sanitizeDescriptor({ raw, normalized, material_id, source })
        |-- hard_exclude/pattern_exclude --> sanitizer audit + review evidence
        v
canonicalizeDescriptor(normalized, curated alias seed)
        |-- alias hit --> alias audit + merged canonical descriptor
        v
computeFrequencyAndCoOccurrence + findAliasCandidates
        |
        v
buildSeedCorpusProfiles + semantic noise v2 decisions
        |
        v
scoreCandidatePlacement(candidate, subfamily, evidence, thresholds)
        |-- pass --> compact candidate descriptor in taxonomy.json
        |-- fail --> review_queue item in similarity_matrix.json
        v
buildSimilarityGraph(curated relations + accords)
        |
        v
validateAllOutputs + quality gates
        |-- hard fail --> no writes, non-zero CLI
        |-- warnings --> deterministic review summary
        v
data/compiled/v1/{taxonomy.json, descriptor_aliases.json, similarity_matrix.json}
```
[VERIFIED: src/cli/compile.ts + src/compiler/compile_all.ts + 07-CONTEXT.md]

### Recommended Project Structure

```text
src/
├── analyzer/
│   ├── descriptor_sanitizer.ts       # pure sanitation rules + audit entries [RECOMMENDED: 07-CONTEXT.md]
│   ├── alias_canonicalization.ts     # curated alias canonicalization before stats [RECOMMENDED: 07-CONTEXT.md]
│   ├── analyze_corpus.ts             # orchestration boundary to wire sanitizer/canonicalizer [VERIFIED: codebase]
│   └── cooccurrence.ts               # current frequency/co-occurrence implementation [VERIFIED: codebase]
├── inference/
│   ├── noise.ts                      # evolve v1 flat noise to v2 categorized input [VERIFIED: codebase]
│   ├── placement_scoring.ts          # pure candidate placement scorer [RECOMMENDED: 07-CONTEXT.md]
│   └── build_similarity_graph.ts     # graph edges + review queue merge point [VERIFIED: codebase]
├── compiler/
│   ├── compile_taxonomy.ts           # integrate placement decisions or consume scorer output [VERIFIED: codebase]
│   ├── quality_gates.ts              # hard/soft semantic gates [RECOMMENDED: 07-CONTEXT.md]
│   ├── validate_output.ts            # existing schema validators [VERIFIED: codebase]
│   └── compile_all.ts                # all-or-nothing orchestration [VERIFIED: codebase]
└── tests/
    ├── analysis/                     # sanitizer + alias-aware stats tests [VERIFIED: existing pattern]
    ├── inference/                    # semantic noise + placement + graph tests [VERIFIED: existing pattern]
    ├── compiler/                     # quality gate + deterministic compile tests [VERIFIED: existing pattern]
    └── cli/                          # compile summary / compile:quality tests [VERIFIED: existing pattern]
```

### Pattern 1: Pure transform plus audit side-channel

**What:** Return both transformed descriptors and deterministic audit entries instead of doing I/O or logging inside core functions. [VERIFIED: 07-CONTEXT.md]
**When to use:** Use for sanitizer and curated alias canonicalization because both need auditability without violating pure-function architecture. [VERIFIED: 07-CONTEXT.md]
**Example:**
```typescript
export type DescriptorSanitizerInput = {
  readonly raw: string
  readonly normalized: string
  readonly material_id?: string
  readonly source?: string
}

export type DescriptorSanitizerResult =
  | { readonly keep: true; readonly descriptor: string; readonly audit?: never }
  | { readonly keep: false; readonly audit: DescriptorSanitizerAuditEntry }
```
[RECOMMENDED: derived from DQ-D-05/DQ-D-06]

### Pattern 2: Compatibility parser before scoring

**What:** Convert v1 flat noise config and v2 categorized noise config into one normalized internal shape before `scoreSemanticNoise` uses it. [VERIFIED: src/inference/noise.ts + data/inference/semantic_noise.v1.json + 07-CONTEXT.md]
**When to use:** Use at CLI/compile boundary so inference functions receive explicit normalized options and remain pure. [VERIFIED: src/cli/compile.ts + src/compiler/compile_all.ts]
**Example:**
```typescript
const normalizeSemanticNoiseConfig = (input: SemanticNoiseInput): NormalizedSemanticNoiseConfig => {
  if ('noise_descriptors' in input) {
    return {
      hard_exclude: [],
      pattern_exclude: [],
      downweight: Object.fromEntries(input.noise_descriptors.map(descriptor => [normalizeDescriptor(descriptor), input.downweight_value])),
      default_downweight: input.downweight_value,
    }
  }
  return normalizeV2NoiseConfig(input)
}
```
[RECOMMENDED: derived from DQ-D-07/DQ-D-08]

### Anti-Patterns to Avoid

- **Sanitizing only in `compileTaxonomy`:** This leaves bad descriptors in frequency/co-occurrence, alias candidates, seed profiles, and placement evidence. [VERIFIED: src/analyzer/cooccurrence.ts + 07-CONTEXT.md]
- **Treating generic olfactive terms as hard exclusions:** Context locks generic descriptors to downweighting rather than sanitation removal. [VERIFIED: DQ-D-02/DQ-D-11/DQ-D-12]
- **Canonicalizing with alias candidates:** Alias candidates are weak evidence and must not be authoritative canonical mappings. [VERIFIED: src/analyzer/alias_candidates.ts + DQ-D-15]
- **Writing diagnostic sidecar files by default:** Phase 6 and Phase 7 lock the default artifact boundary to the three compiled files; detailed reports are console-only unless a future explicit flag is added. [VERIFIED: .planning/phases/06-compilation-cli/06-CONTEXT.md + DQ-D-43]

## Recommended Plan Boundaries and Dependency Ordering

| Plan | Must happen after | Primary files | Requirements covered | Why this boundary |
|------|-------------------|---------------|----------------------|-------------------|
| 07-01 Descriptor sanitation + semantic noise v2 | Phase 6 baseline green | `src/analyzer/analyze_corpus.ts`, `src/analyzer/cooccurrence.ts`, new sanitizer module, `src/inference/noise.ts`, `data/inference/semantic_noise.v1.json`, tests under `src/tests/analysis/` and `src/tests/inference/` | DQ-01, DQ-02 | Sanitation changes the base maps that every later step consumes, and semantic-noise v2 supplies the hard/downweight semantics. [VERIFIED: 07-CONTEXT.md] |
| 07-02 Alias-aware analysis | 07-01 | `src/analyzer/analyze_corpus.ts`, new alias canonicalizer, `src/analyzer/alias_candidates.ts`, `src/cli/compile.ts`, `src/compiler/compile_all.ts`, tests under `src/tests/analysis/` and `src/tests/cli/` | DQ-03 | Alias canonicalization must happen after sanitation and before statistics so frequencies and co-occurrences aggregate canonical descriptors. [VERIFIED: DQ-D-13/DQ-D-16] |
| 07-03 Conservative placement + review_queue | 07-02 | `src/inference/placement_scoring.ts`, `src/compiler/compile_taxonomy.ts`, `src/inference/build_similarity_graph.ts`, `src/types/inference.ts`, `src/types/similarity.ts`, compiler/inference tests | DQ-04, DQ-06 | Placement depends on alias-canonicalized stats and produces pass/fail evidence that must feed the only final review queue. [VERIFIED: DQ-D-20 through DQ-D-26 + DQ-D-35] |
| 07-04 Curated relations/accord bootstrap + quality gates | 07-03 | `data/inference/curated_relations.v1.json`, `data/inference/accord_map.v1.json`, `src/compiler/quality_gates.ts`, `src/compiler/validate_output.ts`, `src/cli/compile.ts`, `src/package.json` | DQ-05, DQ-07, DQ-08 | Positive graph edge tests need hardened upstream data, and quality gates should validate final integrated artifacts. [VERIFIED: DQ-D-27 through DQ-D-46] |

## Concrete Files Likely to Be Read or Modified

| Path | Read/Modify | Planning Notes |
|------|-------------|----------------|
| `src/normalizer/normalize_descriptor.ts` | Read | Must remain the first descriptor normalization step; do not add aliasing here. [VERIFIED: Phase 3 context + codebase] |
| `src/analyzer/analyze_corpus.ts` | Modify | Natural top-level boundary for sanitation and curated alias canonicalization options. [VERIFIED: codebase + 07-CONTEXT.md] |
| `src/analyzer/cooccurrence.ts` | Modify | Current `toSortedDescriptorSet` directly normalizes raw descriptors and must be refactored to accept preprocessed descriptor entries or options. [VERIFIED: codebase] |
| `src/analyzer/frequency.ts` | Modify or deprecate path | It currently has a separate normalize/count path; keep behavior aligned with co-occurrence to avoid divergent stats. [VERIFIED: codebase] |
| `src/analyzer/alias_candidates.ts` | Modify | Candidate pool should see alias-canonicalized descriptors but still emit weak evidence only. [VERIFIED: codebase + DQ-D-15] |
| `src/inference/noise.ts` | Modify | Current shape supports flat curated descriptors and one downweight value; v2 needs categories and hard-exclude compatibility. [VERIFIED: codebase] |
| `src/inference/seed_profile.ts` | Modify | It currently scores noise against profiles/inferred descriptors and emits review queue precedents. [VERIFIED: codebase] |
| `src/compiler/compile_taxonomy.ts` | Modify | Current placement is support `>= minSupport`, default 1; replace or delegate to scorer. [VERIFIED: codebase] |
| `src/inference/build_similarity_graph.ts` | Modify | Review queue is already on graph; add empty curated input warnings and merge upstream review items deterministically. [VERIFIED: codebase + DQ-D-35] |
| `src/compiler/compile_all.ts` | Modify | Central point to pass normalized noise config, profile review data, placement review data, and quality-gate results. [VERIFIED: codebase] |
| `src/compiler/validate_output.ts` | Modify | Existing schema validation is the hard-gate precedent; add semantic hard gates or compose with a new `quality_gates.ts`. [VERIFIED: codebase] |
| `src/cli/compile.ts` | Modify | Add review summary and optional `compile:quality` behavior while preserving default paths. [VERIFIED: codebase + DQ-D-37/DQ-D-43] |
| `data/inference/semantic_noise.v1.json` | Modify | Phase context calls for v2 schema while preserving v1 compatibility. [VERIFIED: data file + DQ-D-07/DQ-D-08] |
| `data/inference/curated_relations.v1.json` | Modify | Currently empty; Phase 7 should manually bootstrap locked candidates. [VERIFIED: data file + DQ-D-33] |
| `data/inference/accord_map.v1.json` | Modify | Currently empty; Phase 7 should manually bootstrap locked candidates. [VERIFIED: data file + DQ-D-34] |
| `data/compiled/v1/*.json` | Regenerate only after planned changes | Artifacts are generated outputs; do not hand-edit. [VERIFIED: src/compiler/write_outputs.ts + Phase 6 context] |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| General JSON schema framework | New runtime validation DSL/package | Existing `validate_output.ts` plus narrow pure `quality_gates.ts` | Runtime dependencies are forbidden; validators already return structured errors. [VERIFIED: src/compiler/validate_output.ts + 07-CONTEXT.md] |
| New statistics engine | Dense matrix or multi-pass analytics framework | Existing `Map` frequency/co-occurrence + `encodePairKey` | Phase 4 chose sparse half-matrix maps and existing tests cover determinism/performance. [VERIFIED: src/analyzer/cooccurrence.ts + Phase 4 context] |
| Alias merge workflow | Automatic alias promotion from candidates | Curated alias seed only | Alias candidates are weak evidence and authoritative aliases must stay in `descriptor_aliases.seed.json`/compiled aliases. [VERIFIED: DQ-D-14/DQ-D-15 + src/compiler/compile_aliases.ts] |
| Domain taxonomy expansion | Automatic new families/subfamilies | Review-only gap items | Seed expansion is deferred and must remain manual. [VERIFIED: DQ-D-47 through DQ-D-50] |

**Key insight:** This phase is not about adding clever heuristics; it is about moving locked, auditable, deterministic rules to the earliest correct pipeline boundary so bad evidence never contaminates downstream maps. [VERIFIED: 07-CONTEXT.md + codebase]

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Generated JSON artifacts live in `data/compiled/v1/`; inference config lives in `data/inference/*.json`; no database or external datastore was found in the Phase 7 scope. [VERIFIED: data files + ROADMAP] | Regenerate artifacts via CLI after code/config changes; do not hand-edit compiled outputs. [VERIFIED: src/compiler/write_outputs.ts] |
| Live service config | None — no external services or UI-owned configuration are referenced for Phase 7. [VERIFIED: ROADMAP + src/cli/compile.ts] | None. |
| OS-registered state | None — no systemd/pm2/cron/task scheduler integration appears in Phase 7 scope. [VERIFIED: project files inspected for CLI-only builder] | None. |
| Secrets/env vars | None — compile CLI takes file paths and generated timestamp flags, not secrets or env vars. [VERIFIED: src/cli/parse_args.ts + src/cli/compile.ts] | None. |
| Build artifacts | `src/dist/` may be produced by `npm run build`; current source excludes `dist` in `tsconfig`. [VERIFIED: src/tsconfig.json + src/package.json] | Re-run `npm run build`/`npm run compile` after source changes; do not plan migrations for build artifacts. [VERIFIED: src/package.json] |

## Common Pitfalls

### Pitfall 1: Sanitizing after statistics
**What goes wrong:** Bad tokens disappear from `taxonomy.json` but still influence frequency, co-occurrence, alias candidates, profiles, and placement scoring. [VERIFIED: current analyzer code]
**Why it happens:** Current analyzer normalizes raw descriptors inside `computeFrequencyAndCoOccurrence`. [VERIFIED: src/analyzer/cooccurrence.ts]
**How to avoid:** Refactor preprocessing into `normalize -> sanitize -> canonicalize -> dedupe` before map updates. [VERIFIED: 07-CONTEXT.md]
**Warning signs:** Tests only assert final taxonomy absence and do not assert frequency/co-occurrence absence for hard-excluded descriptors. [VERIFIED: derived from current test patterns]

### Pitfall 2: Losing raw descriptor auditability
**What goes wrong:** Sanitizer can report normalized terms but cannot identify source material or raw string. [VERIFIED: DQ-D-05]
**Why it happens:** Existing analyzer types only require `olfactory.descriptors`, not material ids or descriptor source metadata. [VERIFIED: src/analyzer/analyze_corpus.ts]
**How to avoid:** Extend analysis material input type to optionally include material id/source and pass `{ raw, normalized, material_id, source }` to sanitizer. [VERIFIED: DQ-D-05]
**Warning signs:** Sanitizer function signature accepts only `string`. [VERIFIED: DQ-D-05]

### Pitfall 3: Treating v2 hard exclusions as semantic downweights
**What goes wrong:** Technical tokens remain in the candidate pool with reduced weight instead of being blocked from statistics. [VERIFIED: DQ-D-01/DQ-D-19]
**Why it happens:** Current semantic noise only downweights descriptors and does not model hard exclusion. [VERIFIED: src/inference/noise.ts]
**How to avoid:** Keep sanitizer hard-exclude separate from semantic noise downweight; v2 config can contain both but planning must assign each category to the right pipeline stage. [VERIFIED: 07-CONTEXT.md]
**Warning signs:** `at`, `in`, or `substantivity_232` still appears in analysis frequency after Phase 7. [VERIFIED: node artifact summary command]

### Pitfall 4: Breaking deterministic ordering while merging review queues
**What goes wrong:** Artifacts become noisy across runs or tests become flaky. [VERIFIED: Phase 6 context + tests]
**Why it happens:** Multiple review item producers append in execution order without stable sort keys. [VERIFIED: src/inference/build_similarity_graph.ts + src/inference/seed_profile.ts]
**How to avoid:** Define one review item comparator by type, severity, affected entity, and stable JSON evidence before writing artifacts. [RECOMMENDED: derived from DQ-D-39]
**Warning signs:** `JSON.stringify(first.similarity) !== JSON.stringify(second.similarity)` for fixed `generatedAt`. [VERIFIED: src/tests/compiler/compile_all.test.ts]

### Pitfall 5: Making empty curated inputs a hard failure
**What goes wrong:** Valid empty-input scenarios fail despite context saying they remain technically valid. [VERIFIED: DQ-D-29/DQ-D-42]
**Why it happens:** Confusing quality warnings with schema validation errors. [VERIFIED: Phase 6 context + 07-CONTEXT.md]
**How to avoid:** Emit `empty_curated_relations` and `empty_accord_map` review warnings; only high-severity warn if non-empty curated inputs still produce no edges. [VERIFIED: DQ-D-29/DQ-D-46]
**Warning signs:** Tests expect `compileAll(...empty inputs...).ok` to be false solely because edges are empty. [VERIFIED: current tests accept empty graph behavior]

## Code Examples

Verified patterns from official/project sources:

### Vitest unit test style
```typescript
import { describe, expect, it } from 'vitest'

describe('descriptor sanitizer', () => {
  it('hard-excludes technical normalized descriptors with audit evidence', () => {
    expect(sanitizeDescriptor({ raw: 'Dipropylene glycol', normalized: 'dipropylene_glycol' })).toMatchObject({
      keep: false,
    })
  })
})
```
[CITED: https://github.com/vitest-dev/vitest/blob/v3.2.4/README.md] [VERIFIED: existing tests import describe/expect/it]

### Existing all-or-nothing compile pattern
```typescript
const result = compileAll(inputs, { version: args.version, generatedAt, threshold: 0.25 })
if (!result.ok) {
  printValidationErrors(new CompileWriteError(result.validation.errors))
  return 1
}
await writeCompileResults(result, outputDir)
```
[VERIFIED: src/cli/compile.ts]

### Existing deterministic write pattern
```typescript
export const writeJsonDeterministic = async (path: string, payload: object): Promise<void> => {
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}
```
[VERIFIED: src/compiler/write_outputs.ts]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Normalize raw descriptors directly into frequency/co-occurrence. | Normalize, then sanitize, then curated-alias canonicalize before statistics. | Phase 7 planned change. [VERIFIED: 07-CONTEXT.md] | Prevents hard-excluded tokens and alias fragmentation from contaminating all downstream evidence. [VERIFIED: 07-CONTEXT.md] |
| Flat semantic noise list with one downweight value. | Categorized v2 noise config with hard_exclude, pattern_exclude, downweight, and v1 compatibility. | Phase 7 planned change. [VERIFIED: DQ-D-07/DQ-D-08] | Separates invalid technical descriptors from generic-but-valid olfactive descriptors. [VERIFIED: DQ-D-02/DQ-D-11] |
| Candidate placement by support >= 1. | Conservative score with support, normalized support, placement_score, and noise penalty. | Phase 7 planned change. [VERIFIED: src/compiler/compile_taxonomy.ts + DQ-D-20/DQ-D-23] | Reduces over-inclusion of weak/noisy corpus candidates. [VERIFIED: DQ-D-18/DQ-D-25] |
| Empty relations/accords silently yield empty graph/review queue. | Empty curated inputs remain valid but produce review warnings; non-empty curated inputs should produce edges or high-severity warning. | Phase 7 planned change. [VERIFIED: DQ-D-29/DQ-D-30/DQ-D-46] | Makes curation gaps visible without breaking the artifact contract. [VERIFIED: 07-CONTEXT.md] |

**Deprecated/outdated:**
- Treating `data/compiled/v1/` as semantically reliable solely because schemas pass is outdated for Phase 7 planning; artifacts are valid but semantically noisy until hardening completes. [VERIFIED: .planning/STATE.md + .planning/future/DATA-QUALITY-INFERENCE-HARDENING.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | No external services, OS registrations, or secret stores participate in Phase 7. [ASSUMED] | Runtime State Inventory | If hidden deployment automation exists outside the repo, planners may miss a compile/regeneration integration step. |

## Open Questions

1. **Should `semantic_noise.v1.json` be renamed to `semantic_noise.v2.json`, or should the existing path contain v2 content?** [VERIFIED: DQ-D-07 names v2 schema but CLI default path is v1]
   - What we know: CLI default path is `data/inference/semantic_noise.v1.json`. [VERIFIED: src/cli/parse_args.ts]
   - What's unclear: Whether artifact/config file naming should preserve `.v1` for backward path stability or add a new `.v2` path with parser fallback. [ASSUMED]
   - Recommendation: Plan a backward-compatible loader that accepts both shapes at the current default path unless user explicitly decides to create a new file path. [RECOMMENDED]

2. **Where should upstream review items be merged into `similarity_matrix.json.review_queue`?** [VERIFIED: DQ-D-35]
   - What we know: `buildSeedCorpusProfiles` and `buildSimilarityGraph` both already produce review queues. [VERIFIED: src/inference/seed_profile.ts + src/inference/build_similarity_graph.ts]
   - What's unclear: Whether `compileAll` should merge all review items after graph creation or graph builder should accept upstream review items as input. [ASSUMED]
   - Recommendation: Prefer `compileAll` or a compiler-level `mergeReviewQueues` helper so graph scoring remains focused on graph construction. [RECOMMENDED]

3. **Should `compile:quality` be a separate npm script in Phase 7 or only an internal CLI flag?** [VERIFIED: DQ-D-43]
   - What we know: `src/package.json` currently has `compile` but no `compile:quality`. [VERIFIED: src/package.json]
   - What's unclear: Exact command surface is discretionary as long as no default sidecar artifacts are created. [VERIFIED: DQ-D-43 + Agent's Discretion]
   - Recommendation: Add `compile:quality` as an npm script only in the quality-gates plan after core gates exist. [RECOMMENDED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Build, tests, compile CLI | ✓ | v24.14.0 | None needed. [VERIFIED: node --version] |
| npm | Scripts and dependency resolution | ✓ | 11.9.0 | None needed. [VERIFIED: npm --version] |
| TypeScript | `npm run typecheck` / `npm run build` | ✓ | installed 5.9.3 | None needed. [VERIFIED: npm list] |
| Vitest | Tests | ✓ | installed 3.2.4 | None needed. [VERIFIED: npm list] |
| `data/enriched_materials.json` | Full compile pipeline | Not probed in this research output | — | Planner should preserve existing CLI behavior and add tests with fixtures; full compile verification should run where data is available. [VERIFIED: src/cli/compile.ts] |

**Missing dependencies with no fallback:** None found for code/test planning. [VERIFIED: environment probes]

**Missing dependencies with fallback:** Full corpus availability was not required for research; planner can use fixtures for unit tests and full compile command as an integration verification when the corpus file is present. [VERIFIED: existing fixture tests]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest installed 3.2.4; package range `^3.2.0`. [VERIFIED: npm list + src/package.json] |
| Config file | `src/vitest.config.ts`. [VERIFIED: file glob] |
| Quick run command | `npm run typecheck && npm test -- tests/<concern>/<file>.test.ts` for targeted files. [VERIFIED: src/package.json + Vitest npm script behavior cited in docs] |
| Full suite command | `cd src` equivalent via workdir then `npm run typecheck && npm test`. [VERIFIED: commands executed successfully] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| DQ-01 | Hard-excluded and pattern-excluded descriptors do not enter frequency/co-occurrence; sanitizer emits audit entries. | unit/integration | `npm test -- tests/analysis/descriptor_sanitizer.test.ts tests/analysis/orchestration.test.ts` | ❌ Wave 0 |
| DQ-02 | v1 flat noise config maps to v2 downweight; seed descriptor exceptions still preserve weight 1. | unit | `npm test -- tests/inference/noise.test.ts` | ✅ extend existing |
| DQ-03 | Curated alias seed canonicalizes before frequency/co-occurrence and preserves alias audit entries. | unit/integration | `npm test -- tests/analysis/alias_canonicalization.test.ts tests/analysis/orchestration.test.ts` | ❌ Wave 0 |
| DQ-04 | Candidate placement requires support/normalized_support/placement_score thresholds and blocks hard-excluded descriptors. | unit | `npm test -- tests/inference/placement_scoring.test.ts tests/compiler/compile_taxonomy.test.ts` | ❌ new + ✅ extend existing |
| DQ-05 | Non-empty curated relations/accords produce `similarity_matrix.json.edges.length > 0`; empty inputs produce warnings. | integration | `npm test -- tests/inference/build_similarity_graph.test.ts tests/compiler/compile_all.test.ts` | ✅ extend existing |
| DQ-06 | Review queue contains deterministic items by type/severity/entity and only final artifact review queue is `similarity_matrix.json`. | integration | `npm test -- tests/compiler/compile_all.test.ts tests/inference/build_similarity_graph.test.ts` | ✅ extend existing |
| DQ-07 | Hard quality gates fail compile before writes; soft warnings do not fail; deterministic output remains stable. | unit/integration | `npm test -- tests/compiler/quality_gates.test.ts tests/cli/compile.test.ts` | ❌ new + ✅ extend existing |
| DQ-08 | Seed expansion suggestions are review-only and do not mutate seed hierarchy or create new families. | unit/integration | `npm test -- tests/inference/seed_expansion_review.test.ts tests/compiler/compile_all.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** targeted test file(s) plus `npm run typecheck`. [VERIFIED: project scripts]
- **Per wave merge:** `npm run typecheck && npm test`. [VERIFIED: commands executed successfully]
- **Phase gate:** `npm run typecheck && npm test && npm run compile -- --generated-at 2026-01-01T00:00:00.000Z`, when full corpus data is available. [VERIFIED: package scripts + CLI args]

### Wave 0 Gaps
- [ ] `src/tests/analysis/descriptor_sanitizer.test.ts` — covers DQ-01. [RECOMMENDED]
- [ ] `src/tests/analysis/alias_canonicalization.test.ts` — covers DQ-03. [RECOMMENDED]
- [ ] `src/tests/inference/placement_scoring.test.ts` — covers DQ-04. [RECOMMENDED]
- [ ] `src/tests/compiler/quality_gates.test.ts` — covers DQ-07. [RECOMMENDED]
- [ ] `src/tests/inference/seed_expansion_review.test.ts` — covers DQ-08 if review-only gap suggestions are implemented. [RECOMMENDED]
- [ ] Extend `src/tests/cli/compile.test.ts` for concise review summary and quality status. [RECOMMENDED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | CLI/data builder has no auth surface in Phase 7. [VERIFIED: src/cli/compile.ts] |
| V3 Session Management | no | No sessions or runtime API exist. [VERIFIED: ROADMAP out of scope] |
| V4 Access Control | no | Local file paths are provided to CLI; no user roles or network endpoints exist. [VERIFIED: src/cli/parse_args.ts] |
| V5 Input Validation | yes | Existing loaders/validators and compiler validation; add sanitizer and quality gates for data validation. [VERIFIED: src/compiler/validate_output.ts + 07-CONTEXT.md] |
| V6 Cryptography | no | No cryptographic operations are required; do not add custom crypto. [VERIFIED: phase scope] |

### Known Threat Patterns for TypeScript CLI/Data Pipeline

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed JSON input produces invalid artifacts | Tampering | Parse/load then validate all outputs before write; write nothing on validation failure. [VERIFIED: src/cli/compile.ts + src/compiler/write_outputs.ts] |
| Path override points to unintended file | Tampering | Keep CLI explicit path arguments and test defaults/overrides; avoid glob deletes or broad writes. [VERIFIED: src/cli/parse_args.ts + src/compiler/write_outputs.ts] |
| Non-deterministic output hides unauthorized or accidental changes | Repudiation | Stable sorting, fixed `generatedAt` in tests, deterministic JSON writing. [VERIFIED: src/tests/compiler/compile_all.test.ts + src/compiler/write_outputs.ts] |
| Technical descriptor noise poisons semantic outputs | Tampering/Data integrity | Pre-analysis sanitation plus hard quality gates for hard-exclude terms in final taxonomy. [VERIFIED: 07-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/07-data-quality-inference-hardening/07-CONTEXT.md` — locked Phase 7 decisions, boundaries, suggested plan split, code/data references. [VERIFIED: read]
- `.planning/REQUIREMENTS.md` — DQ-01 through DQ-08 backlog descriptions and evidence. [VERIFIED: read]
- `.planning/STATE.md` — current Phase 7 state and prior decisions. [VERIFIED: read]
- `.planning/ROADMAP.md` — Phase 7 registration, dependency on Phase 6, planning-only note. [VERIFIED: read]
- `src/analyzer/*`, `src/inference/*`, `src/compiler/*`, `src/cli/*`, `src/types/*` — current implementation structure and integration points. [VERIFIED: read]
- `data/inference/*.json`, `data/taxonomy/descriptor_aliases.seed.json`, `data/compiled/v1/*.json` — current data/artifact state. [VERIFIED: read + node artifact summary]
- `/vitest-dev/vitest/v3_2_4` via Context7 — Vitest test and npm script patterns. [CITED: https://github.com/vitest-dev/vitest/blob/v3.2.4/docs/guide/index.md]

### Secondary (MEDIUM confidence)
- `npm view typescript version`, `npm view vitest version`, `npm view @types/node version` — registry current versions for existing dev dependencies. [VERIFIED: npm registry]
- `npm list typescript vitest @types/node --depth=0` — installed dev dependency versions. [VERIFIED: npm]

### Tertiary (LOW confidence)
- Runtime state assumption that no hidden external services/config/secrets participate in Phase 7. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — existing stack is already present and verified by package files, npm list/view, and successful typecheck/test run. [VERIFIED: src/package.json + npm commands]
- Architecture: HIGH — pipeline entry points and artifact writers were read directly from source. [VERIFIED: codebase]
- Pitfalls: HIGH for locked pitfalls, MEDIUM for implementation-specific merge-point recommendations. [VERIFIED: 07-CONTEXT.md + codebase]

**Research date:** 2026-05-21 [VERIFIED: system date]
**Valid until:** 2026-06-20 for stack assumptions; revisit sooner if dependency versions or Phase 7 context decisions change. [ASSUMED]
