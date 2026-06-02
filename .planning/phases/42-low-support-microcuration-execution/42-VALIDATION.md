---
phase: 42
slug: low-support-microcuration-execution
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-02
---

# Phase 42 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 |
| **Config file** | `src/package.json` script `test` uses `vitest run` |
| **Quick run command** | `cd src && npm run test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts` |
| **Full suite command** | `cd src && npm run test` |
| **Estimated runtime** | ~2 seconds for focused curation tests |

---

## Sampling Rate

- **After every task commit:** Run `cd src && npm run test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts`.
- **After every plan wave:** Run focused curation tests, `cd src && npm run safety:guard`, and inspect protected diffs.
- **Before `/gsd-verify-work`:** Focused curation tests must be green, safety guard must pass, and no unauthorized diffs may exist.
- **Max feedback latency:** 30 seconds for focused validation.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 42-01-01 | 01 | 1 | CUR-02 | T-42-01 | Only six `mutation_allowed=true` Phase 41 rows are selected for mutation | source audit | read `.planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md` and confirm rows 06, 07, 10, 13, 14, 15 only | yes | green |
| 42-01-02 | 01 | 1 | CUR-02 | T-42-02 | Target families/subfamilies exist and descriptors are globally absent before insertion | data audit | inspect `data/taxonomy/taxonomy-seed.v2.json` before editing | yes | green |
| 42-01-03 | 01 | 1 | CUR-02 | T-42-03 | Exactly six descriptors are appended to existing seed targets and no structural nodes are created | source diff | `git diff -- data/taxonomy/taxonomy-seed.v2.json` | yes | green |
| 42-01-04 | 01 | 1 | CUR-02 | T-42-04 | Approval traceability and seed invariants cover the six additions | unit | `cd src && npm run test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts` | yes | green |
| 42-01-05 | 01 | 1 | CUR-02 | T-42-05 | Alias seed and official compiled v2 artifacts remain unchanged | diff/safety | `git diff -- data/taxonomy/descriptor_aliases.seed.json data/compiled/v2` and `cd src && npm run safety:guard` | yes | green |
| 42-01-06 | 01 | 1 | CUR-02 | T-42-06 | Closeout evidence records mutation scope, test results, and artifact guard evidence | documentation | inspect `42-SUMMARY.md` and `42-VERIFICATION.md` | yes | green |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [x] Decide the minimal approval-traceability update needed in `src/tests/curation/taxonomy_seed_v2.test.ts` or adjacent fixture/test so Phase 42 seed additions are explicitly approved.
- [x] Ensure validation requires the six approved paths and excludes all non-approved Phase 41 rows from mutation.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Verify no official `data/compiled/v2` publication occurred | CUR-02 | Diff scope is the authoritative proof for protected artifact publication | Run `git diff -- data/compiled/v2` and confirm it is empty before closeout |
| Verify `descriptor_aliases.seed.json` was not modified | CUR-02 | Phase 41 matrix has no approved alias rows | Run `git diff -- data/taxonomy/descriptor_aliases.seed.json` and confirm it is empty before closeout |

---

## Validation Sign-Off

- [x] All tasks have automated or source/diff verification.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing traceability references.
- [x] No watch-mode flags.
- [x] Feedback latency < 30s for focused tests.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved
