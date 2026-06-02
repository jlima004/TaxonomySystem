# Phase 42: Low-Support Microcuration Execution - Research

**Researched:** 2026-06-02 [VERIFIED: system date]
**Domain:** Taxonomy seed data microcuration and curation-safety validation [VERIFIED: .planning/ROADMAP.md]
**Confidence:** HIGH [VERIFIED: repository files and test execution]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

## Implementation Decisions

### Approved Mutation Set
- **D-01:** Phase 42 may execute exactly these six `promote_to_seed` rows from `.planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md`: `peppermint`, `rosemary`, `cumin`, `spearmint`, `caraway`, and `opoponax`.
- **D-02:** The approved target paths are locked as:
  - `fresh_spice/fresh_spice/peppermint`
  - `green/herbal_green/rosemary`
  - `spicy/warm_spice/cumin`
  - `fresh_spice/fresh_spice/spearmint`
  - `spicy/warm_spice/caraway`
  - `amber_resinous/balsamic_resin/opoponax`
- **D-03:** No `add_alias` execution is in scope for Phase 42 because the Phase 41 matrix contains zero `add_alias` rows and zero alias rows with `mutation_allowed=true`.

### Hard Exclusions
- **D-04:** Rows with dispositions `reject`, `defer_manual_review`, `defer_future_batch`, or `needs_external_reference` must not produce taxonomy, alias, relation, accord, compiled artifact, or sidecar mutations in Phase 42.
- **D-05:** Free-text fields such as `rationale`, `evidence`, `expected_effect`, and `notes` are explanatory only. They must never be interpreted as mutation permission.
- **D-06:** Phase 42 must not create new families, subfamilies, or structural taxonomy nodes. If an implementation step would require a new family/subfamily, it is out of scope and must stop rather than improvise.

### Execution Guardrails
- **D-07:** Before mutation, downstream agents must verify that every target family and subfamily already exists in `data/taxonomy/taxonomy-seed.v2.json`. Current scout confirmed the target families/subfamilies exist.
- **D-08:** Before mutation, downstream agents must verify the six target descriptors are not already present globally in `data/taxonomy/taxonomy-seed.v2.json`; if any are already present, do not duplicate them.
- **D-09:** The likely data mutation target is `data/taxonomy/taxonomy-seed.v2.json`. Official v2.7 compiled artifact publication and closure metrics belong to Phase 43 unless Phase 42 planning explicitly limits any compile output to temporary validation only.
- **D-10:** Preserve existing curation safety patterns: explicit approval traceability, lower snake_case ASCII descriptors, no global descriptor duplicates, no empty subfamilies, deterministic validation, and no automatic promotion from frequency evidence.

### Gray Areas
- **D-11:** No remaining user-facing gray areas were identified. The user instruction and Phase 41 context already lock the executable candidate set, prohibited rows, structural boundaries, and interpretation rules.

### the agent's Discretion

No explicit `## the agent's Discretion` section exists in `42-CONTEXT.md`; implementation discretion is limited to safe planning mechanics that honor the locked decisions above. [VERIFIED: .planning/phases/42-low-support-microcuration-execution/42-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- The other 24 Phase 41 matrix rows remain non-mutating in Phase 42, including rejects, manual-review deferrals, future structural gaps, and `needs_external_reference` items.
- New families/subfamilies suggested by `expected_effect` text remain future curation work, not Phase 42 execution scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CUR-02 | Apply only decisions explicitly approved in the decision matrix: safe seed additions, aliases, rejects, or defer/manual_review. No mutation may occur without a prior recorded disposition. [VERIFIED: .planning/REQUIREMENTS.md] | The authoritative Phase 41 matrix contains exactly six `mutation_allowed=true` rows, all `promote_to_seed`; Phase 42 should add only those six descriptors to existing seed targets and mutate no alias, relation, accord, compiled, or sidecar files. [VERIFIED: .planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md; VERIFIED: python matrix audit] |
</phase_requirements>

## Summary

Phase 42 is a narrow data-only seed mutation phase: it should update `data/taxonomy/taxonomy-seed.v2.json` with exactly six approved descriptors and no other production files. [VERIFIED: .planning/phases/42-low-support-microcuration-execution/42-CONTEXT.md] The authoritative input is `41-DECISION-MATRIX.md`, where rows 06, 07, 10, 13, 14, and 15 are the only rows with `mutation_allowed=true`. [VERIFIED: .planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md; VERIFIED: python matrix audit]

Pre-mutation checks should verify that the target family/subfamily pairs already exist and that the six descriptors are absent globally. [VERIFIED: .planning/phases/42-low-support-microcuration-execution/42-CONTEXT.md] A local audit confirmed that `fresh_spice/fresh_spice`, `green/herbal_green`, `spicy/warm_spice`, and `amber_resinous/balsamic_resin` exist, and that `peppermint`, `rosemary`, `cumin`, `spearmint`, `caraway`, and `opoponax` are not present anywhere in the current seed. [VERIFIED: python seed audit]

**Primary recommendation:** Plan a single controlled data edit to append the six descriptors to existing descriptor arrays, then run curation tests, a temporary-only compile validation if needed, and safety guard checks; do not publish official `data/compiled/v2` artifacts in Phase 42. [VERIFIED: .planning/phases/42-low-support-microcuration-execution/42-CONTEXT.md; VERIFIED: npm test execution]

## Project Constraints (from AGENTS.md)

No `AGENTS.md` file exists at the repository root, so no additional AGENTS.md directives apply. [VERIFIED: Glob AGENTS.md]

Project skill directories exist under `.agents/skills/`, but no `.claude/skills/` directory was found in this repository. [VERIFIED: Read .agents/skills; VERIFIED: Glob .claude/skills/*/SKILL.md] For this phase, the relevant pattern is GSD planning/research discipline rather than invoking an implementation skill. [ASSUMED]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Approved decision extraction | Planning/data governance | Test validation | The Phase 41 matrix is the authoritative source of mutation permission, and extraction must ignore explanatory free text. [VERIFIED: 41-CONTEXT.md] |
| Taxonomy seed descriptor additions | Database / Storage | API / Backend validation | The seed JSON is the persisted curated taxonomy input consumed by loaders/compiler tests. [VERIFIED: data/taxonomy/taxonomy-seed.v2.json; VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts] |
| Alias preservation | Database / Storage | Test validation | `descriptor_aliases.seed.json` is explicitly read-only for Phase 42 because there are zero approved alias rows. [VERIFIED: 42-CONTEXT.md; VERIFIED: 41-DECISION-MATRIX.md] |
| Compiled artifact protection | Build artifacts | Validation only | Official v2.7 artifact publication belongs to Phase 43; Phase 42 may only use temporary compile output for validation. [VERIFIED: 42-CONTEXT.md; VERIFIED: .planning/ROADMAP.md] |
| Curation invariant enforcement | Test layer | Data layer | Existing tests validate seed structure, lower snake_case IDs, duplicate prevention, non-empty subfamilies, and approval traceability. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts] |

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Node.js | v24.14.0 installed | Runtime for npm scripts and Vitest execution | Project package is ESM TypeScript and uses npm scripts for build/test/compile. [VERIFIED: node --version; VERIFIED: src/package.json] |
| npm | 11.9.0 installed | Script runner/package manager | Existing commands are exposed as npm scripts under `src/package.json`. [VERIFIED: npm --version; VERIFIED: src/package.json] |
| TypeScript | 5.9.3 installed | Static type checking/build | Project uses strict TypeScript and `npm run typecheck` / `npm run build`. [VERIFIED: npm list; VERIFIED: src/package.json; VERIFIED: .planning/codebase/CONVENTIONS.md] |
| Vitest | 3.2.4 installed | Test runner for curation invariants | Existing curation tests are Vitest tests, and Vitest supports file filtering by path. [VERIFIED: npm list; VERIFIED: src/tests/curation/*.test.ts; CITED: https://github.com/vitest-dev/vitest/blob/v3.2.4/docs/guide/filtering.md] |
| `scripts/check-safety-guards.sh` / `npm run safety:guard` | repository script | Detect protected staged paths and guard unsafe mutations | Existing Phase 42 context identifies it as the established safety pattern, and local execution returned PASS. [VERIFIED: 42-CONTEXT.md; VERIFIED: npm run safety:guard] |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Python | 3.12.3 installed | Temporary audit scripting for matrix/seed checks | Use only for local verification scripts; do not add Python project dependencies or generated artifacts. [VERIFIED: python3 --version; ASSUMED] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual JSON edit with focused diff | Scripted JSON mutation | Manual edit is lower risk for six append-only descriptors; scripted mutation adds logic that must itself be reviewed. [ASSUMED] |
| Official compile to `data/compiled/v2` | Temporary compile output under `/tmp` | Temporary compile can validate without violating Phase 43 ownership of official v2.7 publication. [VERIFIED: 42-CONTEXT.md] |
| Alias registry edit | No alias edit | Matrix has zero approved alias rows, so alias edits would be unapproved mutations. [VERIFIED: 41-DECISION-MATRIX.md] |

**Installation:** No new packages should be installed for Phase 42. [VERIFIED: phase scope; VERIFIED: src/package.json]

**Version verification:** Installed versions were verified with `node --version`, `npm --version`, and `npm list vitest typescript --depth=0`. [VERIFIED: shell execution]

## Package Legitimacy Audit

Phase 42 should install no external packages, so the package legitimacy gate is not applicable. [VERIFIED: phase scope; VERIFIED: src/package.json]

## Authoritative Mutation Set

| Matrix Row | Candidate | Disposition | Target Path | Mutation Allowed | Current Target Exists? | Current Descriptor Globally Absent? |
|------------|-----------|-------------|-------------|------------------|------------------------|-------------------------------------|
| 06 | `peppermint` | `promote_to_seed` | `fresh_spice/fresh_spice/peppermint` | true | yes [VERIFIED: python seed audit] | yes [VERIFIED: python seed audit] |
| 07 | `rosemary` | `promote_to_seed` | `green/herbal_green/rosemary` | true | yes [VERIFIED: python seed audit] | yes [VERIFIED: python seed audit] |
| 10 | `cumin` | `promote_to_seed` | `spicy/warm_spice/cumin` | true | yes [VERIFIED: python seed audit] | yes [VERIFIED: python seed audit] |
| 13 | `spearmint` | `promote_to_seed` | `fresh_spice/fresh_spice/spearmint` | true | yes [VERIFIED: python seed audit] | yes [VERIFIED: python seed audit] |
| 14 | `caraway` | `promote_to_seed` | `spicy/warm_spice/caraway` | true | yes [VERIFIED: python seed audit] | yes [VERIFIED: python seed audit] |
| 15 | `opoponax` | `promote_to_seed` | `amber_resinous/balsamic_resin/opoponax` | true | yes [VERIFIED: python seed audit] | yes [VERIFIED: python seed audit] |

All 24 remaining matrix rows have `mutation_allowed=false` and must not mutate taxonomy, aliases, relations, accords, compiled artifacts, or sidecars. [VERIFIED: 41-DECISION-MATRIX.md; VERIFIED: python matrix audit]

## Architecture Patterns

### System Architecture Diagram

```text
41-DECISION-MATRIX.md
  -> filter rows where mutation_allowed=true AND disposition=promote_to_seed
  -> verify target family/subfamily exists in taxonomy-seed.v2.json
  -> verify descriptor absent globally
  -> append exactly six descriptors to existing descriptor arrays
  -> run focused curation tests and safety guard
  -> write 42-SUMMARY.md + 42-VERIFICATION.md
  -> hand seed state to Phase 43 for official artifact publication
```

This data flow should have no branch that creates structural taxonomy nodes or publishes official compiled artifacts. [VERIFIED: 42-CONTEXT.md]

### Recommended Project Structure

```text
data/taxonomy/
├── taxonomy-seed.v2.json              # only authorized production data mutation [VERIFIED: 42-CONTEXT.md]
└── descriptor_aliases.seed.json       # read-only guard reference; do not modify [VERIFIED: 42-CONTEXT.md]

.planning/phases/42-low-support-microcuration-execution/
├── 42-CONTEXT.md                      # locked decisions [VERIFIED: repository]
├── 42-RESEARCH.md                     # this research artifact [VERIFIED: repository]
├── 42-SUMMARY.md                      # later execution summary [VERIFIED: user scope]
└── 42-VERIFICATION.md                 # later verification evidence [VERIFIED: user scope]
```

### Pattern 1: Matrix-Gated Mutation

**What:** Treat only complete matrix rows with `mutation_allowed=true` and approved executable disposition as mutation authority. [VERIFIED: 41-CONTEXT.md]

**When to use:** Use before any data edit in Phase 42. [VERIFIED: 42-CONTEXT.md]

**Example:**

```typescript
// Source: project pattern from src/tests/curation/taxonomy_seed_v2.test.ts
const approvedPaths = [
  'fresh_spice/fresh_spice/peppermint',
  'green/herbal_green/rosemary',
  'spicy/warm_spice/cumin',
  'fresh_spice/fresh_spice/spearmint',
  'spicy/warm_spice/caraway',
  'amber_resinous/balsamic_resin/opoponax',
] as const
```

### Pattern 2: Global Descriptor Duplicate Check

**What:** Build a global descriptor set before insertion and fail if any approved descriptor already exists. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts]

**When to use:** Use immediately before editing `taxonomy-seed.v2.json`. [VERIFIED: 42-CONTEXT.md]

**Example:**

```typescript
// Source: adapted from assertNoGlobalDescriptorDuplicates in src/tests/curation/taxonomy_seed_v2.test.ts
const seen = new Set<string>()
seed.families.forEach(family => {
  family.subfamilies.forEach(subfamily => {
    subfamily.descriptors.forEach(descriptor => {
      expect(seen.has(descriptor), `duplicate descriptor: ${descriptor}`).toBe(false)
      seen.add(descriptor)
    })
  })
})
```

### Pattern 3: Evidence-Only Queue Discipline

**What:** Frequency and ranking evidence are priority signals only; they cannot mutate curated JSON. [VERIFIED: 41-CONTEXT.md; VERIFIED: src/tests/curation/review_dispositions.test.ts]

**When to use:** Use when reviewing `evidence`, `rationale`, or `expected_effect` columns. [VERIFIED: 42-CONTEXT.md]

**Example:**

```typescript
// Source: src/tests/curation/review_dispositions.test.ts
expect(workbook).toContain('Ranking is priority-only')
expect(workbook).toContain('cannot mutate curated JSON')
```

### Anti-Patterns to Avoid

- **Reinterpreting rejected/deferred rows:** Rows with `mutation_allowed=false` must not mutate anything. [VERIFIED: 42-CONTEXT.md]
- **Creating families/subfamilies:** Phase 42 must stop rather than invent missing structural nodes. [VERIFIED: 42-CONTEXT.md]
- **Publishing official v2.7 compiled artifacts:** Official publication belongs to Phase 43. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 42-CONTEXT.md]
- **Editing aliases:** Phase 41 contains zero approved alias rows. [VERIFIED: 41-DECISION-MATRIX.md]
- **Treating frequency as approval:** Frequency is priority evidence only. [VERIFIED: 41-CONTEXT.md; VERIFIED: src/tests/curation/review_dispositions.test.ts]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Seed structural validation | Custom ad hoc validator | Existing `validateSeed` and curation tests | Existing tests already assert seed validity, naming, duplicates, non-empty subfamilies, and traceability. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts] |
| Test runner | New test harness | `npm run test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts` | Vitest is already installed and supports file filtering. [VERIFIED: npm test execution; CITED: https://github.com/vitest-dev/vitest/blob/v3.2.4/docs/guide/filtering.md] |
| Safety boundary detection | Manual protected-path review only | `npm run safety:guard` plus diff review | The repository has an existing safety guard script and it returned PASS in this session. [VERIFIED: src/package.json; VERIFIED: npm run safety:guard] |
| Alias mutation logic | Custom alias additions | No alias mutation | Matrix has zero approved alias rows. [VERIFIED: 41-DECISION-MATRIX.md] |
| Official artifact publishing | Direct writes to `data/compiled/v2` | Temporary compile validation only, then Phase 43 publication | Phase 43 owns artifact publication. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 42-CONTEXT.md] |

**Key insight:** The hard part is not implementing a JSON append; the hard part is preserving mutation authority and proving that no non-approved data changed. [ASSUMED]

## Common Pitfalls

### Pitfall 1: Free-text rationale becomes hidden permission
**What goes wrong:** `expected_effect` or `rationale` text is treated as authorization for additional targets or structural changes. [VERIFIED: 42-CONTEXT.md]
**Why it happens:** Human-readable matrix fields mention future semantic gaps. [VERIFIED: 41-DECISION-MATRIX.md]
**How to avoid:** Filter solely on normalized fields: `mutation_allowed`, `disposition`, `target_family`, `target_subfamily`, and `target_descriptor`. [VERIFIED: 41-CONTEXT.md]
**Warning signs:** Any planned mutation references a row with `mutation_allowed=false` or a field outside the target columns. [VERIFIED: 41-CONTEXT.md]

### Pitfall 2: Duplicate seed descriptor insertion
**What goes wrong:** A descriptor is added even though it already exists in another family/subfamily. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts]
**Why it happens:** Checking only the target subfamily misses global duplicates. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts]
**How to avoid:** Scan all seed descriptors globally before append. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts]
**Warning signs:** `assertNoGlobalDescriptorDuplicates` fails or a descriptor appears in more than one descriptor array. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts]

### Pitfall 3: Test command path mismatch
**What goes wrong:** Running tests from `src/` with `src/tests/...` filters finds no files. [VERIFIED: failed npm test execution]
**Why it happens:** Vitest config includes `tests/**/*.test.ts` relative to the `src` package root. [VERIFIED: failed npm test execution; VERIFIED: corrected npm test execution]
**How to avoid:** From `src/`, run `npm run test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts`. [VERIFIED: corrected npm test execution]
**Warning signs:** Vitest reports `No test files found` with filters beginning `src/tests/...`. [VERIFIED: failed npm test execution]

### Pitfall 4: Official compiled artifact drift
**What goes wrong:** Validation compile writes to `data/compiled/v2` and accidentally publishes Phase 42 artifacts. [VERIFIED: 42-CONTEXT.md]
**Why it happens:** Compile defaults target official v2 paths after v2 promotion. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts]
**How to avoid:** Use `/tmp` output for compile validation or skip compile until Phase 43; never stage `data/compiled/v2` in Phase 42. [VERIFIED: 42-CONTEXT.md]
**Warning signs:** `git diff` shows `data/compiled/v2/*` after Phase 42 execution. [ASSUMED]

## Code Examples

Verified patterns from repository sources:

### Focused Test Command

```bash
# Source: verified in this session from /home/jlima/Projetos/TaxonomySystem/src
npm run test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts
```

The command passed 2 test files and 11 tests in this session. [VERIFIED: npm test execution]

### Safety Guard Command

```bash
# Source: src/package.json and verified in this session
npm run safety:guard
```

The command returned PASS in this session. [VERIFIED: npm run safety:guard]

### Approved Descriptor Placement

```json
{
  "fresh_spice/fresh_spice": ["peppermint", "spearmint"],
  "green/herbal_green": ["rosemary"],
  "spicy/warm_spice": ["cumin", "caraway"],
  "amber_resinous/balsamic_resin": ["opoponax"]
}
```

These are the only approved Phase 42 additions. [VERIFIED: 41-DECISION-MATRIX.md; VERIFIED: 42-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Frequency-driven automatic promotion | Explicit decision-matrix-gated mutation | Locked by Phase 41 context for v2.7 [VERIFIED: 41-CONTEXT.md] | Frequency can prioritize review but cannot authorize seed changes. [VERIFIED: 41-CONTEXT.md] |
| Combined curation and artifact publication | Seed mutation in Phase 42, official artifact publication in Phase 43 | Locked by v2.7 roadmap [VERIFIED: .planning/ROADMAP.md] | Phase 42 must avoid official compiled artifact writes. [VERIFIED: 42-CONTEXT.md] |
| Speculative new subfamilies during microcuration | Existing-target-only seed additions | Locked by Phase 41 and Phase 42 contexts [VERIFIED: 41-CONTEXT.md; VERIFIED: 42-CONTEXT.md] | Missing structural targets force deferral, not invention. [VERIFIED: 41-CONTEXT.md] |

**Deprecated/outdated:**
- Automatic promotion from corpus frequency is prohibited for this milestone. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 41-CONTEXT.md]
- Publishing official v2.7 artifacts in Phase 42 is out of scope. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 42-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Project skill relevance is limited to GSD planning/research discipline for this phase. | Project Constraints | Low; planner can still follow explicit phase context and repository tests. |
| A2 | Manual JSON edit is lower risk than writing mutation script for six descriptors. | Standard Stack / Alternatives | Medium; if implementer prefers script, plan must add equivalent verification and diff controls. |
| A3 | The hard part is preserving mutation authority and proving no non-approved data changed. | Don't Hand-Roll | Low; this is a planning emphasis rather than a factual prerequisite. |
| A4 | `git diff` showing `data/compiled/v2/*` is a warning sign of official artifact drift. | Common Pitfalls | Low; even if temporary output were elsewhere, official compiled diffs remain out of scope. |

## Open Questions (RESOLVED)

1. **Should Phase 42 add a Phase 42-specific approval-traceability fixture/test update?**
    - What we know: Existing `taxonomy_seed_v2.test.ts` asserts that every v2 addition beyond v1 has an approval entry, but its hard-coded approvals list currently predates Phase 42 additions. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts]
   - RESOLVED: Phase 42 should use the minimal traceability mechanism: update `src/tests/curation/taxonomy_seed_v2.test.ts` directly, or an adjacent curation fixture/test only if that is the smaller local change, so the six Phase 42 seed additions are explicitly approval-backed and tested. The planned default is to add the six locked D-02 paths to the existing approval/traceability pattern in `taxonomy_seed_v2.test.ts` and add absence coverage for non-approved Phase 41 candidates. [VERIFIED: 42-CONTEXT.md; VERIFIED: 42-01-PLAN.md]

2. **Should temporary compile validation run in Phase 42?**
    - What we know: Temporary compile validation is allowed only if no official compiled artifacts are published. [VERIFIED: user mandatory scope; VERIFIED: 42-CONTEXT.md]
   - RESOLVED: Temporary compile validation is optional only. The mandatory Phase 42 verification gate is focused curation tests, safety guard, failing protected diff checks, and failing allowlist checks. If an implementer chooses to run compile validation for extra confidence, output must be outside the repository or under `/tmp`; official `data/compiled/v2` must remain unchanged and `git diff --quiet -- data/taxonomy/descriptor_aliases.seed.json data/compiled/v2` must pass. [VERIFIED: 42-CONTEXT.md; VERIFIED: 42-01-PLAN.md; VERIFIED: 42-02-PLAN.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | npm scripts and Vitest | ✓ | v24.14.0 | none needed [VERIFIED: node --version] |
| npm | script execution | ✓ | 11.9.0 | none needed [VERIFIED: npm --version] |
| Vitest | curation tests | ✓ | 3.2.4 | none needed [VERIFIED: npm list; VERIFIED: npm test execution] |
| TypeScript | typecheck/build if planner includes it | ✓ | 5.9.3 | none needed [VERIFIED: npm list] |
| Safety guard script | protected-path validation | ✓ | repository script | none needed [VERIFIED: src/package.json; VERIFIED: npm run safety:guard] |
| Python | temporary matrix/seed audit | ✓ | 3.12.3 | Node one-off script could replace it [VERIFIED: python3 --version; ASSUMED] |

**Missing dependencies with no fallback:** None found for the researched Phase 42 plan. [VERIFIED: environment probes]

**Missing dependencies with fallback:** None required. [VERIFIED: environment probes]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 [VERIFIED: npm list] |
| Config file | none explicitly read; package script uses `vitest run` and discovered `tests/**/*.test.ts` under `src` [VERIFIED: src/package.json; VERIFIED: failed and corrected npm test execution] |
| Quick run command | `cd src && npm run test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts` [VERIFIED: corrected npm test execution] |
| Full suite command | `cd src && npm run test` [VERIFIED: src/package.json] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CUR-02 | Only explicitly approved seed additions are represented and traceable | unit/curation invariant | `cd src && npm run test -- tests/curation/taxonomy_seed_v2.test.ts` | ✅ [VERIFIED: read file] |
| CUR-02 | Frequency/ranking evidence cannot mutate curated JSON | unit/curation guard | `cd src && npm run test -- tests/curation/review_dispositions.test.ts` | ✅ [VERIFIED: read file] |
| CUR-02 | No alias mutation occurs | diff/safety validation | `git diff -- data/taxonomy/descriptor_aliases.seed.json` and `cd src && npm run safety:guard` | ✅ guard script exists [VERIFIED: src/package.json; VERIFIED: npm run safety:guard] |
| CUR-02 | No official compiled artifacts are published | diff/safety validation | `git diff -- data/compiled/v2` and `cd src && npm run safety:guard` | ✅ guard script exists [VERIFIED: src/package.json; VERIFIED: npm run safety:guard] |

### Sampling Rate

- **Per task commit:** Run the focused curation test command and inspect the diff for only authorized files. [ASSUMED]
- **Per wave merge:** Run focused curation tests plus `npm run safety:guard`. [VERIFIED: npm test execution; VERIFIED: npm run safety:guard]
- **Phase gate:** Full relevant curation tests green, safety guard PASS, and no diffs in alias or official compiled artifacts before `/gsd-verify-work`. [ASSUMED]

### Wave 0 Gaps

- [ ] Decide the minimal traceability mechanism for Phase 42 additions in `taxonomy_seed_v2.test.ts` or a new fixture/test, because existing approval parsing predates the six Phase 42 descriptors. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts; ASSUMED]
- [ ] Add or update tests so the six approved paths are required and all 24 non-approved Phase 41 rows are absent, if the current generic traceability test is not enough after mutation. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth surface is in Phase 42. [VERIFIED: phase scope] |
| V3 Session Management | no | No session surface is in Phase 42. [VERIFIED: phase scope] |
| V4 Access Control | yes | Authorization is represented as explicit row-level mutation permission in the Phase 41 matrix. [VERIFIED: 41-CONTEXT.md] |
| V5 Input Validation | yes | Validate matrix fields, target existence, descriptor absence, lower snake_case IDs, and no duplicates before/after mutation. [VERIFIED: 42-CONTEXT.md; VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts] |
| V6 Cryptography | no | No cryptography is in Phase 42 scope. [VERIFIED: phase scope] |

### Known Threat Patterns for data microcuration

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unauthorized data mutation from explanatory text | Tampering | Gate mutations only on normalized matrix fields and `mutation_allowed=true`. [VERIFIED: 41-CONTEXT.md] |
| Duplicate descriptor poisoning | Tampering | Global descriptor duplicate checks. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts] |
| Artifact publication outside phase authority | Tampering / Repudiation | Keep official `data/compiled/v2` unchanged and record verification evidence in `42-VERIFICATION.md`. [VERIFIED: 42-CONTEXT.md; VERIFIED: user mandatory scope] |
| Alias registry drift | Tampering | Keep `descriptor_aliases.seed.json` unchanged and verify diff. [VERIFIED: 42-CONTEXT.md; VERIFIED: 41-DECISION-MATRIX.md] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/42-low-support-microcuration-execution/42-CONTEXT.md` — locked Phase 42 decisions and guardrails. [VERIFIED: file read]
- `.planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md` — authoritative row-level mutation matrix. [VERIFIED: file read]
- `.planning/phases/41-low-support-batch-decision-matrix/41-CONTEXT.md` — execution contract and mutation criteria. [VERIFIED: file read]
- `data/taxonomy/taxonomy-seed.v2.json` — current seed topology and descriptor state. [VERIFIED: file read]
- `src/tests/curation/taxonomy_seed_v2.test.ts` — seed invariants and traceability pattern. [VERIFIED: file read]
- `src/tests/curation/review_dispositions.test.ts` — evidence-only mutation guard pattern. [VERIFIED: file read]
- Vitest Context7 `/vitest-dev/vitest/v3_2_4` — file filtering and single-run test behavior. [CITED: https://github.com/vitest-dev/vitest/blob/v3.2.4/docs/guide/filtering.md]

### Secondary (MEDIUM confidence)
- `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md` — milestone scope, CUR-02 mapping, and historical constraints. [VERIFIED: file read]
- `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONVENTIONS.md` — project stack and style constraints. [VERIFIED: file read]
- Environment probes: `node --version`, `npm --version`, `npm list`, `python3 --version`, focused Vitest run, and safety guard run. [VERIFIED: shell execution]

### Tertiary (LOW confidence)
- Assumptions about manual edit risk, optional temporary compile value, and exact traceability-test implementation route. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from `src/package.json`, `npm list`, and local command execution. [VERIFIED: file read; VERIFIED: shell execution]
- Architecture: HIGH — phase scope and mutation boundaries are explicit in Phase 42 and Phase 41 contexts. [VERIFIED: 42-CONTEXT.md; VERIFIED: 41-CONTEXT.md]
- Pitfalls: HIGH for permission/duplicate/artifact pitfalls because they are encoded in contexts and tests; MEDIUM for exact implementation mechanics because traceability update strategy remains a planner choice. [VERIFIED: source files; ASSUMED]

**Research date:** 2026-06-02 [VERIFIED: system date]
**Valid until:** 2026-07-02 for repository-local phase planning, or earlier if Phase 41 matrix or taxonomy seed changes. [ASSUMED]
