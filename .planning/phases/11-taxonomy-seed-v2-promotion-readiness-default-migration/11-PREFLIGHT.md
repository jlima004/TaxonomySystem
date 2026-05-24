---
status: context_captured
executable: false
plans: none
implementation: not_authorized
---

# Phase 11: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning - Preflight

## Status

Phase 11 context is captured in `11-CONTEXT.md`. No executable plans exist, and the phase is not ready for execution.

## Execution Boundary

- No executable plans exist.
- No implementation is authorized.
- No code changes are part of this phase state.
- No seed/data changes are authorized during context gathering.
- No compiled artifacts should be changed during discussion.
- No official `data/compiled/v2` should be created by default.
- `taxonomy-seed.v1.json` must not be edited or removed.
- `curated_relations.v1.json` must not be edited or removed.
- `accord_map.v1.json` must not be edited or removed.
- `data/compiled/v1/` must not be overwritten or removed.
- v2 must not be promoted to default.
- `DEFAULT_PATHS` must not be altered.
- `11-CONTEXT.md` exists as canonical context, but does not authorize execution.

## Preserved Policies

- Seed taxonomy remains curated truth.
- Corpus candidates and review_queue entries remain support-only evidence.
- No automatic candidate, alias, relation, accord, family or subfamily promotion is allowed.
- Every future default switch requires explicit human approval, an executable plan, validation gates and rollback instructions.
- Missing relation/accord data remains neutral/undefined unless an approved relation/accord or approved gap policy says otherwise.
- V1 inputs and compiled baseline remain protected for audit and rollback.

## Starting Point

Phase 10 is complete and approved. Phase 11 starts from the post-Phase 10 state:

- V2 candidate seed: 10 families, 18 subfamilies, 39 seed descriptors.
- Total compiled descriptors: 303 in temporary v2 comparison output.
- Review queue: 317 items.
- Input relation_count: 14.
- Input accord_count: 19.
- Compiled graph edges: 13.
- Isolated subfamilies: 0.
- Hard failures: none.
- v2 is explicit-path only; defaults remain v1.
- `ylang ylang -> ylang_ylang` remains a legacy alias target gap.
- Graph density is lower in v2 and must be discussed before promotion.
- Inherited zero-frequency seeds remain.
- Some Round 3 candidates remain pending/deferred.

## Preflight Result

Phase 11 is not ready for execution. The only allowed next step is non-executable research/planning preparation when explicitly authorized; no implementation or default switch is authorized.
