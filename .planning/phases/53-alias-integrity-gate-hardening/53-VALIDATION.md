---
phase: 53
slug: alias-integrity-gate-hardening
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-06
validated: 2026-06-08
---

# Phase 53 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest v3.2.4 |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src test -- tests/inventory/alias_target_inventory.test.ts tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` |
| **Full suite command** | `npm --prefix src test` |
| **Estimated runtime** | ~30 seconds quick/focused, ~90 seconds full final phase gate |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src test -- tests/inventory/alias_target_inventory.test.ts tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` and `npm --prefix src run typecheck` as the primary fast feedback loop.
- **After every plan wave:** Run focused tests, `npm --prefix src run typecheck`, `npm --prefix src run alias:integrity -- --json`, `npm --prefix src run verify:integrity -- --json` once available, `npm --prefix src run compile:quality` once changed, and `npm --prefix src run compile -- --out /tmp/phase53-compile-smoke`.
- **Before `/gsd-verify-work`:** Full suite, alias JSON proof, new `verify:integrity` proof, compile smoke, typecheck, and boundary diff checks must be green. The full suite is a final phase gate with expected ~90s latency, not a per-edit feedback command.
- **Max feedback latency:** 120 seconds for focused tests + typecheck; full-suite latency is tracked separately as final phase-gate latency.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 53-01-01 | 01 | 1 | GATE-01 | T-53-01 | Normal `compile` remains alias-gate-free while local quality gate includes alias proof | script/unit | `npm --prefix src test -- tests/cli/alias_integrity.test.ts` | yes | green |
| 53-01-02 | 01 | 1 | GATE-02 | T-53-02 | Alias proof reports `PASS` with `341/18/0` and empty unresolved list | CLI smoke | `npm --prefix src run alias:integrity -- --json` | yes | green |
| 53-01-03 | 01 | 1 | GATE-03 | T-53-03 | Local alias guard fails non-zero when unresolved targets exist | unit/CLI | `npm --prefix src test -- tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` | yes | green |
| 53-02-01 | 02 | 1 | TEST-01 | T-53-04 | Inventory test uses shared validator without dropping documentary fixture assertions | unit | `npm --prefix src test -- tests/inventory/alias_target_inventory.test.ts` | yes | green |
| 53-03-01 | 03 | 2 | TEST-02 | T-53-05 | Existing coverage remains equivalent or stronger across focused and full suites | regression | `npm --prefix src test` | yes | green |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

- [x] `src/package.json` - add `verify:integrity`, update `compile:quality` if clean, and preserve `compile` exactly alias-gate-free.
- [x] `src/tests/cli/alias_integrity.test.ts` - extend script-wiring assertions for `verify:integrity`, `compile:quality`, and unchanged `compile`.
- [x] `src/tests/inventory/alias_target_inventory.test.ts` - reuse `validateAliasTargetIntegrity` where appropriate while preserving documentary inventory checks.
- [x] Command proof - verify `npm --prefix src run verify:integrity -- --json` after adding the script.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Boundary proof for excluded data/artifact scopes | D-23 | Git diff scope is repository-state dependent | Run `git diff --name-only` and confirm no changes under `data/taxonomy/taxonomy-seed.v2.json`, descriptor alias policy files, `data/compiled/v2/*`, Graphify, scoring, UI, MVP, or Knowledge Engine scope. |
| Static proof that normal compile remains unchanged | GATE-01 | Script intent is easiest to audit directly | Inspect `src/package.json` and confirm `scripts.compile` does not include `alias:integrity`, `verify:integrity`, or `compile:quality`. |

---

## Validation Sign-Off

- [x] All tasks have automated verify commands or explicit manual boundary proof.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references from the research validation map.
- [x] No watch-mode flags.
- [x] Feedback latency < 120s for focused checks.
- [x] `nyquist_compliant: true` set in frontmatter after planner/checker confirmation.

**Approval:** approved 2026-06-08

---

## Validation Audit 2026-06-08

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |

**Audit notes:** All 5 per-task requirements verified green. Focused regression (14/14), full suite (390/390), and `verify:integrity --json` PASS 341/18/0 confirmed at audit time. No new test files required; existing coverage in `alias_integrity.test.ts`, `alias_target_integrity.test.ts`, and `alias_target_inventory.test.ts` satisfies all automated requirements. Two manual-only boundary checks (D-23, GATE-01 static inspection) remain documented and were satisfied during Plan 03 execution.
