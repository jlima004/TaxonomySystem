import type { DescriptorAliasSeed } from '../types/alias.js'
import type { CorpusAnalysis } from '../types/analysis.js'
import type { BuildSimilarityGraphInputs } from '../inference/build_similarity_graph.js'
import { buildSimilarityGraph } from '../inference/build_similarity_graph.js'
import { buildSeedCorpusProfiles } from '../inference/seed_profile.js'
import type { SeedCorpusProfileOptions } from '../inference/types.js'
import type { TaxonomySeed } from '../types/seed.js'
import type { SimilarityGraph } from '../types/similarity.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import { compileAliases } from './compile_aliases.js'
import { compileTaxonomy } from './compile_taxonomy.js'
import { buildSeedGapReviewItems, sortReviewQueue } from './review_queue.js'
import type { CompiledAliases, CompilerValidationResult } from './types.js'
import { combineResults } from './types.js'
import { runArtifactQualityGates } from './quality_gates.js'
import { validateAllOutputs } from './validate_output.js'

export type CompileAllInputs = {
  readonly seed: TaxonomySeed
  readonly aliasSeed: DescriptorAliasSeed
  readonly analysis: CorpusAnalysis
  readonly graphInputs: BuildSimilarityGraphInputs
  readonly noiseConfig: {
    readonly noise_descriptors: readonly string[]
    readonly downweight_value: number
  }
}

export type CompileAllOptions = {
  readonly version?: string
  readonly generatedAt: string
  readonly threshold?: number
}

export type CompileAllResult = {
  readonly ok: boolean
  readonly taxonomy: CompiledTaxonomy
  readonly aliases: CompiledAliases
  readonly similarity: SimilarityGraph
  readonly validation: CompilerValidationResult
}

const DEFAULT_VERSION = '1.0.0'
const DEFAULT_THRESHOLD = 0.25

export const compileAll = (
  inputs: CompileAllInputs,
  options: CompileAllOptions,
): CompileAllResult => {
  const version = options.version ?? DEFAULT_VERSION
  const threshold = options.threshold ?? DEFAULT_THRESHOLD
  const profileOptions: SeedCorpusProfileOptions = {
    curatedNoiseDescriptors: inputs.noiseConfig.noise_descriptors,
    downweightValue: inputs.noiseConfig.downweight_value,
  }
  const profileResult = buildSeedCorpusProfiles(inputs.seed, inputs.analysis, profileOptions)
  const compiledTaxonomy = compileTaxonomy(inputs.seed, profileResult, inputs.analysis, {
    version,
    generatedAt: options.generatedAt,
  })
  const aliases = compileAliases(inputs.aliasSeed, {
    version,
    generatedAt: options.generatedAt,
  })
  const similarityBase = buildSimilarityGraph(inputs.seed, inputs.analysis, inputs.graphInputs, {
    threshold,
    generatedAt: options.generatedAt,
  })
  const similarity: SimilarityGraph = {
    ...similarityBase,
    review_queue: sortReviewQueue([
      ...profileResult.review_queue,
      ...compiledTaxonomy.placement_review_queue,
      ...buildSeedGapReviewItems(
        compiledTaxonomy.placement_review_queue
          .filter(item => item.type === 'corpus_candidate_high_frequency_generic')
          .map(item => ({
            descriptor: item.affected.descriptor ?? '',
            corpus_count: Number(item.evidence.candidate_frequency ?? 0),
            reason: String(item.reason ?? item.evidence.reason ?? 'high_frequency_generic'),
          })),
      ),
      ...similarityBase.review_queue,
    ]),
  }
  const taxonomy = compiledTaxonomy.taxonomy
  const validation = combineResults(
    validateAllOutputs(taxonomy, aliases, similarity),
    runArtifactQualityGates({
      taxonomy,
      aliases,
      similarity,
      inputs: {
        curatedRelationsCount: inputs.graphInputs.curatedRelations.relations.length,
        accordMapCount: inputs.graphInputs.accordMap.accords.length,
      },
    }),
  )

  return {
    ok: validation.ok,
    taxonomy,
    aliases,
    similarity,
    validation,
  }
}
