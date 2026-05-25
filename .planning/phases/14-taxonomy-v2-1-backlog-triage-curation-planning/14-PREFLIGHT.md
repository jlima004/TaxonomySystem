---
status: context_gathering
executable: false
plans: 0
implementation: none_authorized
execution_readiness: not_ready_for_execution
allowed_next_step: continue_context_gathering
---

# Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning - Preflight

## Status

Phase 14 has been opened for context gathering only. No executable plan exists yet, and no implementation, curation, data mutation, compiled artifact write or generated artifact regeneration is authorized.

## Execution Boundary

- Context gathering is authorized.
- Discussion-log and preflight tracking are authorized.
- No taxonomy curation is authorized.
- No descriptor promotion is authorized.
- No alias addition, removal or remapping is authorized.
- No relation or accord addition, removal or score change is authorized.
- No official compiled artifact regeneration is authorized.
- No code changes are authorized.
- `data/taxonomy/taxonomy-seed.v2.json` must not be edited.
- `data/inference/curated_relations.v2.json` must not be edited.
- `data/inference/accord_map.v2.json` must not be edited.
- `data/taxonomy/descriptor_aliases.seed.json` must not be edited.
- `data/compiled/v1` must not be edited, overwritten or removed.
- `data/compiled/v2` must not be edited, overwritten or removed.
- `src/cli/parse_args.ts` must not be edited.
- `graphify-out/*` must not be edited, regenerated, cleaned, reverted, staged or committed.

## Required Baseline

Phase 14 starts from Phase 13 closure:

- taxonomy seed v2 is the default;
- official `data/compiled/v2/` artifacts are present;
- `data/compiled/v1/` remains preserved as baseline/archive;
- explicit v1 fallback was validated;
- Phase 11 accepted soft findings remain accepted with policy unless future context explicitly reprioritizes them;
- Phase 13 closed without active blockers.

## Discussion Scope

Context gathering may discuss:

1. Review queue reduction.
2. Soft findings disposition / cleanup.
3. Alias cleanup, including `ylang ylang -> ylang_ylang`.
4. Graph density / graph coverage improvements.
5. Future curation candidates / descriptor promotions.
6. Relations/accords quality improvements.
7. Docs/help cleanup that is non-blocking.
8. Graphify / generated artifact lifecycle policy.
9. CI/release process automation improvements.

Discussion does not equal approval to execute any of these areas.

## Files Created At Opening

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-DISCUSSION-LOG.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-PREFLIGHT.md`

## Files Not Created Yet

- `14-CONTEXT.md`
- `14-RESEARCH.md`
- `14-PATTERNS.md`
- `14-VALIDATION.md`
- `14-01-PLAN.md`

## Readiness Gate

Phase 14 may become ready for planning only after context gathering captures the priority decision, scope boundaries, accepted/deferred backlog areas, protected-file policy and validation expectations in a future `14-CONTEXT.md`.

Until then, Phase 14 remains `context_gathering / not_ready_for_execution`.
