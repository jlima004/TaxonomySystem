import type { AccordCompatibilityScore, AccordMapInput } from '../types/inference.js'
import { clamp01, validateAccordMapInput } from './curated_input_validation.js'

export const computeAccordCompatibility = (
  leftId: string,
  rightId: string,
  accordMap: AccordMapInput,
): AccordCompatibilityScore | undefined => {
  const accords = validateAccordMapInput(accordMap)
  const accordReference = accords.find(accord => {
    return (accord.source_subfamily_id === leftId && accord.target_subfamily_id === rightId)
      || (accord.source_subfamily_id === rightId && accord.target_subfamily_id === leftId)
  })

  if (accordReference === undefined) return undefined

  return {
    id: 'accord_compatibility',
    score: clamp01(accordReference.score),
    evidence: {
      accord_reference: accordReference,
    },
  }
}
