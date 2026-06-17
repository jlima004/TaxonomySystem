import { access, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as writeGraphModule from '../../graph_read_model/write_graph.js'
import {
  runSanctionedGraphWorkflow,
  SANCTIONED_GUARDRAIL_DEFINITIONS,
  type GuardrailExecutor,
} from '../../cli/sanctioned_graph_workflow.js'

const resolveBaseDir = async (): Promise<string> => {
  const cwd = process.cwd()
  for (const candidate of [cwd, join(cwd, '..')]) {
    try {
      await access(join(candidate, 'data'))
      return candidate
    } catch {
      // try next candidate
    }
  }
  return cwd
}

describe('runSanctionedGraphWorkflow', () => {
  beforeEach(() => {
    vi.spyOn(writeGraphModule, 'writeGraphOutput')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns forbidden_path before invoking guardrails for a forbidden output dir', async () => {
    const guardrailExecutor = vi.fn<GuardrailExecutor>()

    const result = await runSanctionedGraphWorkflow({
      outputDir: 'graphify-out/export',
      dryRun: false,
      skipGuardrails: false,
      guardrailExecutor,
      baseDir: await resolveBaseDir(),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('forbidden_path')
    }
    expect(guardrailExecutor).not.toHaveBeenCalled()
    expect(writeGraphModule.writeGraphOutput).not.toHaveBeenCalled()
  })

  it('requests guardrails in sanctioned order', async () => {
    const outputDir = '/tmp/sanctioned-graph-workflow-order'
    const requestedNames: string[] = []
    const guardrailExecutor = vi.fn<GuardrailExecutor>((definitions) => {
      requestedNames.push(...definitions.map((definition) => definition.name))
      return {
        passed: true,
        results: definitions.map((definition) => ({
          name: definition.name,
          exitCode: 0,
          output: '',
        })),
      }
    })

    try {
      const result = await runSanctionedGraphWorkflow({
        outputDir,
        dryRun: false,
        skipGuardrails: false,
        guardrailExecutor,
        baseDir: await resolveBaseDir(),
      })

      expect(result.ok).toBe(true)
      expect(requestedNames).toEqual(SANCTIONED_GUARDRAIL_DEFINITIONS.map((d) => d.name))
      expect(requestedNames).toEqual([
        'typecheck',
        'test',
        'alias:integrity',
        'verify:integrity',
      ])
      expect(writeGraphModule.writeGraphOutput).toHaveBeenCalled()
    } finally {
      await rm(outputDir, { recursive: true, force: true })
    }
  }, 60000)

  it('stops after the first failing guardrail', async () => {
    const guardrailExecutor = vi.fn<GuardrailExecutor>(() => ({
      passed: false,
      results: [{ name: 'typecheck', exitCode: 1, output: 'typecheck failed' }],
    }))

    const result = await runSanctionedGraphWorkflow({
      outputDir: '/tmp/sanctioned-graph-workflow-guardrail-fail',
      dryRun: false,
      skipGuardrails: false,
      guardrailExecutor,
      baseDir: await resolveBaseDir(),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('guardrail_failed')
    }
    expect(guardrailExecutor).toHaveBeenCalledTimes(1)
    expect(writeGraphModule.writeGraphOutput).not.toHaveBeenCalled()
  }, 60000)
})
