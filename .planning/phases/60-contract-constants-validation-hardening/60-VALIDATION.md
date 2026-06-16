---
phase: 60
slug: contract-constants-validation-hardening
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-16
---

# Phase 60 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts tests/graph_read_model/graph_id.test.ts tests/graph_read_model/validate_graph.test.ts` |
| **Full suite command** | `env TMPDIR=/tmp npm --prefix src test` |
| **Estimated runtime** | ~30-60 seconds for targeted graph read-model tests; full suite runtime depends on local cache |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src run typecheck` and the plan-specific targeted Vitest command.
- **After every plan wave:** Run `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts tests/graph_read_model/graph_id.test.ts tests/graph_read_model/build_graph.test.ts tests/graph_read_model/validate_graph.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/cli/graph_read_model.test.ts`.
- **Before `/gsd-verify-work`:** `npm --prefix src run typecheck` and `env TMPDIR=/tmp npm --prefix src test` must be green.
- **Max feedback latency:** 60 seconds for targeted graph read-model checks.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 60-01-01 | 01 | 1 | GCON-05, GVAL-06 | T-60-01 | Contract exports authoritative graph validation codes, invariant IDs and sanctioned v2.11 profile constants. | unit/static | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts` | Yes, expand existing | pending |
| 60-01-02 | 01 | 1 | GCON-05, GVAL-06 | T-60-02 | `GraphValidationError` supports JSON-safe `expected`/`actual`, optional `invariant_id`, and compatibility with current error shape. | unit/typecheck | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts tests/graph_read_model/validate_graph.test.ts` | Yes, expand existing | pending |
| 60-02-01 | 02 | 2 | GCON-05, GCON-06 | T-60-03 | Graph ID makers, guards and strip helper share one prefix boundary and reject empty raw IDs deterministically. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/graph_id.test.ts` | No, Wave 0 creates | pending |
| 60-02-02 | 02 | 2 | GCON-05, GCON-06, GVAL-06 | T-60-03 | `parseGraphId` returns a discriminated union for valid IDs, unknown prefixes, empty raw IDs and ambiguous formats without generic throws. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/graph_id.test.ts` | No, Wave 0 creates | pending |
| 60-03-01 | 03 | 3 | GCON-05, GVAL-06 | T-60-04 | Central validation error factories fix code, invariant, path, message and JSON-safe payloads. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts` | Yes, expand existing | pending |
| 60-03-02 | 03 | 3 | GVAL-06 | T-60-04 | Factory tests prove JSON-safe payloads and preserve current observable error shape for CLI/snapshots. | unit/typecheck | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts` | Yes, expand existing | pending |
| 60-04-01 | 04 | 4 | GCON-06, GVAL-06 | T-60-07 | Structural validator uses factories and `graph_id.ts` parsing/guards for node IDs and edge endpoint IDs. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts` | Yes, expand existing | pending |
| 60-04-02 | 04 | 4 | GCON-05, GVAL-06 | T-60-08, T-60-09 | Profile-aware validation short-circuits on structural failures and sanctioned v2.11 wrapper enforces `10/18/341/18/13`. | unit/live regression | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts tests/graph_read_model/live_artifact_baseline.test.ts` | Yes, expand existing | pending |
| 60-05-01 | 05 | 5 | GCON-06 | T-60-10 | Builder imports graph ID makers and preserves byte-for-byte graph ID compatibility. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/build_graph.test.ts` | Yes, expand existing | pending |
| 60-05-02 | 05 | 5 | GCON-06 | T-60-11 | Query module imports graph ID helpers and preserves proof envelope shape `{ query_kind, params, result, path }`. | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_graph.test.ts` | Yes, expand existing | pending |
| 60-05-03 | 05 | 5 | GVAL-06 | T-60-12 | CLI sanctioned build path calls `validateSanctionedV211Graph` and docs describe the wrapper without Phase 61 claims. | cli/docs | `env TMPDIR=/tmp npm --prefix src test -- tests/cli/graph_read_model.test.ts` | Yes, expand existing | pending |
| 60-06-01 | 06 | 6 | GCON-05, GCON-06 | T-60-13 | Static drift tests fail on reintroduced local ID templates, regex prefix stripping or validator-local code vocabularies. | static/unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts tests/graph_read_model/build_graph.test.ts tests/graph_read_model/query_graph.test.ts` | Yes, expand existing | pending |
| 60-06-02 | 06 | 6 | GVAL-06 | T-60-14 | Live baseline tests protect sanctioned `10/18/341/18/13` stats and query compatibility. | live/unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/live_artifact_baseline.test.ts tests/graph_read_model/query_live_baseline.test.ts` | Yes, expand existing | pending |
| 60-06-03 | 06 | 6 | GCON-05, GCON-06, GVAL-06 | T-60-15 | Full phase gate proves typecheck, CLI compatibility and targeted graph read-model suite. | phase gate | `npm --prefix src run typecheck && env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts tests/graph_read_model/graph_id.test.ts tests/graph_read_model/build_graph.test.ts tests/graph_read_model/validate_graph.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/cli/graph_read_model.test.ts` | Mixed existing/new | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/graph_read_model/graph_id.test.ts` — new unit coverage for ID makers, type guards, strip behavior and `parseGraphId` typed failures.
- [ ] `src/tests/graph_read_model/contract.test.ts` — expand coverage for `GRAPH_VALIDATION_ERROR_CODES`, `GRAPH_INVARIANT_IDS`, code-to-invariant mapping and `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`.
- [ ] `src/tests/graph_read_model/validate_graph.test.ts` — expand coverage for `expected`, `actual`, `invariant_id`, profile short-circuiting and baseline mismatch.
- [ ] `src/tests/graph_read_model/query_live_baseline.test.ts` — expand or reuse live query baseline coverage to prove Phase 60 preserves query proof compatibility.
- [ ] No framework install required; existing Vitest infrastructure is sufficient.

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all missing references
- [x] No watch-mode flags
- [x] Feedback latency < 60s for targeted checks
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-16
