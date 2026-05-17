import { describe, expect, it } from 'vitest'
import { normalizeSeparators } from '../../normalizer/normalize_separators.js'

describe('normalizeSeparators', () => {
  it('normalizes common separators to underscore', () => {
    expect(normalizeSeparators('fresh green')).toBe('fresh_green')
    expect(normalizeSeparators('fresh-green')).toBe('fresh_green')
    expect(normalizeSeparators('fresh/green')).toBe('fresh_green')
  })

  it('normalizes typographic apostrophes and unicode dashes', () => {
    expect(normalizeSeparators("coeur d'aldehyde")).toBe('coeur_d_aldehyde')
    expect(normalizeSeparators('coeur d’aldehyde')).toBe('coeur_d_aldehyde')
    expect(normalizeSeparators('fresh–green')).toBe('fresh_green')
    expect(normalizeSeparators('fresh—green')).toBe('fresh_green')
  })

  it('is idempotent', () => {
    expect(normalizeSeparators(normalizeSeparators('fresh---green///woody'))).toBe('fresh_green_woody')
  })
})
