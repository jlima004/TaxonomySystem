# Phase 48: v2.8 Artifact Publication & Closure - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 48 is the **publication-and-closure** step of milestone v2.8. It takes the 12 seed additions applied in Phase 47 (now living in `data/taxonomy/taxonomy-seed.v2.json`) and turns them into the **official published v2.8.0 compiled artifacts** in `data/compiled/v2/`, then produces a **closure report whose metrics are read from the published JSON** (not from `/tmp`). Phase 48 does **not** mutate the seed, aliases, relations/accords, or any source code.

**Phase chain:** Phase 45 selected → Phase 46 decided → Phase 47 mutated + sandbox-validated → **Phase 48 publishes + closes**.

### Allowed surfaces
Phase 48 may create or update only:
- `data/compiled/v2/taxonomy.json`, `data/compiled/v2/descriptor_aliases.json`, `data/compiled/v2/similarity_matrix.json` (overwrite of v2.7.0 → v2.8.0 via the official compile).
- `.planning/releases/v2.8.0-CLOSURE.md` (the **release-style closure report** — measured from the published JSON, not /tmp).
- `.planning/phases/48-v2-8-artifact-publication-closure/48-01-PLAN.md`, `48-VERIFICATION.md`, `48-01-SUMMARY.md`, `48-CONTEXT.md`, `48-DISCUSSION-LOG.md`.
- Bookkeeping updates to `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md` only when phase status must change.

### Forbidden surfaces (must remain byte-identical)
- `data/taxonomy/taxonomy-seed.v1.json` (v1 baseline/archive).
- `data/taxonomy/descriptor_aliases.seed.json` (no aliases in this phase; Phase 47 zero-alias carry-forward).
- `data/inference/curated_relations.v2.json`, `data/inference/accord_map.v2.json`, `data/inference/semantic_noise.v1.json`, `data/inference/conflict_stopwords.v1.json`.
- `data/compiled/v1/*` (v1 archive).
- `src/cli/parse_args.ts` — `DEFAULT_PATHS.version` stays at `2.1.0` (D-48-V01).
- `src/**` (no source change).
- `graphify-out/*` (accepted_with_policy dirty working tree; must not be staged or committed).
- `package.json`, `package-lock.json` (no dependency change).
- Any UI / MVP / SaaS / Knowledge Engine / scoring / Graphify code/data/artifact.

### Prohibited behaviors
- Reopen or reconsider v2.7 explicit decisions (D-47-04 / v2.7 carry-forward).
- Reopen `seed_corpus_conflict` items.
- Stretch-place candidates, create new families/subfamilies, or mutate aliases/relations/accords.
- Skip the sandbox step (Phase 43 two-step pattern is mandatory).

</domain>

<decisions>
## Implementation Decisions

### Sandbox-vs-Publish Flow (D-48-FLOW)
- **D-48-F01:** Phase 48 follows the **two-step Phase 43 publication pattern**: (1) sandbox compile in `/tmp` with `--version 2.8.0` → (2) assert zero hard failures → (3) official compile in `data/compiled/v2/` with the same `--version 2.8.0` flag. **No single-step publication.** The /tmp artifacts are validation-only and must not be copied or referenced as source of truth.
- **D-48-F02:** The sandbox compile must produce **zero hard failures** (the v2.7 invariant). The official compile must also produce zero hard failures. Any hard failure is an immediate halt; Phase 48 must not commit publication until both passes are clean.
- **D-48-F03:** The sandbox compile output directory is **discarded** after validation. The /tmp artifacts are not the source of truth for the closure report — only the published `data/compiled/v2/` JSON is.

### Version String & DEFAULT_PATHS Policy (D-48-VER)
- **D-48-V01:** Phase 48 publishes with **explicit `--version 2.8.0`** at the official compile step. The CLI flag overrides the default.
- **D-48-V02:** `src/cli/parse_args.ts` `DEFAULT_PATHS.version` stays at `'2.1.0'` and **must not change**. This matches the v2.6 and v2.7 publication precedent (Phase 39 / Phase 43): no default-switch, no DEFAULT_PATHS mutation, no parser/CLI behavior change. The v2.8 version is delivered only via explicit `--version 2.8.0` at compile time.
- **D-48-V03:** The version string `2.8.0` appears in the published JSON outputs (`taxonomy.json.version`, `similarity_matrix.json.version`, `descriptor_aliases.json.version`) and in the closure report header.

### Closure Report Location & Metrics (D-48-CR)
- **D-48-CR01:** The **release-style closure report** lives at `.planning/releases/v2.8.0-CLOSURE.md` (matches the v1.0 / v2.1 / v2.2 / v2.3 / v2.4 / v2.5 release closure pattern; v2.6 used the phase dir and v2.7 was not preserved). The closure report is the **official milestone closure artifact**.
- **D-48-CR02:** Phase 48 may **also** write `48-VERIFICATION.md` and `48-01-SUMMARY.md` in the phase directory for GSD audit trail, but the release-style closure report at `.planning/releases/v2.8.0-CLOSURE.md` is the source of truth for milestone closure metrics.
- **D-48-CR03:** Closure report metrics are **measured from the published compiled JSON artifacts** in `data/compiled/v2/`, **not** from `/tmp`. The published JSON is re-parsed by the report writer; sandbox metrics are not cited.
- **D-48-CR04:** Mandatory metrics in the closure report:
  - `version` — must read `2.8.0` from all three published artifacts.
  - `family_count`, `subfamily_count`, `seed_descriptor_count` (from `taxonomy.json`).
  - `compiled_descriptor_count` (from `taxonomy.json.stats.descriptor_count`).
  - `alias_count` (from `descriptor_aliases.json` aliases map length).
  - `graph_edge_count` (from `similarity_matrix.json.stats.edge_count`).
  - `review_queue_total` and **breakdown by `type`** and by `severity` (from `similarity_matrix.json.review_queue`).
  - `validation_status` (must read `ok`).
  - `quality_gate_status` (must read `PASS`).
  - `generated_at` (timestamp from the published artifacts).
- **D-48-CR05:** The closure report must include a **pre/post delta table v2.7.0 → v2.8.0** for every mandatory metric. v2.7.0 baseline is read from git history (the `data/compiled/v2/` tree as it was before the v2.8 publication commit). Delta direction is documented (e.g., `+12 seed descriptors`, `±0 alias_count`, `±0 graph_edge_count`, `−N review_queue_total` because some low_support items were absorbed into the new seed set).
- **D-48-CR06:** The closure report must include an **explicit "Protected Boundaries Unchanged"** section that asserts:
  - `data/taxonomy/taxonomy-seed.v1.json` — byte-identical to its pre-publication state.
  - `data/taxonomy/descriptor_aliases.seed.json` — byte-identical (zero alias mutation in this phase).
  - `data/inference/*` — byte-identical (relation/accord inputs untouched).
  - `data/compiled/v1/*` — byte-identical.
  - `src/cli/parse_args.ts` — byte-identical (`DEFAULT_PATHS.version` still `2.1.0`).
  - `graphify-out/*` — no staged or committed changes.
  - `package.json` / `package-lock.json` — byte-identical.
  - No v2.7 explicit decision was reconsidered.
- **D-48-CR07:** The closure report must list the **12 promoted seed descriptors** (id ↔ `target_family/target_subfamily/target_descriptor`) and confirm each is present in the published `taxonomy.json` at the approved path.
- **D-48-CR08:** The closure report is the **last** step of Phase 48. It is written only after the published JSON passes the protected-boundary hash assertions, the safety guard, and the full vitest suite.

### Plan Structure (D-48-PLAN)
- **D-48-P01:** Phase 48 ships a **single** plan: `48-01-PLAN.md` covering the full publication + closure flow.
- **D-48-P02:** The single 48-01 plan must follow this locked 7-step flow (user-verbatim):
  1. **Pre-publication stability gate (WR-01):** Confirm `src/tests/fixtures/curation/46-DECISION-MATRIX.md` is present and that `vitest run` exits 0. The fixture was committed in Phase 47; this gate is a confirmation, not a fix. If the test fails, halt and repair (or escalate to a future phase).
  2. **Sandbox compile in `/tmp`:** Run the official compile with `--version 2.8.0` and an explicit `--out /tmp/compile-2.8-validate/`. Capture stderr, stdout, and the produced JSON artifacts. Assert `validation_status=ok` and `quality_gate_status=PASS` and zero hard failures.
  3. **Official compile to `data/compiled/v2/`:** Run the same compile with `--version 2.8.0` writing to `data/compiled/v2/` (the default `outputDir` resolved via the existing `resolveOutputDir` logic). Capture stdout.
  4. **Published-artifact verification:** Re-parse the three published JSON files, assert `version=2.8.0`, capture the full metric set per D-48-CR04, compute the pre/post delta vs v2.7.0 (read v2.7.0 baseline from git `HEAD~` or the previous commit before the publication commit), and assert the 12 promoted seeds are present at the approved paths in `taxonomy.json`.
  5. **Protected-boundary hash/diff assertions:** For each path in D-48-CR06, run `git diff --name-only` and an inline `sha256sum` (or equivalent) compare to confirm byte-identical state. Run `scripts/check-safety-guards.sh` and confirm exit 0.
  6. **Full test suite:** Run `vitest run` from the `src/` package. Assert exit 0 (full suite, not narrowed).
  7. **Closure report + bookkeeping:** Write `.planning/releases/v2.8.0-CLOSURE.md` with all mandatory metrics and assertions from D-48-CR04 / D-48-CR05 / D-48-CR06 / D-48-CR07. Write `48-VERIFICATION.md` and `48-01-SUMMARY.md` in the phase directory. Update `.planning/ROADMAP.md` (Phase 48 → Complete), `.planning/STATE.md` (current focus → milestone closure / next-milestone handoff), and `.planning/REQUIREMENTS.md` (PUB-01/PUB-02/PUB-03 → Complete). Then commit.
- **D-48-P03:** Each of the 7 steps is a separate task in the plan. Tasks must produce a clear pass/fail signal. Any task failure halts publication; the executor must not auto-recover.
- **D-48-P04:** The plan may commit the published artifacts and the bookkeeping updates as a single plan-level commit OR as two commits (data artifacts first, then bookkeeping). Atomicity is at the artifact level — the 3 JSON files in `data/compiled/v2/` must all be present and consistent in the same commit.
- **D-48-P05:** The closure report is committed in the same plan (last task), not deferred. The release closure is the publication's own signature — without it, the milestone is not closed.

### Pre-Publication Stability Gate — WR-01 (D-48-WR)
- **D-48-WR01:** Phase 48 must confirm the **WR-01 traceability test stability** as its first step. The Phase 46 decision matrix fixture is at `src/tests/fixtures/curation/46-DECISION-MATRIX.md` and the test resolves it first. The `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` fallback and the `.planning/milestones/v2.8-phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` archived fallback are listed in `resolveExistingPath` but the v2.8-phases archive does not yet exist (it will be created at milestone archival, not now).
- **D-48-WR02:** Phase 48's gate is **"full test suite passes during publication validation"**. As long as `vitest run` exits 0, the WR-01 fixture is sufficient. No additional archive copy is required pre-publication.
- **D-48-WR03:** The v2.8 archived fallback is a **milestone-archival concern** (post-publication), not a Phase 48 pre-publication blocker. Phase 48 explicitly does **not** create `.planning/milestones/v2.8-phases/...` artifacts.

### Sandbox Validation (D-48-SB)
- **D-48-SB01:** Sandbox compile uses the **same** CLI flags as the official compile, except `--out` points to `/tmp/compile-2.8-validate/` and `--generated-at` is set to a fixed timestamp ending in `Z` for determinism. The default inputs are used (`taxonomy-seed.v2.json`, `descriptor_aliases.seed.json`, `enriched_materials.json`, `curated_relations.v2.json`, `accord_map.v2.json`, `semantic_noise.v1.json`, `conflict_stopwords.v1.json`).
- **D-48-SB02:** Sandbox compile must be invoked via `npm run compile --` (or `cd src && npm run compile --`) so the TypeScript build is reproducible. If `dist/` is missing, `npm run precompile` (alias for `npm run build`) is run first.
- **D-48-SB03:** Sandbox metrics captured for the validation log: family_count, subfamily_count, seed_descriptor_count, compiled_descriptor_count, alias_count, edge_count, review_queue_total, validation_status, quality_gate_status, generated_at. These are *not* the closure report numbers; they are intermediate validation evidence. Closure numbers come from the published JSON re-parse.

### Official Publication (D-48-PUB)
- **D-48-PUB01:** Official compile uses `--version 2.8.0` and writes to `data/compiled/v2/` (the default `outputDir` resolved via the existing `resolveOutputDir` logic — `join('..', 'data/compiled/v2')` when run from the `src/` package).
- **D-48-PUB02:** The official compile **overwrites** the existing v2.7.0 artifacts in `data/compiled/v2/`. The previous v2.7.0 versions are recoverable from git history (the commit before the publication commit). v2.7.0 is not preserved as a side-by-side artifact in this phase; the closure report's pre/post delta table proves the change is bounded.
- **D-48-PUB03:** The official compile is invoked once. The published JSON files are the canonical v2.8.0 outputs. No second compile, no `--generated-at` override unless reproducibility testing requires it (and even then, the second compile output must not be the canonical one).
- **D-48-PUB04:** If the official compile produces any hard failure, the executor halts, the v2.7.0 artifacts are restored from git, and Phase 48 is marked failed. The closure report is **not** written in this case.

### Protected-Boundary Hash/Diff Assertions (D-48-PB)
- **D-48-PB01:** Phase 48 must run `git diff --name-only` against the previous commit and assert that the only changed paths are:
  - `data/compiled/v2/taxonomy.json`
  - `data/compiled/v2/descriptor_aliases.json`
  - `data/compiled/v2/similarity_matrix.json`
  - `.planning/releases/v2.8.0-CLOSURE.md` (or the closure report path)
  - `.planning/phases/48-v2-8-artifact-publication-closure/48-01-PLAN.md`, `48-VERIFICATION.md`, `48-01-SUMMARY.md`
  - `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md` (bookkeeping only)
- **D-48-PB02:** Phase 48 must run `scripts/check-safety-guards.sh` **before** the official compile (post sandbox), **after** the official compile, and **before** commit. All three runs must exit 0.
- **D-48-PB03:** Phase 48 must compute `sha256sum` for each protected path listed in D-48-CR06 **before** and **after** publication, and assert byte-identical hashes. This is the "hash assertion" referenced in D-48-P02 step 5.
- **D-48-PB04:** Any hash mismatch, any unlisted path in `git diff --name-only`, or any non-zero safety-guard exit is a **halt condition**. The plan must not commit until the drift is removed (or, if the drift is intentional and pre-authorized, escalated for explicit user approval).

### Closure Artifacts (D-48-CA)
- **D-48-CA01:** Phase 48 produces these closure artifacts:
  - `.planning/releases/v2.8.0-CLOSURE.md` (release-style closure report — D-48-CR01).
  - `.planning/phases/48-v2-8-artifact-publication-closure/48-01-PLAN.md` (the single locked 7-step plan).
  - `.planning/phases/48-v2-8-artifact-publication-closure/48-VERIFICATION.md` (per-step validation evidence: sandbox metrics, official compile output, hash assertions, safety-guard output, vitest output).
  - `.planning/phases/48-v2-8-artifact-publication-closure/48-01-SUMMARY.md` (per-step status, final published metrics, explicit "milestone closure ready" handoff).
  - `.planning/phases/48-v2-8-artifact-publication-closure/48-DISCUSSION-LOG.md` (human-only audit trail).
- **D-48-CA02:** `48-VERIFICATION.md` is the **audit-grade** record: it captures the exact CLI invocations, exact stdout, exact hash values, and the assertion results. It is consumed by future audits (Phase 48's own review, milestone audits, retrospective).
- **D-48-CA03:** `48-01-SUMMARY.md` is the **executive summary**: per-step pass/fail, final published metrics, and a clear "v2.8 milestone closure ready" pointer.

### Handoff to Milestone Closure
- **D-48-HC01:** Phase 48 is the **last** phase of milestone v2.8. After Phase 48 closes, milestone closure is a separate GSD workflow (`/gsd-complete-milestone`). Phase 48 produces the artifacts needed for that workflow; it does **not** execute the closure itself.
- **D-48-HC02:** The 28 non-executable Phase 46 matrix rows remain on the review queue and are not part of Phase 48. They will be reconsidered only in future batches with explicit planning (FUT-01, FUT-02 in REQUIREMENTS.md).

### the agent's Discretion
- The exact wording of the closure report's narrative sections (e.g., "What Shipped", "Issues Resolved", "Issues Deferred", "Technical Debt Incurred") — content must include the mandatory metrics in D-48-CR04 / D-48-CR05 / D-48-CR06 / D-48-CR07, but the prose around them is executor's choice.
- Whether to capture an additional `--quality-report` artifact in `48-VERIFICATION.md` (the CLI supports `--quality-report` which adds candidate_count, rejected_noise_count, etc. — useful evidence but not required by D-48-CR04).
- The exact Python or Node.js snippet shape used to re-parse the published JSON and compute the pre/post delta (must produce the metrics in D-48-CR04 and the hash assertions in D-48-PB03, otherwise free).
- Whether to commit the published artifacts and bookkeeping in one plan-level commit or two (D-48-P04).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Requirements
- `.planning/ROADMAP.md` — Phase 48 goal, success criteria, PUB-01/PUB-02/PUB-03
- `.planning/REQUIREMENTS.md` — PUB-01, PUB-02, PUB-03; protected v2.8 out-of-scope list; traceability table
- `.planning/PROJECT.md` — v2.8 milestone boundaries, v2.7 D-36 precedent, Phase 16 safety-guard decision
- `.planning/STATE.md` — current execution state, v2.7 two-step publication precedent, Phase 16 closure

### Phase 47 Handoff (Publication Authorization)
- `.planning/phases/47-controlled-curation-mutation/47-CONTEXT.md` — D-47-04 (no publish in Phase 47), D-47-32 (no closure report in Phase 47), D-47-33 (Phase 48 handoff)
- `.planning/phases/47-controlled-curation-mutation/47-VERIFICATION.md` — Phase 47 sandbox validation: 10 families, 18 subfamilies, 61 seed descriptors, 340 compiled descriptors, 13 graph edges, 256 review_queue (243 `corpus_candidate_low_support` + 13 `seed_corpus_conflict`), zero hard failures. Phase 48 re-measures from published JSON.
- `.planning/phases/47-controlled-curation-mutation/47-01-SUMMARY.md` — Phase 47 closure summary, per-row status, handoff pointer
- `.planning/phases/47-controlled-curation-mutation/47-REVIEW.md` — WR-01 (Phase 46 traceability fixture, fixture committed, v2.8-phases archived fallback is post-archival concern)

### Upstream Phase Artifacts
- `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` — 40-row matrix; 12 `promote_to_seed` rows drive the 12 seed additions
- `.planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md` — D-46-08/09/10/30/31/32/40/41/42/43 (Phase 47 contract, carried into Phase 48 indirectly)
- `.planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md` — 40 selected candidates and selection rationale
- `.planning/phases/44-remaining-low-support-inventory/44-LOW-SUPPORT-INVENTORY.md` — 259 candidate pool, evidence fields, exclusion of already-decided v2.7 items

### v2.7 Precedent (Two-Step Publication Pattern)
- `.planning/milestones/v2.7-ROADMAP.md` — Phase 43 publication: sandbox → official publish, explicit `--version 2.7.0`, two-step, closure report with dynamic metrics from published JSON
- `.planning/milestones/v2.7-REQUIREMENTS.md` — ART-01/ART-02/ART-03 mapped to Phase 43
- `src/tests/fixtures/curation/41-DECISION-MATRIX.md` — v2.7 matrix shape (Phase 41 → Phase 42 → Phase 43 pattern)
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Phase 41/46 parser precedent and traceability contract (this test is the WR-01 surface)

### Release Closure Pattern (v1.0 / v2.1–v2.5)
- `.planning/releases/v1.0.0-CLOSURE.md` — release closure structure
- `.planning/releases/v2.1.0-CLOSURE.md` — release closure structure
- `.planning/releases/v2.2.0-CLOSURE.md` — release closure structure
- `.planning/releases/v2.3.0-CLOSURE.md` — release closure structure
- `.planning/releases/v2.4.0-CLOSURE.md` — release closure structure
- `.planning/releases/v2.5.0-CLOSURE.md` — release closure structure (most recent release-pattern closure; minimal counts)
- `.planning/milestones/v2.6-phases/39-taxonomy-v2-6-stabilization-closure/39-CLOSURE.md` — v2.6 phase-pattern closure (alternative pattern)

### CLI / Compiler Defaults (Must Not Change)
- `src/cli/parse_args.ts` — `DEFAULT_PATHS` and version behavior. Phase 48 must not modify; `DEFAULT_PATHS.version` stays at `'2.1.0'` (D-48-V02).
- `src/cli/compile.ts` — compile CLI implementation. Phase 48 invokes; does not modify.
- `src/compiler/*` — compilation pipeline. Phase 48 reads; does not modify.

### Pre-Publication Stability (WR-01)
- `src/tests/curation/taxonomy_seed_v2.test.ts` — full curation test suite, includes Phase 46 traceability test. Must pass with full suite.
- `src/tests/fixtures/curation/46-DECISION-MATRIX.md` — Phase 46 decision matrix fixture (WR-01 fix). Phase 48's pre-publication gate confirms this fixture is present.
- `src/tests/fixtures/curation/41-DECISION-MATRIX.md` — Phase 41 decision matrix fixture (precedent for fixture pattern)
- `src/tests/fixtures/curation/20-FINAL-APPROVAL.md` — Phase 20 fixture (precedent for fixture pattern)
- `src/tests/fixtures/curation/31-FINAL-APPROVAL.md` — Phase 31 fixture (precedent for fixture pattern)
- `src/tests/fixtures/curation/38-SUMMARY.md` — Phase 38 fixture (precedent for fixture pattern)

### Seed / Taxonomy Shape (Read-Only Reference for Target Validation)
- `data/taxonomy/taxonomy-seed.v2.json` — current v2 seed with the 12 Phase 47 additions (Phase 48 reads but does not mutate). 10 families, 18 subfamilies, 61 seed descriptors.
- `data/compiled/v2/taxonomy.json` — current v2.7.0 published output (will be overwritten by Phase 48; v2.7.0 baseline read from git `HEAD~`)
- `data/compiled/v2/descriptor_aliases.json` — current v2.7.0 alias map (will be overwritten)
- `data/compiled/v2/similarity_matrix.json` — current v2.7.0 similarity matrix (will be overwritten)

### Safety Guard (Runtime Enforcement)
- `scripts/check-safety-guards.sh` — non-mutating local script protecting staged `graphify-out/*`, staged protected paths, and working-tree protected diffs. Run before sandbox, after official compile, and before commit.

### Out-of-Scope / Protected Surfaces
- `data/compiled/*` — write target for v2.8.0 publication; v1 stays byte-identical
- `data/taxonomy/taxonomy-seed.v1.json` — v1 baseline archive (byte-identical required)
- `data/taxonomy/descriptor_aliases.seed.json` — zero alias mutation in this phase (byte-identical required)
- `data/inference/*` — relation/accord/noise/stopwords inputs (byte-identical required)
- `graphify-out/*` — accepted-with-policy dirty working tree; Phase 48 does not clean, stage, or commit

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- `data/taxonomy/taxonomy-seed.v2.json` is the canonical seed with the 12 Phase 47 additions. 10 families, 18 subfamilies, 61 seed descriptors (49 baseline + 12 mutated). The 12 additions target 5 subfamilies: `warm_spice` (5: carrot_seed, cardamom, saffron, cubeb, mace), `floral_white` (4: freesia, osmanthus, elderflower, linden_flower), `citrus_fresh` (1: tangerine), `woody_dry` (1: agarwood), `balsamic_resin` (1: tolu). All 12 targets reference existing family+subfamily nodes (no new structure).
- `src/cli/compile.ts` exposes the official compile CLI; it supports `--version`, `--out`, `--generated-at`, and `--quality-report`. The `resolveOutputDir` helper resolves the default `data/compiled/v2` to `../data/compiled/v2` when invoked from the `src/` package.
- `scripts/check-safety-guards.sh` (Phase 16) is the runtime guard for staged protected-path, staged `graphify-out/*`, and protected-diff violations. Reused as-is in Phase 48.
- `src/tests/curation/taxonomy_seed_v2.test.ts` is the curation contract test. The Phase 47 closure confirmation (`47-VERIFICATION.md` step 3) shows it now passes with the Phase 46 fixture in place — this is the WR-01 stability gate that Phase 48 must confirm.

### Established Patterns
- v2.7 two-step publication (Phase 42 mutation + Phase 43 sandbox compile + official publish): Phase 47 = mutation + sandbox, Phase 48 = official publish + closure. The Phase 43 single plan covered sandbox validation, official publication, and closure report — Phase 48 follows the same single-plan pattern.
- Release closure report pattern (v1.0 / v2.1–v2.5): `.planning/releases/vX.Y.Z-CLOSURE.md` with "What Shipped", "Quality Gates & Verification", and milestone-specific sections. Phase 48 writes `.planning/releases/v2.8.0-CLOSURE.md` with the same structure plus the pre/post delta table and protected-boundary assertions.
- `git diff --name-only` allow-list + `sha256sum` byte-identical assertions are the standard pre-commit boundary check. Phase 48 layers `scripts/check-safety-guards.sh` on top.
- The 12 published JSON files in `data/compiled/v2/` use a stable schema (`version`, `generated_at`, `stats`, content fields) and `printReviewSummary` in `src/cli/compile.ts` already prints the full metric set — the closure report can either parse the JSON directly or capture the CLI output. D-48-CR03 prefers re-parse from JSON for the closure report source of truth.

### Integration Points
- Phase 48 reads `data/taxonomy/taxonomy-seed.v2.json` (already mutated in Phase 47), invokes the official compile via `npm run compile -- --version 2.8.0`, writes to `data/compiled/v2/`, re-parses the published JSON, computes the pre/post delta, asserts the protected boundary hashes, and writes the closure report.
- No compiler, runtime, CLI default, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI code change is expected in Phase 48. The phase is a thin orchestration layer over the existing compile pipeline.
- The 12 promoted seed paths from `46-DECISION-MATRIX.md` are the cross-check that connects the Phase 46 authorization → Phase 47 mutation → Phase 48 publication. The closure report must list them with their final published locations.

</codebase_context>

<specifics>
## Specific Ideas

- The v2.8 publication produces a **measurable reduction in the review queue** relative to v2.7.0. The 12 promoted seed descriptors may absorb some `corpus_candidate_low_support` items during compilation (alias resolution, descriptor matching). The closure report's pre/post delta captures the actual reduction; it should be a real number read from the published JSON, not an estimate.
- The closure report's **pre/post delta table** is the user-facing signature of milestone v2.8. It should be readable at a glance: a single table with the 9–10 mandatory metrics and their v2.7.0 → v2.8.0 values and deltas.
- The "Protected Boundaries Unchanged" section is **required by success criterion 4** (curator can confirm publication did not change milestone-excluded boundaries or defaults outside the approved v2.8 artifact scope). Hash assertions are the cleanest way to prove this; a narrative paragraph alone is insufficient.
- The `--version 2.8.0` flag is the **only** mechanism that puts the v2.8 version string into the published JSON. Phase 48 must not change `DEFAULT_PATHS.version` to `2.8.0`; the v2.6 and v2.7 publications both followed this convention (v2.6 was the first published version; v2.7 used explicit `--version 2.7.0`).
- `src/tests/fixtures/curation/46-DECISION-MATRIX.md` is the WR-01 fix committed in Phase 47. Phase 48's pre-publication gate is a confirmation pass, not a fix. If the fixture is missing, Phase 48 halts and escalates.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. The four user-selected areas (closure report metrics & structure, version string & DEFAULT_PATHS policy, sandbox-vs-publish flow shape, plan structure & protected-boundary assertion) plus the additional WR-01 pre-publication gate are all preserved as D-48-F01 through D-48-PB04 in this CONTEXT.md.

The 28 non-executable Phase 46 matrix rows remain on the review queue and are not part of Phase 48. They will be reconsidered only in future batches with explicit planning (FUT-01, FUT-02 in REQUIREMENTS.md).

The v2.8 archived fallback path (`.planning/milestones/v2.8-phases/...`) is a **milestone-archival concern** and is not a Phase 48 deliverable. Milestone archival is a separate GSD workflow (`/gsd-complete-milestone`).

The 10 remaining `seed_corpus_conflict` items are out of scope for v2.8 (they would require explicit conflict-reopening planning) and remain on the review queue.

</deferred>

---

*Phase: 48-v2-8-artifact-publication-closure*
*Context gathered: 2026-06-04*
