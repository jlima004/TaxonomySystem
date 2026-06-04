---
phase: 48
slug: v2-8-artifact-publication-closure
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-04
---

# Phase 48 - Validation Strategy

Per-phase validation contract for v2.8 artifact publication and closure.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 locked in `src/package-lock.json` |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `cd src && npm run test -- tests/curation/taxonomy_seed_v2.test.ts` |
| **Full suite command** | `cd src && npm run test` |
| **Estimated runtime** | Full suite runtime is environment-dependent; use command exit code as source of truth |

---

## Sampling Rate

- **After every publication task:** Run the task-specific compile, JSON-parse, hash, or diff assertion listed in the plan.
- **Before official publication:** Run `cd src && npm run test` and confirm `src/tests/fixtures/curation/46-DECISION-MATRIX.md` exists.
- **After official publication:** Re-parse `data/compiled/v2/*.json`, run protected-boundary hash/diff assertions, run `scripts/check-safety-guards.sh`, then run `cd src && npm run test`.
- **Before `/gsd-verify-work`:** Full suite, published JSON assertions, closure report metric match, and protected-boundary assertions must all be green.
- **Max feedback latency:** No task may proceed after a failed gate; failures halt publication immediately.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 48-01-01 | 01 | 1 | PUB-01 | T-48-01 | WR-01 fixture and full Vitest prove pre-publication stability | integration | `test -f src/tests/fixtures/curation/46-DECISION-MATRIX.md && cd src && npm run test` | yes | pending |
| 48-01-02 | 01 | 1 | PUB-01 | T-48-02 | Sandbox compile writes only `/tmp` artifacts and uses `--out`, not `--output` | smoke | `cd src && npm run precompile && npm run compile -- --version 2.8.0 --out /tmp/compile-2.8-validate --generated-at 2026-06-04T00:00:00.000Z` | yes | pending |
| 48-01-03 | 01 | 1 | PUB-02 | T-48-03 | v2.7 baseline metrics and protected hashes are captured before overwrite | data assertion | Node JSON parser over `data/compiled/v2/*.json` plus `sha256sum` manifest | yes | pending |
| 48-01-04 | 01 | 1 | PUB-02 | T-48-04 | Official compile writes all three published artifacts with `--version 2.8.0` | integration | `cd src && npm run compile -- --version 2.8.0` | yes | pending |
| 48-01-05 | 01 | 1 | PUB-02, PUB-03 | T-48-05 | Published JSON versions, metrics, promoted seed paths, and allowed diff set are asserted | data assertion | Node parser over `data/compiled/v2/*.json`, `git diff --name-only`, `scripts/check-safety-guards.sh` | yes | pending |
| 48-01-06 | 01 | 1 | PUB-03 | T-48-06 | Full suite passes after publication and `DEFAULT_PATHS.version` remains `2.1.0` | integration | `cd src && npm run test` plus source assertion on `src/cli/parse_args.ts` | yes | pending |
| 48-01-07 | 01 | 1 | PUB-03 | T-48-07 | Closure report metrics match re-parsed published JSON and protected boundaries are documented | documentation/data assertion | Compare `.planning/releases/v2.8.0-CLOSURE.md` values against Node parser output from `data/compiled/v2/*.json` | no | pending |

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No source, dependency, schema, or test-file changes are allowed in Phase 48.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Explicit approval if `scripts/check-safety-guards.sh` reports only the authorized `data/compiled/v2` publication diff | PUB-02 | The existing guard may classify intentional compiled artifact publication as protected-path drift | Halt, compare `git diff --name-only` against the Phase 48 allow-list, verify protected hashes, and obtain explicit user approval before commit if the guard cannot exit 0 after staging policy reconciliation. |

---

## Validation Sign-Off

- [x] All tasks have automated verify commands or explicit halt/escalation criteria.
- [x] Sampling continuity: every task has a direct pass/fail gate.
- [x] Wave 0 covers all missing references; no source test scaffolding is needed.
- [x] No watch-mode flags.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending execution
