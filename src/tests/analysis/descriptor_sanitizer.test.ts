import { describe, expect, it } from 'vitest'
import { sanitizeDescriptor } from '../../analyzer/descriptor_sanitizer.js'

describe('sanitizeDescriptor', () => {
  it('rejects locked hard-exclude descriptors with deterministic audit payload', () => {
    expect(sanitizeDescriptor({
      raw: 'at',
      normalized: 'at',
      material_id: 'm1',
      source: 'olfactory.descriptors',
    })).toEqual({
      keep: false,
      audit: {
        raw: 'at',
        normalized: 'at',
        reason: 'hard_exclude',
        matched_rule: 'at',
        material_id: 'm1',
        source: 'olfactory.descriptors',
      },
    })
  })

  it.each([
    ['substantivity_232', '^substantivity_\\d+$'],
    ['general_comment_at_100_00_lime', '^general_comment_'],
    ['odor_strength_5', '^odor_strength_'],
    ['recommend_smelling_strip', '^recommend_smelling_'],
  ])('rejects %s via pattern %s', (normalized, expectedPattern) => {
    const result = sanitizeDescriptor({
      raw: normalized,
      normalized,
      material_id: 'm2',
      source: 'olfactory.descriptors',
    })

    expect(result).toEqual({
      keep: false,
      audit: {
        raw: normalized,
        normalized,
        reason: 'pattern_exclude',
        matched_rule: expectedPattern,
        material_id: 'm2',
        source: 'olfactory.descriptors',
      },
    })
  })

  it.each(['fruity', 'green', 'floral', 'sweet', 'herbal', 'spicy', 'fresh', 'woody', 'balsamic', 'fatty', 'waxy'])(
    'keeps valid olfactive descriptor %s',
    (normalized) => {
      expect(sanitizeDescriptor({ raw: normalized, normalized })).toEqual({ keep: true, descriptor: normalized })
    },
  )

  it('is deterministic for identical inputs', () => {
    const input = {
      raw: 'Substantivity 232',
      normalized: 'substantivity_232',
      material_id: 'm3',
      source: 'olfactory.descriptors',
    } as const

    const first = sanitizeDescriptor(input)
    const second = sanitizeDescriptor(input)
    expect(first).toEqual(second)
  })
})
