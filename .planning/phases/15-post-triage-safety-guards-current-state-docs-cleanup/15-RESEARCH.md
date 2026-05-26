# Phase 15: Post-Triage Safety Guards & Current-State Docs Cleanup - Research

**Researched:** 2026-05-26  
**Domain:** non-mutating git boundary guards and Phase 15 planning controls  
**Confidence:** HIGH — scope and commands are locked by `15-CONTEXT.md`; current local status was checked with read-only git commands. [VERIFIED: .planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md][VERIFIED: git commands]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Phase Priority And Execution Boundary

- `SAFE-D-01`: Phase 15 should prioritize `Safety automation guards` first.
- `SAFE-D-02`: The first safety guard planning front should stay non-mutating and operationally protective.
- `SAFE-D-03`: Docs/help current-state cleanup remains eligible, but should not be mixed into the first safety guard plan unless explicitly approved later.
- `SAFE-D-04`: If both safety automation and docs/help cleanup proceed in Phase 15, they should be separated into distinct plans.
- `SAFE-D-05`: Phase 15 remains `not_ready_for_execution` until research/pattern/validation/plan artifacts are explicitly authorized and created in a later step.
- `SAFE-D-06`: No taxonomy curation, descriptor promotion, alias add/remove/remap, relation/accord edit, official artifact mutation, `DEFAULT_PATHS` change, Graphify mutation, compile/smoke, safety implementation or docs/help fix is authorized by this context capture.

#### First Safety Guard Subset

The first safety guard subset Phase 15 should plan is `Protected boundary guards`: a protected diff guard plus a separate Graphify staging/contamination guard. Defaults/fallback guards and tmp-only compile guard are deferred from the first front.

#### Protected Diff Guard

- `SAFE-D-07`: The protected diff guard initial boundary is the full Phase 14 boundary.
- `SAFE-D-08`: The protected diff boundary includes `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2` and `src/cli/parse_args.ts`.
- `SAFE-D-09`: Taxonomy inputs and inference inputs must not be excluded from the first protected diff guard.
- `SAFE-D-10`: The protected diff guard must not include `graphify-out/*`; Graphify is handled by a separate staging/contamination guard.
- `SAFE-D-11`: The protected diff guard is non-mutating and must not clean, revert, stage, compile, smoke-test or alter files.

Command-base expected for planning:

```bash
git diff --exit-code -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

#### Graphify Staging Guard

- `SAFE-D-12`: The Graphify staging guard initial behavior is `report_and_fail`.
- `SAFE-D-13`: Any status line for `graphify-out/*` must make the guard fail/report potential commit contamination.
- `SAFE-D-14`: The Graphify guard must not clean, revert, stage, commit, regenerate Graphify, alter hooks or alter `.gitignore`.
- `SAFE-D-15`: Dirty Graphify state is a commit-contamination risk, not taxonomy correctness evidence.
- `SAFE-D-16`: Any corrective Graphify action requires a separate generated-artifact plan with explicit allowlist and diff policy.

Command-base expected for planning:

```bash
git status --short -- graphify-out
```

Success criterion: empty output for `graphify-out/*`.

Failure criterion: any line for `graphify-out/*`, including modified or untracked paths.

Expected failure message should explain that `graphify-out/*` is dirty, the guard will not clean or revert it, Graphify can only be handled by an explicit generated-artifact plan, and the finding is commit hygiene risk rather than taxonomy evidence.

#### First-Front Validation Policy

- `SAFE-D-17`: The first protected boundary guards plan should use `local_proof_only` validation.
- `SAFE-D-18`: Local proof must record exact commands, exit codes, relevant stdout/stderr and expected failure messages.
- `SAFE-D-19`: Versioned unit tests are not mandatory for the first protected boundary guard plan.
- `SAFE-D-20`: Unit tests may be considered later if these guards become permanent scripts or CI integration.
- `SAFE-D-21`: Local proof must confirm no compile/smoke command was run and no protected paths or `graphify-out/*` were modified, cleaned, reverted, staged, committed or regenerated.

### the agent's Discretion

- Research/planning must decide how to represent the two guards minimally: shell commands in a planning artifact, a small local script, a package script, or another low-risk mechanism.
- Research/planning must define the exact failure text and local proof artifact for the first plan.

### Deferred Ideas (OUT OF SCOPE)

- Defaults/fallback assertions, tmp-only compile guard and docs/help cleanup remain possible later fronts, but are not part of the first protected boundary guard plan.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SAFETY-01 | Protected diff and Graphify staging guard from the Phase 14 safety shortlist. [VERIFIED: .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md] | Supported by the two locked guard commands and non-mutating artifact shape below. [VERIFIED: .planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md] |
| SAFETY-02 | Tmp-only compile guard candidate. [VERIFIED: .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-SAFETY-AUTOMATION-SHORTLIST.md] | Deferred/out-of-scope for 15-01 because SAFE-D-17 selects `local_proof_only` and SAFE-D-06/SAFE-D-21 exclude compile/smoke for the first front. [VERIFIED: .planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md] |
| SAFETY-03 | `DEFAULT_PATHS` v2 and explicit v1 fallback assertion candidate. [VERIFIED: .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-SAFETY-AUTOMATION-SHORTLIST.md] | Deferred/out-of-scope for 15-01 because SAFE-D-75 context text defers defaults/fallback guards from the first front and protects `src/cli/parse_args.ts` as read-only. [VERIFIED: .planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md][VERIFIED: src/cli/parse_args.ts] |
| DOCS-01 | Current-state docs/help inconsistency shortlist. [VERIFIED: .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md] | Deferred/out-of-scope for 15-01 because SAFE-D-03 and SAFE-D-04 require docs/help cleanup to stay separate unless explicitly approved later. [VERIFIED: .planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md] |
</phase_requirements>

## Summary

Plan 15-01 should be a narrow planning/proof artifact for two read-only guards: a protected diff guard over the full Phase 14 boundary, and a separate Graphify staging guard using `report_and_fail`. [VERIFIED: 15-CONTEXT.md] The first plan must not implement scripts, package scripts, hooks, CI jobs, source edits, data edits, compiled artifact changes, Graphify cleanup, docs/help fixes, compile/smoke validation, staging, commits, or any file mutation outside Phase 15 planning artifacts. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope]

The protected diff guard currently passes locally with empty output and exit code 0 for `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts`. [VERIFIED: git command] The Graphify staging guard currently reports modified files under `graphify-out/*`, so its planned behavior should be fail/report rather than clean/revert. [VERIFIED: git command]

**Primary recommendation:** Plan 15-01 as `local_proof_only`: record exact shell commands, expected exit codes, current observed outputs, acceptance criteria, and explicit no-mutation/no-compile/no-smoke assertions; do not create runnable automation until a later explicit approval. [VERIFIED: 15-CONTEXT.md]

## Scope Summary And Hard Exclusions

### In Scope For 15-01 Planning

- Protected diff guard command over `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, and `src/cli/parse_args.ts`. [VERIFIED: 15-CONTEXT.md]
- Separate Graphify staging guard command over `graphify-out`. [VERIFIED: 15-CONTEXT.md]
- `report_and_fail` behavior for Graphify dirtiness. [VERIFIED: 15-CONTEXT.md]
- Local proof record with commands, exit codes, stdout/stderr, expected failure text, and no-mutation assertions. [VERIFIED: 15-CONTEXT.md]
- Phase 15 planning artifact creation only. [VERIFIED: user phase_scope]

### Hard Exclusions For 15-01 Planning

- No safety automation implementation, scripts, hooks, CI/release automation, or package script changes. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope]
- No compile/smoke commands. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope]
- No docs/help fixes. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope]
- No curation, descriptor promotion, alias add/remove/remap, relation/accord edits, official artifact mutation, or `DEFAULT_PATHS` change. [VERIFIED: 15-CONTEXT.md]
- No changes in protected paths: `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, `src/cli/parse_args.ts`. [VERIFIED: 15-CONTEXT.md]
- No changes in `graphify-out/*`. [VERIFIED: 15-CONTEXT.md]
- No mutation outside Phase 15 planning artifacts. [VERIFIED: user phase_scope]

## Project Constraints (from AGENTS.md)

No `AGENTS.md` file exists at the repository root, so no additional project-level AGENTS directives were found. [VERIFIED: glob AGENTS.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Protected diff guard | Git working tree / local developer workflow | Phase planning artifacts | The guard reads repository diff state and must not mutate source/data/artifacts. [VERIFIED: 15-CONTEXT.md] |
| Graphify staging guard | Git working tree / local developer workflow | Generated-artifact policy | The guard reads `graphify-out` status and reports commit-contamination risk without interpreting taxonomy correctness. [VERIFIED: 15-CONTEXT.md] |
| Local proof record | Phase 15 planning docs | Human approval gate | The first front is proof-only and becomes executable only after explicit validation/approval. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope] |
| Docs/help cleanup | Deferred planning front | Documentation tier | Docs/help cleanup is explicitly separate unless later approved. [VERIFIED: 15-CONTEXT.md] |

## Standard Stack

### Core

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `git diff --exit-code` | Repository git installation, exact version not required for plan | Detect unstaged/uncommitted differences in protected paths without modifying files. [VERIFIED: git command] | Existing Phase 14 validation already used protected diff checks for the same boundary. [VERIFIED: 14-VALIDATION.md] |
| `git status --short -- graphify-out` | Repository git installation, exact version not required for plan | Detect Graphify output dirtiness as commit-contamination risk without modifying files. [VERIFIED: git command] | Existing Phase 14 and Phase 15 policy separates Graphify from taxonomy correctness and forbids cleanup/revert in this front. [VERIFIED: 14-VALIDATION.md][VERIFIED: 15-CONTEXT.md] |
| Markdown planning artifact | n/a | Store local proof contract and acceptance criteria. [VERIFIED: user phase_scope] | Phase 15 is not executable yet; planning artifacts are the only permitted mutation target. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope] |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Existing Vitest tests | `^3.2.0` in `src/package.json` | Pattern reference for future permanent tests. [VERIFIED: src/package.json] | Not mandatory for 15-01; consider later only if guards become permanent scripts or CI integration. [VERIFIED: 15-CONTEXT.md] |
| Existing TypeScript scripts | `typescript ^5.8.0` in `src/package.json` | Project build/test context. [VERIFIED: src/package.json] | Do not run for 15-01 local proof because compile/smoke/typecheck are out of scope for this front. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline commands in planning artifact | Small shell script | Script implementation is out of scope for the first front and would mutate source/planning shape beyond proof-only. [VERIFIED: 15-CONTEXT.md] |
| Inline commands in planning artifact | `package.json` script | Would edit `src/package.json`; first front does not authorize safety implementation or package script mutation. [VERIFIED: 15-CONTEXT.md][VERIFIED: src/package.json] |
| Local proof only | Vitest unit tests | Tests may be considered later; they are not mandatory for the first protected boundary plan. [VERIFIED: 15-CONTEXT.md] |

**Installation:** No external packages should be installed for 15-01. [VERIFIED: 15-CONTEXT.md]

## Package Legitimacy Audit

No external packages are recommended or installed for this first plan. [VERIFIED: 15-CONTEXT.md]

## Concrete Guard Commands And Behaviors

### Protected Diff Guard

**Command:** [VERIFIED: 15-CONTEXT.md]

```bash
git diff --exit-code -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

**Expected pass behavior:** exit code 0 and no stdout/stderr when protected paths are unchanged. [VERIFIED: git command]  
**Expected fail behavior:** non-zero exit code with diff output when any protected path differs from the repository baseline. [ASSUMED]  
**Guard must not:** clean, revert, stage, compile, smoke-test, edit paths, or interpret taxonomy quality. [VERIFIED: 15-CONTEXT.md]

**Observed during research:** command returned no output and passed for the protected boundary. [VERIFIED: git command]

### Graphify Staging Guard

**Command:** [VERIFIED: 15-CONTEXT.md]

```bash
git status --short -- graphify-out
```

**Expected pass behavior:** empty output for `graphify-out/*`. [VERIFIED: 15-CONTEXT.md]  
**Expected fail/report behavior:** any output line for `graphify-out/*` fails the guard and reports potential commit contamination. [VERIFIED: 15-CONTEXT.md]  
**Required failure message seed:** `graphify-out/* is dirty. This guard is report_and_fail only: it will not clean, revert, stage, commit, regenerate Graphify, alter hooks, or alter .gitignore. Treat this as commit hygiene risk, not taxonomy correctness evidence. Corrective Graphify action requires a separate generated-artifact plan with explicit allowlist and diff policy.` [VERIFIED: 15-CONTEXT.md]

**Observed during research:** `git status --short -- graphify-out` reported modified `graphify-out/.rebuild.lock`, `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.html`, and `graphify-out/graph.json`; therefore a planned Graphify guard should currently fail/report and not remediate. [VERIFIED: git command]

## Recommended Artifact / Implementation Shape

For 15-01, use a documentation-only plan plus a local proof evidence section; do not create scripts, tests, hooks, package scripts, CI config, or source/data/artifact changes. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope]

Recommended plan artifact shape: [VERIFIED: 15-CONTEXT.md]

```text
.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/
├── 15-RESEARCH.md       # this research artifact
├── 15-01-PLAN.md        # future plan: proof-only protected boundary guards
└── 15-01-PROOF.md       # optional future local proof record if explicitly approved
```

The future plan should be executable only after explicit validation/approval and should require a preflight statement that no compile/smoke, safety implementation, docs/help fix, protected path change, or Graphify mutation is authorized. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope]

## Architecture Patterns

### System Architecture Diagram

```text
Developer / planner runs local proof commands
          |
          v
Read-only git protected diff guard
          |-- pass: no protected boundary diff -> record command/output/exit code
          |-- fail: protected diff found -> stop; report unexpected protected mutation
          |
          v
Read-only git Graphify staging guard
          |-- pass: empty graphify status -> record clean commit hygiene
          |-- fail: graphify-out status lines -> report_and_fail; do not clean/revert
          |
          v
Phase 15 proof artifact / acceptance criteria
          |
          v
Human validation/approval gate before any executable automation
```

### Recommended Project Structure

```text
.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/
├── 15-CONTEXT.md        # locked decisions SAFE-D-01..SAFE-D-21
├── 15-PREFLIGHT.md      # non-executable preflight boundary
├── 15-RESEARCH.md       # this research output
└── 15-01-PLAN.md        # future proof-only plan, if approved
```

### Pattern 1: Read-only Git Guard As Local Proof

**What:** Use git read-only status/diff commands to prove boundaries are clean or contaminated without changing the working tree. [VERIFIED: 14-VALIDATION.md][VERIFIED: 15-CONTEXT.md]  
**When to use:** Use before and after any future plan that could accidentally touch protected paths, but for 15-01 record only proof and behavior. [VERIFIED: 15-CONTEXT.md]

### Pattern 2: Separate Taxonomy Boundary From Graphify Hygiene

**What:** Keep protected taxonomy/default diff and Graphify staging checks as separate commands with separate interpretation. [VERIFIED: 15-CONTEXT.md]  
**When to use:** Use when Graphify dirtiness exists or may exist, because Graphify status is commit hygiene risk rather than taxonomy correctness evidence. [VERIFIED: 15-CONTEXT.md]

### Anti-Patterns to Avoid

- **Combining Graphify with protected taxonomy diff:** Graphify is explicitly excluded from the protected diff guard and handled separately. [VERIFIED: 15-CONTEXT.md]
- **Auto-cleaning dirty Graphify outputs:** The Graphify guard must report and fail only; cleanup needs a separate generated-artifact plan. [VERIFIED: 15-CONTEXT.md]
- **Turning proof into implementation too early:** Scripts/tests/package scripts are not authorized for 15-01. [VERIFIED: 15-CONTEXT.md]
- **Running compile/smoke as evidence:** Compile/smoke commands are explicitly out of scope for the first front. [VERIFIED: 15-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detecting protected path changes | Custom file hashing or recursive scanners | `git diff --exit-code -- <paths>` | The project already uses git protected diff checks in Phase 14 validation. [VERIFIED: 14-VALIDATION.md] |
| Detecting Graphify commit contamination | Custom directory walk or cleanup tool | `git status --short -- graphify-out` | Phase 15 locked this exact command-base and behavior. [VERIFIED: 15-CONTEXT.md] |
| Remediating generated artifact dirtiness | Auto-clean/revert/regenerate behavior | Report-only failure plus separate artifact plan | SAFE-D-14 and SAFE-D-16 forbid cleanup/revert/regeneration in this front. [VERIFIED: 15-CONTEXT.md] |

**Key insight:** 15-01 is a control-plane proof plan, not an implementation plan; the safest artifact is a precise command/evidence contract that refuses mutation. [VERIFIED: 15-CONTEXT.md]

## Runtime State Inventory

This is not a rename/refactor/migration phase, so runtime state inventory is omitted. [VERIFIED: user phase_scope]

## Common Pitfalls

### Pitfall 1: Treating Graphify Dirtiness As Taxonomy Evidence

**What goes wrong:** A dirty `graphify-out/*` status is misread as taxonomy correctness failure. [VERIFIED: 15-CONTEXT.md]  
**Why it happens:** Generated artifacts live in the repository and can appear alongside real source/data changes. [ASSUMED]  
**How to avoid:** Keep the Graphify guard separate and label failures as commit-contamination risk only. [VERIFIED: 15-CONTEXT.md]  
**Warning signs:** Plan language proposes curation, artifact regeneration, Graphify cleanup, or taxonomy conclusions based only on `graphify-out` status. [VERIFIED: 15-CONTEXT.md]

### Pitfall 2: Shrinking The Protected Boundary

**What goes wrong:** Taxonomy inputs or inference inputs are omitted to make the first guard smaller. [VERIFIED: 15-CONTEXT.md]  
**Why it happens:** The first plan appears operational rather than data-facing. [ASSUMED]  
**How to avoid:** Use the full Phase 14 boundary exactly: `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, `src/cli/parse_args.ts`. [VERIFIED: 15-CONTEXT.md]

### Pitfall 3: Running Extra Validation

**What goes wrong:** Planner adds typecheck, tests, build, compile, smoke, or tmp-only compile proof. [VERIFIED: 15-CONTEXT.md]  
**Why it happens:** Prior phases used richer validation, and existing scripts exist in `src/package.json`. [VERIFIED: src/package.json]  
**How to avoid:** For 15-01, use `local_proof_only` with exact guard commands and explicit no-compile/no-smoke assertions. [VERIFIED: 15-CONTEXT.md]

## Code Examples

Verified command patterns from project artifacts:

### Protected Boundary Check

```bash
# Source: 15-CONTEXT.md SAFE-D-07..SAFE-D-11
git diff --exit-code -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

### Graphify Report-And-Fail Check

```bash
# Source: 15-CONTEXT.md SAFE-D-12..SAFE-D-16
git status --short -- graphify-out
```

### Current `DEFAULT_PATHS` Reference Only

`src/cli/parse_args.ts` currently sets v2 defaults for seed, relations, accords, output directory, and version; this file is read-only/protected for 15-01 and must not be edited. [VERIFIED: src/cli/parse_args.ts][VERIFIED: 15-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Phase 14 report-only candidate guards | Phase 15 first front plans protected diff + Graphify staging guards only | Phase 15 context, 2026-05-26 | Planner can convert shortlist rows into a proof-only plan without implementation. [VERIFIED: 15-CONTEXT.md][VERIFIED: 14-SAFETY-AUTOMATION-SHORTLIST.md] |
| v2 candidate/default separation | v2 is current default and `DEFAULT_PATHS` point to v2 | Phase 12/13 state | 15-01 protects the post-switch boundary but does not change defaults. [VERIFIED: .planning/STATE.md][VERIFIED: src/cli/parse_args.ts] |
| Combined hygiene/validation gates | Separate taxonomy protected diff and Graphify staging guard | Phase 15 context | Graphify dirtiness fails as commit hygiene, not as taxonomy evidence. [VERIFIED: 15-CONTEXT.md] |

**Deprecated/outdated:** No deprecated libraries or external APIs are involved in 15-01. [VERIFIED: 15-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `git diff --exit-code` fail behavior emits diff output for changed protected paths. | Concrete Guard Commands And Behaviors | Low; planner can validate locally during proof recording. |
| A2 | Generated artifacts can appear alongside real source/data changes and cause confusion. | Common Pitfalls | Low; existing Graphify policy already treats this as commit hygiene risk. |
| A3 | The first plan appears operational rather than data-facing, which could tempt boundary shrinkage. | Common Pitfalls | Medium; mitigated by copying SAFE-D-07..SAFE-D-10 verbatim into plan constraints. |

## Open Questions (RESOLVED)

1. **RESOLVED: Should 15-01 create a separate `15-01-PROOF.md` artifact or embed proof in `15-01-PLAN.md`?**
   - What we know: local proof must record commands, exit codes, stdout/stderr, and no-mutation assertions. [VERIFIED: 15-CONTEXT.md]
   - What's unclear: exact proof artifact filename is not locked. [VERIFIED: 15-CONTEXT.md]
   - Resolution: 15-01 will not create `15-01-PROOF.md` unless separately approved; evidence is recorded in the executor response or summary only if the execution workflow requires it. [VERIFIED: 15-01-PLAN.md]

2. **RESOLVED: Should current dirty Graphify status block planning?**
   - What we know: dirty Graphify currently exists and the guard should report_and_fail rather than clean/revert. [VERIFIED: git command][VERIFIED: 15-CONTEXT.md]
   - What's unclear: whether the planner wants 15-01 acceptance to expect current failure or require later clean state before execution. [ASSUMED]
   - Resolution: Dirty `graphify-out/*` status does not block planning; it is expected to `report_and_fail` without remediation if the guard is executed while dirty. [VERIFIED: 15-CONTEXT.md][VERIFIED: 15-01-PLAN.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Git working tree | Protected diff guard and Graphify staging guard | ✓ | not recorded | None; git commands are the guard mechanism. [VERIFIED: git command] |
| Node/npm/Vitest | Future tests only, not 15-01 | Present in project metadata | `vitest ^3.2.0`, `typescript ^5.8.0` in package metadata | Not needed for local_proof_only. [VERIFIED: src/package.json][VERIFIED: 15-CONTEXT.md] |

**Missing dependencies with no fallback:** none identified for 15-01. [VERIFIED: git command]  
**Missing dependencies with fallback:** none identified for 15-01. [VERIFIED: git command]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Local proof only; Vitest exists but is not mandatory for 15-01. [VERIFIED: 15-CONTEXT.md][VERIFIED: src/package.json] |
| Config file | `src/package.json` scripts exist; no new config needed. [VERIFIED: src/package.json] |
| Quick run command | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` [VERIFIED: 15-CONTEXT.md] |
| Full suite command | No compile/test/smoke suite for 15-01; run both local proof commands and record outputs. [VERIFIED: 15-CONTEXT.md] |

### Exact Proof Commands

| Proof | Command | Expected Evidence To Record | Expected Result |
|-------|---------|-----------------------------|-----------------|
| Protected boundary diff | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` | command, exit code, stdout, stderr, timestamp, assertion that no cleanup/revert/stage/compile/smoke occurred | Pass if exit code 0 and no output; fail if protected diff appears. [VERIFIED: 15-CONTEXT.md][VERIFIED: git command] |
| Graphify staging guard | `git status --short -- graphify-out` | command, exit code, stdout lines, stderr, expected failure message when output is non-empty | Pass if empty output; report_and_fail if any line appears. [VERIFIED: 15-CONTEXT.md][VERIFIED: git command] |
| Non-mutation assertion | `git status --short -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts graphify-out` | command, exit code, stdout, explicit note that Graphify lines are not remediated | Protected paths must remain clean; Graphify lines, if present, are commit hygiene findings only. [VERIFIED: git command][VERIFIED: 15-CONTEXT.md] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| SAFETY-01 | Protected diff and Graphify staging guards are specified and proofed locally. [VERIFIED: REQUIREMENTS.md][VERIFIED: ROADMAP.md] | local proof | guarded commands above | ✅ commands specified in `15-CONTEXT.md` |
| SAFETY-02 | Tmp-only compile guard remains deferred. [VERIFIED: 14-SAFETY-AUTOMATION-SHORTLIST.md] | exclusion proof | record `NO COMPILE/SMOKE RUN` assertion | ✅ exclusion specified in `15-CONTEXT.md` |
| SAFETY-03 | Defaults/fallback assertions remain deferred and `src/cli/parse_args.ts` remains protected. [VERIFIED: 15-CONTEXT.md][VERIFIED: src/cli/parse_args.ts] | exclusion proof | protected diff command includes `src/cli/parse_args.ts` | ✅ source file exists |
| DOCS-01 | Docs/help cleanup remains separate and out of 15-01. [VERIFIED: 15-CONTEXT.md] | exclusion proof | plan hard-exclusion checklist | ✅ deferred by context |

### Sampling Rate

- **Before plan approval:** run no commands that mutate; planner records intended local proof commands. [VERIFIED: user phase_scope]
- **During local proof after explicit approval:** run protected diff once and Graphify staging guard once; record exact outputs and exit codes. [VERIFIED: 15-CONTEXT.md]
- **Phase gate:** confirm no compile/smoke command was run and no protected paths or `graphify-out/*` were modified, cleaned, reverted, staged, committed or regenerated. [VERIFIED: 15-CONTEXT.md]

### Wave 0 Gaps

- [ ] `15-01-PLAN.md` — should seed the exact commands, failure messages, hard exclusions, and acceptance criteria. [VERIFIED: user phase_scope]
- [ ] Optional `15-01-PROOF.md` — only if explicit approval prefers a separate proof artifact. [ASSUMED]
- [ ] No test framework installation or package changes. [VERIFIED: 15-CONTEXT.md]

### Explicit No-Compile / No-Smoke / No-Mutation Assertions

- The first plan must state: `No compile/smoke command was run for 15-01 local proof.` [VERIFIED: 15-CONTEXT.md]
- The first plan must state: `No protected paths were modified, cleaned, reverted, staged, committed, or regenerated.` [VERIFIED: 15-CONTEXT.md]
- The first plan must state: `No graphify-out/* files were modified, cleaned, reverted, staged, committed, or regenerated by the guard.` [VERIFIED: 15-CONTEXT.md]
- The first plan must state: `Graphify dirtiness, if observed, is commit hygiene risk only and not taxonomy correctness evidence.` [VERIFIED: 15-CONTEXT.md]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth surface in 15-01. [VERIFIED: user phase_scope] |
| V3 Session Management | no | No session surface in 15-01. [VERIFIED: user phase_scope] |
| V4 Access Control | yes | Hard allowlist: only Phase 15 planning artifacts may be written; protected paths and Graphify outputs must not be mutated. [VERIFIED: user phase_scope][VERIFIED: 15-CONTEXT.md] |
| V5 Input Validation | yes | Validate guard output interpretation: empty vs non-empty Graphify status; zero vs non-zero protected diff. [VERIFIED: 15-CONTEXT.md] |
| V6 Cryptography | no | No cryptographic surface in 15-01. [VERIFIED: user phase_scope] |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Accidental protected data/default mutation | Tampering | Protected diff command over full Phase 14 boundary. [VERIFIED: 15-CONTEXT.md] |
| Generated artifact commit contamination | Tampering / Repudiation | Separate Graphify status guard with report_and_fail and no cleanup/revert. [VERIFIED: 15-CONTEXT.md] |
| Scope creep into implementation/docs/compile | Elevation of privilege / Tampering | Explicit approval gate and hard exclusions in plan acceptance criteria. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope] |

## Planner Constraints, Risks, And Acceptance Criteria Seeds

### Planner Constraints

- The plan must remain non-mutating and only become executable after explicit validation/approval. [VERIFIED: user phase_scope]
- The only write target for this research front is `15-RESEARCH.md`; future plan writes must be Phase 15 planning artifacts only. [VERIFIED: user phase_scope]
- The plan must not stage or commit files. [VERIFIED: user phase_scope]
- The plan must not alter source, data, compiled artifacts, `graphify-out/*`, docs/help, or git state. [VERIFIED: user phase_scope]

### Risks

- Current `graphify-out/*` dirtiness means the Graphify guard is expected to report/fail if run now. [VERIFIED: git command]
- A planner may incorrectly treat dirty Graphify output as a reason to clean/revert; SAFE-D-14 forbids that. [VERIFIED: 15-CONTEXT.md]
- A planner may add compile/smoke/typecheck/tests because package scripts exist; SAFE-D-17..SAFE-D-21 require local proof only for the first front. [VERIFIED: src/package.json][VERIFIED: 15-CONTEXT.md]

### Acceptance Criteria Seeds

- AC-1: Plan includes the protected diff command exactly over `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, and `src/cli/parse_args.ts`. [VERIFIED: 15-CONTEXT.md]
- AC-2: Plan includes the Graphify command exactly as `git status --short -- graphify-out` and behavior `report_and_fail`. [VERIFIED: 15-CONTEXT.md]
- AC-3: Plan states Graphify non-empty output fails as commit hygiene risk and triggers no cleanup/revert/regeneration. [VERIFIED: 15-CONTEXT.md]
- AC-4: Plan includes local proof evidence fields: command, exit code, stdout, stderr, expected failure message, and no-mutation assertion. [VERIFIED: 15-CONTEXT.md]
- AC-5: Plan explicitly excludes safety implementation, compile/smoke, docs/help fixes, curation, protected path changes, Graphify changes, and mutation outside Phase 15 planning artifacts. [VERIFIED: 15-CONTEXT.md][VERIFIED: user phase_scope]
- AC-6: Plan maps SAFETY-01 as in-scope and SAFETY-02, SAFETY-03, DOCS-01 as deferred/out-of-scope for 15-01. [VERIFIED: 15-CONTEXT.md]

## Sources

### Primary (HIGH confidence)

- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md` — canonical SAFE-D-01 through SAFE-D-21, guard commands, hard boundaries, and deferred fronts. [VERIFIED: read]
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-PREFLIGHT.md` — non-executable Phase 15 boundary. [VERIFIED: read]
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-SAFETY-AUTOMATION-SHORTLIST.md` — candidate guard shapes. [VERIFIED: read]
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md` — CI-01/CI-02/CI-03/DOC-01 disposition and protected policy. [VERIFIED: read]
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-VALIDATION.md` — prior protected diff and Graphify hygiene validation patterns. [VERIFIED: read]
- `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md` — current Phase 15 status and requirement traceability. [VERIFIED: read]
- `src/package.json`, `src/cli/parse_args.ts`, `src/tests/cli/parse_args.test.ts`, `src/tests/curation/v1_v2_comparison.test.ts` — project scripts and pattern references, read-only. [VERIFIED: read]
- Read-only git commands executed during research: protected diff command passed; Graphify status reported modified files. [VERIFIED: git command]

### Secondary (MEDIUM confidence)

- None. No external ecosystem research was required for this proof-only git guard front. [VERIFIED: scope]

### Tertiary (LOW confidence)

- Assumptions listed in the Assumptions Log. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — command bases are locked in `15-CONTEXT.md` and Phase 14 validation used the same pattern. [VERIFIED: 15-CONTEXT.md][VERIFIED: 14-VALIDATION.md]
- Architecture: HIGH — first-front scope is narrow, non-mutating, and explicitly separated into two guards. [VERIFIED: 15-CONTEXT.md]
- Pitfalls: MEDIUM — main pitfalls are directly derived from context, but some causal explanations are assumed. [VERIFIED: 15-CONTEXT.md][ASSUMED]

**Research date:** 2026-05-26  
**Valid until:** 2026-06-02 or until Phase 15 context decisions change, whichever comes first. [ASSUMED]
