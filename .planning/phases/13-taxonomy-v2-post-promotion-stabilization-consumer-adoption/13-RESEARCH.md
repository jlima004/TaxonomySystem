# Phase 13: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption - Research

**Researched:** 2026-05-25  
**Domain:** Post-promotion stabilization, CLI default validation, versioned taxonomy artifacts, consumer/docs audit, generated-artifact policy [VERIFIED: local inspection]  
**Confidence:** HIGH for project-local constraints and patterns; MEDIUM for hook/CI risk surface because no CI config or Git hooks were present in this checkout [VERIFIED: local inspection]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

Phase 13 validates and stabilizes the project after the Phase 12 promotion of taxonomy seed v2 to default. Phase 13 should build confidence that consumers, docs, CLI behavior, explicit v1 fallback, versioned artifacts and graph-related generated outputs are coherent after the promotion. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

- `POST-D-01`: Phase 13 is a post-promotion stabilization and consumer-adoption phase. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-02`: Phase 13 starts in `context_gathering` with `not_ready_for_execution` readiness. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-03`: Phase 13 depends on Phase 12 being closed with v2 default active. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-04`: No new taxonomy curation is in scope for Phase 13. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-05`: v2 seed, v2 curated relation, v2 accord map and descriptor alias seed inputs are protected/no-edit. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-06`: Existing v1 and v2 compiled artifacts must not be overwritten during context gathering. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-07`: `graphify-out/*` is treated as protected until Phase 13 explicitly decides and plans its policy. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-08`: Phase 13 must verify consumers, docs, CLI and fallback behavior before execution closure. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-09`: Phase 13 must verify both v1 and v2 artifact sets remain coherent and discoverable. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-10`: Phase 13 must capture risks and backlog candidates without executing future curation. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-11`: Context gathering may update GSD tracking and Phase 13 planning artifacts only. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `POST-D-12`: Any future executable work requires an approved Phase 13 plan. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

Protected paths: [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

- `data/taxonomy/taxonomy-seed.v2.json` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `data/inference/curated_relations.v2.json` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `data/inference/accord_map.v2.json` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `data/taxonomy/descriptor_aliases.seed.json` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `data/compiled/v1/**` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `data/compiled/v2/**`, except validation may read and compare existing artifacts [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `src/cli/parse_args.ts` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `graphify-out/*`, unless a separate explicit plan authorizes mutation or regeneration [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

Allowed Phase 13 actions are inventory, classify, validate, document, open follow-up and register backlog. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

Not allowed in Phase 13: edit `taxonomy-seed.v2.json`, `curated_relations.v2.json`, `accord_map.v2.json`, `descriptor_aliases.seed.json`, `data/compiled/v1`, `data/compiled/v2`, or `src/cli/parse_args.ts`; promote new descriptors; add aliases; add relations or accords; resolve soft findings; reduce review queue. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

### the agent's Discretion

No explicit `## the agent's Discretion` section exists in `13-CONTEXT.md`; discretion is limited to planning how to perform the four requested scopes while preserving all locked Phase 13 boundaries. [VERIFIED: local inspection]

### Deferred Ideas (OUT OF SCOPE)

The following are not Phase 13 execution work unless a real stabilization blocker is found. They should be captured as `follow_up_phase_14`, `follow_up_later`, `accepted_with_policy` or `not_in_scope_phase_13` in the final checklist/backlog: [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

- Remaining soft findings from Phase 11. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Review queue reduction. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Future alias cleanup, including `ylang ylang -> ylang_ylang`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Future curation candidates and descriptor promotions. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Graph density or graph coverage improvements. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Non-blocking docs improvements. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Consumer gaps that do not invalidate current v2 default stability. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Automation, CI, hook, Graphify, smoke-test and release-process improvements. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| POST-01 | Identify and verify in-repo consumers that rely on CLI/compiler defaults, explicit paths, generated artifacts or documented default behavior after v2 promotion. [CITED: .planning/REQUIREMENTS.md] | Plan 13-01 should produce a read-only inventory using the exact search targets in `13-CONTEXT.md` and classify v1 references as `baseline/archive`, `explicit_fallback`, `stale_reference` or `legacy_context`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| POST-02 | Verify default CLI behavior points to v2 coherently and remains reproducible without changing taxonomy source inputs. [CITED: .planning/REQUIREMENTS.md] | Plan 13-02 should assert `DEFAULT_PATHS` values from `src/cli/parse_args.ts`, run default-v2 smoke output only under `/tmp`, and diff-check protected artifacts before and after. [VERIFIED: local inspection] |
| POST-03 | Verify explicit v1 fallback commands and paths remain usable, documented and protected. [CITED: .planning/REQUIREMENTS.md] | Plan 13-02 should use complete explicit v1 flags from Phase 13 context and Phase 12 release notes, output only under `/tmp`, and assert official v1/v2 artifacts remain diff-clean. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-RELEASE-MIGRATION-NOTES.md] |
| POST-04 | Verify `data/compiled/v1/` and `data/compiled/v2/` artifacts are present, versioned, discoverable and not accidentally overwritten by stabilization work. [CITED: .planning/REQUIREMENTS.md] | Plan 13-02 and 13-03 should inspect the six expected artifact files and use protected diff gates covering both compiled directories. [VERIFIED: local inspection] |
| POST-05 | Verify README, CLI docs, migration/release notes and planning docs describe v2 defaults and v1 fallback consistently. [CITED: .planning/REQUIREMENTS.md] | Plan 13-01 should compare README current status, `compile.ts` help text, Phase 12 release notes and Phase 13 context/preflight against blocking inconsistency rules. [VERIFIED: local inspection] |
| POST-06 | Enforce no edits to `taxonomy-seed.v2.json`, `curated_relations.v2.json`, `accord_map.v2.json` or `descriptor_aliases.seed.json` during Phase 13. [CITED: .planning/REQUIREMENTS.md] | Every executable plan must begin and end with protected diff checks over seed/inference/alias sources and compiled artifact dirs. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| POST-07 | Decide and document whether `graphify-out/*` is archive-only, regenerable, ignored, or plan-gated after the default promotion. [CITED: .planning/REQUIREMENTS.md] | Plan 13-03 should recommend protected/plan-gated policy for this phase, document current dirty `graphify-out/*` risk, and prohibit staging it absent a dedicated Graphify plan. [VERIFIED: local command] |
| POST-08 | Capture post-promotion risks, consumer-adoption gaps and candidate backlog items for a future Phase 14 without executing curation. [CITED: .planning/REQUIREMENTS.md] | Plan 13-04 should produce a final release confidence checklist and backlog table separating `follow_up_phase_14`, `follow_up_later`, `accepted_with_policy` and `not_in_scope_phase_13`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

No `AGENTS.md` exists at the repository root in this checkout, so there are no additional project-specific AGENTS directives to apply. [VERIFIED: local inspection]

## Summary

Phase 13 is not a curation or migration phase; it is a stabilization and evidence-capture phase after Phase 12 made taxonomy v2 the CLI/compiler default. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] The planner should split work into exactly four scopes: `13-01` in-repo consumer inventory and docs consistency audit; `13-02` safe `/tmp` default-v2 and explicit-v1 smoke validations; `13-03` CI/hooks/generated artifacts audit and `graphify-out/*` policy; `13-04` release confidence checklist and Phase 14 backlog boundary. [CITED: user prompt]

The most important planning pattern is “read or generate into `/tmp`, then prove protected paths stayed clean.” [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] `src/cli/parse_args.ts` currently exposes v2 `DEFAULT_PATHS`, but it is protected/no-edit for this phase. [VERIFIED: local inspection] `src/cli/compile.ts` resolves default output `data/compiled/v2` to `../data/compiled/v2` when run from `src/`, so Phase 13 smoke commands must override `--out /tmp/...` rather than executing a bare default compile. [VERIFIED: local inspection]

`graphify-out/*` is an existing generated-output contamination risk: the worktree currently shows modified `graphify-out/.rebuild.lock`, `GRAPH_REPORT.md`, `graph.html` and `graph.json`. [VERIFIED: local command] Phase 13 should not treat these files as taxonomy correctness evidence and should not stage them unless a separate, explicit Graphify plan defines generation command, allowlist, acceptable diffs and commit policy. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

**Primary recommendation:** Plan Phase 13 as a four-artifact evidence phase: inventory/report first, safe smoke validation second, contamination-policy audit third, and release checklist/backlog closure last. [VERIFIED: local inspection]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Consumer/default reference inventory | Repository documentation and source audit | CLI / tests | Consumers are in-repo references, npm scripts, tests and docs that communicate default/fallback behavior. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| CLI default v2 validation | CLI / compiler | Filesystem artifacts | `DEFAULT_PATHS` live in `src/cli/parse_args.ts`, while `runCompileCli` writes outputs via compiler writer; smoke output must be redirected to `/tmp`. [VERIFIED: local inspection] |
| Explicit v1 fallback | CLI / compiler | Versioned data inputs/artifacts | v1 fallback is intentionally explicit flags and should not depend on default values after v2 promotion. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| Artifact coherence | Filesystem/versioned artifacts | Compiler validation | Official artifacts are exactly three JSON files each under `data/compiled/v1` and `data/compiled/v2`. [VERIFIED: local inspection] |
| Docs consistency | Documentation layer | CLI help output | README, Phase 12 release notes and CLI help/default strings are the user-facing surfaces for current default/fallback messaging. [VERIFIED: local inspection] |
| Generated artifact contamination control | Git/worktree policy | Graphify workflow | `graphify-out/*` is protected/plan-gated and already dirty in the worktree. [VERIFIED: local command] |
| Phase 14 backlog capture | Planning artifacts | Future curation workflow | Soft findings and curation improvements are future work unless they are true post-promotion blockers. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Node.js | v24.14.0 available locally | Execute compiled ESM CLI and scripts. | Project README requires Node.js v20+; local version satisfies that floor. [VERIFIED: local command] |
| npm | 11.9.0 available locally | Run project scripts from `src/package.json`. | `src/package.json` defines `build`, `typecheck`, `test`, `compile` and `compile:quality`. [VERIFIED: local command] |
| TypeScript | `^5.8.0` devDependency | Strict typechecking/build. | Project is strict TypeScript and zero-runtime-dependency architecture. [VERIFIED: local inspection] |
| Vitest | `^3.2.0` devDependency | Test runner. | Existing tests use Vitest imports and `npm test` maps to `vitest run`. [VERIFIED: local inspection] |
| Git | 2.54.0 available locally | Diff-clean and protected path gates. | Phase 13 requires protected diff checks before/after smoke validations. [VERIFIED: local command] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| Node one-liners | Node v24.14.0 local runtime | Read JSON outputs, assert versions/counts/defaults without adding scripts. | Use in planned smoke validation and artifact coherence checks. [VERIFIED: local command] |
| `git diff --exit-code -- <paths>` | Git 2.54.0 local | Enforce protected path cleanliness. | Use before and after any command that could write outputs or trigger hooks. [VERIFIED: local command] |
| `/tmp/opencode/taxonomy-phase13-smoke/*` | Local temp path convention | Safe generated output location. | Required for default-v2 smoke and explicit-v1 fallback compiles. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Bare `npm run compile` | `npm run compile -- --out /tmp/... --generated-at ...` | Bare default compile writes to official `data/compiled/v2`; `/tmp` override validates runtime path without touching protected artifacts. [VERIFIED: local inspection] |
| Editing tests/docs to resolve findings during audit | Evidence-only report and backlog routing | Phase 13 scope allows classify/validate/document, but no soft finding resolution or curation work. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| Regenerating `graphify-out/*` | Plan-gated policy document | Current phase treats Graphify artifacts as protected unless a dedicated plan authorizes mutation. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |

**Installation:**

No new packages should be installed for Phase 13; use existing project devDependencies and local CLI tools. [VERIFIED: local inspection]

## Package Legitimacy Audit

Phase 13 should not install external packages. [VERIFIED: local inspection] Package legitimacy gate is therefore not applicable; if a future plan proposes any dependency, it must add a human checkpoint and run the package legitimacy protocol before install. [ASSUMED]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| none | — | — | — | — | — | No external package install planned. [VERIFIED: local inspection] |

**Packages removed due to slopcheck [SLOP] verdict:** none. [VERIFIED: local inspection]  
**Packages flagged as suspicious [SUS]:** none. [VERIFIED: local inspection]

## Architecture Patterns

### System Architecture Diagram

```text
Phase 12 baseline evidence
  |
  v
Phase 13 Plan 13-01: read-only inventory
  |-- scan source/tests/scripts/docs/planning for defaults, explicit paths, artifacts, versions
  |-- classify v1 references: baseline/archive | explicit_fallback | stale_reference | legacy_context
  v
Plan 13-02: safe smoke validation
  |-- pre-diff protected paths
  |-- assert DEFAULT_PATHS == v2
  |-- compile default-v2 equivalent -> /tmp/opencode/taxonomy-phase13-smoke/default-v2
  |-- compile explicit-v1 fallback -> /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback
  |-- inspect temp output versions/status/files
  |-- post-diff protected paths
  v
Plan 13-03: contamination and generated-artifact policy
  |-- inspect package scripts, CI config, git hooks, graphify-out dirty state
  |-- decide graphify-out protected/plan-gated policy for Phase 13
  v
Plan 13-04: release confidence checklist + backlog boundary
  |-- aggregate evidence and commands
  |-- mark each area pass | accepted_with_policy | follow_up | blocker
  |-- route non-blocking soft findings to Phase 14+ backlog
```

### Recommended Project Structure

```text
.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/
├── 13-RESEARCH.md                         # this planning research artifact
├── 13-VALIDATION.md                       # orchestrator-generated validation contract
├── 13-01-CONSUMER-INVENTORY.md            # planned evidence artifact, read-only audit
├── 13-02-SMOKE-VALIDATION.md              # planned default-v2 + explicit-v1 smoke evidence
├── 13-03-GENERATED-ARTIFACT-POLICY.md     # planned CI/hooks/graphify-out policy evidence
└── 13-04-RELEASE-CONFIDENCE-CHECKLIST.md  # planned closure checklist + Phase 14 backlog
```

### Pattern 1: Read-only inventory with classification, not auto-fix

**What:** Inventory references to defaults, explicit paths, compiled artifacts, versions and CLI flags; classify each finding instead of rewriting it. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

**When to use:** Plan 13-01 for POST-01 and POST-05. [CITED: .planning/REQUIREMENTS.md]

**Read-only search targets:**

- `DEFAULT_PATHS` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `taxonomy-seed.v1.json`, `taxonomy-seed.v2.json` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `curated_relations.v1.json`, `curated_relations.v2.json` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `accord_map.v1.json`, `accord_map.v2.json` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `data/compiled/v1`, `data/compiled/v2` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `version: 1.0.0`, `version: 2.0.0` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `npm run compile` and CLI flags `--seed`, `--relations`, `--accords`, `--out`, `--version` [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

**Likely files to inspect:** `README.md`, `src/package.json`, `src/cli/parse_args.ts`, `src/cli/compile.ts`, `src/tests/curation/v1_v2_comparison.test.ts`, `src/tests/curation/taxonomy_seed_v2.test.ts`, `src/tests/cli/compile.test.ts`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, Phase 12 release/migration notes, Phase 12 rollback dry-run, Phase 11 context and Phase 13 context/preflight. [VERIFIED: local inspection]

**Example planned command (do not execute during research):**

```bash
# read-only inventory search from repo root
rg -n "DEFAULT_PATHS|taxonomy-seed\.v1\.json|taxonomy-seed\.v2\.json|curated_relations\.v1\.json|curated_relations\.v2\.json|accord_map\.v1\.json|accord_map\.v2\.json|data/compiled/v1|data/compiled/v2|version: 1\.0\.0|version: 2\.0\.0|npm run compile|--seed|--relations|--accords|--out|--version" README.md src .planning
```

### Pattern 2: Smoke compile into `/tmp`, then prove official artifacts stayed untouched

**What:** Use the CLI runtime path with deterministic timestamp and `/tmp` output overrides. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

**When to use:** Plan 13-02 for POST-02, POST-03, POST-04 and POST-06. [CITED: .planning/REQUIREMENTS.md]

**Default-v2 planned command (from `src/`, to be executed later by the plan):**

```bash
npm run compile -- --out /tmp/opencode/taxonomy-phase13-smoke/default-v2 --generated-at 2026-01-01T00:00:00.000Z
```

**Explicit-v1 fallback planned command (from `src/`, to be executed later by the plan):**

```bash
npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z
```

**Protected diff checks to plan before and after smoke commands:**

```bash
git diff --exit-code -- \
  data/compiled/v1 data/compiled/v2 \
  data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json \
  data/taxonomy/descriptor_aliases.seed.json \
  data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json \
  data/inference/accord_map.v1.json data/inference/accord_map.v2.json \
  src/cli/parse_args.ts
```

### Pattern 3: Generated artifacts are commit-contamination risks, not correctness proof

**What:** Treat `graphify-out/*` as protected/plan-gated and audit its dirty state without regenerating or staging it. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

**When to use:** Plan 13-03 for POST-07 and CI/hooks generated-artifact risk. [CITED: .planning/REQUIREMENTS.md]

**Current local observation:** `git status --short` reports modified `graphify-out/.rebuild.lock`, `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.html` and `graphify-out/graph.json`; Phase 13 must not include these in commits without an explicit plan. [VERIFIED: local command]

**Planned read-only checks:**

```bash
git status --short
git status --short -- graphify-out
git diff --name-only -- graphify-out
```

### Anti-Patterns to Avoid

- **Bare default compile:** Running `npm run compile` without `--out /tmp/...` can write to the official v2 output directory because `DEFAULT_PATHS.outputDir` is `data/compiled/v2` and `resolveOutputDir` maps the default output to `../data/compiled/v2` from `src/`. [VERIFIED: local inspection]
- **Treating v1 references as errors:** v1 references can be baseline/archive, explicit fallback, stale reference or legacy context and must be classified before any blocker decision. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- **Resolving soft findings:** Phase 13 may document soft findings but must not resolve curation/backlog items unless they are real stabilization blockers. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- **Committing `graphify-out/*` opportunistically:** Graphify outputs require a separate plan, allowlist, diff policy and commit policy. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CLI default introspection | A duplicate default map in planning docs | Import/assert `DEFAULT_PATHS` via built CLI or inspect `src/cli/parse_args.ts` read-only | `DEFAULT_PATHS` is the source of truth for seed/relation/accord/output/version defaults. [VERIFIED: local inspection] |
| Runtime compile validation | A custom compiler wrapper | Existing `npm run compile` with explicit `/tmp` output and fixed `--generated-at` | Existing CLI exercises the real runtime path used by consumers. [VERIFIED: local inspection] |
| Artifact mutation safety | Manual memory of protected files | `git diff --exit-code -- <protected paths>` | Diff gates are the captured Phase 13 policy for protected paths. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| Docs consistency classification | Ad hoc prose only | Structured inventory rows with `classification`, `evidence`, `blocking?`, `recommended disposition` | Phase 13 needs pass/block/follow-up evidence, not silent broad docs edits. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| Graphify policy | Implicitly accepting local generated diffs | Dedicated `graphify-out/*` policy and commit allowlist | Current dirty Graphify outputs can contaminate commits and are not authoritative taxonomy correctness evidence. [VERIFIED: local command] |

**Key insight:** Phase 13 should prove the v2 default is usable and reversible by evidence, not by changing the taxonomy, compiled official artifacts or CLI default source. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Accidentally overwriting official v2 artifacts

**What goes wrong:** A bare compile from `src/` writes to `../data/compiled/v2`. [VERIFIED: local inspection]  
**Why it happens:** `DEFAULT_PATHS.outputDir` is `data/compiled/v2`, and `resolveOutputDir` rewrites only the default path to `../data/compiled/v2`. [VERIFIED: local inspection]  
**How to avoid:** Always include `--out /tmp/opencode/taxonomy-phase13-smoke/default-v2` for default-v2 smoke. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]  
**Warning signs:** `git diff -- data/compiled/v2` shows changes after smoke validation. [VERIFIED: local command]

### Pitfall 2: Validating fallback by changing defaults

**What goes wrong:** A plan simulates v1 fallback by editing `src/cli/parse_args.ts` or doing a real rollback. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]  
**Why it happens:** Phase 12 rollback dry-run changed defaults only in a temporary worktree, but Phase 13 fallback is consumer-facing explicit path validation. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-5-ROLLBACK-DRY-RUN.md]  
**How to avoid:** Use complete explicit v1 flags with `/tmp` output and assert `DEFAULT_PATHS` remain v2. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]  
**Warning signs:** Any diff in `src/cli/parse_args.ts` is a blocker. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

### Pitfall 3: Treating all v1 mentions as stale

**What goes wrong:** The plan flags rollback/fallback/baseline/archive documentation as inconsistent. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]  
**Why it happens:** v1 remains intentionally preserved and explicit fallback remains supported. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-RELEASE-MIGRATION-NOTES.md]  
**How to avoid:** Classify every v1 mention into the four accepted categories before labeling stale. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]  
**Warning signs:** A finding says “v1 mention” without a category. [VERIFIED: local inspection]

### Pitfall 4: Letting generated `graphify-out/*` diffs enter commits

**What goes wrong:** Existing or hook-generated Graphify changes get staged with Phase 13 evidence docs. [VERIFIED: local command]  
**Why it happens:** Prior phases recorded Graphify background/hook changes as unrelated generated artifacts. [CITED: .planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-02-SUMMARY.md]  
**How to avoid:** Stage explicit Phase 13 files only and check `git status --short -- graphify-out` before commits. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]  
**Warning signs:** `git status --short` includes `graphify-out/*`. [VERIFIED: local command]

## Code Examples

Verified patterns from project-local sources:

### DEFAULT_PATHS v2 source of truth

```typescript
// Source: src/cli/parse_args.ts
export const DEFAULT_PATHS = {
  seedPath: 'data/taxonomy/taxonomy-seed.v2.json',
  aliasPath: 'data/taxonomy/descriptor_aliases.seed.json',
  corpusPath: 'data/enriched_materials.json',
  relationsPath: 'data/inference/curated_relations.v2.json',
  accordsPath: 'data/inference/accord_map.v2.json',
  noisePath: 'data/inference/semantic_noise.v1.json',
  outputDir: 'data/compiled/v2',
  version: '2.0.0',
} as const
```

This is the primary read-only inspection point for default behavior; Phase 13 must not edit this file. [VERIFIED: local inspection]

### CLI output safety behavior

```typescript
// Source: src/cli/compile.ts
const resolveOutputDir = (path: string): string => path === DEFAULT_PATHS.outputDir ? join('..', path) : path
```

Because only the default output path is rewritten to the repository `data/compiled/v2` location, any smoke compile must pass a non-default `/tmp/...` `--out` value. [VERIFIED: local inspection]

### Existing test pattern for default v2 assertions

```typescript
// Source: src/tests/curation/v1_v2_comparison.test.ts
expect(DEFAULT_PATHS.seedPath).toBe('data/taxonomy/taxonomy-seed.v2.json')
expect(DEFAULT_PATHS.relationsPath).toBe('data/inference/curated_relations.v2.json')
expect(DEFAULT_PATHS.accordsPath).toBe('data/inference/accord_map.v2.json')
expect(DEFAULT_PATHS.outputDir).toBe('data/compiled/v2')
expect(DEFAULT_PATHS.version).toBe('2.0.0')
```

The planner can reference this test as existing automated coverage, but Phase 13 context says tests-only is insufficient because smoke validation must exercise the post-promotion runtime compile path. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| v1 CLI/compiler default writing to `data/compiled/v1` | v2 CLI/compiler default writing to `data/compiled/v2` | Phase 12 default switch closure on 2026-05-25 [CITED: .planning/STATE.md] | Plans must validate v2 default while preserving explicit v1 fallback. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| v2 as candidate-only explicit-path seed | v2 as official default with published artifacts | Phase 12 [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-RELEASE-MIGRATION-NOTES.md] | Docs and consumers must stop implying v1 is current default. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| No official `data/compiled/v2` | Three official v2 JSON artifacts exist | Phase 12 Gate 2 [CITED: .planning/ROADMAP.md] | Artifact coherence checks must cover both v1 and v2 directories. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| Promotion readiness soft findings pending | Accepted-with-policy soft findings remain not resolved | Phase 11/12 [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-RELEASE-MIGRATION-NOTES.md] | Phase 13 should not claim curation cleanup occurred. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |

**Deprecated/outdated:**

- Docs that imply v1 is still the default are blockers. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Docs that say v1 was removed or physically replaced by v2 are blockers. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Docs that say accepted soft findings were resolved are blockers. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

## Planned Artifact Outputs

| Plan Scope | Artifact to Produce | Contents | Protected Paths |
|------------|---------------------|----------|-----------------|
| 13-01 | `13-01-CONSUMER-INVENTORY.md` | Search matrix, classified findings, docs consistency verdicts, blocking/stale references. [CITED: user prompt] | Read-only; no source/docs edits unless a later plan explicitly allows docs updates. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| 13-02 | `13-02-SMOKE-VALIDATION.md` | Commands run, `/tmp` output locations, output file existence, version/status/quality checks, protected diff results. [CITED: user prompt] | No edits to compiled v1/v2 or seed/inference/alias inputs. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| 13-03 | `13-03-GENERATED-ARTIFACT-POLICY.md` | CI/hooks/script audit, current generated-output dirty state, Graphify policy, commit contamination controls. [CITED: user prompt] | Do not mutate or stage `graphify-out/*`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| 13-04 | `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` | Nine-area checklist and Phase 14 backlog classification. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] | Backlog capture only; no curation execution. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |

## Explicit Non-Goals

- Do not execute taxonomy curation. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Do not edit v2 seed, v2 relation input, v2 accord input or descriptor alias seed. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Do not alter `data/compiled/v1` or `data/compiled/v2`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Do not alter `src/cli/parse_args.ts`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Do not mutate `graphify-out/*` without a dedicated explicit plan. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Do not resolve soft findings, reduce review queue, add aliases, add descriptors, add relations or add accords. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- Do not run a real rollback; Phase 12 already validated rollback dry-run and Phase 13 validates explicit v1 fallback. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-5-ROLLBACK-DRY-RUN.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | If a future plan proposes any dependency, it must add a human checkpoint and run package legitimacy before install. [ASSUMED] | Package Legitimacy Audit | Planner may add unnecessary checkpoint if no dependency is proposed; low risk. |

## Open Questions (RESOLVED)

1. **Should Plan 13-01 be allowed to update user-facing docs if it finds a blocking inconsistency?**
   - What we know: Context gathering allowed planning artifacts/tracking only, while future planning should separate read-only validation from any allowed docs/policy updates. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
   - What's unclear: The requested plan scopes emphasize audit/checklist rather than remediation. [CITED: user prompt]
   - Recommendation: Plan 13-01 as audit-only; if a blocker is found, Plan 13-04 should mark `blocker` and propose a follow-up remediation plan rather than silently editing docs. [VERIFIED: local inspection]
   - RESOLVED: Plan 13-01 is audit-only. It may create `13-01-CONSUMER-INVENTORY.md` and classify blockers, but it must not edit README, CLI docs, release notes or other current docs. Any blocking docs inconsistency is routed to the release checklist as `blocker` or to a separate follow-up remediation plan.

2. **Should `graphify-out/*` become archive-only or regenerable after Phase 13?**
   - What we know: Phase 13 currently treats it as protected and plan-gated. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
   - What's unclear: The final long-term policy choice is still to be decided in POST-07. [CITED: .planning/REQUIREMENTS.md]
   - Recommendation: For Phase 13 execution, document `plan-gated/protected` as the release-stabilization policy; route archive/regenerate/ignore decisions beyond this phase unless needed to prevent commit contamination. [VERIFIED: local inspection]
   - RESOLVED: For Phase 13 execution, `graphify-out/*` is protected and plan-gated. Phase 13 may document contamination risk and policy, but it must not regenerate, mutate, stage or treat `graphify-out/*` as authoritative taxonomy correctness evidence. Long-term archive/regenerate/ignore policy can be routed to Phase 14+ if needed.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Build/test/CLI smoke validation | ✓ | v24.14.0 [VERIFIED: local command] | Required; no fallback. |
| npm | Project scripts in `src/package.json` | ✓ | 11.9.0 [VERIFIED: local command] | Required; no fallback. |
| git | Protected diff checks and commit hygiene | ✓ | 2.54.0 [VERIFIED: local command] | Required; no fallback. |
| Vitest | `npm test` planned validation | ✓ via `src/package.json` devDependency | `^3.2.0` [VERIFIED: local inspection] | Use existing test script only. |
| TypeScript compiler | `npm run typecheck` and `npm run build` planned validation | ✓ via `src/package.json` devDependency | `^5.8.0` [VERIFIED: local inspection] | Use existing scripts only. |
| GitHub Actions / CI config | CI audit | ✗ | No YAML workflow files found in repo glob. [VERIFIED: local inspection] | Document absence; inspect npm scripts and hooks risk instead. |
| Git hooks | Generated artifact audit | ✗ | No `.git/hooks/*` files found by glob. [VERIFIED: local inspection] | Document absence; still check worktree dirty generated artifacts. |

**Missing dependencies with no fallback:** none for research/planning; execution still requires local corpus availability for actual smoke compile, because `DEFAULT_PATHS.corpusPath` is `data/enriched_materials.json` and that file is described as gitignored in README. [CITED: README.md]

**Missing dependencies with fallback:** CI config and Git hooks were not found; Plan 13-03 can document absence and focus on npm scripts plus observed `graphify-out/*` dirty state. [VERIFIED: local inspection]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `^3.2.0` via `src/package.json`. [VERIFIED: local inspection] |
| Config file | none found in requested inspection scope; tests run through `npm test` script. [VERIFIED: local inspection] |
| Quick run command | `cd src && npm test -- tests/curation/v1_v2_comparison.test.ts tests/curation/taxonomy_seed_v2.test.ts tests/cli/compile.test.ts` (planned later, not run during research). [VERIFIED: local inspection] |
| Full suite command | `cd src && npm test` (planned later, not run during research). [VERIFIED: local inspection] |
| Typecheck command | `cd src && npm run typecheck` (planned later, not run during research). [VERIFIED: local inspection] |
| Build command | `cd src && npm run build` (planned later, not run during research). [VERIFIED: local inspection] |

### Phase Requirements → Test / Evidence Map

| Req ID | Behavior | Test Type | Automated Command / Evidence | File Exists? |
|--------|----------|-----------|------------------------------|--------------|
| POST-01 | In-repo consumers/default references inventoried and classified. [CITED: .planning/REQUIREMENTS.md] | audit | `rg -n "DEFAULT_PATHS|taxonomy-seed\.v1\.json|taxonomy-seed\.v2\.json|curated_relations\.v1\.json|curated_relations\.v2\.json|accord_map\.v1\.json|accord_map\.v2\.json|data/compiled/v1|data/compiled/v2|version: 1\.0\.0|version: 2\.0\.0|npm run compile|--seed|--relations|--accords|--out|--version" README.md src .planning` | ❌ Wave 0 artifact `13-01-CONSUMER-INVENTORY.md` needed. |
| POST-02 | Default CLI behavior points coherently to v2. [CITED: .planning/REQUIREMENTS.md] | smoke + assertion | `cd src && node -e "import('./dist/cli/parse_args.js').then(({DEFAULT_PATHS})=>{const expected={seedPath:'data/taxonomy/taxonomy-seed.v2.json',relationsPath:'data/inference/curated_relations.v2.json',accordsPath:'data/inference/accord_map.v2.json',outputDir:'data/compiled/v2',version:'2.0.0'}; for (const [k,v] of Object.entries(expected)) if (DEFAULT_PATHS[k]!==v) throw new Error(k+'='+DEFAULT_PATHS[k]); console.log('defaults v2 ok')})"` plus default-v2 `/tmp` compile. | ✅ source/test exists; ❌ smoke evidence artifact needed. |
| POST-03 | Explicit v1 fallback remains usable and documented. [CITED: .planning/REQUIREMENTS.md] | smoke | `cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z` | ✅ command documented; ❌ Phase 13 smoke evidence artifact needed. |
| POST-04 | v1/v2 artifact sets present, versioned and not overwritten. [CITED: .planning/REQUIREMENTS.md] | artifact audit + diff | `test -f data/compiled/v1/taxonomy.json ...` and JSON version checks; `git diff --exit-code -- data/compiled/v1 data/compiled/v2` | ✅ six artifact files found; ❌ Phase 13 evidence artifact needed. |
| POST-05 | Docs align on v2 default and v1 fallback. [CITED: .planning/REQUIREMENTS.md] | audit | Compare `README.md`, `src/cli/compile.ts` help text, Phase 12 release notes and Phase 13 context against blocking inconsistency list. | ✅ docs exist; ❌ audit artifact needed. |
| POST-06 | Protected taxonomy/inference/alias sources stay unchanged. [CITED: .planning/REQUIREMENTS.md] | diff gate | `git diff --exit-code -- data/taxonomy/taxonomy-seed.v2.json data/inference/curated_relations.v2.json data/inference/accord_map.v2.json data/taxonomy/descriptor_aliases.seed.json src/cli/parse_args.ts` | ✅ paths exist by context/source inspection; ❌ evidence artifact needed. |
| POST-07 | `graphify-out/*` policy decided and documented. [CITED: .planning/REQUIREMENTS.md] | generated-artifact audit | `git status --short -- graphify-out` and policy table in `13-03-GENERATED-ARTIFACT-POLICY.md` | ✅ graphify-out files found; ❌ policy artifact needed. |
| POST-08 | Risks and Phase 14 backlog captured without curation execution. [CITED: .planning/REQUIREMENTS.md] | checklist/backlog | `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` with statuses `pass`, `accepted_with_policy`, `follow_up`, `blocker`. | ❌ closure artifact needed. |

### Sampling Rate

- **Per task commit:** Run protected diff checks for the paths touched by that task; stage only explicit Phase 13 artifacts. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- **Per wave merge:** Run planned quick command plus `git status --short` and `git status --short -- graphify-out`. [VERIFIED: local command]
- **Phase gate:** `cd src && npm run typecheck`, `cd src && npm test`, `cd src && npm run build`, default-v2 `/tmp` smoke, explicit-v1 `/tmp` smoke, and full protected diff gate. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

### Wave 0 Gaps

- [ ] `13-01-CONSUMER-INVENTORY.md` — covers POST-01 and POST-05. [CITED: user prompt]
- [ ] `13-02-SMOKE-VALIDATION.md` — covers POST-02, POST-03, POST-04 and POST-06. [CITED: user prompt]
- [ ] `13-03-GENERATED-ARTIFACT-POLICY.md` — covers POST-07 and generated artifact contamination. [CITED: user prompt]
- [ ] `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` — covers POST-08 and final release confidence boundary. [CITED: user prompt]
- [ ] Ensure `cd src && npm run build` precedes any Node import from `dist/cli/parse_args.js` if `dist/` is not current. [VERIFIED: local inspection]

### Protected Diff Checks

Planned execution must run this before and after smoke compiles and before any commit: [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

```bash
git diff --exit-code -- \
  data/compiled/v1 data/compiled/v2 \
  data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json \
  data/taxonomy/descriptor_aliases.seed.json \
  data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json \
  data/inference/accord_map.v1.json data/inference/accord_map.v2.json \
  src/cli/parse_args.ts
```

### Planned Smoke Output Assertions

For both `/tmp/opencode/taxonomy-phase13-smoke/default-v2` and `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback`, planned execution should assert these files exist: `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

Default-v2 smoke should assert `taxonomy.json.version = 2.0.0`; explicit-v1 fallback should assert `taxonomy.json.version = 1.0.0`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]

## Security Domain

Phase 13 has no authentication, session, access-control, cryptography or network/API surface changes; its main security/control risk is supply-chain-free execution discipline, protected path preservation and generated-artifact commit hygiene. [VERIFIED: local inspection]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth surface in Phase 13. [VERIFIED: local inspection] |
| V3 Session Management | no | No session surface in Phase 13. [VERIFIED: local inspection] |
| V4 Access Control | no | No runtime access-control surface in Phase 13. [VERIFIED: local inspection] |
| V5 Input Validation | yes | Existing CLI argument validation, output schema validation and quality gates; Phase 13 validates behavior but should not alter validators. [VERIFIED: local inspection] |
| V6 Cryptography | no | No cryptographic feature in Phase 13. [VERIFIED: local inspection] |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Accidental protected artifact overwrite | Tampering | `/tmp` output override plus `git diff --exit-code -- protected paths`. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| Generated artifact commit contamination | Tampering / Repudiation | Explicit staging only and `graphify-out/*` policy. [VERIFIED: local command] |
| Misleading release docs | Repudiation / Information integrity | Structured docs consistency audit and blocking inconsistency rules. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md] |
| Unplanned dependency install | Supply chain | No new packages; if proposed, require package legitimacy gate before install. [ASSUMED] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md` — Phase 13 decisions, boundaries, search targets, smoke policies, Graphify policy and checklist shape. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md]
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-PREFLIGHT.md` — non-executable boundary and required planning coverage. [CITED: .planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-PREFLIGHT.md]
- `.planning/REQUIREMENTS.md` — POST-01 through POST-08 requirement text. [CITED: .planning/REQUIREMENTS.md]
- `.planning/ROADMAP.md` and `.planning/STATE.md` — current v2 default state and Phase 13 status. [CITED: .planning/STATE.md]
- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-RELEASE-MIGRATION-NOTES.md` — v2 default, official artifacts, rollback and explicit v1 fallback command. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-RELEASE-MIGRATION-NOTES.md]
- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-5-ROLLBACK-DRY-RUN.md` — rollback dry-run evidence and explicit v1 compile metadata. [CITED: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-5-ROLLBACK-DRY-RUN.md]
- `src/cli/parse_args.ts` and `src/cli/compile.ts` — current DEFAULT_PATHS and output resolution behavior. [VERIFIED: local inspection]
- `src/package.json` — scripts and devDependencies. [VERIFIED: local inspection]
- `src/tests/curation/v1_v2_comparison.test.ts`, `src/tests/curation/taxonomy_seed_v2.test.ts`, `src/tests/cli/compile.test.ts` — existing test patterns relevant to Phase 13 validation. [VERIFIED: local inspection]
- `README.md` — user-facing current taxonomy status. [VERIFIED: local inspection]

### Secondary (MEDIUM confidence)

- `git status --short` — current worktree dirty state, including preexisting `graphify-out/*` modifications and untracked Phase 13 directory. [VERIFIED: local command]
- Local tool probes for Node.js, npm and git versions. [VERIFIED: local command]

### Tertiary (LOW confidence)

- None used for Phase 13 research; no web/package ecosystem research was required because the phase is project-local and dependency-free. [VERIFIED: local inspection]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — verified from local `src/package.json`, README and local tool version probes. [VERIFIED: local inspection]
- Architecture: HIGH — derived from explicit Phase 13/12 planning docs and inspected CLI source. [VERIFIED: local inspection]
- Pitfalls: HIGH — grounded in Phase 13 locked decisions, current `compile.ts` output behavior and current dirty `graphify-out/*` worktree state. [VERIFIED: local command]
- Validation architecture: HIGH for commands to plan; not executed during research per user constraint. [CITED: user prompt]

**Research date:** 2026-05-25  
**Valid until:** 2026-06-24, unless Phase 13 context, CLI defaults, package scripts or Graphify policy change first. [ASSUMED]
