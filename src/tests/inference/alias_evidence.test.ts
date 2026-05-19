import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeAliasEvidence } from '../../inference/index.js'
import type { AliasCandidate } from '../../types/analysis.js'
import type { DescriptorProfile } from '../../types/inference.js'

type ScoringFixture = {
  readonly semantic: {
    readonly left: readonly DescriptorProfile[]
    readonly right: readonly DescriptorProfile[]
  }
  readonly aliasCandidates: readonly AliasCandidate[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadFixture = async (): Promise<ScoringFixture> => {
  const content = await readFile(join(__dirname, '../fixtures/inference/scoring_dimensions.json'), 'utf8')
  return JSON.parse(content) as ScoringFixture
}

const descriptorProfile = (descriptor: string): DescriptorProfile => ({
  family_id: 'test',
  subfamily_id: `test:${descriptor}`,
  descriptor,
  source: 'seed',
  status: 'curated',
  weight: 1,
  corpus_count: 1,
  evidence: {},
})

const aliasCandidate = (a: string, b: string): AliasCandidate => ({
  a,
  b,
  score: 1,
  algo: 'lev_norm',
  frequencies: { a: 1, b: 1 },
})

describe('computeAliasEvidence', () => {
  it('marks alias candidates as weak evidence only', async () => {
    const fixture = await loadFixture()
    const result = computeAliasEvidence(
      fixture.semantic.left,
      [...fixture.semantic.right, descriptorProfile('orange_blossom_absolute')],
      fixture.aliasCandidates,
    )

    expect(result?.id).toBe('alias_evidence')
    expect(result?.weak).toBe(true)
    expect(result?.score).toBeGreaterThan(0)
    expect(result?.score).toBeLessThanOrEqual(1)
    expect(result?.evidence.aliases).toEqual(['orange_blossom|orange_blossom_absolute'])
  })

  it('does not mutate or canonicalize seed descriptors', async () => {
    const fixture = await loadFixture()
    const rightProfile = [...fixture.semantic.right, descriptorProfile('orange_blossom_absolute')]
    const leftSnapshot = structuredClone(fixture.semantic.left)
    const rightSnapshot = structuredClone(rightProfile)

    const result = computeAliasEvidence(fixture.semantic.left, rightProfile, fixture.aliasCandidates)

    expect(result?.evidence.canonical_ids_unchanged).toBe(true)
    expect(fixture.semantic.left).toEqual(leftSnapshot)
    expect(rightProfile).toEqual(rightSnapshot)
    expect(fixture.semantic.left.map(profile => profile.descriptor)).toContain('orange_blossom')
  })

  it('does not credit aliases wholly within the left profile', () => {
    const result = computeAliasEvidence(
      [descriptorProfile('left_a'), descriptorProfile('left_b')],
      [descriptorProfile('right_a')],
      [aliasCandidate('left_a', 'left_b')],
    )

    expect(result).toBeUndefined()
  })

  it('does not credit aliases wholly within the right profile', () => {
    const result = computeAliasEvidence(
      [descriptorProfile('left_a')],
      [descriptorProfile('right_a'), descriptorProfile('right_b')],
      [aliasCandidate('right_a', 'right_b')],
    )

    expect(result).toBeUndefined()
  })
})
