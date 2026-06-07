# Phase 53: Alias Integrity Gate Hardening - Research

**Researched:** 2026-06-06  
**Domain:** Local TypeScript/npm quality guardrail and Vitest regression hardening [VERIFIED: codebase read]  
**Confidence:** HIGH [VERIFIED: command output]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- CI wiring remains Phase 54 work.
- Any decision to merge `safety:guard` with alias semantic checks is deferred unless Phase 53 planning uncovers a strong structural need.
- Taxonomy seed mutation, compiled artifact publication/mutation, alias exception policy changes, Graphify, scoring, UI, MVP, and Knowledge Engine remain out of scope.
</user_constraints>

## Summary

Phase 53 should be planned as a small local-script/test hardening phase, not as a compiler or data mutation phase. [VERIFIED: `.planning/phases/53-alias-integrity-gate-hardening/53-CONTEXT.md`] The existing `alias:integrity` script already builds and runs `dist/cli/alias_integrity.js`, and the JSON proof currently reports `PASS`, `seed_alias_count: 18`, `compiled_descriptor_count: 341`, `valid_target_count: 18`, `unresolved_target_count: 0`, and `unresolved: []`. [VERIFIED: command output]

The minimal correct implementation is to add `verify:integrity` in `src/package.json` as the official local semantic guard, wire `compile:quality` to include that verification without changing `compile`, and refactor only the duplicated dangling-target logic in `src/tests/inventory/alias_target_inventory.test.ts` to call `validateAliasTargetIntegrity`. [VERIFIED: `src/package.json`; VERIFIED: `src/tests/inventory/alias_target_inventory.test.ts`; VERIFIED: `src/compiler/alias_target_integrity.ts`] `safety:guard` should remain separate because its current shell script only checks staged Graphify paths and staged/dirty protected paths and never runs semantic alias validation. [VERIFIED: `scripts/check-safety-guards.sh`]

**Primary recommendation:** Add `verify:integrity` as a wrapper around the existing alias proof command, update `compile:quality` to run compile quality plus `verify:integrity`, update CLI/script wiring tests, and refactor the inventory test to reuse `validateAliasTargetIntegrity` while preserving documentary inventory assertions. [VERIFIED: codebase read]

## Project Constraints (from AGENTS.md)

No `./AGENTS.md` file exists in the repository root, so there are no root AGENTS.md directives to apply. [VERIFIED: file read error]

Project rule `.agents/rules/graphify.md` says architecture/codebase questions should consult `graphify-out/GRAPH_REPORT.md`; this research did so. [VERIFIED: `.agents/rules/graphify.md`; VERIFIED: `graphify-out/GRAPH_REPORT.md`]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Local alias integrity proof | CLI / local npm scripts | Compiler validator | `alias:integrity` invokes `dist/cli/alias_integrity.js`, which calls `validateAliasTargetIntegrity` against live data. [VERIFIED: `src/package.json`; VERIFIED: `src/cli/alias_integrity.ts`] |
| Local quality guardrail | CLI / local npm scripts | Compiler CLI | `compile:quality` is currently an npm script that runs compile with `--quality-report`; Phase 53 should add alias proof to this quality path only. [VERIFIED: `src/package.json`] |
| Normal compile path | Compiler CLI | — | `compile` currently runs `node dist/cli/compile.js` and must remain alias-gate-free. [VERIFIED: `src/package.json`; VERIFIED: command output] |
| Protected path safety | Shell guard / git state | — | `safety:guard` reads git staged/dirty state for Graphify/protected paths and is non-mutating. [VERIFIED: `scripts/check-safety-guards.sh`] |
| Inventory regression coverage | Vitest tests | Shared compiler validator | `alias_target_inventory.test.ts` currently computes `valid` and `dangling` locally; the shared validator already exposes `valid_target_count` and `unresolved_target_count`. [VERIFIED: `src/tests/inventory/alias_target_inventory.test.ts`; VERIFIED: `src/compiler/alias_target_integrity.ts`] |

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Node.js | v24.14.0 | Runtime for npm scripts and compiled CLI execution. [VERIFIED: command output] | Existing project runtime in this environment. [VERIFIED: command output] |
| npm | 11.9.0 | Runs package scripts under `src`. [VERIFIED: command output] | Existing project package manager. [VERIFIED: command output] |
| TypeScript | `^5.8.0` in `src/package.json` | Builds `src/**/*.ts` to `dist`. [VERIFIED: `src/package.json`] | Existing build/typecheck tool. [VERIFIED: `src/package.json`] |
| Vitest | v3.2.4 observed in test runner; `^3.2.0` in package metadata | Runs focused and full test suites. [VERIFIED: command output; VERIFIED: `src/package.json`] | Existing test framework; no new framework is needed. [VERIFIED: `src/vitest.config.ts`] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| `validateAliasTargetIntegrity` | Project-local function | Shared alias target integrity result contract. [VERIFIED: `src/compiler/alias_target_integrity.ts`] | Reuse in inventory tests instead of duplicate dangling-target filtering. [VERIFIED: `src/tests/inventory/alias_target_inventory.test.ts`] |
| `runAliasIntegrityCli` | Project-local CLI runner | CLI proof and non-zero failure semantics. [VERIFIED: `src/cli/alias_integrity.ts`] | Keep as production proof surface; extend tests around script wiring, not production behavior. [VERIFIED: `src/tests/cli/alias_integrity.test.ts`] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `verify:integrity` wrapper around `alias:integrity` | Merge alias proof into `safety:guard` | Rejected by user decisions because `safety:guard` should remain file-protection focused. [VERIFIED: `53-CONTEXT.md`; VERIFIED: `scripts/check-safety-guards.sh`] |
| Reuse shared validator in inventory test | Keep manual `valid`/`dangling` calculation | Rejected for TEST-01 because the current inventory test duplicates target-resolution logic. [VERIFIED: `.planning/REQUIREMENTS.md`; VERIFIED: `src/tests/inventory/alias_target_inventory.test.ts`] |
| Add alias proof to `compile` | Add alias proof only to quality/local guardrail command | Rejected because normal compile must stay unchanged and alias-gate-free. [VERIFIED: `.planning/REQUIREMENTS.md`; VERIFIED: `53-CONTEXT.md`] |

**Installation:**

No package installation is required. [VERIFIED: `src/package.json`; VERIFIED: phase scope]

## Package Legitimacy Audit

Not applicable: Phase 53 should not install external packages. [VERIFIED: phase scope; VERIFIED: `src/package.json`]

## Architecture Patterns

### System Architecture Diagram

```text
Developer command
  ├─ npm --prefix src run compile
  │    └─ precompile/build → dist/cli/compile.js → writes compile outputs only to requested/default output dir
  │       (must NOT call alias:integrity, verify:integrity, or compile:quality)
  │       [VERIFIED: src/package.json; VERIFIED: src/cli/compile.ts]
  │
  ├─ npm --prefix src run verify:integrity
  │    └─ alias integrity proof path → dist/cli/alias_integrity.js → validateAliasTargetIntegrity
  │       ├─ PASS: JSON/text proof and exit 0
  │       └─ FAIL: unresolved entries and exit 1
  │       [VERIFIED: src/cli/alias_integrity.ts]
  │
  ├─ npm --prefix src run compile:quality
  │    └─ local quality flow → compile --quality-report + verify:integrity
  │       (planner must avoid changing normal compile)
  │       [VERIFIED: src/package.json; VERIFIED: 53-CONTEXT.md]
  │
  └─ npm --prefix src run safety:guard
       └─ scripts/check-safety-guards.sh → git staged/dirty protected-path checks only
       [VERIFIED: scripts/check-safety-guards.sh]
```

### Recommended Project Structure

```text
src/
├── package.json                         # script wiring for compile, compile:quality, safety:guard, alias:integrity, verify:integrity [VERIFIED: src/package.json]
├── compiler/alias_target_integrity.ts    # shared validator; do not change unless a real bug is found [VERIFIED: src/compiler/alias_target_integrity.ts]
├── cli/alias_integrity.ts                # existing CLI proof surface; preserve JSON/non-zero contract [VERIFIED: src/cli/alias_integrity.ts]
└── tests/
    ├── inventory/alias_target_inventory.test.ts  # refactor duplicated dangling logic to shared validator [VERIFIED: src/tests/inventory/alias_target_inventory.test.ts]
    ├── compiler/alias_target_integrity.test.ts   # validator-level tests already cover PASS/FAIL/malformed policy [VERIFIED: src/tests/compiler/alias_target_integrity.test.ts]
    └── cli/alias_integrity.test.ts               # script and JSON proof wiring tests; extend for verify:integrity [VERIFIED: src/tests/cli/alias_integrity.test.ts]
```

### Pattern 1: Semantic npm wrapper over existing proof command

**What:** Add `verify:integrity` as a semantic local guardrail alias that preserves `alias:integrity` as the base command. [VERIFIED: `53-CONTEXT.md`]  
**When to use:** Use for local proof and `compile:quality` integration; do not use in `compile`. [VERIFIED: `53-CONTEXT.md`; VERIFIED: `src/package.json`]  
**Example:**

```json
{
  "scripts": {
    "compile": "node dist/cli/compile.js",
    "compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report && node dist/cli/alias_integrity.js",
    "verify:integrity": "npm run alias:integrity",
    "alias:integrity": "npm run precompile && node dist/cli/alias_integrity.js"
  }
}
```

The exact command can differ, but the planner should preserve these external behaviors and avoid adding `verify:integrity` or `alias:integrity` to `compile`. [VERIFIED: `53-CONTEXT.md`]

### Pattern 2: Reuse shared validator in inventory test

**What:** Replace the manual `valid`/`dangling` filter in `alias_target_inventory.test.ts` with `validateAliasTargetIntegrity(seedAliases, descriptorIds, exceptionPolicy)`. [VERIFIED: `src/tests/inventory/alias_target_inventory.test.ts`; VERIFIED: `src/compiler/alias_target_integrity.ts`]  
**When to use:** Only for the live alias-data audit assertions; keep artifact/documentary tests as separate assertions. [VERIFIED: `53-CONTEXT.md`]  
**Example:**

```ts
import { validateAliasTargetIntegrity } from '../../compiler/alias_target_integrity.js'

const result = validateAliasTargetIntegrity(seedAliases, descriptorIds, exceptionPolicy)
expect(result).toMatchObject({
  status: 'PASS',
  compiled_descriptor_count: 341,
  valid_target_count: 18,
  unresolved_target_count: 0,
  unresolved: [],
})
```

### Anti-Patterns to Avoid

- **Adding alias proof to normal compile:** `compile` must remain exactly free of `alias:integrity`, `verify:integrity`, and `compile:quality`. [VERIFIED: `53-CONTEXT.md`; VERIFIED: `src/package.json`]
- **Merging semantic alias integrity into `safety:guard`:** current safety guard is a git/protected-path shell guard and should stay separate. [VERIFIED: `53-CONTEXT.md`; VERIFIED: `scripts/check-safety-guards.sh`]
- **Mutating taxonomy or compiled artifacts during implementation:** Phase 53 is script/test hardening only; data truth and compiled v2 artifacts are out of scope. [VERIFIED: `.planning/REQUIREMENTS.md`; VERIFIED: `53-CONTEXT.md`]
- **Changing production validator behavior to make the test easier:** user decision D-13 forbids production validator changes merely for the inventory refactor. [VERIFIED: `53-CONTEXT.md`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Alias target resolution in tests | Manual `valid` and `dangling` filtering | `validateAliasTargetIntegrity` | The project already has a shared result contract with PASS/FAIL counts and unresolved entries. [VERIFIED: `src/compiler/alias_target_integrity.ts`] |
| Alias proof CLI | New CLI implementation | Existing `runAliasIntegrityCli` / `alias:integrity` | Existing CLI already returns JSON proof and non-zero on FAIL. [VERIFIED: `src/cli/alias_integrity.ts`; VERIFIED: command output] |
| Protected path enforcement | Custom alias guard in `safety:guard` | Existing `safety:guard` unchanged | The current shell guard is intentionally file/git-state scoped. [VERIFIED: `scripts/check-safety-guards.sh`] |

**Key insight:** Phase 53 is about wiring and proof surfaces; the validator and CLI semantics already exist. [VERIFIED: codebase read]

## Common Pitfalls

### Pitfall 1: Accidentally putting alias integrity on the normal compile path
**What goes wrong:** `npm --prefix src run compile` starts running alias proof or quality scripts. [VERIFIED: risk from scope]  
**Why it happens:** npm scripts are easy to chain broadly. [ASSUMED]  
**How to avoid:** Modify only `verify:integrity` and `compile:quality`; leave `compile` as `node dist/cli/compile.js`. [VERIFIED: `src/package.json`; VERIFIED: `53-CONTEXT.md`]  
**Warning signs:** `src/package.json` `scripts.compile` contains `alias:integrity`, `verify:integrity`, or `compile:quality`. [VERIFIED: `53-CONTEXT.md`]

### Pitfall 2: Running `compile:quality` mutates default compiled artifacts
**What goes wrong:** Current `compile:quality` runs compile with default output and writes `../data/compiled/v2/*`; this dirtied `data/compiled/v2/descriptor_aliases.json`, `similarity_matrix.json`, and `taxonomy.json` during research before being restored. [VERIFIED: command output; VERIFIED: git diff output]  
**Why it happens:** `compile:quality` currently lacks `--out`, and `runCompileCli` maps the default output dir to `../data/compiled/v2`. [VERIFIED: `src/package.json`; VERIFIED: `src/cli/compile.ts`]  
**How to avoid:** Planner should either document this as an expected verification side effect with a post-run diff boundary check, or wire quality compile to an explicit temporary output dir if compatible with existing behavior. [VERIFIED: `src/cli/compile.ts`; VERIFIED: `53-CONTEXT.md`]  
**Warning signs:** `git diff --name-only -- data/compiled/v2` reports changes after quality verification. [VERIFIED: command output]

### Pitfall 3: Losing documentary inventory coverage during test refactor
**What goes wrong:** The inventory test stops checking `49-ALIAS-TARGET-INVENTORY.md` mandated sections or ylang historical rationale. [VERIFIED: `src/tests/inventory/alias_target_inventory.test.ts`]  
**Why it happens:** Refactor may replace the whole test file instead of only replacing duplicated dangling-target logic. [ASSUMED]  
**How to avoid:** Keep the second and third inventory tests intact, and change only the first test's alias-target validity assertions to call the shared validator. [VERIFIED: `src/tests/inventory/alias_target_inventory.test.ts`; VERIFIED: `53-CONTEXT.md`]

### Pitfall 4: `verify:integrity -- --json` argument forwarding ambiguity
**What goes wrong:** If `verify:integrity` is a wrapper around `npm run alias:integrity`, npm argument forwarding may require care so `--json` reaches `alias_integrity.js`. [ASSUMED]  
**Why it happens:** Nested npm scripts may consume or forward separators differently depending on command shape. [ASSUMED]  
**How to avoid:** Add a focused test and manually verify `npm --prefix src run verify:integrity -- --json` emits the same JSON proof. [VERIFIED: `53-CONTEXT.md`]  
**Warning signs:** Output is text instead of JSON or exit code differs from `alias:integrity -- --json`. [VERIFIED: `src/cli/alias_integrity.ts`]

## Code Examples

Verified patterns from project sources:

### Existing JSON proof command

```bash
npm --prefix src run alias:integrity -- --json
```

Current verified result: `PASS`, `18` seed aliases, `341` compiled descriptors, `18` valid targets, `0` unresolved, `[]` unresolved list. [VERIFIED: command output]

### Existing focused regression command

```bash
npm --prefix src test -- tests/inventory/alias_target_inventory.test.ts tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts
```

Current verified result: 3 files passed and 13 tests passed. [VERIFIED: command output]

### Existing normal compile smoke command

```bash
npm --prefix src run compile -- --out /tmp/phase53-compile-smoke
```

Current verified result: exits 0 and writes smoke artifacts under `/tmp/phase53-compile-smoke`. [VERIFIED: command output]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inventory test manually computes valid/dangling alias targets | Shared validator exists and should be reused in inventory test | Implemented before Phase 53, from v2.9 alias integrity work [VERIFIED: `.planning/milestones/v2.9-ROADMAP.md`; VERIFIED: `src/compiler/alias_target_integrity.ts`] | TEST-01 can be satisfied with a small test refactor. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| `alias:integrity` exists as optional proof command | Phase 53 should promote a semantic `verify:integrity` local guardrail and quality-flow integration | Phase 53 scope [VERIFIED: `53-CONTEXT.md`] | Local guardrail hardening is script/test work, not production validator work. [VERIFIED: codebase read] |

**Deprecated/outdated:** No deprecated library APIs were investigated because user constrained this to internal/codebase-only research and no new packages. [VERIFIED: user prompt]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | npm script chaining can accidentally broaden normal compile behavior. | Common Pitfalls | Planner may under-spec static script checks. |
| A2 | A broad refactor may accidentally remove documentary inventory assertions. | Common Pitfalls | TEST-01 could pass while D-12 fails. |
| A3 | Nested npm wrappers may require care for `--json` forwarding. | Common Pitfalls | `verify:integrity -- --json` could emit text or ignore the flag. |

## Open Questions (RESOLVED)

1. **Should `compile:quality` use a temporary output directory to avoid touching `data/compiled/v2/*`? — RESOLVED: yes, use an explicit temporary output.** [VERIFIED: command output]
   - What we know: Current `compile:quality` writes default compiled artifacts and dirtied `data/compiled/v2/*` during research before restoration. [VERIFIED: command output; VERIFIED: git diff output]
   - Resolution: Phase 53 plans require `compile:quality` to run the quality compile with an explicit non-mutating output directory, `/tmp/phase53-compile-quality`, and then run alias integrity proof. This keeps the quality-report path exercised while avoiding default writes to `data/compiled/v2/*`. Plan 03 still keeps the boundary diff proof as a final safety assertion, not as the primary strategy for allowing mutations. [VERIFIED: `src/cli/compile.ts`; VERIFIED: `53-CONTEXT.md`]
   - Required script strategy: `compile:quality` should use a shape equivalent to `npm run precompile && node dist/cli/compile.js --quality-report --out /tmp/phase53-compile-quality && node dist/cli/alias_integrity.js`. [VERIFIED: existing plan intent]

2. **Should `verify:integrity` directly call `node dist/cli/alias_integrity.js` after an existing build inside `compile:quality`? — RESOLVED: standalone guard uses a forwarding-safe direct script; `compile:quality` reuses the already-built CLI directly.** [VERIFIED: `src/package.json`]
   - What we know: `alias:integrity` currently runs `precompile`, and `compile:quality` currently runs `precompile` too. [VERIFIED: `src/package.json`]
   - Resolution: `verify:integrity` should avoid nested npm argument-forwarding ambiguity by using the same build-safe proof command shape as the base command: `npm run precompile && node dist/cli/alias_integrity.js`. npm appends `--json` to the final CLI command for `npm --prefix src run verify:integrity -- --json`, so the guard remains standalone and forwarding-safe. [VERIFIED: `53-CONTEXT.md`; ASSUMED: npm script argument append semantics]
   - Required proof: Plan 01 and Plan 03 must prove the forwarding shape with `npm --prefix src run verify:integrity -- --json`, and the output must be JSON with `PASS`, `compiled_descriptor_count: 341`, `valid_target_count: 18`, `unresolved_target_count: 0`, and `unresolved: []`. [VERIFIED: `53-CONTEXT.md`]
   - `compile:quality` should not call `npm run verify:integrity` after `precompile`; it should directly call `node dist/cli/alias_integrity.js` after its own `precompile` to avoid redundant rebuilds while preserving the standalone guard command. [VERIFIED: existing plan intent]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | CLI/script execution | ✓ | v24.14.0 [VERIFIED: command output] | None needed |
| npm | package scripts | ✓ | 11.9.0 [VERIFIED: command output] | None needed |
| TypeScript compiler | build/typecheck/precompile | ✓ | `^5.8.0` configured [VERIFIED: `src/package.json`] | None needed |
| Vitest | focused/full tests | ✓ | v3.2.4 observed [VERIFIED: command output] | None needed |
| git | `safety:guard` protected path checks | ✓ | Used successfully by `safety:guard` [VERIFIED: command output] | None needed |

**Missing dependencies with no fallback:** none found. [VERIFIED: command output]

**Missing dependencies with fallback:** none found. [VERIFIED: command output]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest v3.2.4 observed; configured by `src/vitest.config.ts`. [VERIFIED: command output; VERIFIED: `src/vitest.config.ts`] |
| Config file | `src/vitest.config.ts` [VERIFIED: file read] |
| Quick run command | `npm --prefix src test -- tests/inventory/alias_target_inventory.test.ts tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` [VERIFIED: command output] |
| Full suite command | `npm --prefix src test` [VERIFIED: command output] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GATE-01 | Local quality/safety command includes alias integrity without normal compile path. [VERIFIED: `.planning/REQUIREMENTS.md`] | script/unit + command smoke | `npm --prefix src run verify:integrity -- --json`; `npm --prefix src run compile:quality`; static inspect `src/package.json` [VERIFIED: `53-CONTEXT.md`] | ❌ Wave 0/update needed for `verify:integrity` script/test [VERIFIED: `src/package.json`] |
| GATE-02 | `alias:integrity -- --json` proves `341/18/0`. [VERIFIED: `.planning/REQUIREMENTS.md`] | CLI/unit + command smoke | `npm --prefix src run alias:integrity -- --json` [VERIFIED: command output] | ✅ `src/tests/cli/alias_integrity.test.ts` [VERIFIED: file read] |
| GATE-03 | Local alias integrity guard fails non-zero when unresolved targets exist. [VERIFIED: `.planning/REQUIREMENTS.md`] | CLI/unit | `npm --prefix src test -- tests/cli/alias_integrity.test.ts tests/compiler/alias_target_integrity.test.ts` [VERIFIED: command output] | ✅ existing for base CLI/validator; ❌ extend for `verify:integrity` if script-level assertion is required [VERIFIED: file read] |
| TEST-01 | Inventory test reuses `validateAliasTargetIntegrity` directly where appropriate. [VERIFIED: `.planning/REQUIREMENTS.md`] | unit/regression | `npm --prefix src test -- tests/inventory/alias_target_inventory.test.ts` [VERIFIED: command output] | ❌ refactor needed; current test duplicates valid/dangling logic [VERIFIED: `src/tests/inventory/alias_target_inventory.test.ts`] |
| TEST-02 | Existing test suite passes with equivalent/stronger coverage. [VERIFIED: `.planning/REQUIREMENTS.md`] | full regression | `npm --prefix src test` [VERIFIED: command output] | ✅ existing full suite currently passes 56 files / 389 tests [VERIFIED: command output] |

### Sampling Rate
- **Per task commit:** `npm --prefix src test -- tests/inventory/alias_target_inventory.test.ts tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` plus `npm --prefix src run typecheck`. [VERIFIED: command output]
- **Per wave merge:** `npm --prefix src test`; `npm --prefix src run alias:integrity -- --json`; `npm --prefix src run compile -- --out /tmp/phase53-compile-smoke`; static inspect `src/package.json`. [VERIFIED: command output; VERIFIED: `53-CONTEXT.md`]
- **Phase gate:** Full suite green, alias JSON proof `341/18/0`, new `verify:integrity` proof, `compile:quality` proof if changed, and git diff boundary clean for protected/data/deferred scopes. [VERIFIED: `53-CONTEXT.md`]

### Wave 0 Gaps
- [ ] `src/package.json` — add `verify:integrity` and update `compile:quality` without changing `compile`. [VERIFIED: `src/package.json`]
- [ ] `src/tests/cli/alias_integrity.test.ts` — extend script-wiring assertions to cover `verify:integrity`, `compile:quality`, and unchanged `compile`. [VERIFIED: file read]
- [ ] `src/tests/inventory/alias_target_inventory.test.ts` — import/read exception policy and reuse `validateAliasTargetIntegrity` in live alias audit. [VERIFIED: file read]
- [ ] Command proof — verify `npm --prefix src run verify:integrity -- --json` after adding the script. [VERIFIED: `53-CONTEXT.md`]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth surface in this phase. [VERIFIED: phase scope] |
| V3 Session Management | no | No session surface in this phase. [VERIFIED: phase scope] |
| V4 Access Control | no | Local npm scripts only; no user authorization model. [VERIFIED: phase scope] |
| V5 Input Validation | yes | Use existing JSON loaders/validator and `validateAliasTargetIntegrity`; do not hand-roll duplicate target validation. [VERIFIED: `src/cli/alias_integrity.ts`; VERIFIED: `src/compiler/alias_target_integrity.ts`] |
| V6 Cryptography | no | No crypto surface in this phase. [VERIFIED: phase scope] |

### Known Threat Patterns for local guardrail scripts

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Tampering with protected taxonomy/compiled artifacts through verification commands | Tampering | Keep implementation limited to scripts/tests and run final `git diff --name-only` boundary check for `data/taxonomy`, `data/compiled/v2`, Graphify, and deferred scopes. [VERIFIED: `53-CONTEXT.md`; VERIFIED: command output] |
| Repudiation of alias proof | Repudiation | Require machine-readable JSON proof with exact `341/18/0` counts and committed test assertions. [VERIFIED: command output; VERIFIED: `53-CONTEXT.md`] |
| Denial of normal compile usability | Denial of Service | Keep `compile` unchanged and verify compile smoke exits 0. [VERIFIED: `src/package.json`; VERIFIED: command output] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/53-alias-integrity-gate-hardening/53-CONTEXT.md` — locked decisions, scope, proof package, and canonical references. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` — GATE-01/GATE-02/GATE-03/TEST-01/TEST-02 and out-of-scope constraints. [VERIFIED: file read]
- `.planning/ROADMAP.md` — Phase 53 goal, success criteria, and v2.10 boundaries. [VERIFIED: file read]
- `.planning/STATE.md` — current Phase 53 focus and carry-forward v2.10 decisions. [VERIFIED: file read]
- `src/package.json` — current script wiring. [VERIFIED: file read]
- `src/compiler/alias_target_integrity.ts` — shared validator/result contract. [VERIFIED: file read]
- `src/cli/alias_integrity.ts` — JSON proof and exit-code behavior. [VERIFIED: file read]
- `src/tests/inventory/alias_target_inventory.test.ts` — current duplicated dangling-target logic and documentary inventory coverage. [VERIFIED: file read]
- `src/tests/compiler/alias_target_integrity.test.ts` and `src/tests/cli/alias_integrity.test.ts` — existing focused coverage. [VERIFIED: file read]
- `scripts/check-safety-guards.sh` — safety guard boundary. [VERIFIED: file read]
- Command outputs: `alias:integrity -- --json`, focused tests, full tests, typecheck, compile smoke, current `compile:quality`, `safety:guard`, Node/npm versions. [VERIFIED: command output]

### Secondary (MEDIUM confidence)
- `graphify-out/GRAPH_REPORT.md` and `graphify query` outputs — project graph context; graph report is from commit `a9588505` and may be stale relative to current HEAD. [VERIFIED: file read; VERIFIED: command output]

### Tertiary (LOW confidence)
- None from web search; external/web research was intentionally not performed per user boundary. [VERIFIED: user prompt]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — read package metadata and ran current commands. [VERIFIED: file read; VERIFIED: command output]
- Architecture: HIGH — direct code/script inspection plus graphify context. [VERIFIED: codebase read; VERIFIED: graphify output]
- Pitfalls: HIGH for compile/script/data-mutation pitfalls observed in code and commands; MEDIUM for npm forwarding assumptions until implemented and tested. [VERIFIED: command output; ASSUMED]

**Research date:** 2026-06-06  
**Valid until:** 2026-07-06 for local codebase findings, unless `src/package.json`, alias integrity CLI, or compiled artifact policy changes earlier. [ASSUMED]
