# Phase 8 Candidate Review Workbook

Status: awaiting human curation. This workbook is the Phase 8 approval ledger for CUR-D-01 through CUR-D-07 and CUR-D-26 through CUR-D-37.

## Guardrails

- `promotion_effect: none` applies to every evidence-ranked queue row and every pending candidate block in this workbook.
- Review queue rank, corpus frequency, conflict severity, placement ambiguity, or overloaded-subfamily impact can prioritize investigation only; no single factor can promote an entry.
- All entries remain `manual_approval: pending` until a human curator edits the workbook with entry-specific approval, rationale, and evidence.
- Chat approval alone is insufficient. Future seed, alias, relation, or accord edits require persisted workbook approval first.
- Deferred groups are not Phase 8 promotion targets.

## Official Review Buckets And Dispositions

Official buckets from CUR-D-27:

- `new descriptor candidate`
- `alias candidate`
- `subfamily gap`
- `family gap`
- `relation/accord gap`
- `reject/defer`

Allowed `primary_disposition` values from CUR-D-35:

- `promote_to_seed`
- `add_alias`
- `create_gap`
- `relation_gap`
- `reject`
- `defer`

## Deterministic Evidence Ranking Procedure

The evidence-ranked queue is sorted deterministically across all CUR-D-31 factors:

1. `frequency_signal`: descending numeric `candidate_frequency` or `frequency` from Phase 7 evidence.
2. `review_type`: deterministic lexical review item type after frequency.
3. `conflict_severity`: `high` before `medium` before `low` when other factors tie.
4. `placement_ambiguity`: descending `1 - placement_score`; missing score is treated as maximum ambiguity for review priority only.
5. `overloaded_subfamily_impact`: descending count of candidate descriptors already routed to the affected compiled subfamily.
6. Stable tie-breakers: affected descriptor, affected subfamily, then original review queue order.

Ranking is priority-only. A high rank cannot change `manual_approval`, cannot set `primary_disposition`, and cannot mutate curated JSON.

## Evidence-Ranked Queue — Priority Only

Every row below is copied from `data/compiled/v1/similarity_matrix.json` review evidence and/or `data/compiled/v1/taxonomy.json` compiled candidate counts. These rows are investigation priorities, not approvals.

| priority_rank | canonical_id | bucket | primary_disposition | manual_approval | frequency_signal | review_type | conflict_severity | placement_ambiguity | overloaded_subfamily_impact | priority_rationale | evidence | source_review_queue_refs | source_corpus_signal | relation_accord_followup | promotion_effect |
|---:|---|---|---|---|---:|---|---|---:|---:|---|---|---|---|---|---|
| 1 | `minty` | `new descriptor candidate` | `defer` | pending | 321 | corpus_candidate_low_support | medium | 0.325234 | 76 | Highest frequency review item; broad placement pressure on `floral_rose` requires curation. | support=16; normalized_support=0.04984423676012461; placement_score=0.6747663551401869; reason=normalized_support_below_threshold | review_queue[247] | candidate_frequency=321; source=corpus | Review whether mint/cooling belongs to later green/fresh scope before relation/accord work. | none |
| 2 | `nutty` | `subfamily gap` | `create_gap` | pending | 271 | corpus_candidate_low_support | medium | 0.541255 | 76 | In-scope `gourmand` candidate with high frequency and overloaded `floral_rose` placement. | support=7; normalized_support=0.025830258302583026; placement_score=0.4587453874538745; reason=normalized_support_below_threshold | review_queue[263] | candidate_frequency=271; source=corpus | If approved later, evaluate `gourmand` relation/accord coverage. | none |
| 3 | `creamy` | `new descriptor candidate` | `defer` | pending | 244 | corpus_candidate_low_support | medium | 0.536967 | 28 | Dairy/lactonic signal may support gourmand review but needs manual semantic boundary. | support=7; normalized_support=0.028688524590163935; placement_score=0.4630327868852459; reason=normalized_support_below_threshold | review_queue[125] | candidate_frequency=244; source=corpus | Possible gourmand/lactonic follow-up; no relation score without approval. | none |
| 4 | `sulfurous` | `reject/defer` | `defer` | pending | 226 | corpus_candidate_low_support | medium | 0.466903 | 33 | High-frequency candidate but outside the initial six promotion groups. | support=8; normalized_support=0.035398230088495575; placement_score=0.5330973451327433; reason=normalized_support_below_threshold | review_queue[364] | candidate_frequency=226; source=corpus | No Phase 8 relation/accord follow-up unless scope changes. | none |
| 5 | `musty` | `reject/defer` | `defer` | pending | 203 | corpus_candidate_low_support | medium | 0.663054 | 76 | High ambiguity and deferred earthy/mineral/smoky adjacency; not an initial promotion target. | support=5; normalized_support=0.024630541871921183; placement_score=0.3369458128078818; reason=normalized_support_below_threshold | review_queue[252] | candidate_frequency=203; source=corpus | Defer to later earthy/moldy review. | none |
| 6 | `roasted` | `new descriptor candidate` | `defer` | pending | 170 | corpus_candidate_low_support | medium | 0.931176 | 33 | Strong ambiguity; may inform gourmand but is not approved. | support=1; normalized_support=0.0058823529411764705; placement_score=0.0688235294117647; reason=support_below_threshold | review_queue[319] | candidate_frequency=170; source=corpus | If later approved, review gourmand/woody accords manually. | none |
| 7 | `caramellic` | `new descriptor candidate` | `promote_to_seed` | pending | 165 | corpus_candidate_low_support | medium | 0.861818 | 76 | In-scope `gourmand` candidate; high ambiguity shows why human approval is required. | support=2; normalized_support=0.012121212121212121; placement_score=0.13818181818181818; reason=support_below_threshold | review_queue[76] | candidate_frequency=165; source=corpus | If approved later, evaluate `gourmand` → `amber_resinous` accord compatibility manually. | none |
| 8 | `pineapple` | `new descriptor candidate` | `promote_to_seed` | pending | 164 | corpus_candidate_low_support | medium | 0.723415 | 76 | In-scope `fruity`/tropical signal currently overloaded into `floral_rose`. | support=4; normalized_support=0.024390243902439025; placement_score=0.2765853658536585; reason=normalized_support_below_threshold | review_queue[298] | candidate_frequency=164; source=corpus | If approved later, review `tropical_fruit` relations/accords manually. | none |
| 9 | `meaty` | `reject/defer` | `defer` | pending | 155 | corpus_candidate_low_support | medium | 0.860645 | 33 | Possible animalic adjacency but descriptor may be culinary/noise; human review required. | support=2; normalized_support=0.012903225806451613; placement_score=0.1393548387096774; reason=support_below_threshold | review_queue[241] | candidate_frequency=155; source=corpus | No relation/accord score without explicit approval. | none |
| 10 | `animal` | `subfamily gap` | `create_gap` | pending | 144 | corpus_candidate_low_support | medium | 0.577500 | 76 | In-scope `animalic` signal with overloaded placement. | support=6; normalized_support=0.041666666666666664; placement_score=0.4225; reason=normalized_support_below_threshold | review_queue[19] | candidate_frequency=144; source=corpus | If animalic is approved later, review relation/accord gaps manually. | none |
| 11 | `melon` | `new descriptor candidate` | `promote_to_seed` | pending | 144 | corpus_candidate_low_support | medium | 0.507083 | 28 | In-scope fruity/orchard-adjacent candidate; needs target subfamily decision. | support=7; normalized_support=0.04861111111111111; placement_score=0.49291666666666667; reason=normalized_support_below_threshold | review_queue[245] | candidate_frequency=144; source=corpus | If approved later, review fruity accord compatibility manually. | none |
| 12 | `resinous` | `subfamily gap` | `create_gap` | pending | 135 | corpus_candidate_low_support | medium | 0.644444 | 76 | In-scope `amber_resinous` signal; current broad placement needs manual correction. | support=5; normalized_support=0.037037037037037035; placement_score=0.3555555555555555; reason=normalized_support_below_threshold | review_queue[316] | candidate_frequency=135; source=corpus | If approved later, create manual relations/accords for `balsamic_resin`. | none |
| 13 | `ethereal` | `reject/defer` | `defer` | pending | 134 | corpus_candidate_low_support | medium | 0.786418 | 28 | High ambiguity and not part of the initial minimal groups. | support=3; normalized_support=0.022388059701492536; placement_score=0.21358208955223879; reason=normalized_support_below_threshold | review_queue[149] | candidate_frequency=134; source=corpus | Defer. | none |
| 14 | `vanilla` | `new descriptor candidate` | `promote_to_seed` | pending | 131 | corpus_candidate_low_support | medium | 0.857099 | 76 | Explicit `gourmand` initial candidate with concrete Phase 7 evidence. | support=2; normalized_support=0.015267175572519083; placement_score=0.1429007633587786; reason=support_below_threshold | review_queue[395] | candidate_frequency=131; source=corpus | If approved later, review gourmand accord and alias follow-up. | none |
| 15 | `cooling` | `reject/defer` | `defer` | pending | 129 | corpus_candidate_low_support | medium | 0.713488 | 76 | May relate to green/fresh but outside approved initial descriptor names. | support=4; normalized_support=0.031007751937984496; placement_score=0.2865116279069767; reason=normalized_support_below_threshold | review_queue[117] | candidate_frequency=129; source=corpus | Defer. | none |
| 16 | `banana` | `new descriptor candidate` | `promote_to_seed` | pending | 118 | corpus_candidate_low_support | medium | 0.636441 | 76 | In-scope `fruity` signal with overloaded placement. | support=5; normalized_support=0.0423728813559322; placement_score=0.3635593220338983; reason=normalized_support_below_threshold | review_queue[35] | candidate_frequency=118; source=corpus | If approved later, review `tropical_fruit` accord coverage. | none |
| 17 | `warm` | `new descriptor candidate` | `defer` | pending | 118 | corpus_candidate_low_support | medium | 0.636441 | 76 | Could inform `warm_spice`, but evidence is generic and not sufficient for promotion. | support=5; normalized_support=0.0423728813559322; placement_score=0.3635593220338983; reason=normalized_support_below_threshold | review_queue[399] | candidate_frequency=118; source=corpus | Defer until spice subfamily decision. | none |
| 18 | `coffee` | `new descriptor candidate` | `defer` | pending | 116 | corpus_candidate_low_support | medium | 1.000000 | 2 | Gourmand-adjacent evidence but not one of the initial listed descriptors. | support=0; normalized_support=0; placement_score=0; reason=support_below_threshold | review_queue[114] | candidate_frequency=116; source=corpus | Defer or use as supporting evidence for gourmand only. | none |
| 19 | `medicinal` | `reject/defer` | `defer` | pending | 115 | corpus_candidate_low_support | medium | 0.634783 | 76 | Deferred medicinal/camphoraceous scope. | support=5; normalized_support=0.043478260869565216; placement_score=0.3652173913043478; reason=normalized_support_below_threshold | review_queue[242] | candidate_frequency=115; source=corpus | Defer to later medicinal_camphoraceous review. | none |
| 20 | `hay` | `reject/defer` | `defer` | pending | 112 | corpus_candidate_low_support | medium | 0.633036 | 76 | Not in the initial six groups; may be future green/dry review evidence. | support=5; normalized_support=0.044642857142857144; placement_score=0.3669642857142857; reason=normalized_support_below_threshold | review_queue[194] | candidate_frequency=112; source=corpus | Defer. | none |

## In-Scope Candidate Groups

### gourmand

Initial discussion descriptors: `vanilla`, `caramel`, `chocolate`, `nutty`.

Candidate block:

- `canonical_id`: `vanilla`
- `bucket`: `new descriptor candidate`
- `primary_disposition`: `promote_to_seed`
- `secondary_hypotheses`: [`add_alias`, `relation_gap`]
- `target_family`: `gourmand`
- `target_subfamily`: `vanilla`
- `manual_approval`: approved
- `rationale`: Approved as the first minimal Phase 8 seed expansion entry because vanilla is a stable, widely recognized gourmand olfactive concept and directly matches the approved initial `gourmand` scope.
- `evidence`: Phase 7 review evidence supports review priority: review_queue[395] has candidate_frequency=131, support=2, normalized_support=0.015267175572519083, placement_score=0.1429007633587786, reason=support_below_threshold. This corpus evidence is support only; approval is manual.
- `source_review_queue_refs`: [`review_queue[395]`]
- `source_corpus_signal`: candidate_frequency=131; source=corpus; compiled candidate currently routed to `floral_rose`.
- `aliases_to_review`: []
- `relation_accord_followup`: If approved, evaluate manual `gourmand` relation/accord coverage; absence remains a relation_gap, not score 0.
- `curation_status`: approved_for_seed_v2
- `promotion_effect`: none

Additional concrete evidence: `nutty` review_queue[263] frequency=271; `caramellic` review_queue[76] frequency=165; `coffee` review_queue[114] frequency=116; `almond` review_queue[15] frequency=59; all remain pending.

### spicy

Initial discussion descriptors: `warm_spice`, `fresh_spice`.

Candidate block:

- `canonical_id`: `cinnamon`
- `bucket`: `new descriptor candidate`
- `primary_disposition`: `promote_to_seed`
- `secondary_hypotheses`: [`create_gap`, `relation_gap`]
- `target_family`: `spicy`
- `target_subfamily`: `warm_spice`
- `manual_approval`: pending
- `rationale`: Human curator must determine whether cinnamon represents warm spice in the first seed expansion.
- `evidence`: review_queue[105] has candidate_frequency=96, support=4, normalized_support=0.041666666666666664, placement_score=0.3025, reason=normalized_support_below_threshold.
- `source_review_queue_refs`: [`review_queue[105]`]
- `source_corpus_signal`: candidate_frequency=96; source=corpus; currently routed to `floral_rose`.
- `aliases_to_review`: []
- `relation_accord_followup`: If approved, add manual relation/accord consideration for `warm_spice`; do not infer scores from corpus.
- `curation_status`: awaiting_human_review
- `promotion_effect`: none

Additional concrete evidence: `clove` review_queue[112] frequency=75; `anise` review_queue[20] frequency=67; `anisic` review_queue[21] frequency=59; `allspice` review_queue[11] frequency=16; all remain pending.

### green

Initial discussion descriptors: `leafy_green`, `herbal_green`.

Candidate block:

- `canonical_id`: `basil`
- `bucket`: `new descriptor candidate`
- `primary_disposition`: `defer`
- `secondary_hypotheses`: [`create_gap`, `add_alias`]
- `target_family`: `green`
- `target_subfamily`: `herbal_green`
- `manual_approval`: pending
- `rationale`: Phase 7 found green-adjacent evidence, but the exact canonical green descriptor set requires human curation.
- `evidence`: review_queue[39] has candidate_frequency=36, support=2, normalized_support=0.05555555555555555, placement_score=0.2033333333333333, reason=support_below_threshold.
- `source_review_queue_refs`: [`review_queue[39]`]
- `source_corpus_signal`: candidate_frequency=36; source=corpus; compiled candidate currently routed to `floral_white`.
- `aliases_to_review`: []
- `relation_accord_followup`: If approved later, evaluate `green` relation/accord gaps manually.
- `curation_status`: awaiting_human_review
- `promotion_effect`: none

Additional concrete evidence: `onion_green_onion` review_queue[269] frequency=20; `wintergreen` review_queue[419] frequency=16; `tea_green_tea` review_queue[375] frequency=11; `tomato_leaf` review_queue[384] frequency=9; all remain pending.

### fruity

Initial discussion descriptors: `red_fruit`, `tropical_fruit`, `orchard_fruit`.

Candidate block:

- `canonical_id`: `pineapple`
- `bucket`: `new descriptor candidate`
- `primary_disposition`: `promote_to_seed`
- `secondary_hypotheses`: [`create_gap`, `relation_gap`]
- `target_family`: `fruity`
- `target_subfamily`: `tropical_fruit`
- `manual_approval`: pending
- `rationale`: Human curator must determine tropical fruit coverage; review evidence is support only.
- `evidence`: review_queue[298] has candidate_frequency=164, support=4, normalized_support=0.024390243902439025, placement_score=0.2765853658536585, reason=normalized_support_below_threshold.
- `source_review_queue_refs`: [`review_queue[298]`]
- `source_corpus_signal`: candidate_frequency=164; source=corpus; currently routed to `floral_rose`.
- `aliases_to_review`: []
- `relation_accord_followup`: If approved, manually evaluate `tropical_fruit` relation/accord coverage.
- `curation_status`: awaiting_human_review
- `promotion_effect`: none

Additional concrete evidence: `banana` review_queue[35] frequency=118; `strawberry` review_queue[359] frequency=51; `blackberry` review_queue[44] frequency=17; `banana_unripe_banana` review_queue[34] frequency=11; all remain pending.

### amber_resinous

Initial discussion descriptors: `amber`, `balsamic_resin`.

Candidate block:

- `canonical_id`: `resinous`
- `bucket`: `subfamily gap`
- `primary_disposition`: `create_gap`
- `secondary_hypotheses`: [`promote_to_seed`, `relation_gap`]
- `target_family`: `amber_resinous`
- `target_subfamily`: `balsamic_resin`
- `manual_approval`: pending
- `rationale`: Human curator must decide whether resinous/balsamic deserves a curated subfamily in the first expansion.
- `evidence`: review_queue[316] has candidate_frequency=135, support=5, normalized_support=0.037037037037037035, placement_score=0.3555555555555555, reason=normalized_support_below_threshold.
- `source_review_queue_refs`: [`review_queue[316]`]
- `source_corpus_signal`: candidate_frequency=135; source=corpus; currently routed to `floral_rose`.
- `aliases_to_review`: []
- `relation_accord_followup`: If approved, manually consider amber/resinous relations; no corpus-derived score allowed.
- `curation_status`: awaiting_human_review
- `promotion_effect`: none

Additional concrete evidence: `labdanum` review_queue[229] frequency=24; `benzoin` review_queue[42] frequency=13. Compiled taxonomy also has `amber` candidate frequency=183 in `woody_dry`; this supports investigation but is not a review_queue promotion.

### animalic

Initial discussion descriptors: `musky`, `leathery`.

Candidate block:

- `canonical_id`: `animal`
- `bucket`: `subfamily gap`
- `primary_disposition`: `create_gap`
- `secondary_hypotheses`: [`promote_to_seed`, `relation_gap`]
- `target_family`: `animalic`
- `target_subfamily`: `musky`
- `manual_approval`: pending
- `rationale`: Human curator must determine whether animalic is included in the minimal first expansion and how it maps to musky/leathery.
- `evidence`: review_queue[19] has candidate_frequency=144, support=6, normalized_support=0.041666666666666664, placement_score=0.4225, reason=normalized_support_below_threshold.
- `source_review_queue_refs`: [`review_queue[19]`]
- `source_corpus_signal`: candidate_frequency=144; source=corpus; currently routed to `floral_rose`.
- `aliases_to_review`: [`musk` -> possible `musky`, requires manual approval]
- `relation_accord_followup`: If approved, manually decide relations/accords for musky/leathery; missing entries remain neutral.
- `curation_status`: awaiting_human_review
- `promotion_effect`: none

Additional concrete evidence: `ambrette` review_queue[16] frequency=23; `civet` review_queue[107] frequency=10. Compiled taxonomy also has `musk` candidate frequency=132 and `leathery` candidate frequency=81 in `woody_dry`; these support investigation only.

## Deferred / Out-Of-Scope Groups

The following groups are not Phase 8 promotion targets. They may appear as evidence rows only and must remain deferred unless a later plan changes scope.

| group_id | status | rationale | promotion_effect |
|---|---|---|---|
| `marine_ozonic` | deferred | CUR-D-06 defers marine/ozonic scope; `ozone` is a compiled corpus candidate but not an initial promotion target. | none |
| `tobacco` | deferred | CUR-D-06 defers tobacco despite compiled corpus candidate frequency=116. | none |
| `powdery` | deferred | CUR-D-06 defers powdery despite compiled corpus candidate frequency=282. | none |
| `aldehydic` | deferred | CUR-D-06 defers aldehydic despite compiled corpus candidate frequency=225. | none |
| `medicinal_camphoraceous` | deferred | CUR-D-06 defers medicinal/camphoraceous; review_queue[242] `medicinal` frequency=115 remains evidence only. | none |
| `earthy_mineral` | deferred | CUR-D-06 defers earthy/mineral despite compiled `earthy` candidate frequency=367. | none |
| `smoky` | deferred | CUR-D-06 defers smoky/smoke/burnt review; review_queue[66] `burnt` frequency=107 remains evidence only. | none |

## No-Evidence Rows

All six in-scope groups have at least one concrete Phase 7 evidence row above. Therefore no `no_phase7_evidence_found` row is required for the initial in-scope set.

| group_id | evidence_status | rationale | promotion_effect |
|---|---|---|---|
| `gourmand` | phase7_evidence_found | See `vanilla`, `nutty`, `caramellic`, `coffee`, and related rows. | none |
| `spicy` | phase7_evidence_found | See `cinnamon`, `clove`, `anise`, `anisic`, and `allspice` rows. | none |
| `green` | phase7_evidence_found | See `basil`, `wintergreen`, `tea_green_tea`, and `tomato_leaf` rows. | none |
| `fruity` | phase7_evidence_found | See `pineapple`, `banana`, `strawberry`, and related rows. | none |
| `amber_resinous` | phase7_evidence_found | See `resinous`, `labdanum`, `benzoin`, and compiled `amber` candidate evidence. | none |
| `animalic` | phase7_evidence_found | See `animal`, `ambrette`, `civet`, and compiled `musk`/`leathery` candidate evidence. | none |

## Approval Ledger

Approved seed expansion entries:

### approval-001

- `family_id`: `gourmand`
- `subfamily_id`: `vanilla`
- `descriptor_id`: `vanilla`
- `manual_approval`: approved
- `primary_disposition`: `promote_to_seed`
- `rationale`: Approved as the first minimal Phase 8 seed expansion entry because vanilla is a stable, widely recognized gourmand olfactive concept and directly matches the approved initial `gourmand` scope.
- `evidence`: Phase 7 review evidence supports review priority via review_queue[395] with candidate_frequency=131. Corpus evidence is support only; approval is manual.
- `source_review_queue_refs`: [`review_queue[395]`]
- `curation_status`: approved_for_seed_v2

## Relation/Accord Ledger For Seed v2

### retained-v1-manual-bootstrap

- `scope`: existing v1 subfamilies also present in `taxonomy-seed.v2.json`
- `manual_approval`: approved_in_phase_7
- `primary_disposition`: retain_manual_relation_accord_inputs_for_v2
- `rationale`: Existing Phase 7 curated relation and accord bootstrap records remain applicable because all referenced v1 subfamily IDs still exist in the minimal v2 seed. They are copied into the v2 companion files with version `2.0.0` and unchanged manual scores.
- `evidence`: manual_phase_7_bootstrap
- `reference`: manual_phase_7_bootstrap
- `score_policy`: Scores are manual Phase 7 bootstrap values in [0,1], not derived from corpus, co-occurrence, review_queue frequency, or candidate frequency.
- `promotion_effect`: none

### relation-gap-approval-001-vanilla

- `subfamily_id`: `vanilla`
- `bucket`: `relation/accord gap`
- `primary_disposition`: `relation_gap`
- `manual_approval`: approved_gap
- `rationale`: The only new v2 subfamily is `vanilla`. No persisted workbook block approves a manual tradition relation score involving `vanilla`, and corpus/review evidence is support-only. Missing tradition relation therefore remains neutral/undefined and no score 0 placeholder is created.
- `evidence`: approval-001 approved seed expansion for `gourmand/vanilla/vanilla`; review_queue[395] supports priority only and does not define a relation score.
- `promotion_effect`: none

### accord-gap-approval-001-vanilla

- `subfamily_id`: `vanilla`
- `bucket`: `relation/accord gap`
- `primary_disposition`: `relation_gap`
- `manual_approval`: approved_gap
- `rationale`: The approved `vanilla` subfamily has no persisted manual accord approval or score. Potential gourmand accords remain future curatorial work; missing accord compatibility remains neutral/undefined and no score 0 placeholder is created.
- `evidence`: approval-001 approved seed expansion for `gourmand/vanilla/vanilla`; gourmand accord hypotheses in the workbook are follow-up notes only.
- `promotion_effect`: none

# Phase 09 / Round 2 Curation

Status: pending human curation. This Round 2 section records proposals only; no JSON data, compiled artifacts, aliases, relations, or accords may be changed until the relevant workbook entries are manually approved with rationale and evidence.

## Round 2 Guardrails

- `round: phase_09_round_2` identifies every Round 2 proposal below.
- `manual_approval: pending` means the entry is not approved and must not be promoted.
- `promotion_effect: none` applies to every pending proposal in this section.
- Corpus/review_queue evidence is support only and never substitutes for manual approval.
- The priority groups for this round are `green`, `fruity`, and `spicy`; generic/ambiguous terms remain deferred.

## Priority Groups And Subfamilies

| group_id | candidate_subfamilies | status | rationale |
|---|---|---|---|
| `green` | `herbal_green`, `leafy_green` | pending curation | Selected by R2-D-01/R2-D-18 as a priority group with concrete herbal and leafy targets. |
| `fruity` | `tropical_fruit`, `orchard_fruit`, `red_fruit` | pending curation | Selected by R2-D-01/R2-D-19 to relieve overloaded fruity candidates without using generic `fruity` as a bucket. |
| `spicy` | `warm_spice`, `fresh_spice` | pending curation | Selected by R2-D-01/R2-D-20 with concrete warm/fresh spice subfamily review. |

## Round 2 Candidate Approval Ledger — Pending

### r2-approval-001

- `approval_id`: r2-approval-001
- `round`: phase_09_round_2
- `family_id`: `fruity`
- `subfamily_id`: `tropical_fruit`
- `descriptor_id`: `pineapple`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: Evidence-ranked queue priority 8; review_queue[298] candidate_frequency=164, support=4, normalized_support=0.024390243902439025, placement_score=0.2765853658536585, reason=normalized_support_below_threshold. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[298]`]
- `source_corpus_signal`: candidate_frequency=164; source=corpus; compiled candidate currently routed to `floral_rose`.
- `validation_expectation`: If approved later, create/verify `fruity/tropical_fruit/pineapple` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-002

- `approval_id`: r2-approval-002
- `round`: phase_09_round_2
- `family_id`: `fruity`
- `subfamily_id`: `tropical_fruit`
- `descriptor_id`: `banana`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: review_queue[35] candidate_frequency=118 is listed as fruity supporting evidence; Phase 09 context ranks `banana` second for fruity/tropical review. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[35]`]
- `source_corpus_signal`: candidate_frequency=118; source=corpus; compiled candidate currently routed to `floral_rose`.
- `validation_expectation`: If approved later, create/verify `fruity/tropical_fruit/banana` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-003

- `approval_id`: r2-approval-003
- `round`: phase_09_round_2
- `family_id`: `fruity`
- `subfamily_id`: `red_fruit`
- `descriptor_id`: `strawberry`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: review_queue[359] candidate_frequency=51 is listed as fruity supporting evidence; Phase 09 context ranks `strawberry` for red_fruit review. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[359]`]
- `source_corpus_signal`: candidate_frequency=51; source=corpus.
- `validation_expectation`: If approved later, create/verify `fruity/red_fruit/strawberry` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-004

- `approval_id`: r2-approval-004
- `round`: phase_09_round_2
- `family_id`: `fruity`
- `subfamily_id`: `red_fruit`
- `descriptor_id`: `blackberry`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: review_queue[44] candidate_frequency=17 is listed as fruity supporting evidence; Phase 09 context ranks `blackberry` for red_fruit review. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[44]`]
- `source_corpus_signal`: candidate_frequency=17; source=corpus.
- `validation_expectation`: If approved later, create/verify `fruity/red_fruit/blackberry` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-005

- `approval_id`: r2-approval-005
- `round`: phase_09_round_2
- `family_id`: `spicy`
- `subfamily_id`: `warm_spice`
- `descriptor_id`: `cinnamon`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: Existing spicy candidate block cites review_queue[105] candidate_frequency=96, support=4, normalized_support=0.041666666666666664, placement_score=0.3025, reason=normalized_support_below_threshold. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[105]`]
- `source_corpus_signal`: candidate_frequency=96; source=corpus; compiled candidate currently routed to `floral_rose`.
- `validation_expectation`: If approved later, create/verify `spicy/warm_spice/cinnamon` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-006

- `approval_id`: r2-approval-006
- `round`: phase_09_round_2
- `family_id`: `spicy`
- `subfamily_id`: `warm_spice`
- `descriptor_id`: `clove`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: review_queue[112] candidate_frequency=75 is listed as spicy supporting evidence; Phase 09 context ranks `clove` second for warm_spice review. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[112]`]
- `source_corpus_signal`: candidate_frequency=75; source=corpus.
- `validation_expectation`: If approved later, create/verify `spicy/warm_spice/clove` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-007

- `approval_id`: r2-approval-007
- `round`: phase_09_round_2
- `family_id`: `spicy`
- `subfamily_id`: `warm_spice`
- `descriptor_id`: `allspice`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: review_queue[11] candidate_frequency=16 is listed as spicy supporting evidence; Phase 09 context ranks `allspice` for warm_spice review. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[11]`]
- `source_corpus_signal`: candidate_frequency=16; source=corpus.
- `validation_expectation`: If approved later, create/verify `spicy/warm_spice/allspice` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-008

- `approval_id`: r2-approval-008
- `round`: phase_09_round_2
- `family_id`: `green`
- `subfamily_id`: `herbal_green`
- `descriptor_id`: `basil`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: Existing green candidate block cites review_queue[39] candidate_frequency=36, support=2, normalized_support=0.05555555555555555, placement_score=0.2033333333333333, reason=support_below_threshold. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[39]`]
- `source_corpus_signal`: candidate_frequency=36; source=corpus; compiled candidate currently routed to `floral_white`.
- `validation_expectation`: If approved later, create/verify `green/herbal_green/basil` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-009

- `approval_id`: r2-approval-009
- `round`: phase_09_round_2
- `family_id`: `green`
- `subfamily_id`: `leafy_green`
- `descriptor_id`: `tomato_leaf`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: review_queue[384] candidate_frequency=9 is listed as green supporting evidence; Phase 09 context ranks `tomato_leaf` second for green/leafy review. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[384]`]
- `source_corpus_signal`: candidate_frequency=9; source=corpus.
- `validation_expectation`: If approved later, create/verify `green/leafy_green/tomato_leaf` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

### r2-approval-010

- `approval_id`: r2-approval-010
- `round`: phase_09_round_2
- `family_id`: `fruity`
- `subfamily_id`: `orchard_fruit`
- `descriptor_id`: `melon`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually for Phase 09 Round 2 because this is a concrete, stable olfactive descriptor with clear fit in the target family/subfamily. Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: Evidence-ranked queue priority 11; review_queue[245] candidate_frequency=144, support=7, normalized_support=0.04861111111111111, placement_score=0.49291666666666667, reason=normalized_support_below_threshold. Corpus evidence is support only.
- `source_review_queue_refs`: [`review_queue[245]`]
- `source_corpus_signal`: candidate_frequency=144; source=corpus; compiled candidate currently routed to `floral_rose`.
- `validation_expectation`: If approved later, create/verify `fruity/orchard_fruit/melon` traceability before editing curated JSON.
- `promotion_effect`: approved_for_seed_v2_round_2

## Round 2 Deferred Candidate Ledger — Pending

### r2-defer-001

- `round`: phase_09_round_2
- `descriptor_id`: `warm`
- `manual_approval`: pending
- `primary_disposition`: defer
- `rationale`: Generic warmth may support warm_spice review but is not a concrete seed descriptor for this round.
- `evidence`: Evidence-ranked queue priority 17; review_queue[399] candidate_frequency=118, support=5, normalized_support=0.0423728813559322, placement_score=0.3635593220338983.
- `promotion_effect`: none

### r2-defer-002

- `round`: phase_09_round_2
- `descriptor_id`: `green`
- `manual_approval`: pending
- `primary_disposition`: defer
- `rationale`: Generic `green` is a group label, not a concrete descriptor; Phase 09 uses `herbal_green` and `leafy_green` as review targets instead.
- `evidence`: R2-D-21 prohibits generic subfamilies such as `green` as buckets; corpus pressure is support only.
- `promotion_effect`: none

### r2-defer-003

- `round`: phase_09_round_2
- `descriptor_id`: `fruity`
- `manual_approval`: pending
- `primary_disposition`: defer
- `rationale`: Generic `fruity` is a group label, not a concrete seed descriptor; Phase 09 reviews tropical, orchard, and red fruit targets instead.
- `evidence`: R2-D-21 prohibits generic subfamilies such as `fruity` as buckets; corpus pressure is support only.
- `promotion_effect`: none

### r2-defer-004

- `round`: phase_09_round_2
- `descriptor_id`: `spicy`
- `manual_approval`: pending
- `primary_disposition`: defer
- `rationale`: Generic `spicy` is a group label, not a concrete seed descriptor; Phase 09 reviews warm_spice and fresh_spice instead.
- `evidence`: R2-D-21 prohibits generic subfamilies such as `spicy` as buckets; corpus pressure is support only.
- `promotion_effect`: none

### r2-defer-005

- `round`: phase_09_round_2
- `descriptor_id`: `minty`
- `manual_approval`: pending
- `primary_disposition`: defer
- `rationale`: Minty remains ambiguous between green/fresh/cooling semantics and requires a future specific review before promotion.
- `evidence`: Evidence-ranked queue priority 1; review_queue[247] candidate_frequency=321, support=16, normalized_support=0.04984423676012461, placement_score=0.6747663551401869. R2-D-22 requires review before any promotion.
- `promotion_effect`: none

## Round 2 Alias Cleanup Ledger — Deferred

### r2-alias-cleanup-01

- `round`: phase_09_round_2
- `alias_source`: `ylang ylang`
- `alias_target`: `ylang_ylang`
- `manual_approval`: pending
- `primary_disposition`: defer
- `rationale`: Legacy alias target is absent from the minimal v2 seed and remains a soft finding; do not remove the alias or add `ylang_ylang` without future curatorial approval.
- `evidence`: R2-D-09 through R2-D-11 and R2-D-40 through R2-D-41 require deferred alias cleanup handling for this target mismatch.
- `promotion_effect`: none

## Round 2 Relation Proposals — Pending

### r2-relation-001

- `approval_id`: r2-relation-001
- `round`: phase_09_round_2
- `source_subfamily_id`: `herbal_green`
- `target_subfamily_id`: `leafy_green`
- `relation_type`: `same_family_tradition`
- `proposed_score`: 0.85
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed same-family green relation if both subfamilies are approved later; no endpoint should be written before seed approval exists. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended relation from R2-D-47 through R2-D-55 relation review list; scores are manual proposals only.
- `promotion_effect`: none

### r2-relation-002

- `approval_id`: r2-relation-002
- `round`: phase_09_round_2
- `source_subfamily_id`: `tropical_fruit`
- `target_subfamily_id`: `orchard_fruit`
- `relation_type`: `same_family_tradition`
- `proposed_score`: 0.80
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fruity same-family relation if both subfamilies are approved later; pending status prevents data mutation. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended relation from R2-D-47 through R2-D-55 relation review list; scores are manual proposals only.
- `promotion_effect`: none

### r2-relation-003

- `approval_id`: r2-relation-003
- `round`: phase_09_round_2
- `source_subfamily_id`: `orchard_fruit`
- `target_subfamily_id`: `red_fruit`
- `relation_type`: `same_family_tradition`
- `proposed_score`: 0.80
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fruity same-family relation for orchard/red fruit adjacency, pending creation and manual approval of both endpoints. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended relation from R2-D-47 through R2-D-55 relation review list; scores are manual proposals only.
- `promotion_effect`: none

### r2-relation-004

- `approval_id`: r2-relation-004
- `round`: phase_09_round_2
- `source_subfamily_id`: `tropical_fruit`
- `target_subfamily_id`: `red_fruit`
- `relation_type`: `same_family_tradition`
- `proposed_score`: 0.75
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fruity same-family bridge between tropical and red fruit, pending endpoint approval and manual sign-off. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended relation from R2-D-47 through R2-D-55 relation review list; scores are manual proposals only.
- `promotion_effect`: none

### r2-relation-005

- `approval_id`: r2-relation-005
- `round`: phase_09_round_2
- `source_subfamily_id`: `warm_spice`
- `target_subfamily_id`: `fresh_spice`
- `relation_type`: `same_family_tradition`
- `proposed_score`: 0.80
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed spicy same-family relation if both warm and fresh spice subfamilies are approved later.
- `evidence`: Recommended relation from R2-D-47 through R2-D-55 relation review list; scores are manual proposals only.
- `promotion_effect`: none

### r2-relation-006

- `approval_id`: r2-relation-006
- `round`: phase_09_round_2
- `source_subfamily_id`: `vanilla`
- `target_subfamily_id`: `warm_spice`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.65
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed resolution for the vanilla relation gap only if `warm_spice` is manually approved; missing coverage remains neutral until then. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: R2-D-05 through R2-D-08 and R2-D-53 recommend reviewing a `vanilla` ↔ `warm_spice` bridge; score is a manual proposal only.
- `promotion_effect`: none

## Round 2 Accord Proposals — Pending

### r2-accord-001

- `approval_id`: r2-accord-001
- `round`: phase_09_round_2
- `source_subfamily_id`: `herbal_green`
- `target_subfamily_id`: `citrus_fresh`
- `proposed_score`: 0.70
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed accord review for herbal green and existing citrus_fresh, pending manual approval and endpoint availability. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended accord from R2-D-47 through R2-D-55 accord review list; score is a manual proposal only.
- `promotion_effect`: none

### r2-accord-002

- `approval_id`: r2-accord-002
- `round`: phase_09_round_2
- `source_subfamily_id`: `tropical_fruit`
- `target_subfamily_id`: `citrus_fresh`
- `proposed_score`: 0.70
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fresh fruit/citrus accord if tropical_fruit is approved; pending status prevents automatic score creation. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended accord from R2-D-47 through R2-D-55 accord review list; score is a manual proposal only.
- `promotion_effect`: none

### r2-accord-003

- `approval_id`: r2-accord-003
- `round`: phase_09_round_2
- `source_subfamily_id`: `red_fruit`
- `target_subfamily_id`: `floral_rose`
- `proposed_score`: 0.70
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed red fruit/floral rose accord review if red_fruit is approved; pending status prevents automatic score creation. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended accord from R2-D-47 through R2-D-55 accord review list; score is a manual proposal only.
- `promotion_effect`: none

### r2-accord-004

- `approval_id`: r2-accord-004
- `round`: phase_09_round_2
- `source_subfamily_id`: `warm_spice`
- `target_subfamily_id`: `vanilla`
- `proposed_score`: 0.75
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed warm spice/vanilla accord to review the Phase 8 vanilla gap if warm_spice is approved; missing accord coverage remains neutral until approval. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended accord from R2-D-47 through R2-D-55 accord review list; score is a manual proposal only.
- `promotion_effect`: none

### r2-accord-005

- `approval_id`: r2-accord-005
- `round`: phase_09_round_2
- `source_subfamily_id`: `fresh_spice`
- `target_subfamily_id`: `citrus_fresh`
- `proposed_score`: 0.65
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fresh spice/citrus accord only if fresh_spice is approved later; pending status prevents automatic score creation.
- `evidence`: Recommended accord from R2-D-47 through R2-D-55 accord review list; score is a manual proposal only.
- `promotion_effect`: none

### r2-accord-006

- `approval_id`: r2-accord-006
- `round`: phase_09_round_2
- `source_subfamily_id`: `warm_spice`
- `target_subfamily_id`: `woody_dry`
- `proposed_score`: 0.65
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed warm spice/woody dry accord only if warm_spice is approved later; pending status prevents automatic score creation. Approved manually for Phase 09 Round 2. Score is a manual curatorial score in [0,1]; corpus/co-occurrence evidence is support only and does not define the score.
- `evidence`: Recommended accord from R2-D-47 through R2-D-55 accord review list; score is a manual proposal only.
- `promotion_effect`: none

# Phase 10 / Round 3 Curation

Status: pending human curation. This Round 3 section records proposals only; no JSON data, compiled artifacts, aliases, relations, or accords may be changed until the relevant workbook entries are manually approved with rationale and evidence.

## Round 3 Guardrails

- `round: phase_10_round_3` identifies every Round 3 proposal below.
- `manual_approval: pending` means the entry is not approved and must not be promoted.
- `promotion_effect: none` applies to every pending proposal in this section.
- Chat approval is insufficient; approval must be persisted in this workbook before later seed, alias, relation, or accord edits.
- Corpus, review_queue, frequency, generic-pressure, and co-occurrence evidence are support only and never substitute for manual approval.
- `taxonomy-seed.v2.json` remains candidate-only; no Phase 10 entry promotes v2 to default.
- Protected v1/default files must not be touched: `taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json`, `data/compiled/v1/**`, and `DEFAULT_PATHS`.
- Relation and accord proposals below are endpoint-aware warnings: later plans may write them only if both endpoints exist in candidate v2 after approved seed edits.

## Round 3 Priority Groups And Subfamilies

| group_id | candidate_subfamilies | status | rationale |
|---|---|---|---|
| `amber_resinous` | `amber`, `balsamic_resin` | pending curation | R3-D-06 through R3-D-12 select amber/resinous as a real scope while requiring genericity caution for `resinous` and `balsamic`. |
| `animalic` | `musky`, `leathery` | pending curation | R3-D-13 through R3-D-20 select animalic as a real scope while requiring canonical/alias review for `musk` vs `musky` and explicit caution for `animal`/`civet`. |
| `fresh_spice` | `fresh_spice` | conditional pending curation | R3-D-21 through R3-D-27 allow `fresh_spice` only if a concrete descriptor such as `anise` is approved; it must not be created empty. |

## Round 3 Candidate Approval Ledger — Pending

### r3-approval-001

- `approval_id`: r3-approval-001
- `round`: phase_10_round_3
- `family_id`: `amber_resinous`
- `subfamily_id`: `amber`
- `descriptor_id`: `amber`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Review `amber` as the concrete descriptor anchoring an `amber` subfamily while avoiding unexamined family/subfamily/descriptor duplication.
- `evidence`: R3-D-07 and R3-D-08 identify `amber` as the candidate descriptor for an `amber` subfamily; compiled candidate evidence supports investigation only.
- `validation_expectation`: If approved later, create/verify `amber_resinous/amber/amber` traceability before editing candidate v2 JSON.
- `promotion_effect`: approved_for_seed_v2_round_3

### r3-approval-002

- `approval_id`: r3-approval-002
- `round`: phase_10_round_3
- `family_id`: `amber_resinous`
- `subfamily_id`: `balsamic_resin`
- `descriptor_id`: `resinous`
- `manual_approval`: pending
- `primary_disposition`: promote_to_seed
- `rationale`: Review `resinous` for `balsamic_resin` with explicit genericity caution; do not promote if it remains only a broad family signal.
- `evidence`: Existing workbook evidence cites review_queue[316] with candidate_frequency=135 for `resinous`; R3-D-09 and R3-D-10 require manual caution because corpus pressure is support only.
- `validation_expectation`: If approved later, create/verify `amber_resinous/balsamic_resin/resinous` traceability and generic-risk rationale before editing candidate v2 JSON.
- `promotion_effect`: none

### r3-approval-003

- `approval_id`: r3-approval-003
- `round`: phase_10_round_3
- `family_id`: `amber_resinous`
- `subfamily_id`: `balsamic_resin`
- `descriptor_id`: `labdanum`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Review `labdanum` as a concrete resinous material descriptor for `balsamic_resin` rather than inferring promotion from adjacency alone.
- `evidence`: Phase 8 workbook lists `labdanum` as amber/resinous supporting evidence with review_queue[229] frequency=24; R3-D-09 includes it as a Round 3 candidate.
- `validation_expectation`: If approved later, create/verify `amber_resinous/balsamic_resin/labdanum` traceability before editing candidate v2 JSON.
- `promotion_effect`: approved_for_seed_v2_round_3

### r3-approval-004

- `approval_id`: r3-approval-004
- `round`: phase_10_round_3
- `family_id`: `amber_resinous`
- `subfamily_id`: `balsamic_resin`
- `descriptor_id`: `benzoin`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Review `benzoin` as a concrete balsamic resin descriptor with manual curation, not automatic corpus promotion.
- `evidence`: Phase 8 workbook lists `benzoin` as amber/resinous supporting evidence with review_queue[42] frequency=13; R3-D-09 includes it as a Round 3 candidate.
- `validation_expectation`: If approved later, create/verify `amber_resinous/balsamic_resin/benzoin` traceability before editing candidate v2 JSON.
- `promotion_effect`: approved_for_seed_v2_round_3

### r3-approval-005

- `approval_id`: r3-approval-005
- `round`: phase_10_round_3
- `family_id`: `amber_resinous`
- `subfamily_id`: `balsamic_resin`
- `descriptor_id`: `balsamic`
- `manual_approval`: pending
- `primary_disposition`: promote_to_seed
- `rationale`: Review `balsamic` only if the curator resolves whether it is concrete enough for seed truth rather than a generic support label.
- `evidence`: R3-D-09 includes `balsamic`; R3-D-10 flags both `balsamic` and `resinous` for genericity caution. Corpus evidence is support only.
- `validation_expectation`: If approved later, create/verify `amber_resinous/balsamic_resin/balsamic` traceability and generic-risk rationale before editing candidate v2 JSON.
- `promotion_effect`: none

### r3-approval-006

- `approval_id`: r3-approval-006
- `round`: phase_10_round_3
- `family_id`: `animalic`
- `subfamily_id`: `musky`
- `descriptor_id`: `musk`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Review `musk` as a possible canonical descriptor while coordinating with `musky` to avoid duplicate primary descriptors without rationale.
- `evidence`: R3-D-15 and R3-D-19 require explicit review of `musk` vs `musky`; compiled candidate frequency=132 supports investigation only.
- `validation_expectation`: If approved later, create/verify `animalic/musky/musk` traceability and canonical/alias decision before editing candidate v2 JSON.
- `promotion_effect`: approved_for_seed_v2_round_3

### r3-approval-007

- `approval_id`: r3-approval-007
- `round`: phase_10_round_3
- `family_id`: `animalic`
- `subfamily_id`: `musky`
- `descriptor_id`: `musky`
- `manual_approval`: pending
- `primary_disposition`: promote_to_seed
- `rationale`: Review `musky` as the subfamily-adjacent descriptor only with a clear canonical decision against `musk` duplication.
- `evidence`: R3-D-15 and R3-D-19 require explicit `musk`/`musky` canonical review; existing workbook notes animalic/musky scope and support evidence.
- `validation_expectation`: If approved later, create/verify `animalic/musky/musky` traceability and canonical/alias decision before editing candidate v2 JSON.
- `promotion_effect`: none

### r3-approval-008

- `approval_id`: r3-approval-008
- `round`: phase_10_round_3
- `family_id`: `animalic`
- `subfamily_id`: `musky`
- `descriptor_id`: `ambrette`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Review `ambrette` as a concrete musky candidate that may anchor animalic coverage without relying on broad `animal` language.
- `evidence`: Existing workbook cites `ambrette` review_queue[16] frequency=23; R3-D-15 includes `ambrette` in musky review. Corpus evidence is support only.
- `validation_expectation`: If approved later, create/verify `animalic/musky/ambrette` traceability before editing candidate v2 JSON.
- `promotion_effect`: approved_for_seed_v2_round_3

### r3-approval-009

- `approval_id`: r3-approval-009
- `round`: phase_10_round_3
- `family_id`: `animalic`
- `subfamily_id`: `leathery`
- `descriptor_id`: `leathery`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Review `leathery` as the concrete descriptor for a `leathery` subfamily while keeping `leather` as alias investigation only unless separately approved.
- `evidence`: R3-D-16 includes `leathery`; existing workbook notes compiled `leathery` candidate frequency=81 as support only.
- `validation_expectation`: If approved later, create/verify `animalic/leathery/leathery` traceability before editing candidate v2 JSON.
- `promotion_effect`: approved_for_seed_v2_round_3

### r3-approval-010

- `approval_id`: r3-approval-010
- `round`: phase_10_round_3
- `family_id`: `fresh_spice`
- `subfamily_id`: `fresh_spice`
- `descriptor_id`: `anise`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Review `anise` as the only concrete Round 3 path to create `fresh_spice`; absent approval leaves `fresh_spice` absent/deferred.
- `evidence`: Phase 8 workbook lists `anise` review_queue[20] frequency=67; R3-D-21 through R3-D-27 identify it as the primary concrete fresh_spice candidate.
- `validation_expectation`: If approved later, create/verify `fresh_spice/fresh_spice/anise`; do not create empty `fresh_spice` without a concrete approved descriptor.
- `promotion_effect`: approved_for_seed_v2_round_3

## Round 3 Deferred And Support Ledger — Pending

### r3-defer-001

- `round`: phase_10_round_3
- `descriptor_id`: `gourmand_extra_review`
- `manual_approval`: approved
- `primary_disposition`: defer
- `rationale`: Approved as an explicit Round 3 defer decision. This item remains outside seed/alias/relation/accord mutation for this phase.
- `evidence`: Phase 10 context marks this item as support-only, ambiguous, generic, or outside current Round 3 scope. Corpus/review_queue evidence is support only and does not authorize promotion.
- `promotion_effect`: none

### r3-defer-002

- `round`: phase_10_round_3
- `descriptor_id`: `animal`
- `manual_approval`: approved
- `primary_disposition`: defer
- `rationale`: Approved as an explicit Round 3 defer decision. `animal` is a broad animalic support signal and will not be promoted as a seed descriptor in this phase.
- `evidence`: Existing workbook cites review_queue[19] candidate_frequency=144; R3-D-17 requires support-only treatment unless a later explicit approval changes it. Corpus/review_queue evidence is support only and does not authorize promotion.
- `promotion_effect`: none

### r3-defer-003

- `round`: phase_10_round_3
- `descriptor_id`: `civet`
- `manual_approval`: approved
- `primary_disposition`: defer
- `rationale`: Approved as an explicit Round 3 defer decision. This item remains outside seed/alias/relation/accord mutation for this phase.
- `evidence`: Phase 10 context marks this item as support-only, ambiguous, generic, or outside current Round 3 scope. Corpus/review_queue evidence is support only and does not authorize promotion.
- `promotion_effect`: none

### r3-defer-004

- `round`: phase_10_round_3
- `descriptor_id`: `anisic`
- `manual_approval`: approved
- `primary_disposition`: defer
- `rationale`: Approved as an explicit Round 3 defer decision. This item remains outside seed/alias/relation/accord mutation for this phase.
- `evidence`: Phase 10 context marks this item as support-only, ambiguous, generic, or outside current Round 3 scope. Corpus/review_queue evidence is support only and does not authorize promotion.
- `promotion_effect`: none

### r3-defer-005

- `round`: phase_10_round_3
- `descriptor_id`: `minty`
- `manual_approval`: approved
- `primary_disposition`: defer
- `rationale`: Approved as an explicit Round 3 defer decision. This item remains outside seed/alias/relation/accord mutation for this phase.
- `evidence`: Phase 10 context marks this item as support-only, ambiguous, generic, or outside current Round 3 scope. Corpus/review_queue evidence is support only and does not authorize promotion.
- `promotion_effect`: none

### r3-defer-006

- `round`: phase_10_round_3
- `descriptor_id`: `wintergreen`
- `manual_approval`: approved
- `primary_disposition`: defer
- `rationale`: Approved as an explicit Round 3 defer decision. This item remains outside seed/alias/relation/accord mutation for this phase.
- `evidence`: Phase 10 context marks this item as support-only, ambiguous, generic, or outside current Round 3 scope. Corpus/review_queue evidence is support only and does not authorize promotion.
- `promotion_effect`: none

### r3-defer-007

- `round`: phase_10_round_3
- `descriptor_id`: `resinous_balsamic_generic_caution`
- `manual_approval`: approved
- `primary_disposition`: defer
- `rationale`: Approved as an explicit Round 3 defer decision. `resinous` and `balsamic` remain genericity-risk support signals and will not be promoted as seed descriptors in this phase.
- `evidence`: R3-D-10 requires caution because `resinous` and `balsamic` may be generic; review_queue/frequency is support only and does not authorize promotion.
- `promotion_effect`: none

### r3-defer-008

- `round`: phase_10_round_3
- `descriptor_id`: `fresh_spice_absent_without_anise`
- `manual_approval`: pending
- `primary_disposition`: defer
- `rationale`: If `anise` is not approved, `fresh_spice` remains absent/deferred and must not be created empty.
- `evidence`: R3-D-03, R3-D-22, R3-D-26, and R3-D-27 require concrete approved descriptor coverage before fresh_spice exists.
- `promotion_effect`: none

### r3-defer-009

- `round`: phase_10_round_3
- `descriptor_id`: `ylang_cleanup_deferred`
- `manual_approval`: approved
- `primary_disposition`: defer
- `rationale`: Approved as an explicit Round 3 defer decision. `ylang ylang -> ylang_ylang` remains a legacy alias soft finding outside Round 3 scope.
- `evidence`: R3-D-05 and R3-D-30 defer `ylang ylang -> ylang_ylang` unless later explicit floral/ylang cleanup is opened. No alias removal, remap, or seed target promotion is authorized in this phase.
- `promotion_effect`: none

## Round 3 Alias Cleanup Ledger — Pending

### r3-alias-cleanup-001

- `approval_id`: r3-alias-cleanup-001
- `round`: phase_10_round_3
- `alias_source`: `musky`
- `alias_target`: `musk`
- `manual_approval`: approved
- `primary_disposition`: add_alias
- `rationale`: Musk is the approved canonical descriptor; musky is treated as adjective/variant alias to avoid duplicate primary descriptors.
- `evidence`: Round 3 canonical decision for animalic/musky.
- `validation_expectation`: If approved later as `add_alias`, verify canonical target exists in candidate v2 and avoid duplicate primary descriptors.
- `promotion_effect`: approved_for_alias_seed_round_3

### r3-alias-cleanup-002

- `approval_id`: r3-alias-cleanup-002
- `round`: phase_10_round_3
- `alias_source`: `leather`
- `alias_target`: `leathery`
- `manual_approval`: pending
- `primary_disposition`: add_alias
- `rationale`: Targeted alias investigation for `leather`/`leathery`; the alias is not authorized unless `leathery` exists and the curator approves the alias.
- `evidence`: R3-D-16 and R3-D-29 allow `leather` as alias investigation only. Corpus evidence is support only.
- `validation_expectation`: If approved later as `add_alias`, verify `leathery` exists in candidate v2 before editing alias JSON.
- `promotion_effect`: none

### r3-alias-cleanup-003

- `approval_id`: r3-alias-cleanup-003
- `round`: phase_10_round_3
- `alias_source`: `ambery`
- `alias_target`: `amber`
- `manual_approval`: pending
- `primary_disposition`: add_alias
- `rationale`: Targeted amber/resinous alias investigation if evidence supports `ambery` as an alias rather than a distinct descriptor.
- `evidence`: R3-D-28 and R3-D-29 allow `ambery` review if evidence exists; no evidence alone is approval.
- `validation_expectation`: If approved later as `add_alias`, verify `amber` exists in candidate v2 and the block contains clear rationale/evidence.
- `promotion_effect`: none

### r3-alias-cleanup-004

- `approval_id`: r3-alias-cleanup-004
- `round`: phase_10_round_3
- `alias_source`: `balsamic resin`
- `alias_target`: `balsamic_resin`
- `manual_approval`: pending
- `primary_disposition`: add_alias
- `rationale`: Direct amber/resinous variant cleanup may be appropriate only if evidence is clear and the target exists.
- `evidence`: R3-D-28 through R3-D-33 limit alias cleanup to targeted Round 3 scope and require approved `add_alias` before mutation.
- `validation_expectation`: If approved later as `add_alias`, verify canonical target exists in candidate v2.
- `promotion_effect`: none

### r3-alias-cleanup-005

- `approval_id`: r3-alias-cleanup-005
- `round`: phase_10_round_3
- `alias_source`: `ylang ylang`
- `alias_target`: `ylang_ylang`
- `manual_approval`: pending
- `primary_disposition`: defer
- `rationale`: Legacy `ylang ylang -> ylang_ylang` cleanup remains deferred; do not remove or remap the existing alias in Round 3.
- `evidence`: R3-D-05 and R3-D-30 keep ylang cleanup out of scope for this round.
- `validation_expectation`: Preserve legacy alias state unless a future explicit approval opens floral/ylang cleanup.
- `promotion_effect`: none

## Round 3 Relation Proposals — Pending

### r3-relation-001

- `approval_id`: r3-relation-001
- `round`: phase_10_round_3
- `source_subfamily_id`: `amber`
- `target_subfamily_id`: `balsamic_resin`
- `relation_type`: `same_family_tradition`
- `proposed_score`: 0.85
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed amber/resinous internal relation if both endpoints are approved and exist in candidate v2; score is manual and in [0,1].
- `evidence`: R3-D-12 and R3-D-34 through R3-D-39 require separate relation approval and endpoint checks.
- `endpoint_warning`: Write only if `amber` and `balsamic_resin` endpoints exist after approved seed edits.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-relation-002

- `approval_id`: r3-relation-002
- `round`: phase_10_round_3
- `source_subfamily_id`: `balsamic_resin`
- `target_subfamily_id`: `vanilla`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.70
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed balsamic/vanilla relation only after `balsamic_resin` exists; missing remains neutral.
- `evidence`: R3-D-12 lists `vanilla` as relevant amber/resinous bridge; score is manual proposal only.
- `endpoint_warning`: Write only if `balsamic_resin` and `vanilla` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-relation-003

- `approval_id`: r3-relation-003
- `round`: phase_10_round_3
- `source_subfamily_id`: `amber`
- `target_subfamily_id`: `vanilla`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.70
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed amber/vanilla relation if `amber` is approved and exists; corpus adjacency does not define the score.
- `evidence`: R3-D-12 and R3-D-36 require manual score/rationale/evidence.
- `endpoint_warning`: Write only if `amber` and `vanilla` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-relation-004

- `approval_id`: r3-relation-004
- `round`: phase_10_round_3
- `source_subfamily_id`: `balsamic_resin`
- `target_subfamily_id`: `woody_dry`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.65
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed balsamic/woody relation only if the new endpoint exists; missing remains neutral.
- `evidence`: R3-D-12 lists `woody_dry` as relevant amber/resinous bridge; score is manual proposal only.
- `endpoint_warning`: Write only if `balsamic_resin` and `woody_dry` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-relation-005

- `approval_id`: r3-relation-005
- `round`: phase_10_round_3
- `source_subfamily_id`: `amber`
- `target_subfamily_id`: `warm_spice`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.65
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed amber/warm spice relation only after `amber` exists and the curator approves the bridge.
- `evidence`: R3-D-12 lists `warm_spice`; R3-D-36 requires manual scoring in [0,1].
- `endpoint_warning`: Write only if `amber` and `warm_spice` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-relation-006

- `approval_id`: r3-relation-006
- `round`: phase_10_round_3
- `source_subfamily_id`: `musky`
- `target_subfamily_id`: `leathery`
- `relation_type`: `same_family_tradition`
- `proposed_score`: 0.80
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed animalic internal relation if both `musky` and `leathery` endpoints are approved and exist.
- `evidence`: R3-D-20 and R3-D-34 through R3-D-39 require separate relation approval and endpoint checks.
- `endpoint_warning`: Write only if `musky` and `leathery` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-relation-007

- `approval_id`: r3-relation-007
- `round`: phase_10_round_3
- `source_subfamily_id`: `musky`
- `target_subfamily_id`: `floral_rose`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.65
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed musky/floral rose bridge only after musky endpoint approval; missing remains neutral.
- `evidence`: R3-D-20 lists `floral_rose`; score is a manual proposal only.
- `endpoint_warning`: Write only if `musky` and `floral_rose` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-relation-008

- `approval_id`: r3-relation-008
- `round`: phase_10_round_3
- `source_subfamily_id`: `musky`
- `target_subfamily_id`: `vanilla`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.60
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed musky/vanilla bridge if `musky` is approved and endpoint exists.
- `evidence`: R3-D-20 lists `vanilla`; R3-D-36 requires manual score/rationale/evidence.
- `endpoint_warning`: Write only if `musky` and `vanilla` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-relation-009

- `approval_id`: r3-relation-009
- `round`: phase_10_round_3
- `source_subfamily_id`: `leathery`
- `target_subfamily_id`: `woody_dry`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.70
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed leathery/woody dry relation if `leathery` is approved and endpoint exists.
- `evidence`: R3-D-20 lists `woody_dry`; score is manual proposal only.
- `endpoint_warning`: Write only if `leathery` and `woody_dry` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-relation-010

- `approval_id`: r3-relation-010
- `round`: phase_10_round_3
- `source_subfamily_id`: `leathery`
- `target_subfamily_id`: `balsamic_resin`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.60
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed leathery/balsamic bridge only if both endpoints exist after seed approvals.
- `evidence`: R3-D-20 lists `balsamic_resin`; endpoint existence is mandatory under R3-D-38.
- `endpoint_warning`: Write only if `leathery` and `balsamic_resin` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-relation-011

- `approval_id`: r3-relation-011
- `round`: phase_10_round_3
- `source_subfamily_id`: `fresh_spice`
- `target_subfamily_id`: `warm_spice`
- `relation_type`: `same_family_tradition`
- `proposed_score`: 0.80
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fresh/warm spice relation only if `fresh_spice` is created with approved concrete descriptor coverage.
- `evidence`: R3-D-27 and R3-D-40 require fresh_spice endpoint existence before relation/accord writes.
- `endpoint_warning`: Write only if `fresh_spice` and `warm_spice` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-relation-012

- `approval_id`: r3-relation-012
- `round`: phase_10_round_3
- `source_subfamily_id`: `fresh_spice`
- `target_subfamily_id`: `citrus_fresh`
- `relation_type`: `cross_family_tradition_bridge`
- `proposed_score`: 0.65
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fresh_spice/citrus_fresh relation only if `fresh_spice` exists after approved seed curation.
- `evidence`: R3-D-27 and R3-D-40 require endpoint existence; score is manual proposal only.
- `endpoint_warning`: Write only if `fresh_spice` and `citrus_fresh` endpoints exist in candidate v2.
- `promotion_effect`: none

## Round 3 Accord Proposals — Pending

### r3-accord-001

- `approval_id`: r3-accord-001
- `round`: phase_10_round_3
- `source_subfamily_id`: `amber`
- `target_subfamily_id`: `balsamic_resin`
- `proposed_score`: 0.85
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed amber/balsamic accord only if both endpoints exist; score is manual and in [0,1].
- `evidence`: R3-D-12 and R3-D-36 require separate accord approval and manual score.
- `endpoint_warning`: Write only if `amber` and `balsamic_resin` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-accord-002

- `approval_id`: r3-accord-002
- `round`: phase_10_round_3
- `source_subfamily_id`: `balsamic_resin`
- `target_subfamily_id`: `vanilla`
- `proposed_score`: 0.70
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed balsamic/vanilla accord only after balsamic endpoint approval; missing remains neutral.
- `evidence`: R3-D-12 lists `vanilla` as relevant; score is manual proposal only.
- `endpoint_warning`: Write only if `balsamic_resin` and `vanilla` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-accord-003

- `approval_id`: r3-accord-003
- `round`: phase_10_round_3
- `source_subfamily_id`: `amber`
- `target_subfamily_id`: `vanilla`
- `proposed_score`: 0.70
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed amber/vanilla accord if `amber` exists; corpus evidence does not define score.
- `evidence`: R3-D-12 and R3-D-36 require manual approval/rationale/evidence.
- `endpoint_warning`: Write only if `amber` and `vanilla` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-accord-004

- `approval_id`: r3-accord-004
- `round`: phase_10_round_3
- `source_subfamily_id`: `balsamic_resin`
- `target_subfamily_id`: `woody_dry`
- `proposed_score`: 0.65
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed balsamic/woody accord only if `balsamic_resin` endpoint exists.
- `evidence`: R3-D-12 lists `woody_dry`; R3-D-38 requires endpoints to exist.
- `endpoint_warning`: Write only if `balsamic_resin` and `woody_dry` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-accord-005

- `approval_id`: r3-accord-005
- `round`: phase_10_round_3
- `source_subfamily_id`: `amber`
- `target_subfamily_id`: `warm_spice`
- `proposed_score`: 0.65
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed amber/warm spice accord only if `amber` endpoint exists and manual approval is persisted.
- `evidence`: R3-D-12 lists `warm_spice`; score is manual proposal only.
- `endpoint_warning`: Write only if `amber` and `warm_spice` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-accord-006

- `approval_id`: r3-accord-006
- `round`: phase_10_round_3
- `source_subfamily_id`: `musky`
- `target_subfamily_id`: `leathery`
- `proposed_score`: 0.80
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed internal animalic accord only if `musky` and `leathery` endpoints exist.
- `evidence`: R3-D-20 and R3-D-36 require separate manual score/rationale/evidence.
- `endpoint_warning`: Write only if `musky` and `leathery` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-accord-007

- `approval_id`: r3-accord-007
- `round`: phase_10_round_3
- `source_subfamily_id`: `musky`
- `target_subfamily_id`: `floral_rose`
- `proposed_score`: 0.65
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed musky/floral rose accord only after `musky` approval; missing remains neutral.
- `evidence`: R3-D-20 lists `floral_rose`; score is manual proposal only.
- `endpoint_warning`: Write only if `musky` and `floral_rose` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-accord-008

- `approval_id`: r3-accord-008
- `round`: phase_10_round_3
- `source_subfamily_id`: `musky`
- `target_subfamily_id`: `vanilla`
- `proposed_score`: 0.60
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed musky/vanilla accord if `musky` exists and the curator approves it.
- `evidence`: R3-D-20 lists `vanilla`; R3-D-36 requires manual score.
- `endpoint_warning`: Write only if `musky` and `vanilla` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-accord-009

- `approval_id`: r3-accord-009
- `round`: phase_10_round_3
- `source_subfamily_id`: `leathery`
- `target_subfamily_id`: `woody_dry`
- `proposed_score`: 0.70
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed leathery/woody accord only if `leathery` endpoint exists.
- `evidence`: R3-D-20 lists `woody_dry`; score is manual proposal only.
- `endpoint_warning`: Write only if `leathery` and `woody_dry` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-accord-010

- `approval_id`: r3-accord-010
- `round`: phase_10_round_3
- `source_subfamily_id`: `leathery`
- `target_subfamily_id`: `balsamic_resin`
- `proposed_score`: 0.60
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed leathery/balsamic accord only if both endpoints exist after approved seed edits.
- `evidence`: R3-D-20 lists `balsamic_resin`; endpoint existence is mandatory under R3-D-38.
- `endpoint_warning`: Write only if `leathery` and `balsamic_resin` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3

### r3-accord-011

- `approval_id`: r3-accord-011
- `round`: phase_10_round_3
- `source_subfamily_id`: `fresh_spice`
- `target_subfamily_id`: `warm_spice`
- `proposed_score`: 0.80
- `manual_approval`: pending
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fresh/warm spice accord only if `fresh_spice` is created from approved concrete descriptor coverage.
- `evidence`: R3-D-27 and R3-D-40 require endpoint existence before fresh_spice accord writes.
- `endpoint_warning`: Write only if `fresh_spice` and `warm_spice` endpoints exist in candidate v2.
- `promotion_effect`: none

### r3-accord-012

- `approval_id`: r3-accord-012
- `round`: phase_10_round_3
- `source_subfamily_id`: `fresh_spice`
- `target_subfamily_id`: `citrus_fresh`
- `proposed_score`: 0.65
- `manual_approval`: approved
- `primary_disposition`: approve_relation_accord
- `rationale`: Proposed fresh_spice/citrus_fresh accord only if `fresh_spice` exists after approved seed curation.
- `evidence`: R3-D-27 and R3-D-40 require endpoint existence; score is manual proposal only.
- `endpoint_warning`: Write only if `fresh_spice` and `citrus_fresh` endpoints exist in candidate v2.
- `promotion_effect`: approved_for_relation_accord_v2_round_3
