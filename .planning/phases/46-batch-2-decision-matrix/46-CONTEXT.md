# Phase 46: Batch 2 Decision Matrix - Context

**Gathered:** 2026-06-03
**Amended:** 2026-06-03 (post-discussion persistence)
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 46 is **decide-only**. It assigns formal, evidence-backed dispositions and `mutation_allowed` gates for exactly the 40 candidates selected in Phase 45, producing a parseable decision matrix before any curation mutation.

Phase 46 may create or update Phase 46 planning artifacts (primarily `46-DECISION-MATRIX.md`). It must **not** mutate taxonomy seeds, aliases, compiled artifacts, source code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI. It must not reopen `seed_corpus_conflict` items.

**Phase chain:** Phase 45 selected → **Phase 46 decides** → Phase 47 mutates → Phase 48 publishes.

</domain>

<decisions>
## Implementation Decisions

### Zero-Mutation Boundary
- **D-46-01:** Phase 46 is strictly decide-only. Only Phase 46 planning/decision artifacts may be created or modified. No taxonomy, alias, compiled artifact, source, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI mutations.
- **D-46-02:** Frequency, Phase 45 weighted score, and `phase45_inferred_subfamily` are prioritization or inherited evidence only — never approval evidence and never sufficient to set `mutation_allowed=true`.

### Disposition Enum (Locked)
- **D-46-03:** Use these six disposition values on every matrix row:
  - `promote_to_seed` — candidate may become a new seed descriptor under an **existing** family/subfamily.
  - `add_alias` — candidate may become an alias to an **existing** seed descriptor.
  - `reject` — do not promote or alias (noise, artifact, generic, semantically unsafe, or out-of-scope for fragrance taxonomy).
  - `defer_manual_review` — may be valid but requires expert/manual review before action.
  - `defer_future_batch` — may be valid but not actionable this milestone or needs broader taxonomy work.
  - `needs_external_reference` — external/literature/reference validation required before a safe decision; distinct from both defer types.
- **D-46-04:** `needs_external_reference` rows must always have `mutation_allowed=false` and are non-executable in Phase 47.

### mutation_allowed Gate
- **D-46-05:** Set `mutation_allowed=true` **only** when disposition is `promote_to_seed` or `add_alias`, **and** all of the following hold:
  - Required target fields complete (`target_family`, `target_subfamily`, `target_descriptor`; plus `alias_target` for alias rows).
  - Target family and subfamily **already exist** in current seed taxonomy — no new structure required.
  - No stretch or weak subfamily placement.
  - `confidence` is `medium_high` or `high`.
  - `investigation_depth` is at least `targeted_check`.
  - Rationale and evidence documented.
  - `phase47_instruction` is explicit and mechanical.
- **D-46-06:** These dispositions must **always** have `mutation_allowed=false`: `reject`, `defer_manual_review`, `defer_future_batch`, `needs_external_reference`.
- **D-46-07:** When `mutation_allowed=false`, `phase47_instruction` must be `none`.

### New Family / Subfamily Policy (D-36 Carry-Forward)
- **D-46-08:** Phase 46 must not create new families or subfamilies and must not force-fit candidates into weak placements.
- **D-46-09:** If no existing subfamily safely fits: assign `defer_manual_review` (valuable but structurally unresolved) or `defer_future_batch` (valid but milestone-blocked); always `mutation_allowed=false`.
- **D-46-10:** `promote_to_seed` is forbidden for stretch or weak subfamily fits. Valuable candidates without safe existing structure → defer, not promote.

### Primary Deliverable
- **D-46-11:** Required artifact: `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md`.
- **D-46-12:** Parseable Markdown decision matrix with **exactly 40 rows**, one per selected candidate from `45-BATCH2-SELECTION.md`, stable ids `01`–`40` aligned to Phase 45 selection rank.
- **D-46-13:** Optional closure artifacts (not substitutes for the matrix): `46-01-SUMMARY.md`, `46-VERIFICATION.md`.

### Matrix Schema (Required Columns)
- **D-46-14:** Each row must include at minimum: `id`, `candidate`, `source_phase45_rank`, `phase45_inferred_subfamily`, `disposition`, `mutation_allowed`, `target_family`, `target_subfamily`, `target_descriptor`, `alias_target`, `confidence`, `investigation_depth`, `rationale`, `evidence`, `phase47_instruction`.
- **D-46-15:** `phase45_inferred_subfamily` is inherited compiler/placement evidence only — not an approved target. If it disagrees with a safe semantic target, preserve it, document the mismatch in rationale/notes, and populate `target_*` only from safe existing taxonomy fit.
- **D-46-16:** Include an execution summary section (disposition counts, `mutation_allowed=true/false` counts) matching the v2.7 `41-DECISION-MATRIX.md` pattern.

### Disposition Criteria
- **D-46-17:** `promote_to_seed` requires all: existing family+subfamily; exact descriptor identity; no new taxonomy structure; no stretch placement; `medium_high` or `high` confidence; `targeted_check` or `deep_check`; complete executable fields.
- **D-46-18:** `add_alias` requires all promote criteria plus explicit `alias_target` referencing an existing seed; alias/polysemy risks resolved at `targeted_check` or `deep_check`.
- **D-46-19:** `reject` for noise, corpus artifacts, generic non-olfactive terms, or candidates that would corrupt taxonomy if promoted/aliased.
- **D-46-20:** `defer_manual_review` for valid candidates needing expert placement, alias judgment, or canonical-name resolution without safe automated action.
- **D-46-21:** `defer_future_batch` for valid candidates blocked by milestone scope (e.g., requires new subfamily family-level work deferred to a future batch).
- **D-46-22:** `needs_external_reference` for truncated, externally uncertain, or literature-dependent candidates (e.g. unresolved canonical forms) — no promotion from plausibility alone.

### Investigation Depth Model
- **D-46-23:** Three tiers, all rows require at least `baseline_check`:
  - `baseline_check` — source/rationale review plus obvious semantic risk screening (required for all 40 rows).
  - `targeted_check` — validate existing target fit, duplicate/alias status, executable field completeness (required for any `promote_to_seed` or `add_alias` candidate).
  - `deep_check` — required for ambiguous, food-linked high-risk, off-note/industrial, truncated, externally uncertain, alias-risk, stretch-placement, or new-structure candidates; typically yields defer or `needs_external_reference` unless safe target is proven.
- **D-46-24:** `mutation_allowed=true` requires minimum `targeted_check`; `baseline_check` alone is never sufficient for executable rows.

### Food / Off-Note / Industrial (Selected Batch)
- **D-46-25:** Food-linked candidates (e.g. coffee, hazelnut, butterscotch): caution tier — not auto-reject, not auto-promote. `promote_to_seed` only with recognizable olfactive identity, safe **existing** subfamily fit, low corruption risk, and `medium_high`/`high` confidence. New gourmand/nutty structure or stretch fit → `defer_manual_review` or `defer_future_batch`, `mutation_allowed=false`. Food association alone is never promotion evidence (Phase 45 D-05).
- **D-46-26:** Off-note/industrial candidates (e.g. acrylate): high-caution — `promote_to_seed` only with clear fragrance/material value, safe existing fit, low corruption risk, and `medium_high`/`high` confidence. Prefer `needs_external_reference` or `defer_manual_review` when structure, validation, or stretch placement is unresolved. For **acrylate** specifically: prefer `needs_external_reference` or `defer_manual_review` unless safe existing subfamily fit is proven.

### Ambiguous / Truncated Selected Candidates
- **D-46-27:** Truncated or ambiguous descriptors (e.g. `orri`): default `needs_external_reference`, `mutation_allowed=false`, `deep_check`. Do not infer canonical forms (e.g. orri→orris) from plausibility alone.
- **D-46-28:** Alias or seed action on ambiguous names allowed only with explicit evidence, complete targets, and `medium_high`/`high` confidence.

### confidence Column
- **D-46-29:** Allowed values: `low`, `medium_high`, `high`. Executable rows (`mutation_allowed=true`) require `medium_high` or `high`.

### Phase 47 Execution Contract (Downstream)
- **D-46-30:** Phase 47 may consume **only** `46-DECISION-MATRIX.md` rows where `mutation_allowed=true` and disposition is `promote_to_seed` or `add_alias`.
- **D-46-31:** Phase 47 executes only explicit `target_*`, `alias_target`, and mechanical `phase47_instruction` values — no inference from rationale, evidence, Phase 45 selection text, inferred subfamily, or frequency.
- **D-46-32:** Phase 47 must not execute `reject`, `defer_manual_review`, `defer_future_batch`, or `needs_external_reference` rows; must not create families/subfamilies; must not stretch-place; must not reopen `seed_corpus_conflict`; must not mutate outside approved matrix rows.

### Target Completeness (Promote / Alias / Defer)
- **D-46-33:** For `promote_to_seed`, `target_family`, `target_subfamily`, and `target_descriptor` are required and must reference **existing** seed taxonomy nodes. Empty `target_*` is allowed only when `mutation_allowed=false`.
- **D-46-34:** For `add_alias`, `alias_target` is required in addition to complete `target_*` (or alias-only pattern where candidate maps to existing seed via `alias_target`); alias target must exist in current seed taxonomy.
- **D-46-35:** For `reject`, `defer_manual_review`, `defer_future_batch`, and `needs_external_reference`, leave `target_family`, `target_subfamily`, `target_descriptor`, and `alias_target` empty unless documenting a **rejected hypothetical** in `notes` — never as executable targets.

### promote_to_seed / Defer Split (Post-Discussion Lock)
- **D-46-36:** `promote_to_seed` requires **all** of: existing family+subfamily; exact descriptor identity; no new taxonomy structure; no stretch placement; `confidence` ∈ {`medium_high`, `high`}; `investigation_depth` ≥ `targeted_check`; complete executable fields; mechanical `phase47_instruction`. No expert override via notes.
- **D-46-37:** Primary disposition split (locked):
  - `reject` — noise, corpus artifact, generic non-olfactive, semantically unsafe, or out-of-scope for fine-fragrance taxonomy.
  - `defer_manual_review` — potentially valid but unresolved placement, alias judgment, canonical-name resolution, or expert review needed.
  - `defer_future_batch` — potentially valid but milestone-blocked (e.g. requires new subfamily/family work in a future batch).

### Row Identity & confidence (Post-Discussion Lock)
- **D-46-38:** Matrix must contain **exactly 40 rows**, ids `01`–`40`, 1:1 with Phase 45 selection rank in `45-BATCH2-SELECTION.md`. No split rows, no omissions, no extras.
- **D-46-39:** `confidence` allowed values: `low`, `medium_high`, `high`. `mutation_allowed=true` requires `medium_high` or `high` only.

### phase47_instruction Contract
- **D-46-40:** When `mutation_allowed=true`, `phase47_instruction` must name a mechanical action (e.g. add seed at explicit path, add alias to explicit target) parseable by Phase 47 without interpretation.
- **D-46-41:** When `mutation_allowed=false`, `phase47_instruction` must be exactly `none`.

### Phase 47 Prohibitions (Exhaustive)
- **D-46-42:** Phase 47 must not: execute `mutation_allowed=false` rows; execute `reject` / `defer_manual_review` / `defer_future_batch` / `needs_external_reference`; infer targets from rationale, evidence, Phase 45 inferred subfamily, weighted score, or selection text; reinterpret Phase 46 decisions; create new families or subfamilies; execute weak or stretch placements; reopen `seed_corpus_conflict`; mutate compiled artifacts, Graphify, scoring, MVP/SaaS, Knowledge Engine, UI, or unrelated source files.

### Recommended Optional Columns (v2.7 Parity)
- **D-46-43:** Include `expected_effect` and `notes` columns in `46-DECISION-MATRIX.md` (recommended, not optional for planning). Use `notes` for placement mismatch vs `phase45_inferred_subfamily`, pending subfamily hints, and D-36 rationale.

### the agent's Discretion
- Exact literal strings for mechanical `phase47_instruction` values (planner aligns with Phase 42 parser conventions).

</decisions>

<user_verbatim>
## User Responses Captured (Post-CONTEXT Persistence)

These verbatim locks supplement the structured decisions above. Downstream agents should treat conflicts in favor of `<decisions>` IDs.

### Scope selection (opening)
User requested discussion of: final disposition enum, mutation_allowed gate, new-family/subfamily policy, `46-DECISION-MATRIX.md` schema, criteria for each disposition, investigation-depth model, food/off-note/noise treatment for selected candidates, and Phase 47 execution contract. Phase 46 is decide-only.

### Disposition enum (locked text)
- `promote_to_seed`: candidate may become a new seed descriptor under an existing family/subfamily.
- `add_alias`: candidate may become an alias to an existing seed descriptor.
- `reject`: candidate should not be promoted or aliased (noise, artifact, generic, semantically unsafe).
- `defer_manual_review`: valid but requires expert/manual review before action.
- `defer_future_batch`: valid but not actionable this milestone or needs broader taxonomy work.
- `needs_external_reference`: requires external/literature/reference validation before a safe decision; distinct from defer types; always `mutation_allowed=false`; Phase 47 must not execute.

### mutation_allowed (locked text)
`mutation_allowed=true` only for `promote_to_seed` or `add_alias` when: all required target fields complete; target family/subfamily already exist; no new taxonomy structure; no stretch placement; confidence `medium_high` or `high`; rationale and evidence present; `phase47_instruction` explicit and mechanical. All reject/defer/external-reference rows must be `false`. Phase 47 must never infer targets from rationale.

### D-36 / stretch (locked text)
If no existing subfamily safely fits: `defer_manual_review` or `defer_future_batch`, always `mutation_allowed=false`. No stretch `promote_to_seed`. Phase 47 must not execute weak or forced placements.

### Deliverable (locked text)
```
Phase 46 deliverable:
- File: 46-DECISION-MATRIX.md
- Location: .planning/phases/46-batch-2-decision-matrix/
- Type: parseable Markdown decision matrix
- Scope: exactly 40 rows, one per selected candidate from Phase 45
- Purpose: assign explicit evidence-backed dispositions before Phase 47 mutation
- Boundary: decide-only, no taxonomy/alias/compiled artifact/source mutations
```
Optional at closure: `46-01-SUMMARY.md`, `46-VERIFICATION.md`. Central deliverable remains `46-DECISION-MATRIX.md` only.

### Investigation depth (locked text)
Tiers: `baseline_check` (all 40), `targeted_check` (promote/alias path), `deep_check` (ambiguous, food high-risk, industrial/off-note, truncated, external uncertainty, stretch-risk, new-structure). `mutation_allowed=true` requires ≥ `targeted_check`; `baseline_check` alone never sufficient for executable rows.

### Food / off-note (locked text)
Food-linked: caution; promote only with recognizable olfactive note, safe existing fit, low corruption risk, `medium_high`/`high` confidence; else defer. Off-note/industrial: high caution; acrylate → prefer `needs_external_reference` or `defer_manual_review` unless safe existing fit proven.

### Ambiguous / placement (locked text)
Truncated names (e.g. `orri`): default `needs_external_reference`, `deep_check`, no canonical inference from plausibility. `phase45_inferred_subfamily` is advisory only; on mismatch, preserve inferred value, document mismatch, use only safe `target_*`.

### Phase 47 contract (locked text)
Phase 47 consumes only `mutation_allowed=true` `promote_to_seed`/`add_alias` rows with mechanical instructions; full prohibition list in D-46-42.

### Skipped UI rounds — defaults applied (2026-06-03)
Disposition-criteria and confidence AskUserQuestion rounds were skipped; these recommended defaults are now locked as D-46-36, D-46-37, D-46-38, D-46-39.
</user_verbatim>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Requirements
- `.planning/ROADMAP.md` — Phase 46 goal, success criteria, DEC-01–DEC-03
- `.planning/REQUIREMENTS.md` — DEC-01, DEC-02, DEC-03; protected v2.8 out-of-scope list
- `.planning/PROJECT.md` — v2.8 milestone boundaries, v2.7 D-36 precedent
- `.planning/STATE.md` — current execution state

### Phase 45 Handoff (Selection Input)
- `.planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md` — exactly 40 selected candidates (sole decision input set)
- `.planning/phases/45-batch-2-candidate-selection/45-CONTEXT.md` — selection policy, zero-mutation boundary, food/off-note caution

### Phase 44 Inventory Baseline
- `.planning/phases/44-remaining-low-support-inventory/44-LOW-SUPPORT-INVENTORY.md` — evidence fields for rationale
- `.planning/phases/44-remaining-low-support-inventory/44-CONTEXT.md` — frequency-not-approval rule

### v2.7 Decision Matrix Precedent
- `src/tests/fixtures/curation/41-DECISION-MATRIX.md` — column shape, disposition strings, execution summary pattern
- `.planning/milestones/v2.7-ROADMAP.md` — six promotions, D-36 deferrals, matrix-before-mutation pattern
- `.planning/milestones/v2.7-REQUIREMENTS.md` — CUR-02 matrix-gated mutation

### Compiled Evidence Source
- `data/compiled/v2/similarity_matrix.json` — current `corpus_candidate_low_support` review_queue evidence
- `src/types/inference.ts` — `ReviewQueueItem` evidence fields
- `src/compiler/review_queue.ts` — deterministic queue ordering helper

### Taxonomy / Seed Shape (Read-Only for Target Validation)
- `data/compiled/v2/taxonomy.json` — existing families/subfamilies for target completeness checks
- `data/compiled/v2/descriptor_aliases.json` — existing alias targets

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/tests/fixtures/curation/41-DECISION-MATRIX.md`: structural template for matrix table, execution summary, and disposition/mutation_allowed pairing.
- Phase 42+ seed tooling may parse approved matrix rows — Phase 47 planning should confirm parser entry points before defining `phase47_instruction` literals.

### Established Patterns
- Curation milestones use Markdown decision matrices as the sole mutation authorization layer (v2.6 Group B, v2.7 Batch 1, v2.8 Batch 2).
- `mutation_allowed=true` count is small and explicit; defer/reject/external-reference rows remain in queue as non-promoted outcomes.
- D-36: missing natural subfamilies block promotion (v2.7: coffee, hay, marine, etc. deferred).

### Integration Points
- Phase 47 reads `46-DECISION-MATRIX.md` executable rows only; Phase 48 publishes after Phase 47 sandbox validation.
- No compiler or runtime code changes expected in Phase 46 — deliverable is documentation/matrix unless planning identifies a read-only validation script.

</code_context>

<specifics>
## Specific Ideas

- Primary deliverable path: `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md`
- Watch high-risk selected rows: `orri`, `acrylate`, `tea_green_tea`, `kumquat` (weak inferred placements), food-linked cluster, resin/amber group with inferred `amber` placements.
- v2.7 promoted descriptors (peppermint, rosemary, cumin, spearmint, caraway, opoponax) must not be re-litigated unless still unresolved in current queue — Batch 2 selection excluded these.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 46-batch-2-decision-matrix*
*Context gathered: 2026-06-03*
