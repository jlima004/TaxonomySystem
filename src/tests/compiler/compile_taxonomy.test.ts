import { describe, expect, it } from 'vitest'
import { encodePairKey } from '../../analyzer/pair_key.js'
import { compileTaxonomy } from '../../compiler/compile_taxonomy.js'
import type { CorpusAnalysis } from '../../types/analysis.js'
import type { SeedCorpusProfileResult } from '../../types/inference.js'
import type { TaxonomySeed } from '../../types/seed.js'

const seed: TaxonomySeed = {
  version: '1.0.0',
  metadata: { created_at: '2026-01-01', author: 'test', description: 'test' },
  families: [
    {
      id: 'woody',
      name: 'Woody',
      subfamilies: [
        { id: 'dry_woods', name: 'Dry Woods', descriptors: ['cedar', 'sandalwood'] },
        { id: 'mossy_woods', name: 'Mossy Woods', descriptors: ['oakmoss'] },
      ],
    },
  ],
}

const analysis: CorpusAnalysis = {
  frequency: new Map([
    ['cedar', 5],
    ['sandalwood', 3],
    ['oakmoss', 2],
    ['ambroxan', 9],
    ['moss', 4],
    ['tie_note', 6],
    ['unsupported', 10],
    ['generic_note', 40],
  ]),
  cooccurrence: new Map([
    [encodePairKey('ambroxan', 'cedar'), 2],
    [encodePairKey('ambroxan', 'sandalwood'), 3],
    [encodePairKey('ambroxan', 'oakmoss'), 1],
    [encodePairKey('moss', 'oakmoss'), 4],
    [encodePairKey('tie_note', 'cedar'), 2],
    [encodePairKey('tie_note', 'oakmoss'), 2],
    [encodePairKey('generic_note', 'cedar'), 1],
  ]),
  aliasCandidates: [],
}

const profileResult: SeedCorpusProfileResult = {
  profiles: [
    { family_id: 'woody', subfamily_id: 'dry_woods', descriptor: 'sandalwood', source: 'seed', status: 'curated', weight: 1, corpus_count: 3, evidence: {} },
    { family_id: 'woody', subfamily_id: 'dry_woods', descriptor: 'cedar', source: 'seed', status: 'curated', weight: 1, corpus_count: 5, evidence: {} },
    { family_id: 'woody', subfamily_id: 'mossy_woods', descriptor: 'oakmoss', source: 'seed', status: 'curated', weight: 1, corpus_count: 2, evidence: {} },
  ],
  inferred_descriptors: [
    { descriptor: 'unsupported', source: 'corpus', status: 'candidate', corpus_derived: true, corpus_count: 10, weight: 1, evidence: {} },
    { descriptor: 'tie_note', source: 'corpus', status: 'candidate', corpus_derived: true, corpus_count: 6, weight: 1, evidence: {} },
    { descriptor: 'moss', source: 'corpus', status: 'candidate', corpus_derived: true, corpus_count: 4, weight: 1, evidence: {} },
    { descriptor: 'ambroxan', source: 'corpus', status: 'candidate', corpus_derived: true, corpus_count: 9, weight: 1, evidence: {} },
    { descriptor: 'generic_note', source: 'corpus', status: 'candidate', corpus_derived: true, corpus_count: 40, weight: 1, evidence: {} },
  ],
  noise_decisions: [],
  corpus_noise_suggestions: [],
  review_queue: [],
}

const compile = () => compileTaxonomy(seed, profileResult, analysis, { generatedAt: '2026-01-01T00:00:00.000Z' })

describe('compileTaxonomy', () => {
  it('marks seed descriptors as curated and not reviewable', () => {
    const descriptor = compile().taxonomy.families[0]?.subfamilies[0]?.descriptors[0]
    expect(descriptor).toMatchObject({ source: 'seed', status: 'curated', review_required: false, corpus_derived: false })
  })

  it('marks corpus descriptors as candidates and reviewable', () => {
    const corpus = compile().taxonomy.families[0]?.subfamilies[0]?.descriptors.find(descriptor => descriptor.source === 'corpus')
    expect(corpus).toMatchObject({ source: 'corpus', status: 'candidate', review_required: true, corpus_derived: true })
  })

  it('places descriptors in the subfamily with the highest support', () => {
    const dry = compile().taxonomy.families[0]?.subfamilies.find(subfamily => subfamily.id === 'dry_woods')
    expect(dry?.descriptors.some(descriptor => descriptor.id === 'ambroxan')).toBe(true)
  })

  it('breaks equal support ties by lexicographically smaller subfamily id', () => {
    const dry = compile().taxonomy.families[0]?.subfamilies.find(subfamily => subfamily.id === 'dry_woods')
    expect(dry?.descriptors.some(descriptor => descriptor.id === 'tie_note')).toBe(true)
  })

  it('excludes weak support candidates and emits placement review items', () => {
    const compiled = compileTaxonomy(seed, profileResult, analysis, { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(JSON.stringify(compiled.taxonomy)).not.toContain('generic_note')
    const review = compiled.placement_review_queue.find(item => item.affected.descriptor === 'generic_note')
    expect(review).toBeDefined()
    expect(review?.type).toBe('corpus_candidate_low_support')
    expect(review?.suggested_action).toBe('review_candidate_placement')
    expect(review?.evidence).toMatchObject({
      support: 1,
      candidate_frequency: 40,
      normalized_support: 0.025,
    })
  })

  it('places seed descriptors before corpus descriptors', () => {
    expect(compile().taxonomy.families[0]?.subfamilies[0]?.descriptors.map(descriptor => descriptor.source)).toEqual(['seed', 'seed', 'corpus'])
  })

  it('sorts descriptor ids within seed and corpus groups', () => {
    expect(compile().taxonomy.families[0]?.subfamilies[0]?.descriptors.map(descriptor => descriptor.id)).toEqual(['cedar', 'sandalwood', 'ambroxan'])
  })

  it('computes stats consistently', () => {
    expect(compile().taxonomy.stats).toEqual({ family_count: 1, subfamily_count: 2, descriptor_count: 5 })
  })

  it('injects generated_at and is deterministic for fixed inputs', () => {
    expect(compile().taxonomy.generated_at).toBe('2026-01-01T00:00:00.000Z')
    expect(compile()).toEqual(compile())
  })
})
