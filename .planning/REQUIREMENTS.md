# Milestone v2.7 Requirements

## Triage & Prioritization
- [ ] **TRI-01**: Inventory all 275 low_support candidates from v2.6.
- [ ] **TRI-02**: Select a bounded first batch of 25–50 candidates based on evidence priority and semantic clarity.
- [ ] **TRI-03**: Record the selection rationale for the 25–50 candidate batch, including why each selected item was included and why the remaining low_support items were deferred.

## Curation Matrix
- [ ] **CUR-01**: Produce a decision matrix for each selected candidate.
- [ ] **CUR-02**: Apply only decisions explicitly approved in the decision matrix: safe seed additions, aliases, rejects, or defer/manual_review. No mutation may occur without a prior recorded disposition.

## Artifact Validation
- [ ] **ART-01**: Validate the taxonomy invariants against the modified curation inputs.
- [ ] **ART-02**: Publish v2.7 compiled artifacts and updated review_queue metrics.
- [ ] **ART-03**: Produce a v2.7 rebaseline/closure report comparing:
  - v2.6 starting state: 43 curated descriptors, 275 low_support, 8 seed_corpus_conflict
  - selected batch size
  - number of seed additions
  - number of aliases
  - number of rejects/deferred items
  - final curated descriptor count
  - final review_queue metrics

## Future Requirements
- Curate the remaining ~225 low_support items (deferred to subsequent milestones).

## Out of Scope
- Curating all 275 low_support items in one milestone.
- Automatic promotion based only on frequency.
- Reopening the 8 v2.6 deferred seed_corpus_conflict items.
- MVP, SaaS, Knowledge Engine, UI, Graphify or scoring redesign.

## Traceability
<!-- Filled by roadmap -->
