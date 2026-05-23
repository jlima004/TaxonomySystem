---
phase: 09
slug: taxonomy-seed-v2-expansion-round-2
status: planned
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-23
---

# Phase 09 - Validation Strategy

Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (`^3.2.0`) |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `cd src && npm test -- tests/curation/` |
| **Full suite command** | `cd src && npm run typecheck && npm test && npm run build` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd src && npm test -- tests/curation/` or the specific test file.
- **After every plan wave:** Run `cd src && npm run typecheck && npm test && npm run build`.
- **Before `/gsd-verify-work`:** Full suite must be green and the Round 2 v1-vs-v2 validation report must be generated and verified.
- **Max feedback latency:** 10 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | EXP2-02, EXP2-03 | T-09-01 | Round 2 curation ledger structure and candidate prioritization are defined in workbook. | unit/data | `cd src && npm test -- tests/curation/review_dispositions.test.ts` | ✅ | ⬜ pending |
| 09-02-01 | 02 | 2 | EXP2-01, EXP2-04 | T-09-02 | v2 seed expands only with manual approval for green/fruity/spicy; legacy alias target warnings are deferred. | unit/data | `cd src && npm test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/alias_seed_v2.test.ts` | ✅ | ⬜ pending |
| 09-03-01 | 03 | 3 | EXP2-05 | T-09-03 | Relations and accords map with manual scores in [0,1], and the vanilla gap is resolved via warm_spice. | unit/integration | `cd src && npm test -- tests/curation/relation_accord_v2.test.ts` | ✅ | ⬜ pending |
| 09-04-01 | 04 | 4 | EXP2-06, EXP2-07 | T-09-04 | Comparison report evaluates v2-expanded against v1 using 10 metrics without overwriting v1 defaults. | integration/smoke | `cd src && npm test -- tests/curation/v1_v2_comparison.test.ts` | ✅ | ⬜ pending |

---

## Wave 0 Requirements

Existing test files from Phase 8 are fully compatible and reused for Phase 9:
- [x] `src/tests/curation/taxonomy_seed_v2.test.ts` - covers EXP2-01, EXP2-03
- [x] `src/tests/curation/review_dispositions.test.ts` - covers EXP2-02, EXP2-03
- [x] `src/tests/curation/alias_seed_v2.test.ts` - covers EXP2-04
- [x] `src/tests/curation/relation_accord_v2.test.ts` - covers EXP2-05
- [x] `src/tests/curation/v1_v2_comparison.test.ts` - covers EXP2-06

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Approve the Round 2 candidate list for `green`, `fruity`, and `spicy`. | EXP2-01, EXP2-02 | Manual curation is required to ensure olfactory classification correctness. | Review workbook entries under `Phase 09 / Round 2 Curation` and check each approved entry's rationale. |
| Validate manual scores for new relations and accords. | EXP2-05 | Semantic similarity scores in traditional and accord dimensions are qualitative. | Confirm scores are within [0,1], have short rationale, and resolve the vanilla bridge gap. |
| Sign-off future promotion readiness criteria. | EXP2-07 | Promotion readiness is a future planning document that requires consensus. | Review the 10 criteria documented in `09-CONTEXT.md` and check if they align with project goals. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands.
- [x] Sampling continuity: no 3 consecutive tasks without automated verification.
- [x] Wave 0 covers all requirements.
- [x] No watch-mode flags.
- [x] Feedback latency < 10s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved_for_execution
