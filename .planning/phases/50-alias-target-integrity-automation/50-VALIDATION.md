---
phase: 50
slug: alias-target-integrity-automation
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-05
---

# Phase 50 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src test -- --run tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` |
| **Full suite command** | `npm --prefix src test` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix src test -- --run tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts`
- **After every plan wave:** Run `npm --prefix src test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 50-01-01 | 01 | 1 | HYG-02, HYG-03 | T-50-01 / T-50-04 | Malformed exception data fails closed; only exact approved exception pairs suppress unresolved alias targets | unit | `npm --prefix src test -- --run tests/compiler/alias_target_integrity.test.ts` | ✅ | ✅ green |
| 50-01-02 | 01 | 1 | HYG-02, HYG-03 | T-50-02 / T-50-03 | CLI reports deterministic PASS/FAIL counts, uses readable-path fallback, and returns non-zero for unresolved live-data aliases | integration | `npm --prefix src test -- --run tests/cli/alias_integrity.test.ts` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Proof command preserves current live-data failure semantics (`ylang ylang -> ylang_ylang`) while default test/build/compile flows stay green | HYG-02, HYG-03 | Requires checking combined package-script behavior and expected non-zero proof output against real repo data | Run `npm --prefix src run build`, `npm --prefix src run compile -- --out /tmp/phase50-compile-smoke`, `npm --prefix src test`, then `npm --prefix src run alias:integrity -- --json`; confirm build/compile/test exit 0 and alias-integrity exits non-zero with exactly one unresolved entry for `ylang ylang -> ylang_ylang`. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 20s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

## Validation Audit 2026-06-05

| Metric | Count |
|--------|-------|
| Gaps found | 3 |
| Resolved | 3 |
| Escalated | 0 |

**Resolved gaps:**
- Temp-fixture PASS: CLI exits 0 with PASS output (`alias_integrity.test.ts`)
- Temp-fixture FAIL: CLI exits 1 with unresolved details and remediation hint (`alias_integrity.test.ts`)
- Script wiring: `alias:integrity` exists, supports `--json`, not wired into test/build/compile (`alias_integrity.test.ts`)
