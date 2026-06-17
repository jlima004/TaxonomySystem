import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import {
  asValidatedGraph,
  createValidatedQueryConsumer,
  type ValidatedGraph,
  type ValidatedQueryConsumer,
} from '../../graph_read_model/query_consumer.js'
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
import { makeGraphNotValidatedError } from '../../graph_read_model/validation_errors.js'
import type { CompiledAliases } from '../../compiler/types.js'
import type { CompiledTaxonomy } from '../../types/taxonomy.js'
import type { SimilarityGraph } from '../../types/similarity.js'
import type { BuildOlfactoryGraphInput, OlfactoryGraph } from '../../graph_read_model/types.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const compiledPaths = {
  taxonomy: path.join(repoRoot, 'data/compiled/v2/taxonomy.json'),
  aliases: path.join(repoRoot, 'data/compiled/v2/descriptor_aliases.json'),
  similarity: path.join(repoRoot, 'data/compiled/v2/similarity_matrix.json'),
} as const

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

const makeProfileInvalidInput = (): BuildOlfactoryGraphInput => {
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

const queryConsumerSourcePath = path.join(
  repoRoot,
  'src/graph_read_model/query_consumer.ts',
)
const queryGraphSourcePath = path.join(repoRoot, 'src/graph_read_model/query_graph.ts')

const loadLiveSanctionedGraph = async (): Promise<OlfactoryGraph> => {
  const [taxonomy, aliases, similarity] = await Promise.all([
    readJson<CompiledTaxonomy>(compiledPaths.taxonomy),
    readJson<CompiledAliases>(compiledPaths.aliases),
    readJson<SimilarityGraph>(compiledPaths.similarity),
  ])

  return buildOlfactoryGraph({ taxonomy, aliases, similarity })
}

const createLiveValidatedConsumer = async (): Promise<{
  graph: OlfactoryGraph
  consumer: ValidatedQueryConsumer
}> => {
  const graph = await loadLiveSanctionedGraph()
  const validated = asValidatedGraph(graph)
  expect(validated.ok).toBe(true)
  if (!validated.ok) {
    throw new Error('expected sanctioned live graph to validate')
  }

  const consumerResult = createValidatedQueryConsumer(validated.graph)
  expect(consumerResult.ok).toBe(true)
  if (!consumerResult.ok) {
    throw new Error('expected validated consumer creation to succeed')
  }

  return { graph, consumer: consumerResult.consumer }
}

const expectExactProofKeys = (proof: Record<string, unknown>): void => {
  const keys = Object.keys(proof).sort()
  expect(keys).not.toContain('ok')
  expect(keys).not.toContain('error')
  expect(keys).not.toContain('errors')
  expect(keys).not.toContain('validated')

  for (const key of keys) {
    expect(['query_kind', 'params', 'result', 'path']).toContain(key)
  }
}

describe('query consumer fail-closed boundary', () => {
  it('asValidatedGraph returns a reusable ValidatedGraph handle for the sanctioned live graph', async () => {
    const [taxonomy, aliases, similarity] = await Promise.all([
      readJson<CompiledTaxonomy>(compiledPaths.taxonomy),
      readJson<CompiledAliases>(compiledPaths.aliases),
      readJson<SimilarityGraph>(compiledPaths.similarity),
    ])

    const graph = buildOlfactoryGraph({ taxonomy, aliases, similarity })
    const first = asValidatedGraph(graph)
    const second = asValidatedGraph(graph)

    expect(first.ok).toBe(true)
    if (!first.ok) {
      return
    }

    expect(second.ok).toBe(true)
    if (!second.ok) {
      return
    }

    expect(first.graph.graph).toBe(graph)
    expect(second.graph.graph).toBe(graph)
    expect(first.graph.validation_profile_id).toBe('sanctioned_v2.11')
  })

  it('asValidatedGraph preserves sanctioned validation errors for profile-invalid graphs', () => {
    const graph = buildOlfactoryGraph(makeProfileInvalidInput())
    const result = asValidatedGraph(graph)

    expect(result.ok).toBe(false)
    if (result.ok) {
      return
    }

    expect(result.errors.some(error => error.code === 'profile_baseline_mismatch')).toBe(true)
    expect(result.errors.some(error => error.code === 'graph_not_validated')).toBe(false)
  })

  it('createValidatedQueryConsumer rejects a forced raw OlfactoryGraph with graph_not_validated', () => {
    const graph = buildOlfactoryGraph(makeProfileInvalidInput())
    const result = createValidatedQueryConsumer(graph as unknown as ValidatedGraph)

    expect(result).toEqual({
      ok: false,
      error: makeGraphNotValidatedError('validated graph handle required'),
    })
  })

  it('createValidatedQueryConsumer exposes all eight validated query methods', async () => {
    const [taxonomy, aliases, similarity] = await Promise.all([
      readJson<CompiledTaxonomy>(compiledPaths.taxonomy),
      readJson<CompiledAliases>(compiledPaths.aliases),
      readJson<SimilarityGraph>(compiledPaths.similarity),
    ])

    const graph = buildOlfactoryGraph({ taxonomy, aliases, similarity })
    const validated = asValidatedGraph(graph)
    expect(validated.ok).toBe(true)
    if (!validated.ok) {
      return
    }

    const consumerResult = createValidatedQueryConsumer(validated.graph)
    expect(consumerResult.ok).toBe(true)
    if (!consumerResult.ok) {
      return
    }

    const { consumer } = consumerResult
    const methodNames = [
      'getDescriptorsByFamily',
      'getDescriptorsBySubfamily',
      'resolveAliasPath',
      'getDescriptorToFamilyPath',
      'getRelatedDescriptors',
      'getSimilarityNeighborhood',
      'getCrossFamilyBridges',
      'getSimilarityHub',
    ] as const

    for (const methodName of methodNames) {
      expect(typeof consumer[methodName]).toBe('function')
    }

    expect(consumer.getDescriptorsByFamily('woody').query_kind).toBe('descriptors_by_family')
    expect(consumer.getDescriptorsBySubfamily('woody_dry').query_kind).toBe('descriptors_by_subfamily')
    expect(consumer.resolveAliasPath('cedar').query_kind).toBe('alias_resolution_path')
    expect(consumer.getDescriptorToFamilyPath('cedarwood').query_kind).toBe('descriptor_to_family_path')
    expect(consumer.getRelatedDescriptors('cedarwood').query_kind).toBe('related_descriptors')
    expect(consumer.getSimilarityNeighborhood('floral_rose').query_kind).toBe('similarity_neighborhood')
    expect(consumer.getCrossFamilyBridges().query_kind).toBe('cross_family_bridges')
    expect(consumer.getSimilarityHub().query_kind).toBe('similarity_hub')
  })
})

describe('validated consumer proof compatibility', () => {
  it('returns direct proof objects equal to query_graph for all eight methods', async () => {
    const { graph, consumer } = await createLiveValidatedConsumer()

    const comparisons = [
      {
        consumerProof: consumer.getDescriptorsByFamily('woody'),
        directProof: getDescriptorsByFamily(graph, 'woody'),
      },
      {
        consumerProof: consumer.getDescriptorsBySubfamily('woody_dry'),
        directProof: getDescriptorsBySubfamily(graph, 'woody_dry'),
      },
      {
        consumerProof: consumer.resolveAliasPath('cedar'),
        directProof: resolveAliasPath(graph, 'cedar'),
      },
      {
        consumerProof: consumer.getDescriptorToFamilyPath('cedarwood'),
        directProof: getDescriptorToFamilyPath(graph, 'cedarwood'),
      },
      {
        consumerProof: consumer.getRelatedDescriptors('cedarwood'),
        directProof: getRelatedDescriptors(graph, 'cedarwood'),
      },
      {
        consumerProof: consumer.getSimilarityNeighborhood('floral_rose'),
        directProof: getSimilarityNeighborhood(graph, 'floral_rose'),
      },
      {
        consumerProof: consumer.getCrossFamilyBridges(),
        directProof: getCrossFamilyBridges(graph),
      },
      {
        consumerProof: consumer.getSimilarityHub(),
        directProof: getSimilarityHub(graph),
      },
    ] as const

    for (const { consumerProof, directProof } of comparisons) {
      expect(consumerProof).toEqual(directProof)
      expectExactProofKeys(consumerProof as unknown as Record<string, unknown>)
    }
  })

  it('preserves missing-target empty proof semantics through the consumer', async () => {
    const { consumer } = await createLiveValidatedConsumer()

    expect(consumer.getDescriptorsByFamily('missing_family')).toEqual({
      query_kind: 'descriptors_by_family',
      params: { family_id: 'missing_family' },
      result: { descriptors: [] },
    })

    expect(consumer.getDescriptorsBySubfamily('missing_subfamily')).toEqual({
      query_kind: 'descriptors_by_subfamily',
      params: { subfamily_id: 'missing_subfamily' },
      result: { descriptors: [] },
    })

    const unknownAliasProof = consumer.resolveAliasPath('unknown_alias')
    expect(unknownAliasProof).toEqual({
      query_kind: 'alias_resolution_path',
      params: { alias: 'unknown_alias' },
      result: { target_descriptor_id: null },
    })
    expect(unknownAliasProof.path).toBeUndefined()

    expect(consumer.getDescriptorToFamilyPath('missing_descriptor')).toEqual({
      query_kind: 'descriptor_to_family_path',
      params: { descriptor_id: 'missing_descriptor' },
      result: { family_id: null, subfamily_id: null },
    })

    expect(consumer.getRelatedDescriptors('missing_descriptor')).toEqual({
      query_kind: 'related_descriptors',
      params: { descriptor_id: 'missing_descriptor' },
      result: { descriptors: [] },
    })

    expect(consumer.getSimilarityNeighborhood('unknown_subfamily')).toEqual({
      query_kind: 'similarity_neighborhood',
      params: { subfamily_id: 'unknown_subfamily' },
      result: { neighbors: [] },
    })
  })
})

describe('Phase 61 source scope fences', () => {
  it('rejects raw-graph shortcuts and runtime scope creep in query modules', async () => {
    const [consumerSource, queryGraphSource] = await Promise.all([
      readFile(queryConsumerSourcePath, 'utf8'),
      readFile(queryGraphSourcePath, 'utf8'),
    ])

    expect(consumerSource).not.toContain('createValidatedQueryConsumerFromGraph')
    expect(consumerSource).not.toContain('assertValidatedGraph')
    expect(consumerSource).not.toContain('createValidatedQueryConsumerOrThrow')
    expect(consumerSource).not.toContain('fromGraph(')
    expect(consumerSource).not.toContain('node:fs')
    expect(consumerSource).not.toContain('graphify-out')
    expect(consumerSource).not.toContain('neo4j')
    expect(consumerSource).not.toContain('api/')
    expect(consumerSource).not.toContain('data/read-models')

    expect(queryGraphSource).not.toContain('ValidatedGraph')
    expect(queryGraphSource).not.toContain('graph_not_validated')
    expect(queryGraphSource).not.toContain('validateSanctionedV211Graph')
  })
})
