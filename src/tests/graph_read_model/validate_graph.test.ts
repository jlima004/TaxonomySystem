import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import { GRAPH_EXPECTED_BASELINE_STATS } from '../../graph_read_model/contract.js'
import type { GraphEdge, GraphNode, GraphStats, OlfactoryGraph } from '../../graph_read_model/types.js'
import {
  makeDuplicateEdgeIdError,
  makeDuplicateNodeIdError,
  makeGraphNotValidatedError,
  makeInconsistentStatsError,
  makeInvalidAliasTargetError,
  makeInvalidGraphIdError,
  makeInvalidSchemaVersionError,
  makeInvalidSimilarityEndpointError,
  makeMissingEdgeEndpointError,
  makeProfileBaselineMismatchError,
  makeWrongEndpointKindError,
} from '../../graph_read_model/validation_errors.js'
import { validateOlfactoryGraph } from '../../graph_read_model/validate_graph.js'
import type { CompiledAliases } from '../../compiler/types.js'
import type { CompiledTaxonomy } from '../../types/taxonomy.js'
import type { SimilarityGraph } from '../../types/similarity.js'
import type { BuildOlfactoryGraphInput, JsonValue } from '../../graph_read_model/types.js'

const makeMinimalInput = (): BuildOlfactoryGraphInput => {
  const taxonomy: CompiledTaxonomy = {
    version: '1.0.0',
    generated_at: '2026-01-01T00:00:00.000Z',
    stats: {
      family_count: 1,
      subfamily_count: 2,
      descriptor_count: 1,
    },
    families: [
      {
        id: 'citrus',
        name: 'Citrus',
        subfamilies: [
          {
            id: 'bright_citrus',
            name: 'Bright Citrus',
            family_id: 'citrus',
            descriptors: [
              {
                id: 'lemon',
                source: 'seed',
                frequency: 12,
                status: 'curated',
                review_required: false,
                corpus_derived: false,
              },
            ],
          },
          {
            id: 'fresh_floral',
            name: 'Fresh Floral',
            family_id: 'citrus',
            descriptors: [],
          },
        ],
      },
    ],
  }

  const aliases: CompiledAliases = {
    version: '1.0.0',
    schema_version: '1.0.0',
    generated_at: '2026-01-01T00:00:00.000Z',
    aliases: {
      'lemon zest': 'lemon',
    },
  }

  const similarity: SimilarityGraph = {
    version: '1.0.0',
    generated_at: '2026-01-01T00:00:00.000Z',
    threshold: 0.25,
    dimensions: [
      { id: 'semantic_overlap', name: 'Semantic Overlap', weight: 0.4 },
    ],
    edges: [
      {
        source: 'bright_citrus',
        target: 'fresh_floral',
        score: 0.42,
        final_score: 0.42,
        dimensions: {
          semantic_overlap: 0.42,
        },
        evidence: {
          shared_descriptors: ['sparkling'],
          cooccurrence_support: 3,
        },
      },
    ],
    review_queue: [],
    stats: {
      subfamily_count: 2,
      edge_count: 1,
      density: 0.5,
    },
  }

  return { taxonomy, aliases, similarity }
}

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

const expectError = (
  result: ReturnType<typeof validateOlfactoryGraph>,
  code: string,
  path: string,
): void => {
  expect(result.ok).toBe(false)
  expect(result.errors.some(error => error.code === code && error.path === path)).toBe(true)
}

describe('validateOlfactoryGraph', () => {
  it('accepts a valid minimal graph with empty warnings', () => {
    const result = validateOlfactoryGraph(makeValidGraph())

    expect(result).toEqual({
      ok: true,
      errors: [],
      warnings: [],
    })
  })

  it('reports duplicate_node_id_detection with stable path', () => {
    const graph = cloneGraph(makeValidGraph())
    const duplicate = graph.nodes.find(node => node.id === 'family:citrus')
    expect(duplicate).toBeDefined()

    graph.nodes = [...graph.nodes, { ...duplicate!, id: duplicate!.id }]

    expectError(
      validateOlfactoryGraph(graph),
      'duplicate_node_id_detection',
      '$.nodes[5].id',
    )
  })

  it('reports duplicate_edge_id_detection with stable path', () => {
    const graph = cloneGraph(makeValidGraph())
    const duplicate = graph.edges.find(edge => edge.kind === 'contains_subfamily')
    expect(duplicate).toBeDefined()

    graph.edges = [...graph.edges, { ...duplicate!, id: duplicate!.id }]

    expectError(
      validateOlfactoryGraph(graph),
      'duplicate_edge_id_detection',
      '$.edges[5].id',
    )
  })

  it('reports missing_edge_endpoints for absent source and target nodes', () => {
    const graph = cloneGraph(makeValidGraph())

    graph.edges = [
      ...graph.edges,
      {
        id: 'edge:similar_to:subfamily:missing_a->subfamily:missing_b',
        kind: 'similar_to',
        source: 'subfamily:missing_a',
        target: 'subfamily:missing_b',
        properties: {
          source_subfamily_id: 'missing_a',
          target_subfamily_id: 'missing_b',
          score: 0.5,
          dimensions: { semantic_overlap: 0.5 },
          evidence: { shared_descriptors: [] },
        },
      },
    ]

    const result = validateOlfactoryGraph(graph)

    expectError(result, 'missing_edge_endpoints', '$.edges[5].source')
    expectError(result, 'missing_edge_endpoints', '$.edges[5].target')
  })

  it('reports wrong_endpoint_kinds when edge endpoints use unexpected node kinds', () => {
    const graph = cloneGraph(makeValidGraph())
    const familyNode = graph.nodes.find(node => node.kind === 'family')
    const descriptorNode = graph.nodes.find(node => node.kind === 'descriptor')
    expect(familyNode).toBeDefined()
    expect(descriptorNode).toBeDefined()

    graph.edges = [
      ...graph.edges,
      {
        id: `edge:contains_descriptor:${familyNode!.id}->${descriptorNode!.id}`,
        kind: 'contains_descriptor',
        source: familyNode!.id,
        target: descriptorNode!.id,
        properties: {
          subfamily_id: 'bright_citrus',
          descriptor_id: 'lemon',
        },
      },
    ]

    const result = validateOlfactoryGraph(graph)

    expectError(result, 'wrong_endpoint_kinds', '$.edges[5].source')
  })

  it('reports invalid_alias_targets when resolves_to does not target a descriptor', () => {
    const graph = cloneGraph(makeValidGraph())
    const aliasNode = graph.nodes.find(node => node.kind === 'alias')
    const familyNode = graph.nodes.find(node => node.kind === 'family')
    expect(aliasNode).toBeDefined()
    expect(familyNode).toBeDefined()

    const resolvesEdge = graph.edges.find(edge => edge.kind === 'resolves_to')
    expect(resolvesEdge).toBeDefined()

    graph.edges = graph.edges.map(edge =>
      edge.id === resolvesEdge!.id
        ? { ...edge, target: familyNode!.id }
        : edge,
    )

    expectError(
      validateOlfactoryGraph(graph),
      'invalid_alias_targets',
      '$.edges[3].target',
    )
  })

  it('reports invalid_subfamily_similarity_endpoints when similar_to uses non-subfamily nodes', () => {
    const graph = cloneGraph(makeValidGraph())
    const descriptorNode = graph.nodes.find(node => node.kind === 'descriptor')
    expect(descriptorNode).toBeDefined()

    graph.edges = graph.edges.map(edge =>
      edge.kind === 'similar_to'
        ? { ...edge, source: descriptorNode!.id }
        : edge,
    )

    expectError(
      validateOlfactoryGraph(graph),
      'invalid_subfamily_similarity_endpoints',
      '$.edges[4].source',
    )
  })

  it('reports invalid_schema_version when schema_version does not match contract', () => {
    const graph = cloneGraph(makeValidGraph())
    graph.schema_version = 'wrong_schema' as OlfactoryGraph['schema_version']

    const result = validateOlfactoryGraph(graph)

    expect(result.ok).toBe(false)
    expect(result.errors.some(
      error => error.code === 'invalid_schema_version' && error.path === '$.schema_version',
    )).toBe(true)
    expect(result.warnings).toEqual([])
  })

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

  it('reports inconsistent_stats when graph.stats diverges from array-derived counts', () => {
    const graph = cloneGraph(makeValidGraph())
    graph.stats = {
      ...graph.stats,
      families: graph.stats.families + 1,
    }

    expectError(
      validateOlfactoryGraph(graph),
      'inconsistent_stats',
      '$.stats.families',
    )
  })

  it('documents baseline stats keys used for live regression reconciliation', () => {
    expect(GRAPH_EXPECTED_BASELINE_STATS).toEqual({
      families: 10,
      subfamilies: 18,
      descriptors: 341,
      aliases: 18,
      subfamily_similarity_edges: 13,
    })
  })
})

const assertJsonSafeValue = (value: JsonValue): void => {
  if (value === null) return
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return
  }

  if (Array.isArray(value)) {
    value.forEach(assertJsonSafeValue)
    return
  }

  for (const [key, entry] of Object.entries(value)) {
    expect(key.toLowerCase()).not.toContain('stack')
    expect(entry).not.toBeUndefined()
    expect(typeof entry).not.toBe('function')
    expect(typeof entry).not.toBe('bigint')
    expect(entry instanceof Date).toBe(false)
    expect(entry instanceof Map).toBe(false)
    expect(entry instanceof Set).toBe(false)
    assertJsonSafeValue(entry)
  }
}

describe('validation error factories', () => {
  it('covers D-16 and D-17 with stable schema and duplicate-id factories', () => {
    expect(makeInvalidSchemaVersionError('wrong_schema')).toEqual({
      code: 'invalid_schema_version',
      path: '$.schema_version',
      message: 'expected olfactory_graph_read_model.v1, got wrong_schema',
      invariant_id: 'schema_version_match',
      expected: { schema_version: 'olfactory_graph_read_model.v1' },
      actual: { schema_version: 'wrong_schema' },
    })

    expect(makeDuplicateNodeIdError('$.nodes[5].id', 'family:citrus')).toEqual({
      code: 'duplicate_node_id_detection',
      path: '$.nodes[5].id',
      message: 'duplicate node id: family:citrus',
      invariant_id: 'duplicate_node_id_detection',
      node_id: 'family:citrus',
      expected: { unique_node_id: true },
      actual: { node_id: 'family:citrus' },
    })

    expect(makeDuplicateEdgeIdError('$.edges[5].id', 'edge:contains_subfamily:a->b')).toEqual({
      code: 'duplicate_edge_id_detection',
      path: '$.edges[5].id',
      message: 'duplicate edge id: edge:contains_subfamily:a->b',
      invariant_id: 'duplicate_edge_id_detection',
      edge_id: 'edge:contains_subfamily:a->b',
      expected: { unique_edge_id: true },
      actual: { edge_id: 'edge:contains_subfamily:a->b' },
    })
  })

  it('covers D-14 D-15 D-16 and D-17 with JSON-safe payloads and compatibility shape', () => {
    const errors = [
      makeMissingEdgeEndpointError('$.edges[5].source', 'edge:1', 'source', 'subfamily:missing_a'),
      makeWrongEndpointKindError('$.edges[5].source', 'edge:2', 'contains_descriptor', 'family', 'subfamily', 'family:citrus'),
      makeInvalidAliasTargetError('$.edges[3].target', 'edge:3', 'family:citrus'),
      makeInvalidSimilarityEndpointError('$.edges[4].target', 'edge:4', 'target', 'descriptor:lemon'),
      makeInconsistentStatsError('families', 11, 10),
      makeProfileBaselineMismatchError('descriptors', 340, 341),
      makeInvalidGraphIdError('$.nodes[0].id', 'material:cedar', { allowed_prefixes: ['family:', 'subfamily:', 'descriptor:', 'alias:'] }),
      makeGraphNotValidatedError('sanctioned wrapper not called'),
    ]

    expect(errors[0]).toEqual({
      code: 'missing_edge_endpoints',
      path: '$.edges[5].source',
      message: 'missing edge source node: subfamily:missing_a',
      invariant_id: 'missing_edge_endpoints',
      edge_id: 'edge:1',
      expected: { endpoint: 'source', existing_node: true },
      actual: { endpoint: 'source', graph_id: 'subfamily:missing_a' },
    })

    expect(errors[6]).toEqual({
      code: 'invalid_graph_id',
      path: '$.nodes[0].id',
      message: 'graph_id is invalid: material:cedar',
      invariant_id: 'graph_id_parse',
      expected: { allowed_prefixes: ['family:', 'subfamily:', 'descriptor:', 'alias:'] },
      actual: { graph_id: 'material:cedar' },
    })

    expect(errors[7]).toEqual({
      code: 'graph_not_validated',
      path: '$',
      message: 'graph must be validated before query consumption: sanctioned wrapper not called',
      invariant_id: 'graph_validation_required',
      expected: { validated_graph: true },
      actual: { reason: 'sanctioned wrapper not called' },
    })

    for (const error of errors) {
      expect(error.code).toBeTruthy()
      expect(error.path).toBeTruthy()
      expect(error.message).toBeTruthy()
      expect(JSON.parse(JSON.stringify(error))).toEqual(error)
      if (error.expected !== undefined) assertJsonSafeValue(error.expected)
      if (error.actual !== undefined) assertJsonSafeValue(error.actual)
    }
  })
})
