# Phase 5: Inference Engine - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 5-Inference Engine
**Areas discussed:** Seed authority, Semantic noise, Similarity meaning, Explainability

---

## Seed Authority

| Question | Options Presented | User's Choice |
|----------|-------------------|---------------|
| When corpus evidence conflicts with the manual taxonomy seed, what should Phase 5 do? | Seed wins; Corpus can override; Flag conflicts; You decide | Flag conflicts |
| Can Phase 5 create new inferred descriptors that are not in the seed, or only attach corpus stats to seed descriptors? | Create inferred; Seed only; Review queue; You decide | Create inferred |
| For descriptor clustering, should clusters be anchored to existing seed subfamilies or allowed to form corpus-native clusters first? | Seed anchored; Corpus native; Hybrid; You decide | Hybrid |
| How should Phase 5 handle alias candidates from Phase 4 during merge and clustering? | Suggest only; High-score merge; Ignore aliases; You decide | Suggest only |

**Notes:** User clarified the final policy: Phase 5 may create inferred descriptors from corpus evidence when frequency/statistical relevance is sufficient. They must be marked as inferred/corpus_derived/candidate, cannot overwrite seed, are not auto-promoted to curated taxonomy, and can appear in parallel outputs such as inferred_descriptors, suggested_nodes, candidate_relations or review_queue.

---

## Semantic Noise

| Question | Options Presented | User's Choice |
|----------|-------------------|---------------|
| How should Phase 5 treat generic descriptors like note, nuance, effect, type, quality during inference? | Downweight; Filter out; Weak evidence; You decide | Downweight |
| Where should the initial semantic noise list come from? | Curated list; Corpus-derived; Hybrid list; You decide | Hybrid list |
| If a noisy descriptor is also present in the manual seed, should it still be downweighted? | Seed exception; Still downweight; Flag only; You decide | Seed exception |
| Should Phase 5 expose the noise/downweight decisions in outputs for audit and later tuning? | Expose audit; Internal only; Tests only; You decide | Expose audit |

**Notes:** Semantic noise is downweighted rather than removed. Seed descriptors are protected from automatic downweight, but may receive audit warnings.

---

## Similarity Meaning

| Question | Options Presented | User's Choice |
|----------|-------------------|---------------|
| What should 'perfumery tradition' mean for v1 similarity scoring? | Curated relations; Seed proximity; Corpus proxy; Mixed | Mixed |
| What should 'accord compatibility' mean in v1? | Curated accord map; Co-occurrence proxy; Tradition subset; You decide | Curated accord map |
| How should the final similarity score weight the dimensions by default? | Semantic primary; Balanced; Curated primary; Configurable | Configurable |
| When a pair lacks curated tradition or accord data, how should Phase 5 score those dimensions? | Neutral missing; Zero missing; Corpus fallback; You decide | Neutral missing |

**Notes:** User clarified `tradition_score = curated_prior + seed_proximity + corpus_support`, with dimension scores kept separate. Curated relations and seed proximity take priority over corpus evidence. Final similarity score is configurable, with semantic-primary as default.

---

## Explainability

| Question | Options Presented | User's Choice |
|----------|-------------------|---------------|
| What explainability should each similarity edge include? | Scores only; Evidence summary; Full trace; You decide | Evidence summary |
| How should seed/corpus conflicts be exposed for review? | Review queue; Warnings only; Inline flags; You decide | Review queue |
| How much explanation should descriptor clusters include? | Cluster evidence; Membership only; Debug separate; You decide | Cluster evidence |
| Should explainability outputs be part of stable Phase 6 JSON artifacts, or Phase 5-only review data? | Phase 5 review; Stable artifacts; Both; You decide | Both |

**Notes:** Edges and clusters should carry compact evidence summaries. Review queue carries richer explanations, conflicts and curation suggestions.

---

## Agent's Discretion

- Exact thresholds for corpus-derived inference.
- Exact type shapes for review/evidence outputs.
- Exact formula implementation, as long as locked weighting and transparency decisions are respected.
- Internal module organization.

## Deferred Ideas

None.
