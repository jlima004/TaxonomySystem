import { describe, it, expect } from 'vitest'
import { loadCorpus } from '../loader/corpus_loader.js'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures_dir = join(__dirname, 'fixtures')

describe('loadCorpus', () => {
  it('carrega fixture e retorna array com 4 materiais', async () => {
    const corpus = await loadCorpus(join(fixtures_dir, 'corpus_sample.json'))
    expect(corpus).toHaveLength(4)
  })

  it('cada material retornado tem as keys esperadas de SemanticMaterial', async () => {
    const corpus = await loadCorpus(join(fixtures_dir, 'corpus_sample.json'))
    corpus.forEach(mat => {
      const keys = Object.keys(mat)
      expect(keys).toEqual(expect.arrayContaining(['id', 'identity', 'olfactory']))
    })
  })

  it('olfactory output NÃO contém flavor_description', async () => {
    const corpus = await loadCorpus(join(fixtures_dir, 'corpus_sample.json'))
    const mat3 = corpus.find(m => m.id === 'mat-3')!
    expect('flavor_description' in mat3.olfactory).toBe(false)
  })

  it('olfactory.descriptors preserva array original', async () => {
    const corpus = await loadCorpus(join(fixtures_dir, 'corpus_sample.json'))
    const mat1 = corpus.find(m => m.id === 'mat-1')!
    expect(mat1.olfactory.descriptors).toEqual(["balsamic", "pine", "woody"])
  })

  it('olfactory.descriptor_sources preserva sub-objetos tgsc/sf', async () => {
    const corpus = await loadCorpus(join(fixtures_dir, 'corpus_sample.json'))
    const mat1 = corpus.find(m => m.id === 'mat-1')!
    expect(mat1.olfactory.descriptor_sources).toEqual({
      tgsc: ["balsamic", "pine"],
      sf: ["woody", "sweet"]
    })
  })

  it('identity preserva name, canonical_name, aliases, identifiers', async () => {
    const corpus = await loadCorpus(join(fixtures_dir, 'corpus_sample.json'))
    const mat1 = corpus.find(m => m.id === 'mat-1')!
    expect(mat1.identity.name).toBe("abies alba cone extract")
    expect(mat1.identity.canonical_name).toBe("abies alba cone extract")
    expect(mat1.identity.aliases).toEqual(["silver fir extract"])
    expect(mat1.identity.identifiers).toEqual({ cas: "90028-76-5", einecs: "289-870-2" })
  })

  it('path inexistente -> rejeita com mensagem contendo o path', async () => {
    await expect(loadCorpus(join(fixtures_dir, 'non_existent_corpus.json'))).rejects.toThrow(/non_existent_corpus\.json/)
  })

  it('JSON malformado -> rejeita com mensagem de parse', async () => {
    const fs = await import('node:fs/promises')
    const malformedPath = join(fixtures_dir, 'malformed_corpus.json')
    await fs.writeFile(malformedPath, '{ "malformed": ')
    
    await expect(loadCorpus(malformedPath)).rejects.toThrow(/Failed to parse JSON/)
    
    await fs.unlink(malformedPath)
  })

  it('input não-array -> rejeita com "Expected JSON array"', async () => {
    const fs = await import('node:fs/promises')
    const notArrayPath = join(fixtures_dir, 'not_array_corpus.json')
    await fs.writeFile(notArrayPath, '{ "not_array": true }')
    
    await expect(loadCorpus(notArrayPath)).rejects.toThrow(/Expected JSON array/)
    
    await fs.unlink(notArrayPath)
  })

  it('material sem olfactory data retorna defaults vazios', async () => {
    const corpus = await loadCorpus(join(fixtures_dir, 'corpus_sample.json'))
    const mat2 = corpus.find(m => m.id === 'mat-2')!
    expect(mat2.olfactory).toEqual({
      descriptors: [],
      primary_type: '',
      odor_description: '',
      descriptor_sources: {}
    })
  })

})
