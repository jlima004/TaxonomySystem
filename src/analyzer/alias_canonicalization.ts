import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { DescriptorAliasSeed } from '../types/alias.js'

export type CuratedAliasAuditEntry = {
  readonly raw: string
  readonly normalized: string
  readonly canonical: string
  readonly alias_source: 'curated_seed'
}

export type CuratedAliasCanonicalizationResult = {
  readonly canonical: string
  readonly audit?: CuratedAliasAuditEntry
}

const hasMapContent = (seedOrMap?: DescriptorAliasSeed | ReadonlyMap<string, string>): boolean => {
  if (seedOrMap === undefined) return false
  if (seedOrMap instanceof Map) return seedOrMap.size > 0
  return Object.keys(seedOrMap).length > 0
}

export const buildCuratedAliasMap = (aliasSeed?: DescriptorAliasSeed): ReadonlyMap<string, string> => {
  const entries: Array<readonly [string, string]> = []

  if (aliasSeed !== undefined) {
    for (const [rawAlias, rawCanonical] of Object.entries(aliasSeed)) {
      const normalizedAlias = normalizeDescriptor(rawAlias)
      const normalizedCanonical = normalizeDescriptor(rawCanonical)
      if (normalizedAlias.length === 0 || normalizedCanonical.length === 0 || normalizedAlias === normalizedCanonical) {
        continue
      }

      entries.push([normalizedAlias, normalizedCanonical] as const)
    }
  }

  entries.sort((a, b) => a[0].localeCompare(b[0]))
  return new Map<string, string>(entries)
}

export const canonicalizeDescriptor = (
  input: string,
  aliasSeedOrMap?: DescriptorAliasSeed | ReadonlyMap<string, string>,
  raw?: string,
): CuratedAliasCanonicalizationResult => {
  const normalized = normalizeDescriptor(input)
  if (normalized.length === 0 || !hasMapContent(aliasSeedOrMap)) {
    return { canonical: normalized }
  }

  const aliasMap = aliasSeedOrMap instanceof Map
    ? aliasSeedOrMap
    : buildCuratedAliasMap(aliasSeedOrMap)

  const canonical = aliasMap.get(normalized) ?? normalized
  if (canonical === normalized) {
    return { canonical }
  }

  return {
    canonical,
    audit: {
      raw: raw ?? input,
      normalized,
      canonical,
      alias_source: 'curated_seed',
    },
  }
}
