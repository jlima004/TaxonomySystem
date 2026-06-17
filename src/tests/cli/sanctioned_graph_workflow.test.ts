import { execFileSync } from 'node:child_process'
import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { runGraphBuildCli } from '../../cli/graph_read_model.js'
import * as writeGraphModule from '../../graph_read_model/write_graph.js'
import {
  runSanctionedGraphWorkflow,
  SANCTIONED_GUARDRAIL_DEFINITIONS,
  type GuardrailExecutor,
  type GuardrailResult,
} from '../../cli/sanctioned_graph_workflow.js'
import {
  asValidatedGraph,
  createValidatedQueryConsumer,
} from '../../graph_read_model/query_consumer.js'
import type { OlfactoryGraph } from '../../graph_read_model/types.js'
import {
  snapshotDirectory,
  snapshotsEqual,
} from '../helpers/directory_snapshot.js'

export type InjectedTestEvidence = {
  execution_mode: 'injected_test_evidence'
  reason: 'recursive test invocation prevented'
}

export const createHybridGuardrailExecutor = (srcDir: string): GuardrailExecutor => {
  return (definitions) => {
    const results: GuardrailResult[] = []

    for (const guardrail of definitions) {
      if (guardrail.name === 'test') {
        const evidence: InjectedTestEvidence = {
          execution_mode: 'injected_test_evidence',
          reason: 'recursive test invocation prevented',
        }
        results.push({
          name: 'test',
          exitCode: 0,
          output: JSON.stringify(evidence),
        })
        continue
      }

      try {
        const output = execFileSync('npm', ['--prefix', srcDir, ...guardrail.args], {
          encoding: 'utf8',
          stdio: ['inherit', 'pipe', 'pipe'],
        })
        results.push({ name: guardrail.name, exitCode: 0, output: output.trim() })
      } catch (error) {
        const execError = error as { status?: number; stdout?: string; stderr?: string }
        const output = [execError.stdout ?? '', execError.stderr ?? ''].filter(Boolean).join('\n')
        results.push({
          name: guardrail.name,
          exitCode: execError.status ?? 1,
          output: output.trim(),
        })
        break
      }
    }

    const passed =
      results.every((result) => result.exitCode === 0)
      && results.length === definitions.length

    return { passed, results }
  }
}

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

describe('sandbox CLI boundary proofs', () => {
  beforeEach(() => {
    vi.spyOn(writeGraphModule, 'writeGraphOutput')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('non-dry-run sandbox success preserves graphify-out/** and reenters query consumer', async () => {
    const baseDir = await resolveBaseDir()
    const sandboxOutputDir = await mkdtemp(join(tmpdir(), 'sanctioned-graph-sandbox-'))
    const graphifyOutPath = join(baseDir, 'graphify-out')
    const graphPath = join(sandboxOutputDir, 'graph.json')
    const srcDir = resolve(baseDir, 'src')

    const graphifyBefore = await snapshotDirectory(graphifyOutPath)

    const stdoutLines: string[] = []
    const stderrLines: string[] = []
    const stdout = { log: (message: string) => { stdoutLines.push(message) } }
    const stderr = { error: (message: string) => { stderrLines.push(message) } }

    try {
      const exitCode = await runGraphBuildCli(['--json'], {
        sanctionedOutputDir: sandboxOutputDir,
        guardrailExecutor: createHybridGuardrailExecutor(srcDir),
        stdout,
        stderr,
      })

      const graphifyAfter = await snapshotDirectory(graphifyOutPath)

      expect(exitCode).toBe(0)
      expect(stderrLines).toHaveLength(0)

      const jsonStr = stdoutLines.find((line) => {
        try {
          JSON.parse(line)
          return true
        } catch {
          return false
        }
      })
      expect(jsonStr).toBeDefined()

      const parsed = JSON.parse(jsonStr!) as Record<string, unknown>
      expect(parsed.ok).toBe(true)
      expect(parsed.graph_output).toBe(graphPath)
      expect(parsed).toHaveProperty('boundary_audit')
      expect(parsed).toHaveProperty('guardrails')

      const boundaryAudit = parsed.boundary_audit as { ok: boolean; graphify_out_accesses: number } | null
      expect(boundaryAudit?.ok).toBe(true)
      expect(boundaryAudit?.graphify_out_accesses).toBe(0)

      const guardrails = parsed.guardrails as {
        passed: boolean
        results: Array<{ name: string; exitCode: number; output: string }>
      } | null
      expect(guardrails?.passed).toBe(true)
      expect(guardrails?.results.map((result) => result.name)).toEqual([
        'typecheck',
        'test',
        'alias:integrity',
        'verify:integrity',
      ])

      const testResult = guardrails?.results.find((result) => result.name === 'test')
      expect(testResult?.exitCode).toBe(0)
      const testEvidence = JSON.parse(testResult?.output ?? '{}') as InjectedTestEvidence
      expect(testEvidence.execution_mode).toBe('injected_test_evidence')
      expect(testEvidence.reason).toBe('recursive test invocation prevented')

      expect(snapshotsEqual(graphifyBefore, graphifyAfter)).toBe(true)

      const content = await readFile(graphPath, 'utf8')
      const graph = JSON.parse(content) as OlfactoryGraph
      expect(graph.schema_version).toBe('olfactory_graph_read_model.v1')

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

      const familyProof = consumerResult.consumer.getDescriptorsByFamily('woody')
      expect(familyProof.query_kind).toBe('descriptors_by_family')
      expect(familyProof.result.descriptors.length).toBeGreaterThan(0)
    } finally {
      await rm(sandboxOutputDir, { recursive: true, force: true })
    }
  }, 180000)
})
