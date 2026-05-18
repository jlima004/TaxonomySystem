---
phase: 05
slug: inference-engine
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-18
---

# Phase 05 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `cd src && npm test -- tests/inference/final_score.test.ts` |
| **Full suite command** | `cd src && npm run build && npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run the relevant `cd src && npm test -- tests/inference/<concern>.test.ts`, then `cd src && npm run build`.
- **After every plan wave:** Run `cd src && npm run build && npm test`.
- **Before `/gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 30 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-W0 | 01 | 0 | INFR-01 | T-05-01 | Seed descriptors remain curated; corpus frequency attaches only as evidence. | unit | `cd src && npm test -- tests/inference/seed_profile.test.ts` | W0 | pending |
| 05-01-W0 | 01 | 0 | INFR-02 | T-05-02 | Descriptor clustering is deterministic and does not mutate seed taxonomy. | unit/property | `cd src && npm test -- tests/inference/descriptor_clusters.test.ts` | W0 | pending |
| 05-02-W0 | 02 | 0 | INFR-03 | T-05-03 | Semantic overlap scores are normalized to `[0,1]`. | unit/property | `cd src && npm test -- tests/inference/semantic_overlap.test.ts` | W0 | pending |
| 05-02-W0 | 02 | 0 | INFR-04 | T-05-04 | Missing optional dimensions are ignored through weight renormalization, never treated as zero evidence. | unit | `cd src && npm test -- tests/inference/final_score.test.ts` | W0 | pending |
| 05-02-W0 | 02 | 0 | INFR-04 | T-05-05 | Similarity graph emits only sparse edges where `final_score > 0.25`. | unit | `cd src && npm test -- tests/inference/build_similarity_graph.test.ts` | W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/inference/seed_profile.test.ts` - stubs and failing tests for INFR-01.
- [ ] `src/tests/inference/descriptor_clusters.test.ts` - stubs and failing tests for INFR-02.
- [ ] `src/tests/inference/semantic_overlap.test.ts` - stubs and failing tests for INFR-03.
- [ ] `src/tests/inference/final_score.test.ts` - stubs and failing tests for INFR-04 plus weight renormalization.
- [ ] `src/tests/inference/build_similarity_graph.test.ts` - stubs and failing tests for sparse graph thresholding.
- [ ] `src/tests/fixtures/inference/` - fixtures for seed/corpus conflict, noisy corpus descriptors, missing tradition/accord dimensions, and exact-threshold edge filtering.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| None | N/A | All phase behaviors have automated verification. | N/A |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify.
- [ ] Wave 0 covers all missing references.
- [ ] No watch-mode flags.
- [ ] Feedback latency < 30s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending
