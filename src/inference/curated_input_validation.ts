import { encodePairKey } from '../analyzer/pair_key.js'
import type {
  AccordMapInput,
  CuratedAccordReference,
  CuratedRelationsInput,
  CuratedTraditionRelation,
} from '../types/inference.js'

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> => {
  return typeof value === 'object' && value !== null
}

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

const assertScore = (score: unknown, path: string): number => {
  if (typeof score !== 'number' || Number.isNaN(score) || score < 0 || score > 1) {
    throw new Error(`${path} score must be a number in [0,1]`)
  }
  return score
}

const assertNonEmptyString = (value: unknown, path: string): string => {
  if (!isNonEmptyString(value)) {
    throw new Error(`${path} must be a non-empty string`)
  }
  return value
}

export const makeSubfamilyPairKey = (leftId: string, rightId: string): string => encodePairKey(leftId, rightId)

export const validateCuratedRelationsInput = (input: CuratedRelationsInput): readonly CuratedTraditionRelation[] => {
  if (!isRecord(input) || !isNonEmptyString(input.version)) {
    throw new Error('curated relations input must include version')
  }
  if (!Array.isArray(input.relations)) {
    throw new Error('curated relations input relations must be an array')
  }

  return input.relations.map((relation, index): CuratedTraditionRelation => ({
    source_subfamily_id: assertNonEmptyString(relation.source_subfamily_id, `relations[${index}].source_subfamily_id`),
    target_subfamily_id: assertNonEmptyString(relation.target_subfamily_id, `relations[${index}].target_subfamily_id`),
    relation: assertNonEmptyString(relation.relation, `relations[${index}].relation`),
    score: assertScore(relation.score, `relations[${index}]`),
    ...(relation.evidence !== undefined ? { evidence: assertNonEmptyString(relation.evidence, `relations[${index}].evidence`) } : {}),
  }))
}

export const validateAccordMapInput = (input: AccordMapInput): readonly CuratedAccordReference[] => {
  if (!isRecord(input) || !isNonEmptyString(input.version)) {
    throw new Error('accord map input must include version')
  }
  if (!Array.isArray(input.accords)) {
    throw new Error('accord map input accords must be an array')
  }

  return input.accords.map((accord, index): CuratedAccordReference => ({
    source_subfamily_id: assertNonEmptyString(accord.source_subfamily_id, `accords[${index}].source_subfamily_id`),
    target_subfamily_id: assertNonEmptyString(accord.target_subfamily_id, `accords[${index}].target_subfamily_id`),
    accord: assertNonEmptyString(accord.accord, `accords[${index}].accord`),
    score: assertScore(accord.score, `accords[${index}]`),
    ...(accord.reference !== undefined ? { reference: assertNonEmptyString(accord.reference, `accords[${index}].reference`) } : {}),
  }))
}
