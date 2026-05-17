import { describe, expect, it } from 'vitest'
import { normalizeUnicode } from '../../normalizer/normalize_unicode.js'

describe('normalizeUnicode', () => {
  it('removes diacritics and preserves case', () => {
    expect(normalizeUnicode('frühling')).toBe('fruhling')
    expect(normalizeUnicode('ñandú')).toBe('nandu')
    expect(normalizeUnicode('ÜBER')).toBe('UBER')
  })

  it('expands ligatures', () => {
    expect(normalizeUnicode('cœur')).toBe('coeur')
    expect(normalizeUnicode('ÆTHER')).toBe('AETHER')
  })

  it('is idempotent', () => {
    const value = 'cœur d’aldehyde'
    expect(normalizeUnicode(normalizeUnicode(value))).toBe(normalizeUnicode(value))
  })
})
