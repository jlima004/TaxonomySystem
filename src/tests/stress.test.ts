import { describe, it, expect } from 'vitest'
import { loadCorpus } from '../loader/corpus_loader.js'
import { join } from 'node:path'
import { writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'

describe('Performance Limits (Stress Test)', () => {
  it('should load and process 50,000 instances under 1.5 seconds', async () => {
    const items = []
    for (let i = 0; i < 50000; i++) {
      items.push({
        id: `mat_${i}`,
        identity: { name: `Material ${i}` },
        olfactory: { descriptors: ['woody', 'floral'] }
      })
    }
    
    const tmpFile = join(tmpdir(), 'stress-corpus.json')
    await writeFile(tmpFile, JSON.stringify(items))

    const start = performance.now()
    const result = await loadCorpus(tmpFile)
    const end = performance.now()

    await rm(tmpFile)

    expect(result.length).toBe(50000)
    // The requirement says "< 1.5 seconds". We test if it is below 1500ms.
    expect(end - start).toBeLessThan(1500)
  })
})
