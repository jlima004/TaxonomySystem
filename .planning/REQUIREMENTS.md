# Requirements: Olfactory Taxonomy System

**Defined:** 2026-06-02
**Milestone:** v2.8 Low-Support Review Queue Triage Batch 2
**Core Value:** Produzir um sistema semantico olfativo normalizado e computacionalmente util -- a Layer 1 (taxonomia pura) que serve de fundacao para todas as camadas superiores de inteligencia de fragrancias.

## v2.8 Requirements

Requirements for the current milestone. Each requirement maps to exactly one roadmap phase.

### Inventory

- [x] **INV-01**: Curator can inventory the current compiled v2.7 review_queue and confirm the remaining low_support candidate count before selection.
- [x] **INV-02**: Curator can exclude candidates already explicitly decided in v2.7 unless they still appear unresolved as low_support in the current compiled v2.7 review_queue.

### Batch Selection

- [x] **SEL-01**: Curator can select a bounded Batch 2 of 25-50 low_support candidates.
- [x] **SEL-02**: Curator can justify each selected candidate using evidence priority, semantic clarity, low polysemy, and curation value.

### Decision Matrix

- [x] **DEC-01**: Curator can produce a decision matrix for every selected candidate before mutation.
- [x] **DEC-02**: Curator can assign each selected candidate an explicit disposition: safe seed addition, alias, reject, defer, or manual_review.
- [x] **DEC-03**: Curator can document rationale and evidence for each disposition so downstream mutation is traceable.

### Controlled Mutation

- [ ] **CUR-01**: Curator can apply only explicitly approved safe seed additions or aliases from the decision matrix.
- [ ] **CUR-02**: Curator can preserve rejects, defers, and manual_review outcomes as non-promoted decisions without automatic promotion.
- [ ] **CUR-03**: Curator can verify protected boundaries remain unchanged unless explicitly authorized: seed_corpus_conflict reopening, scoring redesign, Graphify, UI, MVP, SaaS, Knowledge Engine, and frequency-only promotion.

### Artifact Publication

- [ ] **PUB-01**: Curator can validate v2.8 compilation in a sandbox before official artifact publication.
- [ ] **PUB-02**: Curator can publish v2.8 compiled artifacts with updated taxonomy, aliases, similarity graph, review_queue metrics, and artifact version alignment.
- [ ] **PUB-03**: Curator can produce a v2.8 closure report whose metrics are measured from the published compiled JSON artifacts.

## Future Requirements

Deferred to later milestones. Tracked but not in the current roadmap.

### Low-Support Continuation

- **FUT-01**: Curator can continue triaging any low_support candidates that remain after the v2.8 bounded batch.

### Conflict Resolution

- **FUT-02**: Curator can separately plan and resolve the 10 remaining seed_corpus_conflict items after explicit authorization.

## Out of Scope

Explicitly excluded to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Curating all 259 remaining low_support candidates in v2.8 | Bounded batch is required to preserve review quality and avoid over-curation. |
| Automatic promotion based only on frequency | Frequency is evidence, not explicit curation approval. |
| Reopening seed_corpus_conflict items | v2.8 is strictly low_support Batch 2 unless conflict work is explicitly planned later. |
| Reconsidering v2.7 explicit decisions unless still unresolved in current compiled v2.7 review_queue | Preserves Batch 1 decisions and avoids churn. |
| MVP, SaaS, Knowledge Engine, UI, Graphify, or scoring redesign | Reserved for future milestones outside this curation batch. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INV-01 | Phase 44 | Complete |
| INV-02 | Phase 44 | Complete |
| SEL-01 | Phase 45 | Complete |
| SEL-02 | Phase 45 | Complete |
| DEC-01 | Phase 46 | Complete |
| DEC-02 | Phase 46 | Complete |
| DEC-03 | Phase 46 | Complete |
| CUR-01 | Phase 47 | Pending |
| CUR-02 | Phase 47 | Pending |
| CUR-03 | Phase 47 | Pending |
| PUB-01 | Phase 48 | Pending |
| PUB-02 | Phase 48 | Pending |
| PUB-03 | Phase 48 | Pending |

**Coverage:**
- v2.8 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-06-02*
*Last updated: 2026-06-03 after Phase 46 decision matrix completion*
