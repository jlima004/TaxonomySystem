import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import {
  GRAPH_ALLOWED_PRODUCTION_INPUTS,
  GRAPH_EXPECTED_BASELINE_STATS,
} from '../../graph_read_model/contract.js'
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

const productionModulePaths = {
  buildGraph: path.join(repoRoot, 'src/graph_read_model/build_graph.ts'),
  validateGraph: path.join(repoRoot, 'src/graph_read_model/validate_graph.ts'),
  queryGraph: path.join(repoRoot, 'src/graph_read_model/query_graph.ts'),
} as const

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

describe('live compiled v2 artifact baseline regression', () => {
  it('builds and validates the protected 10/18/341/18/13 graph from sanctioned artifacts only', async () => {
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
    expect(graph.stats).toEqual({
      families: 10,
      subfamilies: 18,
      descriptors: 341,
      aliases: 18,
      subfamily_similarity_edges: 13,
    })

    const nodeIds = new Set(graph.nodes.map(node => node.id))
    const descriptorIds = new Set(
      graph.nodes.filter(node => node.kind === 'descriptor').map(node => node.id),
    )
    const subfamilyIds = new Set(
      graph.nodes.filter(node => node.kind === 'subfamily').map(node => node.id),
    )

    const aliasEdges = graph.edges.filter(edge => edge.kind === 'resolves_to')
    expect(aliasEdges).toHaveLength(18)

    for (const edge of aliasEdges) {
      expect(nodeIds.has(edge.source)).toBe(true)
      expect(descriptorIds.has(edge.target)).toBe(true)
      expect(edge.target.startsWith('descriptor:')).toBe(true)
    }

    const similarityEdges = graph.edges.filter(edge => edge.kind === 'similar_to')
    expect(similarityEdges).toHaveLength(13)

    for (const edge of similarityEdges) {
      expect(subfamilyIds.has(edge.source)).toBe(true)
      expect(subfamilyIds.has(edge.target)).toBe(true)
      expect(edge.source.startsWith('subfamily:')).toBe(true)
      expect(edge.target.startsWith('subfamily:')).toBe(true)
    }
  })

  it('keeps Phase 56 and Phase 57 production graph modules free from filesystem and path-based APIs', async () => {
    const [buildSource, validateSource, querySource] = await Promise.all([
      readFile(productionModulePaths.buildGraph, 'utf8'),
      readFile(productionModulePaths.validateGraph, 'utf8'),
      readFile(productionModulePaths.queryGraph, 'utf8'),
    ])

    for (const source of [buildSource, validateSource, querySource]) {
      expect(source).not.toMatch(/from 'node:fs'|from "node:fs"|from 'node:fs\/promises'|from "node:fs\/promises"/)
      expect(source).not.toMatch(/readFile\(|writeFile\(|createReadStream\(/)
      expect(source).not.toContain('graphify-out/')
      expect(source).not.toContain('data/enriched_materials.json')
    }
  })
})
