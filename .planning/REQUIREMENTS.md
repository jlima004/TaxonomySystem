# Requirements: Olfactory Taxonomy System

**Defined:** 2026-05-12
**Core Value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## v1 Requirements

### Architecture & Setup

- [ ] **ARCH-01**: Project initialized with TypeScript strict mode and Vitest
- [ ] **ARCH-02**: Functional architecture established (no classes, pure functions)
- [ ] **ARCH-03**: Zero-dependency runtime established (no npm packages at runtime)
- [ ] **ARCH-04**: Core types defined (TaxonomyFamily, Subfamily, Descriptor, etc.)

### Input Processing

- [ ] **INPT-01**: Seed loader reads and validates `taxonomy-seed.json`
- [ ] **INPT-02**: Corpus loader stream-parses `enriched_materials.json`
- [ ] **INPT-03**: Corpus loader extracts odor descriptions and usage categories
- [ ] **INPT-04**: Corpus loader prevents memory exhaustion for 70MB file

### Normalization

- [x] **NORM-01**: Descriptor normalizer converts to lowercase and trims
- [x] **NORM-02**: Descriptor normalizer removes punctuation
- [x] **NORM-03**: Descriptor normalizer converts plurals to singular forms
- [x] **NORM-04**: Descriptor normalizer standardizes whitespace
- [x] **NORM-05**: Normalization rules are composable pure functions

### Analysis

- [x] **ANAL-01**: Analyzer counts frequency of each normalized descriptor in corpus
- [x] **ANAL-02**: Analyzer builds co-occurrence matrix for descriptors
- [x] **ANAL-03**: String similarity algorithm implemented (Levenshtein/Jaro-Winkler)
- [x] **ANAL-04**: Alias detector identifies candidate aliases using string similarity

### Inference

- [x] **INFR-01**: Seed hierarchy merged with corpus frequency data
- [x] **INFR-02**: Descriptors clustered based on co-occurrence and similarity
- [x] **INFR-03**: Similarity inference computes semantic overlap between subfamilies
- [x] **INFR-04**: Similarity inference incorporates accord compatibility and tradition

### Compilation & Output

- [x] **COMP-01**: Compiler generates `taxonomy.json` (families, subfamilies, canonical descriptors)
- [x] **COMP-02**: Compiler generates `descriptor_aliases.json` (alias mapping)
- [x] **COMP-03**: Compiler generates `similarity_matrix.json` (sparse graph, >0.25 threshold)
- [x] **COMP-04**: Schema validator ensures output JSONs match defined types

## Phase 8 Context-Gathering Requirements

**Status:** active_for_context_gathering, not executable. These requirements define the discussion scope for Phase 8 and do not authorize implementation, plans or compiled artifact changes.

- [ ] **CUR-01 Taxonomy scope**: Decide which curated families, subfamilies and descriptors should be considered for the first manually expanded seed.
- [ ] **CUR-02 Seed versioning**: Decide whether Phase 8 should create `taxonomy-seed.v2.json`, update `taxonomy-seed.v1.json` with controlled migration, or maintain a draft expansion file first.
- [ ] **CUR-03 Curation rules**: Define the criteria for a descriptor, family or subfamily to become curated seed truth, including naming and evidence expectations.
- [ ] **CUR-04 Candidate review workflow**: Define how Phase 7 corpus candidates and `similarity_matrix.json.review_queue` are used as review-only evidence without auto-promotion.
- [ ] **CUR-05 Alias expansion**: Define how manually curated aliases enter `descriptor_aliases.seed.json` alongside new descriptors.
- [ ] **CUR-06 Relation/accord expansion**: Define how curated relations and accord map entries should expand for new subfamilies using manual scores only.
- [ ] **CUR-07 Validation and quality gates**: Define hard and soft measures for whether the expanded seed improves compiled taxonomy, aliases and similarity graph while preserving artifact contracts.

## v2 Requirements

### Analytics & Reporting

- **RPRT-01**: Generate coverage report (% of materials covered by taxonomy)
- **RPRT-02**: Detect orphan descriptors in corpus
- **RPRT-03**: Export taxonomy statistics (distribution charts)
- **RPRT-04**: Diff reporting between taxonomy versions

## Historical Phase 7 Hardening Requirements

**Status:** resolved by Phase 7, not active for execution. These requirements captured post-Phase 6 hardening needs and do not authorize Phase 8 implementation.

Phase 8 now opens manual seed curation as a context-gathering phase. DQ-08 remains historical evidence for why seed expansion is needed; active Phase 8 discussion is tracked by CUR-01 through CUR-07 above.

- **DQ-01 Descriptor sanitation**: Separate true olfactive descriptors from technical comments, solvents, usage text, concentration text and substantivity metadata before corpus statistics are computed.
- **DQ-02 Semantic noise schema expansion**: Evolve semantic noise configuration beyond a flat list into categories such as `hard_exclude`, `pattern_exclude` and `downweight`, while preserving compatibility with the Phase 5 inference API.
- **DQ-03 Alias-aware frequency and co-occurrence**: Apply curated descriptor aliases before frequency/co-occurrence analysis so canonical descriptors aggregate alias evidence.
- **DQ-04 Candidate placement scoring**: Use stronger evidence than raw co-occurrence support of 1, including normalized support, placement score and semantic noise penalties.
- **DQ-05 Curated relations/accord bootstrap**: Add enough curated relation and accord coverage to exercise positive similarity graph edges in addition to valid empty-graph behavior.
- **DQ-06 Review queue population**: Turn `review_queue` into a real curation surface for detected data-quality and inference-confidence issues.
- **DQ-07 Artifact quality gates**: Add future quality checks that flag excessive candidate volume, technical tokens, empty curated inputs and suspicious zero-frequency seed descriptors without changing the v1 artifact contract.
- **DQ-08 Seed taxonomy expansion**: Evaluate whether the seed hierarchy needs additional families/subfamilies before routing many corpus candidates into a small MVP seed.

These DQ requirements are not active Phase 8 requirements. They were addressed by Phase 7 hardening or carried forward into Phase 8 as manual curation discussion only.

### Post-Phase 7 Curation Evidence

- Current `taxonomy.json` has 3 families, 6 subfamilies and 177 descriptors.
- Seed descriptor count is 21; corpus candidate count is 156.
- `taxonomy.json` has no hard/pattern-exclude descriptors.
- `descriptor_aliases.json` has 10 authoritative aliases, including `jasmin -> jasmine`, `orangeflower -> orange_blossom`, and `orange blossom -> orange_blossom`.
- `jasmine` and `orange_blossom` now receive canonicalized frequency.
- `similarity_matrix.json.edges.length = 6` and `similarity_matrix.json.review_queue.length = 427`.
- Review queue distribution is `corpus_candidate_low_support: 410` and `seed_corpus_conflict: 17`.
- Remaining seed descriptors with frequency 0 are `bitter_orange`, `sweet_orange`, and `tree_moss`.
- The current seed remains small enough to force candidates toward broad subfamilies such as `floral_rose`, `citrus_fresh`, and `woody_dry`.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Physchem scores | Belong in Layer 3 (Derived Features), not Layer 1 |
| Runtime APIs | Milestone v1 is "Builder first", APIs come later |
| Combined Similarity Engine | Belongs in future Layer 4 (Intelligence) |
| Deep taxonomies | v1 prioritizes computational usefulness over academic completeness |
| Vector DBs | Unnecessary for ~100 subfamilies, adds external dependency |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 1 | Pending |
| ARCH-02 | Phase 1 | Pending |
| ARCH-03 | Phase 1 | Pending |
| ARCH-04 | Phase 1 | Pending |
| INPT-01 | Phase 2 | Pending |
| INPT-02 | Phase 2 | Pending |
| INPT-03 | Phase 2 | Pending |
| INPT-04 | Phase 2 | Pending |
| NORM-01 | Phase 3 | Complete |
| NORM-02 | Phase 3 | Complete |
| NORM-03 | Phase 3 | Complete |
| NORM-04 | Phase 3 | Complete |
| NORM-05 | Phase 3 | Complete |
| ANAL-01 | Phase 4 | Complete |
| ANAL-02 | Phase 4 | Complete |
| ANAL-03 | Phase 4 | Complete |
| ANAL-04 | Phase 4 | Complete |
| INFR-01 | Phase 5 | Complete |
| INFR-02 | Phase 5 | Complete |
| INFR-03 | Phase 5 | Complete |
| INFR-04 | Phase 5 | Complete |
| COMP-01 | Phase 6 | Complete |
| COMP-02 | Phase 6 | Complete |
| COMP-03 | Phase 6 | Complete |
| COMP-04 | Phase 6 | Complete |
| DQ-01 | Phase 7 | Complete |
| DQ-02 | Phase 7 | Complete |
| DQ-03 | Phase 7 | Complete |
| DQ-04 | Phase 7 | Complete |
| DQ-05 | Phase 7 | Complete |
| DQ-06 | Phase 7 | Complete |
| DQ-07 | Phase 7 | Complete |
| DQ-08 | Phase 7 / Phase 8 discussion evidence | Prepared / context gathering |
| CUR-01 | Phase 8 | Context gathering |
| CUR-02 | Phase 8 | Context gathering |
| CUR-03 | Phase 8 | Context gathering |
| CUR-04 | Phase 8 | Context gathering |
| CUR-05 | Phase 8 | Context gathering |
| CUR-06 | Phase 8 | Context gathering |
| CUR-07 | Phase 8 | Context gathering |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-12*
*Last updated: 2026-05-22 after opening Phase 8 context gathering*
