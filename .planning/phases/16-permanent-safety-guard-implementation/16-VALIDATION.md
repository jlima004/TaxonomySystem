---
phase: 16
slug: permanent-safety-guard-implementation
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-26
completed: 2026-05-26
---

# Phase 16 — Validation Strategy

> Per-phase validation contract for the permanent non-mutating safety guard script.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Local proof only; no unit test framework is required for Phase 16. |
| **Config file** | None. Existing package scripts are out of scope. |
| **Quick run command** | `./scripts/check-safety-guards.sh` and `bash scripts/check-safety-guards.sh` |
| **Full suite command** | Run only the Phase 16 guard proof steps; no compile/smoke/typecheck/tests/build. |
| **Estimated runtime** | <10 seconds (excluding /tmp simulation setup). |

---

## Sampling Rate

- **After every task commit:** Run the local guard proof steps for that task.
- **After every plan wave:** Re-run the real-repo PASS checks plus /tmp simulations.
- **Before `/gsd-verify-work`:** Confirm non-mutation proof and that all required failure simulations were recorded.
- **Max feedback latency:** <10 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 16-01 | 1 | GUARD16-01 | T16-01 | Guard script exists and runs non-mutating checks. | local proof | `./scripts/check-safety-guards.sh` + `bash scripts/check-safety-guards.sh` | ✅ | ✅ green |
| 16-01-02 | 16-01 | 1 | GUARD16-02 | T16-02 | Staged Graphify paths are blocked; dirty working tree allowed. | /tmp simulation | `git diff --cached --name-only -- graphify-out` | ✅ | ✅ green |
| 16-01-03 | 16-01 | 1 | GUARD16-03 | T16-03 | Protected paths staged + working-tree diffs are blocked. | /tmp simulation | `git diff --cached --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` and `git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` | ✅ | ✅ green |
| 16-01-04 | 16-01 | 1 | GUARD16-04 | T16-04 | report_all output covers multiple violations; non-mutation proven. | local proof + /tmp simulation | Real repo runs + /tmp multi-violation scenario | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `scripts/check-safety-guards.sh` — local guard script.
- [x] Real repo PASS evidence for both invocations.
- [x] Non-mutation proof: `git status --short` before/after real repo runs.
- [x] /tmp simulations for `GRAPHIFY_STAGED`, `PROTECTED_PATH_STAGED`, `PROTECTED_DIFF`, and report_all multiple violations.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Failure policy text contains no destructive or automatic remediation guidance. | GUARD16-04 | Output text is a policy statement, not a test assertion. | Inspect stderr output for each simulated failure; confirm it only states policy and does not suggest cleanup, reset, or auto-remediation. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** complete — 2026-05-26
