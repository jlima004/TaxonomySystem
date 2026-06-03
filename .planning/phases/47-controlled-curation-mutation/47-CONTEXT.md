# Phase 47: Controlled Curation Mutation - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 47 is **seed-mutation-only with sandbox validation**. It applies exactly the 12 `promote_to_seed` rows from `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` to the canonical v2 seed taxonomy `data/taxonomy/taxonomy-seed.v2.json`, then runs `tsc --noEmit` + `vitest run` + a sandbox compile in `/tmp` as **validation only** — official `data/compiled/v2` publication is owned by Phase 48.

Phase 47 may create or update only:
- `data/taxonomy/taxonomy-seed.v2.json` (12 atomic seed additions, no other field change)
- Phase 47 planning/closure artifacts (47-01-PLAN.md, 47-VERIFICATION.md, 47-01-SUMMARY.md, 47-CONTEXT.md, 47-DISCUSSION-LOG.md)
- Bookkeeping updates to `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md` only when phase status must change

Phase 47 must **not**:
- Touch `data/compiled/*` (Phase 48 publishes).
- Touch `data/taxonomy/taxonomy-seed.v1.json`, `data/taxonomy/descriptor_aliases.seed.json`, `data/inference/*`.
- Touch `src/cli/parse_args.ts`, any other `src/*`, `graphify-out/*`, `package.json`, `package-lock.json`, or any UI/MVP/SaaS/Knowledge Engine/scoring files.
- Execute any of the 28 non-executable matrix rows (`mutation_allowed=false`, `phase47_instruction=none`).
- Execute any `add_alias` row (count is zero by Phase 46 disposition).
- Reconsider v2.7 explicit decisions, reopen `seed_corpus_conflict`, or stretch-place candidates into weak subfamilies.
- Create new families or subfamilies.

**Phase chain:** Phase 45 selected → Phase 46 decided → **Phase 47 mutates + validates** → Phase 48 publishes.

</domain>

<decisions>
## Implementation Decisions

### Scope of Mutation (User-Verbatim Lock)
- **D-47-01:** Phase 47 executes only the **12** `promote_to_seed` rows from `46-DECISION-MATRIX.md`. All other matrix rows are ignored.
- **D-47-02:** Phase 47 executes **zero** `add_alias` rows (the Phase 46 matrix has zero such rows by design).
- **D-47-03:** Phase 47 ignores all **28** non-executable rows (`mutation_allowed=false`, `phase47_instruction=none`). These remain on the review queue as non-promoted decisions for future batches.
- **D-47-04:** Phase 47 does **not** publish compiled artifacts. The 12 seed additions stay in `data/taxonomy/taxonomy-seed.v2.json` only; `/tmp` sandbox compile output is captured and discarded. Phase 48 owns official `data/compiled/v2` publication.
- **D-47-05:** Phase 47 must **not** touch Graphify, scoring, UI, Knowledge Engine, MVP, or SaaS code/data/artifacts.
- **D-47-06:** Phase 47 runs `tsc --noEmit`, `vitest run`, and `/tmp` sandbox compile strictly as validation. Publication of `data/compiled/v2` artifacts (version 2.8.0) is Phase 48's job.

### Mutation Mechanism
- **D-47-07:** Apply the 12 seed additions via direct JSON `Edit` on `data/taxonomy/taxonomy-seed.v2.json`. One `Edit` per add_seed instruction. Insert the new descriptor string at the end of the existing `descriptors` array of the matching subfamily. No key additions, no new subfamily, no metadata/version/author/timestamp changes. Matches Phase 23 (lemon_peel) and Phase 42 (peppermint/rosemary/cumin/spearmint/caraway/opoponax) precedent exactly.
- **D-47-08:** After the 12 atomic edits, run an inline Python parser assertion to prove:
  - Exactly 12 new descriptors exist at the approved `target_family/target_subfamily/target_descriptor` paths.
  - No descriptor was added outside the approved list.
  - No descriptor was removed.
  - No other JSON field changed (top-level keys, version, metadata block, all other subfamily descriptor arrays).
- **D-47-09:** The 12 approved `phase47_instruction` values from `46-DECISION-MATRIX.md` are mechanical and parseable. They name the exact `target_family`, `target_subfamily`, and `descriptor` for each row. Phase 47 must not infer targets from rationale, evidence, Phase 45 selection, or `phase45_inferred_subfamily` (D-46-31 carry-forward).

### Approved 12 Row Set (Phase 47 Mutation Set)
- **D-47-10:** Phase 47 must apply exactly these 12 additions (id ↔ target path):
  - `05` → `spicy/warm_spice/carrot_seed`
  - `10` → `floral/floral_white/freesia`
  - `11` → `spicy/warm_spice/cardamom`
  - `14` → `citrus/citrus_fresh/tangerine`
  - `15` → `spicy/warm_spice/saffron`
  - `20` → `floral/floral_white/osmanthus`
  - `21` → `spicy/warm_spice/cubeb`
  - `22` → `floral/floral_white/elderflower`
  - `29` → `spicy/warm_spice/mace`
  - `30` → `floral/floral_white/linden_flower`
  - `32` → `woody/woody_dry/agarwood`
  - `37` → `amber_resinous/balsamic_resin/tolu`
- **D-47-11:** All 12 targets reference **existing** family and subfamily nodes in `taxonomy-seed.v2.json` (D-46-08 carry-forward). No new family, no new subfamily, no stretch placement.
- **D-47-12:** The remaining 28 rows (ids `01`-`04`, `06`-`09`, `12`-`13`, `16`-`19`, `23`-`28`, `31`, `33`-`36`, `38`-`40`) are non-executable and must remain on the review queue untouched.

### Validation Flow (Sandbox Only)
- **D-47-13:** After the 12 JSON edits, run `tsc --noEmit` against `src/` if the `tsc` binary is available in the current environment. If unavailable, skip with a documented note in `47-VERIFICATION.md`.
- **D-47-14:** Run the full `vitest run` suite from the `src/` package. Phase 47 must not skip or narrow the suite.
- **D-47-15:** Run a sandbox compile in `/tmp` (e.g. `cd src && node dist/cli/compile.js --version 2.8.0 --output /tmp/compile-2.8-validate/ ...`) or the equivalent CLI invocation that mirrors the v2.7 Phase 43 two-step pattern. Capture stderr, stdout, and the produced JSON artifacts under `/tmp`.
- **D-47-16:** Assert the sandbox compile produces **zero hard failures** (the v2.7 invariant). Capture family/subfamily/seed descriptor counts, total compiled descriptor count, review_queue count, and graph edge count from the `/tmp` artifacts. Do not copy `/tmp` artifacts into `data/compiled/v2/`.
- **D-47-17:** Write the captured validation metrics and zero-hard-failures assertion to `.planning/phases/47-controlled-curation-mutation/47-VERIFICATION.md`. Phase 48 will re-measure from published JSON.

### Protected-Boundary Guardrails
- **D-47-18:** Allow-list of files Phase 47 may touch:
  - `data/taxonomy/taxonomy-seed.v2.json` (12 atomic additions only).
  - `.planning/phases/47-controlled-curation-mutation/*` (planning/closure artifacts).
  - `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md` (bookkeeping only).
  - No other files.
- **D-47-19:** Explicitly forbidden paths (block-list, must remain byte-identical):
  - `data/compiled/*` (Phase 48 owns this).
  - `data/taxonomy/taxonomy-seed.v1.json` (v1 baseline/archive).
  - `data/taxonomy/descriptor_aliases.seed.json` (no aliases in this phase).
  - `data/inference/*` (relation/accord inputs untouched).
  - `src/cli/parse_args.ts` (no `DEFAULT_PATHS` or version change).
  - `src/**` (no source change).
  - `graphify-out/*` (no Graphify work).
  - `package.json`, `package-lock.json`, `pnpm-lock.yaml` (no dependency change).
  - Any UI / MVP / SaaS / Knowledge Engine / scoring file.
- **D-47-20:** Run `scripts/check-safety-guards.sh` (Phase 16 guard) **before** and **after** the 12 edits. Both runs must pass with no staged protected-path, staged `graphify-out/*`, or protected-diff violations.
- **D-47-21:** Run `git diff --name-only` at the end of Phase 47 and assert every changed path is in the D-47-18 allow-list. Any path outside the allow-list is an immediate halt condition — Phase 47 must not commit until the drift is removed.
- **D-47-22:** Dirty `graphify-out/*` in the working tree remains `accepted_with_policy` (Phase 15) and is not a Phase 47 concern unless staged.

### Plan Structure
- **D-47-23:** Phase 47 ships a **single** plan: `47-01-PLAN.md` covering the full mutation + validation flow.
- **D-47-24:** The single 47-01 plan must follow this 10-step flow (user-locked):
  1. Parse `46-DECISION-MATRIX.md` and extract only the rows where `mutation_allowed=true`.
  2. Confirm all 12 extracted rows have `disposition == promote_to_seed`.
  3. Confirm `add_alias` count is zero.
  4. Apply 12 direct JSON `Edit` ops to `data/taxonomy/taxonomy-seed.v2.json` (one per approved row, descriptor appended to the existing subfamily `descriptors` array).
  5. Verify exactly 12 additions landed at the approved paths (inline Python parser assertion).
  6. Confirm zero alias mutation (no edits to `descriptor_aliases.seed.json`).
  7. Run `scripts/check-safety-guards.sh` and the protected-diff `git diff --name-only` assertion.
  8. Run `tsc --noEmit` (if available), `vitest run` (full suite), and a sandbox compile in `/tmp` with `--version 2.8.0`. Capture metrics.
  9. Record validation metrics and zero-hard-failures assertion in `47-VERIFICATION.md`.
  10. Create `47-01-SUMMARY.md` with final per-row status, validation summary, and a clear "Phase 48 owns publication" pointer.
- **D-47-25:** Each of the 12 edits is committed atomically (one commit per add_seed instruction) to preserve Phase 42 / Phase 23 auditability. The 12 commits may be batched under a single plan commit if the executor prefers — atomicity is required at the instruction level, not the commit level.
- **D-47-26:** All task commits touching the seed file are guarded by the Phase 16 `scripts/check-safety-guards.sh` exit code. A non-zero exit halts the plan and reverts the uncommitted diff.

### Carry-Forward From Phase 46
- **D-47-27:** D-46-08 / D-46-09 / D-46-10 / D-36 (no new family, no new subfamily, no stretch placement) are inherited unchanged. Every one of the 12 targets was validated against existing taxonomy in Phase 46.
- **D-47-28:** D-46-30 / D-46-31 / D-46-32 / D-46-42 (Phase 47 prohibitions on inference, non-approved row execution, reinterpretation, conflict reopening) are inherited unchanged.
- **D-47-29:** D-46-40 / D-46-41 (mechanical `phase47_instruction` literals) are the parser input contract. The 12 `add_seed target_family=... target_subfamily=... descriptor=...` strings are passed through verbatim into the Edit operations; no normalization, no interpretation.
- **D-47-30:** D-46-43 (recommended `expected_effect` and `notes` columns) is honored in `47-01-SUMMARY.md` per-row reporting.

### Closure Artifacts
- **D-47-31:** Phase 47 produces these closure artifacts:
  - `.planning/phases/47-controlled-curation-mutation/47-01-PLAN.md` (single plan, locked 10-step flow).
  - `.planning/phases/47-controlled-curation-mutation/47-VERIFICATION.md` (parser + safety-guard + diff + compile metrics + zero-hard-failures assertion).
  - `.planning/phases/47-controlled-curation-mutation/47-01-SUMMARY.md` (per-row status, validation summary, Phase 48 handoff note).
  - `.planning/phases/47-controlled-curation-mutation/47-DISCUSSION-LOG.md` (human-only audit trail).
- **D-47-32:** Phase 47 does **not** produce a closure report with published-JSON metrics. That report is Phase 48's deliverable, because the source of truth for it is the published compiled JSON, which Phase 47 deliberately does not produce.

### Handoff to Phase 48
- **D-47-33:** Phase 48 will (a) re-validate the 12 seed additions by parsing `taxonomy-seed.v2.json`, (b) run the official compile with explicit `--version 2.8.0` writing to `data/compiled/v2/`, (c) confirm zero hard failures, (d) publish, (e) capture the closure report with metrics from the published JSON. Phase 47 is done when all 12 descriptors are in the seed file and the sandbox validation passed — Phase 48 owns publication.

### the agent's Discretion
- Exact Python parser snippet shape in 47-01 plan (must produce exactly the assertions in D-47-08 and D-47-21, otherwise free).
- Whether to commit the 12 edits as 12 atomic commits or batch them into one plan-level commit (atomicity at instruction level is required).
- Whether to add per-row commit messages that include the matrix id (e.g. `phase47(05): add carrot_seed to warm_spice`) for traceability.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Requirements
- `.planning/ROADMAP.md` — Phase 47 goal, success criteria, CUR-01–CUR-03
- `.planning/REQUIREMENTS.md` — CUR-01, CUR-02, CUR-03; protected v2.8 out-of-scope list
- `.planning/PROJECT.md` — v2.8 milestone boundaries, v2.7 D-36 precedent, Phase 16 safety-guard decision
- `.planning/STATE.md` — current execution state, v2.7 two-step publication precedent, Phase 16 closure

### Phase 46 Decision Matrix (Sole Mutation Authorization)
- `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` — exactly 40 rows; 12 with `mutation_allowed=true` and mechanical `phase47_instruction`; 28 with `mutation_allowed=false` and `phase47_instruction=none`. Phase 47 consumes only the 12 executable rows.
- `.planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md` — D-46-30, D-46-31, D-46-32, D-46-40, D-46-41, D-46-42 (Phase 47 contract)
- `.planning/phases/46-batch-2-decision-matrix/46-PATTERNS.md` — Phase 23/25/27/33/42 microcuration patterns (precedent for direct JSON Edit)

### Phase 45 Selection Input
- `.planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md` — exactly 40 selected candidates and selection rationale
- `.planning/phases/45-batch-2-candidate-selection/45-CONTEXT.md` — selection policy, zero-mutation boundary, food/off-note caution

### Phase 44 Inventory Baseline
- `.planning/phases/44-remaining-low-support-inventory/44-LOW-SUPPORT-INVENTORY.md` — 259 candidate pool, evidence fields

### v2.7 Precedent (Direct-JSON-Edit Microcuration)
- `.planning/milestones/v2.7-ROADMAP.md` — Phase 42 microcuration + Phase 43 publication two-step pattern
- `.planning/milestones/v2.7-REQUIREMENTS.md` — CUR-02 matrix-gated mutation
- `src/tests/fixtures/curation/41-DECISION-MATRIX.md` — matrix shape, execution summary, 6-row v2.7 pattern
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Phase 41 parser precedent for matrix → seed entry derivation

### Phase 16 Safety Guard (Runtime Enforcement)
- `scripts/check-safety-guards.sh` — non-mutating local script protecting staged `graphify-out/*`, staged protected paths, and working-tree protected diffs. Run before and after Phase 47 mutation.

### Seed / Taxonomy Shape (Read-Only Reference for Target Validation)
- `data/taxonomy/taxonomy-seed.v2.json` — current v2 seed (Phase 47 mutates this file with 12 add_seed ops; the 12 target paths in D-47-10 are validated against this file before each Edit)
- `data/compiled/v2/taxonomy.json` — v2.7 compiled output (read-only reference for target-existence check, NOT a mutation target)
- `data/compiled/v2/descriptor_aliases.json` — existing alias map (read-only; zero Phase 47 changes)
- `data/compiled/v2/similarity_matrix.json` — current `corpus_candidate_low_support` review_queue evidence (read-only)

### CLI / Compiler Defaults (Must Not Change)
- `src/cli/parse_args.ts` — `DEFAULT_PATHS` and version behavior. Phase 47 must not modify.
- `src/compiler/*` — compilation pipeline. Phase 47 reads but does not modify.

### Out-of-Scope / Protected Surfaces
- `data/compiled/*` — Phase 48 publishes.
- `data/taxonomy/taxonomy-seed.v1.json` — v1 baseline archive.
- `data/taxonomy/descriptor_aliases.seed.json` — no aliases in this phase.
- `data/inference/*` — relation/accord inputs untouched.
- `graphify-out/*` — accepted-with-policy dirty working tree; Phase 47 does not clean, stage, or commit.

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- `data/taxonomy/taxonomy-seed.v2.json` is the canonical seed and the only file Phase 47 mutates. It already has 10 families, 18 subfamilies, 39 curated seed descriptors. All 12 target paths in D-47-10 reference existing family+subfamily nodes in this file (no new structure needed).
- `scripts/check-safety-guards.sh` (Phase 16) is the runtime guard for staged protected-path, staged `graphify-out/*`, and protected-diff violations. Reused as-is for Phase 47.
- `src/tests/curation/taxonomy_seed_v2.test.ts` parser precedent (`parsePhase41DecisionMatrixApprovedSeedEntries`) is the mental model for the inline Python parser assertion in D-47-08. Phase 47's parser verifies the 12 expected `target_family/target_subfamily/target_descriptor` paths exist in the mutated seed and nothing else changed.

### Established Patterns
- Curation microcuration milestones apply direct JSON `Edit` to the seed file (Phase 23 lemon_peel, Phase 25 cedarwood, Phase 27 ambergris, Phase 33 rosewood alias, Phase 42 peppermint/rosemary/cumin/spearmint/caraway/opoponax). Phase 47 follows the same pattern with 12 add_seed ops instead of alias or add_target ops.
- v2.7 Phase 42 (2 plans) → Phase 43 (1 plan) two-step pattern: mutation, then sandbox validation in `/tmp` with explicit `--version` flag, then official publication. Phase 47 owns the mutation + sandbox validation step; Phase 48 owns publication.
- `taxonomy-seed.v2.json` v2.0.0 with `metadata.created_at` and `metadata.author` set at Phase 10. Phase 47 does not change `version`, `metadata.created_at`, `metadata.author`, or `metadata.description`.

### Integration Points
- Phase 47 reads `46-DECISION-MATRIX.md` (40-row table) → parses 12 `mutation_allowed=true` rows → applies 12 atomic `Edit` ops to `data/taxonomy/taxonomy-seed.v2.json` → runs `tsc --noEmit` + `vitest run` + `/tmp` sandbox compile with `--version 2.8.0` → writes `47-VERIFICATION.md` and `47-01-SUMMARY.md`.
- Phase 48 then runs the official compile, publishes to `data/compiled/v2/`, captures the closure report from the published JSON.
- No compiler, runtime, CLI default, or Graphify code change is expected in Phase 47.

</codebase_context>

<specifics>
## Specific Ideas

- The 12-row executable set maps to 5 subfamilies: `warm_spice` (5: carrot_seed, cardamom, saffron, cubeb, mace), `floral_white` (4: freesia, osmanthus, elderflower, linden_flower), `citrus_fresh` (1: tangerine), `woody_dry` (1: agarwood), `balsamic_resin` (1: tolu). 6 subfamilies are untouched, 4 subfamilies get one new seed, 1 subfamily gets five.
- After Phase 47, `taxonomy-seed.v2.json` will have 49 curated seed descriptors (current 39 + 12) and 12 new descriptors that are absent from current `descriptor_aliases.json` (no alias-side duplication).
- `phase47_instruction` literal format already locked in 46-DECISION-MATRIX: `add_seed target_family=<family> target_subfamily=<subfamily> descriptor=<descriptor>`. The 12 strings are passed through verbatim into the Edit operations.
- The v2.7 two-step pattern (Phase 42 mutation + Phase 43 sandbox compile + official publish) is the precedent for Phase 47 + Phase 48. Phase 47 = mutation + sandbox compile only; Phase 48 = official publish + closure.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. The 6 lock points in the user prompt (12 promote_to_seed, zero add_alias, ignore 28 non-executable, no artifact publish, no Graphify/scoring/UI/KE/MVP, compile/tests as validation only) are all preserved as D-47-01 through D-47-06.

The remaining 28 non-executable matrix rows remain on the review queue and are not part of Phase 47. They will be reconsidered only in future batches with explicit planning (FUT-01, FUT-02 in REQUIREMENTS.md).

</deferred>

---

*Phase: 47-controlled-curation-mutation*
*Context gathered: 2026-06-03*
