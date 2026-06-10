import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import { GRAPH_EXPECTED_BASELINE_STATS } from '../../graph_read_model/contract.js'
import type { GraphEdge, GraphNode, GraphStats, OlfactoryGraph } from '../../graph_read_model/types.js'
import { validateOlfactoryGraph } from '../../graph_read_model/validate_graph.js'
import type { CompiledAliases } from '../../compiler/types.js'
import type { CompiledTaxonomy } from '../../types/taxonomy.js'
import type { SimilarityGraph } from '../../types/similarity.js'
import type { BuildOlfactoryGraphInput } from '../../graph_read_model/types.js'

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
