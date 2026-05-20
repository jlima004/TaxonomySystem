# Phase 6: Compilation & CLI — Research

**Researched:** 2026-05-20 (refreshed)
**Scope:** COMP-01, COMP-02, COMP-03, COMP-04

## 1. Existing Type Contracts

### taxonomy.json → `CompiledTaxonomy` (src/types/taxonomy.ts)
- `version: string` — shared taxonomy release version
- `generated_at: string` — injectable timestamp
- `stats: TaxonomyStats` — `{ family_count, subfamily_count, descriptor_count }`
- `families: TaxonomyFamily[]` — each has `id`, `name`, `subfamilies[]`
  - subfamilies: `id`, `name`, `family_id`, `descriptors: CanonicalDescriptor[]`
    - descriptors: `{ id: string, source: 'seed' | 'corpus' | 'inferred', frequency: number }`

**Placement rule for corpus/inferred descriptors:** `buildSeedCorpusProfiles()` in `src/inference/seed_profile.ts` already produces `profiles` (seed) and `inferred_descriptors` (corpus). The compiler should merge both into each subfamily's descriptor list: seed descriptors first (sorted by id), then corpus/inferred descriptors (sorted by id), each marked with their respective `source`. This preserves COMP-D-02 (seed = truth, corpus = non-curated).

### descriptor_aliases.json → Wrapper type (NEW)
- Existing `DescriptorAliasMap` is `Record<string, string>` — too simple for a compiled artifact
- **User decision:** Compiled format must be `{ version, schema_version, generated_at, aliases }`:
  ```typescript
  type CompiledAliases = {
    readonly version: string         // taxonomy release version
    readonly schema_version: string  // e.g. "1.0.0" — schema contract version
    readonly generated_at: string    // injectable timestamp
    readonly aliases: DescriptorAliasMap  // curated-only alias map
  }
  ```

### similarity_matrix.json → `SimilarityGraph` (src/types/similarity.ts)
- `version`, `generated_at`, `threshold`, `dimensions[]`, `edges[]`, `review_queue[]`, `stats`
- Edge: `source`, `target`, `final_score?`, `score`, `dimensions`, `evidence?`
- Evidence: `shared_descriptors?`, `cooccurrence_support?`, `curated_relation?`, `accord_reference?`, `alias_evidence?`
- Stats: `{ subfamily_count, edge_count, density }`

## 2. Input Dependencies & Existing Loaders

### Seed
- `loadTaxonomySeed(path)` → `TaxonomySeed` — `data/taxonomy/taxonomy-seed.v1.json`
- `loadAliasSeed(path)` → `DescriptorAliasSeed` — `data/taxonomy/descriptor_aliases.seed.json`

### Corpus & Analysis
- `loadCorpus(path)` → `SemanticMaterial[]` — `data/enriched_materials.json` (70MB)
- `analyzeCorpus(corpus, options)` → `CorpusAnalysis { frequency, cooccurrence, aliasCandidates }`

### Inference
- `buildSimilarityGraph(seed, analysis, inputs, options)` → `SimilarityGraph`
  - `inputs: { curatedRelations, accordMap }` (type `BuildSimilarityGraphInputs`)
  - `options: { threshold?, generatedAt?, weights? }`
- `buildSeedCorpusProfiles(seed, analysis, options)` → `SeedCorpusProfileResult`
  - Returns `{ profiles, inferred_descriptors, noise_decisions, corpus_noise_suggestions, review_queue }`
  - Options includes `curatedNoiseDescriptors` from semantic_noise.v1.json

### Data Files (all explicit inputs)
- `data/taxonomy/taxonomy-seed.v1.json` — curated seed hierarchy
- `data/taxonomy/descriptor_aliases.seed.json` — curated alias map (7 entries)
- `data/enriched_materials.json` — raw corpus (70MB, gitignored)
- `data/inference/curated_relations.v1.json` — `{ version, relations: [] }`
- `data/inference/accord_map.v1.json` — `{ version, accords: [] }`
- `data/inference/semantic_noise.v1.json` — `{ version, noise_descriptors: [...], downweight_value: 0.35 }`

## 3. CLI Architecture: Compiled JS (not tsx)

### Current Build Setup
- `tsconfig.json`: `outDir: "dist"`, `module: "ESNext"`, `target: "ES2022"`
- Current build script: `"build": "tsc --noEmit"` — type check only, does NOT emit JS

### Required Changes
- Change `"build"` to emit JS: `"build": "tsc"` (removes `--noEmit`)
- Add `"compile"` script: `"compile": "node dist/cli/compile.js"`
- The CLI runs as compiled JS, not via `npx tsx`
- Development: `tsc && node dist/cli/compile.js`
- Production: `npm run build && npm run compile`

### generated_at Default
- CLI default: `new Date().toISOString()` (current UTC)
- `--generated-at <iso>` flag for deterministic/reproducible builds
- Tests: always pass explicit fixed value

## 4. Write Strategy: temp-file + rename

After all-or-nothing validation passes:
1. Write each artifact to `${outputDir}/.taxonomy.json.tmp`, `.descriptor_aliases.json.tmp`, `.similarity_matrix.json.tmp`
2. After ALL temp files written successfully, rename each `.tmp` → final name
3. If any write fails, clean up temp files and exit non-zero
4. Existing unrelated files in output dir are preserved (not deleted)

This prevents partial writes if the process crashes mid-output.

## 5. Compiler Pipeline Architecture

### Data Flow
```
taxonomy-seed.v1.json ─┐
                       ├──→ compileTaxonomy() ──→ taxonomy.json
enriched_materials.json ┤
                       ├──→ analyzeCorpus()
                       ├──→ buildSeedCorpusProfiles()
descriptor_aliases.seed ┤──→ compileAliases() ──→ descriptor_aliases.json
curated_relations.v1   ─┤
accord_map.v1          ─┤──→ buildSimilarityGraph() ──→ similarity_matrix.json
semantic_noise.v1      ─┘
```

### Compilation Steps
1. **Load** all inputs (seed, aliases, corpus, curated relations, accord map, semantic noise)
2. **Analyze** corpus → `CorpusAnalysis`
3. **Build profiles** → `SeedCorpusProfileResult` (seed + inferred descriptors with noise scoring)
4. **Build similarity graph** → `SimilarityGraph`
5. **Compile taxonomy** — merge seed + inferred descriptors, frequency data
6. **Compile alias map** — curated seed aliases only in wrapper format
7. **Validate** all three payloads against output schemas
8. **Write** all three files via temp-file + rename strategy

## 6. File Organization Plan

### New Files
```
src/compiler/
  compile_taxonomy.ts    — CompiledTaxonomy builder (seed + corpus merge via profiles)
  compile_aliases.ts     — CompiledAliases builder (curated seed only, wrapper format)
  compile_all.ts         — orchestrates all 3 compilations + all-or-nothing write
  validate_output.ts     — schema validators for all 3 output types
  types.ts               — CompiledAliases type, CompilerValidationError, etc.
  index.ts               — barrel export
src/cli/
  compile.ts             — CLI entry point (process.argv parsing, I/O)
  parse_args.ts          — argument parser (zero-dependency)
  index.ts               — barrel export
src/tests/
  compiler/
    compile_taxonomy.test.ts
    compile_aliases.test.ts
    compile_all.test.ts
    validate_output.test.ts
  cli/
    parse_args.test.ts
```

### Modified Files
```
src/package.json        — change "build" to emit JS, add "compile" script
src/tsconfig.json       — no changes needed (outDir: "dist" already set)
```

## 7. Testing Strategy

### Required Test Cases (user-specified)
1. **Validation failure writes nothing** — compileAll with invalid input → no files on disk
2. **Deterministic output with fixed generated_at** — two runs identical byte-for-byte
3. **No candidate aliases in descriptor_aliases.json** — only curated seed aliases
4. **Unrelated files in output dir preserved** — pre-existing file not deleted after compile

### Additional Unit Tests
- compile_taxonomy: seed descriptors source='seed', corpus descriptors source='corpus', sorting, stats
- compile_aliases: wrapper format with version, schema_version, generated_at, aliases
- validate_output: valid/invalid payloads for each artifact type
- parse_args: defaults, overrides, --help, --generated-at, unknown flags

## Validation Architecture

### Dimension 8: Output Validation
- Schema validators for `CompiledTaxonomy`, `CompiledAliases`, `SimilarityGraph`
- Null/undefined rejection: no `null` in output unless schema explicitly allows
- Optional field omission: missing fields omitted, not serialized as `null`
- Error taxonomy: `MISSING_FIELD`, `INVALID_TYPE`, `INVALID_VALUE`, `DUPLICATE_ID`, `EMPTY_ARRAY`

---

## RESEARCH COMPLETE
