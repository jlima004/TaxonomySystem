import { describe, expect, it } from 'vitest'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'

describe('normalization convergence', () => {
  it('fresh variants converge to one canonical value', () => {
    const variants = ['fresh-green', 'fresh green', 'fresh/green', 'fresh_green', 'FRESH GREEN', 'Fresh-Green']
    const canonical = normalizeDescriptor(variants[0] ?? '')

    for (const variant of variants) {
      expect(normalizeDescriptor(variant), `input: "${variant}"`).toBe(canonical)
    }

    expect(canonical).toBe('fresh_green')
  })

  it('separator-heavy variants converge', () => {
    const variants = ['fresh---green', 'fresh   green', 'fresh///green', 'fresh_-_green', 'fresh___green']
    for (const variant of variants) {
      expect(normalizeDescriptor(variant), `input: "${variant}"`).toBe('fresh_green')
    }
  })

  it('case, separator, and punctuation variants converge', () => {
    const variants = ['Orange Blossom', 'orange-blossom', 'ORANGE_BLOSSOM', 'orange!!!blossom', '  orange   blossom  ']
    const canonical = normalizeDescriptor(variants[0] ?? '')

    for (const variant of variants) {
      expect(normalizeDescriptor(variant), `input: "${variant}"`).toBe(canonical)
    }

    expect(canonical).toBe('orange_blossom')
  })

  it('diacritic and ligature variants converge to canonical base', () => {
    const variants = ['Coeur', 'cœur', 'COEUR', 'coeur']
    const canonical = normalizeDescriptor(variants[0] ?? '')

    for (const variant of variants) {
      expect(normalizeDescriptor(variant), `input: "${variant}"`).toBe(canonical)
    }

    expect(canonical).toBe('coeur')
    expect(normalizeDescriptor("coeur d'aldehyde")).toBe('coeur_d_aldehyde')
  })

  it('plural variants converge to singular', () => {
    const variants = ['Woods', 'woods', 'WOODS', 'wood']
    const canonical = normalizeDescriptor(variants[0] ?? '')

    for (const variant of variants) {
      expect(normalizeDescriptor(variant), `input: "${variant}"`).toBe(canonical)
    }

    expect(canonical).toBe('wood')
    expect(normalizeDescriptor('Mosses')).toBe(normalizeDescriptor('moss'))
  })

  it('protected terminals remain unchanged', () => {
    const terminals = ['gas', 'citrus', 'iris', 'anis', 'analysis', 'thesis', 'basis', 'crisis']
    for (const terminal of terminals) {
      expect(normalizeDescriptor(terminal)).toBe(terminal)
    }
  })

  it('empty-like variants converge to empty string', () => {
    const empties = ['', '   ', '!!!', '___', '---', '/ / /']
    for (const value of empties) {
      expect(normalizeDescriptor(value), `input: "${value}"`).toBe('')
    }
  })
})
