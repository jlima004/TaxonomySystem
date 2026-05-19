import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeSemanticOverlap } from '../../inference/index.js'
import type { DescriptorProfile } from '../../types/inference.js'

type ScoringFixture = {
  readonly semantic: {
    readonly left: readonly DescriptorProfile[]
    readonly right: readonly DescriptorProfile[]
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadFixture = async (): Promise<ScoringFixture> => {
  const content = await readFile(join(__dirname, '../fixtures/inference/scoring_dimensions.json'), 'utf8')
  return JSON.parse(content) as ScoringFixture
}

describe('computeSemanticOverlap', () => {
  it('returns a normalized score and sorted shared descriptor evidence', async () => {
    const fixture = await loadFixture()
    const result = computeSemanticOverlap(fixture.semantic.left, fixture.semantic.right)

    expect(result.id).toBe('semantic_overlap')
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(1)
    expect(result.score).toBeCloseTo(0.4, 3)
    expect(result.evidence.shared_descriptors).toEqual(['orange_blossom', 'white_floral'])
    expect(result.evidence.shared_descriptors).toEqual([...result.evidence.shared_descriptors].sort((a, b) => a.localeCompare(b)))
  })

  it('returns zero overlap evidence when no descriptors are shared', async () => {
    const fixture = await loadFixture()
    const right = fixture.semantic.right.map(profile => ({ ...profile, descriptor: `${profile.descriptor}_other` }))
    const result = computeSemanticOverlap(fixture.semantic.left, right)

    expect(result.score).toBe(0)
    expect(result.evidence.shared_descriptors).toEqual([])
    expect(result.evidence.weighted_intersection).toBe(0)
    expect(result.evidence.weighted_union).toBeGreaterThan(0)
  })
})
