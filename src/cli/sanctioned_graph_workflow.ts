import { access, readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { buildOlfactoryGraph } from '../graph_read_model/build_graph.js'
import { validateSanctionedV211Graph } from '../graph_read_model/validate_graph.js'
import {
  writeGraphOutput,
  validateOutputPath,
  GraphWriteError,
} from '../graph_read_model/write_graph.js'
import {
  capturePreDigests,
  discoverProtectedFiles,
  runBoundaryAudit,
} from '../graph_read_model/boundary_audit.js'
import { GRAPH_ALLOWED_PRODUCTION_INPUTS } from '../graph_read_model/contract.js'
import type { BoundaryAuditResult } from '../graph_read_model/boundary_audit.js'
import type { BuildOlfactoryGraphInput } from '../graph_read_model/types.js'
import type { CompiledAliases } from '../compiler/types.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { SimilarityGraph } from '../types/similarity.js'

// ─── Guardrail Types ─────────────────────────────────────────────────────────

export type GuardrailDefinition = {
  name: string
  args: string[]
}

export type GuardrailResult = {
  name: string
  exitCode: number
  output: string
}

export type GuardrailsResult = {
  passed: boolean
  results: GuardrailResult[]
}

export type GuardrailExecutor = (
  definitions: readonly GuardrailDefinition[],
  context: { srcDir: string },
) => GuardrailsResult

export const SANCTIONED_GUARDRAIL_DEFINITIONS: readonly GuardrailDefinition[] = [
  { name: 'typecheck', args: ['run', 'typecheck'] },
  { name: 'test', args: ['run', 'test'] },
  { name: 'alias:integrity', args: ['run', 'alias:integrity', '--', '--json'] },
  { name: 'verify:integrity', args: ['run', 'verify:integrity', '--', '--json'] },
]

// ─── Workflow Result Types ─────────────────────────────────────────────────────

export type SanctionedWorkflowFailureReason =
  | 'forbidden_path'
  | 'guardrail_failed'
  | 'validation_failed'
  | 'input_load_failed'
  | 'pre_digest_failed'
  | 'write_failed'
  | 'boundary_audit_failed'

export type SanctionedWorkflowSuccess = {
  ok: true
  graph_output: string
  boundary_audit: BoundaryAuditResult | null
  guardrails: GuardrailsResult | null
}

export type SanctionedWorkflowFailure = {
  ok: false
  reason: SanctionedWorkflowFailureReason
  message: string
  guardrails?: GuardrailsResult
  graph_output?: string
  boundary_audit?: BoundaryAuditResult | null
}

export type SanctionedWorkflowResult = SanctionedWorkflowSuccess | SanctionedWorkflowFailure

export type RunSanctionedGraphWorkflowOptions = {
  outputDir: string
  dryRun: boolean
  skipGuardrails: boolean
  guardrailExecutor: GuardrailExecutor
  baseDir: string
}

// ─── Default Guardrail Executor ────────────────────────────────────────────────

export const createDefaultGuardrailExecutor = (srcDir: string): GuardrailExecutor => {
  return (definitions) => {
    const results: GuardrailResult[] = []

    for (const guardrail of definitions) {
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
      results.every((result) => result.exitCode === 0) &&
      results.length === definitions.length

    return { passed, results }
  }
}

// ─── Input Loading ───────────────────────────────────────────────────────────

const exists = async (path: string): Promise<boolean> =>
  access(path)
    .then(() => true)
    .catch(() => false)

const resolveReadablePath = async (
  absPath: string,
  baseDir: string,
  relPath: string,
): Promise<string> => {
  if (await exists(absPath)) return absPath
  if (relPath.startsWith('data/')) {
    const parentDataPath = join(baseDir, '..', relPath)
    if (await exists(parentDataPath)) return parentDataPath
  }
  return absPath
}

const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(path, 'utf8')) as T

export const loadGraphInputs = async (baseDir: string): Promise<BuildOlfactoryGraphInput> => {
  const [taxonomyPath, aliasesPath, similarityPath] = await Promise.all(
    GRAPH_ALLOWED_PRODUCTION_INPUTS.map(async (relPath) =>
      resolveReadablePath(join(baseDir, relPath), baseDir, relPath),
    ),
  )

  const [taxonomy, aliases, similarity] = await Promise.all([
    readJson<CompiledTaxonomy>(taxonomyPath!),
    readJson<CompiledAliases>(aliasesPath!),
    readJson<SimilarityGraph>(similarityPath!),
  ])

  return { taxonomy, aliases, similarity }
}

// ─── Internal Helpers ──────────────────────────────────────────────────────────

const validateOutputPathOrForbidden = (
  outputDir: string,
): { ok: true } | { ok: false; reason: 'forbidden_path'; message: string } => {
  try {
    validateOutputPath(outputDir)
    return { ok: true }
  } catch (error) {
    if (error instanceof GraphWriteError && error.code === 'forbidden_prefix') {
      return { ok: false, reason: 'forbidden_path', message: error.message }
    }
    throw error
  }
}

// ─── Sanctioned Workflow ─────────────────────────────────────────────────────────

export const runSanctionedGraphWorkflow = async (
  options: RunSanctionedGraphWorkflowOptions,
): Promise<SanctionedWorkflowResult> => {
  const { outputDir, dryRun, skipGuardrails, guardrailExecutor, baseDir } = options
  const srcDir = resolve(baseDir, 'src')

  const pathValidation = validateOutputPathOrForbidden(outputDir)
  if (!pathValidation.ok) {
    return {
      ok: false,
      reason: pathValidation.reason,
      message: pathValidation.message,
    }
  }

  let preDigests: Map<string, string> | undefined

  if (!dryRun) {
    try {
      const protectedFiles = await discoverProtectedFiles(baseDir)
      preDigests = await capturePreDigests(protectedFiles)
    } catch (error) {
      return {
        ok: false,
        reason: 'pre_digest_failed',
        message: error instanceof Error ? error.message : String(error),
      }
    }
  }

  let input
  try {
    input = await loadGraphInputs(baseDir)
  } catch (error) {
    return {
      ok: false,
      reason: 'input_load_failed',
      message: error instanceof Error ? error.message : String(error),
    }
  }

  let graph
  try {
    graph = buildOlfactoryGraph(input)
  } catch (error) {
    return {
      ok: false,
      reason: 'validation_failed',
      message: error instanceof Error ? error.message : String(error),
    }
  }

  const validationResult = validateSanctionedV211Graph(graph)
  if (!validationResult.ok) {
    const summary = validationResult.errors
      .map((err) => `[${err.code}] ${err.path}: ${err.message}`)
      .join('; ')
    return {
      ok: false,
      reason: 'validation_failed',
      message: summary,
    }
  }

  let guardrailsResult: GuardrailsResult | null = null
  if (!skipGuardrails && !dryRun) {
    guardrailsResult = guardrailExecutor(SANCTIONED_GUARDRAIL_DEFINITIONS, { srcDir })
    if (!guardrailsResult.passed) {
      return {
        ok: false,
        reason: 'guardrail_failed',
        message: 'One or more guardrails failed',
        guardrails: guardrailsResult,
      }
    }
  }

  let outputPath: string
  try {
    outputPath = await writeGraphOutput(graph, outputDir)
  } catch (error) {
    if (error instanceof GraphWriteError) {
      if (error.code === 'forbidden_prefix') {
        return {
          ok: false,
          reason: 'forbidden_path',
          message: error.message,
        }
      }
      return {
        ok: false,
        reason: 'write_failed',
        message: error.message,
      }
    }
    return {
      ok: false,
      reason: 'write_failed',
      message: error instanceof Error ? error.message : String(error),
    }
  }

  let auditResult: BoundaryAuditResult | null = null
  if (!dryRun && preDigests !== undefined) {
    try {
      auditResult = await runBoundaryAudit(outputPath, baseDir, preDigests)
    } catch (error) {
      return {
        ok: false,
        reason: 'boundary_audit_failed',
        message: error instanceof Error ? error.message : String(error),
        graph_output: outputPath,
      }
    }

    if (!auditResult.ok) {
      return {
        ok: false,
        reason: 'boundary_audit_failed',
        message: 'Protected files were mutated during graph build',
        graph_output: outputPath,
        boundary_audit: auditResult,
      }
    }
  }

  return {
    ok: true,
    graph_output: outputPath,
    boundary_audit: auditResult,
    guardrails: guardrailsResult,
  }
}
