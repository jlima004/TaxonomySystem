# Olfactory Taxonomy System

## What This Is

Sistema computacional de taxonomia olfativa para uma plataforma de inteligência de fragrâncias baseada em IA. Constrói uma hierarquia semântica (families → subfamilies → descriptors) a partir de um corpus de materiais enriquecidos com dados moleculares PubChem, gerando artefatos JSON compilados e versionados que alimentam engines de similaridade, geração de acordes, busca semântica e sistemas de recomendação.

## Core Value

Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Engine de volatilidade/tenacidade com scores normalizados [0,1] — existing (`engine_calcula_tenacidade_volatilidade/`)
- ✓ Dataset de materiais enriquecido com propriedades PubChem (CID, SMILES, molecular weight, XLogP, TPSA, rotatable bonds) — existing (`data/enriched_materials.json`)
- ✓ Arquitetura funcional pura, zero-dependency, TypeScript strict — existing (padrão estabelecido)
- ✓ Pipeline de normalização de descriptors (lowercase, sem pontuação, sem duplicatas, agrupamento semântico) — validated in Phase 3 (`src/normalizer/`)
- ✓ Inferência de similaridade multi-dimensional (semântica + compatibilidade de acordes + tradição perfumística + aliases fracos) — validated in Phase 5 (`src/inference/`)
- ✓ Taxonomy Builder CLI que processa corpus + seed manual e gera artefatos compilados — validated in Phase 6 (`src/cli/`, `src/compiler/`)
- ✓ `taxonomy.json`, `descriptor_aliases.json` e `similarity_matrix.json` compilados, versionados e schema-validos — validated in Phase 6 (`data/compiled/v1/`)
- ✓ Schema validation all-or-nothing dos artefatos de saída — validated in Phase 6 (`src/compiler/validate_output.ts`)

### Active

<!-- Current scope. Building toward these. -->

Milestone v1 builder scope is complete. Next active scope should be defined in the next milestone.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Scores físico-químicos na taxonomia — vivem na Layer 3 (Derived Features), não na Layer 1 (semântica pura)
- Runtime APIs — Milestone v1 é "Builder first", APIs vêm depois
- Similarity Engine combinado (semantic + molecular + behavior) — futuro Layer 4 (Intelligence)
- Produto final (API SaaS, AI perfumer) — futuro Layer 5
- Modelagem química — engine existente já cobre propriedades moleculares
- Hierarquias excessivamente profundas — v1 prioriza clareza e utilidade computacional
- Completude acadêmica — foco pragmático operacional

## Context

### Arquitetura em 5 Camadas

```
Layer 1 — TAXONOMY (semântica pura)              ← ESTE PROJETO
Layer 2 — Molecular/Physchem (xlogp, tpsa, mw)   ← engine existente
Layer 3 — Derived Features (volatility, tenacity)  ← engine existente
Layer 4 — Intelligence (similarity, accord, rec)   ← futuro
Layer 5 — Product (API, SaaS, AI perfumer)         ← futuro
```

### Codebase Existente

- **Engine de volatilidade/tenacidade** em `engine_calcula_tenacidade_volatilidade/` — pacote npm independente, TypeScript strict, Vitest, 22 testes, arquitetura funcional pura
- **Dataset PubChem enriquecido** em `data/enriched_materials.json` (~70MB, gitignored) — pipeline offline TGSC + Scents & Flavors, 67.1% enrichment coverage
- **`src/`** — Taxonomy Builder TypeScript package with loaders, normalizer, analysis, inference, compiler, CLI, and Vitest coverage
- Documentação do engine em português em `docs/`

### Abordagem Híbrida da Taxonomia

A taxonomia combina dois eixos:
1. **Estrutura manual** — families, subfamilies e canonical descriptors definidos por expertise perfumística
2. **Refinamento estatístico** — frequência, aliases, clusters e inferências derivadas do corpus de materiais

### Entradas do Builder

- `enriched_materials.json` — corpus semântico (propriedades olfativas dos materiais, odor descriptions, usage categories)
- Manual taxonomy seed — definição manual da hierarquia base (families/subfamilies/descriptors canônicos)

### Saídas do Builder (JSONs compilados versionados)

- `taxonomy.json` — family → subfamily → descriptors
- `descriptor_aliases.json` — mapa de normalização
- `similarity_matrix.json` — sparse graph (adjacency list, threshold >0.25)

## Constraints

- **Stack**: Node.js + TypeScript — explicitamente solicitado, alinhado com engine existente
- **Convenções**: ESM modules, TypeScript strict (noUncheckedIndexedAccess, exactOptionalPropertyTypes), Vitest, zero-dependency approach
- **Estilo de código**: Arrow functions, no semicolons, snake_case files, camelCase functions, PascalCase types, UPPER_SNAKE_CASE constants
- **Arquitetura**: Funcional pura (sem classes, sem mutação de estado, sem side effects) — padrão do engine existente
- **Dados**: `enriched_materials.json` é ~70MB e gitignored — streaming/pagination necessário para processamento
- **Formato de similaridade**: Sparse graph (adjacência, NÃO matriz N²) — apenas pares com similarity >0.25
- **Dimensões de similaridade**: Multi-dimensional (semântica + compatibilidade de acordes + tradição perfumística + overlap de descriptors)
- **Taxonomia v1**: 12-20 families, 60-120 subfamilies, 300-800 descriptors normalizados

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Taxonomia NÃO contém scores físico-químicos | Separação de concerns — volatility/tenacity vivem na Layer 3. Similarity Engine futuro combina: semantic + molecular + behavior | — Pending |
| Taxonomia é híbrida (manual + estatística) | Estrutura manual garante qualidade semântica, refinamento estatístico do dataset garante cobertura e descobre aliases/clusters | — Pending |
| Builder first, Runtime depois | v1 gera JSONs compilados versionados. APIs e runtime vêm no próximo milestone | Validated in Phase 6 |
| Sparse similarity graph (adjacência, não N²) | Escala melhor com 60-120 subfamilies. Apenas pares relevantes (>0.25). Multi-dimensional | — Pending |
| Zero-dependency approach | Alinhado com engine existente. Sem bibliotecas externas em runtime | — Pending |
| Arquitetura funcional pura | Padrão estabelecido pelo engine. Funções puras, sem classes, sem mutação | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-21 after Phase 6 completion*
