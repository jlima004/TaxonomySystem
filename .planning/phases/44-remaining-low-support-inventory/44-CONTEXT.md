# Phase 44: Remaining Low-Support Inventory - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 44 is a read-only inventory phase. It confirms the exact current unresolved `corpus_candidate_low_support` pool from the official v2.7 compiled similarity artifact, documents exclusion proof for known v2.7 promoted descriptors, and produces the required inventory artifact for downstream Phase 45 selection.

This phase must not select Batch 2, apply curation dispositions, mutate taxonomy or aliases, regenerate compiled artifacts, reopen `seed_corpus_conflict`, alter Graphify, change scoring, or touch MVP/SaaS/Knowledge Engine/UI scope.

</domain>

<decisions>
## Implementation Decisions

### Inventory Format
- **D-44-01:** Produce `44-LOW-SUPPORT-INVENTORY.md` as an evidence-heavy Markdown artifact, not a compact list.
- **D-44-02:** The inventory artifact must include summary metrics, source of truth, exclusion policy, full 259-item `corpus_candidate_low_support` list, evidence fields, and zero-mutation confirmation.
- **D-44-03:** The inventory artifact is the required Phase 44 deliverable and must be written alongside this context file.

### Eligibility Grouping
- **D-44-04:** Include non-selecting readiness groups only. Phase 44 may group candidates by evidence readiness to help Phase 45, but it must not select Batch 2 or imply promotion, rejection, alias, defer, or manual_review decisions.
- **D-44-05:** Readiness groups are advisory inventory metadata. They are not approval evidence and do not authorize mutation.

### Exclusion Proof
- **D-44-06:** Use `data/compiled/v2/similarity_matrix.json` as the source of truth for current unresolved low_support items.
- **D-44-07:** Explicitly check the six documented v2.7 promoted descriptors (`peppermint`, `rosemary`, `cumin`, `spearmint`, `caraway`, `opoponax`) against the current low_support queue and record that none remain unresolved.
- **D-44-08:** Do not reopen or re-litigate v2.7 decisions. Candidates remain eligible for future work only if they currently appear unresolved as `corpus_candidate_low_support` in the v2.7 compiled artifact.

### Evidence Ordering
- **D-44-09:** Sort the full inventory deterministically by `candidate_frequency` descending, then `placement_score` descending when available, then candidate descriptor ascending.
- **D-44-10:** Frequency is prioritization evidence only, not approval evidence. No candidate may be promoted, rejected, aliased, deferred, or marked manual_review from frequency alone in Phase 44.

### the agent's Discretion
- None. The user explicitly locked the inventory format, grouping boundary, exclusion proof, and evidence ordering.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope And Milestone Requirements
- `.planning/ROADMAP.md` - Phase 44 goal, success criteria, and v2.8 phase boundaries.
- `.planning/REQUIREMENTS.md` - INV-01 and INV-02 requirements; protected v2.8 out-of-scope list.
- `.planning/PROJECT.md` - Current milestone value, v2.7 shipped state, v2.8 guardrails, and active key decisions.
- `.planning/STATE.md` - Current phase state and carry-forward constraints from prior phases.

### v2.7 Baseline
- `.planning/milestones/v2.7-ROADMAP.md` - v2.7 shipped summary: 275 low_support inventoried, batch of 30, six promotions, v2.7 publication metrics.
- `.planning/milestones/v2.7-REQUIREMENTS.md` - Archived v2.7 requirements and outcomes.
- `data/compiled/v2/similarity_matrix.json` - Official v2.7 source of truth for current `review_queue`; version `2.7.0`, generated `2026-06-02T20:49:04.282Z`.

### Review Queue Code Shape
- `src/types/similarity.ts` - `SimilarityGraph.review_queue` location in the compiled artifact schema.
- `src/types/inference.ts` - `ReviewQueueItem` shape and evidence fields.
- `src/compiler/compile_taxonomy.ts` - Emits `corpus_candidate_low_support` placement review items and their evidence fields.
- `src/compiler/compile_all.ts` - Merges placement review queue items into `similarity.review_queue`.
- `src/compiler/review_queue.ts` - Existing deterministic review queue sorting helper.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/compiled/v2/similarity_matrix.json`: direct source for Phase 44 inventory extraction. Current metrics observed during context gathering: `259` `corpus_candidate_low_support`, `10` `seed_corpus_conflict`, `269` total review items, `13` graph edges.
- `ReviewQueueItem` evidence fields: `support`, `normalized_support`, `placement_score`, `thresholds`, `candidate_frequency`, `noise_penalty`, and `reason` are available for the evidence-heavy table.

### Established Patterns
- Compiled artifacts keep review evidence in `similarity_matrix.json.review_queue`; taxonomy and aliases are separate artifacts and must not be mutated by inventory work.
- Low-support candidates are review-required corpus evidence, not curated truth.
- Prior curation milestones require explicit decision matrices before any mutation; Phase 44 must preserve that pattern by inventorying only.

### Integration Points
- Phase 45 should consume `44-LOW-SUPPORT-INVENTORY.md` as the only eligible source for Batch 2 selection.
- Phase 44 should not integrate into compiler/runtime code unless planning later identifies a read-only script need; the expected deliverable is documentation/inventory, not source mutation.

</code_context>

<specifics>
## Specific Ideas

- The required inventory artifact is `.planning/phases/44-remaining-low-support-inventory/44-LOW-SUPPORT-INVENTORY.md`.
- Readiness groups are allowed only as non-selecting grouping metadata for downstream selection planning.
- Candidate ordering is locked to `candidate_frequency` descending, then `placement_score` descending, then candidate ascending.
- The six v2.7 promoted descriptors must be checked explicitly and recorded as absent from unresolved low_support.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 44-remaining-low-support-inventory*
*Context gathered: 2026-06-02*
