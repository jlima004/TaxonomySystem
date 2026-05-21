---
phase: 07
slug: data-quality-inference-hardening
status: draft
nyquist_compliant: false
wave_0_complete: false
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
| 07-01-01 | TBD | 0/1 | DQ-01 | T-07-01 | Excluded descriptors do not enter frequency/co-occurrence artifacts | unit/integration | `npm test -- tests/analysis/descriptor_sanitizer.test.ts tests/analysis/orchestration.test.ts` | No, Wave 0 | pending |
| 07-01-02 | TBD | 1 | DQ-02 | T-07-02 | Semantic noise downweights descriptors without mutating seed descriptor weights | unit | `npm test -- tests/inference/noise.test.ts` | Yes, extend existing | pending |
| 07-01-03 | TBD | 1/2 | DQ-03 | T-07-03 | Curated aliases canonicalize before analysis while preserving audit entries | unit/integration | `npm test -- tests/analysis/alias_canonicalization.test.ts tests/analysis/orchestration.test.ts` | No, Wave 0 | pending |
| 07-01-04 | TBD | 2 | DQ-04 | T-07-04 | Placement candidates require support, normalized support, and placement score thresholds | unit | `npm test -- tests/inference/placement_scoring.test.ts tests/compiler/compile_taxonomy.test.ts` | Partial | pending |
| 07-01-05 | TBD | 2 | DQ-05 | T-07-05 | Curated relations and accords produce deterministic similarity edges when inputs are non-empty | integration | `npm test -- tests/inference/build_similarity_graph.test.ts tests/compiler/compile_all.test.ts` | Yes, extend existing | pending |
| 07-01-06 | TBD | 2/3 | DQ-06 | T-07-06 | Review queue entries are deterministic and only final artifact review queue is emitted in `similarity_matrix.json` | integration | `npm test -- tests/compiler/compile_all.test.ts tests/inference/build_similarity_graph.test.ts` | Yes, extend existing | pending |
| 07-01-07 | TBD | 3 | DQ-07 | T-07-07 | Hard quality gates fail before writes; soft warnings do not fail compilation | unit/integration | `npm test -- tests/compiler/quality_gates.test.ts tests/cli/compile.test.ts` | Partial | pending |
| 07-01-08 | TBD | 3 | DQ-08 | T-07-08 | Seed expansion suggestions remain review-only and do not mutate seed hierarchy | unit/integration | `npm test -- tests/inference/seed_expansion_review.test.ts tests/compiler/compile_all.test.ts` | No, Wave 0 | pending |

---

## Wave 0 Requirements

- [ ] `src/tests/analysis/descriptor_sanitizer.test.ts` - stubs for DQ-01 sanitation behavior.
- [ ] `src/tests/analysis/alias_canonicalization.test.ts` - stubs for DQ-03 canonical alias behavior.
- [ ] `src/tests/inference/placement_scoring.test.ts` - stubs for DQ-04 candidate placement thresholds.
- [ ] `src/tests/compiler/quality_gates.test.ts` - stubs for DQ-07 hard/soft quality gates.
- [ ] `src/tests/inference/seed_expansion_review.test.ts` - stubs for DQ-08 review-only seed expansion suggestions.
- [ ] Extend `src/tests/cli/compile.test.ts` for concise quality status and review summary output.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Full corpus semantic plausibility spot check | DQ-01-DQ-08 | Automated tests prove deterministic behavior, but domain quality still needs spot review of compiled artifacts | After `npm run compile -- --generated-at 2026-01-01T00:00:00.000Z`, inspect `data/compiled/v1/similarity_matrix.json`, review queue severity distribution, and taxonomy placement samples |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s for targeted checks
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
