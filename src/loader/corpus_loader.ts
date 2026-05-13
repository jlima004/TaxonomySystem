import { readFile } from 'node:fs/promises'
import type { SemanticMaterial, OlfactoryProfile } from '../types/index.js'

const mapOlfactoryProfile = (raw: any): OlfactoryProfile => {
  if (!raw || typeof raw !== 'object') {
    return {
      descriptors: [],
      primary_type: '',
      odor_description: '',
      descriptor_sources: {}
    }
  }

  return {
    descriptors: Array.isArray(raw.descriptors) ? [...raw.descriptors] : [],
    primary_type: typeof raw.primary_type === 'string' ? raw.primary_type : '',
    odor_description: typeof raw.odor_description === 'string' ? raw.odor_description : '',
    descriptor_sources: {
      ...(raw.descriptor_sources?.tgsc !== undefined ? { tgsc: [...raw.descriptor_sources.tgsc] } : {}),
      ...(raw.descriptor_sources?.sf !== undefined ? { sf: [...raw.descriptor_sources.sf] } : {})
    }
  }
}

const mapToSemanticMaterial = (raw: any): SemanticMaterial => {
  const identity = raw?.identity || {}
  const organoleptic = raw?.organoleptic || undefined
  const meta = raw?.meta || undefined

  return {
    id: raw?.id || '',
    identity: {
      name: identity.name || '',
      canonical_name: identity.canonical_name || '',
      aliases: Array.isArray(identity.aliases) ? [...identity.aliases] : [],
      identifiers: {
        ...(identity.identifiers?.cas !== undefined ? { cas: identity.identifiers.cas } : {}),
        ...(identity.identifiers?.einecs !== undefined ? { einecs: identity.identifiers.einecs } : {})
      }
    },
    olfactory: mapOlfactoryProfile(raw?.olfactory),
    ...(organoleptic !== undefined ? { organoleptic: {...organoleptic} } : {}),
    ...(meta !== undefined ? { meta: {...meta} } : {})
  }
}

export const loadCorpus = async (path: string): Promise<readonly SemanticMaterial[]> => {
  let content: string
  try {
    content = await readFile(path, 'utf8')
  } catch (error) {
    throw new Error(`Failed to read file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`)
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Expected JSON array')
  }

  return parsed.map(mapToSemanticMaterial)
}
