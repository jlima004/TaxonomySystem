# Phase 43 Context: Taxonomy v2.7 Artifact Publication

## Domain
Artifact validation, compilation, and formal closure reporting for the v2.7 low-support triage batch.

## Canonical Refs
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`
- `.planning/phases/42-low-support-microcuration-execution/42-SUMMARY.md`
- `.planning/phases/42-low-support-microcuration-execution/42-VERIFICATION.md`
- `.planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md`
- `.planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md`
- `data/taxonomy/taxonomy-seed.v2.json`

## Code Context
- Use existing `src/compiler/` for artifact generation.
- Use existing `src/cli/` to run validation and publication.

## Decisions

### Artifact Versioning & Baseline
- Publish directly to the existing v2 default directory (`data/compiled/v2/`), as this is a minor update (v2.7) following the v2.6 triage.

### Closure Report Format
- Format as a Markdown document named `v2.7-closure-report.md`.
- Include specific sections: Starting State, Triage Batch Details, Decision Matrix Summary, and Final Metrics (review queue size before vs. after).
- The closure report must reconstruct the full history: the initial state, the batch of 30, the decision matrix, the 6 seeds added in Phase 42, and the final measured metrics.
- **Do not hardcode metrics.** The final metrics (e.g., curated descriptors: 43 → 49, low_support: 275 → ~269, seed_corpus_conflict: 8) must be measured dynamically from the compiler output and the new `similarity_matrix.json.review_queue` as the source of truth.

### Invariant Failures Policy
- The build must strictly fail if any taxonomy invariants (e.g., schema validation) fail during generation. There are no "soft warnings" for compilation in this phase.

## Deferred Ideas
- Tracking time spent per curation decision.
- Automating future low-support triage based on heuristics beyond simple frequency.
