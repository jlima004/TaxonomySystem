# Phase 22 Preflight — Review Queue Conflict Triage for v2.2

## Status

| field | value |
|---|---|
| phase | `22-review-queue-conflict-triage-v2-2` |
| status | `context_gathering` |
| execution_readiness | `not_ready_for_execution` |
| mode | `planning_only` / `read_only_triage` |
| created | 2026-05-27 |
| source_release | v2.1.0 (closed) |
| target_release | v2.2.0 (planning only, no publication) |

## Focus Decision

**Selected: Seed corpus conflicts first.**

Rationale: The 34 `seed_corpus_conflict` items represent curated seed anchors with overlapping corpus evidence. Analyzing these first establishes the semantic framework needed for evaluating the 282 `corpus_candidate_low_support` items. Conflicts involve 10+ seed anchors (rose, melon, banana, grapefruit, bitter_orange, etc.) — many of which share subfamilies with the highest-pressure low-support groups.

## Base Files Read

- [x] `.planning/releases/v2.1.0-CLOSURE.md`
- [x] `.planning/phases/21-v2-1-compiled-artifact-publication-planning/21-CLOSURE.md`
- [x] `.planning/phases/21-v2-1-compiled-artifact-publication-planning/21-TMP-COMPILE-VALIDATION.md`
- [x] `.planning/phases/20-alias-target-microcuration-execution/20-CLOSURE.md`
- [x] `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CLOSURE.md`
- [x] `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md`
- [x] `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md`
- [x] `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CONTEXT.md`
- [x] `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-DISCUSSION-LOG.md`
- [x] `data/compiled/v2/taxonomy.json` (artifact version 2.1.0)
- [x] `data/compiled/v2/descriptor_aliases.json` (artifact version 2.1.0)
- [x] `data/compiled/v2/similarity_matrix.json` (graph version 1.0.0)

## Current Review Queue State (v2.1.0 compiled)

| metric | value |
|---|---|
| Total review queue items | 316 |
| `corpus_candidate_low_support` | 282 |
| `seed_corpus_conflict` | 34 |
| Severity distribution | 316 medium |

Delta from Phase 14 baseline (317→316, 284→282, 33→34): `petitgrain` add_target removed 1 low-support item from citrus_fresh and exposed 1 new conflict item (`petitgrain↔grain`).

## Compiled V2 Artifacts

| artifact | version | generated_at |
|---|---|---|
| `taxonomy.json` | 2.1.0 | 2026-05-26 |
| `descriptor_aliases.json` | 2.1.0 | 2026-05-26 |
| `similarity_matrix.json` | 1.0.0 (internal) | 2026-05-26 |

## Protected Paths

All paths below are **read-only** during Phase 22 triage. No mutation authorized.

- `data/taxonomy/*`
- `data/inference/*`
- `data/compiled/v1/*`
- `data/compiled/v2/*`
- `src/cli/parse_args.ts`
- `scripts/check-safety-guards.sh`
- `src/package.json`
- `graphify-out/*`

## Explicitly Not Authorized

- Curatorial execution (add, promote, reject, remap)
- Official compile
- Artifact publication
- Graphify run
- Seed, alias, relation, or accord mutation
- Line-by-line reclassification of all 316 items (per Phase 14 precedent)

## Files Created

| file | status |
|---|---|
| `22-PREFLIGHT.md` | created |
| `22-CONTEXT.md` | created |
| `22-DISCUSSION-LOG.md` | created |

## Files Not Created Yet

- `22-RESEARCH.md`
- `22-PATTERNS.md`
- `22-VALIDATION.md`
- `22-01-PLAN.md`
