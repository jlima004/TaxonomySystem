import type { AliasCandidateOptions } from './alias_candidates.js'
import { findAliasCandidates } from './alias_candidates.js'
import { computeFrequencyAndCoOccurrence } from './cooccurrence.js'
import type { CorpusAnalysis } from '../types/analysis.js'

type AnalysisMaterial = {
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

export type AnalyzeCorpusOptions = {
  readonly aliasCandidates?: AliasCandidateOptions
}

/**
 * Analyze a normalized corpus in one pass for frequency and co-occurrence,
 * with optional alias candidate discovery.
 */
export const analyzeCorpus = (
  corpus: readonly AnalysisMaterial[],
  options?: AnalyzeCorpusOptions,
): CorpusAnalysis => {
  const { frequency, cooccurrence } = computeFrequencyAndCoOccurrence(corpus)
  const aliasCandidates = options?.aliasCandidates !== undefined
    ? findAliasCandidates(frequency, options.aliasCandidates)
    : []

  return {
    frequency,
    cooccurrence,
    aliasCandidates,
  }
}
