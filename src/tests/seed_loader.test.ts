import { describe, it, expect } from 'vitest'
import { loadTaxonomySeed, SeedLoadError, SeedParseError, SeedValidationError } from '../loader/seed_loader.js'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures_dir = join(__dirname, 'fixtures')

describe('loadTaxonomySeed', () => {
  it('load of valid fixture -> resolves with TaxonomySeed', async () => {
    const seed = await loadTaxonomySeed(join(fixtures_dir, 'valid_seed.json'))
    expect(seed.version).toBe('1.0.0')
    expect(seed.families).toHaveLength(1)
  })

  it('non-existent path -> rejects with file message', async () => {
    await expect(loadTaxonomySeed(join(fixtures_dir, 'non_existent.json'))).rejects.toThrow(SeedLoadError)
  })

  it('malformed JSON -> rejects with parse message', async () => {
    const fs = await import('node:fs/promises')
    const malformedPath = join(fixtures_dir, 'malformed.json')
    await fs.writeFile(malformedPath, '{ "unclosed": "json"')
    
    await expect(loadTaxonomySeed(malformedPath)).rejects.toThrow(SeedParseError)
    
    await fs.unlink(malformedPath)
  })

  it('invalid seed -> rejects with validation errors in message', async () => {
    await expect(loadTaxonomySeed(join(fixtures_dir, 'invalid_seed.json'))).rejects.toThrow(SeedValidationError)
  })
})
