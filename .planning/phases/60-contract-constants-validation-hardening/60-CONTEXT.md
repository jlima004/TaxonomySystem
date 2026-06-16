# Phase 60: Contract Constants & Validation Hardening - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Centralizar constantes e contratos compartilhados do graph read model, eliminar reconstrucoes locais de IDs e codigos de erro, e separar validacao estrutural da validacao strict/profile-aware para que o artefato sancionado v2.11 continue protegido por um fluxo deterministicamente fail-closed sem congelar futuras versoes do read model.

</domain>

<decisions>
## Implementation Decisions

### Graph ID Boundary
- **D-01:** `contract.ts` continua como fonte normativa dos prefixes autoritativos, mas a superficie oficial de IDs deve ser exposta por um modulo central como `graph_id.ts` consumindo exclusivamente essas constantes.
- **D-02:** A API oficial de IDs deve incluir `makeFamilyGraphId`, `makeSubfamilyGraphId`, `makeDescriptorGraphId`, `makeAliasGraphId`, `stripGraphIdPrefix`, `isFamilyGraphId`, `isSubfamilyGraphId`, `isDescriptorGraphId`, `isAliasGraphId` e `parseGraphId`.
- **D-03:** `parseGraphId` deve retornar uma uniao discriminada deterministica, sem throws genericos, com erro JSON-safe tipado para prefixo desconhecido, raw ID vazio e formatos ambiguos.
- **D-04:** Builder, validator e query modules nao devem mais montar IDs com templates locais nem remover prefixes com regex ou `replace`; type guards e parser devem reutilizar a mesma implementacao central.

### Validation Error Contract
- **D-05:** O contrato deve oficializar o vocabulario completo de erros observaveis da validacao, incluindo `invalid_schema_version`, `inconsistent_stats`, duplicate IDs, missing endpoints, wrong endpoint kinds, invalid alias targets e invalid similarity endpoints.
- **D-06:** O modelo de erro sera hibrido: `code` identifica a categoria estavel e consumivel; `invariant_id` identifica a regra contratual especifica quando houver mapeamento normativo explicito.
- **D-07:** Os codigos atuais devem ser preservados sempre que possivel para evitar quebra de testes, snapshots, CLI e consumidores; novos codigos so podem nascer do vocabulario autoritativo exportado pelo contrato.
- **D-08:** O contrato deve exportar `GRAPH_VALIDATION_ERROR_CODES`, `GRAPH_INVARIANT_IDS`, os union types derivados e uma associacao opcional e estavel entre codigos e invariantes.

### Validation Surfaces And Profiles
- **D-09:** A superficie oficial de validacao deve separar tres responsabilidades: `validateOlfactoryGraphStructure(graph)`, `validateOlfactoryGraphAgainstProfile(graph, profile)` e `validateSanctionedV211Graph(graph)`.
- **D-10:** `validateOlfactoryGraphStructure(graph)` valida apenas regras independentes de publicacao ou baseline especifico: schema, IDs, kinds, endpoints, relacoes permitidas, aliases validos, propriedades obrigatorias e consistencia interna de stats calculaveis a partir do proprio grafo.
- **D-11:** `validateOlfactoryGraphAgainstProfile(graph, profile)` deve executar a validacao estrutural primeiro e interromper a validacao de profile quando a estrutura impedir comparacao confiavel; profiles sao objetos tipados, imutaveis e extensveis.
- **D-12:** `validateSanctionedV211Graph(graph)` e o entrypoint oficial para o artefato sancionado atual e deve usar um profile autoritativo exportado pelo contrato, como `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`, incluindo no minimo schema/contract version, `profile_id` estavel e baseline `10/18/341/18/13`.
- **D-13:** CLI, live regression e o consumer-facing query boundary da Phase 61 devem chamar o wrapper sancionado, nao selecionar manualmente profiles nem usar flags implicitas como `strict: true`.

### Structured Error Payloads
- **D-14:** O shape base de erro deve permanecer estavel e compatvel com CLI, snapshots e futuros consumidores: `{ code, path, message, invariant_id?, node_id?, edge_id?, expected?, actual? }`.
- **D-15:** `expected` e `actual` devem usar um tipo explicito `JsonValue`; `unknown`, `Date`, `Map`, `Set`, `BigInt`, stack traces, funcoes, classes, `undefined` e metadata variavel sao proibidos.
- **D-16:** Erros criticos devem ser produzidos por factories funcionais tipadas e centralizadas, incluindo pelo menos schema version, graph ID invalido, node/edge duplicado, endpoint ausente, kind incompativel, stats internos inconsistentes, divergencia de profile/baseline e `graph_not_validated`.
- **D-17:** As factories devem fixar `code`, preencher `invariant_id` quando houver associacao normativa, normalizar `path`, produzir mensagens estaveis e preencher `expected`/`actual` com shapes previsiveis e JSON-safe.

### the agent's Discretion
Nenhuma area relevante foi delegada para decisao livre do agente. As fronteiras que a Phase 61 precisa consumir ficaram explicitamente travadas nesta discussao.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope And Requirements
- `.planning/ROADMAP.md` — Define a Phase 60 como `Contract Constants & Validation Hardening`, com objetivo, requisitos e criterios de sucesso para centralizacao de constantes e validacao deterministica.
- `.planning/REQUIREMENTS.md` — Define `GCON-05`, `GCON-06` e `GVAL-06`, alem das fronteiras do milestone v2.12 e a rastreabilidade por fase.
- `.planning/PROJECT.md` — Define os limites do milestone v2.12, o estado atual do read model e a regra de manter a trilha zero-dependency, read-only e fora de runtime/database scope.
- `.planning/STATE.md` — Registra que a Phase 60 e o foco atual do milestone e carrega decisoes recentes relevantes de v2.11.

### Accepted v2.11 Debt Driving Phase 60
- `.planning/milestones/v2.11-MILESTONE-AUDIT.md` — Lista `W-02`, `W-04`, `W-05` e `W-06`, que justificam centralizacao de constantes, baseline-aware validation e prep do boundary para consumo fail-closed.
- `.planning/milestones/v2.11-ROADMAP.md` — Resume as decisoes fechadas nas fases 55-59 e o desenho original do graph contract, builder, validator, query proofs e CLI boundary.

### Graph Read Model Contract And Runtime Surface
- `src/graph_read_model/contract.ts` — Fonte normativa atual de schema version, ID prefixes, invariantes, output policy e baseline stats; permanece como autoridade para Phase 60.
- `src/graph_read_model/types.ts` — Define `OlfactoryGraph`, `GraphValidationResult`, `GraphQueryProof` e o shape atual de erros, que sera enriquecido mas preservado.
- `src/graph_read_model/build_graph.ts` — Mostra os templates locais de graph IDs que precisam ser substituidos pela surface oficial de `graph_id`.
- `src/graph_read_model/validate_graph.ts` — Mostra os codigos de erro atuais observaveis, reconciliacao interna de stats e o ponto onde a validacao estrutural/profile-aware deve ser separada.
- `src/graph_read_model/query_graph.ts` — Mostra parsing/strip local de IDs e a superficie que a Phase 61 precisara tornar fail-closed com o mesmo boundary oficial.
- `src/cli/graph_read_model.ts` — Define o caminho sancionado do workflow `graph:build`; deve passar a usar o wrapper sancionado de validacao/profile.

### Existing Operational Documentation
- `docs/olfactory_graph_read_model.md` — Guia operacional atual do read model v2.11, incluindo o caminho sancionado, baseline e provas do fluxo; precisa continuar alinhado ao contrato e ao wrapper sancionado.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/graph_read_model/contract.ts`: ja concentra schema, prefixes, baseline stats e invariantes; e a base natural para exportar codigos de erro, invariant IDs e profiles sancionados.
- `src/graph_read_model/types.ts`: ja oferece o shape central de `GraphValidationResult` e `GraphQueryProof`; deve ser estendido sem quebrar consumidores.
- `src/cli/graph_read_model.ts`: ja concentra o fluxo sancionado `graph:build`; e o ponto natural para consumir `validateSanctionedV211Graph(graph)`.

### Established Patterns
- Arquitetura funcional pura, TypeScript strict, ESM e zero dependencies devem ser preservados; nenhuma decisao desta fase abre espaco para classes, services ou runtime state.
- O projeto prefere contratos estaticos exportados por modulos e testes deterministas, o que favorece helpers/factories centrais em vez de strings e regex espalhadas.
- O proof envelope de sucesso em `query_graph.ts` deve permanecer estavel; erros de consumo fail-closed entram como boundary de validacao, nao como mudanca oportunista no envelope de sucesso.

### Integration Points
- `build_graph.ts`, `validate_graph.ts` e `query_graph.ts` precisam importar a mesma superficie oficial de IDs e o mesmo vocabulario de erros.
- A separacao entre validacao estrutural e validacao por profile afeta diretamente CLI, testes live regression e o futuro consumer-facing query path da Phase 61.
- A documentacao operacional e os testes de regressao devem refletir explicitamente o wrapper sancionado e o profile autoritativo, nao configuracoes locais.

</code_context>

<specifics>
## Specific Ideas

- Phase 61 deve reutilizar a mesma surface oficial de `graph_id` como boundary unica para validar IDs recebidos e operar em modo fail-closed.
- O erro `graph_not_validated` deve ser distinguivel de um grafo estruturalmente invalido sem alterar o proof envelope de sucesso das query proofs.
- Profiles futuros, como um eventual wrapper sancionado de v2.12, devem poder nascer por adicao de profile/wrapper, nao por reescrita da validacao estrutural.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 60-Contract Constants & Validation Hardening*
*Context gathered: 2026-06-16*
