import { rm } from 'node:fs/promises'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { parseGraphBuildArgs, printHelp, runGraphBuildCli } from '../../cli/graph_read_model.js'
import { GRAPH_OUTPUT_POLICY } from '../../graph_read_model/contract.js'
import type { OlfactoryGraph } from '../../graph_read_model/types.js'

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

  it('runGraphBuildCli with --help returns 0', async () => {
    const exitCode = await runGraphBuildCli(['--help'])
    expect(exitCode).toBe(0)
  })

  it('help output contains graph:build and --json', async () => {
    await runGraphBuildCli(['--help'])
    const output = consoleLogSpy.mock.calls.flat().join('\n')
    expect(output).toContain('graph:build')
    expect(output).toContain('--json')
  })

  it('help output documents --dry-run flag', async () => {
    await runGraphBuildCli(['--help'])
    const output = consoleLogSpy.mock.calls.flat().join('\n')
    expect(output).toContain('--dry-run')
  })

  it('printHelp() output mentions sanctioned output path', () => {
    printHelp()
    const output = consoleLogSpy.mock.calls.flat().join('\n')
    expect(output).toContain(GRAPH_OUTPUT_POLICY.sanctioned_output_path)
  })
})

// ─── --dry-run integration ──────────────────────────────────────────────────

describe('--dry-run flag', () => {
  const dryRunOutputDir = '/tmp/graph-read-model-dry-run'
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

  it('--dry-run writes graph.json to /tmp/graph-read-model-dry-run/', async () => {
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
