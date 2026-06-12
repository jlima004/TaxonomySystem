---
phase: 55
slug: graph-contract-boundary-decisions
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-09
---

# Phase 55 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src run typecheck && npm --prefix src test -- tests/graph_read_model/contract.test.ts` |
| **Full suite command** | `npm --prefix src run typecheck && npm --prefix src test && npm --prefix src run verify:integrity -- --json && npm --prefix src run safety:guard` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src run typecheck && npm --prefix src test -- tests/graph_read_model/contract.test.ts`
- **After every plan wave:** Run `npm --prefix src run typecheck && npm --prefix src test`
- **Before `/gsd-verify-work`:** Full suite plus integrity and safety guard must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 55-01-01 | 01 | 1 | GCON-01 | T-55-01 | Contract locks schema version, node kinds, edge kinds, required properties and Phase 56 invariants without builder code | unit | `npm --prefix src test -- tests/graph_read_model/contract.test.ts` | ✅ | ✅ green |
| 55-01-02 | 01 | 1 | GCON-02 | T-55-02 | Contract allows exactly the three compiled v2 inputs and forbids Graphify/taxonomy/inference/material inputs | unit | `npm --prefix src test -- tests/graph_read_model/contract.test.ts` | ✅ | ✅ green |
| 55-01-03 | 01 | 1 | GCON-03 | T-55-03 | Contract requires `family:`, `subfamily:`, `descriptor:` and `alias:` graph ID prefixes to prevent raw-ID collisions | unit | `npm --prefix src test -- tests/graph_read_model/contract.test.ts` | ✅ | ✅ green |
| 55-01-04 | 01 | 1 | GCON-04 | T-55-04 | Contract locks `data/read-models/olfactory-graph/v2.11/`, `/tmp` verification-only support and forbidden output prefixes | unit | `npm --prefix src test -- tests/graph_read_model/contract.test.ts` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/graph_read_model/contract.ts` — static constants/types only for GCON-01 through GCON-04.
- [x] `src/tests/graph_read_model/contract.test.ts` — executable contract assertions for schema, IDs, inputs, outputs and phase-boundary exclusions.
- [x] `docs/olfactory_graph_contract.md` — maintainer-readable contract with explicit no-builder/no-writer/no-Graphify/no-Neo4J boundaries.

---

## Manual-Only Verifications

All phase behaviors have automated verification through contract tests and source assertions.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-09, re-validated 2026-06-12

---

## Validation Audit 2026-06-12

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |

**Audit notes:** All four GCON requirements already have executable coverage in `src/tests/graph_read_model/contract.test.ts` (7 tests). Contract tests and typecheck passed at validation time. No new tests required; VALIDATION.md statuses updated from draft/pending to green.
