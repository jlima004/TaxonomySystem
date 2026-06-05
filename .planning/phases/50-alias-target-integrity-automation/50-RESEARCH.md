# Phase 50: Alias Target Integrity Automation - Research

**Researched:** 2026-06-05
**Domain:** Internal TypeScript validator + CLI proof gate
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### Gate Placement

- **D-50-01:** Implement a reusable alias target integrity validator under `src/`. The validator is the core logic and should be usable by tests and the CLI/proof command.
- **D-50-02:** Add a focused CLI/check command under `src/cli/` or the closest project convention. This command validates live alias targets by reading `data/taxonomy/descriptor_aliases.seed.json`, compiled descriptor IDs from `data/compiled/v2/taxonomy.json`, and the exception policy file.
- **D-50-03:** Phase 50 uses a proof-command-only enforcement model. The live-data gate is allowed and expected to fail before Phase 51 because current data contains the unresolved `ylang ylang -> ylang_ylang` target.
- **D-50-04:** Default `npm test` and normal compile must remain green during Phase 50. Do not wire the live-data failure into default test or compile flows yet.
- **D-50-05:** Tests should cover validator behavior with fixtures: all targets valid -> pass; dangling target without exception -> fail; dangling target with documented approved exception -> pass; current live data proof command reports exactly one failure.

### Planner Alert — Expected Non-Zero Proof

- **D-50-05a:** The Phase 50 plan must treat `npm run alias:integrity` returning non-zero on current live data as the expected proof result, not as a phase failure.
- **D-50-05b:** Phase 50 success must prove both commands below:

```text
npm run alias:integrity
-> exit != 0
-> reports exactly one unresolved target: ylang ylang -> ylang_ylang

npm test
-> exit 0
```

- **D-50-05c:** If `npm run alias:integrity` exits zero during Phase 50 without an approved exception or remediation, that is suspicious and must be investigated, because Phase 50 is not allowed to remediate the live-data dangling alias.

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

### Deferred Ideas (OUT OF SCOPE)

- Wire `alias:integrity` into default `npm test` or normal compile as a hard gate after Phase 51 remediation.
- Remediate `ylang ylang -> ylang_ylang` by add-target, alias correction, alias drop, or approved exception in Phase 51.
- Any low_support, seed_corpus_conflict, scoring, Graphify, MVP/SaaS, Knowledge Engine, or UI work belongs to future phases.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HYG-02 | Criar um gate automatizado de integridade de aliases que valide todos os targets de `descriptor_aliases.seed.json` contra os descriptors presentes no output compilado da taxonomia, falhando quando houver target inexistente sem exceção documentada. | Use a pure validator under `src/compiler/` plus a dedicated CLI proof command under `src/cli/`; keep it out of default compile/test flows until Phase 51. [VERIFIED: codebase read] |
| HYG-03 | Definir o mecanismo de exceções documentadas para aliases intencionalmente não resolvidos, permitindo lista vazia e exigindo rationale explícita para qualquer exceção. | Create and consume `data/taxonomy/alias_target_exceptions.v1.json`; validate schema in code; keep the initial file empty in Phase 50. [VERIFIED: context read] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

No repo-root `AGENTS.md` exists, so there are no additional project-specific instructions beyond `.planning/` context and the existing codebase conventions. [VERIFIED: glob]

## Summary

This codebase already separates pure logic from process control: `src/compiler/*` holds deterministic validation/compilation functions, while `src/cli/compile.ts` does file I/O, prints concise summaries, returns numeric exit codes from `runCompileCli`, and calls `process.exit(...)` only in `main`. [VERIFIED: codebase read] Phase 50 should mirror that split with a pure alias-target validator under `src/compiler/` and a thin proof CLI under `src/cli/`. [VERIFIED: codebase read]

Current package conventions are lightweight and local: `src/package.json` exposes named scripts, `vitest` is the only test runner, `tsc` builds to `dist`, and both `npm test` and `npm run build` are already green in the current workspace. [VERIFIED: codebase read] [VERIFIED: local command] That means the safest Phase 50 shape is additive: new validator module, new CLI module, new tests, one new npm script, and one empty exception JSON file. [VERIFIED: context read]

The live proof case is already known and stable: the seed alias file has 18 mappings, compiled taxonomy has 340 descriptor IDs, 17 alias targets resolve, and the only unresolved pair is `ylang ylang -> ylang_ylang`. [VERIFIED: codebase read] [VERIFIED: local command] Phase 50 must preserve that failure as the expected `npm run alias:integrity` result while still keeping `npm test` green. [VERIFIED: context read]

**Primary recommendation:** Put the reusable validator in `src/compiler/alias_target_integrity.ts` [ASSUMED], expose a thin `src/cli/alias_integrity.ts` proof command [ASSUMED], add `alias:integrity` in `src/package.json`, and keep the current live-data failure isolated to that script only. [VERIFIED: codebase read]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Alias-target validation logic | API / Backend | Database / Storage | The decision is a pure in-process TypeScript check over JSON data, so ownership belongs in reusable backend-style logic, not in the script wrapper. [VERIFIED: codebase read] |
| Proof command / exit code handling | API / Backend | — | Existing CLI style returns `0/1` from `runCompileCli` and keeps `process.exit(...)` in `main`. [VERIFIED: codebase read] |
| Exception policy persistence | Database / Storage | API / Backend | The source of truth is a versioned JSON file under `data/taxonomy/`, while the validator only consumes it. [VERIFIED: context read] |
| Human + JSON reporting | API / Backend | — | Output formatting belongs in the CLI layer because the existing compiler CLI owns console messaging and return codes. [VERIFIED: codebase read] |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.9.3 | Strict ESM implementation compiled to `dist/`. | `src/tsconfig.json` is strict and `npm run build` uses `tsc`. [VERIFIED: codebase read] [VERIFIED: local command] |
| Node.js stdlib | 24.14.0 | File reads, path resolution, CLI entrypoint behavior. | Existing CLI and loaders already use `node:fs/promises`, `node:path`, and `node:url`. [VERIFIED: codebase read] [VERIFIED: local command] |
| Vitest | 3.2.4 | Unit and CLI/integration tests. | `src/vitest.config.ts` includes `tests/**/*.test.ts` and `npm test` runs Vitest successfully. [VERIFIED: codebase read] [VERIFIED: local command] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `loadAliasSeed` / `validateAliasSeed` | local module | Reuse existing seed-file load + shape validation. | Use when the CLI reads `descriptor_aliases.seed.json` from disk. [VERIFIED: codebase read] |
| `CompiledTaxonomy` / `CompiledAliases` types | local module | Reuse typed compiled-artifact shapes. | Use in the pure validator input types and CLI parsing. [VERIFIED: codebase read] |
| `CliArgumentError` pattern | local module | Keep argument failures explicit and non-zero. | Use if `alias:integrity` supports `--json` and `--help`. [VERIFIED: codebase read] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Validator in `src/compiler/` | Validator in `src/loader/` | `src/loader/` currently owns file-shape validation, while alias-target integrity is a cross-artifact quality rule over aliases + taxonomy + exceptions. [VERIFIED: codebase read] |
| Dedicated proof CLI | Wiring into `compileAll` / `runArtifactQualityGates` now | That would risk failing normal compile flows before Phase 51, which the context explicitly forbids. [VERIFIED: context read] |
| Versioned JSON exceptions file | Hard-coded TS allowlist | The context requires executable policy data under `data/taxonomy/alias_target_exceptions.v1.json`. [VERIFIED: context read] |

**Installation:**
```bash
# No new packages required.
```

## Architecture Patterns

### System Architecture Diagram
```text
npm run alias:integrity
        |
        v
dist/cli/alias_integrity.js
        |
        +--> read data/taxonomy/descriptor_aliases.seed.json
        +--> read data/compiled/v2/taxonomy.json
        +--> read data/taxonomy/alias_target_exceptions.v1.json
        |
        v
validateAliasTargetIntegrity(...pure inputs...)
        |
        +--> PASS -> concise human output or JSON -> exit 0
        \--> FAIL -> unresolved list (including exception status + hint) -> exit 1
```

### Recommended Project Structure
```text
src/
├── compiler/
│   └── alias_target_integrity.ts      # pure validator + result types [ASSUMED]
├── cli/
│   └── alias_integrity.ts             # proof command wrapper [ASSUMED]
└── tests/
    ├── compiler/
    │   └── alias_target_integrity.test.ts
    └── cli/
        └── alias_integrity.test.ts

data/
└── taxonomy/
    └── alias_target_exceptions.v1.json
```

### Pattern 1: Pure validator in `src/compiler/`
**What:** Keep the validator as a side-effect-free function that accepts already-loaded alias mappings, descriptor IDs, exceptions, and source metadata, then returns counts plus unresolved entries. [VERIFIED: codebase read]
**When to use:** Always for business-rule validation shared by tests and CLI. [VERIFIED: codebase read]
**Example:**
```typescript
// Source: src/compiler/compile_all.ts
export const compileAll = (
  inputs: CompileAllInputs,
  options: CompileAllOptions,
): CompileAllResult => {
  // pure inputs -> pure outputs
  return {
    ok: validation.ok,
    taxonomy,
    aliases,
    similarity,
    validation,
  }
}
```

### Pattern 2: Thin CLI wrapper that returns exit codes
**What:** Export `runAliasIntegrityCli(argv)` that returns `Promise<number>` and keep `process.exit(...)` in a local `main()`. [VERIFIED: codebase read]
**When to use:** For deterministic tests that can call the CLI function directly without spawning a process. [VERIFIED: codebase read]
**Example:**
```typescript
// Source: src/cli/compile.ts
export const runCompileCli = async (argv: readonly string[] = process.argv.slice(2)): Promise<number> => {
  if (args.help) {
    printHelp()
    return 0
  }
  if (!result.ok) return 1
  return 0
}
```

### Pattern 3: Split pure tests from temp-dir CLI tests
**What:** Keep validator tests as direct function calls with inline fixtures; keep CLI tests as temp-dir JSON fixture runs with console spies. [VERIFIED: codebase read]
**When to use:** Use unit tests for resolution logic and CLI tests for exit codes / output formatting / path loading. [VERIFIED: codebase read]
**Example:**
```typescript
// Source: src/tests/cli/compile.test.ts
const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-valid-')))
await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)
```

### Anti-Patterns to Avoid
- **Do not extend `CompilerValidationError` for Phase 50 unless you are willing to add a new artifact class.** The current union only supports `taxonomy | aliases | similarity`, so forcing alias-integrity failures into it creates unnecessary compile-surface churn. [VERIFIED: codebase read]
- **Do not wire the live-data check into `compileAll`, `runArtifactQualityGates`, `npm test`, or `npm run build` yet.** Phase 50 must keep the failure isolated to the proof command. [VERIFIED: context read]
- **Do not store exceptions in test-only hard-coded maps.** `existingApprovedAliases` in `alias_seed_v2.test.ts` is legacy test scaffolding, not executable policy. [VERIFIED: codebase read]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Live-data proof orchestration | A new child-process-heavy test harness | `runAliasIntegrityCli(argv)` with temp files and console spies | Existing CLI tests already use this pattern and avoid process-spawn flakiness. [VERIFIED: codebase read] |
| Exception persistence | A TypeScript constant allowlist | `data/taxonomy/alias_target_exceptions.v1.json` | The context requires machine-consumed versioned JSON, including valid empty lists. [VERIFIED: context read] |
| Default compile enforcement | A hidden hook inside `compileAll` | A dedicated `alias:integrity` script | Compile and proof need different Phase 50 pass/fail semantics. [VERIFIED: context read] |
| Output side artifacts | Report-file generation by default | Human output + `--json` stream only | Existing CLI convention is concise console output with no extra report artifact. [VERIFIED: codebase read] |

**Key insight:** Phase 50 is not missing algorithms; it is missing a clean seam between pure validation logic and an intentionally failing proof surface. [VERIFIED: context read]

## Common Pitfalls

### Pitfall 1: Hiding the exception policy in tests
**What goes wrong:** The validator “passes” because a hard-coded test allowlist silently absorbs unresolved aliases. [VERIFIED: codebase read]
**Why it happens:** `alias_seed_v2.test.ts` currently preserves legacy aliases with the in-test `existingApprovedAliases` map. [VERIFIED: codebase read]
**How to avoid:** Read exceptions only from `data/taxonomy/alias_target_exceptions.v1.json` in production logic and keep the Phase 50 file empty. [VERIFIED: context read]
**Warning signs:** `ylang ylang -> ylang_ylang` disappears from live proof output without any Phase 51 remediation or approved exception entry. [VERIFIED: context read]

### Pitfall 2: Breaking the wrong gate
**What goes wrong:** The repo starts failing normal compile or global tests instead of only the proof command. [VERIFIED: context read]
**Why it happens:** The validator is added to `compileAll` or a default script too early. [VERIFIED: context read]
**How to avoid:** Keep Phase 50 enforcement behind `npm run alias:integrity` only. [VERIFIED: context read]
**Warning signs:** `npm run build` or an unrelated compile test starts failing on untouched live data. [VERIFIED: local command] [VERIFIED: context read]

### Pitfall 3: Coupling process exit to core logic
**What goes wrong:** Unit tests become awkward or require subprocess spawning. [VERIFIED: codebase read]
**Why it happens:** `process.exit(...)` is called directly from shared validator code. [VERIFIED: codebase read]
**How to avoid:** Return structured results from the validator and numeric exit codes from the CLI wrapper. [VERIFIED: codebase read]
**Warning signs:** The test can no longer call `runAliasIntegrityCli(...)` directly like `runCompileCli(...)`. [VERIFIED: codebase read]

### Pitfall 4: Path-resolution drift between repo root and `src/`
**What goes wrong:** The command works from one working directory but not another. [VERIFIED: codebase read]
**Why it happens:** Existing scripts run from `src/`, while data files live in `../data/...` on disk even though default CLI paths are `data/...`. [VERIFIED: codebase read]
**How to avoid:** Reuse the `resolveReadablePath` pattern from `src/cli/compile.ts` for live-data file access. [VERIFIED: codebase read]
**Warning signs:** The command fails to find `data/taxonomy/descriptor_aliases.seed.json` when invoked via `npm run` from `src/`. [VERIFIED: codebase read]

## Code Examples

Verified patterns from project sources:

### CLI exit-code wrapper
```typescript
// Source: src/cli/compile.ts
const main = async (): Promise<void> => {
  process.exit(await runCompileCli())
}
```

### Temp-dir CLI fixture pattern
```typescript
// Source: src/tests/cli/compile.test.ts
const writeJson = (path: string, value: unknown): Promise<void> =>
  writeFile(path, `${JSON.stringify(value)}\n`, 'utf8')
```

### Existing reusable alias load + validate pattern
```typescript
// Source: src/loader/alias_loader.ts
const result = validateAliasSeed(parsed)
if (!result.ok || !result.value) {
  throw new AliasValidationError(...)
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `alias_seed_v2.test.ts` preserves legacy absent targets with an in-test `existingApprovedAliases` map. [VERIFIED: codebase read] | Phase 50 should move executable exception handling into `data/taxonomy/alias_target_exceptions.v1.json` consumed by validator + CLI. [VERIFIED: context read] | Phase 50 | Policy becomes machine-readable and reusable outside one curation test. |
| Compiled-output validation checks alias shape/self-reference but not target existence. [VERIFIED: codebase read] | Phase 50 adds explicit alias-target resolution validation as a separate proof surface. [VERIFIED: context read] | Phase 50 | The repo gains deterministic proof without altering default compile behavior yet. |

**Deprecated/outdated:**
- Treating test-only legacy-preservation maps as operational exception policy is outdated for this phase. [VERIFIED: codebase read]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `src/compiler/alias_target_integrity.ts` is the best exact filename. | Primary recommendation / project structure | Low — only naming changes; architecture stays the same. |
| A2 | `src/cli/alias_integrity.ts` is the best exact CLI filename. | Primary recommendation / project structure | Low — only naming changes; CLI placement still remains under `src/cli/`. |

## Open Questions (RESOLVED)

1. **Should the CLI parse only `--json`, or also add `--help` immediately?**
   - Resolution: Support both `--json` and `--help` now, because the existing CLI surface already normalizes help output and argument-error handling. [RESOLVED]
   - Planning impact: The plan should allow a tiny inline `--help` branch, but `--json` remains the only mandatory non-default flag for proof and tests.

2. **Should the validator result reuse compiler validation types?**
   - Resolution: Use a dedicated alias-integrity result type in Phase 50 instead of reusing `CompilerValidationError`, because the current compiler validation union does not model this proof surface cleanly and the context explicitly keeps it outside default compile flows. [RESOLVED]
   - Planning impact: Keep alias-integrity result objects local to `src/compiler/alias_target_integrity.ts`; do not widen compiler validation types unless a later phase explicitly integrates this gate into compile.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | CLI script + tests | ✓ | v24.14.0 | — |
| npm | package scripts | ✓ | 11.9.0 | — |
| TypeScript (`tsc`) | `npm run build` / dist CLI | ✓ | 5.9.3 | — |
| Vitest | `npm test` and new Phase 50 tests | ✓ | 3.2.4 | — |

**Missing dependencies with no fallback:**
- None. [VERIFIED: local command]

**Missing dependencies with fallback:**
- None. [VERIFIED: local command]

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 [VERIFIED: local command] |
| Config file | `src/vitest.config.ts` [VERIFIED: codebase read] |
| Quick run command | `npm --prefix src test -- --run tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` [ASSUMED] |
| Full suite command | `npm --prefix src test` [VERIFIED: codebase read] [VERIFIED: local command] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HYG-02 | Missing alias targets fail unless covered by approved exception data. | unit | `npm --prefix src test -- --run tests/compiler/alias_target_integrity.test.ts` [ASSUMED] | ❌ Wave 0 |
| HYG-02 | Current live data proof returns exit `1` and reports only `ylang ylang -> ylang_ylang`. | CLI integration | `npm --prefix src test -- --run tests/cli/alias_integrity.test.ts` [ASSUMED] | ❌ Wave 0 |
| HYG-03 | Empty exception file is valid; approved exception fixture suppresses only matching pair. | unit | `npm --prefix src test -- --run tests/compiler/alias_target_integrity.test.ts` [ASSUMED] | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm --prefix src test -- --run tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` [ASSUMED]
- **Per wave merge:** `npm --prefix src test` [VERIFIED: codebase read] [VERIFIED: local command]
- **Phase gate:** `npm --prefix src test` plus `npm --prefix src run alias:integrity -- --json` with expected non-zero live-data proof. [VERIFIED: context read]

### Wave 0 Gaps
- [ ] `src/tests/compiler/alias_target_integrity.test.ts` — pure validator fixtures for valid / dangling / approved-exception paths.
- [ ] `src/tests/cli/alias_integrity.test.ts` — temp-dir CLI path tests plus live-data proof assertion.
- [ ] `data/taxonomy/alias_target_exceptions.v1.json` — empty executable policy file.
- [ ] `src/cli/alias_integrity.ts` — proof command with `--json` support.
- [ ] `src/compiler/alias_target_integrity.ts` — reusable validator and result types.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Local CLI only; no auth surface. [VERIFIED: codebase read] |
| V3 Session Management | no | Local CLI only; no session surface. [VERIFIED: codebase read] |
| V4 Access Control | no | Local CLI reads local files only; no multi-user permission model in scope. [VERIFIED: codebase read] |
| V5 Input Validation | yes | Validate exception-file shape and CLI flags before resolution logic. [VERIFIED: context read] [ASSUMED] |
| V6 Cryptography | no | No crypto requirement in this phase. [VERIFIED: context read] |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed exception JSON causing false PASS/FAIL | Tampering | Parse and validate file shape before use; fail closed with non-zero CLI exit. [VERIFIED: codebase read] [ASSUMED] |
| Path confusion between `src/` and repo-root data files | Tampering | Reuse `resolveReadablePath` behavior so defaults work from `src` package scripts. [VERIFIED: codebase read] |
| Accidental data mutation during proof | Tampering | Keep validator pure and CLI side-effect free; do not write outputs or reports by default. [VERIFIED: context read] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/50-alias-target-integrity-automation/50-CONTEXT.md` - scope, locked decisions, proof semantics, exception policy shape.
- `.planning/REQUIREMENTS.md` - HYG-02 and HYG-03 requirement text.
- `.planning/ROADMAP.md` - Phase 50 goal, dependency, and non-remediation boundary.
- `.planning/STATE.md` - current project state and Phase 49 handoff.
- `.planning/phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md` - confirmed live-data inventory and dangling alias classification.
- `src/cli/compile.ts` - CLI style, output pattern, return-code handling, path resolution.
- `src/compiler/compile_all.ts`, `src/compiler/quality_gates.ts`, `src/compiler/validate_output.ts`, `src/compiler/types.ts` - pure-function and validation-layer conventions.
- `src/tests/cli/compile.test.ts`, `src/tests/compiler/quality_gates.test.ts`, `src/tests/compiler/compile_all.test.ts`, `src/tests/curation/alias_seed_v2.test.ts` - test and fixture patterns.
- `src/package.json`, `src/vitest.config.ts`, `src/tsconfig.json` - script/build/test conventions.
- Local commands run on 2026-06-05: `npm test`, `npm run build`, Node/npm/Vitest/tsc version checks, and a live alias-count probe.

### Secondary (MEDIUM confidence)
- None.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all tooling, scripts, and tests were read from the repo and confirmed locally.
- Architecture: HIGH - the compiler/CLI split is explicit in current source layout and function signatures.
- Pitfalls: HIGH - each pitfall is directly tied to current code or locked Phase 50 constraints.

**Research date:** 2026-06-05
**Valid until:** 2026-07-05
