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
