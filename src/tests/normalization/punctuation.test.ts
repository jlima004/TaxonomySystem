import { describe, expect, it } from 'vitest'
import { removePunctuation } from '../../normalizer/remove_punctuation.js'

describe('removePunctuation', () => {
  it('removes non-word punctuation and keeps underscores', () => {
    expect(removePunctuation('patchouli_(dark)')).toBe('patchouli_dark')
    expect(removePunctuation('ylang_ylang,_extra!')).toBe('ylang_ylang_extra')
  })

  it('preserves numbers and uppercase', () => {
    expect(removePunctuation('C14_MUSK')).toBe('C14_MUSK')
  })

  it('is idempotent', () => {
    const value = 'fresh_green!!!'
    expect(removePunctuation(removePunctuation(value))).toBe(removePunctuation(value))
  })
})
