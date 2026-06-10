---
phase: 56
slug: pure-builder-structural-validation
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-09
---

# Phase 56 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts` |
| **Full suite command** | `npm --prefix src test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts`
- **After every plan wave:** Run `npm --prefix src test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 56-01-01 | 01 | 1 | GBLD-01, GBLD-02, GBLD-03, GBLD-04, GBLD-05 | T-56-01 / T-56-02 | Builder remains pure, deterministic, and contract-bound with no file I/O | unit | `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts` | ❌ W0 | ⬜ pending |
| 56-02-01 | 02 | 1 | GVAL-01, GVAL-02 | T-56-02 / T-56-03 | Validator returns structured errors for invariant failures and reconciles baseline stats | unit + regression | `npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts tests/graph_read_model/live_artifact_baseline.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/graph_read_model/types.ts` — graph model/result types and helpers
- [ ] `src/graph_read_model/build_graph.ts` — pure in-memory builder
- [ ] `src/graph_read_model/validate_graph.ts` — pure structural validator
- [ ] `src/tests/graph_read_model/build_graph.test.ts` — construction and determinism fixtures
- [ ] `src/tests/graph_read_model/validate_graph.test.ts` — invariant failure coverage
- [ ] `src/tests/graph_read_model/live_artifact_baseline.test.ts` — read-only baseline regression

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-09
