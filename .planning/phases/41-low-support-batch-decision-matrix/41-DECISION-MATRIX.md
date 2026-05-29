# 41-DECISION-MATRIX

## Execution Summary for Phase 42
- promote_to_seed: 6
- add_alias: 0
- reject: 4
- defer_manual_review: 19
- defer_future_batch: 0
- needs_external_reference: 1
- **mutation_allowed=true**: 6
- **mutation_allowed=false**: 24

## Decision Matrix

| id | candidate | phase40_group | investigation_depth | disposition | target_family | target_subfamily | target_descriptor | mutation_allowed | rationale | evidence | expected_effect | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | nutty | high_value | targeted | defer_manual_review | | | | false | Real olfactive descriptor but no safe existing subfamily (vanilla is loosely-related). | freq: 271 | Pending new subfamily (e.g. nutty) | D-36 enforced |
| 02 | coffee | high_value | targeted | defer_manual_review | | | | false | Missing natural subfamily (gourmand/coffee). | freq: 116 | Pending new subfamily | D-29, D-36 enforced |
| 03 | hay | high_value | targeted | defer_manual_review | | | | false | Lacks direct subfamily (fougere/hay missing). Amber or herbal_green are stretches. | freq: 112 | Pending new subfamily | |
| 04 | orri | high_value | deep | needs_external_reference | | | | false | Likely alias/truncation for orris, but orris is not in taxonomy seed. | freq: 75 | Clarify canonical name | |
| 05 | eucalyptus | high_value | targeted | defer_manual_review | | | | false | Camphoraceous/minty note with no perfect subfamily (citrus_fresh inferred is wrong). | freq: 68 | Pending new subfamily | |
| 06 | peppermint | high_value | targeted | promote_to_seed | fresh_spice | fresh_spice | peppermint | true | Clear note with exact fit in fresh_spice. | freq: 56 | Add peppermint seed | |
| 07 | rosemary | high_value | targeted | promote_to_seed | green | herbal_green | rosemary | true | Clear herbal note fitting herbal_green perfectly. | freq: 54 | Add rosemary seed | |
| 08 | hazelnut | high_value | targeted | defer_manual_review | | | | false | Real descriptor but no nutty/gourmand subfamily fits besides vanilla (stretch). | freq: 46 | Pending new subfamily | |
| 09 | fir_needle | high_value | targeted | defer_manual_review | | | | false | Needs pine/coniferous subfamily. woody_dry is a stretch. | freq: 45 | Pending new subfamily | |
| 10 | cumin | high_value | targeted | promote_to_seed | spicy | warm_spice | cumin | true | Clear spice note fitting warm_spice. | freq: 40 | Add cumin seed | |
| 11 | maple | high_value | targeted | defer_manual_review | | | | false | Needs gourmand/syrup subfamily. | freq: 34 | Pending new subfamily | |
| 12 | orchid | high_value | targeted | defer_manual_review | | | | false | Vague floral, needs expert review to place in white or rose or other. | freq: 31 | Clarify floral facet | |
| 13 | spearmint | high_value | targeted | promote_to_seed | fresh_spice | fresh_spice | spearmint | true | Clear mint note fitting fresh_spice. | freq: 31 | Add spearmint seed | |
| 14 | caraway | high_value | targeted | promote_to_seed | spicy | warm_spice | caraway | true | Clear spice note fitting warm_spice. | freq: 25 | Add caraway seed | |
| 15 | opoponax | high_value | targeted | promote_to_seed | amber_resinous | balsamic_resin | opoponax | true | Clear resin note fitting balsamic_resin perfectly. | freq: 22 | Add opoponax seed | |
| 16 | sulfurous | caution | targeted | defer_manual_review | | | | false | No safe existing subfamily. | freq: 226 | Pending new subfamily | D-36 enforced |
| 17 | roasted | caution | targeted | defer_manual_review | | | | false | No safe existing subfamily (leathery is stretch). | freq: 170 | Pending new subfamily | |
| 18 | buttery | caution | targeted | defer_manual_review | | | | false | No safe existing subfamily (lactonic missing). | freq: 95 | Pending new subfamily | |
| 19 | mentholic | caution | deep | defer_manual_review | | | | false | Variant of menthol, but menthol is not in seed. Needs expert review. | freq: 60 | Clarify canonical name | |
| 20 | savory | caution | targeted | defer_manual_review | | | | false | Ambiguous descriptor, no safe subfamily. | freq: 57 | Review for inclusion | |
| 21 | bready | caution | targeted | defer_manual_review | | | | false | No safe existing subfamily. | freq: 52 | Pending new subfamily | D-36 enforced |
| 22 | marine | caution | targeted | defer_manual_review | | | | false | No safe existing subfamily (aquatic/marine missing). | freq: 39 | Pending new subfamily | D-36 enforced |
| 23 | alcoholic | caution | targeted | defer_manual_review | | | | false | No safe existing subfamily. | freq: 34 | Pending new subfamily | D-36 enforced |
| 24 | meaty | likely_defer_reject | baseline | defer_manual_review | | | | false | Legitimate sensory use in flavor/off-note contexts, but out of scope for fine fragrance right now. | freq: 155 | Review in future | |
| 25 | garlic | likely_defer_reject | baseline | defer_manual_review | | | | false | Legitimate sensory use in flavor/off-note contexts, but out of scope for fine fragrance right now. | freq: 85 | Review in future | |
| 26 | alliaceous | likely_defer_reject | baseline | defer_manual_review | | | | false | Legitimate sensory use in flavor/off-note contexts, but out of scope for fine fragrance right now. | freq: 73 | Review in future | |
| 27 | fishy | likely_defer_reject | baseline | reject | | | | false | Out of scope off-note, corrupts taxonomy if promoted. | freq: 42 | No action | |
| 28 | potato | likely_defer_reject | baseline | reject | | | | false | Out of scope culinary/vegetal note. | freq: 39 | No action | |
| 29 | cabbage | likely_defer_reject | baseline | reject | | | | false | Out of scope culinary/vegetal note. | freq: 32 | No action | |
| 30 | radish | likely_defer_reject | baseline | reject | | | | false | Out of scope culinary/vegetal note. | freq: 24 | No action | |
