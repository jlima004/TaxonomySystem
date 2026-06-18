# AGENTS.md

Guidance for AI agents working in this repository.

## Project Identity

This is the Olfactory Taxonomy System, the Layer 1 semantic taxonomy for an AI fragrance intelligence platform. Its core value is to produce a normalized, computationally useful olfactory semantic system that can feed higher layers such as similarity, accord generation, semantic search, recommendations, and future agent/RAG consumers.

The repository is private, offline, TypeScript-first, and builder-oriented. It does not currently expose an HTTP API, SaaS runtime, database, Neo4J service, or running agent system.

There are two independent npm packages:

- `src/`: the Taxonomy Builder, compiler, CLI, graph read model, and main test suite.
- `engine_calcula_tenacidade_volatilidade/`: a standalone volatility/tenacity calculation engine.

There is no root `package.json`; run npm commands with `--prefix`.

## Current GSD State

This project uses GSD (Get-Shit-Done) for planning and execution.

- Current state: no active milestone; awaiting next milestone planning.
- Last shipped milestone: `v2.12 Graph Read Model Hardening & Agent Consumption Prep`, shipped 2026-06-18.
- Completed recent phases: 60-63.
- Authoritative current position: `.planning/STATE.md`.
- Ignore stale handoff artifacts if they conflict with `.planning/STATE.md`, `.planning/PROJECT.md`, or `.planning/ROADMAP.md`.

When opening new substantial work, start from the GSD flow rather than inventing an ad hoc plan. The next normal project step is `$gsd-new-milestone`.

## Required Reading

Before changing code or planning new work, read these in order:

1. `.planning/STATE.md` for current position, deferred items, and blockers.
2. `.planning/PROJECT.md` for scope, validated requirements, out-of-scope boundaries, and key decisions.
3. `.planning/ROADMAP.md` for phase history and milestone structure.
4. `.planning/config.json` for GSD settings.
5. `README.md` for operational commands and current architecture.

For graph/read-model work, also read:

- `docs/olfactory_graph_contract.md`
- `docs/olfactory_graph_read_model.md`

For active GSD phase work, read the current phase directory under `.planning/phases/{NN}-{slug}/`, especially `{NN}-CONTEXT.md`, `{NN}-RESEARCH.md`, `{NN}-PATTERNS.md`, and all `{NN}-*-PLAN.md` files.

## GSD Workflow

Use the project workflow:

```text
discuss-phase -> plan-phase -> execute-phase -> verify-work -> complete-milestone
```

Important local GSD settings from `.planning/config.json`:

- `mode: yolo`
- `parallelization: false`
- `git.branching_strategy: none`
- `commit_docs: true`
- `workflow.plan_check: true`
- `workflow.verifier: true`
- `workflow.nyquist_validation: true`
- `workflow.code_review: true`
- `phase_naming: sequential`

Phase directories use sequential numbering, for example `.planning/phases/63-consumer-readiness-documentation/`. The next new phase should continue the numeric sequence unless `.planning/ROADMAP.md` says otherwise.

If GSD docs mention `.agent/`, use `.agents/` in this repository; the actual workflows, skills, personas, and references live there.

Use these intents:

- New milestone: `$gsd-new-milestone`
- Understand status: `$gsd-progress`
- Discuss a phase: `$gsd-discuss-phase N`
- Plan a phase: `$gsd-plan-phase N`
- Execute a phase: `$gsd-execute-phase N`
- Verify delivered work: `$gsd-verify-work N`
- Small scoped work: `$gsd-quick`
- Bug investigation: `$gsd-debug`
- Milestone closure: `$gsd-complete-milestone`

## Scope Boundaries

This repository owns Layer 1 semantic taxonomy. Keep these out of scope unless the active GSD milestone explicitly opens them:

- API, SaaS, HTTP server, or product runtime.
- Running agent systems.
- Neo4J, Docker, external databases, or heavy graph dependencies.
- Automatic promotion of corpus candidates.
- New taxonomy publication or curation mutations.
- Treating the graph read model as the source of truth.
- Moving physchem scores into the taxonomy layer.

The volatility/tenacity engine is separate and should not be mixed into the Taxonomy Builder unless a planned milestone explicitly integrates it.

## Protected Paths

Do not mutate these casually:

- `data/taxonomy/`
- `data/inference/`
- `data/compiled/v1/`
- `data/compiled/v2/`
- `data/read-models/olfactory-graph/v2.11/`
- `src/cli/parse_args.ts`
- `graphify-out/`

`graphify-out/**` is navigation-only context. It is not a production input or output for this project and must not be staged as project work.

Before committing or preparing a PR that touches data or graph boundaries, run:

```bash
npm --prefix src run safety:guard
```

## Source Of Truth

The official compiled taxonomy artifacts are:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

The graph read model is derived and read-only:

- `data/read-models/olfactory-graph/v2.11/graph.json`

The graph is useful for query proofs and future agent/RAG consumers, but it never replaces compiled artifacts and never creates new curatorial truth.

`data/enriched_materials.json` is a large gitignored corpus input required only for full taxonomy recompilation.

## Architecture Notes

The main pipeline is:

```text
seeds + enriched corpus
  -> loaders
  -> descriptor normalization
  -> analysis
  -> inference
  -> compiler
  -> compiled JSON artifacts
  -> graph read model
```

Module responsibilities:

- `src/loader/`: load and validate seeds, aliases, and corpus inputs.
- `src/normalizer/`: deterministic descriptor normalization.
- `src/analyzer/`: frequency, co-occurrence, alias candidates, and textual similarity.
- `src/inference/`: profiles, clusters, evidence, noise, placement, and similarity graph logic.
- `src/compiler/`: all-or-nothing compilation, schema validation, quality gates, and atomic writes.
- `src/cli/`: compile, integrity, and graph read-model workflows.
- `src/graph_read_model/`: contract, graph IDs, builder, validator, query proofs, fail-closed consumer, writer, and boundary audit.
- `src/tests/`: Vitest tests by domain.

The standalone engine in `engine_calcula_tenacidade_volatilidade/` is pure TypeScript math for normalized volatility and tenacity scores.

## Coding Standards

Follow the established TypeScript style:

- ESM modules with `"type": "module"`.
- TypeScript strict mode with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- Use `.js` suffixes in source imports that point to TypeScript files.
- Prefer pure functions, immutable data, and explicit inputs/outputs.
- Keep I/O at loaders, CLIs, writers, and boundary modules.
- Use `readonly` types for domain data where practical.
- Use `snake_case` filenames, `camelCase` functions, `PascalCase` types, and `UPPER_SNAKE_CASE` constants.
- Do not add runtime dependencies to the Taxonomy Builder without an explicit GSD decision.
- Preserve deterministic output: stable sorting, `JSON.stringify(payload, null, 2)`, and trailing newlines.

The codebase generally omits semicolons. Match the surrounding file.

## Graph Read Model Rules

The graph contract is static and zero-dependency:

- Schema version: `olfactory_graph_read_model.v1`.
- Allowed node kinds: `family`, `subfamily`, `descriptor`, `alias`.
- Allowed edge kinds: `contains_subfamily`, `contains_descriptor`, `resolves_to`, `similar_to`.
- Allowed node ID prefixes: `family:`, `subfamily:`, `descriptor:`, `alias:`.
- Forbidden graph prefixes include `material:`, `molecule:`, `pubchem:`, `review_item:`, `score:`, `graphify:`, and `neo4j:`.

Production graph inputs are only:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

The trusted consumption chain is:

```text
graph:build -> raw graph.json -> asValidatedGraph(graph) -> createValidatedQueryConsumer(validatedGraph) -> query proof
```

For agent/RAG integrations, do not call `query_graph.ts` directly. Use `asValidatedGraph` and `createValidatedQueryConsumer` so invalid graphs fail closed.

Query proofs use the stable envelope:

```typescript
{
  readonly query_kind: string
  readonly params: unknown
  readonly result: unknown
  readonly path?: readonly unknown[]
}
```

`result` is authoritative. `params` is correlation-only. `path` is optional provenance and must not replace `result`.

## Commands

Install and validate the main package:

```bash
npm ci --prefix src
npm --prefix src run typecheck
npm --prefix src test
npm --prefix src run verify:integrity -- --json
npm --prefix src run alias:integrity -- --json
```

Build and graph commands:

```bash
npm --prefix src run build
npm --prefix src run compile
npm --prefix src run compile:quality
npm --prefix src run graph:build -- --dry-run
npm --prefix src run graph:build -- --json
```

The full `compile` command requires `data/enriched_materials.json`.

Validate the standalone engine when touching it:

```bash
npm ci --prefix engine_calcula_tenacidade_volatilidade
npm --prefix engine_calcula_tenacidade_volatilidade run build
npm --prefix engine_calcula_tenacidade_volatilidade test
```

The GitHub CI currently covers the `src/` package on Node.js 24: install, typecheck, tests, alias integrity, and verify integrity.

## Testing Expectations

Choose tests based on the changed area:

- Normalizer changes: `src/tests/normalization/*.test.ts`
- Analyzer changes: `src/tests/analysis/*.test.ts`
- Inference changes: `src/tests/inference/*.test.ts`
- Compiler changes: `src/tests/compiler/*.test.ts`
- CLI changes: `src/tests/cli/*.test.ts`
- Graph changes: `src/tests/graph_read_model/*.test.ts`
- Curation/inventory changes: `src/tests/curation/*.test.ts` and `src/tests/inventory/*.test.ts`

For most `src/` changes, run:

```bash
npm --prefix src run typecheck
npm --prefix src test
```

For graph or protected-boundary changes, also run:

```bash
npm --prefix src run graph:build -- --dry-run
npm --prefix src run verify:integrity -- --json
npm --prefix src run alias:integrity -- --json
```

## Documentation And Language

- Code names and comments are generally English.
- Maintainer and operational docs are often Portuguese.
- GSD artifacts may be Portuguese or English; follow the language of the active phase context.
- Do not update generated-looking docs or planning summaries unless the work requires it.

## Known Traps

- `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`, and `.planning/codebase/TESTING.md` include older mappings focused on the standalone engine; prefer `README.md`, `.planning/STATE.md`, `.planning/PROJECT.md`, and current code when they conflict.
- `.planning/HANDOFF.md` and `.planning/HANDOFF.json` can be stale; prefer `.planning/STATE.md`.
- `DEFAULT_PATHS.version` remains historically `2.1.0`; later releases were published via explicit `--version`.
- `graph:build --dry-run` is safe for verification and writes only to a temporary directory.
- Normal `compile` is intentionally lighter than `compile:quality`; do not make everyday compile heavier without a GSD decision.
- Missing graph query targets are valid empty/null results, not systemic errors.
- A raw `graph.json` read from disk is not trusted until it passes `asValidatedGraph`.

## Agent Operating Rules

Keep changes tightly scoped to the active request or GSD phase. Preserve protected data boundaries, avoid opportunistic refactors, and do not introduce new product surfaces without planning artifacts.

When the user asks for implementation outside an active milestone, first check whether it is small enough for `$gsd-quick`; otherwise route it through new milestone or phase planning.

When behavior changes, add or update tests near the affected module. When only docs change, verify references against current code and planning state.

Never treat generated artifacts, compiled taxonomy files, or graph outputs as casual scratch space. Use `/tmp` for sandbox verification and only write sanctioned production outputs through existing CLIs.
