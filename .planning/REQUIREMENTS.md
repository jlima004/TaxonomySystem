# Milestone v2.6 Requirements

## Microcuration

- [ ] **CUR-01**: Triage and resolve the remaining 18 Group B `seed_corpus_conflict` items using the established microcuration guardrails.
- [ ] **CUR-02**: Apply any necessary target additions or alias modifications specifically for the 18 items.
- [ ] **CUR-03**: Preserve v2 candidate seed authority and prevent automatic corpus promotion for low-support items.
- [ ] **CUR-04**: For each of the 18 Group B conflicts, record an explicit disposition (promote/add target, alias mutation, alias guard/reject alias, normalize variant, defer/manual_review, or no-op with rationale).

## Stabilization

- [ ] **STAB-01**: Validate taxonomy compilation invariants and data boundaries before v2.6 publication.
- [ ] **STAB-02**: Publish official v2.6 compiled artifacts to `data/compiled/v2` maintaining schema and deterministic behavior.
- [ ] **STAB-03**: Verify `review_queue` reduction metrics and confirm resolution of the 18 targeted conflicts without regression.
- [ ] **STAB-04**: Produce a v2.6 closure/rebaseline report comparing pre-v2.6 and post-v2.6 review_queue states, resolved/remaining conflicts, and unchanged low_support count.

## Future Requirements

- Low-support bulk triage execution
- Advanced semantic reasoning pipeline for aliases (beyond explicit conflicts)

## Out of Scope

- Bulk triage of the 278 `corpus_candidate_low_support` items.
- Reopening Group A stopword policy.
- Automatic promotion of corpus candidates.
- Graphify redesign or scoring redesign.
- Re-architecting the compile pipeline or graph generator.
- Broad seed expansion unrelated to the 18 conflict items.

## Traceability

- **CUR-01**: Phase 38
- **CUR-02**: Phase 38
- **CUR-03**: Phase 38
- **CUR-04**: Phase 38
- **STAB-01**: Phase 39
- **STAB-02**: Phase 39
- **STAB-03**: Phase 39
- **STAB-04**: Phase 39
