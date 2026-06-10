# Phase 56: Pure Builder & Structural Validation - Pattern Map

**Mapped:** 2026-06-09  
**Files analyzed:** 6  
**Analogs found:** 6 / 6

## Scope Source

Files to create/modify were extracted from `56-CONTEXT.md` lines 39-48 and 77-93 plus `56-RESEARCH.md` lines 182-195 and 403-409.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/graph_read_model/types.ts` | model | transform | `src/types/similarity.ts` | role-match |
| `src/graph_read_model/build_graph.ts` | service | transform | `src/inference/build_similarity_graph.ts` | role+flow-match |
| `src/graph_read_model/validate_graph.ts` | service | transform | `src/compiler/validate_output.ts` | role+flow-match |
| `src/tests/graph_read_model/build_graph.test.ts` | test | transform | `src/tests/inference/build_similarity_graph.test.ts` | exact |
| `src/tests/graph_read_model/validate_graph.test.ts` | test | transform | `src/tests/compiler/validate_output.test.ts` | exact |
| `src/tests/graph_read_model/live_artifact_baseline.test.ts` | test | file-I/O | `src/tests/inventory/alias_target_inventory.test.ts` | exact |

## Pattern Assignments

### `src/graph_read_model/types.ts` (model, transform)

**Primary analog:** `src/types/similarity.ts`  
**Secondary analog:** `src/compiler/types.ts`, `src/types/taxonomy.ts`

**Readonly graph/type shape pattern** (`src/types/similarity.ts` lines 6-43):
```typescript
export type SimilarityEdge = {
  readonly source: string
  readonly target: string
  readonly final_score?: number
  readonly score: number
  readonly dimensions: Readonly<Record<string, number>> | FinalScoreDimensions
  readonly evidence?: SimilarityEdgeEvidence
}

export type SimilarityGraph = {
  readonly version: string
  readonly generated_at: string
  readonly threshold: number
  readonly dimensions: readonly SimilarityDimension[]
  readonly edges: readonly SimilarityEdge[]
  readonly review_queue: readonly ReviewQueueItem[]
  readonly stats: SimilarityStats
}
```

**Validation result helper pattern** (`src/compiler/types.ts` lines 13-55):
```typescript
export type CompilerValidationError = {
  readonly artifact: 'taxonomy' | 'aliases' | 'similarity'
  readonly code: string
  readonly path: string
  readonly message: string
}

export type CompilerValidationResult = {
  readonly ok: boolean
  readonly errors: readonly CompilerValidationError[]
  readonly warnings: readonly CompilerValidationError[]
}

export const combineResults = (
  ...results: CompilerValidationResult[]
): CompilerValidationResult => {
  const errors: CompilerValidationError[] = []
  const warnings: CompilerValidationError[] = []
  for (const r of results) {
    errors.push(...r.errors)
    warnings.push(...r.warnings)
  }
  return { ok: errors.length === 0, errors, warnings }
}
```

**Compiled taxonomy field naming to mirror** (`src/types/taxonomy.ts` lines 4-39):
```typescript
export type TaxonomyStats = {
  readonly family_count: number
  readonly subfamily_count: number
  readonly descriptor_count: number
}

export type CanonicalDescriptor = {
  readonly id: string
  readonly source: 'seed' | 'corpus' | 'inferred'
  readonly frequency: number
  readonly status: 'curated' | 'candidate' | 'inferred'
  readonly review_required: boolean
  readonly corpus_derived: boolean
}
```

**Apply:** keep graph node/edge/stats/result types fully `readonly`, ESM-exported, and aligned with contract field names rather than inventing new naming.

---

### `src/graph_read_model/build_graph.ts` (service, transform)

**Primary analog:** `src/inference/build_similarity_graph.ts`  
**Secondary analog:** `src/graph_read_model/contract.ts`

**Imports pattern** (`src/inference/build_similarity_graph.ts` lines 1-18):
```typescript
import type { SimilarityDimension, SimilarityEdge, SimilarityEdgeEvidence, SimilarityGraph } from '../types/similarity.js'
import { encodePairKey } from '../analyzer/pair_key.js'
import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
```

Use the same style: type-only imports first, local first-party imports with `.js` suffix, no runtime package deps.

**Thin public builder + local helpers** (`src/inference/build_similarity_graph.ts` lines 43-83 and 218-315):
```typescript
const buildSubfamilyProfiles = (
  seed: TaxonomySeed,
  analysis: CorpusAnalysis,
): readonly SubfamilyProfile[] => {
  const subfamilies: SubfamilyProfile[] = []
  // ...collect arrays with local helper logic...
  return subfamilies.sort((left, right) => left.id.localeCompare(right.id))
}

export const buildSimilarityGraph = (
  seed: TaxonomySeed,
  analysis: CorpusAnalysis,
  inputs: BuildSimilarityGraphInputs,
  options: BuildSimilarityGraphOptions = {},
): SimilarityGraph => {
  const edges: SimilarityEdge[] = []
  const reviewQueue: ReviewQueueItem[] = []
  // ...derive arrays...
  return {
    version: options.version ?? GRAPH_VERSION,
    generated_at: options.generatedAt ?? DEFAULT_GENERATED_AT,
    edges: sortedEdges,
    review_queue: reviewQueue.sort((left, right) => {
      if (left.type !== right.type) return left.type.localeCompare(right.type)
      return JSON.stringify(left.affected).localeCompare(JSON.stringify(right.affected))
    }),
    stats: {
      subfamily_count: subfamilies.length,
      edge_count: sortedEdges.length,
      density: possiblePairs === 0 ? 0 : sortedEdges.length / possiblePairs,
    },
  }
}
```

**Deterministic sort pattern** (`src/inference/build_similarity_graph.ts` lines 284-288):
```typescript
const sortedEdges = edges.sort((left, right) => {
  if (left.source !== right.source) return left.source.localeCompare(right.source)
  return left.target.localeCompare(right.target)
})
```

For Phase 56, translate this to the locked graph sort order from `src/graph_read_model/contract.ts` lines 1-77 and `56-CONTEXT.md` lines 57-63: nodes by `kind` then `id`; edges by `kind`, `source`, `target`, then `id`.

**Contract constant import pattern** (`src/graph_read_model/contract.ts` lines 1-77):
```typescript
export const GRAPH_SCHEMA_VERSION = 'olfactory_graph_read_model.v1' as const
export const GRAPH_NODE_KINDS = ['family', 'subfamily', 'descriptor', 'alias'] as const
export const GRAPH_EDGE_KINDS = ['contains_subfamily', 'contains_descriptor', 'resolves_to', 'similar_to'] as const
export const GRAPH_EDGE_ENDPOINT_KINDS = {
  contains_subfamily: { source: 'family', target: 'subfamily' },
  contains_descriptor: { source: 'subfamily', target: 'descriptor' },
  resolves_to: { source: 'alias', target: 'descriptor' },
  similar_to: { source: 'subfamily', target: 'subfamily' },
} as const
```

**Apply:** pure in-memory transformation only; build arrays first, sort explicitly, derive stats from built arrays, and import graph kinds/ID rules from the contract instead of repeating literals.

---

### `src/graph_read_model/validate_graph.ts` (service, transform)

**Primary analog:** `src/compiler/validate_output.ts`  
**Secondary analog:** `src/compiler/types.ts`, `src/graph_read_model/contract.ts`

**Imports pattern** (`src/compiler/validate_output.ts` lines 1-4):
```typescript
import type { CompilerValidationResult } from './types.js'
import { makeCompilerError, combineResults, findNullsDeep, appendJsonPathKey } from './types.js'
```

**Structured validation result pattern** (`src/compiler/validate_output.ts` lines 18-33):
```typescript
export const validateCompiledTaxonomy = (
  data: unknown
): CompilerValidationResult => {
  const errors: ReturnType<typeof makeCompilerError>[] = []
  const warnings: ReturnType<typeof makeCompilerError>[] = []
  const A = 'taxonomy' as const

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: [makeCompilerError(A, 'INVALID_TYPE', '$', 'root must be an object')], warnings: [] }
  }
```

**Invariant scan pattern** (`src/compiler/validate_output.ts` lines 75-148 and 228-242):
```typescript
for (let fi = 0; fi < families.length; fi++) {
  const fam = families[fi]
  const fp = `$.families[${fi}]`
  // ...push coded path-based errors instead of throwing...
}

return { ok: errors.length === 0, errors, warnings }
```

**Combine-pass pattern** (`src/compiler/validate_output.ts` lines 461-470 and `src/compiler/types.ts` lines 40-55):
```typescript
export const validateAllOutputs = (
  taxonomy: unknown,
  aliases: unknown,
  similarity: unknown
): CompilerValidationResult => {
  return combineResults(
    validateCompiledTaxonomy(taxonomy),
    validateCompiledAliases(aliases),
    validateSimilarityGraph(similarity),
  )
}
```

**Contract invariants to drive passes** (`src/graph_read_model/contract.ts` lines 62-77):
```typescript
export const GRAPH_PHASE_56_INVARIANTS = [
  'duplicate_node_id_detection',
  'duplicate_edge_id_detection',
  'missing_edge_endpoints',
  'wrong_endpoint_kinds',
  'invalid_alias_targets',
  'invalid_subfamily_similarity_endpoints',
] as const
```

**Apply:** one validator function that combines invariant-specific scans, returns `{ ok, errors, warnings }`, uses JSON-path-style `path` strings, and maps codes to the contract invariant names or stable derivatives.

---

### `src/tests/graph_read_model/build_graph.test.ts` (test, transform)

**Analog:** `src/tests/inference/build_similarity_graph.test.ts`

**Imports + inline fixture helper pattern** (`src/tests/inference/build_similarity_graph.test.ts` lines 1-46):
```typescript
import { describe, expect, it } from 'vitest'
import { buildSimilarityGraph } from '../../inference/index.js'

const buildFixtureGraph = async (generatedAt?: string): Promise<SimilarityGraph> => {
  const fixture = await loadFixture()
  return buildSimilarityGraph(fixture.seed, toAnalysis(fixture), {
    curatedRelations: fixture.curatedRelations,
    accordMap: fixture.accordMap,
  }, {
    ...(generatedAt !== undefined ? { generatedAt } : {}),
  })
}
```

**Determinism assertion pattern** (`src/tests/inference/build_similarity_graph.test.ts` lines 71-90):
```typescript
const edges = graph.edges.map(edge => `${edge.source}|${edge.target}`)
expect(edges).toEqual([...edges].sort((left, right) => left.localeCompare(right)))

const first = await buildFixtureGraph('2026-01-01T00:00:00.000Z')
const second = await buildFixtureGraph('2026-01-01T00:00:00.000Z')
expect(first.edges).toEqual(second.edges)
expect(first.stats).toEqual(second.stats)
```

**Inline minimal test data pattern** (`src/tests/inference/build_similarity_graph.test.ts` lines 93-194):
```typescript
const seed: TaxonomySeed = {
  version: '1.0.0',
  metadata: { created_at: '2026-01-01T00:00:00.000Z', author: 'test', description: 'single subfamily seed' },
  families: [{ id: 'solo', name: 'Solo', subfamilies: [{ id: 'only', name: 'Only', descriptors: ['alone'] }] }],
}
```

**Apply:** keep build-graph tests inline and small; assert node/edge construction, explicit sort order, preserved similarity properties, and build-twice deep equality without any production file I/O.

---

### `src/tests/graph_read_model/validate_graph.test.ts` (test, transform)

**Analog:** `src/tests/compiler/validate_output.test.ts`

**Fixture factory pattern** (`src/tests/compiler/validate_output.test.ts` lines 10-67):
```typescript
const makeValidTaxonomy = () => ({
  version: '1.0.0',
  generated_at: '2026-01-01T00:00:00Z',
  stats: { family_count: 1, subfamily_count: 1, descriptor_count: 1 },
  families: [/* ... */],
})
```

**Targeted invariant mutation pattern** (`src/tests/compiler/validate_output.test.ts` lines 116-215):
```typescript
const data = makeValidTaxonomy()
delete (data as Record<string, unknown>)['version']
const result = validateCompiledTaxonomy(data)
expect(result.ok).toBe(false)
expect(result.errors.some(e => e.code === 'MISSING_FIELD' && e.path === '$.version')).toBe(true)
```

```typescript
const data = makeValidTaxonomy()
;(data as any).families[0].subfamilies[0].descriptors[0].frequency = null
const result = validateCompiledTaxonomy(data)
expect(result.errors.some(e =>
  e.code === 'INVALID_TYPE' &&
  e.path === '$.families[0].subfamilies[0].descriptors[0].frequency'
)).toBe(true)
```

**Apply:** make one valid minimal graph fixture, then mutate it per invariant: duplicate node ID, duplicate edge ID, missing endpoint, wrong endpoint kinds, invalid alias target, invalid similarity endpoints, and stats mismatch. Assert stable `code` and `path` values rather than only broad failure.

---

### `src/tests/graph_read_model/live_artifact_baseline.test.ts` (test, file-I/O)

**Primary analog:** `src/tests/inventory/alias_target_inventory.test.ts`  
**Secondary analog:** `src/tests/graph_read_model/contract.test.ts`

**Read-only live artifact import pattern** (`src/tests/inventory/alias_target_inventory.test.ts` lines 1-10 and 42-55):
```typescript
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const compiledAliasPath = path.join(repoRoot, 'data/compiled/v2/descriptor_aliases.json')
const compiledTaxonomyPath = path.join(repoRoot, 'data/compiled/v2/taxonomy.json')

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T
```

**Baseline-count assertion pattern** (`src/tests/inventory/alias_target_inventory.test.ts` lines 81-105):
```typescript
const [seedAliases, compiled, taxonomy, exceptionPolicy] = await Promise.all([
  readJson<AliasSeed>(seedAliasPath),
  readJson<CompiledAliases>(compiledAliasPath),
  readJson<CompiledTaxonomy>(compiledTaxonomyPath),
  readJson<ExceptionPolicy>(exceptionPolicyPath),
])

expect(Object.keys(compiledAliases)).toHaveLength(18)
expect(descriptorIds.size).toBe(341)
expect(result).toEqual({
  status: 'PASS',
  valid_target_count: 18,
  unresolved_target_count: 0,
})
```

**Boundary/no-production-fs guard pattern** (`src/tests/graph_read_model/contract.test.ts` lines 131-140):
```typescript
const source = await readFile(contractSourcePath, 'utf8')

expect(source).not.toMatch(/buildGraph|loadGraph|writeGraph|validateGraph/)
expect(source).not.toMatch(/createReadStream|readFile\(|writeFile\(/)
expect(source).not.toMatch(/from 'node:fs'|from "node:fs"/)
```

**Apply:** use `Promise.all`, repo-root path resolution, and direct baseline assertions against the three compiled v2 artifacts only; keep all file I/O inside the test file and optionally assert Phase 56 production modules stay fs-free.

## Shared Patterns

### Contract-first constants
**Source:** `src/graph_read_model/contract.ts` lines 1-77  
**Apply to:** `build_graph.ts`, `validate_graph.ts`, tests
```typescript
export const GRAPH_SCHEMA_VERSION = 'olfactory_graph_read_model.v1' as const
export const GRAPH_PHASE_56_INVARIANTS = [
  'duplicate_node_id_detection',
  'duplicate_edge_id_detection',
  'missing_edge_endpoints',
  'wrong_endpoint_kinds',
  'invalid_alias_targets',
  'invalid_subfamily_similarity_endpoints',
] as const
export const GRAPH_EXPECTED_BASELINE_STATS = {
  families: 10,
  subfamilies: 18,
  descriptors: 341,
  aliases: 18,
  subfamily_similarity_edges: 13,
} as const
```

### Structured validation errors
**Source:** `src/compiler/types.ts` lines 27-38, 40-55  
**Apply to:** `types.ts`, `validate_graph.ts`, `validate_graph.test.ts`
```typescript
export const makeCompilerError = (
  artifact: CompilerValidationError['artifact'],
  code: string,
  path: string,
  message: string
): CompilerValidationError => ({
  artifact,
  code,
  path: path.startsWith('$') ? path : `$${path}`,
  message,
})
```

### Deterministic sorting
**Source:** `src/inference/build_similarity_graph.ts` lines 77-82, 285-288  
**Apply to:** `build_graph.ts`, `build_graph.test.ts`
```typescript
profiles: profiles.sort((left, right) => left.descriptor.localeCompare(right.descriptor))
return subfamilies.sort((left, right) => left.id.localeCompare(right.id))

const sortedEdges = edges.sort((left, right) => {
  if (left.source !== right.source) return left.source.localeCompare(right.source)
  return left.target.localeCompare(right.target)
})
```

### Live-artifact regression style
**Source:** `src/tests/inventory/alias_target_inventory.test.ts` lines 42-55, 81-105  
**Apply to:** `live_artifact_baseline.test.ts`
```typescript
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const [compiled, taxonomy] = await Promise.all([
  readJson<CompiledAliases>(compiledAliasPath),
  readJson<CompiledTaxonomy>(compiledTaxonomyPath),
])
```

## No Analog Found

None. Existing repo code already covers the needed patterns for pure transformation, structured validation, deterministic sorting, and live-artifact regression tests.

## Metadata

**Analog search scope:** `src/graph_read_model/`, `src/compiler/`, `src/inference/`, `src/types/`, `src/tests/graph_read_model/`, `src/tests/compiler/`, `src/tests/inference/`, `src/tests/inventory/`  
**Files scanned:** 13  
**Pattern extraction date:** 2026-06-09
