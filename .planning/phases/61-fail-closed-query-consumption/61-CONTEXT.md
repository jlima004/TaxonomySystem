# Phase 61: Fail-Closed Query Consumption - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Criar uma fronteira fail-closed explicita para consumo das query proofs do graph read model, separando grafo cru de grafo validado e bloqueando geracao de proofs a partir de grafos invalidos ou nao validados, sem alterar o envelope de sucesso existente nem endurecer diretamente as funcoes puras de `query_graph.ts`.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope And Requirements
- `.planning/ROADMAP.md` — Define a Phase 61 como `Fail-Closed Query Consumption`, com objetivo, requisitos `GVAL-07`, `GQRY-06`, `GQRY-08` e criterios de sucesso do boundary fail-closed.
- `.planning/REQUIREMENTS.md` — Define os requisitos ativos do milestone v2.12 e trava a separacao entre fail-closed query consumption, provas de boundary e documentacao de consumo.
- `.planning/PROJECT.md` — Define os limites do milestone v2.12, a obrigacao de manter o read model zero-dependency e read-only, e o fence contra runtime/API/database/publicacao.
- `.planning/STATE.md` — Registra a Phase 61 como foco atual e carrega as decisoes recentes da Phase 60 que a Phase 61 deve consumir sem reabrir.

### Prior Decisions Carried Forward
- `.planning/phases/60-contract-constants-validation-hardening/60-CONTEXT.md` — Trava o wrapper `validateSanctionedV211Graph`, a separacao entre validacao estrutural/profile-aware/sanctioned wrapper, o uso de `graph_not_validated` e a orientacao para o boundary consumer-facing da Phase 61.
- `.planning/phases/60-contract-constants-validation-hardening/60-DISCUSSION-LOG.md` — Registra as alternativas consideradas na Phase 60 e reforca que o boundary de consumo fail-closed foi explicitamente deixado para a Phase 61.

### Graph Read Model Contract And Query Surface
- `src/graph_read_model/contract.ts` — Fonte normativa de schema, codigos de erro, invariant IDs e `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`; deve continuar como base autoritativa do boundary de validacao.
- `src/graph_read_model/types.ts` — Define `OlfactoryGraph`, `GraphValidationResult`, `GraphQueryProof` e o envelope de sucesso que a Phase 61 deve preservar.
- `src/graph_read_model/validate_graph.ts` — Implementa `validateSanctionedV211Graph(graph)` e o comportamento de erro detalhado que a Phase 61 deve reutilizar, nao duplicar.
- `src/graph_read_model/query_graph.ts` — Contem as oito query proofs puras e de baixo nivel que devem continuar reutilizadas pelo consumer sancionado sem endurecimento direto.
- `src/graph_read_model/validation_errors.ts` — Centraliza factories deterministicas, incluindo `graph_not_validated`, e deve continuar sendo o ponto oficial para erros tipados.

### Existing Documentation And Regression Proofs
- `docs/olfactory_graph_read_model.md` — Guia operacional atual do read model v2.11; documenta o wrapper sancionado de validacao e explicita que o comportamento fail-closed de consumo fica para a Phase 61.
- `src/tests/graph_read_model/query_graph.test.ts` — Prova o envelope de sucesso e a semantica de missing target que a Phase 61 deve preservar.
- `src/tests/graph_read_model/query_live_baseline.test.ts` — Prova o uso do wrapper sancionado antes das query proofs no baseline v2.11 e ajuda a ancorar o novo boundary seguro.
- `src/tests/graph_read_model/validate_graph.test.ts` — Ja cobre `graph_not_validated` e erros detalhados de validacao; serve de base para separar invalidez estrutural de consumo sem validacao.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/graph_read_model/validate_graph.ts`: ja oferece `validateSanctionedV211Graph(graph)` como wrapper oficial para validar o artefato sancionado antes de qualquer consumo.
- `src/graph_read_model/query_graph.ts`: concentra as oito query proofs puras que podem ser encapsuladas por um consumer seguro sem alterar sua semantica interna.
- `src/graph_read_model/types.ts`: ja define o envelope `GraphQueryProof` e os tipos centrais necessarios para introduzir `ValidatedGraph` sem mudar o contrato de sucesso.
- `src/graph_read_model/validation_errors.ts`: ja possui factories deterministicas, inclusive `graph_not_validated`, que devem ser reutilizadas no boundary de consumo.

### Established Patterns
- O projeto prefere modulos funcionais puros, TypeScript strict, ESM e zero dependencies; a Phase 61 deve seguir esse padrao e evitar classes, services ou runtime state.
- O milestone v2.12 vem separando surfaces sancionadas de helpers de baixo nivel; a Phase 61 deve continuar essa estrategia em vez de duplicar validacao dentro de `query_graph.ts`.
- O contrato de sucesso das query proofs e estavel e voltado a consumo futuro por agentes/RAG; erros ficam fora do envelope de sucesso e devem ser tratados no boundary de validacao/consumer creation.

### Integration Points
- O novo `ValidatedGraph` deve se conectar diretamente a `validateSanctionedV211Graph(graph)` em `validate_graph.ts`.
- `createValidatedQueryConsumer(validatedGraph)` deve encapsular chamadas para as funcoes de `query_graph.ts` sem alterar o shape das proofs.
- Os testes atuais de query e validacao sao os pontos naturais para provar que fail-closed bloqueia grafos invalidos/nao validados sem mudar missing-target nem o envelope de sucesso.

</code_context>

<specifics>
## Specific Ideas

- O fluxo recomendado para consumidores futuros deve ser explicitamente em duas etapas: `asValidatedGraph(graph)` seguido de `createValidatedQueryConsumer(validatedGraph)`.
- Se ergonomia adicional for desejada, ela deve aparecer apenas como helper secundario nomeado explicitamente, sem enfraquecer a fronteira semantica do `ValidatedGraph`.
- A principal ressalva desta discussao e registrar no contexto que `createValidatedQueryConsumer(graph)` nao deve virar atalho principal nem contrato recomendado.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 61-Fail-Closed Query Consumption*
*Context gathered: 2026-06-16*
