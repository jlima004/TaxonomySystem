import { performance } from 'node:perf_hooks'
import { describe, expect, it } from 'vitest'
import { analyzeCorpus } from '../../analyzer/analyze_corpus.js'
import { generateSyntheticCorpus } from './_fixtures/generate.js'

const CI_SAFE_ANALYSIS_5K_CEILING_MS = 1500

describe('analysis stress benchmark', () => {
  it('analyzes 5k synthetic materials under CI-safe ceiling', () => {
    const corpus = generateSyntheticCorpus({ materials: 5000, seed: 42 })

    const start = performance.now()
    const analysis = analyzeCorpus(corpus)
    const elapsed = performance.now() - start

    expect(analysis.frequency.size).toBeGreaterThan(0)
    expect(analysis.cooccurrence.size).toBeGreaterThan(0)
    expect(elapsed).toBeLessThan(CI_SAFE_ANALYSIS_5K_CEILING_MS)

    console.log(
      `analysis(5k): ${elapsed.toFixed(2)}ms ` +
        `(ceiling ${CI_SAFE_ANALYSIS_5K_CEILING_MS}ms)`,
    )
  })
})
