import { describe, expect, it } from 'vitest'
import { normalizeSeparators } from '../../normalizer/normalize_separators.js'

describe('normalizeSeparators', () => {
  it('normalizes common separators to underscore', () => {
    expect(normalizeSeparators('fresh green')).toBe('fresh_green')
    expect(normalizeSeparators('fresh-green')).toBe('fresh_green')
    expect(normalizeSeparators('fresh/green')).toBe('fresh_green')
    expect(normalizeSeparators('fresh---green///woody')).toBe('fresh_green_woody')
  })

  it('normalizes typographic apostrophes and unicode dashes', () => {
    expect(normalizeSeparators("coeur d'aldehyde")).toBe('coeur_d_aldehyde')
    expect(normalizeSeparators('coeur d’aldehyde')).toBe('coeur_d_aldehyde')
    expect(normalizeSeparators('coeur ‘aldehyde')).toBe('coeur_aldehyde')
    expect(normalizeSeparators('coeur ‛aldehyde')).toBe('coeur_aldehyde')
    expect(normalizeSeparators('fresh–green')).toBe('fresh_green')
    expect(normalizeSeparators('fresh—green')).toBe('fresh_green')
  })

  it('leaves underscores untouched for the collapse step', () => {
    expect(normalizeSeparators('fresh_-_green')).toBe('fresh___green')
    expect(normalizeSeparators('already_snake')).toBe('already_snake')
  })

  it('is idempotent', () => {
    expect(normalizeSeparators(normalizeSeparators('fresh---green///woody'))).toBe('fresh_green_woody')
  })
})
