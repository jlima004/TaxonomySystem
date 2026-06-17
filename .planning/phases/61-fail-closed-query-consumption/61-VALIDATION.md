---
phase: 61
slug: fail-closed-query-consumption
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-16
---

# Phase 61 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/validate_graph.test.ts` |
| **Full suite command** | `npm --prefix src run typecheck && env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/validate_graph.test.ts` |
| **Estimated runtime** | ~10-30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src run typecheck` plus `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts` once the test file exists.
- **After every plan wave:** Run `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/validate_graph.test.ts`.
- **Before `/gsd-verify-work`:** Run `npm --prefix src run typecheck && env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/validate_graph.test.ts`.
- **Max feedback latency:** 30 seconds for targeted checks.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 61-01-01 | 01 | 0 | GVAL-07 | T-61-01 | `asValidatedGraph` rejects structurally invalid or profile-invalid graphs before consumer creation and preserves validation errors. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/validate_graph.test.ts` | No - W0 | pending |
| 61-01-02 | 01 | 0 | GVAL-07 | T-61-02 | Raw or unvalidated graph misuse at the consumer boundary returns deterministic `graph_not_validated` behavior instead of generating proofs. | unit/type-focused | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts` | No - W0 | pending |
| 61-01-03 | 01 | 0 | GQRY-06 | T-61-03 | All eight consumer methods preserve the proof envelope `{ query_kind, params, result, path }` and match direct query function outputs. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts` | No - W0 | pending |
| 61-01-04 | 01 | 0 | GQRY-06 | T-61-04 | Missing query targets remain empty/null structured proofs, not errors. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts` | No - W0 | pending |
| 61-01-05 | 01 | 0 | GQRY-08 | T-61-05 | Invalid graph attempts produce deterministic typed validation errors instead of partial or misleading query proofs. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/validate_graph.test.ts` | No - W0 | pending |
| 61-01-06 | 01 | 0 | GVAL-07, GQRY-06, GQRY-08 | T-61-06 | Live sanctioned baseline can be validated into `ValidatedGraph` and consumed without changing existing query proof semantics. | live regression | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_live_baseline.test.ts` | No - W0 | pending |

*Status: pending | green | red | flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/graph_read_model/query_consumer.test.ts` - stubs and assertions for GVAL-07, GQRY-06, and GQRY-08.
- [ ] Reuse existing inline graph fixtures from `src/tests/graph_read_model/query_graph.test.ts` and `src/tests/graph_read_model/validate_graph.test.ts`, or extract only a minimal local fixture needed by `query_consumer.test.ts`.
- [ ] Include at least one compile/type-focused assertion or source assertion proving raw `OlfactoryGraph` is not the sanctioned input type for `createValidatedQueryConsumer(validatedGraph)`.

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
