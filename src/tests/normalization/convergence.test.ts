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

  it('plural variants converge to singular', () => {
    expect(normalizeDescriptor('Woods')).toBe(normalizeDescriptor('wood'))
    expect(normalizeDescriptor('woods')).toBe(normalizeDescriptor('wood'))
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
