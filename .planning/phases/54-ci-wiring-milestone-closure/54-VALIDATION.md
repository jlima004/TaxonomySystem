---
phase: 54
slug: ci-wiring-milestone-closure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-08
---

# Phase 54 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest via `src/vitest.config.ts` |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src test -- tests/analysis/stress.test.ts` |
| **Full suite command** | `npm --prefix src test` |
| **Estimated runtime** | ~60-120 seconds locally; CI runtime must be measured during execution |

---

## Sampling Rate

- **After every task commit:** Run the narrowest applicable command plus `npm --prefix src run typecheck`.
- **After every plan wave:** Run `npm --prefix src test` and `npm --prefix src run alias:integrity -- --json`.
- **Before `/gsd-verify-work`:** Run the full locked CI sequence and Phase 54 boundary audit.
- **Max feedback latency:** One task commit; no CI workflow or closure artifact should advance without a local command proof.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 54-01-01 | 01 | 1 | CI-03 | T-54-01 | Stress test remains a performance-regression guard while becoming CI-safe | focused test | `npm --prefix src test -- tests/analysis/stress.test.ts` | ✅ | ⬜ pending |
| 54-01-02 | 01 | 1 | CI-02, CI-03 | T-54-01 | Typecheck and full tests remain green after stress-test change | type/full test | `npm --prefix src run typecheck && npm --prefix src test` | ✅ | ⬜ pending |
| 54-02-01 | 02 | 2 | CI-01, CI-02, CI-03, CI-04 | T-54-02 | CI uses lockfile install and existing npm guardrails only | static/source | Source assertions against `.github/workflows/*.yml` | ❌ W0 | ⬜ pending |
| 54-02-02 | 02 | 2 | CI-04 | T-54-03 | Alias proof exposes `341/18/0` JSON baseline | CLI proof | `npm --prefix src run alias:integrity -- --json` | ✅ | ⬜ pending |
| 54-03-01 | 03 | 3 | BOUND-01, BOUND-02, BOUND-03 | T-54-04 | Protected taxonomy, compiled, Graphify, scoring, UI, MVP, and Knowledge Engine scopes remain untouched/unclaimed | boundary audit | `git diff --name-only` and `git diff --cached --name-only` over protected paths | ✅ | ⬜ pending |
| 54-03-02 | 03 | 3 | CI-01, CI-02, CI-03, CI-04, BOUND-01, BOUND-02, BOUND-03 | T-54-05 | Closure artifacts record command proofs and milestone-audit routing | artifact review | Verify `54-SUMMARY.md`, `54-VERIFICATION.md`, `54-UAT.md` exist and cite required proofs | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `.github/workflows/<ci-name>.yml` — required to cover CI-01 through CI-04.
- [ ] `src/tests/analysis/stress.test.ts` CI-safe stabilization — required before trusting CI-03.
- [ ] Phase 54 closure artifacts (`54-SUMMARY.md`, `54-VERIFICATION.md`, `54-UAT.md`) — required before milestone audit closure.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GitHub-hosted CI run status | CI-01, CI-02, CI-03, CI-04 | Remote GitHub Actions execution may not be available locally | After pushing the branch, confirm the workflow runs on push/PR to `master` and reports each required command step. |
| Milestone closure routing | BOUND-01, BOUND-02, BOUND-03 | `/gsd-audit-milestone v2.10` is a process gate after Phase 54 verification | Run `/gsd-audit-milestone v2.10`; do not run `/gsd-complete-milestone v2.10` until audit is clean. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency is bounded by focused commands before full-suite proof
- [ ] `nyquist_compliant: true` set in frontmatter after execution evidence is collected

**Approval:** pending
