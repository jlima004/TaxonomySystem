# Phase 5: Inference Engine - Pattern Map

**Mapped:** 2026-05-18
**Files analyzed:** 21
**Analogs found:** 21 / 21

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/inference/index.ts` | utility/barrel | transform | `src/analyzer/index.ts` | exact |
| `src/inference/types.ts` or `src/types/inference.ts` | model | transform | `src/types/analysis.ts` + `src/types/similarity.ts` | exact |
| `src/types/similarity.ts` | model | transform | existing same file | exact |
| `src/types/index.ts` | model/barrel | transform | existing same file | exact |
| `src/inference/seed_profile.ts` | service/calculator | transform | `src/analyzer/alias_candidates.ts` | role-match |
| `src/inference/noise.ts` | service/calculator | transform | `src/analyzer/alias_candidates.ts` | role-match |
| `src/inference/descriptor_clusters.ts` | service/calculator | transform | `src/analyzer/cooccurrence.ts` + `src/analyzer/alias_candidates.ts` | exact |
| `src/inference/semantic_overlap.ts` | service/calculator | transform | `src/analyzer/similarity/token_overlap.ts` + `src/analyzer/cooccurrence.ts` | role-match |
| `src/inference/tradition_score.ts` | service/calculator | transform | `src/analyzer/alias_candidates.ts` | role-match |
| `src/inference/accord_compatibility.ts` | service/calculator | transform | `src/loader/seed_validator.ts` + `src/analyzer/alias_candidates.ts` | role-match |
| `src/inference/alias_evidence.ts` | service/calculator | transform | `src/analyzer/alias_candidates.ts` | exact |
| `src/inference/final_score.ts` | utility/calculator | transform | `src/analyzer/similarity/levenshtein.ts` | role-match |
| `src/inference/build_similarity_graph.ts` | service/orchestrator | transform | `src/analyzer/analyze_corpus.ts` + `src/analyzer/export.ts` | exact |
| `data/inference/curated_relations.v1.json` | config/data | CRUD/file-I/O | `data/taxonomy/taxonomy-seed.v1.json` | role-match |
| `data/inference/accord_map.v1.json` | config/data | CRUD/file-I/O | `data/taxonomy/descriptor_aliases.seed.json` | role-match |
| `src/tests/inference/seed_profile.test.ts` | test | transform | `src/tests/analysis/alias_candidates.test.ts` | role-match |
| `src/tests/inference/descriptor_clusters.test.ts` | test | transform | `src/tests/analysis/cooccurrence.test.ts` | exact |
| `src/tests/inference/semantic_overlap.test.ts` | test | transform | `src/tests/analysis/similarity.test.ts` | exact |
| `src/tests/inference/final_score.test.ts` | test | transform | `src/tests/analysis/similarity.test.ts` | role-match |
| `src/tests/inference/build_similarity_graph.test.ts` | test | transform | `src/tests/analysis/orchestration.test.ts` | exact |
| `src/tests/fixtures/inference/*` | test fixture | file-I/O | `src/tests/fixtures/analysis/*` | exact |

## Pattern Assignments

### `src/inference/index.ts` (utility/barrel, transform)

**Analog:** `src/analyzer/index.ts`

**Barrel export pattern** (lines 1-13):
```typescript
export { analyzeCorpus } from './analyze_corpus.js'
export { computeDescriptorFrequency } from './frequency.js'
export { computeCoOccurrence, computeFrequencyAndCoOccurrence } from './cooccurrence.js'
export { encodePairKey, decodePairKey } from './pair_key.js'
export { findAliasCandidates } from './alias_candidates.js'
export { levenshteinDistance, levenshteinSimilarity } from './similarity/levenshtein.js'
export { tokenJaccard } from './similarity/token_overlap.js'
```

Apply this exact ESM `.js` extension style. Export pure functions from each inference module; export types with `export type` if the barrel includes type contracts.

---

### `src/inference/types.ts` or `src/types/inference.ts` (model, transform)

**Analog:** `src/types/analysis.ts` and `src/types/similarity.ts`

**Readonly type pattern** (`src/types/analysis.ts` lines 9-46):
```typescript
export type FrequencyMap = ReadonlyMap<string, number>

export type CoOccurrenceMap = ReadonlyMap<string, number>

export type AliasCandidate = {
  readonly a: string
  readonly b: string
  readonly score: number
  readonly algo: 'lev_norm' | 'lev_norm+tokens'
  readonly frequencies: {
    readonly a: number
    readonly b: number
  }
  readonly token_overlap?: number
  readonly families?: {
    readonly a: readonly string[]
    readonly b: readonly string[]
  }
  readonly suggested_canonical?: string
  readonly cross_family?: boolean
}
```

**Similarity output pattern** (`src/types/similarity.ts` lines 4-30):
```typescript
export type SimilarityEdge = {
  readonly source: string
  readonly target: string
  readonly score: number
  readonly dimensions: Readonly<Record<string, number>>
}

export type SimilarityGraph = {
  readonly version: string
  readonly generated_at: string
  readonly threshold: number
  readonly dimensions: readonly SimilarityDimension[]
  readonly edges: readonly SimilarityEdge[]
  readonly stats: SimilarityStats
}
```

Use `type`, `readonly`, optional fields only when absent data is meaningful, and snake_case output keys for artifact-facing structures (`final_score`, `review_queue`, `corpus_support`).

---

### `src/inference/seed_profile.ts` (service/calculator, transform)

**Analog:** `src/analyzer/alias_candidates.ts`

**Imports pattern** (lines 1-7):
```typescript
import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { DescriptorAliasSeed } from '../types/alias.js'
import type { AliasCandidate, FrequencyMap } from '../types/analysis.js'
import type { TaxonomySeed } from '../types/seed.js'
import { encodePairKey } from './pair_key.js'
```

For inference, copy the style: value imports first, `import type` for types, relative ESM `.js` paths. Consume `TaxonomySeed`, `CorpusAnalysis`, `FrequencyMap`, and `AliasCandidate` by type import.

**Seed indexing pattern** (lines 106-133):
```typescript
const buildDescriptorToFamilies = (taxonomySeed?: TaxonomySeed): Map<string, readonly string[]> => {
  const mapping = new Map<string, readonly string[]>()
  if (taxonomySeed === undefined) {
    return mapping
  }

  const temp = new Map<string, Set<string>>()

  for (const family of taxonomySeed.families) {
    for (const subfamily of family.subfamilies) {
      const familyRef = `${family.id}:${subfamily.id}`
      for (const descriptor of subfamily.descriptors) {
        const normalized = normalizeDescriptor(descriptor)
        if (normalized.length === 0) continue

        const current = temp.get(normalized) ?? new Set<string>()
        current.add(familyRef)
        temp.set(normalized, current)
      }
    }
  }

  for (const [descriptor, families] of temp) {
    mapping.set(descriptor, Array.from(families).sort((a, b) => a.localeCompare(b)))
  }

  return mapping
}
```

Adapt for subfamily profile building: normalize seed descriptors, preserve seed authority, attach corpus frequency as evidence, and sort any derived arrays lexicographically.

**Default options pattern** (lines 9-17 and 181-199):
```typescript
const DEFAULT_MIN_FREQUENCY = 2

export type AliasCandidateOptions = {
  readonly minFrequency?: number
  readonly minScore?: number
  readonly tokenOverlapFloor?: number
  readonly substringRejectScore?: number
  readonly aliasSeed?: DescriptorAliasSeed
  readonly taxonomySeed?: TaxonomySeed
}

export const findAliasCandidates = (
  frequency: FrequencyMap,
  options: AliasCandidateOptions = {},
): readonly AliasCandidate[] => {
```

Use this for configurable Phase 5 thresholds (`minCorpusFrequency`, `minCoOccurrence`, `noiseWeight`, etc.) with deterministic defaults.

---

### `src/inference/noise.ts` (service/calculator, transform)

**Analog:** `src/analyzer/alias_candidates.ts`

**Decision object pattern** (lines 23-28 and 41-69):
```typescript
type ShouldEmitResult = {
  readonly emit: boolean
  readonly score: number
  readonly algo: 'lev_norm' | 'lev_norm+tokens'
  readonly tokenOverlap?: number
}

const shouldEmitCandidate = (
  a: string,
  b: string,
  thresholds: {
    readonly minScore: number
    readonly tokenOverlapFloor: number
    readonly substringRejectScore: number
  },
): ShouldEmitResult => {
  const score = levenshteinSimilarity(a, b)
  if (score < thresholds.minScore) {
    return { emit: false, score, algo: 'lev_norm' }
  }
```

For semantic noise, return structured decisions such as `{ descriptor, weight, reason, seed_exception }`. Do not delete descriptors; downweight and emit audit/review evidence.

**Seed exception pattern** (lines 147-157):
```typescript
const aIsSeedCanonical = seedCanonicalSet.has(a)
const bIsSeedCanonical = seedCanonicalSet.has(b)
if (aIsSeedCanonical !== bIsSeedCanonical) {
  return aIsSeedCanonical ? a : b
}

const aInTaxonomy = taxonomyDescriptorSet.has(a)
const bInTaxonomy = taxonomyDescriptorSet.has(b)
if (aInTaxonomy !== bInTaxonomy) {
  return aInTaxonomy ? a : b
}
```

Reuse this priority idea: seed descriptors win over corpus/noise heuristics and should produce warnings, not automatic downweighting.

---

### `src/inference/descriptor_clusters.ts` (service/calculator, transform)

**Analog:** `src/analyzer/cooccurrence.ts` and `src/analyzer/alias_candidates.ts`

**Normalize/dedupe/sort pattern** (`src/analyzer/cooccurrence.ts` lines 16-26):
```typescript
const toSortedDescriptorSet = (material: AnalysisMaterial): readonly string[] => {
  const descriptorSet = new Set<string>()
  for (const rawDescriptor of material.olfactory.descriptors) {
    const canonical = normalizeDescriptor(rawDescriptor)
    if (canonical.length > 0) {
      descriptorSet.add(canonical)
    }
  }

  return Array.from(descriptorSet).sort((a, b) => a.localeCompare(b))
}
```

**Nested sparse pair pattern** (`src/analyzer/cooccurrence.ts` lines 49-55):
```typescript
for (let i = 0; i < sortedDescriptors.length - 1; i++) {
  const descriptorA = sortedDescriptors[i] ?? ''
  for (let j = i + 1; j < sortedDescriptors.length; j++) {
    const descriptorB = sortedDescriptors[j] ?? ''
    const key = encodePairKey(descriptorA, descriptorB)
    cooccurrence.set(key, (cooccurrence.get(key) ?? 0) + 1)
  }
}
```

**Deterministic result ordering** (`src/analyzer/alias_candidates.ts` lines 307-317):
```typescript
return results.sort((left, right) => {
  if (left.score !== right.score) {
    return right.score - left.score
  }

  if (left.a !== right.a) {
    return left.a.localeCompare(right.a)
  }

  return left.b.localeCompare(right.b)
})
```

Use sparse co-occurrence keys and sorted cluster output. Emit seed-anchored clusters first when a seed anchor exists; corpus-native clusters must be marked inferred/candidate and reviewable.

---

### `src/inference/semantic_overlap.ts` (service/calculator, transform)

**Analog:** `src/analyzer/similarity/token_overlap.ts`

**Normalized overlap pattern** (lines 4-20):
```typescript
export const tokenJaccard = (a: string, b: string): number => {
  const tokensA = new Set(a.split('_'))
  const tokensB = new Set(b.split('_'))

  let intersection = 0
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersection += 1
    }
  }

  const union = tokensA.size + tokensB.size - intersection
  if (union === 0) {
    return 1
  }

  return intersection / union
}
```

Adapt to descriptor sets/profiles: compute weighted intersection/union, clamp/guarantee `[0,1]`, and return evidence listing shared descriptors and corpus support.

---

### `src/inference/tradition_score.ts` (service/calculator, transform)

**Analog:** `src/analyzer/alias_candidates.ts`

**Multi-signal priority pattern** (lines 139-164):
```typescript
const pickCanonical = (
  a: string,
  b: string,
  frequencyA: number,
  frequencyB: number,
  seedCanonicalSet: Set<string>,
  taxonomyDescriptorSet: Set<string>,
): string => {
  const aIsSeedCanonical = seedCanonicalSet.has(a)
  const bIsSeedCanonical = seedCanonicalSet.has(b)
  if (aIsSeedCanonical !== bIsSeedCanonical) {
    return aIsSeedCanonical ? a : b
  }

  const aInTaxonomy = taxonomyDescriptorSet.has(a)
  const bInTaxonomy = taxonomyDescriptorSet.has(b)
  if (aInTaxonomy !== bInTaxonomy) {
    return aInTaxonomy ? a : b
  }

  if (frequencyA !== frequencyB) {
    return frequencyA > frequencyB ? a : b
  }

  return a < b ? a : b
}
```

Use the same explicit priority structure for `curated relations > seed proximity > corpus support`; preserve each sub-score separately in evidence rather than collapsing opaquely.

---

### `src/inference/accord_compatibility.ts` (service/calculator, transform)

**Analog:** `src/loader/seed_validator.ts`

**Pure validation pattern** (lines 5-18 and 36-45):
```typescript
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const isSnakeCase = (s: string): boolean => /^[a-z][a-z0-9_]*$/.test(s)

export const validateSeed = (data: unknown): ValidationResult<TaxonomySeed> => {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    return makeResult([makeError('root', 'object', typeof data)])
  }
```

**Error accumulation pattern** (lines 93-110):
```typescript
if (!Array.isArray(sObj.descriptors) || sObj.descriptors.length === 0) {
  errors.push(makeError(`${subfamilyPath} > descriptors`, 'non-empty array', Array.isArray(sObj.descriptors) ? 'empty array' : typeof sObj.descriptors))
} else {
  const descriptorsSet = new Set<string>()
  sObj.descriptors.forEach((desc: unknown, dIdx: number) => {
    const descPath = `${subfamilyPath} > descriptors[${dIdx}]`
    if (!isNonEmptyString(desc)) {
      errors.push(makeError(descPath, 'non-empty string', String(desc)))
    } else if (!isSnakeCase(desc as string)) {
      errors.push(makeError(descPath, 'snake_case string', desc as string))
    }
  })
}
```

Use this for curated accord map/relation validators if added. Missing accord entries should return `undefined` score, not `0`.

---

### `src/inference/alias_evidence.ts` (service/calculator, transform)

**Analog:** `src/analyzer/alias_candidates.ts`

**Weak candidate evidence shape** (lines 284-301):
```typescript
results.push({
  a,
  b,
  score: decision.score,
  algo: decision.algo,
  frequencies: { a: frequencyA, b: frequencyB },
  ...(decision.tokenOverlap !== undefined ? { token_overlap: decision.tokenOverlap } : {}),
  ...(hasFamilies ? { families: { a: familiesA, b: familiesB } } : {}),
  ...(crossFamily !== undefined ? { cross_family: crossFamily } : {}),
  suggested_canonical: pickCanonical(
    a,
    b,
    frequencyA,
    frequencyB,
    seedCanonicalSet,
    taxonomyDescriptorSet,
  ),
})
```

Phase 5 must treat this as weak evidence only. Copy conditional object-spread style for optional evidence, but never auto-merge `suggested_canonical` into seed descriptors.

---

### `src/inference/final_score.ts` (utility/calculator, transform)

**Analog:** `src/analyzer/similarity/levenshtein.ts`

**Normalized score primitive** (lines 42-47):
```typescript
export const levenshteinSimilarity = (a: string, b: string): number => {
  const maxLength = Math.max(a.length, b.length)
  if (maxLength === 0) return 1

  return 1 - levenshteinDistance(a, b) / maxLength
}
```

Use the same small pure-function style for `combineScores` and `shouldKeepEdge`. Ensure missing optional dimensions remain `undefined` and final score renormalizes over available weights. Threshold must be strict `final_score > 0.25` after combination.

---

### `src/inference/build_similarity_graph.ts` (service/orchestrator, transform)

**Analog:** `src/analyzer/analyze_corpus.ts`

**Orchestration pattern** (lines 1-34):
```typescript
import type { AliasCandidateOptions } from './alias_candidates.js'
import { findAliasCandidates } from './alias_candidates.js'
import { computeFrequencyAndCoOccurrence } from './cooccurrence.js'
import type { CorpusAnalysis } from '../types/analysis.js'

export type AnalyzeCorpusOptions = {
  readonly aliasCandidates?: AliasCandidateOptions
}

export const analyzeCorpus = (
  corpus: readonly AnalysisMaterial[],
  options?: AnalyzeCorpusOptions,
): CorpusAnalysis => {
  const { frequency, cooccurrence } = computeFrequencyAndCoOccurrence(corpus)
  const aliasCandidates = options?.aliasCandidates !== undefined
    ? findAliasCandidates(frequency, options.aliasCandidates)
    : []

  return {
    frequency,
    cooccurrence,
    aliasCandidates,
  }
}
```

Build graph by composing pure calculators. Accept `TaxonomySeed`, `CorpusAnalysis`, curated relation/accord inputs, and options explicitly; do not read hardcoded paths inside the scoring function.

**Sparse artifact output shape** (`src/types/similarity.ts` lines 23-30):
```typescript
export type SimilarityGraph = {
  readonly version: string
  readonly generated_at: string
  readonly threshold: number
  readonly dimensions: readonly SimilarityDimension[]
  readonly edges: readonly SimilarityEdge[]
  readonly stats: SimilarityStats
}
```

---

### `data/inference/curated_relations.v1.json` and `data/inference/accord_map.v1.json` (config/data, file-I/O)

**Analog:** existing versioned taxonomy data files: `data/taxonomy/taxonomy-seed.v1.json`, `data/taxonomy/descriptor_aliases.seed.json`.

Pattern assignment: place curated Phase 5 input data under `data/inference/`, keep `.v1.json` versioning, and consume via explicit loader/options. Do not embed relation/accord constants inside calculators. If loaders are added, copy error style from `src/loader/seed_loader.ts` lines 26-49:
```typescript
export const loadTaxonomySeed = async (path: string): Promise<TaxonomySeed> => {
  let content: string
  try {
    content = await readFile(path, 'utf8')
  } catch (error) {
    throw new SeedLoadError(`Failed to read file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch (error) {
    throw new SeedParseError(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
```

---

### `src/tests/inference/*.test.ts` (test, transform)

**Analog:** `src/tests/analysis/*.test.ts`

**Vitest import pattern** (`src/tests/analysis/similarity.test.ts` lines 1-7):
```typescript
import { describe, expect, it } from 'vitest'
import {
  levenshteinDistance,
  levenshteinSimilarity,
} from '../../analyzer/similarity/levenshtein.js'
import { tokenJaccard } from '../../analyzer/similarity/token_overlap.js'
```

**Fixture loader pattern** (`src/tests/analysis/orchestration.test.ts` lines 13-19):
```typescript
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadFixture = async (name: string): Promise<readonly AnalysisMaterial[]> => {
  const content = await readFile(join(__dirname, `../fixtures/analysis/${name}`), 'utf8')
  return JSON.parse(content) as readonly AnalysisMaterial[]
}
```

**Determinism/immutability pattern** (`src/tests/analysis/orchestration.test.ts` lines 32-49):
```typescript
it('is deterministic across repeated calls', async () => {
  const corpus = await loadFixture('tiny_corpus.json')
  const first = analyzeCorpus(corpus)
  const second = analyzeCorpus(corpus)

  expect(Array.from(first.frequency.entries()).sort()).toEqual(Array.from(second.frequency.entries()).sort())
  expect(Array.from(first.cooccurrence.entries()).sort()).toEqual(Array.from(second.cooccurrence.entries()).sort())
  expect(first.aliasCandidates).toEqual(second.aliasCandidates)
})

it('does not mutate input corpus', async () => {
  const corpus = await loadFixture('tiny_corpus.json')
  const snapshot = structuredClone(corpus)

  analyzeCorpus(corpus)

  expect(corpus).toEqual(snapshot)
})
```

**Sparse graph/pair assertions** (`src/tests/analysis/cooccurrence.test.ts` lines 51-67 and 83-89):
```typescript
for (const [key] of cooccurrence) {
  const [a, b] = decodePairKey(key)
  expect(a).not.toBe(b)
}

for (const value of cooccurrence.values()) {
  expect(value).toBeGreaterThan(0)
}

const key = encodePairKey('camomile', 'chamomile')
expect(key).toBe('camomile|chamomile')
expect(decodePairKey(key)).toEqual(['camomile', 'chamomile'])
```

Tests to copy forward: deterministic sort, no mutation, normalized `[0,1]`, missing optional dimension is undefined/renormalized, exact threshold `0.25` excluded, seed/corpus authority preserved, alias candidates remain weak evidence.

---

### `src/tests/fixtures/inference/*` (test fixture, file-I/O)

**Analog:** `src/tests/fixtures/analysis/*` and test fixture loading above.

Create small JSON fixtures covering:
- seed descriptor conflict vs corpus-only inferred descriptor
- semantic noise term that is seed-owned and must produce warning, not downweight
- missing accord/tradition entries for renormalization tests
- final score exactly `0.25` and just above `0.25`
- co-occurrence-driven corpus-native cluster candidate

## Shared Patterns

### Pure functions + explicit inputs

**Source:** `src/analyzer/analyze_corpus.ts` lines 20-34
**Apply to:** all inference calculators and graph builder
```typescript
export const analyzeCorpus = (
  corpus: readonly AnalysisMaterial[],
  options?: AnalyzeCorpusOptions,
): CorpusAnalysis => {
  const { frequency, cooccurrence } = computeFrequencyAndCoOccurrence(corpus)
  const aliasCandidates = options?.aliasCandidates !== undefined
    ? findAliasCandidates(frequency, options.aliasCandidates)
    : []

  return {
    frequency,
    cooccurrence,
    aliasCandidates,
  }
}
```

### Normalization before comparison

**Source:** `src/normalizer/normalize_descriptor.ts` lines 22-40 and `src/analyzer/cooccurrence.ts` lines 18-25
**Apply to:** seed profile, curated relation/accord validators, clustering, overlap, alias evidence
```typescript
const PIPELINE = [
  normalizeUnicode,
  normalizeCase,
  normalizeSeparators,
  removePunctuation,
  collapseUnderscores,
  trimUnderscores,
  singularize,
] as const

export const normalizeDescriptor = (input: string): string => {
  return PIPELINE.reduce((acc, fn) => fn(acc), input)
}
```

### Sparse pair key convention

**Source:** `src/analyzer/pair_key.ts` lines 7-24
**Apply to:** descriptor co-occurrence lookups, subfamily pair generation, graph edge identity
```typescript
export const encodePairKey = (a: string, b: string): string => {
  if (a === b) {
    throw new Error(`ANAL-D-17 violation: self-pair is not allowed (${a})`)
  }

  return a < b ? `${a}|${b}` : `${b}|${a}`
}

export const decodePairKey = (key: string): readonly [string, string] => {
  const separatorIndex = key.indexOf('|')
  if (separatorIndex <= 0 || separatorIndex >= key.length - 1) {
    throw new Error(`Invalid pair key: ${key}`)
  }

  const a = key.slice(0, separatorIndex)
  const b = key.slice(separatorIndex + 1)
  return [a, b]
}
```

### Deterministic ordering

**Source:** `src/analyzer/export.ts` lines 37-69 and `src/analyzer/alias_candidates.ts` lines 307-317
**Apply to:** every output array: profiles, clusters, review_queue, graph edges
```typescript
const edges = Array.from(cooccurrence.entries())
  .map(([key, count]) => {
    const [a, b] = decodePairKey(key)
    return { a, b, count }
  })
  .sort((left, right) => {
    if (left.a !== right.a) {
      return left.a.localeCompare(right.a)
    }

    return left.b.localeCompare(right.b)
  })
```

### Error handling for optional loaders/exporters

**Source:** `src/loader/seed_loader.ts` lines 26-49 and `src/analyzer/export.ts` lines 28-34
**Apply to:** only if Phase 5 adds loaders/export helpers for curated inference data
```typescript
try {
  content = await readFile(path, 'utf8')
} catch (error) {
  throw new SeedLoadError(`Failed to read file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
}

const writeJsonDeterministic = async (path: string, payload: object): Promise<void> => {
  try {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  } catch (error) {
    throw new Error(`Failed to write file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }
}
```

## No Analog Found

All planned Phase 5 files have close Phase 4 or foundation analogs. The only gap is domain-specific schema content for `data/inference/curated_relations.v1.json` and `data/inference/accord_map.v1.json`; use existing versioned JSON placement/loader patterns, but planner must define the exact schema.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| _None_ | — | — | Phase 4 analyzer/type/test patterns cover the implementation shape. |

## Metadata

**Analog search scope:** `src/analyzer/**`, `src/types/*.ts`, `src/tests/analysis/*.test.ts`, `src/loader/*.ts`, `src/normalizer/*.ts`, `data/**/*.json`
**Files scanned:** 38
**Pattern extraction date:** 2026-05-18
