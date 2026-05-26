---
phase: 16-permanent-safety-guard-implementation
plan: 01
status: complete
completed: 2026-05-26
duration: ~10min
files_created: [scripts/check-safety-guards.sh]
files_modified: []
commit: pending
---

# Plan 16-01 Summary — Non-Mutating Safety Guard Script

## Objective

Implement `scripts/check-safety-guards.sh` as a permanent, non-mutating local bash script
that blocks staged Graphify and protected-path changes per GUARD16-D-01..D-33, then validate
PASS, non-mutation, and all required failure simulations.

---

## What Was Done

### Task 1: Implement guard script

Created `scripts/check-safety-guards.sh` with:

- **Shebang:** `#!/usr/bin/env bash`
- **Repo root detection:** `git rev-parse --show-toplevel` with `NOT_GIT_REPO` stderr + exit 1 guard (GUARD16-D-21, D-22)
- **Three exact guard commands** as specified (GUARD16-D-23..D-27):
  1. `git diff --cached --name-only -- graphify-out` → GRAPHIFY_STAGED
  2. `git diff --cached --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` → PROTECTED_PATH_STAGED
  3. `git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` → PROTECTED_DIFF
- **report_all behavior:** all three checks run before exit (GUARD16-D-17)
- **Labels:** `PASS`, `GRAPHIFY_STAGED`, `PROTECTED_PATH_STAGED`, `PROTECTED_DIFF`, `NOT_GIT_REPO` (GUARD16-D-16)
- **Output routing:** PASS → stdout; violations + policy → stderr (GUARD16-D-18, D-19)
- **Policy line:** `"Policy: non-mutating guard; do not clean, revert, regenerate, stage, unstage, or commit protected paths or graphify-out/* in this plan."` (GUARD16-D-20)
- **Exit codes:** 0 for PASS, 1 for any violations (GUARD16-D-15)
- **Non-mutating:** no git add, reset, checkout, clean, or rm commands in the script (GUARD16-D-09)
- **Executable bit:** `chmod +x` applied (GUARD16-D-06, D-07, D-08)
- **Working-tree graphify-out:** NOT checked — dirty working tree allowed (GUARD16-D-13, D-14)

### Task 2: Validation

#### Real repo PASS proof (GUARD16-D-28..D-30)

Both invocations confirmed:

| Invocation | stdout | stderr | exit code |
|------------|--------|--------|-----------|
| `./scripts/check-safety-guards.sh` | `PASS` | (empty) | 0 |
| `bash scripts/check-safety-guards.sh` | `PASS` | (empty) | 0 |

Pre-existing dirty state (graphify-out working-tree changes) correctly allowed:
- `graphify-out/.rebuild.lock`, `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.html`, `graphify-out/graph.json` all dirty in working tree → script returned PASS.

**Non-mutation proof:** `git status --short` before and after both runs was **identical**.

#### /tmp Failure simulations (GUARD16-D-31, D-32)

All simulations run in a disposable `/tmp` git repo with pre-committed tracked files.

| Simulation | Scenario | exit code | Label in stderr | Policy in stderr |
|------------|----------|-----------|-----------------|-----------------|
| SIM 1 | GRAPHIFY_STAGED: `graphify-out/test.txt` staged | 1 | ✅ GRAPHIFY_STAGED | ✅ |
| SIM 2 | PROTECTED_PATH_STAGED: `data/taxonomy/test.json` staged | 1 | ✅ PROTECTED_PATH_STAGED | ✅ |
| SIM 3 | PROTECTED_DIFF: `data/inference/unstaged.json` modified (tracked, unstaged) | 1 | ✅ PROTECTED_DIFF | ✅ |
| SIM 4 | report_all: graphify staged + protected staged + protected diff (all three) | 1 | ✅ GRAPHIFY_STAGED + PROTECTED_PATH_STAGED + PROTECTED_DIFF | ✅ |
| BONUS | Dirty working-tree graphify-out only (not staged) | 0 → PASS | (none) | (none) |

---

## Validation Map Update

| Task ID | Requirement | Status |
|---------|-------------|--------|
| 16-01-01 | Guard script exists and runs non-mutating checks | ✅ green |
| 16-01-02 | Staged Graphify paths are blocked; dirty working tree allowed | ✅ green |
| 16-01-03 | Protected paths staged + working-tree diffs are blocked | ✅ green |
| 16-01-04 | report_all output covers multiple violations; non-mutation proven | ✅ green |

---

## Files Delivered

| File | Action | Notes |
|------|--------|-------|
| `scripts/check-safety-guards.sh` | NEW | Non-mutating local guard script, chmod +x |

## No-Touch Confirmation

- `src/package.json` — not modified ✅
- `src/cli/parse_args.ts` — not modified ✅
- `data/taxonomy/**` — not modified ✅
- `data/inference/**` — not modified ✅
- `data/compiled/v1/**` — not modified ✅
- `data/compiled/v2/**` — not modified ✅
- `graphify-out/**` — not modified ✅
- No package scripts, hooks, unit tests, or CI added ✅

---

*Phase: 16-permanent-safety-guard-implementation*
*Plan: 16-01*
*Completed: 2026-05-26*
