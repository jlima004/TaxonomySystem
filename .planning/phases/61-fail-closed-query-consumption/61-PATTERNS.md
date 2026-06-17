# Phase 61: Fail-Closed Query Consumption - Pattern Map

**Mapped:** 2026-06-17
**Files analyzed:** 6
**Analogs found:** 6 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/graph_read_model/query_consumer.ts` | utility/boundary | request-response + transform | `src/graph_read_model/validate_graph.ts` + `src/graph_read_model/query_graph.ts` | role-match |
| `src/graph_read_model/types.ts` | types/utility | transform | `src/graph_read_model/types.ts` | exact |
| `src/graph_read_model/validation_errors.ts` | utility/factory | transform | `src/graph_read_model/validation_errors.ts` | exact |
| `src/graph_read_model/contract.ts` | config/types | transform | `src/graph_read_model/contract.ts` | exact |
| `src/tests/graph_read_model/query_consumer.test.ts` | test | request-response + transform | `src/tests/graph_read_model/validate_graph.test.ts` + `src/tests/graph_read_model/query_graph.test.ts` | role-match |
| `src/tests/graph_read_model/query_live_baseline.test.ts` | test | file-I/O + request-response | `src/tests/graph_read_model/query_live_baseline.test.ts` | exact |

## Pattern Assignments

### `src/graph_read_model/query_consumer.ts` (utility/boundary, request-response + transform)

**Analog:** `src/graph_read_model/validate_graph.ts` + `src/graph_read_model/query_graph.ts`

**Imports pattern** (copy ESM `.js` local imports and type-only imports from `src/graph_read_model/validate_graph.ts` lines 1-35 and `src/graph_read_model/query_graph.ts` lines 1-24):
```typescript
import {
  SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE,
  GRAPH_EDGE_ENDPOINT_KINDS,
  GRAPH_SCHEMA_VERSION,
  type GraphNodeKind,
} from './contract.js'
import type {
  GraphValidationResult,
  OlfactoryGraph,
} from './types.js'
import { combineGraphResults } from './types.js'
import {
  makeDuplicateEdgeIdError,
  makeDuplicateNodeIdError,
} from './validation_errors.js'
```

```typescript
import type {
  AliasResolutionPathProof,
  CrossFamilyBridgesProof,
  DescriptorToFamilyPathProof,
  DescriptorsByFamilyProof,
  DescriptorsBySubfamilyProof,
  OlfactoryGraph,
  RelatedDescriptorsProof,
  SimilarityHubProof,
  SimilarityNeighborhoodProof,
} from './types.js'
import {
  makeAliasGraphId,
  makeDescriptorGraphId,
  makeFamilyGraphId,
  makeSubfamilyGraphId,
  stripGraphIdPrefix,
} from './graph_id.js'
```

**Apply to Phase 61:** import `validateSanctionedV211Graph` from `./validate_graph.js`, all eight query functions from `./query_graph.js`, `makeGraphNotValidatedError` from `./validation_errors.js` only if a runtime misuse guard or throw helper is implemented, and type imports for the proof/result types. Keep the module zero-dependency, ESM, functional, and class-free.

**Validation wrapper pattern** (copy from `src/graph_read_model/validate_graph.ts` lines 369-401):
```typescript
export const validateOlfactoryGraphAgainstProfile = (
  graph: OlfactoryGraph,
  profile: GraphValidationProfile,
): GraphValidationResult => {
  const structuralResult = validateOlfactoryGraphStructure(graph)
  if (!structuralResult.ok) {
    return structuralResult
  }

  const errors: GraphValidationResult['errors'][number][] = []
  if (graph.schema_version !== profile.schema_version) {
    errors.push(makeInvalidSchemaVersionError(String(graph.schema_version)))
  }

  for (const key of Object.keys(profile.expected_stats) as (keyof GraphStats)[]) {
    if (graph.stats[key] !== profile.expected_stats[key]) {
      errors.push(
        makeProfileBaselineMismatchError(key, graph.stats[key], profile.expected_stats[key]),
      )
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings: [],
  }
}

export const validateSanctionedV211Graph = (
  graph: OlfactoryGraph,
): GraphValidationResult =>
  validateOlfactoryGraphAgainstProfile(graph, SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE)
```

**Apply to Phase 61:** `asValidatedGraph(graph)` should call `validateSanctionedV211Graph(graph)` once. On failure, return an `ok: false` result that preserves the validation errors exactly; do not collapse structural/profile errors into `graph_not_validated`. On success, brand/cast the graph into `ValidatedGraph`.

**Core query delegation pattern** (copy from `src/graph_read_model/query_graph.ts` lines 112-132, 134-191, 353-383, 385-415, 418-477, 479-508):
```typescript
export const getDescriptorsByFamily = (
  graph: OlfactoryGraph,
  familyId: string,
): DescriptorsByFamilyProof => ({
  query_kind: 'descriptors_by_family',
  params: { family_id: familyId },
  result: {
    descriptors: collectDescriptors(graph, node => node.properties.family_id === familyId),
  },
})

export const getDescriptorsBySubfamily = (
  graph: OlfactoryGraph,
  subfamilyId: string,
): DescriptorsBySubfamilyProof => ({
  query_kind: 'descriptors_by_subfamily',
  params: { subfamily_id: subfamilyId },
  result: {
    descriptors: collectDescriptors(graph, node => node.properties.subfamily_id === subfamilyId),
  },
})
```

```typescript
export const resolveAliasPath = (
  graph: OlfactoryGraph,
  alias: string,
): AliasResolutionPathProof => {
  const nodeIndex = buildNodeIndex(graph.nodes)
  const aliasNode = nodeIndex.get(makeAliasGraphId(alias))

  if (!aliasNode) {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

  const resolvesToEdge = graph.edges.find(
    edge => edge.kind === 'resolves_to' && edge.source === aliasNode.id,
  )
  if (!resolvesToEdge) {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }
```

```typescript
export const getSimilarityNeighborhood = (
  graph: OlfactoryGraph,
  subfamilyId: string,
): SimilarityNeighborhoodProof => {
  const subfamilyGraphId = makeSubfamilyGraphId(subfamilyId)
  const neighbors: SimilarityNeighborhoodEntry[] = []

  for (const edge of graph.edges) {
    if (edge.kind !== 'similar_to') {
      continue
    }

    if (edge.source === subfamilyGraphId) {
      neighbors.push(toSimilarityNeighborhoodEntry(edge, edge.target, 'outbound'))
      continue
    }

    if (edge.target === subfamilyGraphId) {
      neighbors.push(toSimilarityNeighborhoodEntry(edge, edge.source, 'inbound'))
    }
  }

  const collapsedNeighbors = collapseNeighborhoodEntries(neighbors)
  collapsedNeighbors.sort(compareSimilarityNeighborhoodEntries)

  return {
    query_kind: 'similarity_neighborhood',
    params: { subfamily_id: subfamilyId },
    result: { neighbors: collapsedNeighbors },
  }
}
```

**Apply to Phase 61:** `createValidatedQueryConsumer(validatedGraph)` should be the sanctioned entrypoint and should return a plain object whose methods close over `ValidatedGraph` and delegate to these eight functions. The methods should return the current proof objects directly, not `{ ok, proof }`.

**Runtime misuse/error pattern** (copy from `src/graph_read_model/validation_errors.ts` lines 217-226):
```typescript
export const makeGraphNotValidatedError = (reason: string): GraphValidationError =>
  makeGraphValidationError(
    'graph_not_validated',
    '$',
    `graph must be validated before query consumption: ${reason}`,
    {
      expected: { validated_graph: true },
      actual: { reason },
    },
  )
```

**Apply to Phase 61:** reserve `graph_not_validated` for missing validated-handle misuse or controlled throwing helpers. Do not use it for failed `validateSanctionedV211Graph(graph)`.

**Phase 61 fences:** do not recommend `createValidatedQueryConsumer(graph)` as the main entrypoint. The main entrypoint is `createValidatedQueryConsumer(validatedGraph)`. Do not alter the success proof envelope `{ query_kind, params, result, path }`. Do not turn missing aliases, missing descriptors, or unknown subfamilies into errors.

---

### `src/graph_read_model/types.ts` (types/utility, transform)

**Analog:** `src/graph_read_model/types.ts`

**Readonly graph shape pattern** (lines 13-40):
```typescript
export type GraphNode = {
  readonly id: string
  readonly kind: GraphNodeKind
  readonly properties: Readonly<Record<string, unknown>>
}

export type GraphEdge = {
  readonly id: string
  readonly kind: GraphEdgeKind
  readonly source: string
  readonly target: string
  readonly properties: Readonly<Record<string, unknown>>
}

export type OlfactoryGraph = {
  readonly schema_version: GraphSchemaVersion
  readonly nodes: readonly GraphNode[]
  readonly edges: readonly GraphEdge[]
  readonly stats: GraphStats
}
```

**Validation result pattern** (lines 53-68):
```typescript
export type GraphValidationError = {
  readonly code: GraphValidationErrorCode
  readonly path: string
  readonly message: string
  readonly invariant_id?: GraphInvariantId
  readonly node_id?: string
  readonly edge_id?: string
  readonly expected?: JsonValue
  readonly actual?: JsonValue
}

export type GraphValidationResult = {
  readonly ok: boolean
  readonly errors: readonly GraphValidationError[]
  readonly warnings: readonly GraphValidationError[]
}
```

**Proof envelope pattern** (lines 114-144):
```typescript
export type GraphQueryKind =
  | 'descriptors_by_family'
  | 'descriptors_by_subfamily'
  | 'alias_resolution_path'
  | 'descriptor_to_family_path'
  | 'related_descriptors'
  | 'similarity_neighborhood'
  | 'cross_family_bridges'
  | 'similarity_hub'

export type GraphQueryProof<TKind extends GraphQueryKind, TParams, TResult> = {
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}
```

**Concrete proof type pattern** (lines 195-241):
```typescript
export type DescriptorsByFamilyProof = GraphQueryProof<
  'descriptors_by_family',
  { readonly family_id: string },
  DescriptorsByFamilyResult
>

export type SimilarityHubProof = GraphQueryProof<
  'similarity_hub',
  Record<string, never>,
  { readonly hub: SimilarityHubResult | null }
>
```

**Apply to Phase 61:** if `ValidatedGraph`, `AsValidatedGraphResult`, or `ValidatedQueryConsumer` live in `types.ts`, follow the readonly/discriminated union style here. A branded handle should extend `OlfactoryGraph` semantically but should not change `OlfactoryGraph` or `GraphQueryProof`.

---

### `src/graph_read_model/validation_errors.ts` (utility/factory, transform)

**Analog:** `src/graph_read_model/validation_errors.ts`

**Imports and normalization pattern** (lines 1-17, 29-55):
```typescript
import {
  GRAPH_SCHEMA_VERSION,
  GRAPH_VALIDATION_CODE_TO_INVARIANT_ID,
  type GraphExpectedBaselineStats,
  type GraphInvariantId,
  type GraphValidationErrorCode,
} from './contract.js'
import type { GraphValidationError, JsonValue } from './types.js'
import { makeGraphError } from './types.js'

export type GraphValidationErrorOptions = {
  readonly invariant_id?: GraphInvariantId
  readonly node_id?: string
  readonly edge_id?: string
  readonly expected?: JsonValue
  readonly actual?: JsonValue
}
```

```typescript
export const makeGraphValidationError = (
  code: GraphValidationErrorCode,
  path: string,
  message: string,
  options: GraphValidationErrorOptions = {},
): GraphValidationError => {
  const normalizedOptions: Parameters<typeof makeGraphError>[3] = {}
  const invariantId = resolveInvariantId(code, options.invariant_id)

  if (invariantId !== undefined) {
    normalizedOptions.invariant_id = invariantId
  }
  if (options.node_id !== undefined) {
    normalizedOptions.node_id = options.node_id
  }
  if (options.edge_id !== undefined) {
    normalizedOptions.edge_id = options.edge_id
  }
```

**Graph-not-validated factory pattern** (lines 217-226):
```typescript
export const makeGraphNotValidatedError = (reason: string): GraphValidationError =>
  makeGraphValidationError(
    'graph_not_validated',
    '$',
    `graph must be validated before query consumption: ${reason}`,
    {
      expected: { validated_graph: true },
      actual: { reason },
    },
  )
```

**Apply to Phase 61:** reuse the existing factory. Only add another factory if the implementation needs a distinct deterministic reason wrapper; prefer not to introduce a new error code.

---

### `src/graph_read_model/contract.ts` (config/types, transform)

**Analog:** `src/graph_read_model/contract.ts`

**Authoritative error-code pattern** (lines 71-109):
```typescript
export const GRAPH_VALIDATION_ERROR_CODES = [
  'invalid_schema_version',
  'duplicate_node_id_detection',
  'duplicate_edge_id_detection',
  'missing_edge_endpoints',
  'wrong_endpoint_kinds',
  'invalid_alias_targets',
  'invalid_subfamily_similarity_endpoints',
  'inconsistent_stats',
  'invalid_graph_id',
  'profile_baseline_mismatch',
  'graph_not_validated',
] as const

export const GRAPH_INVARIANT_IDS = [
  'schema_version_match',
  'duplicate_node_id_detection',
  'duplicate_edge_id_detection',
  'missing_edge_endpoints',
  'wrong_endpoint_kinds',
  'invalid_alias_targets',
  'invalid_subfamily_similarity_endpoints',
  'graph_id_parse',
  'profile_baseline_match',
  'graph_validation_required',
] as const

export const GRAPH_VALIDATION_CODE_TO_INVARIANT_ID = {
  invalid_schema_version: 'schema_version_match',
  duplicate_node_id_detection: 'duplicate_node_id_detection',
  duplicate_edge_id_detection: 'duplicate_edge_id_detection',
  missing_edge_endpoints: 'missing_edge_endpoints',
  wrong_endpoint_kinds: 'wrong_endpoint_kinds',
  invalid_alias_targets: 'invalid_alias_targets',
  invalid_subfamily_similarity_endpoints: 'invalid_subfamily_similarity_endpoints',
  invalid_graph_id: 'graph_id_parse',
  profile_baseline_mismatch: 'profile_baseline_match',
  graph_not_validated: 'graph_validation_required',
} as const
```

**Apply to Phase 61:** no contract change is required if `graph_not_validated` remains the only misuse error. If adding any new public literal, place it here with `as const`, derived union types, and aggregate `OLFACTORY_GRAPH_CONTRACT` exposure.

---

### `src/tests/graph_read_model/query_consumer.test.ts` (test, request-response + transform)

**Analog:** `src/tests/graph_read_model/validate_graph.test.ts` + `src/tests/graph_read_model/query_graph.test.ts`

**Imports and fixture pattern** (copy from `src/tests/graph_read_model/validate_graph.test.ts` lines 1-28, 29-127):
```typescript
import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import { GRAPH_EXPECTED_BASELINE_STATS } from '../../graph_read_model/contract.js'
import type { GraphEdge, GraphNode, GraphStats, OlfactoryGraph } from '../../graph_read_model/types.js'
import {
  makeDuplicateEdgeIdError,
  makeDuplicateNodeIdError,
  makeGraphNotValidatedError,
} from '../../graph_read_model/validation_errors.js'
import {
  validateOlfactoryGraph,
  validateOlfactoryGraphAgainstProfile,
  validateOlfactoryGraphStructure,
  validateSanctionedV211Graph,
} from '../../graph_read_model/validate_graph.js'
```

```typescript
const makeValidGraph = (): OlfactoryGraph => buildOlfactoryGraph(makeMinimalInput())

/** Mutable test fixture — production graphs stay readonly. */
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

**Validation error preservation pattern** (copy from `src/tests/graph_read_model/validate_graph.test.ts` lines 379-409):
```typescript
it('covers D-11 D-12 and D-13 with profile short-circuit and sanctioned baseline mismatch', () => {
  const invalidGraph = cloneGraph(makeValidGraph())
  invalidGraph.nodes = invalidGraph.nodes.map(node =>
    node.kind === 'family' ? { ...node, id: 'material:citrus' } : node,
  )

  const shortCircuit = validateSanctionedV211Graph(invalidGraph)
  expect(shortCircuit.errors.some(error => error.code === 'profile_baseline_mismatch')).toBe(false)

  const sanctionedResult = validateSanctionedV211Graph(makeValidGraph())
  expect(sanctionedResult.ok).toBe(false)
  expect(sanctionedResult.errors).toContainEqual({
    code: 'profile_baseline_mismatch',
    path: '$.stats.families',
    message: 'sanctioned profile expected families=10, got 1',
    invariant_id: 'profile_baseline_match',
    expected: { families: 10 },
    actual: { families: 1 },
  })
})
```

**Graph-not-validated assertion pattern** (copy from `src/tests/graph_read_model/validate_graph.test.ts` lines 467-505):
```typescript
const errors = [
  makeMissingEdgeEndpointError('$.edges[5].source', 'edge:1', 'source', 'subfamily:missing_a'),
  makeGraphNotValidatedError('sanctioned wrapper not called'),
]

expect(errors[1]).toEqual({
  code: 'graph_not_validated',
  path: '$',
  message: 'graph must be validated before query consumption: sanctioned wrapper not called',
  invariant_id: 'graph_validation_required',
  expected: { validated_graph: true },
  actual: { reason: 'sanctioned wrapper not called' },
})
```

**Envelope and missing-target compatibility pattern** (copy from `src/tests/graph_read_model/query_graph.test.ts` lines 209-214, 280-290, 353-385, 477-487):
```typescript
const expectExactProofKeys = (
  proof: Record<string, unknown>,
  expectedKeys: readonly string[],
): void => {
  expect(Object.keys(proof).sort()).toEqual([...expectedKeys].sort())
}
```

```typescript
it('returns empty result for unknown alias without throwing', () => {
  const graph = buildValidatedWoodyGraph()
  const proof = resolveAliasPath(graph, 'unknown_alias')

  expect(proof).toEqual({
    query_kind: 'alias_resolution_path',
    params: { alias: 'unknown_alias' },
    result: { target_descriptor_id: null },
  })
  expect(proof.path).toBeUndefined()
})
```

```typescript
it('preserves the established success proof envelopes without Phase 61 fail-closed additions', () => {
  const graph = buildValidatedWoodyGraph()

  expectExactProofKeys(getDescriptorsByFamily(graph, 'woody') as unknown as Record<string, unknown>, [
    'params',
    'query_kind',
    'result',
  ])
  expectExactProofKeys(resolveAliasPath(graph, 'cedar') as unknown as Record<string, unknown>, [
    'params',
    'path',
    'query_kind',
    'result',
  ])

  expect(getRelatedDescriptors(graph, 'missing_descriptor')).toEqual({
    query_kind: 'related_descriptors',
    params: { descriptor_id: 'missing_descriptor' },
    result: { descriptors: [] },
  })
})
```

```typescript
it('returns empty neighbors for unknown subfamily without throwing', () => {
  const graph = buildValidatedWoodyGraph()
  const proof = getSimilarityNeighborhood(graph, 'unknown_subfamily')

  expect(proof).toEqual({
    query_kind: 'similarity_neighborhood',
    params: { subfamily_id: 'unknown_subfamily' },
    result: { neighbors: [] },
  })
  expect(proof.path).toBeUndefined()
})
```

**Apply to Phase 61:** create tests that prove:

- `asValidatedGraph(rawGraph)` returns `{ ok: true, graph: ValidatedGraph }` only for sanctioned-valid graph input.
- failed sanctioned validation returns `{ ok: false, errors }` preserving existing validation error objects.
- `createValidatedQueryConsumer(validatedGraph)` exposes all eight query methods and returns the same direct proof shape as `query_graph.ts`.
- missing aliases/descriptors/subfamilies remain empty/null structured proofs, not errors.
- any runtime misuse helper returns or throws `makeGraphNotValidatedError(...)`, separate from validation failures.

---

### `src/tests/graph_read_model/query_live_baseline.test.ts` (test, file-I/O + request-response)

**Analog:** `src/tests/graph_read_model/query_live_baseline.test.ts`

**Live sanctioned input pattern** (lines 1-35, 50-73):
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
import { validateSanctionedV211Graph } from '../../graph_read_model/validate_graph.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T
```

```typescript
describe('live compiled v2 query baseline regression', () => {
  it('proves aggregate catalog consumability with structural assertions at baseline scale', async () => {
    const sanctionedRelativePaths = [
      path.relative(repoRoot, compiledPaths.taxonomy),
      path.relative(repoRoot, compiledPaths.aliases),
      path.relative(repoRoot, compiledPaths.similarity),
    ]
    expect(sanctionedRelativePaths).toEqual([...GRAPH_ALLOWED_PRODUCTION_INPUTS])

    const [taxonomy, aliases, similarity] = await Promise.all([
      readJson<CompiledTaxonomy>(compiledPaths.taxonomy),
      readJson<CompiledAliases>(compiledPaths.aliases),
      readJson<SimilarityGraph>(compiledPaths.similarity),
    ])

    const graph = buildOlfactoryGraph({ taxonomy, aliases, similarity })
    const validation = validateSanctionedV211Graph(graph)

    expect(validation).toEqual({
      ok: true,
      errors: [],
      warnings: [],
    })
    expect(graph.stats).toEqual(GRAPH_EXPECTED_BASELINE_STATS)
```

**Live query assertion pattern** (lines 78-149):
```typescript
for (const familyId of familyIds) {
  const proof = getDescriptorsByFamily(graph, familyId)
  expect(proof.query_kind).toBe('descriptors_by_family')
  expect(proof.params).toEqual({ family_id: familyId })
  expect(proof.result.descriptors.length).toBeGreaterThan(0)
  expect(isSortedById(proof.result.descriptors)).toBe(true)
  expect(proof.path).toBeUndefined()
}

const cedarProof = resolveAliasPath(graph, 'cedar')
expect(cedarProof.result.target_descriptor_id).toBe('cedarwood')

const bridgesProof = getCrossFamilyBridges(graph)
expect(bridgesProof.query_kind).toBe('cross_family_bridges')
expect(bridgesProof.result.bridges).toHaveLength(5)
expect(bridgesProof.path).toBeUndefined()

const hubProof = getSimilarityHub(graph)
expect(hubProof.query_kind).toBe('similarity_hub')
expect(hubProof.result.hub).toEqual({
  subfamily_id: 'floral_rose',
  graph_id: 'subfamily:floral_rose',
  family_id: 'floral',
  degree: 3,
})
```

**Apply to Phase 61:** after `asValidatedGraph(graph)` succeeds, create the consumer with `createValidatedQueryConsumer(result.graph)` and route these same assertions through the consumer methods. Keep all reads local to existing compiled data; do not add API, DB, persistence, publication, or Graphify integration.

## Shared Patterns

### Sanctioned Validation Boundary

**Source:** `src/graph_read_model/validate_graph.ts` lines 398-401
**Apply to:** `src/graph_read_model/query_consumer.ts`, `src/tests/graph_read_model/query_consumer.test.ts`, live consumer assertions

```typescript
export const validateSanctionedV211Graph = (
  graph: OlfactoryGraph,
): GraphValidationResult =>
  validateOlfactoryGraphAgainstProfile(graph, SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE)
```

### Typed Error Factories

**Source:** `src/graph_read_model/validation_errors.ts` lines 217-226 and `src/graph_read_model/contract.ts` lines 71-109
**Apply to:** consumer misuse guard and tests

```typescript
export const makeGraphNotValidatedError = (reason: string): GraphValidationError =>
  makeGraphValidationError(
    'graph_not_validated',
    '$',
    `graph must be validated before query consumption: ${reason}`,
    {
      expected: { validated_graph: true },
      actual: { reason },
    },
  )
```

### Proof Envelope Preservation

**Source:** `src/graph_read_model/types.ts` lines 139-144 and `src/tests/graph_read_model/query_graph.test.ts` lines 353-385
**Apply to:** all consumer methods and tests

```typescript
export type GraphQueryProof<TKind extends GraphQueryKind, TParams, TResult> = {
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}
```

```typescript
expectExactProofKeys(getDescriptorsByFamily(graph, 'woody') as unknown as Record<string, unknown>, [
  'params',
  'query_kind',
  'result',
])
```

### Missing Target Is Not an Error

**Source:** `src/graph_read_model/query_graph.ts` lines 141-147, 200-205, 486-491 and `src/tests/graph_read_model/query_graph.test.ts` lines 280-290, 477-487
**Apply to:** consumer method tests

```typescript
if (!aliasNode) {
  return {
    query_kind: 'alias_resolution_path',
    params: { alias },
    result: { target_descriptor_id: null },
  }
}
```

```typescript
if (!descriptorNode || descriptorNode.kind !== 'descriptor') {
  return {
    query_kind: 'related_descriptors',
    params: { descriptor_id: descriptorId },
    result: { descriptors: [] },
  }
}
```

### Functional Zero-Dependency Module Style

**Source:** `src/graph_read_model/query_graph.ts` lines 26-34, 83-91 and `src/graph_read_model/validate_graph.ts` lines 37-49
**Apply to:** `query_consumer.ts`

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

Use plain exported functions and objects. Avoid classes, mutable module state, caches, services, API handlers, filesystem reads, and external dependencies.

## No Analog Found

No Phase 61 file is without a close analog. There is no existing `query_consumer.ts`, but the required implementation is a direct composition of established validation and query patterns.

## Metadata

**Analog search scope:** `src/graph_read_model`, `src/tests/graph_read_model`, `.planning/phases/60-contract-constants-validation-hardening`

**Files scanned:** 13 focused source/test files plus Phase 60 pattern context

**Pattern extraction date:** 2026-06-17

**Planner fences:** The planner must keep `createValidatedQueryConsumer(validatedGraph)` as the sanctioned consumer entrypoint, must not change the success proof envelope `{ query_kind, params, result, path }`, and must not convert missing query targets into errors.
