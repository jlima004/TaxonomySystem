---
phase: 57
slug: query-proofs
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-10
---

# Phase 57 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts` |
| **Full suite command** | `npm --prefix src test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run targeted query test file(s)
- **After every plan wave:** Run `npm --prefix src test`
- **Before `/gsd-verify-work`:** `npm --prefix src run typecheck && npm --prefix src test` must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 57-01-01 | 01 | 1 | GQRY-01, GQRY-02, GQRY-03, GQRY-05 | T-57-01 / T-57-02 | Query module fs-free; typed proof envelope; no graph mutation | unit | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts` | ❌ W0 | ⬜ pending |
| 57-02-01 | 02 | 1 | GQRY-04, GQRY-05, D-28 | T-57-02 / T-57-03 | Similarity proofs read-only; 1-hop bidirectional; determinism | unit + live | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/graph_read_model/types.ts` — extend with `GraphQueryProof`, per-`query_kind` result types, `DescriptorProofItem`, `PathSegment`
- [ ] `src/graph_read_model/query_graph.ts` — nine public query functions
- [ ] `src/tests/graph_read_model/query_graph.test.ts` — inline fixtures, proof snapshots, determinism
- [ ] `src/tests/graph_read_model/query_live_baseline.test.ts` — aggregate catalog over compiled v2
- [ ] `src/tests/graph_read_model/live_artifact_baseline.test.ts` — extend fs-free guard to include `query_graph.ts`

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

**Approval:** approved 2026-06-10
