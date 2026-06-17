# Phase 61: Fail-Closed Query Consumption - Research

**Researched:** 2026-06-16
**Domain:** TypeScript graph read-model validation boundary and query proof consumption
**Confidence:** HIGH

## User Constraints (from CONTEXT.md)

Source: `.planning/phases/61-fail-closed-query-consumption/61-CONTEXT.md` copied as the locked upstream constraint for Phase 61. [VERIFIED: local codebase]

### Locked Decisions

## Implementation Decisions

### Validated Graph Boundary
- **D-01:** A fronteira principal da Phase 61 deve ser um `ValidatedGraph` explicito como prova de que um `OlfactoryGraph` passou por `validateSanctionedV211Graph(graph)`.
- **D-02:** `query_graph.ts` permanece como camada pura e de baixo nivel sobre `OlfactoryGraph`; a Phase 61 nao deve endurecer diretamente cada query function nem mover validacao para dentro do envelope de sucesso.
- **D-03:** `asValidatedGraph(graph)` e o entrypoint oficial para receber um grafo cru, executar `validateSanctionedV211Graph(graph)` e retornar `ok/error` tipado de forma deterministica.
- **D-04:** `ValidatedGraph` deve ser um handle/tipo explicito, preferencialmente opaco ou branded, para impedir confusao semantica entre grafo cru e grafo apto para query.
- **D-05:** `ValidatedGraph` deve ser reutilizavel por varias query proofs sem revalidar manualmente a cada chamada e sem introduzir runtime state, servico, API, banco ou cache persistente.

### Consumer-Facing Query Surface
- **D-06:** A superficie segura para consumidores deve ser `createValidatedQueryConsumer(validatedGraph)`, aceitando somente `ValidatedGraph` como entrada obrigatoria no caminho sancionado principal.
- **D-07:** O consumer deve expor metodos correspondentes as oito query proofs atuais e reutilizar internamente as funcoes puras existentes de `src/graph_read_model/query_graph.ts`.
- **D-08:** O contrato recomendado para futuros consumidores deve permanecer em duas etapas: primeiro validar e obter `ValidatedGraph`; depois criar o consumer a partir dele.
- **D-09:** Nao implementar `createValidatedQueryConsumer(graph)` como atalho principal, porque isso enfraquece a fronteira semantica entre grafo cru e grafo validado.
- **D-10:** Se um atalho ergonomico para grafo cru existir, ele deve ser claramente secundario e nomeado explicitamente, por exemplo `createValidatedQueryConsumerFromGraph(graph)`, sem substituir o fluxo sancionado principal.

### Error Model And Fail-Closed Semantics
- **D-11:** O caminho oficial da Phase 61 deve usar resultado tipado `ok/error`, sem `throw` no fluxo sancionado principal.
- **D-12:** `asValidatedGraph(graph)` deve retornar `{ ok: true, graph: ValidatedGraph }` em caso de sucesso, ou `{ ok: false, error }` com erro tipado e deterministico quando a validacao sancionada falhar.
- **D-13:** `createValidatedQueryConsumer(validatedGraph)` deve assumir que a prova de validacao ja existe; qualquer tentativa de consumir sem essa prova deve produzir erro tipado `graph_not_validated`.
- **D-14:** Erros de validacao estrutural/profile devem permanecer distintos de `graph_not_validated`; nao misturar falha de validacao com ausencia de resultado de query.
- **D-15:** Os erros detalhados de `validateSanctionedV211Graph(graph)` devem ser preservados quando o grafo for validado e falhar; a Phase 61 nao deve colapsa-los em um erro generico.
- **D-16:** Helpers opcionais `assertValidatedGraph(graph)`, `createValidatedQueryConsumerOrThrow(validatedGraph)` e similares podem existir como conveniencia controlada, desde que lancem apenas erros tipados e deterministicos e nao substituam o caminho principal `ok/error`.

### Query Proof Contract Preservation
- **D-17:** O envelope de sucesso das query proofs permanece exatamente `{ query_kind, params, result, path }` para todas as queries atuais.
- **D-18:** A semantica atual de target ausente deve permanecer proof vazio estruturado, nao erro; o modo fail-closed bloqueia apenas grafos invalidos ou nao validados.
- **D-19:** A Phase 61 nao deve introduzir runtime agent, SaaS/API, DB/Neo4J, Graphify, publicacao, persistencia de query proofs ou novo escopo de grafo.

### the agent's Discretion
Nenhuma area relevante foi delegada para decisao livre do agente. A fronteira `ValidatedGraph -> createValidatedQueryConsumer(validatedGraph)` e o modelo oficial `ok/error` ficaram explicitamente travados nesta discussao.

### Deferred Ideas (OUT OF SCOPE)

None - discussion stayed within phase scope.

## Project Constraints (from user-provided AGENTS.md and GEMINI.md)

- Responder ao usuario em Portugues do Brasil. [VERIFIED: user-provided AGENTS.md instructions]
- Este projeto usa o framework GSD e seus artefatos centrais sao `.planning/PROJECT.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md` e `.planning/STATE.md`. [VERIFIED: GEMINI.md]
- A fase deve preservar o padrao do projeto: TypeScript strict, ESM, Vitest, zero-dependency, arquitetura funcional pura, sem classes, sem mutacao de estado e sem side effects para esta superficie. [VERIFIED: .planning/PROJECT.md; .planning/phases/61-fail-closed-query-consumption/61-CONTEXT.md]

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GVAL-07 | Prevent query-proof generation from invalid or unvalidated graphs through fail-closed guardrails in the consumer-facing query path. [VERIFIED: .planning/REQUIREMENTS.md] | Implement `asValidatedGraph(graph)` plus `createValidatedQueryConsumer(validatedGraph)` using `validateSanctionedV211Graph` and `makeGraphNotValidatedError`. [VERIFIED: src/graph_read_model/validate_graph.ts; src/graph_read_model/validation_errors.ts; 61-CONTEXT.md] |
| GQRY-06 | Preserve `{ query_kind, params, result, path }` as the stable agent-facing proof envelope across all current query functions. [VERIFIED: .planning/REQUIREMENTS.md] | Keep `query_graph.ts` pure and wrap its eight exported proof functions without adding error fields to successful proofs. [VERIFIED: src/graph_read_model/types.ts; src/graph_read_model/query_graph.ts; src/tests/graph_read_model/query_graph.test.ts] |
| GQRY-08 | Produce deterministic typed invalid-graph error behavior for query consumers instead of best-effort proofs from broken graph inputs. [VERIFIED: .planning/REQUIREMENTS.md] | Preserve validation errors from `validateSanctionedV211Graph` and reserve `graph_not_validated` for absence of a validated handle. [VERIFIED: src/graph_read_model/validate_graph.ts; src/graph_read_model/validation_errors.ts; 61-CONTEXT.md] |

## Summary

Phase 61 should add a thin, zero-dependency TypeScript boundary around the existing pure query functions, not rewrite `query_graph.ts`. The sanctioned flow is `asValidatedGraph(rawGraph)` -> `createValidatedQueryConsumer(validatedGraph)` -> one of the eight existing proof functions; this preserves existing successful proof objects while making invalid or unvalidated consumption fail closed before proof generation. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/query_graph.ts; src/graph_read_model/validate_graph.ts]

The main implementation target should be a new graph read-model module, likely `src/graph_read_model/query_consumer.ts`, plus exported types in `types.ts` or that module. The module should define a branded `ValidatedGraph`, typed result unions for validation, a consumer object exposing all eight query methods, and optional secondary throw helpers only if the planner needs them. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/types.ts; src/graph_read_model/query_graph.ts]

**Primary recommendation:** Plan one implementation slice for `ValidatedGraph` and consumer creation, then one test slice that proves invalid graph rejection, unvalidated misuse rejection, missing-target compatibility, envelope stability, and live baseline consumer compatibility. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts; src/tests/graph_read_model/query_live_baseline.test.ts; src/tests/graph_read_model/validate_graph.test.ts]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Raw graph validation into a query-safe handle | TypeScript library module | Validation module | `validateSanctionedV211Graph(graph)` already owns sanctioned structural/profile validation, and Phase 61 only turns successful validation into a reusable typed handle. [VERIFIED: src/graph_read_model/validate_graph.ts; 61-CONTEXT.md] |
| Fail-closed query consumption | TypeScript library module | Query module | The new consumer should gate access before calling pure query functions; `query_graph.ts` stays low-level and pure. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/query_graph.ts] |
| Successful proof envelope generation | Query module | Consumer wrapper | The eight existing query functions already produce `GraphQueryProof` shapes and should remain the source of success proof semantics. [VERIFIED: src/graph_read_model/types.ts; src/graph_read_model/query_graph.ts] |
| Deterministic error payloads | Validation error module | Consumer wrapper | `validation_errors.ts` already centralizes typed factories, including `makeGraphNotValidatedError`. [VERIFIED: src/graph_read_model/validation_errors.ts] |
| Compatibility and regression proof | Vitest tests | Docs only if needed | Existing query and validation tests cover envelope shape, missing targets, validation errors and live sanctioned baseline, so Phase 61 can extend those patterns. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts; src/tests/graph_read_model/query_live_baseline.test.ts; src/tests/graph_read_model/validate_graph.test.ts] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | Installed `5.9.3`; npm latest observed `6.0.3` modified 2026-04-16. [VERIFIED: npm list; npm registry] | Static typing for branded `ValidatedGraph`, discriminated `ok/error` results and query method signatures. [VERIFIED: src/package.json; src/graph_read_model/types.ts] | Existing project stack is TypeScript strict and ESM. [VERIFIED: src/package.json; .planning/PROJECT.md] |
| Vitest | Installed `3.2.4`; npm latest observed `4.1.9` modified 2026-06-15. [VERIFIED: npm list; npm registry] | Unit and live regression tests for the consumer boundary. [VERIFIED: src/vitest.config.ts; src/tests/graph_read_model/*.test.ts] | Existing graph read-model tests already run under Vitest. [VERIFIED: src/package.json; src/vitest.config.ts] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@types/node` | Installed `25.7.0`; npm latest observed `25.9.3` modified 2026-06-10. [VERIFIED: npm list; npm registry] | Node type support for the existing test/runtime environment. [VERIFIED: src/package.json] | No new direct Phase 61 code should need Node APIs, but existing live tests and project compile use Node typing. [VERIFIED: src/tests/graph_read_model/query_live_baseline.test.ts; src/package.json] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| New external validation/query package | No package | The milestone explicitly excludes new external graph/query/runtime dependencies, and existing TypeScript/Vitest surfaces are sufficient. [VERIFIED: .planning/REQUIREMENTS.md; src/package.json] |
| Class-based consumer | Plain object returned by a factory | Project constraints prefer functional pure modules and no classes for this surface. [VERIFIED: .planning/PROJECT.md; 61-CONTEXT.md] |
| Revalidating inside every query method | Validate once into `ValidatedGraph` | Locked decision D-05 requires reusable validated graph proofs without manual revalidation per call. [VERIFIED: 61-CONTEXT.md] |

**Installation:**
```bash
# No new packages for Phase 61.
```

**Version verification:** `npm --prefix src list typescript vitest @types/node --depth=0` reported installed versions, and `npm view` succeeded only after network escalation because sandbox DNS returned `EAI_AGAIN`. [VERIFIED: local command output; npm registry]

## Package Legitimacy Audit

> Phase 61 should not install external packages. [VERIFIED: .planning/REQUIREMENTS.md; src/package.json]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| None new | npm | n/a | n/a | n/a | n/a | No install planned. [VERIFIED: .planning/REQUIREMENTS.md] |

**Packages removed due to [SLOP] verdict:** none. [VERIFIED: no new package recommendation]
**Packages flagged as suspicious [SUS]:** `typescript`, `vitest`, and `@types/node` were marked `SUS` by the local legitimacy seam because registry metadata signals returned `null`, but they are existing project dependencies and not Phase 61 install targets. [VERIFIED: gsd-tools package-legitimacy output; src/package.json]

## Architecture Patterns

### System Architecture Diagram

```text
Raw OlfactoryGraph
  |
  v
asValidatedGraph(graph)
  |
  +--> validateSanctionedV211Graph(graph)
        |
        +--> ok: false -> { ok: false, error: GraphValidationError | GraphValidationError[] }
        |
        +--> ok: true -> { ok: true, graph: ValidatedGraph }
                              |
                              v
                  createValidatedQueryConsumer(validatedGraph)
                              |
                              v
       consumer.getDescriptorsByFamily(...) and seven sibling methods
                              |
                              v
             existing query_graph.ts proof functions
                              |
                              v
          success envelope { query_kind, params, result, path? }
```

This data flow keeps invalid graphs and unvalidated raw graphs outside proof generation, while successful proofs continue to come from `query_graph.ts`. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/query_graph.ts; src/graph_read_model/validate_graph.ts]

### Recommended Project Structure

```text
src/graph_read_model/
├── query_consumer.ts       # new validated consumer boundary
├── query_graph.ts          # existing pure low-level proofs, unchanged semantically
├── validate_graph.ts       # existing sanctioned validation entrypoint
├── validation_errors.ts    # existing deterministic error factories
└── types.ts                # shared graph/proof/validation types, optionally branded handle type

src/tests/graph_read_model/
├── query_consumer.test.ts  # new fail-closed and compatibility tests
├── query_graph.test.ts     # keep existing pure query compatibility tests
└── query_live_baseline.test.ts # add or mirror consumer live baseline proof if needed
```

The new module should be colocated with graph read-model modules and should avoid CLI/runtime boundaries. [VERIFIED: src/graph_read_model directory listing; 61-CONTEXT.md]

### Pattern 1: Branded Validated Handle

**What:** Represent `ValidatedGraph` as an opaque/branded subtype of `OlfactoryGraph`, produced only by `asValidatedGraph`. [VERIFIED: 61-CONTEXT.md]

**When to use:** Use this for the main sanctioned consumer creation path so TypeScript distinguishes raw `OlfactoryGraph` from a graph that passed `validateSanctionedV211Graph`. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/validate_graph.ts]

**Example:**
```typescript
// Source: 61-CONTEXT.md + local TypeScript patterns
declare const validatedGraphBrand: unique symbol

export type ValidatedGraph = OlfactoryGraph & {
  readonly [validatedGraphBrand]: true
}
```

### Pattern 2: Deterministic `ok/error` Validation Result

**What:** Return a discriminated union instead of throwing on the official path. [VERIFIED: 61-CONTEXT.md]

**When to use:** `asValidatedGraph(graph)` should return `ok: true` with `ValidatedGraph` or `ok: false` with preserved validation errors from `validateSanctionedV211Graph`. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/validate_graph.ts]

**Example:**
```typescript
// Source: src/graph_read_model/validate_graph.ts and validation_errors.ts
export type AsValidatedGraphResult =
  | { readonly ok: true; readonly graph: ValidatedGraph }
  | { readonly ok: false; readonly errors: readonly GraphValidationError[] }
```

### Pattern 3: Thin Consumer Object

**What:** Build a plain object whose methods close over a `ValidatedGraph` and delegate to the existing eight query functions. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/query_graph.ts]

**When to use:** Use after a successful `asValidatedGraph` result. [VERIFIED: 61-CONTEXT.md]

**Example:**
```typescript
// Source: src/graph_read_model/query_graph.ts
export const createValidatedQueryConsumer = (graph: ValidatedGraph): ValidatedQueryConsumer => ({
  getDescriptorsByFamily: familyId => getDescriptorsByFamily(graph, familyId),
  getDescriptorsBySubfamily: subfamilyId => getDescriptorsBySubfamily(graph, subfamilyId),
  resolveAliasPath: alias => resolveAliasPath(graph, alias),
  getDescriptorToFamilyPath: descriptorId => getDescriptorToFamilyPath(graph, descriptorId),
  getRelatedDescriptors: descriptorId => getRelatedDescriptors(graph, descriptorId),
  getSimilarityNeighborhood: subfamilyId => getSimilarityNeighborhood(graph, subfamilyId),
  getCrossFamilyBridges: () => getCrossFamilyBridges(graph),
  getSimilarityHub: () => getSimilarityHub(graph),
})
```

### Anti-Patterns to Avoid

- **Changing `GraphQueryProof`:** Adding error fields to successful proofs would violate GQRY-06 and D-17. [VERIFIED: .planning/REQUIREMENTS.md; 61-CONTEXT.md; src/graph_read_model/types.ts]
- **Hardening `query_graph.ts` directly:** That would violate D-02 and blur low-level pure query semantics with consumer validation policy. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/query_graph.ts]
- **Making `createValidatedQueryConsumer(graph)` the main entrypoint:** That is explicitly fenced out by D-09 and by the user's hard fences. [VERIFIED: 61-CONTEXT.md; user prompt]
- **Treating missing targets as errors:** Existing tests prove unknown aliases, missing descriptors and unknown subfamilies return empty/null structured proofs without throwing. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts; src/graph_read_model/query_graph.ts]
- **Adding runtime, persistence, API, DB, Graphify or publication scope:** These are excluded by milestone and Phase 61 boundaries. [VERIFIED: .planning/REQUIREMENTS.md; 61-CONTEXT.md]

## Eight Current Query Proof Functions

| Function | `query_kind` | Current missing-target behavior | Consumer method should expose |
|----------|--------------|---------------------------------|-------------------------------|
| `getDescriptorsByFamily(graph, familyId)` | `descriptors_by_family` | Missing family yields `descriptors: []` through filtering. [VERIFIED: src/graph_read_model/query_graph.ts] | `getDescriptorsByFamily(familyId)` |
| `getDescriptorsBySubfamily(graph, subfamilyId)` | `descriptors_by_subfamily` | Missing subfamily yields `descriptors: []` through filtering. [VERIFIED: src/graph_read_model/query_graph.ts] | `getDescriptorsBySubfamily(subfamilyId)` |
| `resolveAliasPath(graph, alias)` | `alias_resolution_path` | Unknown alias yields `target_descriptor_id: null` and no `path`. [VERIFIED: src/graph_read_model/query_graph.ts; src/tests/graph_read_model/query_graph.test.ts] | `resolveAliasPath(alias)` |
| `getDescriptorToFamilyPath(graph, descriptorId)` | `descriptor_to_family_path` | Missing descriptor yields `family_id: null`, `subfamily_id: null` and no `path`. [VERIFIED: src/graph_read_model/query_graph.ts] | `getDescriptorToFamilyPath(descriptorId)` |
| `getRelatedDescriptors(graph, descriptorId)` | `related_descriptors` | Missing descriptor yields `descriptors: []`. [VERIFIED: src/graph_read_model/query_graph.ts; src/tests/graph_read_model/query_graph.test.ts] | `getRelatedDescriptors(descriptorId)` |
| `getSimilarityNeighborhood(graph, subfamilyId)` | `similarity_neighborhood` | Unknown subfamily yields `neighbors: []`. [VERIFIED: src/graph_read_model/query_graph.ts; src/tests/graph_read_model/query_graph.test.ts] | `getSimilarityNeighborhood(subfamilyId)` |
| `getCrossFamilyBridges(graph)` | `cross_family_bridges` | No query target; result is bridges array. [VERIFIED: src/graph_read_model/query_graph.ts] | `getCrossFamilyBridges()` |
| `getSimilarityHub(graph)` | `similarity_hub` | No similarity edges or invalid hub node yields `hub: null`. [VERIFIED: src/graph_read_model/query_graph.ts] | `getSimilarityHub()` |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sanctioned graph validation | A new local `strict` flag or duplicated baseline checks | `validateSanctionedV211Graph(graph)` | The sanctioned wrapper already applies the profile and short-circuits profile checks on structural failure. [VERIFIED: src/graph_read_model/validate_graph.ts] |
| Error object construction | Ad-hoc `{ code, message }` objects | `makeGraphNotValidatedError` and existing validation error factories | Factories already normalize `path`, `invariant_id`, `expected` and `actual` payloads. [VERIFIED: src/graph_read_model/validation_errors.ts] |
| Query proof generation | A second implementation of hierarchy/alias/similarity traversal | Existing `query_graph.ts` functions | Current functions are already tested for determinism, missing targets and live baseline behavior. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts; src/tests/graph_read_model/query_live_baseline.test.ts] |
| Runtime trust tracking | Caches, registries, services, sidecar files or persisted proof state | Branded in-memory `ValidatedGraph` handle | D-05 requires reusability without runtime state, service, API, database or persistent cache. [VERIFIED: 61-CONTEXT.md] |

**Key insight:** Phase 61 is a type and boundary problem, not a graph algorithm problem. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/query_graph.ts]

## Common Pitfalls

### Pitfall 1: Collapsing Invalid Graph and Unvalidated Graph

**What goes wrong:** A failed sanctioned validation and a raw graph passed to the consumer are both reported as `graph_not_validated`. [VERIFIED: 61-CONTEXT.md]
**Why it happens:** The implementation may treat every failure before query as the same guardrail. [VERIFIED: 61-CONTEXT.md]
**How to avoid:** `asValidatedGraph` should preserve `validateSanctionedV211Graph` errors; only misuse of the validated boundary should use `graph_not_validated`. [VERIFIED: src/graph_read_model/validate_graph.ts; src/graph_read_model/validation_errors.ts; 61-CONTEXT.md]
**Warning signs:** Tests assert only `graph_not_validated` and never assert preserved `invalid_schema_version`, `profile_baseline_mismatch` or structural errors. [VERIFIED: src/tests/graph_read_model/validate_graph.test.ts]

### Pitfall 2: Breaking the Success Envelope

**What goes wrong:** Consumer methods return `{ ok, proof }` for successful queries instead of direct `{ query_kind, params, result, path? }` proofs. [VERIFIED: 61-CONTEXT.md]
**Why it happens:** The same `ok/error` result pattern is incorrectly applied to proof execution after the graph is already validated. [VERIFIED: 61-CONTEXT.md]
**How to avoid:** Use `ok/error` for `asValidatedGraph`; once the consumer exists, its methods should return the existing proof types directly. [VERIFIED: src/graph_read_model/types.ts; src/graph_read_model/query_graph.ts]
**Warning signs:** `GraphQueryProof` or current query snapshots change. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts]

### Pitfall 3: Converting Missing Targets Into Errors

**What goes wrong:** Unknown alias, missing descriptor or unknown subfamily now returns an error. [VERIFIED: 61-CONTEXT.md]
**Why it happens:** The fail-closed rule is applied to absent domain targets instead of invalid/unvalidated graph inputs. [VERIFIED: 61-CONTEXT.md]
**How to avoid:** Add consumer tests that call missing-target queries through `ValidatedGraph` and expect the same empty structured proofs. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts]
**Warning signs:** A test changes `unknown_alias`, `missing_descriptor` or `unknown_subfamily` expectations. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts]

### Pitfall 4: Runtime Scope Creep

**What goes wrong:** The plan introduces API handlers, persisted proof files, Graphify integration, DB export or runtime agent consumption. [VERIFIED: .planning/REQUIREMENTS.md; 61-CONTEXT.md]
**Why it happens:** "Consumer-facing" gets interpreted as product/runtime surface instead of a TypeScript library boundary. [VERIFIED: .planning/PROJECT.md; 61-CONTEXT.md]
**How to avoid:** Keep changes inside `src/graph_read_model/**` and tests unless a minimal docs note is required. [VERIFIED: 61-CONTEXT.md]
**Warning signs:** New dependencies, CLI commands, output artifacts or files under `data/read-models`, `data/compiled`, `graphify-out` or `docs` without requirement need. [VERIFIED: .planning/REQUIREMENTS.md; .planning/PROJECT.md]

## Code Examples

### `asValidatedGraph` Result Flow

```typescript
// Source: src/graph_read_model/validate_graph.ts and 61-CONTEXT.md
export const asValidatedGraph = (graph: OlfactoryGraph): AsValidatedGraphResult => {
  const validation = validateSanctionedV211Graph(graph)
  if (!validation.ok) {
    return { ok: false, errors: validation.errors }
  }
  return { ok: true, graph: graph as ValidatedGraph }
}
```

### Consumer Delegation

```typescript
// Source: src/graph_read_model/query_graph.ts
const result = asValidatedGraph(rawGraph)
if (!result.ok) return result

const consumer = createValidatedQueryConsumer(result.graph)
const proof = consumer.resolveAliasPath('cedar')
// proof shape remains { query_kind, params, result, path? }
```

### Misuse Guard Test Shape

```typescript
// Source: src/tests/graph_read_model/validate_graph.test.ts pattern
expect(makeGraphNotValidatedError('validated graph handle required')).toEqual({
  code: 'graph_not_validated',
  path: '$',
  message: 'graph must be validated before query consumption: validated graph handle required',
  invariant_id: 'graph_validation_required',
  expected: { validated_graph: true },
  actual: { reason: 'validated graph handle required' },
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Query proofs took any `OlfactoryGraph` and assumed caller-side validation. [VERIFIED: src/graph_read_model/query_graph.ts] | Query proofs should remain pure, but future sanctioned consumers should obtain a `ValidatedGraph` first. [VERIFIED: 61-CONTEXT.md] | Phase 61 planning scope, 2026-06-16. [VERIFIED: .planning/ROADMAP.md; 61-CONTEXT.md] | Prevents misleading proofs from invalid or unvalidated graph inputs while preserving low-level query semantics. [VERIFIED: .planning/REQUIREMENTS.md; 61-CONTEXT.md] |
| Baseline validation was mainly test/CLI anchored. [VERIFIED: .planning/STATE.md] | `validateSanctionedV211Graph` applies `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`. [VERIFIED: src/graph_read_model/validate_graph.ts; src/graph_read_model/contract.ts] | Phase 60 completed 2026-06-16. [VERIFIED: .planning/ROADMAP.md; .planning/STATE.md] | Phase 61 can reuse one sanctioned validation wrapper rather than duplicating baseline logic. [VERIFIED: 60-CONTEXT.md; 61-CONTEXT.md] |
| Error factories were less centralized before Phase 60. [VERIFIED: .planning/STATE.md] | `validation_errors.ts` centralizes named factories and `graph_not_validated`. [VERIFIED: src/graph_read_model/validation_errors.ts] | Phase 60 completed 2026-06-16. [VERIFIED: .planning/STATE.md] | Consumer errors can be deterministic and JSON-safe without hand-rolled payloads. [VERIFIED: src/tests/graph_read_model/validate_graph.test.ts] |

**Deprecated/outdated:**
- Planning `createValidatedQueryConsumer(graph)` as the main entrypoint is out of bounds for Phase 61. [VERIFIED: 61-CONTEXT.md; user prompt]
- Planning documentation-heavy consumer readiness belongs mostly to Phase 63 unless Phase 61 needs a minimal API note for requirement coverage. [VERIFIED: .planning/ROADMAP.md; .planning/REQUIREMENTS.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `query_consumer.ts` is the best filename for the new module. [ASSUMED] | Recommended Project Structure | Low: planner can choose another local name if it matches project conventions. |
| A2 | Consumer methods should return direct proof objects, while validation returns `ok/error`. [ASSUMED] | Common Pitfalls | Medium: aligns with locked envelope preservation, but the planner should confirm this interpretation before implementation. |

## Open Questions (RESOLVED)

1. **Should throw helpers be included in Phase 61?**
   - What we know: D-16 permits helpers such as `assertValidatedGraph(graph)` and `createValidatedQueryConsumerOrThrow(validatedGraph)`. [VERIFIED: 61-CONTEXT.md]
   - What's unclear: The phase does not require them for GVAL-07/GQRY-06/GQRY-08. [VERIFIED: .planning/REQUIREMENTS.md]
   - Recommendation: Do not plan throw helpers unless needed by tests or existing consumer ergonomics; keep official path `ok/error`. [VERIFIED: 61-CONTEXT.md]
   - RESOLVED: Phase 61 will not include throw helpers. The official path remains typed `ok/error`; optional throw helpers are deferred until a future phase explicitly needs convenience APIs. [VERIFIED: 61-CONTEXT.md; 61-01-PLAN.md; 61-02-PLAN.md]

2. **Should docs be updated in Phase 61?**
   - What we know: Phase 63 owns consumer readiness documentation, while current docs say fail-closed consumption is outside Phase 60. [VERIFIED: .planning/ROADMAP.md; docs/olfactory_graph_read_model.md]
   - What's unclear: Whether a small API reference for the new exported functions is needed for Phase 61 acceptance. [ASSUMED]
   - Recommendation: Keep Phase 61 implementation/tests only unless the planner adds a narrow doc touchpoint for the new API. [VERIFIED: 61-CONTEXT.md; .planning/ROADMAP.md]
   - RESOLVED: Phase 61 will not update documentation. Consumer-readiness documentation remains Phase 63 scope; Phase 61 acceptance is implementation and test evidence for `ValidatedGraph`, `asValidatedGraph`, and `createValidatedQueryConsumer(validatedGraph)`. [VERIFIED: .planning/ROADMAP.md; .planning/REQUIREMENTS.md; 61-01-PLAN.md; 61-02-PLAN.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Typecheck/tests | yes | `v24.14.0` [VERIFIED: local command] | None needed. |
| npm | Scripts/tests | yes | `11.9.0` [VERIFIED: local command] | None needed. |
| TypeScript | `npm --prefix src run typecheck` | yes | installed `5.9.3` [VERIFIED: npm list] | Use existing lock/install state; no upgrade in Phase 61. |
| Vitest | targeted tests | yes | installed `3.2.4` [VERIFIED: npm list] | Use existing test framework. |
| Graphify | Graph context only | no | disabled by `gsd-tools graphify status` [VERIFIED: local command] | Continue with local codebase research; Graphify is out of scope. [VERIFIED: .planning/REQUIREMENTS.md] |

**Missing dependencies with no fallback:** none for Phase 61 implementation/tests. [VERIFIED: local command outputs]

**Missing dependencies with fallback:** Graphify disabled; fallback is direct local code/test inspection. [VERIFIED: gsd-tools graphify status; .planning/REQUIREMENTS.md]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest installed `3.2.4`. [VERIFIED: npm list] |
| Config file | `src/vitest.config.ts` includes `tests/**/*.test.ts`. [VERIFIED: src/vitest.config.ts] |
| Quick run command | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/validate_graph.test.ts` [VERIFIED: src/package.json; existing tests] |
| Full suite command | `npm --prefix src run typecheck && env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/validate_graph.test.ts` [VERIFIED: src/package.json; existing tests] |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| GVAL-07 | `asValidatedGraph` rejects structurally invalid/profile-invalid graphs before consumer creation. [VERIFIED: .planning/REQUIREMENTS.md; src/graph_read_model/validate_graph.ts] | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts` | No - Wave 0 should add. |
| GVAL-07 | Raw/unvalidated graph misuse produces typed `graph_not_validated` behavior at the sanctioned boundary. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/validation_errors.ts] | unit/type-focused | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts` | No - Wave 0 should add. |
| GQRY-06 | All eight consumer methods return the same success envelopes as direct query functions. [VERIFIED: src/graph_read_model/types.ts; src/tests/graph_read_model/query_graph.test.ts] | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts` | Partial - existing query tests; new consumer tests needed. |
| GQRY-06 | Missing target semantics stay empty/null structured proofs, not errors. [VERIFIED: 61-CONTEXT.md; src/tests/graph_read_model/query_graph.test.ts] | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts` | Partial - existing direct query tests; new consumer tests needed. |
| GQRY-08 | Invalid graph attempts preserve deterministic typed validation errors instead of partial proofs. [VERIFIED: .planning/REQUIREMENTS.md; src/tests/graph_read_model/validate_graph.test.ts] | unit | `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/validate_graph.test.ts` | Partial - validation errors exist; consumer tests needed. |

### Sampling Rate

- **Per task commit:** `npm --prefix src run typecheck` plus targeted `query_consumer.test.ts`. [VERIFIED: src/package.json]
- **Per wave merge:** `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_graph.test.ts tests/graph_read_model/validate_graph.test.ts`. [VERIFIED: existing targeted test command passed before research completion]
- **Phase gate:** Typecheck plus targeted graph read-model suite including live baseline. [VERIFIED: src/package.json; src/tests/graph_read_model/query_live_baseline.test.ts]

### Wave 0 Gaps

- [ ] `src/tests/graph_read_model/query_consumer.test.ts` - covers GVAL-07, GQRY-06, GQRY-08. [VERIFIED: file does not exist in current directory listing]
- [ ] Consumer fixture helper or reuse of existing inline graph fixture from `query_graph.test.ts`/`validate_graph.test.ts`. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts; src/tests/graph_read_model/validate_graph.test.ts]
- [ ] Static/type-level misuse check if planner wants compile-time proof that raw `OlfactoryGraph` is not assignable to `ValidatedGraph`. [ASSUMED]

## Security Domain

OWASP ASVS is a verification standard for web application technical security controls and secure development requirements; the latest stable version on the OWASP page is 5.0.0. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Phase 61 has no user identity or login surface. [VERIFIED: .planning/REQUIREMENTS.md; 61-CONTEXT.md] |
| V3 Session Management | no | Phase 61 has no sessions, cookies or runtime API. [VERIFIED: .planning/REQUIREMENTS.md; 61-CONTEXT.md] |
| V4 Access Control | limited | Enforce capability-style access by requiring `ValidatedGraph` before consumer creation. [VERIFIED: 61-CONTEXT.md] |
| V5 Input Validation | yes | Validate raw `OlfactoryGraph` with `validateSanctionedV211Graph` before proof generation. [VERIFIED: src/graph_read_model/validate_graph.ts; 61-CONTEXT.md] |
| V6 Cryptography | no | Phase 61 does not add hashing, encryption, signatures or secret handling. [VERIFIED: .planning/REQUIREMENTS.md; 61-CONTEXT.md] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Spoofing a graph as validated | Spoofing | Use branded `ValidatedGraph` and keep constructor path private to `asValidatedGraph`. [VERIFIED: 61-CONTEXT.md] |
| Misleading proofs from invalid graph structure | Tampering | Fail closed before proof generation and preserve validation errors. [VERIFIED: .planning/REQUIREMENTS.md; src/graph_read_model/validate_graph.ts] |
| Repudiation of validation profile | Repudiation | Bind validation to `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE` through `validateSanctionedV211Graph`. [VERIFIED: src/graph_read_model/contract.ts; src/graph_read_model/validate_graph.ts] |
| Scope creep into runtime/API/DB | Information disclosure / Elevation of privilege | Do not introduce runtime surfaces or persistence in Phase 61. [VERIFIED: .planning/REQUIREMENTS.md; 61-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/61-fail-closed-query-consumption/61-CONTEXT.md` - locked implementation decisions and hard fences. [VERIFIED: local codebase]
- `.planning/REQUIREMENTS.md` - GVAL-07, GQRY-06, GQRY-08 and out-of-scope boundaries. [VERIFIED: local codebase]
- `.planning/ROADMAP.md` - Phase 61 goal and success criteria. [VERIFIED: local codebase]
- `.planning/PROJECT.md` and `.planning/STATE.md` - project stack, milestone constraints and Phase 60 handoff. [VERIFIED: local codebase]
- `src/graph_read_model/contract.ts`, `types.ts`, `validate_graph.ts`, `query_graph.ts`, `validation_errors.ts`, `graph_id.ts` - implementation surface. [VERIFIED: local codebase]
- `src/tests/graph_read_model/query_graph.test.ts`, `query_live_baseline.test.ts`, `validate_graph.test.ts` - regression and compatibility evidence. [VERIFIED: local codebase]

### Secondary (MEDIUM confidence)
- OWASP ASVS project page - security verification framing and latest stable version note. [CITED: https://owasp.org/www-project-application-security-verification-standard/]
- npm registry via `npm view` after escalation - current versions and no observed `scripts.postinstall` output for existing packages. [VERIFIED: npm registry]

### Tertiary (LOW confidence)
- WebSearch for repository-specific fail-closed query patterns returned no useful public source, so it was not used for recommendations. [VERIFIED: websearch; LOW]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - existing project dependencies, local installed versions and npm registry current versions were checked; no new packages are recommended. [VERIFIED: npm list; npm registry; src/package.json]
- Architecture: HIGH - locked Phase 61 decisions and existing graph read-model modules directly define the boundary. [VERIFIED: 61-CONTEXT.md; src/graph_read_model/*.ts]
- Pitfalls: HIGH - each pitfall is tied to explicit fences or existing tests. [VERIFIED: 61-CONTEXT.md; src/tests/graph_read_model/*.test.ts]

**Research date:** 2026-06-16
**Valid until:** 2026-07-16 for local architecture; npm "latest" observations should be refreshed before dependency upgrades. [VERIFIED: current date; npm registry]
