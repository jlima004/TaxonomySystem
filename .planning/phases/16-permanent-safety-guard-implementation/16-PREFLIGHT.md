---
phase: 16
slug: permanent-safety-guard-implementation
status: context_gathering
execution_readiness: not_ready_for_execution
created: 2026-05-26
updated: 2026-05-26
non_mutating_context_capture: true
---

# Phase 16 Preflight

Phase 16 starts in context gathering only.

## Phase Name

Permanent Safety Guard Implementation

## Objective

Transform Phase 15 local proof safety guard results into a small permanent implementation while preserving non-mutating behavior and protecting the staging/commit boundary.

## Mandatory Upstream Base

- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CLOSURE.md`
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-VALIDATION.md`
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-01-SUMMARY.md`
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-02-SUMMARY.md`
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md`
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-PATTERNS.md`
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-RESEARCH.md`

## Initial Priority

Implement a small safety guard for staging/protected paths, without automatic CI or hook integration yet.

The first implementation format selected during context capture is `Local script only`.

## Authorized Now

- Create `16-PREFLIGHT.md`.
- Create `16-CONTEXT.md`.
- Create `16-DISCUSSION-LOG.md`.
- Update GSD tracking for Phase 16 context gathering.

## Not Authorized Now

- Do not create `16-RESEARCH.md`.
- Do not create `16-PATTERNS.md`.
- Do not create `16-VALIDATION.md`.
- Do not create `16-01-PLAN.md`.
- Do not implement the guard until a later approved plan exists.
- Do not run compile, smoke, typecheck, tests or build.
- Do not execute curation.
- Do not apply docs/help fixes.
- Do not commit.

## Protected Boundaries

Do not alter:

- `data/taxonomy`
- `data/inference`
- `data/compiled/v1`
- `data/compiled/v2`
- `src/cli/parse_args.ts`
- `graphify-out/*`

Do not alter `DEFAULT_PATHS`.

Do not clean, revert, regenerate, stage, unstage or commit `graphify-out/*`.

## Graphify Policy

- Dirty `graphify-out/*` in the working tree remains accepted_with_policy.
- The permanent safety guard must not require `graphify-out/*` to be clean in the working tree.
- The permanent safety guard must block staged `graphify-out/*`.
- Any Graphify remediation requires a separate generated-artifacts plan.
