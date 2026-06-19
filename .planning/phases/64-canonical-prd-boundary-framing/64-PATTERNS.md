# Phase 64: Canonical PRD & Boundary Framing - Pattern Map

**Mapped:** 2026-06-19
**Files analyzed:** 1 alvo de implementação + 8 referências normativas
**Analogs found:** 9 / 9

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `docs/PRD-tecnico.md` | documentação normativa de produto e governança | transform | `docs/olfactory_graph_read_model.md` após a Phase 63 | exact |
| `.planning/phases/63-consumer-readiness-documentation/63-PATTERNS.md` | mapa de padrões documental | transform | padrão documental da Phase 63 | reference-only |
| `.planning/phases/63-consumer-readiness-documentation/63-VALIDATION.md` | estratégia de validação documental | batch, transform | checks leves da Phase 63 | reference-only |
| `.planning/PROJECT.md` | autoridade de identidade e escopo permanente | transform | declaração Layer 1 e decisões duráveis | reference-only |
| `.planning/REQUIREMENTS.md` | autoridade de requisitos do milestone | transform | `PRD-01`, `PRD-02` e não objetivos v2.13 | reference-only |
| `.planning/ROADMAP.md` | autoridade de sequência e alocação por fase | batch | sequência 64-67 | reference-only |
| `.planning/STATE.md` | autoridade de posição atual do workflow | event-driven | milestone e foco atuais | reference-only |
| `docs/olfactory_graph_contract.md` | contrato técnico normativo | transform | fronteiras estáticas e caminhos proibidos | reference-only |
| `docs/olfactory_graph_read_model.md` | guia operacional normativo | transform, request-response | fences, cadeia de confiança e envelope estável | reference-only |

> **Fence de implementação:** a Phase 64 modifica somente `docs/PRD-tecnico.md`. Todos os demais arquivos desta tabela são fontes de autoridade ou analogias de leitura. Não editar código, dados, artefatos GSD de autoridade, contratos do grafo nem `graphify-out/**`.

## Pattern Assignments

### `docs/PRD-tecnico.md` (documentação normativa, transform)

**Analog principal:** `docs/olfactory_graph_read_model.md`

**Metadados atuais a substituir, sem reescrever o corpo integral** (`docs/PRD-tecnico.md`, linhas 1-10):

```markdown
# PRD Técnico — Alquem.io

**Produto:** Alquem.io
**Versão do documento:** 0.2
**Status:** Draft técnico
**Categoria:** SaaS de inteligência olfativa com agente de IA
```

Padrão a aplicar:

- promover a versão para `0.3`;
- declarar status canônico delimitado, data e milestone `v2.13`;
- incluir rastreabilidade explícita a `PRD-01` e `PRD-02`;
- deixar claro que “canônico” descreve a referência de produto e governança, não a verdade implementada do TaxonomySystem;
- inserir a governança antes de `# 1. Visão do produto`, preservando as 38 seções existentes.

**Padrão de fence global da Phase 63** (`docs/olfactory_graph_read_model.md`, linhas 3-7):

```markdown
> **Fence global (D-16, D-17):** Este guia documenta um graph read model **estatico, read-only e zero-dependency**. Ele nao define runtime de agente, API, servico HTTP, banco de dados, Neo4J, Graphify, publicacao automatica, persistencia de proofs nem comandos publicos de query.
```

Copiar a forma, não o conteúdo literal: abrir a seção canônica do PRD com uma nota visual inequívoca que separe:

1. conteúdo normativo para este repositório;
2. restrições para planejamento futuro;
3. contexto/aspiração da Alquem.io sem autorização de implementação.

**Risco editorial concreto que exige classificação** (`docs/PRD-tecnico.md`, linhas 70-87):

```markdown
# 2. Objetivo do MVP

O MVP deverá provar que a Alquem.io consegue responder tarefas olfativas reais [...]

O Neo4j fará parte do MVP desde o início [...]
```

Essa afirmação pertence à visão futura do produto. A nova moldura deve dizer explicitamente que ela não autoriza Neo4j, schema, driver, Cypher, runtime ou materialização nesta fase ou neste repositório.

**Conteúdo do PRD alinhado à Layer 1, mas que não supera a verdade implementada** (`docs/PRD-tecnico.md`, linhas 767-797):

```markdown
# 10. TaxonomySystem

O TaxonomySystem permanecerá como fonte versionada para:

-   famílias;
-   subfamílias;
-   descritores;
-   aliases;
-   similaridades;

Artefatos compilados:

```text
taxonomy.json
descriptor_aliases.json
similarity_matrix.json
```
```

Usar essa seção como exemplo de conteúdo aplicável ao repositório, condicionado por `PROJECT.md`, requisitos, código, testes, artefatos oficiais e contratos técnicos existentes.

**Conteúdo futuro que deve permanecer contexto, não instrução executável** (`docs/PRD-tecnico.md`, linhas 817-825):

```text
Ingestão no PostgreSQL
        ↓
Projeção no Neo4j
```

```markdown
O compile da taxonomia não deverá escrever diretamente no Neo4j.

Primeiro os resultados serão validados e persistidos no PostgreSQL. Depois, um processo de publicação atualizará o grafo.
```

Classificar a ponte PostgreSQL como assunto da Phase 65 e a projeção Neo4j como assunto da Phase 66. Mesmo nessas fases, o roadmap abre contratos documentais, não implementação de banco/runtime.

**Estrutura recomendada para a nova seção canônica:**

```markdown
# 0. Status canônico, aplicação e precedência

## 0.1 Status e rastreabilidade
## 0.2 Como este PRD se aplica ao TaxonomySystem
## 0.3 Matriz de autoridade por pergunta
## 0.4 Regra de resolução de conflitos
## 0.5 Classificação do conteúdo: normativo, restrição de planejamento ou contexto futuro
## 0.6 Fences de não implementação do milestone v2.13
```

Os nomes podem variar, mas cada responsabilidade deve aparecer uma única vez, antes da visão do produto.

**Matriz de autoridade a incluir:**

| Pergunta | Autoridade primária | Regra |
|----------|---------------------|-------|
| Qual é a visão/arquitetura futura da Alquem.io? | `docs/PRD-tecnico.md` | O PRD decide intenção de produto, não estado implementado deste repositório. |
| Qual é a identidade e o limite permanente do TaxonomySystem? | `.planning/PROJECT.md` | Mantém o repositório na Layer 1 e impede expansão implícita. |
| O que o milestone v2.13 deve e não deve entregar? | `.planning/REQUIREMENTS.md` | Requisitos e não objetivos rastreáveis prevalecem para o milestone. |
| Em que fase uma obrigação é tratada? | `.planning/ROADMAP.md` | Decide sequência e responsabilidade temporal. |
| Qual é a posição atual do workflow? | `.planning/STATE.md` | Informa milestone/foco atuais; não redefine contratos técnicos. |
| Como uma fase executa seu escopo? | `NN-CONTEXT.md`, depois `NN-RESEARCH.md` e `NN-PLAN.md` | Especializam requisitos abertos sem ampliar o repositório. |
| O que já está realmente implementado? | código, testes, artefatos oficiais e contratos técnicos | A prosa do PRD não substitui comportamento executável nem verdade compilada. |

**Algoritmo de conflito recomendado:**

1. identificar o domínio da afirmação;
2. consultar a autoridade primária desse domínio;
3. verificar requisito e fase explicitamente abertos;
4. conferir contratos/código/testes quando a afirmação descrever estado implementado;
5. se não houver autorização explícita, tratar a afirmação do PRD como contexto futuro;
6. registrar a divergência para planejamento posterior, sem ampliar o patch atual.

---

### `.planning/PROJECT.md` (referência de identidade e escopo)

**Trecho de autoridade** (linhas 9-17):

```markdown
Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) [...]

- `docs/PRD-tecnico.md` — fonte normativa de produto e arquitetura para o projeto [...]

**Goal:** alinhar o TaxonomySystem ao PRD técnico canônico da Alquem.io, definindo contratos documentais e de dados [...] sem abrir implementação de runtime, API, banco ou agentes.
```

Aplicar ao PRD: “fonte normativa” deve ser qualificada por domínio. O PRD orienta produto e arquitetura futura; `PROJECT.md` continua decidindo identidade, escopo Layer 1 e limites duráveis do repositório.

---

### `.planning/REQUIREMENTS.md` (referência de obrigações do milestone)

**Requisitos da fase** (linhas 11-14):

```markdown
### PRD Canonicalization

- [ ] **PRD-01**: Maintainer can identify one canonical, versioned Alquem.io technical PRD reference [...]
- [ ] **PRD-02**: Maintainer can inspect how the canonical PRD constrains TaxonomySystem planning artifacts [...]
```

**Não objetivo relevante** (linhas 52-63):

```markdown
## Out of Scope

| Runtime agent execution, orchestration, or chat flows | v2.13 aligns contracts and docs only; product runtime remains external to this repository. |
| Mutating `data/taxonomy/**` or publishing new `data/compiled/v2/*` artifacts | v2.13 is documentation/contract alignment, not curation or publication. |
```

Aplicar ao PRD: incluir os IDs nos metadados e garantir que a seção canônica permita verificar ambos sem depender de interpretação do restante das 2.875 linhas.

---

### `.planning/ROADMAP.md` (referência de sequência)

**Alocação temporal** (linhas 18-23):

```markdown
- [ ] Phase 64: Canonical PRD & Boundary Framing
- [ ] Phase 65: PostgreSQL Core Data Contract Bridge
- [ ] Phase 66: Neo4j Projection Rules from Sanctioned Graph
- [ ] Phase 67: Consumer-Readiness Debt Alignment & Milestone Closure
```

Aplicar ao PRD: nenhuma frase sobre PostgreSQL ou Neo4j deve antecipar implementação. Phase 64 enquadra autoridade; 65 e 66 definem contratos documentais específicos; 67 consolida dívida.

---

### `.planning/STATE.md` (referência de posição atual)

**Trecho de autoridade atual** (linhas 3-4, 22-30):

```yaml
milestone: v2.13
milestone_name: PRD Canonicalization & Core Data Bridge
```

```markdown
**Core value:** [...] Layer 1 (taxonomia pura) [...]

## Current Position
```

Aplicar ao PRD: usar `STATE.md` para status corrente, sem transformá-lo em autoridade de produto ou contrato técnico.

---

### `docs/olfactory_graph_contract.md` (referência técnica normativa)

**Inputs permitidos e separação de Graphify** (linhas 66-72, 79-97):

```markdown
The only allowed production inputs are:
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

`graphify-out/**` is navigation-only context and is neither a production input nor an output [...]
```

Aplicar ao PRD:

- não permitir que a arquitetura futura seja lida como um quarto input atual;
- não adicionar node kinds, edge kinds, prefixes ou outputs;
- preservar `graphify-out/**` como fora da produção e fora do patch.

---

### `docs/olfactory_graph_read_model.md` (referência técnica e analogia documental)

**Cadeia de confiança** (linhas 53-69):

```text
graph:build -> graph.json cru -> asValidatedGraph -> createValidatedQueryConsumer -> query proof
```

```markdown
| Query proof | Resultado tipado | Retorna `{ query_kind, params, result, path? }` com semantica estavel por `query_kind`. |
```

**Fence do envelope** (linhas 185-209):

```typescript
{
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}
```

Aplicar ao PRD: citar o contrato/read model como verdade técnica existente e deixar explícito que o PRD não altera a cadeia sancionada nem o envelope. `result` permanece autoritativo e `path` continua proveniência opcional.

---

### `.planning/phases/63-consumer-readiness-documentation/63-VALIDATION.md` (analogia de testes documentais)

**Padrão de checks leves** (linhas 54-58):

```bash
node -e "... each canonical H2 must appear exactly once and in order ..."
rg -n "graph:build|asValidatedGraph|createValidatedQueryConsumer|..." docs/olfactory_graph_read_model.md
rg -n "runtime|API|Neo4J|Graphify|database|banco|..." docs/olfactory_graph_read_model.md
```

Copiar o formato para Phase 64:

- check Node de metadados `0.3`, status, milestone e IDs `PRD-01`/`PRD-02`;
- check de presença/unicidade/ordem das subseções canônicas;
- `rg` dos artefatos de autoridade e termos `normativo`, `contexto futuro`, `não autoriza implementação`;
- `rg` dos fences: PostgreSQL, pgvector, Neo4j, agente, tools, API, SaaS, runtime, schema, migrations;
- `git diff --check`;
- confirmação de escopo com `git diff --name-only -- docs/PRD-tecnico.md` e inspeção separada do status global;
- `TMPDIR=/tmp npm --prefix src run typecheck` como smoke check final, sem exigir alteração de código.

Não criar framework de teste documental nem editar testes do pacote.

## Shared Patterns

### Canonicalização delimitada

**Fonte:** Phase 63, `docs/olfactory_graph_read_model.md`

**Aplicar a:** `docs/PRD-tecnico.md`

Concentrar a governança em uma seção inicial curta, explícita e verificável. Preservar o corpo de visão futura; não marcar 2.875 linhas individualmente nem reescrever as 38 seções.

### Autoridade por domínio, não hierarquia linear absoluta

**Fonte:** `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`

**Aplicar a:** matriz de autoridade e regra de conflito.

Cada artefato decide um tipo de pergunta. Documentos de fase especializam execução, mas não ampliam o escopo permanente nem convertem aspiração do PRD em autorização.

### Verdade implementada vence descrição aspiracional

**Fonte:** `docs/olfactory_graph_contract.md`, `docs/olfactory_graph_read_model.md`, código/testes/artefatos oficiais.

**Aplicar a:** toda afirmação sobre estado atual do TaxonomySystem.

O PRD não substitui contratos já sancionados, os três artefatos compilados oficiais, o read model derivado, a cadeia fail-closed ou o envelope `{ query_kind, params, result, path? }`.

### Fences de não implementação

**Fonte:** `64-CONTEXT.md`, `.planning/REQUIREMENTS.md`, padrão de fences da Phase 63.

**Aplicar a:** seção canônica e matriz de classificação.

Declarar explicitamente que o milestone v2.13 e a Phase 64 não autorizam:

- PostgreSQL schema, migrations, tabelas, persistência ou queries;
- Neo4j, Cypher, drivers, exportadores ou materialização;
- pgvector/embeddings;
- tools, agente, API, SaaS ou runtime;
- novos node/edge kinds;
- mutações curatoriais, publicações compiladas ou alterações em `graphify-out/**`;
- mudança do envelope de query proof.

### Validação documental estreita

**Fonte:** `63-VALIDATION.md`

**Aplicar a:** plano e verificação da Phase 64.

Preferir checks determinísticos sobre a nova seção canônica. Validar a árvore por arquivo autorizado, pois já existem mudanças locais em `graphify-out/**` e um arquivo não rastreado preexistente; não limpar, editar, incluir ou assumir propriedade desses itens.

## No Analog Found

Nenhum. Todos os papéis documentais e de autoridade possuem analogias fortes no repositório.

## Metadata

**Analog search scope:** `docs/`, `.planning/`, `.planning/phases/63-consumer-readiness-documentation/`

**Files scanned:** 9 fontes principais, além de `64-CONTEXT.md`, `64-RESEARCH.md`, `64-VALIDATION.md`, `AGENTS.md` e `README.md`

**Pattern extraction date:** 2026-06-19

**Implementation target:** somente `docs/PRD-tecnico.md`

**Protected/excluded:** `graphify-out/**`, dados oficiais, código, testes, contratos técnicos e o arquivo não rastreado preexistente
