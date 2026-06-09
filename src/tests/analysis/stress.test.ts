import { performance } from 'node:perf_hooks'
import { describe, expect, it } from 'vitest'
import { analyzeCorpus } from '../../analyzer/analyze_corpus.js'
import { generateSyntheticCorpus } from './_fixtures/generate.js'

const ANALYSIS_5K_MATERIALS = 5000
const LOCAL_ANALYSIS_5K_CEILING_MS = 1500
const CI_ANALYSIS_5K_CEILING_MS = 3000
const ANALYSIS_STRESS_MODE = process.env['CI'] === 'true' ? 'ci' : 'local'
const ANALYSIS_5K_CEILING_MS =
  ANALYSIS_STRESS_MODE === 'ci'
    ? CI_ANALYSIS_5K_CEILING_MS
    : LOCAL_ANALYSIS_5K_CEILING_MS

describe('analysis stress benchmark', () => {
  it('analyzes 5k synthetic materials under CI-safe ceiling', () => {
    const corpus = generateSyntheticCorpus({
      materials: ANALYSIS_5K_MATERIALS,
      seed: 42,
    })

    const start = performance.now()
    const analysis = analyzeCorpus(corpus)
    const elapsed = performance.now() - start

    expect(analysis.frequency.size).toBeGreaterThan(0)
    expect(analysis.cooccurrence.size).toBeGreaterThan(0)
    expect(elapsed).toBeLessThan(ANALYSIS_5K_CEILING_MS)

    console.log(
      `analysis(5k) [${ANALYSIS_STRESS_MODE}]: ${elapsed.toFixed(2)}ms ` +
        `(ceiling ${ANALYSIS_5K_CEILING_MS}ms)`,
    )
  })
})
