# Phase 64: Canonical PRD & Boundary Framing - Context

**Gathered:** 2026-06-19
**Status:** Ready for planning
**Source:** User-provided phase scope during `$gsd-plan-phase 64`

<domain>
## Phase Boundary

Canonizar `docs/PRD-tecnico.md` como referência normativa rastreável para este repositório e declarar a relação de precedência e os limites entre o PRD, os artefatos GSD de projeto e os documentos de fase.

A fase deve separar explicitamente:

- o conteúdo normativo aplicável ao TaxonomySystem;
- o contexto futuro do produto Alquem.io;
- as aspirações externas que não autorizam implementação neste repositório.

Esta fase entrega documentação e contrato de governança documental. Ela não implementa banco, runtime, grafo expandido, agente ou mutações curatoriais.

</domain>

<decisions>
## Implementation Decisions

### Canonicalização do PRD

- `docs/PRD-tecnico.md` deve tornar-se uma referência canônica, versionada e rastreável para o milestone v2.13.
- A canonicalização deve declarar status, escopo e relação explícita com as fronteiras Layer 1 já vigentes.
- O PRD não substitui automaticamente contratos implementados, artefatos compilados, decisões de fase ou limites já sancionados.

### Precedência documental

- A fase deve declarar precedência e limites entre `docs/PRD-tecnico.md`, `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md` e documentos de fase.
- Conflitos devem ser resolvidos por regra explícita, não por interpretação implícita.
- Artefatos de fase podem especializar o trabalho de uma fase, mas não devem ampliar o escopo do repositório ou transformar contexto futuro do produto em autorização de implementação.

### Separação entre repositório e produto futuro

- O conteúdo aplicável ao TaxonomySystem deve ser marcado como normativo para este repositório.
- Arquitetura SaaS, agente, tools, PostgreSQL, pgvector, Neo4j e demais superfícies do produto Alquem.io devem ser tratadas como contexto futuro, salvo quando um requisito e uma fase posteriores abrirem apenas um contrato documental específico.
- O milestone v2.13 é documental e contratual; a Phase 64 não abre implementação.

### Escopo proibido

- Não criar schema PostgreSQL, migrations, tabelas ou queries.
- Não criar Neo4j, Cypher, drivers, exportadores ou materialização.
- Não criar tools runtime, agente, API, SaaS ou integrações executáveis.
- Não adicionar node kinds ao graph read model.
- Não mutar `data/taxonomy/**`, `data/compiled/v2/**` ou `graphify-out/**`.
- Não alterar o envelope estável `{ query_kind, params, result, path? }`.

### the agent's Discretion

- Estrutura exata das seções e tabelas de precedência, desde que a leitura seja inequívoca e verificável.
- Escolha de checks documentais leves para provar presença, unicidade e coerência das declarações normativas.
- Distribuição do trabalho em um ou mais planos, mantendo a fase estreita e predominantemente documental.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Estado e escopo do milestone

- `.planning/STATE.md` — posição atual, milestone ativo e próximos passos.
- `.planning/PROJECT.md` — identidade, Layer 1, limites e relação já declarada com o PRD.
- `.planning/REQUIREMENTS.md` — requisitos `PRD-01` e `PRD-02`, além dos não objetivos do v2.13.
- `.planning/ROADMAP.md` — sequência das Phases 64-67 e fronteira temporal do milestone.

### Documento a canonizar

- `docs/PRD-tecnico.md` — PRD técnico Alquem.io atualmente marcado como draft e contendo tanto restrições relevantes quanto contexto de produto futuro.

### Fronteiras técnicas já sancionadas

- `README.md` — arquitetura operacional atual e ausência de API, banco e runtime.
- `docs/olfactory_graph_contract.md` — contrato estático do graph read model.
- `docs/olfactory_graph_read_model.md` — cadeia de confiança e limites de consumo futuro.

</canonical_refs>

<specifics>
## Specific Ideas

- Uma matriz de autoridade/precedência deve permitir ao mantenedor responder qual documento decide produto futuro, escopo do repositório, requisitos do milestone, ordem das fases e decisões locais de execução.
- O texto deve evitar que frases como “Neo4j fará parte do MVP” sejam interpretadas como autorização para introduzir Neo4j nesta fase ou neste repositório.
- A canonicalização deve manter rastreabilidade com `PRD-01` e `PRD-02`.

</specifics>

<deferred>
## Deferred Ideas

- Contrato `TaxonomySystem -> PostgreSQL`: Phase 65.
- Regras de projeção Neo4j: Phase 66.
- Redução consolidada de dívida de consumer-readiness: Phase 67.
- Implementação de bancos, runtime, tools e agente: milestones futuros explícitos.

</deferred>

---

*Phase: 64-canonical-prd-boundary-framing*
*Context gathered: 2026-06-19 from user-provided planning scope*
