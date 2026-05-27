# Phase 22 Discussion Log — Review Queue Conflict Triage for v2.2

> **Audit trail only.** Do not use as the sole input to planning or execution agents.
> Decisions captured in `22-CONTEXT.md`.

**Date:** 2026-05-27
**Phase:** 22-review-queue-conflict-triage-v2-2
**Status:** context_gathering
**Execution readiness:** not_ready_for_execution

## Preflight Decision: Focus Selection

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Foco primário | Seed corpus conflicts first | Low-support candidates first, Full review queue inventory, Ylang review |

**Rationale (user-adopted):**

The 34 `seed_corpus_conflict` items represent curated seed anchors with overlapping corpus evidence. Analyzing these first establishes the semantic framework needed for evaluating the 282 `corpus_candidate_low_support` items. Conflicts involve 10+ seed anchors (rose, melon, banana, grapefruit, bitter_orange, cedarwood, etc.) — many of which share subfamilies with the highest-pressure low-support groups.

**Alternatives considered and why rejected:**

- **Low-support candidates first:** Volume (282) is too broad for first pass; lacks the anchor-based framework that conflict analysis provides.
- **Full review queue inventory:** 316 items is manageable but Phase 14 already established that full line-by-line classification is not required for first triage and would create analysis paralysis.
- **Ylang review:** `accepted_exception_interim` is a legacy alias issue, not a review queue triage item. Phase 20 and Phase 21 explicitly deferred ylang_ylang. Separating this concern keeps Phase 22 focused on review queue conflict triage per its stated goal.

## Current State Summary

- v2.1.0 released with `petitgrain` in `citrus/citrus_fresh`
- Review queue now at 316 (was 317)
- `seed_corpus_conflict`: 34 items across 11 families/subfamilies
- `corpus_candidate_low_support`: 282 items across 16 subfamilies
- New conflict since Phase 14: `petitgrain ↔ grain` (seed `petitgrain`, corpus `grain`, corpus_count 14)

## Documents Read

- v2.1.0-CLOSURE.md
- 21-CLOSURE.md, 21-TMP-COMPILE-VALIDATION.md
- 20-CLOSURE.md
- 14-REVIEW-QUEUE-TRIAGE.md, 14-BACKLOG-MATRIX.md, 14-CONTEXT.md, 14-DISCUSSION-LOG.md
- data/compiled/v2/* (live inspection)

## Agile Decisions

- Phase 22 operates in `planning_only` / `read_only_triage` mode
- No files outside `.planning/phases/22-*` will be created or modified
- Next step after user approval: detailed analysis of `seed_corpus_conflict` groups

## Deferred Items

- `corpus_candidate_low_support` full triage (secondary, after conflict matrix)
- `ylang ylang -> ylang_ylang` alias resolution (remains `accepted_exception_interim`)
- Any curatorial execution for v2.2
