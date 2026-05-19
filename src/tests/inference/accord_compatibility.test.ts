import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeAccordCompatibility } from '../../inference/index.js'
import type { CuratedAccordReference } from '../../types/inference.js'

type ScoringFixture = {
  readonly accords: readonly CuratedAccordReference[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const leftId = 'floral:white_floral'
const rightId = 'citrus:fresh_citrus'

const loadFixture = async (): Promise<ScoringFixture> => {
  const content = await readFile(join(__dirname, '../fixtures/inference/scoring_dimensions.json'), 'utf8')
  return JSON.parse(content) as ScoringFixture
}

describe('computeAccordCompatibility', () => {
  it('returns normalized accord compatibility from explicit input data', async () => {
    const fixture = await loadFixture()
    const result = computeAccordCompatibility(leftId, rightId, { version: '1.0.0', accords: fixture.accords })

    expect(result?.id).toBe('accord_compatibility')
    expect(result?.score).toBe(0.8)
    expect(result?.score).toBeGreaterThanOrEqual(0)
    expect(result?.score).toBeLessThanOrEqual(1)
    expect(result?.evidence.accord_reference).toMatchObject({ accord: 'fresh_floral_citrus' })
  })

  it('returns undefined for missing accord entries instead of zero', async () => {
    const fixture = await loadFixture()
    const result = computeAccordCompatibility('woody:dry_woods', 'gourmand:vanilla', { version: '1.0.0', accords: fixture.accords })

    expect(result).toBeUndefined()
    expect(result).not.toBe(0)
  })

  it('rejects malformed accord input maps before scoring', () => {
    expect(() => computeAccordCompatibility(leftId, rightId, { version: '', accords: [] })).toThrow(/version/)
    expect(() => computeAccordCompatibility(leftId, rightId, { version: '1.0.0', accords: 'bad' } as never)).toThrow(/array/)
    expect(() => computeAccordCompatibility(leftId, rightId, { version: '1.0.0', accords: [42] } as never)).toThrow(/accords\[0\] must be an object/)
    expect(() => computeAccordCompatibility(leftId, rightId, {
      version: '1.0.0',
      accords: [{ source_subfamily_id: leftId, target_subfamily_id: '', accord: 'bad', score: 0.5 }],
    })).toThrow(/non-empty string/)
    expect(() => computeAccordCompatibility(leftId, rightId, {
      version: '1.0.0',
      accords: [{ source_subfamily_id: leftId, target_subfamily_id: rightId, accord: 'bad', score: -0.1 }],
    })).toThrow(/\[0,1\]/)
  })
})
