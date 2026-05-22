import { describe, expect, it } from 'vitest'
import { runArtifactQualityGates } from '../../compiler/quality_gates.js'
import { compileAll } from '../../compiler/compile_all.js'
import type { CompileAllInputs } from '../../compiler/compile_all.js'
import type { CorpusAnalysis } from '../../types/analysis.js'
import type { TaxonomySeed } from '../../types/seed.js'

const seed: TaxonomySeed = {
  version: '1.0.0',
  metadata: { created_at: '2026-01-01', author: 'test', description: 'test' },
  families: [{ id: 'floral', name: 'Floral', subfamilies: [{ id: 'rose', name: 'Rose', descriptors: ['rose'] }] }],
}

const analysis: CorpusAnalysis = {
  frequency: new Map([['rose', 4]]),
  cooccurrence: new Map(),
  aliasCandidates: [],
}

const baseInputs: CompileAllInputs = {
  seed,
  aliasSeed: { rosy: 'rose' },
  analysis,
  graphInputs: { curatedRelations: { version: '1.0.0', relations: [] }, accordMap: { version: '1.0.0', accords: [] } },
  noiseConfig: { hard_exclude: [], pattern_exclude: [], downweight: {}, default_downweight: 0.35 },
}

const compiled = () => compileAll(baseInputs, { generatedAt: '2026-01-01T00:00:00.000Z' })

describe('runArtifactQualityGates', () => {
  it('fails hard for descriptor consistency, alias candidates, final_score range, timestamp mismatch, and duplicate ids', () => {
    const result = compiled()
    const invalidTaxonomy = structuredClone(result.taxonomy)
    const descriptor = invalidTaxonomy.families[0]?.subfamilies[0]?.descriptors[0]
    if (descriptor === undefined) throw new Error('missing descriptor')
    ;(invalidTaxonomy.families[0]!.subfamilies[0] as { descriptors: unknown }).descriptors = [
      {
        ...descriptor,
        source: 'seed',
        status: 'candidate',
        review_required: true,
        corpus_derived: true,
      },
      { ...descriptor },
    ]

    const invalidAliases = {
      ...result.aliases,
      aliases: {
        ...result.aliases.aliases,
        candidate_like: descriptor.id,
      },
    }
    const invalidSimilarity = {
      ...result.similarity,
      generated_at: '2026-01-02T00:00:00.000Z',
      edges: [{
        source: 'floral:rose',
        target: 'floral:rose2',
        score: 1.2,
        final_score: 1.2,
        dimensions: { semantic_overlap: 1.2 },
      }],
      stats: { ...result.similarity.stats, edge_count: 1 },
    }

    const validation = runArtifactQualityGates({
      taxonomy: invalidTaxonomy as typeof result.taxonomy,
      aliases: invalidAliases as typeof result.aliases,
      similarity: invalidSimilarity as typeof result.similarity,
    })

    expect(validation.ok).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(0)
  })

  it('keeps soft warnings non-blocking and warns when curated data exists but edges are empty', () => {
    const result = compiled()
    const validation = runArtifactQualityGates({
      taxonomy: result.taxonomy,
      aliases: result.aliases,
      similarity: {
        ...result.similarity,
        edges: [],
        stats: { ...result.similarity.stats, edge_count: 0, density: 0 },
      },
      inputs: {
        curatedRelationsCount: 1,
        accordMapCount: 0,
      },
    })

    expect(validation.ok).toBe(true)
    expect(validation.warnings.some(w => w.code === 'CURATED_INPUT_WITHOUT_EDGES')).toBe(true)
  })
})
