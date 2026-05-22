import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildSeedGapReviewItems, sortReviewQueue } from '../../compiler/review_queue.js'
import type { ReviewQueueItem } from '../../types/inference.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const workbookPath = join(__dirname, '../../../.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md')

const readWorkbook = (): Promise<string> => readFile(workbookPath, 'utf8')

describe('Phase 8 review dispositions', () => {
  it('represents official review buckets and disposition strings in the workbook', async () => {
    const workbook = await readWorkbook()

    for (const bucket of [
      'new descriptor candidate',
      'alias candidate',
      'subfamily gap',
      'family gap',
      'relation/accord gap',
      'reject/defer',
    ]) {
      expect(workbook).toContain(bucket)
    }

    for (const disposition of ['promote_to_seed', 'add_alias', 'create_gap', 'relation_gap', 'reject', 'defer']) {
      expect(workbook).toContain(disposition)
    }
  })

  it('requires evidence-ranked queue fields and no-promotion effect', async () => {
    const workbook = await readWorkbook()

    for (const field of [
      'frequency_signal',
      'review_type',
      'conflict_severity',
      'placement_ambiguity',
      'overloaded_subfamily_impact',
      'priority_rationale',
      'promotion_effect: none',
    ]) {
      expect(workbook).toContain(field)
    }

    expect(workbook).toContain('Ranking is priority-only')
    expect(workbook).toContain('cannot mutate curated JSON')
  })

  it('keeps review queue sorting deterministic evidence without returning seed mutations', () => {
    const items: ReviewQueueItem[] = [
      {
        type: 'seed_corpus_conflict',
        severity: 'high',
        affected: { descriptor: 'vanilla', subfamily: 'gourmand' },
        evidence: { candidate_frequency: 131, placement_score: 0.14 },
        suggested_action: 'review_candidate_placement',
        source: 'corpus',
        reason: 'manual_review_required',
      },
      {
        type: 'corpus_candidate_low_support',
        severity: 'medium',
        affected: { descriptor: 'nutty', subfamily: 'floral_rose' },
        evidence: { candidate_frequency: 271, placement_score: 0.46 },
        suggested_action: 'review_candidate_placement',
        source: 'corpus',
        reason: 'normalized_support_below_threshold',
      },
    ]

    const first = sortReviewQueue(items)
    const second = sortReviewQueue([...items].reverse())

    expect(first).toEqual(second)
    expect(first[0]).toMatchObject({
      type: 'corpus_candidate_low_support',
      suggested_action: 'review_candidate_placement',
      evidence: { candidate_frequency: 271, placement_score: 0.46 },
    })
    expect(first[0]).not.toHaveProperty('families')
    expect(first[0]).not.toHaveProperty('descriptors')
  })

  it('builds seed gap review items as review-only evidence', () => {
    const items = buildSeedGapReviewItems([
      { descriptor: 'generic_gourmand_note', corpus_count: 30, reason: 'placement_score_below_threshold' },
      { descriptor: 'vanilla', corpus_count: 131, reason: 'support_below_threshold' },
    ])

    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      type: 'seed_taxonomy_gap_suggestion',
      suggested_action: 'review_seed_taxonomy_gap',
      source: 'corpus',
      evidence: { frequency: 30, reason: 'placement_score_below_threshold' },
    })
    expect(items[0]).not.toHaveProperty('families')
    expect(items[0]).not.toHaveProperty('descriptors')
  })

  it('documents high rank and high frequency as prioritization only', async () => {
    const workbook = await readWorkbook()

    expect(workbook).toContain('high rank cannot change `manual_approval`')
    expect(workbook).toContain('frequency_signal')
    expect(workbook).toContain('promotion_effect: none')
  })
})
