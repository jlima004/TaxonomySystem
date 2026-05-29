# Olfactory Taxonomy System

Este é o **Taxonomy Builder**, o sistema computacional de taxonomia olfativa central para uma plataforma de inteligência de fragrâncias baseada em IA. 

O projeto opera ativamente com a **v2.0.0 como versão padrão (default)** para geração e compilação de dados, enquanto a release **v1.0.0** está formalmente encerrada e arquivada como baseline estável e imutável (com seus insumos e artefatos históricos preservados).

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
# Instalar dependências (typescript, vitest)
npm install

# Rodar todos os testes vitest do construtor
npm run test

# Verificar tipos sem gerar arquivos de build
npm run typecheck

# Gerar o build e compilar os JSONs de saída a partir da raiz CLI
npm run build
npm run compile
```

## 🛠️ Regras e Convenções do Repositório

- **Linguagem**: Node.js com TypeScript (Strict Mode).
- **Paradigma**: Funcional Pura (sem classes, sem side effects).
- **Dependências**: Abordagem Zero-Dependency para as funções de runtime.
- **Workflow GSD**: O projeto adota a metodologia Get-Shit-Done (GSD). Para ver os planos gerados e o progresso, verifique os comandos listados em `GEMINI.md` ou use `/gsd-progress`.

## Current Taxonomy Status

O compiler e CLI estão completos e geram artefatos determinísticos em `data/compiled/v2/` (default) e `data/compiled/v1/` (baseline/archive). A Phase 7 foi implementada para endurecer a qualidade dos dados sem alterar o contrato dos três artefatos finais: `taxonomy.json`, `descriptor_aliases.json` e `similarity_matrix.json`.

As Phases 8, 9 e 10 criaram e expandiram `data/taxonomy/taxonomy-seed.v2.json` como seed curado. A **Phase 11** documentou readiness e política de migração. A **Phase 12** promoveu o v2 para default operacional. A **Phase 13** concluiu a estabilização inicial pós-promoção. Posteriormente, as **Phases 14 a 39** iteraram sobre o modelo v2, incluindo refinamentos de segurança, microcuradoria de descritores (como petitgrain, lemon_peel, ambergris, rosewood), limpeza sistemática de aliases, filtro de stopwords para reduzir ruído de falsos positivos e triagem final de conflitos.

Estado atual do default CLI/compiler:

- `seedPath`: `data/taxonomy/taxonomy-seed.v2.json`
- `relationsPath`: `data/inference/curated_relations.v2.json`
- `accordsPath`: `data/inference/accord_map.v2.json`
- `outputDir`: `data/compiled/v2`
- `version`: `2.6.0` (Milestone Stabilization & Closure)

Os artefatos oficiais v2 ficam em `data/compiled/v2/` e refletem todas as curadorias até a versão v2.6:

- 10 famílias, 18 subfamílias, 308 descritores totais compilados
- Matriz de similaridade com 13 arestas validadas
- Review queue reduzida para 283 itens, com zero hard failures nas gates de promoção

Importante: `data/compiled/v1/` continua preservado como baseline/archive v1, e os inputs v1 (`taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json`) continuam presentes.

Limitações residuais e próximos trabalhos ficam documentados no backlog em `.planning/` e não alteram o status implementado e estabilizado das versões atuais.

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

O **Milestone v2.6** (Stabilization & Closure) foi concluído após a execução da **Phase 39**. Desde o estabelecimento do v2 como default na Phase 12, o projeto avançou por diversas rodadas de curadoria, segurança e refinamento técnico:

- **v2.1 a v2.4 (Phases 14 a 34)**: Implementação de safety guards locais (`scripts/check-safety-guards.sh`), curadoria de novos targets no seed (petitgrain, lemon_peel, ambergris, rosewood) e resolução de aliases legados persistentes.
- **v2.5 (Phases 35 a 37)**: Rebaseline completo da review queue e implementação de um filtro formal de stopwords (Group A conflicts) para redução expressiva de ruído sistêmico de falsos positivos na similaridade de strings.
- **v2.6 (Phases 38 e 39)**: Microcuradoria e resolução estruturada dos conflitos residuais (Group B), culminando na compilação, estabilização e fechamento desta versão do repositório.

**Estado atual:** O projeto atingiu a maturidade e estabilidade da versão **v2.6**, sem nenhum hard failure de compilação ou validação. O pipeline de compilação produz artefatos limpos, determinísticos e protegidos em `data/compiled/v2/`. As validações de segurança (threat mitigations) e User Acceptance Testing (UAT) foram verificadas com êxito. O sistema se encontra pronto para consumo por aplicações downstream (Layer 2+).
