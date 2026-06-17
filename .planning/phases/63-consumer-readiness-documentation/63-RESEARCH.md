# Phase 63: Consumer Readiness Documentation - Research

**Researched:** 2026-06-17  
**Domain:** Documentacao operacional do graph read model, fronteira `ValidatedGraph` e consumo futuro agent/RAG  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
## Implementation Decisions

### Guide Hierarchy And Section Order
- **D-01:** O guia oficial deve seguir esta ordem canônica: `(1) Escopo, audiencia e fences -> (2) Mapa do fluxo completo -> (3) Workflow operacional graph:build -> (4) Validacao sancionada -> (5) ValidatedGraph -> (6) Consumer fail-closed -> (7) Envelope seguro para agent/RAG -> (8) Erros e missing targets -> (9) Exemplos canonicos e antipatrones -> (10) Referencias normativas e provas automatizadas`.
- **D-02:** A narrativa deve ensinar primeiro o ciclo de vida do artefato, depois a fronteira de confianca e so entao o consumo, para evitar que `graph:build`, `graph.json` ou o consumer sejam lidos isoladamente como runtime, API ou servico publico.
- **D-03:** A secao "Mapa do fluxo completo" deve explicitar o encadeamento `graph:build -> graph.json cru -> asValidatedGraph -> createValidatedQueryConsumer -> query proof` como a hierarquia oficial do guia.
- **D-04:** A secao de `graph:build` deve cobrir explicitamente `dry-run`, `non-dry-run`, guardrails, boundary audit e o que a CLI faz e nao faz; ela nao deve antecipar o consumo de query como se fosse funcao da CLI.

### Proof Envelope Consumption Contract
- **D-05:** O consumidor deve discriminar primeiro por `query_kind` e so entao interpretar `params`, `result` e `path`; `query_kind` e o discriminante estavel do contrato.
- **D-06:** `query_kind` e classificado como **seguro e estavel** e deve ser usado para roteamento, selecao de parser e interpretacao do tipo de proof.
- **D-07:** `params` e classificado como **seguro com cautela** e deve ser usado apenas para correlacionar a resposta com a consulta executada; ele e um eco normalizado da solicitacao, nao evidencia semantica independente nem autorizacao para inferir fatos ausentes do `result`.
- **D-08:** `result` e classificado como **seguro e principal** e constitui o payload autoritativo para consumo agent/RAG, respeitando o schema especifico de cada `query_kind`; `result` vazio ou `null` continua sendo resposta valida, nao falha sistemica.
- **D-09:** `path` e classificado como **seguro condicional de proveniencia** e so pode ser usado quando presente para explicacao, rastreabilidade e apresentacao do percurso no grafo; sua ausencia nunca e erro, e seu conteudo nunca deve substituir `result`, nem definir confianca, ranking, autorizacao ou completude.
- **D-10:** Nenhum dos quatro campos pode ser enriquecido, reinterpretado silenciosamente ou presumido como expansivel pelo consumer; metadados futuros so entram no envelope por mudanca explicita de contrato.

### Canonical Examples And Forbidden Readings
- **D-11:** O guia deve marcar cada trecho como **Canonico**, **Ilustrativo** ou **Proibido**, para impedir que exemplos simplificados sejam lidos como ampliacao de API publica.
- **D-12:** Os exemplos canonicos obrigatorios devem seguir o ciclo completo nesta ordem: `graph:build --dry-run`; `graph:build` non-dry-run com leitura do boundary audit; leitura de `graph.json` como `OlfactoryGraph` cru; `asValidatedGraph(graph)` com sucesso; `asValidatedGraph(graph)` com erro detalhado de validacao; `createValidatedQueryConsumer(validatedGraph)`; uma query feliz interpretada por `query_kind`; tentativa de contorno resultando em `graph_not_validated`; `missing target` retornando proof de sucesso valida com `result` vazio ou nulo.
- **D-13:** A documentacao de erros deve preservar explicitamente a distincao entre tres casos: grafo validado e invalido (erros estruturais/profile detalhados), ausencia da prova de validacao (`graph_not_validated`) e alvo inexistente (proof de sucesso com `result` vazio/nulo).
- **D-14:** Antipatrones obrigatorios do guia: nao tratar `graph.json` cru como pronto para query; nao expor ou interpretar query pela CLI; nao exigir que `path` exista sempre; nao inferir fatos apenas de `path`; nao tratar `result` vazio como falha; nao ler o guia como contrato de runtime/API/DB/Neo4J/Graphify/publicacao.
- **D-15:** Antipatrones obrigatorios adicionais: nao fabricar `ValidatedGraph` com cast, objeto manual ou acesso a marca interna; a unica origem sancionada e o sucesso de `asValidatedGraph(graph)`. Nao usar diretamente as funcoes de `query_graph.ts` em integracoes agent/RAG; elas permanecem primitives internas de baixo nivel e pressupoe grafo confiavel.

### Editorial Scope Fences
- **D-16:** O guia deve abrir com um fence global declarando que documenta um graph read model estatico, read-only e zero-dependency, sem definir runtime de agente, API, servico HTTP, banco de dados, Neo4J, Graphify, publicacao automatica, persistencia de proofs ou comandos publicos de query.
- **D-17:** O fence global tambem deve esclarecer que `graph:build` e um workflow de build/validacao/escrita/auditoria; `graph.json` relido e apenas artefato cru; queries futuras devem passar por `asValidatedGraph(graph)` e `createValidatedQueryConsumer(validatedGraph)`; e exemplos do guia nao constituem novas APIs alem das superficies ja implementadas.
- **D-18:** O guia deve repetir reforcos locais obrigatorios nas secoes de `graph:build`, `graph.json`, `ValidatedGraph`, consumer, envelope agent/RAG, `path` e exemplos, usando notas curtas de fence para bloquear interpretacoes como runtime ou ampliacao de superficie publica.
- **D-19:** O reforco local de `graph:build` deve afirmar que a CLI nao e runtime de query nem expoe as oito query proofs como comandos publicos; o reforco de `graph.json` deve afirmar que leitura do arquivo nao prova validacao; o reforco de `ValidatedGraph` deve proibir fabricacao manual; o reforco do consumer deve exigir `createValidatedQueryConsumer(validatedGraph)`; o reforco do envelope deve negar leitura como resposta de API/evento de runtime/registro de banco; e o reforco de `path` deve limitar seu uso a proveniencia opcional.
- **D-20:** O guia deve terminar com uma checklist curta de nao-escopo reforcando: nao expor query pela CLI; nao consultar `graph.json` cru; nao fabricar `ValidatedGraph`; nao usar `query_graph.ts` diretamente em integracoes; nao exigir `path`; nao tratar missing target como falha; e nao interpretar o guia como runtime/API/DB/Neo4J/Graphify/publicacao.

### the agent's Discretion
Nenhuma area relevante foi delegada para decisao livre do agente. A hierarquia do guia, a tabela do envelope, os exemplos obrigatorios e a estrategia editorial de fences ficaram explicitamente travados nesta discussao.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GQRY-07 | Maintainer can see documented safe-consumption boundaries for each proof envelope field, including what is safe for future Alquem.io agent/RAG consumption and what remains provenance-only or internal. | `GraphQueryProof<TKind, TParams, TResult>` defines `query_kind`, `params`, `result`, and optional `path`; tests prove which query kinds carry `path` and which do not. [VERIFIED: `src/graph_read_model/types.ts`; `src/tests/graph_read_model/query_graph.test.ts`; `src/tests/graph_read_model/query_consumer.test.ts`] |
| GDOC-04 | Maintainer can read a reordered operational guide that explains the safe build -> validate -> query workflow, fail-closed behavior, and protected-scope boundaries without jumping across sections. | The current guide contains all ingredients but in a historically layered order; Phase 63 context locks the new order and the code/tests define the exact flow. [VERIFIED: `docs/olfactory_graph_read_model.md`; `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`; `src/cli/sanctioned_graph_workflow.ts`; `src/graph_read_model/query_consumer.ts`] |
| GDOC-05 | Maintainer can read explicit consumer-readiness guidance for future Alquem.io agent/RAG usage that stays limited to the existing read-only graph artifact and proof envelopes, without adding runtime, API, database, or execution scope. | Requirements and contract exclude runtime/API/database/Graphify/publication scope, while tests prove consumer use is in-memory and read-only after validation. [VERIFIED: `.planning/REQUIREMENTS.md`; `docs/olfactory_graph_contract.md`; `src/tests/graph_read_model/query_live_baseline.test.ts`] |
</phase_requirements>

## Summary

Phase 63 should be planned as a documentation-first hardening phase: update `docs/olfactory_graph_read_model.md` so maintainers can follow the safe lifecycle `graph:build -> graph.json cru -> asValidatedGraph -> createValidatedQueryConsumer -> query proof` without mistaking any intermediate artifact for a runtime, API, database export, Graphify integration, or public query surface. [VERIFIED: `.planning/ROADMAP.md`; `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`; `src/cli/graph_read_model.ts`]

The normative source of truth is not prose preference: contracts live in `types.ts`, `validate_graph.ts`, `query_consumer.ts`, `validation_errors.ts`, the CLI/workflow modules, and the tests listed below. The plan should use those sources to rewrite and label documentation, not change production code to make examples prettier. [VERIFIED: user instruction; `src/graph_read_model/types.ts`; `src/graph_read_model/query_consumer.ts`; `src/tests/graph_read_model/query_consumer.test.ts`]

**Primary recommendation:** Plan one predominantly documental wave that reorganizes `docs/olfactory_graph_read_model.md`, adds a proof-envelope consumption matrix, labels examples as `Canonico`/`Ilustrativo`/`Proibido`, and verifies with typecheck, targeted tests, and content checks that no production contract changed. [VERIFIED: `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`; executed `npm --prefix src run typecheck`; executed targeted Vitest commands]

## Project Constraints (from AGENTS.md)

`AGENTS.md` was not present in the checkout when checked, but the user supplied the project instruction inline: always respond in Brazilian Portuguese. [VERIFIED: shell check for `AGENTS.md`; user prompt]

Additional explicit fences from the user for this research and planning phase:

- Do not alter production code. [VERIFIED: user prompt]
- Do not alter contracts to accommodate guide prose. [VERIFIED: user prompt]
- Do not touch `graphify-out/**`. [VERIFIED: user prompt]
- If an expected file is missing, record a note and continue with available sources. [VERIFIED: user prompt]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Maintainer guide ordering | Documentation | Code/tests as normative references | The phase changes the operational guide, while behavior remains defined by existing TypeScript and Vitest coverage. [VERIFIED: `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`] |
| Safe build workflow explanation | CLI / Documentation | Validation layer | `graph:build` composes load, build, sanctioned validation, write, boundary audit, and guardrails; docs should explain the CLI without turning it into query runtime. [VERIFIED: `src/cli/graph_read_model.ts`; `src/cli/sanctioned_graph_workflow.ts`] |
| Validated consumption boundary | Graph read model library | Documentation | `asValidatedGraph` creates the branded handle and `createValidatedQueryConsumer` rejects raw graph handles with `graph_not_validated`. [VERIFIED: `src/graph_read_model/query_consumer.ts`; `src/tests/graph_read_model/query_consumer.test.ts`] |
| Proof-envelope interpretation | Graph read model types | Documentation | `GraphQueryProof` fixes `query_kind`, `params`, `result`, and optional `path`; docs must classify fields without adding envelope fields. [VERIFIED: `src/graph_read_model/types.ts`] |
| Future Alquem.io/RAG readiness | Documentation | Future runtime milestones | Phase 63 prepares consumers conceptually but excludes runtime/API/database/export/persisted proofs. [VERIFIED: `.planning/REQUIREMENTS.md`; `.planning/ROADMAP.md`; `docs/olfactory_graph_contract.md`] |

## Normative Sources And Decisions

| Source | What It Decides | Planning Use |
|--------|-----------------|--------------|
| `.planning/ROADMAP.md` | Phase 63 goal, requirements `GQRY-07`, `GDOC-04`, `GDOC-05`, and success criteria for guide order, envelope classification, and non-scope boundaries. [VERIFIED: `.planning/ROADMAP.md`] | Use as phase acceptance contract. |
| `.planning/REQUIREMENTS.md` | v2.12 out-of-scope list: no runtime agent execution, SaaS/API, Neo4J/database/export, new node kinds, protected data mutation, Graphify access, or external graph/query/runtime dependencies. [VERIFIED: `.planning/REQUIREMENTS.md`] | Convert into global and local fences in the guide. |
| `.planning/STATE.md` | Recent decisions from Phases 60 and 62, including sanctioned validation profile, `graph_not_validated`, JSON-safe errors, CLI public JSON keys, and Graphify isolation. [VERIFIED: `.planning/STATE.md`] | Use as inherited decision ledger; do not reopen. |
| `63-CONTEXT.md` | Canonical section order, envelope field classifications, required examples, anti-patterns, and editorial fences. [VERIFIED: `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`] | Planner should copy into tasks as hard acceptance criteria. |
| `60-CONTEXT.md` | Validation surfaces: `validateOlfactoryGraphStructure`, `validateOlfactoryGraphAgainstProfile`, and `validateSanctionedV211Graph`; JSON-safe deterministic error payloads. [VERIFIED: `.planning/phases/60-contract-constants-validation-hardening/60-CONTEXT.md`] | Validation section must distinguish structural/profile validation from consumer misuse. |
| `61-CONTEXT.md` | `ValidatedGraph -> createValidatedQueryConsumer(validatedGraph)` is the sanctioned consumption path; `query_graph.ts` stays pure/low-level; missing targets remain successful empty/null proofs. [VERIFIED: `.planning/phases/61-fail-closed-query-consumption/61-CONTEXT.md`] | Consumer-readiness section must not recommend direct `query_graph.ts` use for agent/RAG integrations. |
| `62-CONTEXT.md` | CLI stays thin and does not expose query commands; `graph.json` re-enters through validation; sandboxed workflow proves Graphify isolation. [VERIFIED: `.planning/phases/62-sanctioned-cli-boundary-proofs/62-CONTEXT.md`] | `graph:build` section must stop at artifact/audit, then hand off to validation/consumer sections. |
| `docs/olfactory_graph_contract.md` | Static graph schema, node/edge kinds, production inputs, output policy, forbidden prefixes, Graphify separation, zero-dependency/static/no-runtime constraints, baseline stats. [VERIFIED: `docs/olfactory_graph_contract.md`] | Keep as normative contract reference; do not duplicate all schema tables in the guide. |
| `docs/olfactory_graph_read_model.md` | Existing operational guide with current build workflow, baseline, validation commands, query proof examples, and fences. [VERIFIED: `docs/olfactory_graph_read_model.md`] | Primary edit target; reorganize and harden rather than replace from scratch. |
| `src/graph_read_model/types.ts` | `OlfactoryGraph`, validation result/error shapes, `GraphQueryKind`, `GraphQueryProof`, `PathSegment`, and all proof result types. [VERIFIED: `src/graph_read_model/types.ts`] | Normative source for proof-envelope field table. |
| `src/graph_read_model/query_consumer.ts` | `ValidatedGraph` brand, `asValidatedGraph`, `createValidatedQueryConsumer`, all eight consumer methods, and `graph_not_validated` rejection for unvalidated handles. [VERIFIED: `src/graph_read_model/query_consumer.ts`] | Normative source for safe consumer examples. |
| `src/graph_read_model/query_graph.ts` | Pure low-level query primitives and exact missing-target semantics. [VERIFIED: `src/graph_read_model/query_graph.ts`] | Use only as source behind consumer and tests, not as recommended agent/RAG integration surface. |
| `src/graph_read_model/validate_graph.ts` | Sanctioned validation profile wrapper and structural/profile validation flow. [VERIFIED: `src/graph_read_model/validate_graph.ts`] | Normative source for validation section. |
| `src/graph_read_model/validation_errors.ts` | `graph_not_validated` and JSON-safe validation error factories. [VERIFIED: `src/graph_read_model/validation_errors.ts`] | Normative source for error taxonomy. |
| `src/cli/graph_read_model.ts` | Public `graph:build` flags/help, public JSON shape `{ ok, graph_output, boundary_audit, guardrails }`, no `--out`, and note that CLI does not invoke query functions. [VERIFIED: `src/cli/graph_read_model.ts`; `src/tests/cli/graph_read_model.test.ts`] | Normative source for CLI documentation. |
| `src/cli/sanctioned_graph_workflow.ts` | Internal sanctioned workflow order, guardrails, forbidden path, validation failure, write, and boundary audit behavior. [VERIFIED: `src/cli/sanctioned_graph_workflow.ts`; `src/tests/cli/sanctioned_graph_workflow.test.ts`] | Normative source for workflow map and failure branches. |
| Listed Vitest files | Executable proof of proof shapes, fail-closed boundary, live baseline, CLI JSON, boundary audit, and forbidden paths. [VERIFIED: targeted Vitest execution] | Use as validation anchors and examples; avoid examples not backed by tests. |

## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| TypeScript | `^5.8.0` in `src/package.json`; `tsc --noEmit` passed | Type/contracts and compile-time fence checks | Existing project stack and strict source of graph read model contracts. [VERIFIED: `src/package.json`; executed `npm --prefix src run typecheck`] |
| Vitest | `^3.2.0` in `src/package.json`; runtime reported `v3.2.4` | Executable documentation anchors and regression tests | Existing test framework for graph read model, CLI, and writer behavior. [VERIFIED: `src/package.json`; targeted test output] |
| Node.js | `v24.14.0` available | Runs npm scripts and CLI tests | Current local runtime for validation commands. [VERIFIED: `node --version`] |
| npm | `11.9.0` available | Runs `src` scripts | Existing package manager for project scripts. [VERIFIED: `npm --version`] |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `rg` | Content and no-scope checks | Verify guide contains required fences and no new runtime/API/DB/Graphify claims. [VERIFIED: shell availability through executed `rg`] |
| `git diff -- docs/olfactory_graph_read_model.md` | Scope review | Verify Phase 63 edits remain documentation-only. [VERIFIED: repository workflow] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Adding doc tests or new contract tests | Existing tests plus content checks | New tests may be acceptable only if purely documentary/content-focused, but production code changes are not needed for the locked scope. [VERIFIED: user instruction; `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`] |
| New consumer helper APIs | Existing `asValidatedGraph` and `createValidatedQueryConsumer` | New APIs would violate the instruction not to alter contracts for guide prose. [VERIFIED: user instruction; `src/tests/graph_read_model/query_consumer.test.ts`] |

**Installation:** No new package installation is recommended. [VERIFIED: `.planning/REQUIREMENTS.md`; user instruction]

## Package Legitimacy Audit

No external packages should be installed for Phase 63. The phase is documentation-first and should rely on the existing TypeScript/Vitest stack. [VERIFIED: `.planning/REQUIREMENTS.md`; `src/package.json`; user instruction]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| None | — | — | — | — | — | No install planned |

**Packages removed due to [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```text
Compiled v2 inputs
  -> graph:build CLI
  -> runSanctionedGraphWorkflow
  -> buildOlfactoryGraph
  -> validateSanctionedV211Graph
  -> write graph.json + boundary audit + guardrails
  -> graph.json when re-read is raw OlfactoryGraph
  -> asValidatedGraph(graph)
      -> ok: ValidatedGraph
      -> error: validation errors
  -> createValidatedQueryConsumer(validatedGraph)
      -> ok: eight query methods
      -> error: graph_not_validated
  -> GraphQueryProof { query_kind, params, result, path? }
      -> future agent/RAG may consume result by query_kind
      -> path remains optional provenance only
```

This diagram is documentation guidance, not a new runtime pipeline. [VERIFIED: `src/cli/sanctioned_graph_workflow.ts`; `src/graph_read_model/query_consumer.ts`; `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`]

### Recommended Project Structure

```text
docs/
└── olfactory_graph_read_model.md     # primary Phase 63 edit target

src/graph_read_model/
├── types.ts                          # normative proof-envelope types
├── validate_graph.ts                 # normative validation surfaces
├── validation_errors.ts              # normative error vocabulary
├── query_consumer.ts                 # sanctioned consumer boundary
└── query_graph.ts                    # low-level pure query primitives, not agent/RAG integration guidance

src/cli/
├── graph_read_model.ts               # public graph:build behavior
└── sanctioned_graph_workflow.ts       # internal workflow behavior

src/tests/
└── ...                               # examples and proof anchors
```

### Pattern 1: Documentation Mirrors Existing Contracts

**What:** Treat TypeScript types and passing tests as normative, then document their behavior with explicit source references. [VERIFIED: `src/graph_read_model/types.ts`; listed tests]  
**When to use:** All Phase 63 examples, field classifications, and anti-patterns.  
**Example:**

```typescript
// Source: src/graph_read_model/types.ts
export type GraphQueryProof<TKind extends GraphQueryKind, TParams, TResult> = {
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}
```

### Pattern 2: Two-Step Consumer Boundary

**What:** Document the sanctioned path as validation first, consumer creation second. [VERIFIED: `src/graph_read_model/query_consumer.ts`]  
**When to use:** Future Alquem.io/RAG guidance and all canonical examples.  
**Example:**

```typescript
// Source: src/graph_read_model/query_consumer.ts
const validated = asValidatedGraph(graph)
if (!validated.ok) {
  return validated.errors
}

const consumerResult = createValidatedQueryConsumer(validated.graph)
```

### Pattern 3: Field Classification Matrix

**What:** Use a compact table for `query_kind`, `params`, `result`, and `path`, with allowed use and forbidden reading. [VERIFIED: `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`; `src/graph_read_model/types.ts`]  
**When to use:** `GQRY-07` section.  
**Required classifications:** `query_kind` safe/stable, `params` safe with caution, `result` safe/primary, `path` conditionally safe provenance-only. [VERIFIED: `63-CONTEXT.md`]

### Anti-Patterns to Avoid

- **Contract-by-prose:** Do not add, rename, or imply envelope fields beyond `{ query_kind, params, result, path? }`; code/tests own the contract. [VERIFIED: `src/graph_read_model/types.ts`; `src/tests/graph_read_model/query_graph.test.ts`]
- **Raw graph consumption:** Do not document `graph.json` as ready for query just because it was produced by `graph:build`; re-reading it yields raw `OlfactoryGraph`. [VERIFIED: `62-CONTEXT.md`; `src/tests/cli/sanctioned_graph_workflow.test.ts`]
- **CLI query surface:** Do not imply `graph:build` exposes query proofs or should gain query commands. [VERIFIED: `src/cli/graph_read_model.ts`; `62-CONTEXT.md`]
- **Manual `ValidatedGraph`:** Do not show casts, object construction, or brand access as valid examples. [VERIFIED: `src/graph_read_model/query_consumer.ts`; `src/tests/graph_read_model/query_consumer.test.ts`]
- **`path` overreach:** Do not use `path` for confidence, ranking, authorization, completeness, or as a replacement for `result`. [VERIFIED: `63-CONTEXT.md`; `src/tests/graph_read_model/query_graph.test.ts`]
- **Missing target as failure:** Do not treat empty arrays or `null` results as system failure when the graph is valid. [VERIFIED: `src/tests/graph_read_model/query_consumer.test.ts`; `src/graph_read_model/query_graph.ts`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Validation before consumption | Ad hoc checks in docs or examples | `asValidatedGraph(graph)` | It runs `validateSanctionedV211Graph` and returns deterministic `ok/errors`. [VERIFIED: `src/graph_read_model/query_consumer.ts`] |
| Consumer creation | Direct calls to `query_graph.ts` in agent/RAG guidance | `createValidatedQueryConsumer(validatedGraph)` | It preserves the `ValidatedGraph` boundary and exposes the eight methods. [VERIFIED: `src/graph_read_model/query_consumer.ts`; `src/tests/graph_read_model/query_consumer.test.ts`] |
| Error taxonomy | Prose-only categories | `GraphValidationError` and factories, including `graph_not_validated` | Existing factories produce typed JSON-safe errors. [VERIFIED: `src/graph_read_model/validation_errors.ts`; `src/graph_read_model/types.ts`] |
| CLI workflow proof | New proof envelope for CLI | Existing CLI JSON `{ ok, graph_output, boundary_audit, guardrails }` | Tests lock the public CLI JSON keys and keep it separate from query proofs. [VERIFIED: `src/tests/cli/graph_read_model.test.ts`] |
| Content examples | Invented outputs | Examples copied from existing tests | Tests already prove stable proof objects and missing-target behavior. [VERIFIED: `src/tests/graph_read_model/query_graph.test.ts`] |

**Key insight:** In this phase, custom abstractions are mostly a documentation hazard: they can make a guide appear to define new contract surfaces even when production code did not. [VERIFIED: user instruction; `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md`]

## Risks Of Documentation-Induced Contract Drift

| Risk | How It Happens | Mitigation |
|------|----------------|------------|
| Guide implies `graph.json` is already trusted | Section order jumps from build output directly to queries | Insert `graph.json cru -> asValidatedGraph` as an explicit trust transition. [VERIFIED: `63-CONTEXT.md`; `src/tests/cli/sanctioned_graph_workflow.test.ts`] |
| Guide turns CLI into query runtime | `graph:build` examples are placed next to query examples without handoff | End CLI section at artifact/audit and state that CLI does not invoke query functions. [VERIFIED: `src/cli/graph_read_model.ts`] |
| Guide treats `path` as mandatory evidence | Examples with paths dominate field descriptions | State `path` is optional and provenance-only; list query kinds where tests assert `path` is undefined. [VERIFIED: `src/tests/graph_read_model/query_graph.test.ts`; `src/tests/graph_read_model/query_live_baseline.test.ts`] |
| Guide collapses validation failure and missing target | Empty/null `result` is described as error | Preserve three cases: validation errors, `graph_not_validated`, and valid empty/null proof. [VERIFIED: `63-CONTEXT.md`; `src/tests/graph_read_model/query_consumer.test.ts`] |
| Guide recommends low-level primitives | Examples import from `query_graph.ts` as agent/RAG surface | Mark `query_graph.ts` as internal primitive layer and use consumer examples for future integrations. [VERIFIED: `61-CONTEXT.md`; `src/tests/graph_read_model/query_consumer.test.ts`] |
| Guide suggests future fields are implicit | Prose says consumers may enrich or infer metadata | State future metadata requires explicit contract change. [VERIFIED: `63-CONTEXT.md`; `src/graph_read_model/types.ts`] |

## Documentation Plan Strategy

Plan as a small, reviewable documentation wave:

1. Reorder `docs/olfactory_graph_read_model.md` into the locked ten-section structure from `63-CONTEXT.md`. [VERIFIED: `63-CONTEXT.md`]
2. Move or rewrite existing Phase 59 historical sections so the first reader sees scope, workflow, validation, trusted consumer boundary, envelope table, errors, examples, and references in that order. [VERIFIED: current `docs/olfactory_graph_read_model.md`]
3. Add a proof-envelope matrix sourced from `types.ts` and query/consumer tests. [VERIFIED: `src/graph_read_model/types.ts`; `src/tests/graph_read_model/query_graph.test.ts`]
4. Add local fence notes in `graph:build`, `graph.json`, `ValidatedGraph`, consumer, envelope, `path`, examples, and final checklist sections. [VERIFIED: `63-CONTEXT.md`]
5. Label examples as `Canonico`, `Ilustrativo`, or `Proibido`, and use only examples backed by listed tests. [VERIFIED: `63-CONTEXT.md`; listed tests]
6. Avoid production code edits. If a mismatch is found, document it as an open question rather than changing contracts. [VERIFIED: user instruction]

## Common Pitfalls

### Pitfall 1: Treating Documentation As A Contract Migration

**What goes wrong:** The guide introduces a nicer flow by adding helper names, extra fields, or changed error semantics. [VERIFIED: user instruction; `63-CONTEXT.md`]  
**Why it happens:** Prose tries to smooth rough edges instead of reflecting existing code.  
**How to avoid:** Every example must cite or mirror an existing test/type; new behavior belongs in future phases.  
**Warning signs:** Mentions of `createValidatedQueryConsumerFromGraph`, `assertValidatedGraph`, `OrThrow`, new proof metadata, or CLI query commands. [VERIFIED: `src/tests/graph_read_model/query_consumer.test.ts`]

### Pitfall 2: Confusing Artifact Production With Trusted Consumption

**What goes wrong:** `graph:build` success is documented as sufficient proof for future queries. [VERIFIED: `62-CONTEXT.md`]  
**Why it happens:** The CLI validates before writing, but re-reading `graph.json` still produces raw data without a branded validation handle. [VERIFIED: `src/cli/sanctioned_graph_workflow.ts`; `src/graph_read_model/query_consumer.ts`]  
**How to avoid:** Require re-entry through `asValidatedGraph(graph)`.  
**Warning signs:** Query examples immediately after a file read with no validation step.

### Pitfall 3: Overclaiming Agent/RAG Readiness

**What goes wrong:** The guide sounds like Alquem.io can call a runtime, API, database, or persisted proof store now. [VERIFIED: `.planning/REQUIREMENTS.md`]  
**Why it happens:** "Consumer readiness" is easy to read as product integration readiness.  
**How to avoid:** Say readiness is limited to static artifact plus in-memory proof envelopes.  
**Warning signs:** Words like endpoint, service, job, API response, Neo4J import, persisted proof, or Graphify output in normative sections.

## Code Examples

### Sanctioned Validation And Consumer Creation

```typescript
// Source: src/graph_read_model/query_consumer.ts
const validated = asValidatedGraph(graph)
if (!validated.ok) {
  return { ok: false, errors: validated.errors }
}

const consumer = createValidatedQueryConsumer(validated.graph)
```

### Proof Envelope Shape

```typescript
// Source: src/graph_read_model/types.ts
export type GraphQueryProof<TKind extends GraphQueryKind, TParams, TResult> = {
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}
```

### Missing Target Is A Valid Proof

```typescript
// Source: src/tests/graph_read_model/query_consumer.test.ts
expect(consumer.resolveAliasPath('unknown_alias')).toEqual({
  query_kind: 'alias_resolution_path',
  params: { alias: 'unknown_alias' },
  result: { target_descriptor_id: null },
})
```

## State Of The Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Query examples could be read as direct `query_graph.ts` usage | Future consumers must use `asValidatedGraph -> createValidatedQueryConsumer` | Phase 61 | Guide must route agent/RAG examples through consumer boundary. [VERIFIED: `61-CONTEXT.md`; `src/graph_read_model/query_consumer.ts`] |
| CLI build docs ended before proving non-dry-run sandbox and Graphify isolation | Phase 62 tests prove non-dry-run sandbox, JSON top-level keys, Graphify isolation, and re-entry through consumer | Phase 62 | Guide can now explain the full safe build-to-consume chain. [VERIFIED: `62-CONTEXT.md`; `src/tests/cli/sanctioned_graph_workflow.test.ts`] |
| Validation was less explicitly profile-aware | `validateSanctionedV211Graph` wraps the sanctioned profile | Phase 60 | Guide should name sanctioned validation rather than vague validation. [VERIFIED: `60-CONTEXT.md`; `src/graph_read_model/validate_graph.ts`] |

**Deprecated/outdated:**

- Historical guide order that places Neo4J notes and recaps before the full operator workflow should be superseded by the Phase 63 canonical order. [VERIFIED: current `docs/olfactory_graph_read_model.md`; `63-CONTEXT.md`]
- Direct `query_graph.ts` guidance for agent/RAG usage should not be used as the recommended consumer path. [VERIFIED: `61-CONTEXT.md`; `src/tests/graph_read_model/query_consumer.test.ts`]

## Assumptions Log

All claims in this research are derived from files read in this session or commands executed in this session. No `[ASSUMED]` claims are required. [VERIFIED: local file reads and command outputs]

## Open Questions (RESOLVED)

1. **Should Phase 63 add automated documentation content checks, or keep validation manual plus existing tests?**
   - What we know: The phase is documentation-first and existing tests prove code behavior. [VERIFIED: user instruction; targeted test output]
   - What's unclear: Whether planner should add a small content-check script/test for required headings/fences.
   - Recommendation: Prefer `rg`-based manual/content checklist in the plan; add a test only if it edits test files and does not touch production contracts. [VERIFIED: user instruction]
   - RESOLVED: `63-01-PLAN.md` uses `rg` and `node -e` content checks plus existing typecheck/Vitest suites. It does not add new production code or contract tests.

2. **Should `docs/olfactory_graph_contract.md` be edited?**
   - What we know: Phase 63 primary target is the operational guide; the contract already states static/no-runtime/no-database/no-Graphify boundaries. [VERIFIED: `docs/olfactory_graph_contract.md`; `63-CONTEXT.md`]
   - What's unclear: Whether a tiny cross-reference from contract to consumer guide is desired.
   - Recommendation: Keep edits focused on `docs/olfactory_graph_read_model.md` unless planning identifies a specific stale reference in the contract. [VERIFIED: user instruction]
   - RESOLVED: `63-01-PLAN.md` keeps `docs/olfactory_graph_contract.md` as a normative reference only. The implementation target is `docs/olfactory_graph_read_model.md`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Typecheck/tests | yes | `v24.14.0` | none needed. [VERIFIED: `node --version`] |
| npm | Project scripts | yes | `11.9.0` | none needed. [VERIFIED: `npm --version`] |
| TypeScript | `npm --prefix src run typecheck` | yes | `^5.8.0` declared | none needed. [VERIFIED: `src/package.json`; typecheck passed] |
| Vitest | Targeted tests | yes | `^3.2.0` declared; runtime `v3.2.4` | Use `TMPDIR=/tmp` if Vitest chooses inaccessible Windows temp path. [VERIFIED: `src/package.json`; failed then passed test run] |
| Graphify planning graph | Optional semantic graph context | no | disabled; `.planning/graphs/graph.json` absent | Use mandatory files and tests as sources. [VERIFIED: `node .codex/gsd-core/bin/gsd-tools.cjs graphify status`; `ls .planning/graphs/graph.json`] |

**Missing dependencies with no fallback:** none. [VERIFIED: command outputs]  
**Missing dependencies with fallback:** graphify planning graph is unavailable, but Phase 63 has complete local normative sources. [VERIFIED: file reads]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest, declared as `^3.2.0`; runtime output `v3.2.4`. [VERIFIED: `src/package.json`; test output] |
| Config file | `src/vitest.config.ts`, includes `tests/**/*.test.ts`. [VERIFIED: `rg` over config] |
| Quick run command | `TMPDIR=/tmp npm --prefix src run typecheck` |
| Targeted suite command | `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/cli/graph_read_model.test.ts tests/graph_read_model/write_graph.test.ts` |
| Full boundary command | `TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| GQRY-07 | Envelope fields are stable, `path` optional, missing-target proofs remain valid, and consumer proofs equal low-level proof objects. | unit/integration | `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_consumer.test.ts` | yes. [VERIFIED: tests passed] |
| GDOC-04 | Safe workflow order is supported by CLI, workflow, validation, and consumer tests. | integration/content review | `TMPDIR=/tmp npm --prefix src test -- tests/cli/graph_read_model.test.ts tests/cli/sanctioned_graph_workflow.test.ts` plus content checks below | yes. [VERIFIED: tests passed] |
| GDOC-05 | Consumer readiness remains static/read-only and excludes runtime/API/database/Graphify scope. | integration/content review | `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/write_graph.test.ts tests/cli/sanctioned_graph_workflow.test.ts` plus content checks below | yes. [VERIFIED: tests passed] |

### Sampling Rate

- **Per task commit:** `TMPDIR=/tmp npm --prefix src run typecheck` and content checks for edited docs. [VERIFIED: typecheck passed]
- **Per wave merge:** targeted suite command plus full boundary command. [VERIFIED: both passed with `TMPDIR=/tmp`]
- **Phase gate:** typecheck, targeted suite, boundary suite, and `git diff -- docs/olfactory_graph_read_model.md` review showing documentation-only changes. [VERIFIED: repository layout]

### Recommended Content Checks

Use `rg` after implementation to verify the guide contains required terms:

```bash
rg -n "graph:build|asValidatedGraph|createValidatedQueryConsumer|graph_not_validated|query_kind|params|result|path|Canonico|Ilustrativo|Proibido" docs/olfactory_graph_read_model.md
rg -n "runtime|API|Neo4J|Graphify|database|banco|publicacao|persistencia" docs/olfactory_graph_read_model.md
rg -n "createValidatedQueryConsumerFromGraph|assertValidatedGraph|OrThrow|--out" docs/olfactory_graph_read_model.md
```

The third command should return no normative recommendation for those names; if a forbidden term appears only inside an anti-pattern, that is acceptable and should be reviewed manually. [VERIFIED: `63-CONTEXT.md`; `src/tests/graph_read_model/query_consumer.test.ts`]

### Wave 0 Gaps

None required for production code. Optional planner task: define a lightweight documentation checklist before editing so the final review does not rely on memory. [VERIFIED: user instruction; existing test infrastructure]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No authentication surface is introduced. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| V3 Session Management | no | No session/runtime surface is introduced. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| V4 Access Control | limited | Preserve read-only/protected-path fences and do not create write/runtime/API scopes. [VERIFIED: `docs/olfactory_graph_contract.md`; `src/tests/graph_read_model/write_graph.test.ts`] |
| V5 Input Validation | yes | Use existing graph validation via `validateSanctionedV211Graph` and `asValidatedGraph`; do not document ad hoc validation. [VERIFIED: `src/graph_read_model/validate_graph.ts`; `src/graph_read_model/query_consumer.ts`] |
| V6 Cryptography | limited | Boundary audit uses SHA-256 protected-file digests; do not extend crypto scope. [VERIFIED: `src/cli/graph_read_model.ts`; `src/tests/cli/sanctioned_graph_workflow.test.ts`] |

### Known Threat Patterns For This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Documentation creates unauthorized runtime/API interpretation | Elevation of privilege / Information disclosure | Repeated global/local no-scope fences and no new commands/APIs. [VERIFIED: `63-CONTEXT.md`; `.planning/REQUIREMENTS.md`] |
| Raw graph consumed as trusted data | Tampering / Spoofing | Require `asValidatedGraph(graph)` and branded `ValidatedGraph`. [VERIFIED: `src/graph_read_model/query_consumer.ts`] |
| Provenance `path` treated as authority | Tampering | State `result` is authoritative payload and `path` is optional provenance only. [VERIFIED: `63-CONTEXT.md`; `src/graph_read_model/types.ts`] |
| Graphify output mixed into read model workflow | Tampering | Keep `graphify-out/**` excluded and untouched; tests prove isolation. [VERIFIED: `docs/olfactory_graph_contract.md`; `src/tests/cli/sanctioned_graph_workflow.test.ts`] |

## Verification Performed During Research

| Command | Result | Note |
|---------|--------|------|
| `npm --prefix src run typecheck` | passed | TypeScript contracts compile. [VERIFIED: command output] |
| `npm --prefix src test -- ...` without `TMPDIR=/tmp` | failed before tests | Vitest attempted to create temp files under inaccessible `/mnt/c/...`; environment issue, not test assertion failure. [VERIFIED: command output] |
| `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/cli/graph_read_model.test.ts tests/graph_read_model/write_graph.test.ts` | passed, 64 tests | Validates proof shapes, consumer boundary, live baseline, CLI behavior, and writer boundaries. [VERIFIED: command output] |
| `TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts` | passed, 7 tests | Validates sanctioned workflow, Graphify isolation, forbidden path, guardrail failure, and re-entry via consumer. [VERIFIED: command output] |

## Sources

### Primary (HIGH confidence)

- `.planning/ROADMAP.md` - Phase 63 goal, requirements, success criteria. [VERIFIED: local read]
- `.planning/REQUIREMENTS.md` - v2.12 requirements, future/deferred scope, out-of-scope fences. [VERIFIED: local read]
- `.planning/STATE.md` - inherited decisions from Phases 60-62. [VERIFIED: local read]
- `.planning/phases/63-consumer-readiness-documentation/63-CONTEXT.md` - locked guide order, envelope classification, examples, fences. [VERIFIED: local read]
- `.planning/phases/60-contract-constants-validation-hardening/60-CONTEXT.md` - validation/profile/error contracts. [VERIFIED: local read]
- `.planning/phases/61-fail-closed-query-consumption/61-CONTEXT.md` - `ValidatedGraph` and fail-closed consumer boundary. [VERIFIED: local read]
- `.planning/phases/62-sanctioned-cli-boundary-proofs/62-CONTEXT.md` - CLI/workflow/Graphify isolation boundary. [VERIFIED: local read]
- `docs/olfactory_graph_read_model.md` - current guide to edit. [VERIFIED: local read]
- `docs/olfactory_graph_contract.md` - static graph contract and exclusions. [VERIFIED: local read]
- `src/graph_read_model/*.ts`, `src/cli/*.ts`, and listed tests - executable normative behavior. [VERIFIED: local read and targeted tests]

### Secondary (MEDIUM confidence)

- None needed; no web or external documentation was required for this codebase-internal documentation phase. [VERIFIED: research scope]

### Tertiary (LOW confidence)

- None. [VERIFIED: assumptions log]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - confirmed from `src/package.json`, local versions, typecheck, and test output. [VERIFIED: command output]
- Architecture: HIGH - confirmed from roadmap/context/code/tests and repeated phase decisions. [VERIFIED: local reads]
- Pitfalls: HIGH - derived from explicit user fences and tests that lock no shortcut/no runtime/no envelope mutation behavior. [VERIFIED: user prompt; tests]

**Research date:** 2026-06-17  
**Valid until:** 2026-07-17, unless graph read model contracts or Phase 63 context change first.

## RESEARCH COMPLETE

Research for Phase 63 is complete. The planner can create a documentation-first plan that edits the operational guide, preserves all production contracts, uses existing tests/types as normative sources, and validates with typecheck, targeted Vitest suites, and content checks.
