import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
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
      subfamily_count: 1,
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

describe('buildOlfactoryGraph', () => {
  it('builds all four node kinds and all four edge kinds from minimal fixtures', () => {
    const graph = buildOlfactoryGraph(makeMinimalInput())

    expect(graph.schema_version).toBe('olfactory_graph_read_model.v1')
    expect(graph.nodes.map(node => node.kind)).toEqual(
      expect.arrayContaining(['family', 'subfamily', 'descriptor', 'alias']),
    )
    expect(graph.edges.map(edge => edge.kind)).toEqual(
      expect.arrayContaining(['contains_subfamily', 'contains_descriptor', 'resolves_to', 'similar_to']),
    )

    expect(graph.nodes.find(node => node.id === 'family:citrus')).toMatchObject({
      kind: 'family',
      properties: { family_id: 'citrus', name: 'Citrus' },
    })
    expect(graph.nodes.find(node => node.id === 'subfamily:bright_citrus')).toMatchObject({
      kind: 'subfamily',
      properties: { subfamily_id: 'bright_citrus', family_id: 'citrus', name: 'Bright Citrus' },
    })
    expect(graph.nodes.find(node => node.id === 'descriptor:lemon')).toMatchObject({
      kind: 'descriptor',
      properties: {
        descriptor_id: 'lemon',
        family_id: 'citrus',
        subfamily_id: 'bright_citrus',
        source: 'seed',
        frequency: 12,
        status: 'curated',
        review_required: false,
        corpus_derived: false,
      },
    })
    expect(graph.nodes.find(node => node.id === 'alias:lemon zest')).toMatchObject({
      kind: 'alias',
      properties: { alias: 'lemon zest', target_descriptor_id: 'lemon' },
    })

    expect(graph.edges.find(edge => edge.id === 'edge:contains_subfamily:family:citrus->subfamily:bright_citrus')).toBeDefined()
    expect(graph.edges.find(edge => edge.id === 'edge:contains_descriptor:subfamily:bright_citrus->descriptor:lemon')).toBeDefined()
    expect(graph.edges.find(edge => edge.id === 'edge:resolves_to:alias:lemon zest->descriptor:lemon')).toBeDefined()
    expect(graph.edges.find(edge => edge.id === 'edge:similar_to:subfamily:bright_citrus->subfamily:fresh_floral')).toBeDefined()

    expect(graph.stats).toEqual({
      families: 1,
      subfamilies: 1,
      descriptors: 1,
      aliases: 1,
      subfamily_similarity_edges: 1,
    })
  })

  it('returns deep-equal graphs and JSON serialization across repeated builds', () => {
    const input = makeMinimalInput()
    const first = buildOlfactoryGraph(input)
    const second = buildOlfactoryGraph(input)

    expect(first.nodes).toEqual(second.nodes)
    expect(first.edges).toEqual(second.edges)
    expect(first.stats).toEqual(second.stats)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))
  })

  it('sorts nodes by kind then id, edges by kind/source/target/id, and preserves similarity properties', () => {
    const graph = buildOlfactoryGraph(makeMinimalInput())

    const nodeSortKeys = graph.nodes.map(node => `${node.kind}|${node.id}`)
    expect(nodeSortKeys).toEqual([...nodeSortKeys].sort((left, right) => left.localeCompare(right)))

    const edgeSortKeys = graph.edges.map(edge => `${edge.kind}|${edge.source}|${edge.target}|${edge.id}`)
    expect(edgeSortKeys).toEqual([...edgeSortKeys].sort((left, right) => left.localeCompare(right)))

    const similarityEdge = graph.edges.find(edge => edge.kind === 'similar_to')
    expect(similarityEdge).toBeDefined()
    expect(similarityEdge?.properties).toEqual({
      source_subfamily_id: 'bright_citrus',
      target_subfamily_id: 'fresh_floral',
      score: 0.42,
      final_score: 0.42,
      dimensions: {
        semantic_overlap: 0.42,
      },
      evidence: {
        shared_descriptors: ['sparkling'],
        cooccurrence_support: 3,
      },
    })

    for (const node of graph.nodes) {
      if (node.kind === 'family') expect(node.id).toMatch(/^family:/)
      if (node.kind === 'subfamily') expect(node.id).toMatch(/^subfamily:/)
      if (node.kind === 'descriptor') expect(node.id).toMatch(/^descriptor:/)
      if (node.kind === 'alias') expect(node.id).toMatch(/^alias:/)
    }
  })
})
