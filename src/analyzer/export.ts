import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { AliasCandidate, CoOccurrenceMap, CorpusAnalysis, FrequencyMap } from '../types/analysis.js'
import { decodePairKey } from './pair_key.js'

type FrequencyPayload = {
  readonly version: 1
  readonly entries: readonly {
    readonly descriptor: string
    readonly count: number
  }[]
}

type CoOccurrencePayload = {
  readonly version: 1
  readonly edges: readonly {
    readonly a: string
    readonly b: string
    readonly count: number
  }[]
}

type AliasPayload = {
  readonly version: 1
  readonly candidates: readonly AliasCandidate[]
}

const writeJsonDeterministic = async (path: string, payload: object): Promise<void> => {
  try {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  } catch (error) {
    throw new Error(`Failed to write file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const exportFrequencyJson = async (frequency: FrequencyMap, path: string): Promise<void> => {
  const entries = Array.from(frequency.entries())
    .map(([descriptor, count]) => ({ descriptor, count }))
    .sort((left, right) => left.descriptor.localeCompare(right.descriptor))

  const payload: FrequencyPayload = {
    version: 1,
    entries,
  }

  await writeJsonDeterministic(path, payload)
}

export const exportCoOccurrenceJson = async (cooccurrence: CoOccurrenceMap, path: string): Promise<void> => {
  const edges = Array.from(cooccurrence.entries())
    .map(([key, count]) => {
      const [a, b] = decodePairKey(key)
      return { a, b, count }
    })
    .sort((left, right) => {
      if (left.a !== right.a) {
        return left.a.localeCompare(right.a)
      }

      return left.b.localeCompare(right.b)
    })

  const payload: CoOccurrencePayload = {
    version: 1,
    edges,
  }

  await writeJsonDeterministic(path, payload)
}

export const exportAliasCandidatesJson = async (
  candidates: readonly AliasCandidate[],
  path: string,
): Promise<void> => {
  const payload: AliasPayload = {
    version: 1,
    candidates,
  }

  await writeJsonDeterministic(path, payload)
}

export const writeAnalysisArtifacts = async (
  analysis: CorpusAnalysis,
  baseDir = 'data/analysis',
): Promise<void> => {
  await Promise.all([
    exportFrequencyJson(analysis.frequency, join(baseDir, 'descriptor_frequency.v1.json')),
    exportCoOccurrenceJson(analysis.cooccurrence, join(baseDir, 'descriptor_cooccurrence.v1.json')),
    exportAliasCandidatesJson(analysis.aliasCandidates, join(baseDir, 'alias_candidates.v1.json')),
  ])
}
