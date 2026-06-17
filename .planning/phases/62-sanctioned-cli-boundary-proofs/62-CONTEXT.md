# Phase 62: Sanctioned CLI Boundary Proofs - Context

**Gathered:** 2026-06-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Provar o workflow sancionado de escrita do graph read model em caminho sandboxado, com evidencia automatizada de non-dry-run, auditoria de fronteira e isolamento de `graphify-out/**`, sem transformar a CLI em runtime, sem criar um novo contrato publico de proof e sem abrir qualquer atalho que contorne `ValidatedGraph -> createValidatedQueryConsumer`.

</domain>

<decisions>
## Implementation Decisions

### Internal Orchestrator And Thin CLI
- **D-01:** A arquitetura da Phase 62 deve seguir `orquestrador interno + CLI fina`, mantendo a CLI publica apenas como porta de composicao do workflow sancionado.
- **D-02:** A CLI publica nao deve expor as oito query proofs como comandos, nem ganhar acesso privilegiado a `query_graph.ts`.
- **D-03:** O `graph.json` gerado continua sendo dado cru quando relido; qualquer consumo de query posterior deve reentrar obrigatoriamente por `asValidatedGraph -> createValidatedQueryConsumer`.
- **D-04:** O orquestrador interno pode consumir builder, validator, writer, auditoria de fronteira e executor de guardrails, mas nao deve retornar um novo "proof da CLI" nem ampliar o envelope publico existente.
- **D-05:** A assinatura conceitual travada para o workflow interno e `runSanctionedGraphWorkflow({ outputDir, dryRun, guardrailExecutor })`.

### Guardrails Without Recursion
- **D-06:** O orquestrador deve receber `GuardrailExecutor` como dependencia funcional simples, sem classe, sem estado global e sem branch especial por ambiente de teste.
- **D-07:** A composicao publica da CLI continua injetando o executor real e deve seguir executando os quatro guardrails na ordem atual: `typecheck`, `test`, `alias:integrity`, `verify:integrity`.
- **D-08:** No teste sandboxado da Phase 62, deve existir um executor hibrido que roda `typecheck`, `alias:integrity` e `verify:integrity` de verdade, mas intercepta apenas o passo `test` com evidencia local e deterministica para impedir invocacao recursiva da propria suite.
- **D-09:** A evidencia substituta do passo recursivo deve ser explicita e nao pode fingir execucao real da suite; o teste deve provar que o orquestrador solicitou os quatro guardrails, que tres rodaram de verdade e que `test` foi interceptado pelo executor injetado.
- **D-10:** Qualquer guardrail com falha deve interromper o fluxo antes da geracao/publicacao do artefato no sandbox.

### Measured Graphify Isolation
- **D-11:** O isolamento de `graphify-out/**` deve ser provado por medicao de harness, nao por campos declarativos como `graphify_out_accesses: 0`.
- **D-12:** O harness da Phase 62 deve capturar snapshots antes e depois de `graphify-out/**` usando inventario ordenado de arquivos e hashes deterministas de conteudo, com caminhos relativos normalizados e comparacao estavel.
- **D-13:** Diretorio ausente e um estado valido e deterministico, representado como inventario vazio.
- **D-14:** Qualquer criacao, remocao, renomeacao ou alteracao de conteudo sob `graphify-out/**` deve falhar o teste.
- **D-15:** O snapshot pode incluir `size_bytes` e um `aggregate_sha256` do diretorio, mas deve ignorar metadados instaveis como `mtime`, permissoes e ordem retornada pelo filesystem.

### Forbidden Path Rejection
- **D-16:** O `outputDir` deve ser parametro explicito do orquestrador interno; a CLI publica nao ganha `--out`.
- **D-17:** No non-dry-run, a composicao publica injeta apenas o destino sancionado; no dry-run, nenhum writer e acionado.
- **D-18:** A validacao de caminho deve acontecer antes dos guardrails e antes de qualquer escrita, para evitar trabalho desnecessario e efeitos parciais.
- **D-19:** Tentativas de caminho proibido devem retornar um resultado interno tipado `forbidden_path` no boundary do workflow, sem criar tipo publico novo no graph read model.
- **D-20:** A CLI fina deve traduzir `forbidden_path` para `stderr` estavel, `exit code != 0`, ausencia de `graph.json` e ausencia de mutacao; o teste de forbidden path pode chamar o orquestrador diretamente com destino proibido, sem simular parsing nem criar uma "CLI de teste".

### Sanctioned Evidence And Public Behavior
- **D-21:** A evidencia sancionada obrigatoria da Phase 62 deve combinar `exit code + stderr/stdout + arquivo sandbox + medicoes`, sem criar novo contrato publico.
- **D-22:** No caso sancionado de sucesso, o teste deve provar `exitCode === 0`, `stderr` vazio, `stdout` compativel com o comportamento atual da CLI, e que no modo `--json` a saida atual continua parseavel sem campos novos inventados pela Phase 62.
- **D-23:** No caso de sucesso, `graph.json` deve existir apenas no destino permitido dentro do sandbox, ser legivel e poder reentrar pelo fluxo `asValidatedGraph -> createValidatedQueryConsumer`.
- **D-24:** No caso de sucesso, snapshots de inventario e hashes de `graphify-out/**` devem permanecer identicos, nenhum forbidden path pode ser criado/removido/modificado, e os quatro guardrails devem ter sido solicitados com substituicao explicita apenas do passo recursivo `test` no harness.
- **D-25:** No caso de `forbidden_path` ou guardrail reprovado, o teste deve provar `exitCode !== 0`, mensagem deterministica em `stderr`, ausencia de sucesso enganoso em `stdout`, ausencia de `graph.json`, ausencia de mutacao fora dos caminhos permitidos e interrupcao antes da geracao do artefato.
- **D-26:** Verificacoes de `stdout`/`stderr` devem usar marcadores estaveis, nao snapshots integrais de texto humano; a evidencia mais forte continua sendo o JSON atual da CLI combinado com comportamento de processo, arquivo real no sandbox e medicoes independentes do harness.

### the agent's Discretion
Nenhuma area relevante foi delegada para decisao livre do agente. O boundary da CLI, a estrategia de evidencia e a regra de reentrada por `ValidatedGraph -> createValidatedQueryConsumer` ficaram explicitamente travados nesta discussao.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope And Requirements
- `.planning/ROADMAP.md` — Define a Phase 62 como `Sanctioned CLI Boundary Proofs`, com objetivo, requisitos `GVAL-08`, `GVAL-09`, `GVAL-10` e criterios de sucesso para sandbox, boundary audit e isolamento de Graphify.
- `.planning/REQUIREMENTS.md` — Define os requisitos ativos da milestone v2.12 e trava que a prova da CLI permanece dentro do escopo de hardening, nao de runtime ou publicacao.
- `.planning/PROJECT.md` — Define os fences da milestone v2.12: zero-dependency, sem runtime/API/database, sem mutacao de `data/taxonomy/**`, `data/compiled/v2/**` ou `graphify-out/**`.
- `.planning/STATE.md` — Registra a milestone ativa e as decisoes recentes das Phases 60 e 61 que a Phase 62 deve respeitar sem reabrir.

### Prior Decisions Carried Forward
- `.planning/phases/60-contract-constants-validation-hardening/60-CONTEXT.md` — Trava `validateSanctionedV211Graph`, a separacao entre validacao estrutural/profile-aware/wrapper sancionado e o uso de erros deterministas compativeis.
- `.planning/phases/61-fail-closed-query-consumption/61-CONTEXT.md` — Trava `ValidatedGraph`, `asValidatedGraph`, `createValidatedQueryConsumer(validatedGraph)` e a proibicao de atalhos que enfraquecam o boundary de consumo.

### Sanctioned CLI, Boundary Audit And Output Policy
- `src/cli/graph_read_model.ts` — Superficie publica atual de `graph:build`; deve permanecer CLI fina, sem queries publicas e sem contrato novo de proof.
- `src/graph_read_model/write_graph.ts` — Define a politica de output, a rejeicao de prefixos proibidos e o writer atomico; e a base natural para o branch `forbidden_path`.
- `src/graph_read_model/boundary_audit.ts` — Define a auditoria atual de arquivos protegidos; precisa ser complementada por medicao real de `graphify-out/**` no harness da Phase 62.
- `src/graph_read_model/contract.ts` — Fonte normativa para caminho sancionado, `/tmp` como suporte de verificacao e prefixes proibidos de output.

### Existing Regression And Documentation Anchors
- `src/tests/cli/graph_read_model.test.ts` — Cobre help, `--json`, `--dry-run` e politica de output; serve de base para manter a superficie publica estavel enquanto a prova non-dry-run cresce.
- `src/tests/graph_read_model/write_graph.test.ts` — Ja prova rejeicao de caminhos proibidos e aceitacao do destino sancionado; deve continuar alinhado ao boundary interno da Phase 62.
- `src/tests/graph_read_model/boundary_audit.test.ts` — Ja prova hashing e deteccao de mutacao; serve de base para a evolucao da medicao independente do harness.
- `src/tests/graph_read_model/live_artifact_baseline.test.ts` — Prova o baseline vivo do grafo sancionado e a ausencia de acesso a filesystem nas camadas puras de build/validate/query.
- `src/tests/graph_read_model/query_consumer.test.ts` — Reforca que qualquer consumo posterior do `graph.json` deve reentrar por `asValidatedGraph -> createValidatedQueryConsumer`, nao pela CLI.
- `docs/olfactory_graph_read_model.md` — Guia operacional atual da CLI `graph:build`, incluindo `--json`, auditoria de fronteira e fences documentais que a Phase 62 deve preservar sem ampliar.
- `docs/olfactory_graph_contract.md` — Contrato estatico que explicita que `graphify-out/**` esta fora do input/output de producao e que o read model nao abre escopo para runtime ou database.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `runGraphBuildCli` em `src/cli/graph_read_model.ts`: ja concentra a ordem oficial do workflow sancionado e e o ponto natural para extrair o orquestrador interno sem mudar a porta publica.
- `runGuardrails` em `src/cli/graph_read_model.ts`: ja define os quatro guardrails e a ordem operacional; pode ser reusado pela composicao publica enquanto o orquestrador passa a receber um executor injetavel.
- `validateOutputPath` e `writeGraphOutput` em `src/graph_read_model/write_graph.ts`: ja fornecem a politica de output e a escrita atomica necessarias para o branch `forbidden_path`.
- `capturePreDigests` e `compareDigests` em `src/graph_read_model/boundary_audit.ts`: ja oferecem primitivas de hashing reutilizaveis para snapshots de harness em torno de `graphify-out/**`.
- `asValidatedGraph` e `createValidatedQueryConsumer` em `src/graph_read_model/query_consumer.ts`: ja travam a reentrada sancionada de qualquer `graph.json` gerado no sandbox.

### Established Patterns
- O projeto prefere boundaries explicitos com `ok/error` em vez de atalhos implicitos; a rejeicao `forbidden_path` deve seguir esse estilo internamente, enquanto a CLI traduz para comportamento de processo.
- A milestone v2.12 separa surfaces sancionadas de modulos puros; a CLI continua coordenadora de build/validate/write/audit, mas nao vira consumer runtime nem superficie de queries.
- Testes de regressao existentes privilegiam evidencia deterministica, hashing e comparacao estrutural; a medicao de `graphify-out/**` deve seguir esse padrao e ignorar metadados instaveis.

### Integration Points
- O novo `runSanctionedGraphWorkflow(...)` deve se conectar a `loadGraphInputs`, `buildOlfactoryGraph`, `validateSanctionedV211Graph`, `writeGraphOutput`, auditoria de fronteira e execucao de guardrails.
- A composicao publica de `graph:build` deve fixar apenas `outputDir` sancionado no non-dry-run, preservar `--json/--dry-run/--skip-guardrails` e continuar traduzindo resultados internos para `stdout`/`stderr`/exit code.
- O harness da Phase 62 deve provar o caminho sancionado de sucesso e os caminhos de falha (`forbidden_path`, guardrail failure) sem expor nova superficie publica e sem recursao de suite.

</code_context>

<specifics>
## Specific Ideas

- O `GuardrailExecutor` deve permanecer uma dependencia funcional simples com assinatura conceitual `type GuardrailExecutor = (guardrail: GuardrailDefinition) => Promise<GuardrailExecutionResult>`.
- A evidencia substituta do guardrail `test` no harness deve declarar explicitamente que a invocacao recursiva foi evitada, por exemplo com `execution_mode: 'injected_test_evidence'` e `reason: 'recursive test invocation prevented'`.
- O harness pode usar um `DirectorySnapshot` deterministico com `exists`, `files[]` ordenados por `relative_path`, `sha256`, `size_bytes` e `aggregate_sha256`.
- O teste end-to-end da CLI deve confirmar que a composicao publica fixa o destino sancionado e nao expoe override de `outputDir`, enquanto o teste direto do orquestrador cobre o branch de destino proibido.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 62-Sanctioned CLI Boundary Proofs*
*Context gathered: 2026-06-17*
