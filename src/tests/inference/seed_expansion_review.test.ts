import { describe, expect, it } from 'vitest'
import { buildSeedGapReviewItems } from '../../compiler/review_queue.js'

describe('buildSeedGapReviewItems', () => {
  it('emits review-only seed taxonomy gap suggestions for high-frequency generic candidates', () => {
    const items = buildSeedGapReviewItems([
      {
        descriptor: 'generic_fresh_note',
        corpus_count: 30,
        reason: 'placement_score_below_threshold',
      },
    ])

    expect(items.some(item => item.type === 'seed_taxonomy_gap_suggestion' || item.type === 'corpus_candidate_high_frequency_generic')).toBe(true)
    expect(items[0]?.suggested_action).toBe('review_seed_taxonomy_gap')
  })
})
