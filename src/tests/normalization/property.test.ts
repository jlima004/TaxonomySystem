import { describe, expect, it } from 'vitest'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'
import { collapseUnderscores } from '../../normalizer/collapse_underscores.js'
import { trimUnderscores } from '../../normalizer/trim_underscores.js'
import { normalizeCase } from '../../normalizer/normalize_case.js'
import { removePunctuation } from '../../normalizer/remove_punctuation.js'
import { normalizeSeparators } from '../../normalizer/normalize_separators.js'

const INPUTS = [
  'Fresh Green',
  'ylang-ylang',
  'Mosses',
  '',
  '   ',
  '!!!',
  '___',
  'fresh_green',
  'oakmoss',
  'aldehyde_c12',
  'c14_musk',
]

describe('normalizeDescriptor properties', () => {
  it('is idempotent across varied inputs', () => {
    for (const input of INPUTS) {
      const normalized = normalizeDescriptor(input)
      expect(normalizeDescriptor(normalized), `input: "${input}"`).toBe(normalized)
    }
  })

  it('is deterministic across repeated calls', () => {
    for (const input of INPUTS.slice(0, 6)) {
      const first = normalizeDescriptor(input)
      expect(normalizeDescriptor(input), `input: "${input}"`).toBe(first)
      expect(normalizeDescriptor(input), `input: "${input}"`).toBe(first)
    }
  })

  it('matches canonical charset for non-empty outputs', () => {
    const charset = /^[a-z0-9_]+$/
    for (const input of INPUTS) {
      const normalized = normalizeDescriptor(input)
      if (normalized.length > 0) {
        expect(charset.test(normalized), `input: "${input}", output: "${normalized}"`).toBe(true)
      }
    }
  })

  it('keeps empty-like inputs as empty output', () => {
    expect(normalizeDescriptor('')).toBe('')
    expect(normalizeDescriptor('   ')).toBe('')
    expect(normalizeDescriptor('!!!')).toBe('')
    expect(normalizeDescriptor('___')).toBe('')
  })

  it('has per-step idempotency for atomic functions', () => {
    expect(collapseUnderscores(collapseUnderscores('fresh___green'))).toBe(collapseUnderscores('fresh___green'))
    expect(trimUnderscores(trimUnderscores('__fresh_green__'))).toBe(trimUnderscores('__fresh_green__'))
    expect(normalizeCase(normalizeCase('FRESH_GREEN'))).toBe(normalizeCase('FRESH_GREEN'))
    expect(removePunctuation(removePunctuation('fresh_green!!!'))).toBe(removePunctuation('fresh_green!!!'))
    expect(normalizeSeparators(normalizeSeparators('fresh---green'))).toBe(normalizeSeparators('fresh---green'))
  })

  it('covers underscore collapse and trim acceptance cases', () => {
    expect(collapseUnderscores('fresh___green')).toBe('fresh_green')
    expect(collapseUnderscores('a____b____c')).toBe('a_b_c')
    expect(collapseUnderscores('clean')).toBe('clean')
    expect(trimUnderscores('_fresh_green_')).toBe('fresh_green')
    expect(trimUnderscores('___fresh___')).toBe('fresh')
    expect(trimUnderscores('fresh_green')).toBe('fresh_green')
  })

  it('does not mutate original input reference', () => {
    const input = 'Fresh Green'
    normalizeDescriptor(input)
    expect(input).toBe('Fresh Green')
  })
})
