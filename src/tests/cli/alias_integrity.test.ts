import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { runAliasIntegrityCli } from '../../cli/alias_integrity.js'

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>()
  return {
    ...actual,
    readFile: vi.fn(actual.readFile),
    access: vi.fn(actual.access),
  }
})

describe('runAliasIntegrityCli', () => {
  let consoleLogSpy: any
  let consoleErrorSpy: any

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.clearAllMocks()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('prints help and exits 0', async () => {
    const exitCode = await runAliasIntegrityCli(['--help'])
    expect(exitCode).toBe(0)
    expect(consoleLogSpy.mock.calls[0]?.[0]).toContain('Alias Target Integrity Proof CLI')
  })

  it('runs against real data, outputs JSON, and exits 1 with expected ylang ylang failure', async () => {
    const exitCode = await runAliasIntegrityCli(['--json'])
    expect(exitCode).toBe(1)
    
    const jsonStr = consoleLogSpy.mock.calls[0]?.[0]
    expect(jsonStr).toBeDefined()
    const jsonOut = JSON.parse(jsonStr as string)
    expect(jsonOut.status).toBe('FAIL')
    expect(jsonOut.unresolved_target_count).toBe(1)
    expect(jsonOut.unresolved[0]).toEqual(expect.objectContaining({
      alias: "ylang ylang",
      target: "ylang_ylang"
    }))
  })
})
