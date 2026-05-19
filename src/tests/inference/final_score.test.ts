import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SCORE_WEIGHTS,
  combineScores,
  shouldKeepEdge,
} from '../../inference/index.js'
import type { SimilarityEdge } from '../../types/similarity.js'

describe('final score composition', () => {
  it('exposes locked default weights for all scoring dimensions', () => {
    expect(DEFAULT_SCORE_WEIGHTS).toEqual({
      semantic_overlap: 0.50,
      tradition: 0.25,
      accord_compatibility: 0.15,
      alias_evidence: 0.10,
    })
  })

  it('renormalizes over available dimensions without treating missing tradition or accord as zero', () => {
    const score = combineScores({
      semantic_overlap: 0.5,
      tradition: undefined,
      accord_compatibility: undefined,
      alias_evidence: 0.25,
    })

    expect(score).toBeCloseTo(((0.5 * 0.50) + (0.25 * 0.10)) / 0.60)
  })

  it('returns zero for no available dimensions and does not keep the edge', () => {
    expect(combineScores({})).toBe(0)
    expect(shouldKeepEdge(0)).toBe(false)
  })

  it('clamps invalid upstream dimension scores into the normalized range', () => {
    expect(combineScores({ semantic_overlap: -1 })).toBe(0)
    expect(combineScores({ semantic_overlap: 1.2 })).toBe(1)
  })

  it('uses strict threshold eligibility for sparse graph edges', () => {
    expect(shouldKeepEdge(0.25)).toBe(false)
    expect(shouldKeepEdge(0.2500001)).toBe(true)
  })

  it('supports graph-ready final_score with score compatibility and compact evidence', () => {
    const edge: SimilarityEdge = {
      source: 'floral:white_floral',
      target: 'citrus:fresh_citrus',
      final_score: 0.64,
      score: 0.64,
      dimensions: {
        semantic_overlap: 0.4,
        tradition: 0.7,
        accord_compatibility: 0.8,
        alias_evidence: 0.88,
      },
      evidence: {
        shared_descriptors: ['orange_blossom', 'white_floral'],
        cooccurrence_support: 3,
        curated_relation: 'traditional_pairing',
        accord_reference: 'fresh_floral_citrus',
        alias_evidence: ['orange_blossom_absolute'],
      },
    }

    expect(edge.score).toBe(edge.final_score)
    expect(edge.dimensions.semantic_overlap).toBe(0.4)
    expect(edge.evidence?.shared_descriptors).toEqual(['orange_blossom', 'white_floral'])
  })
})
