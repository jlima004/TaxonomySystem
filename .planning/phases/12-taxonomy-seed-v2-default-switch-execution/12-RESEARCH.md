# Phase 12: Taxonomy Seed v2 Default Switch Execution - Research

**Status:** `research_only_planning_context`; execution remains `not_ready_for_execution`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]  
**Researched:** 2026-05-24. [VERIFIED: environment date]  
**Domain:** controlled taxonomy seed default switch execution, staged artifact publication, protected baseline validation, rollback validation, and release documentation. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]  
**Confidence:** HIGH for planning boundaries and gates because Phase 12 has 64 canonical decisions and a non-executable preflight; MEDIUM for future command runtimes because commands must be re-run by executors after final approval. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

Phase 12 is the controlled execution phase for a future default switch from taxonomy seed v1 defaults to taxonomy seed v2 defaults; during research/planning no execution is authorized. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Current boundary: v2 has not been promoted; `DEFAULT_PATHS` continue pointing to v1; `data/compiled/v2` does not exist; `data/compiled/v1` remains baseline/archive; v1 inputs remain protected; v2 inputs must not be altered in this phase; no executable plan exists yet; no code change, seed/data input change, compiled artifact change, artifact publication, rollback execution, or default switch is authorized by context capture. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

`SWITCH-D-01` through `SWITCH-D-64` are mandatory planning gates for Phase 12. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Persisted final human approval in `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md` is required before any mutation, and chat approval is insufficient. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Full pre-switch revalidation must happen before mutation, using explicit temporary v1/v2 output paths and repeated deterministic v2 comparison with `cmp -s`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Allowed future diffs are limited to Phase 12 docs/tracking/summaries/validation reports, `12-FINAL-APPROVAL.md`, the three official `data/compiled/v2` artifacts, `src/cli/parse_args.ts` only for approved `DEFAULT_PATHS` fields, impacted README/CLI/release docs, and tests only if strictly necessary for v2 default plus explicit v1 fallback. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Protected/no-edit paths include v1 and v2 taxonomy/inference inputs, `descriptor_aliases.seed.json`, `data/compiled/v1/**`, and `graphify-out/*` unless a separate explicit plan authorizes it. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

The future `DEFAULT_PATHS` switch must be atomic across `seedPath`, `relationsPath`, `accordsPath`, `outputDir`, and `version`, and partial switching is prohibited. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Official `data/compiled/v2` artifacts must be published from validated temporary v2 output and must contain only `taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

`data/compiled/v1` remains immutable baseline/archive and rollback anchor; explicit v1 validation compile must use `/tmp`, never `data/compiled/v1`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Rollback dry-run in a temporary environment is mandatory before Phase 12 can close, and git revert may support rollback but is not sufficient as the primary strategy. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Phase 12 must use staged validation gates: Gate 0 final approval, Gate 1 pre-switch revalidation, Gate 2 official v2 artifact publication, Gate 3 `DEFAULT_PATHS` switch, Gate 4 post-switch validation, Gate 5 rollback dry-run, and Gate 6 final release documentation. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

Phase 12 future execution must use staged commits, with artifact publication and `DEFAULT_PATHS` switch in separate commits. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

### the agent's Discretion

No separate `## the agent's Discretion` section exists in `12-CONTEXT.md`; discretion is limited to structuring non-executable research/planning so future executable plans preserve `not_ready_for_execution` until final approval and final preflight gates pass. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)

During this research task, do not alter application code, do not alter seed/data input files, do not create `data/compiled/v2`, do not alter `DEFAULT_PATHS`, do not promote v2, do not create or alter PLAN files, and do not create `12-FINAL-APPROVAL.md`. [CITED: user objective/critical_constraints] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SWITCH-01 | Final approval persistence and required fields before mutation. | Plan 12-01 must be approval/preflight only and must keep all later mutations blocked until complete `12-FINAL-APPROVAL.md` exists. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-02 | Decide whether Phase 12 executes full default switch or only pre-switch validation. | Research recommends five staged execution plans, but each plan remains gated and Phase 12 remains not ready until Gate 0 and Gate 1 pass. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-03 | Re-run Phase 11 gates before promotion. | Plan 12-02 owns typecheck/tests/build, explicit v1/v2 temp compiles, repeated v2 determinism, protected diffs, soft finding disposition, graph coverage, review queue, and `data/compiled/v2` absence. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| SWITCH-04 | Expected diffs and never-change files. | All five plans must embed allowlist/protected-path assertions, with Gate 2 and Gate 3 using separate diff scopes. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-05 | `generated_at` policy for official v2 artifacts. | Plan 12-03 must either use fixed `2026-01-01T00:00:00.000Z` or document an explicit comparison policy before publication. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| SWITCH-06 | Official `data/compiled/v2` publication and comparison to temp output. | Plan 12-03 owns controlled copy/publication from validated temp output, official artifact validation, and equivalence checks. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-07 | Exact `DEFAULT_PATHS` switch values. | Plan 12-04 owns the atomic `src/cli/parse_args.ts` edit to five fields only after official v2 artifacts exist and validate. [CITED: .planning/REQUIREMENTS.md] [CITED: src/cli/parse_args.ts] |
| SWITCH-08 | Protected v1 baseline preservation. | Every plan must run v1 existence/protected diff checks before and after mutation stages. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| SWITCH-09 | Rollback execution and success criteria. | Plan 12-05 owns temporary rollback dry-run, proof that v2 is no longer default in rollback context, proof that `data/compiled/v2` is not deleted, and `rollback_success: true`. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-10 | Docs and release notes. | Plan 12-05 owns minimal release/migration docs and final reporting after post-switch validation/rollback evidence exists. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| SWITCH-11 | Commit strategy. | Plans must separate approval/prevalidation, artifact publication, default switch, docs/release notes, and post-switch/rollback validation into staged commits. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
</phase_requirements>

## Summary

Phase 12 should be planned as a controlled, reversible execution sequence, not a single “flip defaults” task. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] The current baseline is deliberately non-executable: no plans exist, `data/compiled/v2` is absent, `DEFAULT_PATHS` still point to v1, and v2 remains candidate-only. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] [VERIFIED: local command]

The planner must make final approval and pre-switch revalidation first-class gates before any mutable step. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] Phase 10/11 evidence is useful historical baseline, but Phase 12 must re-run current validation before publishing official artifacts or switching defaults. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

**Primary recommendation:** create exactly five executable plan prompts, `12-01` through `12-05`, where each prompt has a hard “do not proceed unless prior gate passed” precondition and Phase 12 remains `not_ready_for_execution` until persisted final approval plus current preflight gates pass. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

## Project Constraints (from AGENTS.md)

No repository-root `AGENTS.md` file exists, so no additional `AGENTS.md` directives apply. [VERIFIED: codebase read]

## Current Baseline Inventory

| Item | Current State | Planning Consequence |
|------|---------------|----------------------|
| Phase status | `context_captured`; execution readiness `not_ready_for_execution`. | Plans must start blocked and include approval/preflight checks before mutation. [CITED: .planning/STATE.md] |
| Phase 11 baseline | Phase 11 closed in commit `1f31b76` as documentation-only readiness/migration planning. | Treat Phase 11 artifacts as baseline evidence, not authorization. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| v2 candidate metrics | 10 families, 18 subfamilies, 39 seed descriptors, 303 compiled descriptors, review queue 317, 14 input relations, 19 input accords, 13 graph edges, 0 isolated subfamilies, no known hard failures in last comparison. | Plan 12-02 must revalidate these currently, not copy them as final proof. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| `DEFAULT_PATHS` | v1 seed/relation/accord paths, `data/compiled/v1`, version `1.0.0`. | Plan 12-04 may edit only the five approved fields after Gate 2. [CITED: src/cli/parse_args.ts] |
| Official v2 artifacts | `data/compiled/v2` absent. | Plan 12-03 may create it only after Gate 1 passes. [VERIFIED: local command] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| v1 artifacts | `data/compiled/v1/taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json` exist. | Every gate must preserve these files and diff-clean status. [VERIFIED: codebase glob] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| Existing user-facing docs | README mentions v1 defaults and v2 candidate-only status. | Plan 12-05 likely needs README/release note update after switch validation. [CITED: README.md] |
| Existing dirty paths | `graphify-out/*` is dirty before this research. | Future plans must not include `graphify-out/*` unless separately authorized. [VERIFIED: local command] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Final approval | Planning/governance tier | Human curator | Approval is a persisted planning artifact and must precede mutation. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Pre-switch revalidation | Build/validation tier | Planning docs for evidence capture | Current typecheck/test/build/temp compile gates prove readiness before artifacts or defaults change. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| Official v2 publication | Filesystem artifact tier | Compiler/build tier | Publication creates official `data/compiled/v2` files from validated temp outputs. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| `DEFAULT_PATHS` switch | CLI source tier | Documentation/release tier | Default behavior is encoded in `src/cli/parse_args.ts`; docs communicate the new behavior. [CITED: src/cli/parse_args.ts] |
| Protected v1 baseline | Filesystem artifact/data tier | Git diff validation | v1 files are immutable rollback anchors and must remain physically present, not merely git-recoverable. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Rollback validation | Temporary execution/worktree tier | CLI source + artifact validation | Rollback dry-run must restore v1 defaults in a temporary context and validate preserved v1 while keeping v2 artifacts. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| Release documentation | Documentation tier | Validation evidence tier | Docs must communicate v2 default, official v2 artifacts, v1 preservation, rollback, and accepted soft findings accurately. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| Node.js | `v24.14.0` available locally | Run existing build, test, and compile CLI commands. | Project uses Node.js/TypeScript builder tooling. [VERIFIED: local command] [CITED: src/package.json] |
| npm | `11.9.0` available locally | Invoke existing scripts without new packages. | `src/package.json` defines `build`, `typecheck`, `compile`, `compile:quality`, and `test`. [VERIFIED: local command] [CITED: src/package.json] |
| TypeScript | `^5.8.0` declared | Strict source compile/typecheck. | Project compiler options enable strict and exact optional/no unchecked indexed access constraints. [CITED: src/package.json] [CITED: src/tsconfig.json] |
| Vitest | `^3.2.0` declared | Existing tests for CLI parsing, deterministic v1/v2 comparison, curation, compiler, and inference. | `vitest.config.ts` includes `tests/**/*.test.ts`. [CITED: src/package.json] [CITED: src/vitest.config.ts] |
| Git | `2.54.0` available locally | Diff gates and staged commit separation. | Phase 12 decisions require staged commits and protected diff checks. [VERIFIED: local command] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `cmp` | system utility, version not probed | Byte-compare repeated v2 outputs. | Gate 1 determinism check after repeated v2 compile. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| POSIX `test` | system shell builtin | File/directory existence and absence assertions. | All gates need artifact and protected-path assertions. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| `/tmp/opencode/taxonomy-phase12-switch/*` | temporary filesystem paths | Isolated v1/v2/repeat compile output. | Pre-switch and rollback validation must not write official paths until publication gate. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

**Installation:** No external package installation is recommended for Phase 12 planning; use existing project dev dependencies and system tools. [CITED: src/package.json] [CITED: README.md]

## Package Legitimacy Audit

No new external packages are recommended for Phase 12; package legitimacy gate is not applicable. [CITED: src/package.json]

## Existing Implementation/Doc Patterns Found

| Pattern | Evidence | Phase 12 Planning Use |
|---------|----------|-----------------------|
| CLI defaults centralized in `DEFAULT_PATHS` | `src/cli/parse_args.ts` exports `DEFAULT_PATHS` with v1 seed/relation/accord/output/version defaults. | Plan 12-04 must edit only these five approved fields and preserve alias/corpus/noise defaults. [CITED: src/cli/parse_args.ts] |
| CLI flags support explicit paths | `parseCompileArgs` maps `--seed`, `--aliases`, `--corpus`, `--relations`, `--accords`, `--noise`, `--out`, `--version`, and `--generated-at`. | Plan 12-02 can compile v1/v2 to temp paths without changing defaults. [CITED: src/cli/parse_args.ts] |
| UTC generated-at validation | `--generated-at` must parse and end with `Z`. | Plan 12-02/12-03 should use `2026-01-01T00:00:00.000Z` or document an explicit comparison policy. [CITED: src/cli/parse_args.ts] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| Determinism test pattern | `v1_v2_comparison.test.ts` compiles with explicit paths and fixed timestamp and compares repeated outputs. | Plan 12-02 should repeat v2 compile and use byte comparisons for all official files. [CITED: src/tests/curation/v1_v2_comparison.test.ts] |
| Protected path assertion pattern | Phase 11 validation used `test ! -d data/compiled/v2` plus `git diff --exit-code` for protected paths. | Plan 12-01 and 12-02 should adapt this before artifact publication; later gates remove only the pre-publication absence assertion. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-VALIDATION.md] |
| README default status messaging | README states v1 remains default and v2 candidate needs future approved promotion. | Plan 12-05 must update only impacted wording after successful switch and rollback validation. [CITED: README.md] |
| Phase 11 runbook decomposition | Phase 11 split readiness, soft findings, graph/review, migration proposal, and rollback/release gates. | Phase 12 should reuse the governance concepts but convert them into staged executable gates after approval. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-RESEARCH.md] |

## Recommended Five-Plan Breakdown

| Plan | Title | Primary Gates | Authorized Future Mutation Scope | Must Remain Blocked Until |
|------|-------|---------------|----------------------------------|---------------------------|
| 12-01 | Final approval, approval schema, and non-mutation preflight | Gate 0; early protected diff/source assertions | `12-FINAL-APPROVAL.md` only if explicitly created by human-approved execution plan; Phase 12 validation docs as evidence | Human approval artifact exists with all required fields; protected paths clean. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| 12-02 | Current pre-switch revalidation in temporary paths | Gate 1 | Temporary outputs only under `/tmp/opencode/taxonomy-phase12-switch/*`; Phase 12 validation/pre-switch report | Gate 0 passed; `data/compiled/v2` absent; `DEFAULT_PATHS` still v1. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| 12-03 | Publish and validate official v2 artifacts | Gate 2 | Create only `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`; publication report | Gate 1 passed with zero hard failures and deterministic v2 comparison. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| 12-04 | Atomic `DEFAULT_PATHS` switch and post-switch validation | Gate 3 and Gate 4 | `src/cli/parse_args.ts` five approved fields only; tests only if necessary | Gate 2 passed and official v2 artifacts validate. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| 12-05 | Rollback dry-run, release docs, final closure evidence | Gate 5 and Gate 6 | Minimal docs/release notes/tracking/final validation summaries | Gate 4 passed; rollback dry-run proves `rollback_success: true`; final docs do not misstate v1 removal or soft finding resolution. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |

## Gate Architecture Preserving SWITCH-D-01..SWITCH-D-64

| Decision Range | Gate/Plan Owner | Planning Requirement |
|----------------|-----------------|----------------------|
| SWITCH-D-01..D-05 | Gate 0 / Plan 12-01 | Persisted final approval in `12-FINAL-APPROVAL.md`; chat approval insufficient; no mutable plan before approval. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-06..D-11 | Gate 1 / Plan 12-02 | Full current revalidation; explicit temp v1/v2/repeat outputs; repeated v2 `cmp -s`; hard failure blocks; official `data/compiled/v2` remains absent until publication. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-12..D-17 | All plans | Minimal controlled diff set; protected seed/input/v1 paths; only official v2 artifacts; only approved `DEFAULT_PATHS` fields; any outside diff is blocker. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-18..D-23 | Gate 3/4 / Plan 12-04 | Atomic five-field default switch; no partial switch; v1 preserved; switch limited to `src/cli/parse_args.ts`; default compile must use v2 after switch. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-24..D-30 | Gate 2 / Plan 12-03 | Official v2 artifacts from validated temp output; do not use Phase 10 temp outputs; publish only three files; preserve v1; validate artifacts; handle `generated_at`; switch blocked until v2 exists and validates. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-31..D-37 | All plans | Treat v1 as immutable; v1 inputs/artifacts not altered; protected diff checks before/after publication/switch/closure; v1 compile only in temp; git-only rollback not enough. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-38..D-43 | Gate 5 / Plan 12-05 | Temporary rollback dry-run required; restore v1 defaults; validate preserved v1; do not delete v2; rollback failure blocks closure; final report records rollback evidence. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-44..D-49 | Gate 6 / Plan 12-05 | Minimal release/migration docs; update impacted README/CLI docs only; declare v2 default, official v2, preserved v1, validated rollback; do not claim v1 removed or soft findings resolved. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-50..D-58 | All gates / 12-01..12-05 | Staged gates; hard gate failure blocks next stage; v2 creation after Gate 1 only; default switch after Gate 2 only; closure after rollback success; outside diff/input mutation/docs failure are blockers. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-D-59..D-64 | Commit strategy across all plans | Staged commits; artifact publication and switch separate; approval/prevalidation before mutation commit; each commit matches a gate and passes protected diff; final commit after post-switch and rollback success. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

## Architecture Patterns

### System Architecture Diagram

```text
Gate 0: persisted final approval
  -> if missing: STOP, phase remains not_ready_for_execution
  -> if complete: Gate 1

Gate 1: current pre-switch revalidation
  -> typecheck/tests/build
  -> compile v1 to /tmp/opencode/taxonomy-phase12-switch/v1-baseline
  -> compile v2 to /tmp/opencode/taxonomy-phase12-switch/v2-candidate
  -> compile v2 repeat to /tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat
  -> cmp official candidate temp outputs
  -> protected diff and no data/compiled/v2 assertion
  -> if hard failure: STOP
  -> if pass: Gate 2

Gate 2: official v2 artifact publication
  -> create data/compiled/v2 with exactly three files
  -> compare to validated temp output with generated_at policy
  -> validate schema/status/quality
  -> protected v1/input diff clean
  -> if pass: Gate 3

Gate 3: atomic DEFAULT_PATHS switch
  -> edit src/cli/parse_args.ts five fields only
  -> forbid partial switch
  -> protected v1/input diff clean
  -> if pass: Gate 4

Gate 4: post-switch validation
  -> default compile uses v2 and outputs to data/compiled/v2
  -> explicit v1 compile still works to /tmp
  -> typecheck/tests/build pass
  -> official v2 artifacts validate and v1 baseline preserved
  -> if pass: Gate 5

Gate 5: rollback dry-run in temporary context
  -> restore v1 defaults in temp patch/worktree/equivalent
  -> validate v1 defaults, v1 compile, v1 artifacts, and v2 not deleted
  -> record rollback_success: true
  -> if pass: Gate 6

Gate 6: release docs and closure evidence
  -> release/migration notes + validation summaries
  -> no claim v1 removed or soft findings resolved unless true
  -> final staged commit allowed only after rollback evidence
```

Source: staged gate policy and constraints. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

### Recommended Project Structure

```text
.planning/phases/12-taxonomy-seed-v2-default-switch-execution/
├── 12-CONTEXT.md                         # canonical SWITCH-D-01..D-64 context
├── 12-PREFLIGHT.md                       # non-executable boundary and staged gates
├── 12-RESEARCH.md                        # this planning research
├── 12-PATTERNS.md                        # future pattern map, if generated
├── 12-VALIDATION.md                      # future Nyquist contract
├── 12-FINAL-APPROVAL.md                  # future persisted human approval; do not create in research
├── 12-01-PLAN.md                         # future final approval/preflight plan
├── 12-02-PLAN.md                         # future pre-switch revalidation plan
├── 12-03-PLAN.md                         # future official v2 publication plan
├── 12-04-PLAN.md                         # future DEFAULT_PATHS switch plan
└── 12-05-PLAN.md                         # future rollback/docs/closure plan
```

Source: Phase 12 output boundaries and requested five-plan structure. [CITED: user objective/output_requirements] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

### Anti-Patterns to Avoid

- **Approval by chat:** Do not let a plan proceed from conversational consent; require complete persisted `12-FINAL-APPROVAL.md`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]
- **Prevalidation that writes official paths:** Do not compile directly to `data/compiled/v2` or `data/compiled/v1` during Gate 1. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]
- **Partial default switch:** Do not change only outputDir/version or only input paths; all five approved fields move together. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]
- **Artifact/switch mixed commit:** Do not publish `data/compiled/v2` and edit `DEFAULT_PATHS` in the same commit. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]
- **Git-only rollback:** Do not count `git revert` as the primary rollback proof. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]
- **Planning artifact mutation creep:** Do not create or alter PLAN files, final approval, app code, seed/data inputs, compiled v2, or defaults in this research task. [CITED: user objective/critical_constraints]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Approval gate | Ad hoc checklist or chat transcript | `12-FINAL-APPROVAL.md` with required fields | Context requires persisted approval and says chat approval is insufficient. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Determinism check | Custom semantic comparator only | fixed `generated_at` plus `cmp -s` / byte comparison policy | Context requires repeat compile and `cmp -s`; generated_at must be fixed or policy-documented. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Protected path verification | Manual eyeballing | `git diff --exit-code` and `test -f` assertions | Preflight provides protected diff/existence commands and treats v1 drift as hard blocker. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| Default switch script | New migration framework | Minimal edit to `src/cli/parse_args.ts` five fields | Default values already live in one source constant. [CITED: src/cli/parse_args.ts] |
| Rollback proof | Commit revert only | Temporary rollback dry-run plus v1 validation | Context states git-only rollback is insufficient and v1 physical preservation is required. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | Official stored artifacts currently include `data/compiled/v1/taxonomy.json`, `data/compiled/v1/descriptor_aliases.json`, and `data/compiled/v1/similarity_matrix.json`; official `data/compiled/v2` is absent. [VERIFIED: codebase glob] [VERIFIED: local command] | Preserve v1; publish v2 only in Gate 2 from validated temp output. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Live service config | No external runtime service configuration is described for this builder-first repository. [CITED: README.md] | None identified; release docs may need manual downstream consumer notice if external users consume default output. [ASSUMED] |
| OS-registered state | No OS scheduler/service registration is described by Phase 12 context, roadmap, state, README, or relevant source files read. [VERIFIED: codebase read] | None identified. [VERIFIED: codebase read] |
| Secrets/env vars | Defaults are controlled by `src/cli/parse_args.ts`, not env vars. [CITED: src/cli/parse_args.ts] | None identified. [CITED: src/cli/parse_args.ts] |
| Build artifacts | `src/dist` is produced by `npm run build`; official compiled artifacts are under `data/compiled/v1`, and future temp outputs must use `/tmp/opencode/taxonomy-phase12-switch/*`. [CITED: src/package.json] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] | Future plans must not commit `src/dist` or temp outputs unless explicitly allowed; official v2 artifact commit is restricted to three JSON files. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

## Common Pitfalls

### Pitfall 1: Treating Phase 11 Evidence As Current Approval
**What goes wrong:** A plan skips Gate 0/Gate 1 because Phase 11 documented readiness. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-RESEARCH.md]  
**How to avoid:** Plan 12-01 must require persisted approval and Plan 12-02 must re-run current pre-switch validation before mutation. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

### Pitfall 2: Publishing v2 Before Determinism Is Proven
**What goes wrong:** `data/compiled/v2` is created before repeated temp v2 outputs match. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]  
**How to avoid:** Gate 1 must assert `test ! -d data/compiled/v2` and compare repeated temp outputs before Gate 2. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]

### Pitfall 3: Hidden v1 Baseline Drift
**What goes wrong:** v1 inputs or compiled artifacts drift during v2 publication or docs work. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]  
**How to avoid:** Every plan must run protected diff and existence checks before and after mutation stages. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]

### Pitfall 4: Partial `DEFAULT_PATHS` Switch
**What goes wrong:** output version becomes v2 while seed/relation/accord inputs stay v1, or v2 inputs write to v1 output. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]  
**How to avoid:** Plan 12-04 must assert all five fields in one source diff and reject any partial combination. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

### Pitfall 5: Rollback Deletes v2 Artifacts
**What goes wrong:** rollback is interpreted as deleting `data/compiled/v2`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]  
**How to avoid:** Rollback dry-run must restore v1 defaults while explicitly asserting `data/compiled/v2` remains present. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]

### Pitfall 6: Docs Overstate The Promotion
**What goes wrong:** release docs say v1 was removed or soft findings were resolved when they were accepted by policy. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]  
**How to avoid:** Plan 12-05 must include negative doc assertions against “v1 removed” and unsupported “resolved” claims. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

## Code Examples

### Source Assertion: Current Defaults Are Still V1 Before Switch

```bash
node -e "import('./dist/cli/parse_args.js').then(({DEFAULT_PATHS})=>{ if (DEFAULT_PATHS.seedPath !== 'data/taxonomy/taxonomy-seed.v1.json') process.exit(1); if (DEFAULT_PATHS.relationsPath !== 'data/inference/curated_relations.v1.json') process.exit(1); if (DEFAULT_PATHS.accordsPath !== 'data/inference/accord_map.v1.json') process.exit(1); if (DEFAULT_PATHS.outputDir !== 'data/compiled/v1') process.exit(1); if (DEFAULT_PATHS.version !== '1.0.0') process.exit(1); })"
```

Source: current `DEFAULT_PATHS` values. [CITED: src/cli/parse_args.ts]

### Protected V1 Diff And Existence Gate

```bash
git diff --exit-code -- \
  data/compiled/v1 \
  data/taxonomy/taxonomy-seed.v1.json \
  data/inference/curated_relations.v1.json \
  data/inference/accord_map.v1.json

test -f data/taxonomy/taxonomy-seed.v1.json
test -f data/inference/curated_relations.v1.json
test -f data/inference/accord_map.v1.json
test -f data/compiled/v1/taxonomy.json
test -f data/compiled/v1/descriptor_aliases.json
test -f data/compiled/v1/similarity_matrix.json
```

Source: Phase 12 preflight protected baseline policy. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]

### Future Gate 1 Temp Compile Shape

```bash
cd src
npm run typecheck
npm test
npm run build

npm run compile -- \
  --seed ../data/taxonomy/taxonomy-seed.v1.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --relations ../data/inference/curated_relations.v1.json \
  --accords ../data/inference/accord_map.v1.json \
  --out /tmp/opencode/taxonomy-phase12-switch/v1-baseline \
  --version 1.0.0 \
  --generated-at 2026-01-01T00:00:00.000Z

npm run compile -- \
  --seed ../data/taxonomy/taxonomy-seed.v2.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --relations ../data/inference/curated_relations.v2.json \
  --accords ../data/inference/accord_map.v2.json \
  --out /tmp/opencode/taxonomy-phase12-switch/v2-candidate \
  --version 2.0.0 \
  --generated-at 2026-01-01T00:00:00.000Z

npm run compile -- \
  --seed ../data/taxonomy/taxonomy-seed.v2.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --relations ../data/inference/curated_relations.v2.json \
  --accords ../data/inference/accord_map.v2.json \
  --out /tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat \
  --version 2.0.0 \
  --generated-at 2026-01-01T00:00:00.000Z
```

Source: CLI flag support and Phase 12 temporary path policy. [CITED: src/cli/parse_args.ts] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `^3.2.0` plus source/diff/artifact assertions. [CITED: src/package.json] |
| Config file | `src/vitest.config.ts` includes `tests/**/*.test.ts`. [CITED: src/vitest.config.ts] |
| Quick run command | `cd src && npm run typecheck && npm test -- tests/cli/parse_args.test.ts tests/curation/v1_v2_comparison.test.ts` [CITED: src/package.json] [CITED: src/tests/cli/parse_args.test.ts] [CITED: src/tests/curation/v1_v2_comparison.test.ts] |
| Full suite command | `cd src && npm run typecheck && npm test && npm run build` [CITED: src/package.json] |

### Source Assertions Future Executors Must Satisfy

| Assertion | Gate | Command / Check | Failure Meaning |
|-----------|------|-----------------|-----------------|
| Approval exists and is complete | Gate 0 | `test -f .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md` plus field checks for all required keys | No mutation authorized. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| `data/compiled/v2` absent before publication | Gate 1 | `test ! -d data/compiled/v2` | Publication happened too early or stale artifact exists. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| Current defaults still v1 before Gate 3 | Gate 1/2 | Assert five `DEFAULT_PATHS` values equal v1/current values | Defaults changed before artifact publication. [CITED: src/cli/parse_args.ts] |
| Atomic defaults after Gate 3 | Gate 3/4 | Assert `seedPath=v2`, `relationsPath=v2`, `accordsPath=v2`, `outputDir=data/compiled/v2`, `version=2.0.0` | Partial switch or wrong defaults. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Protected inputs unchanged | All gates | `git diff --exit-code -- data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json` | Unauthorized seed/input mutation. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Protected v1 artifacts unchanged | All gates | `git diff --exit-code -- data/compiled/v1` plus `test -f` checks | v1 rollback anchor drifted. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |

### Command Assertions Future Executors Must Satisfy

| Gate | Required Command Class | Minimum Assertion |
|------|------------------------|-------------------|
| Gate 1 | `npm run typecheck`, `npm test`, `npm run build` | All exit 0 before any artifact publication. [CITED: src/package.json] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| Gate 1 | explicit v1 compile to `/tmp/opencode/taxonomy-phase12-switch/v1-baseline` | Produces three files and does not touch `data/compiled/v1`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Gate 1 | explicit v2 compile to candidate and repeat temp dirs | `cmp -s` passes for repeated output files or documented generated_at comparison policy passes. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Gate 2 | official artifact publication validation | `data/compiled/v2` has exactly three official files and validates against schema/status/quality gates. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Gate 4 | default compile validation | Default compile uses v2 inputs, version `2.0.0`, and output dir `data/compiled/v2`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Gate 5 | rollback dry-run validation | Temporary rollback restores v1 defaults, validates v1 compile, preserves v1 files, does not delete `data/compiled/v2`, and records `rollback_success: true`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |

### Diff Gates

| Stage | Allowed Diff | Blocked Diff |
|-------|--------------|--------------|
| Research/planning now | Only this `12-RESEARCH.md` file. [CITED: user objective/critical_constraints] | App code, seed/input data, `data/compiled/v2`, `DEFAULT_PATHS`, PLAN files, `12-FINAL-APPROVAL.md`. [CITED: user objective/critical_constraints] |
| 12-01 | Approval/preflight docs only, after authorization. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] | Any compiled artifact/code/default switch. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| 12-03 | Exactly `data/compiled/v2/{taxonomy.json,descriptor_aliases.json,similarity_matrix.json}` plus validation docs. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] | `data/compiled/v1/**`, seed/input JSON, `src/cli/parse_args.ts` in the publication commit. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| 12-04 | `src/cli/parse_args.ts` five approved `DEFAULT_PATHS` fields only, and narrowly scoped tests if necessary. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] | Any seed/input edits, v1 artifact edits, unrelated source edits, partial default switch. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| 12-05 | Minimal docs/tracking/release/validation summaries. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] | Claims that v1 was removed or soft findings were resolved when only accepted. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

### Artifact Gates

| Artifact | Gate | Required State |
|----------|------|----------------|
| `/tmp/opencode/taxonomy-phase12-switch/v1-baseline` | Gate 1 | Exists after explicit v1 compile; never committed. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| `/tmp/opencode/taxonomy-phase12-switch/v2-candidate` | Gate 1 | Exists after explicit v2 compile; source for official publication only after Gate 1 passes. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| `/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat` | Gate 1 | Exists after repeat compile; compared with candidate using `cmp -s`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| `data/compiled/v2` | Before Gate 2 | Must be absent. [VERIFIED: local command] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| `data/compiled/v2` | After Gate 2 | Must contain exactly `taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| `data/compiled/v1` | All gates | Must remain present, unchanged, and never overwritten/regenerated in place. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

### Phase Requirements → Validation Map

| Req ID | Behavior | Test/Validation Type | Automated Command / Check | File Exists? |
|--------|----------|----------------------|----------------------------|--------------|
| SWITCH-01 | Approval before mutation | doc/source assertion | `test -f 12-FINAL-APPROVAL.md` plus required field checks | ❌ expected future Gate 0 [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| SWITCH-02 | Full switch execution remains staged | plan/validation assertion | Verify `12-01..12-05` preconditions and gate blocks | ❌ future plans intentionally absent now [CITED: .planning/ROADMAP.md] |
| SWITCH-03 | Revalidation rerun | command assertions | typecheck/test/build/temp compiles/repeat cmp/protected diff | ✅ infrastructure exists [CITED: src/package.json] |
| SWITCH-04 | Expected diffs enforced | diff gate | `git diff --name-only` allowlist audit | ✅ git available [VERIFIED: local command] |
| SWITCH-05 | generated_at policy | artifact comparison | fixed timestamp or documented exception before publication | ✅ CLI supports generated-at [CITED: src/cli/parse_args.ts] |
| SWITCH-06 | v2 artifact publication | artifact gate | exactly three official v2 files, schema/status/quality validation | ❌ `data/compiled/v2` absent now [VERIFIED: local command] |
| SWITCH-07 | atomic defaults | source assertion | five `DEFAULT_PATHS` fields equal approved v2 values after Gate 3 | ✅ source constant exists [CITED: src/cli/parse_args.ts] |
| SWITCH-08 | v1 baseline preserved | diff/existence gate | protected v1 diff and `test -f` checks | ✅ v1 artifacts exist [VERIFIED: codebase glob] |
| SWITCH-09 | rollback execution | temporary rollback dry-run | restore v1 defaults in temp context and record `rollback_success: true` | ❌ future Gate 5 artifact needed [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| SWITCH-10 | docs/release notes | doc assertion | check required messaging and forbidden claims | ✅ README exists [CITED: README.md] |
| SWITCH-11 | staged commits | git/history assertion | each future commit maps to a gate and excludes unrelated diffs | ✅ git available [VERIFIED: local command] |

### Sampling Rate

- **Per task commit:** run protected v1/input diff and assert current gate-specific allowed diff only. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]
- **Per wave merge:** run full suite command plus artifact gate checks for the current stage. [CITED: src/package.json] [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]
- **Phase gate:** require Gate 0 through Gate 6 evidence, rollback success, and final docs before closure. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

### Wave 0 Gaps

- [ ] `12-VALIDATION.md` — future Nyquist contract for Gate 0 through Gate 6; not created by this research task. [CITED: user objective/critical_constraints]
- [ ] `12-FINAL-APPROVAL.md` — future persisted human approval; must not be created in this task. [CITED: user objective/critical_constraints]
- [ ] `12-01-PLAN.md` through `12-05-PLAN.md` — future executable prompts; must not be created in this task. [CITED: user objective/critical_constraints]
- [ ] Post-switch source assertions may need added or updated tests only if existing `parse_args`/curation tests do not cover v2 defaults after Gate 3. [CITED: src/tests/cli/parse_args.test.ts] [ASSUMED]

## Risk Register And Rollback Planning Considerations

| Risk | Stage | Severity | Mitigation |
|------|-------|----------|------------|
| Missing/ambiguous final approval | Gate 0 | Critical | Block all mutation unless every required field exists in `12-FINAL-APPROVAL.md`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Stale Phase 11 evidence used as current validation | Gate 1 | High | Re-run typecheck/tests/build/temp compiles/repeat cmp in Phase 12. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| v1 baseline drift | All gates | Critical | Protected diff and existence checks before and after publication, switch, and closure. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md] |
| Official v2 artifact mismatch with temp output | Gate 2 | High | Publish from validated temp output and compare official files to temp output with generated_at policy. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Partial default switch | Gate 3 | Critical | Assert all five `DEFAULT_PATHS` fields changed together and no other fields changed. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Rollback deletes or hides v2 artifacts | Gate 5 | High | Rollback restores v1 defaults only and explicitly preserves `data/compiled/v2`. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| Release docs overstate status | Gate 6 | Medium | Validate required and forbidden messaging before closure. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | build/test/compile commands | ✓ | `v24.14.0` | Block executable validation if unavailable. [VERIFIED: local command] |
| npm | project scripts | ✓ | `11.9.0` | Block executable validation if unavailable. [VERIFIED: local command] |
| Git | diff gates/commit strategy | ✓ | `2.54.0` | Block staged execution if unavailable. [VERIFIED: local command] |
| TypeScript | typecheck/build | declared | `^5.8.0` | Use existing devDependency only. [CITED: src/package.json] |
| Vitest | tests | declared | `^3.2.0` | Use existing devDependency only. [CITED: src/package.json] |

**Missing dependencies with no fallback:** none identified for research/planning; future execution should block if Node/npm/git are unavailable at that time. [VERIFIED: local command]

## Security Domain

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Local builder/planning phase has no authentication surface. [CITED: README.md] |
| V3 Session Management | no | No sessions are involved in local CLI default switching. [CITED: README.md] |
| V4 Access Control | yes | Persisted human approval, staged gates, and protected diff checks act as local authorization controls. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md] |
| V5 Input Validation | yes | Existing seed/curation/compiler tests and schema/status/quality gates validate taxonomy inputs/artifacts. [CITED: src/tests/curation/v1_v2_comparison.test.ts] |
| V6 Cryptography | no | Phase 12 does not require cryptographic operations. [CITED: README.md] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Release docs may need manual downstream consumer notice if external users consume default output. | Runtime State Inventory | Medium: external consumers could miss the default switch. |
| A2 | Existing tests may need updates only if they do not cover post-switch v2 defaults after Gate 3. | Validation Architecture | Low/medium: planner can include a test-gap task before switching. |

## Open Questions (RESOLVED)

1. **RESOLVED: Should post-switch tests assert v2 defaults by modifying existing tests or adding a new focused test?**  
   - What we know: current `parse_args.test.ts` asserts defaults equal current `DEFAULT_PATHS`, and `v1_v2_comparison.test.ts` asserts v1 defaults before switch. [CITED: src/tests/cli/parse_args.test.ts] [CITED: src/tests/curation/v1_v2_comparison.test.ts]  
   - Resolution: Plan 12-04 should use the smallest possible change to existing tests first; add a new focused test only if existing `parse_args` and v1/v2 comparison tests cannot express both approved v2 defaults and explicit v1 fallback preservation without weakening coverage. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]

2. **RESOLVED: What exact `generated_at` policy will be approved for official v2 artifacts?**  
   - What we know: preflight prefers fixed `2026-01-01T00:00:00.000Z` where possible, otherwise an explicit comparison policy is required. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]  
   - Resolution: Plans default to fixed `2026-01-01T00:00:00.000Z`; a different policy is allowed only if `12-FINAL-APPROVAL.md` explicitly records the comparison exception before Gate 1/Gate 2 evidence is accepted. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]

## Sources

### Primary (HIGH confidence)

- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md` — canonical `SWITCH-D-01` through `SWITCH-D-64`, baseline, gates, allowlist, rollback, docs, and commit strategy. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]
- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md` — non-executable boundary, staged gates, protected diff/existence commands, and future gate details. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]
- `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md` — Phase 12 goal, requirements `SWITCH-01..SWITCH-11`, and current status/history. [CITED: .planning/ROADMAP.md] [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/STATE.md]
- Phase 11 artifacts — prior readiness/migration/rollback patterns and validation architecture. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-RESEARCH.md] [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-VALIDATION.md]
- `src/cli/parse_args.ts`, `src/package.json`, `src/vitest.config.ts`, `src/tests/cli/parse_args.test.ts`, and `src/tests/curation/v1_v2_comparison.test.ts` — current CLI defaults, scripts, test framework, and deterministic compile patterns. [CITED: src/cli/parse_args.ts] [CITED: src/package.json] [CITED: src/vitest.config.ts]
- `README.md` — user-facing current default/candidate status and project architecture. [CITED: README.md]

### Secondary (MEDIUM confidence)

- Local environment probes for Node.js, npm, git, `data/compiled/v2` absence, and current git status. [VERIFIED: local command]

### Tertiary (LOW confidence)

- No external web or package ecosystem claims were needed for this research. [VERIFIED: codebase read]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — read from `src/package.json`, `src/vitest.config.ts`, and local version probes. [CITED: src/package.json] [VERIFIED: local command]
- Architecture/gates: HIGH — directly constrained by Phase 12 canonical context and preflight. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md]
- Validation architecture: HIGH for required gates and current scripts; MEDIUM for exact future post-switch tests because planner must decide the smallest test change after approval. [CITED: src/package.json] [ASSUMED]
- Rollback planning: HIGH for required behavior; MEDIUM for exact temporary rollback mechanism because context allows temporary patch/branch/worktree or equivalent. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md]

**Research date:** 2026-05-24. [VERIFIED: environment date]  
**Valid until:** 2026-06-23 unless Phase 12 context, defaults, artifact state, or approval status changes sooner. [ASSUMED]
