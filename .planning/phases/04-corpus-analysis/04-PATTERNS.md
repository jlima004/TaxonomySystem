# Phase 4: Corpus Analysis — Pattern Map

**Mapped:** 2026-05-17
**Files analyzed:** 17 (8 source + 1 types + 7 tests + 1 fixtures bucket)
**Analogs found:** 17 / 17

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/types/analysis.ts` | type-only module | declarative | `src/types/seed.ts`, `src/types/registry.ts`, `src/types/similarity.ts` | exact |
| `src/types/index.ts` (modify) | barrel re-export | declarative | existing `src/types/index.ts` | exact |
| `src/analyzer/frequency.ts` | pure-function module | transform (single-pass reduce) | `src/normalizer/singularize.ts` (small pure fn over input) + `src/normalizer/normalize_descriptor.ts` (composer) | role-match |
| `src/analyzer/cooccurrence.ts` | pure-function module | transform (single-pass over corpus, sparse map output) | `src/normalizer/singularize.ts` (pure-fn shape) | role-match |
| `src/analyzer/similarity/levenshtein.ts` | atomic pure-function utility | scalar transform (string × string → number) | `src/normalizer/collapse_underscores.ts`, `src/normalizer/normalize_case.ts` (minimal pure-fn modules) | role-match |
| `src/analyzer/similarity/token_overlap.ts` | atomic pure-function utility | scalar transform (string × string → number) | `src/normalizer/collapse_underscores.ts` | role-match |
| `src/analyzer/alias_candidates.ts` | pure-function module with options + injected seeds | second-stage transform (frequency map → candidate list) | `src/normalizer/normalize_descriptor.ts` (composer) + `src/loader/alias_validator.ts` (validation/staging with optional injection) | role-match |
| `src/analyzer/analyze_corpus.ts` | top-level orchestrator (composer) | request-response in-memory | `src/normalizer/normalize_descriptor.ts` (PIPELINE composer with documented contracts) | exact |
| `src/analyzer/export.ts` | deterministic JSON serializer + `fs.promises.mkdir`/`writeFile` boundary | file-I/O (write-only) | `src/loader/corpus_loader.ts` + `src/loader/seed_loader.ts` (mirror — fs/promises read pattern, adapted to write) | role-match (boundary I/O) |
| `src/analyzer/index.ts` | barrel re-export | declarative | `src/normalizer/index.ts`, `src/loader/index.ts` | exact |
| `src/tests/analysis/frequency.test.ts` | Vitest unit + property test | test-only | `src/tests/normalization/singularize.test.ts` (unit grouped by `describe/it`) + `src/tests/normalization/property.test.ts` (idempotency/determinism loops) | exact |
| `src/tests/analysis/cooccurrence.test.ts` | Vitest unit + property test | test-only | `src/tests/normalization/property.test.ts` | exact |
| `src/tests/analysis/similarity.test.ts` | Vitest unit test | test-only | `src/tests/normalization/case.test.ts`, `src/tests/normalization/separators.test.ts` (small focused unit tests) | exact |
| `src/tests/analysis/alias_candidates.test.ts` | Vitest unit (fixture-driven) | test-only | `src/tests/corpus_loader.test.ts` (fixture-loading + targeted assertions) + `src/tests/normalization/convergence.test.ts` (fixture-style cases) | exact |
| `src/tests/analysis/orchestration.test.ts` | Vitest unit + property test | test-only | `src/tests/normalization/index.test.ts` (barrel/top-level call cases) + `src/tests/normalization/property.test.ts` | exact |
| `src/tests/analysis/export.test.ts` | Vitest unit (tmpdir + fs.promises write/read roundtrip) | test-only | `src/tests/stress.test.ts` (tmpdir + writeFile/rm + roundtrip) | role-match |
| `src/tests/analysis/stress.test.ts` | Vitest perf benchmark with `performance.now()` | test-only | `src/tests/normalization/benchmark.test.ts` (canonical Phase 3 `performance.now()` pattern) + `src/tests/stress.test.ts` | exact |
| `src/tests/fixtures/analysis/*.json` | canonical fixtures (JSON) | declarative | `src/tests/fixtures/corpus_sample.json` | exact |

---

## Pattern Assignments

### `src/types/analysis.ts` (type-only module, declarative)

**Analog:** `src/types/seed.ts` (+ `src/types/registry.ts`, `src/types/similarity.ts`)

**Module header pattern** (`src/types/seed.ts` lines 1-3):

```1:3:src/types/seed.ts
// Taxonomy Seed types — manual hierarchy input
// Represents the human-curated taxonomy seed (family → subfamily → descriptors)
```

**Type-only export shape — flat `type`, fully `readonly`** (`src/types/seed.ts` lines 4-27):

```4:26:src/types/seed.ts
export type SeedMetadata = {
  readonly created_at: string
  readonly author: string
  readonly description: string
}

export type TaxonomySeedSubfamily = {
  readonly id: string
  readonly name: string
  readonly descriptors: readonly string[]
}

export type TaxonomySeedFamily = {
  readonly id: string
  readonly name: string
  readonly subfamilies: readonly TaxonomySeedSubfamily[]
}

export type TaxonomySeed = {
  readonly version: string
  readonly metadata: SeedMetadata
  readonly families: readonly TaxonomySeedFamily[]
}
```

**Alias-of-Map type pattern** (`src/types/registry.ts` lines 1-9 — note the use of plain `Map` for in-memory registries; semicolons present here but `seed.ts` is the convention to follow):

```1:9:src/types/registry.ts
export type DescriptorNode = {
  readonly id: string;
  readonly canonical: string;
  readonly aliases: readonly string[];
  readonly family_refs: readonly string[];
  readonly occurrence_count: number;
};

export type DescriptorRegistry = Map<string, DescriptorNode>;
```

**Sparse edge-list shape** (`src/types/similarity.ts` lines 10-15) — closest cousin to `CoOccurrenceEdge`/`AliasCandidate`:

```10:15:src/types/similarity.ts
export type SimilarityEdge = {
  readonly source: string
  readonly target: string
  readonly score: number
  readonly dimensions: Readonly<Record<string, number>>
}
```

**Adaptation notes:**
- Use the **no-semicolon** style from `seed.ts`/`similarity.ts`/`corpus.ts` (NOT `registry.ts`, which is a stylistic outlier).
- Define `FrequencyMap = ReadonlyMap<string, number>` and `CoOccurrenceMap = ReadonlyMap<string, number>` as alias types (cf. `DescriptorRegistry = Map<...>` in `registry.ts`). Use `ReadonlyMap`, not `Map`, because ANAL-D-13 requires readonly outputs.
- `CoOccurrenceEdge`, `FrequencyEntry`, `AliasCandidate`, `CorpusAnalysis` follow the `SimilarityEdge` shape — every field `readonly`, optional fields with `?:`, no `interface`.
- Document the pair-key encoding contract in a leading comment block (mirror the comment header pattern of `seed.ts`/`corpus.ts`).
- Filename `analysis.ts` (snake_case singular) matches the singular-domain convention (`corpus.ts`, `seed.ts`, `alias.ts`, `registry.ts`, `similarity.ts`).

---

### `src/types/index.ts` (modify — barrel re-export, declarative)

**Analog:** existing `src/types/index.ts`

**Re-export block pattern** (`src/types/index.ts` lines 22-39):

```22:39:src/types/index.ts
export type {
  CompiledTaxonomy,
  TaxonomyFamily,
  TaxonomySubfamily,
  TaxonomyStats,
  CanonicalDescriptor,
  DescriptorAliasMap,
} from './taxonomy.ts'

export type {
  SimilarityGraph,
  SimilarityDimension,
  SimilarityEdge,
  SimilarityStats,
} from './similarity.ts'

export type { DescriptorAliasSeed } from './alias.ts'
export type { DescriptorNode, DescriptorRegistry } from './registry.ts'
```

**Adaptation notes:**
- Append a new `export type { FrequencyMap, CoOccurrenceMap, CoOccurrenceEdge, FrequencyEntry, AliasCandidate, CorpusAnalysis } from './analysis.ts'` block in the same multi-line style.
- Keep `.ts` extension in the import specifier (current barrel uses `./taxonomy.ts`, NOT `./taxonomy.js`) — this is the project convention for the **types** barrel (the analyzer/normalizer barrels use `.js`; see below).

---

### `src/analyzer/frequency.ts` (pure-function module, single-pass transform)

**Analog (style):** `src/normalizer/singularize.ts` (atomic pure-fn module with helper)
**Analog (composer / contract documentation):** `src/normalizer/normalize_descriptor.ts`

**Pure-function module header + JSDoc contract** (`src/normalizer/singularize.ts` lines 35-50):

```35:50:src/normalizer/singularize.ts
/**
 * Convert plural tokens to singular form using dictionary-first rules.
 *
 * @param input - Normalized descriptor token or snake_case descriptor.
 * @returns Singularized token(s), preserving underscores as token separators.
 */
export const singularize = (input: string): string => {
  if (input.includes('_')) {
    return input
      .split('_')
      .map(singularizeToken)
      .join('_')
  }

  return singularizeToken(input)
}
```

**Module-level helper + main export pattern** (`src/normalizer/singularize.ts` lines 1-33 — same file shows the layering of private helper above public `export const`):

```1:33:src/normalizer/singularize.ts
import { lookupIrregularPlural } from './irregular_plurals.js'

const NON_PLURAL_TERMINALS = new Set([
  'gas',
  'iris',
  'citrus',
  'anis',
  'canvas',
  'chaos',
  'cosmos',
  'ethos',
  'pathos',
  'analysis',
  'thesis',
  'basis',
  'crisis',
  'hypothesis',
  'synthesis',
])

const singularizeToken = (word: string): string => {
  const irregular = lookupIrregularPlural(word)
  if (irregular !== undefined) return irregular

  if (NON_PLURAL_TERMINALS.has(word)) return word

  if (word.endsWith('ies') && word.length > 3) return word.slice(0, -3) + 'y'
  if (/(sses|xes|zes|ches|shes)$/.test(word)) return word.slice(0, -2)
  if (word.endsWith('us')) return word
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 2) return word.slice(0, -1)

  return word
}
```

**Composer with documented step-by-step contract** (`src/normalizer/normalize_descriptor.ts` lines 9-40 — copy the JSDoc-table contract pattern):

```9:40:src/normalizer/normalize_descriptor.ts
/**
 * Pipeline contracts:
 *
 * | Step | Assumes input | Guarantees output |
 * | --- | --- | --- |
 * | normalizeUnicode | any UTF-8 string | NFD-normalized, no combining marks, ligatures expanded |
 * | normalizeCase | valid string | all lowercase |
 * | normalizeSeparators | lowercase string | spaces, hyphens, slashes, apostrophes, unicode dashes -> `_` |
 * | removePunctuation | any string | only `[a-zA-Z0-9_]` remains, preserving case |
 * | collapseUnderscores | descriptor-like string with underscores | no consecutive `__` |
 * | trimUnderscores | descriptor-like string with underscores | no leading/trailing `_` |
 * | singularize | clean snake_case `[a-z0-9_]+` tokens | plural tokens mapped to singular forms |
 */
const PIPELINE = [
  normalizeUnicode,
  normalizeCase,
  normalizeSeparators,
  removePunctuation,
  collapseUnderscores,
  trimUnderscores,
  singularize,
] as const

/**
 * Normalize raw descriptor text into canonical snake_case form.
 *
 * @param input - Raw descriptor text.
 * @returns Canonical normalized descriptor or empty string.
 */
export const normalizeDescriptor = (input: string): string => {
  return PIPELINE.reduce((acc, fn) => fn(acc), input)
}
```

**Adaptation notes:**
- Import `normalizeDescriptor` via `import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'` (use `.js` extension for source imports — see `singularize.ts` line 1 importing from `./irregular_plurals.js`).
- Public export: `export const computeDescriptorFrequency = (corpus): FrequencyMap => { ... }`. Input typing should be the structural minimum from RESEARCH §Top-level Orchestration (`readonly { readonly olfactory: { readonly descriptors: readonly string[] } }[]`), NOT `SemanticMaterial[]`, so test fixtures can be minimal.
- Implementation is single-pass: `for (const material of corpus)` → build per-material `Set<string>` of normalized non-empty descriptors → increment `Map<string, number>`. ANAL-D-03 dedup-per-material; ANAL-D-18 single pass.
- JSDoc must document the contract verbatim (empty descriptors dropped, document frequency not term frequency, idempotency under normalization).
- Type-only import of `FrequencyMap` via `import type { FrequencyMap } from '../types/analysis.js'`.
- No semicolons, arrow function, snake_case file.

---

### `src/analyzer/cooccurrence.ts` (pure-function module, single-pass transform)

**Analog:** same as `frequency.ts` (`src/normalizer/singularize.ts` for module shape, `src/normalizer/normalize_descriptor.ts` for documented composer).

**Adaptation notes:**
- Mirror `frequency.ts` style exactly. Public export: `export const computeCoOccurrence = (corpus): CoOccurrenceMap => { ... }`.
- Algorithm follows RESEARCH §Frequency & Co-occurrence Implementation: per-material normalize → dedup `Set` → `[...set].sort()` → nested loop `i < j` over sorted array building `${a}|${b}` keys (ANAL-D-05 canonical order from sort, ANAL-D-17 no self-pairs guaranteed by `i < j`).
- Document pair-key encoding contract in JSDoc (charset `^[a-z0-9_]+$` guarantees `|` non-collision).
- The PLAN may split this into a tiny `pair_key.ts` helper (encode/decode) as RESEARCH §Internal module layout suggests; if so, that helper follows the `collapse_underscores.ts` shape (one-line pure fn + JSDoc, see below).
- Consider exposing a co-resident `computeFrequencyAndCoOccurrence` single-pass that returns both maps (RESEARCH §Single-pass algorithm shape) — under this naming convention, the file may be renamed/grouped per PLAN discretion; the analog patterns do not change.

---

### `src/analyzer/similarity/levenshtein.ts` (atomic pure-function utility)

**Analog (file shape & JSDoc):** `src/normalizer/collapse_underscores.ts` and `src/normalizer/normalize_case.ts` (smallest atomic pure-fn modules)

**Module shape — JSDoc + single arrow function, no semicolons, no module state** (`src/normalizer/collapse_underscores.ts` lines 1-9):

```1:9:src/normalizer/collapse_underscores.ts
/**
 * Collapse consecutive underscores into a single underscore.
 *
 * @param input - Descriptor-like string that may contain `__` sequences.
 * @returns String with no consecutive underscores.
 */
export const collapseUnderscores = (input: string): string => {
  return input.replace(/_+/g, '_')
}
```

**Trivial-pure-fn variant** (`src/normalizer/normalize_case.ts` lines 1-9):

```1:9:src/normalizer/normalize_case.ts
/**
 * Convert text to lowercase.
 *
 * @param input - Any string.
 * @returns Lowercased string.
 */
export const normalizeCase = (input: string): string => {
  return input.toLowerCase()
}
```

**Adaptation notes:**
- Two exports: `levenshteinDistance(a: string, b: string): number` and `levenshteinSimilarity(a: string, b: string): number`. Each gets its own JSDoc block in the `collapseUnderscores` style.
- Implementation per RESEARCH §Levenshtein distance — two-row DP with `Uint16Array`, allocated per call (preserves purity; matches RESEARCH/PROJECT zero-state convention).
- Use `??` for `noUncheckedIndexedAccess` compliance — see `src/tests/normalization/convergence.test.ts` line 7 (`normalizeDescriptor(variants[0] ?? '')`) for the project pattern when indexing arrays.
- No internal module-level state; no `let` at module scope. `Uint16Array` reused **within** a call only, not across calls.
- Use `charCodeAt`, not `at`/`[]`, in the inner loop (RESEARCH explicit recommendation).
- Nested folder `src/analyzer/similarity/` is a new structural choice — no exact analog in the codebase, but consistent with `src/loader/` containing both atomic loaders and validators side-by-side.

---

### `src/analyzer/similarity/token_overlap.ts` (atomic pure-function utility)

**Analog:** `src/normalizer/collapse_underscores.ts` (same micro-module shape as `levenshtein.ts`)

**Adaptation notes:**
- Single export `tokenJaccard(a: string, b: string): number` (RESEARCH names it `tokenOverlapSimilarity` — defer naming to PLAN).
- Mirror the `collapseUnderscores` JSDoc + arrow-fn shape.
- Implementation per RESEARCH §Token overlap (Jaccard): `new Set(a.split('_'))`, intersection size, union size, `union === 0 ? 1 : intersection / union`.
- Type-only import optional (no domain types touched).

---

### `src/analyzer/alias_candidates.ts` (pure-function module with options + injected seeds)

**Analog (composer with documented multi-stage contract):** `src/normalizer/normalize_descriptor.ts`
**Analog (validation with optional injection + result shape):** `src/loader/alias_validator.ts`

**Validator-style staged loop with options + cumulative result** (`src/loader/alias_validator.ts` lines 5-54):

```5:54:src/loader/alias_validator.ts
export const validateAliasSeed = (data: unknown, maxDepth: number = 1): ValidationResult<DescriptorAliasSeed> => {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return makeResult([makeError('root', 'Record<string, string>', Array.isArray(data) ? 'array' : typeof data)])
  }

  const obj = data as Record<string, unknown>
  const seed: Record<string, string> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value !== 'string') {
      errors.push(makeError(`alias[${key}]`, 'string', typeof value))
    } else {
      seed[key] = value
    }
  }

  if (errors.length > 0) {
    return makeResult(errors)
  }

  // Detect circular dependencies and long chains
  for (const key of Object.keys(seed)) {
    const visited = new Set<string>()
    let current: string | undefined = current
    let depth = 0
    // ... iterative pass with bounded depth ...
  }

  return makeResult<DescriptorAliasSeed>(errors, errors.length === 0 ? seed : undefined)
}
```

**Adaptation notes:**
- Public export: `export const findAliasCandidates = (frequency: FrequencyMap, options: AliasCandidateOptions = {}): readonly AliasCandidate[] => { ... }`.
- Options object with all-optional fields matches the pattern of `validateAliasSeed(data, maxDepth: number = 1)` (default parameters at the call boundary, NOT internal `Object.assign({...defaults})`). For the richer options bag, prefer an explicit destructure with defaults at the top of the function: `const { minFrequency = 2, minScore = 0.90, tokenOverlapFloor = 0.5, substringRejectScore = 0.97, aliasSeed, taxonomySeed } = options`.
- Top-of-file UPPER_SNAKE_CASE constants for defaults (RESEARCH §High-precision default threshold) — analog: `NON_PLURAL_TERMINALS` (Set) in `src/normalizer/singularize.ts` line 3 shows the in-module constant pattern; for scalar defaults use `const DEFAULT_MIN_SCORE = 0.90`.
- Module-private helpers (`pickCanonical`, `buildDescriptorToFamilies`, `buildSeedPairSet`, `shouldEmitCandidate`, `isSubstringOnly`) follow the `singularizeToken` pattern: declared above the public export as `const helperName = (...): T => { ... }`.
- Import `normalizeDescriptor` via `import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'` when normalizing seed descriptors (RESEARCH §Family annotation).
- Type-only imports: `import type { FrequencyMap, AliasCandidate } from '../types/analysis.js'`, `import type { TaxonomySeed } from '../types/seed.js'`, `import type { DescriptorAliasSeed } from '../types/alias.js'`.
- Final sort: arrow comparator nested ternary, matching the style used in tests (`src/tests/normalization/property.test.ts` and the conditionals in `singularize.ts`).

---

### `src/analyzer/analyze_corpus.ts` (top-level orchestrator / composer)

**Analog:** `src/normalizer/normalize_descriptor.ts`

**Composer pattern — frozen pipeline + documented contract + single-line reduce** (`src/normalizer/normalize_descriptor.ts` lines 22-40, already cited above).

**Adaptation notes:**
- Module header: JSDoc table documenting the three stages (frequency, cooccurrence, alias candidates) and which ANAL-D-* contract each satisfies (mirror the `normalize_descriptor.ts` step-by-step table).
- Two exported types adjacent: `AnalyzeCorpusOptions`, `CorpusAnalysis` (or imported from `../types/analysis.js`).
- Public export `analyzeCorpus(corpus, options?)` is an arrow `const` that internally calls the lower-level functions and assembles the result object (RESEARCH §`analyzeCorpus(corpus, options)`).
- Skip the second stage when `options?.aliasCandidates` is undefined (return `aliasCandidates: []`), per RESEARCH recommendation.
- Filename `analyze_corpus.ts` matches the verb-prefix convention used by `normalize_descriptor.ts` (`<verb>_<noun>.ts`).

---

### `src/analyzer/export.ts` (deterministic JSON serializer + `fs/promises` boundary)

**Analog (read-side boundary, mirror to write-side):** `src/loader/corpus_loader.ts` + `src/loader/seed_loader.ts`

**Imports pattern — `node:fs/promises` named imports, narrow domain types** (`src/loader/corpus_loader.ts` lines 1-2):

```1:2:src/loader/corpus_loader.ts
import { readFile } from 'node:fs/promises'
import type { SemanticMaterial, OlfactoryProfile } from '../types/index.js'
```

**Async export shape — try/catch on IO with path-bearing error message** (`src/loader/corpus_loader.ts` lines 47-67):

```47:67:src/loader/corpus_loader.ts
export const loadCorpus = async (path: string): Promise<readonly SemanticMaterial[]> => {
  let content: string
  try {
    content = await readFile(path, 'utf8')
  } catch (error) {
    throw new Error(`Failed to read file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`)
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Expected JSON array')
  }

  return parsed.map(mapToSemanticMaterial)
}
```

**Adaptation notes:**
- This is the **only** module in `src/analyzer/` that touches `node:fs/promises`. Everything else stays pure (ANAL-D-13).
- Imports: `import { mkdir, writeFile } from 'node:fs/promises'` and `import { dirname } from 'node:path'` (no `readFile` here — write-side only).
- Three exports + one convenience function (RESEARCH §Module shape): `exportFrequencyJson`, `exportCoOccurrenceJson`, `exportAliasCandidatesJson`, `writeAnalysisArtifacts`.
- Each export sorts its input deterministically **before** `JSON.stringify` (ANAL-D-15). Trailing newline `+ '\n'`. `JSON.stringify(payload, null, 2)`.
- `mkdir(dirname(path), { recursive: true })` before `writeFile` — equivalent of `mkdir -p` (CONTEXT gotcha).
- Error wrapping is OPTIONAL here. The loader pattern wraps every IO error with a path-bearing message; for export, a thin re-throw is acceptable since the caller (Phase 6 CLI) owns the path. Match the loader's defensive style if the PLAN wants symmetry — copy the `try { await readFile } catch (error) { throw new Error(\`Failed to ... ${path}: ${msg}\`) }` block, swapping `readFile` for `writeFile`/`mkdir`.
- No timestamps in payload (ANAL-D-15 byte-determinism). Top-level shape: `{ version: 1, entries: [...] }` or `{ version: 1, edges: [...] }` or `{ version: 1, candidates: [...] }`.

---

### `src/analyzer/index.ts` (barrel re-export)

**Analog:** `src/normalizer/index.ts` (closest), `src/loader/index.ts`

**Barrel re-export pattern with `.js` extensions** (`src/normalizer/index.ts` lines 1-11):

```1:11:src/normalizer/index.ts
export { normalizeUnicode } from './normalize_unicode.js'
export { normalizeCase } from './normalize_case.js'
export { normalizeSeparators } from './normalize_separators.js'
export { removePunctuation } from './remove_punctuation.js'
export { collapseUnderscores } from './collapse_underscores.js'
export { trimUnderscores } from './trim_underscores.js'
export { singularize } from './singularize.js'
export { normalizeDescriptor } from './normalize_descriptor.js'
// @deprecated Use normalizeDescriptor instead. This compatibility export will be removed in v2.
export { normalizeText } from './text_normalizer.js'
export { IRREGULAR_PLURALS, lookupIrregularPlural } from './irregular_plurals.js'
```

**Mixed value + type re-exports** (`src/loader/index.ts` lines 1-6):

```1:6:src/loader/index.ts
export { loadTaxonomySeed } from './seed_loader.js'
export { validateSeed } from './seed_validator.js'
export type { ValidationError, ValidationResult } from './types.js'
export { loadCorpus } from './corpus_loader.js'
export { loadAliasSeed } from './alias_loader.js'
export { validateAliasSeed } from './alias_validator.js'
```

**Adaptation notes:**
- Use `.js` extension (analyzer barrel matches normalizer/loader, NOT the types barrel which uses `.ts`).
- Re-export the public API only: `analyzeCorpus`, `computeDescriptorFrequency`, `computeCoOccurrence`, `findAliasCandidates`, `levenshteinDistance`, `levenshteinSimilarity`, `tokenJaccard`, and the export-side functions if PLAN promotes them to public surface.
- Add `export type { ... }` line(s) for re-exporting analysis types if PLAN wants a single import surface; otherwise, callers import types from `../types/index.ts` directly.

---

### `src/tests/analysis/frequency.test.ts` (Vitest unit + property)

**Analog (unit cases grouped by `describe`/`it`):** `src/tests/normalization/singularize.test.ts`
**Analog (property loops with case arrays):** `src/tests/normalization/property.test.ts`

**Unit test grouping pattern** (`src/tests/normalization/singularize.test.ts` lines 1-43):

```1:43:src/tests/normalization/singularize.test.ts
import { describe, expect, it } from 'vitest'
import { singularize } from '../../normalizer/singularize.js'

describe('singularize', () => {
  it('uses irregular plural dictionary first', () => {
    expect(singularize('woods')).toBe('wood')
    expect(singularize('mosses')).toBe('moss')
    expect(singularize('leaves')).toBe('leaf')
    expect(singularize('berries')).toBe('berry')
  })

  it('handles suffix fallback rules', () => {
    expect(singularize('categories')).toBe('category')
    expect(singularize('classes')).toBe('class')
    expect(singularize('boxes')).toBe('box')
    expect(singularize('roses')).toBe('rose')
    expect(singularize('petals')).toBe('petal')
  })
  // ...
})
```

**Property test pattern — input array + per-case assertion with input-bearing message** (`src/tests/normalization/property.test.ts` lines 23-47):

```23:47:src/tests/normalization/property.test.ts
describe('normalizeDescriptor properties', () => {
  it('is idempotent across varied inputs', () => {
    for (const input of INPUTS) {
      const normalized = normalizeDescriptor(input)
      expect(normalizeDescriptor(normalized), `input: "${input}"`).toBe(normalized)
    }
  })

  it('is deterministic across repeated calls', () => {
    for (const input of INPUTS.slice(0, 6)) {
      const first = normalizeDescriptor(input)
      expect(normalizeDescriptor(input), `input: "${input}"`).toBe(first)
      expect(normalizeDescriptor(input), `input: "${input}"`).toBe(first)
    }
  })

  it('matches canonical charset for non-empty outputs', () => {
    const charset = /^[a-z0-9_]+$/
    for (const input of INPUTS) {
      const normalized = normalizeDescriptor(input)
      if (normalized.length > 0) {
        expect(charset.test(normalized), `input: "${input}", output: "${normalized}"`).toBe(true)
      }
    }
  })
  // ...
})
```

**Adaptation notes:**
- Import path: `import { computeDescriptorFrequency } from '../../analyzer/frequency.js'` (mirror `../../normalizer/singularize.js` two-up traversal from `src/tests/normalization/...`).
- Test cases derived from RESEARCH §Phase Requirements → Test Map and §Property tests recomendados:
  - Unit: deduplication per material, drop-empty-after-normalize, document-frequency semantics, count correctness on tiny fixture.
  - Property: frequency monotonicity over subsets, sum invariant (`sum(freq) === total dedup'd descriptor count`), determinism across re-runs, idempotency under pre-applied normalization.
- Use `INPUTS` / case arrays at module scope (analog: `INPUTS` in `property.test.ts` line 9).
- Per-iteration assertion message: `` `material ${i}` `` / `` `descriptor: "${d}"` `` mirroring `` `input: "${input}"` ``.
- No semicolons (test files in `src/tests/normalization/` are consistently no-semicolon).

---

### `src/tests/analysis/cooccurrence.test.ts` (Vitest unit + property)

**Analog:** same as `frequency.test.ts` — `singularize.test.ts` + `property.test.ts`.

**Adaptation notes:**
- Coverage targets per RESEARCH §Validation Architecture: canonical lex order (`a < b`), no self-pairs (ANAL-D-17), commutativity (count(a,b) === count(b,a) — trivial under storage but explicit-test), no zero-count entries post-export, sparse semantics (no dense N×N).
- Property tests follow the `INPUTS` array → loop → `expect(...).toBe(...)` pattern.
- Use a small in-test fixture array of materials (5–10 materials) inlined as a `const` (analog: the trace cases `traceCases` array in `src/tests/normalization/trace.test.ts` lines 16-113 shows the inline-fixture pattern with `readonly` typing).

---

### `src/tests/analysis/similarity.test.ts` (Vitest unit)

**Analog:** `src/tests/normalization/case.test.ts` (smallest focused unit test) + `src/tests/normalization/separators.test.ts`

**Smallest unit-test template** (`src/tests/normalization/case.test.ts` lines 1-17):

```1:17:src/tests/normalization/case.test.ts
import { describe, expect, it } from 'vitest'
import { normalizeCase } from '../../normalizer/normalize_case.js'

describe('normalizeCase', () => {
  it('lowercases words', () => {
    expect(normalizeCase('Fresh Green')).toBe('fresh green')
    expect(normalizeCase('YLANG-YLANG')).toBe('ylang-ylang')
  })

  it('preserves numbers', () => {
    expect(normalizeCase('C12')).toBe('c12')
  })

  it('is idempotent', () => {
    expect(normalizeCase(normalizeCase('Already Lower'))).toBe('already lower')
  })
})
```

**Adaptation notes:**
- Three `describe` blocks: one per primitive (`levenshteinDistance`, `levenshteinSimilarity`, `tokenJaccard`).
- Levenshtein cases per RESEARCH §Normalized Levenshtein similarity table: `("", "")→1`, `("", "rose")→0`, `("camomile", "chamomile")→≈0.889`, `("rose", "rosewood")→0.5`, plus identity (`("rose", "rose")→1`).
- `tokenJaccard` cases per RESEARCH §Token overlap: `lily_of_the_valley` vs `lily_of_valley` → 0.75; `rose` vs `rosewood` → 0 (single-token sets).
- Floating-point assertions: use `toBeCloseTo(value, 3)` for similarity scores (not exact `toBe`).
- Substring-only rejection is tested in `alias_candidates.test.ts` (combiner-level concern), NOT here — keep the similarity tests algorithmic and primitive-focused.

---

### `src/tests/analysis/alias_candidates.test.ts` (Vitest unit, fixture-driven)

**Analog (fixture loading from `src/tests/fixtures/`):** `src/tests/corpus_loader.test.ts`
**Analog (convergence-style targeted cases):** `src/tests/normalization/convergence.test.ts`

**Fixture path resolution pattern** (`src/tests/corpus_loader.test.ts` lines 1-22):

```1:22:src/tests/corpus_loader.test.ts
import { describe, it, expect } from 'vitest'
import { loadCorpus } from '../loader/corpus_loader.js'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures_dir = join(__dirname, 'fixtures')

describe('loadCorpus', () => {
  it('carrega fixture e retorna array com 4 materiais', async () => {
    const corpus = await loadCorpus(join(fixtures_dir, 'corpus_sample.json'))
    expect(corpus).toHaveLength(4)
  })
```

**Adaptation notes:**
- File lives at `src/tests/analysis/alias_candidates.test.ts` (two levels deep), so fixture path is `join(__dirname, '..', 'fixtures', 'analysis', '...')` — adjust the `..` segments accordingly.
- Required fixture coverage (per RESEARCH §Canonical fixtures): camomile↔chamomile detection at `minScore: 0.85`; rose↔rosewood rejected by substring gate; pairs already in `descriptor_aliases.seed.json` excluded; `suggested_canonical` follows `seed > frequency > lex`; `minFrequency = 2` filters singletons.
- For inline fixtures (where a JSON file is overkill), use the inline-`const` pattern from `trace.test.ts` line 16 (`const traceCases: readonly TraceCase[] = [ ... ]`).
- Convergence-style test groupings (multiple semantically related cases per `it`) mirror `convergence.test.ts` lines 4-30 — useful for "all these inputs should produce the same canonical alias direction" type tests.

---

### `src/tests/analysis/orchestration.test.ts` (Vitest unit + property)

**Analog (barrel-level smoke + representative cases):** `src/tests/normalization/index.test.ts`
**Analog (property loops):** `src/tests/normalization/property.test.ts`

**Barrel/top-level smoke pattern** (`src/tests/normalization/index.test.ts` lines 1-26):

```1:26:src/tests/normalization/index.test.ts
import { describe, expect, it } from 'vitest'
import {
  IRREGULAR_PLURALS,
  collapseUnderscores,
  lookupIrregularPlural,
  normalizeCase,
  normalizeDescriptor,
  normalizeSeparators,
  normalizeUnicode,
  removePunctuation,
  singularize,
  trimUnderscores,
} from '../../normalizer/index.js'

describe('normalizeDescriptor smoke cases', () => {
  it('exports atomic normalizer functions and dictionary helpers', () => {
    expect(normalizeUnicode('ÆTHER')).toBe('AETHER')
    expect(normalizeCase('Fresh')).toBe('fresh')
    expect(normalizeSeparators('fresh-green')).toBe('fresh_green')
    expect(removePunctuation('fresh!')).toBe('fresh')
    expect(collapseUnderscores('fresh___green')).toBe('fresh_green')
    expect(trimUnderscores('_fresh_')).toBe('fresh')
    expect(singularize('woods')).toBe('wood')
    expect(IRREGULAR_PLURALS.woods).toBe('wood')
    expect(lookupIrregularPlural('woods')).toBe('wood')
  })
```

**Adaptation notes:**
- Import everything from the barrel (`../../analyzer/index.js`) to exercise the public surface — analog: `index.test.ts` line 13.
- Three coverage areas: (a) `analyzeCorpus` returns readonly `CorpusAnalysis` with all three fields; (b) input mutation invariant (clone input, call, assert identical to deep-frozen reference); (c) opt-in alias step (calling without `options.aliasCandidates` yields `aliasCandidates: []`).
- Property tests: determinism re-run (call twice, deep-equal), idempotency under pre-normalized input.

---

### `src/tests/analysis/export.test.ts` (Vitest unit with tmpdir + fs roundtrip)

**Analog:** `src/tests/stress.test.ts` (tmpdir + writeFile + cleanup pattern)

**tmpdir + writeFile + cleanup pattern** (`src/tests/stress.test.ts` lines 1-31):

```1:31:src/tests/stress.test.ts
import { describe, it, expect } from 'vitest'
import { loadCorpus } from '../loader/corpus_loader.js'
import { join } from 'node:path'
import { writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'

describe('Performance Limits (Stress Test)', () => {
  it('should load and process 50,000 instances under 1.5 seconds', async () => {
    const items = []
    for (let i = 0; i < 50000; i++) {
      items.push({
        id: `mat_${i}`,
        identity: { name: `Material ${i}` },
        olfactory: { descriptors: ['woody', 'floral'] }
      })
    }

    const tmpFile = join(tmpdir(), 'stress-corpus.json')
    await writeFile(tmpFile, JSON.stringify(items))

    const start = performance.now()
    const result = await loadCorpus(tmpFile)
    const end = performance.now()

    await rm(tmpFile)

    expect(result.length).toBe(50000)
    expect(end - start).toBeLessThan(1500)
  })
})
```

**Adaptation notes:**
- Use `tmpdir()` + a uniquely-named subdirectory (e.g., `join(tmpdir(), 'taxonomy-analysis-export-${Date.now()}')`) to test `mkdir({ recursive: true })` — call `exportFrequencyJson` with a path inside a non-existing subdir, then `readFile` it back and assert structure.
- Cleanup with `await rm(tmpDir, { recursive: true })` in a `finally` or post-assertion call (analog: `await rm(tmpFile)` line 25). Consider Vitest's `afterEach` for symmetry if PLAN wants stricter cleanup contract.
- Byte-determinism test: call `exportFrequencyJson(map, path)` twice into two temp paths, `readFile` both, `expect(bufA).toEqual(bufB)`. Property invariant from RESEARCH §Risks (Determinism).
- Edge case: empty map input → file written with empty `entries: []` array.

---

### `src/tests/analysis/stress.test.ts` (Vitest perf benchmark with `performance.now()`)

**Analog (canonical Phase 3 `performance.now()` pattern):** `src/tests/normalization/benchmark.test.ts`
**Analog (legacy 50k stress pattern):** `src/tests/stress.test.ts`

**Phase 3 benchmark pattern with explicit CI-safe threshold + console log** (`src/tests/normalization/benchmark.test.ts` lines 1-31):

```1:31:src/tests/normalization/benchmark.test.ts
import { describe, expect, it } from 'vitest'
import { performance } from 'node:perf_hooks'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'

describe('normalization benchmark', () => {
  it('normalizes 100k descriptors under CI-safe threshold', () => {
    const testInputs = [
      'Fresh Green',
      'ylang-ylang',
      'Mosses',
      'orange blossom',
      "Cœur d'Aldehyde",
      'fresh---green///woody',
      'Aldehydes_C12',
      'patchouli (dark)',
      'lily of the valley',
      'already_snake_case',
    ]

    const iterations = 100_000
    const start = performance.now()

    for (let i = 0; i < iterations; i++) {
      normalizeDescriptor(testInputs[i % testInputs.length] ?? '')
    }

    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(5000)
    console.log(`100k normalizations: ${elapsed.toFixed(2)}ms (${(iterations / elapsed * 1000).toFixed(0)} ops/sec)`)
  })
})
```

**Adaptation notes:**
- Import `performance` from `node:perf_hooks` (matches Phase 3 benchmark, line 2). The other stress file uses the global `performance` directly; either is acceptable, but the Phase 3 explicit import is the more recent pattern and matches PROJECT.md's "prefer explicit `node:*` imports".
- Two cases per RESEARCH §Performance benchmark:
  - `analyzeCorpus(5000_materials, { aliasCandidates: { minFrequency: 2, minScore: 0.90 } })` → CI ceiling 2000ms, target ~500ms.
  - `analyzeCorpus(5000_materials)` (no alias step) → CI ceiling 500ms, target ~200ms.
- Synthetic corpus generator co-located as `src/tests/analysis/_fixtures/generate.ts` (RESEARCH §Wave 0 Gaps). Helper function: `generateSyntheticCorpus({ materials: number, seed: number }): readonly { olfactory: { descriptors: readonly string[] } }[]`. Deterministic via seed (mulberry32 / xorshift in 5 LoC — zero-dep).
- `console.log(...)` line at the end of each case mirrors `benchmark.test.ts` line 29 for visibility in CI logs.

---

### `src/tests/fixtures/analysis/*.json` (canonical fixtures)

**Analog:** `src/tests/fixtures/corpus_sample.json`

**Existing fixture shape (JSON array of full materials)** (`src/tests/fixtures/corpus_sample.json` lines 1-39):

```1:39:src/tests/fixtures/corpus_sample.json
[
  {
    "id": "mat-1",
    "identity": {
      "name": "abies alba cone extract",
      "canonical_name": "abies alba cone extract",
      "aliases": ["silver fir extract"],
      "identifiers": {
        "cas": "90028-76-5",
        "einecs": "289-870-2"
      }
    },
    "classification": {
      "category": "flavor and fragrance agents",
      "category_path": ["flavor and fragrance agents"]
    },
    "olfactory": {
      "descriptors": ["balsamic", "pine", "woody"],
      "primary_type": "balsamic",
      "odor_description": "balsamic pine woody sweet",
      "descriptor_sources": {
        "tgsc": ["balsamic", "pine"],
        "sf": ["woody", "sweet"]
      }
    },
```

**Adaptation notes:**
- New folder `src/tests/fixtures/analysis/` — mirror the existing `src/tests/fixtures/` flat layout. The corpus_loader test uses a full-material fixture; analyzer tests can use **structurally minimal** fixtures (only `olfactory.descriptors`) since the analyzer types accept the structural minimum per RESEARCH §Top-level Orchestration.
- Recommended fixture files (per RESEARCH §Canonical fixtures):
  - `tiny_corpus.json` — 5–10 materials covering dedup, multi-token, empty-after-normalize, frequent single-tokens.
  - `camomile_corpus.json` — materials repeating `camomile` and `chamomile` enough times to clear `minFrequency = 2`.
  - `substring_trap_corpus.json` — rose, rosewood, sandalwood, sandal_wood (covers ANAL-D-10 gate).
  - `seed_excluded_corpus.json` — pairs already present in `data/taxonomy/descriptor_aliases.seed.json` (verify the test reads canonical forms after `normalizeDescriptor`).
- Determinism: hand-author JSON (no generation script committed). For the perf 5k fixture, generate in-test via deterministic seed (`_fixtures/generate.ts`), NOT a checked-in 5k JSON file (RESEARCH §Canonical fixtures explicit guidance).
- JSON formatting: 2-space indent matches existing fixture (`corpus_sample.json`).

---

## Shared Patterns

### No-semicolon, arrow-function, `readonly`-everywhere TypeScript style

**Source:** `src/normalizer/*.ts`, `src/loader/*.ts`, `src/types/*.ts` (except `registry.ts` which is the outlier)
**Apply to:** All new `.ts` files in `src/analyzer/` and `src/tests/analysis/`.

Canonical micro-example:

```1:9:src/normalizer/normalize_case.ts
/**
 * Convert text to lowercase.
 *
 * @param input - Any string.
 * @returns Lowercased string.
 */
export const normalizeCase = (input: string): string => {
  return input.toLowerCase()
}
```

Rules to copy verbatim:
- `export const fn = (args): RetType => { ... }` (arrow, not `function`).
- No trailing semicolons anywhere.
- JSDoc above every public export with `@param` and `@returns`.
- `readonly` on every type property, `readonly T[]` for arrays, `ReadonlyMap<...>` / `ReadonlySet<...>` for collections in public API surface.
- `type` (not `interface`) everywhere.
- snake_case filenames; camelCase function names; PascalCase type names; UPPER_SNAKE_CASE for module-private constants and exported defaults.

### `.js` extension on source imports, `.ts` extension on types-barrel imports

**Source:** `src/normalizer/index.ts`, `src/loader/index.ts` (use `.js`); `src/types/index.ts` (uses `.ts`).
**Apply to:**
- `src/analyzer/*.ts` and `src/tests/analysis/*.ts` source imports: `.js` extension.
- `src/types/index.ts` update: `.ts` extension (match existing barrel).

```7:13:src/normalizer/index.ts
export { singularize } from './singularize.js'
export { normalizeDescriptor } from './normalize_descriptor.js'
// @deprecated Use normalizeDescriptor instead. This compatibility export will be removed in v2.
export { normalizeText } from './text_normalizer.js'
export { IRREGULAR_PLURALS, lookupIrregularPlural } from './irregular_plurals.js'
```

```12:13:src/types/index.ts
} from './corpus.ts'

```

### Type-only imports via `import type`

**Source:** `src/loader/corpus_loader.ts` line 2.
**Apply to:** All analyzer modules importing domain types from `../types/index.js` or `../types/analysis.js`.

```2:2:src/loader/corpus_loader.ts
import type { SemanticMaterial, OlfactoryProfile } from '../types/index.js'
```

Use the `import type { ... }` form even when importing a single type, to make the type-only intent explicit and aid tree-shaking.

### `noUncheckedIndexedAccess` defensive `??`

**Source:** `src/tests/normalization/convergence.test.ts` line 7 — `normalizeDescriptor(variants[0] ?? '')`; throughout `src/normalizer/singularize.ts` for `IRREGULAR_PLURALS` lookups.
**Apply to:** All `Uint16Array` / typed-array indexing in `levenshtein.ts`; all `sorted[i]` indexing inside pair-generation loops in `cooccurrence.ts`; all `descriptors[i]` array indexing in tests.

```7:7:src/tests/normalization/convergence.test.ts
    const canonical = normalizeDescriptor(variants[0] ?? '')
```

This is mandatory because `tsconfig.json` enables `noUncheckedIndexedAccess` (CONTEXT §Established Patterns).

### Vitest test scaffold

**Source:** `src/tests/normalization/case.test.ts` lines 1-4 (smallest example).
**Apply to:** Every test file under `src/tests/analysis/`.

```1:5:src/tests/normalization/case.test.ts
import { describe, expect, it } from 'vitest'
import { normalizeCase } from '../../normalizer/normalize_case.js'

describe('normalizeCase', () => {
```

- Always `import { describe, expect, it } from 'vitest'` (the project uses `describe/expect/it` ordering; some files use `describe/it/expect` — `corpus_loader.test.ts` line 1 — both are tolerated, but `describe/expect/it` is the more common spelling in `src/tests/normalization/`).
- Two-level up traversal from `src/tests/<concern>/*.test.ts` → `../../analyzer/...`.

### `performance.now()` benchmark pattern with CI-safe ceiling

**Source:** `src/tests/normalization/benchmark.test.ts` lines 1-31.
**Apply to:** `src/tests/analysis/stress.test.ts`.

```1:5:src/tests/normalization/benchmark.test.ts
import { describe, expect, it } from 'vitest'
import { performance } from 'node:perf_hooks'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'

describe('normalization benchmark', () => {
```

Three ingredients:
1. `import { performance } from 'node:perf_hooks'` (explicit Node import, NOT global).
2. `const start = performance.now()` / `const elapsed = performance.now() - start`.
3. `expect(elapsed).toBeLessThan(<CI-safe-ceiling>)` — the ceiling is the **regression detector**, not a hard performance contract (ANAL-D-18 + Phase 3 D-24 precedent).

### `node:fs/promises` IO boundary with path-bearing error wrap

**Source:** `src/loader/corpus_loader.ts` lines 47-61 (and identical pattern in `seed_loader.ts`, `alias_loader.ts`).
**Apply to:** `src/analyzer/export.ts` (write-side mirror).

```47:53:src/loader/corpus_loader.ts
export const loadCorpus = async (path: string): Promise<readonly SemanticMaterial[]> => {
  let content: string
  try {
    content = await readFile(path, 'utf8')
  } catch (error) {
    throw new Error(`Failed to read file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }
```

Mirror for export: `try { await writeFile(path, payload, 'utf8') } catch (error) { throw new Error(\`Failed to write file at ${path}: ${...}\`) }`. The loader uses generic `Error`; the alias_loader uses custom error classes (`AliasLoadError`, etc., `src/loader/alias_loader.ts` lines 5-24). PLAN may pick either; the generic `Error` form is simpler and matches the lighter-weight corpus_loader pattern.

---

## No Analog Found

No new files lack an analog. Every target file maps to an existing source/test file with at least role-match quality. Two soft caveats:

| Concern | Detail |
|---------|--------|
| Nested `src/analyzer/similarity/` folder | No existing 2-level deep source folder in the codebase. Closest precedent: `src/tests/normalization/` (2-level deep test folder) and `src/tests/fixtures/` (2-level deep data folder). The pattern is consistent with the project but is a new structural beat. |
| `_fixtures/generate.ts` synthetic generator | No precedent for in-tree synthetic data generators. The closest analog is the **inline** synthetic corpus in `src/tests/stress.test.ts` lines 8-16 (`for (let i = 0; i < 50000; i++) items.push({...})`). PLAN may keep generation inline (analog matches) or extract to `_fixtures/generate.ts` per RESEARCH recommendation; either choice is defensible. |

---

## Metadata

**Analog search scope:** `src/normalizer/`, `src/loader/`, `src/types/`, `src/tests/`, `src/tests/normalization/`, `src/tests/fixtures/`.
**Files scanned:** 27 source + test + type files (full read of normalizer modules, loaders, types, all normalization tests, stress/determinism/benchmark tests, fixture sample).
**Pattern extraction date:** 2026-05-17.

---

## PATTERN MAPPING COMPLETE

Pattern mapping for Phase 4 (Corpus Analysis) complete: all 17 target files classified by role and data flow, each assigned a concrete in-codebase analog with file-and-line-anchored excerpts, and 7 cross-cutting shared patterns extracted for the planner to reference uniformly across plans.
