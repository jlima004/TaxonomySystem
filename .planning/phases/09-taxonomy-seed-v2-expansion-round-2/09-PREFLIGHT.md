---
status: planned
executable: true
plans: 09-01, 09-02, 09-03, 09-04
implementation: pending
---

# Phase 9: Taxonomy Seed v2 Expansion Round 2 - Preflight

## Status

Phase 9 plans have been created and the phase is ready for execution. 69 decisions (R2-D-01 to R2-D-69) are documented in `09-CONTEXT.md`. The plans cover workbook setup, seed/alias curation, relations/accords curation, and validation reporting.

## Execution Boundary

- No executable plans exist.
- No implementation is authorized.
- No code changes are part of this phase state.
- No compiled artifacts should be changed during discussion.
- `taxonomy-seed.v1.json` must not be edited.
- `data/compiled/v1/` must not be overwritten.
- v2 must not be promoted to default.
- `09-CONTEXT.md` will be created after discussion captures enough stable decisions.

## Preserved Policies

- Seed taxonomy remains curated truth.
- Corpus candidates remain review-required evidence.
- `similarity_matrix.json.review_queue` remains a curation surface, not a promotion mechanism.
- No automatic candidate, alias, relation, accord, family or subfamily promotion is allowed.
- Each new entry requires `manual_approval: approved`, rationale and evidence persisted in the workbook.

## Starting Point

Phase 8 is complete and verified. Phase 9 starts from the post-Phase 8 state:

- V2 candidate seed: 4 families, 7 subfamilies, 22 seed descriptors.
- Added in Phase 8: `gourmand`/`vanilla`/`vanilla`.
- Review queue: 403 items.
- Graph edges: 6.
- v2 is explicit-path only; defaults remain v1.
- `vanilla` has no relation/accord (accepted soft warning).
- `ylang ylang -> ylang_ylang` has absent target (accepted soft warning).
