import { describe, expect, it } from 'vitest'
import { normalizeUnicode } from '../../normalizer/normalize_unicode.js'
import { normalizeCase } from '../../normalizer/normalize_case.js'
import { normalizeSeparators } from '../../normalizer/normalize_separators.js'
import { removePunctuation } from '../../normalizer/remove_punctuation.js'
import { collapseUnderscores } from '../../normalizer/collapse_underscores.js'
import { trimUnderscores } from '../../normalizer/trim_underscores.js'
import { singularize } from '../../normalizer/singularize.js'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'

const runPipeline = (input: string): string => {
  const step1 = normalizeUnicode(input)
  const step2 = normalizeCase(step1)
  const step3 = normalizeSeparators(step2)
  const step4 = removePunctuation(step3)
  const step5 = collapseUnderscores(step4)
  const step6 = trimUnderscores(step5)
  return singularize(step6)
}

describe('normalization pipeline trace', () => {
  it('tracks Fresh-Green!!! through each stage', () => {
    const input = 'Fresh-Green!!!'
    expect(normalizeUnicode(input)).toBe('Fresh-Green!!!')
    expect(normalizeCase(normalizeUnicode(input))).toBe('fresh-green!!!')
    expect(normalizeSeparators(normalizeCase(normalizeUnicode(input)))).toBe('fresh_green!!!')
    expect(removePunctuation('fresh_green!!!')).toBe('fresh_green')
    expect(collapseUnderscores('fresh_green')).toBe('fresh_green')
    expect(trimUnderscores('fresh_green')).toBe('fresh_green')
    expect(singularize('fresh_green')).toBe('fresh_green')
    expect(runPipeline(input)).toBe(normalizeDescriptor(input))
  })

  it('tracks Cœur d\'Aldehyde through each stage', () => {
    const input = "Cœur d'Aldehyde"
    expect(normalizeUnicode(input)).toBe("Coeur d'Aldehyde")
    expect(normalizeCase(normalizeUnicode(input))).toBe("coeur d'aldehyde")
    expect(normalizeSeparators("coeur d'aldehyde")).toBe('coeur_d_aldehyde')
    expect(removePunctuation('coeur_d_aldehyde')).toBe('coeur_d_aldehyde')
    expect(collapseUnderscores('coeur_d_aldehyde')).toBe('coeur_d_aldehyde')
    expect(trimUnderscores('coeur_d_aldehyde')).toBe('coeur_d_aldehyde')
    expect(singularize('coeur_d_aldehyde')).toBe('coeur_d_aldehyde')
    expect(runPipeline(input)).toBe(normalizeDescriptor(input))
  })
})
