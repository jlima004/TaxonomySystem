# Phase 6: Compilation & CLI — Research

**Researched:** 2026-05-20
**Scope:** COMP-01, COMP-02, COMP-03, COMP-04

## 1. Existing Type Contracts

### taxonomy.json → `CompiledTaxonomy` (src/types/taxonomy.ts)
- `version: string` — shared taxonomy release version
- `generated_at: string` — injectable timestamp
- `stats: TaxonomyStats` — `{ family_count, subfamily_count, descriptor_count }`
- `families: TaxonomyFamily[]` — each has `id`, `name`, `subfamilies[]`
  - subfamilies: `id`, `name`, `family_id`, `descriptors: CanonicalDescriptor[]`
    - descriptors: `{ id: string, source: 'seed' | 'corpus' | 'inferred', frequency: number }`

### descriptor_aliases.json → `DescriptorAliasMap` (src/types/taxonomy.ts)
- `Readonly<Record<string, string>>` — simple alias → canonical mapping
- Curated seed input: `data/taxonomy/descriptor_aliases.seed.json` (7 entries)
- **Decision:** Only curated seed aliases are promoted; corpus alias candidates are NOT merged

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
  - `inputs: { curatedRelations, accordMap }`
  - `options: { threshold?, generatedAt?, weights? }`
- Inference data files: `data/inference/curated_relations.v1.json`, `data/inference/accord_map.v1.json`, `data/inference/semantic_noise.v1.json`

## 3. Established Patterns to Follow

### JSON Export Pattern (src/analyzer/export.ts)
```typescript
const writeJsonDeterministic = async (path: string, payload: object): Promise<void> => {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}
```
- Recursive directory creation
- Pretty-print with 2-space indent + trailing newline
- Deterministic sorting before serialization

### Validation Pattern (src/loader/types.ts)
```typescript
type ValidationError = { path: string, expected: string, received: string }
type ValidationResult<T> = { ok: boolean, errors: ValidationError[], value?: T }
```
- Structured errors with JSON path, expected, and received
- `makeError()` / `makeResult()` helpers

### Module Organization
- ESM strict TypeScript, zero runtime dependencies
- Pure functional core; I/O at boundaries
- snake_case files, camelCase functions, PascalCase types, UPPER_SNAKE constants
- Tests under `src/tests/<concern>/`

## 4. Compiler Pipeline Architecture

### Data Flow
```
taxonomy-seed.v1.json ─┐
                       ├──→ compileTaxonomy() ──→ taxonomy.json
enriched_materials.json ┤                         descriptor_aliases.json
                       ├──→ analyzeCorpus()       similarity_matrix.json
descriptor_aliases.seed ┤
curated_relations.v1   ─┤
accord_map.v1          ─┤
semantic_noise.v1      ─┘──→ buildSimilarityGraph()
```

### Compilation Steps
1. **Load** all inputs (seed, aliases, corpus, curated relations, accord map)
2. **Analyze** corpus (frequency, co-occurrence, alias candidates) — reuse `analyzeCorpus()`
3. **Build similarity graph** — reuse `buildSimilarityGraph()`
4. **Compile taxonomy** — merge seed hierarchy with corpus frequency data as non-curated descriptors
5. **Compile alias map** — copy curated seed aliases only (NOT corpus candidates)
6. **Compile similarity matrix** — direct output from `buildSimilarityGraph()`
7. **Validate** all three payloads against output schemas
8. **Write** all three files atomically (write to temp, then rename or write all-at-once after validation)

### Output Schema Validation Approach
- Pure function validators that check shape, required fields, and constraints
- Return structured `ValidationError[]` with artifact name, JSON path, error code, message
- All-or-nothing: validate all 3 payloads before writing anything
- Warnings (review_queue, low-confidence evidence) are non-fatal

## 5. CLI Design

### Entry Point
- `src/cli/compile.ts` — main CLI entry
- Wired via `src/package.json` → `"compile": "npx tsx cli/compile.ts"`
- Usage: `npm run compile` (defaults) or `npm run compile -- --out data/compiled/v1`

### CLI Arguments (process.argv)
- `--seed <path>` — seed JSON path (default: `data/taxonomy/taxonomy-seed.v1.json`)
- `--aliases <path>` — curated alias seed path (default: `data/taxonomy/descriptor_aliases.seed.json`)
- `--corpus <path>` — corpus path (default: `data/enriched_materials.json`)
- `--relations <path>` — curated relations path (default: `data/inference/curated_relations.v1.json`)
- `--accords <path>` — accord map path (default: `data/inference/accord_map.v1.json`)
- `--out <dir>` — output directory (default: `data/compiled/v1`)
- `--version <v>` — taxonomy version (default: `1.0.0`)

### CLI Output
```
Taxonomy Compiler v1

  Loading inputs...
  ✓ Seed: 3 families, 7 subfamilies
  ✓ Aliases: 7 curated mappings
  ✓ Corpus: 12,345 materials
  ✓ Relations: 0 curated
  ✓ Accords: 0 curated

  Compiling...
  ✓ taxonomy.json — 3 families, 7 subfamilies, 42 descriptors
  ✓ descriptor_aliases.json — 7 aliases
  ✓ similarity_matrix.json — 5 edges (density: 0.14)

  Validating...
  ✓ All schemas valid (0 warnings)

  Output: data/compiled/v1/
    taxonomy.json
    descriptor_aliases.json
    similarity_matrix.json
```

## 6. File Organization Plan

### New Files
```
src/compiler/
  compile_taxonomy.ts    — CompiledTaxonomy builder (seed + corpus freq merge)
  compile_aliases.ts     — DescriptorAliasMap builder (curated seed only)
  compile_all.ts         — orchestrates all 3 compilations
  validate_output.ts     — schema validators for all 3 output types
  index.ts               — barrel export
src/cli/
  compile.ts             — CLI entry point (process.argv parsing, I/O)
  parse_args.ts          — argument parser (zero-dependency)
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
src/package.json          — add "compile" script
```

## 7. Key Design Decisions

### taxonomy.json Compilation
- Iterate seed families → subfamilies → descriptors → set source='seed', frequency from corpus
- Add corpus-found descriptors NOT in seed as source='corpus' entries (candidates, never promoted)
- Sort: families by id, subfamilies by id, descriptors by id (deterministic)
- Stats: count families, subfamilies, all descriptors

### descriptor_aliases.json Compilation
- Direct copy of curated alias seed `data/taxonomy/descriptor_aliases.seed.json`
- Wrap in versioned artifact: `{ version, generated_at, aliases: Record<string, string> }`
- Or per existing type: just `DescriptorAliasMap` = `Record<string, string>` — check if wrapper needed
- Decision: The existing type `DescriptorAliasMap` is a plain `Record<string, string>`. The compiled artifact should add `version` and `generated_at` metadata consistent with other artifacts.

### All-or-Nothing Validation
- Build all 3 payloads in memory first
- Run validators on each
- If any fails: print errors, exit non-zero, write nothing
- If all pass: write all 3 files via `writeJsonDeterministic()`

### Determinism
- `generated_at` is injectable (parameter or env var) for tests/CI
- All arrays are sorted deterministically (alphabetical by id/key)
- `JSON.stringify(payload, null, 2) + '\n'`

## 8. Testing Strategy

### Unit Tests
- `compile_taxonomy.test.ts`: verify seed descriptors marked 'seed', corpus descriptors marked 'corpus', sorting, stats
- `compile_aliases.test.ts`: verify only curated aliases, no corpus candidates
- `validate_output.test.ts`: valid payloads pass, invalid payloads return structured errors
- `parse_args.test.ts`: defaults, overrides, unknown flags

### Integration Tests
- `compile_all.test.ts`: full pipeline with small fixtures → 3 valid JSON files
- Determinism: two runs with same inputs + fixed `generated_at` produce byte-identical output

## Validation Architecture

### Dimension 8: Output Validation
- Schema validators for `CompiledTaxonomy`, `DescriptorAliasMap`, `SimilarityGraph`
- Null/undefined rejection: no `null` in output unless schema explicitly allows
- Optional field omission: missing fields omitted, not serialized as `null`
- Error taxonomy: `MISSING_FIELD`, `INVALID_TYPE`, `INVALID_VALUE`, `DUPLICATE_ID`, `EMPTY_ARRAY`

---

## RESEARCH COMPLETE
