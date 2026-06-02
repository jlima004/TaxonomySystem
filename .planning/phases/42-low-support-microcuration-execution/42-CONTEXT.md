# Phase 42: Low-Support Microcuration Execution - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Safely apply the explicitly approved Phase 41 low_support curation decisions to the taxonomy. This phase is execution-only for CUR-02: it may mutate only the six `41-DECISION-MATRIX.md` rows where `mutation_allowed=true`. It must not reinterpret rejected, deferred, or external-reference rows as permission to mutate anything.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope and Requirements
- `.planning/ROADMAP.md` §Phase 42 — Defines the phase goal: safely apply approved matrix decisions to the taxonomy, with no implicit or unapproved mutations.
- `.planning/REQUIREMENTS.md` §CUR-02 — Requires applying only decisions explicitly approved in the decision matrix.
- `.planning/PROJECT.md` §Current Milestone v2.7 — Defines the milestone boundary: controlled low_support triage, no full 275-item curation, no auto-promotion.

### Decision Source of Truth
- `.planning/phases/41-low-support-batch-decision-matrix/41-CONTEXT.md` — Locks Phase 42 execution contract, mutation criteria, hard prohibition on new families/subfamilies, and rationale-field non-permission rule.
- `.planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md` — Authoritative row-level matrix. Only rows 06, 07, 10, 13, 14, and 15 have `mutation_allowed=true`.

### Data and Validation Targets
- `data/taxonomy/taxonomy-seed.v2.json` — Current v2 seed taxonomy and likely mutation target for the six approved seed descriptors.
- `data/taxonomy/descriptor_aliases.seed.json` — Read-only guard reference for this phase; no Phase 42 alias mutation is authorized.
- `data/compiled/v2/similarity_matrix.json` — Read-only historical source of low_support evidence; not mutation authority.
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Existing curation invariant and approval-traceability checks around v2 seed additions.
- `src/tests/curation/review_dispositions.test.ts` — Existing pattern proving frequency/ranking evidence is priority-only and cannot mutate curated JSON.

### Codebase Patterns
- `.planning/codebase/STACK.md` — Confirms Node.js/TypeScript, ESM, strict TypeScript, Vitest, and zero runtime dependency constraints.
- `.planning/codebase/ARCHITECTURE.md` — Confirms functional, deterministic, low-side-effect architecture preference.
- `.planning/codebase/CONVENTIONS.md` — Confirms snake_case files, lower snake_case data IDs, no semicolons, type-only imports, and documentation/code language conventions.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/taxonomy/taxonomy-seed.v2.json`: Contains all approved target families/subfamilies and currently lacks the six approved descriptors.
- `src/loader/seed_validator.ts`: Validation path used by curation tests to confirm seed structural validity.
- `src/tests/curation/taxonomy_seed_v2.test.ts`: Existing executable safety net for lower snake_case IDs, no duplicates, non-empty subfamilies, approved expansion traceability, and default v2 seed path.
- `scripts/check-safety-guards.sh` / `npm run safety:guard`: Existing protected-path/Graphify safety guard pattern from earlier phases; useful before committing staged curation changes.

### Established Patterns
- Manual curation is explicit and approval-backed; corpus frequency and inferred placement are evidence only, never mutation authority.
- Mutations are narrow and data-only unless tests or traceability fixtures require minimal supporting updates.
- Compiled artifact publication is separated from curation execution; Phase 43 owns v2.7 artifact publication and closure metrics.
- Project style is strict TypeScript, ESM, pure-function architecture, no runtime dependencies, deterministic validation.

### Integration Points
- Phase 42 feeds Phase 43 by producing a safely updated taxonomy seed state for artifact validation/publication.
- Phase 42 must preserve `descriptor_aliases.seed.json`, relation/accord inputs, `data/compiled/v1`, official compiled v2 artifacts, `src/cli/parse_args.ts`, and `graphify-out/*` unless a later approved plan explicitly says otherwise.

</code_context>

<specifics>
## Specific Ideas

- User-required execution instruction: "Executar somente as 6 linhas mutation_allowed=true da 41-DECISION-MATRIX.md: peppermint, rosemary, cumin, spearmint, caraway, opoponax."
- User-required exclusions: "Não executar rejects, defers ou needs_external_reference."
- User-required structural boundary: "Não criar novas famílias/subfamílias."
- User-required interpretation rule: "Não interpretar rationale/expected_effect como permissão de mutação."

</specifics>

<deferred>
## Deferred Ideas

- The other 24 Phase 41 matrix rows remain non-mutating in Phase 42, including rejects, manual-review deferrals, future structural gaps, and `needs_external_reference` items.
- New families/subfamilies suggested by `expected_effect` text remain future curation work, not Phase 42 execution scope.

</deferred>

---

*Phase: 42-Low-Support Microcuration Execution*
*Context gathered: 2026-06-02*
