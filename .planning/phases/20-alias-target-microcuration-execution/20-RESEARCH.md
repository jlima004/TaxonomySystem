# Phase 20: Alias Target Microcuration Execution - Research

**Researched:** 2026-05-26  
**Domain:** Taxonomy seed v2 microcuration / alias target integrity  
**Confidence:** HIGH for repo-state evidence; MEDIUM for future execution sequencing

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

Phase 20 starts from the completed Phase 19 planning package and narrows the next possible action to a controlled alias target microcuration. The preferred execution candidate is `petit grain -> petitgrain`, because `petitgrain` exists in compiled v2 as a corpus candidate with frequency 52 in `citrus_fresh`, while still being absent from `taxonomy-seed.v2.json` as a curated descriptor. [CITED: .planning/phases/20-alias-target-microcuration-execution/20-CONTEXT.md:6-10]

The second absent target, `ylang ylang -> ylang_ylang`, remains lower confidence for immediate seed promotion because Phase 19 found `ylang_ylang` absent from seed v1, seed v2, compiled v1 and compiled v2. It is currently preserved only by the legacy alias exception mechanism. Phase 20 therefore treats it as an interim `accepted_exception` unless the user explicitly authorizes stronger curation. [CITED: .planning/phases/20-alias-target-microcuration-execution/20-CONTEXT.md:8-10]

### the agent's Discretion

Plan the future execution mechanics for Option 1 only: add `petitgrain` as a curated descriptor in `data/taxonomy/taxonomy-seed.v2.json` under family `citrus`, subfamily `citrus_fresh`; preserve `ylang ylang -> ylang_ylang` as `accepted_exception_interim`; do not authorize or perform mutation during research. [CITED: user phase_scope]

### Deferred Ideas (OUT OF SCOPE)

Do not plan `ylang_ylang` add_target execution in Phase 20; it requires separate explicit approval. Do not publish or refresh official `data/compiled/v2` artifacts without a separate explicit plan. [CITED: .planning/REQUIREMENTS.md:150-156] [CITED: .planning/ROADMAP.md:776-781]

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CUR20-01 | Plan future addition of `petitgrain` as a curated seed v2 descriptor in `citrus` / `citrus_fresh` without executing mutation. [CITED: .planning/REQUIREMENTS.md:150] | Evidence confirms seed absence and compiled candidate presence/frequency/subfamily. [CITED: data/taxonomy/taxonomy-seed.v2.json:60-72] [CITED: data/compiled/v2/taxonomy.json:531-536] |
| CUR20-02 | Preserve `ylang ylang -> ylang_ylang` as `accepted_exception_interim`; require separate approval for `ylang_ylang` add_target. [CITED: .planning/REQUIREMENTS.md:151] | Existing test-level legacy preservation includes `ylang ylang`. [CITED: src/tests/curation/alias_seed_v2.test.ts:38-45] |
| CUR20-03 | Define future execution allowlist and persisted approval artifact. [CITED: .planning/REQUIREMENTS.md:152] | Phase 19 requires allowlist and persisted curatorial approval before mutation. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-VALIDATION.md:93-101] |
| CUR20-04 | Define rollback requirements. [CITED: .planning/REQUIREMENTS.md:153] | Phase 19 rollback pattern requires snapshots, exact restore, tests, and guard checks. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-PATTERNS.md:126-135] |
| CUR20-05 | Define alias target integrity and seed descriptor integrity validation. [CITED: .planning/REQUIREMENTS.md:154] | Existing alias tests enforce target existence or legacy preservation, and seed tests enforce naming, duplicates, no empty subfamilies, and traceability. [CITED: src/tests/curation/alias_seed_v2.test.ts:132-174] [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:279-307] |
| CUR20-06 | Define future safety guard execution and targeted tests without running them now. [CITED: .planning/REQUIREMENTS.md:155] | `safety:guard`, `test`, `build`, `typecheck`, and compile scripts exist; none were executed during this research. [CITED: src/package.json:6-14] |
| CUR20-07 | Define `/tmp` compile-only validation if needed and block official compiled v2 publication without separate plan. [CITED: .planning/REQUIREMENTS.md:156] | CLI supports `--out` override, while defaults point to official `data/compiled/v2`; future compile validation must override `--out` to `/tmp`. [CITED: src/cli/parse_args.ts:15-23] [CITED: src/cli/parse_args.ts:33-43] |

</phase_requirements>

## Summary

Phase 20 should be planned as a **single-file seed microcuration**: a future approved execution may add `petitgrain` to the existing `citrus` → `citrus_fresh` descriptor array in `data/taxonomy/taxonomy-seed.v2.json`, and should not mutate `descriptor_aliases.seed.json` for Option 1. [CITED: data/taxonomy/taxonomy-seed.v2.json:60-72] [CITED: data/taxonomy/descriptor_aliases.seed.json:1-13]

The decisive evidence is internal and exact: `petitgrain` is absent from the seed v2 `citrus_fresh` descriptors, but present in official compiled v2 as `source: "corpus"`, `status: "candidate"`, `review_required: true`, `corpus_derived: true`, and `frequency: 52`. [CITED: data/taxonomy/taxonomy-seed.v2.json:64-71] [CITED: data/compiled/v2/taxonomy.json:531-536]

**Primary recommendation:** Plan Option 1 as `add_target(petitgrain)` to seed v2 only, gated by persisted approval, exact allowlist, rollback snapshot, alias/seed integrity tests, and optional `/tmp` compile-only validation; do not publish official `data/compiled/v2` in the same plan. [CITED: .planning/ROADMAP.md:768-781]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Curated descriptor truth | Data / Seed | Compiler | `taxonomy-seed.v2.json` is the curated hierarchy input; compiled artifacts materialize outputs from inputs. [CITED: .planning/PROJECT.md:77-91] |
| Alias target integrity | Data / Seed | Test suite | Alias seed maps source strings to canonical descriptors; tests enforce target presence or legacy exception. [CITED: data/taxonomy/descriptor_aliases.seed.json:1-13] [CITED: src/tests/curation/alias_seed_v2.test.ts:132-174] |
| Future validation execution | Tooling / CLI | `/tmp` filesystem | CLI defaults target official `data/compiled/v2`; compile-only validation must override `--out` to avoid publication. [CITED: src/cli/parse_args.ts:15-23] [CITED: src/cli/parse_args.ts:33-43] |
| Safety boundary | Git / local guard | Planner allowlist | Existing guard is non-mutating and blocks protected path diffs/staging, so future seed mutation needs explicit allowlist handling and cannot treat post-mutation guard failure as surprising. [CITED: scripts/check-safety-guards.sh:15-17] [CITED: scripts/check-safety-guards.sh:43-64] |

## Project Constraints (from AGENTS.md)

No `AGENTS.md` file exists at the project root, so no additional project-specific directives were loaded from that file. [VERIFIED: glob]

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Node.js + TypeScript project tooling | Project uses TypeScript `^5.8.0` | Strict TypeScript source and tests | Project constraint requires Node.js + TypeScript strict and functional style. [CITED: .planning/PROJECT.md:104-110] [CITED: src/package.json:16-20] |
| Vitest | `^3.2.0` | Targeted alias, seed, normalization tests | Existing test suite is Vitest-based. [CITED: src/package.json:13-20] |
| Existing CLI compiler | In-repo `dist/cli/compile.js` after build | Optional `/tmp` compile-only validation | CLI supports explicit seed, aliases, corpus, inference inputs, output dir, version, and generated timestamp flags. [CITED: src/cli/parse_args.ts:33-43] |
| `scripts/check-safety-guards.sh` / `npm run safety:guard` | In-repo script | Pre-mutation and rollback safety boundary | The guard is non-mutating and reads git state only. [CITED: scripts/check-safety-guards.sh:15-17] [CITED: src/package.json:12] |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `git diff --name-only` allowlist audit | Confirm only approved paths changed | Required after future mutation because the safety guard intentionally reports protected path diffs. [CITED: scripts/check-safety-guards.sh:54-64] |
| `/tmp` output directory | Temporary compile artifacts | Use only if future execution needs compile validation without publishing official artifacts. [CITED: .planning/REQUIREMENTS.md:156] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Add `petitgrain` to seed v2 | Mutate alias target/remap/remove alias | Not aligned with Option 1 and loses the strong corpus-candidate evidence for the canonical target. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-01-PLAN.md:69-78] |
| Official `data/compiled/v2` refresh | `/tmp` compile-only validation | Official publication is explicitly blocked without a separate plan. [CITED: .planning/ROADMAP.md:776-781] |
| `ylang_ylang` add_target | Preserve accepted exception | `ylang_ylang` has lower immediate confidence and requires separate explicit approval. [CITED: .planning/phases/20-alias-target-microcuration-execution/20-CONTEXT.md:8-10] |

**Installation:** No external packages should be installed for this phase. [CITED: .planning/PROJECT.md:124-126]

## Package Legitimacy Audit

No package installation is recommended for Phase 20 planning or future Option 1 execution. The package legitimacy gate is not applicable. [CITED: src/package.json:16-20]

## Exact Evidence: `petitgrain` Future `add_target` Candidate

| Evidence Item | Exact Finding | Planning Interpretation |
|---------------|---------------|-------------------------|
| Alias exists | `"petit grain": "petitgrain"` is present in `descriptor_aliases.seed.json`. [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8] | The alias seed does not need Option 1 mutation because it already maps the spaced alias to the intended canonical target. |
| Seed v2 absence | `citrus_fresh` descriptors are `lemon`, `bergamot`, `sweet_orange`, `grapefruit`; `petitgrain` is absent. [CITED: data/taxonomy/taxonomy-seed.v2.json:64-71] | Future execution should add exactly one descriptor to this array. |
| Compiled candidate status | `petitgrain` appears with `source: "corpus"`, `frequency: 52`, `status: "candidate"`, `review_required: true`, `corpus_derived: true`. [CITED: data/compiled/v2/taxonomy.json:531-536] | The descriptor is already observed by the pipeline but is not curated seed truth. |
| Subfamily | Phase 19 and Phase 20 context record `petitgrain` as `citrus_fresh`. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-RESEARCH.md:64-79] [CITED: .planning/phases/20-alias-target-microcuration-execution/20-CONTEXT.md:14-17] | Future seed insertion target is `families[id=citrus].subfamilies[id=citrus_fresh].descriptors`. |
| Phase 19 recommendation | `petit grain -> petitgrain` is recommended as future `add_target` because frequency is 52 and family/subfamily exist. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-01-PLAN.md:95-104] | Planner should not reopen remap/remove alternatives unless user changes scope. |

## Existing Seed v2 Shape / Future Patch Pattern

Current seed v2 shape is a top-level object with `version`, `metadata`, and `families`; each family has `id`, `name`, `subfamilies`; each subfamily has `id`, `name`, and `descriptors`. [CITED: data/taxonomy/taxonomy-seed.v2.json:1-8] [CITED: data/taxonomy/taxonomy-seed.v2.json:60-72]

Future Option 1 patch pattern should be a minimal descriptor-array addition only:

```json
{
  "id": "citrus_fresh",
  "name": "Fresh Citrus",
  "descriptors": [
    "lemon",
    "bergamot",
    "sweet_orange",
    "grapefruit",
    "petitgrain"
  ]
}
```

The future patch should preserve existing order and append `petitgrain` after current `citrus_fresh` descriptors unless the execution plan explicitly defines alphabetical ordering. [ASSUMED]

## Descriptor Alias Seed Mutation Decision

For Option 1, `descriptor_aliases.seed.json` should remain unchanged because the intended alias mapping already exists as `"petit grain": "petitgrain"`. [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8]

After `petitgrain` is added to seed v2 in a future execution, existing alias target integrity tests can pass for `petit grain -> petitgrain` through `descriptors.has(target)` rather than legacy-preservation fallback. [CITED: src/tests/curation/alias_seed_v2.test.ts:132-144]

The planner should **not** include a code mutation to remove `petit grain` from `existingApprovedAliases` in `alias_seed_v2.test.ts` unless the user explicitly expands scope to test cleanup; the current phase scope is seed add_target only. [CITED: user phase_scope] [CITED: src/tests/curation/alias_seed_v2.test.ts:38-45]

## Legacy Exception Preservation: `ylang ylang -> ylang_ylang`

`ylang ylang -> ylang_ylang` remains in `descriptor_aliases.seed.json` and in the `existingApprovedAliases` legacy map. [CITED: data/taxonomy/descriptor_aliases.seed.json:7] [CITED: src/tests/curation/alias_seed_v2.test.ts:38-45]

Phase 19 found `ylang_ylang` absent from seed v1, seed v2, compiled v1, and compiled v2, and preserved only by the legacy exception. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-RESEARCH.md:47-63]

Future Phase 20 execution should document `ylang ylang -> ylang_ylang` as `accepted_exception_interim`, not as resolved, and should require separate explicit approval for any future `ylang_ylang` add_target action. [CITED: .planning/REQUIREMENTS.md:151]

## Future Execution Allowlist Recommendation

| Path | Future Option 1 Permission | Rationale |
|------|----------------------------|-----------|
| `.planning/phases/20-alias-target-microcuration-execution/20-FINAL-APPROVAL.md` or equivalent approval artifact | Allowed / required | Persisted approval is required before mutation. [CITED: .planning/REQUIREMENTS.md:152] |
| `data/taxonomy/taxonomy-seed.v2.json` | Allowed after approval | The single intended mutation is adding `petitgrain` under `citrus/citrus_fresh`. [CITED: .planning/REQUIREMENTS.md:150] |
| `data/taxonomy/descriptor_aliases.seed.json` | Not allowed for Option 1 | Existing alias already maps `petit grain` to `petitgrain`. [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8] |
| `data/compiled/v2/*` | Not allowed | Official publication is blocked without separate plan. [CITED: .planning/ROADMAP.md:776-781] |
| `data/compiled/v1/*` | Never allowed | v1 remains preserved baseline/archive. [CITED: .planning/ROADMAP.md:249-263] |
| `data/inference/*` | Not allowed | Option 1 has no relation/accord/inference mutation. [CITED: .planning/ROADMAP.md:776-781] |
| `src/cli/parse_args.ts`, `scripts/check-safety-guards.sh`, `src/package.json`, `graphify-out/*` | Not allowed | Phase 20 hard boundaries protect these paths. [CITED: .planning/ROADMAP.md:776-781] |

## Persisted Approval Artifact Requirements

Before any future mutation, create a persisted approval artifact with at least:

| Field | Required Value / Rule |
|-------|-----------------------|
| `approval_id` | Stable ID such as `phase20-petitgrain-add-target-approval`. [ASSUMED] |
| `manual_approval` | `approved`. Existing seed tests parse this field for prior approvals. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:124-153] |
| `primary_disposition` | `promote_to_seed` or `add_target`; planner must keep one canonical term across Phase 20 artifacts. [ASSUMED] |
| `family_id` | `citrus`. [CITED: .planning/REQUIREMENTS.md:150] |
| `subfamily_id` | `citrus_fresh`. [CITED: .planning/REQUIREMENTS.md:150] |
| `descriptor_id` | `petitgrain`. [CITED: .planning/REQUIREMENTS.md:150] |
| `alias_preserved` | `petit grain -> petitgrain` remains unchanged. [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8] |
| `ylang_policy` | `accepted_exception_interim`; no `ylang_ylang` seed mutation. [CITED: .planning/REQUIREMENTS.md:151] |
| `evidence` | Include compiled v2 candidate status/frequency/subfamily and seed absence. [CITED: data/compiled/v2/taxonomy.json:531-536] [CITED: data/taxonomy/taxonomy-seed.v2.json:64-71] |
| `rollback_plan` | Link to snapshot/restore steps. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-PATTERNS.md:126-135] |
| `publication_boundary` | No official `data/compiled/v2` publication in Option 1. [CITED: .planning/REQUIREMENTS.md:156] |

## Rollback Requirements

1. Capture the exact pre-mutation content or git blob for `data/taxonomy/taxonomy-seed.v2.json` before adding `petitgrain`. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-01-PLAN.md:140-158]
2. Restore rollback by reverting only the `petitgrain` descriptor addition in `taxonomy-seed.v2.json`; `descriptor_aliases.seed.json` should have no Option 1 delta. [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8]
3. Verify rollback by confirming no `petitgrain` seed descriptor remains under `citrus_fresh`, while the alias file still contains `petit grain -> petitgrain`. [CITED: data/taxonomy/taxonomy-seed.v2.json:64-71] [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8]
4. After rollback, `npm run safety:guard` should be expected to pass if no protected path diff remains. [CITED: scripts/check-safety-guards.sh:54-69] [CITED: src/package.json:12]
5. Do not rollback by regenerating official compiled artifacts; optional compile validation remains `/tmp` only. [CITED: .planning/REQUIREMENTS.md:156]

## Alias Target Integrity Validation Requirements

Future execution should validate these invariants:

| Invariant | Expected After Future Option 1 |
|-----------|--------------------------------|
| `petit grain -> petitgrain` target exists in seed v2 | PASS by descriptor presence after add_target. [CITED: src/tests/curation/alias_seed_v2.test.ts:132-144] |
| `descriptor_aliases.seed.json` remains structurally valid | PASS via `validateAliasSeed`. [CITED: src/tests/curation/alias_seed_v2.test.ts:123-130] |
| Alias keys do not duplicate seed descriptors | `petit grain` remains an alias key and does not equal `petitgrain`. [CITED: src/tests/curation/alias_seed_v2.test.ts:147-156] |
| `ylang ylang -> ylang_ylang` remains accepted exception | PASS via existing legacy preservation, not via seed descriptor presence. [CITED: src/tests/curation/alias_seed_v2.test.ts:38-45] [CITED: src/tests/curation/alias_seed_v2.test.ts:159-174] |
| No new alias points to candidate/deferred/ambiguous target | No alias mutation should occur in Option 1. [CITED: data/taxonomy/descriptor_aliases.seed.json:1-13] |

## Seed Descriptor Integrity Validation Requirements

Future execution should validate these seed invariants:

| Invariant | Expected After Future Option 1 |
|-----------|--------------------------------|
| Seed remains `version: "2.0.0"` | Version should not change for a microcuration unless separately approved. [CITED: data/taxonomy/taxonomy-seed.v2.json:1-7] |
| `petitgrain` is lower snake-case ASCII | `petitgrain` matches the seed test regex pattern. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:88-89] |
| No global descriptor duplicate | `petitgrain` must appear once in all seed descriptor arrays. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:177-187] |
| No empty subfamilies | Existing subfamily remains non-empty. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:189-195] |
| Family and subfamily are existing/in-scope | `citrus` is an in-scope family, and `citrus_fresh` already exists in seed v2. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:56-67] [CITED: data/taxonomy/taxonomy-seed.v2.json:60-72] |
| Approval traceability is preserved | Existing tests currently parse the Phase 8 workbook for v2 additions; if Phase 20 wants automated approval traceability for `petitgrain`, planner must add a test/workbook update in a separately approved scope. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:197-215] [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:279-307] |

## Safety Guard Usage in Future Execution

The safety guard is non-mutating and blocks staged or dirty changes under `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, and `src/cli/parse_args.ts`; it allows dirty working-tree `graphify-out/*`. [CITED: scripts/check-safety-guards.sh:15-17] [CITED: scripts/check-safety-guards.sh:43-64]

Recommended future use:

1. Run `npm run safety:guard` before mutation to prove no pre-existing protected-path drift. [CITED: src/package.json:12]
2. After the seed mutation, use an explicit allowlist diff audit rather than expecting the guard to pass, because the guard will report `PROTECTED_DIFF` for the intentionally changed seed file. [CITED: scripts/check-safety-guards.sh:54-64]
3. Run `npm run safety:guard` after rollback or after returning to a no-protected-diff state. [CITED: scripts/check-safety-guards.sh:66-72]
4. Do not edit `scripts/check-safety-guards.sh` to accommodate this phase. [CITED: .planning/ROADMAP.md:776-781]

## Targeted Future Test Commands (Do Not Run During Planning)

From `src/` in a future execution, run targeted tests only after approved mutation:

```bash
npm run test -- src/tests/curation/alias_seed_v2.test.ts
npm run test -- src/tests/curation/taxonomy_seed_v2.test.ts
npm run test -- src/tests/normalization.test.ts src/tests/normalization/index.test.ts src/tests/normalization/separators.test.ts src/tests/normalization/punctuation.test.ts
```

These commands target alias integrity, seed integrity, and normalization/separator behavior relevant to `petit grain`, `petitgrain`, and the preserved `ylang ylang` exception. [CITED: src/tests/curation/alias_seed_v2.test.ts:123-199] [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:279-307] [CITED: src/tests/normalization.test.ts:15-18] [CITED: src/tests/normalization/index.test.ts:28-58]

## `/tmp` Compile-Only Validation Strategy

If future execution needs compile validation, it must compile to `/tmp` and must not publish to official `data/compiled/v2`. [CITED: .planning/REQUIREMENTS.md:156]

Future command pattern from repo root after build availability is confirmed:

```bash
node src/dist/cli/compile.js \
  --seed data/taxonomy/taxonomy-seed.v2.json \
  --aliases data/taxonomy/descriptor_aliases.seed.json \
  --corpus data/enriched_materials.json \
  --relations data/inference/curated_relations.v2.json \
  --accords data/inference/accord_map.v2.json \
  --noise data/inference/semantic_noise.v1.json \
  --out /tmp/taxonomy-phase20-v2-compile \
  --version 2.0.0 \
  --generated-at 2026-01-01T00:00:00.000Z
```

The planner must verify the correct built CLI path before using this command because package scripts run from `src/` and compile output path may depend on the TypeScript configuration. [ASSUMED]

Official `data/compiled/v2` publication remains prohibited unless a separate explicit plan authorizes it. [CITED: .planning/ROADMAP.md:776-781]

## Architecture Patterns

### System Architecture Diagram

```text
Persisted approval artifact
        |
        v
Allowlist gate (seed v2 only)
        |
        v
data/taxonomy/taxonomy-seed.v2.json
        |  add descriptor: citrus/citrus_fresh/petitgrain
        v
Alias integrity tests -----> ylang legacy exception remains documented
        |
        v
Seed integrity tests
        |
        v
Optional /tmp compile-only validation
        |
        v
No official data/compiled/v2 publication in Option 1
```

### Recommended Project Structure

```text
.planning/phases/20-alias-target-microcuration-execution/
├── 20-RESEARCH.md              # this artifact
├── 20-PATTERNS.md              # future planning pattern map
├── 20-VALIDATION.md            # future Nyquist validation contract
├── 20-FINAL-APPROVAL.md        # future persisted approval before mutation
└── 20-01-PLAN.md               # future executable plan, still non-mutating until approved

data/taxonomy/
├── taxonomy-seed.v2.json       # only future Option 1 data mutation
└── descriptor_aliases.seed.json # unchanged for Option 1
```

### Pattern 1: Add Target Without Alias Mutation

**What:** Add the absent canonical target to seed truth while preserving the existing alias map. [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8]

**When to use:** Use when an alias target is absent from seed but exists as a corpus candidate with approved family/subfamily placement. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-PATTERNS.md:41-50]

**Example:** `petit grain -> petitgrain` becomes target-valid because `petitgrain` is added to `citrus_fresh`; no alias remap is needed. [CITED: data/compiled/v2/taxonomy.json:531-536]

### Anti-Patterns to Avoid

- **Mutating aliases for Option 1:** The alias map already contains the intended mapping, so alias mutation adds risk without solving the selected problem. [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8]
- **Treating corpus candidate as already curated:** Compiled `source: "corpus"` and `status: "candidate"` is evidence, not seed truth. [CITED: data/compiled/v2/taxonomy.json:531-536]
- **Publishing official compiled v2 in the microcuration plan:** This violates the explicit Phase 20 publication boundary. [CITED: .planning/REQUIREMENTS.md:156]
- **Resolving `ylang_ylang` opportunistically:** Phase 20 scope preserves it as interim exception unless explicitly re-approved. [CITED: .planning/REQUIREMENTS.md:151]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Alias seed validation | Custom JSON walker in plan | Existing `alias_seed_v2.test.ts` | It already validates structure, target presence/exception, duplicate alias keys, deferred/candidate targets, and deterministic compile. [CITED: src/tests/curation/alias_seed_v2.test.ts:123-199] |
| Seed shape validation | Manual checklist only | Existing `taxonomy_seed_v2.test.ts` plus explicit approval artifact | It already checks version, seed validation, in-scope families, naming, duplicates, empty subfamilies, and traceability. [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:279-307] |
| Protected-path safety | Custom destructive cleanup | Existing non-mutating guard + allowlist diff audit | Guard is explicitly non-mutating and reports all violations. [CITED: scripts/check-safety-guards.sh:15-17] [CITED: scripts/check-safety-guards.sh:29-64] |
| Compile publication | Direct default compile | Explicit `--out /tmp/...` compile-only run | CLI defaults publish to `data/compiled/v2`; `--out` avoids official artifact mutation. [CITED: src/cli/parse_args.ts:15-23] [CITED: src/cli/parse_args.ts:33-43] |

**Key insight:** Option 1 is small because the alias already exists; the only semantic gap is that its canonical target is not curated seed truth. [CITED: data/taxonomy/descriptor_aliases.seed.json:7-8] [CITED: data/taxonomy/taxonomy-seed.v2.json:64-71]

## Common Pitfalls

### Pitfall 1: Running official compile by default

**What goes wrong:** `npm run compile` uses default output `data/compiled/v2`, which would mutate official artifacts. [CITED: src/package.json:9-12] [CITED: src/cli/parse_args.ts:15-23]

**How to avoid:** Use explicit CLI flags with `--out /tmp/...` only, and only in future execution. [CITED: src/cli/parse_args.ts:33-43]

### Pitfall 2: Expecting safety guard PASS after intentional seed mutation

**What goes wrong:** The guard blocks dirty protected paths under `data/taxonomy`, so intentional future seed mutation produces `PROTECTED_DIFF`. [CITED: scripts/check-safety-guards.sh:54-64]

**How to avoid:** Use guard as preflight and rollback check; use allowlist diff audit for intentional mutation. [CITED: scripts/check-safety-guards.sh:66-72]

### Pitfall 3: Treating `petitgrain` compiled candidate as curated truth before mutation

**What goes wrong:** Candidate status means review is required; the seed remains the curated source of truth. [CITED: data/compiled/v2/taxonomy.json:531-536] [CITED: .planning/PROJECT.md:77-91]

**How to avoid:** Require persisted approval and add the descriptor to seed v2 before claiming target integrity is resolved. [CITED: .planning/REQUIREMENTS.md:152-154]

### Pitfall 4: Accidentally broadening scope to `ylang_ylang`

**What goes wrong:** `ylang_ylang` lacks the compiled candidate support that `petitgrain` has and requires separate approval. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-RESEARCH.md:47-63]

**How to avoid:** Keep `ylang ylang -> ylang_ylang` documented as `accepted_exception_interim`. [CITED: .planning/REQUIREMENTS.md:151]

## Code Examples

### Existing Alias Integrity Predicate

```typescript
const isPreservedLegacyAlias = (alias: string, target: string): boolean => existingApprovedAliases[alias] === target
```

Source: [CITED: src/tests/curation/alias_seed_v2.test.ts:79]

### Existing Target Integrity Check

```typescript
expect(
  descriptors.has(target) || isPreservedLegacyAlias(alias, target),
  `${alias} points to absent canonical target ${target} without approved legacy preservation`,
).toBe(true)
```

Source: [CITED: src/tests/curation/alias_seed_v2.test.ts:139-144]

### Future Minimal Seed Diff Shape

```diff
 "descriptors": [
   "lemon",
   "bergamot",
   "sweet_orange",
-  "grapefruit"
+  "grapefruit",
+  "petitgrain"
 ]
```

Source: [CITED: data/taxonomy/taxonomy-seed.v2.json:64-71]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Legacy aliases could point to absent targets via preserved exception. | Phase 20 should resolve the `petitgrain` case by adding the target to seed truth while preserving `ylang_ylang` as an interim exception. | Phase 20 scope approved after Phase 19. [CITED: .planning/ROADMAP.md:754-781] | One absent-target case can become target-valid without alias mutation. |
| Official compiled v2 did not exist before promotion. | v2 is now default and official `data/compiled/v2` exists, so publication requires stricter plan separation. | Phase 12. [CITED: .planning/ROADMAP.md:249-272] | `/tmp` compile-only validation is safer for microcuration planning. |

**Deprecated/outdated:** Treating Phase 19's microcuration blueprint as execution authorization is outdated; Phase 19 closed planning-only and deferred actual curation to Phase 20+. [CITED: .planning/phases/19-taxonomy-v2-1-curation-planning/19-CLOSURE.md:41-49]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Future seed insertion should append `petitgrain` after current `citrus_fresh` descriptors unless an execution plan defines alphabetical ordering. | Existing Seed v2 Shape / Future Patch Pattern | Low; ordering affects diff style, not semantic content if tests do not require order. |
| A2 | Approval artifact ID can be `phase20-petitgrain-add-target-approval`. | Persisted Approval Artifact Requirements | Low; naming can be adjusted by planner. |
| A3 | Planner must verify built CLI path before compile-only command. | `/tmp` Compile-Only Validation Strategy | Medium; wrong path would fail future validation command. |

## Open Questions (RESOLVED)

1. **Where should Phase 20 persisted approval live?**
   - RESOLVED: Use `.planning/phases/20-alias-target-microcuration-execution/20-FINAL-APPROVAL.md` as the Phase 20 persisted approval artifact, with machine-readable fields matching existing approval parsing conventions. [ASSUMED]
   - What we know: Phase 20 requires persisted approval before mutation. [CITED: .planning/REQUIREMENTS.md:152]
   - What's unclear: Whether the preferred artifact name is `20-FINAL-APPROVAL.md`, a workbook entry, or both. [ASSUMED]
   - Recommendation: Planner should create `20-FINAL-APPROVAL.md` and include machine-readable fields matching existing approval parsing conventions. [ASSUMED]

2. **Should tests be updated to remove `petit grain` from legacy exceptions after target is curated?**
   - RESOLVED: Do not include test code mutation in Option 1; rely on descriptor presence for `petit grain -> petitgrain` while preserving the current legacy map unless separate approval expands scope. [CITED: user phase_scope] [CITED: src/tests/curation/alias_seed_v2.test.ts:38-45]
   - What we know: Option 1 only authorizes seed add_target planning, not test cleanup. [CITED: user phase_scope]
   - What's unclear: Whether future execution should tighten tests in the same phase. [ASSUMED]
   - Recommendation: Do not include test code mutation in Option 1; rely on descriptor presence while preserving current legacy map. [CITED: src/tests/curation/alias_seed_v2.test.ts:38-45]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| `npm` | Future `safety:guard` and targeted test scripts | Not probed during research | — | Planner should probe before execution. [ASSUMED] |
| Node.js | Future Vitest and CLI execution | Not probed during research | — | Planner should probe before execution. [ASSUMED] |
| Built `dist/cli/compile.js` | Optional `/tmp` compile-only validation | Not probed during research | — | Run build in future execution only if approved. [CITED: src/package.json:7-11] |
| `data/enriched_materials.json` | Optional compile-only validation | Not probed during research | — | Skip compile-only validation if corpus is unavailable and tests suffice. [ASSUMED] |

**Missing dependencies with no fallback:** None confirmed during research; availability was intentionally not probed with execution commands. [ASSUMED]

**Missing dependencies with fallback:** Optional compile-only validation can be skipped if no build/corpus is available and the execution plan limits validation to seed/alias tests. [ASSUMED]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `^3.2.0`. [CITED: src/package.json:13-20] |
| Config file | No config file was required to identify targeted tests; package script invokes `vitest run`. [CITED: src/package.json:13-14] |
| Quick run command | `cd src && npm run test -- src/tests/curation/alias_seed_v2.test.ts src/tests/curation/taxonomy_seed_v2.test.ts` |
| Full targeted command | `cd src && npm run test -- src/tests/curation/alias_seed_v2.test.ts src/tests/curation/taxonomy_seed_v2.test.ts src/tests/normalization.test.ts src/tests/normalization/index.test.ts src/tests/normalization/separators.test.ts src/tests/normalization/punctuation.test.ts` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CUR20-01 | `petitgrain` added as seed descriptor under `citrus/citrus_fresh` in future execution. | unit / seed integrity | `cd src && npm run test -- src/tests/curation/taxonomy_seed_v2.test.ts` | ✅ |
| CUR20-02 | `ylang ylang -> ylang_ylang` remains preserved exception. | unit / alias integrity | `cd src && npm run test -- src/tests/curation/alias_seed_v2.test.ts` | ✅ |
| CUR20-03 | Approval exists before mutation. | manual + possible unit if planner adds artifact parsing | No current automated Phase 20 approval test exists. | ❌ Wave 0 |
| CUR20-04 | Rollback restores pre-mutation seed state. | manual / git diff audit | `git diff -- data/taxonomy/taxonomy-seed.v2.json` after restore | n/a |
| CUR20-05 | Alias target and seed descriptor integrity hold. | unit | `cd src && npm run test -- src/tests/curation/alias_seed_v2.test.ts src/tests/curation/taxonomy_seed_v2.test.ts` | ✅ |
| CUR20-06 | Safety guard and targeted tests are defined. | smoke / script | `cd src && npm run safety:guard` before mutation and after rollback; targeted tests after mutation. | ✅ |
| CUR20-07 | Optional compile uses `/tmp`, not official `data/compiled/v2`. | integration / manual diff audit | Explicit CLI command with `--out /tmp/...`; verify `git diff -- data/compiled/v2` is empty. | ✅ CLI flags |

### Sampling Rate

- **Per task commit:** Do not commit data mutation until approval, allowlist, targeted tests, and diff audit are complete. [ASSUMED]
- **Per wave merge:** Run targeted alias + seed + normalization tests; run safety guard only when no protected diff is expected or after rollback. [CITED: scripts/check-safety-guards.sh:54-64]
- **Phase gate:** Confirm `petitgrain` seed presence, alias file unchanged, `ylang` exception documented, no official compiled artifacts changed, and optional `/tmp` compile output not committed. [CITED: .planning/REQUIREMENTS.md:150-156]

### Wave 0 Gaps

- [ ] `20-FINAL-APPROVAL.md` — persisted approval artifact for CUR20-03. [ASSUMED]
- [ ] Optional Phase 20-specific approval parser/test — only if planner wants automated approval traceability before mutation. [ASSUMED]
- [ ] Explicit allowlist diff checklist in `20-01-PLAN.md` — covers seed-only mutation and blocked official artifacts. [CITED: .planning/ROADMAP.md:776-781]

## Security Domain

Phase 20 has no authentication, session, access-control, cryptographic, network, or user-input runtime surface. [CITED: .planning/REQUIREMENTS.md:146-156]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Not in scope. [CITED: .planning/REQUIREMENTS.md:146-156] |
| V3 Session Management | no | Not in scope. [CITED: .planning/REQUIREMENTS.md:146-156] |
| V4 Access Control | no | Git/approval process only. [ASSUMED] |
| V5 Input Validation | yes | Existing JSON seed and alias validators/tests. [CITED: src/tests/curation/alias_seed_v2.test.ts:123-130] [CITED: src/tests/curation/taxonomy_seed_v2.test.ts:291-298] |
| V6 Cryptography | no | No cryptography in scope. [CITED: .planning/REQUIREMENTS.md:146-156] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unauthorized protected data mutation | Tampering | Persisted approval, allowlist diff audit, safety guard preflight/rollback use. [CITED: .planning/REQUIREMENTS.md:152-155] |
| Accidental official artifact publication | Tampering | `/tmp` compile-only and verify `data/compiled/v2` unchanged. [CITED: .planning/REQUIREMENTS.md:156] |
| Scope creep to `ylang_ylang` | Process integrity risk | Preserve interim exception and require separate explicit approval. [CITED: .planning/REQUIREMENTS.md:151] |

## Sources

### Primary (HIGH confidence)

- `.planning/REQUIREMENTS.md` — CUR20 requirements and non-authorization boundaries.
- `.planning/ROADMAP.md` — Phase 20 approved scope and protected paths.
- `.planning/phases/20-alias-target-microcuration-execution/20-CONTEXT.md` — Option 1 context and decisions.
- `.planning/phases/19-taxonomy-v2-1-curation-planning/19-RESEARCH.md` — alias absent-target evidence.
- `data/taxonomy/taxonomy-seed.v2.json` — current seed shape and `citrus_fresh` descriptor list.
- `data/taxonomy/descriptor_aliases.seed.json` — current alias map.
- `data/compiled/v2/taxonomy.json` — `petitgrain` compiled candidate evidence.
- `src/tests/curation/alias_seed_v2.test.ts` and `src/tests/curation/taxonomy_seed_v2.test.ts` — validation mechanics.
- `scripts/check-safety-guards.sh` and `src/package.json` — safety/test script mechanics.

### Secondary (MEDIUM confidence)

- `.planning/phases/19-taxonomy-v2-1-curation-planning/19-PATTERNS.md`, `19-VALIDATION.md`, `19-01-PLAN.md`, `19-CLOSURE.md` — prior planning patterns and recommendations.

### Tertiary (LOW confidence)

- Assumptions listed in the Assumptions Log; no external web sources were required because the phase is constrained to internal repo evidence.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from `src/package.json` and project constraints.
- Architecture: HIGH — data/control boundaries are documented in Phase 20 and source files.
- Pitfalls: HIGH for guard/default-compile behavior, MEDIUM for future sequencing because exact execution artifact names remain a planner decision.

**Research date:** 2026-05-26  
**Valid until:** 2026-06-25 or until `taxonomy-seed.v2.json`, `descriptor_aliases.seed.json`, `src/cli/parse_args.ts`, or curation tests change.
