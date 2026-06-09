# Olfactory Taxonomy System

Este é o **Taxonomy Builder**, o sistema computacional de taxonomia olfativa central para uma plataforma de inteligência de fragrâncias baseada em IA.

O projeto opera ativamente com a **v2.1.0 como versão padrão (DEFAULT_PATHS)** para geração e compilação de dados, enquanto a release **v1.0.0** está formalmente encerrada e arquivada como baseline estável e imutável (com seus insumos e artefatos históricos preservados). Publicações versionadas (v2.6, v2.7, v2.8, v2.9, v2.10) são emitidas via flag explícita `--version <X.Y.Z>` sem alterar `DEFAULT_PATHS`.

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

## 📂 Estrutura do Projeto

O sistema adota uma abordagem funcional pura, sem dependências externas de runtime ("zero-dependency"), utilizando TypeScript estrito.

- `src/`: Código fonte do Taxonomy Builder (Loaders, Normalizer, Analysis, Inference, Compiler, CLI).
- `engine_calcula_tenacidade_volatilidade/`: Engine existente (e pacote npm independente) de cálculo das propriedades físico-químicas de materiais.
- `data/`: Contém os dados estruturais, incluindo o corpus gigantesco enriquecido e saídas compiladas:
  - Entrada: `enriched_materials.json` (~70MB, ignorado no git) e a estrutura manual base.
  - Saída: Pasta `compiled/` contendo `taxonomy.json`, `descriptor_aliases.json` e `similarity_matrix.json`.
- `.planning/`: Documentação viva, requisitos, arquitetura e gerenciamento do ciclo de vida GSD do projeto.

## 🚀 Como Funciona o Builder

O Builder processa as entradas em uma taxonomia combinada e normalizada através das seguintes etapas:
1. **Loaders**: Processamento em streaming do `enriched_materials.json` e carga de seeds de taxonomia.
2. **Normalization Pipeline**: Redução inteligente de strings (`"Fresh Green"` -> `fresh_green`) com limpeza de pontuações, detecção de plurais e aliases.
3. **Corpus Analysis**: Detecção de string similarity e matriz de co-ocorrência.
4. **Inference Engine**: Geração de subfamílias inferidas e escore de similaridade entre os elementos em formato de *Sparse Graph*.
5. **Compilation (CLI)**: Processamento de saída que assegura que tudo que for salvo respeita os Type Schemas de forma rígida.

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

# Rodar safety guards (proteção de caminhos críticos)
npm run safety:guard
```

## 🛠️ Regras e Convenções do Repositório

- **Linguagem**: Node.js com TypeScript (Strict Mode).
- **Paradigma**: Funcional Pura (sem classes, sem side effects).
- **Dependências**: Abordagem Zero-Dependency para as funções de runtime.
- **Workflow GSD**: O projeto adota a metodologia Get-Shit-Done (GSD). Para ver os planos gerados e o progresso, verifique os comandos listados em `GEMINI.md` ou use `/gsd-progress`.

## Current Taxonomy Status

O compiler e CLI estão completos e geram artefatos determinísticos em `data/compiled/v2/` (default) e `data/compiled/v1/` (baseline/archive). A Phase 7 foi implementada para endurecer a qualidade dos dados sem alterar o contrato dos três artefatos finais: `taxonomy.json`, `descriptor_aliases.json` e `similarity_matrix.json`.

As Phases 8, 9 e 10 criaram e expandiram `data/taxonomy/taxonomy-seed.v2.json` como seed curado. A **Phase 11** documentou readiness e política de migração. A **Phase 12** promoveu o v2 para default operacional. A **Phase 13** concluiu a estabilização inicial pós-promoção. As **Phases 14 a 37** iteraram sobre o modelo v2 com triagem de backlog, safety guards, microcuradoria de descritores, limpeza sistemática de aliases e a implementação do **filtro de conflict stopwords** (`data/inference/conflict_stopwords.v1.json`). As **Phases 38 e 39** consolidaram o **Milestone v2.6 (Stabilization & Closure)**.

As **Phases 40 a 43** executaram o **Milestone v2.7 (Low-Support Review Queue Triage)**: inventário dos 275 itens `corpus_candidate_low_support`, seleção limitada de 30 candidatos, matriz de decisão com 6 promoções aprovadas, microcuradoria controlada de seed e publicação oficial dos artefatos v2.7.

As **Phases 44 a 48** executaram o **Milestone v2.8 (Low-Support Review Queue Triage Batch 2)**: inventário dos 259 itens restantes, seleção de 40 candidatos, matriz de decisão com 12 `promote_to_seed`, microcuradoria controlada e publicação oficial dos artefatos v2.8 via `--version 2.8.0`.

As **Phases 49 a 51** executaram o **Milestone v2.9 (Alias Target Integrity & Descriptor Hygiene)**: resolução do débito `descriptor_aliases` — adição do descritor `ylang_ylang` sob `floral/floral_white`, fechando a lacuna do alias legado `ylang ylang → ylang_ylang` (FUT-03). Publicação oficial dos artefatos v2.9.0 com **0 targets não resolvidos** e mecanismo de exceções vazio.

As **Phases 52 a 54** executaram o **Milestone v2.10 (Integrity Gate Hardening & CI Wiring)**: fechamento retroativo da verificação da Phase 50, implementação dos guardrails locais `verify:integrity` e `compile:quality`, e configuração de CI GitHub Actions (Node 24) com provas duais de integridade (`alias:integrity --json` e `verify:integrity --json`). Benchmark de stress estabilizado com limites conscientes de ambiente (1500ms local, 3000ms CI).

Estado atual do default CLI/compiler (`src/cli/parse_args.ts`):

- `seedPath`: `data/taxonomy/taxonomy-seed.v2.json`
- `aliasPath`: `data/taxonomy/descriptor_aliases.seed.json`
- `relationsPath`: `data/inference/curated_relations.v2.json`
- `accordsPath`: `data/inference/accord_map.v2.json`
- `noisePath`: `data/inference/semantic_noise.v1.json`
- `conflictStopwordsPath`: `data/inference/conflict_stopwords.v1.json`
- `outputDir`: `data/compiled/v2`
- `version` (DEFAULT_PATHS): `2.1.0` — mantido como baseline desde a promoção v2; publicações versionadas (v2.6–v2.10) são emitidas via flag explícita `--version <X.Y.Z>` sem alterar `DEFAULT_PATHS`.

Os artefatos oficiais em `data/compiled/v2/` refletem o estado compilado mais recente (gerados em 2026-06-09T01:42:50.508Z):

- 10 famílias, 18 subfamílias, **341** descritores totais compilados
- **18** aliases publicados, **18 targets válidos, 0 exceções**, matriz de similaridade com **13** arestas validadas
- Review queue com **256 itens** (243 `corpus_candidate_low_support` + 13 `seed_corpus_conflict`)
- Suite Vitest: **56 arquivos, 390 testes** (PASS)
- CI GitHub Actions configurado (Node 24): install → typecheck → tests → alias integrity proofs
- Guardrails locais: `verify:integrity`, `compile:quality`, `alias:integrity`

Comparativo de milestones:

| Milestone | Versão publicada | Descritores compilados | Aliases válidos | Review queue | Arestas |
|-----------|------------------|----------------------:|----------------:|-------------:|--------:|
| v1 (baseline/archive) | 1.0.0 | 177 | — | — | 6 |
| v2.0 (default switch) | 2.0.0 | 303 | — | 317 | 13 |
| v2.6 (Stabilization & Closure) | 2.6.0 | 308 | — | 283 | 13 |
| v2.7 (Batch 1 triage) | 2.7.0 | 324 | — | 269 | 13 |
| v2.8 (Batch 2 triage) | 2.8.0 | 340 | 17 resolvidos + 1 pendente | 256 | 13 |
| v2.9 (Alias Integrity) | 2.9.0 | 341 | 18/18 resolvidos | 256 | 13 |
| **v2.10 (atual)** | **2.10.0** | **341** | **18/18 resolvidos** | **256** | **13** |

Importante: `data/compiled/v1/` continua preservado como baseline/archive v1, e os inputs v1 (`taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json`) continuam presentes.

Limitações residuais e próximos trabalhos ficam documentados no backlog em `.planning/` e não alteram o status implementado e estabilizado da versão atual:

- **FUT-01:** curadoria dos 243 itens `corpus_candidate_low_support` restantes em lotes futuros (cadência ≤40 candidatos/lote)
- **FUT-02:** resolução dos 13 itens `seed_corpus_conflict` remanescentes
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

### Como Executar

#### Execução Direta do Script (Raiz do Projeto)
Você pode executar o script local de segurança diretamente na raiz do repositório:
```bash
# Se o script tiver permissão de execução
./scripts/check-safety-guards.sh

# Caso contrário, usando bash explicitamente
bash scripts/check-safety-guards.sh
```

#### Execução via Wrapper NPM (Diretório `src/`)
Para conveniência de usabilidade local, foi configurado um script npm wrapper em [src/package.json](file:///home/jlima/Projetos/TaxonomySystem/src/package.json). Ele permite rodar a verificação de segurança a partir da pasta `src/`:
```bash
# Executar a partir do diretório /src/
npm run safety:guard
```

### Resultados e Exit Codes
- **PASS (Código de Saída: 0):** Nenhum arquivo gerado pelo Graphify em staging ou alteração indesejada em caminhos protegidos foi detectada. A workspace está em conformidade.
- **FAIL (Código de Saída: 1):** Uma ou mais violações foram encontradas. Todas as violações são listadas no stderr junto com a mensagem de política e as instruções de limite antes de encerrar o script.
- **Política de Não-Mutação:** O script é puramente de auditoria de leitura. Ele **nunca** executa comandos destrutivos ou mutantes (como `git clean`, `git reset`, `git checkout` ou `git rm`). Toda correção de estado de staging deve ser feita manualmente pelo desenvolvedor.

## 📈 Status

O **Milestone v2.10 (Integrity Gate Hardening & CI Wiring)** foi concluído em 2026-06-09 após a execução da **Phase 54**. Desde o estabelecimento do v2 como default na Phase 12, o projeto avançou por diversas rodadas de curadoria, segurança e refinamento técnico:

- **v2.1 a v2.4 (Phases 14 a 34)**: Implementação de safety guards locais (`scripts/check-safety-guards.sh`), curadoria de novos targets no seed e resolução de aliases legados persistentes.
- **v2.5 (Phases 35 a 37)**: Rebaseline completo da review queue e implementação do filtro formal de **conflict stopwords** (`data/inference/conflict_stopwords.v1.json`) para redução de ruído em substring conflict matching.
- **v2.6 (Phases 38 e 39)**: Microcuradoria e resolução estruturada dos conflitos residuais, culminando na compilação e estabilização do Milestone v2.6.
- **v2.7 (Phases 40 a 43)**: Triagem limitada dos 275 itens `corpus_candidate_low_support` em lote controlado de 30, matriz de decisão com 6 `promote_to_seed` e publicação oficial dos artefatos v2.7.
- **v2.8 (Phases 44 a 48)**: Inventário pós-v2.7, seleção de 40 candidatos, matriz de decisão com 12 `promote_to_seed` e publicação oficial dos artefatos v2.8. Ver [.planning/releases/v2.8.0-CLOSURE.md](.planning/releases/v2.8.0-CLOSURE.md).
- **v2.9 (Phases 49 a 51)**: Resolução do débito de integridade de `descriptor_aliases` (FUT-03) com adição do descritor `ylang_ylang` sob `floral/floral_white`. Publicação v2.9.0 com 18/18 alias targets válidos e 0 exceções.
- **v2.10 (Phases 52 a 54)**: Fechamento retroativo da verificação da Phase 50, implementação dos guardrails locais `verify:integrity` e `compile:quality`, configuração de CI GitHub Actions (Node 24) com provas duais de integridade, e estabilização do benchmark de stress (1500ms local, 3000ms CI).

**Estado atual:** O projeto atingiu a maturidade e estabilidade da versão **v2.10.0**, sem hard failures de compilação ou validação. Os artefatos oficiais em `data/compiled/v2/` estão alinhados, determinísticos e protegidos. Safety guards locais, guardrails de integridade e CI GitHub Actions estão operacionais. Suite Vitest com **390 testes em 56 arquivos — todos PASS**. O sistema está pronto para consumo por aplicações downstream (Layer 2+). **Nenhuma phase está ativa** — o próximo ciclo de escopo inicia com `/gsd-new-milestone` quando priorizado (ver [.planning/PROJECT.md](.planning/PROJECT.md)).

**Próximos passos planejados:**

- **FUT-01:** continuar triagem `low_support` nos 243 itens restantes em lotes limitados (≤40 candidatos/lote)
- **FUT-02:** resolver os 13 itens `seed_corpus_conflict` remanescentes quando explicitamente no escopo
- Benchmark de stress local sem `CI=true` (1500ms ceiling como tech debt documentado)
- Iniciar o próximo milestone via `/gsd-new-milestone` quando priorizado
