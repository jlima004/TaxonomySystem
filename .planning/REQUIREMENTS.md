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
- [ ] **INFR-03**: Similarity inference computes semantic overlap between subfamilies
- [ ] **INFR-04**: Similarity inference incorporates accord compatibility and tradition

### Compilation & Output

- [ ] **COMP-01**: Compiler generates `taxonomy.json` (families, subfamilies, canonical descriptors)
- [ ] **COMP-02**: Compiler generates `descriptor_aliases.json` (alias mapping)
- [ ] **COMP-03**: Compiler generates `similarity_matrix.json` (sparse graph, >0.25 threshold)
- [ ] **COMP-04**: Schema validator ensures output JSONs match defined types

## v2 Requirements

### Analytics & Reporting

- **RPRT-01**: Generate coverage report (% of materials covered by taxonomy)
- **RPRT-02**: Detect orphan descriptors in corpus
- **RPRT-03**: Export taxonomy statistics (distribution charts)
- **RPRT-04**: Diff reporting between taxonomy versions

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
| INFR-03 | Phase 5 | Pending |
| INFR-04 | Phase 5 | Pending |
| COMP-01 | Phase 6 | Pending |
| COMP-02 | Phase 6 | Pending |
| COMP-03 | Phase 6 | Pending |
| COMP-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-12*
*Last updated: 2026-05-18 after Phase 4 execution*
