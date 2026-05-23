# Phase 9: Taxonomy Seed v2 Expansion Round 2 - Context

> **Canonical decisions document.** Extracted from `09-DISCUSSION-LOG.md` after all 7 areas were discussed.
> This document is the authoritative input for planning, research, and execution agents.

**Date:** 2026-05-23
**Phase:** 09-taxonomy-seed-v2-expansion-round-2
**Status:** context_captured
**Execution readiness:** not_ready_for_execution
**Decision count:** 69 (R2-D-01 through R2-D-69)

---

## Phase Boundary

Phase 9 is a second curated expansion wave for `taxonomy-seed.v2.json`. Phase 8 established the v2 candidate seed with a minimal first expansion (gourmand/vanilla/vanilla). Phase 9 adds more families, subfamilies and descriptors through manual curation.

### Hard Constraints

- v2 remains candidate seed only; **no promotion to default**.
- `taxonomy-seed.v1.json` must **not** be edited.
- `data/compiled/v1/` must **not** be overwritten.
- `DEFAULT_PATHS` must **not** be altered.
- Corpus candidates must **not** be auto-promoted.
- No aliases/relations/accords without approval/rationale/evidence in the workbook.
- Approval in chat/transcript is **not** sufficient; must be persisted in workbook.

### Post-Phase 8 Baseline

| Metric | V1 | V2 (post-Phase 8) |
|--------|----|--------------------|
| Families | 3 | 4 |
| Subfamilies | 6 | 7 |
| Seed descriptors | 21 | 22 |
| Review queue | 427 | 403 |
| Graph edges | 6 | 6 |
| Added in Phase 8 | — | gourmand/vanilla/vanilla |

Known soft warnings carried forward:
- `vanilla` has no relation/accord approved (gap accepted).
- `ylang ylang -> ylang_ylang` has absent target in minimal seed (legacy alias deferred).

---

## 1. Expansion Scope

### R2-D-01 through R2-D-04: Group Selection

**Decision:** 3 priority groups for this round.

| Group | Status |
|-------|--------|
| `green` | **Selected** |
| `fruity` | **Selected** |
| `spicy` | **Selected** |
| `amber_resinous` | Deferred to Round 3 |
| `animalic` | Deferred to Round 3 |

- R2-D-01: Phase 09 adotará 3 groups prioritários: `green`, `fruity`, `spicy`.
- R2-D-02: `amber_resinous` e `animalic` ficam deferidos para uma terceira rodada de expansão.
- R2-D-03: A seleção de 3 groups não implica inclusão automática de todas as subfamilies/descriptors; cada entry passa por curadoria manual.
- R2-D-04: Os groups deferidos permanecem como future expansion candidates documentados.

### R2-D-05 through R2-D-08: Vanilla Relation/Accord Gap

**Decision:** Phase 09 deve revisar e tentar resolver o gap de `vanilla`.

- R2-D-05: Phase 09 deve revisar o gap relation/accord de `vanilla`.
- R2-D-06: `vanilla` pode receber relation/accord manual aprovado nesta fase se houver rationale curatorial claro.
- R2-D-07: Se não houver consenso, o gap de `vanilla` permanece documentado e não bloqueia a Phase 09.
- R2-D-08: Não serão criados scores automáticos ou placeholders `score: 0` para `vanilla`.

Preferred resolution: `vanilla` ↔ `warm_spice` if `warm_spice` is approved.

### R2-D-09 through R2-D-11: Ylang Ylang Alias

**Decision:** Deferred as legacy alias soft finding.

- R2-D-09: `ylang ylang -> ylang_ylang` será tratado como legacy alias soft finding, não hard failure.
- R2-D-10: Phase 09 não removerá esse alias nem adicionará `ylang_ylang` ao seed sem aprovação curatorial específica.
- R2-D-11: O item será registrado como alias cleanup deferido para uma futura decisão sobre floral/exotic-floral.

---

## 2. Candidate Prioritization

### R2-D-12 through R2-D-17: Strategy

**Decision:** Evidence-ranked + group-balanced queue.

- R2-D-12: Phase 09 usará priorização evidence-ranked + group-balanced.
- R2-D-13: A priorização será feita dentro dos três groups selecionados: `green`, `fruity` e `spicy`.
- R2-D-14: Frequência corpus não será usada como critério único de priorização ou aprovação.
- R2-D-15: Candidates com canonical/subfamily claro terão prioridade sobre candidates genéricos de alta frequência.
- R2-D-16: Terms ambíguos ou genéricos serão classificados como `defer`, `create_gap` ou support evidence, não promovidos automaticamente.
- R2-D-17: A fila deve buscar reduzir pressão em `floral_rose`, `citrus_fresh` e `woody_dry`, mas sem violar aprovação manual.

**Conceptual priority scoring:**
- 30% corpus/review frequency
- 20% overloaded subfamily relief
- 20% canonical/subfamily clarity
- 15% placement ambiguity
- 10% graph/relation potential
- 5% alias/ambiguity risk adjustment

### R2-D-18 through R2-D-23: Subfamilies and Candidates

**Decision:** 7 subfamilies across 3 groups.

| Group | Subfamilies |
|-------|-------------|
| `green` | `herbal_green`, `leafy_green` |
| `fruity` | `tropical_fruit`, `orchard_fruit`, `red_fruit` |
| `spicy` | `warm_spice`, `fresh_spice` |

- R2-D-18: Phase 09 considerará `herbal_green` e `leafy_green` para o group `green`.
- R2-D-19: Phase 09 considerará `tropical_fruit`, `orchard_fruit` e `red_fruit` para o group `fruity`.
- R2-D-20: Phase 09 considerará `warm_spice` e `fresh_spice` para o group `spicy`.
- R2-D-21: Subfamilies genéricas como `fruity`, `green` ou `spicy` não serão usadas como buckets genéricos.
- R2-D-22: `minty`, `warm`, `anisic`, `wintergreen` e `tea_green_tea` exigem revisão específica antes de qualquer promoção.
- R2-D-23: A criação dessas subfamilies no escopo de discussão não aprova automaticamente nenhum descriptor.

**Candidate priorities per group:**

| Rank | Fruity | Spicy | Green |
|------|--------|-------|-------|
| 1 | `pineapple` → tropical_fruit | `cinnamon` → warm_spice | `basil` → herbal_green |
| 2 | `banana` → tropical_fruit | `clove` → warm_spice | `tomato_leaf` → leafy_green |
| 3 | `melon` → TBD | `anise` → TBD | `tea_green_tea` → review |
| 4 | `strawberry` → red_fruit | `allspice` → warm_spice | `wintergreen` → review |
| 5 | `blackberry` → red_fruit | `anisic` → defer/review | `minty` → defer |

**Ambiguous/generic to defer:** `warm`, `green`, `fruity`, `spicy`, `minty`.

---

## 3. Manual Approval Workflow

### R2-D-24 through R2-D-29: Workflow Continuity

**Decision:** Phase 8 workflow preserved integrally.

- R2-D-24: Phase 09 manterá intacto o workflow de aprovação manual da Phase 8.
- R2-D-25: Nenhuma entrada será promovida sem `manual_approval: approved`, `primary_disposition: promote_to_seed`, family/subfamily/descriptor concreto, rationale e evidence.
- R2-D-26: Approval em chat/transcript não é suficiente; aprovação deve ser persistida no workbook.
- R2-D-27: Corpus/review_queue/generic pressure/graph evidence continuam support only.
- R2-D-28: Batch approval sem rationale individual continua proibido.
- R2-D-29: Phase 09 pode adicionar campos de rastreabilidade da rodada (`round`, `approval_id`, `source_phase`, `validation_expectation`), mas eles não substituem os campos obrigatórios.

**Minimum required fields per approved entry:**

```yaml
approval_id: r2-approval-NNN
round: phase_09_round_2
family_id: <family>
subfamily_id: <subfamily>
descriptor_id: <descriptor>
manual_approval: approved
primary_disposition: promote_to_seed
rationale: <rationale>
evidence: <evidence>
promotion_effect: approved_for_seed_v2
```

**Blocking rule:** If an entry lacks persisted workbook approval, the executor must stop and not edit curated JSON.

### R2-D-30 through R2-D-34: Workbook Policy

**Decision:** Reuse existing `candidate-review.md` with Round 2 section.

- R2-D-30: Phase 09 reutilizará `candidate-review.md` como workbook canônico.
- R2-D-31: Phase 09 adicionará uma seção própria `Phase 09 / Round 2 Curation`, sem reescrever decisões da Phase 8.
- R2-D-32: Novas aprovações usarão IDs `r2-approval-*`.
- R2-D-33: Novos gaps/alias cleanup usarão IDs `r2-relation-gap-*`, `r2-accord-gap-*` e `r2-alias-cleanup-*`.
- R2-D-34: Workbook separado só será criado se o ledger ficar grande demais.

---

## 4. Alias Cleanup

### R2-D-35 through R2-D-41: Alias Policy Continuity

**Decision:** Phase 8 alias policy preserved integrally.

- R2-D-35: Phase 09 manterá integralmente a política de aliases da Phase 8.
- R2-D-36: Alias exige canonical claro, aprovação manual, rationale e evidence.
- R2-D-37: Alias candidates, frequência e string similarity não promovem aliases automaticamente.
- R2-D-38: Canonical continua sendo o conceito curado mais estável, não a grafia mais frequente.
- R2-D-39: Alias ambíguo ou com target ausente será `defer` ou `reject`, nunca corrigido automaticamente.
- R2-D-40: `ylang ylang -> ylang_ylang` permanece como alias cleanup deferido na Phase 09.
- R2-D-41: Nenhum alias legado será removido, remapeado ou usado para adicionar descriptor ao seed v2 sem aprovação curatorial específica.

### R2-D-42 through R2-D-46: Alias Investigation

**Decision:** Alias investigation included for new descriptors.

- R2-D-42: Phase 09 incluirá alias investigation para novos descriptors candidatos de `green`, `fruity` e `spicy`.
- R2-D-43: Alias investigation será registrada no workbook, mas não altera `descriptor_aliases.seed.json` automaticamente.
- R2-D-44: Todo novo alias continua exigindo aprovação manual, canonical claro, rationale e evidence.
- R2-D-45: Variantes ambíguas como `anisic`, `wintergreen`, `minty`, `warm` e `banana_unripe_banana` devem ser deferidas ou revisadas, não promovidas automaticamente.
- R2-D-46: `secondary_hypotheses: add_alias` não equivale a aprovação de alias.

---

## 5. Relation/Accord Expansion

### R2-D-47 through R2-D-55: Policy and Vanilla Gap

**Decision:** Phase 8 policy preserved + active vanilla gap resolution + relation/accord review for new subfamilies.

- R2-D-47: Phase 09 manterá a política da Phase 8 para relation/accord expansion.
- R2-D-48: Cada nova subfamily terá relation/accord review obrigatório no workbook.
- R2-D-49: Cada nova subfamily deve ter relation/accord aprovado ou gap explícito.
- R2-D-50: Missing relation/accord permanece neutral/undefined, nunca `score: 0`.
- R2-D-51: Scores de relations/accords continuam manuais, em [0,1], com rationale/evidence.
- R2-D-52: Corpus/co-occurrence/review_queue são support only e não definem score.
- R2-D-53: Phase 09 deve tentar resolver o gap de `vanilla`, preferencialmente via `vanilla` ↔ `warm_spice` se `warm_spice` for aprovado.
- R2-D-54: Não criar relation/accord com endpoint que não exista em `taxonomy-seed.v2.json`.
- R2-D-55: Relations/accords ambíguos ficam como gap/defer, não entrada automática.

### Recommended Relations

| Source | Target | Type | Score |
|--------|--------|------|-------|
| `herbal_green` | `leafy_green` | same_family_tradition | 0.85 |
| `tropical_fruit` | `orchard_fruit` | same_family_tradition | 0.80 |
| `orchard_fruit` | `red_fruit` | same_family_tradition | 0.80 |
| `tropical_fruit` | `red_fruit` | same_family_tradition | 0.75 |
| `warm_spice` | `fresh_spice` | same_family_tradition | 0.80 |
| `vanilla` | `warm_spice` | cross_family_tradition_bridge | 0.65 |

### Recommended Accords

| Source | Target | Score |
|--------|--------|-------|
| `herbal_green` | `citrus_fresh` | 0.70 |
| `tropical_fruit` | `citrus_fresh` | 0.70 |
| `red_fruit` | `floral_rose` | 0.70 |
| `warm_spice` | `vanilla` | 0.75 |
| `fresh_spice` | `citrus_fresh` | 0.65 |
| `warm_spice` | `woody_dry` | 0.65 |

All scores are manual, conservative, and require individual approval.

---

## 6. Validation Gates

### R2-D-56 through R2-D-63: Gates and Metrics

**Decision:** Phase 8 gates maintained + 3 new hard gates + 10 validation metrics.

- R2-D-56: Phase 09 manterá os hard gates da Phase 8.
- R2-D-57: Phase 09 adicionará hard gate de default drift/protected artifact mutation.
- R2-D-58: Phase 09 manterá soft gates para zero-frequency seeds, sparse graph, high review_queue, deferred gaps e ambiguous candidates.
- R2-D-59: Phase 09 validará v2-expanded contra v1 baseline usando 10 métricas obrigatórias.
- R2-D-60: Toda mudança curada precisa rastrear para approval persistido no workbook.
- R2-D-61: Validação deve registrar especificamente o status de `vanilla` relation/accord gap.
- R2-D-62: Validação deve registrar especificamente o status de legacy alias targets ausentes.
- R2-D-63: v2-expanded continuará candidato explícito; nenhuma validação promoverá v2 para default.

### Hard Gates

| Gate | Status |
|------|--------|
| Schema invalid | maintained |
| Nondeterminism | maintained |
| Hard/pattern-excludes in taxonomy | maintained |
| Alias candidate contamination | maintained |
| Auto-promotion without manual approval | maintained |
| Default drift (defaults remain v1) | **new** |
| Protected artifact mutation (`data/compiled/v1/`) | **new** |
| Curated change without workbook traceability | **new** |

### Soft Gates

| Gate | Status |
|------|--------|
| Remaining zero-frequency seeds | maintained |
| Sparse graph | maintained |
| High review_queue count | maintained |
| Deferred gaps | maintained |
| Ambiguous candidates | maintained |
| Legacy alias target absent | maintained |

### Validation Metrics

| # | Metric | Description |
|---|--------|-------------|
| 1 | Coverage counts | family_count, subfamily_count, seed/corpus descriptors, candidate/seed ratio |
| 2 | Group coverage | Per-group: subfamilies created, seed descriptors added, review items reduced |
| 3 | Generic pressure | Candidates per overloaded subfamily, displacement to new subfamilies |
| 4 | Review queue quality | Total, type/severity distribution, resolved/introduced items |
| 5 | Graph coverage | Edges, density, connected/isolated subfamilies, relation/accord counts |
| 6 | Vanilla gap status | Resolved or gap documented |
| 7 | Alias quality | Added/removed, target presence, legacy alias status |
| 8 | Zero-frequency seeds | Inherited, new introduced, rationale per each |
| 9 | Determinism/schema | Fixed generated_at, schema validation, quality gates pass |
| 10 | Curation traceability | Every change maps to workbook approval_id |

---

## 7. Promotion Readiness (Future Criteria Only)

> Phase 09 does NOT promote v2 to default. This section documents future criteria only.

### R2-D-64 through R2-D-69: Future Criteria

- R2-D-64: Phase 09 documentará promotion readiness apenas como critérios futuros; não promoverá v2.
- R2-D-65: Promoção de v2 para default exigirá fase futura separada, com plano próprio.
- R2-D-66: Critérios futuros incluem coverage, traceability, alias quality, graph coverage, review queue, generic pressure, hard failures, soft warnings, migration plan e human approval.
- R2-D-67: `DEFAULT_PATHS` não serão alterados na Phase 09.
- R2-D-68: `data/compiled/v1` não será substituído na Phase 09.
- R2-D-69: `taxonomy-seed.v2.json` continuará sendo candidate seed após a Phase 09.

### Criteria Table

| # | Criterion | Description |
|---|-----------|-------------|
| 1 | Coverage mínima | ≥5 families with curated subfamilies |
| 2 | Curation traceability | Every entry has approval_id, rationale, evidence |
| 3 | Alias quality | No absent targets without explicit policy |
| 4 | Graph coverage | Every subfamily has ≥1 relation/accord or justified gap |
| 5 | Review queue improvement | Total reduced or more actionable |
| 6 | Generic pressure reduction | Overloaded subfamilies relieved |
| 7 | Zero hard failures | All hard gates pass |
| 8 | Soft warnings acceptable | All warnings have rationale/disposition |
| 9 | Deterministic migration plan | Diff, default switch, rollback, v1 archive |
| 10 | Human approval final | Curator explicitly approves default switch |

---

## Expected Phase 09 Outcome

After execution, Phase 09 should produce:

| Artifact | Expected Change |
|----------|-----------------|
| `taxonomy-seed.v2.json` | Add 3 families, 7 subfamilies, ~10-15 seed descriptors |
| `descriptor_aliases.seed.json` | Add approved aliases for new descriptors |
| `curated_relations.v2.json` | Add ~6 approved intra/cross-family relations |
| `accord_map.v2.json` | Add ~6 approved cross-family accords |
| `candidate-review.md` | Add Round 2 section with all approvals/gaps/deferrals |
| v1-vs-v2-expanded comparison | New validation report with 10 metrics |

**v2-expanded target (approximate):**

| Metric | V2 post-Phase 8 | V2 post-Phase 9 (target) |
|--------|------------------|--------------------------|
| Families | 4 | 7 |
| Subfamilies | 7 | 14 |
| Seed descriptors | 22 | ~32-37 |
| Graph edges | 6 | ~12-18 |
| Review queue | 403 | <380 |

These are directional targets, not hard commitments. Actual numbers depend on curatorial decisions during execution.
