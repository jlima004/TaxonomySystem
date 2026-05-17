import { describe, expect, it } from 'vitest'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'

describe('normalizeDescriptor smoke cases', () => {
  it('handles representative perfumistic descriptors', () => {
    const cases: Array<[string, string]> = [
      ['Fresh Green', 'fresh_green'],
      ['fresh-green', 'fresh_green'],
      ['FRESH GREEN', 'fresh_green'],
      ['orange blossom', 'orange_blossom'],
      ['lily of the valley', 'lily_of_the_valley'],
      ['Mosses', 'moss'],
      ['Woods', 'wood'],
      ['ylang-ylang', 'ylang_ylang'],
      ["Cœur d'Aldehyde", 'coeur_d_aldehyde'],
      ['Aldehydes_C12', 'aldehyde_c12'],
      ['patchouli (dark)', 'patchouli_dark'],
      ['fresh---green///woody', 'fresh_green_woody'],
      ['Oakmoss', 'oakmoss'],
      ['Tree Moss', 'tree_moss'],
      ['Sweet Orange', 'sweet_orange'],
      ['Bitter Orange', 'bitter_orange'],
      ['Rose', 'rose'],
      ['Jasmine', 'jasmine'],
      ['gas', 'gas'],
      ['citrus', 'citrus'],
      ['', ''],
      ['   ', ''],
      ['!!!', ''],
    ]

    for (const [input, expected] of cases) {
      expect(normalizeDescriptor(input), `input: "${input}"`).toBe(expected)
    }
  })
})
