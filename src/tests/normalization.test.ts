import { describe, it, expect } from 'vitest'
import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'

describe('normalizeDescriptor compatibility cases', () => {
  it('should remove diacritics and convert to lowercase', () => {
    expect(normalizeDescriptor('frühling')).toBe('fruhling')
    expect(normalizeDescriptor('ñandú')).toBe('nandu')
    expect(normalizeDescriptor('ÜBER')).toBe('uber')
  })

  it('should handle special ligatures', () => {
    expect(normalizeDescriptor('cœur')).toBe('coeur')
  })

  it('should strip punctuation and normalize separators', () => {
    expect(normalizeDescriptor('ylang-ylang, extra!')).toBe('ylang_ylang_extra')
    expect(normalizeDescriptor('patchouli (dark)')).toBe('patchouli_dark')
  })
})
