import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { analyzeCorpus } from '../../analyzer/analyze_corpus.js'
import {
  exportAliasCandidatesJson,
  exportCoOccurrenceJson,
  exportFrequencyJson,
  writeAnalysisArtifacts,
} from '../../analyzer/export.js'

type AnalysisMaterial = {
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

const TINY_CORPUS: readonly AnalysisMaterial[] = [
  { olfactory: { descriptors: ['rose', 'wood'] } },
  { olfactory: { descriptors: ['rose', 'green'] } },
  { olfactory: { descriptors: ['green', 'musk'] } },
]

describe('analysis exporters', () => {
  it('writes frequency json with deterministic ordering', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'taxonomy-analysis-frequency-'))

    try {
      const analysis = analyzeCorpus(TINY_CORPUS)
      const pathA = join(dir, 'nested', 'frequency_a.json')
      const pathB = join(dir, 'nested', 'frequency_b.json')

      await exportFrequencyJson(analysis.frequency, pathA)
      await exportFrequencyJson(analysis.frequency, pathB)

      const rawA = await readFile(pathA)
      const rawB = await readFile(pathB)
      expect(rawA.equals(rawB)).toBe(true)

      const parsed = JSON.parse(rawA.toString('utf8')) as {
        readonly version: number
        readonly entries: readonly { readonly descriptor: string; readonly count: number }[]
      }

      expect(parsed.version).toBe(1)
      const descriptors = parsed.entries.map(entry => entry.descriptor)
      expect(descriptors).toEqual([...descriptors].sort((a, b) => a.localeCompare(b)))
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('writes co-occurrence json with deterministic ordering', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'taxonomy-analysis-cooc-'))

    try {
      const analysis = analyzeCorpus(TINY_CORPUS)
      const pathA = join(dir, 'cooc_a.json')
      const pathB = join(dir, 'cooc_b.json')

      await exportCoOccurrenceJson(analysis.cooccurrence, pathA)
      await exportCoOccurrenceJson(analysis.cooccurrence, pathB)

      const rawA = await readFile(pathA)
      const rawB = await readFile(pathB)
      expect(rawA.equals(rawB)).toBe(true)

      const parsed = JSON.parse(rawA.toString('utf8')) as {
        readonly version: number
        readonly edges: readonly { readonly a: string; readonly b: string; readonly count: number }[]
      }
      expect(parsed.version).toBe(1)

      const lexSorted = [...parsed.edges].sort((left, right) => {
        if (left.a !== right.a) return left.a.localeCompare(right.a)
        return left.b.localeCompare(right.b)
      })
      expect(parsed.edges).toEqual(lexSorted)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('writes alias candidates json and empty payloads', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'taxonomy-analysis-alias-'))

    try {
      const path = join(dir, 'alias.json')
      await exportAliasCandidatesJson([], path)
      const raw = await readFile(path, 'utf8')
      const parsed = JSON.parse(raw) as {
        readonly version: number
        readonly candidates: readonly unknown[]
      }

      expect(parsed.version).toBe(1)
      expect(parsed.candidates).toEqual([])
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('writeAnalysisArtifacts emits all three analysis files', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'taxonomy-analysis-artifacts-'))

    try {
      const analysis = analyzeCorpus(TINY_CORPUS, {
        aliasCandidates: { minFrequency: 1, minScore: 0.5 },
      })

      await writeAnalysisArtifacts(analysis, dir)

      const frequencyRaw = await readFile(join(dir, 'descriptor_frequency.v1.json'), 'utf8')
      const coocRaw = await readFile(join(dir, 'descriptor_cooccurrence.v1.json'), 'utf8')
      const aliasRaw = await readFile(join(dir, 'alias_candidates.v1.json'), 'utf8')

      expect(JSON.parse(frequencyRaw).version).toBe(1)
      expect(JSON.parse(coocRaw).version).toBe(1)
      expect(JSON.parse(aliasRaw).version).toBe(1)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
