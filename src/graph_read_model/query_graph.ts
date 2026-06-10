import type {
  AliasResolutionPathProof,
  CrossFamilyBridgeItem,
  CrossFamilyBridgesProof,
  DescriptorProofItem,
  DescriptorToFamilyPathProof,
  DescriptorsByFamilyProof,
  DescriptorsBySubfamilyProof,
  GraphEdge,
  GraphNode,
  OlfactoryGraph,
  PathSegment,
  RelatedDescriptorsProof,
  SimilarityHubProof,
  SimilarityNeighborhoodEntry,
  SimilarityNeighborhoodProof,
} from './types.js'

const familyNodeId = (familyId: string): string => `family:${familyId}`

const subfamilyNodeId = (subfamilyId: string): string => `subfamily:${subfamilyId}`

const descriptorNodeId = (descriptorId: string): string => `descriptor:${descriptorId}`

const aliasNodeId = (alias: string): string => `alias:${alias}`

const buildNodeIndex = (nodes: readonly GraphNode[]): Map<string, GraphNode> => {
  const index = new Map<string, GraphNode>()
  for (const node of nodes) {
    if (!index.has(node.id)) {
      index.set(node.id, node)
    }
  }
  return index
}

const DESCRIPTOR_STATUSES: readonly DescriptorProofItem['status'][] = ['curated', 'candidate', 'inferred']
const DESCRIPTOR_SOURCES: readonly DescriptorProofItem['source'][] = ['seed', 'corpus', 'inferred']

const isDescriptorStatus = (value: unknown): value is DescriptorProofItem['status'] =>
  typeof value === 'string' && DESCRIPTOR_STATUSES.includes(value as DescriptorProofItem['status'])

const isDescriptorSource = (value: unknown): value is DescriptorProofItem['source'] =>
  typeof value === 'string' && DESCRIPTOR_SOURCES.includes(value as DescriptorProofItem['source'])

const toFiniteNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toDescriptorProof = (node: GraphNode): DescriptorProofItem | null => {
  const status = node.properties.status
  const source = node.properties.source
  if (!isDescriptorStatus(status) || !isDescriptorSource(source)) {
    return null
  }

  return {
    id: String(node.properties.descriptor_id),
    graph_id: node.id,
    status,
    review_required: Boolean(node.properties.review_required),
    corpus_derived: Boolean(node.properties.corpus_derived),
    source,
  }
}

const compareDescriptorProofItems = (
  left: DescriptorProofItem,
  right: DescriptorProofItem,
): number => left.id.localeCompare(right.id)

const toPathSegment = (node: GraphNode): PathSegment => {
  const segment: PathSegment = {
    graph_id: node.id,
    kind: node.kind,
  }
  if (typeof node.properties.name === 'string') {
    return { ...segment, name: node.properties.name }
  }
  return segment
}

const collectDescriptors = (
  graph: OlfactoryGraph,
  predicate: (node: GraphNode) => boolean,
): readonly DescriptorProofItem[] =>
  graph.nodes
    .filter(node => node.kind === 'descriptor' && predicate(node))
    .map(toDescriptorProof)
    .filter((item): item is DescriptorProofItem => item !== null)
    .sort(compareDescriptorProofItems)

const resolveDescriptorHierarchyNodes = (
  nodeIndex: Map<string, GraphNode>,
  descriptorNode: GraphNode,
): { subfamilyNode: GraphNode; familyNode: GraphNode } | null => {
  const subfamilyId = descriptorNode.properties.subfamily_id
  const familyId = descriptorNode.properties.family_id
  if (typeof subfamilyId !== 'string' || typeof familyId !== 'string') {
    return null
  }

  const subfamilyNode = nodeIndex.get(subfamilyNodeId(subfamilyId))
  const familyNode = nodeIndex.get(familyNodeId(familyId))
  if (!subfamilyNode || subfamilyNode.kind !== 'subfamily' || !familyNode || familyNode.kind !== 'family') {
    return null
  }

  return { subfamilyNode, familyNode }
}

export const getDescriptorsByFamily = (
  graph: OlfactoryGraph,
  familyId: string,
): DescriptorsByFamilyProof => ({
  query_kind: 'descriptors_by_family',
  params: { family_id: familyId },
  result: {
    descriptors: collectDescriptors(graph, node => node.properties.family_id === familyId),
  },
})

export const getDescriptorsBySubfamily = (
  graph: OlfactoryGraph,
  subfamilyId: string,
): DescriptorsBySubfamilyProof => ({
  query_kind: 'descriptors_by_subfamily',
  params: { subfamily_id: subfamilyId },
  result: {
    descriptors: collectDescriptors(graph, node => node.properties.subfamily_id === subfamilyId),
  },
})

export const resolveAliasPath = (
  graph: OlfactoryGraph,
  alias: string,
): AliasResolutionPathProof => {
  const nodeIndex = buildNodeIndex(graph.nodes)
  const aliasNode = nodeIndex.get(aliasNodeId(alias))

  if (!aliasNode) {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

  const resolvesToEdge = graph.edges.find(
    edge => edge.kind === 'resolves_to' && edge.source === aliasNode.id,
  )
  if (!resolvesToEdge) {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

  const descriptorNode = nodeIndex.get(resolvesToEdge.target)
  if (!descriptorNode || descriptorNode.kind !== 'descriptor') {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

  const hierarchy = resolveDescriptorHierarchyNodes(nodeIndex, descriptorNode)
  if (!hierarchy) {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

  const { subfamilyNode, familyNode } = hierarchy

  return {
    query_kind: 'alias_resolution_path',
    params: { alias },
    result: { target_descriptor_id: String(descriptorNode.properties.descriptor_id) },
    path: [
      toPathSegment(aliasNode),
      toPathSegment(descriptorNode),
      toPathSegment(subfamilyNode),
      toPathSegment(familyNode),
    ],
  }
}

export const getDescriptorToFamilyPath = (
  graph: OlfactoryGraph,
  descriptorId: string,
): DescriptorToFamilyPathProof => {
  const nodeIndex = buildNodeIndex(graph.nodes)
  const descriptorNode = nodeIndex.get(descriptorNodeId(descriptorId))

  if (!descriptorNode || descriptorNode.kind !== 'descriptor') {
    return {
      query_kind: 'descriptor_to_family_path',
      params: { descriptor_id: descriptorId },
      result: { family_id: null, subfamily_id: null },
    }
  }

  const hierarchy = resolveDescriptorHierarchyNodes(nodeIndex, descriptorNode)
  if (!hierarchy) {
    return {
      query_kind: 'descriptor_to_family_path',
      params: { descriptor_id: descriptorId },
      result: { family_id: null, subfamily_id: null },
    }
  }

  const { subfamilyNode, familyNode } = hierarchy

  return {
    query_kind: 'descriptor_to_family_path',
    params: { descriptor_id: descriptorId },
    result: {
      family_id: String(familyNode.properties.family_id),
      subfamily_id: String(subfamilyNode.properties.subfamily_id),
    },
    path: [
      toPathSegment(descriptorNode),
      toPathSegment(subfamilyNode),
      toPathSegment(familyNode),
    ],
  }
}

const toSimilarityNeighborhoodEntry = (
  edge: GraphEdge,
  neighborGraphId: string,
  direction: SimilarityNeighborhoodEntry['direction'],
): SimilarityNeighborhoodEntry => {
  const neighborId = neighborGraphId.replace(/^subfamily:/, '')
  const entry: SimilarityNeighborhoodEntry = {
    neighbor_id: neighborId,
    neighbor_graph_id: neighborGraphId,
    score: toFiniteNumber(edge.properties.score),
    dimensions: edge.properties.dimensions as Readonly<Record<string, number>>,
    direction,
  }

  if (edge.properties.final_score !== undefined) {
    return {
      ...entry,
      final_score: toFiniteNumber(edge.properties.final_score),
      ...(edge.properties.evidence !== undefined
        ? { evidence: edge.properties.evidence as Readonly<Record<string, unknown>> }
        : {}),
    }
  }

  if (edge.properties.evidence !== undefined) {
    return {
      ...entry,
      evidence: edge.properties.evidence as Readonly<Record<string, unknown>>,
    }
  }

  return entry
}

const effectiveNeighborhoodScore = (entry: SimilarityNeighborhoodEntry): number =>
  toFiniteNumber(entry.final_score ?? entry.score)

const compareSimilarityNeighborhoodEntries = (
  left: SimilarityNeighborhoodEntry,
  right: SimilarityNeighborhoodEntry,
): number => {
  const leftScore = effectiveNeighborhoodScore(left)
  const rightScore = effectiveNeighborhoodScore(right)
  if (rightScore !== leftScore) {
    return rightScore - leftScore
  }
  return left.neighbor_id.localeCompare(right.neighbor_id)
}

const shouldReplaceNeighborhoodEntry = (
  existing: SimilarityNeighborhoodEntry,
  candidate: SimilarityNeighborhoodEntry,
): boolean => {
  const existingScore = effectiveNeighborhoodScore(existing)
  const candidateScore = effectiveNeighborhoodScore(candidate)
  if (candidateScore !== existingScore) {
    return candidateScore > existingScore
  }
  return candidate.direction.localeCompare(existing.direction) < 0
}

const collapseNeighborhoodEntries = (
  entries: readonly SimilarityNeighborhoodEntry[],
): SimilarityNeighborhoodEntry[] => {
  const byNeighborId = new Map<string, SimilarityNeighborhoodEntry>()
  for (const entry of entries) {
    const existing = byNeighborId.get(entry.neighbor_id)
    if (!existing || shouldReplaceNeighborhoodEntry(existing, entry)) {
      byNeighborId.set(entry.neighbor_id, entry)
    }
  }
  return [...byNeighborId.values()]
}

const compareCrossFamilyBridgeItems = (
  left: CrossFamilyBridgeItem,
  right: CrossFamilyBridgeItem,
): number => {
  const sourceCompare = left.source_subfamily_id.localeCompare(right.source_subfamily_id)
  if (sourceCompare !== 0) {
    return sourceCompare
  }
  return left.target_subfamily_id.localeCompare(right.target_subfamily_id)
}

const toCrossFamilyBridgeItem = (
  edge: GraphEdge,
  sourceFamilyId: string,
  targetFamilyId: string,
): CrossFamilyBridgeItem => {
  const bridge: CrossFamilyBridgeItem = {
    source_subfamily_id: String(edge.properties.source_subfamily_id),
    target_subfamily_id: String(edge.properties.target_subfamily_id),
    source_family_id: sourceFamilyId,
    target_family_id: targetFamilyId,
    score: toFiniteNumber(edge.properties.score),
    dimensions: edge.properties.dimensions as Readonly<Record<string, number>>,
  }

  if (edge.properties.final_score !== undefined) {
    return {
      ...bridge,
      final_score: toFiniteNumber(edge.properties.final_score),
      ...(edge.properties.evidence !== undefined
        ? { evidence: edge.properties.evidence as Readonly<Record<string, unknown>> }
        : {}),
    }
  }

  if (edge.properties.evidence !== undefined) {
    return {
      ...bridge,
      evidence: edge.properties.evidence as Readonly<Record<string, unknown>>,
    }
  }

  return bridge
}

export const getSimilarityNeighborhood = (
  graph: OlfactoryGraph,
  subfamilyId: string,
): SimilarityNeighborhoodProof => {
  const subfamilyGraphId = subfamilyNodeId(subfamilyId)
  const neighbors: SimilarityNeighborhoodEntry[] = []

  for (const edge of graph.edges) {
    if (edge.kind !== 'similar_to') {
      continue
    }

    if (edge.source === subfamilyGraphId) {
      neighbors.push(toSimilarityNeighborhoodEntry(edge, edge.target, 'outbound'))
      continue
    }

    if (edge.target === subfamilyGraphId) {
      neighbors.push(toSimilarityNeighborhoodEntry(edge, edge.source, 'inbound'))
    }
  }

  const collapsedNeighbors = collapseNeighborhoodEntries(neighbors)
  collapsedNeighbors.sort(compareSimilarityNeighborhoodEntries)

  return {
    query_kind: 'similarity_neighborhood',
    params: { subfamily_id: subfamilyId },
    result: { neighbors: collapsedNeighbors },
  }
}

export const getCrossFamilyBridges = (graph: OlfactoryGraph): CrossFamilyBridgesProof => {
  const nodeIndex = buildNodeIndex(graph.nodes)
  const bridges: CrossFamilyBridgeItem[] = []

  for (const edge of graph.edges) {
    if (edge.kind !== 'similar_to') {
      continue
    }

    const sourceNode = nodeIndex.get(edge.source)
    const targetNode = nodeIndex.get(edge.target)
    if (!sourceNode || !targetNode || sourceNode.kind !== 'subfamily' || targetNode.kind !== 'subfamily') {
      continue
    }

    const sourceFamilyId = String(sourceNode.properties.family_id)
    const targetFamilyId = String(targetNode.properties.family_id)
    if (sourceFamilyId === targetFamilyId) {
      continue
    }

    bridges.push(toCrossFamilyBridgeItem(edge, sourceFamilyId, targetFamilyId))
  }

  bridges.sort(compareCrossFamilyBridgeItems)

  return {
    query_kind: 'cross_family_bridges',
    params: {},
    result: { bridges },
  }
}

export const getSimilarityHub = (graph: OlfactoryGraph): SimilarityHubProof => {
  const degreeBySubfamilyId = new Map<string, number>()

  for (const edge of graph.edges) {
    if (edge.kind !== 'similar_to') {
      continue
    }

    const sourceSubfamilyId = edge.source.replace(/^subfamily:/, '')
    const targetSubfamilyId = edge.target.replace(/^subfamily:/, '')

    degreeBySubfamilyId.set(sourceSubfamilyId, (degreeBySubfamilyId.get(sourceSubfamilyId) ?? 0) + 1)
    degreeBySubfamilyId.set(targetSubfamilyId, (degreeBySubfamilyId.get(targetSubfamilyId) ?? 0) + 1)
  }

  let hubSubfamilyId: string | null = null
  let hubDegree = -1

  for (const [subfamilyId, degree] of degreeBySubfamilyId) {
    if (
      hubSubfamilyId === null
      || degree > hubDegree
      || (degree === hubDegree && subfamilyId.localeCompare(hubSubfamilyId) < 0)
    ) {
      hubSubfamilyId = subfamilyId
      hubDegree = degree
    }
  }

  if (hubSubfamilyId === null) {
    return {
      query_kind: 'similarity_hub',
      params: {},
      result: { hub: null },
    }
  }

  const nodeIndex = buildNodeIndex(graph.nodes)
  const hubNode = nodeIndex.get(subfamilyNodeId(hubSubfamilyId))
  if (!hubNode || hubNode.kind !== 'subfamily') {
    return {
      query_kind: 'similarity_hub',
      params: {},
      result: { hub: null },
    }
  }

  return {
    query_kind: 'similarity_hub',
    params: {},
    result: {
      hub: {
        subfamily_id: hubSubfamilyId,
        graph_id: hubNode.id,
        family_id: String(hubNode.properties.family_id),
        degree: hubDegree,
      },
    },
  }
}

export const getRelatedDescriptors = (
  graph: OlfactoryGraph,
  descriptorId: string,
): RelatedDescriptorsProof => {
  const nodeIndex = buildNodeIndex(graph.nodes)
  const descriptorNode = nodeIndex.get(descriptorNodeId(descriptorId))

  if (!descriptorNode || descriptorNode.kind !== 'descriptor') {
    return {
      query_kind: 'related_descriptors',
      params: { descriptor_id: descriptorId },
      result: { descriptors: [] },
    }
  }

  const subfamilyId = String(descriptorNode.properties.subfamily_id)

  return {
    query_kind: 'related_descriptors',
    params: { descriptor_id: descriptorId },
    result: {
      descriptors: collectDescriptors(
        graph,
        node =>
          node.properties.subfamily_id === subfamilyId
          && String(node.properties.descriptor_id) !== descriptorId,
      ),
    },
  }
}
