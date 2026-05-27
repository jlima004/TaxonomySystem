---
status: research_complete
non_authorizing: true
phase: 23
slug: v2-2-microcuration-candidate-selection
created: 2026-05-27
updated: 2026-05-27
protected_paths_touched: none
execution_readiness: awaiting_persisted_approval
artifacts_complete:
  - 23-RESEARCH.md
  - 23-PATTERNS.md
  - 23-VALIDATION.md
  - 23-01-PLAN.md
---

# Phase 23 — Discussion Log: v2.2 Microcuration Candidate Selection

## Log Summary

| Campo | Valor |
|-------|-------|
| Phase | 23 |
| Session | 2026-05-27 |
| Status | context_gathering / planning_only |
| Decisão principal | `lemon_peel add_target` selecionado como candidato prioritário v2.2 |

---

## DL-23-01: Seleção do candidato prioritário

**Data:** 2026-05-27  
**Tópico:** Qual candidato da Phase 22 priorizar para planejamento v2.2?

### Opções consideradas

| Opção | Candidato | Prós | Contras |
|-------|-----------|------|---------|
| 1 | `lemon_peel add_target` | Único add_target_candidate; corpus_count 24 (MEDIUM); citrus_fresh; microcuradoria pequena; precedente claro (Phase 20) | corpus_count 24 pode ser baixo para alguns critérios |
| 2 | `boi_de_rose manual_review_pack` | corpus_count 33; presença significativa no corpus | Ambiguidade semântica rosewood vs. rose exige julgamento humano especializado |
| 3 | `cedar alias_candidate` | corpus_count 83 (HIGH); forma abreviada comum de cedarwood | Requer prova de equivalência semântica; Phase 22 marcou como "defers to v2.3+" |
| 4 | `clover alias_candidate` | — | Mais ambíguo que cedar; pode ser descritor distinto (trevos vs. cravo) |
| 5 | Comparação planning only | Análise comparativa sem escolha de execução | Adia a decisão; informação já suficiente da Phase 22 |

### Decisão

**Selecionado: Opção 1 — `lemon_peel add_target`**

**Rationale:**
- É o **único `add_target_candidate`** da matriz inteira — categoria exclusiva, sem disputa.
- Segue o **padrão exato da Phase 20** (`petitgrain`): valid_variant, citrus/citrus_fresh, corpus_count MEDIUM, absent_target resolved via add_target.
- **Superfície mínima de impacto**: 1 descriptor, 1 família, 1 subfamília.
- **Sem julgamento humano semântico complexo**: o caso é claro (lemon_peel é uma variante legítima do lemon note).
- **Rastreável e validável**: similarity_matrix.json registra o item; taxonomy.json documenta o posicionamento; antes/depois verificável via compile /tmp.

**Status:** Decisão final para context_gathering. Aguarda aprovação explícita do usuário para avançar para research/plan.

---

## DL-23-02: Descarte dos outros candidatos

**Data:** 2026-05-27  
**Tópico:** Por que os outros 3 candidatos não são priority-1?

### boi_de_rose — Descartado como priority-1

**Razão:** `manual_review_pack` por definição (Phase 22, P-05) requer "aprovação de domain expert". A ambiguidade semântica entre "bois de rose" (rosewood — Aniba rosaeodora) e uma nota de rosa floral não é resolvível apenas por análise de corpus_count. Requer conhecimento especializado de materiais olfativos. Deferido para quando houver sessão de revisão semântica humana dedicada.

**Status:** Deferido. Não é bloqueador para v2.2; pode avançar em paralelo em fase dedicada se houver interest do usuário.

### cedar — Descartado como priority-1

**Razão:** A Phase 22 marcou `cedar → cedarwood` como `alias_candidate` com nota "defers to v2.3+". Embora corpus_count 83 seja HIGH, a prova de equivalência semântica exige:
1. Verificar se `cedar` no corpus se refere semanticamente a `cedarwood` (Cedrus atlântica, virginiana) ou a outros cedros.
2. Verificar se já existe algum `cedarwood` seed descriptor e seu posicionamento.
3. Analisar impacto de remapear 83 corpus entries.

Esse trabalho é mais complexo que um simples add_target e merece fase própria em v2.3+.

**Status:** Deferido para v2.3+.

### clover — Descartado como priority-1

**Razão:** Mais ambíguo que cedar. `clover` (Trifolium, trevo) e `clove` (Syzygium aromaticum, cravo) são plantas **completamente distintas** em perfumaria. A orthographic similarity (1-char substitution) pode ser:
- Misspelling de `clove` (erro ortográfico)
- Descriptor legítimo de trevo (notas frescas, herbáceas)
- Corpus artifact sem significado semântico

Sem evidência adicional, não é possível determinar se é alias ou descriptor distinto. Requer análise de contexto semântico mais profunda.

**Status:** Deferido. Pode ser investigado em v2.3+ como parte de um pack de alias candidates.

---

## DL-23-03: Escopo da Phase 23 e gate de aprovação

**Data:** 2026-05-27  
**Tópico:** O que esta fase entrega e o que requer aprovação?

### Entrega desta fase (context_gathering)

| Artifact | Conteúdo | Status |
|----------|----------|--------|
| `23-PREFLIGHT.md` | Hard boundaries, candidate pool | ✅ Criado |
| `23-CONTEXT.md` | Candidato selecionado, gray areas, next steps | ✅ Criado |
| `23-DISCUSSION-LOG.md` | Este documento | ✅ Criado |

### O que NÃO foi criado ainda

| Artifact | Razão |
|----------|-------|
| `23-RESEARCH.md` | Requer inspeção de `similarity_matrix.json` e `taxonomy.json` — aguarda aprovação |
| `23-PATTERNS.md` | Derivado de Research — não criar antes |
| `23-VALIDATION.md` | Contrato de validação — não criar antes do plan |
| `23-01-PLAN.md` | Plano de execução — não criar antes de Research + aprovação |

### Gate de aprovação requerido

Para avançar para research e planejamento, o usuário deve:

1. ✅ Confirmar que `lemon_peel add_target` é o candidato selecionado.
2. ✅ Autorizar inspeção de `similarity_matrix.json` e `taxonomy.json` para research.
3. ✅ Confirmar que os gray areas GR-01 a GR-05 (no `23-CONTEXT.md`) devem ser investigados no research.
4. ✅ Confirmar que os artefatos `23-RESEARCH.md` e `23-01-PLAN.md` podem ser criados na próxima sessão.

---

## DL-23-04: Conexão com precedente Phase 20

**Data:** 2026-05-27  
**Tópico:** Como a Phase 20 (petitgrain) serve de modelo para lemon_peel?

### Padrão Phase 20 que se aplica

A Phase 20 seguiu este fluxo:
```
context_gathering → research → plan → persisted approval → add_target → compile /tmp → validate → official compile
```

Para `lemon_peel`, o fluxo esperado é idêntico, com atenção especial ao:
- **Conflict triage pós-add**: Phase 20 gerou `grain↔petitgrain` como novo seed_corpus_conflict. Para `lemon_peel`, espera-se verificar se `lemon` (já seed) cria conflito circular — porém como `lemon_peel` é distinto de `lemon`, o risco é baixo mas deve ser verificado.
- **Approval traceability**: Phase 20 Plan 02 resolveu rastreabilidade de aprovação moderna. O mesmo padrão deve ser aplicado para `lemon_peel`.

### Diferença chave

`petitgrain` era um **absent target** (alias apontava para descriptor ausente). `lemon_peel` é um **valid_variant** que aparece como `seed_corpus_conflict` — o mecanismo de adição é o mesmo (add_target), mas a origem do candidato é diferente (conflito vs. alias quebrado).

---

## Status Final da Sessão (Sessão 1 — context_gathering)

| Item | Status |
|------|--------|
| Candidato selecionado | ✅ `lemon_peel add_target` |
| Hard boundaries verificados | ✅ Nenhuma mutação |
| Artifacts criados | ✅ PREFLIGHT, CONTEXT, DISCUSSION-LOG |
| Próxima ação | ⏳ Aprovação do usuário → Research |
| Execution readiness | `not_ready_for_execution` |

---

## DL-23-05: Research — Achados dos Gray Areas GR-01 a GR-05

**Data:** 2026-05-27  
**Tópico:** Resultados da inspeção read-only de `similarity_matrix.json`, `taxonomy.json` e `taxonomy-seed.v2.json`.

### GR-01: Posicionamento em citrus/citrus_fresh ✅ RESOLVIDO

`lemon_peel` está atualmente como corpus candidate em `citrus/citrus_fresh` com freq=24, review_required=true. Posicionamento proposto como seed no mesmo cluster é semanticamente válido. **Sem conflito circular com `lemon`** — são notas distintas (suco vs. casca) em perfumaria.

Seeds atuais de citrus_fresh: `lemon` (129), `grapefruit` (80), `bergamot` (53), `petitgrain` (52), `sweet_orange` (0). `lemon_peel` seria o 6º seed.

### GR-02: Conflitos pós-add ✅ RESOLVIDO (com WARN)

Inspecionados todos os 305 descritores do taxonomy.json. Achado:
- **0 corpus descriptors** têm `lemon_peel` como substring → sem novos conflicts diretos.
- **⚠️ ACHADO CRÍTICO:** `peel` (corpus, freq=70, citrus_fresh) pode gerar novo `seed_corpus_conflict` se o sistema usa lógica de substring matching bidirecional (`peel` está contido em `lemon_peel`). Estimativa: 0-1 novos conflicts pós-add. Dentro do threshold P-08 (≤ 2).

Este achado está documentado em 23-RESEARCH.md (RES-03) e 23-VALIDATION.md (INV-6) como WARN esperado.

### GR-03: Suficiência de corpus_count 24 ✅ RESOLVIDO

Corpus_count 24 = MEDIUM evidence (tier 10–49). Aprovável via P-05 (persisted approval). Argumento: valid_variant confirmado pela Phase 22, sem ambiguidade semântica, distintividade olfativa de `lemon_peel` vs. `lemon` é reconhecida em perfumaria. Comparativo: `petitgrain` (Phase 20) foi adicionado como absent target — não corpus_count comparável, mas o precedente de adição em citrus_fresh está estabelecido.

### GR-04: Impacto no review_queue ✅ RESOLVIDO

Estado atual: 316 itens (34 seed_corpus_conflict + 282 corpus_candidate_low_support). Impacto previsto:
- `lemon_peel` removido do review_queue → -1 seed_corpus_conflict
- `lemongrass` (seed=lemon, count=24) permanece no review_queue — NÃO co-adicionado
- Resultado líquido: 315 itens (ou 316 se `peel` gerar novo conflict)
- Net effect: mínimo e positivo.

### GR-05: Ordem de operações ✅ RESOLVIDO

A sequência da Phase 20 é o modelo correto:
```
Modificação seed file → compile /tmp → validar INV-1 a INV-7 → official compile → post-add triage → commit
```
Diferenças vs. Phase 20: apenas documentais (origem=valid_variant vs. absent target). Fluxo operacional idêntico.

---

## DL-23-06: Artifacts Produzidos na Sessão de Research/Planning

**Data:** 2026-05-27  
**Tópico:** Confirmação dos artifacts criados nesta sessão.

| Artifact | Status | Conteúdo principal |
|----------|--------|--------------------|
| `23-RESEARCH.md` | ✅ Criado | GR-01 a GR-05 respondidos, achado crítico peel documentado |
| `23-PATTERNS.md` | ✅ Criado | 8 padrões identificados (PAT-01 a PAT-08) |
| `23-VALIDATION.md` | ✅ Criado | 7 invariantes de validação (INV-1 a INV-7), baseline, rollback |
| `23-01-PLAN.md` | ✅ Criado | Plano completo com allowlist, waves, persisted approval gate |

**Mutations realizadas nesta sessão:** NENHUMA (todos os arquivos de dados foram apenas lidos).

---

## Status Final da Fase 23

| Item | Status |
|------|--------|
| Research GR-01 a GR-05 | ✅ Completo |
| Artifacts de planejamento | ✅ RESEARCH, PATTERNS, VALIDATION, 23-01-PLAN criados |
| Hard boundaries respeitados | ✅ Nenhuma mutação em dados protegidos |
| Próxima ação | ⏳ Persisted approval do usuário → Execução em fase separada |
| Execution readiness | `awaiting_persisted_approval` |
