---
phase: 62-sanctioned-cli-boundary-proofs
plan: 01
subsystem: testing
tags: [vitest, cli, guardrails, boundary-audit, fail-closed]

requires:
  - phase: 61-fail-closed-query-consumption
    provides: ValidatedGraph fail-closed query consumer boundary
provides:
  - Internal runSanctionedGraphWorkflow seam with injectable GuardrailExecutor
  - Typed forbidden_path and guardrail_failed workflow results
  - Thin graph:build CLI adapter with internal DI hooks
affects: [62-02-sanctioned-cli-boundary-proofs]

tech-stack:
  added: []
  patterns:
    - "Internal orchestrator + thin CLI adapter"
    - "Guardrails-before-write fail-closed ordering"
    - "Typed workflow result union at CLI boundary"

key-files:
  created:
    - src/cli/sanctioned_graph_workflow.ts
    - src/tests/cli/sanctioned_graph_workflow.test.ts
  modified:
    - src/cli/graph_read_model.ts

key-decisions:
  - "Moved loadGraphInputs into sanctioned_graph_workflow.ts to avoid circular imports while keeping re-export from graph_read_model.ts"
  - "Guardrails now run after graph validation and before writeGraphOutput for fail-closed artifact safety"
  - "forbidden_path is a typed workflow result branch sourced from validateOutputPath authority"

patterns-established:
  - "Pattern: runSanctionedGraphWorkflow({ outputDir, dryRun, skipGuardrails, guardrailExecutor, baseDir }) as the single orchestration seam"
  - "Pattern: runGraphBuildCli(args, { workflowRunner, sanctionedOutputDir, stdout, stderr, guardrailExecutor }) for testable CLI composition"

requirements-completed: [GVAL-08, GVAL-10]

duration: 5min
completed: 2026-06-17
---

# Phase 62 Plan 01: Sanctioned CLI Workflow Seam Summary

**Internal `runSanctionedGraphWorkflow` seam with injectable guardrails, typed `forbidden_path` rejection, and guardrails-before-write ordering while keeping `graph:build` a thin public adapter**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-17T16:33:51Z
- **Completed:** 2026-06-17T16:35:49Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Extracted sanctioned graph build orchestration into `src/cli/sanctioned_graph_workflow.ts` with typed success/failure results
- Added Wave 0 boundary tests proving `forbidden_path` and `guardrail_failed` never invoke `writeGraphOutput`
- Refactored `graph:build` to delegate through `runGraphBuildCli` with internal dependency injection hooks
- Preserved public CLI flags (`--json`, `--help`, `--dry-run`, `--skip-guardrails`) and success JSON shape

## Task Commits

Each task was committed atomically:

1. **Task 1: Seed internal workflow boundary tests before extraction** - `6157977` (test)
2. **Task 2: Extract `runSanctionedGraphWorkflow(...)` into `src/cli/`** - `03f3b15` (feat)

## Files Created/Modified

- `src/cli/sanctioned_graph_workflow.ts` - Internal orchestrator with `GuardrailExecutor`, sanctioned guardrail definitions, and typed workflow results
- `src/cli/graph_read_model.ts` - Thin CLI adapter delegating to workflow with injectable runner/streams/executor
- `src/tests/cli/sanctioned_graph_workflow.test.ts` - Wave 0 boundary proofs for forbidden path, guardrail order, and stop-on-failure

## Decisions Made

- Guardrails execute after graph validation and before `writeGraphOutput` so failing guardrails cannot leave partial sandbox artifacts
- `loadGraphInputs` lives in the workflow module to break circular imports; `graph_read_model.ts` re-exports it for compatibility
- No public `--out` flag added; forbidden paths are exercised through the internal workflow API

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 0 internal seam is ready for Plan 62-02 sandbox harness and measured Graphify isolation proofs
- `runGraphBuildCli` DI hooks (`workflowRunner`, `sanctionedOutputDir`, `guardrailExecutor`) are available for Wave 1 hybrid executor testing
- GVAL-08 and GVAL-10 remain partially open until Plan 62-02 completes sandboxed non-dry-run evidence

## Self-Check: PASSED

- FOUND: src/cli/sanctioned_graph_workflow.ts
- FOUND: src/tests/cli/sanctioned_graph_workflow.test.ts
- FOUND: src/cli/graph_read_model.ts
- FOUND: 6157977
- FOUND: 03f3b15

---
*Phase: 62-sanctioned-cli-boundary-proofs*
*Completed: 2026-06-17*
