import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { parseGraphBuildArgs, printHelp, resolveDryRunOutputDir, runGraphBuildCli } from '../../cli/graph_read_model.js'
import { GRAPH_OUTPUT_POLICY } from '../../graph_read_model/contract.js'
import type { OlfactoryGraph } from '../../graph_read_model/types.js'
import {
  snapshotDirectory,
  snapshotsEqual,
} from '../helpers/directory_snapshot.js'
import { createHybridGuardrailExecutor } from '../helpers/hybrid_guardrail_executor.js'

// ─── parseGraphBuildArgs ────────────────────────────────────────────────────

describe('parseGraphBuildArgs', () => {
  it('returns all false for empty args (default state)', () => {
    const args = parseGraphBuildArgs([])
    expect(args.json).toBe(false)
    expect(args.help).toBe(false)
    expect(args.dryRun).toBe(false)
    expect(args.skipGuardrails).toBe(false)
  })

  it('sets json: true when --json is passed', () => {
    const args = parseGraphBuildArgs(['--json'])
    expect(args.json).toBe(true)
  })

  it('sets help: true when --help is passed', () => {
    const args = parseGraphBuildArgs(['--help'])
    expect(args.help).toBe(true)
  })

  it('sets dryRun: true when --dry-run is passed', () => {
    const args = parseGraphBuildArgs(['--dry-run'])
    expect(args.dryRun).toBe(true)
  })

  it('sets skipGuardrails: true when --skip-guardrails is passed', () => {
    const args = parseGraphBuildArgs(['--skip-guardrails'])
    expect(args.skipGuardrails).toBe(true)
  })

  it('handles combined flags correctly', () => {
    const args = parseGraphBuildArgs(['--json', '--dry-run', '--skip-guardrails'])
    expect(args.json).toBe(true)
    expect(args.dryRun).toBe(true)
    expect(args.skipGuardrails).toBe(true)
    expect(args.help).toBe(false)
  })

  it('does not set any flag when unrecognized flags are passed (treated as unknown, not --help)', () => {
    const args = parseGraphBuildArgs(['--unknown-flag'])
    expect(args.help).toBe(false)
    expect(args.json).toBe(false)
    expect(args.dryRun).toBe(false)
  })
})

// ─── --help integration ─────────────────────────────────────────────────────

describe('--help flag', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it('runGraphBuildCli with --help routes help through injectable stdout', async () => {
    const stdoutLines: string[] = []
    const exitCode = await runGraphBuildCli(['--help'], {
      stdout: { log: (message: string) => { stdoutLines.push(message) } },
    })
    expect(exitCode).toBe(0)
    expect(stdoutLines.join('\n')).toContain('graph:build')
    expect(stdoutLines.join('\n')).toContain('--json')
  })

  it('help output documents --dry-run flag', async () => {
    const stdoutLines: string[] = []
    await runGraphBuildCli(['--help'], {
      stdout: { log: (message: string) => { stdoutLines.push(message) } },
    })
    expect(stdoutLines.join('\n')).toContain('--dry-run')
  })

  it('printHelp() output mentions sanctioned output path', () => {
    const stdoutLines: string[] = []
    printHelp({ log: (message: string) => { stdoutLines.push(message) } })
    expect(stdoutLines.join('\n')).toContain(GRAPH_OUTPUT_POLICY.sanctioned_output_path)
  })
})

// ─── --dry-run integration ──────────────────────────────────────────────────

describe('--dry-run flag', () => {
  const dryRunOutputDir = resolveDryRunOutputDir()
  const dryRunGraphPath = `${dryRunOutputDir}/graph.json`

  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(async () => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    // Cleanup dry-run output after each test
    await rm(dryRunOutputDir, { recursive: true, force: true })
  })

  it('--dry-run --skip-guardrails returns 0', async () => {
    const exitCode = await runGraphBuildCli(['--dry-run', '--skip-guardrails'])
    expect(exitCode).toBe(0)
  }, 60000)

  it('--dry-run writes graph.json to the process-unique temp directory', async () => {
    await runGraphBuildCli(['--dry-run', '--skip-guardrails'])

    const { readFile } = await import('node:fs/promises')
    const content = await readFile(dryRunGraphPath, 'utf8')
    expect(content).toBeTruthy()
  }, 60000)

  it('dry-run graph.json contains valid OlfactoryGraph shape', async () => {
    await runGraphBuildCli(['--dry-run', '--skip-guardrails'])

    const { readFile } = await import('node:fs/promises')
    const content = await readFile(dryRunGraphPath, 'utf8')
    const parsed = JSON.parse(content) as OlfactoryGraph

    expect(parsed).toHaveProperty('schema_version')
    expect(parsed).toHaveProperty('nodes')
    expect(parsed).toHaveProperty('edges')
    expect(parsed).toHaveProperty('stats')
    expect(parsed.schema_version).toBe('olfactory_graph_read_model.v1')
    expect(Array.isArray(parsed.nodes)).toBe(true)
    expect(Array.isArray(parsed.edges)).toBe(true)
  }, 60000)

  it('--dry-run --json produces JSON with graph_output field', async () => {
    await runGraphBuildCli(['--dry-run', '--json', '--skip-guardrails'])

    const jsonStr = consoleLogSpy.mock.calls.find(call => {
      try {
        JSON.parse(call[0] as string)
        return true
      } catch {
        return false
      }
    })?.[0] as string | undefined

    expect(jsonStr).toBeDefined()
    const parsed = JSON.parse(jsonStr!) as Record<string, unknown>
    expect(parsed).toHaveProperty('graph_output')
    expect(parsed.graph_output).toContain('graph-read-model-dry-run')
  }, 60000)

  it('--dry-run --json has boundary_audit as null (skipped in dry-run)', async () => {
    await runGraphBuildCli(['--dry-run', '--json', '--skip-guardrails'])

    const jsonStr = consoleLogSpy.mock.calls.find(call => {
      try {
        JSON.parse(call[0] as string)
        return true
      } catch {
        return false
      }
    })?.[0] as string | undefined

    expect(jsonStr).toBeDefined()
    const parsed = JSON.parse(jsonStr!) as Record<string, unknown>
    expect(parsed.boundary_audit).toBeNull()
  }, 60000)
})

// ─── Output path policy ─────────────────────────────────────────────────────

describe('Output path policy', () => {
  it('does not have a --out flag in parseGraphBuildArgs', () => {
    // --out should NOT exist as a recognized flag
    const args = parseGraphBuildArgs(['--out', '/some/path'])
    // The --out flag should simply be ignored; no 'out' property in the type
    expect('out' in args).toBe(false)
  })

  it('default output path matches GRAPH_OUTPUT_POLICY.sanctioned_output_path', async () => {
    // We verify via printHelp that the sanctioned path is documented
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    printHelp()
    const output = logSpy.mock.calls.flat().join('\n')
    expect(output).toContain(GRAPH_OUTPUT_POLICY.sanctioned_output_path)
    logSpy.mockRestore()
  })

  it('GRAPH_OUTPUT_POLICY.sanctioned_output_path points to olfactory-graph v2.11', () => {
    expect(GRAPH_OUTPUT_POLICY.sanctioned_output_path).toContain('olfactory-graph')
    expect(GRAPH_OUTPUT_POLICY.sanctioned_output_path).toContain('v2.11')
  })
})

// ─── Public CLI JSON contract ────────────────────────────────────────────────

const parseJsonStdout = (lines: string[]): Record<string, unknown> => {
  const jsonStr = lines.find((line) => {
    try {
      JSON.parse(line)
      return true
    } catch {
      return false
    }
  })
  expect(jsonStr).toBeDefined()
  return JSON.parse(jsonStr!) as Record<string, unknown>
}

describe('Public CLI JSON contract', () => {
  it('--dry-run --json keeps the stable top-level success shape', async () => {
    const stdoutLines: string[] = []
    const stderrLines: string[] = []

    const exitCode = await runGraphBuildCli(['--dry-run', '--json', '--skip-guardrails'], {
      stdout: { log: (message: string) => { stdoutLines.push(message) } },
      stderr: { error: (message: string) => { stderrLines.push(message) } },
    })

    expect(exitCode).toBe(0)
    const parsed = parseJsonStdout(stdoutLines)
    expect(Object.keys(parsed).sort()).toEqual(['boundary_audit', 'graph_output', 'guardrails', 'ok'])
    expect(parsed.ok).toBe(true)
    expect(parsed).toHaveProperty('graph_output')
    expect(parsed).toHaveProperty('boundary_audit')
    expect(parsed).toHaveProperty('guardrails')
    expect(stderrLines).toHaveLength(0)
  }, 60000)
})

// ─── Stable CLI markers ──────────────────────────────────────────────────────

describe('Stable CLI markers', () => {
  const dryRunOutputDir = resolveDryRunOutputDir()

  afterEach(async () => {
    await rm(dryRunOutputDir, { recursive: true, force: true })
  })

  it('human-readable dry-run success uses stable completion markers', async () => {
    const stdoutLines: string[] = []
    const stderrLines: string[] = []

    const exitCode = await runGraphBuildCli(['--dry-run', '--skip-guardrails'], {
      stdout: { log: (message: string) => { stdoutLines.push(message) } },
      stderr: { error: (message: string) => { stderrLines.push(message) } },
    })

    const stdout = stdoutLines.join('\n')
    expect(exitCode).toBe(0)
    expect(stderrLines).toHaveLength(0)
    expect(stdout).toContain('✓ Graph written:')
    expect(stdout).toContain('graph:build complete')
  }, 60000)

  it('forbidden-path failure uses stable error prefix without success markers', async () => {
    const stdoutLines: string[] = []
    const stderrLines: string[] = []

    const exitCode = await runGraphBuildCli([], {
      sanctionedOutputDir: 'graphify-out/export',
      stdout: { log: (message: string) => { stdoutLines.push(message) } },
      stderr: { error: (message: string) => { stderrLines.push(message) } },
    })

    expect(exitCode).toBe(1)
    expect(stderrLines.join('\n')).toContain('Graph write error [forbidden_prefix]')
    expect(stdoutLines.join('\n')).not.toContain('graph:build complete')
  }, 60000)
})

// ─── Internal composition seam ───────────────────────────────────────────────

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

describe('Internal composition seam', () => {
  it('routes sandbox output through sanctionedOutputDir without accepting --out', async () => {
    const args = parseGraphBuildArgs(['--json', '--out', '/tmp/ignored'])
    expect('out' in args).toBe(false)

    const baseDir = await resolveBaseDir()
    const sandboxOutputDir = await mkdtemp(join(tmpdir(), 'graph-cli-sandbox-'))
    const graphPath = join(sandboxOutputDir, 'graph.json')
    const graphifyOutPath = join(baseDir, 'graphify-out')
    const graphifyBefore = await snapshotDirectory(graphifyOutPath)

    const stdoutLines: string[] = []
    const stderrLines: string[] = []

    try {
      const exitCode = await runGraphBuildCli(['--json'], {
        sanctionedOutputDir: sandboxOutputDir,
        guardrailExecutor: createHybridGuardrailExecutor(join(baseDir, 'src')),
        stdout: { log: (message: string) => { stdoutLines.push(message) } },
        stderr: { error: (message: string) => { stderrLines.push(message) } },
      })

      const graphifyAfter = await snapshotDirectory(graphifyOutPath)
      const parsed = parseJsonStdout(stdoutLines)

      expect(exitCode).toBe(0)
      expect(stderrLines).toHaveLength(0)
      expect(parsed.ok).toBe(true)
      expect(parsed.graph_output).toBe(graphPath)
      expect(snapshotsEqual(graphifyBefore, graphifyAfter)).toBe(true)

      const content = await readFile(graphPath, 'utf8')
      expect(JSON.parse(content)).toHaveProperty('schema_version')
    } finally {
      await rm(sandboxOutputDir, { recursive: true, force: true })
    }
  }, 180000)
})
