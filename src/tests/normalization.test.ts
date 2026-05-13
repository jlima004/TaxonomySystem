import { describe, it, expect } from 'vitest'
import { normalizeText } from '../normalizer/text_normalizer.js'

describe('Unicode and Punctuation Normalization', () => {
  it('should remove diacritics and convert to lowercase', () => {
    expect(normalizeText('frühling')).toBe('fruhling')
    expect(normalizeText('ñandú')).toBe('nandu')
    expect(normalizeText('ÜBER')).toBe('uber')
  })

  it('should handle special ligatures', () => {
    expect(normalizeText('cœur')).toBe('coeur')
  })

  it('should strip unwanted punctuation but keep words intact', () => {
    expect(normalizeText('ylang-ylang, extra!')).toBe('ylang-ylang extra')
    expect(normalizeText('patchouli (dark)')).toBe('patchouli dark')
  })
})
