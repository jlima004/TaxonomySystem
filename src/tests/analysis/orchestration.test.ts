import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { analyzeCorpus } from '../../analyzer/analyze_corpus.js'
import { computeFrequencyAndCoOccurrence } from '../../analyzer/cooccurrence.js'
import { computeDescriptorFrequency } from '../../analyzer/frequency.js'

type AnalysisMaterial = {
  readonly id?: string
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadFixture = async (name: string): Promise<readonly AnalysisMaterial[]> => {
  const content = await readFile(join(__dirname, `../fixtures/analysis/${name}`), 'utf8')
  return JSON.parse(content) as readonly AnalysisMaterial[]
}

describe('analyzeCorpus', () => {
  it('returns frequency, cooccurrence and aliasCandidates keys', async () => {
    const corpus = await loadFixture('tiny_corpus.json')
    const result = analyzeCorpus(corpus)

    expect(result.frequency).toBeInstanceOf(Map)
    expect(result.cooccurrence).toBeInstanceOf(Map)
    expect(Array.isArray(result.aliasCandidates)).toBe(true)
    expect(result.aliasCandidates).toHaveLength(0)
  })

  it('is deterministic across repeated calls', async () => {
    const corpus = await loadFixture('tiny_corpus.json')
    const first = analyzeCorpus(corpus)
    const second = analyzeCorpus(corpus)

    expect(Array.from(first.frequency.entries()).sort()).toEqual(Array.from(second.frequency.entries()).sort())
    expect(Array.from(first.cooccurrence.entries()).sort()).toEqual(Array.from(second.cooccurrence.entries()).sort())
    expect(first.aliasCandidates).toEqual(second.aliasCandidates)
  })

  it('does not mutate input corpus', async () => {
    const corpus = await loadFixture('tiny_corpus.json')
    const snapshot = structuredClone(corpus)

    analyzeCorpus(corpus)

    expect(corpus).toEqual(snapshot)
  })

  it('populates aliasCandidates only when alias options are provided', async () => {
    const corpus = await loadFixture('camomile_corpus.json')

    const withoutAlias = analyzeCorpus(corpus)
    expect(withoutAlias.aliasCandidates).toHaveLength(0)

    const withAlias = analyzeCorpus(corpus, {
      aliasCandidates: { minFrequency: 2, minScore: 0.85 },
    })
    expect(withAlias.aliasCandidates.length).toBeGreaterThan(0)
  })

  it('sanitizes descriptors before computing frequency and co-occurrence', () => {
    const corpus: readonly AnalysisMaterial[] = [
      { id: 'm1', olfactory: { descriptors: ['Lemon', 'at', 'Substantivity 232'] } },
      { id: 'm2', olfactory: { descriptors: ['lemon', 'bergamot', 'at'] } },
    ]

    const result = analyzeCorpus(corpus)
    expect(result.frequency.get('lemon')).toBe(2)
    expect(result.frequency.has('at')).toBe(false)
    expect(result.frequency.has('substantivity_232')).toBe(false)

    expect(result.cooccurrence.get('bergamot|lemon')).toBe(1)
    expect(result.cooccurrence.has('at|bergamot')).toBe(false)
    expect(result.cooccurrence.has('at|lemon')).toBe(false)
  })

  it('includes sanitation audit entries with raw descriptor and source material metadata', () => {
    const corpus: readonly AnalysisMaterial[] = [
      { id: 'material-1', olfactory: { descriptors: ['at', 'Lemon'] } },
    ]

    const result = analyzeCorpus(corpus)
    expect(result.sanitationAuditEntries).toContainEqual(expect.objectContaining({
      raw: 'at',
      normalized: 'at',
      reason: 'hard_exclude',
      matched_rule: 'at',
      material_id: 'material-1',
      source: 'olfactory.descriptors',
    }))
  })

  it('keeps frequency helpers aligned after sanitation', () => {
    const corpus: readonly AnalysisMaterial[] = [
      { id: 'm1', olfactory: { descriptors: ['Lemon', 'at', 'Bergamot'] } },
      { id: 'm2', olfactory: { descriptors: ['lemon', 'Substantivity 232'] } },
    ]

    const direct = computeDescriptorFrequency(corpus)
    const combined = computeFrequencyAndCoOccurrence(corpus).frequency
    expect(Array.from(direct.entries()).sort()).toEqual(Array.from(combined.entries()).sort())
  })
})
