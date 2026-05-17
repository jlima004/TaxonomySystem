import { describe, expect, it } from 'vitest'
import { normalizeUnicode } from '../../normalizer/normalize_unicode.js'
import { normalizeCase } from '../../normalizer/normalize_case.js'
import { normalizeSeparators } from '../../normalizer/normalize_separators.js'
import { removePunctuation } from '../../normalizer/remove_punctuation.js'
import { collapseUnderscores } from '../../normalizer/collapse_underscores.js'
import { trimUnderscores } from '../../normalizer/trim_underscores.js'
import { singularize } from '../../normalizer/singularize.js'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'

type TraceCase = {
  readonly input: string
  readonly expected: readonly [string, string, string, string, string, string, string]
}

const traceCases: readonly TraceCase[] = [
  {
    input: 'Fresh-Green!!!',
    expected: [
      'Fresh-Green!!!',
      'fresh-green!!!',
      'fresh_green!!!',
      'fresh_green',
      'fresh_green',
      'fresh_green',
      'fresh_green',
    ],
  },
  {
    input: 'orange blossom',
    expected: [
      'orange blossom',
      'orange blossom',
      'orange_blossom',
      'orange_blossom',
      'orange_blossom',
      'orange_blossom',
      'orange_blossom',
    ],
  },
  {
    input: 'lily of the valley',
    expected: [
      'lily of the valley',
      'lily of the valley',
      'lily_of_the_valley',
      'lily_of_the_valley',
      'lily_of_the_valley',
      'lily_of_the_valley',
      'lily_of_the_valley',
    ],
  },
  {
    input: 'Mosses',
    expected: [
      'Mosses',
      'mosses',
      'mosses',
      'mosses',
      'mosses',
      'mosses',
      'moss',
    ],
  },
  {
    input: 'fresh---green///woody',
    expected: [
      'fresh---green///woody',
      'fresh---green///woody',
      'fresh_green_woody',
      'fresh_green_woody',
      'fresh_green_woody',
      'fresh_green_woody',
      'fresh_green_woody',
    ],
  },
  {
    input: "Cœur d'Aldehyde",
    expected: [
      "Coeur d'Aldehyde",
      "coeur d'aldehyde",
      'coeur_d_aldehyde',
      'coeur_d_aldehyde',
      'coeur_d_aldehyde',
      'coeur_d_aldehyde',
      'coeur_d_aldehyde',
    ],
  },
  {
    input: 'Aldehydes_C12',
    expected: [
      'Aldehydes_C12',
      'aldehydes_c12',
      'aldehydes_c12',
      'aldehydes_c12',
      'aldehydes_c12',
      'aldehydes_c12',
      'aldehyde_c12',
    ],
  },
]

const applyTrace = (input: string): readonly [string, string, string, string, string, string, string] => {
  const step1 = normalizeUnicode(input)
  const step2 = normalizeCase(step1)
  const step3 = normalizeSeparators(step2)
  const step4 = removePunctuation(step3)
  const step5 = collapseUnderscores(step4)
  const step6 = trimUnderscores(step5)
  const step7 = singularize(step6)

  return [step1, step2, step3, step4, step5, step6, step7]
}

describe('normalization pipeline trace', () => {
  for (const { input, expected } of traceCases) {
    describe(`Pipeline trace: "${input}"`, () => {
      it('step 1 - normalizeUnicode', () => {
        expect(normalizeUnicode(input)).toBe(expected[0])
      })

      it('step 2 - normalizeCase', () => {
        expect(normalizeCase(expected[0])).toBe(expected[1])
      })

      it('step 3 - normalizeSeparators', () => {
        expect(normalizeSeparators(expected[1])).toBe(expected[2])
      })

      it('step 4 - removePunctuation', () => {
        expect(removePunctuation(expected[2])).toBe(expected[3])
      })

      it('step 5 - collapseUnderscores', () => {
        expect(collapseUnderscores(expected[3])).toBe(expected[4])
      })

      it('step 6 - trimUnderscores', () => {
        expect(trimUnderscores(expected[4])).toBe(expected[5])
      })

      it('step 7 - singularize', () => {
        expect(singularize(expected[5])).toBe(expected[6])
      })

      it('final - matches normalizeDescriptor output', () => {
        expect(applyTrace(input)[6]).toBe(normalizeDescriptor(input))
      })
    })
  }
})
