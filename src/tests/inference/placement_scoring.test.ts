import { describe, expect, it } from 'vitest'
import { scoreCandidatePlacement } from '../../inference/placement_scoring.js'

describe('scoreCandidatePlacement', () => {
  it('fails when placement score is below threshold despite support and normalized support passing', () => {
    const decision = scoreCandidatePlacement(
      'candidate_a',
      'subfamily_a',
      { support: 3, candidate_frequency: 30, downweight_value: 1 },
    )

    expect(decision.normalized_support).toBeCloseTo(0.1)
    expect(decision.placement_score).toBeCloseTo(0.33)
    expect(decision.pass).toBe(false)
    expect(decision.reason).toBe('placement_score_below_threshold')
  })

  it('passes when support, normalized support, and placement score all pass thresholds', () => {
    const decision = scoreCandidatePlacement(
      'candidate_b',
      'subfamily_b',
      { support: 4, candidate_frequency: 20, downweight_value: 1 },
    )

    expect(decision.normalized_support).toBeCloseTo(0.2)
    expect(decision.placement_score).toBeCloseTo(0.54)
    expect(decision.pass).toBe(true)
    expect(decision.reason).toBe('accepted')
  })

  it('always blocks hard excluded descriptors', () => {
    const decision = scoreCandidatePlacement(
      'candidate_c',
      'subfamily_c',
      { support: 999, candidate_frequency: 1, downweight_value: 1, hardExcluded: true },
    )

    expect(decision.pass).toBe(false)
    expect(decision.reason).toBe('hard_excluded_descriptor_blocked')
  })

  it('applies noise penalty from downweight value to placement score', () => {
    const decision = scoreCandidatePlacement(
      'candidate_d',
      'subfamily_d',
      { support: 4, candidate_frequency: 20, downweight_value: 0.25 },
    )

    expect(decision.noise_penalty).toBeCloseTo(0.75)
    expect(decision.placement_score).toBeCloseTo(0.465)
  })
})
