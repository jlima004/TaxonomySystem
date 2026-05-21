---
phase: 06-compilation-cli
plan: 02
subsystem: compilation-cli
tags: [typescript, cli, json, compiler, vitest]
requires:
  - phase: 06-compilation-cli/06-01
    provides: compiler output validators
provides:
  - taxonomy.json compiler with seed/corpus placement rules
  - descriptor_aliases.json wrapper compiler for curated aliases
  - similarity_matrix.json orchestration through existing similarity graph builder
  - compiled-JS npm compile command and deterministic output writer
affects: [taxonomy-artifacts, runtime-consumers, phase-6-verification]
tech-stack:
  added: []
  patterns: [pure compiler functions, temp-file rename writes, manual zero-dependency CLI args]
key-files:
  created:
    - src/compiler/compile_taxonomy.ts
    - src/compiler/compile_aliases.ts
    - src/compiler/compile_all.ts
    - src/compiler/write_outputs.ts
    - src/cli/parse_args.ts
    - src/cli/index.ts
    - src/cli/compile.ts
    - src/tests/compiler/compile_taxonomy.test.ts
    - src/tests/compiler/compile_aliases.test.ts
    - src/tests/compiler/compile_all.test.ts
    - src/tests/cli/parse_args.test.ts
    - data/compiled/v1/taxonomy.json
    - data/compiled/v1/descriptor_aliases.json
    - data/compiled/v1/similarity_matrix.json
  modified:
    - src/compiler/index.ts
    - src/package.json
    - src/cli/.gitkeep
key-decisions:
  - "Compile pipeline remains pure until CLI resolves generatedAt and writer performs filesystem output."
  - "Default CLI data paths keep documented parser defaults but resolve to ../data when run from the src package."
patterns-established:
  - "Compiler functions require injected generatedAt for deterministic outputs."
  - "Output writer validates all artifacts before writing and uses .filename.tmp followed by rename."
requirements-completed: [COMP-01, COMP-02, COMP-03]
duration: 7 min
completed: 2026-05-21
---

# Phase 06 Plan 02: Geradores JSON e CLI Summary

**Pure TypeScript artifact compilers plus compiled-JS CLI that emits deterministic taxonomy, alias, and sparse similarity JSON outputs.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-05-21T17:06:23Z
- **Completed:** 2026-05-21T17:14:07Z
- **Tasks:** 8 completed (+1 verification artifact commit, +1 path fix)
- **Files modified:** 17 plan files/artifacts

## Accomplishments

- Implemented `taxonomy.json` compilation with seed descriptors first, corpus candidates second, stable sorting, support-based subfamily placement, and computed stats.
- Implemented `descriptor_aliases.json` wrapper output containing only curated seed aliases with deterministic key order.
- Implemented pure `compileAll()` orchestration that passes `semantic_noise.v1.json` config into `buildSeedCorpusProfiles`, builds the similarity graph, and validates all outputs before write.
- Added all-or-nothing output writing via `.filename.tmp` files and rename, preserving unrelated output-directory files.
- Added a zero-runtime-dependency CLI executable via `npm run compile` / `node dist/cli/compile.js`, with `--generated-at` determinism support.
- Added committed compiled v1 artifacts under `data/compiled/v1/`.

## Task Commits

Each logical task was committed atomically:

1. **Task 1: Compilador de taxonomy.json com placement rule** - `b03b088` (feat)
2. **Task 2: Compilador de descriptor_aliases.json** - `c97505c` (feat)
3. **Task 3: Orquestrador compileAll puro** - `fe5ab2f` (feat)
4. **Task 4: Writer com temp-file + rename strategy** - `817eae1` (feat)
5. **Task 5: Parser de argumentos CLI** - `1e962da` (feat)
6. **Task 6: CLI entry point via JS compilado** - `6f6e39f` (feat)
7. **Task 7: Testes unitários dos compiladores e CLI** - `7a5fc79` (test)
8. **Task 8: Atualizar barrel export do compiler** - `b2316d8` (feat)
9. **Path compatibility fix** - `322da97` (fix)
10. **Generated compiled v1 artifacts** - `6cf7856` (chore)

**Plan metadata:** pending final docs commit.

## Files Created/Modified

- `src/compiler/compile_taxonomy.ts` - Builds `CompiledTaxonomy` from seed profiles, inferred corpus descriptors, and co-occurrence support.
- `src/compiler/compile_aliases.ts` - Wraps curated alias seed data as deterministic `CompiledAliases`.
- `src/compiler/compile_all.ts` - Pure orchestrator for profiles, taxonomy, aliases, similarity graph, and validation.
- `src/compiler/write_outputs.ts` - Validating writer with deterministic JSON formatting and temp-file rename strategy.
- `src/compiler/index.ts` - Public exports for compiler functions, options, results, and writer constants.
- `src/cli/parse_args.ts` - Manual zero-dependency parser for compile CLI flags.
- `src/cli/index.ts` - CLI barrel exports.
- `src/cli/compile.ts` - Compiled-JS CLI entrypoint for loading inputs, analyzing corpus, compiling, validating, and writing outputs.
- `src/package.json` - Emits JS on build, adds `typecheck`, `precompile`, and `compile` scripts.
- `src/tests/compiler/*.test.ts` and `src/tests/cli/parse_args.test.ts` - Unit/integration coverage for compiler and CLI behavior.
- `data/compiled/v1/*.json` - Generated v1 compiled artifacts.
- `src/cli/.gitkeep` - Removed because `src/cli/` now contains real source files.

## Decisions Made

- `generatedAt` is resolved only in `src/cli/compile.ts`; pure compiler modules require it as an option.
- Parser defaults remain the plan-specified `data/...` values for testable CLI contracts; the CLI resolves those to `../data/...` when executed from the `src` package so `npm run compile` writes to repository-level `data/compiled/v1/`.
- Committed generated artifacts with fixed `generated_at=2026-01-01T00:00:00.000Z` to keep repository output deterministic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Resolved default data paths when running npm scripts from `src/`**
- **Found during:** Verification after Task 8
- **Issue:** Plan-required defaults use `data/...`, but the package scripts run from `src/`, so default input/output paths would resolve under `src/data` instead of repository `data`.
- **Fix:** Added CLI path resolution that preserves parser defaults while falling back to `../data/...` for default readable inputs and default output directory.
- **Files modified:** `src/cli/compile.ts`
- **Verification:** `npm run compile -- --generated-at '2026-01-01T00:00:00.000Z'` writes `../data/compiled/v1/*.json` successfully from `src/`.
- **Committed in:** `322da97`

---

**Total deviations:** 1 auto-fixed (1 bug).
**Impact on plan:** Required for the documented `cd src && npm run compile` verification path; no scope creep or runtime dependency added.

## Issues Encountered

- Graphify hooks updated `graphify-out/*` after commits. These were pre-existing/unrelated generated changes and were intentionally not staged.

## Verification

All required verification passed:

- `cd src && npm run build` — passed; emits JS in `src/dist/`.
- `cd src && npm run typecheck` — passed.
- `cd src && npx vitest run` — passed; 42 files, 287 tests.
- `cd src && npm run compile -- --generated-at '2026-01-01T00:00:00.000Z'` — passed; generated three files in repository `data/compiled/v1/`.
- Determinism check with `/tmp/taxonomy-run1` and `/tmp/taxonomy-run2` plus `diff` on all three artifacts — passed.
- Descriptor aliases wrapper validation via Node assertion — passed.

## Known Stubs

None. Empty arrays/maps in compiler internals are accumulators or valid sparse output, not UI/data-source stubs.

## Threat Flags

None. New surface is local filesystem CLI I/O only; no network, auth, or trust-boundary endpoint was introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 6 now has both planned summaries ready once metadata is committed. The v1 builder can be verified end-to-end with compiled artifacts in `data/compiled/v1/`.

## Self-Check: PASSED

- Verified all key created files exist on disk.
- Verified all task/deviation/artifact commits exist in git history.
- Verification commands listed above passed before metadata updates.

---
*Phase: 06-compilation-cli*
*Completed: 2026-05-21*
