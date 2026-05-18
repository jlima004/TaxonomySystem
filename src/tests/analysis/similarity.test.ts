import { describe, expect, it } from 'vitest'
import {
  levenshteinDistance,
  levenshteinSimilarity,
} from '../../analyzer/similarity/levenshtein.js'
import { tokenJaccard } from '../../analyzer/similarity/token_overlap.js'

describe('levenshteinDistance', () => {
  it('handles identity and empty input cases', () => {
    expect(levenshteinDistance('', '')).toBe(0)
    expect(levenshteinDistance('rose', '')).toBe(4)
    expect(levenshteinDistance('', 'rose')).toBe(4)
    expect(levenshteinDistance('rose', 'rose')).toBe(0)
  })

  it('matches canonical examples', () => {
    expect(levenshteinDistance('camomile', 'chamomile')).toBe(1)
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3)
  })
})

describe('levenshteinSimilarity', () => {
  it('returns expected known values', () => {
    expect(levenshteinSimilarity('', '')).toBeCloseTo(1, 5)
    expect(levenshteinSimilarity('rose', 'rose')).toBe(1)
    expect(levenshteinSimilarity('camomile', 'chamomile')).toBeCloseTo(0.889, 3)
    expect(levenshteinSimilarity('rose', 'rosewood')).toBe(0.5)
  })

  it('stays within [0, 1] for representative inputs', () => {
    const inputs: ReadonlyArray<readonly [string, string]> = [
      ['', ''],
      ['rose', 'rose'],
      ['rose', 'wood'],
      ['camomile', 'chamomile'],
      ['lily_of_the_valley', 'lily_of_valley'],
    ]

    for (const [a, b] of inputs) {
      const score = levenshteinSimilarity(a, b)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    }
  })
})

describe('tokenJaccard', () => {
  it('computes expected overlap values', () => {
    expect(tokenJaccard('lily_of_the_valley', 'lily_of_valley')).toBeCloseTo(0.75, 3)
    expect(tokenJaccard('rose', 'rosewood')).toBe(0)
    expect(tokenJaccard('a_b_c', 'a_b_c')).toBe(1)
    expect(tokenJaccard('a_b', 'c_d')).toBe(0)
  })
})
