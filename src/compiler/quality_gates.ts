import type { SimilarityGraph } from '../types/similarity.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { CompiledAliases, CompilerValidationResult } from './types.js'
import { makeCompilerError } from './types.js'

const HARD_EXCLUDES = new Set(['at', 'in', 'de', 'hour_s', 'dipropylene', 'glycol', 'substantivity_232', 'general_comment_at_100_00_lime'])

type InputsSummary = {
  readonly curatedRelationsCount: number
  readonly accordMapCount: number
}

type QualityGateInput = {
  readonly taxonomy: CompiledTaxonomy
  readonly aliases: CompiledAliases
  readonly similarity: SimilarityGraph
  readonly inputs?: InputsSummary
}

export const runArtifactQualityGates = ({ taxonomy, aliases, similarity, inputs }: QualityGateInput): CompilerValidationResult => {
  const errors = [] as ReturnType<typeof makeCompilerError>[]
  const warnings = [] as ReturnType<typeof makeCompilerError>[]

  const generatedAtSet = new Set([taxonomy.generated_at, aliases.generated_at, similarity.generated_at])
  if (generatedAtSet.size !== 1) {
    errors.push(makeCompilerError('taxonomy', 'GENERATED_AT_DIVERGENCE', '$.generated_at', 'generated_at must match across taxonomy, aliases, and similarity'))
  }

  const descriptorIds = new Set<string>()
  for (const family of taxonomy.families) {
    for (const subfamily of family.subfamilies) {
      for (const descriptor of subfamily.descriptors) {
        const descriptorId = descriptor.id
        if (HARD_EXCLUDES.has(descriptorId)) {
          errors.push(makeCompilerError('taxonomy', 'HARD_EXCLUDE_DESCRIPTOR_PRESENT', '$.families[*].subfamilies[*].descriptors[*].id', `hard-exclude descriptor present: ${descriptorId}`))
        }
        if (descriptorIds.has(descriptorId)) {
          errors.push(makeCompilerError('taxonomy', 'DUPLICATE_DESCRIPTOR_ID', '$.families[*].subfamilies[*].descriptors[*].id', `duplicate descriptor id: ${descriptorId}`))
        }
        descriptorIds.add(descriptorId)

        if (descriptor.source === 'seed' && (descriptor.status !== 'curated' || descriptor.review_required || descriptor.corpus_derived)) {
          errors.push(makeCompilerError('taxonomy', 'SEED_DESCRIPTOR_INCONSISTENT', '$.families[*].subfamilies[*].descriptors[*]', `seed descriptor invariant broken: ${descriptorId}`))
        }
        if (descriptor.source !== 'seed' && (!descriptor.review_required || !descriptor.corpus_derived)) {
          errors.push(makeCompilerError('taxonomy', 'CORPUS_DESCRIPTOR_INCONSISTENT', '$.families[*].subfamilies[*].descriptors[*]', `corpus/inferred descriptor invariant broken: ${descriptorId}`))
        }
        if (descriptor.source === 'seed' && descriptor.frequency === 0) {
          warnings.push(makeCompilerError('taxonomy', 'SEED_DESCRIPTOR_ZERO_FREQUENCY', '$.families[*].subfamilies[*].descriptors[*].frequency', `seed descriptor frequency is zero: ${descriptorId}`))
        }
      }
    }
  }

  for (const [alias, canonical] of Object.entries(aliases.aliases)) {
    if (canonical === 'candidate') {
      errors.push(makeCompilerError('aliases', 'ALIAS_CANDIDATE_CANONICAL', '$.aliases', `alias '${alias}' maps to candidate marker`))
    }
  }

  for (const edge of similarity.edges) {
    const edgeScore = edge.final_score ?? edge.score
    if (edgeScore < 0 || edgeScore > 1) {
      errors.push(makeCompilerError('similarity', 'EDGE_SCORE_OUT_OF_RANGE', '$.edges[*].final_score', `edge score outside [0,1]: ${edgeScore}`))
    }
  }

  const curatedRelationsCount = inputs?.curatedRelationsCount ?? 0
  const accordMapCount = inputs?.accordMapCount ?? 0
  if (curatedRelationsCount === 0) warnings.push(makeCompilerError('similarity', 'EMPTY_CURATED_RELATIONS', '$.review_queue', 'curated relations input is empty'))
  if (accordMapCount === 0) warnings.push(makeCompilerError('similarity', 'EMPTY_ACCORD_MAP', '$.review_queue', 'accord map input is empty'))
  if ((curatedRelationsCount > 0 || accordMapCount > 0) && similarity.edges.length === 0) {
    warnings.push(makeCompilerError('similarity', 'CURATED_INPUT_WITHOUT_EDGES', '$.edges', 'curated graph inputs are non-empty but no similarity edges were emitted'))
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}
