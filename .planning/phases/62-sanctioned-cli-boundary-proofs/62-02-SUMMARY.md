---
phase: 62-sanctioned-cli-boundary-proofs
plan: 02
subsystem: testing
tags: [vitest, cli, boundary-audit, graphify-isolation, guardrails, sandbox]

requires:
  - phase: 62-sanctioned-cli-boundary-proofs
    provides: Internal runSanctionedGraphWorkflow seam with injectable GuardrailExecutor
provides:
  - Deterministic graphify-out/** directory snapshot helper
  - Sandboxed non-dry-run CLI proof with measured Graphify isolation
  - Hybrid guardrail executor with explicit test interception evidence
  - Public CLI regression markers and composition seam tests
affects: []

tech-stack:
  added: []
  patterns:
    - "Test-only directory snapshots with aggregate SHA-256 for Graphify isolation"
    - "Hybrid guardrail executor: real typecheck/alias/verify + injected test evidence"
    - "Stable CLI marker assertions instead of full-text snapshots"

key-files:
  created:
    - src/tests/helpers/directory_snapshot.ts
    - src/tests/helpers/hybrid_guardrail_executor.ts
  modified:
    - src/tests/cli/sanctioned_graph_workflow.test.ts
    - src/tests/cli/graph_read_model.test.ts

key-decisions:
  - "Measured graphify-out/** isolation uses pre/post directory snapshots independent of boundary_audit declarative fields"
  - "Hybrid executor intercepts only the recursive test guardrail with explicit injected_test_evidence metadata"
  - "Public CLI JSON contract locked to ok, graph_output, boundary_audit, guardrails top-level keys only"

patterns-established:
  - "Pattern: snapshotDirectory + snapshotsEqual for deterministic filesystem measurement in sandbox proofs"
  - "Pattern: runGraphBuildCli DI binds exitCode, stdout, stderr, artifact, guardrails, and graphify-out snapshots in one execution"

requirements-completed: [GVAL-08, GVAL-09, GVAL-10]

duration: 6min
completed: 2026-06-17
---

# Phase 62 Plan 02: Sanctioned CLI Boundary Proofs Summary

**Sandbox harness proves non-dry-run graph:build with measured graphify-out/** isolation, hybrid guardrail evidence, and public CLI contract regression locks**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-17T16:36:30Z
- **Completed:** 2026-06-17T16:42:05Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Added deterministic `directory_snapshot` helper treating absent directories as empty valid state
- Proved sandbox non-dry-run success via `runGraphBuildCli` with graphify-out/** pre/post equality and query consumer reentry
- Implemented hybrid guardrail executor with real typecheck/alias:integrity/verify:integrity and explicit test interception
- Locked public CLI surface: no `--out`, stable JSON shape, stable success/failure markers, internal `sanctionedOutputDir` composition

## Task Commits

Each task was committed atomically:

1. **Task 1: Add deterministic graphify-out snapshot helper and sandbox success proof** - `e622a35` (test)
2. **Task 2: Prove hybrid guardrail evidence and deterministic failure branches** - `3745721` (test)
3. **Task 3: Lock public CLI regression markers while preserving thin-surface behavior** - `8461e50` (test)

## Files Created/Modified

- `src/tests/helpers/directory_snapshot.ts` - Deterministic directory inventory with per-file SHA-256 and aggregate hash
- `src/tests/helpers/hybrid_guardrail_executor.ts` - Sandbox-only hybrid guardrail runner with explicit test interception
- `src/tests/cli/sanctioned_graph_workflow.test.ts` - Sandbox success, hybrid guardrail, guardrail-failure, and forbidden-path proofs
- `src/tests/cli/graph_read_model.test.ts` - Public JSON contract, stable markers, and composition seam regression tests

## Decisions Made

- Graphify isolation evidence comes from measured snapshots, not only `graphify_out_accesses: 0`
- Hybrid executor shared via test helper to avoid cross-test-file imports that duplicate test suites
- Failure-path assertions use stable stderr prefixes (`GVAL-05 guardrail failure`, `Graph write error [forbidden_prefix]`) rather than full output snapshots

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed query consumer assertion using wrong result shape**
- **Found during:** Task 1 (sandbox success proof)
- **Issue:** `familyProof.result.length` failed typecheck, causing real guardrail typecheck to fail and sandbox test to exit 1
- **Fix:** Changed to `familyProof.result.descriptors.length`
- **Files modified:** `src/tests/cli/sanctioned_graph_workflow.test.ts`
- **Committed in:** `e622a35`

**2. [Rule 3 - Blocking] Extracted hybrid executor to shared test helper**
- **Found during:** Task 3 (composition test)
- **Issue:** Importing `createHybridGuardrailExecutor` from another test file caused Vitest to re-run the imported suite (68 tests with duplicates)
- **Fix:** Moved hybrid executor to `src/tests/helpers/hybrid_guardrail_executor.ts`
- **Files modified:** `src/tests/helpers/hybrid_guardrail_executor.ts`, both CLI test files
- **Committed in:** `8461e50`

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes required for correct guardrail execution and clean test isolation. No scope creep.

## Issues Encountered

None beyond auto-fixed deviations above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 62 proof layer complete: GVAL-08, GVAL-09, GVAL-10 satisfied by automated sandbox harness
- Public `graph:build` CLI remains thin with no `--out` and stable JSON contract
- Ready for phase verification and milestone completion

## Self-Check: PASSED

- FOUND: src/tests/helpers/directory_snapshot.ts
- FOUND: src/tests/helpers/hybrid_guardrail_executor.ts
- FOUND: src/tests/cli/sanctioned_graph_workflow.test.ts
- FOUND: src/tests/cli/graph_read_model.test.ts
- FOUND: e622a35
- FOUND: 3745721
- FOUND: 8461e50

---
*Phase: 62-sanctioned-cli-boundary-proofs*
*Completed: 2026-06-17*
