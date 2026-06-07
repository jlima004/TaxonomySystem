# Phase 53: Alias Integrity Gate Hardening - Context

**Gathered:** 2026-06-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 53 hardens the local alias integrity guardrail without changing the normal `compile` path, and refactors the alias target inventory test to reuse the shared validator where appropriate. This phase may adjust local quality scripts, tests, and stable test fixtures if needed, but it must not perform CI wiring, taxonomy/data mutation, compiled artifact publication, or any work outside the existing alias integrity/testing boundary.

</domain>

<decisions>
## Implementation Decisions

### Historical Fixture State
- **D-01:** Historical planning-artifact fixture stabilization is already satisfied before Phase 53 planning. Do not treat "fix broken fixtures" as a new Task 1 for this phase.
- **D-02:** Treat the following as preconditions already true and preserve them during implementation: stable fixtures exist under `src/tests/fixtures/...`; focused planning-artifact tests pass; full `src` test suite passes; `npm --prefix src run alias:integrity -- --json` passes with baseline `341/18/0`.

### Local Guardrail Wiring
- **D-03:** Add `verify:integrity` as the official local guardrail command.
- **D-04:** Keep `alias:integrity` as the existing base command; `verify:integrity` is the semantic/local-proof interface on top of it.
- **D-05:** `verify:integrity` must, when run standalone, produce the same machine-readable alias integrity proof and fail non-zero when unresolved alias targets exist.
- **D-06:** Update `compile:quality` to include the alias integrity verification path if this can be done cleanly.
- **D-07:** `npm run compile` must remain completely unchanged and must not call `alias:integrity`, `verify:integrity`, or `compile:quality`.
- **D-08:** The planner may choose the technical wiring needed to avoid redundant rebuilds inside `compile:quality`, as long as the external behavior remains: `verify:integrity` is the official local gate and `compile` stays alias-gate-free.

### Safety Guard Boundary
- **D-09:** Keep `safety:guard` separate in Phase 53.
- **D-10:** `safety:guard` should remain focused on staged/dirty protected-path enforcement and should not be merged with alias semantic integrity checks in this phase unless planning uncovers a compelling structural reason.

### Inventory Test Refactor
- **D-11:** Phase 53 should refactor `src/tests/inventory/alias_target_inventory.test.ts` to reuse `validateAliasTargetIntegrity` directly where appropriate, because reducing duplicated dangling-target logic is part of TEST-01.
- **D-12:** Preserve historical artifact/fixture coverage while doing that refactor; the test must still validate the documentary inventory contract and its historical rationale.
- **D-13:** Do not modify production validator behavior merely to satisfy the test refactor.
- **D-14:** Preserve the operational baseline during refactor: `341` compiled descriptors, `18` valid alias targets, `0` unresolved targets.

### Required Proof Package
- **D-15:** Required proof includes `npm --prefix src run alias:integrity -- --json` returning PASS with `341/18/0`.
- **D-16:** Required proof includes the new local guardrail command passing.
- **D-17:** If `compile:quality` is changed to include the gate, required proof includes `npm --prefix src run compile:quality` passing.
- **D-18:** Required focused regression command is `npm --prefix src test -- tests/inventory/alias_target_inventory.test.ts tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts`.
- **D-19:** Required full regression command is `npm --prefix src test`.
- **D-20:** Required static proof includes inspecting `src/package.json` to confirm `compile` does not call `alias:integrity`, `verify:integrity`, or `compile:quality`.
- **D-21:** Required dynamic proof includes executing `npm --prefix src run compile -- --out /tmp/phase53-compile-smoke` and confirming it exits `0`.
- **D-22:** Required proof includes `npm --prefix src run typecheck` passing.
- **D-23:** Required boundary proof includes confirming no changes are made to `data/taxonomy/taxonomy-seed.v2.json`, descriptor alias policy files, `data/compiled/v2/*`, Graphify, scoring, UI, MVP, or Knowledge Engine scope.

### Scope Fence
- **D-24:** Phase 53 may touch `src/package.json`, local quality-script wiring, `src/tests/**`, and `src/tests/fixtures/**` if needed.
- **D-25:** Phase 53 must not wire CI; CI belongs to Phase 54.
- **D-26:** Phase 53 must not publish artifacts or mutate taxonomy truth.

### the agent's Discretion
- The planner may choose the smallest clear implementation for `verify:integrity` and `compile:quality` wiring, including how to avoid duplicate builds, provided the locked behavior above is preserved.
- The planner may decide exactly which assertions inside `alias_target_inventory.test.ts` should switch to shared-validator usage versus remain documentary/fixture checks.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone And Phase Scope
- `.planning/ROADMAP.md` - Phase 53 goal, success criteria, dependency on Phase 52, and v2.10 scope boundaries.
- `.planning/REQUIREMENTS.md` - GATE-01, GATE-02, GATE-03, TEST-01, TEST-02, and out-of-scope constraints for v2.10.
- `.planning/PROJECT.md` - milestone intent, protected baseline `341/18/0`, and explicit preference for quality/safety flows instead of normal compile.
- `.planning/STATE.md` - current milestone status and carry-forward decisions for v2.10.
- `.planning/phases/52-retroactive-verification-closure/52-CONTEXT.md` - carry-forward Phase 52 scope fence and explicit deferral of alias hardening to Phase 53.

### Prior Alias Integrity Decisions
- `.planning/milestones/v2.9-ROADMAP.md` - original implementation note for `validateAliasTargetIntegrity`, opt-in `alias:integrity`, and the known inventory-test duplication follow-up.
- `.planning/milestones/v2.9-MILESTONE-AUDIT.md` - audit findings W-02/W-03 about inventory-test duplication and optional hardening direction.

### Guardrail And Script Integration Points
- `src/package.json` - current script wiring for `compile`, `compile:quality`, `safety:guard`, and `alias:integrity`.
- `scripts/check-safety-guards.sh` - current `safety:guard` behavior and its file-protection-only responsibility.
- `src/cli/alias_integrity.ts` - CLI proof surface that already invokes the shared validator on live data.
- `src/compiler/alias_target_integrity.ts` - shared validator and JSON proof contract that downstream work must reuse rather than duplicate.

### Test And Fixture Contracts
- `src/tests/inventory/alias_target_inventory.test.ts` - current inventory regression contract and the main TEST-01 refactor target.
- `src/tests/compiler/alias_target_integrity.test.ts` - validator-level regression coverage for PASS/FAIL and exception-policy behavior.
- `src/tests/cli/alias_integrity.test.ts` - npm script wiring contract and JSON proof assertions for the alias integrity CLI.
- `src/tests/curation/taxonomy_seed_v2.test.ts` - stable-fixture resolution pattern already used for historical planning artifacts.
- `src/tests/fixtures/inventory/49-ALIAS-TARGET-INVENTORY.md` - stable historical inventory artifact now used by tests.
- `src/tests/fixtures/curation/51-SAFE-FIT-RATIONALE.md` - stable historical remediation rationale fixture now used by tests.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/compiler/alias_target_integrity.ts`: pure shared validator that already returns the PASS/FAIL counts and unresolved entries needed by TEST-01 and local guardrail wiring.
- `src/cli/alias_integrity.ts`: existing CLI entry point that already converts live repo data into the validator's JSON proof output.
- `src/tests/helpers/resolve_existing_path.ts`: established test helper for fixture-first resolution with planning-path fallback.

### Established Patterns
- `src/package.json` keeps `alias:integrity` separate from `build`, `test`, `precompile`, and `compile`; hardening should preserve this split for the normal compile path.
- Historical planning-artifact tests use stable fixtures under `src/tests/fixtures/...` first and only then fall back to planning archives.
- The codebase already treats alias integrity as a standalone proof command with JSON output, which makes a semantic wrapper script viable without changing production logic.

### Integration Points
- `compile:quality` in `src/package.json` is the preferred local quality-flow insertion point for the alias integrity gate.
- `alias_target_inventory.test.ts` is the main integration point for replacing duplicated dangling-target logic with shared-validator assertions while retaining documentary checks.
- `alias_integrity.test.ts` is the natural place to extend script-wiring guarantees if new local guardrail scripts are added.

</code_context>

<specifics>
## Specific Ideas

- Phase 53 should be understood as: (1) solidify a local alias integrity guardrail, (2) refactor the inventory test to reuse the shared validator where appropriate, and (3) prove the normal compile path remains clean while quality flow captures alias integrity.
- `verify:integrity` is the official local guardrail name.
- The historical fixture issue is no longer an open implementation problem for this phase; it is a satisfied precondition to preserve.
- Desired standalone behavior for `verify:integrity`: same JSON proof shape as `alias:integrity`, same non-zero failure semantics on unresolved alias targets, same live baseline `PASS 341/18/0`.
- Desired compile proof command: `npm --prefix src run compile -- --out /tmp/phase53-compile-smoke`.

</specifics>

<deferred>
## Deferred Ideas

- CI wiring remains Phase 54 work.
- Any decision to merge `safety:guard` with alias semantic checks is deferred unless Phase 53 planning uncovers a strong structural need.
- Taxonomy seed mutation, compiled artifact publication/mutation, alias exception policy changes, Graphify, scoring, UI, MVP, and Knowledge Engine remain out of scope.

</deferred>

---

*Phase: 53-Alias Integrity Gate Hardening*
*Context gathered: 2026-06-06*
