import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import {
  GRAPH_ALLOWED_PRODUCTION_INPUTS,
  GRAPH_EXPECTED_BASELINE_STATS,
} from '../../graph_read_model/contract.js'
import {
  getCrossFamilyBridges,
  getDescriptorToFamilyPath,
  getDescriptorsByFamily,
  getDescriptorsBySubfamily,
  getRelatedDescriptors,
  getSimilarityHub,
  getSimilarityNeighborhood,
  resolveAliasPath,
} from '../../graph_read_model/query_graph.js'
import {
  asValidatedGraph,
  createValidatedQueryConsumer,
} from '../../graph_read_model/query_consumer.js'
import { validateSanctionedV211Graph } from '../../graph_read_model/validate_graph.js'
import type { CompiledAliases } from '../../compiler/types.js'
import type { CompiledTaxonomy } from '../../types/taxonomy.js'
import type { SimilarityGraph } from '../../types/similarity.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const compiledPaths = {
  taxonomy: path.join(repoRoot, 'data/compiled/v2/taxonomy.json'),
  aliases: path.join(repoRoot, 'data/compiled/v2/descriptor_aliases.json'),
  similarity: path.join(repoRoot, 'data/compiled/v2/similarity_matrix.json'),
} as const

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

const isSortedById = <T extends { id: string }>(items: readonly T[]): boolean => {
  for (let index = 1; index < items.length; index += 1) {
    const previous = items[index - 1]
    const current = items[index]
    if (!previous || !current) {
      return false
    }
    if (previous.id.localeCompare(current.id) > 0) {
      return false
    }
  }
  return true
}

describe('live compiled v2 query baseline regression', () => {
  it('proves aggregate catalog consumability with structural assertions at baseline scale', async () => {
    const sanctionedRelativePaths = [
      path.relative(repoRoot, compiledPaths.taxonomy),
      path.relative(repoRoot, compiledPaths.aliases),
      path.relative(repoRoot, compiledPaths.similarity),
    ]
    expect(sanctionedRelativePaths).toEqual([...GRAPH_ALLOWED_PRODUCTION_INPUTS])

    const [taxonomy, aliases, similarity] = await Promise.all([
      readJson<CompiledTaxonomy>(compiledPaths.taxonomy),
      readJson<CompiledAliases>(compiledPaths.aliases),
      readJson<SimilarityGraph>(compiledPaths.similarity),
    ])

    const graph = buildOlfactoryGraph({ taxonomy, aliases, similarity })
    const validation = validateSanctionedV211Graph(graph)

    expect(validation).toEqual({
      ok: true,
      errors: [],
      warnings: [],
    })
    expect(graph.stats).toEqual(GRAPH_EXPECTED_BASELINE_STATS)

    const familyIds = taxonomy.families.map(family => family.id)
    expect(familyIds).toHaveLength(10)

    for (const familyId of familyIds) {
      const proof = getDescriptorsByFamily(graph, familyId)
      expect(proof.query_kind).toBe('descriptors_by_family')
      expect(proof.params).toEqual({ family_id: familyId })
      expect(proof.result.descriptors.length).toBeGreaterThan(0)
      expect(isSortedById(proof.result.descriptors)).toBe(true)
      expect(proof.path).toBeUndefined()
    }

    const aliasEntries = Object.entries(aliases.aliases)
    expect(aliasEntries).toHaveLength(18)

    for (const [alias] of aliasEntries) {
      const proof = resolveAliasPath(graph, alias)
      expect(proof.query_kind).toBe('alias_resolution_path')
      expect(proof.params).toEqual({ alias })
      expect(proof.result.target_descriptor_id).not.toBeNull()
      expect(proof.path).toBeDefined()
      expect(proof.path?.length).toBe(4)
    }

    const cedarProof = resolveAliasPath(graph, 'cedar')
    expect(cedarProof.result.target_descriptor_id).toBe('cedarwood')

    const subfamiliesWithSimilarity = new Set<string>()
    for (const edge of similarity.edges) {
      subfamiliesWithSimilarity.add(edge.source)
      subfamiliesWithSimilarity.add(edge.target)
    }

    for (const subfamilyId of subfamiliesWithSimilarity) {
      const proof = getSimilarityNeighborhood(graph, subfamilyId)
      expect(proof.query_kind).toBe('similarity_neighborhood')
      expect(proof.params).toEqual({ subfamily_id: subfamilyId })
      expect(proof.result.neighbors.length).toBeGreaterThan(0)
      expect(proof.path).toBeUndefined()
    }

    const bridgesProof = getCrossFamilyBridges(graph)
    expect(bridgesProof.query_kind).toBe('cross_family_bridges')
    expect(bridgesProof.result.bridges).toHaveLength(5)
    expect(bridgesProof.path).toBeUndefined()

    const hubProof = getSimilarityHub(graph)
    expect(hubProof.query_kind).toBe('similarity_hub')
    expect(hubProof.result.hub).toEqual({
      subfamily_id: 'floral_rose',
      graph_id: 'subfamily:floral_rose',
      family_id: 'floral',
      degree: 3,
    })
    expect(hubProof.path).toBeUndefined()

    const woodyFamilyProof = getDescriptorsByFamily(graph, 'woody')
    expect(woodyFamilyProof.result.descriptors).toHaveLength(18)

    const woodyDryProof = getDescriptorsBySubfamily(graph, 'woody_dry')
    expect(woodyDryProof.result.descriptors.length).toBeGreaterThan(0)
    expect(isSortedById(woodyDryProof.result.descriptors)).toBe(true)

    const cedarwoodPathProof = getDescriptorToFamilyPath(graph, 'cedarwood')
    expect(cedarwoodPathProof.result).toEqual({
      family_id: 'woody',
      subfamily_id: 'woody_dry',
    })
    expect(cedarwoodPathProof.path).toBeDefined()

    const relatedProof = getRelatedDescriptors(graph, 'cedarwood')
    expect(relatedProof.result.descriptors.length).toBeGreaterThan(0)
    expect(relatedProof.result.descriptors.every(descriptor => descriptor.id !== 'cedarwood')).toBe(true)
    expect(isSortedById(relatedProof.result.descriptors)).toBe(true)
  })

  it('proves sanctioned live v2 graph consumability through the validated query consumer', async () => {
    const [taxonomy, aliases, similarity] = await Promise.all([
      readJson<CompiledTaxonomy>(compiledPaths.taxonomy),
      readJson<CompiledAliases>(compiledPaths.aliases),
      readJson<SimilarityGraph>(compiledPaths.similarity),
    ])

    const graph = buildOlfactoryGraph({ taxonomy, aliases, similarity })
    const validated = asValidatedGraph(graph)
    expect(validated.ok).toBe(true)
    if (!validated.ok) {
      return
    }

    const consumerResult = createValidatedQueryConsumer(validated.graph)
    expect(consumerResult.ok).toBe(true)
    if (!consumerResult.ok) {
      return
    }

    const { consumer } = consumerResult
    expect(graph.stats).toEqual(GRAPH_EXPECTED_BASELINE_STATS)

    const familyIds = taxonomy.families.map(family => family.id)
    expect(familyIds).toHaveLength(10)

    for (const familyId of familyIds) {
      const proof = consumer.getDescriptorsByFamily(familyId)
      expect(proof.query_kind).toBe('descriptors_by_family')
      expect(proof.params).toEqual({ family_id: familyId })
      expect(proof.result.descriptors.length).toBeGreaterThan(0)
      expect(isSortedById(proof.result.descriptors)).toBe(true)
      expect(proof.path).toBeUndefined()
    }

    const aliasEntries = Object.entries(aliases.aliases)
    expect(aliasEntries).toHaveLength(18)

    for (const [alias] of aliasEntries) {
      const proof = consumer.resolveAliasPath(alias)
      expect(proof.query_kind).toBe('alias_resolution_path')
      expect(proof.params).toEqual({ alias })
      expect(proof.result.target_descriptor_id).not.toBeNull()
      expect(proof.path).toBeDefined()
      expect(proof.path?.length).toBe(4)
    }

    expect(consumer.resolveAliasPath('cedar').result.target_descriptor_id).toBe('cedarwood')

    const subfamiliesWithSimilarity = new Set<string>()
    for (const edge of similarity.edges) {
      subfamiliesWithSimilarity.add(edge.source)
      subfamiliesWithSimilarity.add(edge.target)
    }

    for (const subfamilyId of subfamiliesWithSimilarity) {
      const proof = consumer.getSimilarityNeighborhood(subfamilyId)
      expect(proof.query_kind).toBe('similarity_neighborhood')
      expect(proof.params).toEqual({ subfamily_id: subfamilyId })
      expect(proof.result.neighbors.length).toBeGreaterThan(0)
      expect(proof.path).toBeUndefined()
    }

    const bridgesProof = consumer.getCrossFamilyBridges()
    expect(bridgesProof.query_kind).toBe('cross_family_bridges')
    expect(bridgesProof.result.bridges).toHaveLength(5)
    expect(bridgesProof.path).toBeUndefined()

    const hubProof = consumer.getSimilarityHub()
    expect(hubProof.query_kind).toBe('similarity_hub')
    expect(hubProof.result.hub).toEqual({
      subfamily_id: 'floral_rose',
      graph_id: 'subfamily:floral_rose',
      family_id: 'floral',
      degree: 3,
    })
    expect(hubProof.path).toBeUndefined()

    const woodyFamilyProof = consumer.getDescriptorsByFamily('woody')
    expect(woodyFamilyProof.result.descriptors).toHaveLength(18)

    const woodyDryProof = consumer.getDescriptorsBySubfamily('woody_dry')
    expect(woodyDryProof.result.descriptors.length).toBeGreaterThan(0)
    expect(isSortedById(woodyDryProof.result.descriptors)).toBe(true)

    const cedarwoodPathProof = consumer.getDescriptorToFamilyPath('cedarwood')
    expect(cedarwoodPathProof.result).toEqual({
      family_id: 'woody',
      subfamily_id: 'woody_dry',
    })
    expect(cedarwoodPathProof.path).toBeDefined()

    const relatedProof = consumer.getRelatedDescriptors('cedarwood')
    expect(relatedProof.result.descriptors.length).toBeGreaterThan(0)
    expect(relatedProof.result.descriptors.every(descriptor => descriptor.id !== 'cedarwood')).toBe(true)
    expect(isSortedById(relatedProof.result.descriptors)).toBe(true)
  })
})
