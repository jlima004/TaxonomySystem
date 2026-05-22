---
phase: 07
slug: data-quality-inference-hardening
status: ready
nyquist_compliant: true
wave_0_complete: n/a
created: 2026-05-21
---

# Phase 07 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.x |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm run typecheck && npm test -- <target test files>` from `src/` |
| **Full suite command** | `npm run typecheck && npm test` from `src/` |
| **Estimated runtime** | ~10-30 seconds for targeted tests; full suite depends on corpus fixture coverage |

---

## Sampling Rate

- **After every task commit:** Run `npm run typecheck` plus the targeted Vitest file(s) for the touched behavior.
- **After every plan wave:** Run `npm run typecheck && npm test` from `src/`.
- **Before `/gsd-verify-work`:** Full suite must be green; when full corpus data is available also run `npm run compile -- --generated-at 2026-01-01T00:00:00.000Z`.
- **Max feedback latency:** 30 seconds for targeted task feedback where possible.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 07-01 | 1 | DQ-01 | T-07-01 | Excluded descriptors do not enter frequency/co-occurrence artifacts and are preserved as sanitation audit signals | unit/integration | `npm run typecheck && npm test -- tests/analysis/descriptor_sanitizer.test.ts tests/analysis/orchestration.test.ts` | Yes | pending |
| 07-01-02 | 07-01 | 1 | DQ-02 | T-07-02 | Semantic noise downweights descriptors without mutating seed descriptor weights | unit/integration | `npm run typecheck && npm test -- tests/inference/noise.test.ts` | Yes | pending |
| 07-02-01 | 07-02 | 2 | DQ-03 | T-07-03 | Curated aliases canonicalize before analysis; alias seed exclusions are passed to alias candidate discovery; alias audit stays analysis-side | unit/integration | `npm run typecheck && npm test -- tests/analysis/alias_canonicalization.test.ts tests/analysis/orchestration.test.ts tests/cli/compile.test.ts` | Yes | pending |
| 07-03-01 | 07-03 | 3 | DQ-04 | T-07-04 | Placement candidates require support, normalized support, and placement score thresholds | unit/integration | `npm run typecheck && npm test -- tests/inference/placement_scoring.test.ts tests/compiler/compile_taxonomy.test.ts` | Yes | pending |
| 07-03-02 | 07-03 | 3 | DQ-06 | T-07-06 | Review queue is merged centrally and emitted only in `similarity_matrix.json` with deterministic ordering | integration | `npm run typecheck && npm test -- tests/compiler/compile_all.test.ts tests/inference/build_similarity_graph.test.ts` | Yes | pending |
| 07-03-03 | 07-03 | 3 | DQ-08 | T-07-08 | Seed gap suggestions remain review-only and do not mutate seed hierarchy | unit/integration | `npm run typecheck && npm test -- tests/inference/seed_expansion_review.test.ts tests/compiler/compile_all.test.ts` | Yes | pending |
| 07-04-01 | 07-04 | 4 | DQ-05 | T-07-05 | Curated relations and accords bootstrap deterministic similarity edges and deterministic empty-input warnings | integration | `npm run typecheck && npm test -- tests/inference/build_similarity_graph.test.ts` | Yes | pending |
| 07-04-02 | 07-04 | 4 | DQ-06 | T-07-06 | Compile summary and quality report preserve review boundary and deterministic ordering guarantees | integration | `npm run typecheck && npm test -- tests/cli/compile.test.ts tests/compiler/compile_all.test.ts` | Yes | pending |
| 07-04-03 | 07-04 | 4 | DQ-07 | T-07-07 | Hard runtime quality gates fail before writes; CI/tests cover byte determinism checks | unit/integration | `npm run typecheck && npm test -- tests/compiler/quality_gates.test.ts tests/compiler/compile_all.test.ts tests/cli/compile.test.ts` | Yes | pending |

---

## Wave 0 Requirements

Wave 0 stubs are not required for the current Phase 7 split. Each task in 07-01..07-04 includes explicit automated verification commands and is executable without placeholder test scaffolding.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Full corpus semantic plausibility spot check | DQ-01-DQ-08 | Automated tests prove deterministic behavior, but domain quality still needs spot review of compiled artifacts | After `npm run compile -- --generated-at 2026-01-01T00:00:00.000Z`, inspect `data/compiled/v1/similarity_matrix.json`, review queue severity distribution, and taxonomy placement samples |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 coverage check is not applicable for this phase split (no Wave 0 stubs required)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s for targeted checks
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved_for_execution_after_plan_refinements
