import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildSimilarityGraph } from '../../inference/index.js'
import type { CorpusAnalysis } from '../../types/analysis.js'
import type { AccordMapInput, CuratedRelationsInput, ReviewQueueItem } from '../../types/inference.js'
import type { TaxonomySeed } from '../../types/seed.js'
import type { SimilarityGraph } from '../../types/similarity.js'

type FixtureAliasCandidate = CorpusAnalysis['aliasCandidates'][number]

type SparseGraphFixture = {
  readonly seed: TaxonomySeed
  readonly analysis: {
    readonly frequency: readonly (readonly [string, number])[]
    readonly cooccurrence: readonly (readonly [string, number])[]
    readonly aliasCandidates: readonly FixtureAliasCandidate[]
  }
  readonly curatedRelations: CuratedRelationsInput
  readonly accordMap: AccordMapInput
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadFixture = async (): Promise<SparseGraphFixture> => {
  const content = await readFile(join(__dirname, '../fixtures/inference/sparse_graph_threshold.json'), 'utf8')
  return JSON.parse(content) as SparseGraphFixture
}

const toAnalysis = (fixture: SparseGraphFixture): CorpusAnalysis => ({
  frequency: new Map(fixture.analysis.frequency),
  cooccurrence: new Map(fixture.analysis.cooccurrence),
  aliasCandidates: fixture.analysis.aliasCandidates,
})

const buildFixtureGraph = async (generatedAt?: string): Promise<SimilarityGraph> => {
  const fixture = await loadFixture()
  return buildSimilarityGraph(fixture.seed, toAnalysis(fixture), {
    curatedRelations: fixture.curatedRelations,
    accordMap: fixture.accordMap,
  }, {
    ...(generatedAt !== undefined ? { generatedAt } : {}),
  })
}

describe('buildSimilarityGraph', () => {
  it('keeps only final scores strictly above the sparse threshold with separated evidence', async () => {
    const graph = await buildFixtureGraph('2026-01-01T00:00:00.000Z')

    expect(graph.generated_at).toBe('2026-01-01T00:00:00.000Z')
    expect(graph.threshold).toBe(0.25)
    expect(graph.edges.every(edge => edge.final_score !== undefined && edge.final_score > 0.25)).toBe(true)
    expect(graph.edges.some(edge => edge.source === 'threshold_citrus' && edge.target === 'threshold_floral')).toBe(false)

    const emitted = graph.edges.find(edge => edge.source === 'bright_citrus' && edge.target === 'fresh_floral')
    expect(emitted).toBeDefined()
    expect(emitted?.score).toBe(emitted?.final_score)
    expect(emitted?.dimensions.semantic_overlap).toBeDefined()
    expect(emitted?.dimensions.tradition).toBeDefined()
    expect(emitted?.dimensions.accord_compatibility).toBeDefined()
    expect(emitted?.dimensions.alias_evidence).toBeDefined()
    expect(emitted?.evidence?.shared_descriptors).toEqual(['sparkling'])
    expect(emitted?.evidence?.cooccurrence_support).toBeGreaterThan(0)
    expect(emitted?.evidence?.curated_relation).toBe('fresh_floral_citrus_bridge')
    expect(emitted?.evidence?.accord_reference).toBe('sparkling_floral_citrus')
    expect(emitted?.evidence?.alias_evidence).toEqual(['sparkling|sparkly'])
  })

  it('emits at least one edge with two or more defined dimension scores and deterministic ordering', async () => {
    const graph = await buildFixtureGraph('2026-01-01T00:00:00.000Z')
    const edges = graph.edges.map(edge => `${edge.source}|${edge.target}`)

    expect(edges).toEqual([...edges].sort((left, right) => left.localeCompare(right)))
    expect(graph.edges.every(edge => edge.source < edge.target)).toBe(true)
    expect(graph.edges.some(edge => {
      return Object.values(edge.dimensions).filter(score => score !== undefined).length >= 2
    })).toBe(true)
  })

  it('stores a typed review queue on the graph and is deterministic across repeated calls', async () => {
    const first = await buildFixtureGraph('2026-01-01T00:00:00.000Z')
    const second = await buildFixtureGraph('2026-01-01T00:00:00.000Z')
    const reviewQueue: readonly ReviewQueueItem[] = first.review_queue

    expect(reviewQueue).toEqual(first.review_queue)
    expect(first.edges).toEqual(second.edges)
    expect(first.review_queue).toEqual(second.review_queue)
    expect(first.stats).toEqual(second.stats)
  })

  it('defaults generated_at to a fixed timestamp and keeps density zero with fewer than two subfamilies', () => {
    const seed: TaxonomySeed = {
      version: '1.0.0',
      metadata: {
        created_at: '2026-01-01T00:00:00.000Z',
        author: 'test',
        description: 'single subfamily seed',
      },
      families: [{
        id: 'solo',
        name: 'Solo',
        subfamilies: [{ id: 'only', name: 'Only', descriptors: ['alone'] }],
      }],
    }

    const graph = buildSimilarityGraph(seed, {
      frequency: new Map([['alone', 1]]),
      cooccurrence: new Map(),
      aliasCandidates: [],
    }, {
      curatedRelations: { version: '1.0.0', relations: [] },
      accordMap: { version: '1.0.0', accords: [] },
    })

    expect(graph.generated_at).toBe('1970-01-01T00:00:00.000Z')
    expect(graph.stats.subfamily_count).toBe(1)
    expect(graph.stats.density).toBe(0)
  })

  it('emits warnings when curated relations and accord maps are empty', () => {
    const seed: TaxonomySeed = {
      version: '1.0.0',
      metadata: {
        created_at: '2026-01-01T00:00:00.000Z',
        author: 'test',
        description: 'two subfamilies with empty curated inputs',
      },
      families: [{
        id: 'citrus',
        name: 'Citrus',
        subfamilies: [{ id: 'fresh', name: 'Fresh', descriptors: ['zest'] }],
      }, {
        id: 'floral',
        name: 'Floral',
        subfamilies: [{ id: 'white', name: 'White', descriptors: ['petal'] }],
      }],
    }

    const graph = buildSimilarityGraph(seed, {
      frequency: new Map([['zest', 10], ['petal', 9]]),
      cooccurrence: new Map(),
      aliasCandidates: [],
    }, {
      curatedRelations: { version: '1.0.0', relations: [] },
      accordMap: { version: '1.0.0', accords: [] },
    })

    expect(graph.review_queue.filter(item => item.type === 'empty_curated_relations')).toHaveLength(1)
    expect(graph.review_queue.filter(item => item.type === 'empty_accord_map')).toHaveLength(1)
    expect(graph.review_queue.filter(item => item.type === 'empty_curated_relations')[0]).toMatchObject({
      severity: 'low',
      affected: { input: 'curated_relations.v1.json' },
      evidence: { input_empty: true },
      suggested_action: 'populate_curated_input',
    })
  })

  it('keeps tradition and accord undefined when only corpus cooccurrence exists', () => {
    const seed: TaxonomySeed = {
      version: '1.0.0',
      metadata: {
        created_at: '2026-01-01T00:00:00.000Z',
        author: 'test',
        description: 'cooccurrence-only graph',
      },
      families: [{
        id: 'citrus',
        name: 'Citrus',
        subfamilies: [{ id: 'fresh', name: 'Fresh', descriptors: ['spark'] }],
      }, {
        id: 'woody',
        name: 'Woody',
        subfamilies: [{ id: 'dry', name: 'Dry', descriptors: ['spark'] }],
      }],
    }

    const graph = buildSimilarityGraph(seed, {
      frequency: new Map([['spark', 12]]),
      cooccurrence: new Map(),
      aliasCandidates: [],
    }, {
      curatedRelations: { version: '1.0.0', relations: [] },
      accordMap: { version: '1.0.0', accords: [] },
    }, {
      threshold: 0,
    })

    expect(graph.edges.length).toBeGreaterThan(0)
    const edge = graph.edges[0]
    expect(edge?.dimensions.tradition).toBeUndefined()
    expect(edge?.dimensions.accord_compatibility).toBeUndefined()
  })

  it('matches real curated inputs by simple subfamily_id and emits tradition and accord edges', async () => {
    const [seedRaw, relationsRaw, accordsRaw] = await Promise.all([
      readFile(join(__dirname, '../../../data/taxonomy/taxonomy-seed.v1.json'), 'utf8'),
      readFile(join(__dirname, '../../../data/inference/curated_relations.v1.json'), 'utf8'),
      readFile(join(__dirname, '../../../data/inference/accord_map.v1.json'), 'utf8'),
    ])
    const seed = JSON.parse(seedRaw) as TaxonomySeed
    const curatedRelations = JSON.parse(relationsRaw) as CuratedRelationsInput
    const accordMap = JSON.parse(accordsRaw) as AccordMapInput

    const graph = buildSimilarityGraph(seed, {
      frequency: new Map(),
      cooccurrence: new Map(),
      aliasCandidates: [],
    }, {
      curatedRelations,
      accordMap,
    })

    const hasPair = (left: string, right: string) => graph.edges.some(edge => {
      return (edge.source === left && edge.target === right) || (edge.source === right && edge.target === left)
    })

    expect(graph.edges.length).toBeGreaterThan(0)
    expect(hasPair('floral_rose', 'floral_white')).toBe(true)
    expect(hasPair('citrus_fresh', 'citrus_bitter')).toBe(true)
    expect(graph.edges.some(edge => edge.dimensions.tradition !== undefined)).toBe(true)
    expect(graph.edges.some(edge => edge.dimensions.accord_compatibility !== undefined)).toBe(true)
  })

  it('keeps missing curated dimensions undefined and surfaces empty graph with curated inputs', () => {
    const seed: TaxonomySeed = {
      version: '1.0.0',
      metadata: {
        created_at: '2026-01-01T00:00:00.000Z',
        author: 'test',
        description: 'unmatched curated inputs',
      },
      families: [{
        id: 'citrus',
        name: 'Citrus',
        subfamilies: [{ id: 'fresh', name: 'Fresh', descriptors: ['zest'] }],
      }, {
        id: 'floral',
        name: 'Floral',
        subfamilies: [{ id: 'white', name: 'White', descriptors: ['petal'] }],
      }],
    }

    const graph = buildSimilarityGraph(seed, {
      frequency: new Map(),
      cooccurrence: new Map(),
      aliasCandidates: [],
    }, {
      curatedRelations: {
        version: '1.0.0',
        relations: [{ source_subfamily_id: 'missing_a', target_subfamily_id: 'missing_b', relation: 'unmatched', score: 0.9 }],
      },
      accordMap: { version: '1.0.0', accords: [] },
    })

    expect(graph.edges).toHaveLength(0)
    expect(graph.review_queue).toContainEqual(expect.objectContaining({
      type: 'graph_empty_with_curated_inputs',
      severity: 'high',
      affected: { artifact: 'similarity_matrix.json' },
    }))
  })
})
