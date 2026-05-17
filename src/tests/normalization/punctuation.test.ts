import { describe, expect, it } from 'vitest'
import { removePunctuation } from '../../normalizer/remove_punctuation.js'

describe('removePunctuation', () => {
  it('removes non-word punctuation and keeps underscores', () => {
    expect(removePunctuation('patchouli_(dark)')).toBe('patchouli_dark')
    expect(removePunctuation('ylang_ylang,_extra!')).toBe('ylang_ylang_extra')
    expect(removePunctuation('!!!')).toBe('')
  })

  it('preserves numbers and uppercase', () => {
    expect(removePunctuation('C14_MUSK')).toBe('C14_MUSK')
    expect(removePunctuation('c14_musk')).toBe('c14_musk')
  })

  it('is a no-op for canonical punctuation-free input', () => {
    expect(removePunctuation('fresh_green')).toBe('fresh_green')
  })

  it('is idempotent', () => {
    const value = 'fresh_green!!!'
    expect(removePunctuation(removePunctuation(value))).toBe(removePunctuation(value))
  })
})
