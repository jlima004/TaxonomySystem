# Phase 10: Taxonomy Seed v2 Expansion Round 3 - Research

**Researched:** 2026-05-23  
**Domain:** Manual olfactory taxonomy v2 candidate expansion, workbook traceability, versioned JSON curation inputs, temporary v1-vs-v2 comparison validation.  
**Confidence:** HIGH for project constraints and planning shape; HIGH for Phase 10 scope from context; MEDIUM for exact future candidate approval outcomes because approval must occur in the workbook.

<user_constraints>
## User Constraints (from 10-CONTEXT.md)

### Locked Decisions

Phase 10 is a third curated expansion round for `taxonomy-seed.v2.json`, using post-Phase 09 v2-expanded as the baseline. Phase 10 focuses on `amber_resinous`, `animalic`, and conditional `fresh_spice` review while keeping v2 candidate-only. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

Hard constraints: v2 remains candidate seed only; `taxonomy-seed.v1.json`, `data/compiled/v1/`, `DEFAULT_PATHS`, `curated_relations.v1.json`, and `accord_map.v1.json` must not be altered; corpus/review_queue/frequency/generic pressure must not be auto-promoted; aliases/relations/accords require approval/rationale/evidence persisted in the workbook; chat approval is insufficient; no official `data/compiled/v2` sidecar artifact is created by default. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

R3-D-01 through R3-D-05: Round 3 focuses on `amber_resinous`, `animalic`, and conditional `fresh_spice`; `amber_resinous` and `animalic` are real promotion scopes; `fresh_spice` may be created only if a concrete descriptor such as `anise` is approved; extra gourmand review and `ylang ylang -> ylang_ylang` cleanup remain deferred unless later explicit decisions open them. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

R3-D-06 through R3-D-12: `amber_resinous` uses candidate subfamilies `amber` and `balsamic_resin`; `amber` is reviewed as a descriptor in `amber`; `resinous`, `labdanum`, `benzoin`, and `balsamic` are reviewed for `balsamic_resin`; `balsamic` and `resinous` need genericity caution; no amber/resinous subfamily may be created empty; relations/accords involving `amber`, `balsamic_resin`, `vanilla`, `woody_dry`, and `warm_spice` need their own approval. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

R3-D-13 through R3-D-20: `animalic` uses candidate subfamilies `musky` and `leathery`; `musk`, `musky`, and `ambrette` are reviewed for `musky`; `leathery` is reviewed for `leathery`; `animal` defaults to broad support signal; `civet` is sensitive/ambiguous and needs explicit approval; `musk` vs `musky` requires canonical/alias decision; relations/accords involving `musky`, `leathery`, `floral_rose`, `woody_dry`, `amber`, `balsamic_resin`, and `vanilla` require their own approval. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

R3-D-21 through R3-D-27: `fresh_spice` is conditional; it is created only if a concrete descriptor is approved; `anise` is the primary candidate; `anisic` is review/defer by default; `minty` and `wintergreen` are out of scope unless a later explicit decision changes that; if `anise` is not approved, `fresh_spice` remains absent/deferred; relations/accords involving `fresh_spice` require that the endpoint exists in `taxonomy-seed.v2.json`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

R3-D-28 through R3-D-33: Alias cleanup is targeted only to Round 3 scope; investigate `musk`/`musky`, `leather`/`leathery` if present, `ambery` if present, and direct amber/resinous variants if evidence is clear; `ylang ylang -> ylang_ylang`, broad floral/exotic-floral cleanup, unrelated aliases, and aliases without a clear v2 canonical target are out of scope; no new alias without `manual_approval: approved`, `primary_disposition: add_alias`, clear canonical target, rationale, and evidence; alias candidates/frequency/string similarity remain support only; no legacy alias is removed or remapped automatically. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

R3-D-34 through R3-D-40: Phase 10 uses approved-or-gap policy; every new subfamily needs an approved relation/accord or explicit gap; scores are manual in [0,1] with rationale/evidence; corpus/co-occurrence/review_queue are support only; no placeholder `score: 0`; missing remains neutral/undefined; endpoints must exist in `taxonomy-seed.v2.json`; prioritize internal family relations and a small number of high-confidence cross-family accords; `fresh_spice` receives relation/accord only if created with an approved descriptor. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

R3-D-41 through R3-D-47: Maintain Phase 9 hard/soft gates; add Round 3 metrics for `amber_resinous`, `animalic`, `fresh_spice`, targeted alias cleanup, and approved-or-gap traceability; every new Round 3 subfamily needs approved relation/accord or explicit gap; any seed/alias/relation/accord change without workbook approval or gap is hard failure; empty `fresh_spice` or relation/accord with nonexistent endpoint is hard failure; new alias without approved `add_alias` is hard failure; promotion readiness remains future criteria only. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

R3-D-48 through R3-D-52: Phase 10 does not promote v2 to default, does not alter `DEFAULT_PATHS`, `data/compiled/v1`, or official v1 artifacts, and may update promotion readiness criteria only as future documentation; any default switch requires a separate future phase with explicit human approval, migration plan, and rollback plan; expected outcome is v2-round-3 expanded candidate, not default. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### the agent's Discretion

No separate “agent discretion” section exists in `10-CONTEXT.md`; planning discretion is limited to structuring the four requested future plans and choosing validation/reporting mechanics that satisfy the locked decisions. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)

Deferred/out-of-scope items include additional gourmand review except support evidence/defer notes, `ylang ylang -> ylang_ylang` cleanup, broad floral/exotic-floral alias cleanup, aliases unrelated to Round 3 scope, `minty` and `wintergreen` for `fresh_spice`, default switching, executable migration/rollback plans, official v2 publication, changing `src/cli/parse_args.ts` to v2, altering `data/compiled/v1`, and removing/replacing v1. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EXP3-01 | Expansion scope: decide whether Round 3 includes `amber_resinous`, `animalic`, and `fresh_spice`, or a subset; decide whether additional gourmand review is deferred. | Plan 10-01 must append Round 3 workbook scope for `amber_resinous`, `animalic`, conditional `fresh_spice`, and explicit gourmand defers. [CITED: .planning/REQUIREMENTS.md] |
| EXP3-02 | Amber/resinous curation: discuss `amber`, `balsamic_resin`, `amber`, `resinous`, `labdanum`, `benzoin`, `balsamic`, and generic/duplication risk. | Plan 10-02 must apply only approved `r3-approval-*` seed entries and must defer/support generic `resinous`/`balsamic` unless rationale resolves the risk. [CITED: .planning/REQUIREMENTS.md] |
| EXP3-03 | Animalic curation: discuss `musky`, `leathery`, `musk` vs `musky`, `animal`, `ambrette`, and `civet`. | Plan 10-02 must require canonical/alias decision for `musk`/`musky`, treat `animal` as support by default, and require explicit approval for `civet`. [CITED: .planning/REQUIREMENTS.md] |
| EXP3-04 | Fresh spice gap: decide whether `fresh_spice` remains deferred or receives concrete coverage such as `anise`; review `anisic`. | Plan 10-02 must create `fresh_spice` only if `anise` or another concrete descriptor is approved; otherwise register `r3-defer-*` gap. [CITED: .planning/REQUIREMENTS.md] |
| EXP3-05 | Manual approval and workbook policy: preserve Phase 8/9 workflow, reuse `candidate-review.md`, and define Round 3 IDs. | Plan 10-01 is the blocking workbook setup/checkpoint plan and must use `r3-approval-*`, `r3-relation-*`, `r3-accord-*`, `r3-alias-cleanup-*`, and `r3-defer-*`. [CITED: .planning/REQUIREMENTS.md] |
| EXP3-06 | Alias cleanup policy: handle `musk`/`musky`, possible new aliases, and legacy `ylang ylang -> ylang_ylang` without automatic changes. | Plan 10-02 must add approved aliases only with `primary_disposition: add_alias`; legacy ylang remains soft/deferred and must not create false approval. [CITED: .planning/REQUIREMENTS.md] |
| EXP3-07 | Relation/accord expansion: require relation/accord records or explicit gaps with manual scores in [0,1], no `score: 0`, existing endpoints only. | Plan 10-03 must apply approved `r3-relation-*` and `r3-accord-*` records or write approved gaps for each new subfamily. [CITED: .planning/REQUIREMENTS.md] |
| EXP3-08 | Validation gates and promotion boundaries: define v1-vs-v2-round-3 comparison metrics, preserve hard/soft gates, and confirm no v2 promotion or `DEFAULT_PATHS` changes. | Plan 10-04 must compile to `/tmp/opencode/taxonomy-phase10-comparison/*`, produce a comparison report, run hard/soft validation gates, and verify protected files unchanged. [CITED: .planning/REQUIREMENTS.md] |
</phase_requirements>

## Summary

Phase 10 should be planned as a curated data-input expansion, not a code or artifact promotion phase. The project’s current active state says Phase 10 has context captured, no executable plans, and no authorized implementation artifacts; future planning must preserve the v2 candidate-only boundary and use Phase 09 as baseline. [CITED: .planning/STATE.md]

Research supports exactly four future plans: **10-01 workbook setup/checkpoint**, **10-02 seed + targeted alias curation**, **10-03 relations/accords approved-or-gap**, and **10-04 validation + comparison report**. This four-plan split mirrors Phase 9’s successful structure while updating scope, IDs, and temporary output directories for Round 3. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-01-PLAN.md] [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md]

**Primary recommendation:** Plan Phase 10 as workbook-first gated curation: no JSON mutation until `candidate-review.md` contains Round 3 persisted approvals/gaps, then apply only those entries, then validate only through temporary comparison outputs under `/tmp/opencode/taxonomy-phase10-comparison/`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

## Project Constraints (from AGENTS.md)

No `AGENTS.md` file exists at repository root, so there are no additional project-level agent directives from that file. [VERIFIED: codebase read]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Workbook / approval ledger | Planning/curation ledger: `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md` | Future data edit plans | Approval state lives in the workbook; chat/transcript approval is insufficient. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| v2 seed inputs | Versioned taxonomy input: `data/taxonomy/taxonomy-seed.v2.json` | Curation tests | Phase 10 may expand v2 candidate seed only from approved workbook entries; v1 seed remains protected. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| v2 alias inputs | Versioned alias input: `data/taxonomy/descriptor_aliases.seed.json` | Alias target validation | New aliases require approved `add_alias` blocks and clear v2 canonical targets; legacy aliases must not be auto-removed/remapped. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| v2 relation inputs | Versioned inference input: `data/inference/curated_relations.v2.json` | Workbook gap ledger | New subfamilies require approved relation records or explicit relation gaps; endpoint existence is mandatory. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| v2 accord inputs | Versioned inference input: `data/inference/accord_map.v2.json` | Workbook gap ledger | Accord scores are manual in [0,1], missing remains neutral/undefined, and no `score: 0` placeholders are allowed. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| Temporary comparison outputs | Sandbox filesystem under `/tmp/opencode/taxonomy-phase10-comparison/` | Report artifact under Phase 10 planning/curation directory | Phase 10 may generate comparison outputs under `/tmp/opencode/...` but must not create official `data/compiled/v2` by default. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| Protected artifacts | Existing v1/default inputs and compiled outputs | Git diff checks | `taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json`, `data/compiled/v1/`, and `src/cli/parse_args.ts` must remain unchanged. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |

## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| Node.js | Not probed during this research due no execution/build/test constraint | Run the TypeScript taxonomy builder CLI and Vitest tests | Project stack is Node.js + TypeScript with ESM modules. [CITED: .planning/PROJECT.md] |
| TypeScript | `^5.8.0` in `src/package.json` | Strict static typing for compiler, loaders, inference, CLI, and tests | Project requires TypeScript strict and pure-function style. [CITED: src/package.json] [CITED: .planning/PROJECT.md] |
| Vitest | `^3.2.0` in `src/package.json` | Curation and compiler validation tests | Existing curation tests enforce seed, alias, relation/accord, and comparison guards. [CITED: src/package.json] [CITED: src/tests/curation/taxonomy_seed_v2.test.ts] |

### Supporting

| Library/Tool | Version | Purpose | When to Use |
|--------------|---------|---------|-------------|
| Built-in Node `fs`, `path`, `os` modules | Node built-ins | Test fixtures, file reads, temporary directories | Existing tests use built-ins; no runtime package additions are needed. [CITED: src/tests/curation/v1_v2_comparison.test.ts] |
| npm scripts | `build`, `typecheck`, `compile`, `compile:quality`, `test` | Build/compile/test entry points | Planner may reference these as future validation commands, but research did not run them. [CITED: src/package.json] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing workbook + JSON inputs | New curation database/tool | Not recommended; Phase 10 decisions require persisted workbook approvals and project remains zero-runtime-dependency. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] [CITED: .planning/PROJECT.md] |
| Temporary `/tmp/opencode/...` comparison outputs | Official `data/compiled/v2` artifact | Not allowed by default; official v2 sidecar is out of scope. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |

**Installation:** No package installation is planned or recommended for Phase 10. [CITED: .planning/PROJECT.md]

## Package Legitimacy Audit

No external packages are recommended for installation in Phase 10; package legitimacy gate is not applicable. [CITED: .planning/PROJECT.md]

## Existing Patterns from Phase 8/9 Planning

| Pattern | Evidence | Phase 10 Planning Application |
|---------|----------|-------------------------------|
| Workbook-first curation | Phase 8 workbook states all entries stay pending until a human edits workbook with entry-specific approval, rationale, and evidence. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md] | Plan 10-01 must append Round 3 proposals and include a blocking human checkpoint before any data edit plan. |
| Approval IDs by round | Phase 9 used `r2-approval-*`, `r2-relation-*`, `r2-accord-*`, `r2-alias-cleanup-*`, and defers/gaps. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-01-PLAN.md] | Phase 10 must use `r3-approval-*`, `r3-relation-*`, `r3-accord-*`, `r3-alias-cleanup-*`, and `r3-defer-*`. |
| Seed/alias plan after checkpoint | Phase 9 Plan 09-02 reads workbook and applies only complete approved seed/alias entries. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-02-PLAN.md] | Plan 10-02 should ignore pending/incomplete entries and preserve aliases unless approved `add_alias` exists. |
| Relation/accord plan after seed endpoints exist | Phase 9 Plan 09-03 conditionally applies only approved relation/accord entries with v2 endpoints. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-03-PLAN.md] | Plan 10-03 should run after 10-02 and enforce approved-or-gap per new subfamily. |
| Temporary comparison report | Phase 9 Plan 09-04 compiles v1/v2 into `/tmp/opencode/taxonomy-phase9-comparison/*` and writes a report. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md] | Plan 10-04 should use `/tmp/opencode/taxonomy-phase10-comparison/v1-baseline` and `/tmp/opencode/taxonomy-phase10-comparison/v2-candidate`. |
| Protected file diff check | Phase 9 Plan 09-04 checks `data/compiled/v1`, v1 inputs, and `src/cli/parse_args.ts` for empty diff. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md] | Plan 10-04 must include the same protected file verification. |

## Round 3 Candidate Scope

### `amber_resinous`

Use candidate subfamilies `amber` and `balsamic_resin`. Review `amber` as a descriptor inside `amber`; review `resinous`, `labdanum`, `benzoin`, and `balsamic` for `balsamic_resin`. Treat `resinous` and `balsamic` as genericity-risk candidates that may remain defer/support if no consensus exists. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

Planning implication: 10-01 should propose separate `r3-approval-*` blocks for each candidate; 10-02 must not create an empty `amber` or `balsamic_resin` subfamily; 10-03 must only connect `amber`/`balsamic_resin` if those endpoints exist. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### `animalic`

Use candidate subfamilies `musky` and `leathery`. Review `musk`, `musky`, and `ambrette` for `musky`; review `leathery` for `leathery`; treat `animal` as broad support by default; treat `civet` as sensitive/ambiguous requiring explicit approval. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

Planning implication: 10-01 must surface a canonical/alias decision for `musk` vs `musky`; 10-02 must avoid duplicate descriptors; 10-02 may add `leather -> leathery` only if a clear approved alias exists and `leathery` exists as a canonical v2 descriptor. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### Conditional `fresh_spice`

Create `fresh_spice` only if a concrete descriptor such as `anise` is approved; `anisic` is review/defer by default; `minty` and `wintergreen` are out of scope for this round. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

Planning implication: 10-02 must not write `fresh_spice` as an empty scaffold; 10-03 must skip or gap `fresh_spice` relations/accords unless the endpoint exists after 10-02. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

## Approval and Traceability Model

| ID Family | Applies To | Required Fields | Planner Gate |
|-----------|------------|-----------------|--------------|
| `r3-approval-*` | Seed descriptors/families/subfamilies | `round: phase_10_round_3`, `manual_approval: approved`, `primary_disposition: promote_to_seed`, concrete `family_id`, `subfamily_id`, `descriptor_id`, rationale, evidence | Required before 10-02 edits `taxonomy-seed.v2.json`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| `r3-relation-*` | Curated relation records | Existing endpoints, manual score in [0,1], approval, rationale/evidence | Required before 10-03 edits `curated_relations.v2.json`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| `r3-accord-*` | Accord map records | Existing endpoints, manual score in [0,1], approval, rationale/evidence | Required before 10-03 edits `accord_map.v2.json`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| `r3-alias-cleanup-*` | Targeted alias investigations/defers | Alias source/target, disposition, rationale/evidence | Required to document `musk`/`musky`, `leather`/`leathery`, `ambery`, and ylang deferral without automatic alias mutation. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| `r3-defer-*` | Deferred descriptors/groups/generic candidates | Candidate, reason, evidence/support status, `promotion_effect: none` | Required for broad/generic/out-of-scope candidates such as extra gourmand, `animal`, `anisic`, `minty`, `wintergreen`, unresolved `balsamic`/`resinous`, or absent `fresh_spice`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |

**False-positive approval guard:** Phase 8/9 approvals must not be interpreted as Phase 10 approvals. Existing `approval-*` and `r2-*` blocks are prior evidence/traceability only; Phase 10 mutations require Round 3-specific `r3-*` IDs unless the plan is retaining unchanged prior v2 inputs. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md] [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

## Architecture Patterns

### System Architecture Diagram

```text
10-01: candidate-review.md Round 3 section
  -> human checkpoint edits pending entries to approved or gap
  -> 10-02 reads only r3-approval-* / r3-alias-cleanup-* approved add_alias entries
       -> taxonomy-seed.v2.json candidate-only updates
       -> descriptor_aliases.seed.json targeted alias updates only when approved
  -> 10-03 reads v2 seed endpoints + r3-relation-* / r3-accord-* approvals or r3-defer/gap entries
       -> curated_relations.v2.json approved records OR workbook relation gaps
       -> accord_map.v2.json approved records OR workbook accord gaps
  -> 10-04 compiles explicit v1/v2 paths to /tmp/opencode/taxonomy-phase10-comparison/
       -> comparison report + hard/soft gates
       -> protected file diff checks
```

### Recommended Project Structure

```text
.planning/phases/10-taxonomy-seed-v2-expansion-round-3/
├── 10-RESEARCH.md                 # this research
├── 10-01-PLAN.md                  # workbook setup/checkpoint
├── 10-02-PLAN.md                  # seed + targeted alias curation
├── 10-03-PLAN.md                  # relations/accords approved-or-gap
├── 10-04-PLAN.md                  # validation + comparison report
└── curation/
    └── v1-v2-round-3-comparison.md # future report from Plan 10-04

.planning/phases/08-taxonomy-seed-expansion-curation/curation/
└── candidate-review.md             # canonical workbook reused by Phase 10
```

### Pattern 1: Workbook Blocking Checkpoint

**What:** Append pending proposals, then stop for human edits to make approvals/gaps explicit. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-01-PLAN.md]  
**When to use:** Before any seed, alias, relation, or accord data edit in Phase 10. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]  
**Planning note:** The verification for 10-01 should look specifically for `r3-approval-*`, `round: phase_10_round_3`, `manual_approval: approved`, and expected disposition strings; do not accept `approval-001` or `r2-*` as approval for Round 3. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md]

### Pattern 2: Approved-Or-Gap Relation/Accord Handling

**What:** Every new subfamily gets an approved relation/accord record or a persisted gap; missing data remains neutral/undefined and never `score: 0`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]  
**When to use:** Plan 10-03 after seed endpoints are known. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-03-PLAN.md]

### Pattern 3: Temporary Explicit-Path Comparison

**What:** Compile v1 and v2 explicitly to temporary directories and compare metrics without mutating official outputs. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md]  
**When to use:** Plan 10-04 validation/reporting. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### Anti-Patterns to Avoid

- **False-positive checkpoint approval:** Do not treat Phase 8 `approval-001` or Phase 9 `r2-*` approvals as authorizing Phase 10 changes. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md]
- **Empty subfamily scaffolds:** Do not create `fresh_spice`, `amber`, `balsamic_resin`, `musky`, or `leathery` without an approved concrete descriptor or explicit context-allowed gap handling. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- **Endpoint-before-seed relation:** Do not add relation/accord records whose endpoints are absent from `taxonomy-seed.v2.json`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- **Default drift:** Do not alter `DEFAULT_PATHS` or official v1 compiled outputs. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- **Corpus autopromotion:** Do not promote review_queue/frequency/generic pressure into seed truth without workbook approval. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Approval tracking | New ad hoc approval parser or chat-based approval state | Existing `candidate-review.md` workbook | The canonical policy requires persisted workbook approval with rationale/evidence. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| Candidate promotion | Script that copies review_queue candidates into seed | Manual `r3-approval-*` entries | Corpus/review_queue/frequency are support only and must not auto-promote. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| Relation/accord scoring | Heuristic or corpus-derived score generation | Manual workbook-approved score in [0,1] | Scores must be manual and missing must remain neutral/undefined. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| v2 publication | Official `data/compiled/v2` artifact | `/tmp/opencode/taxonomy-phase10-comparison/v2-candidate` | No official v2 sidecar artifact is created by default. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |

**Key insight:** Phase 10 complexity is traceability, not algorithms; the safest plan is to reuse project curation surfaces and guards instead of adding new automation. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md]

## Common Pitfalls

### Pitfall 1: False-Positive Checkpoint Approval
**What goes wrong:** Plan 10-02 or 10-03 sees existing approved Phase 8/9 blocks and proceeds as if Round 3 is approved. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md]  
**Why it happens:** The canonical workbook contains historical approvals and Round 2 approvals with `manual_approval: approved`. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md]  
**How to avoid:** Require `round: phase_10_round_3` and `r3-*` prefixes for every Phase 10 mutation. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]  
**Warning signs:** Verification grep/regex accepts `approval-001` or `r2-approval-*` instead of `r3-approval-*`. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-01-PLAN.md]

### Pitfall 2: Empty `fresh_spice`
**What goes wrong:** A planner creates `fresh_spice` because it is named in candidate scope even when `anise` is not approved. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]  
**How to avoid:** Make `fresh_spice` creation conditional in 10-02 and make `fresh_spice` relations conditional in 10-03. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### Pitfall 3: Generic Descriptor Leakage
**What goes wrong:** `animal`, `resinous`, or `balsamic` becomes a descriptor merely because it has evidence or is semantically adjacent. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]  
**How to avoid:** Treat genericity as a required review note and defer if rationale does not resolve it. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### Pitfall 4: Alias Cleanup Scope Creep
**What goes wrong:** Planner fixes `ylang ylang -> ylang_ylang` or broad floral aliases during Round 3. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]  
**How to avoid:** Register `r3-alias-cleanup-*` defer for ylang and limit alias changes to Round 3 targeted scope. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

## Code Examples

Verified planning command patterns for future plans only; these were not executed during research. Concrete compile commands are intentionally kept only in `10-04-PLAN.md`, where the `--out` arguments point to `/tmp/opencode/taxonomy-phase10-comparison/...`. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md]

### Temporary Phase 10 comparison compile targets

- v1 baseline output: `/tmp/opencode/taxonomy-phase10-comparison/v1-baseline`
- v2 candidate output: `/tmp/opencode/taxonomy-phase10-comparison/v2-candidate`
- Required command location: `10-04-PLAN.md` only.

### Protected file check pattern

```bash
git diff --exit-code \
  data/compiled/v1 \
  data/taxonomy/taxonomy-seed.v1.json \
  data/inference/curated_relations.v1.json \
  data/inference/accord_map.v1.json \
  src/cli/parse_args.ts
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Minimal v1 seed only | Candidate-only v2 seed expansion through workbook approvals | Phase 8 onward | Planning must distinguish candidate v2 from default v1. [CITED: .planning/ROADMAP.md] |
| Phase 8 single initial gourmand expansion | Phase 9 added green/fruity/spicy, and Phase 10 targets amber/resinous + animalic + conditional fresh spice | Phase 9/10 | Planning must account for carried-forward gaps and avoid re-opening out-of-scope groups. [CITED: .planning/ROADMAP.md] |
| Missing relation/accord as empty graph/gap | Approved-or-gap policy per new subfamily | Phase 9/10 | Every new Round 3 subfamily needs approved relation/accord or explicit gap. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |

**Deprecated/outdated:** Treating v2 expansion as promotion is explicitly out of scope; future default switch requires a separate phase with human approval, migration plan, and rollback plan. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Plan 10-04 report path should be `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md`, matching the Phase 10 planning prompt. [RESOLVED] | Architecture Patterns | Low risk: the generated plan and validation contract use the canonical filename. |

## Open Questions (RESOLVED)

1. **Which candidate entries will the human curator approve in 10-01?**
   - What we know: Scope and rules are locked. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
   - What's unclear: Actual approvals/gaps are not yet persisted for Round 3.
   - RESOLVED: This is intentionally deferred to the blocking 10-01 workbook checkpoint. 10-02 and 10-03 are conditional on complete persisted `r3-*` approved blocks and ignore pending/incomplete entries.

2. **Will `fresh_spice` exist after 10-02?**
   - What we know: It exists only if a concrete descriptor such as `anise` is approved. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
   - What's unclear: Whether `anise` will be approved.
   - RESOLVED: 10-02 creates `fresh_spice` only with approved `anise` or another concrete descriptor, 10-03 applies fresh_spice relations/accords only if the endpoint exists, and 10-04 documents either created or absent/deferred status.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Future compile/test commands | Not probed during research | — | Planner can add preflight version check before execution. |
| npm | Future npm scripts | Not probed during research | — | Planner can add preflight version check before execution. |
| TypeScript | Future typecheck/build | Declared in package | `^5.8.0` | Use existing project devDependency. [CITED: src/package.json] |
| Vitest | Future curation validation | Declared in package | `^3.2.0` | Use existing project devDependency. [CITED: src/package.json] |

**Missing dependencies with no fallback:** None identified from research; execution-time availability was intentionally not probed because the user prohibited tests, build, compile, and data generation. [CITED: user objective]

**Missing dependencies with fallback:** Node/npm availability should be checked by the future execution plan before running validation. [ASSUMED]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `^3.2.0` [CITED: src/package.json] |
| Config file | No config file read for this research; package scripts call `vitest run`. [CITED: src/package.json] |
| Quick run command | Future execution only: `cd src && npm test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/alias_seed_v2.test.ts` [CITED: src/package.json] |
| Full suite command | Future execution only: `cd src && npm test -- tests/curation/` [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md] |

### Phase Requirements → Test/Validation Map

| Req ID | Behavior | Test/Validation Type | Automated Command / Check | File Exists? |
|--------|----------|----------------------|----------------------------|--------------|
| EXP3-01 | Scope limited to amber/resinous, animalic, conditional fresh_spice | Workbook source assertion | grep/check Round 3 section for scope and defers | ✅ workbook exists [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md] |
| EXP3-02 | Amber/resinous approved entries only | Curation unit | `cd src && npm test -- tests/curation/taxonomy_seed_v2.test.ts` | ✅ [CITED: src/tests/curation/taxonomy_seed_v2.test.ts] |
| EXP3-03 | Animalic canonical/alias safety | Curation unit | `cd src && npm test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/alias_seed_v2.test.ts` | ✅ [CITED: src/tests/curation/alias_seed_v2.test.ts] |
| EXP3-04 | `fresh_spice` conditional and not empty | Source assertion + curation unit | Check seed JSON and workbook `r3-defer-*`/approval state | ✅ existing seed test can be updated if needed [CITED: src/tests/curation/taxonomy_seed_v2.test.ts] |
| EXP3-05 | Round 3 workbook policy and IDs | Workbook gate | check `r3-approval-*`, `r3-relation-*`, `r3-accord-*`, `r3-alias-cleanup-*`, `r3-defer-*` | ✅ workbook exists [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md] |
| EXP3-06 | Alias cleanup approved only | Curation unit | `cd src && npm test -- tests/curation/alias_seed_v2.test.ts` | ✅ [CITED: src/tests/curation/alias_seed_v2.test.ts] |
| EXP3-07 | Relation/accord approved-or-gap | Curation unit | `cd src && npm test -- tests/curation/relation_accord_v2.test.ts` | ✅ [CITED: src/tests/curation/relation_accord_v2.test.ts] |
| EXP3-08 | Comparison, default/protected artifact gates | Integration/report | compile explicit paths to `/tmp/opencode/taxonomy-phase10-comparison/*`; then `git diff --exit-code ...` | ✅ pattern exists in Phase 9 plan/test [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md] |

### Hard Gates for Plan 10-04

- Schema invalid. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- Nondeterminism. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- Hard/pattern excludes. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- Alias contamination or new alias without approved `add_alias`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- Auto-promotion from corpus/review_queue/frequency/generic pressure. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- Default drift or protected artifact mutation. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- Curated change without workbook traceability. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- Empty `fresh_spice` or relation/accord with nonexistent endpoint. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### Soft Gates and Metrics for Plan 10-04

Soft gates: zero-frequency seeds, sparse graph/density drop, high review_queue, deferred gaps, ambiguous candidates, and legacy alias target absent. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

Mandatory metrics: coverage counts, amber/resinous coverage, animalic coverage, fresh spice status, approved-or-gap traceability, graph coverage, generic pressure, review queue quality, targeted alias cleanup quality, zero-frequency seeds, determinism/schema/defaults, and curation traceability. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

### Sampling Rate

- **Per task commit:** Future plan should run the smallest relevant curation test or source assertion after each mutation. [ASSUMED]
- **Per wave merge:** Future plan should run `cd src && npm test -- tests/curation/`. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md]
- **Phase gate:** Full curation suite green, temporary comparison report complete, and protected file diff clean before verification. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md]

### Wave 0 Gaps

- [ ] Existing tests parse `approval-*` and `r2-approval-*`; planner may need a Wave 0 test update to require/recognize `r3-approval-*` for Phase 10 traceability. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts]
- [ ] Existing alias test currently expects zero approved alias entries; if Phase 10 approves targeted aliases, planner must update test expectations to include approved `r3` alias blocks rather than blocking valid additions. [CITED: src/tests/curation/alias_seed_v2.test.ts]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No runtime auth surface in Phase 10; it is local curation data/planning. [CITED: .planning/PROJECT.md] |
| V3 Session Management | no | No sessions involved. [CITED: .planning/PROJECT.md] |
| V4 Access Control | yes | Workbook approval gating and protected file diff checks act as local authorization controls for data mutations. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| V5 Input Validation | yes | Existing seed/alias/relation validators and curation tests validate JSON input structure and endpoints. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts] [CITED: src/tests/curation/relation_accord_v2.test.ts] |
| V6 Cryptography | no | No cryptographic operations are in Phase 10 scope. [CITED: .planning/PROJECT.md] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unauthorized data mutation from stale approvals | Tampering | Require `r3-*` IDs and persisted workbook approval before mutation. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md] |
| Repudiation of curation decisions | Repudiation | Store rationale/evidence in `candidate-review.md` and include traceability in report. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md] |
| Default/path drift | Tampering | Explicit protected file diff check for v1/default files. [CITED: .planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md` — authoritative R3-D-01 through R3-D-52 decisions.
- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-PREFLIGHT.md` — execution boundary and readiness.
- `.planning/REQUIREMENTS.md` — EXP3-01 through EXP3-08.
- `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/PROJECT.md` — current state, project constraints, and stack.
- `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-01-PLAN.md` through `09-04-PLAN.md` — nearest planning analogs.
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md` — canonical workbook and historical approvals.
- `src/package.json` and `src/tests/curation/*.ts` — validation architecture and existing curation guards.

### Secondary (MEDIUM confidence)

- None used.

### Tertiary (LOW confidence)

- No external WebSearch/training-derived taxonomy claims were used for planning recommendations.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — directly read from project files. [CITED: src/package.json]
- Architecture: HIGH — directly constrained by Phase 10 context and Phase 9 analog plans. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]
- Pitfalls: HIGH — derived from explicit hard gates and prior workbook structure. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md]
- Approval outcomes: MEDIUM — planning rules are locked, but future human approvals are not yet known. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md]

**Research date:** 2026-05-23  
**Valid until:** 2026-06-22, unless Phase 10 context/workbook decisions change sooner.
