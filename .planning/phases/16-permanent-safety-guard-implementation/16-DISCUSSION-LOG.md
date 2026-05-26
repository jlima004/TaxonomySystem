# Phase 16: permanent-safety-guard-implementation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-26
**Phase:** 16-permanent-safety-guard-implementation
**Areas discussed:** Script path/runtime, Failure text/exit, Validation proof, Command boundaries

---

## Script path/runtime

### Script format

| Option | Description | Selected |
|--------|-------------|----------|
| Shell script | `scripts/check-safety-guards.sh`, no dependencies, calls git directly | ✓ |
| Node script | `scripts/check-safety-guards.mjs` | |
| Planning script | `.planning/scripts/...` | |
| TypeScript script | `src/scripts/...` | |

**User's choice:** Shell script at `scripts/check-safety-guards.sh`.
**Notes:** No Node/TypeScript runtime, no package scripts, hooks or CI, and no `src/package.json` edits.

### Invocation

| Option | Description | Selected |
|--------|-------------|----------|
| Executable file | `./scripts/check-safety-guards.sh` | |
| Run via bash | `bash scripts/check-safety-guards.sh` | |
| Both documented | Support both invocations | ✓ |
| You decide | Agent discretion | |

**User's choice:** Support both executable and bash invocation.
**Notes:** Include shebang, prefer executable bit, and document both forms.

---

## Failure text/exit

### Exit code convention

| Option | Description | Selected |
|--------|-------------|----------|
| 0 pass, 1 fail | Simple shell convention | |
| Typed codes | Different exit codes per failure | |
| 0/1 plus labels | 0/1 with labels in output | ✓ |
| You decide | Agent discretion | |

**User's choice:** Exit `0` on success, `1` on any blocking violation.
**Notes:** Labels include `PASS`, `GRAPHIFY_STAGED`, `PROTECTED_PATH_STAGED`, `PROTECTED_DIFF`, and `NOT_GIT_REPO`.

### Report strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Report all | Run all checks and list all violations | ✓ |
| Fail fast | Stop on first violation | |
| Group staged first | Stage-first grouping | |
| You decide | Agent discretion | |

**User's choice:** Report all violations before exiting.

### Output streams

| Option | Description | Selected |
|--------|-------------|----------|
| Failures stderr | PASS on stdout, violations on stderr | ✓ |
| All stdout | Everything on stdout | |
| Quiet pass | No output on pass | |
| You decide | Agent discretion | |

**User's choice:** PASS on stdout, failures on stderr.

### Failure text detail

| Option | Description | Selected |
|--------|-------------|----------|
| Short policy text | Label + paths + short policy line | ✓ |
| Labels only | Label + paths only | |
| Verbose guidance | Long guidance blocks | |
| You decide | Agent discretion | |

**User's choice:** Short policy text only; no destructive command suggestions or automatic remediation.

---

## Validation proof

### Validation level

| Option | Description | Selected |
|--------|-------------|----------|
| Pass plus simulations | PASS in real repo + failure sims in /tmp | ✓ |
| Pass only | Real repo PASS only | |
| Unit tests | Add versioned tests | |
| You decide | Agent discretion | |

**User's choice:** PASS in real repo plus simulations in disposable `/tmp` repo.

### Non-mutating proof

| Option | Description | Selected |
|--------|-------------|----------|
| Before/after git status | `git status --short` before/after | ✓ |
| Protected diff only | Only protected diff checks | |
| No proof needed | Rely on inspection | |
| You decide | Agent discretion | |

**User's choice:** Use before/after `git status --short` in the real repo.

### /tmp simulations

| Option | Description | Selected |
|--------|-------------|----------|
| Copy real script | Copy and execute real script | ✓ |
| Manual commands | Run equivalent git commands | |
| Both | Script + manual commands | |
| You decide | Agent discretion | |

**User's choice:** Copy and execute the real script in `/tmp`.

### Dirty working tree during validation

| Option | Description | Selected |
|--------|-------------|----------|
| Allow known dirty | Allow preexisting dirty state | ✓ |
| Require clean repo | Clean working tree required | |
| Allow Graphify only | Only graphify-out allowed dirty | |
| You decide | Agent discretion | |

**User's choice:** Allow preexisting dirty state; success means no new changes caused by the script.

---

## Command boundaries

### Authoritative git commands

| Option | Description | Selected |
|--------|-------------|----------|
| Diff name-only | Use `git diff --name-only` | ✓ |
| Exit-code diff | Use `git diff --exit-code` | |
| Git status parse | Parse `git status --short` | |
| You decide | Agent discretion | |

**User's choice:** Use `git diff --name-only` for all guards.
**Notes:**
- Graphify staged: `git diff --cached --name-only -- graphify-out`
- Protected staged: `git diff --cached --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts`
- Protected diff: `git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts`

### Execution root

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-detect root | `git rev-parse --show-toplevel` | ✓ |
| Require repo root | User must run at root | |
| Any repo dir | Run from any dir without root detection | |
| You decide | Agent discretion | |

**User's choice:** Auto-detect repo root, run guards from root, and fail with `NOT_GIT_REPO` outside a git repo.

### Graphify pathspec

| Option | Description | Selected |
|--------|-------------|----------|
| Pathspec graphify-out | Use `graphify-out` pathspec | ✓ |
| Explicit glob | Use `graphify-out/*` | |
| Both (fallback) | Try glob then fallback | |
| You decide | Agent discretion | |

**User's choice:** Use `graphify-out` pathspec (no glob).

### Protected path arguments

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit args | Explicit paths with `--` | ✓ |
| Array variable | Use array variable expansion | |
| You decide | Agent discretion | |

**User's choice:** Explicit path arguments with `--`, one line per path.

---

## the agent's Discretion

None.

## Deferred Ideas

- Package script wrapper after local script behavior is proven.
- Git hook or pre-commit integration after local script behavior is stable.
- CI check after local script behavior and failure text are accepted.
- Docs/help cleanup as a separate phase/front.
- Graphify remediation as a separate generated-artifacts plan.
