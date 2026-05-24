# Phase 11: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning - Research

**Researched:** 2026-05-24  
**Domain:** Candidate taxonomy promotion readiness, default migration planning, rollback/release gate documentation.  
**Confidence:** HIGH for project constraints, requirements, and planning split; MEDIUM for any future execution command details because Phase 11 must not execute the switch. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

Phase 11 evaluates readiness for a possible future promotion of `taxonomy-seed.v2.json` and plans controlled migration/rollback. It does not execute v2 promotion. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

Hard constraints: v2 remains candidate-only in Phase 11; no executable plan exists yet; no code changes, seed/data changes, compiled artifact changes, `DEFAULT_PATHS` changes, or official `data/compiled/v2` creation are authorized; `data/compiled/v1/`, `taxonomy-seed.v1.json`, `curated_relations.v1.json`, and `accord_map.v1.json` remain protected; any real default switch requires a separate future phase/plan with final persisted human approval. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-01 through PROMO-D-05: Phase 11 uses a strict readiness checklist before any future default switch; zero hard failures, determinism, curation traceability, and final human approval are hard requirements; soft findings may be accepted only with explicit policy/disposition; migration and rollback plans are mandatory; Phase 11 must not promote v2 automatically because Phase 10 passed. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-06 through PROMO-D-14: Every soft finding requires documented disposition before promotion; `ylang ylang -> ylang_ylang` absent target is accepted only with an explicit legacy alias exception or otherwise blocks promotion; lower graph density can be accepted if `isolated_subfamilies = 0` and coverage/gaps are documented; inherited zero-frequency seeds can be accepted as legacy; review queue can be accepted if smaller/more actionable and no blocker types lack disposition; increased `seed_corpus_conflict` can be accepted when tied to curated seed truth with persisted approval/rationale/evidence; pending/deferred candidates can remain follow-up if they do not contaminate authoritative artifacts; final soft findings table is required. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-15 through PROMO-D-20: Phase 11 adopts a legacy alias exception policy; new aliases with absent targets are hard blockers; `ylang ylang -> ylang_ylang` is accepted only as explicit/auditable legacy exception; Phase 11 must not add `ylang_ylang`, remove the alias, or remap it; exception list must distinguish accepted legacy aliases from invalid new aliases; resolving ylang remains future alias/floral cleanup. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-21 through PROMO-D-26: Graph readiness is coverage-over-density; `isolated_subfamilies = 0` is a hard requirement; every subfamily needs approved relation/accord or explicit approved gap; low graph density is soft when no subfamilies are isolated and coverage is documented; Phase 11 must not create artificial edges to increase density; every graph edge needs existing endpoints, manual score in `[0,1]`, approval/rationale/evidence, and no placeholder score `0`. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-27 through PROMO-D-31: Review queue readiness is distribution/severity based, not a fixed threshold; remaining queue can be accepted if smaller/more actionable than v1 and no blocker types lack disposition; increased `seed_corpus_conflict` can be accepted when caused by curated seed truth with approval/rationale/evidence; `corpus_candidate_low_support` can become follow-up if it does not contaminate artifacts; no blocker review item may remain without disposition before switch. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-32 through PROMO-D-36: Phase 11 is readiness/migration planning only and will not execute the default switch; real switch requires separate phase/plan and final human approval; Phase 11 must document expected diffs, migration commands, validation commands, and rollback commands; `DEFAULT_PATHS`, CLI behavior, and `data/compiled/v1` remain unchanged; v2 can become default only in separate future execution even if readiness passes. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-37 through PROMO-D-42: Future strategy is official artifacts in `data/compiled/v2`, preserving `data/compiled/v1` as baseline/archive; Phase 11 will not create `data/compiled/v2`; creating `data/compiled/v2` requires a future approved phase/plan; future promotion must keep explicit commands to compile v1 and v2 side by side; rollback must restore defaults to v1 and validate preserved v1 artifacts. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-43 through PROMO-D-47: Rollback must be documented and validatable before switch; git-only rollback is not accepted as primary strategy; rollback must restore `DEFAULT_PATHS` to v1 and validate preserved v1 inputs/artifacts; future promotion can execute only if rollback commands and rollback validation exist; `data/compiled/v1` and v1 inputs must remain available. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

PROMO-D-48 through PROMO-D-53: Future v2 promotion requires full hard/soft gate set; technical gates are necessary but insufficient without curation, alias, graph, migration, and rollback gates; no soft finding may remain without disposition before switch; validatable rollback and final human approval are hard gates; expected diffs and migration commands are mandatory before altering `DEFAULT_PATHS`; promotion can occur only when hard gates pass and soft gates are accepted, blocked, or assigned follow-up. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

### the agent's Discretion

No separate `## the agent's Discretion` section exists in `11-CONTEXT.md`; planning discretion is limited to structuring non-executable Phase 11 planning artifacts and validation documentation that satisfy PROMO-D-01 through PROMO-D-53 without changing code/data/artifacts. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)

Default switching, changing `DEFAULT_PATHS`, changing CLI behavior, replacing or overwriting `data/compiled/v1`, creating official `data/compiled/v2`, adding/removing/remapping `ylang ylang -> ylang_ylang`, adding artificial graph edges, promoting corpus/review_queue candidates, mutating seed/alias/relation/accord data, and any future promotion execution are out of scope for Phase 11. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROMO-01 | Decide whether Phase 11 is readiness/planning only or whether any default switch is deferred to separate Phase 12. | Plan 11 must be documentation-only; default switch and execution are deferred to a separate future approved phase. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| PROMO-02 | Define minimum criteria before v2 can become default. | Readiness audit plan must cover hard failures, determinism, protected files, curation traceability, graph coverage, review queue, zero-frequency policy, migration/rollback, and final approval. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| PROMO-03 | Decide handling for known soft findings. | Soft findings/alias policy plan must produce explicit disposition table for ylang alias gap, lower graph density, inherited zero-frequency seeds, review_queue 317, increased seed-corpus-conflict, and pending/deferred candidates. [CITED: .planning/REQUIREMENTS.md] |
| PROMO-04 | Decide alias readiness policy. | Plan 11-02 should document legacy alias exception policy and distinguish new absent-target aliases from accepted legacy exceptions. [CITED: .planning/REQUIREMENTS.md] [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| PROMO-05 | Decide graph readiness policy. | Plan 11-03 should document coverage-over-density gates: no isolated subfamilies, approved relation/accord/gap per subfamily, valid endpoints, manual scores, and no artificial edges. [CITED: .planning/REQUIREMENTS.md] |
| PROMO-06 | Decide review queue readiness policy. | Plan 11-03 should document queue distribution/severity gates and rationale for increased `seed_corpus_conflict`. [CITED: .planning/REQUIREMENTS.md] |
| PROMO-07 | Decide generated artifacts and default switch strategy. | Plan 11-04 should document future `data/compiled/v2` publication strategy while explicitly not creating it in Phase 11. [CITED: .planning/REQUIREMENTS.md] |
| PROMO-08 | Identify migration mechanics and files that would change in a future promotion. | Plan 11-04 should document expected future diffs for `src/cli/parse_args.ts`, default seed/relation/accord paths, output dir, version, docs, and files that must never be removed. [CITED: .planning/REQUIREMENTS.md] |
| PROMO-09 | Define rollback strategy. | Plan 11-05 should document rollback commands/checks to restore v1 defaults, validate preserved v1 inputs/artifacts, and avoid git-only rollback reliance. [CITED: .planning/REQUIREMENTS.md] |
| PROMO-10 | Define validation gates and release process. | Plan 11-05 should document hard/soft gates, release checklist, final persisted human approval, and orchestration for 11-VALIDATION.md. [CITED: .planning/REQUIREMENTS.md] |
</phase_requirements>

## Summary

Phase 11 should be planned as a **promotion readiness and migration design phase**, not an implementation phase: it may create planning documents only under `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/`, and it must not alter code, data, official artifacts, `DEFAULT_PATHS`, or official compiled outputs. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md]

The post-Phase 10 v2 candidate has zero hard failures, deterministic temporary compiles, passing curation tests, 10 families, 18 subfamilies, 39 seed descriptors, 303 compiled descriptors, 317 review queue items, 14 input relations, 19 input accords, 13 compiled graph edges, and 0 isolated subfamilies; these metrics are evidence for readiness analysis, not permission to switch defaults. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md]

**Primary recommendation:** Use a five-plan split: **11-01 readiness audit**, **11-02 soft findings + legacy alias policy**, **11-03 graph/review queue readiness**, **11-04 migration/default-switch proposal documentation**, and **11-05 rollback/validation/release gate documentation**; every plan must be documentation-only or read-only/dry-run validation and must not write official code/data/artifacts. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

## Project Constraints (from AGENTS.md)

No `AGENTS.md` file exists at repository root, so no additional project-level agent directives from that file apply. [VERIFIED: codebase read]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Phase 11 readiness decision | Planning/documentation tier under `.planning/phases/11-*` | Read-only evidence from Phase 10 comparison and current project files | Phase 11 is not authorized to execute promotion; readiness is a documented recommendation, not a data/code mutation. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md] |
| Soft findings and alias policy | Planning/policy document | Existing alias seed and tests as read-only evidence | Soft findings need explicit disposition; alias target exceptions must be auditable without changing `descriptor_aliases.seed.json`. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Graph readiness | Planning/report tier | Read-only v2 relation/accord inputs and Phase 10 comparison metrics | Graph readiness is coverage-over-density; Phase 11 may document gates but must not create edges. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Review queue readiness | Planning/report tier | Read-only compiled comparison metrics | Queue readiness is based on distribution/severity and dispositions, not a fixed numeric threshold. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Future default switch mechanics | Future execution phase, not Phase 11 | Phase 11 proposal document | Future changes may involve `src/cli/parse_args.ts`, default paths, output dir strategy, docs, and release notes; Phase 11 only documents expected diffs. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Official v2 compiled artifacts | Future artifact publication phase, not Phase 11 | Temporary `/tmp/opencode/...` dry-run outputs if a future plan needs non-persistent verification | Phase 11 must not create official `data/compiled/v2`; future promotion strategy can propose it. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Rollback | Future execution runbook | Preserved v1 inputs/artifacts and `DEFAULT_PATHS` evidence | Rollback must restore v1 defaults and validate preserved v1 inputs/artifacts; git-only rollback is insufficient. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |

## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| Node.js | `v24.14.0` available locally | Run read-only verification scripts and future dry-run compile/test commands if explicitly planned | Project is Node.js + TypeScript and existing validation commands use npm scripts. [VERIFIED: local command] [CITED: src/package.json] |
| npm | `11.9.0` available locally | Invoke existing project scripts without installing new packages | `src/package.json` defines `build`, `typecheck`, `compile`, `compile:quality`, and `test`. [VERIFIED: local command] [CITED: src/package.json] |
| TypeScript | `^5.8.0` declared | Existing strict TypeScript project stack | Project constraints specify TypeScript strict and ESM modules. [CITED: src/package.json] [CITED: .planning/PROJECT.md] |
| Vitest | `^3.2.0` declared | Existing curation/default-path validation tests | Current curation test suite covers v2 seed, aliases, relation/accord inputs, review dispositions, and v1-v2 comparison guards. [CITED: src/package.json] [CITED: src/tests/curation/v1_v2_comparison.test.ts] |

### Supporting

| Library/Tool | Version | Purpose | When to Use |
|--------------|---------|---------|-------------|
| Built-in Node modules (`fs`, `path`, `os`) | Node built-ins | Read-only source assertions and temporary directory handling | Existing tests use built-ins for fixtures and path checks; no new runtime dependency is needed. [CITED: src/tests/curation/v1_v2_comparison.test.ts] |
| Git diff | System git, version not probed | Protected-file drift checks | Future plans can use `git diff --exit-code` as read-only verification for protected paths. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-PLAN.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing planning documents | New migration tool or database | Not recommended; Phase 11 is planning-only and project is zero-runtime-dependency. [CITED: .planning/PROJECT.md] [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md] |
| Temporary `/tmp/opencode/...` dry-run outputs | Official `data/compiled/v2` | Not allowed in Phase 11; official v2 artifacts require future approval. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Fixed review queue numeric threshold | Distribution/severity gate | Context explicitly selects distribution/severity over fixed threshold. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |

**Installation:** No package installation is recommended for Phase 11. [CITED: .planning/PROJECT.md]

## Package Legitimacy Audit

No external packages are recommended for installation in Phase 11; package legitimacy gate is not applicable. [CITED: .planning/PROJECT.md]

## Recommended 5-Plan Split

| Plan | Title | Files Modified | Purpose | Must Not Do |
|------|-------|----------------|---------|-------------|
| 11-01 | Readiness audit | `11-readiness-audit.md` under Phase 11 dir | Produce strict readiness checklist, baseline metrics, hard gate status, and recommendation `ready_for_promotion` or `not_ready`. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] | Must not run default compile, alter `DEFAULT_PATHS`, or write official artifacts. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md] |
| 11-02 | Soft findings and alias policy | `11-soft-findings-alias-policy.md` under Phase 11 dir | Produce final soft findings table and legacy alias exception policy/list. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] | Must not add `ylang_ylang`, remove/remap ylang alias, or edit alias JSON. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| 11-03 | Graph and review queue readiness | `11-graph-review-readiness.md` under Phase 11 dir | Document coverage-over-density graph gates and distribution/severity queue gates. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] | Must not create artificial edges, scores, relation/accord JSON, or review_queue mutations. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| 11-04 | Migration/default-switch proposal | `11-migration-default-switch-proposal.md` under Phase 11 dir | Document expected future diffs, proposed commands, official `data/compiled/v2` strategy, and pre/post-switch validation commands. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] | Must not edit `src/cli/parse_args.ts`, docs, code, data, or create official `data/compiled/v2`. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md] |
| 11-05 | Rollback, validation, and release gates | `11-rollback-validation-release-gates.md` under Phase 11 dir | Document rollback commands, rollback validation, release checklist, final human approval gate, and inputs for `11-VALIDATION.md`. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] | Must not execute rollback or switch; must not rely on git-only rollback as primary strategy. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |

## Existing Patterns

| Pattern | Evidence | Phase 11 Planning Application |
|---------|----------|-------------------------------|
| Candidate-only boundary | Phase 10 validation stated v2 remained candidate and no official `data/compiled/v2` was created. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md] | Phase 11 documents readiness only and cannot use passing Phase 10 validation as switch authorization. |
| Temporary explicit-path comparison | Phase 10 Plan 04 compiled v1/v2 to `/tmp/opencode/taxonomy-phase10-comparison/*` with fixed timestamp. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-PLAN.md] | Any future Phase 11 validation command must be dry-run/temp-output only, e.g. `/tmp/opencode/taxonomy-phase11-readiness/*`, never official paths. |
| Protected file drift checks | Phase 10 Plan 04 used `git diff --exit-code` for `data/compiled/v1`, v1 inputs, and `src/cli/parse_args.ts`. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-PLAN.md] | Phase 11 plans should use read-only protected diff assertions as gates. |
| Workbook traceability | Phase 10 tests assert `r3-*` approvals and pending records before seed/alias/relation/accord changes. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts] [CITED: src/tests/curation/relation_accord_v2.test.ts] | Phase 11 readiness audit should cite workbook traceability status, not create new approvals. |
| Default path guard | `DEFAULT_PATHS` points to v1 seed, v1 relation/accord inputs, `data/compiled/v1`, and version `1.0.0`. [CITED: src/cli/parse_args.ts] | Migration proposal can describe future desired diff, but Phase 11 must verify current defaults remain v1. |

## Architecture Patterns

### System Architecture Diagram

```text
Post-Phase 10 evidence (read-only)
  -> 11-01 readiness audit
       -> hard gates: determinism, tests, protected files, curation traceability
       -> recommendation: ready_for_promotion | not_ready
  -> 11-02 soft findings + alias policy
       -> dispositions: blocker_before_promotion | accepted_with_policy | follow_up_after_promotion
       -> legacy alias exception list for ylang only if auditable
  -> 11-03 graph/review queue readiness
       -> graph coverage-over-density gates
       -> review queue distribution/severity gates
  -> 11-04 migration/default-switch proposal
       -> expected future diffs and commands as documentation only
       -> future official data/compiled/v2 strategy as proposal only
  -> 11-05 rollback/validation/release gates
       -> rollback runbook + release checklist + final human approval gate
       -> inputs to 11-VALIDATION.md

All Phase 11 outputs stay under:
.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/

Forbidden in Phase 11:
  code edits, seed/data edits, DEFAULT_PATHS edits, official compiled artifact writes,
  official data/compiled/v2 creation, or default switch execution.
```

### Recommended Project Structure

```text
.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/
├── 11-CONTEXT.md
├── 11-PREFLIGHT.md
├── 11-RESEARCH.md
├── 11-PATTERNS.md                         # future pattern map, if orchestrator creates it
├── 11-VALIDATION.md                       # future validation architecture artifact
├── 11-01-PLAN.md                          # readiness audit plan
├── 11-02-PLAN.md                          # soft findings + alias policy plan
├── 11-03-PLAN.md                          # graph/review queue readiness plan
├── 11-04-PLAN.md                          # migration/default-switch proposal plan
├── 11-05-PLAN.md                          # rollback/validation/release gate plan
├── 11-readiness-audit.md                  # planning-only output
├── 11-soft-findings-alias-policy.md       # planning-only output
├── 11-graph-review-readiness.md           # planning-only output
├── 11-migration-default-switch-proposal.md# planning-only output
└── 11-rollback-validation-release-gates.md# planning-only output
```

### Pattern 1: Documentation-Only Readiness Gate

**What:** Convert Phase 10 evidence and Phase 11 decisions into pass/fail/needs-policy tables without modifying source files. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]  
**When to use:** Plan 11-01 and 11-05. [CITED: .planning/REQUIREMENTS.md]  
**Example:**

```markdown
| Gate | Required Evidence | Current Evidence | Result | Promotion Impact |
|------|-------------------|------------------|--------|------------------|
| Determinism | fixed generated_at repeated compile | Phase 10 repeated cmp matched | PASS | hard gate satisfied |
| Soft findings | every item has disposition | see 11-02 table | TBD | blocks until table complete |
```

### Pattern 2: Explicit Soft Finding Disposition

**What:** Every soft finding must be classified as `blocker_before_promotion`, `accepted_with_policy`, or `follow_up_after_promotion`. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]  
**When to use:** Plan 11-02. [CITED: .planning/REQUIREMENTS.md]

### Pattern 3: Future Diff Proposal, Not Diff Execution

**What:** Document the exact future files and settings that a promotion phase might change, but do not apply those changes. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]  
**When to use:** Plan 11-04. [CITED: .planning/REQUIREMENTS.md]

### Anti-Patterns to Avoid

- **Planning-by-switching:** Do not make Phase 11 prove readiness by changing `DEFAULT_PATHS` or running default compile to official paths. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md]
- **Official v2 sidecar creation:** Do not create `data/compiled/v2` in Phase 11; document it as future strategy only. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]
- **Soft finding omission:** Do not say “soft warning accepted” without disposition, rationale, required policy, and promotion blocker status. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]
- **Alias remediation creep:** Do not add `ylang_ylang`, remove/remap `ylang ylang`, or broaden floral cleanup in Phase 11. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]
- **Artificial graph quality:** Do not add relation/accord edges to improve density; coverage must be approved-or-gap. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Promotion authorization | Chat approval, implicit “tests passed” gate, or automatic switch script | Final persisted human approval in a separate future phase/plan | Context says real switch requires separate final persisted approval. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Soft findings tracking | Free-form narrative only | Required soft findings table with explicit fields | Context mandates `finding_id`, `description`, `affected_area`, `disposition`, `rationale`, `required_policy`, `promotion_blocker`, and optional follow-up. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Alias readiness | Ad hoc alias fixes | Legacy alias exception policy/list | New absent-target aliases block; legacy ylang exception must be auditable. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Graph readiness | Density booster or heuristic edge generator | Approved relation/accord/gap coverage checks | Artificial edges are forbidden and each edge needs endpoint/score/approval evidence. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Rollback | Git-only rollback | Explicit v1 default restoration and validation runbook | Git-only rollback is not accepted as primary rollback strategy. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |

**Key insight:** Phase 11 complexity is governance and reversibility, not implementation; plans should create auditable readiness/migration documents and avoid every write path that would make v2 default. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | Official stored artifacts are `data/compiled/v1/taxonomy.json`, `data/compiled/v1/descriptor_aliases.json`, and `data/compiled/v1/similarity_matrix.json`; future strategy may add `data/compiled/v2`, but Phase 11 must not create it. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] | Document future publication/migration only; no data migration or artifact write in Phase 11. |
| Live service config | No runtime API/service default is in Phase 11 scope; project is builder-first and runtime APIs are out of scope. [CITED: .planning/PROJECT.md] | None for Phase 11; future release docs may need downstream consumer notice. [ASSUMED] |
| OS-registered state | No OS-registered scheduler/service state was identified in the Phase 11 source files read; the project state names only planning/code/data artifacts. [VERIFIED: codebase read] | None for Phase 11; future promotion can include a manual external-consumer checklist if needed. [ASSUMED] |
| Secrets/env vars | No secret or env-var dependency is described by Phase 11 context; default behavior is controlled by `src/cli/parse_args.ts` constants. [CITED: src/cli/parse_args.ts] | None for Phase 11. |
| Build artifacts | `src/dist` may be generated by build scripts and `/tmp/opencode/taxonomy-phase10-comparison/*` was used for prior temp comparison; official v1 artifacts are protected and official v2 artifacts must not be created in Phase 11. [CITED: src/package.json] [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-PLAN.md] | Future dry-run commands, if any, must use temp output only and must not commit or treat temp outputs as Phase 11 artifacts. |

## Common Pitfalls

### Pitfall 1: Accidental Default Switch During Planning
**What goes wrong:** A plan edits `src/cli/parse_args.ts` or runs default compile into `data/compiled/v1` while trying to validate readiness. [CITED: src/cli/parse_args.ts]  
**Why it happens:** Migration documentation and migration execution look similar unless the plan constrains write paths. [ASSUMED]  
**How to avoid:** Mark 11-04 as proposal-only and require protected-file diff checks after any read-only/dry-run validation. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]  
**Warning signs:** `DEFAULT_PATHS`, `data/compiled/v1`, or `data/compiled/v2` appears in `files_modified` for any Phase 11 plan. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md]

### Pitfall 2: Treating Phase 10 PASS as Promotion Approval
**What goes wrong:** Planner concludes v2 is default-ready because Phase 10 had zero hard failures. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md]  
**How to avoid:** Readiness audit must separate current evidence from future authorization and final persisted human approval. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

### Pitfall 3: Incomplete Soft Findings Table
**What goes wrong:** Known soft findings are mentioned but not assigned policy/disposition, leaving promotion blockers ambiguous. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]  
**How to avoid:** Plan 11-02 must require the full final soft findings schema and fail documentation validation if any known finding is absent. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

### Pitfall 4: Alias Exception Becomes Silent Permission
**What goes wrong:** Legacy ylang exception is treated as a general permission for absent alias targets. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]  
**How to avoid:** Exception list must explicitly differentiate accepted legacy aliases from invalid new absent-target aliases. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

### Pitfall 5: Rollback Is Only “Revert the Commit”
**What goes wrong:** Rollback plan relies on git revert and omits validation that v1 defaults/artifacts still work. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]  
**How to avoid:** Plan 11-05 must document explicit restoration of `seedPath`, `relationsPath`, `accordsPath`, `outputDir`, and `version` to v1 plus validation checks. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

## Code Examples

Verified patterns are planning command/documentation patterns only; Phase 11 plans must not execute default switch or write official artifacts. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md]

### Read-only protected default check

```bash
git diff --exit-code \
  data/compiled/v1 \
  data/taxonomy/taxonomy-seed.v1.json \
  data/inference/curated_relations.v1.json \
  data/inference/accord_map.v1.json \
  src/cli/parse_args.ts
```

Source: Phase 10 protected-file pattern. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-PLAN.md]

### Dry-run/temp-only compile path pattern for future verification, if absolutely needed

```bash
# Future Phase 11 plan may document this as dry-run verification only.
# It must not write data/compiled/v1 or data/compiled/v2.
cd src && npm run compile -- \
  --seed ../data/taxonomy/taxonomy-seed.v2.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --relations ../data/inference/curated_relations.v2.json \
  --accords ../data/inference/accord_map.v2.json \
  --out /tmp/opencode/taxonomy-phase11-readiness/v2-candidate \
  --version 2.0.0-promotion-readiness-candidate \
  --generated-at 2026-01-01T00:00:00.000Z
```

Source: adapted from Phase 10 explicit temp comparison command; official artifact paths remain forbidden. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-PLAN.md] [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Minimal v1-only taxonomy artifacts | Expanded v2 candidate evaluated side-by-side with v1 but not default | Phases 8-10 | Phase 11 must analyze promotion readiness rather than perform curation expansion. [CITED: .planning/ROADMAP.md] |
| Candidate validation as final goal | Promotion requires readiness, migration, rollback, release gate, and final human approval | Phase 11 context | Technical pass is necessary but insufficient. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Graph density as intuitive quality metric | Coverage-over-density with no isolated subfamilies and approved-or-gap coverage | Phase 11 context | Low density can be accepted as a soft finding if coverage is documented. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Fixed review queue threshold | Distribution/severity readiness gate | Phase 11 context | Review queue total 317 can be accepted only with documented distribution and no blocker types without disposition. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |

**Deprecated/outdated:** Treating v2 promotion as a data-edit task inside Phase 11 is deprecated by Phase 11’s preflight boundary; real promotion is a separate future execution phase. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Future release docs may need downstream consumer notice if external consumers rely on v1 artifacts. | Runtime State Inventory | Low/medium: a future promotion plan might miss non-repo consumers. |
| A2 | Future promotion can include a manual external-consumer checklist if needed. | Runtime State Inventory | Low: checklist omission could reduce rollout confidence. |
| A3 | Migration documentation and migration execution look similar unless plans constrain write paths. | Common Pitfalls | Low: planning can still mitigate with explicit `files_modified` restrictions. |

## Open Questions (RESOLVED)

1. **Should Phase 11 readiness recommendation be `ready_for_promotion` or `not_ready`?**
    - What we know: Phase 10 had zero hard failures, but known soft findings remain. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md]
    - What's unclear: Whether the user accepts all soft finding dispositions and alias exception policy as sufficient for future switch. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]
    - RESOLVED: Phase 11 planning must not pre-decide promotion readiness in research. Plan 11-01 should create an initial readiness audit with recommendation state `not_ready_until_policy_docs_complete` or equivalent, then require 11-02 and 11-03 outputs before any final future `ready_for_promotion` recommendation can be claimed. This preserves the context rule that readiness evidence is not promotion authorization. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

2. **Should future promotion be Phase 12?**
    - What we know: Real switch requires a separate future phase/plan and final approval. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]
    - What's unclear: The exact numbering/name of that future execution phase. [ASSUMED]
    - RESOLVED: Phase 11 plans must use the wording “separate future promotion phase” and must not hardcode Phase 12 as an execution target. If a future roadmap later names Phase 12, that naming occurs outside Phase 11 and still requires final persisted human approval. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Future read-only assertions/dry-run compile/test commands | ✓ | `v24.14.0` | If unavailable, limit Phase 11 to documentation-only assertions. [VERIFIED: local command] |
| npm | Existing project scripts | ✓ | `11.9.0` | If unavailable, do not run scripts; cite existing Phase 10 report as evidence. [VERIFIED: local command] |
| TypeScript | Existing build/typecheck stack | Declared | `^5.8.0` | Use existing devDependency; no install in Phase 11. [CITED: src/package.json] |
| Vitest | Existing curation tests | Declared | `^3.2.0` | Use existing devDependency; no install in Phase 11. [CITED: src/package.json] |

**Missing dependencies with no fallback:** None identified for planning-only Phase 11. [VERIFIED: local command]

**Missing dependencies with fallback:** If npm scripts cannot run during future planning, Phase 11 can use existing Phase 10 comparison report and read-only source assertions. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `^3.2.0` [CITED: src/package.json] |
| Config file | No separate config file was read; package script uses `vitest run`. [CITED: src/package.json] |
| Quick run command | Future dry-run only if authorized: `cd src && npm test -- tests/curation/v1_v2_comparison.test.ts` [CITED: src/package.json] |
| Full suite command | Future dry-run only if authorized: `cd src && npm test -- tests/curation/` [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md] |

### Phase Requirements → Test/Validation Map

| Req ID | Behavior | Test/Validation Type | Automated Command / Check | File Exists? |
|--------|----------|----------------------|----------------------------|--------------|
| PROMO-01 | Phase 11 planning-only, no switch | Documentation/source assertion | Check Phase 11 plans only modify Phase 11 docs and no `DEFAULT_PATHS`/data artifacts. | ✅ context/preflight exist [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md] |
| PROMO-02 | Strict readiness criteria | Documentation checklist | 11-01 must contain all mandatory hard criteria and recommendation state. | ❌ Wave 0 creates `11-readiness-audit.md` |
| PROMO-03 | Soft findings dispositions | Documentation table | 11-02 must list all known soft findings with required fields. | ❌ Wave 0 creates `11-soft-findings-alias-policy.md` |
| PROMO-04 | Alias readiness | Documentation + optional existing test citation | Existing alias test distinguishes preserved legacy alias from invalid new aliases. | ✅ [CITED: src/tests/curation/alias_seed_v2.test.ts] |
| PROMO-05 | Graph readiness | Documentation + read-only data evidence | 11-03 documents no isolated subfamilies and approved-or-gap coverage using Phase 10 report. | ✅ evidence exists [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md] |
| PROMO-06 | Review queue readiness | Documentation + report evidence | 11-03 documents total/type/severity and disposition. | ✅ evidence exists [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md] |
| PROMO-07 | Generated artifact/default strategy | Documentation proposal | 11-04 documents future `data/compiled/v2` strategy without creating it. | ❌ Wave 0 creates `11-migration-default-switch-proposal.md` |
| PROMO-08 | Migration mechanics | Documentation proposal | 11-04 lists expected future diffs and protected files. | ❌ Wave 0 creates `11-migration-default-switch-proposal.md` |
| PROMO-09 | Rollback strategy | Documentation runbook | 11-05 includes v1 default restoration and validation commands. | ❌ Wave 0 creates `11-rollback-validation-release-gates.md` |
| PROMO-10 | Validation/release process | Documentation checklist + 11-VALIDATION | 11-05 and 11-VALIDATION list hard/soft gates and final human approval. | ❌ Wave 0 creates `11-VALIDATION.md` |

### Sampling Rate

- **Per task commit:** Read-only source/document assertions only; if a plan includes shell commands, they must be dry-run/temp-output or read-only and must not write official artifacts. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md]
- **Per wave merge:** Validate all Phase 11 planning documents exist and protected paths have clean diff. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]
- **Phase gate:** `11-VALIDATION.md` must confirm all five planning artifacts exist, all PROMO requirements are mapped, no prohibited files changed, no official `data/compiled/v2` exists, and final output remains non-executable. [CITED: .planning/config.json]

### Wave 0 Gaps

- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-readiness-audit.md` — covers PROMO-01/PROMO-02.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md` — covers PROMO-03/PROMO-04.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-graph-review-readiness.md` — covers PROMO-05/PROMO-06.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-migration-default-switch-proposal.md` — covers PROMO-07/PROMO-08.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-rollback-validation-release-gates.md` — covers PROMO-09/PROMO-10.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-VALIDATION.md` — orchestrator validation artifact; `workflow.nyquist_validation` is enabled. [CITED: .planning/config.json]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Phase 11 has no runtime auth surface; it is local planning documentation. [CITED: .planning/PROJECT.md] |
| V3 Session Management | no | No sessions are involved in the builder/planning scope. [CITED: .planning/PROJECT.md] |
| V4 Access Control | yes | Treat persisted human approval, planning-only boundaries, and protected-file diff checks as local authorization controls. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| V5 Input Validation | yes | Existing validators/tests validate seeds, aliases, relation/accord inputs, default path guards, and deterministic compiles. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts] [CITED: src/tests/curation/relation_accord_v2.test.ts] |
| V6 Cryptography | no | Phase 11 does not use cryptographic operations. [CITED: .planning/PROJECT.md] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unauthorized default switch hidden in readiness plan | Tampering | `files_modified` must be Phase 11 docs only; protected diff checks must stay clean. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md] |
| Repudiation of promotion decision | Repudiation | Require final persisted human approval in future phase; Phase 11 only documents readiness. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Silent acceptance of soft findings | Tampering/Repudiation | Require explicit soft findings table with policy and blocker status. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Loss of rollback path | Tampering/Availability | Preserve v1 inputs/artifacts and document explicit v1 default restoration validation. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md] |
| Supply-chain drift from new tooling | Tampering | Install no packages; use existing Node/npm/TypeScript/Vitest stack. [CITED: .planning/PROJECT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md` — PROMO-D-01 through PROMO-D-53 and hard Phase 11 boundary.
- `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-PREFLIGHT.md` — non-executable boundary and protected files.
- `.planning/REQUIREMENTS.md` — PROMO-01 through PROMO-10.
- `.planning/ROADMAP.md` — Phase 11 status and roadmap context.
- `.planning/STATE.md` — current project state and Phase 11 decisions/history.
- `.planning/PROJECT.md` — project stack, zero-dependency and architecture constraints.
- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-RESEARCH.md`, `10-PATTERNS.md`, and `10-01-PLAN.md` through `10-04-PLAN.md` — nearest planning analogs.
- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md` — post-Phase 10 metrics and validation evidence.
- `src/package.json`, `src/cli/parse_args.ts`, and `src/tests/curation/*.ts` — validation architecture, default path guard, and existing tests.

### Secondary (MEDIUM confidence)

- Local command probes for Node.js and npm availability (`node --version`, `npm --version`). [VERIFIED: local command]

### Tertiary (LOW confidence)

- No external WebSearch/training-derived library or taxonomy claims were used for planning recommendations.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — read from `src/package.json`, `.planning/PROJECT.md`, and local command probes. [CITED: src/package.json]
- Architecture: HIGH — directly constrained by Phase 11 context/preflight and Phase 10 analog plans. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]
- Pitfalls: HIGH — derived from explicit hard constraints and Phase 10 protected-file/temporary-output patterns. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-PLAN.md]
- Future approval outcome: MEDIUM — readiness criteria are locked, but final user approval and final promotion phase outcome are intentionally future decisions. [CITED: .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md]

**Research date:** 2026-05-24  
**Valid until:** 2026-06-23, unless Phase 11 context or post-Phase 10 candidate state changes sooner.
