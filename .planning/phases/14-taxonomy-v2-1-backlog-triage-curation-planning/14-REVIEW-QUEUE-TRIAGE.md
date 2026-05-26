---
status: read_only_report_only
non_authorizing: true
phase: 14-taxonomy-v2-1-backlog-triage-curation-planning
source: data/compiled/v2/similarity_matrix.json review_queue
created: 2026-05-26
protected_paths_touched: none
---

# Phase 14 Review Queue Triage

This report is a read-only planning handoff for the official v2 `review_queue`. It groups and samples queue items so future work can be planned with traceable evidence. It authorizes no promotion, rejection, seed mutation, alias mutation, relation/accord mutation, official artifact mutation, default-path mutation or Graphify mutation.

Full line-by-line classification of all 317 items is not required for first triage. Grouping quality plus representative samples are the quality gate for this report.

## Summary metrics

Read-only inspection source: `data/compiled/v2/similarity_matrix.json`.

| metric | value | evidence |
|---|---:|---|
| Total review queue items | 317 | `sim.review_queue.length` |
| `corpus_candidate_low_support` | 284 | grouped by `type` |
| `seed_corpus_conflict` | 33 | grouped by `type` |
| Severity distribution | 317 medium | grouped by `severity` |

Queue interpretation:

- `corpus_candidate_low_support` items are corpus-derived placement candidates that failed one or more support gates. They are evidence for future review, not approval to promote descriptors.
- `seed_corpus_conflict` items are corpus descriptors that overlap seed descriptors while remaining review-only. They are attention groups, not proof that curated seed truth is wrong.
- Raw numeric reduction is not the first quality gate. Any future reduction needs persisted curatorial approval, an explicit allowlist, before/after validation and protected diff checks.

## seed_corpus_conflict triage

Total: 33 medium-severity items.

These items must stay separate from low-support corpus candidates because they compare corpus evidence against curated seed anchors. The immediate action is semantic review planning, not seed correction.

Top groups by subfamily:

| group_id | subfamily | family | count | interpretation | suggested_disposition |
|---|---|---|---:|---|---|
| RQ-SC-CITRUS-FRESH | `citrus_fresh` | `citrus` | 6 | Citrus corpus terms overlap `grapefruit`, `lemon` and `sweet_orange` anchors. | `manual_review_pack` |
| RQ-SC-FLORAL-ROSE | `floral_rose` | `floral` | 5 | Rose variants and near-overlaps cluster around curated `rose`. | `manual_review_pack` |
| RQ-SC-TROPICAL-FRUIT | `tropical_fruit` | `fruity` | 5 | Pineapple and banana anchors attract broad or variant corpus terms. | `manual_review_pack` |
| RQ-SC-ORCHARD-FRUIT | `orchard_fruit` | `fruity` | 4 | Melon variants overlap curated `melon`. | `manual_review_pack` |
| RQ-SC-CITRUS-BITTER | `citrus_bitter` | `citrus` | 3 | Bitter-orange variants need evidence review. | `manual_review_pack` |
| RQ-SC-RED-FRUIT | `red_fruit` | `fruity` | 3 | Berry/strawberry terms need seed-vs-corpus review. | `manual_review_pack` |

Top groups by seed descriptor:

| seed_descriptor | count | triage note |
|---|---:|---|
| `rose` | 5 | Strongest single conflict anchor; likely future manual review pack seed group. |
| `melon` | 4 | Variant terms cluster under one existing seed anchor. |
| `banana` | 3 | Peel/ripe/unripe variants are review evidence only. |
| `bitter_orange` | 3 | Bitter/citrus variants need semantic review before any action. |
| `grapefruit` | 3 | Broad `fruit`/`grape`/peel evidence should not auto-remap seed truth. |
| `blackberry`, `cedarwood`, `lemon`, `pineapple`, `tomato_leaf` | 2 each | Lower-count anchors that remain future review candidates. |

Reason distribution:

| reason | count |
|---|---:|
| `corpus descriptor overlaps a seed descriptor but remains review-only` | 33 |

Quality gate for this type: preserve seed authority, show seed/corpus tension with traceable samples and defer any mutation to a future approved curation plan.

## corpus_candidate_low_support triage

Total: 284 medium-severity items.

These items are corpus candidate placements that failed support, normalized support or placement score thresholds. They should be grouped before sampling because the queue is high-volume and many descriptors are weak, generic, technical, cross-family or otherwise ambiguous.

Top groups by subfamily:

| group_id | subfamily | count | dominant reason | interpretation | suggested_disposition |
|---|---|---:|---|---|---|
| RQ-LS-AMBER | `amber` | 111 | `support_below_threshold` | Largest pressure group; likely contains mixed resinous, technical, material and generic corpus evidence. | `insufficient_evidence` |
| RQ-LS-TROPICAL-FRUIT | `tropical_fruit` | 28 | `support_below_threshold` | Candidate evidence is recurrent but still below support or placement gates. | `phase_15_candidate` |
| RQ-LS-FLORAL-ROSE | `floral_rose` | 24 | `support_below_threshold` | Mixed floral/non-floral terms need semantic review before any shortlist. | `manual_review_pack` |
| RQ-LS-CITRUS-FRESH | `citrus_fresh` | 22 | `support_below_threshold` | Contains weak citrus-adjacent and non-olfactive terms; no direct action. | `insufficient_evidence` |
| RQ-LS-ORCHARD-FRUIT | `orchard_fruit` | 20 | `support_below_threshold` | Fruit variants and unrelated terms need grouping review. | `phase_15_candidate` |
| RQ-LS-VANILLA | `vanilla` | 15 | `support_below_threshold` | Candidate pressure exists but must respect post-v2 default seed authority. | `phase_15_candidate` |
| RQ-LS-FLORAL-WHITE | `floral_white` | 12 | `support_below_threshold` | Small manual review group if future curation needs white-floral coverage. | `follow_up_later` |
| RQ-LS-WARM-SPICE | `warm_spice` | 12 | `support_below_threshold` | May overlap future spice cleanup, but not an immediate queue-reduction target. | `follow_up_later` |
| RQ-LS-FRESH-SPICE | `fresh_spice` | 10 | `support_below_threshold` | Fresh spice has prior backlog history; needs future curation evidence, not auto-promotion. | `phase_15_candidate` |

Reason distribution:

| reason | count | triage meaning |
|---|---:|---|
| `support_below_threshold` | 267 | Candidate lacked enough direct seed/corpus support. |
| `normalized_support_below_threshold` | 9 | Candidate had raw support but insufficient normalized support. |
| `placement_score_below_threshold` | 8 | Candidate placement score stayed below threshold even when support existed. |

Top combined subfamily/reason groups:

| group_id | subfamily | reason | count |
|---|---|---|---:|
| RQ-LS-AMBER-SUPPORT | `amber` | `support_below_threshold` | 111 |
| RQ-LS-TROPICAL-FRUIT-SUPPORT | `tropical_fruit` | `support_below_threshold` | 25 |
| RQ-LS-CITRUS-FRESH-SUPPORT | `citrus_fresh` | `support_below_threshold` | 19 |
| RQ-LS-FLORAL-ROSE-SUPPORT | `floral_rose` | `support_below_threshold` | 19 |
| RQ-LS-ORCHARD-FRUIT-SUPPORT | `orchard_fruit` | `support_below_threshold` | 19 |
| RQ-LS-VANILLA-SUPPORT | `vanilla` | `support_below_threshold` | 13 |
| RQ-LS-FLORAL-WHITE-SUPPORT | `floral_white` | `support_below_threshold` | 12 |
| RQ-LS-FRESH-SPICE-SUPPORT | `fresh_spice` | `support_below_threshold` | 10 |
| RQ-LS-WARM-SPICE-SUPPORT | `warm_spice` | `support_below_threshold` | 10 |

Quality gate for this type: use grouped recurrence and representative samples to identify future review candidates, while rejecting pressure to promote weak candidates directly from corpus evidence.

## Traceable sample rows

Samples are representative rows from the official v2 JSON. `mutation_authorized` is `no` for every row.

| sample_id | queue_type | descriptor_or_seed | family | subfamily | reason | evidence_summary | group_id | suggested_disposition | mutation_authorized |
|---|---|---|---|---|---|---|---|---|---|
| RQ-SAMPLE-LS-001 | `corpus_candidate_low_support` | `acorn` | unknown | `amber` | `support_below_threshold` | support 0, normalized_support 0, placement_score 0, candidate_frequency 5, thresholds support 3 / normalized 0.05 / placement 0.35 | RQ-LS-AMBER | `insufficient_evidence` | no |
| RQ-SAMPLE-LS-002 | `corpus_candidate_low_support` | `agarwood` | unknown | `amber` | `support_below_threshold` | support 1, normalized_support 0.2, placement_score 0.36, candidate_frequency 5; support still below threshold | RQ-LS-AMBER | `manual_review_pack` | no |
| RQ-SAMPLE-LS-003 | `corpus_candidate_low_support` | `alcoholic` | unknown | `tropical_fruit` | `placement_score_below_threshold` | support 3 and normalized_support 0.088 pass basic thresholds, but placement_score 0.312 is below 0.35 | RQ-LS-TROPICAL-FRUIT | `phase_15_candidate` | no |
| RQ-SAMPLE-LS-004 | `corpus_candidate_low_support` | `alliaceous` | unknown | `citrus_fresh` | `support_below_threshold` | support 2, normalized_support 0.027, placement_score 0.161, candidate_frequency 73 | RQ-LS-CITRUS-FRESH | `insufficient_evidence` | no |
| RQ-SAMPLE-LS-005 | `corpus_candidate_low_support` | `banana_ripe_banana` | unknown | `orchard_fruit` | `support_below_threshold` | support 2, normalized_support 0.5, placement_score 0.42, candidate_frequency 4; support remains below threshold | RQ-LS-ORCHARD-FRUIT | `phase_15_candidate` | no |
| RQ-SAMPLE-SC-001 | `seed_corpus_conflict` | seed `grapefruit` / corpus `grape` | `citrus` | `citrus_fresh` | corpus descriptor overlaps a seed descriptor but remains review-only | corpus_count 76, confidence 0.5, min_corpus_frequency 2 | RQ-SC-CITRUS-FRESH | `manual_review_pack` | no |
| RQ-SAMPLE-SC-002 | `seed_corpus_conflict` | seed `rose` / corpus `rosemary` | `floral` | `floral_rose` | corpus descriptor overlaps a seed descriptor but remains review-only | corpus_count 54, confidence 0.5, min_corpus_frequency 2 | RQ-SC-FLORAL-ROSE | `manual_review_pack` | no |
| RQ-SAMPLE-SC-003 | `seed_corpus_conflict` | seed `banana` / corpus `banana_unripe_banana` | `fruity` | `tropical_fruit` | corpus descriptor overlaps a seed descriptor but remains review-only | corpus_count 11, confidence 0.5, min_corpus_frequency 2 | RQ-SC-TROPICAL-FRUIT | `manual_review_pack` | no |
| RQ-SAMPLE-SC-004 | `seed_corpus_conflict` | seed `melon` / corpus `watermelon` | `fruity` | `orchard_fruit` | corpus descriptor overlaps a seed descriptor but remains review-only | corpus_count 14, confidence 0.5, min_corpus_frequency 2 | RQ-SC-ORCHARD-FRUIT | `manual_review_pack` | no |

## Recommendations

Recommendations are future planning signals only. They are not execution approval and do not reduce the queue.

| recommendation_id | category | scope | rationale | required_next_gate |
|---|---|---|---|---|
| RQ-REC-01 | `manual_review_pack` | `seed_corpus_conflict` groups for `rose`, `melon`, `banana`, `bitter_orange`, `grapefruit` | Conflict rows need semantic judgment before any seed, alias or corpus disposition. | Future manual review pack or Phase 15 curation plan with persisted approval. |
| RQ-REC-02 | `manual_review_pack` | Select `corpus_candidate_low_support` rows with high recurrence but ambiguous semantics | Some low-support items may be useful curation candidates, but only after endpoint fit and evidence checks. | Candidate inventory with existing family/subfamily fit, no alias/relation dependency and traceable evidence. |
| RQ-REC-03 | `phase_15_candidate` | `tropical_fruit`, `orchard_fruit`, `vanilla`, `fresh_spice` groups | These groups have enough recurrence or prior backlog relevance to justify future curation planning. | Phase 15+ curation scope, persisted approval and before/after queue validation. |
| RQ-REC-04 | `accepted_with_policy` | Seed authority and prior soft-finding policy | Conflicts are visible but do not invalidate curated seed truth. | Keep policy until a future plan proves a specific mutation is safe and approved. |
| RQ-REC-05 | `insufficient_evidence` | Broad weak groups, especially many `amber` support failures | Volume alone is not curation evidence; weak support should not become promotion pressure. | More evidence or non-actionable classification in a later review pack. |
| RQ-REC-06 | `non_actionable` | Clearly technical, generic or cross-domain descriptors discovered during future review | Some candidates should remain queue evidence only and never become seed descriptors. | Future review can mark non-actionable without mutating official artifacts. |

## Guardrails

This report is non-authorizing. It authorizes no promotion, no rejection, no seed mutation, no alias mutation, no relation/accord mutation, no official artifact mutation, no default-path mutation and no Graphify mutation.

Protected files and directories remain read-only for this plan:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1/**`
- `data/compiled/v2/**`
- `src/cli/parse_args.ts`
- `graphify-out/*`

Future real queue reduction requires all of the following:

- Persisted curatorial approval for every descriptor, alias, relation or accord mutation.
- Explicit file allowlist and plan-specific validation contract.
- Before/after queue metrics and rationale for changed counts.
- Protected diff check covering taxonomy, inference, compiled v1/v2 and default-path files.
- `/tmp`-only compile/smoke output if compile validation is needed.
- Graphify staging guard and no `graphify-out/*` mutation unless a separate artifact plan authorizes it.
- Commit separation between report-only planning, curation/data changes and generated artifacts.

This report should feed later planning, especially Plan 14-03 optional-artifact justification, by identifying which manual-review packs are useful and which candidate groups should defer to Phase 15+.
