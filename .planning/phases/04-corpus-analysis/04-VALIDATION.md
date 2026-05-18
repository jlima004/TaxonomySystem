---
phase: 4
slug: corpus-analysis
status: approved
nyquist_compliant: true
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

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | ANAL-01, ANAL-02, ANAL-D-13/14/15/18 | T-04-01 (low) | N/A | scaffolding (it.todo) + build | `npm --prefix src run build && npm --prefix src exec vitest run src/tests/analysis/` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | ANAL-01, ANAL-02, ANAL-D-03/04/05/06/17 | T-04-01 (low) | N/A | unit + property | `npm --prefix src run build && npm --prefix src exec vitest run src/tests/analysis/frequency.test.ts src/tests/analysis/cooccurrence.test.ts` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | ANAL-01, ANAL-02, ANAL-D-13/14/15/18 | T-04-02 (low) | Path traversal guarded via `path.join` | unit + perf (`performance.now()`) | `npm --prefix src run build && npm --prefix src exec vitest run src/tests/analysis/` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | ANAL-03, ANAL-04 | — | N/A | scaffolding (it.todo) + build | `npm --prefix src run build && npm --prefix src exec vitest run src/tests/analysis/similarity.test.ts src/tests/analysis/alias_candidates.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | ANAL-03, ANAL-D-08/09 | — | N/A | unit | `npm --prefix src run build && npm --prefix src exec vitest run src/tests/analysis/similarity.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-03 | 02 | 2 | ANAL-04, ANAL-D-10/11/16/15 | T-04-02 (low) | Path traversal guarded via `path.join` | unit (fixture) + integration | `npm --prefix src run build && npm --prefix src exec vitest run src/tests/analysis/ && npm --prefix src run test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Wave 0 stubs are created within tasks `04-01-01` and `04-02-01` (intentional batching — see plan-checker W-2 disposition).

- [ ] `src/tests/analysis/frequency.test.ts` — stubs for ANAL-01 (created by 04-01-01)
- [ ] `src/tests/analysis/cooccurrence.test.ts` — stubs for ANAL-02 (created by 04-01-01)
- [ ] `src/tests/analysis/orchestration.test.ts` — stubs for `analyzeCorpus` (ANAL-D-13) (created by 04-01-01)
- [ ] `src/tests/analysis/export.test.ts` — stubs for deterministic serialization (ANAL-D-14/D-15) (created by 04-01-01)
- [ ] `src/tests/analysis/stress.test.ts` — perf stub for ANAL-D-18 single-pass / linear-complexity (created by 04-01-01)
- [ ] `src/tests/analysis/similarity.test.ts` — stubs for ANAL-03 (created by 04-02-01)
- [ ] `src/tests/analysis/alias_candidates.test.ts` — stubs for ANAL-04 (created by 04-02-01)
- [ ] `src/tests/fixtures/analysis/` — canonical fixtures:
  - tiny corpus with dedup case, multi-token descriptors, empty-normalization case (`tiny_corpus.json` — 04-01-01)
  - substring-only false-positive case (`substring_trap_corpus.json` — 04-02-01)
  - seed-covered pair exclusion case (`seed_excluded_corpus.json` — 04-02-01)
  - `camomile ↔ chamomile` Levenshtein detection case (`camomile_corpus.json` — 04-02-01) — covers ROADMAP success criterion 2

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
| Visual review of `alias_candidates.v1.json` from full corpus run | ANAL-04 | Suggestions are human-reviewed; no automated quality bar exists yet (Phase 6 will operationalize human review) | After `analyzeCorpus({ aliasCandidates: { minScore: 0.85 } })` on the full corpus, manually inspect the top-N candidates for false positives; record findings in PLAN follow-up |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies (every task above has an `<automated>` command; Wave 0 stubs created by 04-01-01 and 04-02-01)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify (all 6 tasks have automated commands)
- [x] Wave 0 covers all MISSING references (test stubs + fixtures listed above)
- [x] No watch-mode flags (`vitest run`, not `vitest`)
- [x] Feedback latency < 5s (quick) / 15s (full)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-05-17 (post-plan-checker W-1 fix)
