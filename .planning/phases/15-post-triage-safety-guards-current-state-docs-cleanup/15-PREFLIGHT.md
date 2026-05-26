---
phase: 15
slug: post-triage-safety-guards-current-state-docs-cleanup
status: context_gathering
execution_readiness: not_ready_for_execution
created: 2026-05-26
protected_paths_touched: none
---

# Phase 15 Preflight

Phase 15 starts in `context_gathering` and is `not_ready_for_execution`.

## Objective

Transform a small, safe subset of Phase 14 outputs into controlled post-v2-default execution planning, prioritizing operational safety protection before any broader cleanup.

## Mandatory Inputs

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CLOSURE.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-DOCS-HELP-SHORTLIST.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-SAFETY-AUTOMATION-SHORTLIST.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-VALIDATION.md`

## Initial Decision

- The first priority is `Safety automation guards`.
- Docs/help current-state cleanup remains a possible later front, preferably in a separate plan if it proceeds.
- No execution is authorized by this preflight.

## Post-15-01 Policy Update

- `15-01 local_proof_only` proved the protected taxonomy/default/artifact boundary clean.
- `graphify-out/*` remains dirty and is accepted as known issue `accepted_with_policy`.
- Dirty `graphify-out/*` is commit-contamination risk only, not taxonomy evidence.
- Future safety automation plans must not require `graphify-out/*` to be clean in the working tree as a condition of commit.
- Future safety automation plans must require that `graphify-out/*` is not staged and not included in the commit.
- Any Graphify cleanup, revert, regeneration, staging or commit still requires a separate generated-artifacts plan with allowlist and diff policy.

## Next Suggested Plan

`15-02 — Staged commit safety guard`

Objective: create or validate a safety automation front that protects the commit/staging boundary, permits known dirty Graphify state in the working tree, and blocks staged Graphify or unexpected staged protected paths.

Recommended Graphify staged guard:

```bash
git diff --cached --name-only -- graphify-out
```

Success criterion: empty output.

Failure criterion: any staged path under `graphify-out/*`.

## Allowed During Context Gathering

- Discuss whether Phase 15 should execute safety automation guards, docs/help cleanup, or both in separate plans.
- Register decisions.
- Create/update Phase 15 preflight, context and discussion-log artifacts.
- Update GSD tracking for the Phase 15 context state.

## Explicitly Not Created Yet

- `15-RESEARCH.md`
- `15-PATTERNS.md`
- `15-VALIDATION.md`
- `15-01-PLAN.md`

## Protected Boundaries

Do not alter:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1`
- `data/compiled/v2`
- `src/cli/parse_args.ts`
- `graphify-out/*`

Known policy exception: `graphify-out/*` may remain dirty in the working tree as accepted-with-policy commit hygiene risk. It must not be staged or included in any commit without a dedicated generated-artifacts plan.

Do not execute yet:

- Curation.
- Descriptor promotion.
- Alias add/remove/remap.
- Relation or accord add/remove/edit.
- Compile/smoke commands.
- Safety automation implementation.
- Docs/help fixes.
- Graphify cleanup, revert, regeneration, staging or commit.
- Artifact refresh.
- `DEFAULT_PATHS` changes.

## Preflight Gate

Before Phase 15 can move beyond context gathering, a later approved planning step must define:

- Exact guard or docs/help scope.
- File allowlist.
- Validation commands.
- Protected-path checks.
- Rollback/removal path.
- Staged-file checks that fail when protected paths or `graphify-out/*` are unexpectedly staged.
