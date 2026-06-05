# Phase 50: Alias Target Integrity Automation - Context

**Gathered:** 2026-06-05T19:51:16Z
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 50 implements alias target integrity automation and the documented exception policy mechanism for HYG-02 and HYG-03.

The phase delivers a reusable validator, a focused proof command, tests/fixtures for validator behavior, an npm script entrypoint, and an empty versioned exception policy file. It must prove that current live data has exactly one unresolved alias target: `ylang ylang -> ylang_ylang`.

Phase 50 is not a remediation phase. It must not fix, drop, migrate, or except `ylang ylang -> ylang_ylang`; Phase 51 owns that decision and mutation.

</domain>

<decisions>
## Implementation Decisions

### Gate Placement

- **D-50-01:** Implement a reusable alias target integrity validator under `src/`. The validator is the core logic and should be usable by tests and the CLI/proof command.
- **D-50-02:** Add a focused CLI/check command under `src/cli/` or the closest project convention. This command validates live alias targets by reading `data/taxonomy/descriptor_aliases.seed.json`, compiled descriptor IDs from `data/compiled/v2/taxonomy.json`, and the exception policy file.
- **D-50-03:** Phase 50 uses a proof-command-only enforcement model. The live-data gate is allowed and expected to fail before Phase 51 because current data contains the unresolved `ylang ylang -> ylang_ylang` target.
- **D-50-04:** Default `npm test` and normal compile must remain green during Phase 50. Do not wire the live-data failure into default test or compile flows yet.
- **D-50-05:** Tests should cover validator behavior with fixtures: all targets valid -> pass; dangling target without exception -> fail; dangling target with documented approved exception -> pass; current live data proof command reports exactly one failure.

### Exception Policy Shape

- **D-50-06:** Create `data/taxonomy/alias_target_exceptions.v1.json` as the executable source of truth for alias target exceptions. Planning docs may explain decisions, but automation consumes this data file explicitly.
- **D-50-07:** Initial policy file content is:

```json
{
  "version": "1.0.0",
  "schema_version": "alias_target_exceptions.v1",
  "exceptions": []
}
```

- **D-50-08:** Empty exception lists are valid.
- **D-50-09:** Future exception entries must require at least: `alias`, `target`, `rationale`, `status` such as `approved`, `approved_by` or `source`, `approved_at` or `milestone`, and `review_policy` or `expiry` when applicable.
- **D-50-10:** `ylang ylang -> ylang_ylang` must not be added as an exception in Phase 50. The policy file starts and remains empty in this phase.

### Failure Reporting

- **D-50-11:** The focused command exits non-zero when unresolved alias targets exist without approved exceptions.
- **D-50-12:** Default command output is concise, human-readable, and side-effect free. It must not write a report file by default.
- **D-50-13:** The command also supports JSON output, for example via `--json`, for deterministic tests and Phase 51 proof.
- **D-50-14:** Failure output must include summary counts, each unresolved `alias -> target`, source file, whether an approved exception exists, and a remediation hint.
- **D-50-15:** For current live data before Phase 51, failing output must report exactly one unresolved target: `ylang ylang -> ylang_ylang`.
- **D-50-16:** Human output should follow this shape:

```text
Alias target integrity: FAIL
Seed aliases: 18
Compiled descriptors: 340
Valid targets: 17
Unresolved targets: 1

Unresolved:
- alias: ylang ylang
  target: ylang_ylang
  source: data/taxonomy/descriptor_aliases.seed.json
  exception: none
  hint: resolve in Phase 51 by adding target, correcting alias, dropping alias, or documenting an approved exception.
```

- **D-50-17:** JSON output should expose equivalent machine-readable fields: `status`, `seed_alias_count`, `compiled_descriptor_count`, `valid_target_count`, `unresolved_target_count`, and an `unresolved` array with `alias`, `target`, `source`, `exception_status`, and `remediation_hint`.

### Phase 51 Proof Path

- **D-50-18:** Add a named npm script in `src/package.json`, preferably `alias:integrity`, that runs the focused alias target integrity command.
- **D-50-19:** `npm run alias:integrity` is the deterministic proof command Phase 51 must run before and after remediation.
- **D-50-20:** Before Phase 51 remediation, `npm run alias:integrity` exits non-zero and reports exactly one unresolved target: `ylang ylang -> ylang_ylang`.
- **D-50-21:** After Phase 51 remediation, the same command should exit zero, unless an approved exception policy explicitly documents the unresolved target.
- **D-50-22:** The script must support JSON output via `npm run alias:integrity -- --json`.
- **D-50-23:** The planner may adjust the script name only if an existing project convention strongly suggests another name. Preferred name remains `alias:integrity`.

### Non-Remediation Boundary

- **D-50-24:** Phase 50 may change only automation and policy surfaces: reusable validator code, focused CLI/check command, focused tests/fixtures, `src/package.json` script, empty `data/taxonomy/alias_target_exceptions.v1.json`, and Phase 50 planning/verification/summary docs.
- **D-50-25:** Phase 50 must not change `data/taxonomy/descriptor_aliases.seed.json`.
- **D-50-26:** Phase 50 must not change `data/taxonomy/taxonomy-seed.v2.json`.
- **D-50-27:** Phase 50 must not change `data/compiled/v2/*` or publish compiled artifacts.
- **D-50-28:** Phase 50 must not touch low_support, seed_corpus_conflict, scoring, Graphify, MVP/SaaS, Knowledge Engine, or UI surfaces.
- **D-50-29:** Phase 50 must not remediate `ylang ylang -> ylang_ylang` by add-target, alias correction, alias drop, migration, or exception approval.

### the agent's Discretion

- The exact TypeScript module/function names are planner discretion, as long as the validator is reusable and the CLI/proof command consumes it.
- The exact JSON schema implementation details are planner discretion, as long as the required exception fields are enforced and the initial empty exception file is valid.
- The exact CLI file path is planner discretion within `src/cli/` or the closest project convention.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope and Requirements

- `.planning/ROADMAP.md` — Phase 50 goal, details, dependency on Phase 49, and boundary that Phase 51 owns remediation.
- `.planning/REQUIREMENTS.md` — HYG-02 and HYG-03 mapped to Phase 50; HYG-01 mapped to Phase 51.
- `.planning/PROJECT.md` — v2.9 milestone goal, current state, out-of-scope list, and key decision that `ylang ylang -> ylang_ylang` remains pending.
- `.planning/STATE.md` — Phase 49 completion state and decisions confirming exactly one dangling alias target.

### Required Phase 49 Handoff

- `.planning/phases/49-alias-target-integrity-inventory/49-CONTEXT.md` — locked inventory classification and Phase 50/51 handoff decisions.
- `.planning/phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md` — evidence-backed source of truth: 18 aliases audited, 17 valid targets, 1 dangling target, `ylang ylang -> ylang_ylang` classified as `remediation_required`.

### Live Data Sources

- `data/taxonomy/descriptor_aliases.seed.json` — seed alias map; Phase 50 reads but must not mutate.
- `data/compiled/v2/descriptor_aliases.json` — compiled alias artifact; Phase 49 proved seed and compiled aliases are identical.
- `data/compiled/v2/taxonomy.json` — compiled taxonomy descriptor IDs; target lookup source for the live proof command.
- `data/taxonomy/taxonomy-seed.v2.json` — read-only sanity reference for seed descriptors; must not be mutated in Phase 50.
- `data/taxonomy/alias_target_exceptions.v1.json` — new empty exception policy file to create and consume explicitly.

### Existing Compiler and CLI Surfaces

- `src/compiler/compile_all.ts` — combines schema validation and artifact quality gates via `runArtifactQualityGates`.
- `src/compiler/quality_gates.ts` — existing artifact quality gates; currently checks candidate-marker aliases but not alias target resolution.
- `src/compiler/validate_output.ts` — existing compiled alias schema validation; validates alias map shape/self-reference but not target existence.
- `src/compiler/compile_aliases.ts` — deterministic alias artifact compilation from seed map.
- `src/cli/compile.ts` — existing CLI pattern for argument parsing, validation errors, non-zero exit on validation failure, and console summaries.
- `src/package.json` — npm scripts; add the Phase 50 proof script here.

### Existing Tests and Patterns

- `src/tests/curation/alias_seed_v2.test.ts` — current alias curation contract with legacy-preservation loophole; useful context but Phase 50 needs stronger explicit exception-policy validation.
- `src/tests/compiler/quality_gates.test.ts` — quality gate fixture style and failure assertions.
- `src/tests/compiler/compile_all.test.ts` — compile validation behavior, pure function expectations, and write rejection patterns.
- `src/tests/cli/compile.test.ts` — CLI test pattern for temp fixtures, output assertions, non-zero validation failure, and no side-effect report artifacts.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `runArtifactQualityGates` in `src/compiler/quality_gates.ts` already receives compiled taxonomy, aliases, and similarity artifacts and emits structured compiler validation errors. It is a possible integration point after Phase 51, but Phase 50 should not wire live-data failure into default compile yet.
- `validateCompiledAliases` in `src/compiler/validate_output.ts` already validates alias artifact shape and self-reference. It does not check whether alias targets resolve to compiled descriptor IDs.
- `compileAliases` in `src/compiler/compile_aliases.ts` sorts alias entries deterministically and preserves the curated seed map.
- `runCompileCli` in `src/cli/compile.ts` is the existing pattern for CLI commands that read JSON inputs, print concise summaries, and return non-zero on validation failure.

### Established Patterns

- TypeScript is strict, ESM-only, zero-runtime-dependency, and function-oriented.
- Tests use Vitest and prefer temp fixtures for CLI behavior.
- Validation commands should be side-effect free unless explicitly writing compiled outputs.
- `src/package.json` scripts expose discoverable commands such as `compile`, `compile:quality`, `safety:guard`, and `test`.
- Prior publication/remediation phases preserve protected data boundaries and make official artifact publication a separate explicit phase.

### Integration Points

- Phase 50 should add validator tests that operate on small fixtures, not by making default live-data tests fail.
- Phase 50 should add a focused command reachable through `npm run alias:integrity`.
- Phase 51 should use the Phase 50 command as before/after proof: fail with exactly one unresolved target before remediation, pass after remediation or approved exception.

</code_context>

<specifics>
## Specific Ideas

- Current live data must remain a deliberate failing proof case during Phase 50: exactly `ylang ylang -> ylang_ylang`.
- The exception policy file is intentionally empty in Phase 50. This proves the validator can load policy and still detect the current unresolved target.
- The failure message should guide Phase 51 without choosing the remediation path: add target, correct alias, drop alias, or document an approved exception.
- JSON output exists for deterministic assertions and planning proof; no report file is written by default.

</specifics>

<deferred>
## Deferred Ideas

- Wire `alias:integrity` into default `npm test` or normal compile as a hard gate after Phase 51 remediation.
- Remediate `ylang ylang -> ylang_ylang` by add-target, alias correction, alias drop, or approved exception in Phase 51.
- Any low_support, seed_corpus_conflict, scoring, Graphify, MVP/SaaS, Knowledge Engine, or UI work belongs to future phases.

</deferred>

---

*Phase: 50-Alias-Target-Integrity-Automation*
*Context gathered: 2026-06-05T19:51:16Z*
