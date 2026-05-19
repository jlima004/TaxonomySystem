import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeTraditionScore } from '../../inference/index.js'
import type { CuratedTraditionRelation } from '../../types/inference.js'

type ScoringFixture = {
  readonly relations: readonly CuratedTraditionRelation[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const leftId = 'floral:white_floral'
const rightId = 'citrus:fresh_citrus'

const loadFixture = async (): Promise<ScoringFixture> => {
  const content = await readFile(join(__dirname, '../fixtures/inference/scoring_dimensions.json'), 'utf8')
  return JSON.parse(content) as ScoringFixture
}

describe('computeTraditionScore', () => {
  it('preserves curated relation, seed proximity, and corpus support as separated evidence', async () => {
    const fixture = await loadFixture()
    const result = computeTraditionScore(leftId, rightId, {
      curatedRelations: { version: '1.0.0', relations: fixture.relations },
      seedProximity: new Map([[`${leftId}|${rightId}`, 0.6]]),
      corpusSupport: new Map([[`${leftId}|${rightId}`, 0.4]]),
    })

    expect(result?.id).toBe('tradition')
    expect(result?.score).toBe(0.7)
    expect(result?.evidence.curated_relation).toMatchObject({ relation: 'traditional_pairing', score: 0.7 })
    expect(result?.evidence.seed_proximity).toBe(0.6)
    expect(result?.evidence.corpus_support).toBe(0.4)
  })

  it('keeps curated and seed proximity priority over conflicting corpus support', async () => {
    const fixture = await loadFixture()
    const result = computeTraditionScore(leftId, rightId, {
      curatedRelations: { version: '1.0.0', relations: fixture.relations },
      seedProximity: new Map([[`${leftId}|${rightId}`, 0.6]]),
      corpusSupport: new Map([[`${leftId}|${rightId}`, 0.95]]),
    })

    expect(result?.score).toBe(0.7)
    expect(result?.evidence).toMatchObject({ seed_proximity: 0.6, corpus_support: 0.95 })
  })

  it('returns undefined when no separated tradition evidence exists', () => {
    expect(computeTraditionScore('woody:dry_woods', 'gourmand:vanilla', {
      curatedRelations: { version: '1.0.0', relations: [] },
      seedProximity: new Map(),
      corpusSupport: new Map(),
    })).toBeUndefined()
  })

  it('rejects malformed curated relation inputs before scoring', () => {
    expect(() => computeTraditionScore(leftId, rightId, {
      curatedRelations: { version: '', relations: [] },
    })).toThrow(/version/)

    expect(() => computeTraditionScore(leftId, rightId, {
      curatedRelations: { version: '1.0.0', relations: 'bad' } as never,
    })).toThrow(/array/)

    expect(() => computeTraditionScore(leftId, rightId, {
      curatedRelations: { version: '1.0.0', relations: [null] } as never,
    })).toThrow(/relations\[0\] must be an object/)

    expect(() => computeTraditionScore(leftId, rightId, {
      curatedRelations: {
        version: '1.0.0',
        relations: [{ source_subfamily_id: '', target_subfamily_id: rightId, relation: 'bad', score: 0.5 }],
      },
    })).toThrow(/non-empty string/)

    expect(() => computeTraditionScore(leftId, rightId, {
      curatedRelations: {
        version: '1.0.0',
        relations: [{ source_subfamily_id: leftId, target_subfamily_id: rightId, relation: 'bad', score: 1.1 }],
      },
    })).toThrow(/\[0,1\]/)
  })
})
