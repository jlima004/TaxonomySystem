# Olfactory Taxonomy System

Este é o **Taxonomy Builder**, o sistema computacional de taxonomia olfativa central para uma plataforma de inteligência de fragrâncias baseada em IA.

O projeto opera ativamente com a **v2.1.0 como versão padrão (`DEFAULT_PATHS`)** para geração e compilação de dados, enquanto a release **v1.0.0** está formalmente encerrada e arquivada como baseline estável e imutável. Publicações versionadas (v2.6–v2.10) são emitidas via flag explícita `--version <X.Y.Z>` sem alterar `DEFAULT_PATHS`.

O **Milestone v2.11 (Olfactory Knowledge Graph Read Model)** foi concluído em 2026-06-12, entregando um grafo olfativo estático derivado dos artefatos compilados v2 em `data/read-models/olfactory-graph/v2.11/`. O milestone **v2.12 (Graph Read Model Hardening & Agent Consumption Prep)** está em planejamento (Phases 60–63).

## 🎯 Objetivo (Core Value)

Produzir um sistema semântico olfativo normalizado e computacionalmente útil. O projeto estabelece a **Layer 1 (taxonomia pura)**, servindo de base estrutural de dados para todas as camadas superiores de inteligência de fragrâncias.

A taxonomia gerada constrói uma hierarquia semântica: `Family → Subfamily → Descriptors`, e é derivada de um corpus de materiais enriquecidos com dados moleculares provenientes do PubChem.

## 🏗️ Arquitetura em Camadas

Este repositório consolida as fundações do ecossistema:

1. **Layer 1 — TAXONOMY (Semântica Pura) 👈 ESTE PROJETO**
2. Layer 2 — Molecular/Physchem (xlogp, tpsa, mw) (Coberto pelo Engine)
3. Layer 3 — Derived Features (Volatility, Tenacity) (Coberto pelo Engine)
4. *Layer 4 — Intelligence (Similarity, Accord, Recommendation) (Futuro)*
5. *Layer 5 — Product (API, SaaS, AI Perfumer) (Futuro)*

Dentro da Layer 1, o projeto distingue dois tipos de artefato:

| Tipo | Caminho | Papel |
|------|---------|-------|
| **Publicação oficial** | `data/compiled/v2/*` | Verdade operacional da taxonomia (protegida) |
| **Read model derivado** | `data/read-models/olfactory-graph/v2.11/graph.json` | Grafo estático para consulta, documentação e consumo futuro por agentes/RAG — **não substitui** os artefatos compilados |

## 📂 Estrutura do Projeto

O sistema adota uma abordagem funcional pura, sem dependências externas de runtime ("zero-dependency"), utilizando TypeScript estrito.

- `src/`: Código fonte do Taxonomy Builder
  - `loader/`, `normalizer/`, `analyzer/`, `inference/`, `compiler/`, `cli/` — pipeline de compilação da taxonomia
  - `graph_read_model/` — contrato, builder, validador, query proofs, writer e boundary audit do grafo olfativo (v2.11+)
  - `tests/` — suite Vitest
- `engine_calcula_tenacidade_volatilidade/`: Engine existente (e pacote npm independente) de cálculo das propriedades físico-químicas de materiais.
- `data/`:
  - Entrada: `enriched_materials.json` (~70MB, ignorado no git) e seeds/insumos curatoriais em `taxonomy/` e `inference/`
  - Saída oficial: `compiled/v2/` — `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`
  - Read model: `read-models/olfactory-graph/v2.11/graph.json`
- `docs/`:
  - `olfactory_graph_contract.md` — contrato normativo do schema do grafo
  - `olfactory_graph_read_model.md` — guia operacional em português (geração, validação, queries, mapeamento Neo4J conceitual)
- `.planning/`: Documentação viva, requisitos, arquitetura e gerenciamento do ciclo de vida GSD do projeto.

## 🚀 Como Funciona o Builder

O Builder processa as entradas em uma taxonomia combinada e normalizada através das seguintes etapas:

1. **Loaders**: Processamento em streaming do `enriched_materials.json` e carga de seeds de taxonomia.
2. **Normalization Pipeline**: Redução inteligente de strings (`"Fresh Green"` → `fresh_green`) com limpeza de pontuações, detecção de plurais e aliases.
3. **Corpus Analysis**: Detecção de string similarity e matriz de co-ocorrência.
4. **Inference Engine**: Geração de subfamílias inferidas e escore de similaridade entre os elementos em formato de *Sparse Graph*.
5. **Compilation (CLI)**: Processamento de saída que assegura que tudo que for salvo respeita os Type Schemas de forma rígida.

### Graph Read Model (v2.11)

Camada derivada, read-only e zero-dependency que transforma os três artefatos compilados v2 em um grafo estático (`olfactory_graph_read_model.v1`):

1. **Contract** (`src/graph_read_model/contract.ts`) — schema, prefixos de ID, invariantes e política de fronteiras
2. **Build** (`build_graph.ts`) — montagem determinística em memória a partir de `taxonomy.json`, `descriptor_aliases.json` e `similarity_matrix.json`
3. **Validate** (`validate_graph.ts`) — validação estrutural com falhas tipadas
4. **Query Proofs** (`query_graph.ts`) — 8 funções fs-free que produzem envelopes `{ query_kind, params, result, path }` para hierarquia, aliases, descritores relacionados, similaridade, hubs e pontes cross-family
5. **CLI** (`graph:build`) — escrita atômica em `data/read-models/olfactory-graph/v2.11/`, boundary audit SHA-256 e guardrails automáticos (typecheck, tests, integrity proofs)

> O read model **não** promove candidatos curatoriais, **não** recalcula similaridade e **não** altera seeds ou artefatos compilados.

### Executando o Projeto

Você precisa do Node.js v20+ e npm.

```bash
cd src

# Instalar dependências (typescript, vitest)
npm install

# Rodar todos os testes vitest do construtor
npm run test

# Verificar tipos sem gerar arquivos de build
npm run typecheck

# Verificar integridade dos alias targets (sem compilar)
npm run verify:integrity

# Gerar o build e compilar os JSONs de saída (DEFAULT_PATHS: version 2.1.0)
npm run build
npm run compile

# Compilar com quality report + alias integrity gate
npm run compile:quality

# Republicar uma versão específica em data/compiled/v2/
npm run compile -- --version 2.10.0

# Gerar o grafo olfativo read model (v2.11)
npm run graph:build

# Dry-run (build + validate + boundary audit, sem escrita)
npm run graph:build -- --dry-run

# Rodar safety guards (proteção de caminhos críticos)
npm run safety:guard
```

Documentação detalhada do grafo: [`docs/olfactory_graph_read_model.md`](docs/olfactory_graph_read_model.md).

## 🛠️ Regras e Convenções do Repositório

- **Linguagem**: Node.js com TypeScript (Strict Mode).
- **Paradigma**: Funcional Pura (sem classes, sem side effects).
- **Dependências**: Abordagem Zero-Dependency para as funções de runtime.
- **Workflow GSD**: O projeto adota a metodologia Get-Shit-Done (GSD). Para ver os planos gerados e o progresso, verifique os comandos listados em `GEMINI.md` ou use `/gsd-progress`.

## Current Taxonomy Status

O compiler e CLI estão completos e geram artefatos determinísticos em `data/compiled/v2/` (default) e `data/compiled/v1/` (baseline/archive). O **Milestone v2.10** endureceu a qualidade dos dados e a integridade de aliases; o **Milestone v2.11** adicionou o read model de grafo sem alterar o contrato dos três artefatos oficiais.

Estado atual do default CLI/compiler (`src/cli/parse_args.ts`):

- `seedPath`: `data/taxonomy/taxonomy-seed.v2.json`
- `aliasPath`: `data/taxonomy/descriptor_aliases.seed.json`
- `relationsPath`: `data/inference/curated_relations.v2.json`
- `accordsPath`: `data/inference/accord_map.v2.json`
- `noisePath`: `data/inference/semantic_noise.v1.json`
- `conflictStopwordsPath`: `data/inference/conflict_stopwords.v1.json`
- `outputDir`: `data/compiled/v2`
- `version` (`DEFAULT_PATHS`): `2.1.0` — mantido como baseline desde a promoção v2; publicações versionadas (v2.6–v2.10) são emitidas via `--version <X.Y.Z>` sem alterar `DEFAULT_PATHS`.

Artefatos compilados oficiais em `data/compiled/v2/` (gerados em 2026-06-09T01:42:50.508Z):

- 10 famílias, 18 subfamílias, **341** descritores totais compilados
- **18** aliases publicados, **18 targets válidos, 0 exceções**, matriz de similaridade com **13** arestas validadas
- Review queue com **257 itens** (243 `corpus_candidate_low_support` + 14 `seed_corpus_conflict`)

Read model derivado em `data/read-models/olfactory-graph/v2.11/graph.json`:

- Schema `olfactory_graph_read_model.v1`, baseline **10/18/341/18/13** reconciliado com os artefatos compilados
- Nós: `family`, `subfamily`, `descriptor`, `alias` — relações: `contains_subfamily`, `contains_descriptor`, `resolves_to`, `similar_to`
- 8 funções de query proof testadas com regressão live (hub `floral_rose`, 5 pontes cross-family)

Qualidade e CI:

- Suite Vitest: **65 arquivos, 478 testes** (PASS)
- CI GitHub Actions (Node 24): install → typecheck → tests → alias integrity proofs
- Guardrails locais: `verify:integrity`, `compile:quality`, `alias:integrity`, `graph:build` (GVAL-05)

Comparativo de milestones:

| Milestone | Versão publicada | Descritores | Aliases válidos | Review queue | Arestas | Grafo |
|-----------|-----------------|------------:|----------------:|-------------:|--------:|-------|
| v1 (baseline/archive) | 1.0.0 | 177 | — | — | 6 | — |
| v2.0 (default switch) | 2.0.0 | 303 | — | 317 | 13 | — |
| v2.6 (Stabilization & Closure) | 2.6.0 | 308 | — | 283 | 13 | — |
| v2.7 (Batch 1 triage) | 2.7.0 | 324 | — | 269 | 13 | — |
| v2.8 (Batch 2 triage) | 2.8.0 | 340 | 17 resolvidos + 1 pendente | 256 | 13 | — |
| v2.9 (Alias Integrity) | 2.9.0 | 341 | 18/18 resolvidos | 256 | 13 | — |
| v2.10 (Integrity Gate & CI) | 2.10.0 | 341 | 18/18 resolvidos | 256 | 13 | — |
| **v2.11 (atual — grafo)** | **read model v2.11** | **341** | **18/18 resolvidos** | **257** | **13** | **✓** |

Importante: `data/compiled/v1/` continua preservado como baseline/archive v1, e os inputs v1 (`taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json`) continuam presentes.

Limitações residuais e próximos trabalhos ficam documentados no backlog em `.planning/`:

- **FUT-01:** curadoria dos 243 itens `corpus_candidate_low_support` restantes em lotes futuros (cadência ≤40 candidatos/lote)
- **FUT-02:** resolução dos 14 itens `seed_corpus_conflict` remanescentes
- **v2.12 tech debt (W-01–W-07):** drift de constantes, fail-closed query consumption, provas sandbox do CLI write path — ver [`.planning/milestones/v2.11-MILESTONE-AUDIT.md`](.planning/milestones/v2.11-MILESTONE-AUDIT.md)
- Benchmark de stress local sem `CI=true` (1500ms ceiling documentado como tech debt)

## 🔒 Safety Guards (Mecanismos de Segurança)

Para garantir que o repositório permaneça íntegro e em conformidade com as diretrizes de desenvolvimento do projeto, existe um script local de segurança não-mutante (safety guard) que atua como barreira contra commits e alterações acidentais em áreas protegidas.

### Escopo das Checagens do Guard

O script monitora e bloqueia commits se detectar:

1. **Arquivos temporários do Graphify na área de staging (staged):** Qualquer arquivo dentro do diretório `graphify-out/` que esteja adicionado para commit (`git add`) será bloqueado. Alterações no diretório `graphify-out/` na árvore de trabalho (*working tree*) são permitidas e ignoradas pelo guard, desde que não sejam colocadas em staging.
2. **Alterações em caminhos protegidos (staged ou dirty):** Qualquer modificação (seja em staging ou apenas alterada localmente) nos caminhos protegidos do sistema de taxonomia olfativa resultará em falha. Os caminhos protegidos são:
   - `data/taxonomy/`
   - `data/inference/`
   - `data/compiled/v1/`
   - `data/compiled/v2/`
   - `src/cli/parse_args.ts`

Além do safety guard de commit, o projeto possui guardrails de integridade em `src/package.json`:

- **`verify:integrity`** — valida que todos os alias targets na seed apontam para descritores existentes na taxonomia compilada
- **`compile:quality`** — compile + quality report + alias integrity gate (uso em CI)
- **`alias:integrity`** — verificador standalone de integridade de aliases
- **`graph:build`** — gera o read model com boundary audit SHA-256 e executa guardrails automáticos pós-escrita (typecheck, tests, integrity proofs)

O CLI `graph:build` também bloqueia escrita em prefixos protegidos e em `graphify-out/` em runtime (`write_graph.ts`).

### Como Executar

#### Execução Direta do Script (Raiz do Projeto)

```bash
# Se o script tiver permissão de execução
./scripts/check-safety-guards.sh

# Caso contrário, usando bash explicitamente
bash scripts/check-safety-guards.sh
```

#### Execução via Wrapper NPM (Diretório `src/`)

```bash
npm run safety:guard
```

### Resultados e Exit Codes

- **PASS (Código de Saída: 0):** Nenhum arquivo gerado pelo Graphify em staging ou alteração indesejada em caminhos protegidos foi detectada. A workspace está em conformidade.
- **FAIL (Código de Saída: 1):** Uma ou mais violações foram encontradas. Todas as violações são listadas no stderr junto com a mensagem de política e as instruções de limite antes de encerrar o script.
- **Política de Não-Mutação:** O script é puramente de auditoria de leitura. Ele **nunca** executa comandos destrutivos ou mutantes (como `git clean`, `git reset`, `git checkout` ou `git rm`). Toda correção de estado de staging deve ser feita manualmente pelo desenvolvedor.

## 📈 Status

### Milestone v2.11 — Olfactory Knowledge Graph Read Model (concluído 2026-06-12)

As **Phases 55 a 59** entregaram um read model de grafo olfativo estático, read-only e determinístico:

- **Phase 55:** Contrato de schema, prefixos de ID, inputs permitidos e política de fronteiras (`docs/olfactory_graph_contract.md`)
- **Phase 56:** Builder puro em memória + validação estrutural com regressão live `10/18/341/18/13`
- **Phase 57:** 8 funções de query proof com envelopes tipados para consumo futuro por agentes/RAG
- **Phase 58:** CLI `graph:build` com escrita atômica, boundary audit SHA-256 e guardrails GVAL-05
- **Phase 59:** Documentação operacional em português, regressão contra artefatos live e closure do milestone

**Resultado:** Grafo publicado em `data/read-models/olfactory-graph/v2.11/graph.json`. Todos os 22 requisitos do milestone satisfeitos. Audit status `tech_debt` com 7 itens não-bloqueadores aceitos (endereçados no v2.12).

### Milestone v2.12 — Graph Read Model Hardening & Agent Consumption Prep (planejado)

Roadmap aprovado, Phases 60–63 pendentes:

- **Phase 60:** Centralizar constantes de contrato e endurecer validação contra drift
- **Phase 61:** Fail-closed query consumption para consumidores futuros
- **Phase 62:** Provas sandbox do write path sancionado, boundary audit e isolamento Graphify
- **Phase 63:** Documentação de consumer readiness e contrato estável do proof envelope

Ver [`.planning/ROADMAP.md`](.planning/ROADMAP.md) e [`.planning/PROJECT.md`](.planning/PROJECT.md).

### Histórico de milestones anteriores

- **v2.10 (Phases 52–54):** Guardrails `verify:integrity`/`compile:quality`, CI GitHub Actions (Node 24), 341 descritores / 18 aliases válidos / 0 targets não resolvidos
- **v2.9 (Phases 49–51):** Integridade de alias targets — `ylang ylang → ylang_ylang` (FUT-03)
- **v2.8 (Phases 44–48):** Triagem Batch 2 — 12 `promote_to_seed`, 340 descritores
- **v2.7 (Phases 40–43):** Triagem Batch 1 — 6 `promote_to_seed`, 324 descritores
- **v2.6 (Phases 38–39):** Rebaseline da review queue + conflict stopwords
- **v2.1–v2.5 (Phases 14–37):** Safety guards, microcuradoria, limpeza de aliases, filtro `conflict_stopwords.v1.json`

**Estado atual:** Taxonomia v2 estável (341/18/0 alias integrity). Read model v2.11 operacional com boundary audit e query proofs. Suite Vitest **478 testes em 65 arquivos — todos PASS**. CI e safety guards operacionais. Próximo ciclo de escopo: **v2.12** via `/gsd-discuss-phase 60` quando priorizado.

**Próximos passos planejados:**

- Executar **v2.12** (Phases 60–63) para endereçar tech debt do grafo e preparar consumo por agentes/RAG
- **FUT-01:** continuar triagem `low_support` nos 243 itens restantes em lotes limitados (≤40 candidatos/lote)
- **FUT-02:** resolver os 14 itens `seed_corpus_conflict` remanescentes quando explicitamente no escopo
