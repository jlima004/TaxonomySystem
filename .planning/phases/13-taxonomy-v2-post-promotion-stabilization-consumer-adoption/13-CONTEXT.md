# Phase 13: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption - Context

> **Canonical context document.** This is the authoritative starting input for future Phase 13 research and planning.

**Date:** 2026-05-25
**Phase:** 13-taxonomy-v2-post-promotion-stabilization-consumer-adoption
**Status:** context_captured
**Execution readiness:** not_ready_for_execution
**Decision count:** 51 (`POST-D-01` through `POST-D-12`, `STAB-D-01` through `STAB-D-39`)

---

## 1. Phase Goal

Validate and stabilize the project after the Phase 12 promotion of taxonomy seed v2 to default. Phase 13 should build confidence that consumers, docs, CLI behavior, explicit v1 fallback, versioned artifacts and graph-related generated outputs are coherent after the promotion.

Decisions:

- `POST-D-01`: Phase 13 is a post-promotion stabilization and consumer-adoption phase.
- `POST-D-02`: Phase 13 starts in `context_gathering` with `not_ready_for_execution` readiness.
- `POST-D-03`: Phase 13 depends on Phase 12 being closed with v2 default active.

---

## 2. Hard Boundaries

Phase 13 does not authorize taxonomy curation or taxonomy source mutations.

Protected paths:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/compiled/v1/**`
- `data/compiled/v2/**`, except validation may read and compare existing artifacts
- `src/cli/parse_args.ts`
- `graphify-out/*`, unless a separate explicit plan authorizes mutation or regeneration

Decisions:

- `POST-D-04`: No new taxonomy curation is in scope for Phase 13.
- `POST-D-05`: v2 seed, v2 curated relation, v2 accord map and descriptor alias seed inputs are protected/no-edit.
- `POST-D-06`: Existing v1 and v2 compiled artifacts must not be overwritten during context gathering.
- `POST-D-07`: `graphify-out/*` is treated as protected until Phase 13 explicitly decides and plans its policy.

---

## 3. Required Stabilization Areas

Phase 13 planning should cover these areas before execution:

- Consumer audit for in-repo usages of CLI defaults, `DEFAULT_PATHS`, explicit paths and compiled artifacts.
- CLI default validation for v2 behavior.
- Explicit v1 fallback validation and documentation.
- Artifact coherence checks for `data/compiled/v1/` and `data/compiled/v2/`.
- Documentation alignment across README, CLI docs, migration/release notes and planning docs.
- `graphify-out/*` policy after v2 default promotion.
- Post-promotion risk capture.
- Phase 14 backlog capture.

Decisions:

- `POST-D-08`: Phase 13 must verify consumers, docs, CLI and fallback behavior before execution closure.
- `POST-D-09`: Phase 13 must verify both v1 and v2 artifact sets remain coherent and discoverable.
- `POST-D-10`: Phase 13 must capture risks and backlog candidates without executing future curation.

---

## 4. Planning Constraints

No executable Phase 13 plan exists yet. Future planning must preserve the hard boundaries and should separate read-only validation from any allowed documentation or policy updates.

Allowed during context gathering:

- Planning documents under `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/`.
- Tracking updates in `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md` and `.planning/STATE.md`.
- Read-only inspection of source, docs and generated artifacts.

Not allowed during context gathering:

- Code changes.
- Seed/data source changes.
- Compiled artifact regeneration or overwrite.
- `src/cli/parse_args.ts` changes.
- `graphify-out/*` mutation.
- Phase 14 implementation.

Decisions:

- `POST-D-11`: Context gathering may update GSD tracking and Phase 13 planning artifacts only.
- `POST-D-12`: Any future executable work requires an approved Phase 13 plan.

---

## 5. Stabilization Decisions

### Consumer Inventory

- `STAB-D-01`: The Phase 13 consumer inventory will have full in-repo scope.
- `STAB-D-02`: The inventory will include source code, tests, npm scripts, documented CLI commands, README/docs, planning docs and versioned artifacts that mention defaults, explicit paths or compiled outputs.
- `STAB-D-03`: The inventory is read-only during context gathering and does not authorize automatic fixes.
- `STAB-D-04`: References to v1 are not errors by themselves; they must be classified as `baseline/archive`, `explicit_fallback`, `stale_reference` or `legacy_context`.

Inventory search targets:

- `DEFAULT_PATHS`
- `taxonomy-seed.v1.json`
- `taxonomy-seed.v2.json`
- `curated_relations.v1.json`
- `curated_relations.v2.json`
- `accord_map.v1.json`
- `accord_map.v2.json`
- `data/compiled/v1`
- `data/compiled/v2`
- `version: 1.0.0`
- `version: 2.0.0`
- `npm run compile`
- CLI flags: `--seed`, `--relations`, `--accords`, `--out`, `--version`

### Default V2 Smoke Tests

- `STAB-D-05`: Default v2 smoke tests will use temporary output, not direct writes to `data/compiled/v2`.
- `STAB-D-06`: Phase 13 will validate `DEFAULT_PATHS` and run an equivalent default compile with `--out /tmp/...` and fixed `--generated-at`.
- `STAB-D-07`: The smoke test may compare temporary output with official v2 artifacts, provided `data/compiled/v2` remains diff-clean.
- `STAB-D-08`: Tests-only is not sufficient as the primary policy because it does not validate the post-promotion runtime compile path.

Expected default v2 smoke policy:

- Assert `DEFAULT_PATHS.seedPath = data/taxonomy/taxonomy-seed.v2.json`.
- Assert `DEFAULT_PATHS.relationsPath = data/inference/curated_relations.v2.json`.
- Assert `DEFAULT_PATHS.accordsPath = data/inference/accord_map.v2.json`.
- Assert `DEFAULT_PATHS.outputDir = data/compiled/v2`.
- Assert `DEFAULT_PATHS.version = 2.0.0`.
- Compile using default v2 inputs/version but override output to `/tmp/opencode/taxonomy-phase13-smoke/default-v2`.
- Use `--generated-at 2026-01-01T00:00:00.000Z` for deterministic comparison.
- Validate the temporary output contains `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json`.
- Confirm `taxonomy.json.version = 2.0.0`, validation status is ok and quality gate passes.
- Compare counts or semantic content against official `data/compiled/v2` when useful.
- Confirm `git diff --exit-code -- data/compiled/v2 data/compiled/v1` remains clean.

### Explicit V1 Fallback

- `STAB-D-09`: Explicit v1 fallback will be validated by compile with complete explicit flags.
- `STAB-D-10`: v1 fallback must write only to temporary output under `/tmp`, never to `data/compiled/v1`.
- `STAB-D-11`: v1 fallback must not depend on `DEFAULT_PATHS`, because the post-Phase 12 default is v2.
- `STAB-D-12`: Phase 13 will not execute a real rollback; rollback remains validated/documented by Phase 12.
- `STAB-D-13`: v1 fallback validation must confirm official v1 and v2 artifacts remain diff-clean.

Expected v1 fallback command, from the `src/` package directory:

```bash
npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z
```

Expected v1 fallback checks:

- Temporary output contains `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json`.
- `taxonomy.json.version = 1.0.0`.
- Validation status is ok and quality gate passes.
- `data/compiled/v1` remains diff-clean.
- `data/compiled/v2` remains diff-clean.
- `DEFAULT_PATHS` remain v2.
- No seed, inference, alias or official artifact file changes.

### Docs Consistency

- `STAB-D-14`: Docs consistency blocking scope will focus on user-facing/current-state docs.
- `STAB-D-15`: README, release/migration notes, Phase 13 context/preflight and CLI docs that mention defaults/fallback are blocking if inconsistent.
- `STAB-D-16`: Historical planning docs do not block only because they record old state, unless they communicate current state incorrectly.
- `STAB-D-17`: Docs must not say v1 was removed, soft findings were resolved, or v1 is still default.
- `STAB-D-18`: Phase 13 will not perform a broad documentation sweep without an explicit plan.

Blocking inconsistencies include:

- Saying or implying v1 is still default.
- Saying `data/compiled/v1` was removed.
- Saying v2 physically replaced `data/compiled/v1`.
- Hiding that `data/compiled/v2` is the current official artifact set.
- Hiding that v1 fallback requires explicit paths.
- Claiming soft findings were resolved when they were only `accepted_with_policy`.
- Presenting new curation as part of Phase 13.
- Documenting a default compile path that would write to the wrong place.

### Graphify Policy

- `STAB-D-19`: `graphify-out/*` will be treated as protected and plan-gated in Phase 13.
- `STAB-D-20`: Preexisting changes in `graphify-out/*` do not block the phase by themselves, but they cannot enter commits without an explicit plan.
- `STAB-D-21`: Regeneration or mutation of `graphify-out/*` requires its own plan, allowlist and diff policy.
- `STAB-D-22`: Hooks that update `graphify-out/*` must be documented as a commit-contamination risk.
- `STAB-D-23`: Phase 13 will not use `graphify-out/*` as authoritative taxonomy correctness evidence without an explicit plan.

If a future plan needs Graphify, it must declare:

- Expected files under `graphify-out/*`.
- Generation command.
- Acceptable diff criteria.
- Whether the artifact is versioned or local-only.
- Separate commit policy, if applicable.

### CI, Hooks And Generated Artifacts

- `STAB-D-24`: Phase 13 will use diff-clean gates as the primary verification level.
- `STAB-D-25`: Planned execution should include typecheck, tests, build and smoke compiles in `/tmp`.
- `STAB-D-26`: Smoke compiles must not write to `data/compiled/v1` or `data/compiled/v2`.
- `STAB-D-27`: Protected path diff checks are mandatory before and after smoke tests.
- `STAB-D-28`: Outputs generated by hooks do not enter Phase 13 commits without an explicit plan.
- `STAB-D-29`: Full CI mimic is outside the initial scope unless a future plan detects a clear need.

Expected verification commands or equivalents:

- `npm run typecheck`
- `npm test`
- `npm run build`
- Default v2 smoke compile to `/tmp/opencode/taxonomy-phase13-smoke/default-v2`.
- Explicit v1 fallback compile to `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback`.

Mandatory protected diff targets:

- `data/compiled/v1`
- `data/compiled/v2`
- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v1.json`
- `data/inference/accord_map.v2.json`
- `src/cli/parse_args.ts`

### Release Confidence Checklist

- `STAB-D-30`: Phase 13 will close with a structured pass/block checklist.
- `STAB-D-31`: Each area must have status `pass`, `accepted_with_policy`, `follow_up` or `blocker`.
- `STAB-D-32`: The final checklist must include evidence, commands run when applicable and protected diff result.
- `STAB-D-33`: Phase 13 may close only if there are no active blockers.
- `STAB-D-34`: Non-blocking curation, soft finding and backlog items will be routed to Phase 14, not resolved in Phase 13.

Required checklist areas:

1. Consumer inventory
2. Default v2 smoke test
3. Explicit v1 fallback
4. Docs consistency
5. Graphify policy
6. CI/hooks/generated artifacts
7. Protected path diff checks
8. Release confidence final
9. Phase 14 backlog boundary

Each checklist item should include:

- `area`
- `status`
- `evidence`
- `commands_run`, if applicable
- `protected_diff_result`
- `artifacts_touched`
- `follow_up`, if applicable
- `blocker_reason`, if applicable

Blockers include:

- Default v2 smoke failure.
- Explicit v1 fallback failure.
- Current docs saying v1 is still default.
- Current docs saying v1 was removed.
- Current docs saying accepted soft findings were resolved.
- Unexpected diff in `data/compiled/v1` or `data/compiled/v2`.
- Diff in protected seed/input files.
- Diff in `src/cli/parse_args.ts`.
- `graphify-out/*` entering a commit without explicit plan.
- Hooks generating changes outside the allowlist without documentation.

### Phase 14 Backlog Boundary

- `STAB-D-35`: Phase 13 will capture future items only as backlog, without executing curation fixes.
- `STAB-D-36`: Soft findings, review queue, alias cleanup, graph density and curation candidates are Phase 14+ backlog.
- `STAB-D-37`: Phase 13 may document gaps and ideas, but must not alter taxonomy, inference, alias or artifact files.
- `STAB-D-38`: Fixes enter Phase 13 only if they are real post-promotion stabilization blockers.
- `STAB-D-39`: The final backlog must separate `follow_up_phase_14`, `follow_up_later`, `accepted_with_policy` and `not_in_scope_phase_13`.

Allowed Phase 13 actions:

- Inventory.
- Classify.
- Validate.
- Document.
- Open follow-up.
- Register backlog.

Not allowed in Phase 13:

- Edit `taxonomy-seed.v2.json`.
- Edit `curated_relations.v2.json`.
- Edit `accord_map.v2.json`.
- Edit `descriptor_aliases.seed.json`.
- Edit `data/compiled/v1`.
- Edit `data/compiled/v2`.
- Change `src/cli/parse_args.ts`.
- Promote new descriptors.
- Add aliases.
- Add relations or accords.
- Resolve soft findings.
- Reduce review queue.

---

## 6. Canonical References

Downstream agents must read these before planning or implementing Phase 13.

### Project State And Requirements

- `.planning/PROJECT.md` — Current project value, v2 default status, constraints and key decisions through Phase 12.
- `.planning/REQUIREMENTS.md` — Phase 13 requirements `POST-01` through `POST-08` and traceability.
- `.planning/STATE.md` — Project state and latest recorded phase boundary; downstream agents should prefer this `13-CONTEXT.md` for the captured `context_captured` / `not_ready_for_execution` decision set.
- `.planning/ROADMAP.md` — Phase 13 goal, dependencies, status and required planning coverage.

### Phase 13 Artifacts

- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md` — This canonical context.
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-DISCUSSION-LOG.md` — Audit trail for the selected options and user rationale.
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-PREFLIGHT.md` — Non-executable boundary and allowed next step.

### Upstream Promotion Decisions

- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md` — Phase 12 final approval, staged gates, default switch, v2 artifact publication, rollback and commit strategy decisions.
- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-5-ROLLBACK-DRY-RUN.md` — Validated rollback dry-run evidence with `rollback_success: true`.
- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-RELEASE-MIGRATION-NOTES.md` — Release/migration notes that should remain consistent with current docs.
- `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md` — Soft findings, legacy alias exception, graph/review readiness and future promotion policy.

### Code And Tests

- `src/cli/parse_args.ts` — `DEFAULT_PATHS` source of truth for CLI/compiler default inputs, output and version.
- `src/package.json` — npm scripts for build, typecheck, compile and tests.
- `src/tests/curation/v1_v2_comparison.test.ts` — Existing tests for atomic v2 defaults, explicit v1/v2 compiles and determinism.
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Existing v2 seed/default preservation and curation contract tests.
- `src/tests/cli/compile.test.ts` — CLI compile behavior, output writing, quality-report behavior and validation failure behavior.
- `README.md` — Current user-facing project status and default/fallback messaging.

### Generated And Protected Artifacts

- `data/compiled/v1/taxonomy.json` — Official preserved v1 taxonomy artifact.
- `data/compiled/v1/descriptor_aliases.json` — Official preserved v1 alias artifact.
- `data/compiled/v1/similarity_matrix.json` — Official preserved v1 similarity artifact.
- `data/compiled/v2/taxonomy.json` — Official v2 default taxonomy artifact.
- `data/compiled/v2/descriptor_aliases.json` — Official v2 default alias artifact.
- `data/compiled/v2/similarity_matrix.json` — Official v2 default similarity artifact.
- `graphify-out/*` — Protected/plan-gated graph artifacts; read/audit only unless a dedicated Graphify plan exists.

---

## 7. Existing Code Insights

### Reusable Assets

- `src/cli/parse_args.ts` exposes `DEFAULT_PATHS` and `parseCompileArgs`; this is the main default behavior inspection point.
- `src/cli/compile.ts` and `runCompileCli` are the runtime compile path for smoke validation.
- `src/tests/curation/v1_v2_comparison.test.ts` already encodes several v1/v2 determinism and explicit-path patterns useful for Phase 13 planning.
- `src/tests/curation/taxonomy_seed_v2.test.ts` already checks v2 as default seed path and v1 presence/version.
- `src/tests/cli/compile.test.ts` demonstrates safe temporary output testing and validates that `--quality-report` does not create extra artifacts.

### Established Patterns

- The project uses strict TypeScript, ESM modules and zero runtime dependency architecture.
- CLI validation should prefer explicit flags and temporary directories for generated outputs.
- Compiled artifacts are versioned by directory (`data/compiled/v1`, `data/compiled/v2`) rather than physically replacing v1.
- Curated seed/inference/alias files are authoritative inputs and must not be modified by stabilization work.
- Soft findings are handled by explicit disposition, not silent cleanup.

### Integration Points

- npm scripts live in `src/package.json`; Phase 13 commands should be planned relative to the `src/` package unless the plan explicitly wraps them from repo root.
- Docs and planning references span `README.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md` and Phase 12 release/migration notes.
- `graphify-out/*` may be touched by hooks or external graphify workflows, so commits must stage explicit files only and exclude graphify artifacts unless planned.

---

## 8. Deferred Ideas

The following are not Phase 13 execution work unless a real stabilization blocker is found. They should be captured as `follow_up_phase_14`, `follow_up_later`, `accepted_with_policy` or `not_in_scope_phase_13` in the final checklist/backlog:

- Remaining soft findings from Phase 11.
- Review queue reduction.
- Future alias cleanup, including `ylang ylang -> ylang_ylang`.
- Future curation candidates and descriptor promotions.
- Graph density or graph coverage improvements.
- Non-blocking docs improvements.
- Consumer gaps that do not invalidate current v2 default stability.
- Automation, CI, hook, Graphify, smoke-test and release-process improvements.

---

*Phase: 13-taxonomy-v2-post-promotion-stabilization-consumer-adoption*
*Context gathered: 2026-05-25*
