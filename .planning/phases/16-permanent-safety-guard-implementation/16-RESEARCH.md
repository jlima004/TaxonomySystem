# Phase 16: Permanent Safety Guard Implementation - Research

**Researched:** 2026-05-26
**Domain:** non-mutating local safety guard shell script (git boundary protection)
**Confidence:** HIGH — scope and commands are locked by `16-CONTEXT.md`, and runtime availability was verified locally with read-only version checks. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md][VERIFIED: git command]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Script path and runtime
- **GUARD16-D-01:** The first implementation is `local script only`.
- **GUARD16-D-02:** Implement as a shell script (no Node/TypeScript runtime).
- **GUARD16-D-03:** Path is `scripts/check-safety-guards.sh`.
- **GUARD16-D-04:** No package script wrapper, hook or CI integration in the first implementation.
- **GUARD16-D-05:** Do not modify `src/package.json`.
- **GUARD16-D-06:** Script must be invokable as `./scripts/check-safety-guards.sh`.
- **GUARD16-D-07:** Script must also work via `bash scripts/check-safety-guards.sh`.
- **GUARD16-D-08:** Include a shebang and prefer executable bit, but support bash invocation if executable bit is missing.

#### Guard behavior
- **GUARD16-D-09:** Script is non-mutating; never clean, revert, regenerate, stage or unstage files.
- **GUARD16-D-10:** Block any staged path under `graphify-out`.
- **GUARD16-D-11:** Block any staged path under `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, or `src/cli/parse_args.ts`.
- **GUARD16-D-12:** Block any working-tree diff under `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, or `src/cli/parse_args.ts`.
- **GUARD16-D-13:** Do not require `graphify-out/*` to be clean in the working tree.
- **GUARD16-D-14:** Dirty `graphify-out/*` in the working tree remains `accepted_with_policy` and must not block unless staged.

#### Exit code and output format
- **GUARD16-D-15:** Exit `0` on success, `1` on any blocking violation.
- **GUARD16-D-16:** Labels required: `PASS`, `GRAPHIFY_STAGED`, `PROTECTED_PATH_STAGED`, `PROTECTED_DIFF`, `NOT_GIT_REPO`.
- **GUARD16-D-17:** Use `report_all` behavior; run all checks, list all violations, then exit `1` if any exist.
- **GUARD16-D-18:** Success message prints `PASS` to stdout.
- **GUARD16-D-19:** Failures print labels + paths to stderr.
- **GUARD16-D-20:** Failures include short policy text; do not suggest destructive commands or automatic remediation.

#### Command boundaries
- **GUARD16-D-21:** Detect repo root via `git rev-parse --show-toplevel` and run guards from root.
- **GUARD16-D-22:** If not in a git repo, print `NOT_GIT_REPO` to stderr and exit `1`.
- **GUARD16-D-23:** Graphify staged guard uses:
  `git diff --cached --name-only -- graphify-out`
- **GUARD16-D-24:** Protected paths staged guard uses:
  `git diff --cached --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts`
- **GUARD16-D-25:** Protected diff guard uses:
  `git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts`
- **GUARD16-D-26:** Use `graphify-out` as pathspec (no glob `graphify-out/*`).
- **GUARD16-D-27:** Use explicit path arguments with `--` (no internal array of paths in the first implementation).

#### Validation proof requirements
- **GUARD16-D-28:** Validate PASS in the real repo by running both `./scripts/check-safety-guards.sh` and `bash scripts/check-safety-guards.sh`.
- **GUARD16-D-29:** Prove non-mutating behavior with `git status --short` before/after in the real repo.
- **GUARD16-D-30:** Preexisting dirty state is allowed; success means no new changes caused by the script.
- **GUARD16-D-31:** Simulate failures in a disposable `/tmp` git repo by copying and executing the real script.
- **GUARD16-D-32:** Simulations must cover `GRAPHIFY_STAGED`, `PROTECTED_PATH_STAGED`, `PROTECTED_DIFF`, and multiple violations for `report_all`.
- **GUARD16-D-33:** No unit tests, package scripts, hooks or CI in the first implementation.

### the agent's Discretion

No additional discretion items were listed in Phase 16 context. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)

- Package script wrapper after local script behavior is proven.
- Git hook or pre-commit integration after local script behavior is stable.
- CI check after local script behavior and failure text are accepted.
- Docs/help cleanup as a separate phase/front.
- Graphify remediation as a separate generated-artifacts plan.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GUARD16-01 | Permanent, non-mutating local guard implementation for Graphify and protected paths. [VERIFIED: .planning/ROADMAP.md][VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | Script shape, boundaries, and behavior are fully specified by GUARD16-D-01..D-33. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| GUARD16-02 | Staged Graphify guard blocks staged `graphify-out/*` without requiring working-tree cleanliness. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | Command and policy are locked (`git diff --cached --name-only -- graphify-out`, report_all, non-mutating). [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| GUARD16-03 | Protected paths staged + working-tree diff guards for data/compiled/CLI boundaries. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | Commands and protected path list are locked in GUARD16-D-11..D-12, D-24..D-25. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| GUARD16-04 | Validation proof includes real repo pass, non-mutation proof, and simulated failures with report_all. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | Proof steps are locked in GUARD16-D-28..D-32 and require /tmp simulation coverage. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
</phase_requirements>

## Summary

Phase 16 is an implementation phase that converts Phase 15 local-proof guards into a permanent, non-mutating local shell script at `scripts/check-safety-guards.sh`, with no package scripts, hooks, or CI integration. The guard must enforce staged Graphify blocking and protected-path staged + working-tree diff blocking, while explicitly allowing a dirty `graphify-out/*` working tree and preserving non-mutating behavior. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

The script behavior, exit codes, labels, and exact git commands are fully specified in `16-CONTEXT.md`, so planning should focus on faithful implementation, report_all aggregation, and validation proofs (real repo pass + /tmp simulations), not alternative guard mechanisms. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

**Primary recommendation:** Implement a minimal bash script that runs the three locked git commands from repo root, aggregates violations for report_all output, and prints only the required labels + policy text, with validation evidence recorded exactly as specified. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

## Project Constraints (from AGENTS.md)

No `AGENTS.md` file exists at the repository root, so no additional project-level directives were found. [VERIFIED: glob AGENTS.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Staged Graphify guard | Git working tree / local developer workflow | — | Reads staged file list and blocks staged Graphify paths; must not mutate. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Protected-path staged guard | Git working tree / local developer workflow | — | Reads staged file list for protected paths and blocks unexpected staging. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Protected-path working-tree diff guard | Git working tree / local developer workflow | — | Reads working-tree diffs for protected paths and blocks unexpected diffs. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Local guard script | Local script execution | — | Implemented as shell script in `scripts/` with no Node/TS runtime. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Validation proof | Phase 16 planning artifacts | Human approval gate | Evidence must show non-mutation and simulated failures before any wrapper/CI. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Bash shell script | GNU bash 5.2.21 (local) | Implement non-mutating local guard script. [VERIFIED: git command] | Context mandates shell script with shebang and bash invocation support. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Git CLI | git 2.54.0 (local) | Read-only staged/working-tree diff checks. [VERIFIED: git command] | All guard commands are specified as git commands. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| /tmp disposable repo | n/a | Simulate failure conditions without mutating real repo. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | Required for GUARD16-D-31..D-32 simulation coverage. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Shell script | Node/TypeScript runtime | Explicitly forbidden by GUARD16-D-02. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Local script only | Package script wrapper / hook / CI | Explicitly deferred and out of scope for first implementation. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

**Installation:** No external packages should be installed for Phase 16. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

## Package Legitimacy Audit

No external packages are recommended or installed for Phase 16. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

## Architecture Patterns

### System Architecture Diagram

```text
Developer runs local guard script
          |
          v
Repo root detection (git rev-parse)
          |
          v
Staged Graphify guard (git diff --cached --name-only -- graphify-out)
          |
          v
Protected paths staged guard (git diff --cached --name-only -- data/taxonomy ... src/cli/parse_args.ts)
          |
          v
Protected paths working-tree diff guard (git diff --name-only -- data/taxonomy ... src/cli/parse_args.ts)
          |
          v
report_all aggregation
  |-- if any violations: print labels + paths + policy text to stderr, exit 1
  |-- if none: print PASS to stdout, exit 0
```

### Recommended Project Structure
```text
scripts/
└── check-safety-guards.sh   # Local, non-mutating guard script
```

### Pattern 1: Report-All Aggregation for Guard Failures
**What:** Run all guard checks and collect all violations before failing. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**When to use:** Always for Phase 16 script; report_all is mandatory. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**Example:**
```bash
# Source: 16-CONTEXT.md GUARD16-D-17
# Pseudocode: run all checks, collect violations, then exit 1 if any exist.
```

### Pattern 2: Separate Graphify Staging Guard From Protected Path Guards
**What:** Keep Graphify staged guard distinct from protected paths staged/diff guards to avoid mixing policy. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**When to use:** Always; Graphify working-tree dirtiness must not block unless staged. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

### Anti-Patterns to Avoid
- **Auto-remediation:** Never clean, revert, regenerate, stage or unstage files. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
- **Working-tree Graphify blocking:** Dirty `graphify-out/*` in the working tree must not fail unless staged. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
- **Switching runtimes:** Do not use Node/TS; shell script only. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Staged Graphify detection | Custom filesystem scanning | `git diff --cached --name-only -- graphify-out` | Command is locked and matches staging boundary guard behavior. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Protected path staged detection | Custom git index parsing | `git diff --cached --name-only -- data/taxonomy ... src/cli/parse_args.ts` | Exact command is mandated. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Protected path working-tree detection | Custom file diff tool | `git diff --name-only -- data/taxonomy ... src/cli/parse_args.ts` | Exact command is mandated. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

**Key insight:** The safest implementation is a thin shell wrapper around the three locked git commands, with report_all aggregation and non-mutating policy text only. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

## Runtime State Inventory

This is not a rename/refactor/migration phase, so runtime state inventory is omitted. [VERIFIED: user phase_scope]

## Common Pitfalls

### Pitfall 1: Blocking on Dirty Graphify Working Tree
**What goes wrong:** The script fails when `graphify-out/*` is dirty in the working tree. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**Why it happens:** Confusing staging guard policy with working-tree policy. [ASSUMED]
**How to avoid:** Only block staged Graphify paths; allow dirty working tree. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**Warning signs:** Script checks `git status --short -- graphify-out` or treats untracked/modified Graphify files as blocking. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

### Pitfall 2: Partial Output (Not report_all)
**What goes wrong:** Script exits early after the first violation, hiding additional violations. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**Why it happens:** Typical guard patterns short-circuit on first failure. [ASSUMED]
**How to avoid:** Collect violations from all checks and exit once. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**Warning signs:** Only one label is ever printed even when multiple violations exist. [ASSUMED]

### Pitfall 3: Running Outside Repo Root
**What goes wrong:** Guard commands run in a subdirectory, producing incorrect pathspec results. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**Why it happens:** Script doesn't normalize to repo root. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**How to avoid:** Resolve root with `git rev-parse --show-toplevel` and run from there. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
**Warning signs:** Pathspec errors or missing detections when run from nested directories. [ASSUMED]

## Code Examples

Verified command patterns from Phase 16 context:

### Graphify Staged Guard
```bash
# Source: 16-CONTEXT.md GUARD16-D-23
git diff --cached --name-only -- graphify-out
```

### Protected Paths Staged Guard
```bash
# Source: 16-CONTEXT.md GUARD16-D-24
git diff --cached --name-only -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

### Protected Paths Working-Tree Diff Guard
```bash
# Source: 16-CONTEXT.md GUARD16-D-25
git diff --name-only -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Phase 15 proof-only guards | Phase 16 permanent local shell script guard | Phase 16 context (2026-05-26) | Converts proof into a durable, local non-mutating implementation. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

**Deprecated/outdated:** No deprecated libraries or APIs in scope. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Short-circuiting on first failure is a common guard pattern that could hide violations. | Common Pitfalls | Low; report_all requirement mitigates. |
| A2 | Pathspec errors or missed detections are likely if not running at repo root. | Common Pitfalls | Low; GUARD16-D-21 mandates root normalization. |

## Open Questions (RESOLVED)

1. **Failure policy text placement** — RESOLVED: Use a single shared short policy line printed after all violations (applies to every label) to keep output brief while meeting GUARD16-D-20. Avoid any destructive or automatic remediation guidance. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Git CLI | All guard checks | ✓ | 2.54.0 | None; git commands are the guard mechanism. [VERIFIED: git command] |
| Bash | Script runtime | ✓ | 5.2.21 | Invoke with `bash` even if executable bit is missing. [VERIFIED: git command][VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

**Missing dependencies with no fallback:** none identified for Phase 16. [VERIFIED: git command]
**Missing dependencies with fallback:** none identified for Phase 16. [VERIFIED: git command]

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Local proof only; no unit test framework is required for first implementation. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Config file | None required. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Quick run command | `./scripts/check-safety-guards.sh` and `bash scripts/check-safety-guards.sh` [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Full suite command | Run the real repo pass checks plus /tmp simulations; no compile/test/build. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GUARD16-01 | Local script exists and runs non-mutating guard checks. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | local proof | `./scripts/check-safety-guards.sh` + `bash scripts/check-safety-guards.sh` | ❌ Wave 0 (script not yet created) |
| GUARD16-02 | Staged Graphify paths are blocked. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | /tmp simulation | `git diff --cached --name-only -- graphify-out` | ❌ Wave 0 |
| GUARD16-03 | Protected staged + working-tree diffs are blocked. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | /tmp simulation | `git diff --cached --name-only -- data/taxonomy ... src/cli/parse_args.ts` and `git diff --name-only -- data/taxonomy ... src/cli/parse_args.ts` | ❌ Wave 0 |
| GUARD16-04 | report_all output and non-mutation evidence recorded. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] | local proof + /tmp simulation | Real repo runs + /tmp multiple-violation scenario | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** Not applicable; script is small and validated by local proof. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
- **Per wave merge:** Run real repo pass plus /tmp simulations once after script creation. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
- **Phase gate:** Full validation evidence recorded with non-mutation proof and report_all coverage. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]

### Wave 0 Gaps
- [ ] `scripts/check-safety-guards.sh` — guard implementation script.
- [ ] Local proof evidence: real repo PASS for both invocations + before/after `git status --short`.
- [ ] /tmp repo simulations for `GRAPHIFY_STAGED`, `PROTECTED_PATH_STAGED`, `PROTECTED_DIFF`, and multiple violations.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth surface in this phase. [VERIFIED: user phase_scope] |
| V3 Session Management | no | No session surface in this phase. [VERIFIED: user phase_scope] |
| V4 Access Control | yes | Guard enforces staging/working-tree boundary and prevents protected-path mutations from being committed. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| V5 Input Validation | yes | Validate non-empty output from git commands to determine violations. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| V6 Cryptography | no | No cryptography surface in this phase. [VERIFIED: user phase_scope] |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Accidental staging of protected artifacts | Tampering | Block staged paths via `git diff --cached --name-only` on protected boundary. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Generated artifact commit contamination | Tampering | Block staged `graphify-out` while allowing dirty working tree. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |
| Hidden violations due to early exit | Repudiation | report_all behavior with aggregate reporting. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md` — canonical decisions for script path, behavior, commands, and validation proof. [VERIFIED: read]
- `.planning/phases/16-permanent-safety-guard-implementation/16-PREFLIGHT.md` — authorized boundaries and protected paths. [VERIFIED: read]
- `.planning/ROADMAP.md` — Phase 16 goal and requirement IDs. [VERIFIED: read]
- `.planning/STATE.md` — Phase status and scope constraints. [VERIFIED: read]
- Local runtime checks: `git --version`, `bash --version`. [VERIFIED: git command]

### Secondary (MEDIUM confidence)
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-VALIDATION.md` — prior guard validation patterns used as reference. [VERIFIED: read]

### Tertiary (LOW confidence)
- Assumptions listed in the Assumptions Log. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — mandated by Phase 16 context and verified runtime availability. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md][VERIFIED: git command]
- Architecture: HIGH — guard boundaries and commands are locked; only script wrapping remains. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md]
- Pitfalls: MEDIUM — pitfalls are derived from context but causal explanations are partially assumed. [VERIFIED: .planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md][ASSUMED]

**Research date:** 2026-05-26
**Valid until:** 2026-06-02 or until Phase 16 context decisions change, whichever comes first. [ASSUMED]
