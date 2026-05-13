import { describe, it, expect, expectTypeOf } from 'vitest'
import type {
  CorpusMaterial,
  OlfactoryProfile,
  MolecularProperties,
  TaxonomySeed,
  TaxonomySeedFamily,
  TaxonomySeedSubfamily,
  SeedMetadata,
  CompiledTaxonomy,
  TaxonomyFamily,
  TaxonomySubfamily,
  TaxonomyStats,
  CanonicalDescriptor,
  DescriptorAliasMap,
  SimilarityGraph,
  SimilarityDimension,
  SimilarityEdge,
  SimilarityStats,
} from '../types/index.ts'

describe('domain type definitions', () => {
  it('CorpusMaterial has olfactory property', () => {
    expectTypeOf<CorpusMaterial>().toHaveProperty('olfactory')
  })

  it('TaxonomySeed has families property', () => {
    expectTypeOf<TaxonomySeed>().toHaveProperty('families')
  })

  it('CompiledTaxonomy has stats property', () => {
    expectTypeOf<CompiledTaxonomy>().toHaveProperty('stats')
  })

  it('SimilarityGraph has edges property', () => {
    expectTypeOf<SimilarityGraph>().toHaveProperty('edges')
  })

  it('CanonicalDescriptor.source accepts only seed | corpus | inferred', () => {
    expectTypeOf<CanonicalDescriptor['source']>().toEqualTypeOf<'seed' | 'corpus' | 'inferred'>()
  })

  it('CanonicalDescriptor compiles as object literal', () => {
    const descriptor: CanonicalDescriptor = {
      id: 'jasmine',
      source: 'seed',
      frequency: 42,
    }
    expect(descriptor.id).toBe('jasmine')
    expect(descriptor.source).toBe('seed')
    expect(descriptor.frequency).toBe(42)
  })

  it('DescriptorAliasMap is a readonly record of string to string', () => {
    const aliases: DescriptorAliasMap = {
      'jasmin': 'jasmine',
      'jasmim': 'jasmine',
    }
    expect(aliases['jasmin']).toBe('jasmine')
  })

  it('OlfactoryProfile has readonly descriptor arrays', () => {
    expectTypeOf<OlfactoryProfile>().toHaveProperty('descriptors')
    expectTypeOf<OlfactoryProfile['descriptors']>().toEqualTypeOf<readonly string[]>()
  })

  it('SimilarityEdge has multi-dimensional scores', () => {
    expectTypeOf<SimilarityEdge>().toHaveProperty('dimensions')
    expectTypeOf<SimilarityEdge['score']>().toBeNumber()
  })
})
