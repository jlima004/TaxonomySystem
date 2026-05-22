/**
 * Analysis layer shared types for descriptor frequency, co-occurrence,
 * and alias candidate suggestions.
 *
 * Pair keys in co-occurrence maps are encoded as `${a}|${b}` with `a < b`.
 * This is collision-safe because normalized descriptors follow `^[a-z0-9_]+$`.
 */

export type FrequencyMap = ReadonlyMap<string, number>

export type CoOccurrenceMap = ReadonlyMap<string, number>

export type FrequencyEntry = {
  readonly descriptor: string
  readonly count: number
}

export type CoOccurrenceEdge = {
  readonly a: string
  readonly b: string
  readonly count: number
}

export type AliasCandidate = {
  readonly a: string
  readonly b: string
  readonly score: number
  readonly algo: 'lev_norm' | 'lev_norm+tokens'
  readonly frequencies: {
    readonly a: number
    readonly b: number
  }
  readonly token_overlap?: number
  readonly families?: {
    readonly a: readonly string[]
    readonly b: readonly string[]
  }
  readonly suggested_canonical?: string
  readonly cross_family?: boolean
}

export type CorpusAnalysis = {
  readonly frequency: FrequencyMap
  readonly cooccurrence: CoOccurrenceMap
  readonly aliasCandidates: readonly AliasCandidate[]
  readonly sanitationAuditEntries?: readonly {
    readonly raw: string
    readonly normalized: string
    readonly reason: 'hard_exclude' | 'pattern_exclude'
    readonly matched_rule: string
    readonly material_id?: string
    readonly source?: string
  }[]
  readonly aliasCanonicalizationAuditEntries?: readonly {
    readonly raw: string
    readonly normalized: string
    readonly canonical: string
    readonly alias_source: 'curated_seed'
  }[]
}
