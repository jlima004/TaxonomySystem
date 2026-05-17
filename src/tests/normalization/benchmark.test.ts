import { describe, expect, it } from 'vitest'
import { performance } from 'node:perf_hooks'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'

describe('normalization benchmark', () => {
  it('normalizes 100k descriptors under CI-safe threshold', () => {
    const testInputs = [
      'Fresh Green',
      'ylang-ylang',
      'Mosses',
      'orange blossom',
      "Cœur d'Aldehyde",
      'fresh---green///woody',
      'Aldehydes_C12',
      'patchouli (dark)',
      'lily of the valley',
      'already_snake_case',
    ]

    const iterations = 100_000
    const start = performance.now()

    for (let i = 0; i < iterations; i++) {
      normalizeDescriptor(testInputs[i % testInputs.length] ?? '')
    }

    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(5000)
    console.log(`100k normalizations: ${elapsed.toFixed(2)}ms (${(iterations / elapsed * 1000).toFixed(0)} ops/sec)`)
  })
})
