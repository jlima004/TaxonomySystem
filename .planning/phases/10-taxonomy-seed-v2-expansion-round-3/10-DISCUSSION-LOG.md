# Phase 10: Taxonomy Seed v2 Expansion Round 3 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions will be captured in `10-CONTEXT.md` after discussion produces enough stable decisions.

**Date:** 2026-05-23
**Phase:** 10-taxonomy-seed-v2-expansion-round-3
**Status:** active_for_context_gathering
**Execution readiness:** not_ready_for_execution
**Areas proposed:** Expansion scope, Amber/resinous, Animalic, Fresh spice gap, Alias cleanup, Relation/accord expansion, Validation gates, Promotion boundaries

---

## Phase Boundary

Phase 10 is a third curated expansion discussion for `taxonomy-seed.v2.json`, using the approved post-Phase 09 state as baseline. The phase should focus on groups and gaps still pending after Round 2 while keeping v2 candidate-only.

Phase 10 must NOT:
- Promote v2 to default.
- Edit `taxonomy-seed.v1.json`.
- Overwrite `data/compiled/v1/`.
- Promote corpus/review_queue automatically.
- Alter aliases/relations/accords without approval/rationale/evidence in the workbook.
- Create sidecar artifacts by default.
- Alter `DEFAULT_PATHS`.
- Create executable plans before context gathering is complete.
- Implement code or change seed/data/artifact files during registration.

---

## Post-Phase 09 Starting Context

Phase 09 completed and passed validation.

V2 candidate post-Phase 09:
- Families: 7.
- Subfamilies: 13.
- Seed descriptors: 32.
- Review queue: 331.
- Input relation_count: 11.
- Input accord_count: 10.
- Compiled graph edges: 10.
- Hard failures: none.
- Tests: 5 files, 25 tests passed.

Phase 09 added:
- `gourmand` / `vanilla`.
- `green` / `herbal_green` / `basil`.
- `green` / `leafy_green` / `tomato_leaf`.
- `fruity` / `tropical_fruit` / `pineapple`, `banana`.
- `fruity` / `red_fruit` / `strawberry`, `blackberry`.
- `fruity` / `orchard_fruit` / `melon`.
- `spicy` / `warm_spice` / `cinnamon`, `clove`, `allspice`.

Known deferred items:
- `fresh_spice` remains absent/deferred.
- `ylang ylang -> ylang_ylang` remains a legacy alias soft finding/deferred cleanup.
- v2 remains candidate-only and is not default.

---

## Initial Discussion Prompt

Which areas do you want to discuss for Phase 10: Taxonomy Seed v2 Expansion Round 3? Select all that apply.

| Option | Area | Description | Recommended |
|--------|------|-------------|-------------|
| 1 | All areas | Discuss expansion scope, amber_resinous, animalic, fresh_spice gap, alias cleanup, relation/accord expansion, validation gates, and promotion boundaries. | yes |
| 2 | Expansion scope | Quais groups/subfamilies entram na Round 3. | |
| 3 | Amber/resinous | Como curar `amber_resinous`, `amber`, `balsamic_resin`, `resinous`, `labdanum`, `benzoin`. | |
| 4 | Animalic | Como curar `animalic`, `musky`, `leathery`, `musk`, `ambrette`, `civet`, `animal`. | |
| 5 | Fresh spice gap | Se `fresh_spice` deve continuar deferido ou receber descriptor concreto como `anise`. | |
| 6 | Alias cleanup | Como tratar aliases legados e novos aliases possíveis, incluindo `ylang ylang -> ylang_ylang`. | |
| 7 | Relation/accord expansion | Como adicionar relations/accords para novos groups sem heurística automática. | |
| 8 | Validation gates | Como comparar v1 vs v2-round-3 e medir melhoria. | |
| 9 | Promotion boundaries | Critérios futuros de promoção continuam documentados, mas Phase 10 não promove v2. | |
| 10 | Type your own answer | Add another discussion area. | |

**Initial recommendation:** discuss all areas (option 1).

**User selection:** All areas (option 1).

Next discussion order:

1. Expansion scope
2. Amber/resinous
3. Animalic
4. Fresh spice gap
5. Alias cleanup
6. Relation/accord expansion
7. Validation gates
8. Promotion boundaries

---

## Decision Capture Rules

Use decision IDs `R3-D-01`, `R3-D-02`, `R3-D-03`, and so on.

Until `10-CONTEXT.md` exists, this log records proposed areas, alternatives and discussion notes only. No decision in this file authorizes implementation.

---

## 1. Expansion Scope

### Round 3 Scope Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Amber + Animalic + Fresh Spice Review | Expand `amber_resinous` and `animalic`; review `fresh_spice` only if a concrete descriptor is approved. Do not touch additional gourmand or `ylang_ylang` yet. | yes |
| Amber + Animalic only | Expand only `amber_resinous` and `animalic`; keep `fresh_spice` deferred. | |
| Fresh Spice + Amber | Resolve `fresh_spice` and `amber_resinous`; leave `animalic` for later. | |
| Full pending scope | Attempt `amber_resinous`, `animalic`, `fresh_spice`, additional gourmand and `ylang_ylang` cleanup in the same phase. | |
| Discussion only | Discuss alternatives without closing scope yet. | |

**User's choice:** Amber + Animalic + Fresh Spice Review.

**Rationale:** Phase 09 already added green, fruity and `warm_spice`. Round 3 should cover the two large groups still pending from Phase 8/9, `amber_resinous` and `animalic`, and review `fresh_spice` because proposals remain pending from Phase 09. `fresh_spice` must not be created empty.

**Decisions:**

- **R3-D-01:** Phase 10 Round 3 will focus on `amber_resinous`, `animalic` and conditional `fresh_spice` review.
- **R3-D-02:** `amber_resinous` and `animalic` are real promotion scopes for this round.
- **R3-D-03:** `fresh_spice` may be created only if a concrete descriptor such as `anise` is approved; it must not be created empty.
- **R3-D-04:** Additional gourmand review is deferred to a future round, except as support evidence or explicit defer notes.
- **R3-D-05:** `ylang ylang -> ylang_ylang` remains deferred alias cleanup in this round unless a later explicit decision opens floral/ylang cleanup.

---

## 2. Amber/Resinous

### Subfamily Model

| Option | Description | Selected |
|--------|-------------|----------|
| Amber + balsamic_resin | Create/review subfamilies `amber` and `balsamic_resin`, with explicit decisions for `amber`, `resinous`, `labdanum`, `benzoin` and `balsamic`. | yes |
| Balsamic resin only | Create/review only `balsamic_resin`; keep `amber` deferred to avoid semantic duplication. | |
| Amber only | Create/review only `amber`; leave resins/balsamics for a future round. | |
| Evidence review first | Discuss evidence and risks before approving any amber/resinous subfamily. | |
| Defer amber/resinous | Keep amber/resinous out of Round 3 despite initial scope. | |

**User's choice:** Amber + balsamic_resin.

### Policy

- `amber_resinous` enters Phase 10 as a real promotion scope.
- `amber` and `balsamic_resin` should be treated as distinct subfamilies.
- No descriptor is promoted automatically by frequency or review_queue.
- Each descriptor needs manual approval, rationale and evidence persisted in the workbook.
- Corpus/review_queue remains support only.

### Candidate Review

**Subfamily: `amber`**

Candidates:
- `amber`

Possible defer/support:
- `warm`
- `sweet`
- `ambery`, if present, should be investigated as alias/canonical candidate, not promoted automatically.

Rationale: `amber` is a stable olfactive concept and may function as a specific subfamily inside `amber_resinous`, but it must be approved carefully to avoid duplication with the family.

**Subfamily: `balsamic_resin`**

Candidates:
- `resinous`
- `labdanum`
- `benzoin`
- `balsamic`

Rationale: `balsamic_resin` covers more material or faceted resinous/balsamic facets, while `amber` covers the broader amber accord/concept.

Specific rules:
- `resinous` can be approved as a descriptor in `balsamic_resin` if curation accepts it as a concrete olfactive descriptor, not only a generic signal.
- `labdanum` and `benzoin` are strong candidates because they are clear resinous/balsamic materials or concepts.
- `balsamic` requires careful review because it may be valid descriptor or generic attribute; if unclear, defer/support.
- Do not create `amber_resinous` as a descriptor.
- Do not create empty subfamilies.
- Do not use `amber` as family, subfamily and descriptor without explicit rationale for each level.

### Alias Notes

- Investigate aliases only when there is a clear canonical target.
- Do not add aliases without `primary_disposition: add_alias`.
- Possible aliases/variants go to alias investigation, not automatically to seed.

### Relations/Accords To Discuss Later

- `amber` ↔ `vanilla`
- `balsamic_resin` ↔ `vanilla`
- `amber` ↔ `balsamic_resin`
- `balsamic_resin` ↔ `woody_dry`
- `amber` ↔ `warm_spice`

**Decisions:**

- **R3-D-06:** Phase 10 Round 3 will include `amber_resinous` as a real promotion scope.
- **R3-D-07:** `amber_resinous` will be modeled with two candidate subfamilies: `amber` and `balsamic_resin`.
- **R3-D-08:** `amber` will be reviewed as a descriptor candidate inside the `amber` subfamily, with no automatic promotion.
- **R3-D-09:** `resinous`, `labdanum`, `benzoin` and `balsamic` will be reviewed as candidates for `balsamic_resin`.
- **R3-D-10:** `balsamic` and `resinous` require caution due to possible genericity; if there is no consensus, they remain defer/support.
- **R3-D-11:** No amber/resinous subfamily will be created empty.
- **R3-D-12:** Relations/accords involving `amber`, `balsamic_resin`, `vanilla`, `woody_dry` and `warm_spice` will be discussed later and require their own approval.

---

## 3. Animalic

### Subfamily Model

| Option | Description | Selected |
|--------|-------------|----------|
| Musky + leathery | Model `animalic` with subfamilies `musky` and `leathery`; review `musk`, `musky`, `ambrette`, `civet`, `leathery` and `animal` with canonical/alias caution. | yes |
| Musky only | Create/review only `musky`; defer leather/civet/broader animalic. | |
| Leathery only | Create/review only `leathery`; defer musky/musk. | |
| Evidence review first | Discuss evidence and risks before approving animalic subfamilies. | |
| Defer animalic | Keep animalic out of Round 3 despite initial scope. | |

**User's choice:** Musky + leathery.

### Policy

- `animalic` enters Phase 10 as a real promotion scope.
- `musky` and `leathery` should be treated as distinct subfamilies.
- No animalic descriptor is promoted automatically.
- Each descriptor needs manual approval, rationale and evidence persisted in the workbook.
- Corpus/review_queue remains support only.

### Candidate Review

**Subfamily: `musky`**

Candidates:
- `musk`
- `musky`
- `ambrette`

Review carefully:
- `animal`
- `civet`

Rationale: `musky` is more stable and useful than a generic animalic bucket. `musk` and `musky` require an explicit canonical decision because they may compete as noun/adjective forms. `ambrette` may be a concrete descriptor inside `musky`, but requires its own approval.

Canonical decision:
- Initial preference: use `musk` as descriptor when the concept is material/note-like.
- Use `musky` only if curation prefers adjectival form as descriptor canonical.
- Do not keep `musk` and `musky` as separate primary descriptors without explicit rationale.
- If one is canonical and the other is a variant, handle through alias investigation, not duplicate seed entries.

**Subfamily: `leathery`**

Candidates:
- `leathery`

Review carefully:
- `leather`, if it appears as alias/candidate.
- `animal`
- `civet`

Rationale: `leathery` is a clear animalic/dry facet and should have its own space to avoid improper absorption into `woody_dry`.

### Candidate-Specific Policy

`animal`:
- Do not promote automatically.
- Treat as broad/generic animalic signal.
- May support creating family `animalic`, but should not become a primary descriptor without strong rationale.
- Default disposition: defer/support.

`civet`:
- Review as a concrete animalic descriptor, but carefully.
- May be a future descriptor in `musky` or a more animalic-specific bucket, but should remain review/defer unless explicitly approved in this round.
- Do not use as relation/accord score evidence alone.

`ambrette`:
- Strong candidate for `musky` because it is more concrete than `animal`.
- May be approved if rationale/evidence are sufficient.

`leathery`:
- Strong candidate for `leathery`.
- If `leather` exists as alias/candidate, investigate alias to `leathery`, but do not add without approved `add_alias` disposition.

### Alias Notes

- `musk` vs `musky` requires mandatory alias/canonical investigation.
- No new alias enters without `manual_approval: approved`, `primary_disposition: add_alias`, `alias_key`, existing canonical target in seed v2, rationale and evidence.

### Relations/Accords To Discuss Later

- `musky` ↔ `leathery`
- `musky` ↔ `floral_rose`
- `musky` ↔ `amber`
- `musky` ↔ `vanilla`
- `leathery` ↔ `woody_dry`
- `leathery` ↔ `balsamic_resin`

Specific rules:
- Do not create `animalic` as a descriptor.
- Do not create empty subfamilies.
- Do not promote `animal` based on frequency alone.
- Do not create `musk` and `musky` as separate descriptors without explicit decision.
- Do not resolve aliases by automatic frequency.

**Decisions:**

- **R3-D-13:** Phase 10 Round 3 will include `animalic` as a real promotion scope.
- **R3-D-14:** `animalic` will be modeled with two candidate subfamilies: `musky` and `leathery`.
- **R3-D-15:** `musk`, `musky` and `ambrette` will be reviewed as candidates for `musky`.
- **R3-D-16:** `leathery` will be reviewed as a candidate for `leathery`.
- **R3-D-17:** `animal` will be treated as broad support signal by default, not an automatic descriptor.
- **R3-D-18:** `civet` will be treated as sensitive/ambiguous candidate and requires explicit approval before any promotion.
- **R3-D-19:** `musk` vs `musky` requires canonical/alias decision; they cannot be promoted as duplicates without rationale.
- **R3-D-20:** Relations/accords involving `musky`, `leathery`, `floral_rose`, `woody_dry`, `amber`, `balsamic_resin` and `vanilla` will be discussed later and require their own approval.

---

## 4. Fresh Spice Gap

### Conditional Review

| Option | Description | Selected |
|--------|-------------|----------|
| Conditional anise review | Review `anise` as a possible concrete descriptor; create `fresh_spice` only if `anise` is approved; treat `anisic` as review/defer. | yes |
| Keep deferred | Keep `fresh_spice` absent/deferred in this round. | |
| Approve fresh_spice with anise | Define intent to create `fresh_spice` with `anise`, still requiring persisted workbook approval before execution. | |
| Broader fresh spice review | Review `anise`, `anisic`, `minty`, `wintergreen` and possible fresh/cooling candidates. | |
| Discussion only | Discuss the gap without deciding policy yet. | |

**User's choice:** Conditional anise review.

### Policy

- `fresh_spice` must not be created empty.
- `fresh_spice` can enter `taxonomy-seed.v2.json` only if at least one concrete descriptor is approved.
- The primary candidate for creating `fresh_spice` is `anise`.
- `anisic` should be treated as review/defer, not automatic approval.
- `minty` and `wintergreen` do not enter this block by default; they remain ambiguous across green/fresh/cooling/medicinal and may be treated in a future phase.

### Candidate Review

**Subfamily: `fresh_spice`**

Candidate:
- `anise`

Rationale: `anise` is concrete and may represent a fresh/aromatic spice facet with clearer boundaries than generic terms such as `fresh`, `cooling`, `minty` or `anisic`.

Review/defer:
- `anisic`

Rationale: `anisic` may be nuance, chemical/adjectival descriptor or related term. It must not be promoted automatically as primary descriptor without specific curatorial decision.

Do not include now:
- `minty`
- `wintergreen`

Rationale: Both may relate to fresh/cooling/green/medicinal, but would broaden `fresh_spice` too much. They remain deferred until a specific mint/cooling/medicinal-fresh round.

### Relations/Accords If Approved

- `fresh_spice` ↔ `warm_spice`
- `fresh_spice` ↔ `citrus_fresh`

Specific rules:
- Relations/accords apply only if `fresh_spice` exists in seed v2.
- Scores must be manual and in [0,1].
- Do not create placeholder `score: 0`.
- If `anise` is not approved, `fresh_spice` remains absent/deferred.
- If `fresh_spice` remains absent, historical pending/deferred Round 2 fresh_spice relation/accord records remain deferred, not errors.

**Decisions:**

- **R3-D-21:** Phase 10 Round 3 will review `fresh_spice` conditionally.
- **R3-D-22:** `fresh_spice` will be created only if a concrete descriptor is approved.
- **R3-D-23:** `anise` will be the primary candidate for `fresh_spice`.
- **R3-D-24:** `anisic` will be treated as review/defer by default.
- **R3-D-25:** `minty` and `wintergreen` remain outside `fresh_spice` scope in this round unless a later explicit decision changes that.
- **R3-D-26:** If `anise` is not approved, `fresh_spice` remains absent/deferred.
- **R3-D-27:** Relations/accords involving `fresh_spice` can be applied only if the endpoint exists in `taxonomy-seed.v2.json`.

---

## 5. Alias Cleanup

### Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Targeted only | Investigate only aliases tied to Round 3 scope (`musk`/`musky`, `leather`/`leathery`, possible `ambery`), while keeping `ylang_ylang` deferred. | yes |
| Musk aliases only | Investigate only `musk` vs `musky`; defer everything else. | |
| Full alias cleanup | Open broad cleanup including `ylang ylang -> ylang_ylang` and floral/exotic-floral. | |
| No aliases | Do not discuss or alter aliases in this phase; descriptors/subfamilies only. | |
| Discussion only | Discuss policy without closing alias scope yet. | |

**User's choice:** Targeted only.

Alias investigation scope:
- `musk` vs `musky`
- `leather` vs `leathery`, if `leather` appears as candidate/alias
- Possible variants such as `ambery`, if they appear in corpus or review_queue
- Possible direct aliases of `labdanum`, `benzoin`, `balsamic`, `resinous`, if there is clear evidence

Out of scope:
- `ylang ylang -> ylang_ylang`
- Broad floral/exotic-floral cleanup
- Aliases unrelated to `amber_resinous`, `animalic` or `fresh_spice`
- Aliases without a clear canonical target in seed v2

### Policy

- No new alias enters automatically.
- No legacy alias is removed automatically.
- No alias is remapped automatically.
- Alias candidates, corpus frequency and string similarity are support only.
- Every new alias requires `manual_approval: approved`, `primary_disposition: add_alias`, `alias_key`, existing canonical target in `taxonomy-seed.v2.json`, rationale, evidence and persisted workbook approval.

### Candidate-Specific Rules

**Musk / musky**

- Phase 10 should decide canonical between `musk` and `musky` if both appear.
- Initial preference: use `musk` as canonical descriptor if the concept is treated as note/material.
- `musky` can become alias of `musk` only with approved `add_alias` disposition.
- Do not create `musk` and `musky` as separate primary descriptors without explicit rationale.

**Leather / leathery**

- If subfamily `leathery` is approved, `leathery` can be canonical descriptor.
- If `leather` appears as variant/candidate, investigate as possible alias to `leathery`.
- Do not add `leather -> leathery` without approved `add_alias` disposition.

**Amber / ambery**

- `amber` can be canonical descriptor inside subfamily `amber`, if approved.
- `ambery`, if present, should be investigated as possible alias or adjectival descriptor.
- Do not promote `ambery` automatically.
- Do not create alias `ambery -> amber` without specific approval.

**Ylang ylang**

- `ylang ylang -> ylang_ylang` remains deferred.
- Do not remove it.
- Do not remap it.
- Do not add `ylang_ylang` to seed v2 in this phase.
- Resolving this requires a future floral/exotic-floral round or explicit policy for aliases external to seed.

**Decisions:**

- **R3-D-28:** Phase 10 will use alias cleanup targeted to Round 3 scope.
- **R3-D-29:** Alias investigation will cover `musk`/`musky`, `leather`/`leathery` and relevant amber/resinous variants.
- **R3-D-30:** `ylang ylang -> ylang_ylang` remains a legacy alias soft finding/deferred cleanup in this round.
- **R3-D-31:** No new alias will be added without `manual_approval: approved`, `primary_disposition: add_alias`, clear canonical target, rationale and evidence.
- **R3-D-32:** Alias candidates, corpus frequency and string similarity remain support only.
- **R3-D-33:** No legacy alias will be removed or remapped automatically.

---

## 6. Relation/Accord Expansion

### Policy Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Approved-or-gap per subfamily | Every new subfamily needs an approved relation/accord or explicit gap; manual [0,1] scores; existing endpoints; no score 0 placeholder. | yes |
| Minimal relations only | Add only essential internal relations, for example `amber` ↔ `balsamic_resin` and `musky` ↔ `leathery`. | |
| Defer all | Do not add relations/accords this round; register gaps for all new endpoints. | |
| Full relation set | Discuss and try to approve all suggested links with vanilla, woody_dry, warm_spice, floral_rose and citrus_fresh. | |
| Discussion only | Discuss options without closing policy yet. | |

**User's choice:** Approved-or-gap per subfamily.

### Policy

- Every new subfamily created in Round 3 needs at least one manually approved relation/accord or an explicit relation_gap/accord_gap in the workbook.
- Scores must be manual and in [0,1].
- Corpus/co-occurrence/review_queue remain support only.
- Endpoints must exist in `taxonomy-seed.v2.json`.
- Do not create relation/accord records with absent endpoints.
- Do not create placeholder `score: 0`.
- Missing relation/accord remains neutral/undefined.
- Every relation/accord needs its own workbook approval with `manual_approval: approved`, `primary_disposition: approve_relation_accord`, source/target subfamily IDs, manual score, rationale and evidence/reference.

### Amber/Resinous Candidates

If `amber` and `balsamic_resin` are approved:

High priority:
- `amber` ↔ `balsamic_resin`: relation `same_family_tradition`, suggested score 0.85, rationale: same `amber_resinous` family and semantically close.

Accord/relation candidates:
- `balsamic_resin` ↔ `vanilla`: accord or relation bridge, suggested score 0.70, rationale: balsamic/resinous facets are compatible with gourmand/vanilla.
- `amber` ↔ `vanilla`: accord, suggested score 0.70, rationale: amber/vanilla is common compatibility but should be conservative.
- `balsamic_resin` ↔ `woody_dry`: accord/relation bridge, suggested score 0.65, rationale: resins/balsamics can support woody/dry structures.
- `amber` ↔ `warm_spice`: accord, suggested score 0.65, rationale: amber and warm spice can be warm/oriental-compatible but require manual approval.

### Animalic Candidates

If `musky` and `leathery` are approved:

High priority:
- `musky` ↔ `leathery`: relation `same_family_tradition`, suggested score 0.80, rationale: same animalic family, related but distinct.

Accord/relation candidates:
- `musky` ↔ `floral_rose`: accord, suggested score 0.65, rationale: musky can support floral/rose; conservative score.
- `musky` ↔ `vanilla`: accord, suggested score 0.60, rationale: musk/vanilla may be compatible but should not be overestimated.
- `leathery` ↔ `woody_dry`: accord/relation bridge, suggested score 0.70, rationale: leathery and dry woods have clear structural compatibility.
- `leathery` ↔ `balsamic_resin`: accord, suggested score 0.60, rationale: leather/resin can be coherent but depends on `balsamic_resin` approval.

### Fresh Spice Candidates

If `fresh_spice` is approved with `anise`:

High priority:
- `fresh_spice` ↔ `warm_spice`: relation `same_family_tradition`, suggested score 0.80, rationale: complementary spicy subfamilies.

Accord:
- `fresh_spice` ↔ `citrus_fresh`: accord `compatible_accord_pair`, suggested score 0.65, rationale: fresh spice/anise can combine with `citrus_fresh` in aromatic/fresh directions.

If `fresh_spice` is not approved:
- Keep `fresh_spice` absent/deferred.
- Register relation_gap/accord_gap.
- Do not create edge with absent endpoint.

### Containment Rule

Do not try to approve the full relation set automatically. Prioritize a small set of strong manual edges:

1. Internal `amber_resinous` relation.
2. Internal `animalic` relation.
3. Internal `fresh_spice`/`warm_spice` relation if `fresh_spice` exists.
4. One or two useful cross-family accords per group if there is clear rationale.

**Decisions:**

- **R3-D-34:** Phase 10 will use approved-or-gap policy for each new subfamily.
- **R3-D-35:** Every new subfamily needs an approved relation/accord or explicit gap.
- **R3-D-36:** Scores will be manual and in [0,1], with rationale/evidence; corpus is support only.
- **R3-D-37:** There will be no placeholder `score: 0`; missing remains neutral/undefined.
- **R3-D-38:** Relations/accords can use only endpoints that exist in `taxonomy-seed.v2.json`.
- **R3-D-39:** Round 3 will prioritize internal family relations and a small number of high-confidence cross-family accords.
- **R3-D-40:** `fresh_spice` will receive relations/accords only if created with an approved descriptor.

---

## 7. Validation Gates

### Gate Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 9 gates + R3 metrics | Maintain Phase 9 hard/soft gates and add metrics for `amber_resinous`, `animalic`, `fresh_spice`, targeted alias cleanup and approved-or-gap traceability. | yes |
| Strict promotion readiness | Apply near-promotion gates, even without promoting v2. | |
| Minimal validation | Validate only schema, determinism, no default drift and protected artifacts. | |
| Curation traceability focus | Focus mainly on workbook traceability and blocking changes without approval. | |
| Discussion only | Discuss validation without closing gates yet. | |

**User's choice:** Phase 9 gates + R3 metrics.

### Policy

- Phase 10 does not promote v2 to default.
- Phase 10 validates v2-round-3 as explicit candidate.
- Compile v1 baseline and v2 candidate under `/tmp/opencode/...`.
- Never write to `data/compiled/v1`.
- Never alter `taxonomy-seed.v1.json`.
- Never alter `curated_relations.v1.json`.
- Never alter `accord_map.v1.json`.
- Never alter `DEFAULT_PATHS`.
- Hard gates fail validation.
- Soft gates become documented warnings/review findings.

### Hard Gates Maintained From Phase 9

1. Schema invalid: `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json` must validate.
2. Nondeterminism: compiles with same input and fixed `generated_at` must be deterministic.
3. Hard/pattern-excludes: no hard-exclude or pattern-exclude descriptor may appear in taxonomy output.
4. Alias contamination: `descriptor_aliases.json` remains authoritative-only; alias candidate/review-only aliases cannot enter authoritative artifacts.
5. Auto-promotion: corpus/review_queue/frequency/generic pressure cannot become seed truth, alias, relation or accord without persisted workbook approval.
6. Default drift: `DEFAULT_PATHS` continue pointing to v1.
7. Protected artifact mutation: `data/compiled/v1/` and protected v1 inputs cannot be altered.
8. Curated change without workbook traceability: any seed/alias/relation/accord change must trace to approval or explicit gap in the workbook.

### Soft Gates Maintained

1. Zero-frequency seeds: seed descriptors with frequency 0 become warnings if they have rationale.
2. Sparse graph / density drop: low graph density is a warning if new endpoints have approved relation/accord or explicit gap.
3. High review_queue: still-high or concentrated review queue indicates remaining curation work.
4. Deferred gaps: `fresh_spice`, alias cleanup and relation/accord gaps may remain soft findings if documented.
5. Ambiguous candidates: candidates such as `anisic`, `animal`, `civet`, `balsamic`, `resinous` and `musk`/`musky` conflict may remain defer/review.
6. Legacy alias target absent: `ylang ylang -> ylang_ylang` remains soft finding/deferred cleanup if not in Round 3 scope.

### Mandatory Round 3 Metrics

**1. Coverage counts**

Compare v1 baseline vs v2-round-3:
- family_count
- subfamily_count
- seed descriptor count
- total compiled descriptors
- corpus-derived candidates
- candidate/seed ratio

Expected:
- v2-round-3 increases coverage in a controlled way.
- Each new entry needs approval/rationale/evidence.

**2. Amber/resinous coverage**

Measure:
- Whether `amber_resinous` exists.
- Created subfamilies: `amber`, `balsamic_resin`.
- Approved descriptors: `amber`, `resinous`, `labdanum`, `benzoin`, `balsamic`.
- Which candidates were deferred and why.

Hard failure:
- Create `amber_resinous`, `amber` or `balsamic_resin` without approved workbook entry.
- Create empty subfamily without approved gap/scaffold.

Soft finding:
- `resinous` or `balsamic` deferred due to genericity.

**3. Animalic coverage**

Measure:
- Whether `animalic` exists.
- Created subfamilies: `musky`, `leathery`.
- Approved descriptors: `musk`, `musky`, `ambrette`, `civet`, `leathery`, `animal`.
- Canonical decision `musk` vs `musky`.

Hard failure:
- Promote `musk` and `musky` as duplicates without explicit rationale.
- Create `musk`/`musky` alias without approved `add_alias`.
- Promote `animal` automatically based only on frequency.

Soft finding:
- `animal`, `civet` or `ambrette` deferred because of boundary/risk.

**4. Fresh spice status**

Measure:
- Whether `fresh_spice` exists.
- If it exists, which concrete descriptor was approved.
- Whether `anise` was approved.
- Whether `anisic` was deferred/reviewed.
- Whether historical Round 2 fresh_spice relation/accord records were resolved or remain deferred.

Hard failure:
- Create empty `fresh_spice` without approved descriptor or scaffold/gap approval.
- Create relation/accord with endpoint `fresh_spice` if it does not exist.

Soft finding:
- `fresh_spice` remains absent/deferred with rationale.

**5. Approved-or-gap traceability**

For each new Round 3 subfamily, require at least one approved relation/accord or explicit `relation_gap` / `accord_gap` in the workbook.

Measure:
- new_subfamily_count
- new_subfamilies_with_relation_or_accord
- new_subfamilies_with_explicit_gap
- new_subfamilies_without_coverage

Hard failure:
- New subfamily without relation/accord and without explicit gap.

**6. Graph coverage**

Compare:
- input relation_count
- input accord_count
- compiled graph edges
- graph density
- isolated subfamilies
- edges involving Round 3 endpoints

Expected:
- Edges increase or gaps are documented.
- Isolated subfamilies are 0 or justified by approved gap.

Soft finding:
- Graph density drops because expansion outpaces edges, provided there are no isolated subfamilies without rationale.

**7. Generic pressure**

Measure pressure in:
- `floral_rose`
- `citrus_fresh`
- `woody_dry`
- `warm_spice`
- new Round 3 subfamilies

Indicators:
- Reduced amber/resinous candidates routed into `woody_dry` or `floral_rose`.
- Reduced animalic/leathery pressure in `woody_dry`.
- Absorption by `amber`, `balsamic_resin`, `musky`, `leathery`, `fresh_spice`, if created.

**8. Review queue quality**

Compare:
- total review_queue
- `corpus_candidate_low_support`
- `seed_corpus_conflict`
- distribution by severity/type
- items related to amber_resinous
- items related to animalic
- items related to fresh_spice

Expected:
- Review queue total reduces or becomes more actionable.
- Increase in seed_corpus_conflict may be soft warning if caused by curated seeds with rationale.

**9. Alias targeted cleanup quality**

Measure:
- aliases added in Round 3
- aliases with target present in seed v2
- aliases without target
- aliases deferred
- `musk`/`musky` decision
- `leather`/`leathery` decision, if applicable
- `ambery` decision, if applicable
- `ylang ylang -> ylang_ylang` status

Hard failure:
- New alias without approved `add_alias`.
- New alias pointing to absent target without explicit policy.
- Alias candidate promoted automatically.

Soft finding:
- `ylang ylang -> ylang_ylang` remains deferred.

**10. Zero-frequency seeds**

Measure:
- inherited zero-frequency seeds
- new Round 3 zero-frequency seeds
- rationale for each new zero-frequency seed

Hard failure:
- New zero-frequency seed without rationale/evidence.

Soft finding:
- Zero-frequency seed approved manually with rationale.

**11. Determinism/schema/defaults**

Validate:
- fixed `generated_at`
- compile v1 explicit path
- compile v2-round-3 explicit path
- schema validation
- quality gates
- no default switch
- protected files unchanged

**12. Curation traceability**

For each change in:
- `taxonomy-seed.v2.json`
- `descriptor_aliases.seed.json`
- `curated_relations.v2.json`
- `accord_map.v2.json`

Require:
- approval_id
- `round: phase_10_round_3`
- `manual_approval: approved`
- correct `primary_disposition`
- rationale
- evidence
- source refs
- coherent `promotion_effect`

Hard failure:
- Any change without workbook traceability.

### Recommended Success Metrics

Phase 10 should seek to:
- Add `amber_resinous` and/or `animalic` with real approvals.
- Resolve or document `fresh_spice`.
- Increase graph edges without artificial edges.
- Reduce review_queue or make it more actionable.
- Reduce generic pressure in old buckets.
- Keep hard failures = none.
- Keep v2 candidate-only.

**Decisions:**

- **R3-D-41:** Phase 10 will maintain Phase 9 hard/soft gates.
- **R3-D-42:** Phase 10 will add metrics specific to `amber_resinous`, `animalic`, `fresh_spice`, targeted alias cleanup and approved-or-gap traceability.
- **R3-D-43:** Every new Round 3 subfamily needs approved relation/accord or explicit gap.
- **R3-D-44:** Any seed/alias/relation/accord change without approval or gap persisted in the workbook is a hard failure.
- **R3-D-45:** Empty `fresh_spice` or relation/accord with nonexistent endpoint is a hard failure.
- **R3-D-46:** New alias without approved `add_alias` is a hard failure.
- **R3-D-47:** Promotion readiness remains documented only as future criteria, not an active promotion gate.

---

## 8. Promotion Boundaries

### Boundary Selection

| Option | Description | Selected |
|--------|-------------|----------|
| No promotion, criteria only | Phase 10 does not promote v2; only maintains/updates future promotion criteria if necessary, without `DEFAULT_PATHS` or `data/compiled/v1` changes. | yes |
| Promotion readiness audit | Do not promote, but produce stronger readiness criteria for a future phase. | |
| Prepare migration plan | Do not promote yet, but discuss future migration, rollback and default switch. | |
| Strict no promotion discussion | Do not discuss promotion beyond reaffirming it is out of scope. | |
| Discussion only | Discuss boundaries without closing policy yet. | |

**User's choice:** No promotion, criteria only.

### Policy

- Phase 10 does not promote `taxonomy-seed.v2.json` to default.
- Phase 10 does not alter `DEFAULT_PATHS`.
- Phase 10 does not write official outputs to `data/compiled/v1`.
- Phase 10 does not create `data/compiled/v2` as an official artifact by default.
- Phase 10 does not replace any v1 artifact.
- Phase 10 does not make v2 default even if all tests pass.
- Phase 10 may only maintain or update future promotion criteria if Round 3 expansion reveals new requirements.

### Permitted Scope

- Expand `taxonomy-seed.v2.json` as candidate.
- Update `curated_relations.v2.json` and `accord_map.v2.json` as candidate inputs.
- Update `descriptor_aliases.seed.json` only if there is approved `add_alias` disposition.
- Generate v1 vs v2-round-3 comparison under `/tmp/opencode/...`.
- Document soft findings and future readiness criteria.

### Out of Scope

- Default switch.
- Executable migration plan.
- Executable rollback plan.
- Official v2 publication.
- Altering `src/cli/parse_args.ts` to v2.
- Altering `data/compiled/v1`.
- Removing or replacing v1.

### Future Promotion Readiness Criteria

Phase 10 may update future criteria as documentation only. Future criteria still include:
- hard failures = none
- aliases without absent targets or explicit policy for external targets
- sufficient graph coverage
- review_queue reduced or more actionable
- generic pressure reduced
- approved-or-gap complete per subfamily
- zero-frequency seeds justified
- deterministic compile
- final human approval
- separate migration/rollback plan

Even if Phase 10 passes all gates, final status remains:

`taxonomy-seed.v2.json`: expanded candidate, not default.

**Decisions:**

- **R3-D-48:** Phase 10 will not promote v2 to default.
- **R3-D-49:** Phase 10 will not alter `DEFAULT_PATHS`, `data/compiled/v1` or official v1 artifacts.
- **R3-D-50:** Phase 10 may update promotion readiness criteria only as future documentation.
- **R3-D-51:** Any default switch requires a separate future phase with explicit human approval, migration plan and rollback plan.
- **R3-D-52:** The expected Phase 10 outcome is v2-round-3 expanded candidate, not default.

---

## Discussion Summary

**Date:** 2026-05-23
**Areas discussed:** 8/8 complete
**Decisions captured:** R3-D-01 through R3-D-52

| Area | Decisions | Key Outcomes |
|------|-----------|--------------|
| Expansion scope | R3-D-01 to R3-D-05 | Scope is `amber_resinous`, `animalic` and conditional `fresh_spice`; gourmand and `ylang_ylang` deferred |
| Amber/resinous | R3-D-06 to R3-D-12 | Candidate subfamilies `amber` and `balsamic_resin`; cautious treatment of `resinous`/`balsamic` |
| Animalic | R3-D-13 to R3-D-20 | Candidate subfamilies `musky` and `leathery`; mandatory `musk`/`musky` canonical investigation |
| Fresh spice gap | R3-D-21 to R3-D-27 | Conditional `fresh_spice` review with `anise`; `anisic` defer/review; no empty subfamily |
| Alias cleanup | R3-D-28 to R3-D-33 | Targeted alias cleanup only; `ylang_ylang` remains deferred |
| Relation/accord expansion | R3-D-34 to R3-D-40 | Approved-or-gap per new subfamily; manual scores; existing endpoints only |
| Validation gates | R3-D-41 to R3-D-47 | Phase 9 gates plus R3 metrics for coverage, traceability and endpoint quality |
| Promotion boundaries | R3-D-48 to R3-D-52 | No promotion; future criteria only; v2-round-3 remains candidate |

**Next step:** Create `10-CONTEXT.md` from these 52 decisions, then proceed to research/planning only when explicitly authorized.

---

## Recommended Direction for Phase 10

### Priority 1 - Amber/Resinous

Candidate subfamilies:
- `amber`
- `balsamic_resin`

Candidate descriptors/evidence:
- `amber`
- `resinous`
- `labdanum`
- `benzoin`
- `balsamic`

Policy notes:
- Corpus/review_queue is support only.
- Do not create descriptors that are too generic without approval.
- `amber` may be descriptor and/or subfamily, but requires explicit decision to avoid semantic duplication.

### Priority 2 - Animalic

Candidate subfamilies:
- `musky`
- `leathery`

Candidate descriptors/evidence:
- `musk`
- `musky`
- `leathery`
- `ambrette`
- `civet`
- `animal`

Policy notes:
- `animal` is likely a broad/generic signal and must not be promoted automatically.
- `musk` vs `musky` requires a canonical decision.
- Alias investigation is required for `musk`/`musky`.

### Priority 3 - Fresh Spice Gap

Candidate subfamily:
- `fresh_spice`

Candidate descriptors/evidence:
- `anise`
- `anisic`

Policy notes:
- Do not create empty `fresh_spice`.
- `anise` may be a concrete descriptor.
- `anisic` requires careful review and may be descriptor, nuance, alias-related or deferred.
- If approval is not clear, keep `fresh_spice` absent/deferred.

---

## Deferred Until Discussion/Context Approval

- `10-CONTEXT.md` until discussion captures enough stable decisions.
- `10-01-PLAN.md`.
- `10-RESEARCH.md`.
- `10-PATTERNS.md`.
- `10-VALIDATION.md`.
- Code changes.
- Seed/data changes.
- Compiled artifact changes.
