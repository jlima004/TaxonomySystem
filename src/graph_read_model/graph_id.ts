import {
  GRAPH_ID_PARSE_ERROR_CODES,
  GRAPH_ID_PREFIXES,
  type GraphIdParseErrorCode,
  type GraphIdPrefix,
} from './contract.js'
import type { JsonValue } from './types.js'

const GRAPH_ID_PREFIX_BY_KIND = {
  family: GRAPH_ID_PREFIXES[0],
  subfamily: GRAPH_ID_PREFIXES[1],
  descriptor: GRAPH_ID_PREFIXES[2],
  alias: GRAPH_ID_PREFIXES[3],
} as const

const GRAPH_ID_KIND_BY_PREFIX = {
  [GRAPH_ID_PREFIX_BY_KIND.family]: 'family',
  [GRAPH_ID_PREFIX_BY_KIND.subfamily]: 'subfamily',
  [GRAPH_ID_PREFIX_BY_KIND.descriptor]: 'descriptor',
  [GRAPH_ID_PREFIX_BY_KIND.alias]: 'alias',
} as const

const AMBIGUOUS_PREFIX_TOKENS = GRAPH_ID_PREFIXES

export type GraphIdKind = keyof typeof GRAPH_ID_PREFIX_BY_KIND

export type ParsedGraphId = {
  readonly ok: true
  readonly kind: GraphIdKind
  readonly prefix: GraphIdPrefix
  readonly raw_id: string
  readonly graph_id: string
}

export type GraphIdParseError = {
  readonly ok: false
  readonly error: {
    readonly code: GraphIdParseErrorCode
    readonly message: string
    readonly expected: JsonValue
    readonly actual: JsonValue
  }
}

export type GraphIdParseResult = ParsedGraphId | GraphIdParseError

const buildGraphId = (prefix: GraphIdPrefix, rawId: string): string => `${prefix}${rawId}`

const matchesGraphIdKind = (graphId: string, prefix: GraphIdPrefix): boolean => {
  const result = parseGraphId(graphId)
  return result.ok && result.prefix === prefix
}

const makeParseError = (
  code: GraphIdParseErrorCode,
  message: string,
  expected: JsonValue,
  actual: JsonValue,
): GraphIdParseError => ({
  ok: false,
  error: {
    code,
    message,
    expected,
    actual,
  },
})

const parsePrefixMatch = (graphId: string): { prefix: GraphIdPrefix; rawId: string } | null => {
  const prefix = GRAPH_ID_PREFIXES.find(candidate => graphId.startsWith(candidate))
  if (!prefix) {
    return null
  }

  return {
    prefix,
    rawId: graphId.slice(prefix.length),
  }
}

export const makeFamilyGraphId = (familyId: string): string =>
  buildGraphId(GRAPH_ID_PREFIX_BY_KIND.family, familyId)

export const makeSubfamilyGraphId = (subfamilyId: string): string =>
  buildGraphId(GRAPH_ID_PREFIX_BY_KIND.subfamily, subfamilyId)

export const makeDescriptorGraphId = (descriptorId: string): string =>
  buildGraphId(GRAPH_ID_PREFIX_BY_KIND.descriptor, descriptorId)

export const makeAliasGraphId = (alias: string): string =>
  buildGraphId(GRAPH_ID_PREFIX_BY_KIND.alias, alias)

export const isFamilyGraphId = (graphId: string): boolean =>
  matchesGraphIdKind(graphId, GRAPH_ID_PREFIX_BY_KIND.family)

export const isSubfamilyGraphId = (graphId: string): boolean =>
  matchesGraphIdKind(graphId, GRAPH_ID_PREFIX_BY_KIND.subfamily)

export const isDescriptorGraphId = (graphId: string): boolean =>
  matchesGraphIdKind(graphId, GRAPH_ID_PREFIX_BY_KIND.descriptor)

export const isAliasGraphId = (graphId: string): boolean =>
  matchesGraphIdKind(graphId, GRAPH_ID_PREFIX_BY_KIND.alias)

export const parseGraphId = (graphId: string): GraphIdParseResult => {
  if (graphId.length === 0) {
    return makeParseError(
      GRAPH_ID_PARSE_ERROR_CODES[0],
      'graph_id must not be empty',
      { allowed_prefixes: GRAPH_ID_PREFIXES },
      { graph_id: graphId },
    )
  }

  const parsed = parsePrefixMatch(graphId)
  if (!parsed) {
    return makeParseError(
      GRAPH_ID_PARSE_ERROR_CODES[1],
      'graph_id must start with an authoritative prefix',
      { allowed_prefixes: GRAPH_ID_PREFIXES },
      { graph_id: graphId },
    )
  }

  if (parsed.rawId.length === 0) {
    return makeParseError(
      GRAPH_ID_PARSE_ERROR_CODES[0],
      'graph_id raw_id must not be empty',
      { non_empty_raw_id: true, prefix: parsed.prefix },
      { graph_id: graphId, raw_id: parsed.rawId },
    )
  }

  const embeddedPrefix = AMBIGUOUS_PREFIX_TOKENS.find(token => parsed.rawId.includes(token))
  if (embeddedPrefix) {
    return makeParseError(
      GRAPH_ID_PARSE_ERROR_CODES[2],
      'graph_id raw_id must not contain another authoritative prefix token',
      { disallowed_embedded_prefixes: GRAPH_ID_PREFIXES, prefix: parsed.prefix },
      { graph_id: graphId, raw_id: parsed.rawId, embedded_prefix: embeddedPrefix },
    )
  }

  return {
    ok: true,
    kind: GRAPH_ID_KIND_BY_PREFIX[parsed.prefix],
    prefix: parsed.prefix,
    raw_id: parsed.rawId,
    graph_id: graphId,
  }
}

export const stripGraphIdPrefix = (graphId: string): string | null => {
  const parsed = parseGraphId(graphId)
  return parsed.ok ? parsed.raw_id : null
}
