import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeDescriptorFrequency } from '../../analyzer/frequency.js'
import { normalizeDescriptor } from '../../normalizer/normalize_descriptor.js'

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

const sumUniqueDescriptors = (corpus: readonly AnalysisMaterial[]): number => {
  let total = 0
  for (const material of corpus) {
    const descriptors = new Set<string>()
    for (const raw of material.olfactory.descriptors) {
      const canonical = normalizeDescriptor(raw)
      if (canonical.length > 0) {
        descriptors.add(canonical)
      }
    }

    total += descriptors.size
  }

  return total
}

describe('computeDescriptorFrequency', () => {
  it('computes expected document frequency on tiny corpus', async () => {
    const corpus = await loadTinyCorpus()
    const frequency = computeDescriptorFrequency(corpus)

    const expected = new Map<string, number>([
      ['rose', 2],
      ['wood', 2],
      ['lily_of_the_valley', 1],
      ['fresh', 1],
      ['green', 3],
      ['orange_blossom', 2],
      ['musk', 2],
      ['woody', 1],
      ['rosewood', 1],
      ['cedar_wood', 1],
    ])

    expect(Array.from(frequency.entries()).sort()).toEqual(Array.from(expected.entries()).sort())
  })

  it('drops descriptors that normalize to empty string', () => {
    const corpus: readonly AnalysisMaterial[] = [
      { olfactory: { descriptors: ['!!!', '   ', 'rose'] } },
    ]

    const frequency = computeDescriptorFrequency(corpus)
    expect(frequency.has('')).toBe(false)
    expect(frequency.get('rose')).toBe(1)
  })

  it('deduplicates repeated descriptors within a material', () => {
    const corpus: readonly AnalysisMaterial[] = [
      { olfactory: { descriptors: ['rose', 'rose', 'rose'] } },
    ]

    const frequency = computeDescriptorFrequency(corpus)
    expect(frequency.get('rose')).toBe(1)
  })

  it('normalizes raw descriptors before counting', () => {
    const corpus: readonly AnalysisMaterial[] = [
      { olfactory: { descriptors: ['Rose', 'ROSE', 'rose'] } },
      { olfactory: { descriptors: ['rose'] } },
    ]

    const frequency = computeDescriptorFrequency(corpus)
    expect(frequency.size).toBe(1)
    expect(frequency.get('rose')).toBe(2)
  })

  it('satisfies sum invariant over unique per-material descriptors', async () => {
    const corpus = await loadTinyCorpus()
    const frequency = computeDescriptorFrequency(corpus)

    const sumOfCounts = Array.from(frequency.values()).reduce((acc, value) => acc + value, 0)
    expect(sumOfCounts).toBe(sumUniqueDescriptors(corpus))
  })

  it('is monotonic from subset to full corpus', async () => {
    const corpus = await loadTinyCorpus()
    const subset = corpus.slice(0, 3)

    const subsetFrequency = computeDescriptorFrequency(subset)
    const fullFrequency = computeDescriptorFrequency(corpus)

    for (const [descriptor, count] of subsetFrequency) {
      expect(fullFrequency.get(descriptor) ?? 0).toBeGreaterThanOrEqual(count)
    }
  })
})
