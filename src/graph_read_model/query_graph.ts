import type {
  AliasResolutionPathProof,
  DescriptorProofItem,
  DescriptorToFamilyPathProof,
  DescriptorsByFamilyProof,
  DescriptorsBySubfamilyProof,
  GraphEdge,
  GraphNode,
  OlfactoryGraph,
  PathSegment,
  RelatedDescriptorsProof,
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

const toDescriptorProof = (node: GraphNode): DescriptorProofItem => ({
  id: String(node.properties.descriptor_id),
  graph_id: node.id,
  status: node.properties.status as DescriptorProofItem['status'],
  review_required: Boolean(node.properties.review_required),
  corpus_derived: Boolean(node.properties.corpus_derived),
  source: node.properties.source as DescriptorProofItem['source'],
})

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
    .sort(compareDescriptorProofItems)

const findInboundEdge = (
  edges: readonly GraphEdge[],
  kind: GraphEdge['kind'],
  targetId: string,
): GraphEdge | undefined => edges.find(edge => edge.kind === kind && edge.target === targetId)

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

  const containsDescriptorEdge = findInboundEdge(graph.edges, 'contains_descriptor', descriptorNode.id)
  if (!containsDescriptorEdge) {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

  const subfamilyNode = nodeIndex.get(containsDescriptorEdge.source)
  if (!subfamilyNode || subfamilyNode.kind !== 'subfamily') {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

  const containsSubfamilyEdge = findInboundEdge(graph.edges, 'contains_subfamily', subfamilyNode.id)
  if (!containsSubfamilyEdge) {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

  const familyNode = nodeIndex.get(containsSubfamilyEdge.source)
  if (!familyNode || familyNode.kind !== 'family') {
    return {
      query_kind: 'alias_resolution_path',
      params: { alias },
      result: { target_descriptor_id: null },
    }
  }

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

  const containsDescriptorEdge = findInboundEdge(graph.edges, 'contains_descriptor', descriptorNode.id)
  if (!containsDescriptorEdge) {
    return {
      query_kind: 'descriptor_to_family_path',
      params: { descriptor_id: descriptorId },
      result: { family_id: null, subfamily_id: null },
    }
  }

  const subfamilyNode = nodeIndex.get(containsDescriptorEdge.source)
  if (!subfamilyNode || subfamilyNode.kind !== 'subfamily') {
    return {
      query_kind: 'descriptor_to_family_path',
      params: { descriptor_id: descriptorId },
      result: { family_id: null, subfamily_id: null },
    }
  }

  const containsSubfamilyEdge = findInboundEdge(graph.edges, 'contains_subfamily', subfamilyNode.id)
  if (!containsSubfamilyEdge) {
    return {
      query_kind: 'descriptor_to_family_path',
      params: { descriptor_id: descriptorId },
      result: { family_id: null, subfamily_id: null },
    }
  }

  const familyNode = nodeIndex.get(containsSubfamilyEdge.source)
  if (!familyNode || familyNode.kind !== 'family') {
    return {
      query_kind: 'descriptor_to_family_path',
      params: { descriptor_id: descriptorId },
      result: { family_id: null, subfamily_id: null },
    }
  }

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
