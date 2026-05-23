# Olfactory Taxonomy System

Este é o **Taxonomy Builder v1**, o sistema computacional de taxonomia olfativa central para uma plataforma de inteligência de fragrâncias baseada em IA. 

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

O compiler e CLI v1 estão completos e geram artefatos determinísticos em `data/compiled/v1/`. A Phase 7 foi implementada para endurecer a qualidade dos dados sem alterar o contrato dos três artefatos finais: `taxonomy.json`, `descriptor_aliases.json` e `similarity_matrix.json`.

Os artefatos agora passam por sanitation, análise alias-aware, placement conservador de candidatos de corpus e quality gates antes da escrita final. Inputs curados de relações e accord alimentam o sparse graph, enquanto avisos e itens de revisão ficam visíveis em `similarity_matrix.json.review_queue`.

As Phases 8 e 9 criaram e expandiram `data/taxonomy/taxonomy-seed.v2.json` como candidato curado, não como default. O seed v2 candidate inclui a expansão Phase 8 `gourmand/vanilla/vanilla` e a expansão Phase 9 Round 2 para `green`, `fruity` e `spicy`, com relations/accords v2 em `data/inference/curated_relations.v2.json` e `data/inference/accord_map.v2.json`.

O v2-expanded foi validado contra o baseline v1 em `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/curation/v1-v2-comparison.md`: hard failures `none`, `relation_count=11`, `accord_count=10`, aliases sem Round 2 additions e `fresh_spice` permanece ausente/deferido. O gap de `vanilla` foi parcialmente resolvido via `warm_spice`.

Importante: `src/cli/parse_args.ts` continua apontando os defaults para v1 (`taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json`, `data/compiled/v1`, version `1.0.0`). O v2 precisa ser usado por caminhos explícitos até existir um plano separado de promoção com aprovação humana, migração e rollback.

Limitações conhecidas do v1:

- Corpus candidates continuam `review_required` e não são verdade curada.
- Inputs curados de relações e accord ainda são mínimos, então o grafo de similaridade permanece intencionalmente esparso.
- Alias candidates continuam fora do artifact autoritativo de aliases; apenas aliases curados entram em `descriptor_aliases.json`.

Limitações conhecidas do v2 candidate:

- `fresh_spice` permanece deferido porque não há descriptor ou scaffold/gap aprovado para esse endpoint.
- `ylang ylang -> ylang_ylang` permanece como legacy alias soft finding/deferred cleanup.
- O v2 ainda não é default e não deve substituir `data/compiled/v1/` sem plano futuro aprovado.

Limitações residuais e próximos trabalhos ficam documentados em `.planning/` e não alteram o status implementado das Phases 7, 8 e 9.

## 📈 Status

O **Milestone v1** de compilação da taxonomia (`Phase 6`) foi concluído e validado tecnicamente. A **Phase 7** implementou hardening de qualidade e inferência. As **Phases 8 e 9** concluíram a curadoria do seed v2 candidate, incluindo a expansão green/fruity/spicy e a validação comparativa v1-v2 com zero hard failures.

Estado atual: v1 continua default operacional; v2-expanded é candidate validado para uso explícito e futura avaliação de promoção.
