# Phase 60: Contract Constants & Validation Hardening - Research

**Researched:** 2026-06-16  
**Domain:** TypeScript zero-dependency graph read-model contract and validation hardening  
**Confidence:** HIGH

## User Constraints (from CONTEXT.md)

Source for all bullets in this section: [VERIFIED: .planning/phases/60-contract-constants-validation-hardening/60-CONTEXT.md]

### Locked Decisions

#### Graph ID Boundary
- **D-01:** `contract.ts` continua como fonte normativa dos prefixes autoritativos, mas a superficie oficial de IDs deve ser exposta por um modulo central como `graph_id.ts` consumindo exclusivamente essas constantes.
- **D-02:** A API oficial de IDs deve incluir `makeFamilyGraphId`, `makeSubfamilyGraphId`, `makeDescriptorGraphId`, `makeAliasGraphId`, `stripGraphIdPrefix`, `isFamilyGraphId`, `isSubfamilyGraphId`, `isDescriptorGraphId`, `isAliasGraphId` e `parseGraphId`.
- **D-03:** `parseGraphId` deve retornar uma uniao discriminada deterministica, sem throws genericos, com erro JSON-safe tipado para prefixo desconhecido, raw ID vazio e formatos ambiguos.
- **D-04:** Builder, validator e query modules nao devem mais montar IDs com templates locais nem remover prefixes com regex ou `replace`; type guards e parser devem reutilizar a mesma implementacao central.

#### Validation Error Contract
- **D-05:** O contrato deve oficializar o vocabulario completo de erros observaveis da validacao, incluindo `invalid_schema_version`, `inconsistent_stats`, duplicate IDs, missing endpoints, wrong endpoint kinds, invalid alias targets e invalid similarity endpoints.
- **D-06:** O modelo de erro sera hibrido: `code` identifica a categoria estavel e consumivel; `invariant_id` identifica a regra contratual especifica quando houver mapeamento normativo explicito.
- **D-07:** Os codigos atuais devem ser preservados sempre que possivel para evitar quebra de testes, snapshots, CLI e consumidores; novos codigos so podem nascer do vocabulario autoritativo exportado pelo contrato.
- **D-08:** O contrato deve exportar `GRAPH_VALIDATION_ERROR_CODES`, `GRAPH_INVARIANT_IDS`, os union types derivados e uma associacao opcional e estavel entre codigos e invariantes.

#### Validation Surfaces And Profiles
- **D-09:** A superficie oficial de validacao deve separar tres responsabilidades: `validateOlfactoryGraphStructure(graph)`, `validateOlfactoryGraphAgainstProfile(graph, profile)` e `validateSanctionedV211Graph(graph)`.
- **D-10:** `validateOlfactoryGraphStructure(graph)` valida apenas regras independentes de publicacao ou baseline especifico: schema, IDs, kinds, endpoints, relacoes permitidas, aliases validos, propriedades obrigatorias e consistencia interna de stats calculaveis a partir do proprio grafo.
- **D-11:** `validateOlfactoryGraphAgainstProfile(graph, profile)` deve executar a validacao estrutural primeiro e interromper a validacao de profile quando a estrutura impedir comparacao confiavel; profiles sao objetos tipados, imutaveis e extensveis.
- **D-12:** `validateSanctionedV211Graph(graph)` e o entrypoint oficial para o artefato sancionado atual e deve usar um profile autoritativo exportado pelo contrato, como `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`, incluindo no minimo schema/contract version, `profile_id` estavel e baseline `10/18/341/18/13`.
- **D-13:** CLI, live regression e o consumer-facing query boundary da Phase 61 devem chamar o wrapper sancionado, nao selecionar manualmente profiles nem usar flags implicitas como `strict: true`.

#### Structured Error Payloads
- **D-14:** O shape base de erro deve permanecer estavel e compatvel com CLI, snapshots e futuros consumidores: `{ code, path, message, invariant_id?, node_id?, edge_id?, expected?, actual? }`.
- **D-15:** `expected` e `actual` devem usar um tipo explicito `JsonValue`; `unknown`, `Date`, `Map`, `Set`, `BigInt`, stack traces, funcoes, classes, `undefined` e metadata variavel sao proibidos.
- **D-16:** Erros criticos devem ser produzidos por factories funcionais tipadas e centralizadas, incluindo pelo menos schema version, graph ID invalido, node/edge duplicado, endpoint ausente, kind incompativel, stats internos inconsistentes, divergencia de profile/baseline e `graph_not_validated`.
- **D-17:** As factories devem fixar `code`, preencher `invariant_id` quando houver associacao normativa, normalizar `path`, produzir mensagens estaveis e preencher `expected`/`actual` com shapes previsiveis e JSON-safe.

### the agent's Discretion
Nenhuma area relevante foi delegada para decisao livre do agente. As fronteiras que a Phase 61 precisa consumir ficaram explicitamente travadas nesta discussao.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.

## Project Constraints (from AGENTS.md and GEMINI.md)

| Directive | Planning Impact |
|-----------|-----------------|
| Sempre responder em Portugues do Brasil. [VERIFIED: user-provided AGENTS.md instructions] | Planos, notas e comunicacao devem ficar em pt-BR. |
| O projeto usa o framework GSD e artefatos `.planning/PROJECT.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md` e `.planning/STATE.md`. [VERIFIED: GEMINI.md] | O plano deve manter rastreabilidade GSD e escrever artefatos na pasta da fase. |
| O foco atual e Phase 60 dentro do milestone v2.12. [VERIFIED: .planning/STATE.md] | Nao incluir blocos de Phase 61, 62 ou 63 no plano de implementacao. |
| A regra local `graphify.md` pede consultar `graphify-out/GRAPH_REPORT.md` em perguntas de arquitetura. [VERIFIED: .agents/rules/graphify.md] | `graphify-out` foi lido como contexto de navegacao, mas permanece fora do read-model workflow. |

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GCON-05 | Maintainer can inspect one authoritative contract/source module for graph ID prefixes, invariant identifiers, baseline validation expectations, and shared graph-read-model constants. [VERIFIED: .planning/REQUIREMENTS.md] | `contract.ts` already centralizes schema, prefixes, endpoint kinds, output policy and baseline stats, and should gain validation error codes, invariant IDs and sanctioned profile constants. [VERIFIED: src/graph_read_model/contract.ts] |
| GCON-06 | Maintainer can verify builder, validator, and query-consumption code paths no longer depend on duplicated hardcoded graph ID prefixes or invariant identifiers where a shared authoritative constant exists. [VERIFIED: .planning/REQUIREMENTS.md] | `build_graph.ts` and `query_graph.ts` currently define local ID helper templates, and `query_graph.ts` strips `subfamily:` with regex/replace. [VERIFIED: src/graph_read_model/build_graph.ts; src/graph_read_model/query_graph.ts] |
| GVAL-06 | Maintainer can run graph validation and receive deterministic structured failures tied to contract-defined expectations for schema, structural invariants, and baseline stat reconciliation. [VERIFIED: .planning/REQUIREMENTS.md] | `validate_graph.ts` already emits deterministic `code/path/message` errors, but codes are local strings and profile/baseline validation is not separated. [VERIFIED: src/graph_read_model/validate_graph.ts] |

## Summary

Phase 60 should be planned as a contract-surface hardening pass, not as a query-consumption fail-closed implementation. The correct dependency order is: contract/types/vocabularies, central `graph_id` boundary, validation error factories, structural/profile/sanctioned wrapper split, migration of builder/validator/query/CLI, then drift/baseline/compatibility tests. [VERIFIED: .planning/phases/60-contract-constants-validation-hardening/60-CONTEXT.md]

The main technical risk is drift between constants, ID construction, validation codes, CLI output and tests. Existing v2.11 debt names that directly: W-02 baseline only in regression tests, W-04 validator invariant codes as local string literals, W-05 builder ID prefixes hardcoded, and W-06 query validation guard deferred to a future phase. [VERIFIED: .planning/milestones/v2.11-MILESTONE-AUDIT.md]

**Primary recommendation:** add authoritative constants and typed helpers first, keep legacy observable codes stable, expose sanctioned validation as a wrapper, and defer complete proof-generation fail-closed behavior to Phase 61. [VERIFIED: 60-CONTEXT.md; .planning/ROADMAP.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Contract constants and vocabularies | TypeScript library module | Tests/docs | `contract.ts` is already the normative static contract module for graph schema, IDs, output policy and baseline stats. [VERIFIED: src/graph_read_model/contract.ts] |
| Graph ID construction/parsing | TypeScript library module | Builder/query/validator | Current ID helpers are duplicated in builder and query, so a central `graph_id.ts` should own construction, type guards and parsing. [VERIFIED: src/graph_read_model/build_graph.ts; src/graph_read_model/query_graph.ts] |
| Validation factories and profiles | TypeScript library module | CLI/tests | `types.ts` currently owns `GraphValidationError` and `makeGraphError`, while `validate_graph.ts` owns validation rules; Phase 60 should preserve the result shape while centralizing factories and profile constants. [VERIFIED: src/graph_read_model/types.ts; src/graph_read_model/validate_graph.ts] |
| Sanctioned graph build CLI validation | CLI boundary | Validation module | `src/cli/graph_read_model.ts` currently calls `validateOlfactoryGraph(graph)` before writing; Phase 60 should switch that call to `validateSanctionedV211Graph(graph)`. [VERIFIED: src/cli/graph_read_model.ts] |
| Query read model consumption prep | Query module | Phase 61 wrapper | Phase 60 may migrate ID helper usage in `query_graph.ts`, but complete invalid/unvalidated graph fail-closed query behavior is Phase 61 scope. [VERIFIED: .planning/ROADMAP.md; 60-CONTEXT.md] |

## Standard Stack

### Core

| Library/Module | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| TypeScript | 5.9.3 installed | Strict ESM implementation with derived literal union types from `as const` contracts. [VERIFIED: src/package.json; local `node` package metadata; CITED: /microsoft/typescript/v5.9.3] | Existing project compiler, strict options, and contract style already use `as const` plus `typeof ARRAY[number]`. [VERIFIED: src/tsconfig.json; src/graph_read_model/contract.ts] |
| Vitest | 3.2.4 installed | Deterministic unit/live regression tests for contract, builder, validator, CLI and baseline. [VERIFIED: src/package.json; local `node` package metadata; CITED: /vitest-dev/vitest/v3_2_4] | Existing graph read-model tests use Vitest and targeted commands already pass when `TMPDIR=/tmp`. [VERIFIED: src/vitest.config.ts; test command run 2026-06-16] |
| `src/graph_read_model/contract.ts` | local module | Normative constants for graph schema, ID prefixes, endpoint kinds, output policy and baseline. [VERIFIED: src/graph_read_model/contract.ts] | Phase decisions require this module to remain normative while adding validation vocabulary/profile constants. [VERIFIED: 60-CONTEXT.md] |

### Supporting

| Module | Purpose | When to Use |
|--------|---------|-------------|
| New `src/graph_read_model/graph_id.ts` | Central graph ID construction, type guards, stripping and parsing. [VERIFIED: 60-CONTEXT.md] | Use before migrating builder/query/validator so every downstream module imports one API. |
| New or expanded validation error factory surface | Central deterministic `GraphValidationError` creation with JSON-safe `expected`/`actual`. [VERIFIED: 60-CONTEXT.md] | Use before splitting validation surfaces, so all emitted errors share the same shape and code vocabulary. |
| Existing `src/graph_read_model/types.ts` | Shared graph, validation and proof types. [VERIFIED: src/graph_read_model/types.ts] | Extend for `JsonValue`, typed validation error codes and optional `invariant_id` without breaking existing consumers. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zero-dependency typed helpers | Add runtime schema/validation library | Rejected by milestone scope: v2.12 excludes new external graph/query/runtime dependencies. [VERIFIED: .planning/REQUIREMENTS.md] |
| Preserve `validateOlfactoryGraph` as the only entrypoint | Replace it with only new names | Prefer compatibility alias to `validateOlfactoryGraphStructure` unless tests prove no consumer impact, because existing tests, CLI and docs call `validateOlfactoryGraph`. [VERIFIED: src/tests/graph_read_model/*.test.ts; src/cli/graph_read_model.ts; docs/olfactory_graph_read_model.md] |

**Installation:**

```bash
# No new install for Phase 60.
```

**Version verification:** Installed versions were read from local package metadata: TypeScript 5.9.3, Vitest 3.2.4, Node v24.14.0, npm 11.9.0. [VERIFIED: local commands 2026-06-16]

## Package Legitimacy Audit

Phase 60 should not install external packages; the milestone explicitly excludes new external graph/query/runtime dependencies. [VERIFIED: .planning/REQUIREMENTS.md]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| None new | npm | n/a | n/a | n/a | n/a | No install task needed. [VERIFIED: .planning/REQUIREMENTS.md; src/package.json] |

**Packages removed due to [SLOP] verdict:** none. [VERIFIED: no new packages recommended]  
**Packages flagged as suspicious [SUS]:** none. [VERIFIED: no new packages recommended]

## Architecture Patterns

### System Architecture Diagram

Source: local graph read-model modules and Phase 60 context. [VERIFIED: src/graph_read_model/*.ts; 60-CONTEXT.md]

```text
compiled v2 inputs
  -> buildOlfactoryGraph()
     -> graph_id.ts helpers
     -> OlfactoryGraph
        -> validateOlfactoryGraphStructure()
           -> structural errors from factories
        -> validateOlfactoryGraphAgainstProfile(profile)
           -> baseline/profile errors from factories
        -> validateSanctionedV211Graph()
           -> CLI graph:build and live regression tests
        -> query_graph.ts
           -> graph_id.ts helpers only in Phase 60
           -> full fail-closed query wrappers in Phase 61
```

### Recommended Project Structure

```text
src/graph_read_model/
├── contract.ts          # normative constants, error vocabulary, invariant IDs, sanctioned profile
├── graph_id.ts          # ID makers, guards, strip, parseGraphId
├── types.ts             # GraphValidationError, JsonValue, result/proof types
├── validate_graph.ts    # structural/profile/sanctioned validation entrypoints
├── build_graph.ts       # graph construction via graph_id helpers
└── query_graph.ts       # query proofs via graph_id helpers only; no Phase 61 fail-closed block
```

### Pattern 1: Literal Contract Types From Constants

**What:** define `as const` arrays/objects, then derive unions via indexed access. [CITED: /microsoft/typescript/v5.9.3]  
**When to use:** validation error codes, invariant IDs, profile IDs and graph ID prefixes should all use this pattern. [VERIFIED: src/graph_read_model/contract.ts]

```typescript
// Source: Context7 /microsoft/typescript/v5.9.3 and local contract.ts
export const GRAPH_VALIDATION_ERROR_CODES = [
  'invalid_schema_version',
  'inconsistent_stats',
] as const

export type GraphValidationErrorCode = (typeof GRAPH_VALIDATION_ERROR_CODES)[number]
```

### Pattern 2: Structured Error Factories

**What:** expose named functions that fix `code`, optional `invariant_id`, normalized `path`, stable `message`, and JSON-safe `expected`/`actual`. [VERIFIED: 60-CONTEXT.md]  
**When to use:** every validator branch that currently calls `makeGraphError` directly with a string literal. [VERIFIED: src/graph_read_model/validate_graph.ts]

```typescript
// Source: Phase 60 decisions and existing makeGraphError pattern
export const makeInvalidSchemaVersionError = (actual: JsonValue): GraphValidationError =>
  makeGraphValidationError({
    code: 'invalid_schema_version',
    invariant_id: 'schema_version_matches_contract',
    path: '$.schema_version',
    message: `expected ${GRAPH_SCHEMA_VERSION}, got ${String(actual)}`,
    expected: GRAPH_SCHEMA_VERSION,
    actual,
  })
```

### Pattern 3: Structural First, Profile Second

**What:** run structural validation first; run profile/baseline reconciliation only if structural validation is reliable. [VERIFIED: 60-CONTEXT.md]  
**When to use:** `validateOlfactoryGraphAgainstProfile(graph, profile)` and `validateSanctionedV211Graph(graph)`. [VERIFIED: 60-CONTEXT.md]

```typescript
// Source: Phase 60 D-09 through D-12
export const validateOlfactoryGraphAgainstProfile = (
  graph: OlfactoryGraph,
  profile: GraphValidationProfile,
): GraphValidationResult => {
  const structure = validateOlfactoryGraphStructure(graph)
  if (!structure.ok) return structure
  return combineGraphResults(structure, validateProfileExpectations(graph, profile))
}
```

### Anti-Patterns to Avoid

- **Local ID templates:** `family:${id}` helpers inside builder/query duplicate contract prefixes and are direct W-05 drift risk. [VERIFIED: src/graph_read_model/build_graph.ts; src/graph_read_model/query_graph.ts; v2.11-MILESTONE-AUDIT.md]
- **Regex prefix stripping in query code:** `replace(/^subfamily:/, '')` bypasses the future parser/guard contract. [VERIFIED: src/graph_read_model/query_graph.ts]
- **Local validation code literals:** validator currently emits observable codes as string literals, which W-04 flags as drift risk. [VERIFIED: src/graph_read_model/validate_graph.ts; v2.11-MILESTONE-AUDIT.md]
- **Profile flags like `strict: true`:** Phase 60 decisions require explicit profile objects and a sanctioned wrapper instead of implicit flags. [VERIFIED: 60-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Graph ID parsing | Ad-hoc regex/replace at call sites | `parseGraphId` plus `is*GraphId` helpers in `graph_id.ts` | Prevents divergent handling of unknown prefix, empty raw ID and ambiguous format. [VERIFIED: 60-CONTEXT.md] |
| Validation errors | Inline `{ code, path, message }` object literals | Central factories backed by `GRAPH_VALIDATION_ERROR_CODES` and `GRAPH_INVARIANT_IDS` | Keeps CLI/tests/future consumers on stable codes and JSON-safe payloads. [VERIFIED: 60-CONTEXT.md] |
| Baseline validation | One-off test assertions only | `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE` plus `validateSanctionedV211Graph` | Addresses W-02 while preserving `10/18/341/18/13` as sanctioned profile expectation. [VERIFIED: v2.11-MILESTONE-AUDIT.md; 60-CONTEXT.md] |
| Runtime validation library | New schema dependency | Existing TypeScript + pure functions | v2.12 excludes new external graph/query/runtime dependencies. [VERIFIED: .planning/REQUIREMENTS.md] |

**Key insight:** the hard part is not validation algorithm complexity; it is keeping every observable string, prefix and baseline expectation behind one sanctioned contract so Phase 61 can consume stable surfaces. [VERIFIED: 60-CONTEXT.md; v2.11-MILESTONE-AUDIT.md]

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | `data/read-models/olfactory-graph/v2.11/graph.json` exists and contains graph IDs generated with current prefixes. [VERIFIED: `find data/read-models/olfactory-graph/v2.11`] | No data migration in Phase 60; generated artifact compatibility should be preserved by keeping ID strings unchanged. [VERIFIED: .planning/REQUIREMENTS.md; contract.ts] |
| Live service config | None found; milestone excludes runtime/API/database/service integration. [VERIFIED: .planning/REQUIREMENTS.md; .planning/PROJECT.md] | None. |
| OS-registered state | None found; Phase 60 is TypeScript library/CLI hardening and no OS registration is documented. [VERIFIED: .planning/PROJECT.md; .planning/STATE.md] | None. |
| Secrets/env vars | No graph validation env var or secret boundary was found for this phase. [VERIFIED: `rg GRAPH_.*PREFIX|GRAPH_EXPECTED|DATABASE_URL`; src/package.json absent at repo root] | None. |
| Build artifacts | `src/dist/` and `src/node_modules/` exist from the Node build/test setup; typecheck passes. [VERIFIED: src/package.json; local `npm --prefix src run typecheck`] | Planner should include typecheck/tests after edits; no reinstall task needed. |

**Nothing found in category:** no database, service config, OS registration, secret rename or installed package rename is required for this constants hardening phase. [VERIFIED: .planning/REQUIREMENTS.md; .planning/PROJECT.md]

## Common Pitfalls

### Pitfall 1: Breaking Observable Error Codes

**What goes wrong:** tests, CLI output and future consumers break if `duplicate_node_id_detection`, `missing_edge_endpoints` or `inconsistent_stats` are renamed casually. [VERIFIED: src/tests/graph_read_model/validate_graph.test.ts; src/cli/graph_read_model.ts]  
**Why it happens:** validator codes are currently local strings and not yet backed by a contract vocabulary. [VERIFIED: src/graph_read_model/validate_graph.ts]  
**How to avoid:** export code constants/types first and map old codes to invariant IDs without changing code strings unless a new code is explicitly required. [VERIFIED: 60-CONTEXT.md]  
**Warning signs:** snapshots or tests assert string codes outside `contract.ts`. [VERIFIED: src/tests/graph_read_model/validate_graph.test.ts]

### Pitfall 2: Mixing Baseline Validation Into Structural Validation

**What goes wrong:** future non-v2.11 graphs fail structural validation just because their profile differs from the sanctioned baseline. [VERIFIED: 60-CONTEXT.md]  
**Why it happens:** the current validator has only one entrypoint and W-02 notes the baseline is only enforced in regression tests. [VERIFIED: src/graph_read_model/validate_graph.ts; v2.11-MILESTONE-AUDIT.md]  
**How to avoid:** keep `validateOlfactoryGraphStructure` profile-independent and put `10/18/341/18/13` in `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`. [VERIFIED: 60-CONTEXT.md]  
**Warning signs:** `GRAPH_EXPECTED_BASELINE_STATS` appears directly in structural validation branches instead of profile validation. [VERIFIED: 60-CONTEXT.md]

### Pitfall 3: Accidentally Implementing Phase 61

**What goes wrong:** Phase 60 grows query proof fail-closed wrappers and changes proof behavior before the proof contract phase. [VERIFIED: .planning/ROADMAP.md]  
**Why it happens:** Phase 60 touches `query_graph.ts` for ID helper migration, near the Phase 61 boundary. [VERIFIED: 60-CONTEXT.md; src/graph_read_model/query_graph.ts]  
**How to avoid:** migrate ID construction/strip only; do not add the complete invalid/unvalidated graph proof-generation block. [VERIFIED: user additional context; .planning/ROADMAP.md]  
**Warning signs:** changes to `GraphQueryProof` success envelope or query function return semantics. [VERIFIED: .planning/REQUIREMENTS.md; src/graph_read_model/types.ts]

### Pitfall 4: Non JSON-Safe Error Payloads

**What goes wrong:** `expected`/`actual` include `undefined`, `Map`, `Set`, functions, classes, `Date`, `BigInt` or stack traces. [VERIFIED: 60-CONTEXT.md]  
**Why it happens:** the current `GraphValidationError` has no `JsonValue` type and no `expected`/`actual` fields. [VERIFIED: src/graph_read_model/types.ts]  
**How to avoid:** define `JsonValue` in `types.ts` and make factories the only way to add rich payloads. [VERIFIED: 60-CONTEXT.md]

## Code Examples

Verified patterns from official and local sources:

### Derive Union From Contract Array

```typescript
// Source: Context7 /microsoft/typescript/v5.9.3 and src/graph_read_model/contract.ts
export const GRAPH_INVARIANT_IDS = [
  'schema_version_matches_contract',
  'graph_stats_match_profile_baseline',
] as const

export type GraphInvariantId = (typeof GRAPH_INVARIANT_IDS)[number]
```

### Vitest Exact Structured Error Assertion

```typescript
// Source: Context7 /vitest-dev/vitest/v3_2_4 and existing validate_graph.test.ts style
expect(result.errors).toEqual([
  {
    code: 'invalid_schema_version',
    invariant_id: 'schema_version_matches_contract',
    path: '$.schema_version',
    message: 'expected olfactory_graph_read_model.v1, got wrong_schema',
    expected: 'olfactory_graph_read_model.v1',
    actual: 'wrong_schema',
  },
])
```

### Backward-Compatible Validation Alias

```typescript
// Source: existing public usage in tests/CLI plus Phase 60 surface split decision
export const validateOlfactoryGraph = validateOlfactoryGraphStructure
```

Use this only if the implementation wants to preserve old imports while migrating CLI/live regression to `validateSanctionedV211Graph`. [VERIFIED: src/tests/graph_read_model/*.test.ts; src/cli/graph_read_model.ts; 60-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contract docs declared invariant names, validator emitted local string codes. [VERIFIED: docs/olfactory_graph_contract.md; src/graph_read_model/validate_graph.ts] | Contract exports validation code and invariant vocabularies, validator emits via factories. [VERIFIED: 60-CONTEXT.md] | Phase 60 | Reduces W-04 drift risk. [VERIFIED: v2.11-MILESTONE-AUDIT.md] |
| Builder/query constructed IDs locally. [VERIFIED: src/graph_read_model/build_graph.ts; src/graph_read_model/query_graph.ts] | Builder/query import `graph_id.ts` helpers backed by `GRAPH_ID_PREFIXES`. [VERIFIED: 60-CONTEXT.md] | Phase 60 | Reduces W-05 drift risk. [VERIFIED: v2.11-MILESTONE-AUDIT.md] |
| Baseline `10/18/341/18/13` enforced in live regression only. [VERIFIED: src/tests/graph_read_model/live_artifact_baseline.test.ts; v2.11-MILESTONE-AUDIT.md] | Sanctioned profile validates baseline through `validateSanctionedV211Graph`. [VERIFIED: 60-CONTEXT.md] | Phase 60 | Makes GVAL-06 deterministic without blocking future profiles. |

**Deprecated/outdated:**
- Local graph ID helpers in `build_graph.ts` and `query_graph.ts`: replace with central helpers. [VERIFIED: src/graph_read_model/build_graph.ts; src/graph_read_model/query_graph.ts]
- Direct validator calls from CLI to the generic entrypoint: use sanctioned wrapper for `graph:build`. [VERIFIED: src/cli/graph_read_model.ts; 60-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| None | All implementation-relevant claims are verified against local project files, project context, local commands or Context7 docs. | All | n/a |

## Open Questions (RESOLVED)

1. **RESOLVED: `validateOlfactoryGraph` remains exported as a compatibility alias.**
   - What we know: current tests, CLI and docs call `validateOlfactoryGraph`. [VERIFIED: src/tests/graph_read_model/*.test.ts; src/cli/graph_read_model.ts; docs/olfactory_graph_read_model.md]
   - Resolution: keep the alias to `validateOlfactoryGraphStructure` for compatibility and migrate sanctioned call sites to `validateSanctionedV211Graph`. [VERIFIED: 60-CONTEXT.md; 60-04-PLAN.md]
   - Planning impact: executor must preserve current imports/tests that still use `validateOlfactoryGraph` while introducing the explicit structural/profile/sanctioned surfaces.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | TypeScript/Vitest commands | yes | v24.14.0 [VERIFIED: local command] | none needed |
| npm | scripts under `src/package.json` | yes | 11.9.0 [VERIFIED: local command] | none needed |
| TypeScript | `npm --prefix src run typecheck` | yes | 5.9.3 installed [VERIFIED: local package metadata] | none needed |
| Vitest | graph read-model tests | yes | 3.2.4 installed [VERIFIED: local package metadata] | set `TMPDIR=/tmp` in this sandbox if default temp path points at `/mnt/c/...` [VERIFIED: test rerun 2026-06-16] |

**Missing dependencies with no fallback:** none. [VERIFIED: local commands]  
**Missing dependencies with fallback:** default Vitest temp path failed in this environment, but `env TMPDIR=/tmp npm --prefix src test -- ...` passed. [VERIFIED: local test commands 2026-06-16]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 [VERIFIED: local package metadata] |
| Config file | `src/vitest.config.ts` includes `tests/**/*.test.ts`. [VERIFIED: src/vitest.config.ts] |
| Quick run command | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts tests/graph_read_model/validate_graph.test.ts tests/graph_read_model/build_graph.test.ts` [VERIFIED: passed 21 tests on 2026-06-16] |
| Full suite command | `env TMPDIR=/tmp npm --prefix src test` [VERIFIED: src/package.json] |
| Typecheck command | `npm --prefix src run typecheck` [VERIFIED: passed on 2026-06-16] |

### Phase Requirements To Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| GCON-05 | Contract exports authoritative ID prefixes, invariant IDs, validation error codes and sanctioned profile constants. [VERIFIED: .planning/REQUIREMENTS.md] | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts` | yes, expand existing file. [VERIFIED: src/tests/graph_read_model/contract.test.ts] |
| GCON-06 | Builder, validator and query code consume shared graph ID/error constants instead of local duplicate literals where practical. [VERIFIED: .planning/REQUIREMENTS.md] | unit/static drift | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts tests/graph_read_model/build_graph.test.ts tests/graph_read_model/query_graph.test.ts` | yes, add drift assertions. [VERIFIED: existing test files] |
| GVAL-06 | Validation returns deterministic structured errors tied to contract expectations and sanctioned baseline profile. [VERIFIED: .planning/REQUIREMENTS.md] | unit/live regression | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts tests/graph_read_model/live_artifact_baseline.test.ts` | yes, expand existing files. [VERIFIED: existing test files] |

### Sampling Rate

- **Per task commit:** `npm --prefix src run typecheck` plus targeted graph read-model tests. [VERIFIED: local commands]
- **Per wave merge:** `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts tests/graph_read_model/build_graph.test.ts tests/graph_read_model/validate_graph.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/cli/graph_read_model.test.ts`. [VERIFIED: existing files]
- **Phase gate:** full `npm --prefix src run typecheck` and `env TMPDIR=/tmp npm --prefix src test` green before verification. [VERIFIED: src/package.json]

### Wave 0 Gaps

- [ ] `src/graph_read_model/graph_id.ts` - new module needed for ID boundary. [VERIFIED: file absent from `find src/graph_read_model`]
- [ ] `src/tests/graph_read_model/graph_id.test.ts` - new tests needed for ID makers, guards, parse failures and strip behavior. [VERIFIED: file absent from `find src/tests/graph_read_model`]
- [ ] Expand `src/tests/graph_read_model/contract.test.ts` - cover `GRAPH_VALIDATION_ERROR_CODES`, `GRAPH_INVARIANT_IDS`, mapping and sanctioned profile. [VERIFIED: current test lacks those exports]
- [ ] Expand `src/tests/graph_read_model/validate_graph.test.ts` - cover `expected`/`actual`, `invariant_id`, profile short-circuit and baseline mismatch. [VERIFIED: current test asserts code/path only]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth surface in Phase 60. [VERIFIED: .planning/REQUIREMENTS.md] |
| V3 Session Management | no | No session/runtime surface in Phase 60. [VERIFIED: .planning/REQUIREMENTS.md] |
| V4 Access Control | no | No API/database/runtime access control surface in Phase 60. [VERIFIED: .planning/REQUIREMENTS.md] |
| V5 Input Validation | yes | Typed structural/profile validation with deterministic JSON-safe errors. [VERIFIED: 60-CONTEXT.md; src/graph_read_model/validate_graph.ts] |
| V6 Cryptography | no | No cryptographic changes in Phase 60. [VERIFIED: .planning/REQUIREMENTS.md] |

### Known Threat Patterns for TypeScript Graph Read Model

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Contract drift leading to misleading graph IDs or validation outcomes | Tampering | Single authoritative `contract.ts` constants plus `graph_id.ts` helper boundary. [VERIFIED: 60-CONTEXT.md] |
| Non-deterministic validation payloads leaking runtime-only data | Information Disclosure | JSON-safe `expected`/`actual`, no stack traces/functions/classes/undefined. [VERIFIED: 60-CONTEXT.md] |
| Query consumers trusting invalid graph shape | Tampering | Phase 60 provides sanctioned validation surfaces; complete fail-closed query consumption remains Phase 61. [VERIFIED: .planning/ROADMAP.md; 60-CONTEXT.md] |

## Sources

### Primary

- `.planning/phases/60-contract-constants-validation-hardening/60-CONTEXT.md` - locked Phase 60 decisions, dependency order, scope fence. [VERIFIED: local read]
- `.planning/REQUIREMENTS.md` - GCON-05, GCON-06, GVAL-06 and out-of-scope boundaries. [VERIFIED: local read]
- `.planning/ROADMAP.md` - Phase 60 and Phase 61 separation. [VERIFIED: local read]
- `.planning/STATE.md` - current milestone and Phase 60 decisions. [VERIFIED: local read]
- `.planning/PROJECT.md` - v2.12 scope and zero-dependency static read-model posture. [VERIFIED: local read]
- `.planning/milestones/v2.11-MILESTONE-AUDIT.md` - W-02, W-04, W-05, W-06 debt. [VERIFIED: local read]
- `src/graph_read_model/contract.ts`, `types.ts`, `build_graph.ts`, `validate_graph.ts`, `query_graph.ts`, `src/cli/graph_read_model.ts` - implementation surface. [VERIFIED: local read]
- `src/tests/graph_read_model/*.test.ts`, `src/tests/cli/graph_read_model.test.ts` - current validation architecture. [VERIFIED: local read]

### Secondary

- Context7 `/microsoft/typescript/v5.9.3` - const assertions and indexed access type patterns. [CITED: /microsoft/typescript/v5.9.3]
- Context7 `/vitest-dev/vitest/v3_2_4` - deterministic object/array assertion patterns. [CITED: /vitest-dev/vitest/v3_2_4]
- `graphify-out/GRAPH_REPORT.md` - navigation context identifying `validateOlfactoryGraph` and graph read-model communities; graphify MCP disabled. [VERIFIED: graphify-out/GRAPH_REPORT.md; local `gsd-tools graphify status`]

### Tertiary

- Web search for generic zero-dependency graph hardening returned no useful project-specific source; not used for recommendations. [VERIFIED: research-plan/websearch digest]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - existing `src/package.json`, local installed package metadata and local command verification. [VERIFIED: local commands]
- Architecture: HIGH - based on Phase 60 locked decisions and direct source reads. [VERIFIED: 60-CONTEXT.md; source files]
- Pitfalls: HIGH - based on accepted v2.11 debt and current code/test assertions. [VERIFIED: v2.11-MILESTONE-AUDIT.md; source files]

**Research date:** 2026-06-16  
**Valid until:** 2026-07-16 for local project constraints; re-check package/tool versions if dependency updates happen before planning. [VERIFIED: local commands 2026-06-16]
