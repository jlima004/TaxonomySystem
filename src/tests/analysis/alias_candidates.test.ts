import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { findAliasCandidates } from '../../analyzer/alias_candidates.js'
import { computeDescriptorFrequency } from '../../analyzer/frequency.js'
import { loadAliasSeed } from '../../loader/alias_loader.js'
import type { TaxonomySeed } from '../../types/seed.js'

type AnalysisMaterial = {
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

const hasPair = (pairs: readonly { readonly a: string; readonly b: string }[], left: string, right: string): boolean => {
  const a = left < right ? left : right
  const b = left < right ? right : left
  return pairs.some(candidate => candidate.a === a && candidate.b === b)
}

describe('findAliasCandidates', () => {
  it('detects camomile/chamomile with relaxed threshold', async () => {
    const corpus = await loadFixture('camomile_corpus.json')
    const frequency = computeDescriptorFrequency(corpus)
    const candidates = findAliasCandidates(frequency, { minFrequency: 2, minScore: 0.85 })

    const pair = candidates.find(candidate => candidate.a === 'camomile' && candidate.b === 'chamomile')
    expect(pair).toBeDefined()
    expect(pair?.score ?? 0).toBeGreaterThanOrEqual(0.888)
    expect(pair?.score ?? 0).toBeLessThanOrEqual(0.89)
    expect(pair?.algo).toBe('lev_norm')
  })

  it('does not detect camomile/chamomile with default precision threshold', async () => {
    const corpus = await loadFixture('camomile_corpus.json')
    const frequency = computeDescriptorFrequency(corpus)
    const candidates = findAliasCandidates(frequency)

    expect(hasPair(candidates, 'camomile', 'chamomile')).toBe(false)
  })

  it('rejects substring-only pair rose/rosewood', async () => {
    const corpus = await loadFixture('substring_trap_corpus.json')
    const frequency = computeDescriptorFrequency(corpus)
    const candidates = findAliasCandidates(frequency, { minFrequency: 2, minScore: 0.5 })

    expect(hasPair(candidates, 'rose', 'rosewood')).toBe(false)
  })

  it('excludes pairs already present in alias seed', async () => {
    const corpus = await loadFixture('seed_excluded_corpus.json')
    const frequency = computeDescriptorFrequency(corpus)
    const aliasSeed = await loadAliasSeed(join(__dirname, '../../../data/taxonomy/descriptor_aliases.seed.json'))

    const withSeed = findAliasCandidates(frequency, {
      minFrequency: 2,
      minScore: 0.85,
      aliasSeed,
    })
    const withoutSeed = findAliasCandidates(frequency, {
      minFrequency: 2,
      minScore: 0.85,
    })

    expect(hasPair(withoutSeed, 'patchouly', 'patchouli')).toBe(true)
    expect(hasPair(withSeed, 'patchouly', 'patchouli')).toBe(false)
  })

  it('respects minFrequency pool gate', () => {
    const frequency = new Map<string, number>([
      ['camomile', 2],
      ['chamomile', 1],
    ])

    const candidates = findAliasCandidates(frequency, { minFrequency: 2, minScore: 0.8 })
    expect(candidates).toEqual([])
  })

  it('sorts output by score desc then lex pair order', () => {
    const frequency = new Map<string, number>([
      ['camomile', 3],
      ['chamomile', 3],
      ['patchouly', 3],
      ['patchouli', 3],
      ['geranium', 3],
      ['geraniun', 3],
    ])

    const candidates = findAliasCandidates(frequency, { minFrequency: 2, minScore: 0.85 })
    expect(candidates.length).toBeGreaterThan(1)

    for (let index = 1; index < candidates.length; index++) {
      const previous = candidates[index - 1]
      const current = candidates[index]
      if (previous === undefined || current === undefined) continue

      if (previous.score === current.score) {
        const previousKey = `${previous.a}|${previous.b}`
        const currentKey = `${current.a}|${current.b}`
        expect(previousKey.localeCompare(currentKey)).toBeLessThanOrEqual(0)
      } else {
        expect(previous.score).toBeGreaterThanOrEqual(current.score)
      }
    }
  })

  it('picks suggested canonical by seed > frequency > lex', () => {
    const frequency = new Map<string, number>([
      ['camomile', 2],
      ['chamomile', 5],
    ])

    const taxonomySeed: TaxonomySeed = {
      version: '1.0.0',
      metadata: {
        created_at: '2026-05-18T00:00:00Z',
        author: 'test',
        description: 'test seed',
      },
      families: [
        {
          id: 'floral',
          name: 'Floral',
          subfamilies: [
            {
              id: 'floral_white',
              name: 'White Floral',
              descriptors: ['camomile'],
            },
          ],
        },
      ],
    }

    const candidates = findAliasCandidates(frequency, {
      minFrequency: 2,
      minScore: 0.85,
      taxonomySeed,
    })

    const pair = candidates.find(candidate => candidate.a === 'camomile' && candidate.b === 'chamomile')
    expect(pair?.suggested_canonical).toBe('camomile')
  })

  it('marks algo as lev_norm+tokens when both descriptors are multi-token', () => {
    const frequency = new Map<string, number>([
      ['lily_of_valley', 3],
      ['lily_of_the_valley', 4],
    ])

    const candidates = findAliasCandidates(frequency, {
      minFrequency: 2,
      minScore: 0.75,
      tokenOverlapFloor: 0.5,
    })

    const pair = candidates.find(candidate => candidate.a === 'lily_of_the_valley' && candidate.b === 'lily_of_valley')
    expect(pair).toBeDefined()
    expect(pair?.algo).toBe('lev_norm+tokens')
    expect(pair?.token_overlap ?? 0).toBeGreaterThanOrEqual(0.75)
  })
})
