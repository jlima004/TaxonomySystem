# Phase 38: Group B Conflict Microcuration - Decision Matrix

This matrix disposes of the 18 remaining `seed_corpus_conflict` items from Phase 35. 

| Descriptor | Seed Conflict | Conflict Type | Proposed Disposition | Mutation Allowed | Rationale | Expected Effect |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `banana_peel` | `banana` | semantic_overlap | `defer_manual_review` | `false` | Legitimate botanical part. Needs curation to decide if it's an alias or distinct seed note. | Remains in review_queue. |
| `banana_ripe_banana` | `banana` | semantic_overlap | `alias_to_seed` | `true` | Ripe banana is just banana. Safe to alias. | Added to descriptor_aliases.seed.json. Removed from conflict queue. |
| `banana_unripe_banana` | `banana` | semantic_overlap | `defer_manual_review` | `false` | Unripe fruit often carries distinct green/tart notes. Not safe to blindly alias. | Remains in review_queue. |
| `clover` | `clove` | incidental_substring | `add_to_conflict_stopwords` | `true` | Clover (trevo) and clove (cravo) are distinct. Incidental substring match. | Added to stopwords. Will be evaluated as normal corpus candidate. |
| `grape` | `grapefruit` | incidental_substring | `add_to_conflict_stopwords` | `true` | Grape (uva) and grapefruit (toranja) are distinct. Incidental substring match. | Added to stopwords. Will be evaluated as normal corpus candidate. |
| `grapefruit_peel` | `grapefruit` | semantic_overlap | `defer_manual_review` | `false` | Legitimate botanical part. Needs curation to decide if it's an alias or distinct. | Remains in review_queue. |
| `lemongrass` | `lemon` | incidental_substring | `add_to_conflict_stopwords` | `true` | Lemongrass (capim-limão) and lemon (limão) are distinct. Incidental substring. | Added to stopwords. Will be evaluated as normal corpus candidate. |
| `lily` | `lily_of_the_valley` | incidental_substring | `add_to_conflict_stopwords` | `true` | Lily (lírio) and lily of the valley (muguet) are distinct florals. Incidental substring. | Added to stopwords. Will be evaluated as normal corpus candidate. |
| `melon_rind` | `melon` | semantic_overlap | `defer_manual_review` | `false` | Legitimate botanical part. Needs curation. | Remains in review_queue. |
| `melon_unripe_melon` | `melon` | semantic_overlap | `defer_manual_review` | `false` | Unripe melon might be a distinct green note. Not safe to blindly alias. | Remains in review_queue. |
| `orange_bitter_orange` | `bitter_orange` | semantic_overlap | `alias_to_seed` | `true` | Clearly bitter orange. Safe to alias. | Added to descriptor_aliases.seed.json. Removed from conflict queue. |
| `rose_dried_rose` | `rose` | semantic_overlap | `defer_manual_review` | `false` | Dried rose might have a distinct powdery/dusty facet. Needs curation. | Remains in review_queue. |
| `rose_red_rose` | `rose` | semantic_overlap | `alias_to_seed` | `true` | Red rose is just rose in perfumery context. Safe to alias. | Added to descriptor_aliases.seed.json. Removed from conflict queue. |
| `rose_tea_rose` | `rose` | semantic_overlap | `defer_manual_review` | `false` | Tea rose might be distinct enough from standard rose. Needs curation. | Remains in review_queue. |
| `rosemary` | `rose` | incidental_substring | `add_to_conflict_stopwords` | `true` | Rosemary (alecrim) and rose (rosa) are completely distinct. Incidental substring. | Added to stopwords. Will be evaluated as normal corpus candidate. |
| `tomato` | `tomato_leaf` | incidental_substring | `add_to_conflict_stopwords` | `true` | Tomato fruit vs tomato leaf are distinct notes. Safe to suppress conflict. | Added to stopwords. Will be evaluated as normal corpus candidate. |
| `watermelon_rind` | `melon` | incidental_substring | `defer_manual_review` | `false` | Substring match on melon, but also a rind. Complex overlap. Defer. | Remains in review_queue. |
| `watermelon` | `melon` | incidental_substring | `add_to_conflict_stopwords` | `true` | Watermelon (melancia) and melon (melão) are distinct fruits. Incidental substring. | Added to stopwords. Will be evaluated as normal corpus candidate. |
