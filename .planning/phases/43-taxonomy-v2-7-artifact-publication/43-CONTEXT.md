# Phase 43 Context: Taxonomy v2.7 Artifact Publication

## Domain
Artifact validation, compilation, and formal closure reporting for the v2.7 low-support triage batch.

## Canonical Refs
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

## Code Context
- Use existing `src/compiler/` for artifact generation.
- Use existing `src/cli/` to run validation and publication.

## Decisions

### Artifact Versioning & Baseline
- Publish directly to the existing v2 default directory (`data/compiled/v2/`), as this is a minor update (v2.7) following the v2.6 triage.

### Closure Report Format
- Format as a Markdown document named `v2.7-closure-report.md`.
- Include specific sections: Starting State, Triage Batch Details, Decision Matrix Summary, and Final Metrics (review queue size before vs. after).

### Invariant Failures Policy
- The build must strictly fail if any taxonomy invariants (e.g., schema validation) fail during generation. There are no "soft warnings" for compilation in this phase.

## Deferred Ideas
- Tracking time spent per curation decision.
- Automating future low-support triage based on heuristics beyond simple frequency.
