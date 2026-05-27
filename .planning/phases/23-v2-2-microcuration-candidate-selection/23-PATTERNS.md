---
status: patterns_complete
non_authorizing: true
phase: 23
slug: v2-2-microcuration-candidate-selection
created: 2026-05-27
protected_paths_touched: none
execution_readiness: not_ready_for_execution
derived_from: 23-RESEARCH.md
---

# Phase 23 — Patterns: `lemon_peel add_target`

> Derivado de `23-RESEARCH.md`. Captura padrões identificados para uso no 23-01-PLAN.md.

---

## PAT-01: Padrão de Origem — `valid_variant` via `seed_corpus_conflict`

### Descrição

`lemon_peel` chegou ao candidato pool via mecanismo diferente do `petitgrain` (Phase 20):

| Propriedade | `petitgrain` (Phase 20) | `lemon_peel` (Phase 23) |
|------------|------------------------|------------------------|
| **Origem** | Alias apontando para absent target | seed_corpus_conflict no review_queue |
| **Tipo** | `add_target` (resolução de absent target) | `add_target_candidate` (promoção de valid_variant) |
| **Evidence** | Alias evidence (ausência confirmada) | corpus_count = 24 (MEDIUM) |
| **Pattern Phase 22** | N/A (precedente Phase 20) | `valid_variant` |
| **Mecanismo** | Alias chain quebrada | Substring overlap seed/corpus |

### Implicação para o PLAN

O **mecanismo de adição** (`add_target` em `taxonomy-seed.v2.json`) é idêntico. A **documentação de rastreabilidade** deve capturar a origem diferente: este não é um absent target — é uma promoção editorial de corpus candidate com evidence MEDIUM.

---

## PAT-02: Padrão de Família — `citrus/citrus_fresh`

### Cluster atual de seeds em `citrus_fresh`

```
lemon         freq=129  ← anchor do seed_corpus_conflict
grapefruit    freq=80
bergamot      freq=53
petitgrain    freq=52   ← adicionado Phase 20
sweet_orange  freq=0
```

### Adição proposta

```
lemon_peel    freq=24   ← Phase 23 (corpus_derived → seed promoted)
```

### Padrão observado

- **Phase 20** estabeleceu o padrão de adicionar seeds em `citrus_fresh` com corpus_derived=true → source=seed.
- `petitgrain` foi o 5º seed de `citrus_fresh`. `lemon_peel` seria o 6º.
- O cluster tem precedente de aceitar seeds com frequência baixa: `sweet_orange` tem freq=0 (seed por autoridade semântica, não corpus).
- `lemon_peel` com freq=24 está acima de qualquer seed atual por frequência absoluta — é um acréscimo defensável.

### Pattern aplicável ao PLAN

O PLAN deve adicionar `lemon_peel` à lista `descriptors` em `citrus/citrus_fresh` no `taxonomy-seed.v2.json`, seguindo exatamente a estrutura existente (apenas o string do ID, sem metadados adicionais — a estrutura do seed file usa lista de strings).

---

## PAT-03: Padrão de Post-Add Conflict Triage

### Fonte: Policy P-08 (Phase 22)

> "Novos add_target podem criar 0-2 novos `seed_corpus_conflict` itens (post-conflict triage step esperado)."

### Risco identificado no Research

- **`peel`** (corpus candidate, freq=70, `citrus/citrus_fresh`) → possível novo `seed_corpus_conflict` se sistema usa lógica de substring matching bidirecional (`corpus in seed`).
- Todos os outros corpus descriptors com "peel" (`citrus_peel`, `grapefruit_peel`, `orange_peel`, `peely`) **não** triggam este padrão (não são substrings de `lemon_peel`).

### Padrão do post-add triage

Após adição de `lemon_peel` como seed:

1. **Compilar em `/tmp`** (não official) para capturar novo estado da matrix
2. **Inspecionar review_queue resultante** para itens novos com `seed_descriptor: lemon_peel`
3. **Verificar especificamente `peel`** no novo review_queue
4. **Se `peel` aparecer como novo seed_corpus_conflict:** documentar no PLAN e registrar como item deferido (não bloqueia a adição)
5. **Threshold de bloqueio:** ≥ 3 novos conflicts não documentados bloqueia official compile

### Precedente Phase 20

Na Phase 20, o pós-add de `petitgrain` gerou o conflict `grain↔petitgrain` (seed=petitgrain, corpus=grain, count=14). Este item aparece hoje na review_queue como `seed_corpus_conflict`. O mesmo padrão se aplica aqui.

---

## PAT-04: Padrão de Evidence Threshold — MEDIUM com Persisted Approval

### Regra P-05 (Phase 22)

> "`add_target_candidate` requer persisted approval, evidence review, family/subfamily fit check antes de execução."

### Como MEDIUM evidence passa o gate

| Requisito P-05 | Status para lemon_peel |
|----------------|----------------------|
| Persisted approval explícito do usuário | ⏳ A obter no PLAN |
| Evidence review | ✅ Research concluído (RES-04) |
| Family/subfamily fit check | ✅ citrus/citrus_fresh confirmado (RES-02) |
| valid_variant confirmado | ✅ Phase 22 classificou como valid_variant |

**Pattern:** MEDIUM evidence (10–49) NÃO é auto-aprovável. Requer persisted approval explícito. O PLAN deve conter uma seção de approval gate com declaração formal de aprovação.

---

## PAT-05: Padrão de Rastreabilidade de Aprovação

### Referência: Phase 20 — Plan 02

A Phase 20 criou um mecanismo de rastreabilidade de aprovação moderna. O PLAN da Phase 23 deve replicar este padrão com os seguintes elementos:

| Campo de Rastreabilidade | Valor para Phase 23 |
|--------------------------|---------------------|
| Candidate | `lemon_peel` |
| Action | `add_target` |
| Family | `citrus` |
| Subfamily | `citrus_fresh` |
| corpus_count | 24 |
| Evidence tier | MEDIUM |
| Pattern | valid_variant |
| Approved by | [usuário] |
| Approval date | [data da aprovação] |
| Phase ref | Phase 23 |
| Plan ref | 23-01-PLAN.md |
| Predecessor | Phase 20 (petitgrain precedent) |

Este bloco deve aparecer explicitamente no `23-01-PLAN.md` como seção `## Persisted Approval Gate`.

---

## PAT-06: Padrão de Invariantes de Validação

### Invariantes obrigatórios para considerar o add_target bem-sucedido

| # | Invariante | Verificação |
|---|-----------|------------|
| INV-1 | `lemon_peel` aparece como `source: seed` em `taxonomy.json` | Inspecionar taxonomy.json pós-compile |
| INV-2 | `lemon_peel` tem `status: curated` em `taxonomy.json` | Inspecionar taxonomy.json pós-compile |
| INV-3 | `lemon_peel` NÃO aparece mais no `review_queue` como `seed_corpus_conflict` | Inspecionar `similarity_matrix.json` pós-compile |
| INV-4 | `lemon` permanece como seed em `citrus_fresh` (sem degradação do seed anchor) | Inspecionar taxonomy.json pós-compile |
| INV-5 | Total de seeds em `citrus_fresh` aumenta de 5 para 6 | Contar seeds pós-compile |
| INV-6 | Nenhum seed pré-existente em `citrus_fresh` foi removido ou alterado | Comparar antes/depois |
| INV-7 | Post-add conflict count ≤ 2 (dentro do estimado P-08) | Contar novos seed_corpus_conflicts |

---

## PAT-07: Padrão Diferenciador `lemon_peel` vs. `lemongrass`

### Importante: Dois corpus descriptors com seed=lemon

Ambos `lemon_peel` e `lemongrass` estão no review_queue com:
- `seed_descriptor: lemon`
- `corpus_count: 24`
- `severity: medium`

**Por que só `lemon_peel` é `add_target_candidate` e `lemongrass` não?**

| Critério | `lemon_peel` | `lemongrass` |
|----------|-------------|-------------|
| Relação com `lemon` | Valid variant (mesma planta, parte diferente) | Planta diferente (*Cymbopogon citratus*) |
| Phase 22 Pattern | `valid_variant` | `alias_candidate` ou descriptor diferente |
| Disposição Phase 22 | `add_target_candidate` | Não promovido (deferido) |
| Família semântica | Citrus (limão — Citrus limon) | Herbal/grassy (capim-limão) |

**Implicação para o PLAN:** O PLAN deve explicitamente documentar que `lemongrass` **não** é co-adicionado com `lemon_peel`. São candidatos completamente distintos com disposições diferentes.

---

## PAT-08: Sumário de Padrões para o PLAN

| Padrão | Ação no PLAN |
|--------|-------------|
| PAT-01 | Documentar origem valid_variant, não absent target |
| PAT-02 | Adicionar string `"lemon_peel"` à lista descriptors em citrus/citrus_fresh do seed file |
| PAT-03 | Incluir step obrigatório de post-add conflict triage (verificar `peel`) |
| PAT-04 | Incluir persisted approval gate explícito antes de qualquer execução |
| PAT-05 | Incluir bloco de rastreabilidade de aprovação |
| PAT-06 | Incluir checklist de 7 invariantes de validação |
| PAT-07 | Documentar explicitamente que `lemongrass` NÃO é co-adicionado |
