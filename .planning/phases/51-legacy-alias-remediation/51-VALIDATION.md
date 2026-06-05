---
phase: 51
slug: legacy-alias-remediation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-05
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
| 51-01 (before-proof) | 01 | 1 | HYG-01 | — | Gate fail-closed; empty exception list preserved | proof CLI | `cd src && npm run alias:integrity -- --json` (expect exit 1, `ylang ylang -> ylang_ylang`) | ✅ | ⬜ pending |
| 51-01 (mutate seed) | 01 | 1 | HYG-01 | — | N/A (curated data add) | manual diff | `git diff data/taxonomy/taxonomy-seed.v2.json` (one added string `"ylang_ylang"`) | N/A | ⬜ pending |
| 51-01 (publish v2.9.0) | 01 | 1 | HYG-01 | — | DEFAULT_PATHS unchanged; explicit `--version` only | CLI | sandbox `npm run compile -- --version 2.9.0 --out /tmp/...` then official `npm run compile -- --version 2.9.0` | ✅ `src/cli/compile.ts` | ⬜ pending |
| 51-01 (after-proof) | 01 | 1 | HYG-01 | — | All alias targets resolve in compiled IDs | proof CLI | `cd src && npm run alias:integrity -- --json` (expect exit 0, 341/18/0) | ✅ | ⬜ pending |
| 51-01 (update state-locked tests) | 01 | 1 | HYG-01 | — | Regression suite reflects post-remediation truth | unit/integration | `npm --prefix src test` | ✅ (expectations need update) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] **Update `src/tests/inventory/alias_target_inventory.test.ts`** — post-remediation counts (341 descriptors, 18 valid, 0 dangling, `ylang_ylang` present in compiled + seed). Currently asserts the pre-remediation state and WILL fail after publish.
- [ ] **Update `src/tests/cli/alias_integrity.test.ts`** — the "runs against real data" case must expect `exitCode === 0` / `status: 'PASS'` / `unresolved_target_count: 0` instead of the `ylang ylang` FAIL. (Temp-fixture PASS/FAIL cases and `--help`/wiring cases are unaffected.)
- [ ] **Verify `src/tests/curation/alias_seed_v2.test.ts`** — references the `ylang ylang` alias as a preserved legacy alias; expected to stay green (alias map unchanged, D-51-05) but must be run to confirm.

*No new test files or framework install needed — existing infrastructure covers HYG-01; the gaps are expectation updates, not net-new suites.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Safe-fit affirmation for `ylang_ylang` in `floral/floral_white` | HYG-01 (D-51-07/D-51-15) | Curation judgment the executor must affirm/document before mutation; not machine-checkable | Document safe-fit rationale in phase artifacts before editing the seed; halt to manual-review checkpoint if fit cannot be confirmed (D-51-16) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (state-locked test updates)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s (quick)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
