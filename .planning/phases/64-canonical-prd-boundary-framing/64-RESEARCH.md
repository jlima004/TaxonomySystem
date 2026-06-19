# Phase 64: Canonical PRD & Boundary Framing - Research

**Researched:** 2026-06-19  
**Domain:** Governança documental, canonicalização de PRD e fronteiras de autoridade  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Deferred Ideas (OUT OF SCOPE)

- Contrato `TaxonomySystem -> PostgreSQL`: Phase 65.
- Regras de projeção Neo4j: Phase 66.
- Redução consolidada de dívida de consumer-readiness: Phase 67.
- Implementação de bancos, runtime, tools e agente: milestones futuros explícitos.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PRD-01 | Maintainer can identify one canonical, versioned Alquem.io technical PRD reference for this repository, with explicit status, scope note, and relation to existing Layer 1 boundaries. | Recomenda-se promover `docs/PRD-tecnico.md` de versão `0.2`/`Draft técnico` para versão `0.3` com status canônico delimitado, data, milestone, rastreabilidade e nota explícita de aplicação à Layer 1. [VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`; `64-CONTEXT.md`] |
| PRD-02 | Maintainer can inspect how the canonical PRD constrains TaxonomySystem planning artifacts, including what parts are normative for this repository and what remains external/future-system context. | Recomenda-se uma matriz de autoridade por pergunta, uma regra de conflito e uma matriz de classificação do conteúdo do PRD, distinguindo norma atual do repositório, restrição de planejamento e contexto futuro sem autorização de implementação. [VERIFIED: `.planning/PROJECT.md`; `.planning/REQUIREMENTS.md`; `.planning/ROADMAP.md`; `64-CONTEXT.md`; `docs/PRD-tecnico.md`] |
</phase_requirements>

## Summary

A Phase 64 deve ser planejada como uma alteração documental concentrada em `docs/PRD-tecnico.md`. O documento atual tem 2.875 linhas, identifica-se como versão `0.2` e `Draft técnico`, e mistura princípios compatíveis com o TaxonomySystem, afirmações sobre o papel versionado da taxonomia e um desenho futuro completo de SaaS, agente, API, PostgreSQL, pgvector e Neo4j. Sem uma moldura de autoridade, frases como “Neo4j fará parte do MVP” podem ser lidas incorretamente como autorização de implementação neste repositório. [VERIFIED: `docs/PRD-tecnico.md`; `64-CONTEXT.md`]

A solução mais segura é preservar o corpo do PRD como visão técnica da Alquem.io e inserir, no topo, uma seção canônica de governança. Essa seção deve atualizar os metadados do documento, declarar sua relação limitada com a Layer 1, classificar blocos do conteúdo, definir qual artefato decide cada tipo de pergunta e explicar como conflitos são resolvidos. Uma reescrita integral ou marcação linha a linha do PRD ampliaria muito o risco editorial sem melhorar PRD-01 ou PRD-02. [VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`; analogia com `.planning/phases/63-consumer-readiness-documentation/63-RESEARCH.md`]

**Primary recommendation:** Planejar uma única onda documental que altere somente `docs/PRD-tecnico.md`: versão `0.3`, status canônico delimitado, seção `0` de governança, matriz de autoridade, algoritmo de conflito, classificação repo/futuro e fences explícitas de não implementação. [VERIFIED: `64-CONTEXT.md`; `.planning/REQUIREMENTS.md`; padrão da Phase 63]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Visão e arquitetura futura da Alquem.io | PRD de produto | — | O PRD descreve o produto futuro, seu MVP e suas superfícies planejadas; isso não equivale ao estado implementado do TaxonomySystem. [VERIFIED: `docs/PRD-tecnico.md`] |
| Identidade e limites permanentes do repositório | `.planning/PROJECT.md` | `AGENTS.md`, README e contratos técnicos | `PROJECT.md` fixa Layer 1, escopo do projeto e decisões duráveis; instruções do repositório reforçam ausência atual de runtime, API e banco. [VERIFIED: `.planning/PROJECT.md`; `AGENTS.md`; `README.md`] |
| Obrigações e exclusões do milestone v2.13 | `.planning/REQUIREMENTS.md` | `.planning/PROJECT.md` | PRD-01/02 e os não objetivos do milestone são definidos em requisitos rastreáveis. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| Ordem temporal e alocação por fase | `.planning/ROADMAP.md` | `.planning/REQUIREMENTS.md` | O roadmap atribui PRD à Phase 64, bridge PostgreSQL à 65, projeção Neo4j à 66 e dívida documental à 67. [VERIFIED: `.planning/ROADMAP.md`] |
| Decisões locais de execução | `NN-CONTEXT.md` | `NN-RESEARCH.md`, `NN-PLAN.md` | Contexto de fase especializa requisitos já abertos; pesquisa e plano operacionalizam sem ampliar o escopo. [VERIFIED: `64-CONTEXT.md`; padrão da Phase 63] |
| Posição atual do workflow | `.planning/STATE.md` | `.planning/ROADMAP.md` | `STATE.md` registra o milestone ativo, decisões herdadas, bloqueios e próximo passo; não redefine escopo técnico por si só. [VERIFIED: `.planning/STATE.md`] |
| Verdade implementada | Código, testes, artefatos oficiais e contratos técnicos | Documentação operacional | O PRD não substitui comportamento executável, artefatos compilados nem o contrato/read model já sancionado. [VERIFIED: `64-CONTEXT.md`; `AGENTS.md`; `docs/olfactory_graph_contract.md`; `docs/olfactory_graph_read_model.md`] |

## Project Constraints (from AGENTS.md)

- Responder e escrever artefatos em Português do Brasil. [VERIFIED: `AGENTS.md`]
- Tratar `.planning/STATE.md` como posição atual autoritativa quando snapshots em outros documentos estiverem defasados. O `AGENTS.md` ainda menciona ausência de milestone, mas `STATE.md`, `PROJECT.md`, `REQUIREMENTS.md` e `ROADMAP.md` registram v2.13 ativo em 19 de junho de 2026. [VERIFIED: `AGENTS.md`; `.planning/STATE.md`; `.planning/PROJECT.md`; `.planning/ROADMAP.md`]
- Manter o TaxonomySystem como Layer 1 sem abrir API, SaaS, HTTP, agente, banco externo, Neo4j ou dependências pesadas fora de milestone explícito. [VERIFIED: `AGENTS.md`; `.planning/PROJECT.md`]
- Não adicionar dependências runtime ao Taxonomy Builder sem decisão GSD explícita. Esta fase não precisa instalar pacote algum. [VERIFIED: `AGENTS.md`; `64-CONTEXT.md`]
- Não mutar casualmente `data/taxonomy/`, `data/inference/`, `data/compiled/v1/`, `data/compiled/v2/`, `data/read-models/olfactory-graph/v2.11/`, `src/cli/parse_args.ts` ou `graphify-out/`. [VERIFIED: `AGENTS.md`]
- `graphify-out/**` é somente contexto de navegação e não pode ser staged como trabalho do projeto. A árvore já contém alterações locais nesse diretório; o plano deve validar escopo por arquivos autorizados, sem exigir árvore global limpa. [VERIFIED: `AGENTS.md`; `git status --short` executado em 2026-06-19]
- Os artefatos compilados v2 são a verdade operacional da Layer 1; o graph read model é derivado e somente leitura. [VERIFIED: `AGENTS.md`; `README.md`; `docs/olfactory_graph_contract.md`]
- O graph read model mantém apenas `family`, `subfamily`, `descriptor`, `alias` e o envelope `{ query_kind, params, result, path? }`; esta fase não altera esses contratos. [VERIFIED: `AGENTS.md`; `docs/olfactory_graph_contract.md`; `docs/olfactory_graph_read_model.md`; `64-CONTEXT.md`]
- Mudanças documentais devem ser verificadas contra código, testes, estado e requisitos atuais, sem mudar contratos para acomodar a prosa. [VERIFIED: `AGENTS.md`; padrão da Phase 63]

## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| Markdown | formato existente | Canonicalizar metadados, regras e matrizes no próprio PRD | O entregável é documental e o arquivo alvo já é Markdown versionado no Git. [VERIFIED: `docs/PRD-tecnico.md`; `64-CONTEXT.md`] |
| Git | `2.54.0` | Rastreabilidade, diff e confirmação de escopo | O requisito pede referência versionada; o repositório já versiona o PRD e os artefatos GSD. [VERIFIED: comando `git --version`; `.planning/REQUIREMENTS.md`] |
| Node.js | `v24.14.0` | Checks leves de presença, unicidade, ordem e coerência textual | É o runtime local/CI já usado pelo projeto e permite checks sem nova dependência. [VERIFIED: comando `node --version`; `src/package.json`; padrão `63-VALIDATION.md`] |
| ripgrep | disponível | Busca editorial e auditoria de termos de risco | Já é usado em validações documentais locais e permite inspecionar fences sem criar framework novo. [VERIFIED: comandos `rg` executados; `.planning/phases/63-consumer-readiness-documentation/63-VALIDATION.md`] |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `git diff --check` | Detectar whitespace inválido e erros mecânicos do patch | Em cada task commit e no gate final. [VERIFIED: fluxo Git local] |
| `npm --prefix src run typecheck` | Smoke check do checkout sem emitir artefatos | No gate final, como prova de que a fase documental não degradou o pacote principal. [VERIFIED: `src/package.json`; `AGENTS.md`] |
| `node -e` | Verificar metadados, headings, linhas da matriz e fences exatas | Após cada tarefa documental, com checks limitados à seção canônica adicionada. [VERIFIED: padrão `63-VALIDATION.md`] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Seção canônica no topo e corpo preservado | Reescrever as 38 seções do PRD | A reescrita integral aumenta churn e risco de alterar visão de produto sem necessidade para PRD-01/02. [VERIFIED: `docs/PRD-tecnico.md`; `64-CONTEXT.md`] |
| Matriz de autoridade por pergunta | Uma hierarquia linear única | Uma fila linear confunde documentos que decidem domínios diferentes; por exemplo, ROADMAP decide sequência, não escopo do produto. [VERIFIED: `.planning/PROJECT.md`; `.planning/REQUIREMENTS.md`; `.planning/ROADMAP.md`; `64-CONTEXT.md`] |
| Checks locais de Markdown | Novo framework de teste documental | Não há package ou infraestrutura adicional necessária para provar presença, unicidade e coerência. [VERIFIED: `64-CONTEXT.md`; padrão `63-VALIDATION.md`] |

**Installation:** nenhuma instalação. [VERIFIED: `64-CONTEXT.md`; `src/package.json`]

## Architecture Patterns

### System Architecture Diagram

```text
PRD Alquem.io (visão futura de produto)
        |
        | somente quando o conteúdo é explicitamente classificado
        v
PROJECT.md (identidade e limites permanentes do repositório)
        |
        v
REQUIREMENTS.md (obrigações e não objetivos do milestone)
        |
        v
ROADMAP.md (sequência e fase responsável)
        |
        v
NN-CONTEXT.md (decisões locais travadas)
        |
        v
NN-RESEARCH.md -> NN-PLAN.md -> alteração autorizada

STATE.md -----------------> informa posição atual e decisões herdadas
Código/testes/artefatos --> definem a verdade já implementada

Ao ler uma afirmação do PRD:
  ├─ explicitamente normativa para o TaxonomySystem?
  │    └─ sim -> deve respeitar PROJECT + REQUIREMENTS + contratos existentes
  └─ não -> contexto futuro; não autoriza implementação
```

O diagrama deve aparecer conceitualmente na nova seção de governança, em texto ou tabela equivalente. [VERIFIED: `64-CONTEXT.md`; `.planning/REQUIREMENTS.md`]

### Recommended Project Structure

```text
docs/
└── PRD-tecnico.md      # único alvo de implementação da Phase 64

.planning/
├── PROJECT.md          # referência de escopo; não editar nesta fase
├── REQUIREMENTS.md     # requisitos do milestone; não editar nesta fase
├── ROADMAP.md          # sequência; não editar nesta fase
├── STATE.md            # posição atual; não editar nesta fase
└── phases/64-.../      # contexto, pesquisa, validação, plano e resumo
```

[VERIFIED: `64-CONTEXT.md`; `.planning/ROADMAP.md`; padrão da Phase 63]

### Component Responsibilities

| Componente documental | Responsabilidade recomendada na Phase 64 |
|-----------------------|-------------------------------------------|
| Metadados do PRD | Mudar `0.2` para `0.3`; substituir `Draft técnico` por status canônico delimitado; adicionar data, milestone e IDs `PRD-01`/`PRD-02`. [VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`] |
| Nova seção `# 0. Status canônico, aplicação e precedência` | Concentrar governança antes da visão de produto, sem renumerar ou reescrever as 38 seções existentes. [VERIFIED: `docs/PRD-tecnico.md`; analogia de fences da Phase 63] |
| Matriz de autoridade | Responder qual documento decide visão futura, escopo do repo, requisitos, sequência, estado, decisões locais e verdade implementada. [VERIFIED: `64-CONTEXT.md`] |
| Matriz de classificação do PRD | Separar “normativo para este repositório”, “restrição de planejamento sem implementação” e “contexto futuro do produto”. [VERIFIED: `.planning/REQUIREMENTS.md`; `64-CONTEXT.md`] |
| Regra de conflito | Impedir que PRD, roadmap ou documento de fase ampliem silenciosamente o escopo autorizado. [VERIFIED: `64-CONTEXT.md`] |
| Fences locais | Marcar expressamente PostgreSQL, pgvector, Neo4j, tools, agente, API e SaaS como não implementados/não autorizados pela canonicalização. [VERIFIED: `.planning/REQUIREMENTS.md`; `docs/PRD-tecnico.md`] |

### Pattern 1: Canonicalidade Delimitada

**What:** O documento é canônico para visão de produto e para as restrições explicitamente mapeadas ao TaxonomySystem; não é uma especificação executável automática para este repositório. [VERIFIED: `64-CONTEXT.md`; `.planning/PROJECT.md`]  
**When to use:** Na linha de status e na abertura da seção `0`.  
**Example:**

```markdown
**Versão do documento:** 0.3
**Status:** Canônico para governança documental; aplicação ao TaxonomySystem delimitada
**Canonizado em:** 2026-06-19
**Milestone de adoção:** v2.13 PRD Canonicalization & Core Data Bridge
**Rastreabilidade:** PRD-01, PRD-02
```

[VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`; `64-CONTEXT.md`]

### Pattern 2: Autoridade por Pergunta

**What:** Em vez de declarar que um arquivo sempre “vence”, atribuir autoridade pelo tipo de decisão. [VERIFIED: cross-reading dos artefatos GSD]  
**When to use:** Na matriz de precedência.

| Pergunta | Autoridade primária | Limite |
|----------|---------------------|--------|
| Qual é a visão futura da Alquem.io? | `docs/PRD-tecnico.md` | Não prova implementação atual nem abre trabalho no TaxonomySystem. |
| O que este repositório é e não é? | `.planning/PROJECT.md` | Deve manter alinhamento com o PRD sem importar automaticamente todo o produto futuro. |
| O que o milestone atual deve entregar ou excluir? | `.planning/REQUIREMENTS.md` | Cada obrigação precisa de requirement explícito. |
| Em que ordem e em qual fase? | `.planning/ROADMAP.md` | Sequência não cria requisito nem autorização técnica. |
| Qual é a posição atual? | `.planning/STATE.md` | Estado não amplia escopo. |
| Como uma fase executa seu requisito? | `NN-CONTEXT.md` e `NN-PLAN.md` | Pode especializar, nunca ampliar PROJECT/REQUIREMENTS. |
| O que já funciona de fato? | Código, testes, artefatos e contratos técnicos | Prosa aspiracional não substitui verdade implementada. |

[VERIFIED: `.planning/PROJECT.md`; `.planning/REQUIREMENTS.md`; `.planning/ROADMAP.md`; `.planning/STATE.md`; `64-CONTEXT.md`; `AGENTS.md`]

### Pattern 3: Regra de Conflito Fail-Closed

**What:** Uma afirmação de futuro só entra no trabalho do TaxonomySystem quando for traduzida para requirement e fase explícitos, respeitando PROJECT e contratos existentes. [VERIFIED: `.planning/REQUIREMENTS.md`; `64-CONTEXT.md`]  
**When to use:** Imediatamente após a matriz de autoridade.

Regra prescritiva:

1. Se a afirmação descreve estado atual, conferir código, testes, artefatos e contratos técnicos. [VERIFIED: `AGENTS.md`; `docs/olfactory_graph_contract.md`]
2. Se descreve limite do repositório, aplicar `PROJECT.md` e requisitos/não objetivos ativos. [VERIFIED: `.planning/PROJECT.md`; `.planning/REQUIREMENTS.md`]
3. Se descreve produto futuro, tratá-la como contexto até existir requirement e fase explícitos. [VERIFIED: `64-CONTEXT.md`]
4. Se um documento de fase conflita com PROJECT ou REQUIREMENTS, a ampliação é inválida e deve ser discutida em novo milestone/requisito. [VERIFIED: `64-CONTEXT.md`; `AGENTS.md`]
5. Em dúvida, não implementar: registrar a divergência e manter a fronteira atual. [VERIFIED: filosofia fail-closed herdada e fences do milestone]

### Pattern 4: Classificação em Três Classes

| Classe | Conteúdo do PRD | Efeito no TaxonomySystem |
|--------|-----------------|--------------------------|
| **Normativo para este repositório** | Papel do TaxonomySystem como fonte versionada de famílias, subfamílias, descritores, aliases, similaridades e decisões curatoriais; artefatos compilados; proibição de escrita direta do compile no Neo4j; ADR-009. [VERIFIED: `docs/PRD-tecnico.md` seções 10 e 36; `AGENTS.md`] | Deve permanecer coerente com PROJECT, artefatos oficiais e contratos existentes. |
| **Restrição de planejamento, sem autorização de implementação** | IDs de domínio compartilhados, separação de ownership, curadoria e proveniência, quando traduzidos pelos requisitos PGBR/N4J do v2.13. [VERIFIED: `docs/PRD-tecnico.md` seções 3.4-3.6; `.planning/REQUIREMENTS.md`] | Informa contratos documentais das Phases 65/66; não cria schema, driver, persistência ou runtime. |
| **Contexto futuro do produto** | SaaS, frontend, auth, API, agente, tools, RAGgraph, PostgreSQL, pgvector, Neo4j operacional, Cypher, sync, endpoints, infra, observabilidade e roadmap T1-T8. [VERIFIED: `docs/PRD-tecnico.md` seções 1-9 e 11-38; `.planning/REQUIREMENTS.md`] | Não autoriza implementação nesta fase, neste milestone ou neste repositório sem requirement futuro explícito. |

### Anti-Patterns to Avoid

- **“PRD canônico” como autoridade universal:** canonicalidade de produto não substitui escopo do repositório, requisitos ativos nem contratos implementados. [VERIFIED: `64-CONTEXT.md`]
- **Hierarquia linear sem domínio:** dizer apenas “PRD > PROJECT > REQUIREMENTS” cria contradições, porque cada documento responde perguntas diferentes. [VERIFIED: cross-reading dos artefatos]
- **Canonizar por reescrita total:** alterar centenas de parágrafos de produto torna a fase ampla e dificulta provar que nenhuma intenção futura foi transformada. [VERIFIED: `docs/PRD-tecnico.md`; `64-CONTEXT.md`]
- **Promessa futura escrita no presente:** frases sobre banco, agente, Neo4j ou API não podem ser resumidas como capacidade do TaxonomySystem atual. [VERIFIED: `docs/PRD-tecnico.md`; `README.md`; `.planning/REQUIREMENTS.md`]
- **Documento de fase ampliando milestone:** CONTEXT/PLAN podem detalhar PRD-01/02, mas não podem antecipar PGBR, N4J ou implementação futura. [VERIFIED: `.planning/ROADMAP.md`; `64-CONTEXT.md`]
- **Atualizar README por oportunismo:** o README está defasado quanto ao milestone ativo, mas a Phase 64 tem alvo estreito; registrar a divergência para alinhamento posterior, sem ampliar este plano. [VERIFIED: `README.md`; `.planning/STATE.md`; `64-CONTEXT.md`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Fonte de visão de produto | Novo documento-resumo paralelo | `docs/PRD-tecnico.md` canônico | PRD-01 pede uma referência única, versionada e rastreável. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| Escopo do projeto | Nova taxonomia de autoridade fora do GSD | `PROJECT.md` + `REQUIREMENTS.md` | Esses artefatos já separam identidade durável de obrigações do milestone. [VERIFIED: `.planning/PROJECT.md`; `.planning/REQUIREMENTS.md`] |
| Sequência de entrega | Roadmap embutido no PRD como executor | `.planning/ROADMAP.md` | O roadmap do produto no PRD é futuro; o roadmap GSD decide as fases reais deste repositório. [VERIFIED: `docs/PRD-tecnico.md`; `.planning/ROADMAP.md`] |
| Prova de conteúdo | Parser Markdown ou dependência nova | `node -e`, `rg`, `git diff --check` | Os checks necessários são presença, unicidade e coerência de texto. [VERIFIED: `64-CONTEXT.md`; padrão `63-VALIDATION.md`] |
| Contrato PostgreSQL/Neo4j | Schema, Cypher ou exportador na Phase 64 | Phases 65 e 66, somente documentais | A roadmap separa canonicalização, bridge e projeção; implementação está excluída. [VERIFIED: `.planning/ROADMAP.md`; `.planning/REQUIREMENTS.md`] |

**Key insight:** o principal risco não é técnico, mas semântico: uma frase aspiracional pode adquirir aparência de autorização normativa. A seção canônica deve tornar impossível essa leitura sem criar uma segunda fonte de verdade. [VERIFIED: `64-CONTEXT.md`; `docs/PRD-tecnico.md`]

## Common Pitfalls

### Pitfall 1: Confundir Canonicalidade com Executoriedade

**What goes wrong:** O PRD passa a ser citado como razão suficiente para instalar Neo4j, criar tabelas ou implementar agente. [VERIFIED: `docs/PRD-tecnico.md`; `64-CONTEXT.md`]  
**Why it happens:** O documento usa linguagem imperativa de MVP e ADRs futuros, inclusive “Neo4j fará parte obrigatória do MVP”. [VERIFIED: `docs/PRD-tecnico.md` seções 2 e 36]  
**How to avoid:** Declarar que execução requer tradução explícita em REQUIREMENTS e ROADMAP, dentro de PROJECT. [VERIFIED: `.planning/REQUIREMENTS.md`; `.planning/ROADMAP.md`]  
**Warning signs:** Plano citando apenas uma seção do PRD, sem requirement ID e sem fase responsável.

### Pitfall 2: Criar uma Precedência Total Incorreta

**What goes wrong:** Um documento “vence” até em assuntos que não governa; ROADMAP poderia parecer alterar escopo, ou PRD poderia parecer descrever implementação atual. [VERIFIED: cross-reading dos artefatos]  
**Why it happens:** “Precedência” é tratada como ranking único, e não como autoridade por tipo de decisão.  
**How to avoid:** Usar matriz por pergunta e algoritmo de conflito.  
**Warning signs:** Fórmulas como `PRD > PROJECT > REQUIREMENTS > ROADMAP` sem coluna de responsabilidade.

### Pitfall 3: Duplicar Verdade Normativa

**What goes wrong:** A nova seção copia contratos inteiros de PROJECT, REQUIREMENTS ou graph docs e começa a divergir. [VERIFIED: `.planning/PROJECT.md`; `docs/olfactory_graph_contract.md`]  
**Why it happens:** Tentativa de tornar o PRD “autossuficiente”.  
**How to avoid:** Resumir a regra e linkar os arquivos canônicos; não duplicar schemas, node kinds ou envelope.  
**Warning signs:** Tabelas completas de graph schema ou listas extensas de requisitos reproduzidas no PRD.

### Pitfall 4: Classificação Vaga do Corpo Futuro

**What goes wrong:** Um aviso genérico no topo não esclarece se PostgreSQL, Neo4j, tools e agente são norma atual ou visão futura. [VERIFIED: `docs/PRD-tecnico.md`; PRD-02]  
**Why it happens:** A fase cumpre “scope note” sem uma matriz verificável.  
**How to avoid:** Nomear as três classes e listar explicitamente as superfícies futuras.  
**Warning signs:** Ausência das expressões `normativo para este repositório`, `restrição de planejamento` e `contexto futuro do produto`.

### Pitfall 5: Check Global Frágil

**What goes wrong:** Um check procura “Neo4j” ou “PostgreSQL” no documento inteiro e falha, embora esses termos devam continuar no contexto futuro. [VERIFIED: `docs/PRD-tecnico.md`; padrão aprendido na Phase 63]  
**Why it happens:** A validação ignora limites de seção.  
**How to avoid:** Recortar a seção `0` por headings e validar nela as classificações/fences; no corpo, revisar termos como contexto, não proibi-los. [VERIFIED: `.planning/phases/63-consumer-readiness-documentation/63-VALIDATION.md`]

### Pitfall 6: Validar Árvore Limpa em Checkout Já Sujo

**What goes wrong:** O plano falha por alterações preexistentes em `graphify-out/**` ou por arquivo não relacionado, sem que a Phase 64 os tenha tocado. [VERIFIED: `git status --short` executado em 2026-06-19]  
**Why it happens:** O gate usa `git status --porcelain` global.  
**How to avoid:** Validar diff e commit por caminhos autorizados; nunca stagear nem restaurar alterações alheias. [VERIFIED: `AGENTS.md`]

## Code Examples

Verified patterns from local project sources:

### Metadados canônicos

```markdown
**Produto:** Alquem.io
**Versão do documento:** 0.3
**Status:** Canônico para governança documental; aplicação ao TaxonomySystem delimitada
**Canonizado em:** 2026-06-19
**Milestone de adoção:** v2.13 PRD Canonicalization & Core Data Bridge
**Rastreabilidade:** PRD-01, PRD-02
```

[VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`; `64-CONTEXT.md`]

### Fence de não implementação

```markdown
> A canonicalização deste PRD não autoriza implementação de PostgreSQL,
> pgvector, Neo4j, Cypher, exporters, runtime tools, agente, API ou SaaS
> neste repositório. Essas superfícies permanecem contexto futuro até que
> requisitos e fases explícitos abram o trabalho correspondente.
```

[VERIFIED: `.planning/REQUIREMENTS.md`; `64-CONTEXT.md`]

### Check de metadados e unicidade

```bash
node -e "const fs=require('node:fs'); const t=fs.readFileSync('docs/PRD-tecnico.md','utf8'); const required=['**Versão do documento:** 0.3','**Rastreabilidade:** PRD-01, PRD-02','# 0. Status canônico, aplicação e precedência']; for (const x of required) if ((t.split(x).length-1)!==1) throw new Error('count inválido: '+x)"
```

[VERIFIED: padrão local de checks em `.planning/phases/63-consumer-readiness-documentation/63-VALIDATION.md`]

### Check limitado à seção canônica

```bash
node -e "const fs=require('node:fs'); const t=fs.readFileSync('docs/PRD-tecnico.md','utf8'); const a=t.indexOf('# 0. Status canônico, aplicação e precedência'); const b=t.indexOf('# 1. Visão do produto'); if(a<0||b<=a) throw new Error('limites ausentes'); const s=t.slice(a,b); for(const x of ['docs/PRD-tecnico.md','.planning/PROJECT.md','.planning/REQUIREMENTS.md','.planning/ROADMAP.md','.planning/STATE.md','contexto futuro do produto','não autoriza implementação']) if(!s.includes(x)) throw new Error('ausente: '+x)"
```

[VERIFIED: padrão local de checks em `.planning/phases/63-consumer-readiness-documentation/63-VALIDATION.md`]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PRD `0.2` isolado e marcado como draft | PRD `0.3` canônico com aplicação delimitada e rastreabilidade | Phase 64 / v2.13 | PRD-01 passa a ser verificável sem transformar o corpo futuro em implementação. [VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`] |
| Relação genérica “PROJECT deve alinhar-se ao PRD” | Autoridade por pergunta + regra de conflito | Phase 64 / v2.13 | PRD-02 deixa claro como PRD, GSD e verdade implementada se relacionam. [VERIFIED: `.planning/PROJECT.md`; `64-CONTEXT.md`] |
| Afirmações de produto misturadas a limites do repo | Classificação em norma do repo, restrição de planejamento e contexto futuro | Phase 64 / v2.13 | Banco, agente e Neo4j deixam de parecer trabalho autorizado. [VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`] |
| Consumer readiness documentado sem governança do PRD | Fences da Phase 63 herdadas como contratos já sancionados | v2.12 -> v2.13 | Phase 64 não pode alterar node kinds, trust chain ou proof envelope. [VERIFIED: `docs/olfactory_graph_read_model.md`; `64-CONTEXT.md`] |

**Deprecated/outdated:**

- `**Status:** Draft técnico` deixa de ser adequado após a canonicalização exigida por PRD-01. [VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`]
- A leitura de que “fonte normativa de produto e arquitetura” significa autorização automática de implementação deve ser substituída pela autoridade por pergunta e pela tradução obrigatória em requirement/fase. [VERIFIED: `.planning/PROJECT.md`; `64-CONTEXT.md`]
- O README ainda afirma que o projeto aguarda o próximo milestone; `STATE.md`, `PROJECT.md` e `ROADMAP.md` já mostram v2.13 ativo. A Phase 64 não deve corrigir isso por expansão oportunista. [VERIFIED: `README.md`; `.planning/STATE.md`; `.planning/ROADMAP.md`]

## Assumptions Log

All claims and recommendations in this research are derived from local repository files or commands executed in this session. No `[ASSUMED]` claims are required. [VERIFIED: local file reads and command outputs]

## Open Questions (RESOLVED)

1. **A canonicalização deve reescrever o PRD inteiro?**
   - **Resolved:** Não. Preservar o corpo e adicionar uma seção `0` de governança reduz churn e atende PRD-01/02 diretamente. [VERIFIED: `docs/PRD-tecnico.md`; `64-CONTEXT.md`]

2. **Qual deve ser a nova versão/status?**
   - **Resolved:** Versão `0.3`, pois há mudança de status e semântica documental; status recomendado: `Canônico para governança documental; aplicação ao TaxonomySystem delimitada`. [VERIFIED: versão atual `0.2`; requisito de referência canônica versionada em PRD-01]

3. **Existe uma precedência linear entre PRD, PROJECT, REQUIREMENTS, ROADMAP e fase?**
   - **Resolved:** Não. A precedência é por domínio de decisão; conflitos no mesmo domínio seguem PROJECT/REQUIREMENTS e verdade implementada, enquanto aspiração do PRD exige requirement/fase explícitos. [VERIFIED: cross-reading dos artefatos; `64-CONTEXT.md`]

4. **`STATE.md` deve entrar na matriz embora não esteja na lista mínima de precedência?**
   - **Resolved:** Sim, como autoridade de posição atual e decisões herdadas, sem poder de ampliar escopo. [VERIFIED: `AGENTS.md`; `.planning/STATE.md`; canonical refs de `64-CONTEXT.md`]

5. **README, PROJECT, REQUIREMENTS ou ROADMAP devem ser editados na Phase 64?**
   - **Resolved:** Não. Devem ser referências de validação. O único alvo de implementação é `docs/PRD-tecnico.md`; divergências externas ficam registradas para alinhamento posterior. [VERIFIED: fronteira estreita de `64-CONTEXT.md`; padrão da Phase 63]

6. **As seções PostgreSQL/Neo4j do PRD tornam-se normativas para implementação?**
   - **Resolved:** Não. Elas são contexto futuro; apenas princípios traduzidos em requisitos PGBR/N4J informam contratos documentais das Phases 65/66. [VERIFIED: `.planning/REQUIREMENTS.md`; `.planning/ROADMAP.md`; `64-CONTEXT.md`]

7. **É necessário adicionar testes ou dependências?**
   - **Resolved:** Não. Checks Node/rg e revisão de diff são suficientes; typecheck serve como smoke final. [VERIFIED: `64-CONTEXT.md`; padrão `63-VALIDATION.md`; `src/package.json`]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Checks documentais com Node.js `v24.14.0`, `rg`, Git; Vitest `^3.2.0` permanece infraestrutura de referência, mas não precisa de novo teste. [VERIFIED: ambiente local; `src/package.json`] |
| Config file | `src/vitest.config.ts` para o pacote; checks da fase podem permanecer inline em `64-VALIDATION.md`. [VERIFIED: `src/vitest.config.ts`; padrão `63-VALIDATION.md`] |
| Quick run command | `git diff --check && node -e "<check da seção 0>"` |
| Full suite command | `git diff --check && npm --prefix src run typecheck` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PRD-01 | Um único PRD canônico, versão `0.3`, status, data, milestone, Layer 1 e rastreabilidade | content | Check Node de presença/unicidade dos metadados e heading `# 0` | ✅ `docs/PRD-tecnico.md`; check será definido em Wave 0 |
| PRD-02 | Matriz de autoridade, regra de conflito, três classes de conteúdo e fences de não implementação | content + editorial | Check Node recortando somente a seção `0`, seguido de `rg` dos termos obrigatórios | ✅ alvo existe; check será definido em Wave 0 |
| PRD-01/02 | Nenhum arquivo de código, dados protegidos, graph contract ou graphify output entra na alteração | scope | `git diff --name-only -- docs src data | node -e "<permitir apenas docs/PRD-tecnico.md>"` e revisão do commit | ✅ infraestrutura Git existente |

### Required Content Checks

O `64-VALIDATION.md` deve materializar estes checks sem varrer semanticamente o PRD inteiro:

```bash
git diff --check

node -e "const fs=require('node:fs'); const t=fs.readFileSync('docs/PRD-tecnico.md','utf8'); const one=['**Versão do documento:** 0.3','**Rastreabilidade:** PRD-01, PRD-02','# 0. Status canônico, aplicação e precedência']; for(const x of one){const n=t.split(x).length-1;if(n!==1)throw new Error(x+' count='+n)}"

node -e "const fs=require('node:fs'); const t=fs.readFileSync('docs/PRD-tecnico.md','utf8'); const a=t.indexOf('# 0. Status canônico, aplicação e precedência'); const b=t.indexOf('# 1. Visão do produto'); if(a<0||b<=a)throw new Error('section 0 bounds'); const s=t.slice(a,b); const required=['docs/PRD-tecnico.md','.planning/PROJECT.md','.planning/REQUIREMENTS.md','.planning/ROADMAP.md','.planning/STATE.md','documentos de fase','normativo para este repositório','restrição de planejamento','contexto futuro do produto','não autoriza implementação','PostgreSQL','pgvector','Neo4j','agente','API','SaaS','PRD-01','PRD-02']; for(const x of required)if(!s.includes(x))throw new Error('missing '+x)"

rg -n "schema PostgreSQL|migrations|Cypher|driver|exportador|runtime|agente|API|SaaS|node kinds|query_kind|params|result|path" docs/PRD-tecnico.md
```

O último `rg` é uma inspeção, não uma proibição de ocorrência: no corpo do PRD esses termos são esperados; na seção `0` devem aparecer somente como contexto futuro ou escopo não autorizado. [VERIFIED: `docs/PRD-tecnico.md`; padrão de recorte da Phase 63]

### Sampling Rate

- **Per task commit:** `git diff --check` + check específico da seção editada.
- **Per wave merge:** todos os content checks + `npm --prefix src run typecheck`.
- **Phase gate:** content checks verdes, diff limitado ao PRD e commit sem `graphify-out/**` ou dados protegidos.

### Wave 0 Gaps

- [ ] Registrar em `64-VALIDATION.md` os checks de metadados/unicidade para PRD-01.
- [ ] Registrar em `64-VALIDATION.md` o check recortado da seção `0` para PRD-02.
- [ ] Registrar uma verificação de escopo que permita somente `docs/PRD-tecnico.md` como arquivo de implementação.

Nenhum arquivo de teste, fixture, package ou serviço novo é necessário. [VERIFIED: `64-CONTEXT.md`; infraestrutura existente]

### Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| A matriz responde corretamente cada tipo de pergunta sem criar ranking universal | PRD-02 | Semântica de autoridade exige revisão humana | Conferir cada linha contra PROJECT, REQUIREMENTS, ROADMAP, STATE e CONTEXT. |
| O corpo futuro não foi reinterpretado como capacidade atual | PRD-01/02 | A linguagem do PRD é extensa e aspiracional | Revisar o diff e confirmar que o corpo foi preservado, salvo ajustes estritamente necessários de referência. |
| A seção normativa não antecipa detalhes das Phases 65/66 | PRD-02 | Separação de fases é decisão de escopo | Confirmar ausência de schema, tabela, field mapping, Cypher, projection mapping ou runtime design novos. |

## Security Domain

`security_enforcement` não está explicitamente desabilitado em `.planning/config.json`; portanto, a pesquisa inclui o domínio de segurança. A Phase 64 não cria superfície executável, autenticação, sessão, persistência ou criptografia. [VERIFIED: `.planning/config.json`; `64-CONTEXT.md`]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Nenhuma autenticação é implementada; menções no PRD permanecem contexto futuro. [VERIFIED: `docs/PRD-tecnico.md`; `.planning/REQUIREMENTS.md`] |
| V3 Session Management | no | Nenhuma sessão/runtime é aberta. [VERIFIED: `64-CONTEXT.md`] |
| V4 Access Control | no | Nenhum controle de acesso executável é criado; autoridade documental é governança, não autorização runtime. [VERIFIED: `64-CONTEXT.md`] |
| V5 Input Validation | no | Não há entrada runtime; checks editoriais validam estrutura documental. [VERIFIED: escopo da fase] |
| V6 Cryptography | no | Nenhuma operação criptográfica ou segredo é adicionado. [VERIFIED: escopo da fase] |

### Known Threat Patterns for Document Governance

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Aspiração do PRD se passando por capacidade atual | Spoofing | Status canônico delimitado, classes de conteúdo e referência à verdade implementada. [VERIFIED: `64-CONTEXT.md`] |
| Documento de fase ampliando escopo | Elevation of Privilege | Regra de que CONTEXT/PLAN especializam requirement, mas não ampliam PROJECT/REQUIREMENTS. [VERIFIED: `64-CONTEXT.md`] |
| Alteração silenciosa de contratos existentes por prosa | Tampering | Links para contratos técnicos e fence explícita do envelope/node kinds. [VERIFIED: `docs/olfactory_graph_contract.md`; `docs/olfactory_graph_read_model.md`] |
| Ausência de rastreabilidade para a decisão | Repudiation | Versão, data, milestone, requirement IDs e histórico Git. [VERIFIED: PRD-01; Git existente] |
| Contexto futuro tratado como autorização | Elevation of Privilege | Tradução obrigatória em requirement + fase antes de implementar. [VERIFIED: `.planning/REQUIREMENTS.md`; `.planning/ROADMAP.md`] |

## Sources

### Primary (HIGH confidence)

- `64-CONTEXT.md` — decisões travadas, exclusões, referências canônicas e ideias específicas.
- `.planning/REQUIREMENTS.md` — PRD-01, PRD-02, fases futuras e não objetivos do v2.13.
- `.planning/PROJECT.md` — identidade Layer 1, milestone ativo e relação atual com o PRD.
- `.planning/ROADMAP.md` — separação temporal das Phases 64-67.
- `.planning/STATE.md` — posição atual e decisões herdadas.
- `docs/PRD-tecnico.md` — estado `0.2`/draft, conteúdo misto e afirmações futuras.
- `AGENTS.md` — limites operacionais, protected paths e fontes de verdade.

### Secondary (HIGH confidence, local)

- `README.md` — arquitetura operacional atual e divergência de status do milestone.
- `docs/olfactory_graph_contract.md` — contrato estático e limites do read model.
- `docs/olfactory_graph_read_model.md` — cadeia de confiança e envelope estável.
- Phase 63 `RESEARCH.md`, `VALIDATION.md`, `PATTERNS.md`, `PLAN.md` — analogia documental e checks limitados por seção.
- `src/package.json`, `src/vitest.config.ts` — infraestrutura local de validação.

### Tertiary

- Nenhuma. Não houve pesquisa web nem uso de conhecimento externo. [VERIFIED: restrição do usuário e execução desta pesquisa]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — somente ferramentas existentes e verificadas localmente.
- Architecture: HIGH — derivada diretamente dos artefatos GSD e contratos locais.
- Pitfalls: HIGH — observados no conteúdo atual do PRD e na analogia executada da Phase 63.
- Validation: HIGH — reutiliza padrão já validado de checks Node/rg limitados por seção.

**Research date:** 2026-06-19  
**Valid until:** 2026-07-19, salvo alteração anterior em PRD, PROJECT, REQUIREMENTS, ROADMAP ou CONTEXT.
