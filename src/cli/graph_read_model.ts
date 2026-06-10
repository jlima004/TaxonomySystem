import { access, readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join, dirname, resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { buildOlfactoryGraph } from '../graph_read_model/build_graph.js'
import { validateOlfactoryGraph } from '../graph_read_model/validate_graph.js'
import { writeGraphOutput, GraphWriteError } from '../graph_read_model/write_graph.js'
import {
  capturePreDigests,
  discoverProtectedFiles,
  runBoundaryAudit,
} from '../graph_read_model/boundary_audit.js'
import {
  GRAPH_ALLOWED_PRODUCTION_INPUTS,
  GRAPH_OUTPUT_POLICY,
} from '../graph_read_model/contract.js'
import type { BuildOlfactoryGraphInput } from '../graph_read_model/types.js'
import type { BoundaryAuditResult } from '../graph_read_model/boundary_audit.js'
import type { CompiledAliases } from '../compiler/types.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { SimilarityGraph } from '../types/similarity.js'

// ─── Arg Types ──────────────────────────────────────────────────────────────

type GraphBuildArgs = {
  json: boolean
  help: boolean
  dryRun: boolean
  skipGuardrails: boolean
}

type GuardrailResult = {
  name: string
  exitCode: number
  output: string
}

type GuardrailsResult = {
  passed: boolean
  results: GuardrailResult[]
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
  3. Validate graph structure
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

const resolveReadablePath = async (path: string): Promise<string> => {
  if (await exists(path)) return path
  if (path.startsWith('data/')) {
    const parentDataPath = join('..', path)
    if (await exists(parentDataPath)) return parentDataPath
  }
  return path
}

const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(path, 'utf8')) as T

// ─── Input Loading ───────────────────────────────────────────────────────────

export const loadGraphInputs = async (_baseDir: string): Promise<BuildOlfactoryGraphInput> => {
  // Use resolveReadablePath with relative paths (mirrors alias_integrity.ts pattern)
  // This handles both: cwd = project root and cwd = src/ (when npm --prefix src)
  const [taxonomyPath, aliasesPath, similarityPath] = await Promise.all(
    GRAPH_ALLOWED_PRODUCTION_INPUTS.map(async (relPath) => resolveReadablePath(relPath)),
  )

  const [taxonomy, aliases, similarity] = await Promise.all([
    readJson<CompiledTaxonomy>(taxonomyPath!),
    readJson<CompiledAliases>(aliasesPath!),
    readJson<SimilarityGraph>(similarityPath!),
  ])

  return { taxonomy, aliases, similarity }
}

// ─── GVAL-05 Guardrails ───────────────────────────────────────────────────────

export const runGuardrails = (srcDir: string): GuardrailsResult => {
  const guardrails = [
    { name: 'typecheck', args: ['run', 'typecheck'] },
    { name: 'test', args: ['run', 'test'] },
    { name: 'alias:integrity', args: ['run', 'alias:integrity', '--', '--json'] },
    { name: 'verify:integrity', args: ['run', 'verify:integrity', '--', '--json'] },
  ]

  const results: GuardrailResult[] = []

  for (const guardrail of guardrails) {
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
      // Guardrail failure is fatal — stop running further guardrails
      break
    }
  }

  const passed = results.every(r => r.exitCode === 0) && results.length === guardrails.length

  return { passed, results }
}

// ─── Main CLI Workflow ────────────────────────────────────────────────────────

export const runGraphBuildCli = async (argv: string[] = process.argv.slice(2)): Promise<number> => {
  const args = parseGraphBuildArgs(argv)

  if (args.help) {
    printHelp()
    return 0
  }

  // Resolve base dir: where data/ lives.
  // When npm --prefix src runs, the cwd may be the project root (data/ alongside src/).
  // When tests run with vitest inside src/, cwd = src/ so data/ is at ../data/.
  // We probe both: cwd and parent of cwd.
  const cwd = process.cwd()
  const dataDir = 'data'
  const baseDirCandidates = [cwd, join(cwd, '..')]
  let baseDir = cwd
  for (const candidate of baseDirCandidates) {
    if (await exists(join(candidate, dataDir))) {
      baseDir = candidate
      break
    }
  }

  // Determine output dir
  const outputDir = args.dryRun
    ? '/tmp/graph-read-model-dry-run'
    : resolve(baseDir, GRAPH_OUTPUT_POLICY.sanctioned_output_path)

  let preDigests: Map<string, string> | undefined

  // Step 1: Capture pre-digests (skip in dry-run)
  if (!args.dryRun) {
    try {
      const protectedFiles = await discoverProtectedFiles(baseDir)
      preDigests = await capturePreDigests(protectedFiles)
    } catch (error) {
      console.error('Failed to capture pre-digests:', error instanceof Error ? error.message : String(error))
      return 1
    }
  }

  // Step 2: Load inputs
  let input: BuildOlfactoryGraphInput
  try {
    input = await loadGraphInputs(baseDir)
  } catch (error) {
    console.error('Failed to load graph inputs:', error instanceof Error ? error.message : String(error))
    return 1
  }

  // Step 3: Build graph
  const graph = buildOlfactoryGraph(input)

  // Step 4: Validate graph
  const validationResult = validateOlfactoryGraph(graph)
  if (!validationResult.ok) {
    console.error('Graph validation failed:')
    for (const err of validationResult.errors) {
      console.error(`  [${err.code}] ${err.path}: ${err.message}`)
    }
    return 1
  }

  // Step 5: Write graph
  let outputPath: string
  try {
    outputPath = await writeGraphOutput(graph, outputDir)
  } catch (error) {
    if (error instanceof GraphWriteError) {
      console.error(`Graph write error [${error.code}]: ${error.message}`)
    } else {
      console.error('Failed to write graph:', error instanceof Error ? error.message : String(error))
    }
    return 1
  }

  // Step 6: Boundary audit (skip in dry-run)
  let auditResult: BoundaryAuditResult | null = null
  if (!args.dryRun && preDigests !== undefined) {
    try {
      auditResult = await runBoundaryAudit(outputPath, baseDir, preDigests)
    } catch (error) {
      console.error('Boundary audit failed:', error instanceof Error ? error.message : String(error))
      return 1
    }

    if (!auditResult.ok) {
      console.error('⚠ BOUNDARY AUDIT FAILED: Protected files were mutated during graph build!')
      for (const file of auditResult.protected_files) {
        if (!file.unchanged) {
          console.error(`  MUTATED: ${file.path}`)
          console.error(`    before: ${file.sha256_before}`)
          console.error(`    after:  ${file.sha256_after}`)
        }
      }
      return 1
    }
  }

  // Step 7: GVAL-05 guardrails (skip if --skip-guardrails or --dry-run)
  let guardrailsResult: GuardrailsResult | null = null
  if (!args.skipGuardrails && !args.dryRun) {
    // srcDir is the 'src' directory (one level down from baseDir, or determined from cwd)
    const srcDir = resolve(baseDir, 'src')
    guardrailsResult = runGuardrails(srcDir)

    if (!guardrailsResult.passed) {
      if (!args.json) {
        console.error('GVAL-05 guardrail failure:')
        for (const result of guardrailsResult.results) {
          if (result.exitCode !== 0) {
            console.error(`  ✗ ${result.name} (exit ${result.exitCode})`)
          }
        }
      }
      if (args.json) {
        console.log(
          JSON.stringify(
            {
              ok: false,
              graph_output: outputPath,
              boundary_audit: auditResult,
              guardrails: guardrailsResult,
            },
            null,
            2,
          ),
        )
      }
      return 1
    }
  }

  // Output
  if (args.json) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          graph_output: outputPath,
          boundary_audit: auditResult,
          guardrails: guardrailsResult,
        },
        null,
        2,
      ),
    )
  } else {
    console.log(`✓ Graph written: ${outputPath}`)
    if (auditResult) {
      console.log(`✓ Boundary audit: ${auditResult.ok ? 'PASS' : 'FAIL'} (${auditResult.protected_files.length} files verified)`)
      console.log(`  graphify_out_accesses: ${auditResult.graphify_out_accesses}`)
    }
    if (guardrailsResult) {
      console.log(`✓ Guardrails: ${guardrailsResult.passed ? 'PASS' : 'FAIL'}`)
    }
    console.log('\ngraph:build complete')
  }

  return 0
}

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
