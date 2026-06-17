import { SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE } from './contract.js'
import {
  getCrossFamilyBridges,
  getDescriptorToFamilyPath,
  getDescriptorsByFamily,
  getDescriptorsBySubfamily,
  getRelatedDescriptors,
  getSimilarityHub,
  getSimilarityNeighborhood,
  resolveAliasPath,
} from './query_graph.js'
import type {
  AliasResolutionPathProof,
  CrossFamilyBridgesProof,
  DescriptorToFamilyPathProof,
  DescriptorsByFamilyProof,
  DescriptorsBySubfamilyProof,
  GraphValidationError,
  OlfactoryGraph,
  RelatedDescriptorsProof,
  SimilarityHubProof,
  SimilarityNeighborhoodProof,
} from './types.js'
import { validateSanctionedV211Graph } from './validate_graph.js'
import { makeGraphNotValidatedError } from './validation_errors.js'

const VALIDATED_GRAPH_BRAND = Symbol('ValidatedGraphBrand')

export type ValidatedGraph = {
  readonly [VALIDATED_GRAPH_BRAND]: typeof VALIDATED_GRAPH_BRAND
  readonly graph: OlfactoryGraph
  readonly validation_profile_id: typeof SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE.profile_id
}

export type AsValidatedGraphResult =
  | { readonly ok: true; readonly graph: ValidatedGraph }
  | { readonly ok: false; readonly errors: readonly GraphValidationError[] }

export type ValidatedQueryConsumer = {
  getDescriptorsByFamily(familyId: string): DescriptorsByFamilyProof
  getDescriptorsBySubfamily(subfamilyId: string): DescriptorsBySubfamilyProof
  resolveAliasPath(alias: string): AliasResolutionPathProof
  getDescriptorToFamilyPath(descriptorId: string): DescriptorToFamilyPathProof
  getRelatedDescriptors(descriptorId: string): RelatedDescriptorsProof
  getSimilarityNeighborhood(subfamilyId: string): SimilarityNeighborhoodProof
  getCrossFamilyBridges(): CrossFamilyBridgesProof
  getSimilarityHub(): SimilarityHubProof
}

export type CreateValidatedQueryConsumerResult =
  | { readonly ok: true; readonly consumer: ValidatedQueryConsumer }
  | { readonly ok: false; readonly error: GraphValidationError }

const isValidatedGraph = (value: unknown): value is ValidatedGraph => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as ValidatedGraph
  return (
    candidate[VALIDATED_GRAPH_BRAND] === VALIDATED_GRAPH_BRAND
    && candidate.validation_profile_id === SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE.profile_id
    && typeof candidate.graph === 'object'
    && candidate.graph !== null
  )
}

export const asValidatedGraph = (graph: OlfactoryGraph): AsValidatedGraphResult => {
  const validation = validateSanctionedV211Graph(graph)

  if (!validation.ok) {
    return { ok: false, errors: validation.errors }
  }

  const validatedGraph: ValidatedGraph = {
    [VALIDATED_GRAPH_BRAND]: VALIDATED_GRAPH_BRAND,
    graph,
    validation_profile_id: SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE.profile_id,
  }

  return { ok: true, graph: validatedGraph }
}

export const createValidatedQueryConsumer = (
  validatedGraph: ValidatedGraph,
): CreateValidatedQueryConsumerResult => {
  if (!isValidatedGraph(validatedGraph)) {
    return {
      ok: false,
      error: makeGraphNotValidatedError('validated graph handle required'),
    }
  }

  const { graph } = validatedGraph

  const consumer: ValidatedQueryConsumer = {
    getDescriptorsByFamily: (familyId: string) => getDescriptorsByFamily(graph, familyId),
    getDescriptorsBySubfamily: (subfamilyId: string) => getDescriptorsBySubfamily(graph, subfamilyId),
    resolveAliasPath: (alias: string) => resolveAliasPath(graph, alias),
    getDescriptorToFamilyPath: (descriptorId: string) => getDescriptorToFamilyPath(graph, descriptorId),
    getRelatedDescriptors: (descriptorId: string) => getRelatedDescriptors(graph, descriptorId),
    getSimilarityNeighborhood: (subfamilyId: string) => getSimilarityNeighborhood(graph, subfamilyId),
    getCrossFamilyBridges: () => getCrossFamilyBridges(graph),
    getSimilarityHub: () => getSimilarityHub(graph),
  }

  return { ok: true, consumer }
}
