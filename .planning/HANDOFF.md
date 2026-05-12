# GSD Handoff — TaxonomySystem

> Paused: 2026-05-12
> Workflow: `/gsd-new-project` (from `prompt.md`)
> Status: **Step 3 Complete (Questioning) → Next: Step 4 (Write PROJECT.md)**

## O que foi feito

1. ✅ **Step 1 (Setup)** — SDK init, git ok, runtime=gemini, agents NOT installed (inline mode)
2. ✅ **Step 2 (Brownfield)** — User chose "Map codebase first"
3. ✅ **Codebase Mapping** — 7 docs written to `.planning/codebase/` (commit `f86cd01`)
4. ✅ **Step 3 (Questioning)** — 4 perguntas feitas, respostas detalhadas recebidas

## O que falta

5. ⬜ **Step 4** — Write `.planning/PROJECT.md`
6. ⬜ **Step 5** — Workflow Preferences (config.json)
7. ⬜ **Step 6** — Research (inline, sem subagents)
8. ⬜ **Step 7** — Define Requirements
9. ⬜ **Step 8** — Create Roadmap
10. ⬜ **Step 9** — Done + Next Up

## Contexto capturado no Questioning

### Arquitetura em 5 camadas

```
Layer 1 — TAXONOMY (semântica pura) ← ESTE PROJETO
Layer 2 — Molecular/Physchem (xlogp, tpsa, mw)
Layer 3 — Derived Features (volatility_score, tenacity_score) ← engine existente
Layer 4 — Intelligence (similarity, accord, recommendation) ← futuro
Layer 5 — Product (API, SaaS, AI perfumer) ← futuro
```

### Decisões-chave

| # | Decisão | Detalhe |
|---|---------|---------|
| 1 | **Taxonomia NÃO contém scores físico-químicos** | volatility/tenacity vivem na Layer 3. Mas o Similarity Engine futuro combina: semantic_similarity + molecular_similarity + behavior_similarity |
| 2 | **Taxonomia é híbrida** | Estrutura manual (families, subfamilies, canonical descriptors) + refinamento estatístico do dataset (frequência, aliases, clusters) |
| 3 | **Builder first, Runtime depois** | Agora: builder que gera JSONs compilados versionados. Depois: runtime APIs |
| 4 | **Sparse similarity graph** | Apenas pares com similarity > 0.25. Formato adjacência, NÃO matriz N². Multi-dimensional (semântica + accord compatibility + perfumery tradition + descriptor overlap) |

### O que o Builder deve fazer

**Entrada:**
- `enriched_materials.json` (corpus semântico)
- Manual taxonomy seed (definição manual de families/subfamilies/descriptors)

**Processos:**
1. Normalize descriptors
2. Alias detection
3. Frequency analysis
4. Cluster suggestions
5. Similarity inference

**Saída (JSONs compilados):**
- `taxonomy.json` — family → subfamily → descriptors
- `descriptor_aliases.json` — mapa de normalização
- `similarity_matrix.json` — sparse graph (adjacency list, >0.25)

### Especificações do prompt.md

- 12-20 top-level families
- 60-120 subfamilies
- 300-800 normalized descriptors
- Descriptors: lowercase, normalized, no duplicates, no punctuation
- Subfamilies: snake_case, semantically distinct
- Aliases: handle plural/singular, inverted phrases, spelling variations

### Stack definida pelo usuário

- **Node.js + TypeScript** (explicitamente solicitado)
- Convenções do engine existente: ESM, strict TS, Vitest, zero-dependency approach

### Codebase existente (`.planning/codebase/`)

- Engine de volatilidade/tenacidade em `engine_calcula_tenacidade_volatilidade/`
- Dataset PubChem enriquecido em `data/enriched_materials.json` (70MB, gitignored)
- `src/` vazio — onde o taxonomy system será implementado

## Para retomar

Na próxima sessão, execute:

```
/gsd-new-project
```

E diga: **"Retome do HANDOFF.md — Step 4 (Write PROJECT.md)"**

O agente deve:
1. Ler `.planning/HANDOFF.md`
2. Ler `.planning/codebase/` docs
3. Ler `prompt.md`
4. Prosseguir com Step 4 em diante
