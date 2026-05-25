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
- ✓ Pipeline hardening for descriptor sanitation, alias-aware analysis, conservative candidate placement, deterministic review queue and compile quality gates — validated in Phase 7

### Active

<!-- Current scope. Building toward these. -->

Phase 14 is active for context gathering only. Phase 12 promoted taxonomy seed v2 to default after persisted final approval and Gates 0 through 6, and Phase 13 closed post-promotion stabilization with no blockers. `DEFAULT_PATHS` in `src/cli/parse_args.ts` point to v2 seed, relation, accord, output and version values. Official `data/compiled/v2` artifacts are present. v1 remains preserved as baseline/archive with rollback validated. No Phase 14 curation, taxonomy data mutation, compiled artifact regeneration or executable planning is authorized yet.

### Known v1 Semantic Limitations

<!-- Post-Phase 7 findings. These do not invalidate the technical Phase 7 completion. -->

- Generated artifacts in `data/compiled/v1/` are deterministic, schema-valid and CLI-compilable, but they are not yet a final curated fragrance taxonomy.
- Current v1 seed has 3 families, 6 subfamilies and 21 seed descriptors; the v2 default has 10 families, 18 subfamilies and 39 seed descriptors.
- `taxonomy.json` v1 has 177 descriptors; v2 default has 303 descriptors.
- Corpus candidates remain review-required evidence and are not curated truth.
- `similarity_matrix.json` v1 has 6 edges; v2 default has 13 edges with all 18 subfamilies connected.
- `similarity_matrix.json.review_queue` has 317 items in v2 default (down from 427 in v1), mostly `corpus_candidate_low_support`.
- Remaining zero-frequency seed descriptors are `bitter_orange`, `sweet_orange`, and `tree_moss` (inherited from v1, no new zero-frequency seeds added in Round 3).
- Phase 12 executed the controlled and reversible default switch; v2 is now the CLI/compiler default. v1 remains preserved as baseline/archive with rollback validated.

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

### Architecture Notes: Normalization, Sanitation And Curation

These notes describe current architecture boundaries and Phase 8 discussion boundaries.

- The current normalizer transforms input strings into canonical descriptor IDs.
- Sanitization decides whether a normalized string is a valid olfactive descriptor or technical/textual noise before statistics.
- Analysis receives descriptors that are sanitized and canonicalized through curated aliases where applicable.
- Inference consumes explicit noise and placement evidence instead of inferring curation quality from raw descriptor strings alone.
- The compiler should remain deterministic artifact materialization and must not become the curation layer.

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
| v1 artifacts remain structurally valid despite semantic noise | Phase 6 validated schemas, determinism and CLI behavior; data quality hardening is a future curation concern, not a retroactive Phase 6 failure | Logged after Phase 6 |
| Future hardening must not silently promote corpus evidence | Corpus candidates, alias merges, relation bootstraps and accord bootstraps require explicit curated inputs or review signals | Logged after Phase 6 |
| Phase 8 separates manual curation from pipeline hardening | Phase 7 resolved hardening concerns; seed expansion now requires expert/manual decisions before planning or implementation | Complete / verified |
| Phase 9 is a second curated expansion round, not v2 promotion | v2 promotion requires minimum group coverage, graph coverage, alias quality and zero hard failures; Phase 9 expands seed only | Complete / verified |
| Phase 10 executed third curated expansion round without v2 promotion | Added `amber_resinous`, `animalic` and `fresh_spice`/`anise` families, targeted `musky -> musk` alias, approved Round 3 relation/accord inputs, and validated v1-v2 with zero hard failures | Complete / verified |
| Phase 11 captures promotion readiness/default migration policy only | v2 remains candidate-only; PROMO-D-01 through PROMO-D-53 define strict readiness, soft finding dispositions, alias/graph/review queue gates, artifact strategy, migration mechanics, rollback and release process | Context captured |
| Phase 12 executed controlled and reversible default switch | v2 promoted to default after persisted approval, revalidation, official artifact publication, atomic `DEFAULT_PATHS` switch, post-switch validation and rollback dry-run. v1 preserved as baseline/archive | Complete / closed |
| Phase 14 opens v2.1 backlog triage as context gathering only | Post-Phase 13 backlog areas need prioritization before any future v2.1 curation or process work. Source taxonomy files, compiled artifacts, `src/cli/parse_args.ts` and `graphify-out/*` remain protected during context gathering | Active / not ready for execution |

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
*Last updated: 2026-05-25 after opening Phase 14 context gathering*
