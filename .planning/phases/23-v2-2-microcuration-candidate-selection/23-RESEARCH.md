---
status: research_complete
non_authorizing: true
phase: 23
slug: v2-2-microcuration-candidate-selection
created: 2026-05-27
protected_paths_touched: none
execution_readiness: not_ready_for_execution
sources_inspected:
  - data/compiled/v2/similarity_matrix.json
  - data/compiled/v2/taxonomy.json
  - data/taxonomy/taxonomy-seed.v2.json
mutations: none
---

# Phase 23 — Research: `lemon_peel add_target`

> **Escopo:** Inspeção read-only dos arquivos autorizados. Nenhum dado foi mutado.  
> **Gate:** planning_only / not_ready_for_execution

---

## RES-01: Fonte de Dados Inspecionada

| Arquivo | Versão | Data de Geração | Observação |
|---------|--------|----------------|------------|
| `similarity_matrix.json` | 1.0.0 | 2026-05-26 | 316 itens no review_queue |
| `taxonomy.json` | — | — | 10 famílias, 18 subfamílias, 305 descritores |
| `taxonomy-seed.v2.json` | — | — | 10 famílias com listas de descritores seed |

---

## RES-02: GR-01 — Posicionamento de `lemon_peel` na hierarquia

### Estado atual (pré-adição)

`lemon_peel` está presente em `taxonomy.json` como **corpus candidate** em `citrus/citrus_fresh`:

```json
{
  "id": "lemon_peel",
  "source": "corpus",
  "frequency": 24,
  "status": "candidate",
  "review_required": true,
  "corpus_derived": true
}
```

**Posicionamento atual:** `citrus → citrus_fresh` (corpus candidate, não seed).

### Estado atual dos seeds em `citrus_fresh`

| Seed Descriptor | Frequência | Status |
|----------------|-----------|--------|
| `lemon` | 129 | curated |
| `grapefruit` | 80 | curated |
| `bergamot` | 53 | curated |
| `petitgrain` | 52 | curated |
| `sweet_orange` | 0 | curated |

**Observação:** `lemon` é o seed anchor de `lemon_peel` no conflict atual. Com frequência 129, é o seed mais frequente da subfamília.

### Estado em `taxonomy-seed.v2.json`

Seeds em `citrus/citrus_fresh` (arquivo seed source-of-truth):
```
lemon, bergamot, sweet_orange, grapefruit, petitgrain
```

`lemon_peel` **não está** no arquivo seed atual — confirmado que é candidato a adição.

### Posicionamento proposto pós-adição

```
citrus
  └── citrus_fresh
        ├── lemon         (seed existente, anchor)
        ├── bergamot      (seed existente)
        ├── grapefruit    (seed existente)
        ├── petitgrain    (seed existente - Phase 20)
        ├── sweet_orange  (seed existente)
        └── lemon_peel    ← NOVO SEED (Phase 23)
```

### Avaliação GR-01

**Risco de conflito circular com `lemon`:** BAIXO.  
`lemon_peel` é um descritor olfativo distinto de `lemon` em perfumaria — refere-se especificamente à raspagem da casca do limão (caráter mais seco, terpênico, céreo) em contraste com o suco (mais ácido, vivo). A co-existência como seeds distintos em `citrus_fresh` é semanticamente válida e não gera circularidade.  

**Conclusão GR-01:** ✅ Posicionamento em `citrus/citrus_fresh` confirmado. Sem conflito circular com `lemon`.

---

## RES-03: GR-02 — Conflitos esperados pós-adição

### Mecanismo de seed_corpus_conflict

O sistema gera `seed_corpus_conflict` quando um corpus descriptor tem substring overlap com um seed descriptor. Ao adicionar `lemon_peel` como seed, o sistema verificará: existe algum corpus descriptor onde `lemon_peel` é substring do descriptor ID (ou vice-versa)?

### Análise de overlaps potenciais

**Caso 1: Corpus descriptors que contêm `lemon_peel` como substring**

Inspecionado todos os 305 descritores em `taxonomy.json`. **Resultado: NENHUM** corpus descriptor além de `lemon_peel` ele próprio contém `lemon_peel` como substring.

**Caso 2: `lemon_peel` como substring de outros corpus descriptors**

`lemon_peel` não é prefixo/substring de nenhum outro corpus descriptor identificado.

**Caso 3: Substring reverso — componentes de `lemon_peel` como seeds futuros**

Se o sistema verifica `seed in corpus_descriptor_id`, ao ter `lemon_peel` como seed:
- Corpus descriptor `peel` (freq=70, `citrus_fresh`) → `peel` **está contido em** `lemon_peel` (lemon**_peel**)

> ⚠️ **ACHADO CRÍTICO:** `peel` (corpus candidate, freq=70, `citrus/citrus_fresh`) pode ser detectado como novo `seed_corpus_conflict` após adição de `lemon_peel` como seed, dependendo da lógica de substring matching do sistema (se verifica `corpus_id in seed_id` além de `seed_id in corpus_id`).

### Corpus descriptors com "peel" identificados

| Descriptor | Frequência | Família/Subfamília | Risco |
|-----------|-----------|------------------|-------|
| `peel` | 70 | citrus/citrus_fresh | ⚠️ MÉDIO (substring de `lemon_peel`) |
| `citrus_peel` | 10 | citrus/citrus_fresh | 🟢 BAIXO (não é substring simples) |
| `grapefruit_peel` | 8 | citrus/citrus_fresh | 🟢 BAIXO |
| `orange_peel` | 38 | citrus/citrus_fresh | 🟢 BAIXO |
| `peely` | 22 | citrus/citrus_fresh | 🟢 BAIXO |

**Estimativa de novos seed_corpus_conflicts pós-adição de `lemon_peel`:**

| Cenário | Novos Conflicts | Condição |
|---------|----------------|---------|
| Sistema verifica apenas `seed in corpus` | 0 | `lemon_peel` não é substring de nenhum corpus descriptor |
| Sistema verifica também `corpus in seed` | ~1 | `peel` pode triggar conflito com seed `lemon_peel` |
| Pior caso | 1 (`peel`) | Frequência=70, mas já é candidate em citrus_fresh |

**Conclusão GR-02:** ✅ Mínimo impacto — 0-1 novos conflicts esperados. O único risco é `peel` (freq=70) se o sistema usa lógica bidirecional. O plano de execução deve incluir step de **post-add conflict triage** para detectar e registrar este caso, sem bloquear a adição.

---

## RES-04: GR-03 — Suficiência de evidence (corpus_count 24)

### Escala de evidência do projeto

| Tier | corpus_count | Classificação |
|------|-------------|--------------|
| LOW | < 10 | Insuficiente para add_target autônomo |
| MEDIUM | 10–49 | Suficiente com persisted approval |
| HIGH | ≥ 50 | Forte suporte independente |

`lemon_peel`: corpus_count = **24** → **MEDIUM evidence**.

### Comparativo com precedentes em `citrus_fresh`

| Descriptor | Corpus Count | Tipo | Origem | Aprovado? |
|-----------|-------------|------|--------|---------|
| `petitgrain` (Phase 20) | — (absent target) | add_target | seed ausente | ✅ Sim |
| `lemon_peel` (Phase 23) | **24** | add_target | seed_corpus_conflict | A decidir |
| `lemon` (seed existente) | 129 | seed | seed original | ✅ Sim |
| `bergamot` (seed existente) | 53 | seed | seed original | ✅ Sim |
| `grapefruit` (seed existente) | 80 | seed | seed original | ✅ Sim |

> **Nota sobre petitgrain:** `petitgrain` foi adicionado na Phase 20 como **absent target** — seu corpus_count não era o critério primário de evidência (era um descriptor de seed ausente apontado por um alias). A comparação direta não é idêntica, mas o padrão de adição é análogo.

### Argumentos a favor de corpus_count 24 como suficiente

1. **Acima do threshold MEDIUM (10–49):** Classificado como evidence MEDIUM pela Phase 22.
2. **Distintividade semântica confirmada:** `lemon_peel` é um material olfativo reconhecido em perfumaria (casca de limão, distinto do suco).
3. **Frequência comparável a seeds menores:** `petitgrain` (freq=52 no taxonomy atual) tem corpus count final relativamente próximo.
4. **valid_variant confirmado:** Phase 22 classificou como `valid_variant` — não há ambiguidade semântica.
5. **Persisted approval compensa evidence MEDIUM:** O mecanismo de persisted approval (P-05) foi criado exatamente para casos MEDIUM — o usuário assume responsabilidade pelo julgamento editorial.

### Argumento de risco residual

- Corpus_count 24 é o **limiar inferior do MEDIUM tier**. Não é HIGH. 
- Se houvesse tier LOW (< 10), o caso seria rejeitado. Com 24, a decisão é editorial, não automática.

**Conclusão GR-03:** ✅ corpus_count 24 é suficiente para justificar planejamento e submissão a persisted approval. Não é HIGH evidence, mas MEDIUM com valid_variant e sem ambiguidade semântica é aprovável via mecanismo P-05.

---

## RES-05: GR-04 — Impacto na review_queue

### Estado atual da review_queue

| Tipo | Count |
|------|-------|
| `seed_corpus_conflict` | 34 |
| `corpus_candidate_low_support` | 282 |
| **Total** | **316** |

Todas as 316 entradas têm severity = `medium`.

### Impacto da promoção de `lemon_peel`

**Remoção direta:**
- `lemon_peel` sai do review_queue como `seed_corpus_conflict` → **-1 item**
- seed_corpus_conflict: 34 → **33**
- Total review_queue: 316 → **315** (antes de qualquer post-add triage)

**Adições possíveis:**
- Se `peel` (freq=70) gerar novo seed_corpus_conflict por lógica bidirecional → **+1 item potencial**
- Resultado líquido pós-triage: **315 ou 316** (net neutro a -1)

**Itens que permanecem inalterados:**
- `lemongrass` (seed=lemon, count=24) — permanece no review_queue como seed_corpus_conflict
- Todos os 282 corpus_candidate_low_support — não afetados

### Tabela de impacto

| Item | Antes | Depois | Delta |
|------|-------|--------|-------|
| `lemon_peel` no review_queue | ✅ Sim (seed_corpus_conflict) | ❌ Removido | -1 |
| `lemongrass` no review_queue | ✅ Sim (seed_corpus_conflict, seed=lemon) | ✅ Permanece | 0 |
| `peel` como novo conflict | ❌ Não existe | ⚠️ Possível +1 | +0 ou +1 |
| Total seed_corpus_conflicts | 34 | 33 ou 34 | -1 ou 0 |
| Total review_queue | 316 | 315 ou 316 | -1 ou 0 |

**Conclusão GR-04:** ✅ Impacto mínimo e positivo. Review_queue reduz em 1 item (net), com possibilidade de +1 se `peel` gerar novo conflict (neutro). O pós-add triage é obrigatório mas não bloqueante.

---

## RES-06: GR-05 — Ordem de operações vs. Phase 20

### Fluxo Phase 20 (petitgrain) — Modelo

```
1. context_gathering
2. research (inspeção similarity_matrix + taxonomy)
3. plan (23-01-PLAN.md com allowlist + persisted approval)
4. persisted_approval (usuário autoriza explicitamente)
5. add_target (editar taxonomy-seed.v2.json)
6. compile /tmp (validação isolada — não publicação)
7. validate (verificar estado antes/depois)
8. official_compile (se validação passa)
9. post-add conflict triage (verificar novos conflicts gerados)
```

### Diferenças para `lemon_peel` (Phase 23)

| Etapa | Phase 20 (petitgrain) | Phase 23 (lemon_peel) | Diferença |
|-------|----------------------|----------------------|---------|
| Origem do candidato | Absent target (alias quebrado) | seed_corpus_conflict (valid_variant) | Diferente — mas a operação add_target é idêntica |
| Anchor conflict pós-add | `grain↔petitgrain` (novo) | `peel↔lemon_peel` (possível) | Risco menor — `peel` já é candidate existente |
| Corpus_count como critério | N/A (absent target) | 24 (MEDIUM) | Novo critério a documentar no PLAN |
| Persisted approval gate | Sim (Plan 02) | Sim (a criar) | Mesmo padrão |
| compile /tmp step | Sim | Sim (obrigatório antes de official) | Mesmo padrão |

### Ordem de operações proposta para Phase 23

```
Fase Research/Planning (atual, não-executiva):
  [x] 23-RESEARCH.md (este documento)
  [ ] 23-PATTERNS.md (padrões identificados)
  [ ] 23-VALIDATION.md (contrato de validação)
  [ ] 23-01-PLAN.md (plano executável com allowlist)

Fase de Execução (futura, separada):
  [ ] Persisted approval gate (usuário aprova explicitamente)
  [ ] add_target: editar taxonomy-seed.v2.json
        → adicionar "lemon_peel" a citrus/citrus_fresh/descriptors
  [ ] compile /tmp (validação isolada)
  [ ] Validar output: lemon_peel aparece como seed curated
  [ ] Validar review_queue: lemon_peel removido do seed_corpus_conflict
  [ ] Post-add conflict triage: verificar se peel gerou novo conflict
  [ ] Official compile (se validação passa)
  [ ] Commit com mensagem rastreável
```

**Conclusão GR-05:** ✅ A ordem de operações da Phase 20 é o modelo correto. As diferenças são documentais (origem do candidato, critério corpus_count) — não operacionais. O plano pode seguir o mesmo fluxo com ajustes de rastreabilidade para o contexto de valid_variant vs. absent target.

---

## RES-07: Sumário das Respostas aos Gray Areas

| GR | Questão | Resposta | Risco Residual |
|----|---------|----------|---------------|
| GR-01 | Posicionamento em `citrus/citrus_fresh` | ✅ Confirmado. Sem conflito circular com `lemon`. | Nenhum |
| GR-02 | Conflitos pós-add | ✅ 0-1 novos conflicts. `peel` (freq=70) é risco potencial. | Baixo — peel já candidate |
| GR-03 | corpus_count 24 suficiente? | ✅ MEDIUM evidence — suficiente com persisted approval. | Baixo — decisão editorial |
| GR-04 | Impacto no review_queue | ✅ Net -1 item. Mínimo e positivo. | Nenhum |
| GR-05 | Ordem de operações | ✅ Seguir Phase 20 com ajustes documentais. | Nenhum |

---

## RES-08: Mutation Audit (Research Phase)

| Protected Path | Mutado? | Operação realizada |
|---|---|---|
| `data/taxonomy/taxonomy-seed.v2.json` | ❌ No | Read-only: listagem de seeds em citrus/citrus_fresh |
| `data/compiled/v2/similarity_matrix.json` | ❌ No | Read-only: extração de review_queue e edges |
| `data/compiled/v2/taxonomy.json` | ❌ No | Read-only: inspeção de descriptors citrus_fresh |
| Qualquer outro arquivo protegido | ❌ No | — |

**Research completo. Nenhuma mutação realizada.**
