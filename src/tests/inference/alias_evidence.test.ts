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

describe('computeAliasEvidence', () => {
  it('marks alias candidates as weak evidence only', async () => {
    const fixture = await loadFixture()
    const result = computeAliasEvidence(fixture.semantic.left, fixture.semantic.right, fixture.aliasCandidates)

    expect(result?.id).toBe('alias_evidence')
    expect(result?.weak).toBe(true)
    expect(result?.score).toBeGreaterThan(0)
    expect(result?.score).toBeLessThanOrEqual(1)
    expect(result?.evidence.aliases).toEqual(['orange_blossom|orange_blossom_absolute'])
  })

  it('does not mutate or canonicalize seed descriptors', async () => {
    const fixture = await loadFixture()
    const leftSnapshot = structuredClone(fixture.semantic.left)
    const rightSnapshot = structuredClone(fixture.semantic.right)

    const result = computeAliasEvidence(fixture.semantic.left, fixture.semantic.right, fixture.aliasCandidates)

    expect(result?.evidence.canonical_ids_unchanged).toBe(true)
    expect(fixture.semantic.left).toEqual(leftSnapshot)
    expect(fixture.semantic.right).toEqual(rightSnapshot)
    expect(fixture.semantic.left.map(profile => profile.descriptor)).toContain('orange_blossom')
  })
})
