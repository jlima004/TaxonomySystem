---
status: context_gathering
non_authorizing: true
phase: 23
slug: v2-2-microcuration-candidate-selection
created: 2026-05-27
protected_paths_touched: none
execution_readiness: not_ready_for_execution
---

# Phase 23 — Preflight: v2.2 Microcuration Candidate Selection

## Phase Identity

| Field | Value |
|-------|-------|
| Phase | 23 |
| Name | v2.2 Microcuration Candidate Selection |
| Slug | v2-2-microcuration-candidate-selection |
| Status | context_gathering / not_ready_for_execution / planning_only |
| Created | 2026-05-27 |
| Predecessor | Phase 22 — Review Queue Conflict Triage for v2.2 |

## Purpose

Esta fase seleciona e prepara o próximo candidato a microcuradoria v2.2 a partir da matriz de triagem da Phase 22.
O objetivo é escolher um candidato pequeno, rastreável e validável — com foco recomendado em `lemon_peel add_target`.

Esta fase é **planning only**. Nenhuma curadoria, compile, mutação de dados ou publicação de artifact é autorizada.

---

## Hard Boundaries (Non-Negotiable)

Os seguintes caminhos são **somente leitura** nesta fase. Qualquer escrita é proibida até aprovação explícita com allowlist em fase futura:

| Path | Status |
|------|--------|
| `data/taxonomy/*` | 🔒 Read-only |
| `data/inference/*` | 🔒 Read-only |
| `data/compiled/v1/*` | 🔒 Read-only |
| `data/compiled/v2/*` | 🔒 Read-only |
| `src/cli/parse_args.ts` | 🔒 Read-only |
| `scripts/check-safety-guards.sh` | 🔒 Read-only |
| `src/package.json` | 🔒 Read-only |
| `graphify-out/*` | 🔒 Read-only (não alterar, limpar, regenerar, stagear ou commitar) |

### Explicitamente proibido nesta fase

- ❌ Executar curadoria (nenhum descritor adicionado, removido ou remapeado)
- ❌ Executar compile oficial ou em `/tmp`
- ❌ Publicar artifacts (`data/compiled/v2/*`)
- ❌ Rodar Graphify
- ❌ Alterar qualquer alias, relação ou accord
- ❌ Alterar `taxonomy-seed.v2.json` ou qualquer seed file

### Permitido nesta fase

- ✅ Criar e editar `.planning/phases/23-v2-2-microcuration-candidate-selection/*`
- ✅ Leitura de `data/compiled/v2/similarity_matrix.json` (inspeção, não mutação)
- ✅ Leitura de `data/compiled/v2/taxonomy.json` (inspeção, não mutação)
- ✅ Leitura de `data/taxonomy/taxonomy-seed.v2.json` (inspeção, não mutação)

---

## Artifacts a Criar Nesta Fase

| Artifact | Status |
|----------|--------|
| `23-PREFLIGHT.md` | ✅ Este documento |
| `23-CONTEXT.md` | 🔄 A criar (context_gathering) |
| `23-DISCUSSION-LOG.md` | 🔄 A criar (context_gathering) |
| `23-RESEARCH.md` | ❌ Não criar ainda |
| `23-PATTERNS.md` | ❌ Não criar ainda |
| `23-VALIDATION.md` | ❌ Não criar ainda |
| `23-01-PLAN.md` | ❌ Não criar ainda |

---

## Predecessores Obrigatórios

| Artifact | Phase | Status |
|----------|-------|--------|
| `22-CLOSURE.md` | 22 | ✅ Lido |
| `22-01-PLAN.md` | 22 | ✅ Lido |
| `22-RESEARCH.md` | 22 | ✅ Lido |
| `22-PATTERNS.md` | 22 | ✅ Lido |
| `22-VALIDATION.md` | 22 | ✅ Lido |

---

## Candidate Pool (da Phase 22)

Os 4 candidatos ativos originados da matriz da Phase 22:

| Candidato | Disposition | corpus_count | Complexidade | Prioridade |
|-----------|-------------|-------------|-------------|------------|
| `lemon_peel add_target` | `add_target_candidate` | 24 | 🟢 Baixa | **Recomendado** |
| `boi_de_rose manual_review_pack` | `manual_review_pack` | 33 | 🔴 Alta | Requer julgamento humano |
| `cedar alias_candidate` | `alias_candidate` | 83 | 🟡 Média | Requer prova de equivalência |
| `clover alias_candidate` | `alias_candidate` | 13 | 🟡 Média | Mais ambíguo |

---

## Execution Gate

Esta fase permanece `not_ready_for_execution` até que:

1. `23-CONTEXT.md` seja criado com a decisão de candidato selecionado
2. Aprovação explícita do usuário para o candidato escolhido
3. Fase de execução futura separada com allowlist, approval persistido e validation gates

---

## Mutation Audit (Phase 23 Preflight)

| Protected Path | Mutated? | Notes |
|---|---|---|
| `taxonomy-seed.v2.json` | ❌ No | Planning only |
| `descriptor_aliases.seed.json` | ❌ No | Planning only |
| `curated_relations.v2.json` | ❌ No | Planning only |
| `accord_map.v2.json` | ❌ No | Planning only |
| `data/compiled/v1/*` | ❌ No | Planning only |
| `data/compiled/v2/*` | ❌ No | Planning only |
| `data/inference/*` | ❌ No | Planning only |
| `src/cli/parse_args.ts` | ❌ No | Planning only |
| `scripts/check-safety-guards.sh` | ❌ No | Planning only |
| `graphify-out/*` | ❌ No | Planning only |
