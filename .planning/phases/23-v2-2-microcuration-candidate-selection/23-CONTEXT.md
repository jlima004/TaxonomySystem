---
status: context_gathering
non_authorizing: true
phase: 23
slug: v2-2-microcuration-candidate-selection
created: 2026-05-27
protected_paths_touched: none
execution_readiness: not_ready_for_execution
---

# Phase 23 — Context: v2.2 Microcuration Candidate Selection

## Herança da Phase 22

### O que foi decidido (não re-perguntar)

| Decisão | Valor | Fonte |
|---------|-------|-------|
| 34/34 seed_corpus_conflict triados | Completo | 22-01-PLAN.md |
| `lemon_peel` é o único `add_target_candidate` | Confirmado | 22-CLOSURE.md |
| `boi_de_rose` requer julgamento humano (`manual_review_pack`) | Confirmado | 22-01-PLAN.md |
| `cedar` e `clover` são `alias_candidate` (defers to v2.3+) | Confirmado | 22-01-PLAN.md |
| 14 items deferidos para v2.3+ | Confirmado | 22-CLOSURE.md |
| 282 corpus_candidate_low_support não triados linha-a-linha | Fora do escopo v2.2 | 22-RESEARCH.md |
| v2.2 execution requer fase separada com allowlist e approval persistido | Política estabelecida | 22-VALIDATION.md |

### Políticas carregadas da Phase 22

- **P-05**: `add_target_candidate` requer persisted approval, evidence review, family/subfamily fit check antes de execução.
- **P-08**: Novos add_target podem criar 0-2 novos `seed_corpus_conflict` itens (post-conflict triage step esperado).
- **P-06**: Protected triage boundary permanece ativo em toda fase v2.2+.

---

## Precedente de add_target (Phase 20)

A Phase 20 executou exatamente este padrão com `petitgrain`:

| Campo | Phase 20 (petitgrain) | Phase 23 alvo (lemon_peel) |
|-------|----------------------|---------------------------|
| Tipo | `add_target` (absent target resolution) | `add_target_candidate` (conflict triage promotion) |
| corpus_count | — (absent target) | 24 |
| subfamily | citrus_fresh | citrus_fresh |
| family | citrus | citrus |
| Origem | alias absent target | seed_corpus_conflict |
| Novo conflito pós-add | `grain`↔`petitgrain` (+1) | TBD — requer triage pós-adição |

**Aprendizado-chave da P-08**: Após adicionar `lemon_peel` como seed descriptor, o sistema deve verificar se novos `seed_corpus_conflict` surgem (ex.: `lemon` substring overlap com `lemon_peel`).

---

## Candidato Selecionado para Planejamento: `lemon_peel add_target`

### Evidência da Phase 22

| Campo | Valor |
|-------|-------|
| corpus_descriptor | `lemon_peel` |
| corpus_count | 24 |
| seed_anchor | `lemon` |
| subfamily | citrus_fresh |
| family | citrus |
| Primary Pattern (Phase 22) | `valid_variant` |
| Evidence Quality (Phase 22) | MEDIUM |
| v2.2 Recommendation (Phase 22) | `add_target_candidate` |
| Rationale (Phase 22) | "Legitimate citrus note; moderate support" |
| Classificação de risco do anchor `lemon` | 🟢 LOW |

### Justificativa da seleção

1. **Único `add_target_candidate`** da matriz de 34 itens — sem concorrência dentro da categoria.
2. **Corpus_count 24**: MEDIUM evidence — acima do threshold LOW (<10) e da fronteira gerenciável.
3. **Microcuradoria pequena**: 1 descriptor, 1 família, 1 subfamília — mínima superfície de impacto.
4. **Rastreável**: padrão bem documentado (`valid_variant` com lemon seed existente como anchor).
5. **Validável**: pode ser verificado antes/depois com `similarity_matrix.json` e `taxonomy.json`.
6. **Precedente limpo**: Phase 20 demonstrou o padrão add_target no mesmo cluster `citrus/citrus_fresh`.
7. **Sem julgamento humano complexo**: ao contrário de `boi_de_rose` (rosewood vs. rose ambiguity) ou dos alias candidates (requerem prova de equivalência semântica).

### Por que os outros candidatos não são priority-1

| Candidato | Razão para não priorizar agora |
|-----------|-------------------------------|
| `boi_de_rose` | Requer domain expert semântico — "bois de rose" vs. nota floral de rosa. Não é trivial. |
| `cedar alias_candidate` | Prova de equivalência `cedar` ↔ `cedarwood` requer análise de corpus profunda. Phase 22 marcou como "defers to v2.3+" na recomendação. |
| `clover alias_candidate` | Mais ambíguo que cedar — pode ser descritor distinto (trevos vs. cravo). Phase 22 explicitamente indica ambiguidade maior. |

---

## Escopo da Phase 23 (Context Gathering)

### O que esta fase faz

1. **Seleciona** o candidato prioritário (`lemon_peel add_target`) — ✅ feito neste documento.
2. **Coleta contexto** necessário para planejamento: dados de similarity_matrix, taxonomy fit, família/subfamília.
3. **Documenta** o discussion log das decisões tomadas.
4. **Prepara** o terreno para uma futura fase de execução separada (23-01-PLAN.md será criado após approval).

### O que esta fase NÃO faz

- ❌ Não executa curadoria.
- ❌ Não cria `23-RESEARCH.md`, `23-PATTERNS.md`, `23-VALIDATION.md`, `23-01-PLAN.md` (ainda).
- ❌ Não altera nenhum arquivo de dados ou código protegido.

---

## Gray Areas Abertas (Para Discussão)

As seguintes questões permanecem abertas e serão capturadas no `23-DISCUSSION-LOG.md`:

### GR-01: Posicionamento de `lemon_peel` na hierarquia

- `lemon_peel` deve entrar como seed descriptor em `citrus/citrus_fresh` (mesmo cluster do `lemon` anchor)?
- Há risco de conflito circular com o próprio `lemon` após a promoção?

### GR-02: Post-add conflict triage expectado

- Quais corpus descriptors podem conflitar com `lemon_peel` após adição?
- O padrão P-08 (Phase 22) estima 0-2 novos conflitos — devem ser antecipados no planejamento.

### GR-03: Corpus_count 24 — suficiência de evidência

- Phase 22 classificou como MEDIUM evidence (10-49). É suficiente para justificar promoção a seed sem coletar mais evidência?
- Comparar com `petitgrain` (Phase 20): qual era o corpus_count de petitgrain antes da promoção?

### GR-04: Impacto no review_queue

- Após `lemon_peel` virar seed, o item será removido do review_queue (não mais um `seed_corpus_conflict`)?
- Quantos novos itens podem surgir no review_queue como consequência?

### GR-05: Ordem de operações para a fase de execução

- O plan de execução deve seguir exatamente o padrão da Phase 20 (04-01 → evidence → approval → add_target → compile /tmp → validate → official compile)?
- Ou há diferenças específicas para `lemon_peel` vs. `petitgrain`?

---

## Próximos Passos (Após Esta Fase)

| Passo | Ação | Fase |
|-------|------|------|
| 1 | Fechar `23-CONTEXT.md` com decisões | Phase 23 (esta) |
| 2 | Fechar `23-DISCUSSION-LOG.md` | Phase 23 (esta) |
| 3 | Aprovação explícita do usuário | Phase 23 gate |
| 4 | Criar `23-RESEARCH.md` com dados de similarity_matrix | Phase 23 (pós-approval) |
| 5 | Criar `23-01-PLAN.md` com allowlist e approval persistido | Phase 23 (pós-approval) |
| 6 | Executar curadoria em fase separada | Phase 24+ |
