# Phase 60: Contract Constants & Validation Hardening - Pattern Map

**Mapped:** 2026-06-16
**Files analyzed:** 15
**Analogs found:** 15 / 15

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/graph_read_model/contract.ts` | config/types | transform | `src/graph_read_model/contract.ts` | exact |
| `src/graph_read_model/types.ts` | types/utility | transform | `src/graph_read_model/types.ts` | exact |
| `src/graph_read_model/graph_id.ts` | utility | transform | `src/graph_read_model/build_graph.ts` + `src/graph_read_model/query_graph.ts` | role-match |
| `src/graph_read_model/validation_errors.ts` | utility/factory | transform | `src/graph_read_model/types.ts` + `src/graph_read_model/validate_graph.ts` | role-match |
| `src/graph_read_model/validate_graph.ts` | utility/validator | transform | `src/graph_read_model/validate_graph.ts` | exact |
| `src/graph_read_model/build_graph.ts` | builder | transform | `src/graph_read_model/build_graph.ts` | exact |
| `src/graph_read_model/query_graph.ts` | query utility | request-response | `src/graph_read_model/query_graph.ts` | exact |
| `src/cli/graph_read_model.ts` | CLI boundary | file-I/O | `src/cli/graph_read_model.ts` | exact |
| `src/tests/graph_read_model/contract.test.ts` | test | transform | `src/tests/graph_read_model/contract.test.ts` | exact |
| `src/tests/graph_read_model/graph_id.test.ts` | test | transform | `src/tests/graph_read_model/build_graph.test.ts` + `src/tests/graph_read_model/query_graph.test.ts` | role-match |
| `src/tests/graph_read_model/validate_graph.test.ts` | test | transform | `src/tests/graph_read_model/validate_graph.test.ts` | exact |
| `src/tests/graph_read_model/live_artifact_baseline.test.ts` | test | file-I/O | `src/tests/graph_read_model/live_artifact_baseline.test.ts` | exact |
| `src/tests/graph_read_model/query_live_baseline.test.ts` | test | file-I/O/request-response | `src/tests/graph_read_model/query_live_baseline.test.ts` | exact |
| `src/tests/cli/graph_read_model.test.ts` | test | file-I/O | `src/tests/cli/graph_read_model.test.ts` | exact |
| `docs/olfactory_graph_read_model.md` | docs | transform | `docs/olfactory_graph_read_model.md` | exact |

## Pattern Assignments

### `src/graph_read_model/contract.ts` (config/types, transform)

**Analog:** `src/graph_read_model/contract.ts`

**Imports pattern:** none. Keep this module zero-dependency and static.

**Authoritative literal vocabulary pattern** (lines 1-19):
```typescript
export const GRAPH_SCHEMA_VERSION = 'olfactory_graph_read_model.v1' as const

export const GRAPH_NODE_KINDS = ['family', 'subfamily', 'descriptor', 'alias'] as const

export const GRAPH_EDGE_KINDS = ['contains_subfamily', 'contains_descriptor', 'resolves_to', 'similar_to'] as const

export const GRAPH_ID_PREFIXES = ['family:', 'subfamily:', 'descriptor:', 'alias:'] as const
```

**Invariant/baseline pattern** (lines 62-77):
```typescript
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

**Derived union pattern** (lines 79-92):
```typescript
export type GraphSchemaVersion = typeof GRAPH_SCHEMA_VERSION
export type GraphNodeKind = (typeof GRAPH_NODE_KINDS)[number]
export type GraphEdgeKind = (typeof GRAPH_EDGE_KINDS)[number]
export type GraphIdPrefix = (typeof GRAPH_ID_PREFIXES)[number]
export type GraphPhase56Invariant = (typeof GRAPH_PHASE_56_INVARIANTS)[number]
export type GraphExpectedBaselineStats = typeof GRAPH_EXPECTED_BASELINE_STATS
```

**Aggregate contract pattern** (lines 94-109):
```typescript
export const OLFACTORY_GRAPH_CONTRACT = {
  schema_version: GRAPH_SCHEMA_VERSION,
  node_kinds: GRAPH_NODE_KINDS,
  edge_kinds: GRAPH_EDGE_KINDS,
  id_prefixes: GRAPH_ID_PREFIXES,
  forbidden_node_prefixes: GRAPH_FORBIDDEN_NODE_PREFIXES,
  edge_id_format: GRAPH_EDGE_ID_FORMAT,
  node_required_properties: GRAPH_NODE_REQUIRED_PROPERTIES,
  edge_required_properties: GRAPH_EDGE_REQUIRED_PROPERTIES,
  edge_optional_properties: GRAPH_EDGE_OPTIONAL_PROPERTIES,
  edge_endpoint_kinds: GRAPH_EDGE_ENDPOINT_KINDS,
  allowed_production_inputs: GRAPH_ALLOWED_PRODUCTION_INPUTS,
  output_policy: GRAPH_OUTPUT_POLICY,
  phase_56_invariants: GRAPH_PHASE_56_INVARIANTS,
  expected_baseline_stats: GRAPH_EXPECTED_BASELINE_STATS,
} as const
```

**Apply to Phase 60:** add `GRAPH_VALIDATION_ERROR_CODES`, `GRAPH_INVARIANT_IDS`, optional code-to-invariant mapping and `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE` with the same `as const` plus derived type style. Do not introduce imports or runtime I/O here.

---

### `src/graph_read_model/types.ts` (types/utility, transform)

**Analog:** `src/graph_read_model/types.ts`

**Imports pattern** (lines 1-8):
```typescript
import type { CompiledAliases } from '../compiler/types.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { SimilarityGraph } from '../types/similarity.js'
import type {
  GraphEdgeKind,
  GraphNodeKind,
  GraphSchemaVersion,
} from './contract.js'
```

**Readonly graph shape pattern** (lines 10-37):
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

**Validation error/result pattern** (lines 45-57):
```typescript
export type GraphValidationError = {
  readonly code: string
  readonly path: string
  readonly message: string
  readonly node_id?: string
  readonly edge_id?: string
}

export type GraphValidationResult = {
  readonly ok: boolean
  readonly errors: readonly GraphValidationError[]
  readonly warnings: readonly GraphValidationError[]
}
```

**Factory/path normalization pattern** (lines 59-70):
```typescript
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

**Result composition pattern** (lines 72-86):
```typescript
export const combineGraphResults = (
  ...results: GraphValidationResult[]
): GraphValidationResult => {
  const errors: GraphValidationError[] = []
  const warnings: GraphValidationError[] = []
  for (const result of results) {
    errors.push(...result.errors)
    warnings.push(...result.warnings)
  }
  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}
```

**Apply to Phase 60:** extend `GraphValidationError` without breaking existing fields: `code` should become the contract-derived error-code union, add `invariant_id?`, `expected?`, `actual?`, and introduce a recursive `JsonValue`. Keep path normalization and conditional property spreading.

---

### `src/graph_read_model/graph_id.ts` (utility, transform)

**Analog:** local ID helpers in `src/graph_read_model/build_graph.ts` and `src/graph_read_model/query_graph.ts`

**Current construction pattern to centralize** (`build_graph.ts` lines 13-22):
```typescript
const familyNodeId = (familyId: string): string => `family:${familyId}`

const subfamilyNodeId = (subfamilyId: string): string => `subfamily:${subfamilyId}`

const descriptorNodeId = (descriptorId: string): string => `descriptor:${descriptorId}`

const aliasNodeId = (alias: string): string => `alias:${alias}`

const edgeId = (kind: GraphEdge['kind'], source: string, target: string): string =>
  `edge:${kind}:${source}->${target}`
```

**Current query-local construction pattern to replace** (`query_graph.ts` lines 19-25):
```typescript
const familyNodeId = (familyId: string): string => `family:${familyId}`

const subfamilyNodeId = (subfamilyId: string): string => `subfamily:${subfamilyId}`

const descriptorNodeId = (descriptorId: string): string => `descriptor:${descriptorId}`

const aliasNodeId = (alias: string): string => `alias:${alias}`
```

**Current strip anti-pattern to replace** (`query_graph.ts` lines 235-243):
```typescript
const toSimilarityNeighborhoodEntry = (
  edge: GraphEdge,
  neighborGraphId: string,
  direction: SimilarityNeighborhoodEntry['direction'],
): SimilarityNeighborhoodEntry => {
  const neighborId = neighborGraphId.replace(/^subfamily:/, '')
  const entry: SimilarityNeighborhoodEntry = {
    neighbor_id: neighborId,
    neighbor_graph_id: neighborGraphId,
```

**Apply to Phase 60:** implement the required API (`makeFamilyGraphId`, `makeSubfamilyGraphId`, `makeDescriptorGraphId`, `makeAliasGraphId`, `stripGraphIdPrefix`, `is*GraphId`, `parseGraphId`) using only `GRAPH_ID_PREFIXES`/contract constants. Return a discriminated parse result with JSON-safe typed errors for empty raw ID, unknown prefix and ambiguous format. Do not throw generic errors.

---

### `src/graph_read_model/validation_errors.ts` (utility/factory, transform)

**Analog:** `src/graph_read_model/types.ts` and `src/graph_read_model/validate_graph.ts`

**Path normalization and conditional payload pattern** (`types.ts` lines 59-70):
```typescript
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

**Validator call-site pattern to centralize** (`validate_graph.ts`):
```typescript
errors.push(
  makeGraphError(
    'wrong_endpoint_kinds',
    `${path}.target`,
    `expected target kind ${expectedKinds.target}, got ${targetNode.kind}`,
    { edge_id: edge.id },
  ),
)
```

**Apply to Phase 60:** create named functional factories that preserve the current stable `code`, `path`, `message`, `node_id` and `edge_id` fields while adding contract-backed `invariant_id`, `expected` and `actual` when applicable. Keep inputs typed as `JsonValue` for rich payloads, normalize paths once in the generic factory, and import validation code/invariant vocabulary from `contract.ts`. Do not introduce classes, stack traces, `unknown`, `Date`, `Map`, `Set`, `BigInt`, `undefined`, or runtime metadata into error payloads.

---

### `src/graph_read_model/validate_graph.ts` (utility/validator, transform)

**Analog:** `src/graph_read_model/validate_graph.ts`

**Imports pattern** (lines 1-13):
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

**Structural helper pattern** (lines 15-27):
```typescript
const countNodesByKind = (nodes: readonly GraphNode[], kind: GraphNodeKind): number =>
  nodes.filter(node => node.kind === kind).length

const countEdgesByKind = (edges: readonly GraphEdge[], kind: GraphEdge['kind']): number =>
  edges.filter(edge => edge.kind === kind).length

const deriveStatsFromGraph = (graph: OlfactoryGraph): GraphStats => ({
  families: countNodesByKind(graph.nodes, 'family'),
  subfamilies: countNodesByKind(graph.nodes, 'subfamily'),
  descriptors: countNodesByKind(graph.nodes, 'descriptor'),
  aliases: countNodesByKind(graph.nodes, 'alias'),
  subfamily_similarity_edges: countEdgesByKind(graph.edges, 'similar_to'),
})
```

**Single-rule result pattern** (lines 29-45):
```typescript
const validateSchemaVersion = (graph: OlfactoryGraph): GraphValidationResult => {
  if (graph.schema_version !== GRAPH_SCHEMA_VERSION) {
    return {
      ok: false,
      errors: [
        makeGraphError(
          'invalid_schema_version',
          '$.schema_version',
          `expected ${GRAPH_SCHEMA_VERSION}, got ${String(graph.schema_version)}`,
        ),
      ],
      warnings: [],
    }
  }

  return { ok: true, errors: [], warnings: [] }
}
```

**Index and endpoint validation pattern** (lines 91-104):
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

const validateMissingEdgeEndpoints = (
  edges: readonly GraphEdge[],
  nodeIndex: Map<string, GraphNode>,
): GraphValidationResult => {
```

**Unknown-kind no-throw pattern** (lines 142-156):
```typescript
const expectedKinds = GRAPH_EDGE_ENDPOINT_KINDS[edge.kind as keyof typeof GRAPH_EDGE_ENDPOINT_KINDS]

if (!expectedKinds) {
  errors.push(
    makeGraphError(
      'wrong_endpoint_kinds',
      `${path}.kind`,
      `unknown edge kind: ${edge.kind}`,
      { edge_id: edge.id },
    ),
  )
  return
}
```

**Entrypoint composition pattern** (lines 279-295):
```typescript
export const validateOlfactoryGraph = (graph: OlfactoryGraph): GraphValidationResult => {
  const schemaVersionResult = validateSchemaVersion(graph)
  const duplicateNodeResult = validateDuplicateNodeIds(graph.nodes)
  const duplicateEdgeResult = validateDuplicateEdgeIds(graph.edges)
  const nodeIndex = buildNodeIndex(graph.nodes)

  return combineGraphResults(
    schemaVersionResult,
    duplicateNodeResult,
    duplicateEdgeResult,
    validateMissingEdgeEndpoints(graph.edges, nodeIndex),
    validateWrongEndpointKinds(graph.edges, nodeIndex),
    validateInvalidAliasTargets(graph.edges, nodeIndex),
    validateInvalidSubfamilySimilarityEndpoints(graph.edges, nodeIndex),
    validateStatsReconciliation(graph),
  )
}
```

**Apply to Phase 60:** split the public surface into `validateOlfactoryGraphStructure`, `validateOlfactoryGraphAgainstProfile`, and `validateSanctionedV211Graph`. Keep `validateOlfactoryGraph` as a compatibility alias unless planning explicitly removes all old imports. Profile validation must call structural validation first and short-circuit when structural errors make baseline comparison unreliable.

---

### `src/graph_read_model/build_graph.ts` (builder, transform)

**Analog:** `src/graph_read_model/build_graph.ts`

**Imports pattern** (lines 1-11):
```typescript
import type { CompiledAliases } from '../compiler/types.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { SimilarityEdge, SimilarityGraph } from '../types/similarity.js'
import { GRAPH_SCHEMA_VERSION } from './contract.js'
import type {
  BuildOlfactoryGraphInput,
  GraphEdge,
  GraphNode,
  GraphStats,
  OlfactoryGraph,
} from './types.js'
```

**Graph assembly pattern** (lines 185-207):
```typescript
export const buildOlfactoryGraph = (input: BuildOlfactoryGraphInput): OlfactoryGraph => {
  const taxonomyResult = buildTaxonomyNodesAndEdges(input.taxonomy)
  const aliasResult = buildAliasNodesAndEdges(input.aliases)
  const similarityEdges = buildSimilarityEdges(input.similarity)

  const nodes = [
    ...taxonomyResult.nodes,
    ...aliasResult.nodes,
  ].sort(compareGraphNodes)

  const edges = [
    ...taxonomyResult.edges,
    ...aliasResult.edges,
    ...similarityEdges,
  ].sort(compareGraphEdges)

  return {
    schema_version: GRAPH_SCHEMA_VERSION,
    nodes,
    edges,
    stats: deriveGraphStats(nodes, edges),
  }
}
```

**Apply to Phase 60:** replace local `familyNodeId`/`subfamilyNodeId`/`descriptorNodeId`/`aliasNodeId` calls with imports from `graph_id.ts`. Preserve deterministic sorting, readonly output shape and exact generated IDs.

---

### `src/graph_read_model/query_graph.ts` (query utility, request-response)

**Analog:** `src/graph_read_model/query_graph.ts`

**Imports pattern** (lines 1-17):
```typescript
import type {
  AliasResolutionPathProof,
  CrossFamilyBridgeItem,
  CrossFamilyBridgesProof,
  DescriptorProofItem,
  DescriptorToFamilyPathProof,
  DescriptorsByFamilyProof,
  DescriptorsBySubfamilyProof,
  GraphEdge,
  GraphNode,
  OlfactoryGraph,
  PathSegment,
  RelatedDescriptorsProof,
  SimilarityHubProof,
  SimilarityNeighborhoodEntry,
  SimilarityNeighborhoodProof,
} from './types.js'
```

**Type guard pattern** (lines 37-44):
```typescript
const DESCRIPTOR_STATUSES: readonly DescriptorProofItem['status'][] = ['curated', 'candidate', 'inferred']
const DESCRIPTOR_SOURCES: readonly DescriptorProofItem['source'][] = ['seed', 'corpus', 'inferred']

const isDescriptorStatus = (value: unknown): value is DescriptorProofItem['status'] =>
  typeof value === 'string' && DESCRIPTOR_STATUSES.includes(value as DescriptorProofItem['status'])

const isDescriptorSource = (value: unknown): value is DescriptorProofItem['source'] =>
  typeof value === 'string' && DESCRIPTOR_SOURCES.includes(value as DescriptorProofItem['source'])
```

**Null-safe proof pattern** (lines 135-168):
```typescript
export const resolveAliasPath = (
  graph: OlfactoryGraph,
  alias: string,
): AliasResolutionPathProof => {
  const nodeIndex = buildNodeIndex(graph.nodes)
  const aliasNode = nodeIndex.get(aliasNodeId(alias))

  if (!aliasNode) {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }
```

**Proof envelope pattern** (lines 181-191):
```typescript
return {
  query_kind: 'alias_resolution_path',
  params: { alias },
  result: { target_descriptor_id: String(descriptorNode.properties.descriptor_id) },
  path: [
    toPathSegment(aliasNode),
    toPathSegment(descriptorNode),
    toPathSegment(subfamilyNode),
    toPathSegment(familyNode),
  ],
}
```

**Apply to Phase 60:** migrate ID construction/strip to `graph_id.ts`, preserving current success proof envelopes and null/empty-result behavior. Do not add Phase 61 proof-generation fail-closed wrappers here.

---

### `src/cli/graph_read_model.ts` (CLI boundary, file-I/O)

**Analog:** `src/cli/graph_read_model.ts`

**Imports pattern** (lines 1-21):
```typescript
import { access, readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join, dirname, resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { buildOlfactoryGraph } from '../graph_read_model/build_graph.js'
import { validateOlfactoryGraph } from '../graph_read_model/validate_graph.js'
import { writeGraphOutput, GraphWriteError } from '../graph_read_model/write_graph.js'
```

**Input loading pattern** (lines 103-122):
```typescript
const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(path, 'utf8')) as T

export const loadGraphInputs = async (_baseDir: string): Promise<BuildOlfactoryGraphInput> => {
  const [taxonomyPath, aliasesPath, similarityPath] = await Promise.all(
    GRAPH_ALLOWED_PRODUCTION_INPUTS.map(async (relPath) => resolveReadablePath(relPath)),
  )

  const [taxonomy, aliases, similarity] = await Promise.all([
    readJson<CompiledTaxonomy>(taxonomyPath!),
    readJson<CompiledAliases>(aliasesPath!),
    readJson<SimilarityGraph>(similarityPath!),
  ])

  return { taxonomy, aliases, similarity }
}
```

**Validation boundary pattern** (lines 213-224):
```typescript
// Step 3: Build graph
const graph = buildOlfactoryGraph(input)

// Step 4: Validate graph
const validationResult = validateOlfactoryGraph(graph)
if (!validationResult.ok) {
  console.error('Graph validation failed:')
  for (const err of validationResult.errors) {
    console.error(`  [${err.code}] ${err.path}: ${err.message}`)
  }
  return 1
}
```

**Apply to Phase 60:** switch the sanctioned CLI path to `validateSanctionedV211Graph(graph)`. Keep output formatting compatible unless tests intentionally add `invariant_id`/payload assertions. Do not add query proof execution to CLI.

---

### `src/tests/graph_read_model/contract.test.ts` (test, transform)

**Analog:** `src/tests/graph_read_model/contract.test.ts`

**Imports pattern** (lines 1-20):
```typescript
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  GRAPH_ALLOWED_PRODUCTION_INPUTS,
  GRAPH_EDGE_ENDPOINT_KINDS,
  GRAPH_EDGE_ID_FORMAT,
  GRAPH_EDGE_KINDS,
  GRAPH_EDGE_OPTIONAL_PROPERTIES,
  GRAPH_EDGE_REQUIRED_PROPERTIES,
  GRAPH_EXPECTED_BASELINE_STATS,
  GRAPH_FORBIDDEN_NODE_PREFIXES,
  GRAPH_ID_PREFIXES,
  GRAPH_NODE_KINDS,
  GRAPH_NODE_REQUIRED_PROPERTIES,
  GRAPH_OUTPUT_POLICY,
  GRAPH_PHASE_56_INVARIANTS,
  GRAPH_SCHEMA_VERSION,
  OLFACTORY_GRAPH_CONTRACT,
} from '../../graph_read_model/contract.js'
```

**Exact lock assertion pattern** (lines 25-63):
```typescript
describe('olfactory graph contract', () => {
  it('locks exact GCON-01 schema values', () => {
    expect(GRAPH_SCHEMA_VERSION).toBe('olfactory_graph_read_model.v1')
    expect(GRAPH_NODE_KINDS).toEqual(['family', 'subfamily', 'descriptor', 'alias'])
    expect(GRAPH_EDGE_KINDS).toEqual(['contains_subfamily', 'contains_descriptor', 'resolves_to', 'similar_to'])
    expect(GRAPH_EDGE_ID_FORMAT).toBe('edge:<edge_kind>:<source_graph_id>-><target_graph_id>')
```

**Source drift assertion pattern** (lines 131-141):
```typescript
it('keeps the Phase 55 contract source free from builder and runtime identifiers', async () => {
  const source = await readFile(contractSourcePath, 'utf8')

  expect(source).not.toMatch(/buildGraph|loadGraph|writeGraph|validateGraph/)
  expect(source).not.toMatch(/createReadStream|readFile\(|writeFile\(/)
  expect(source).not.toMatch(/from 'node:fs'|from "node:fs"/)
  expect(source).not.toContain('graphify-out/GRAPH_REPORT')
  expect(source).not.toContain('neo4j-driver')
  expect(source).not.toContain('GraphDatabase')
  expect(source).not.toContain('driver.session')
})
```

**Apply to Phase 60:** expand exact-lock tests for new error code vocabulary, invariant IDs, code-to-invariant mapping and sanctioned v2.11 profile. Keep static-source drift assertions.

---

### `src/tests/graph_read_model/graph_id.test.ts` (test, transform)

**Analog:** `src/tests/graph_read_model/build_graph.test.ts` and `src/tests/graph_read_model/query_graph.test.ts`

**Builder ID expectation pattern** (`build_graph.test.ts` lines 84-126):
```typescript
const graph = buildOlfactoryGraph(makeMinimalInput())

expect(graph.nodes.find(node => node.id === 'family:citrus')).toMatchObject({
  kind: 'family',
  properties: { family_id: 'citrus', name: 'Citrus' },
})
expect(graph.nodes.find(node => node.id === 'subfamily:bright_citrus')).toMatchObject({
  kind: 'subfamily',
  properties: { subfamily_id: 'bright_citrus', family_id: 'citrus', name: 'Bright Citrus' },
})
expect(graph.edges.find(edge => edge.id === 'edge:contains_subfamily:family:citrus->subfamily:bright_citrus')).toBeDefined()
```

**Determinism assertion pattern** (`build_graph.test.ts` lines 136-145):
```typescript
const input = makeMinimalInput()
const first = buildOlfactoryGraph(input)
const second = buildOlfactoryGraph(input)

expect(first.nodes).toEqual(second.nodes)
expect(first.edges).toEqual(second.edges)
expect(first.stats).toEqual(second.stats)
expect(JSON.stringify(first)).toBe(JSON.stringify(second))
```

**Query proof ID expectation pattern** (`query_graph.test.ts` lines 300-308):
```typescript
expect(proof).toEqual({
  query_kind: 'descriptor_to_family_path',
  params: { descriptor_id: 'cedarwood' },
  result: { family_id: 'woody', subfamily_id: 'woody_dry' },
  path: [
    { graph_id: 'descriptor:cedarwood', kind: 'descriptor' },
    { graph_id: 'subfamily:woody_dry', kind: 'subfamily', name: 'Dry Woods' },
    { graph_id: 'family:woody', kind: 'family', name: 'Woody' },
  ],
})
```

**Apply to Phase 60:** create focused unit tests for all required `graph_id.ts` makers, guards, `stripGraphIdPrefix` and `parseGraphId` success/failure variants. Assert exact JSON-safe failure payloads and no throwing.

---

### `src/tests/graph_read_model/validate_graph.test.ts` (test, transform)

**Analog:** `src/tests/graph_read_model/validate_graph.test.ts`

**Imports and fixture pattern** (lines 1-11):
```typescript
import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import { GRAPH_EXPECTED_BASELINE_STATS } from '../../graph_read_model/contract.js'
import type { GraphEdge, GraphNode, GraphStats, OlfactoryGraph } from '../../graph_read_model/types.js'
import { validateOlfactoryGraph } from '../../graph_read_model/validate_graph.js'
import type { CompiledAliases } from '../../compiler/types.js'
import type { CompiledTaxonomy } from '../../types/taxonomy.js'
import type { SimilarityGraph } from '../../types/similarity.js'
import type { BuildOlfactoryGraphInput } from '../../graph_read_model/types.js'
```

**Mutable clone fixture pattern** (lines 93-108):
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

**Reusable error assertion pattern** (lines 110-117):
```typescript
const expectError = (
  result: ReturnType<typeof validateOlfactoryGraph>,
  code: string,
  path: string,
): void => {
  expect(result.ok).toBe(false)
  expect(result.errors.some(error => error.code === code && error.path === path)).toBe(true)
}
```

**No-throw invalid input pattern** (lines 264-283):
```typescript
it('reports wrong_endpoint_kinds for unknown edge kind without throwing', () => {
  const graph = cloneGraph(makeValidGraph())

  graph.edges = [
    ...graph.edges,
    {
      id: 'edge:unknown:family:citrus->subfamily:bright_citrus',
      kind: 'unknown_kind' as GraphEdge['kind'],
      source: 'family:citrus',
      target: 'subfamily:bright_citrus',
      properties: {},
    },
  ]

  expect(() => validateOlfactoryGraph(graph)).not.toThrow()
  expectError(
    validateOlfactoryGraph(graph),
    'wrong_endpoint_kinds',
    '$.edges[5].kind',
  )
})
```

**Apply to Phase 60:** expand tests for `invariant_id`, `expected`, `actual`, JSON-safe payloads, structural/profile separation, profile short-circuiting and sanctioned baseline mismatch. Keep current legacy codes green where possible.

---

### `src/tests/graph_read_model/live_artifact_baseline.test.ts` (test, file-I/O)

**Analog:** `src/tests/graph_read_model/live_artifact_baseline.test.ts`

**Live artifact path pattern** (lines 15-27):
```typescript
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const compiledPaths = {
  taxonomy: path.join(repoRoot, 'data/compiled/v2/taxonomy.json'),
  aliases: path.join(repoRoot, 'data/compiled/v2/descriptor_aliases.json'),
  similarity: path.join(repoRoot, 'data/compiled/v2/similarity_matrix.json'),
} as const

const productionModulePaths = {
  buildGraph: path.join(repoRoot, 'src/graph_read_model/build_graph.ts'),
  validateGraph: path.join(repoRoot, 'src/graph_read_model/validate_graph.ts'),
  queryGraph: path.join(repoRoot, 'src/graph_read_model/query_graph.ts'),
} as const
```

**Sanctioned input + validation pattern** (lines 33-56):
```typescript
it('builds and validates the protected 10/18/341/18/13 graph from sanctioned artifacts only', async () => {
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
  const validation = validateOlfactoryGraph(graph)

  expect(validation).toEqual({
    ok: true,
    errors: [],
    warnings: [],
  })

  expect(graph.stats).toEqual(GRAPH_EXPECTED_BASELINE_STATS)
```

**Source drift assertion pattern** (lines 93-106):
```typescript
const [buildSource, validateSource, querySource] = await Promise.all([
  readFile(productionModulePaths.buildGraph, 'utf8'),
  readFile(productionModulePaths.validateGraph, 'utf8'),
  readFile(productionModulePaths.queryGraph, 'utf8'),
])

for (const source of [buildSource, validateSource, querySource]) {
  expect(source).not.toMatch(/from 'node:fs'|from "node:fs"|from 'node:fs\/promises'|from "node:fs\/promises"/)
  expect(source).not.toMatch(/readFile\(|writeFile\(|createReadStream\(/)
  expect(source).not.toContain('graphify-out/')
  expect(source).not.toContain('data/enriched_materials.json')
}
```

**Apply to Phase 60:** migrate the live validation call to `validateSanctionedV211Graph(graph)` and add drift checks that builder/query use `graph_id.ts` rather than local ID templates/regex stripping.

---

### `src/tests/graph_read_model/query_live_baseline.test.ts` (test, file-I/O/request-response)

**Analog:** `src/tests/graph_read_model/query_live_baseline.test.ts`

**Live artifact loading pattern:** use the sanctioned v2.11 graph artifact as read-only input and assert query proof behavior against stable baseline data. Keep the test outside graph generation and do not mutate `data/read-models/**`, `data/compiled/**`, or `graphify-out/**`.

**Proof envelope compatibility pattern:** assert current successful query proofs keep the existing envelope fields `{ query_kind, params, result, path }` and do not gain Phase 61 fail-closed error wrapper fields during Phase 60.

**Apply to Phase 60:** extend or reuse this file in plan 06 to prove query compatibility after `query_graph.ts` migrates to `graph_id.ts`. The test should confirm successful proof shapes remain stable and should not assert invalid/unvalidated graph rejection, because that is Phase 61 scope.

---

### `src/tests/cli/graph_read_model.test.ts` (test, file-I/O)

**Analog:** `src/tests/cli/graph_read_model.test.ts`

**CLI test imports pattern** (lines 1-5):
```typescript
import { rm } from 'node:fs/promises'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { parseGraphBuildArgs, printHelp, runGraphBuildCli } from '../../cli/graph_read_model.js'
import { GRAPH_OUTPUT_POLICY } from '../../graph_read_model/contract.js'
import type { OlfactoryGraph } from '../../graph_read_model/types.js'
```

**Spy setup pattern** (lines 94-111):
```typescript
describe('--dry-run flag', () => {
  const dryRunOutputDir = '/tmp/graph-read-model-dry-run'
  const dryRunGraphPath = `${dryRunOutputDir}/graph.json`

  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(async () => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    await rm(dryRunOutputDir, { recursive: true, force: true })
  })
```

**JSON output parsing pattern** (lines 142-158):
```typescript
it('--dry-run --json produces JSON with graph_output field', async () => {
  await runGraphBuildCli(['--dry-run', '--json', '--skip-guardrails'])

  const jsonStr = consoleLogSpy.mock.calls.find(call => {
    try {
      JSON.parse(call[0] as string)
      return true
    } catch {
      return false
    }
  })?.[0] as string | undefined

  expect(jsonStr).toBeDefined()
  const parsed = JSON.parse(jsonStr!) as Record<string, unknown>
  expect(parsed).toHaveProperty('graph_output')
  expect(parsed.graph_output).toContain('graph-read-model-dry-run')
}, 60000)
```

**Apply to Phase 60:** verify the CLI still succeeds on sanctioned dry-run after switching to `validateSanctionedV211Graph`. Add failure-output expectations only for sanctioned validation failures if the implementation exposes a test seam.

---

### `docs/olfactory_graph_read_model.md` (docs, transform)

**Analog:** `docs/olfactory_graph_read_model.md`

**Operational boundary pattern** (lines 1-18):
```markdown
# Guia operacional do read model olfativo v2.11

> ⚠️ **Read model derivado — não é publicação oficial da taxonomia**
>
> `data/read-models/olfactory-graph/v2.11/graph.json` é um read model derivado para consulta, documentação e consumo futuro por agentes/RAG. Ele não é um artefato oficial de publicação da taxonomia compilada, não promove nenhuma verdade curatorial nova e não substitui nem altera `data/compiled/v2/*`. A verdade operacional da Layer 1 continua nos artefatos compilados protegidos e nas fontes curatoriais já existentes.

Este guia é a referência operacional para mantenedores que precisam entender como o grafo olfativo v2.11 é gerado, validado e usado como evidência estática.
```

**CLI workflow docs pattern** (lines 102-118):
```markdown
## 4. Workflow do operador: `graph:build`

O comando documentado para o mantenedor é:

```bash
npm --prefix src run graph:build
```

O help da CLI (`src/cli/graph_read_model.ts`) descreve o fluxo oficial:

1. Carregar os inputs compilados v2 (`taxonomy`, `aliases`, `similarity`).
2. Construir o `OlfactoryGraph` em memória.
3. Validar a estrutura do grafo.
```

**Baseline docs pattern** (lines 166-176):
```markdown
## 6. Linha de base `GRAPH_EXPECTED_BASELINE_STATS`

Os números abaixo vêm de `GRAPH_EXPECTED_BASELINE_STATS` em `src/graph_read_model/contract.ts` e são confirmados por regressão em `src/tests/graph_read_model/live_artifact_baseline.test.ts`.

| Métrica | Valor esperado | Campo em `GRAPH_EXPECTED_BASELINE_STATS` | Teste de regressão | O que prova |
|---------|----------------|------------------------------------------|--------------------|-------------|
| Famílias | `10` | `families` | `live_artifact_baseline.test.ts` | O grafo preserva a contagem de famílias do baseline v2 protegido. |
```

**Apply to Phase 60:** update language from generic structural validation to sanctioned v2.11 wrapper/profile where discussing `graph:build` and live regression. Do not document Phase 61 fail-closed proof behavior as delivered.

## Shared Patterns

### Contract-First Constants

**Source:** `src/graph_read_model/contract.ts`
**Apply to:** `contract.ts`, `types.ts`, `graph_id.ts`, `validate_graph.ts`, tests

Use static `as const` exports and derive unions from them. Keep `contract.ts` import-free and free of builder/validator/runtime code.

### Functional Graph Utilities

**Source:** `src/graph_read_model/build_graph.ts`, `src/graph_read_model/query_graph.ts`, `src/graph_read_model/validate_graph.ts`
**Apply to:** all graph read-model modules

Modules use pure functions, readonly types, local helpers, deterministic sorting/result composition and no filesystem access in build/validate/query surfaces.

### Deterministic Validation Errors

**Source:** `src/graph_read_model/types.ts`, `src/graph_read_model/validate_graph.ts`
**Apply to:** `types.ts`, `validate_graph.ts`

Current pattern is `makeGraphError(code, path, message, options)` with normalized JSONPath and optional IDs. Phase 60 should extend this through typed factories that preserve observable codes and add JSON-safe `expected`/`actual`.

### Sanctioned Baseline

**Source:** `src/graph_read_model/contract.ts`, `src/tests/graph_read_model/live_artifact_baseline.test.ts`
**Apply to:** `contract.ts`, `validate_graph.ts`, CLI, live regression tests, docs

The v2.11 sanctioned baseline is `10/18/341/18/13`, currently in `GRAPH_EXPECTED_BASELINE_STATS`. Phase 60 should move baseline enforcement into `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE` and `validateSanctionedV211Graph`.

### Test Style

**Source:** `src/tests/graph_read_model/*.test.ts`, `src/tests/cli/graph_read_model.test.ts`
**Apply to:** all Phase 60 tests

Use Vitest `describe/it/expect`, exact object equality for contracts/results, fixture builders for graph data, no watch mode, and `TMPDIR=/tmp` for targeted commands in this environment.

## No Analog Found

No file lacks a close codebase analog. The only new files are:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/graph_read_model/graph_id.ts` | utility | transform | New central boundary, but local ID helper patterns already exist in builder/query. |
| `src/graph_read_model/validation_errors.ts` | utility/factory | transform | New central factory module, but existing `makeGraphError` and validator call sites provide the local factory/error pattern. |
| `src/tests/graph_read_model/graph_id.test.ts` | test | transform | New test file, but exact ID assertions already exist in builder/query tests. |

## Scope Fence

Phase 60 should only prepare stable surfaces for Phase 61:

- central contract constants, validation vocabularies and sanctioned profile;
- central graph ID construction/parsing/guards;
- typed validation factories and JSON-safe payloads;
- structural/profile/sanctioned validation split;
- migration of builder, validator, query helper usage and CLI sanctioned validation call;
- drift, baseline and compatibility tests.

Do not plan or recommend the complete Phase 61 proof-generation fail-closed block, and do not change current successful query proof envelopes.

## Metadata

**Analog search scope:** `src/graph_read_model`, `src/cli`, `src/tests/graph_read_model`, `src/tests/cli`, `docs`, `graphify-out/GRAPH_REPORT.md`
**Files scanned:** 13 source/test/doc files plus Phase 60 context/research/validation artifacts
**Project instruction status:** no on-disk `AGENTS.md`; prompt-provided instruction requires pt-BR responses
**Project skills checked:** local `.codex/skills` and `.agents/skills` directories listed; `gsd-plan-phase` index and `.agents/rules/graphify.md` read
**Pattern extraction date:** 2026-06-16
