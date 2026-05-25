---
status: context_captured
executable: true
plans: 4
implementation: stabilization_only_authorized
execution_readiness: ready_for_stabilization_only_execution
allowed_next_step: execute_phase_13_stabilization_only
---

# Phase 13: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption - Preflight

## Status

Phase 13 context gathering, planning and final preflight review are complete. Plans 13-01 through 13-04 are approved for stabilization-only execution.

This approval authorizes only Phase 13 evidence/report/summary artifacts. It does not authorize code edits, taxonomy curation, official compiled artifact writes, Graphify regeneration or Phase 14 backlog execution.

## Execution Boundary

- Stabilization-only execution is authorized for Plans 13-01 through 13-04.
- No code changes are authorized.
- No source docs outside the Phase 13 evidence/report/summary artifacts are authorized for edits.
- No new taxonomy curation is authorized.
- `taxonomy-seed.v2.json` must not be edited.
- `curated_relations.v2.json` must not be edited.
- `accord_map.v2.json` must not be edited.
- `descriptor_aliases.seed.json` must not be edited.
- `data/compiled/v1/` must not be overwritten or removed.
- `data/compiled/v2/` must not be overwritten or removed.
- `src/cli/parse_args.ts` must not be edited during Phase 13 execution.
- `graphify-out/*` is protected and plan-gated; it must not be mutated or committed unless a future explicit plan authorizes it.
- Phase 14 backlog may be documented only; it must not be curated, remediated or executed.

## Final Preflight Approval

Review date: 2026-05-25

Approved plans:

- `13-01-PLAN.md` - consumer inventory and docs consistency audit.
- `13-02-PLAN.md` - bounded validation suite plus `/tmp` default-v2 and explicit-v1 smoke validation.
- `13-03-PLAN.md` - CI/hooks/generated-artifact audit and `graphify-out/*` policy.
- `13-04-PLAN.md` - release confidence checklist and Phase 14 backlog boundary.

Pre-execution review results:

- `files_modified` is limited to Phase 13 evidence documents; each plan output is a Phase 13 summary document.
- Smoke compile commands in Plan 13-02 write only under `/tmp/opencode/taxonomy-phase13-smoke`.
- Protected source/input/artifact paths are diff-clean at preflight review.
- `data/compiled/v1` and `data/compiled/v2` are read/protected only and must not be overwritten.
- `src/cli/parse_args.ts` is read/protected only and must not be edited.
- `graphify-out/*` is currently dirty in the workspace but is protected from Phase 13 mutation, staging and commit.
- Phase 14 backlog capture is documentation-only; no curation or soft-finding cleanup is authorized.

## Required Baseline

Phase 13 starts from Phase 12 closure:

- taxonomy seed v2 is the default;
- official `data/compiled/v2/` artifacts are present;
- `data/compiled/v1/` remains preserved as baseline/archive;
- explicit rollback to v1 defaults was dry-run validated;
- Phase 11 accepted soft findings remain accepted with policy.

## Captured Stabilization Policy

Phase 13 execution must preserve these captured decisions:

- Consumer inventory covers the full repository: code, tests, npm scripts, documented CLI commands, README/docs, planning docs and versioned artifacts.
- Default v2 smoke tests must compile to temporary output under `/tmp`, not directly to `data/compiled/v2`.
- Explicit v1 fallback must use complete flags and temporary output under `/tmp`, never `data/compiled/v1`.
- Blocking docs are current/user-facing docs and CLI docs that communicate defaults or fallback behavior.
- `graphify-out/*` is protected and plan-gated, not authoritative taxonomy correctness evidence without a dedicated plan.
- CI/hooks/generated artifact verification must use diff-clean gates.
- Phase 13 closes with a structured release confidence checklist.
- Phase 14 items remain backlog-only unless a true post-promotion stabilization blocker is found.

## Required Future Planning Coverage

During execution, Phase 13 plans must verify:

- in-repo consumers and default-path assumptions;
- CLI default v2 behavior through safe `/tmp` smoke output;
- explicit v1 fallback commands and docs through safe `/tmp` output;
- v1/v2 artifact coherence and overwrite safety;
- docs, release notes and migration guidance alignment;
- `graphify-out/*` protected/plan-gated policy;
- CI/hooks/generated artifact dirty-worktree risks;
- protected path diff checks before and after smoke tests;
- post-promotion risks;
- Phase 14 backlog candidates.

## Required Final Checklist Shape

Phase 13 closure should produce a release confidence checklist with these areas:

1. Consumer inventory
2. Default v2 smoke test
3. Explicit v1 fallback
4. Docs consistency
5. Graphify policy
6. CI/hooks/generated artifacts
7. Protected path diff checks
8. Release confidence final
9. Phase 14 backlog boundary

Each area must use one of these statuses:

- `pass`
- `accepted_with_policy`
- `follow_up`
- `blocker`

Phase 13 may close only when no active blockers remain and protected paths are diff-clean.

## Current Allowed Files

Allowed file writes during stabilization-only execution:

- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-01-CONSUMER-INVENTORY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-01-SUMMARY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-02-SMOKE-VALIDATION.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-02-SUMMARY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-03-GENERATED-ARTIFACT-POLICY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-03-SUMMARY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-04-RELEASE-CONFIDENCE-CHECKLIST.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-04-SUMMARY.md`

The only allowed non-Phase-13 writes made by this preflight review are this `13-PREFLIGHT.md` update and the matching `13-VALIDATION.md` approval update. All future Phase 13 execution writes must stay within the allowlist above.
