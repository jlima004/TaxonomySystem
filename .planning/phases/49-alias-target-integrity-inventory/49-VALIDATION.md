---
phase: 49
slug: alias-target-integrity-inventory
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-05
---

# Phase 49 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src test -- --run tests/inventory/alias_target_inventory.test.ts` |
| **Full suite command** | `npm --prefix src test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src test -- --run tests/inventory/alias_target_inventory.test.ts`
- **After every plan wave:** Run `npm --prefix src test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 49-01-01 | 01 | 1 | MH-live-data-audit | T-49-01 / — | Inventory counts match live seed, compiled aliases, and taxonomy IDs (18/18/340/17/1) | unit | `npm --prefix src test -- --run tests/inventory/alias_target_inventory.test.ts` | ✅ | ✅ green |
| 49-01-01 | 01 | 1 | MH-inventory-artifact | T-49-01 / — | `49-ALIAS-TARGET-INVENTORY.md` exists with required sections and `remediation_required` classification | unit | `npm --prefix src test -- --run tests/inventory/alias_target_inventory.test.ts` | ✅ | ✅ green |
| 49-01-01 | 01 | 1 | MH-near-match-evidence | — / — | Near-match documents `ylang` corpus candidate distinct from absent `ylang_ylang` | unit | `npm --prefix src test -- --run tests/inventory/alias_target_inventory.test.ts` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Zero-mutation scope: no files outside `.planning/phases/49-alias-target-integrity-inventory/` were modified during Phase 49 execution | MH-zero-mutation | Requires git history / diff boundary check against the phase execution window | Run `git diff --name-only <phase-base>..<phase-head>` and confirm only files under `.planning/phases/49-alias-target-integrity-inventory/` changed; no mutations under `data/taxonomy`, `data/compiled`, `src/`, or Graphify paths. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** validated 2026-06-05

## Validation Audit 2026-06-05

| Metric | Count |
|--------|-------|
| Gaps found | 3 |
| Resolved | 3 |
| Escalated | 0 |

**Resolved gaps:**
- Live data audit counts (18/18/340/17/1 dangling): `alias_target_inventory.test.ts`
- Inventory artifact contract (sections + `remediation_required` + handoff): `alias_target_inventory.test.ts`
- Near-match evidence (`ylang` corpus candidate vs absent `ylang_ylang`): `alias_target_inventory.test.ts`
