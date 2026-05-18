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
| **Quick run command** | `cd src && npm test -- tests/inference/` |
| **Per-concern command** | `cd src && npm test -- tests/inference/<concern>.test.ts` |
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
| 05-01-W0 | 01 | 0 | INFR-01, INFR-02 | T-05-03 | Descriptor clustering is deterministic and does not mutate seed taxonomy. | unit/property | `cd src && npm test -- tests/inference/descriptor_clusters.test.ts` | W0 | pending |
| 05-01-W0 | 01 | 0 | INFR-01 | T-05-01 | Noisy descriptors are downweighted, not removed; seed-owned noise terms keep weight 1 and produce audit warnings. | unit | `cd src && npm test -- tests/inference/noise.test.ts` | W0 | pending |
| 05-02-W0 | 02 | 0 | INFR-03 | T-05-04 | Semantic overlap scores are normalized to `[0,1]`. | unit/property | `cd src && npm test -- tests/inference/semantic_overlap.test.ts` | W0 | pending |
| 05-02-W0 | 02 | 0 | INFR-04 | T-05-04 | Tradition score uses curated relations, seed proximity, and corpus support as separated evidence. | unit | `cd src && npm test -- tests/inference/tradition_score.test.ts` | W0 | pending |
| 05-02-W0 | 02 | 0 | INFR-04 | T-05-05 | Accord compatibility returns `undefined` when absent, not `0`. | unit | `cd src && npm test -- tests/inference/accord_compatibility.test.ts` | W0 | pending |
| 05-03-W0 | 03 | 0 | INFR-04 | T-05-11 | Missing optional dimensions are ignored through weight renormalization, never treated as zero evidence. | unit | `cd src && npm test -- tests/inference/final_score.test.ts` | W0 | pending |
| 05-04-W0 | 04 | 0 | INFR-04 | T-05-12 | Similarity graph emits only sparse edges where `final_score > 0.25`. Graph output is deterministic across repeated calls. | unit | `cd src && npm test -- tests/inference/build_similarity_graph.test.ts` | W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/inference/seed_profile.test.ts` - stubs prepared for red/green implementation of INFR-01.
- [ ] `src/tests/inference/descriptor_clusters.test.ts` - stubs prepared for red/green implementation of INFR-02.
- [ ] `src/tests/inference/noise.test.ts` - stubs prepared for red/green implementation; validates: noisy descriptor receives downweight, noisy descriptor is not removed, seed descriptor has seed exception and does not receive automatic downweight, seed/noise overlap generates audit warning or review item, noise decisions appear in audit/review output.
- [ ] `src/tests/inference/semantic_overlap.test.ts` - stubs prepared for red/green implementation of INFR-03.
- [ ] `src/tests/inference/tradition_score.test.ts` - stubs prepared for red/green implementation; validates tradition score uses curated relations, seed proximity, and corpus support as separated evidence.
- [ ] `src/tests/inference/accord_compatibility.test.ts` - stubs prepared for red/green implementation; validates accord compatibility returns `undefined` when absent, not `0`.
- [ ] `src/tests/inference/final_score.test.ts` - Plan 05-03 Wave 0 stubs prepared for red/green implementation of INFR-04 plus weight renormalization.
- [ ] `src/tests/inference/build_similarity_graph.test.ts` - Plan 05-04 Wave 0 stubs prepared for red/green implementation of sparse graph thresholding and determinism.
- [ ] `src/tests/fixtures/inference/` - fixtures for seed/corpus conflict, noisy corpus descriptors, missing tradition/accord dimensions, exact-threshold edge filtering, and deterministic graph output.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| None | N/A | All phase behaviors have automated verification. | N/A |

---

## Determinism Validation

`buildSimilarityGraph` must produce edges, clusters, and `review_queue` in deterministic order on repeated calls with the same input. Tests must assert:

```typescript
it('is deterministic across repeated calls', async () => {
  const input = await loadFixture('scoring_dimensions.json')
  const first = buildSimilarityGraph(seed, input, curatedInputs, options)
  const second = buildSimilarityGraph(seed, input, curatedInputs, options)

  expect(first.edges).toEqual(second.edges)
  expect(first.review_queue).toEqual(second.review_queue)
  expect(first.stats).toEqual(second.stats)
})
```

Additionally, `generated_at` must be injectable via options or fixed in fixtures. Tests must NOT assert on `generated_at` unless a fixed value is passed; if the implementation uses `new Date()` internally, exclude `generated_at` from deep-equality determinism assertions.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify.
- [ ] Wave 0 covers all missing references.
- [ ] No watch-mode flags.
- [ ] Feedback latency < 30s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending
