---
status: validation_contract_complete
non_authorizing: true
phase: 23
slug: v2-2-microcuration-candidate-selection
created: 2026-05-27
protected_paths_touched: none
execution_readiness: not_ready_for_execution
derived_from:
  - 23-RESEARCH.md
  - 23-PATTERNS.md
---

# Phase 23 — Validation Contract: `lemon_peel add_target`

> **Escopo:** Este documento define os critérios de aceitação e gates de validação para a execução futura.  
> **Status:** Contrato de validação — não autoriza execução. A execução requer aprovação separada do usuário.

---

## VAL-01: Escopo de Validação

Este contrato cobre a validação da operação `add_target` de `lemon_peel` em `citrus/citrus_fresh`.

| Campo | Valor |
|-------|-------|
| Operação | `add_target` |
| Candidato | `lemon_peel` |
| Família | `citrus` |
| Subfamília | `citrus_fresh` |
| Arquivo alvo | `data/taxonomy/taxonomy-seed.v2.json` |
| Compile alvo | `/tmp` (pré-validação), seguido de oficial |

---

## VAL-02: Estado Baseline (Pré-Execução)

### Baseline — `taxonomy-seed.v2.json`

Seeds atuais em `citrus/citrus_fresh`:
```
["lemon", "bergamot", "sweet_orange", "grapefruit", "petitgrain"]
```
**Count:** 5 seeds

### Baseline — `taxonomy.json` (citrus_fresh)

| Descriptor | Source | Status | Frequency |
|-----------|--------|--------|-----------|
| `lemon` | seed | curated | 129 |
| `grapefruit` | seed | curated | 80 |
| `bergamot` | seed | curated | 53 |
| `petitgrain` | seed | curated | 52 |
| `sweet_orange` | seed | curated | 0 |
| `lemon_peel` | corpus | candidate | 24 |

### Baseline — `similarity_matrix.json` (review_queue)

| Campo | Valor |
|-------|-------|
| Total review_queue | 316 |
| seed_corpus_conflicts | 34 |
| corpus_candidate_low_support | 282 |
| `lemon_peel` no review_queue | ✅ Presente (seed_corpus_conflict, severity=medium) |

---

## VAL-03: Invariantes de Validação Pós-Execução

### INV-1: Promoção de `lemon_peel` a seed

**Verificar em:** `taxonomy.json` (pós-compile /tmp)

**Condição de sucesso:**
```json
{
  "id": "lemon_peel",
  "source": "seed",
  "status": "curated",
  "review_required": false,
  "corpus_derived": false
}
```

**Condição de falha:** `source: corpus` ou `status: candidate` ou `review_required: true` → **BLOQUEANTE**

---

### INV-2: `lemon_peel` removido do review_queue

**Verificar em:** `similarity_matrix.json` (pós-compile /tmp)

**Condição de sucesso:** Nenhum item no `review_queue` com `affected.descriptor: lemon_peel`

**Condição de falha:** `lemon_peel` ainda aparece como `seed_corpus_conflict` → **BLOQUEANTE**

---

### INV-3: `lemon` permanece seed (sem degradação do anchor)

**Verificar em:** `taxonomy.json` e `taxonomy-seed.v2.json`

**Condição de sucesso:**
- `lemon` permanece com `source: seed` e `status: curated` em `taxonomy.json`
- `lemon` permanece na lista de descriptors de `citrus/citrus_fresh` em `taxonomy-seed.v2.json`

**Condição de falha:** `lemon` removido, rebaixado ou com `review_required: true` → **BLOQUEANTE**

---

### INV-4: Count de seeds em `citrus_fresh` aumenta de 5 para 6

**Verificar em:** `taxonomy.json` (pós-compile /tmp)

**Condição de sucesso:** 6 descritores com `source: seed` em `citrus_fresh`

**Condição de falha:** Count diferente de 6 → **BLOQUEANTE**

---

### INV-5: Nenhum seed pré-existente removido ou alterado

**Verificar em:** `taxonomy.json` (pós-compile /tmp)

Seeds que devem permanecer intactos:

| Seed | Source | Status | Frequency esperada |
|------|--------|--------|--------------------|
| `lemon` | seed | curated | ≥ 129 |
| `grapefruit` | seed | curated | ≥ 80 |
| `bergamot` | seed | curated | ≥ 53 |
| `petitgrain` | seed | curated | ≥ 52 |
| `sweet_orange` | seed | curated | ≥ 0 |

**Condição de falha:** Qualquer seed acima com source, status ou frequência alterada → **BLOQUEANTE**

---

### INV-6: Post-add conflict count ≤ 2

**Verificar em:** `similarity_matrix.json` (pós-compile /tmp)

**Condição de sucesso:** Novos itens `seed_corpus_conflict` com `seed_descriptor: lemon_peel` ≤ 2

**Condição de falha:** ≥ 3 novos conflicts não documentados → **BLOQUEANTE**

**Caso específico monitorado:**
- `peel` (freq=70): Se aparecer como novo seed_corpus_conflict → **documentar como item esperado, não bloquear**

---

### INV-7: `lemongrass` permanece no review_queue

**Verificar em:** `similarity_matrix.json` (pós-compile /tmp)

`lemongrass` (corpus, freq=24, seed_anchor=lemon) **não** deve ser promovido junto com `lemon_peel`. São candidatos distintos.

**Condição de sucesso:** `lemongrass` permanece em `seed_corpus_conflict` no review_queue com `seed_descriptor: lemon`

**Condição de falha:** `lemongrass` removido do review_queue sem instrução explícita → **BLOQUEANTE**

---

## VAL-04: Gate de Validação — Compile /tmp

A validação deve ser executada **exclusivamente em `/tmp`** antes de qualquer compile oficial.

### Sequência obrigatória

```
1. Editar taxonomy-seed.v2.json  (add lemon_peel à lista de citrus_fresh)
2. Compile /tmp                  (não oficial — não gera artifacts em data/compiled/)
3. Inspecionar taxonomy.json /tmp
4. Inspecionar similarity_matrix.json /tmp
5. Verificar INV-1 a INV-7
6. Se TODOS os invariantes passam → autorizar official compile
7. Se QUALQUER invariante BLOQUEANTE falha → reverter e reportar
```

### Critério de aprovação para official compile

| Invariante | Tipo | Resultado Mínimo |
|-----------|------|-----------------|
| INV-1 | Bloqueante | ✅ PASS |
| INV-2 | Bloqueante | ✅ PASS |
| INV-3 | Bloqueante | ✅ PASS |
| INV-4 | Bloqueante | ✅ PASS |
| INV-5 | Bloqueante | ✅ PASS |
| INV-6 | Bloqueante (se ≥3) | ✅ PASS ou WARN (se 1-2 conflicts) |
| INV-7 | Bloqueante | ✅ PASS |

**Threshold:** 7/7 invariantes PASS (ou WARN aceitável em INV-6 se ≤ 2 novos conflicts documentados).

---

## VAL-05: Rollback Plan

Se qualquer invariante bloqueante falhar:

1. **Não executar official compile**
2. **Reverter** `taxonomy-seed.v2.json` para estado baseline (remover `lemon_peel` da lista)
3. **Documentar** o motivo da falha no `23-DISCUSSION-LOG.md`
4. **Reportar** ao usuário com evidência do invariante que falhou
5. **Não commitar** nenhuma alteração em dados protegidos

O rollback é de **1 arquivo** (`taxonomy-seed.v2.json`) — operação trivial de desfazer.

---

## VAL-06: Commit de Validação

Após official compile bem-sucedido, o commit deve seguir o padrão:

```
feat(taxonomy): add lemon_peel as seed descriptor in citrus/citrus_fresh [Phase 23]

- Promoted lemon_peel from corpus candidate (freq=24, MEDIUM evidence) to seed
- Pattern: valid_variant, anchor=lemon, subfamily=citrus_fresh
- Predecessor: Phase 20 (petitgrain add_target precedent)
- Persisted approval: [data] by [usuário]
- All 7 validation invariants PASS
- Review queue delta: -1 (lemon_peel removed from seed_corpus_conflicts)
- Post-add conflict triage: [N] new conflicts (expected: 0-1)
```

---

## VAL-07: Artefatos de Evidência Pós-Execução

Após execução bem-sucedida, os seguintes artefatos devem ser produzidos:

| Artefato | Conteúdo |
|---------|---------|
| Snapshot pré-execução | Estado de taxonomy.json citrus_fresh antes |
| Snapshot pós-execução | Estado de taxonomy.json citrus_fresh depois |
| Review queue delta | Comparação review_queue antes/depois |
| Post-add conflict triage | Lista de novos seed_corpus_conflicts (se houver) |
| Invariant checklist | INV-1 a INV-7 com status PASS/FAIL/WARN |
