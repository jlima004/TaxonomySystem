---
phase: 62
slug: sanctioned-cli-boundary-proofs
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-17
---

# Phase 62 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `env TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts tests/graph_read_model/write_graph.test.ts tests/graph_read_model/boundary_audit.test.ts` |
| **Full suite command** | `npm --prefix src run typecheck && env TMPDIR=/tmp npm --prefix src test -- tests/cli/graph_read_model.test.ts tests/cli/sanctioned_graph_workflow.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/write_graph.test.ts tests/graph_read_model/boundary_audit.test.ts` |
| **Estimated runtime** | ~20-60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src run typecheck` plus the most local test file touched by the task.
- **After Wave 0:** Run `env TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts tests/graph_read_model/write_graph.test.ts tests/graph_read_model/boundary_audit.test.ts`.
- **After Wave 1 / before `/gsd-verify-work`:** Run the full suite command above.
- **Max feedback latency:** 60 seconds for targeted checks.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 62-01-01 | 01 | 0 | GVAL-08 | T-62-01 | Internal workflow exposes a typed success/failure boundary without adding a new public CLI contract. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts` | No - W0 | pending |
| 62-01-02 | 01 | 0 | GVAL-10 | T-62-02 | Forbidden-path rejection happens before guardrails and before any write, with explicit `writeGraphOutput` not-called proof and deterministic boundary evidence. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts tests/graph_read_model/write_graph.test.ts` | No - W0 | pending |
| 62-01-03 | 01 | 0 | GVAL-08 | T-62-03 | Guardrail executor remains injectable, preserves the sanctioned step order, and fails closed before `writeGraphOutput` on guardrail failure. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts` | No - W0 | pending |
| 62-02-01 | 02 | 1 | GVAL-09 | T-62-04 | Sandbox harness captures deterministic `graphify-out/**` snapshots and fails on any mutation. | integration | `env TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts tests/graph_read_model/boundary_audit.test.ts` | No - W1 | pending |
| 62-02-02 | 02 | 1 | GVAL-08, GVAL-10 | T-62-05 | One sandboxed non-dry-run CLI invocation proves exit code, stable stdout/stderr markers, allowed write path, protected-file integrity, measured snapshots, and explicit hybrid guardrail evidence. | integration | `env TMPDIR=/tmp npm --prefix src test -- tests/cli/graph_read_model.test.ts tests/cli/sanctioned_graph_workflow.test.ts` | No - W1 | pending |
| 62-02-03 | 02 | 1 | GVAL-08 | T-62-06 | Generated sandbox `graph.json` can reenter via `asValidatedGraph -> createValidatedQueryConsumer` without touching production outputs. | live-style integration | `env TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts tests/graph_read_model/query_live_baseline.test.ts` | No - W1 | pending |

*Status: pending | green | red | flaky*

---

## Wave 0 Requirements

- [ ] New internal workflow test file exists and exercises success, forbidden-path, and guardrail-order boundaries.
- [ ] `forbidden_path` and `guardrail_failed` tests explicitly prove `writeGraphOutput` was not called.
- [ ] Public CLI tests continue to assert the absence of `--out` and stable `--json` behavior.
- [ ] No task in Wave 0 mutates `graphify-out/**`, `data/taxonomy/**`, or `data/compiled/v2/**`.

---

## Manual-Only Verifications

All phase behaviors should have automated verification.

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
