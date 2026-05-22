import type { AliasCandidateOptions } from './alias_candidates.js'
import { findAliasCandidates } from './alias_candidates.js'
import { computeFrequencyAndCoOccurrence } from './cooccurrence.js'
import type { DescriptorAliasSeed } from '../types/alias.js'
import type { CorpusAnalysis } from '../types/analysis.js'

type AnalysisMaterial = {
  readonly id?: string
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

export type AnalyzeCorpusOptions = {
  readonly aliasCandidates?: AliasCandidateOptions
  readonly curatedAliases?: DescriptorAliasSeed
}

/**
 * Analyze a normalized corpus in one pass for frequency and co-occurrence,
 * with optional alias candidate discovery.
 */
export const analyzeCorpus = (
  corpus: readonly AnalysisMaterial[],
  options?: AnalyzeCorpusOptions,
): CorpusAnalysis => {
  const { frequency, cooccurrence, sanitationAuditEntries, aliasCanonicalizationAuditEntries } = computeFrequencyAndCoOccurrence(
    corpus,
    options?.curatedAliases,
  )
  const aliasCandidates = options?.aliasCandidates !== undefined
    ? findAliasCandidates(frequency, {
      ...options.aliasCandidates,
      ...(options.curatedAliases === undefined ? {} : { aliasSeed: options.curatedAliases }),
    })
    : []

  return {
    frequency,
    cooccurrence,
    aliasCandidates,
    sanitationAuditEntries,
    aliasCanonicalizationAuditEntries,
  }
}
