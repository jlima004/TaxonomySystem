import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildSeedCorpusProfiles } from '../../inference/index.js'
import type { AliasCandidate, CorpusAnalysis } from '../../types/analysis.js'
import type { TaxonomySeed } from '../../types/seed.js'

type SeedFixture = {
  readonly seed: TaxonomySeed
  readonly frequency: readonly (readonly [string, number])[]
  readonly cooccurrence: readonly (readonly [string, number])[]
  readonly aliasCandidates: readonly AliasCandidate[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadFixture = async (): Promise<SeedFixture> => {
  const content = await readFile(join(__dirname, '../fixtures/inference/seed_corpus_conflict.json'), 'utf8')
  return JSON.parse(content) as SeedFixture
}

const toAnalysis = (fixture: SeedFixture): CorpusAnalysis => ({
  frequency: new Map(fixture.frequency),
  cooccurrence: new Map(fixture.cooccurrence),
  aliasCandidates: fixture.aliasCandidates,
})

describe('buildSeedCorpusProfiles', () => {
  it('preserves seed descriptors and attaches corpus evidence without mutation', async () => {
    const fixture = await loadFixture()
    const seedSnapshot = structuredClone(fixture.seed)
    const analysis = toAnalysis(fixture)
    const result = buildSeedCorpusProfiles(fixture.seed, analysis, {
      curatedNoiseDescriptors: ['note', 'nuance', 'effect', 'type', 'quality'],
      downweightValue: 0.35,
    })

    const seedProfile = result.profiles.find(profile => profile.descriptor === 'green')
    expect(seedProfile).toMatchObject({
      descriptor: 'green',
      source: 'seed',
      status: 'curated',
      corpus_count: 4,
    })
    expect(fixture.seed).toEqual(seedSnapshot)
  })

  it('emits corpus-only descriptors as reviewable candidates above frequency threshold', async () => {
    const fixture = await loadFixture()
    const result = buildSeedCorpusProfiles(fixture.seed, toAnalysis(fixture), { minCorpusFrequency: 2 })

    expect(result.inferred_descriptors).toContainEqual(expect.objectContaining({
      descriptor: 'solar',
      source: 'corpus',
      status: 'candidate',
      corpus_derived: true,
      corpus_count: 3,
    }))
    expect(result.inferred_descriptors.some(descriptor => descriptor.descriptor === 'rare_hint')).toBe(false)
  })

  it('routes seed/corpus conflicts to review_queue instead of changing seed descriptors', async () => {
    const fixture = await loadFixture()
    const result = buildSeedCorpusProfiles(fixture.seed, toAnalysis(fixture), { minCorpusFrequency: 2 })

    expect(result.review_queue).toContainEqual(expect.objectContaining({
      type: 'seed_corpus_conflict',
      affected: expect.objectContaining({ descriptor: 'green_floral', subfamily: 'floral_green' }),
      suggested_action: expect.any(String),
    }))
  })

  it('returns deterministic sorted profile and inferred descriptor arrays', async () => {
    const fixture = await loadFixture()
    const first = buildSeedCorpusProfiles(fixture.seed, toAnalysis(fixture), { minCorpusFrequency: 2 })
    const second = buildSeedCorpusProfiles(fixture.seed, toAnalysis(fixture), { minCorpusFrequency: 2 })

    expect(first).toEqual(second)
    expect(first.profiles.map(profile => `${profile.subfamily_id}:${profile.descriptor}`)).toEqual([
      'floral_green:green',
      'floral_green:note',
      'floral_white:orange_blossom',
    ])
    expect(first.inferred_descriptors.map(descriptor => descriptor.descriptor)).toEqual([
      'green_floral',
      'solar',
    ])
  })
})
