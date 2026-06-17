import { execFileSync } from 'node:child_process'
import type { GuardrailExecutor, GuardrailResult } from '../../cli/sanctioned_graph_workflow.js'

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
