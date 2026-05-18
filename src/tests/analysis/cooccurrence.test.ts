import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  computeCoOccurrence,
  computeFrequencyAndCoOccurrence,
} from '../../analyzer/cooccurrence.js'
import { computeDescriptorFrequency } from '../../analyzer/frequency.js'
import { decodePairKey, encodePairKey } from '../../analyzer/pair_key.js'

type AnalysisMaterial = {
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadTinyCorpus = async (): Promise<readonly AnalysisMaterial[]> => {
  const content = await readFile(join(__dirname, '../fixtures/analysis/tiny_corpus.json'), 'utf8')
  return JSON.parse(content) as readonly AnalysisMaterial[]
}

describe('co-occurrence analysis', () => {
  it('computes expected sparse co-occurrence edges on tiny corpus', async () => {
    const corpus = await loadTinyCorpus()
    const cooccurrence = computeCoOccurrence(corpus)

    const expected = new Map<string, number>([
      ['fresh|green', 1],
      ['fresh|lily_of_the_valley', 1],
      ['green|lily_of_the_valley', 1],
      ['musk|orange_blossom', 1],
      ['green|orange_blossom', 1],
      ['green|rose', 1],
      ['orange_blossom|rose', 1],
      ['cedar_wood|rosewood', 1],
      ['cedar_wood|woody', 1],
      ['rosewood|woody', 1],
      ['green|musk', 1],
      ['green|wood', 1],
      ['musk|wood', 1],
      ['rose|wood', 1],
    ])

    expect(Array.from(cooccurrence.entries()).sort()).toEqual(Array.from(expected.entries()).sort())
  })

  it('never emits self-pairs', async () => {
    const corpus = await loadTinyCorpus()
    const cooccurrence = computeCoOccurrence(corpus)

    for (const [key] of cooccurrence) {
      const [a, b] = decodePairKey(key)
      expect(a).not.toBe(b)
    }
  })

  it('only emits positive counts', async () => {
    const corpus = await loadTinyCorpus()
    const cooccurrence = computeCoOccurrence(corpus)

    for (const value of cooccurrence.values()) {
      expect(value).toBeGreaterThan(0)
    }
  })

  it('is invariant to descriptor ordering in each material', async () => {
    const corpus = await loadTinyCorpus()
    const shuffled = corpus.map(material => ({
      olfactory: {
        descriptors: [...material.olfactory.descriptors].reverse(),
      },
    }))

    const first = computeCoOccurrence(corpus)
    const second = computeCoOccurrence(shuffled)
    expect(Array.from(first.entries()).sort()).toEqual(Array.from(second.entries()).sort())
  })

  it('round-trips pair key helpers', () => {
    const key = encodePairKey('camomile', 'chamomile')
    expect(key).toBe('camomile|chamomile')

    const decoded = decodePairKey(key)
    expect(decoded).toEqual(['camomile', 'chamomile'])
  })

  it('normalizes descriptors before pairing', () => {
    const corpus: readonly AnalysisMaterial[] = [
      { olfactory: { descriptors: ['Rose', 'wood'] } },
      { olfactory: { descriptors: ['rose', 'wood'] } },
    ]

    const cooccurrence = computeCoOccurrence(corpus)
    expect(cooccurrence.get('rose|wood')).toBe(2)
  })

  it('single-pass and standalone implementations are equivalent', async () => {
    const corpus = await loadTinyCorpus()
    const singlePass = computeFrequencyAndCoOccurrence(corpus)

    expect(Array.from(singlePass.frequency.entries()).sort()).toEqual(
      Array.from(computeDescriptorFrequency(corpus).entries()).sort(),
    )
    expect(Array.from(singlePass.cooccurrence.entries()).sort()).toEqual(
      Array.from(computeCoOccurrence(corpus).entries()).sort(),
    )
  })
})
