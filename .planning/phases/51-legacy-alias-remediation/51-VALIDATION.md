---
phase: 51
slug: legacy-alias-remediation
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-05
validated: 2026-06-05
---

# Phase 51 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest `^3.2.0` |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src test -- --run tests/cli/alias_integrity.test.ts tests/inventory/alias_target_inventory.test.ts` |
| **Full suite command** | `npm --prefix src test` (= `vitest run`) |
| **Deterministic gate (non-test)** | `cd src && npm run alias:integrity -- --json` (exit code is the proof) |
| **Estimated runtime** | ~30 seconds (quick) · full suite a few minutes |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src test -- --run tests/cli/alias_integrity.test.ts tests/inventory/alias_target_inventory.test.ts`
- **After every plan wave:** Run `npm --prefix src test`
- **Before `/gsd-verify-work`:** Full suite green AND `npm run alias:integrity` exit 0
- **Max feedback latency:** ~30 seconds (quick) per task

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 51-01 (before-proof) | 01 | 1 | HYG-01 | — | Gate fail-closed; empty exception list preserved | proof CLI | `cd src && npm run alias:integrity -- --json` (expect exit 1, `ylang ylang -> ylang_ylang`) | ✅ | 📋 manual |
| 51-01 (mutate seed) | 01 | 1 | HYG-01 | — | N/A (curated data add) | manual diff | `git diff data/taxonomy/taxonomy-seed.v2.json` (one added string `"ylang_ylang"`) | N/A | 📋 manual |
| 51-01 (publish v2.9.0) | 01 | 1 | HYG-01 | — | DEFAULT_PATHS unchanged; explicit `--version` only | CLI | sandbox `npm run compile -- --version 2.9.0 --out /tmp/...` then official `npm run compile -- --version 2.9.0` | ✅ `src/cli/compile.ts` | ✅ green |
| 51-01 (after-proof) | 01 | 1 | HYG-01 | — | All alias targets resolve in compiled IDs | proof CLI | `cd src && npm run alias:integrity -- --json` (expect exit 0, 341/18/0) | ✅ | ✅ green |
| 51-01 (update state-locked tests) | 01 | 1 | HYG-01 | — | Regression suite reflects post-remediation truth | unit/integration | `npm --prefix src test` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky · 📋 manual*

---

## Wave 0 Requirements

- [x] **Update `src/tests/inventory/alias_target_inventory.test.ts`** — post-remediation counts (341 descriptors, 18 valid, 0 dangling, `ylang_ylang` present in compiled + seed).
- [x] **Update `src/tests/cli/alias_integrity.test.ts`** — the "runs against real data" case expects `exitCode === 0` / `status: 'PASS'` / `unresolved_target_count: 0`.
- [x] **Verify `src/tests/curation/alias_seed_v2.test.ts`** — unchanged alias map; confirmed green in full suite.
- [x] **Verify `src/tests/curation/taxonomy_seed_v2.test.ts`** — Phase 51 safe-fit traceability wired; confirmed green in full suite.

*Wave 0 complete — existing infrastructure covers HYG-01; expectation updates applied during execution (commit `7c961a6`).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Safe-fit affirmation for `ylang_ylang` in `floral/floral_white` | HYG-01 (D-51-07/D-51-15) | Curation judgment the executor must affirm/document before mutation; not machine-checkable | Document safe-fit rationale in phase artifacts before editing the seed; halt to manual-review checkpoint if fit cannot be confirmed (D-51-16) |
| Before-mutation gate FAIL snapshot | HYG-01 (D-51-19 step 1) | Historical point-in-time proof; live data no longer reproduces pre-remediation state | Evidence in `51-SAFE-FIT-RATIONALE.md` and task commit `c202a6f` |
| Seed mutation diff (single append) | HYG-01 (D-51-01) | One-time curated edit verified at execution; not re-runnable as automated regression | `git show c202a6f -- data/taxonomy/taxonomy-seed.v2.json` |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (state-locked test updates)
- [x] No watch-mode flags
- [x] Feedback latency < 30s (quick)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** validated 2026-06-05

---

## Validation Audit 2026-06-05

| Metric | Count |
|--------|-------|
| Gaps found | 0 (VALIDATION.md stale; implementation already complete) |
| Resolved | 7 automated verifications confirmed green |
| Escalated | 3 historical/manual-only (before-proof, seed diff, safe-fit) |

**Audit commands run:**

```bash
npm --prefix src test -- --run tests/cli/alias_integrity.test.ts tests/inventory/alias_target_inventory.test.ts tests/curation/alias_seed_v2.test.ts tests/curation/taxonomy_seed_v2.test.ts  # 22/22 pass
cd src && npm run alias:integrity -- --json  # exit 0, 341/18/0
npm --prefix src test  # 56 files, 389 tests pass
```
