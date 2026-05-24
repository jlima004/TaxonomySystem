# Phase 11 Soft Findings And Alias Policy

## Scope

This document defines the final Phase 11 policy for PROMO-03 and PROMO-04. It is documentation-only and does not authorize code/data mutations, default switching, or artifact publication.

## Disposition Vocabulary

Allowed dispositions:

- `blocker_before_promotion`
- `accepted_with_policy`
- `follow_up_after_promotion`

No soft finding may remain without disposition at future switch time.

## Final Soft Findings Table

| finding_id | description | affected_area | disposition | rationale | required_policy | promotion_blocker | follow_up_phase |
|---|---|---|---|---|---|---|---|
| legacy_ylang_alias_absent_target | Legacy alias `ylang ylang -> ylang_ylang` points to a target absent from seed v2. | authoritative alias readiness | accepted_with_policy | Legacy mapping is known and bounded; acceptance is valid only as an explicit auditable exception. | Maintain explicit exception list; treat any non-listed absent-target alias as invalid. | no (only if explicit exception remains and no new absent-target aliases exist) | future floral/exotic-floral/ylang cleanup |
| lower_graph_density | v2 graph density is lower than v1 after endpoint expansion. | graph readiness | accepted_with_policy | Coverage-over-density policy allows lower density when subfamily isolation is zero and coverage evidence is complete. | Require `isolated_subfamilies = 0` and documented relation/accord coverage or approved gaps per subfamily. | no | future graph quality tuning |
| inherited_zero_frequency_seeds | Some zero-frequency seeds are inherited from v1 baseline. | seed quality/readiness | accepted_with_policy | Inherited legacy seeds are accepted if explicitly documented; uncontrolled new zero-frequency additions are not. | Keep inherited list explicit; block new zero-frequency seed additions without rationale/approval. | no | future seed curation cleanup |
| review_queue_317 | Review queue remains at 317 items in v2 candidate. | review queue readiness | accepted_with_policy | Queue is reduced vs v1 and can be accepted with explicit distribution/severity policy and blocker triage. | Enforce documented queue distribution, severity rationale, and explicit dispositions for blocker-class items. | no | future review queue reduction wave |
| increased_seed_corpus_conflict | `seed_corpus_conflict` count increased in v2 candidate. | review queue / curation traceability | accepted_with_policy | Increase is acceptable when caused by curated seed truth backed by persisted approval, rationale, and evidence. | Require traceability links for conflict-generating curated entries and keep conflicts out of implicit acceptance. | no | future conflict-resolution triage |
| pending_deferred_candidates | Approved-pending/deferred candidates still exist and are not promoted. | curation workflow boundaries | follow_up_after_promotion | Deferred items are expected backlog and remain valid only if they do not enter authoritative artifacts prematurely. | Keep pending/deferred entries out of seed, aliases, relations, and accords unless explicitly approved in future phases. | no | future curation rounds |

## Promotion Blocker Summary

- PROMO-03 policy outcome: all known soft findings are explicitly dispositioned with rationale, required policy, and blocker status.
- Any soft finding not explicitly listed/dispositioned at switch time becomes `blocker_before_promotion` by policy.
- `legacy_ylang_alias_absent_target` is not a blocker only under the documented legacy exception policy below.

## Legacy Alias Exception Policy

PROMO-04 policy rules:

- New aliases with absent targets are hard blockers.
- Round 3+ aliases must point to canonical v2 seed targets.
- Alias candidate/review-only entries must never enter authoritative aliases.
- Accepted legacy absent-target aliases require an explicit auditable exception list.

## Exception List

| alias | target | status | rationale | promotion_blocker | follow_up_phase |
|---|---|---|---|---|---|
| ylang ylang | ylang_ylang | accepted_with_policy_legacy_exception | preserved legacy alias with absent target documented before promotion | no if exception remains explicit and no new absent-target aliases exist | future floral/exotic-floral/ylang cleanup |

## Invalid New Alias Rule

New aliases with absent canonical targets are invalid and are hard blockers before any promotion.

## Forbidden Phase 11 Remediations

Phase 11 must not:

- add `ylang_ylang` to seed v2,
- remove `ylang ylang`, or
- remap `ylang ylang` to a different target.

## Future Follow-Up

`ylang ylang -> ylang_ylang` remediation remains future floral/exotic-floral/ylang cleanup work and is out of scope for Phase 11.
