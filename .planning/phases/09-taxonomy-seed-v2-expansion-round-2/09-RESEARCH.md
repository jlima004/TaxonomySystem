# Phase 9: Taxonomy Seed v2 Expansion Round 2 - Research

**Researched:** 2026-05-23  
**Domain:** Manual olfactory taxonomy seed curation, versioned JSON inputs, TypeScript compiler validation, green/fruity/spicy groups curation.  
**Confidence:** HIGH for project architecture and validation constraints; HIGH for expansion candidate data; MEDIUM for relation/accord coverage.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

Copied from `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-CONTEXT.md`.

#### 1. Expansion Scope

- **R2-D-01:** Phase 09 adotará 3 groups prioritários: `green`, `fruity`, `spicy`.
- **R2-D-02:** `amber_resinous` e `animalic` ficam deferidos para uma terceira rodada de expansão.
- **R2-D-03:** A seleção de 3 groups não implica inclusão automática de todas as subfamilies/descriptors; cada entry passa por curadoria manual.
- **R2-D-04:** Os groups deferidos permanecem como future expansion candidates documentados.
- **R2-D-05:** Phase 09 deve revisar o gap relation/accord de `vanilla`.
- **R2-D-06:** `vanilla` pode receber relation/accord manual aprovado nesta fase se houver rationale curatorial claro.
- **R2-D-07:** Se não houver consenso, o gap de `vanilla` permanece documentado e não bloqueia a Phase 09.
- **R2-D-08:** Não serão criados scores automáticos ou placeholders `score: 0` para `vanilla`. (Preferred resolution: `vanilla` ↔ `warm_spice` if `warm_spice` is approved).
- **R2-D-09:** `ylang ylang -> ylang_ylang` será tratado como legacy alias soft finding, não hard failure.
- **R2-D-10:** Phase 09 não removerá esse alias nem adicionará `ylang_ylang` ao seed sem aprovação curatorial específica.
- **R2-D-11:** O item será registrado como alias cleanup deferido para uma futura decisão sobre floral/exotic-floral.

#### 2. Candidate Prioritization

- **R2-D-12:** Phase 09 usará priorização evidence-ranked + group-balanced.
- **R2-D-13:** A priorização será feita dentro dos três groups selecionados: `green`, `fruity` e `spicy`.
- **R2-D-14:** Frequência corpus não será usada como critério único de priorização ou aprovação.
- **R2-D-15:** Candidates com canonical/subfamily claro terão prioridade sobre candidates genéricos de alta frequência.
- **R2-D-16:** Terms ambíguos ou genéricos serão classificados como `defer`, `create_gap` ou support evidence, não promovidos automaticamente.
- **R2-D-17:** A fila deve buscar reduzir pressão em `floral_rose`, `citrus_fresh` e `woody_dry`, mas sem violar aprovação manual.
- **R2-D-18:** Phase 09 considerará `herbal_green` e `leafy_green` para o group `green`.
- **R2-D-19:** Phase 09 considerará `tropical_fruit`, `orchard_fruit` e `red_fruit` para o group `fruity`.
- **R2-D-20:** Phase 09 considerará `warm_spice` e `fresh_spice` para o group `spicy`.
- **R2-D-21:** Subfamilies genéricas como `fruity`, `green` ou `spicy` não serão usadas como buckets genéricos.
- **R2-D-22:** `minty`, `warm`, `anisic`, `wintergreen` e `tea_green_tea` exigem revisão específica antes de qualquer promoção.
- **R2-D-23:** A criação dessas subfamilies no escopo de discussão não aprova automaticamente nenhum descriptor.

#### 3. Manual Approval Workflow

- **R2-D-24:** Phase 09 manterá intacto o workflow de aprovação manual da Phase 8.
- **R2-D-25:** Nenhuma entrada será promovida sem `manual_approval: approved`, `primary_disposition: promote_to_seed`, family/subfamily/descriptor concreto, rationale e evidence.
- **R2-D-26:** Approval em chat/transcript não é suficiente; aprovação deve ser persistida no workbook.
- **R2-D-27:** Corpus/review_queue/generic pressure/graph evidence continuam support only.
- **R2-D-28:** Batch approval sem rationale individual continua proibido.
- **R2-D-29:** Phase 09 pode adicionar campos de rastreabilidade da rodada (`round`, `approval_id`, `source_phase`, `validation_expectation`), mas eles não substituem os campos obrigatórios.
- **R2-D-30:** Phase 09 reutilizará `candidate-review.md` como workbook canônico.
- **R2-D-31:** Phase 09 adicionará uma seção própria `Phase 09 / Round 2 Curation`, sem reescrever decisões da Phase 8.
- **R2-D-32:** Novas aprovações usarão IDs `r2-approval-*`.
- **R2-D-33:** Novos gaps/alias cleanup usarão IDs `r2-relation-gap-*`, `r2-accord-gap-*` e `r2-alias-cleanup-*`.
- **R2-D-34:** Workbook separado só será criado se o ledger ficar grande demais.

#### 4. Alias Cleanup

- **R2-D-35:** Phase 09 manterá integralmente a política de aliases da Phase 8.
- **R2-D-36:** Alias exige canonical claro, aprovação manual, rationale e evidence.
- **R2-D-37:** Alias candidates, frequência e string similarity não promovem aliases automaticamente.
- **R2-D-38:** Canonical continua sendo o conceito curado mais estável, não a grafia mais frequente.
- **R2-D-39:** Alias ambíguo ou com target ausente será `defer` ou `reject`, nunca corrigido automaticamente.
- **R2-D-40:** `ylang ylang -> ylang_ylang` permanece como alias cleanup deferido na Phase 09.
- **R2-D-41:** Nenhum alias legado será removido, remapeado ou usado para adicionar descriptor ao seed v2 sem aprovação curatorial específica.
- **R2-D-42:** Phase 09 incluirá alias investigation para novos descriptors candidatos de `green`, `fruity` e `spicy`.
- **R2-D-43:** Alias investigation será registrada no workbook, mas não altera `descriptor_aliases.seed.json` automaticamente.
- **R2-D-44:** Todo novo alias continua exigindo aprovação manual, canonical claro, rationale e evidence.
- **R2-D-45:** Variantes ambíguas como `anisic`, `wintergreen`, `minty`, `warm` e `banana_unripe_banana` devem ser deferidas ou revisadas, não promovidas automaticamente.
- **R2-D-46:** `secondary_hypotheses: add_alias` não equivale a aprovação de alias.

#### 5. Relation/Accord Expansion

- **R2-D-47:** Phase 09 manterá a política da Phase 8 para relation/accord expansion.
- **R2-D-48:** Cada nova subfamily terá relation/accord review obrigatório no workbook.
- **R2-D-49:** Cada nova subfamily deve ter relation/accord aprovado ou gap explícito.
- **R2-D-50:** Missing relation/accord permanece neutral/undefined, nunca `score: 0`.
- **R2-D-51:** Scores de relations/accords continuam manuais, em [0,1], com rationale/evidence.
- **R2-D-52:** Corpus/co-occurrence/review_queue são support only e não definem score.
- **R2-D-53:** Phase 09 deve tentar resolver o gap de `vanilla`, preferencialmente via `vanilla` ↔ `warm_spice` se `warm_spice` for aprovado.
- **R2-D-54:** Não criar relation/accord com endpoint que não exista em `taxonomy-seed.v2.json`.
- **R2-D-55:** Relations/accords ambíguos ficam como gap/defer, não entrada automática.

#### 6. Validation Gates

- **R2-D-56:** Phase 09 manterá os hard gates da Phase 8.
- **R2-D-57:** Phase 09 adicionará hard gate de default drift/protected artifact mutation.
- **R2-D-58:** Phase 09 manterá soft gates para zero-frequency seeds, sparse graph, high review_queue q, deferred gaps, ambiguous candidates, legacy alias target absent.
- **R2-D-59:** Phase 09 validará v2-expanded contra v1 baseline usando 10 métricas obrigatórias.
- **R2-D-60:** Toda mudança curada precisa rastrear para approval persistido no workbook.
- **R2-D-61:** Validação deve registrar especificamente o status de `vanilla` relation/accord gap.
- **R2-D-62:** Validação deve registrar especificamente o status de legacy alias targets ausentes.
- **R2-D-63:** v2-expanded continuará candidato explícito; nenhuma validação promoverá v2 para default.

#### 7. Promotion Readiness (Future Criteria Only)

- **R2-D-64:** Phase 09 documentará promotion readiness apenas como critérios futuros; não promoverá v2.
- **R2-D-65:** Promoção de v2 para default exigirá fase futura separada, com plano próprio.
- **R2-D-66:** Critérios futuros incluem coverage, traceability, alias quality, graph coverage, review queue, generic pressure, hard failures, soft warnings, migration plan e human approval.
- **R2-D-67:** `DEFAULT_PATHS` não serão alterados na Phase 09.
- **R2-D-68:** `data/compiled/v1` não será substituído na Phase 09.
- **R2-D-69:** `taxonomy-seed.v2.json` continuará sendo candidate seed após a Phase 09.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EXP2-01 | Expansion scope: Decide priority groups and subfamilies/descriptors for second v2 expansion. | Target groups: green, fruity, spicy. Exclude deferred categories. |
| EXP2-02 | Candidate prioritization: Define prioritization strategy. | Use evidence-ranked + group-balanced queue internally. |
| EXP2-03 | Manual approval workflow: Preserve workbook workflow structure. | Require persisted workbook manual approval with IDs `r2-approval-*`. |
| EXP2-04 | Alias cleanup: Track alias investigations and legacy targets. | Maintain `ylang ylang` legacy alias status, enforce target presence checks. |
| EXP2-05 | Relation/accord expansion: Define manual relation/accords and vanilla bridge. | Focus on same-family relations, citrus/rose/vanilla bridge accords. |
| EXP2-06 | Validation gates: Implement comparison metrics. | Track 10 metrics side-by-side, enforce 8 hard gates & 6 soft gates. |
| EXP2-07 | Promotion readiness criteria: Define future conditions for default switch. | Document 10 promotion readiness criteria, keeping defaults on v1. |
</phase_requirements>

## Summary

Phase 9 is a continuation of Phase 8 curation processes for taxonomy seed expansion. The project continues to be a Node.js/TypeScript taxonomy compiler with zero runtime dependencies. The core architecture uses pure-function compiler steps that accept custom inputs.

The execution planner will structure Phase 9 into:
1. **Workbook setup & Prioritization (Plan 09-01):** Establish Round 2 curation ledger in the existing `candidate-review.md` workbook, populate candidate priorities based on the specified evidence.
2. **Curation Execution - Seed & Aliases (Plan 09-02):** Process approved candidate items into `taxonomy-seed.v2.json` and `descriptor_aliases.seed.json` inputs.
3. **Curation Execution - Relations & Accords (Plan 09-03):** Process relation and accord expansions into `curated_relations.v2.json` and `accord_map.v2.json`, resolving the `vanilla` gap.
4. **Validation Reporting (Plan 09-04):** Run validation against the 10 comparative metrics, outputting a formal validation report showing the impact of Phase 9.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Curation workbook expansion | Curation ledger (`candidate-review.md`) | Review-only evidence checks | Reuses Phase 8 workbook structure with new Round 2 ID prefix. |
| Curated seed & alias updates | Versioned data input (`data/taxonomy`) | Schema and integrity tests | Edits `taxonomy-seed.v2.json` and `descriptor_aliases.seed.json` without default drift. |
| Curated relations & accords | Versioned inference inputs (`data/inference`) | Similarity graph compiler | Edits `curated_relations.v2.json` and `accord_map.v2.json`, solving the vanilla gap. |
| Comparative reporting | Compiler validation & Quality report | Vitest regression tests | Runs CLI and compile quality gates to output comparative metrics report. |

## Standard Stack

The project relies on:
- **Node.js:** v24.14.0
- **TypeScript:** `^5.8.0`
- **Vitest:** `^3.2.0`
No new npm or runtime dependencies are authorized. All imports must remain pure-function TypeScript using `.js` ESM relative imports.

## Architecture Patterns

### Curation Flow:
```text
candidate-review.md (Round 2)
  |
  +--> [manual_approval: approved]
  |      |
  |      +--> taxonomy-seed.v2.json (new descriptors / subfamilies / families)
  |      +--> descriptor_aliases.seed.json (new aliases pointing to canonicals)
  |      +--> curated_relations.v2.json (new family relations)
  |      +--> accord_map.v2.json (new cross-family accords, e.g., vanilla bridge)
  |
  v
Compile candidate inputs --seed data/taxonomy/taxonomy-seed.v2.json ...
  |
  v
Generate comparison metrics (10 indicators) vs Compiled v1 baseline
```

### Vanilla Gap Resolution Pattern:
The subfamily `vanilla` (created in Phase 8) will be connected to the new `warm_spice` subfamily (to be created in Phase 9 if approved) via a cross-family relation bridge and accord map bridge:
- Curated Relation: `vanilla` (gourmand) ↔ `warm_spice` (spicy) -> `cross_family_tradition_bridge` (Score: 0.65)
- Accord: `warm_spice` ↔ `vanilla` -> `compatible_accord_pair` (Score: 0.75)

### Anti-Patterns to Avoid
- **Auto-promotion:** Do not run scripts that automatically add items from the review queue into the seed.
- **Default Drift:** Do not change CLI parser defaults or overwrite `data/compiled/v1/` artifacts.
- **Legacy Alias Removal:** Do not remove `ylang ylang -> ylang_ylang` legacy alias target warning since it's deferred as a soft finding.

## Validation Architecture

### Verification Commands
- Check types: `cd src && npm run typecheck`
- Run existing tests: `cd src && npm test`
- Compile candidate v2 outputs:
  ```bash
  cd src && npm run compile -- \
    --seed ../data/taxonomy/taxonomy-seed.v2.json \
    --relations ../data/inference/curated_relations.v2.json \
    --accords ../data/inference/accord_map.v2.json \
    --out ../data/compiled/v2-candidate \
    --version 2.0.0-candidate \
    --generated-at 2026-01-01T00:00:00.000Z
  ```
- Run compile quality check:
  ```bash
  cd src && npm run compile:quality -- \
    --seed ../data/taxonomy/taxonomy-seed.v2.json \
    --relations ../data/inference/curated_relations.v2.json \
    --accords ../data/inference/accord_map.v2.json
  ```
