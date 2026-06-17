import { access } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { GRAPH_ALLOWED_PRODUCTION_INPUTS, GRAPH_OUTPUT_POLICY } from '../graph_read_model/contract.js'
import {
  createDefaultGuardrailExecutor,
  loadGraphInputs,
  runSanctionedGraphWorkflow,
  SANCTIONED_GUARDRAIL_DEFINITIONS,
  type GuardrailExecutor,
  type GuardrailsResult,
  type SanctionedWorkflowResult,
} from './sanctioned_graph_workflow.js'

// ─── Arg Types ──────────────────────────────────────────────────────────────

type GraphBuildArgs = {
  json: boolean
  help: boolean
  dryRun: boolean
  skipGuardrails: boolean
}

export type GraphBuildCliDeps = {
  workflowRunner?: typeof runSanctionedGraphWorkflow
  sanctionedOutputDir?: string
  stdout?: Pick<Console, 'log'>
  stderr?: Pick<Console, 'error'>
  guardrailExecutor?: GuardrailExecutor
}

// ─── Arg Parsing ────────────────────────────────────────────────────────────

export const parseGraphBuildArgs = (argv: string[]): GraphBuildArgs => ({
  json: argv.includes('--json'),
  help: argv.includes('--help'),
  dryRun: argv.includes('--dry-run'),
  skipGuardrails: argv.includes('--skip-guardrails'),
})

// ─── Help ────────────────────────────────────────────────────────────────────

export const printHelp = (): void => {
  console.log(`graph:build — Olfactory Knowledge Graph Read Model Builder

Usage: npm run graph:build -- [options]

Workflow:
  1. Load compiled v2 inputs (taxonomy, aliases, similarity)
  2. Build in-memory OlfactoryGraph
  3. Validate graph with sanctioned v2.11 wrapper
  4. Write graph.json to sanctioned output path
  5. Run SHA-256 boundary audit on protected files (GVAL-03)
  6. Run GVAL-05 guardrails: typecheck, test, alias:integrity, verify:integrity

Options:
  --json             Output structured JSON audit proof on stdout
  --dry-run          Write to /tmp only; skip boundary audit and guardrails
  --skip-guardrails  Skip GVAL-05 guardrail execution (for testing)
  --help             Show this help

Output:
  Official:  ${GRAPH_OUTPUT_POLICY.sanctioned_output_path}graph.json
  Dry-run:   /tmp/graph-read-model-dry-run/graph.json

Protected inputs (read-only):
${GRAPH_ALLOWED_PRODUCTION_INPUTS.map(f => `  - ${f}`).join('\n')}

Notes:
  - No --out flag for official writes (prevents accidental mutation)
  - Boundary audit proof prints to stdout, not persisted to disk
  - graph:build does NOT invoke query functions
`)
}

// ─── Path Resolution ─────────────────────────────────────────────────────────

const exists = async (path: string): Promise<boolean> =>
  access(path)
    .then(() => true)
    .catch(() => false)

const resolveBaseDir = async (): Promise<string> => {
  const cwd = process.cwd()
  const dataDir = 'data'
  for (const candidate of [cwd, join(cwd, '..')]) {
    if (await exists(join(candidate, dataDir))) {
      return candidate
    }
  }
  return cwd
}

// ─── GVAL-05 Guardrails (legacy export) ──────────────────────────────────────

export const runGuardrails = (srcDir: string): GuardrailsResult =>
  createDefaultGuardrailExecutor(srcDir)(SANCTIONED_GUARDRAIL_DEFINITIONS, { srcDir })

// ─── Workflow Rendering ──────────────────────────────────────────────────────

const renderFailure = (
  result: Extract<SanctionedWorkflowResult, { ok: false }>,
  args: GraphBuildArgs,
  stdout: Pick<Console, 'log'>,
  stderr: Pick<Console, 'error'>,
): number => {
  switch (result.reason) {
    case 'forbidden_path':
      stderr.error(`Graph write error [forbidden_prefix]: ${result.message}`)
      return 1
    case 'pre_digest_failed':
      stderr.error(`Failed to capture pre-digests: ${result.message}`)
      return 1
    case 'input_load_failed':
      stderr.error(`Failed to load graph inputs: ${result.message}`)
      return 1
    case 'validation_failed':
      stderr.error('Graph validation failed:')
      for (const line of result.message.split('; ')) {
        stderr.error(`  ${line}`)
      }
      return 1
    case 'write_failed':
      stderr.error(`Graph write error: ${result.message}`)
      return 1
    case 'boundary_audit_failed':
      stderr.error(`Boundary audit failed: ${result.message}`)
      if (result.boundary_audit && !result.boundary_audit.ok) {
        stderr.error('⚠ BOUNDARY AUDIT FAILED: Protected files were mutated during graph build!')
        for (const file of result.boundary_audit.protected_files) {
          if (!file.unchanged) {
            stderr.error(`  MUTATED: ${file.path}`)
            stderr.error(`    before: ${file.sha256_before}`)
            stderr.error(`    after:  ${file.sha256_after}`)
          }
        }
      }
      return 1
    case 'guardrail_failed':
      if (!args.json) {
        stderr.error('GVAL-05 guardrail failure:')
        for (const guardrail of result.guardrails?.results ?? []) {
          if (guardrail.exitCode !== 0) {
            stderr.error(`  ✗ ${guardrail.name} (exit ${guardrail.exitCode})`)
          }
        }
      }
      if (args.json) {
        stdout.log(
          JSON.stringify(
            {
              ok: false,
              graph_output: result.graph_output ?? null,
              boundary_audit: result.boundary_audit ?? null,
              guardrails: result.guardrails ?? null,
            },
            null,
            2,
          ),
        )
      }
      return 1
    default:
      stderr.error(result.message)
      return 1
  }
}

const renderSuccess = (
  result: Extract<SanctionedWorkflowResult, { ok: true }>,
  args: GraphBuildArgs,
  stdout: Pick<Console, 'log'>,
): number => {
  if (args.json) {
    stdout.log(
      JSON.stringify(
        {
          ok: true,
          graph_output: result.graph_output,
          boundary_audit: result.boundary_audit,
          guardrails: result.guardrails,
        },
        null,
        2,
      ),
    )
  } else {
    stdout.log(`✓ Graph written: ${result.graph_output}`)
    if (result.boundary_audit) {
      stdout.log(
        `✓ Boundary audit: ${result.boundary_audit.ok ? 'PASS' : 'FAIL'} (${result.boundary_audit.protected_files.length} files verified)`,
      )
      stdout.log(`  graphify_out_accesses: ${result.boundary_audit.graphify_out_accesses}`)
    }
    if (result.guardrails) {
      stdout.log(`✓ Guardrails: ${result.guardrails.passed ? 'PASS' : 'FAIL'}`)
    }
    stdout.log('\ngraph:build complete')
  }

  return 0
}

// ─── Main CLI Workflow ────────────────────────────────────────────────────────

export const runGraphBuildCli = async (
  argv: string[] = process.argv.slice(2),
  deps: GraphBuildCliDeps = {},
): Promise<number> => {
  const args = parseGraphBuildArgs(argv)
  const stdout = deps.stdout ?? console
  const stderr = deps.stderr ?? console

  if (args.help) {
    printHelp()
    return 0
  }

  const baseDir = await resolveBaseDir()
  const outputDir = args.dryRun
    ? '/tmp/graph-read-model-dry-run'
    : (deps.sanctionedOutputDir ?? resolve(baseDir, GRAPH_OUTPUT_POLICY.sanctioned_output_path))

  const workflowRunner = deps.workflowRunner ?? runSanctionedGraphWorkflow
  const guardrailExecutor =
    deps.guardrailExecutor ?? createDefaultGuardrailExecutor(resolve(baseDir, 'src'))

  const result = await workflowRunner({
    outputDir,
    dryRun: args.dryRun,
    skipGuardrails: args.skipGuardrails,
    guardrailExecutor,
    baseDir,
  })

  if (!result.ok) {
    return renderFailure(result, args, stdout, stderr)
  }

  return renderSuccess(result, args, stdout)
}

// ─── Re-exports ────────────────────────────────────────────────────────────────

export { loadGraphInputs }

// ─── Entrypoint ──────────────────────────────────────────────────────────────

const main = async (): Promise<void> => {
  process.exit(await runGraphBuildCli())
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
