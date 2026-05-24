import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeAccordCompatibility } from '../../inference/accord_compatibility.js'
import { computeTraditionScore } from '../../inference/tradition_score.js'
import {
  validateAccordMapInput,
  validateCuratedRelationsInput,
} from '../../inference/curated_input_validation.js'
import type { AccordMapInput, CuratedRelationsInput } from '../../types/inference.js'

type SeedSubfamily = {
  readonly id: string
}

type SeedFamily = {
  readonly subfamilies: readonly SeedSubfamily[]
}

type TaxonomySeed = {
  readonly families: readonly SeedFamily[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, '../../..')

const taxonomySeedV2Path = join(repoRoot, 'data/taxonomy/taxonomy-seed.v2.json')
const curatedRelationsV2Path = join(repoRoot, 'data/inference/curated_relations.v2.json')
const accordMapV2Path = join(repoRoot, 'data/inference/accord_map.v2.json')
const workbookPath = join(repoRoot, '.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md')

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T

const loadOptionalJson = <T>(path: string, fallback: T): T => {
  return existsSync(path) ? readJson<T>(path) : fallback
}

const seedSubfamilyIds = (): ReadonlySet<string> => {
  const seed = readJson<TaxonomySeed>(taxonomySeedV2Path)
  return new Set(seed.families.flatMap(family => family.subfamilies.map(subfamily => subfamily.id)))
}

const approvedV2SubfamilyIds = (): readonly string[] => {
  const workbook = readFileSync(workbookPath, 'utf8')
  const approvedBlocks = workbook.split(/\n### /).filter(block => {
    return block.includes('manual_approval`: approved') && block.includes('primary_disposition`: `promote_to_seed`')
  })

  return approvedBlocks
    .map(block => block.match(/`subfamily_id`: `([^`]+)`/u)?.[1])
    .filter((subfamilyId): subfamilyId is string => subfamilyId !== undefined)
}

const inlineRelationsFixture: CuratedRelationsInput = {
  version: '2.0.0',
  relations: [
    {
      source_subfamily_id: 'floral_rose',
      target_subfamily_id: 'floral_white',
      relation: 'same_family_tradition',
      score: 0.85,
      evidence: 'manual_fixture_validates_v2_relation_contract',
    },
  ],
}

const inlineAccordFixture: AccordMapInput = {
  version: '2.0.0',
  accords: [
    {
      source_subfamily_id: 'citrus_fresh',
      target_subfamily_id: 'floral_white',
      accord: 'compatible_accord_pair',
      score: 0.7,
      reference: 'manual_fixture_validates_v2_accord_contract',
    },
  ],
}

const relationsInput = (): CuratedRelationsInput => loadOptionalJson(curatedRelationsV2Path, inlineRelationsFixture)
const accordInput = (): AccordMapInput => loadOptionalJson(accordMapV2Path, inlineAccordFixture)
const hasV2InferenceFiles = (): boolean => existsSync(curatedRelationsV2Path) && existsSync(accordMapV2Path)

const approvedRound3RelationPairs = [
  ['amber', 'balsamic_resin', 'same_family_tradition', 0.85, 'r3-relation-001'],
  ['musky', 'leathery', 'same_family_tradition', 0.8, 'r3-relation-006'],
  ['fresh_spice', 'warm_spice', 'same_family_tradition', 0.8, 'r3-relation-011'],
] as const

const pendingRound3RelationPairs = [
  ['balsamic_resin', 'vanilla', 'r3-relation-002'],
  ['amber', 'vanilla', 'r3-relation-003'],
  ['balsamic_resin', 'woody_dry', 'r3-relation-004'],
  ['amber', 'warm_spice', 'r3-relation-005'],
  ['musky', 'floral_rose', 'r3-relation-007'],
  ['musky', 'vanilla', 'r3-relation-008'],
  ['leathery', 'woody_dry', 'r3-relation-009'],
  ['leathery', 'balsamic_resin', 'r3-relation-010'],
  ['fresh_spice', 'citrus_fresh', 'r3-relation-012'],
] as const

const assertManualScores = (scores: readonly number[]): void => {
  for (const score of scores) {
    expect(typeof score).toBe('number')
    expect(Number.isNaN(score)).toBe(false)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(1)
  }
}

const hasPair = (
  sourceSubfamilyId: string,
  targetSubfamilyId: string,
  candidateSourceSubfamilyId: string,
  candidateTargetSubfamilyId: string,
): boolean => {
  return (
    (sourceSubfamilyId === candidateSourceSubfamilyId && targetSubfamilyId === candidateTargetSubfamilyId) ||
    (sourceSubfamilyId === candidateTargetSubfamilyId && targetSubfamilyId === candidateSourceSubfamilyId)
  )
}

describe('v2 curated relation and accord inputs', () => {
  it('validates v2 relation and accord inputs or reusable fixtures with existing validators', () => {
    const relations = validateCuratedRelationsInput(relationsInput())
    const accords = validateAccordMapInput(accordInput())

    expect(relations.length).toBeGreaterThan(0)
    expect(accords.length).toBeGreaterThan(0)
    assertManualScores(relations.map(relation => relation.score))
    assertManualScores(accords.map(accord => accord.score))
  })

  it('checks every relation and accord endpoint against v2 subfamily IDs', () => {
    const subfamilyIds = seedSubfamilyIds()
    const relations = validateCuratedRelationsInput(relationsInput())
    const accords = validateAccordMapInput(accordInput())

    for (const relation of relations) {
      expect(subfamilyIds.has(relation.source_subfamily_id), relation.source_subfamily_id).toBe(true)
      expect(subfamilyIds.has(relation.target_subfamily_id), relation.target_subfamily_id).toBe(true)
    }

    for (const accord of accords) {
      expect(subfamilyIds.has(accord.source_subfamily_id), accord.source_subfamily_id).toBe(true)
      expect(subfamilyIds.has(accord.target_subfamily_id), accord.target_subfamily_id).toBe(true)
    }
  })

  it('requires approval traceability for records and explicit workbook gaps for unscored v2 subfamilies', () => {
    const workbook = readFileSync(workbookPath, 'utf8')
    const relations = validateCuratedRelationsInput(relationsInput())
    const accords = validateAccordMapInput(accordInput())
    const approvedSubfamilyIds = approvedV2SubfamilyIds()

    for (const relation of relations) {
      expect(relation.score, `${relation.source_subfamily_id}->${relation.target_subfamily_id}`).not.toBe(0)
      expect(relation.evidence).toMatch(/manual|approved|phase_7|phase_8|workbook|fixture/u)
      if (hasV2InferenceFiles()) expect(workbook).toContain(relation.evidence ?? '')
    }

    for (const accord of accords) {
      expect(accord.score, `${accord.source_subfamily_id}->${accord.target_subfamily_id}`).not.toBe(0)
      expect(accord.reference).toMatch(/manual|approved|phase_7|phase_8|workbook|fixture/u)
      if (hasV2InferenceFiles()) expect(workbook).toContain(accord.reference ?? '')
    }

    for (const subfamilyId of approvedSubfamilyIds) {
      const hasRelation = relations.some(relation => {
        return relation.source_subfamily_id === subfamilyId || relation.target_subfamily_id === subfamilyId
      })
      const hasAccord = accords.some(accord => {
        return accord.source_subfamily_id === subfamilyId || accord.target_subfamily_id === subfamilyId
      })

      if (!hasRelation) {
        expect(workbook).toMatch(new RegExp(`${subfamilyId}[\\s\\S]*(relation_gap|relation gap)`, 'u'))
      }
      if (!hasAccord) {
        expect(workbook).toMatch(new RegExp(`${subfamilyId}[\\s\\S]*(accord_gap|accord gap|relation/accord)`, 'u'))
      }
    }
  })

  it('applies only complete approved Round 3 relation records with workbook traceability', () => {
    const workbook = readFileSync(workbookPath, 'utf8')
    const subfamilyIds = seedSubfamilyIds()
    const relations = validateCuratedRelationsInput(relationsInput())

    for (const [sourceSubfamilyId, targetSubfamilyId, relationType, score, approvalId] of approvedRound3RelationPairs) {
      expect(subfamilyIds.has(sourceSubfamilyId), sourceSubfamilyId).toBe(true)
      expect(subfamilyIds.has(targetSubfamilyId), targetSubfamilyId).toBe(true)
      expect(workbook).toContain(`### ${approvalId}`)
      expect(workbook).toContain('- `round`: phase_10_round_3')
      expect(workbook).toContain('- `manual_approval`: approved')
      expect(workbook).toContain('- `primary_disposition`: approve_relation_accord')
      expect(workbook).toContain('- `rationale`:')
      expect(workbook).toContain('- `evidence`:')

      const relation = relations.find(candidate => {
        return (
          hasPair(
            sourceSubfamilyId,
            targetSubfamilyId,
            candidate.source_subfamily_id,
            candidate.target_subfamily_id,
          ) && candidate.evidence === approvalId
        )
      })

      expect(relation, approvalId).toBeDefined()
      expect(relation?.relation).toBe(relationType)
      expect(relation?.score).toBe(score)
      expect(relation?.score).not.toBe(0)
    }

    for (const [sourceSubfamilyId, targetSubfamilyId, approvalId] of pendingRound3RelationPairs) {
      const relation = relations.find(candidate => {
        return (
          hasPair(sourceSubfamilyId, targetSubfamilyId, candidate.source_subfamily_id, candidate.target_subfamily_id) &&
          candidate.evidence === approvalId
        )
      })

      expect(relation, `${approvalId} must remain absent until approved`).toBeUndefined()
    }
  })

  it('keeps missing relation and accord neutral instead of encoding fake zero scores', () => {
    const relations = relationsInput()
    const accords = accordInput()
    const tradition = computeTraditionScore('vanilla', 'woody_mossy', { curatedRelations: relations })
    const accord = computeAccordCompatibility('vanilla', 'woody_mossy', accords)

    expect(tradition).toBeUndefined()
    expect(accord).toBeUndefined()
    expect(JSON.stringify(relations)).not.toMatch(/"score":0(?:[,}])/u)
    expect(JSON.stringify(accords)).not.toMatch(/"score":0(?:[,}])/u)
  })
})
