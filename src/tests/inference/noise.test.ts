import { describe, expect, it } from 'vitest'
import {
  buildSeedCorpusProfiles,
  scoreSemanticNoise,
  suggestCorpusSemanticNoise,
} from '../../inference/index.js'
import type { CorpusAnalysis } from '../../types/analysis.js'
import type { TaxonomySeed } from '../../types/seed.js'

const curatedNoiseDescriptors = ['note', 'nuance', 'effect', 'type', 'quality'] as const

const seed: TaxonomySeed = {
  version: '1.0.0',
  metadata: {
    created_at: '2026-05-18T00:00:00Z',
    author: 'test',
    description: 'noise fixture',
  },
  families: [
    {
      id: 'floral',
      name: 'Floral',
      subfamilies: [
        { id: 'floral_green', name: 'Green Floral', descriptors: ['green', 'note'] },
      ],
    },
  ],
}

const analysis: CorpusAnalysis = {
  frequency: new Map<string, number>([
    ['green', 4],
    ['note', 5],
    ['effect', 5],
    ['generic_phrase', 4],
  ]),
  cooccurrence: new Map(),
  aliasCandidates: [],
}

describe('semantic noise audit', () => {
  it('downweights curated noisy descriptors without removing them', () => {
    const decision = scoreSemanticNoise('effect', {
      curatedNoiseDescriptors,
      downweightValue: 0.35,
    })

    expect(decision).toMatchObject({
      descriptor: 'effect',
      weight: 0.35,
      seed_exception: false,
      downweighted: true,
    })
  })

  it('keeps seed-owned noisy descriptors at weight 1 with seed_exception audit', () => {
    const result = buildSeedCorpusProfiles(seed, analysis, {
      curatedNoiseDescriptors,
      downweightValue: 0.35,
    })

    const note = result.profiles.find(profile => profile.descriptor === 'note')
    expect(note).toMatchObject({ weight: 1 })
    expect(note?.noise).toMatchObject({ seed_exception: true, weight: 1 })
    expect(result.review_queue).toContainEqual(expect.objectContaining({
      type: 'semantic_noise_seed_exception',
      affected: expect.objectContaining({ descriptor: 'note' }),
    }))
    expect(result.noise_decisions).toContainEqual(expect.objectContaining({
      descriptor: 'note',
      seed_exception: true,
    }))
  })

  it('emits review-only corpus-derived noise suggestions without automatic downweighting', () => {
    const suggestions = suggestCorpusSemanticNoise(analysis, {
      curatedNoiseDescriptors,
      minNoiseSuggestionFrequency: 3,
    })

    expect(suggestions).toContainEqual(expect.objectContaining({
      descriptor: 'generic_phrase',
      source: 'corpus',
      review_only: true,
      auto_applied: false,
      corpus_frequency: 4,
    }))

    const result = buildSeedCorpusProfiles(seed, analysis, {
      curatedNoiseDescriptors,
      minCorpusFrequency: 2,
      minNoiseSuggestionFrequency: 3,
    })
    expect(result.inferred_descriptors).toContainEqual(expect.objectContaining({
      descriptor: 'generic_phrase',
      weight: 1,
    }))
  })
})
