import { describe, it, expect } from 'vitest'
import {
  validateCompiledTaxonomy,
  validateCompiledAliases,
  validateSimilarityGraph,
  validateAllOutputs,
} from '../../compiler/validate_output.js'
import { findNullsDeep } from '../../compiler/types.js'

// ── Helpers ──────────────────────────────────────────────────────────────────

const makeValidTaxonomy = () => ({
  version: '1.0.0',
  generated_at: '2026-01-01T00:00:00Z',
  stats: { family_count: 1, subfamily_count: 1, descriptor_count: 1 },
  families: [
    {
      id: 'floral',
      name: 'Floral',
      subfamilies: [
        {
          id: 'white_floral',
          name: 'White Floral',
          family_id: 'floral',
          descriptors: [
            {
              id: 'jasmine',
              source: 'seed',
              frequency: 42,
              status: 'curated',
              review_required: false,
              corpus_derived: false,
            },
          ],
        },
      ],
    },
  ],
})

const makeValidAliases = () => ({
  version: '1.0.0',
  schema_version: '1',
  generated_at: '2026-01-01T00:00:00Z',
  aliases: { jasmin: 'jasmine', jasmim: 'jasmine' },
})

const makeValidSimilarity = () => ({
  version: '1.0.0',
  generated_at: '2026-01-01T00:00:00Z',
  threshold: 0.25,
  dimensions: [
    { id: 'semantic_overlap', name: 'Semantic Overlap', weight: 0.4 },
  ],
  edges: [
    {
      source: 'white_floral',
      target: 'yellow_floral',
      score: 0.6,
      final_score: 0.6,
      dimensions: { semantic_overlap: 0.6 },
      evidence: { shared_descriptors: ['jasmine'] },
    },
  ],
  review_queue: [],
  stats: { subfamily_count: 2, edge_count: 1, density: 0.5 },
})

// ── findNullsDeep ────────────────────────────────────────────────────────────

describe('findNullsDeep', () => {
  it('returns empty array for object without nulls', () => {
    expect(findNullsDeep({ a: 1, b: 'x' }, '$')).toEqual([])
  })

  it('detects top-level null value', () => {
    expect(findNullsDeep({ a: null }, '$')).toEqual([{ path: '$.a' }])
  })

  it('detects deeply nested null', () => {
    expect(findNullsDeep({ a: { b: { c: null } } }, '$')).toEqual([
      { path: '$.a.b.c' },
    ])
  })

  it('detects null in array', () => {
    const result = findNullsDeep([null, 'ok'], '$')
    expect(result).toEqual([{ path: '$[0]' }])
  })

  it('detects multiple nulls', () => {
    const result = findNullsDeep({ a: null, b: { c: null } }, '$')
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ path: '$.a' })
    expect(result).toContainEqual({ path: '$.b.c' })
  })
})

// ── validateCompiledTaxonomy ─────────────────────────────────────────────────

describe('validateCompiledTaxonomy', () => {
  it('accepts valid minimal taxonomy', () => {
    const result = validateCompiledTaxonomy(makeValidTaxonomy())
    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
  })

  it('rejects missing version', () => {
    const data = makeValidTaxonomy()
    delete (data as Record<string, unknown>)['version']
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'MISSING_FIELD' && e.path === '$.version')).toBe(true)
  })

  it('rejects families as null', () => {
    const data = { ...makeValidTaxonomy(), families: null }
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_TYPE' && e.path === '$.families')).toBe(true)
  })

  it('rejects duplicate family id', () => {
    const data = makeValidTaxonomy()
    const dup = { ...data.families[0]! }
    ;(data as any).families.push(dup)
    ;(data as any).stats.family_count = 2
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'DUPLICATE_ID')).toBe(true)
  })

  it('rejects invalid descriptor source', () => {
    const data = makeValidTaxonomy()
    ;(data as any).families[0].subfamilies[0].descriptors[0].source = 'invalid'
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_VALUE' && e.path.includes('source'))).toBe(true)
  })

  it('rejects descriptor without status', () => {
    const data = makeValidTaxonomy()
    delete (data as any).families[0].subfamilies[0].descriptors[0].status
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.path.includes('status'))).toBe(true)
  })

  it('rejects seed descriptor with status=candidate', () => {
    const data = makeValidTaxonomy()
    ;(data as any).families[0].subfamilies[0].descriptors[0].status = 'candidate'
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_VALUE' && e.message.includes('curated'))).toBe(true)
  })

  it('rejects corpus descriptor with review_required=false', () => {
    const data = makeValidTaxonomy()
    ;(data as any).families[0].subfamilies[0].descriptors[0] = {
      id: 'test', source: 'corpus', frequency: 5,
      status: 'candidate', review_required: false, corpus_derived: true,
    }
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.message.includes('review_required'))).toBe(true)
  })

  it('rejects corpus descriptor with corpus_derived=false', () => {
    const data = makeValidTaxonomy()
    ;(data as any).families[0].subfamilies[0].descriptors[0] = {
      id: 'test', source: 'corpus', frequency: 5,
      status: 'candidate', review_required: true, corpus_derived: false,
    }
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.message.includes('corpus_derived'))).toBe(true)
  })

  it('rejects inferred descriptor with wrong status', () => {
    const data = makeValidTaxonomy()
    ;(data as any).families[0].subfamilies[0].descriptors[0] = {
      id: 'test', source: 'inferred', frequency: 2,
      status: 'curated', review_required: true, corpus_derived: true,
    }
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_VALUE' && e.message.includes('inferred'))).toBe(true)
  })

  it('rejects inconsistent stats', () => {
    const data = makeValidTaxonomy()
    ;(data as any).stats.family_count = 99
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INCONSISTENT_STATS')).toBe(true)
  })

  it('detects deep null in descriptor frequency', () => {
    const data = makeValidTaxonomy()
    ;(data as any).families[0].subfamilies[0].descriptors[0].frequency = null
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e =>
      e.code === 'INVALID_TYPE' &&
      e.path === '$.families[0].subfamilies[0].descriptors[0].frequency'
    )).toBe(true)
  })

  it('tolerates unknown fields in v1', () => {
    const data = { ...makeValidTaxonomy(), foo: 'bar' }
    const result = validateCompiledTaxonomy(data)
    expect(result.ok).toBe(true)
  })

  it('sets artifact to taxonomy in all errors', () => {
    const result = validateCompiledTaxonomy({})
    for (const e of result.errors) {
      expect(e.artifact).toBe('taxonomy')
    }
  })
})

// ── validateCompiledAliases ──────────────────────────────────────────────────

describe('validateCompiledAliases', () => {
  it('accepts valid aliases wrapper', () => {
    const result = validateCompiledAliases(makeValidAliases())
    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects missing schema_version', () => {
    const data = makeValidAliases()
    delete (data as Record<string, unknown>)['schema_version']
    const result = validateCompiledAliases(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'MISSING_FIELD' && e.path === '$.schema_version')).toBe(true)
  })

  it('rejects alias pointing to itself', () => {
    const data = { ...makeValidAliases(), aliases: { jasmine: 'jasmine' } }
    const result = validateCompiledAliases(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_VALUE' && e.path === '$.aliases["jasmine"]')).toBe(true)
  })

  it('detects null alias value', () => {
    const data = { ...makeValidAliases(), aliases: { key: null } }
    const result = validateCompiledAliases(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_TYPE' && e.path === '$.aliases.key')).toBe(true)
  })

  it('accepts empty aliases object', () => {
    const data = { ...makeValidAliases(), aliases: {} }
    const result = validateCompiledAliases(data)
    expect(result.ok).toBe(true)
  })

  it('tolerates unknown fields in v1', () => {
    const data = { ...makeValidAliases(), extra: 'field' }
    const result = validateCompiledAliases(data)
    expect(result.ok).toBe(true)
  })

  it('sets artifact to aliases in all errors', () => {
    const result = validateCompiledAliases({})
    for (const e of result.errors) {
      expect(e.artifact).toBe('aliases')
    }
  })
})

// ── validateSimilarityGraph ──────────────────────────────────────────────────

describe('validateSimilarityGraph', () => {
  it('accepts valid minimal graph', () => {
    const result = validateSimilarityGraph(makeValidSimilarity())
    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects edge without source', () => {
    const data = makeValidSimilarity()
    delete (data as any).edges[0].source
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.path === '$.edges[0].source')).toBe(true)
  })

  it('rejects inconsistent stats.edge_count', () => {
    const data = makeValidSimilarity()
    ;(data as any).stats.edge_count = 99
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INCONSISTENT_STATS')).toBe(true)
  })

  it('rejects negative edge score', () => {
    const data = makeValidSimilarity()
    ;(data as any).edges[0].score = -0.1
    ;(data as any).edges[0].final_score = -0.1
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_VALUE' && e.path === '$.edges[0].score')).toBe(true)
  })

  it('rejects edge score > 1', () => {
    const data = makeValidSimilarity()
    ;(data as any).edges[0].score = 1.5
    ;(data as any).edges[0].final_score = 1.5
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_VALUE' && e.path === '$.edges[0].score')).toBe(true)
  })

  it('rejects inconsistent score vs final_score', () => {
    const data = makeValidSimilarity()
    ;(data as any).edges[0].score = 0.5
    ;(data as any).edges[0].final_score = 0.8
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INCONSISTENT_SCORE' && e.path === '$.edges[0]')).toBe(true)
  })

  it('rejects dimension score out of range', () => {
    const data = makeValidSimilarity()
    ;(data as any).edges[0].dimensions.cooccurrence = 1.2
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_VALUE' && e.path.includes('dimensions'))).toBe(true)
  })

  it('rejects density out of range', () => {
    const data = makeValidSimilarity()
    ;(data as any).stats.density = 1.5
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.code === 'INVALID_VALUE' && e.path === '$.stats.density')).toBe(true)
  })

  it('detects deep null in evidence', () => {
    const data = makeValidSimilarity()
    ;(data as any).edges[0].evidence = { curated_relation: null }
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e =>
      e.code === 'INVALID_TYPE' &&
      e.path === '$.edges[0].evidence.curated_relation'
    )).toBe(true)
  })

  it('tolerates unknown fields in v1', () => {
    const data = { ...makeValidSimilarity(), extra: true }
    const result = validateSimilarityGraph(data)
    expect(result.ok).toBe(true)
  })

  it('sets artifact to similarity in all errors', () => {
    const result = validateSimilarityGraph({})
    for (const e of result.errors) {
      expect(e.artifact).toBe('similarity')
    }
  })
})

// ── validateAllOutputs ───────────────────────────────────────────────────────

describe('validateAllOutputs', () => {
  it('returns ok when all valid', () => {
    const result = validateAllOutputs(
      makeValidTaxonomy(),
      makeValidAliases(),
      makeValidSimilarity(),
    )
    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('returns not ok when one is invalid', () => {
    const result = validateAllOutputs(
      {},
      makeValidAliases(),
      makeValidSimilarity(),
    )
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.artifact === 'taxonomy')).toBe(true)
  })

  it('combines errors from multiple invalid artifacts', () => {
    const result = validateAllOutputs({}, {}, {})
    expect(result.ok).toBe(false)
    const artifacts = new Set(result.errors.map(e => e.artifact))
    expect(artifacts.has('taxonomy')).toBe(true)
    expect(artifacts.has('aliases')).toBe(true)
    expect(artifacts.has('similarity')).toBe(true)
  })
})
