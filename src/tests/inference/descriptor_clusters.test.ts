import { describe, expect, it } from 'vitest'
import { buildDescriptorClusters } from '../../inference/index.js'
import type { CorpusAnalysis } from '../../types/analysis.js'
import type { SeedCorpusProfileResult } from '../../types/inference.js'

const profileResult: SeedCorpusProfileResult = {
  profiles: [
    {
      family_id: 'floral',
      subfamily_id: 'floral_green',
      descriptor: 'green',
      source: 'seed',
      status: 'curated',
      weight: 1,
      corpus_count: 5,
      evidence: {},
    },
  ],
  inferred_descriptors: [
    {
      descriptor: 'green_floral',
      source: 'corpus',
      status: 'candidate',
      corpus_derived: true,
      corpus_count: 4,
      weight: 1,
      evidence: {},
    },
    {
      descriptor: 'greeny',
      source: 'corpus',
      status: 'candidate',
      corpus_derived: true,
      corpus_count: 3,
      weight: 1,
      evidence: {},
    },
    {
      descriptor: 'solar',
      source: 'corpus',
      status: 'candidate',
      corpus_derived: true,
      corpus_count: 3,
      weight: 1,
      evidence: {},
    },
    {
      descriptor: 'sunlit',
      source: 'corpus',
      status: 'candidate',
      corpus_derived: true,
      corpus_count: 3,
      weight: 1,
      evidence: {},
    },
  ],
  noise_decisions: [],
  corpus_noise_suggestions: [],
  review_queue: [],
}

const analysis: CorpusAnalysis = {
  frequency: new Map<string, number>([
    ['green', 5],
    ['green_floral', 4],
    ['greeny', 3],
    ['solar', 3],
    ['sunlit', 3],
  ]),
  cooccurrence: new Map<string, number>([
    ['green|green_floral', 3],
    ['solar|sunlit', 3],
    ['green|solar', 1],
    ['green|greeny', 1],
  ]),
  aliasCandidates: [],
}

describe('buildDescriptorClusters', () => {
  it('emits seed-anchored and corpus-native clusters with explicit membership signals', () => {
    const result = buildDescriptorClusters(profileResult, analysis, {
      minCoOccurrence: 2,
      minSimilarity: 0.55,
    })

    expect(result.clusters).toContainEqual(expect.objectContaining({
      cluster_kind: 'seed_anchor',
      status: 'accepted_seed_anchor',
      seed_anchor: 'floral_green',
      evidence: expect.objectContaining({
        membership_signals: expect.arrayContaining(['cooccurrence', 'similarity']),
      }),
    }))
    expect(result.clusters).toContainEqual(expect.objectContaining({
      cluster_kind: 'corpus_native',
      status: 'candidate',
      corpus_derived: true,
      evidence: expect.objectContaining({
        membership_reason: expect.any(String),
      }),
    }))
  })

  it('distinguishes co-occurrence and similarity membership evidence', () => {
    const result = buildDescriptorClusters(profileResult, analysis, {
      minCoOccurrence: 2,
      minSimilarity: 0.55,
    })
    const seedCluster = result.clusters.find(cluster => cluster.cluster_kind === 'seed_anchor')

    expect(seedCluster?.members).toContain('green_floral')
    expect(seedCluster?.members).toContain('greeny')
    expect(seedCluster?.evidence.membership_signals).toContain('cooccurrence')
    expect(seedCluster?.evidence.membership_signals).toContain('similarity')
  })

  it('sorts representative descriptors and is deterministic', () => {
    const first = buildDescriptorClusters(profileResult, analysis)
    const second = buildDescriptorClusters(profileResult, analysis)

    expect(first).toEqual(second)
    for (const cluster of first.clusters) {
      const representatives = cluster.evidence.representative_descriptors
      expect(representatives).toEqual([...representatives].sort((a, b) => a.localeCompare(b)))
      expect(cluster.evidence.corpus_support).toBeGreaterThanOrEqual(0)
    }
  })
})
