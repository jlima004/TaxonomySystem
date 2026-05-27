# Phase 20 — Context: Alias Target Microcuration Execution

**Gathered:** 2026-05-26
**Status:** Planning Approved / Not Ready for Execution

## Phase Boundary

Phase 20 starts from the completed Phase 19 planning package and narrows the next possible action to a controlled alias target microcuration. The preferred execution candidate is `petit grain -> petitgrain`, because `petitgrain` exists in compiled v2 as a corpus candidate with frequency 52 in `citrus_fresh`, while still being absent from `taxonomy-seed.v2.json` as a curated descriptor.

The second absent target, `ylang ylang -> ylang_ylang`, remains lower confidence for immediate seed promotion because Phase 19 found `ylang_ylang` absent from seed v1, seed v2, compiled v1 and compiled v2. It is currently preserved only by the legacy alias exception mechanism. Phase 20 therefore treats it as an interim `accepted_exception` unless the user explicitly authorizes stronger curation.

## Inherited Findings From Phase 19

| Case | Phase 19 Finding | Phase 20 Context Position |
|---|---|---|
| `petit grain -> petitgrain` | Target absent from seed v2, present in compiled v2 as `source: "corpus"`, `status: "candidate"`, freq 52, subfamily `citrus_fresh` | Primary microcuration candidate for `add_target` |
| `ylang ylang -> ylang_ylang` | Target absent from seed v1, seed v2, compiled v1 and compiled v2; preserved by legacy exception | Preserve as interim `accepted_exception` unless explicitly re-approved |

## Initial Recommended Execution

The recommended Phase 20 execution scope is:

```yaml
execution_option: 1
label: Petitgrain add_target only
intended_data_change_if_approved:
  - add descriptor: petitgrain
  - target seed: data/taxonomy/taxonomy-seed.v2.json
  - family: citrus
  - subfamily: citrus_fresh
ylang_policy: accepted_exception_interim
compiled_v2_publication: not_authorized_without_explicit_plan
```

This recommendation is not an approval. It is a context position to be converted into an executable plan only after explicit user approval, allowlist, rollback and validation artifacts exist.

## Decisions Carried Forward

| ID | Decision | Status |
|---|---|---|
| curation20-D-01 | Phase 20 started in `context_gathering` and remains `not_ready_for_execution`. | Active |
| curation20-D-02 | Option 1 is approved for planning: add `petitgrain` as a curated seed v2 descriptor only in a future execution plan. | Planning approved, execution not authorized |
| curation20-D-03 | `ylang ylang -> ylang_ylang` remains an interim `accepted_exception`. | Active until explicit approval changes it |
| curation20-D-04 | No compiled v2 publication is authorized without a future explicit plan. | Active |
| curation20-D-05 | `data/compiled/v1`, `data/inference`, `src/cli/parse_args.ts`, `scripts/check-safety-guards.sh`, `src/package.json`, and `graphify-out/*` remain out of scope. | Active |
| curation20-D-06 | No compile, smoke, typecheck, tests or build may run during `context_gathering`. | Active |

## Canonical References

| Reference | Context Use |
|---|---|
| `19-CLOSURE.md` | Confirms Phase 19 was planning-only and deferred actual curation to Phase 20+ with allowlist, approval, rollback and validation. |
| `19-RESEARCH.md` | Establishes the evidence split between `petitgrain` as corpus candidate and `ylang_ylang` as orphan target. |
| `19-PATTERNS.md` | Defines `add_target`, `accepted_exception`, protected diff and rollback patterns. |
| `19-VALIDATION.md` | Carries forward the requirement that execution remains blocked pending explicit approval. |
| `19-01-PLAN.md` | Recommends future `add_target` for `petitgrain` and interim exception for `ylang_ylang`. |
| `scripts/check-safety-guards.sh` | Confirms protected path guard is non-mutating and checks staged/dirty protected paths. |
| `src/package.json` | Confirms available scripts include `safety:guard`, `build`, `typecheck`, `compile`, `compile:quality`, and `test`; none are executed during context gathering. |

## Planning Artifacts

These artifacts were created after the user approved Option 1 for planning only:

| Artifact | Reason Deferred |
|---|---|
| `20-RESEARCH.md` | Research for Option 1 microcuration planning. |
| `20-PATTERNS.md` | Pattern map for approval, seed-only mutation, rollback and validation. |
| `20-VALIDATION.md` | Validation strategy for future execution gates. |
| `20-01-PLAN.md` | Executable future plan with blocking approval gate; does not authorize mutation by itself. |

## Current Readiness

Phase 20 is planned but not ready for execution. The next gate is explicit execution approval and creation of `20-FINAL-APPROVAL.md`; until then, no data mutation is authorized.
