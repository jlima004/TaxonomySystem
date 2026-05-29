# Phase 41: Low-Support Batch Decision Matrix - Context

**Gathered:** 2026-05-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Produce a formal decision matrix (41-DECISION-MATRIX.md) for the 30 low_support candidates selected in Phase 40. Each candidate receives an explicit disposition with full rationale. **Phase 41 is decision-only — zero taxonomy, alias, compiled artifact, scoring, Graphify, or Knowledge Engine mutations.**

</domain>

<decisions>
## Implementation Decisions

### Matrix Format and Structure
- **D-01:** Output artifact is `41-DECISION-MATRIX.md` in Markdown with a parseable tabular structure.
- **D-02:** Disposition enum is formal and closed: `promote_to_seed`, `add_alias`, `reject`, `defer_manual_review`, `defer_future_batch`, `needs_external_reference`.
- **D-03:** Normalized execution fields per row: `id`, `candidate`, `disposition`, `target_family`, `target_subfamily`, `target_descriptor`, `mutation_allowed`. Free text only in: `rationale`, `evidence`, `expected_effect`, `notes`.
- **D-04:** `mutation_allowed=true` is valid ONLY when disposition is `promote_to_seed` or `add_alias` AND all `target_*` fields are complete.
- **D-05:** `reject`, `defer_manual_review`, `defer_future_batch`, `needs_external_reference` always have `mutation_allowed=false`.
- **D-06:** Phase 40 risk groups (`high_value`, `caution_expert_review`, `likely_defer_reject`) are preserved as metadata column `phase40_group`, not as decision drivers.
- **D-07:** Include mandatory `## Execution Summary for Phase 42` section with disposition counts and mutation_allowed counts.

### Disposition Criteria
- **D-08:** `promote_to_seed` — only for legitimate olfactive notes/materials with clear, safe existing family/subfamily targets; low polysemy risk; no duplication of existing seeds; confidence ≥ medium_high.
- **D-09:** `add_alias` — only for direct lexical variants, spelling errors, truncations, or synonyms where the canonical seed target already exists in taxonomy-seed.v2.json; alias must not collapse distinct categories.
- **D-10:** `reject` — for out-of-scope terms (culinary, vegetal, off-note, defect) that would corrupt the taxonomy if promoted; when no safe target exists and frequency comes from corpus context, not olfactive value.
- **D-11:** `defer_manual_review` — for semantically real olfactive terms where target is uncertain, multiple families apply, new subfamily may be needed, or expert curatorial judgment is required. Default fallback for Grupo 2 items.
- **D-12:** `defer_future_batch` — for valid but non-priority items that connect better to a future thematic batch or lack urgency.
- **D-13:** `needs_external_reference` — for spelling/nomenclature/equivalence uncertainty requiring external confirmation (IFRA, material databases, etc.).
- **D-14:** **Frequency is priority evidence only, never approval evidence.** High frequency justifies prioritized review, not promotion.

### Batch Processing Granularity
- **D-15:** Process the 30 candidates in three blocks matching Phase 40 risk groups, but all decisions go into a single `41-DECISION-MATRIX.md` artifact.
- **D-16:** Block A (Group 1 — high-value, 15 items): may produce `promote_to_seed`/`add_alias` when safe.
- **D-17:** Block B (Group 2 — caution, 8 items): defaults to `defer_manual_review` unless strongly justified.
- **D-18:** Block C (Group 3 — likely defer/reject, 7 items): defaults to `reject` or `defer_manual_review`.

### Investigation Depth Model
- **D-19:** Layered investigation: `baseline_check` (mandatory for all 30), `targeted_check` (mandatory for any item that may produce `mutation_allowed=true`), `deep_check` (reserved for alias/normalization uncertainty, ambiguous targets, possible new subfamilies, or high-risk semantic boundaries).
- **D-20:** `mutation_allowed=true` requires at least `targeted_check`.
- **D-21:** `add_alias` with spelling/normalization requires `deep_check`.
- **D-22:** `promote_to_seed` with controversial or uncertain target requires `deep_check`.
- **D-23:** `reject`/`defer` can be decided from `baseline_check` when rationale is clear.
- **D-24:** `needs_external_reference` implies deep_check is incomplete or pending external input.
- **D-25:** Matrix column `investigation_depth` records the level applied: `baseline | targeted | deep`.

### Phase 42 Execution Contract
- **D-26:** Phase 42 may ONLY mutate rows where: `mutation_allowed=true` AND `disposition ∈ [promote_to_seed, add_alias]` AND `target_family`, `target_subfamily`, `target_descriptor` are all complete AND `rationale` is present AND `confidence >= medium_high`.
- **D-27:** Rows with `reject`, `defer_manual_review`, `defer_future_batch`, or `needs_external_reference` MUST NOT mutate taxonomy/aliases.
- **D-28:** Phase 42 must not interpret free-text rationale fields as mutation permission.

### New Target/Subfamily Policy
- **D-29:** For v2.7, `promote_to_seed` should prefer existing families/subfamilies. Any candidate requiring a new subfamily defaults to `defer_manual_review` or `defer_future_batch`.
- **D-30:** Phase 41 may propose new subfamily needs in the `expected_effect` column, but Phase 42 must not create new families/subfamilies unless explicitly approved in the matrix AND marked as safe.

### Matrix Approval Criteria
- **D-31:** `41-DECISION-MATRIX.md` is execution-ready only when: all 30 candidates have a non-TBD disposition; all `mutation_allowed=true` rows have complete target fields; all `mutation_allowed=false` rows have clear rationale; execution summary counts are present; zero mutations were applied in Phase 41.

### Global Safety Rules
- **D-32:** Phase 40 inferred placement is never an approved target.
- **D-33:** Any culinary/off-note/vegetal item defaults to `defer_manual_review` or `reject`.
- **D-34:** Any item requiring new family/subfamily defaults to `defer_manual_review` unless explicitly approved.
- **D-35:** Any alias requires existing canonical seed target.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 40 Input
- `.planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md` — Defines the 30 selected candidates, 3 risk groups, ranking criteria, guardrails, and deferral rationale for the 245 excluded items.

### Requirements
- `.planning/REQUIREMENTS.md` §CUR-01 — "Produce a decision matrix for each selected candidate"
- `.planning/REQUIREMENTS.md` §CUR-02 — "Apply only decisions explicitly approved in the decision matrix" (Phase 42 scope)

### Taxonomy Data (read-only reference)
- `data/taxonomy/taxonomy-seed.v2.json` — Current v2 seed taxonomy (verify existing families/subfamilies/descriptors before proposing targets)
- `data/compiled/v2/similarity_matrix.json` — Source of `low_support` candidate list and placement scores

### Prior Curation Patterns
- `.planning/phases/22-review-queue-conflict-triage-for-v2-2/` — Conflict triage matrix format reference (read-only)
- `.planning/phases/23-v2-2-microcuration-candidate-selection/` — Microcuration execution pattern reference

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/compiled/v2/similarity_matrix.json`: Contains the `low_support` candidate records with frequency, placement_score, and inferred subfamily — input data for the decision matrix.
- `data/taxonomy/taxonomy-seed.v2.json`: Current seed taxonomy structure — needed to verify existing families/subfamilies before assigning targets.
- `data/taxonomy/descriptor_aliases.seed.json`: Existing alias registry — needed to check for duplicate alias candidates.

### Established Patterns
- **Read-only analysis phases** (Phases 22, 35, 40): Produce planning/decision artifacts without any mutation. Phase 41 follows this pattern.
- **Microcuration flow** (Phases 20, 23, 25, 27, 28, 33): One candidate at a time with 7 invariant validations. Phase 42 will execute approved rows using this pattern.
- **Decision matrix format** (Phase 22 conflict triage): Tabular markdown with explicit dispositions per item. Phase 41 extends this to 30 candidates.

### Integration Points
- `41-DECISION-MATRIX.md` → Phase 42 (CUR-02): Phase 42 reads the matrix and executes only `mutation_allowed=true` rows.
- Phase 43 (ART-01, ART-02, ART-03): Post-execution validation and v2.7 artifact publication.

</code_context>

<specifics>
## Specific Ideas

- **orri** should be investigated as probable truncation/variant of "orris" (orris root) — likely `needs_external_reference` or `add_alias` if orris exists as seed.
- **mentholic** should be investigated as possible variant of "menthol" — same pattern.
- **sulfurous**, **marine**, **alcoholic** are real olfactive descriptors but may require new subfamilies not currently in v2 — should default to `defer_manual_review`.
- **Grupo 3 items** (potato, cabbage, radish, garlic, alliaceous, fishy, meaty) are strong `reject` candidates for a perfumery-fine taxonomy, but `garlic`, `alliaceous`, and `meaty` have legitimate sensory use in flavor/off-note contexts — rationale should be explicit.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 41-Low-Support Batch Decision Matrix*
*Context gathered: 2026-05-29*
