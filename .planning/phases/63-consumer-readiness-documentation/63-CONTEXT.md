# Phase 63: Consumer Readiness Documentation - Context

**Gathered:** 2026-06-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Transformar os contratos consolidados nas Phases 60-62 em documentacao operacional de consumo, ensinando o ciclo de vida completo do artefato (`graph:build -> graph.json cru -> asValidatedGraph -> createValidatedQueryConsumer -> query proof`), a fronteira de confianca fail-closed e o envelope seguro para futuros consumidores agent/RAG, sem abrir escopo de runtime, API, servico HTTP, banco de dados, Neo4J, Graphify, publicacao automatica ou persistencia de proofs.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope And Requirements
- `.planning/ROADMAP.md` — Define a Phase 63 como `Consumer Readiness Documentation`, com objetivo, requisitos `GQRY-07`, `GDOC-04`, `GDOC-05` e criterios de sucesso ligados a ordem do guia, classificacao do envelope e fences de nao-escopo.
- `.planning/REQUIREMENTS.md` — Define os requisitos pendentes da milestone v2.12 e fixa que a preparacao para agent/RAG permanece read-only, sem runtime, API, banco, export ou escopo de execucao.
- `.planning/PROJECT.md` — Resume a meta da milestone v2.12, o estado atual do read model e os fences contra runtime/API/database/Graphify/publicacao.
- `.planning/STATE.md` — Registra as decisoes recentes das phases 60-62 que a documentacao de consumo deve carregar sem reabrir.

### Prior Decisions Carried Forward
- `.planning/phases/60-contract-constants-validation-hardening/60-CONTEXT.md` — Trava `validateSanctionedV211Graph`, o wrapper sancionado, a separacao entre validacao estrutural/profile-aware e o uso de erros tipados deterministas.
- `.planning/phases/61-fail-closed-query-consumption/61-CONTEXT.md` — Trava `ValidatedGraph`, `asValidatedGraph`, `createValidatedQueryConsumer(validatedGraph)`, `graph_not_validated`, a preservacao do envelope `{ query_kind, params, result, path }` e a semantica de missing target.
- `.planning/phases/62-sanctioned-cli-boundary-proofs/62-CONTEXT.md` — Trava o papel de `graph:build`, a reentrada de `graph.json` pelo fluxo validado, o boundary audit e os fences contra query via CLI, Graphify e runtime.

### Existing Maintainer Documentation
- `docs/olfactory_graph_read_model.md` — Guia operacional atual a ser reordenado e endurecido; ja cobre `graph:build`, baseline, query proofs, Graphify isolation e disclaimers de artefato derivado.
- `docs/olfactory_graph_contract.md` — Contrato normativo do read model, incluindo schema, node/edge kinds, output boundary e exclusoes explicitas de runtime, database e Graphify.

### Consumer Boundary And Runtime Surfaces
- `src/graph_read_model/query_consumer.ts` — Define `ValidatedGraph`, `asValidatedGraph(graph)`, `createValidatedQueryConsumer(validatedGraph)`, os oito metodos do consumer e a verificacao de marca interna que nao deve ser contornada nem documentada como API publica ampliada.
- `src/graph_read_model/query_graph.ts` — Contem as primitives puras de query cujo contrato de sucesso deve continuar estavel, mas que nao devem ser recomendadas diretamente para integracoes agent/RAG.
- `src/graph_read_model/validate_graph.ts` — Define `validateSanctionedV211Graph(graph)` e a distincao entre falha de validacao e consumo sem prova de validacao.
- `src/graph_read_model/types.ts` — Define `GraphQueryProof`, `query_kind`, `result` e `path`, sustentando a tabela de classificacao do envelope.
- `src/graph_read_model/validation_errors.ts` — Centraliza `graph_not_validated` e o vocabulario de erros tipados que a documentacao deve distinguir de missing target.
- `src/cli/graph_read_model.ts` — Define o workflow publico `graph:build`, seu help, o contrato `--json`, o papel do boundary audit e a nota de que a CLI nao invoca query functions.
- `src/cli/sanctioned_graph_workflow.ts` — Define o orquestrador sancionado non-dry-run/dry-run, incluindo `forbidden_path`, guardrails e boundary audit, que o guia deve explicar sem reinterpretar como runtime publico.

### Automated Proof Anchors
- `src/tests/graph_read_model/query_graph.test.ts` — Fonte canonica das formas de proof e dos exemplos por `query_kind`, incluindo quais queries possuem ou nao `path`.
- `src/tests/graph_read_model/query_consumer.test.ts` — Prova a fronteira `ValidatedGraph -> createValidatedQueryConsumer(validatedGraph)`, o comportamento `graph_not_validated` e a ausencia deliberada de atalhos como `createValidatedQueryConsumerFromGraph`.
- `src/tests/graph_read_model/query_live_baseline.test.ts` — Prova o consumo do baseline vivo via consumer validado e ajuda a sustentar a narrativa de agent/RAG sobre o catalogo completo.
- `src/tests/cli/sanctioned_graph_workflow.test.ts` — Prova `graph:build --dry-run`, `graph:build` non-dry-run, boundary audit, Graphify isolation, reentrada por consumer validado e os branches de falha sancionados.
- `src/tests/cli/graph_read_model.test.ts` — Prova help, `--json`, `--dry-run` e o contrato operacional da CLI `graph:build`.
- `src/tests/graph_read_model/write_graph.test.ts` — Prova o boundary de output, `forbidden_path` e os fences contra escrita em `graphify-out/**`, `data/compiled/**`, `data/taxonomy/**` e `data/inference/**`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `docs/olfactory_graph_read_model.md`: ja concentra o guia do mantenedor em portugues e e a base natural para reordenacao, fences locais e rotulacao `Canonico/Ilustrativo/Proibido`.
- `src/graph_read_model/query_consumer.ts`: ja oferece a superficie sancionada de consumo (`asValidatedGraph`, `ValidatedGraph`, `createValidatedQueryConsumer`) que a documentacao deve tornar central.
- `src/cli/graph_read_model.ts`: ja descreve o workflow oficial `graph:build`, o contrato `--json` e a afirmacao de que a CLI nao invoca query functions.
- `src/tests/cli/sanctioned_graph_workflow.test.ts`: ja prova o ciclo completo `graph:build -> graph.json -> asValidatedGraph -> consumer`, sendo a ancora natural dos exemplos canonicos.

### Established Patterns
- O projeto prefere superfícies sancionadas, contratos explicitos e fluxos `ok/error` deterministas em vez de atalhos ergonomicos que apaguem fronteiras semanticas.
- O milestone v2.12 vem reforcando boundaries read-only, zero-dependency e sem runtime/API/database; a documentacao precisa repetir essas cercas ao longo do guia, nao apenas em uma secao isolada.
- As query proofs preservam envelope de sucesso estavel, enquanto erros e misuse ficam na fronteira de validacao/consumer creation; a documentacao deve espelhar exatamente essa separacao.

### Integration Points
- A reordenacao do guia precisa conectar `graph:build`, `graph.json` cru, `validateSanctionedV211Graph(graph)`, `ValidatedGraph`, consumer fail-closed e envelope de proof em uma unica narrativa sem duplicar contrato.
- A tabela do envelope deve ser alinhada com `GraphQueryProof` em `types.ts` e com os exemplos reais de `query_graph.test.ts`, evitando reinterpretacoes livres por consumidores futuros.
- Os fences editoriais precisam aparecer nos pontos de maior risco de leitura indevida: CLI, artefato bruto, marca de `ValidatedGraph`, uso do consumer, `path` opcional e exemplos que poderiam ser confundidos com API publica.

</code_context>

<specifics>
## Specific Ideas

- A secao "Mapa do fluxo completo" deve mostrar o artefato mudando de status de confianca: workflow sancionado -> `graph.json` cru -> prova de validacao -> handle reutilizavel -> query proof.
- A tabela do envelope deve aparecer como matriz curta por campo (`query_kind`, `params`, `result`, `path`) com classificacao e regra normativa de consumo, nao como texto difuso.
- Os exemplos devem seguir exatamente a ordem do ciclo completo e explicitar tres familias de leitura: sucesso valido, falha de validacao e missing target.
- Cada exemplo deve ser rotulado como `Canonico`, `Ilustrativo` ou `Proibido` para evitar que snippets reduzidos sejam interpretados como API nova ou atalho sancionado.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 63-Consumer Readiness Documentation*
*Context gathered: 2026-06-17*
