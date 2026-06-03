---
phase: 46
slug: batch-2-decision-matrix
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-03
---

# Phase 46 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Python 3 documentation parser assertions; no committed test framework required |
| **Config file** | none |
| **Quick run command** | `python3 - <<'PY' ... PY` embedded in PLAN.md verification |
| **Full suite command** | Parser assertions plus protected-boundary `git diff --name-only` check |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run the parser assertions over `46-DECISION-MATRIX.md`.
- **After every plan wave:** Run parser assertions plus protected-boundary diff check.
- **Before `/gsd-verify-work`:** Parser green and only permitted Phase 46 planning/decision artifacts changed.
- **Max feedback latency:** 10 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 46-01-01 | 01 | 1 | DEC-01 | T-46-01 | Matrix exists and has exactly the 40 Phase 45 selected candidates | parser | `python3 - <<'PY' ... PY` | No - Wave 0 | pending |
| 46-01-02 | 01 | 1 | DEC-02 | T-46-01 | Locked disposition enum and mutation invariants are enforced | parser | `python3 - <<'PY' ... PY` | No - Wave 0 | pending |
| 46-01-03 | 01 | 1 | DEC-03 | T-46-02 | Evidence/rationale fields are present and non-mutating rows instruct `none` | parser | `python3 - <<'PY' ... PY` | No - Wave 0 | pending |
| 46-01-04 | 01 | 1 | DEC-01, DEC-02, DEC-03 | T-46-02 | No protected taxonomy, alias, compiled, source, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI mutations occur | CLI diff | `git diff --name-only` | Yes | pending |

---

## Wave 0 Requirements

- [ ] `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` - required output artifact with locked schema and execution summary.
- [ ] Inline Python parser command in `46-01-PLAN.md` verification steps; no committed helper script required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Row-by-row curator judgment quality | DEC-03 | Evidence-backed disposition quality requires semantic review beyond parser invariants | Review all 40 rationale/evidence fields against Phase 45 selection and compiled taxonomy/alias evidence before approving Phase 47 |

---

## Validation Sign-Off

- [ ] All tasks have automated parser or CLI verification.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify.
- [ ] Wave 0 covers all missing references.
- [ ] No watch-mode flags.
- [ ] Feedback latency < 10s.
- [ ] `nyquist_compliant: true` set in frontmatter after validation is finalized.

**Approval:** pending
