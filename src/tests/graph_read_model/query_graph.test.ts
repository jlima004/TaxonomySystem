import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import {
  getCrossFamilyBridges,
  getDescriptorToFamilyPath,
  getDescriptorsByFamily,
  getDescriptorsBySubfamily,
  getRelatedDescriptors,
  getSimilarityHub,
  getSimilarityNeighborhood,
  resolveAliasPath,
} from '../../graph_read_model/query_graph.js'
import type { DescriptorProofItem } from '../../graph_read_model/types.js'
import { validateOlfactoryGraph } from '../../graph_read_model/validate_graph.js'
import type { CompiledAliases } from '../../compiler/types.js'
import type { CompiledTaxonomy } from '../../types/taxonomy.js'
import type { SimilarityGraph } from '../../types/similarity.js'
import type { BuildOlfactoryGraphInput } from '../../graph_read_model/types.js'

const woodyDryDescriptors = [
  { id: 'agarwood', source: 'seed' as const, frequency: 5, status: 'curated' as const, review_required: false, corpus_derived: false },
  { id: 'cedarwood', source: 'seed' as const, frequency: 90, status: 'curated' as const, review_required: false, corpus_derived: false },
  { id: 'patchouli', source: 'seed' as const, frequency: 36, status: 'curated' as const, review_required: false, corpus_derived: false },
  { id: 'rosewood', source: 'seed' as const, frequency: 33, status: 'curated' as const, review_required: false, corpus_derived: false },
  { id: 'sandalwood', source: 'seed' as const, frequency: 53, status: 'curated' as const, review_required: false, corpus_derived: false },
  { id: 'vetiver', source: 'seed' as const, frequency: 47, status: 'curated' as const, review_required: false, corpus_derived: false },
  { id: 'camphoreous', source: 'corpus' as const, frequency: 233, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'cashew', source: 'corpus' as const, frequency: 7, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'copaiba', source: 'corpus' as const, frequency: 8, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'coriander', source: 'corpus' as const, frequency: 18, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'earthy', source: 'corpus' as const, frequency: 367, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'pine', source: 'corpus' as const, frequency: 120, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'rooty', source: 'corpus' as const, frequency: 54, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'sawdust', source: 'corpus' as const, frequency: 14, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'thujonic', source: 'corpus' as const, frequency: 42, status: 'candidate' as const, review_required: true, corpus_derived: true },
  { id: 'woody', source: 'corpus' as const, frequency: 1329, status: 'candidate' as const, review_required: true, corpus_derived: true },
]

const woodyMossyDescriptors = [
  { id: 'oakmoss', source: 'seed' as const, frequency: 21, status: 'curated' as const, review_required: false, corpus_derived: false },
  { id: 'tree_moss', source: 'seed' as const, frequency: 0, status: 'curated' as const, review_required: false, corpus_derived: false },
]

const toDescriptorProofItem = (
  descriptor: (typeof woodyDryDescriptors)[number] | (typeof woodyMossyDescriptors)[number],
  subfamilyId: string,
): DescriptorProofItem => ({
  id: descriptor.id,
  graph_id: `descriptor:${descriptor.id}`,
  status: descriptor.status,
  review_required: descriptor.review_required,
  corpus_derived: descriptor.corpus_derived,
  source: descriptor.source,
})

const woodyFamilyDescriptors: readonly DescriptorProofItem[] = [
  ...woodyDryDescriptors.map(descriptor => toDescriptorProofItem(descriptor, 'woody_dry')),
  ...woodyMossyDescriptors.map(descriptor => toDescriptorProofItem(descriptor, 'woody_mossy')),
].sort((left, right) => left.id.localeCompare(right.id))

const woodyDryProofItems = woodyDryDescriptors
  .map(descriptor => toDescriptorProofItem(descriptor, 'woody_dry'))
  .sort((left, right) => left.id.localeCompare(right.id))

const cedarwoodRelatedDescriptors = woodyDryProofItems.filter(item => item.id !== 'cedarwood')

const floralRoseDescriptors = [
  { id: 'rose', source: 'seed' as const, frequency: 100, status: 'curated' as const, review_required: false, corpus_derived: false },
]

const floralWhiteDescriptors = [
  { id: 'jasmine', source: 'seed' as const, frequency: 80, status: 'curated' as const, review_required: false, corpus_derived: false },
]

const inlineSimilarityEdges: SimilarityGraph['edges'] = [
  {
    source: 'floral_rose',
    target: 'woody_dry',
    final_score: 0.3055555555555556,
    score: 0.3055555555555556,
    dimensions: {
      semantic_overlap: 0,
      tradition: 0.65,
      accord_compatibility: 0.75,
    },
    evidence: {
      cooccurrence_support: 21,
      curated_relation: 'cross_family_tradition_bridge',
      accord_reference: 'strong_accord_pair',
    },
  },
  {
    source: 'floral_rose',
    target: 'woody_mossy',
    final_score: 0.2972222222222222,
    score: 0.2972222222222222,
    dimensions: {
      semantic_overlap: 0,
      tradition: 0.65,
      accord_compatibility: 0.7,
    },
    evidence: {
      curated_relation: 'cross_family_tradition_bridge',
      accord_reference: 'compatible_accord_pair',
    },
  },
  {
    source: 'floral_rose',
    target: 'floral_white',
    final_score: 0.2833333333333333,
    score: 0.2833333333333333,
    dimensions: {
      semantic_overlap: 0,
      tradition: 0.85,
    },
    evidence: {
      cooccurrence_support: 25,
      curated_relation: 'same_family_tradition',
    },
  },
]

const makeWoodyBaselineInput = (): BuildOlfactoryGraphInput => {
  const taxonomy: CompiledTaxonomy = {
    version: '1.0.0',
    generated_at: '2026-01-01T00:00:00.000Z',
    stats: {
      family_count: 2,
      subfamily_count: 4,
      descriptor_count: 20,
    },
    families: [
      {
        id: 'floral',
        name: 'Floral',
        subfamilies: [
          {
            id: 'floral_rose',
            name: 'Rose Florals',
            family_id: 'floral',
            descriptors: floralRoseDescriptors,
          },
          {
            id: 'floral_white',
            name: 'White Florals',
            family_id: 'floral',
            descriptors: floralWhiteDescriptors,
          },
        ],
      },
      {
        id: 'woody',
        name: 'Woody',
        subfamilies: [
          {
            id: 'woody_dry',
            name: 'Dry Woods',
            family_id: 'woody',
            descriptors: woodyDryDescriptors,
          },
          {
            id: 'woody_mossy',
            name: 'Mossy Woods',
            family_id: 'woody',
            descriptors: woodyMossyDescriptors,
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
      cedar: 'cedarwood',
    },
  }

  const similarity: SimilarityGraph = {
    version: '1.0.0',
    generated_at: '2026-01-01T00:00:00.000Z',
    threshold: 0.25,
    dimensions: [
      { id: 'semantic_overlap', name: 'Semantic Overlap', weight: 0.4 },
      { id: 'tradition', name: 'Tradition', weight: 0.35 },
      { id: 'accord_compatibility', name: 'Accord Compatibility', weight: 0.25 },
    ],
    edges: inlineSimilarityEdges,
    review_queue: [],
    stats: {
      subfamily_count: 4,
      edge_count: 3,
      density: 0.25,
    },
  }

  return { taxonomy, aliases, similarity }
}

const buildValidatedWoodyGraph = () => {
  const graph = buildOlfactoryGraph(makeWoodyBaselineInput())
  const validation = validateOlfactoryGraph(graph)
  expect(validation.ok).toBe(true)
  return graph
}

describe('getDescriptorsByFamily', () => {
  it('returns 18 woody descriptors with GQRY metadata sorted by id', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = getDescriptorsByFamily(graph, 'woody')

    expect(proof).toEqual({
      query_kind: 'descriptors_by_family',
      params: { family_id: 'woody' },
      result: { descriptors: woodyFamilyDescriptors },
    })
    expect(proof.result.descriptors).toHaveLength(18)
  })

  it('returns deep-equal proofs across repeated calls', () => {
    const graph = buildValidatedWoodyGraph()
    const first = getDescriptorsByFamily(graph, 'woody')
    const second = getDescriptorsByFamily(graph, 'woody')

    expect(first).toEqual(second)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))
  })
})

describe('getDescriptorsBySubfamily', () => {
  it('returns woody_dry descriptors with GQRY metadata sorted by id', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = getDescriptorsBySubfamily(graph, 'woody_dry')

    expect(proof).toEqual({
      query_kind: 'descriptors_by_subfamily',
      params: { subfamily_id: 'woody_dry' },
      result: { descriptors: woodyDryProofItems },
    })
    expect(proof.result.descriptors).toHaveLength(16)
  })

  it('returns deep-equal proofs across repeated calls', () => {
    const graph = buildValidatedWoodyGraph()
    const first = getDescriptorsBySubfamily(graph, 'woody_dry')
    const second = getDescriptorsBySubfamily(graph, 'woody_dry')

    expect(first).toEqual(second)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))
  })
})

describe('resolveAliasPath', () => {
  it('resolves cedar alias to cedarwood with four-segment path', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = resolveAliasPath(graph, 'cedar')

    expect(proof).toEqual({
      query_kind: 'alias_resolution_path',
      params: { alias: 'cedar' },
      result: { target_descriptor_id: 'cedarwood' },
      path: [
        { graph_id: 'alias:cedar', kind: 'alias' },
        { graph_id: 'descriptor:cedarwood', kind: 'descriptor' },
        { graph_id: 'subfamily:woody_dry', kind: 'subfamily', name: 'Dry Woods' },
        { graph_id: 'family:woody', kind: 'family', name: 'Woody' },
      ],
    })
  })

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

  it('returns deep-equal proofs across repeated calls', () => {
    const graph = buildValidatedWoodyGraph()
    const first = resolveAliasPath(graph, 'cedar')
    const second = resolveAliasPath(graph, 'cedar')

    expect(first).toEqual(second)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))
  })
})

describe('getDescriptorToFamilyPath', () => {
  it('returns cedarwood descriptor-to-family path with names', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = getDescriptorToFamilyPath(graph, 'cedarwood')

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
  })

  it('returns deep-equal proofs across repeated calls', () => {
    const graph = buildValidatedWoodyGraph()
    const first = getDescriptorToFamilyPath(graph, 'cedarwood')
    const second = getDescriptorToFamilyPath(graph, 'cedarwood')

    expect(first).toEqual(second)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))
  })
})

describe('getRelatedDescriptors', () => {
  it('returns same-subfamily descriptors excluding cedarwood', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = getRelatedDescriptors(graph, 'cedarwood')

    expect(proof).toEqual({
      query_kind: 'related_descriptors',
      params: { descriptor_id: 'cedarwood' },
      result: { descriptors: cedarwoodRelatedDescriptors },
    })
    expect(proof.result.descriptors).toHaveLength(15)
    expect(proof.path).toBeUndefined()
  })

  it('returns deep-equal proofs across repeated calls', () => {
    const graph = buildValidatedWoodyGraph()
    const first = getRelatedDescriptors(graph, 'cedarwood')
    const second = getRelatedDescriptors(graph, 'cedarwood')

    expect(first).toEqual(second)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))
  })
})

describe('getSimilarityNeighborhood', () => {
  it('returns bidirectional score-sorted neighbors for floral_rose', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = getSimilarityNeighborhood(graph, 'floral_rose')

    expect(proof).toEqual({
      query_kind: 'similarity_neighborhood',
      params: { subfamily_id: 'floral_rose' },
      result: {
        neighbors: [
          {
            neighbor_id: 'woody_dry',
            neighbor_graph_id: 'subfamily:woody_dry',
            score: 0.3055555555555556,
            final_score: 0.3055555555555556,
            dimensions: {
              semantic_overlap: 0,
              tradition: 0.65,
              accord_compatibility: 0.75,
            },
            evidence: {
              cooccurrence_support: 21,
              curated_relation: 'cross_family_tradition_bridge',
              accord_reference: 'strong_accord_pair',
            },
            direction: 'outbound',
          },
          {
            neighbor_id: 'woody_mossy',
            neighbor_graph_id: 'subfamily:woody_mossy',
            score: 0.2972222222222222,
            final_score: 0.2972222222222222,
            dimensions: {
              semantic_overlap: 0,
              tradition: 0.65,
              accord_compatibility: 0.7,
            },
            evidence: {
              curated_relation: 'cross_family_tradition_bridge',
              accord_reference: 'compatible_accord_pair',
            },
            direction: 'outbound',
          },
          {
            neighbor_id: 'floral_white',
            neighbor_graph_id: 'subfamily:floral_white',
            score: 0.2833333333333333,
            final_score: 0.2833333333333333,
            dimensions: {
              semantic_overlap: 0,
              tradition: 0.85,
            },
            evidence: {
              cooccurrence_support: 25,
              curated_relation: 'same_family_tradition',
            },
            direction: 'outbound',
          },
        ],
      },
    })
    expect(proof.path).toBeUndefined()
  })

  it('includes inbound neighbors for woody_dry', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = getSimilarityNeighborhood(graph, 'woody_dry')

    expect(proof.result.neighbors).toEqual([
      {
        neighbor_id: 'floral_rose',
        neighbor_graph_id: 'subfamily:floral_rose',
        score: 0.3055555555555556,
        final_score: 0.3055555555555556,
        dimensions: {
          semantic_overlap: 0,
          tradition: 0.65,
          accord_compatibility: 0.75,
        },
        evidence: {
          cooccurrence_support: 21,
          curated_relation: 'cross_family_tradition_bridge',
          accord_reference: 'strong_accord_pair',
        },
        direction: 'inbound',
      },
    ])
  })

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
})

describe('getCrossFamilyBridges', () => {
  it('returns cross-family bridges sorted by source then target subfamily id', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = getCrossFamilyBridges(graph)

    expect(proof).toEqual({
      query_kind: 'cross_family_bridges',
      params: {},
      result: {
        bridges: [
          {
            source_subfamily_id: 'floral_rose',
            target_subfamily_id: 'woody_dry',
            source_family_id: 'floral',
            target_family_id: 'woody',
            score: 0.3055555555555556,
            final_score: 0.3055555555555556,
            dimensions: {
              semantic_overlap: 0,
              tradition: 0.65,
              accord_compatibility: 0.75,
            },
            evidence: {
              cooccurrence_support: 21,
              curated_relation: 'cross_family_tradition_bridge',
              accord_reference: 'strong_accord_pair',
            },
          },
          {
            source_subfamily_id: 'floral_rose',
            target_subfamily_id: 'woody_mossy',
            source_family_id: 'floral',
            target_family_id: 'woody',
            score: 0.2972222222222222,
            final_score: 0.2972222222222222,
            dimensions: {
              semantic_overlap: 0,
              tradition: 0.65,
              accord_compatibility: 0.7,
            },
            evidence: {
              curated_relation: 'cross_family_tradition_bridge',
              accord_reference: 'compatible_accord_pair',
            },
          },
        ],
      },
    })
    expect(proof.path).toBeUndefined()
  })
})

describe('getSimilarityHub', () => {
  it('selects floral_rose hub by max degree with lexicographic tie-break', () => {
    const graph = buildValidatedWoodyGraph()
    const proof = getSimilarityHub(graph)

    expect(proof).toEqual({
      query_kind: 'similarity_hub',
      params: {},
      result: {
        hub: {
          subfamily_id: 'floral_rose',
          graph_id: 'subfamily:floral_rose',
          family_id: 'floral',
          degree: 3,
        },
      },
    })
    expect(proof.path).toBeUndefined()
  })
})

describe('query proof determinism', () => {
  it('returns deep-equal proofs for all eight query functions across repeated build+validate cycles', () => {
    const input = makeWoodyBaselineInput()
    const graphA = buildOlfactoryGraph(input)
    const graphB = buildOlfactoryGraph(input)

    expect(validateOlfactoryGraph(graphA).ok).toBe(true)
    expect(validateOlfactoryGraph(graphB).ok).toBe(true)

    const queryCases = [
      () => getDescriptorsByFamily(graphA, 'woody'),
      () => getDescriptorsBySubfamily(graphA, 'woody_dry'),
      () => resolveAliasPath(graphA, 'cedar'),
      () => getDescriptorToFamilyPath(graphA, 'cedarwood'),
      () => getRelatedDescriptors(graphA, 'cedarwood'),
      () => getSimilarityNeighborhood(graphA, 'floral_rose'),
      () => getCrossFamilyBridges(graphA),
      () => getSimilarityHub(graphA),
    ] as const

    const repeatCases = [
      () => getDescriptorsByFamily(graphB, 'woody'),
      () => getDescriptorsBySubfamily(graphB, 'woody_dry'),
      () => resolveAliasPath(graphB, 'cedar'),
      () => getDescriptorToFamilyPath(graphB, 'cedarwood'),
      () => getRelatedDescriptors(graphB, 'cedarwood'),
      () => getSimilarityNeighborhood(graphB, 'floral_rose'),
      () => getCrossFamilyBridges(graphB),
      () => getSimilarityHub(graphB),
    ] as const

    for (let index = 0; index < queryCases.length; index += 1) {
      const runFirst = queryCases.at(index)
      const runSecond = repeatCases.at(index)
      if (!runFirst || !runSecond) {
        throw new Error(`Missing determinism query case at index ${index}`)
      }
      const first = runFirst()
      const second = runSecond()

      expect(first).toEqual(second)
      expect(JSON.stringify(first)).toBe(JSON.stringify(second))
    }
  })
})
