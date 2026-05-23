# Phase 9: Taxonomy Seed v2 Expansion Round 2 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions will be captured in `09-CONTEXT.md` after discussion produces enough stable decisions.

**Date:** 2026-05-23
**Phase:** 09-taxonomy-seed-v2-expansion-round-2
**Status:** active_for_context_gathering
**Execution readiness:** not_ready_for_execution
**Areas proposed:** Expansion scope, Candidate prioritization, Manual approval workflow, Alias cleanup, Relation/accord expansion, Validation gates, Promotion readiness criteria

---

## Phase Boundary

Phase 9 is a second curated expansion wave for `taxonomy-seed.v2.json`. Phase 8 established the v2 candidate seed with a minimal first expansion (gourmand/vanilla/vanilla). Phase 9 adds more families, subfamilies and descriptors through manual curation.

Phase 9 must NOT:
- Promote v2 to default.
- Edit `taxonomy-seed.v1.json`.
- Overwrite `data/compiled/v1/`.
- Auto-promote corpus candidates.
- Alter aliases/relations/accords without approval/rationale/evidence in the workbook.

---

## Post-Phase 8 Starting Context

Phase 8 completed and passed verification.

V1 baseline:
- 3 families, 6 subfamilies, 21 seed descriptors.

V2 candidate (post-Phase 8):
- 4 families, 7 subfamilies, 22 seed descriptors.
- Added: family `gourmand`, subfamily `vanilla`, descriptor `vanilla`.
- Review queue reduced from 427 to 403.
- Graph edges: 6.
- `vanilla` has no relation/accord approved yet (accepted soft warning).
- `ylang ylang -> ylang_ylang` remains as legacy alias with absent target in minimal seed (accepted soft warning).

CLI/compiler defaults remain v1. v2 is explicit-path only.

---

## Initial Discussion Prompt

Which areas do you want to discuss for Phase 09: Taxonomy Seed v2 Expansion Round 2? Select all that apply.

| Option | Area | Description | Recommended |
|--------|------|-------------|-------------|
| 1 | All areas | Discuss scope, candidate prioritization, approval workflow, alias cleanup, relation/accord expansion, validation gates, and promotion readiness boundaries. | yes |
| 2 | Expansion scope | Quais groups/subfamilies entram na segunda rodada do seed v2. | |
| 3 | Candidate prioritization | Como priorizar candidates a partir do `candidate-review.md` e `v1-v2-comparison.md`. | |
| 4 | Manual approvals | Como aprovar mais entries no workbook sem auto-promotion. | |
| 5 | Alias cleanup | Como tratar aliases legados, especialmente targets ausentes como `ylang_ylang`. | |
| 6 | Relation/accord expansion | Como adicionar relations/accords para novas subfamilies, especialmente `vanilla`. | |
| 7 | Validation gates | Como comparar v1 vs v2-expanded e medir melhoria. | |
| 8 | Promotion readiness | Quais critérios futuros seriam necessários para tornar v2 default, sem fazer isso agora. | |

**Initial recommendation:** discuss all areas (option 1).

**User selection:** All areas (option 1).

Next discussion order:

1. Expansion scope
2. Candidate prioritization
3. Manual approval workflow
4. Alias cleanup
5. Relation/accord expansion
6. Validation gates
7. Promotion readiness criteria

---

## Decision Capture Rules

Use decision IDs `R2-D-01`, `R2-D-02`, `R2-D-03`, and so on.

Until `09-CONTEXT.md` exists, this log records proposed areas, alternatives and discussion notes only. No decision in this file authorizes implementation.

---

## Expansion Scope

### Group Selection

| Option | Description | Selected |
|--------|-------------|----------|
| All 5 groups | green, fruity, spicy, amber/resinous, animalic | |
| 3 groups prioritários | green, fruity, spicy | yes |
| 2 groups mínimos | green, fruity | |
| Incremental | group por group | |

**User's choice:** 3 groups prioritários — green, fruity, spicy.

**Decisions:**

- **R2-D-01:** Phase 09 adotará 3 groups prioritários: `green`, `fruity`, `spicy`.
- **R2-D-02:** `amber_resinous` e `animalic` ficam deferidos para uma terceira rodada de expansão.
- **R2-D-03:** A seleção de 3 groups não implica inclusão automática de todas as subfamilies/descriptors; cada entry passa por curadoria manual.
- **R2-D-04:** Os groups deferidos permanecem como future expansion candidates documentados.

### Deferred Groups

| Group | Status |
|-------|--------|
| `amber_resinous` | Deferred to Round 3 |
| `animalic` | Deferred to Round 3 |

### Vanilla Relation/Accord

| Option | Description | Selected |
|--------|-------------|----------|
| Resolver agora | Aprovar relation/accord manual para vanilla | yes |
| Manter soft warning | Não alterar vanilla | |
| Apenas accord | Só accord_map, sem curated_relation | |

**User's choice:** Sim — resolver o gap relation/accord de `vanilla` nesta Phase 09.

**Decisions:**

- **R2-D-05:** Phase 09 deve revisar o gap relation/accord de `vanilla`.
- **R2-D-06:** `vanilla` pode receber relation/accord manual aprovado nesta fase se houver rationale curatorial claro.
- **R2-D-07:** Se não houver consenso, o gap de `vanilla` permanece documentado e não bloqueia a Phase 09.
- **R2-D-08:** Não serão criados scores automáticos ou placeholders `score: 0` para `vanilla`.

**Possible vanilla relation candidates:**
- `vanilla` ↔ `balsamic_resin` (se amber_resinous entrar em rodada posterior)
- `vanilla` ↔ `woody_dry` (conservative relation)
- `vanilla` ↔ `floral_rose` (moderate)

### Ylang Ylang Alias Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Deferido | Manter como soft warning documentado | yes |
| Corrigir agora | Adicionar ylang_ylang ao seed ou corrigir target | |
| Documentar gap | Registrar alias_cleanup_gap sem alterar | |

**User's choice:** Deferido para fase futura.

**Decisions:**

- **R2-D-09:** `ylang ylang -> ylang_ylang` será tratado como legacy alias soft finding, não hard failure.
- **R2-D-10:** Phase 09 não removerá esse alias nem adicionará `ylang_ylang` ao seed sem aprovação curatorial específica.
- **R2-D-11:** O item será registrado como alias cleanup deferido para uma futura decisão sobre floral/exotic-floral ou política de aliases fora do seed.

**Disposition:** `defer` / `alias candidate` / Legacy alias target absent from current seed.

---

## Candidate Prioritization

### Prioritization Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Evidence-ranked + group-balanced | Rank by frequency, review_queue, generic pressure, graph coverage; balance across groups | yes |
| Review_queue reduction first | Maximize review_queue reduction | |
| Generic pressure first | Relieve floral_rose, citrus_fresh, woody_dry | |
| High-frequency first | Corpus frequency dominates | |
| Graph coverage first | Maximize new edges | |
| Subfamilies planejadas | Use Phase 8 planned subfamilies | |

**User's choice:** Evidence-ranked + group-balanced queue.

**Decisions:**

- **R2-D-12:** Phase 09 usará priorização evidence-ranked + group-balanced.
- **R2-D-13:** A priorização será feita dentro dos três groups selecionados: `green`, `fruity` e `spicy`.
- **R2-D-14:** Frequência corpus não será usada como critério único de priorização ou aprovação.
- **R2-D-15:** Candidates com canonical/subfamily claro terão prioridade sobre candidates genéricos de alta frequência.
- **R2-D-16:** Terms ambíguos ou genéricos serão classificados como `defer`, `create_gap` ou support evidence, não promovidos automaticamente.
- **R2-D-17:** A fila deve buscar reduzir pressão em `floral_rose`, `citrus_fresh` e `woody_dry`, mas sem violar aprovação manual.

**Conceptual priority scoring:**
- 30% corpus/review frequency
- 20% overloaded subfamily relief
- 20% canonical/subfamily clarity
- 15% placement ambiguity
- 10% graph/relation potential
- 5% alias/ambiguity risk adjustment

This score orders investigation only; it does not approve entries.

### Subfamilies Per Group

| Group | Subfamilies | Selected |
|-------|-------------|----------|
| `green` | `herbal_green`, `leafy_green` | yes |
| `fruity` | `tropical_fruit`, `orchard_fruit`, `red_fruit` | yes |
| `spicy` | `warm_spice`, `fresh_spice` | yes |

**Decisions:**

- **R2-D-18:** Phase 09 considerará `herbal_green` e `leafy_green` para o group `green`.
- **R2-D-19:** Phase 09 considerará `tropical_fruit`, `orchard_fruit` e `red_fruit` para o group `fruity`.
- **R2-D-20:** Phase 09 considerará `warm_spice` e `fresh_spice` para o group `spicy`.
- **R2-D-21:** Subfamilies genéricas como `fruity`, `green` ou `spicy` não serão usadas como buckets genéricos.
- **R2-D-22:** `minty`, `warm`, `anisic`, `wintergreen` e `tea_green_tea` exigem revisão específica antes de qualquer promoção.
- **R2-D-23:** A criação dessas subfamilies no escopo de discussão não aprova automaticamente nenhum descriptor.

### Candidate Priorities Per Group

**Fruity** (highest impact on generic pressure):
1. `pineapple` → `tropical_fruit`
2. `banana` → `tropical_fruit`
3. `melon` → `tropical_fruit` or `orchard_fruit` (requires decision)
4. `strawberry` → `red_fruit`
5. `blackberry` → `red_fruit`

**Spicy**:
1. `cinnamon` → `warm_spice`
2. `clove` → `warm_spice`
3. `anise` → `fresh_spice` or `warm_spice` (requires decision)
4. `allspice` → `warm_spice`
5. `anisic` → defer/review

**Green**:
1. `basil` → `herbal_green`
2. `tomato_leaf` → `leafy_green`
3. `tea_green_tea` → review canonical; possible `green_tea` or defer
4. `wintergreen` → review; possible defer (medicinal/minty ambiguity)
5. `minty` → support evidence/defer

**Ambiguous/generic candidates to defer:**
- `warm` → support signal for `warm_spice`, not auto-promoted
- `green`, `fruity`, `spicy` → family-level signals, not descriptor principals
- `minty` → green/fresh/cooling boundary unclear

---

## Manual Approval Workflow

### Workflow Continuity

| Option | Description | Selected |
|--------|-------------|----------|
| Manter Phase 8 workflow | Todas as regras CUR-D-14 a CUR-D-18 e CUR-D-34 a CUR-D-37 preservadas | yes |
| Simplificado | approval + rationale obrigatórios, evidence opcional | |
| Batch approval por subfamily | Subfamilies inteiras com rationale coletivo | |

**User's choice:** Manter workflow da Phase 8 intacto.

**Decisions:**

- **R2-D-24:** Phase 09 manterá intacto o workflow de aprovação manual da Phase 8.
- **R2-D-25:** Nenhuma entrada será promovida sem `manual_approval: approved`, `primary_disposition: promote_to_seed`, family/subfamily/descriptor concreto, rationale e evidence.
- **R2-D-26:** Approval em chat/transcript não é suficiente; aprovação deve ser persistida no workbook.
- **R2-D-27:** Corpus/review_queue/generic pressure/graph evidence continuam support only.
- **R2-D-28:** Batch approval sem rationale individual continua proibido.
- **R2-D-29:** Phase 09 pode adicionar campos de rastreabilidade da rodada (`round`, `approval_id`, `source_phase`, `validation_expectation`), mas eles não substituem os campos obrigatórios.

**Minimum required fields per approved entry:**
- `approval_id`: `r2-approval-NNN`
- `round`: `phase_09_round_2`
- `family_id`, `subfamily_id`, `descriptor_id`
- `manual_approval`: approved
- `primary_disposition`: `promote_to_seed`
- `rationale`, `evidence`
- `promotion_effect`: approved_for_seed_v2

**Blocking rule:** If an entry lacks persisted workbook approval, the executor must stop and not edit curated JSON.

### Workbook Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Reutilizar workbook existente | Expandir candidate-review.md com seção Round 2 | yes |
| Novo workbook separado | Criar candidate-review-r2.md | |
| Combinar ambos | Separado mas referenciando existente | |

**User's choice:** Reutilizar o mesmo `candidate-review.md`.

**Decisions:**

- **R2-D-30:** Phase 09 reutilizará `candidate-review.md` como workbook canônico.
- **R2-D-31:** Phase 09 adicionará uma seção própria `Phase 09 / Round 2 Curation`, sem reescrever decisões da Phase 8.
- **R2-D-32:** Novas aprovações usarão IDs `r2-approval-*`.
- **R2-D-33:** Novos gaps/alias cleanup usarão IDs `r2-relation-gap-*`, `r2-accord-gap-*` e `r2-alias-cleanup-*`.
- **R2-D-34:** Workbook separado só será criado se o ledger ficar grande demais.

---

## Alias Cleanup

### Alias Policy Continuity

| Option | Description | Selected |
|--------|-------------|----------|
| Manter Phase 8 policy | CUR-D-38 a CUR-D-50 preservadas integralmente | yes |
| Expandir policy | Regras adicionais para novos groups | |
| Adiar aliases | Descriptors primeiro, aliases depois | |

**User's choice:** Manter política da Phase 8 intacto.

**Decisions:**

- **R2-D-35:** Phase 09 manterá integralmente a política de aliases da Phase 8.
- **R2-D-36:** Alias exige canonical claro, aprovação manual, rationale e evidence.
- **R2-D-37:** Alias candidates, frequência e string similarity não promovem aliases automaticamente.
- **R2-D-38:** Canonical continua sendo o conceito curado mais estável, não a grafia mais frequente.
- **R2-D-39:** Alias ambíguo ou com target ausente será `defer` ou `reject`, nunca corrigido automaticamente.
- **R2-D-40:** `ylang ylang -> ylang_ylang` permanece como alias cleanup deferido na Phase 09.
- **R2-D-41:** Nenhum alias legado será removido, remapeado ou usado para adicionar descriptor ao seed v2 sem aprovação curatorial específica.

### Alias Investigation for New Descriptors

| Option | Description | Selected |
|--------|-------------|----------|
| Incluir alias investigation | Identificar possíveis aliases ao revisar novos descriptors | yes |
| Focar em descriptors | Aliases na próxima fase | |
| Apenas conflitos | Só quando há seed_corpus_conflict | |

**User's choice:** Sim — alias investigation junto com novos descriptors.

**Decisions:**

- **R2-D-42:** Phase 09 incluirá alias investigation para novos descriptors candidatos de `green`, `fruity` e `spicy`.
- **R2-D-43:** Alias investigation será registrada no workbook, mas não altera `descriptor_aliases.seed.json` automaticamente.
- **R2-D-44:** Todo novo alias continua exigindo aprovação manual, canonical claro, rationale e evidence.
- **R2-D-45:** Variantes ambíguas como `anisic`, `wintergreen`, `minty`, `warm` e `banana_unripe_banana` devem ser deferidas ou revisadas, não promovidas automaticamente.
- **R2-D-46:** `secondary_hypotheses: add_alias` não equivale a aprovação de alias.

**Workbook structure per descriptor:**
- `descriptor_id`, `target_family`, `target_subfamily`
- `alias_candidates_to_review`
- `approved_aliases`, `deferred_aliases`, `rejected_aliases`
- `manual_approval`, `primary_disposition`, `rationale`, `evidence`

---

## Relation/Accord Expansion

### Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 8 policy + vanilla gap | Maintain CUR-D-51 to CUR-D-64; resolve vanilla gap if possible | yes |
| Apenas vanilla | Only vanilla relation/accord, defer new subfamilies | |
| Relations obrigatórias | Every new subfamily must have ≥1 curated relation | |
| Adiar tudo | No relation/accord expansion this phase | |

**User's choice:** Manter política Phase 8 + resolver vanilla + relation/accord review para novas subfamilies.

**Decisions:**

- **R2-D-47:** Phase 09 manterá a política da Phase 8 para relation/accord expansion.
- **R2-D-48:** Cada nova subfamily terá relation/accord review obrigatório no workbook.
- **R2-D-49:** Cada nova subfamily deve ter relation/accord aprovado ou gap explícito.
- **R2-D-50:** Missing relation/accord permanece neutral/undefined, nunca `score: 0`.
- **R2-D-51:** Scores de relations/accords continuam manuais, em [0,1], com rationale/evidence.
- **R2-D-52:** Corpus/co-occurrence/review_queue são support only e não definem score.
- **R2-D-53:** Phase 09 deve tentar resolver o gap de `vanilla`, preferencialmente via `vanilla` ↔ `warm_spice` se `warm_spice` for aprovado.
- **R2-D-54:** Não criar relation/accord com endpoint que não exista em `taxonomy-seed.v2.json`.
- **R2-D-55:** Relations/accords ambíguos ficam como gap/defer, não entrada automática.

### Recommended Relations Per Group

**Green** (if `herbal_green` and `leafy_green` approved):
- `herbal_green` ↔ `leafy_green`: `same_family_tradition`, score 0.85

**Fruity** (if `tropical_fruit`, `orchard_fruit`, `red_fruit` approved):
- `tropical_fruit` ↔ `orchard_fruit`: `same_family_tradition`, score 0.80
- `orchard_fruit` ↔ `red_fruit`: `same_family_tradition`, score 0.80
- `tropical_fruit` ↔ `red_fruit`: `same_family_tradition`, score 0.75

**Spicy** (if `warm_spice` and `fresh_spice` approved):
- `warm_spice` ↔ `fresh_spice`: `same_family_tradition`, score 0.80

**Vanilla gap resolution** (if `warm_spice` approved):
- `vanilla` ↔ `warm_spice`: `cross_family_tradition_bridge`, score 0.65

### Recommended Accords Per Group

**Cross-family accords:**
- `herbal_green` ↔ `citrus_fresh`: score 0.70
- `tropical_fruit` ↔ `citrus_fresh`: score 0.70
- `red_fruit` ↔ `floral_rose`: score 0.70
- `warm_spice` ↔ `vanilla`: score 0.75
- `fresh_spice` ↔ `citrus_fresh`: score 0.65
- `warm_spice` ↔ `woody_dry`: score 0.65

All recommended scores are manual, conservative, and require individual approval.

---

## Validation Gates

### Hard Gates

| Hard Gate | Status |
|-----------|--------|
| Schema invalid | maintained |
| Nondeterminism | maintained |
| Hard/pattern-excludes in taxonomy | maintained |
| Alias candidate contamination | maintained |
| Auto-promotion without manual approval | maintained |
| Default drift (defaults remain v1) | **new** |
| Protected artifact mutation (`data/compiled/v1/`) | **new** |
| Curated change without workbook traceability | **new** |

### Soft Gates

| Soft Gate | Status |
|-----------|--------|
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

**Decisions:**

- **R2-D-56:** Phase 09 manterá os hard gates da Phase 8.
- **R2-D-57:** Phase 09 adicionará hard gate de default drift/protected artifact mutation.
- **R2-D-58:** Phase 09 manterá soft gates para zero-frequency seeds, sparse graph, high review_queue, deferred gaps e ambiguous candidates.
- **R2-D-59:** Phase 09 validará v2-expanded contra v1 baseline usando 10 métricas obrigatórias.
- **R2-D-60:** Toda mudança curada precisa rastrear para approval persistido no workbook.
- **R2-D-61:** Validação deve registrar especificamente o status de `vanilla` relation/accord gap.
- **R2-D-62:** Validação deve registrar especificamente o status de legacy alias targets ausentes.
- **R2-D-63:** v2-expanded continuará candidato explícito; nenhuma validação promoverá v2 para default.

---

## Promotion Readiness (Future Criteria Only)

> Phase 09 does NOT promote v2 to default. This section documents future criteria only.

### Criteria for Future v2 Default Promotion

| # | Criterion | Description |
|---|-----------|-------------|
| 1 | Coverage mínima | ≥5 families with curated subfamilies; all priority groups represented or explicitly deferred |
| 2 | Curation traceability | Every entry has approval_id, rationale, evidence; no corpus-only promotions |
| 3 | Alias quality | No absent targets without explicit policy; no alias contamination |
| 4 | Graph coverage | Every subfamily has ≥1 relation/accord or justified gap; vanilla gap resolved |
| 5 | Review queue improvement | Total reduced or more actionable; no artificial reduction via auto-promotion |
| 6 | Generic pressure reduction | floral_rose, citrus_fresh, woody_dry no longer overloaded |
| 7 | Zero hard failures | Schema, determinism, no excludes, no contamination, no auto-promotion |
| 8 | Soft warnings acceptable | All warnings have owner, rationale, disposition |
| 9 | Deterministic migration plan | Diff, explicit default switch, rollback plan, v1 archive |
| 10 | Human approval final | Curator reviews final report and explicitly approves default switch |

**Decisions:**

- **R2-D-64:** Phase 09 documentará promotion readiness apenas como critérios futuros; não promoverá v2.
- **R2-D-65:** Promoção de v2 para default exigirá fase futura separada, com plano próprio.
- **R2-D-66:** Critérios futuros incluem coverage, traceability, alias quality, graph coverage, review queue, generic pressure, hard failures, soft warnings, migration plan e human approval.
- **R2-D-67:** `DEFAULT_PATHS` não serão alterados na Phase 09.
- **R2-D-68:** `data/compiled/v1` não será substituído na Phase 09.
- **R2-D-69:** `taxonomy-seed.v2.json` continuará sendo candidate seed após a Phase 09.

---

## Recommended Direction for Phase 09

### Priority 1 — Green

Candidate subfamilies: `herbal_green`, `leafy_green`

Candidate descriptors: `basil`, `wintergreen`, `tea_green_tea`, `tomato_leaf`, `minty` (if green/fresh scope allows)

### Priority 2 — Fruity

Candidate subfamilies: `tropical_fruit`, `orchard_fruit`, `red_fruit`

Candidate descriptors: `pineapple`, `banana`, `melon`, `strawberry`, `blackberry`

### Priority 3 — Spicy

Candidate subfamilies: `warm_spice`, `fresh_spice`

Candidate descriptors: `cinnamon`, `clove`, `anise`, `anisic`, `allspice`, `warm`

### Priority 4 — Amber/Resinous

Candidate subfamilies: `balsamic_resin`, `amber`

Candidate descriptors: `resinous`, `labdanum`, `benzoin`, `amber`, `balsamic`

### Priority 5 — Animalic

Candidate subfamilies: `musky`, `leathery`

Candidate descriptors: `musk`, `leathery`, `ambrette`, `civet`, `animal`

---

## Deferred Until Planning/Execution Approval

- `09-01-PLAN.md`
- `09-CONTEXT.md` (after discussion captures enough decisions)
- `09-RESEARCH.md`
- `09-PATTERNS.md`
- `09-VALIDATION.md`
- Code changes
- Compiled artifact changes

---

## Discussion Summary

**Date:** 2026-05-23
**Areas discussed:** 7/7 complete
**Decisions captured:** R2-D-01 through R2-D-69

| Area | Decisions | Key Outcomes |
|------|-----------|--------------|
| Expansion scope | R2-D-01 to R2-D-11 | 3 groups (green, fruity, spicy); amber/animalic deferred; vanilla relation/accord to resolve; ylang ylang deferred |
| Candidate prioritization | R2-D-12 to R2-D-23 | Evidence-ranked + group-balanced; 7 subfamilies; per-group candidate priorities |
| Manual approval workflow | R2-D-24 to R2-D-34 | Phase 8 workflow preserved; workbook reused with Round 2 section; r2-approval-* IDs |
| Alias cleanup | R2-D-35 to R2-D-46 | Phase 8 alias policy preserved; alias investigation included for new descriptors |
| Relation/accord expansion | R2-D-47 to R2-D-55 | Phase 8 policy preserved; vanilla gap resolution via warm_spice; recommended relations/accords per group |
| Validation gates | R2-D-56 to R2-D-63 | Phase 8 gates + 3 new hard gates; 10 validation metrics |
| Promotion readiness | R2-D-64 to R2-D-69 | 10 future criteria documented; v2 stays candidate |

**Next step:** Create `09-CONTEXT.md` from these 69 decisions, then proceed to plan-phase.

