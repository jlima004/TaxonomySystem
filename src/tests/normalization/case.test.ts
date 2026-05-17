import { describe, expect, it } from 'vitest'
import { normalizeCase } from '../../normalizer/normalize_case.js'

describe('normalizeCase', () => {
  it('lowercases words', () => {
    expect(normalizeCase('Fresh Green')).toBe('fresh green')
    expect(normalizeCase('YLANG-YLANG')).toBe('ylang-ylang')
  })

  it('preserves numbers', () => {
    expect(normalizeCase('C12')).toBe('c12')
  })

  it('is idempotent', () => {
    expect(normalizeCase(normalizeCase('Already Lower'))).toBe('already lower')
  })
})
