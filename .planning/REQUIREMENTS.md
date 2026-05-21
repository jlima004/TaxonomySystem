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

## v2 Requirements

### Analytics & Reporting

- **RPRT-01**: Generate coverage report (% of materials covered by taxonomy)
- **RPRT-02**: Detect orphan descriptors in corpus
- **RPRT-03**: Export taxonomy statistics (distribution charts)
- **RPRT-04**: Diff reporting between taxonomy versions

## Future / Backlog Requirements

**Status:** proposed, not planned, not executable. These are not Phase 7 tasks and do not alter the v1 artifact contract. They capture post-Phase 6 findings for future scoping only.

- **DQ-01 Descriptor sanitation**: Separate true olfactive descriptors from technical comments, solvents, usage text, concentration text and substantivity metadata before corpus statistics are computed.
- **DQ-02 Semantic noise schema expansion**: Evolve semantic noise configuration beyond a flat list into categories such as `hard_exclude`, `pattern_exclude` and `downweight`, while preserving compatibility with the Phase 5 inference API.
- **DQ-03 Alias-aware frequency and co-occurrence**: Apply curated descriptor aliases before frequency/co-occurrence analysis so canonical descriptors aggregate alias evidence.
- **DQ-04 Candidate placement scoring**: Use stronger evidence than raw co-occurrence support of 1, including normalized support, placement score and semantic noise penalties.
- **DQ-05 Curated relations/accord bootstrap**: Add enough curated relation and accord coverage to exercise positive similarity graph edges in addition to valid empty-graph behavior.
- **DQ-06 Review queue population**: Turn `review_queue` into a real curation surface for detected data-quality and inference-confidence issues.
- **DQ-07 Artifact quality gates**: Add future quality checks that flag excessive candidate volume, technical tokens, empty curated inputs and suspicious zero-frequency seed descriptors without changing the v1 artifact contract.
- **DQ-08 Seed taxonomy expansion**: Evaluate whether the seed hierarchy needs additional families/subfamilies before routing many corpus candidates into a small MVP seed.

These DQ requirements are backlog-only. They are not active, not completed and not mapped to any executable phase.

### Evidence Behind Future Hardening

- The current generated `taxonomy.json` has 366 descriptors: 21 seed descriptors and 345 corpus candidates.
- Problematic corpus candidates include generic or technical terms such as `fruity`, `green`, `floral`, `sweet`, `herbal`, `spicy`, `fresh`, `woody`, `balsamic`, `fatty`, `waxy`, `at`, `in`, `de`, `hour_s`, `substantivity_232`, `substantivity_400` and `general_comment_at_100_00_lime`.
- `descriptor_aliases.json` contains curated aliases such as `orange flower -> orange_blossom`, but `taxonomy.json` still shows `orange_blossom` with frequency 0, suggesting alias canonicalization is not yet applied before statistics.
- `similarity_matrix.json` is structurally valid but can contain `edges: []`, `review_queue: []` and `density: 0` when `curated_relations.v1.json` and `accord_map.v1.json` are empty.

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

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-12*
*Last updated: 2026-05-21 after post-Phase 6 semantic findings review*
