---
phase: 4
slug: corpus-analysis
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.0 (devDependency in `src/package.json`) |
| **Config file** | `src/vitest.config.ts` (existing — established in Phase 1) |
| **Quick run command** | `npm --prefix src exec vitest run src/tests/analysis/` |
| **Full suite command** | `npm --prefix src run test` |
| **Build check** | `npm --prefix src run build` (= `tsc --noEmit`) |
| **Estimated runtime** | ~5s (quick) / ~15s (full) |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src exec vitest run src/tests/analysis/`
- **After every plan wave:** Run `npm --prefix src run test`
- **Before `/gsd-verify-work`:** Full suite + `tsc --noEmit` must be green
- **Max feedback latency:** ~5 seconds (scoped suite)

---

## Per-Task Verification Map

> Populated by `gsd-planner` in step 8; one row per task across plans 04-01 and 04-02.
> Source: `04-RESEARCH.md` § Validation Architecture → Phase Requirements → Test Map.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-XX | 01 | 1 | ANAL-01 | — | N/A | unit + property | `npm --prefix src exec vitest run src/tests/analysis/frequency.test.ts` | ❌ W0 | ⬜ pending |
| 04-01-XX | 01 | 1 | ANAL-02 | — | N/A | unit + property | `npm --prefix src exec vitest run src/tests/analysis/cooccurrence.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-XX | 02 | 2 | ANAL-03 | — | N/A | unit | `npm --prefix src exec vitest run src/tests/analysis/similarity.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-XX | 02 | 2 | ANAL-04 | — | N/A | unit (fixture) | `npm --prefix src exec vitest run src/tests/analysis/alias_candidates.test.ts` | ❌ W0 | ⬜ pending |
| 04-0X-XX | 01/02 | 1/2 | ANAL-D-13/14/15 | — | N/A | unit | `npm --prefix src exec vitest run src/tests/analysis/export.test.ts` | ❌ W0 | ⬜ pending |
| 04-0X-XX | 01 | 1 | ANAL-D-18 | — | N/A | perf (`performance.now()`) | `npm --prefix src exec vitest run src/tests/analysis/stress.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/analysis/frequency.test.ts` — stubs for ANAL-01
- [ ] `src/tests/analysis/cooccurrence.test.ts` — stubs for ANAL-02
- [ ] `src/tests/analysis/similarity.test.ts` — stubs for ANAL-03
- [ ] `src/tests/analysis/alias_candidates.test.ts` — stubs for ANAL-04
- [ ] `src/tests/analysis/orchestration.test.ts` — stubs for `analyzeCorpus` (ANAL-D-13)
- [ ] `src/tests/analysis/export.test.ts` — stubs for deterministic serialization (ANAL-D-14/D-15)
- [ ] `src/tests/analysis/stress.test.ts` — perf stub for ANAL-D-18 single-pass / linear-complexity
- [ ] `src/tests/fixtures/analysis/` — canonical fixtures including:
  - tiny corpus with dedup case, multi-token descriptors, empty-normalization case
  - `camomile ↔ chamomile` Levenshtein detection case (per ROADMAP success criterion)
  - substring-only false-positive case (`rose ↔ rosewood`)
  - seed-covered pair exclusion case

*Vitest is already installed (Phase 1) — no framework install in Wave 0.*

---

## Property Tests (canonical for Phase 4)

| # | Property | Source | Covers |
|---|----------|--------|--------|
| 1 | Frequency monotonicity over subsets | RESEARCH | ANAL-01 |
| 2 | Sum invariant: `Σ freq == Σ |dedup(material.descriptors)|` | RESEARCH | ANAL-01 |
| 3 | Commutativity of co-occurrence storage | RESEARCH (D-05) | ANAL-02 |
| 4 | No zero-count entries in export | RESEARCH | ANAL-01, ANAL-02 |
| 5 | No self-pairs in co-occurrence | RESEARCH (D-17) | ANAL-02 |
| 6 | Idempotency under externally pre-normalized descriptors | RESEARCH (Phase 3 D-23) | ANAL-01, ANAL-02 |
| 7 | Re-run determinism — byte-for-byte equal exports | RESEARCH (D-15) | ANAL-D-14/15 |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual review of `alias_candidates.v1.json` from full corpus run | ANAL-04 | Suggestions are human-reviewed; no automated quality bar exists yet (Phase 6 will operationalize human review) | After `analyzeCorpus({ enableAliasCandidates: true })` on the full corpus, manually inspect the top-N candidates for false positives; record findings in PLAN follow-up |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s (quick) / 15s (full)
- [ ] `nyquist_compliant: true` set in frontmatter after planner finishes per-task map

**Approval:** pending
