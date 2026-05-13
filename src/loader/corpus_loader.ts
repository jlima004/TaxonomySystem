import { readFile } from 'node:fs/promises'
import type { CorpusMaterial, OlfactoryProfile } from '../types/index.js'

const map_olfactory_profile = (raw: any): OlfactoryProfile => {
  if (!raw || typeof raw !== 'object') {
    return {
      descriptors: [],
      primary_type: '',
      odor_description: '',
      descriptor_sources: {}
    }
  }

  return {
    descriptors: Array.isArray(raw.descriptors) ? raw.descriptors : [],
    primary_type: typeof raw.primary_type === 'string' ? raw.primary_type : '',
    odor_description: typeof raw.odor_description === 'string' ? raw.odor_description : '',
    descriptor_sources: {
      ...(raw.descriptor_sources?.tgsc !== undefined ? { tgsc: raw.descriptor_sources.tgsc } : {}),
      ...(raw.descriptor_sources?.sf !== undefined ? { sf: raw.descriptor_sources.sf } : {})
    }
  }
}

const map_to_corpus_material = (raw: any): CorpusMaterial => {
  const identity = raw?.identity || {}
  const classification = raw?.classification || {}
  const usage = raw?.usage || {}
  const molecular = raw?.molecular || {}

  return {
    id: raw?.id || '',
    identity: {
      name: identity.name || '',
      canonical_name: identity.canonical_name || '',
      aliases: Array.isArray(identity.aliases) ? identity.aliases : [],
      identifiers: {
        ...(identity.identifiers?.cas !== undefined ? { cas: identity.identifiers.cas } : {}),
        ...(identity.identifiers?.einecs !== undefined ? { einecs: identity.identifiers.einecs } : {})
      }
    },
    classification: {
      category: classification.category || '',
      category_path: Array.isArray(classification.category_path) ? classification.category_path : []
    },
    olfactory: map_olfactory_profile(raw?.olfactory),
    usage: {
      found_in_nature: Array.isArray(usage.found_in_nature) ? usage.found_in_nature : [],
      uses: Array.isArray(usage.uses) ? usage.uses : [],
      blenders: Array.isArray(usage.blenders) ? usage.blenders : []
    },
    molecular: {
      ...(molecular.cid !== undefined ? { cid: molecular.cid } : {}),
      ...(molecular.smiles !== undefined ? { smiles: molecular.smiles } : {}),
      ...(molecular.molecular_weight !== undefined ? { molecular_weight: molecular.molecular_weight } : {}),
      ...(molecular.xlogp !== undefined ? { xlogp: molecular.xlogp } : {}),
      ...(molecular.tpsa !== undefined ? { tpsa: molecular.tpsa } : {}),
      ...(molecular.rotatable_bonds !== undefined ? { rotatable_bonds: molecular.rotatable_bonds } : {})
    }
  }
}

export const load_corpus = async (path: string): Promise<readonly CorpusMaterial[]> => {
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

  return parsed.map(map_to_corpus_material)
}
