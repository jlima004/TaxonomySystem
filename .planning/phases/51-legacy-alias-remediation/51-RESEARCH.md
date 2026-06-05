# Phase 51: Legacy Alias Remediation - Research

**Researched:** 2026-06-05
**Domain:** Curated taxonomy seed data hygiene (alias-target integrity) — internal data + compile/publish pipeline
**Confidence:** HIGH (all claims verified against repo files, commands, and tests)

> **Scope note:** This is internal-only research. No web/Context7/package research was performed (no new dependencies in this phase). Standard Stack, Package Legitimacy, and Environment Availability are marked **N/A** with reasons below. Research stays strictly inside locked decisions D-51-01..D-51-27.

<user_constraints>
## User Constraints (from 51-CONTEXT.md)

### Locked Decisions (verbatim)

**Remediation Path**
- **D-51-01:** Primary remediation path is `add_target`: add `ylang_ylang` as a curated seed descriptor so the existing alias `ylang ylang -> ylang_ylang` resolves without changing the alias map.
- **D-51-02:** Do not remap `ylang ylang` to `ylang`. `ylang` is a corpus candidate (`source: "corpus"`, `status: "candidate"`, `review_required: true`) and is semantically distinct from the expected target `ylang_ylang`.
- **D-51-03:** Do not approve a permanent exception for `ylang ylang -> ylang_ylang` in `data/taxonomy/alias_target_exceptions.v1.json`. Phase 49 classified this pair as `remediation_required`, not `possible_exception_candidate`.
- **D-51-04:** Do not drop/remove the alias unless curation concludes there is no safe target. Preserve the alias and add the missing curated target.
- **D-51-05:** `descriptor_aliases.seed.json` should remain unchanged in the happy path. The alias already points to the correct intended target; remediation is by making that target exist.

**Taxonomy Placement**
- **D-51-06:** Strong preferred placement lock: add `ylang_ylang` under existing `floral/floral_white`, appended to the current descriptors list, alongside peers such as `jasmine`, `tuberose`, `orange_blossom`, `gardenia`, `lily_of_the_valley`, `freesia`, `osmanthus`, `elderflower`, `linden_flower`.
- **D-51-07:** Placement is allowed only if the executor confirms safe semantic fit with the existing white-floral family context. Do not use stretch placement.
- **D-51-08:** Do not place `ylang_ylang` under or via the corpus candidate `ylang`.
- **D-51-09:** Do not create a new family or subfamily for `ylang_ylang`.

**Safe-Fit Criteria (all must hold before mutation)**
- **D-51-10:** `ylang_ylang` is a legitimate olfactory descriptor, not alias noise or mechanical alias repair.
- **D-51-11:** There is safe semantic fit in an existing family/subfamily; preferred lock is `floral/floral_white`.
- **D-51-12:** Remediation does not require a new family/subfamily.
- **D-51-13:** Remediation is not achieved by promoting or inferring from the corpus candidate `ylang`.
- **D-51-14:** Remediation does not rely on an exception entry in `alias_target_exceptions.v1.json`.
- **D-51-15:** The executor must document the safe-fit rationale in phase artifacts before mutating seed data.

**No-Safe-Fit Fallback**
- **D-51-16:** If no safe fit exists in any subfamily, halt Phase 51 before mutation and produce a manual-review checkpoint.
- **D-51-17:** In the no-safe-fit case: do not remap to `ylang`, do not add an exception, do not drop the alias, do not create a new family/subfamily, do not force weak placement.
- **D-51-18:** In the no-safe-fit case, HYG-01 remains unresolved and the v2.9 milestone cannot close until the operator explicitly chooses a fallback path.

**Publication and Proof**
- **D-51-19:** Required proof sequence: (1) before mutation `npm run alias:integrity` exits non-zero with exactly `ylang ylang -> ylang_ylang`; (2) add `ylang_ylang` as curated seed target; (3) sandbox compile with `--version 2.9.0`; (4) official compile/publish to `data/compiled/v2` with `--version 2.9.0`; (5) after publication `npm run alias:integrity` exits 0; (6) full test suite passes.
- **D-51-20:** If `taxonomy-seed.v2.json` is mutated, Phase 51 must sandbox-compile and officially publish v2.9.0 artifacts to `data/compiled/v2` using explicit `--version 2.9.0`. The gate validates against compiled taxonomy IDs, so publication is required for PASS proof.
- **D-51-21:** Do not change `DEFAULT_PATHS` or default version policy in `src/cli/parse_args.ts`. Follow v2.7/v2.8 precedent: explicit version flag for publication, defaults unchanged.
- **D-51-22:** `npm run alias:integrity` is the deterministic before/after proof command from Phase 50. JSON output via `--json` is available for deterministic assertions.

**Relations and Accords**
- **D-51-23:** Do not add, remove, or modify relations or accords in Phase 51. Missing relation/accord coverage for the new descriptor remains neutral/undefined.

**Non-Remediation Boundary**
- **D-51-24:** Phase 51 may change only remediation surfaces: `data/taxonomy/taxonomy-seed.v2.json` (happy path), official `data/compiled/v2/*` publication when seed changes, phase planning/verification/summary docs, and proof/test execution.
- **D-51-25:** Phase 51 must not change low_support matrices, seed_corpus_conflict handling, scoring, Graphify outputs, MVP/SaaS, Knowledge Engine, or UI surfaces.
- **D-51-26:** Phase 51 must not promote or mutate the corpus candidate `ylang` as part of alias remediation.
- **D-51-27:** Phase 51 must resolve only dangling targets confirmed in Phase 49. Current inventory shows exactly one dangling pair.

### Claude's Discretion (verbatim)
- Exact approval-traceability artifact format and filename are planner discretion, as long as the `add_target` decision is evidence-backed and auditable.
- Exact sandbox `/tmp` compile path and publication command sequencing are planner discretion within the proof sequence.
- Minor test additions beyond alias-integrity proof are planner discretion if they strengthen HYG-01 verification without expanding scope.

### Deferred Ideas (OUT OF SCOPE)
- Wire `alias:integrity` into default `npm test` or normal compile as a permanent hard gate after v2.9 closure.
- Bootstrap relations/accords for `ylang_ylang` — future curation phase if desired.
- Promote or reconcile the corpus candidate `ylang` with curated `ylang_ylang` — out of scope for alias hygiene.
- Batch 3 low-support curation and unrelated descriptor promotion — explicitly excluded from v2.9.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HYG-01 | Resolver o alias dangling `ylang ylang -> ylang_ylang`, decidindo explicitamente entre adicionar um target curado, remover/drop do alias, ou registrar exceção permanente. Locked path: `add_target` of `ylang_ylang` under `floral/floral_white`. | Mutation surface, exact append location, compile/publish flags, and before/after proof command all verified below. The locked `add_target` path is the explicit decision required by HYG-01. |
</phase_requirements>

## Summary

Phase 51 is a **single-descriptor, internal data hygiene mutation** plus an **official compile/publish** to satisfy the Phase 50 integrity gate. The only confirmed dangling alias is `ylang ylang -> ylang_ylang` ([VERIFIED: `npm run alias:integrity -- --json` → `unresolved_target_count: 1`, exit 1]). The locked remediation is to append the string `"ylang_ylang"` to the `floral/floral_white` descriptors array in `data/taxonomy/taxonomy-seed.v2.json`, then sandbox-compile and officially publish v2.9.0 artifacts to `data/compiled/v2`, then prove the gate flips to PASS (exit 0).

The mutation is mechanically trivial (one JSON string appended to a 9-element array) but the **proof chain is the real work**: the gate reads **compiled** descriptor IDs, not seed IDs, so the seed edit alone does not make the gate pass — publication to `data/compiled/v2/taxonomy.json` is mandatory (D-51-20). The compile CLI flags are verified: the output flag is **`--out`** (there is **no `--output`** alias), and the version flag is **`--version`**. The default `DEFAULT_PATHS.version` is `'2.1.0'` and must **not** change; v2.9.0 is delivered only via explicit `--version 2.9.0` (v2.7/v2.8 precedent).

The single highest-risk pitfall is that **two existing tests encode the pre-remediation state as locked expectations** and will FLIP/break once remediation publishes (`alias_target_inventory.test.ts` asserts 340 descriptors / 17 valid / 1 dangling / `ylang_ylang` absent; `alias_integrity.test.ts` asserts the live-data run exits 1 with the `ylang ylang` failure). The full suite (D-51-19 step 6) **cannot pass** until these tests are updated to the post-remediation state. The planner must include a task to update them.

**Primary recommendation:** Append `"ylang_ylang"` to `floral_white` in the seed, sandbox-compile to `/tmp` with `--version 2.9.0`, officially compile to `data/compiled/v2` with `--version 2.9.0` (default `--out`, `DEFAULT_PATHS` untouched), update the two state-locked tests to the post-remediation expectations, and prove PASS via `npm run alias:integrity` (exit 0) plus the full vitest suite.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Add `ylang_ylang` curated descriptor | Database / Storage (curated seed JSON) | — | `data/taxonomy/taxonomy-seed.v2.json` is the curated truth source; descriptors live as plain strings under `families[].subfamilies[].descriptors[]`. |
| Compile seed → compiled taxonomy | API / Backend (compile CLI) | — | `src/cli/compile.ts` + `compileAll` transform seed strings into compiled descriptor objects with `id`/`source`/`status`. |
| Publish v2.9.0 artifacts | Database / Storage (`data/compiled/v2/*`) | API / Backend (compile CLI writer) | `writeCompileResults` persists artifacts; gate reads `data/compiled/v2/taxonomy.json`. |
| Prove integrity (before/after) | API / Backend (alias:integrity CLI) | — | `src/cli/alias_integrity.ts` reads compiled IDs and emits PASS/FAIL + exit code. |

## Standard Stack

**N/A — no new dependencies.** This phase is a curated-data edit plus a re-run of the existing compile and integrity CLIs. No package is added or upgraded. Existing toolchain only: Node.js + TypeScript (`tsc`) + vitest, already declared in `src/package.json` [VERIFIED: `src/package.json` devDependencies `typescript ^5.8.0`, `vitest ^3.2.0`, `@types/node ^25.7.0`].

## Package Legitimacy Audit

**N/A — no packages installed in this phase.** No `npm install` occurs. Reason: locked decisions D-51-24/D-51-25 forbid touching `package.json`/source beyond the seed data and compiled artifacts; the only executables run are existing npm scripts.

## Environment Availability

**Step 2.6: Largely N/A** — the phase uses only the project's own toolchain, which is confirmed present and exercised this session.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | compile + alias:integrity CLIs | ✓ | (ran `npm run alias:integrity` successfully this session) | — |
| npm scripts (`build`, `compile`, `alias:integrity`, `test`) | proof chain | ✓ | `src/package.json` scripts verified | — |
| `tsc` (TypeScript build) | `precompile`/`build` | ✓ | `typescript ^5.8.0` | — |
| vitest | full test suite | ✓ | `^3.2.0` | — |
| `/tmp` writable dir | sandbox compile | ✓ (assumed standard) | — | any executor-chosen scratch dir (planner discretion per CONTEXT) |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None material.

## Architecture Patterns

### System Architecture Diagram

```
data/taxonomy/taxonomy-seed.v2.json   data/taxonomy/descriptor_aliases.seed.json (UNCHANGED, D-51-05)
   (append "ylang_ylang" to                       │
    floral/floral_white)                          │
        │                                          │
        ▼                                          │
  [npm run compile -- --version 2.9.0]             │
   (precompile=tsc build → node dist/cli/compile.js)
        │  loadTaxonomySeed + loadAliasSeed + compileAll + writeCompileResults
        ├── sandbox: --out /tmp/<scratch>  (validation only, discarded)   ← D-51-19 step 3
        └── official: default --out → ../data/compiled/v2  (--version 2.9.0) ← D-51-19 step 4
                 │  writes taxonomy.json (now contains id:"ylang_ylang", source:"seed"),
                 │  descriptor_aliases.json, similarity_matrix.json
                 ▼
  data/compiled/v2/taxonomy.json  ──┐
  data/taxonomy/descriptor_aliases.seed.json ──┤
  data/taxonomy/alias_target_exceptions.v1.json (empty, UNCHANGED) ──┤
                                    ▼
                       [npm run alias:integrity --json]      ← D-51-19 steps 1 & 5
                       validateAliasTargetIntegrity():
                         for each seed alias target → present in compiled descriptor IDs?
                         BEFORE: ylang_ylang absent  → FAIL (exit 1)
                         AFTER:  ylang_ylang present  → PASS (exit 0)
                                    │
                                    ▼
                       [npm --prefix src test] full vitest suite (must be green) ← D-51-19 step 6
                       (requires updating the two state-locked tests, see Pitfalls)
```

### Recommended Project Structure (touched surfaces only)
```
data/
├── taxonomy/
│   └── taxonomy-seed.v2.json     # MUTATE: append "ylang_ylang" to floral_white.descriptors
└── compiled/v2/
    ├── taxonomy.json             # REPUBLISH: now includes id "ylang_ylang"
    ├── descriptor_aliases.json   # REPUBLISH: alias map unchanged (still 18 entries)
    └── similarity_matrix.json    # REPUBLISH (recompiled)
src/
├── cli/compile.ts                # INVOKE only (do not modify)
├── cli/parse_args.ts             # READ only — DEFAULT_PATHS must stay byte-identical (D-51-21)
├── cli/alias_integrity.ts        # INVOKE only (proof)
└── tests/
    ├── cli/alias_integrity.test.ts          # UPDATE: live-data run flips to PASS/exit 0
    ├── inventory/alias_target_inventory.test.ts  # UPDATE: post-remediation counts
    └── curation/alias_seed_v2.test.ts        # VERIFY (alias map unchanged; likely still green)
```

### Pattern 1: `add_target` (preserve alias, add the missing descriptor)
**What:** Resolve a dangling alias by adding its target descriptor to curated seed, never by remapping the alias.
**When to use:** When the alias already points at the semantically correct intended target (D-51-01).
**Example (exact mutation):** `floral_white.descriptors` is an array of **plain strings** [VERIFIED: `data/taxonomy/taxonomy-seed.v2.json:16-26`]. Current state:

```json
"id": "floral_white",
"name": "White Floral",
"descriptors": [
  "jasmine",
  "tuberose",
  "gardenia",
  "orange_blossom",
  "lily_of_the_valley",
  "freesia",
  "osmanthus",
  "elderflower",
  "linden_flower"
]
```

Append `"ylang_ylang"` after `"linden_flower"`:

```json
"descriptors": [
  "jasmine",
  "tuberose",
  "gardenia",
  "orange_blossom",
  "lily_of_the_valley",
  "freesia",
  "osmanthus",
  "elderflower",
  "linden_flower",
  "ylang_ylang"
]
```

This precedent matches `petitgrain` (Phase 20) and `lemon_peel` (Phase 23) `add_target` curation [CITED: 51-CONTEXT.md Curation Precedents].

### Pattern 2: Two-step compile (sandbox → official), explicit version, defaults untouched
**What:** Sandbox-compile to `/tmp` for validation, then officially compile to `data/compiled/v2` with the same `--version` flag. `DEFAULT_PATHS` never changes.
**When to use:** Any seed mutation that requires republication (D-51-20, v2.7/v2.8 precedent).
**Example:** [VERIFIED: `src/cli/parse_args.ts:35-46` FLAG_TO_KEY + `48-CONTEXT.md` D-48-SB01/D-48-PUB01]

```bash
# Run from the src/ package (npm scripts live in src/package.json).
cd src

# (1) sandbox compile — validation only, discarded. Custom --out stays as-is.
npm run compile -- --version 2.9.0 --out /tmp/phase51-compile-validate --generated-at 2026-06-05T00:00:00Z

# (2) official publish — default --out resolves to ../data/compiled/v2 via resolveOutputDir.
npm run compile -- --version 2.9.0
```

**Why default `--out` publishes to the repo's `data/compiled/v2`:** `resolveOutputDir` rewrites the default `data/compiled/v2` to `join('..', 'data/compiled/v2')` only when the path equals `DEFAULT_PATHS.outputDir`; a custom `--out /tmp/...` is left untouched [VERIFIED: `src/cli/compile.ts:80`]. `npm run compile` triggers `precompile` (`npm run build` = `tsc`) automatically [VERIFIED: `src/package.json:9-10`].

### Anti-Patterns to Avoid
- **Remapping the alias to `ylang`:** forbidden (D-51-02/D-51-08/D-51-26). `ylang` is a corpus candidate, semantically distinct.
- **Adding an exception entry:** forbidden (D-51-03/D-51-14). Keep `alias_target_exceptions.v1.json` as the empty list.
- **Editing `descriptor_aliases.seed.json`:** forbidden in happy path (D-51-05). The alias is already correct.
- **Changing `DEFAULT_PATHS` (incl. `version`):** forbidden (D-51-21). Use `--version 2.9.0` only.
- **Using `--output`:** that flag does not exist; the compiler throws `Unknown option: --output` [VERIFIED: `src/cli/parse_args.ts:77-79` + `48-CONTEXT.md` D-48-SB01].
- **Treating the seed edit as sufficient:** the gate reads compiled IDs, not seed; you must publish before re-running the gate (D-51-20).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verify alias targets resolve | A custom diff script | `npm run alias:integrity [-- --json]` | Phase 50 gate already does exactly this deterministically with PASS/FAIL + exit code [VERIFIED: `src/cli/alias_integrity.ts`]. |
| Produce compiled taxonomy IDs | Manual JSON editing of `data/compiled/v2/*` | `npm run compile -- --version 2.9.0` | The compile pipeline regenerates all three artifacts consistently; hand-editing compiled JSON would desync stats/version/graph. |
| Build the TypeScript before running | Manual `tsc` invocation | `npm run alias:integrity` / `npm run compile` (both run `precompile`) | `precompile` = `npm run build` runs automatically [VERIFIED: `src/package.json`]. |

**Key insight:** Every capability this phase needs already exists and is tested. The phase is orchestration + one data string + test-expectation updates, not new code.

## Runtime State Inventory

> This is a data-curation/publication phase (adds a curated descriptor + republishes artifacts). It is **not** a rename/refactor, but the canonical question — "after the seed edit, what still encodes the old (pre-remediation) state?" — surfaces the critical test-expectation risk below.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data (compiled artifacts) | `data/compiled/v2/taxonomy.json` (340 descriptors, no `ylang_ylang`), `descriptor_aliases.json` (18 aliases), `similarity_matrix.json` | **Data republish** via official compile with `--version 2.9.0`. The gate reads `data/compiled/v2/taxonomy.json`. |
| Test fixtures encoding pre-state | `src/tests/inventory/alias_target_inventory.test.ts` asserts `descriptorIds.size === 340`, 17 valid, 1 dangling `{ 'ylang ylang': 'ylang_ylang' }`, and `compiledIds.has('ylang_ylang') === false` & `seedIds.has('ylang_ylang') === false` [VERIFIED: lines 83-138]. `src/tests/cli/alias_integrity.test.ts` asserts the live-data run `exits 1` with the `ylang ylang` failure [VERIFIED: lines 76-91]. | **Code edit** (update expectations to 341 / 18 valid / 0 dangling / PASS-exit-0 / `ylang_ylang` present). Without this, full suite fails (D-51-19 step 6). |
| Live service config | None — no external service holds taxonomy state. | None. |
| OS-registered state | None. | None. |
| Secrets / env vars | None — no secrets reference taxonomy descriptors. | None. |
| Build artifacts | `src/dist/` (compiled TS) is regenerated by `precompile`; no stale-name risk for a data addition. | None (auto-rebuilt). |

**The canonical question answered:** After the seed gains `ylang_ylang` and `data/compiled/v2` is republished, the *remaining* encoders of the old state are the two state-locked test files. They are the only things that will still assert "no `ylang_ylang` / gate fails" and must be updated.

## Common Pitfalls

### Pitfall 1: Full suite breaks because two tests lock the pre-remediation state
**What goes wrong:** D-51-19 step 6 (full suite green) fails even though remediation is correct, because:
- `alias_target_inventory.test.ts` hard-asserts `descriptorIds.size === 340`, `valid` length 17, `dangling === { 'ylang ylang': 'ylang_ylang' }`, and `compiledIds.has('ylang_ylang') === false`.
- `alias_integrity.test.ts` ("runs against real data … exits 1 with expected ylang ylang failure") asserts `exitCode === 1` and an unresolved `ylang ylang` entry.

**Why it happens:** These were written in Phases 49/50 to lock the *current* dangling-state as evidence; remediation intentionally invalidates them.
**How to avoid:** Add a planned task to update both tests to post-remediation expectations (341 descriptors, 18 valid, 0 dangling, gate PASS/exit 0, `ylang_ylang` present). This is in-scope under D-51-24 ("proof/test execution") and the discretion clause permitting test additions that strengthen HYG-01 verification.
**Warning signs:** `npm --prefix src test` red on `inventory/alias_target_inventory.test.ts` or `cli/alias_integrity.test.ts` after publication.

### Pitfall 2: Seed edited but gate still FAILs
**What goes wrong:** Re-running `alias:integrity` after editing only the seed still reports FAIL.
**Why it happens:** The gate reads **compiled** descriptor IDs from `data/compiled/v2/taxonomy.json` [VERIFIED: `src/cli/alias_integrity.ts:52,60-66`], not the seed. The seed string is invisible to the gate until compiled.
**How to avoid:** Always officially compile/publish (D-51-20) before the "after" gate run.
**Warning signs:** `unresolved_target_count` still 1 after a seed-only edit.

### Pitfall 3: Using `--output` instead of `--out`
**What goes wrong:** Compile aborts with `Unknown option: --output`.
**Why it happens:** Only `--out` is mapped [VERIFIED: `src/cli/parse_args.ts:35-46`]; Phase 47 docs used `--output` in error (corrected in 48-CONTEXT D-48-SB01).
**How to avoid:** Use `--out` for the sandbox path; omit `--out` for official publish (default resolves to `../data/compiled/v2`).

### Pitfall 4: Accidental `DEFAULT_PATHS`/version drift
**What goes wrong:** Editing `parse_args.ts` to bump the default version contaminates default behavior.
**Why it happens:** Temptation to "set version to 2.9.0" globally.
**How to avoid:** Pass `--version 2.9.0` at compile time only; leave `DEFAULT_PATHS.version = '2.1.0'` byte-identical (D-51-21, v2.8 D-48-V02). The published `taxonomy.json.version`/`descriptor_aliases.json.version`/`similarity_matrix.json.version` will read `2.9.0` from the flag.

### Pitfall 5: `ylang` vs `ylang_ylang` confusion
**What goes wrong:** Promoting/inferring from corpus candidate `ylang` instead of adding curated `ylang_ylang`.
**Why it happens:** Near-match names. `ylang` already exists in compiled taxonomy as a corpus candidate [VERIFIED: `data/compiled/v2/taxonomy.json:1342-1349` → `{ id:"ylang", source:"corpus", frequency:41, status:"candidate", review_required:true, corpus_derived:true }`].
**How to avoid:** Add a brand-new curated string `"ylang_ylang"` to `floral_white`; never touch `ylang` (D-51-02/D-51-08/D-51-26). The two must remain separate descriptors.

## Code Examples

### Before-state proof (verified this session)
```bash
cd src && npm run alias:integrity --silent -- --json
# → exit 1
# {
#   "status": "FAIL",
#   "seed_alias_count": 18,
#   "compiled_descriptor_count": 340,
#   "valid_target_count": 17,
#   "unresolved_target_count": 1,
#   "unresolved": [
#     { "alias": "ylang ylang", "target": "ylang_ylang",
#       "source": "data/taxonomy/descriptor_aliases.seed.json",
#       "exception_status": "none",
#       "remediation_hint": "resolve in Phase 51 by adding target, correcting alias, dropping alias, or documenting an approved exception." }
#   ]
# }
```
[VERIFIED: ran `npm run alias:integrity --silent -- --json` → exit code 1, output above]

### Expected compiled shape of the new descriptor
A curated seed string compiles into an object with `source: "seed"`, `status: "curated"` (peer `jasmine` shown) [VERIFIED: `data/compiled/v2/taxonomy.json:1159-1165`]:
```json
{ "id": "jasmine", "source": "seed", "frequency": 135, "status": "curated", "review_required": false, "corpus_derived": false }
```
After publication, `ylang_ylang` will appear as `{ "id": "ylang_ylang", "source": "seed", ... }` under `floral_white`, making the alias target resolve.

### Gate logic (why publish is mandatory)
```typescript
// src/cli/alias_integrity.ts — reads COMPILED taxonomy IDs, not seed
const compiledTaxonomyPath = await resolveReadablePath(join(DEFAULT_PATHS.outputDir, 'taxonomy.json'))
// ...builds descriptorIds Set from compiled families/subfamilies/descriptors...
const result = validateAliasTargetIntegrity(aliasSeed, descriptorIds, exceptionPolicy, ...)
// FAIL unless every seed alias target is in compiled descriptorIds (or has an approved exception)
```
[VERIFIED: `src/cli/alias_integrity.ts:51-68`; `src/compiler/alias_target_integrity.ts:103-122`]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Accept `ylang ylang -> ylang_ylang` as `accepted_exception_interim` | Resolve via `add_target` of `ylang_ylang` | Phase 51 (v2.9) | Removes the last dangling alias; gate flips to PASS. |
| Manual alias-target spot checks | Automated `npm run alias:integrity` gate | Phase 50 (v2.9) | Deterministic before/after proof with exit codes + `--json`. |

**Deprecated/outdated:**
- The interim exception posture for `ylang ylang` (Phase 20 `accepted_exception_interim`) is superseded by the `add_target` decision; do **not** re-add it as a formal exception (D-51-03).

## Project Constraints (from .cursor/rules/)

**No `.cursor/rules/` directory exists in this repo** [VERIFIED: glob `.cursor/rules/**` → 0 files]. There are therefore no `.cursor/rules/` directives to honor. The authoritative constraints for this phase are the locked decisions D-51-01..D-51-27 (above) and the protected-boundary list below. Treat them with locked-decision authority.

### Protected-Boundary / Project Constraints (restated from 51-CONTEXT.md)
Phase 51 must **not** touch any of the following (D-51-23/D-51-25/D-51-26, plus v2.8 D-48 protected-surface precedent):
- **Relations / accords:** no changes to `data/inference/curated_relations.v2.json` or `data/inference/accord_map.v2.json`; missing coverage for `ylang_ylang` stays neutral/undefined.
- **Alias map:** `data/taxonomy/descriptor_aliases.seed.json` stays byte-identical (D-51-05). Compiled `descriptor_aliases.json` is regenerated but the map content stays 18 entries unchanged.
- **Exception policy:** `data/taxonomy/alias_target_exceptions.v1.json` stays the empty list (D-51-03/D-51-14).
- **Corpus candidate `ylang`:** not promoted/mutated (D-51-26).
- **CLI defaults:** `src/cli/parse_args.ts` `DEFAULT_PATHS` byte-identical incl. `version: '2.1.0'` (D-51-21).
- **Low_support matrices / seed_corpus_conflict / scoring / Graphify outputs / MVP / SaaS / Knowledge Engine / UI** (D-51-25).
- **v1 artifacts:** `data/compiled/v1/*` and `data/taxonomy/taxonomy-seed.v1.json` byte-identical.
- **No new family/subfamily; no stretch placement** (D-51-07/D-51-09).
- **Only one dangling target** is in scope — exactly `ylang ylang -> ylang_ylang` (D-51-27).
- Note: `graphify-out/*` dirty working tree is `accepted_with_policy` from prior phases — do not stage/clean/commit it.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `ylang_ylang` is a legitimate olfactory descriptor with safe semantic fit in `floral/floral_white` (satisfies D-51-10/D-51-11). | Pattern 1 / Safe-Fit | LOW — ylang-ylang is a canonical white-floral material; but D-51-15 still requires the executor to document the safe-fit rationale before mutating, and D-51-16 requires halting if fit cannot be confirmed. This is a curation judgment the executor must affirm, not a fact this research can finalize. |
| A2 | `/tmp` is writable for the sandbox compile. | Environment Availability | LOW — standard on the dev machine; planner may use any scratch dir (discretion). |
| A3 | Post-publication the gate will report `compiled_descriptor_count: 341`, `valid_target_count: 18`, `unresolved_target_count: 0`. | Summary / Pitfalls | LOW — follows directly from adding one resolving descriptor; confirmed by the gate's logic. Verify empirically after publish. |

**All other claims in this research are [VERIFIED] against repo files/commands or [CITED] from CONTEXT/Phase-48.**

## Open Questions

1. **Is `floral/floral_white` semantic fit formally confirmed for `ylang_ylang`? (RESOLVED)**
   - What we know: D-51-06 sets a strong preferred lock to `floral_white`; `ylang_ylang` (ylang-ylang) is a classic white-floral material; peers include `jasmine`, `tuberose`, `gardenia`, `orange_blossom`.
   - Resolution: Placement target is locked by D-51-06 to `floral/floral_white`. Per D-51-07/D-51-15 the executor must affirm and document safe-fit in phase artifacts before mutation (tracked as Assumption A1). Research does not need to choose a placement — it is locked.

2. **Does editing only the seed make the gate pass? (RESOLVED)**
   - Resolution: No. The gate reads compiled IDs; official publication to `data/compiled/v2` is mandatory (D-51-20, verified in `alias_integrity.ts`). Captured as Pitfall 2.

3. **Is the compile output flag `--out` or `--output`? (RESOLVED)**
   - Resolution: `--out` only; `--output` is rejected as `Unknown option` [VERIFIED: `src/cli/parse_args.ts:35-46,77-79`; corroborated by 48-CONTEXT D-48-SB01]. Version flag is `--version`.

4. **Will the full test suite pass after remediation without test changes? (RESOLVED)**
   - Resolution: No. `alias_target_inventory.test.ts` and `cli/alias_integrity.test.ts` lock the pre-remediation state and must be updated. Captured as Pitfall 1 and Wave 0 gap.

5. **Must `DEFAULT_PATHS` change for v2.9.0? (RESOLVED)**
   - Resolution: No. `--version 2.9.0` at compile time only; `DEFAULT_PATHS.version` stays `'2.1.0'` (D-51-21, v2.8 D-48-V02 precedent).

## Validation Architecture

> `workflow.nyquist_validation` is enabled (`.planning/config.json` → `"nyquist_validation": true`) [VERIFIED]. Section included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest `^3.2.0` [VERIFIED: `src/package.json`] |
| Config file | `src/vitest.config.ts` [CITED: 50-VALIDATION.md] |
| Quick run command | `npm --prefix src test -- --run tests/cli/alias_integrity.test.ts tests/inventory/alias_target_inventory.test.ts` |
| Full suite command | `npm --prefix src test` (= `vitest run`) [VERIFIED: `src/package.json` `test`] |
| Deterministic gate (non-test) | `npm run alias:integrity -- --json` (exit code is the proof) |

### Phase Requirements → Test/Proof Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HYG-01 (before) | Gate FAILs (exit 1) with exactly `ylang ylang -> ylang_ylang` | proof CLI | `cd src && npm run alias:integrity -- --json` (expect exit 1) | ✅ (verified this session) |
| HYG-01 (mutate) | `ylang_ylang` appended to `floral_white` in seed | manual diff | `git diff data/taxonomy/taxonomy-seed.v2.json` (one added string) | N/A (data) |
| HYG-01 (publish) | v2.9.0 artifacts written to `data/compiled/v2` | manual/CLI | sandbox `npm run compile -- --version 2.9.0 --out /tmp/...` then official `npm run compile -- --version 2.9.0` | ✅ `src/cli/compile.ts` |
| HYG-01 (after) | Gate PASSes (exit 0), 341 descriptors, 18 valid, 0 unresolved | proof CLI | `cd src && npm run alias:integrity -- --json` (expect exit 0) | ✅ |
| HYG-01 (regression) | Full suite green incl. updated state-locked tests | unit/integration | `npm --prefix src test` | ✅ (tests exist; expectations need update) |

### Sampling Rate
- **Per task commit:** `npm --prefix src test -- --run tests/cli/alias_integrity.test.ts tests/inventory/alias_target_inventory.test.ts`
- **Per wave merge:** `npm --prefix src test`
- **Phase gate:** Full suite green AND `npm run alias:integrity` exit 0 before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] **Update `src/tests/inventory/alias_target_inventory.test.ts`** — post-remediation counts (341 descriptors, 18 valid, 0 dangling, `ylang_ylang` present in compiled + seed). Currently asserts the pre-remediation state and WILL fail after publish.
- [ ] **Update `src/tests/cli/alias_integrity.test.ts`** — the "runs against real data" case must expect `exitCode === 0` / `status: 'PASS'` / `unresolved_target_count: 0` instead of the `ylang ylang` FAIL. (Temp-fixture PASS/FAIL cases and the `--help`/wiring cases are unaffected.)
- [ ] **Verify `src/tests/curation/alias_seed_v2.test.ts`** — references `ylang ylang -> ylang_ylang` in its `existingApprovedAliases` fixture and treats it as a preserved legacy alias [VERIFIED: lines 51-64]. Since the alias map is unchanged (D-51-05), this test is expected to remain green, but the planner should run it to confirm adding the `ylang_ylang` seed descriptor does not trip any "preserved legacy alias" assertion. (MEDIUM confidence it stays green — verify empirically.)

*No new test files or framework install needed — existing infrastructure covers HYG-01; the gaps are expectation updates, not net-new suites.*

## Security Domain

Not applicable in the threat-model sense — this phase adds a curated data string and republishes deterministic artifacts; there is no auth, input from untrusted sources, network, or crypto surface. The relevant "security-adjacent" guarantee is **fail-closed integrity**: `validateExceptionPolicy` fails closed on malformed exception policy [VERIFIED: `src/compiler/alias_target_integrity.ts:37-91`], and the empty exception list must remain empty (D-51-03/D-51-14). The protected-boundary assertions (Project Constraints section) are the integrity controls for this phase.

## Sources

### Primary (HIGH confidence — repo files & commands, verified this session)
- `npm run alias:integrity --silent -- --json` → exit 1, FAIL, 1 unresolved `ylang ylang -> ylang_ylang` (before-state proof)
- `data/taxonomy/taxonomy-seed.v2.json:1-26` — seed structure; descriptors are plain strings; `floral_white` list
- `data/compiled/v2/taxonomy.json:1159-1165` (jasmine compiled shape), `:1342-1349` (`ylang` corpus candidate)
- `data/taxonomy/descriptor_aliases.seed.json:19` (`"ylang ylang": "ylang_ylang"`), `alias_target_exceptions.v1.json` (empty)
- `src/cli/parse_args.ts:16-46,77-79` — DEFAULT_PATHS, FLAG_TO_KEY (`--out`, `--version`), unknown-option rejection
- `src/cli/compile.ts:15-33,80,99-184` — compile CLI flags/help, `resolveOutputDir`
- `src/cli/alias_integrity.ts:43-93` — gate reads compiled taxonomy IDs; exit code semantics
- `src/compiler/alias_target_integrity.ts:37-132` — validation + fail-closed policy
- `src/package.json:6-16` — scripts (`precompile`/`compile`/`alias:integrity`/`test`)
- `src/tests/cli/alias_integrity.test.ts`, `src/tests/inventory/alias_target_inventory.test.ts`, `src/tests/curation/alias_seed_v2.test.ts` — state-locked expectations
- glob `.cursor/rules/**` → 0 files (no project rules dir)
- `.planning/config.json` → `nyquist_validation: true`

### Secondary (CITED — planning docs)
- `.planning/phases/51-legacy-alias-remediation/51-CONTEXT.md` — locked decisions D-51-01..D-51-27
- `.planning/phases/48-v2-8-artifact-publication-closure/48-CONTEXT.md` — explicit-version two-step publish; `--out` (not `--output`) precedent
- `.planning/phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md` — `ylang_ylang` absent; `ylang` corpus near-match
- `.planning/phases/50-alias-target-integrity-automation/50-VALIDATION.md` — test commands & sampling
- `.planning/ROADMAP.md:102-117`, `.planning/REQUIREMENTS.md` (HYG-01), `.planning/STATE.md`

### Tertiary (LOW confidence)
- None — all findings verified or cited.

## Metadata

**Confidence breakdown:**
- Standard stack: N/A — no new deps (explicit, verified).
- Architecture / mutation surface: HIGH — exact file/line and JSON shape verified; mutation is a single string append.
- Compile/publish flags: HIGH — `--out`/`--version` verified in `parse_args.ts` and corroborated by Phase 48.
- Proof chain: HIGH — before-state run executed this session; gate logic read directly.
- Test impact: HIGH — two breaking tests identified by reading assertions directly; a third flagged for empirical verification.

**Research date:** 2026-06-05
**Valid until:** 2026-07-05 (stable internal data/CLI; re-verify if the compile CLI or seed schema changes)
