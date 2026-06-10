# Phase 57: Query Proofs - Pattern Map

**Mapped:** 2026-06-10  
**Files analyzed:** 5  
**Analogs found:** 5 / 5

## Scope Source

Files to create/modify were extracted from `57-CONTEXT.md` lines 12-18, 42-45, 107-111, 129-132 and `57-RESEARCH.md` lines 231-247, 543-547.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/graph_read_model/types.ts` | model | transform | `src/graph_read_model/types.ts` (extend) | exact |
| `src/graph_read_model/query_graph.ts` | service | transform | `src/graph_read_model/validate_graph.ts` | role+flow-match |
| `src/tests/graph_read_model/query_graph.test.ts` | test | transform | `src/tests/graph_read_model/build_graph.test.ts` | exact |
| `src/tests/graph_read_model/query_live_baseline.test.ts` | test | file-I/O | `src/tests/graph_read_model/live_artifact_baseline.test.ts` | exact |
| `src/tests/graph_read_model/live_artifact_baseline.test.ts` | test | file-I/O | `src/tests/graph_read_model/live_artifact_baseline.test.ts` (extend) | exact |

## Pattern Assignments

### `src/graph_read_model/types.ts` (model, transform — extend)

**Primary analog:** `src/graph_read_model/types.ts` (existing graph types)  
**Secondary analog:** `src/types/similarity.ts`, `57-CONTEXT.md` D-07/D-08

**Readonly graph envelope pattern** (`src/graph_read_model/types.ts` lines 10-37):
```typescript
export type GraphNode = {
  readonly id: string
  readonly kind: GraphNodeKind
  readonly properties: Readonly<Record<string, unknown>>
}

export type OlfactoryGraph = {
  readonly schema_version: GraphSchemaVersion
  readonly nodes: readonly GraphNode[]
  readonly edges: readonly GraphEdge[]
  readonly stats: GraphStats
}
```

**Structured result helper pattern** (`src/graph_read_model/types.ts` lines 45-86):
```typescript
export type GraphValidationResult = {
  readonly ok: boolean
  readonly errors: readonly GraphValidationError[]
  readonly warnings: readonly GraphValidationError[]
}

export const makeGraphError = (
  code: string,
  path: string,
  message: string,
  options: { node_id?: string; edge_id?: string } = {},
): GraphValidationError => ({
  code,
  path: path.startsWith('$') ? path : `$${path}`,
  message,
  ...(options.node_id !== undefined ? { node_id: options.node_id } : {}),
  ...(options.edge_id !== undefined ? { edge_id: options.edge_id } : {}),
})
```

**Similarity field projection to mirror** (`src/types/similarity.ts` lines 12-27):
```typescript
export type SimilarityEdge = {
  readonly source: string
  readonly target: string
  readonly final_score?: number
  readonly score: number
  readonly dimensions: Readonly<Record<string, number>> | FinalScoreDimensions
  readonly evidence?: SimilarityEdgeEvidence
}
```

**Apply:** Add `GraphQueryProof<TKind, TParams, TResult>`, per-`query_kind` proof aliases, `DescriptorProofItem`, `PathSegment`, and similarity proof item types. Keep all fields `readonly`, ESM-exported, and JSON-serializable. Use discriminated `query_kind` literals from D-08 (`descriptors_by_family`, `alias_resolution_path`, etc.). Proof envelope shape:

```typescript
type GraphQueryProof<TKind extends string, TParams, TResult> = {
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}
```

---

### `src/graph_read_model/query_graph.ts` (service, transform)

**Primary analog:** `src/graph_read_model/validate_graph.ts`  
**Secondary analog:** `src/graph_read_model/build_graph.ts`

**Imports pattern** (`src/graph_read_model/validate_graph.ts` lines 1-13):
```typescript
import {
  GRAPH_EDGE_ENDPOINT_KINDS,
  GRAPH_SCHEMA_VERSION,
  type GraphNodeKind,
} from './contract.js'
import type {
  GraphEdge,
  GraphNode,
  GraphStats,
  GraphValidationResult,
  OlfactoryGraph,
} from './types.js'
import { combineGraphResults, makeGraphError } from './types.js'
```

For `query_graph.ts`, mirror: type-only imports from `./types.js`, contract constants only if needed (e.g. `GRAPH_EDGE_ENDPOINT_KINDS` for traversal kind checks), no runtime package deps, no `node:fs`.

**Ephemeral node index pattern** (`src/graph_read_model/validate_graph.ts` lines 91-99, 283):
```typescript
const buildNodeIndex = (nodes: readonly GraphNode[]): Map<string, GraphNode> => {
  const index = new Map<string, GraphNode>()
  for (const node of nodes) {
    if (!index.has(node.id)) {
      index.set(node.id, node)
    }
  }
  return index
}

// Used at function entry in validateOlfactoryGraph:
const nodeIndex = buildNodeIndex(graph.nodes)
```

**Apply:** Build ephemeral `Map` indexes at each public function entry; discard after return. Do not attach indexes to `OlfactoryGraph` (D-05/D-11). Consider shared local helpers: `buildNodeIndex`, `buildEdgesByKindIndex`, `subfamilyNodeId`/`descriptorNodeId`/`aliasNodeId` (copy from `build_graph.ts` lines 13-19).

**Graph ID helper pattern** (`src/graph_read_model/build_graph.ts` lines 13-22):
```typescript
const familyNodeId = (familyId: string): string => `family:${familyId}`

const subfamilyNodeId = (subfamilyId: string): string => `subfamily:${subfamilyId}`

const descriptorNodeId = (descriptorId: string): string => `descriptor:${descriptorId}`

const aliasNodeId = (alias: string): string => `alias:${alias}`
```

**Descriptor property projection pattern** (`src/graph_read_model/build_graph.ts` lines 84-98):
```typescript
nodes.push({
  id: descriptorGraphId,
  kind: 'descriptor',
  properties: {
    descriptor_id: descriptor.id,
    family_id: family.id,
    subfamily_id: subfamily.id,
    source: descriptor.source,
    frequency: descriptor.frequency,
    status: descriptor.status,
    review_required: descriptor.review_required,
    corpus_derived: descriptor.corpus_derived,
  },
})
```

**Apply:** Map descriptor nodes to `DescriptorProofItem` with only GQRY fields (`id`, `graph_id`, `status`, `review_required`, `corpus_derived`, `source`). Omit `frequency` and full `GraphNode` copies per D-09.

**Deterministic sort comparators** (`src/graph_read_model/build_graph.ts` lines 24-34):
```typescript
const compareGraphNodes = (left: GraphNode, right: GraphNode): number => {
  if (left.kind !== right.kind) return left.kind.localeCompare(right.kind)
  return left.id.localeCompare(right.id)
}
```

**Apply:** Define query-specific comparators independent of graph array order (D-10):
- Lists: `id.localeCompare`
- Similarity neighborhoods: `(final_score ?? score)` descending, then neighbor `id` lexicographic
- Hub tie-break: highest in+out `similar_to` degree, then subfamily `id` lexicographic

**Thin public export + local helpers pattern** (`src/graph_read_model/build_graph.ts` lines 185-207):
```typescript
export const buildOlfactoryGraph = (input: BuildOlfactoryGraphInput): OlfactoryGraph => {
  const taxonomyResult = buildTaxonomyNodesAndEdges(input.taxonomy)
  const aliasResult = buildAliasNodesAndEdges(input.aliases)
  const similarityEdges = buildSimilarityEdges(input.similarity)

  const nodes = [
    ...taxonomyResult.nodes,
    ...aliasResult.nodes,
  ].sort(compareGraphNodes)

  return {
    schema_version: GRAPH_SCHEMA_VERSION,
    nodes,
    edges: [...].sort(compareGraphEdges),
    stats: deriveGraphStats(nodes, edges),
  }
}
```

**Apply:** Nine named exported functions (`getDescriptorsByFamily`, `getDescriptorsBySubfamily`, `resolveAliasPath`, `getDescriptorToFamilyPath`, `getRelatedDescriptors`, `getSimilarityNeighborhood`, `getCrossFamilyBridges`, `getSimilarityHub`). Each returns a typed proof object; no re-validation inside production module (D-02). Missing targets return empty structured proofs, not throws (RESEARCH A3).

**Edge traversal using endpoint kinds** (`src/graph_read_model/contract.ts` lines 42-47):
```typescript
export const GRAPH_EDGE_ENDPOINT_KINDS = {
  contains_subfamily: { source: 'family', target: 'subfamily' },
  contains_descriptor: { source: 'subfamily', target: 'descriptor' },
  resolves_to: { source: 'alias', target: 'descriptor' },
  similar_to: { source: 'subfamily', target: 'subfamily' },
} as const
```

**Similarity edge property read pattern** (`src/graph_read_model/build_graph.ts` lines 150-163):
```typescript
const buildSimilarityEdgeProperties = (edge: SimilarityEdge): Readonly<Record<string, unknown>> => {
  const properties: Record<string, unknown> = {
    source_subfamily_id: edge.source,
    target_subfamily_id: edge.target,
    score: edge.score,
    dimensions: edge.dimensions,
    evidence: edge.evidence,
  }

  if (edge.final_score !== undefined) {
    properties.final_score = edge.final_score
  }

  return properties
}
```

**Apply:** Read `score`, `dimensions`, `evidence`, `final_score` from `similar_to` edge properties only — no recomputation (D-19). For 1-hop neighborhood, treat edges as undirected: match `subfamilyId` on either `source` or `target` (RESEARCH Pitfall 1).

---

### `src/tests/graph_read_model/query_graph.test.ts` (test, transform)

**Primary analog:** `src/tests/graph_read_model/build_graph.test.ts`  
**Secondary analog:** `src/tests/graph_read_model/validate_graph.test.ts`

**Imports + inline fixture pattern** (`src/tests/graph_read_model/build_graph.test.ts` lines 1-82):
```typescript
import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import type { CompiledAliases } from '../../compiler/types.js'
import type { CompiledTaxonomy } from '../../types/taxonomy.js'
import type { SimilarityGraph } from '../../types/similarity.js'
import type { BuildOlfactoryGraphInput } from '../../graph_read_model/types.js'

const makeMinimalInput = (): BuildOlfactoryGraphInput => {
  const taxonomy: CompiledTaxonomy = { /* inline minimal */ }
  const aliases: CompiledAliases = { /* inline minimal */ }
  const similarity: SimilarityGraph = { /* inline minimal */ }
  return { taxonomy, aliases, similarity }
}
```

**Validate-before-query setup** (`src/tests/graph_read_model/validate_graph.test.ts` lines 93-127):
```typescript
const makeValidGraph = (): OlfactoryGraph => buildOlfactoryGraph(makeMinimalInput())

describe('validateOlfactoryGraph', () => {
  it('accepts a valid minimal graph with empty warnings', () => {
    const result = validateOlfactoryGraph(makeValidGraph())

    expect(result).toEqual({
      ok: true,
      errors: [],
      warnings: [],
    })
  })
})
```

**Apply:** Every query test builds graph inline, asserts `validateOlfactoryGraph(graph).ok === true`, then queries. No `readFile` in this file (D-24/D-27).

**Determinism assertion pattern** (`src/tests/graph_read_model/build_graph.test.ts` lines 136-145):
```typescript
it('returns deep-equal graphs and JSON serialization across repeated builds', () => {
  const input = makeMinimalInput()
  const first = buildOlfactoryGraph(input)
  const second = buildOlfactoryGraph(input)

  expect(first.nodes).toEqual(second.nodes)
  expect(first.edges).toEqual(second.edges)
  expect(first.stats).toEqual(second.stats)
  expect(JSON.stringify(first)).toBe(JSON.stringify(second))
})
```

**Apply:** For each query function, call twice on same validated graph → `toEqual` + `JSON.stringify` equality (D-28). Inline fixtures use exact proof-object `toEqual` snapshots (D-26), not partial matchers.

**Explicit sort verification** (`src/tests/graph_read_model/build_graph.test.ts` lines 147-154):
```typescript
const nodeSortKeys = graph.nodes.map(node => `${node.kind}|${node.id}`)
expect(nodeSortKeys).toEqual([...nodeSortKeys].sort((left, right) => left.localeCompare(right)))
```

**Apply:** Assert query result lists are lexicographically sorted by `id`; similarity neighborhoods sorted by score desc then id.

**Fixture mutation pattern for edge cases** (`src/tests/graph_read_model/validate_graph.test.ts` lines 95-108):
```typescript
type MutableOlfactoryGraph = {
  schema_version: OlfactoryGraph['schema_version']
  nodes: GraphNode[]
  edges: GraphEdge[]
  stats: GraphStats
}

const cloneGraph = (graph: OlfactoryGraph): MutableOlfactoryGraph => ({
  schema_version: graph.schema_version,
  nodes: graph.nodes.map(node => ({ ...node, properties: { ...node.properties } })),
  edges: graph.edges.map(edge => ({ ...edge, properties: { ...edge.properties } })),
  stats: { ...graph.stats },
})
```

**Apply:** Use `cloneGraph` only if testing unknown-alias / empty-result paths; primary inline fixtures use stable v2 baseline IDs (`woody`, `cedar`, cross-family subfamily) hardcoded without live file reads.

---

### `src/tests/graph_read_model/query_live_baseline.test.ts` (test, file-I/O)

**Primary analog:** `src/tests/graph_read_model/live_artifact_baseline.test.ts`  
**Secondary analog:** `src/tests/inventory/alias_target_inventory.test.ts`

**Read-only live artifact import pattern** (`src/tests/graph_read_model/live_artifact_baseline.test.ts` lines 1-29):
```typescript
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import {
  GRAPH_ALLOWED_PRODUCTION_INPUTS,
  GRAPH_EXPECTED_BASELINE_STATS,
} from '../../graph_read_model/contract.js'
import { validateOlfactoryGraph } from '../../graph_read_model/validate_graph.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const compiledPaths = {
  taxonomy: path.join(repoRoot, 'data/compiled/v2/taxonomy.json'),
  aliases: path.join(repoRoot, 'data/compiled/v2/descriptor_aliases.json'),
  similarity: path.join(repoRoot, 'data/compiled/v2/similarity_matrix.json'),
} as const

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T
```

**Build + validate + assert baseline pattern** (`src/tests/graph_read_model/live_artifact_baseline.test.ts` lines 32-62):
```typescript
const [taxonomy, aliases, similarity] = await Promise.all([
  readJson<CompiledTaxonomy>(compiledPaths.taxonomy),
  readJson<CompiledAliases>(compiledPaths.aliases),
  readJson<SimilarityGraph>(compiledPaths.similarity),
])

const graph = buildOlfactoryGraph({ taxonomy, aliases, similarity })
const validation = validateOlfactoryGraph(graph)

expect(validation).toEqual({
  ok: true,
  errors: [],
  warnings: [],
})

expect(graph.stats).toEqual(GRAPH_EXPECTED_BASELINE_STATS)
```

**Aggregate count assertion pattern** (`src/tests/inventory/alias_target_inventory.test.ts` lines 81-105):
```typescript
expect(Object.keys(compiledAliases)).toHaveLength(18)
expect(descriptorIds.size).toBe(341)

const result = validateAliasTargetIntegrity(seedAliases, descriptorIds, exceptionPolicy)

expect(result).toEqual({
  status: 'PASS',
  valid_target_count: 18,
  unresolved_target_count: 0,
})
```

**Apply:** Loop all 10 families for `getDescriptorsByFamily`; all 18 aliases for `resolveAliasPath`; every subfamily with `similar_to` edges for `getSimilarityNeighborhood`. Use structural + count assertions (D-26), not full-catalog JSON snapshots:
- `getCrossFamilyBridges` → `bridges.length === 5`
- `getSimilarityHub` → `hub.subfamily_id === 'floral_rose'`, degree 3
- Per-result descriptor lists sorted by `id`
- Selective content checks (e.g. `cedar` alias resolves to `cedarwood`)

---

### `src/tests/graph_read_model/live_artifact_baseline.test.ts` (test, file-I/O — extend)

**Analog:** itself (extend existing fs-free guard)

**Production module path registry** (`src/tests/graph_read_model/live_artifact_baseline.test.ts` lines 23-26):
```typescript
const productionModulePaths = {
  buildGraph: path.join(repoRoot, 'src/graph_read_model/build_graph.ts'),
  validateGraph: path.join(repoRoot, 'src/graph_read_model/validate_graph.ts'),
} as const
```

**FS-free guard pattern** (`src/tests/graph_read_model/live_artifact_baseline.test.ts` lines 92-104):
```typescript
it('keeps Phase 56 production graph modules free from filesystem and path-based APIs', async () => {
  const [buildSource, validateSource] = await Promise.all([
    readFile(productionModulePaths.buildGraph, 'utf8'),
    readFile(productionModulePaths.validateGraph, 'utf8'),
  ])

  for (const source of [buildSource, validateSource]) {
    expect(source).not.toMatch(/from 'node:fs'|from "node:fs"|from 'node:fs\/promises'|from "node:fs\/promises"/)
    expect(source).not.toMatch(/readFile\(|writeFile\(|createReadStream\(/)
    expect(source).not.toContain('graphify-out/')
    expect(source).not.toContain('data/enriched_materials.json')
  }
})
```

**Apply:** Add `queryGraph: path.join(repoRoot, 'src/graph_read_model/query_graph.ts')` to `productionModulePaths` and include it in the fs-free assertion loop (D-29).

---

## Shared Patterns

### Contract-first constants and baseline stats
**Source:** `src/graph_read_model/contract.ts` lines 42-77  
**Apply to:** `query_graph.ts`, `query_live_baseline.test.ts`
```typescript
export const GRAPH_EDGE_ENDPOINT_KINDS = {
  contains_subfamily: { source: 'family', target: 'subfamily' },
  contains_descriptor: { source: 'subfamily', target: 'descriptor' },
  resolves_to: { source: 'alias', target: 'descriptor' },
  similar_to: { source: 'subfamily', target: 'subfamily' },
} as const

export const GRAPH_EXPECTED_BASELINE_STATS = {
  families: 10,
  subfamilies: 18,
  descriptors: 341,
  aliases: 18,
  subfamily_similarity_edges: 13,
} as const
```

### Ephemeral Map indexes (no persisted graph indexes)
**Source:** `src/graph_read_model/validate_graph.ts` lines 91-99  
**Apply to:** `query_graph.ts` — all functions needing O(1) node/edge lookup
```typescript
const buildNodeIndex = (nodes: readonly GraphNode[]): Map<string, GraphNode> => {
  const index = new Map<string, GraphNode>()
  for (const node of nodes) {
    if (!index.has(node.id)) {
      index.set(node.id, node)
    }
  }
  return index
}
```

### Production fs-free / test-only I/O boundary
**Source:** `src/tests/graph_read_model/live_artifact_baseline.test.ts` lines 92-104; Phase 56 `56-PATTERNS.md`  
**Apply to:** `query_graph.ts` (no fs), `query_graph.test.ts` (no fs), `query_live_baseline.test.ts` (fs allowed)
```typescript
expect(source).not.toMatch(/from 'node:fs'|from "node:fs"|from 'node:fs\/promises'|from "node:fs\/promises"/)
expect(source).not.toMatch(/readFile\(|writeFile\(|createReadStream\(/)
```

### Deterministic sorting and deep-equality proofs
**Source:** `src/tests/graph_read_model/build_graph.test.ts` lines 136-145; `src/graph_read_model/build_graph.ts` lines 24-34  
**Apply to:** `query_graph.ts`, `query_graph.test.ts`
```typescript
expect(first).toEqual(second)
expect(JSON.stringify(first)).toBe(JSON.stringify(second))
// Query lists: explicit localeCompare comparators, not input array order
```

### Validate-before-query test gate
**Source:** `src/tests/graph_read_model/live_artifact_baseline.test.ts` lines 46-53; `57-CONTEXT.md` D-02  
**Apply to:** All query tests
```typescript
const graph = buildOlfactoryGraph({ taxonomy, aliases, similarity })
const validation = validateOlfactoryGraph(graph)
expect(validation.ok).toBe(true)
const proof = getDescriptorsByFamily(graph, 'woody')
expect(proof.query_kind).toBe('descriptors_by_family')
```

### Raw taxonomy IDs in params, graph IDs in results/paths
**Source:** `src/graph_read_model/build_graph.ts` lines 13-19; RESEARCH Pitfall 2  
**Apply to:** All public query function signatures and proof `params`
```typescript
// Public: getDescriptorsByFamily(graph, 'woody')
// Proof params: { family_id: 'woody' }
// Path/result graph_ids: 'family:woody', 'descriptor:cedarwood'
```

## No Analog Found

None. Phase 56 graph modules and tests provide direct analogs for pure in-memory transforms, ephemeral indexes, hybrid test layout, and live baseline regression. Query-specific traversal logic has no prior module but copies established `validate_graph.ts` / `build_graph.ts` patterns.

## Metadata

**Analog search scope:** `src/graph_read_model/`, `src/tests/graph_read_model/`, `src/types/`, `src/tests/inventory/`, `.planning/phases/56-pure-builder-structural-validation/`  
**Files scanned:** 12  
**Pattern extraction date:** 2026-06-10
