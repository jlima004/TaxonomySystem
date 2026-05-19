import type { TraditionEvidence, TraditionScore, TraditionScoreContext } from '../types/inference.js'
import { clamp01, makeSubfamilyPairKey, validateCuratedRelationsInput } from './curated_input_validation.js'

const findCuratedRelation = (
  leftId: string,
  rightId: string,
  context: TraditionScoreContext,
) => {
  if (context.curatedRelations === undefined) return undefined
  const relations = validateCuratedRelationsInput(context.curatedRelations)
  return relations.find(relation => {
    return (relation.source_subfamily_id === leftId && relation.target_subfamily_id === rightId)
      || (relation.source_subfamily_id === rightId && relation.target_subfamily_id === leftId)
  })
}

export const computeTraditionScore = (
  leftId: string,
  rightId: string,
  context: TraditionScoreContext = {},
): TraditionScore | undefined => {
  const pairKey = makeSubfamilyPairKey(leftId, rightId)
  const orderedPairKey = `${leftId}|${rightId}`
  const reversedPairKey = `${rightId}|${leftId}`
  const curatedRelation = findCuratedRelation(leftId, rightId, context)
  const seedProximity = context.seedProximity?.get(pairKey)
    ?? context.seedProximity?.get(orderedPairKey)
    ?? context.seedProximity?.get(reversedPairKey)
  const corpusSupport = context.corpusSupport?.get(pairKey)
    ?? context.corpusSupport?.get(orderedPairKey)
    ?? context.corpusSupport?.get(reversedPairKey)
  const evidence: TraditionEvidence = {
    ...(curatedRelation !== undefined ? { curated_relation: curatedRelation } : {}),
    ...(seedProximity !== undefined ? { seed_proximity: clamp01(seedProximity) } : {}),
    ...(corpusSupport !== undefined ? { corpus_support: clamp01(corpusSupport) } : {}),
  }

  const score = curatedRelation?.score ?? seedProximity ?? corpusSupport
  if (score === undefined) return undefined

  return {
    id: 'tradition',
    score: clamp01(score),
    evidence,
  }
}
