# Requirements: Olfactory Taxonomy System

**Defined:** 2026-05-12
**Core Value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## v1 Requirements

### Architecture & Setup

- [x] **ARCH-01**: Project initialized with TypeScript strict mode and Vitest
- [x] **ARCH-02**: Functional architecture established (no classes, pure functions)
- [x] **ARCH-03**: Zero-dependency runtime established (no npm packages at runtime)
- [x] **ARCH-04**: Core types defined (TaxonomyFamily, Subfamily, Descriptor, etc.)

### Input Processing

- [x] **INPT-01**: Seed loader reads and validates `taxonomy-seed.json`
- [x] **INPT-02**: Corpus loader stream-parses `enriched_materials.json`
- [x] **INPT-03**: Corpus loader extracts odor descriptions and usage categories
- [x] **INPT-04**: Corpus loader prevents memory exhaustion for 70MB file

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

**Status:** complete / verified. Phase 8 executed 5 plans. v2 seed exists as candidate with gourmand/vanilla/vanilla.

- [x] **CUR-01 Taxonomy scope**: Decide which curated families, subfamilies and descriptors should be considered for the first manually expanded seed.
- [x] **CUR-02 Seed versioning**: Decide whether Phase 8 should create `taxonomy-seed.v2.json`, update `taxonomy-seed.v1.json` with controlled migration, or maintain a draft expansion file first.
- [x] **CUR-03 Curation rules**: Define the criteria for a descriptor, family or subfamily to become curated seed truth, including naming and evidence expectations.
- [x] **CUR-04 Candidate review workflow**: Define how Phase 7 corpus candidates and `similarity_matrix.json.review_queue` are used as review-only evidence without auto-promotion.
- [x] **CUR-05 Alias expansion**: Define how manually curated aliases enter `descriptor_aliases.seed.json` alongside new descriptors.
- [x] **CUR-06 Relation/accord expansion**: Define how curated relations and accord map entries should expand for new subfamilies using manual scores only.
- [x] **CUR-07 Validation and quality gates**: Define hard and soft measures for whether the expanded seed improves compiled taxonomy, aliases and similarity graph while preserving artifact contracts.

## Phase 9 Context-Gathering Requirements

**Status:** complete. Phase 9 executed 4 plans; v2-expanded remains candidate-only and defaults remain v1.

- [x] **EXP2-01 Expansion scope**: Decide how many groups enter this round and which families/subfamilies/descriptors are prioritized for the second v2 expansion.
- [x] **EXP2-02 Candidate prioritization**: Define prioritization strategy using review_queue reduction, generic pressure relief, high-frequency candidates, planned subfamilies and graph coverage.
- [x] **EXP2-03 Manual approval workflow**: Confirm that each new entry continues to require `manual_approval: approved`, `primary_disposition: promote_to_seed`, concrete family/subfamily/descriptor, rationale and evidence persisted in the workbook.
- [x] **EXP2-04 Alias cleanup**: Decide how to handle legacy alias issues, especially `ylang ylang -> ylang_ylang` with absent target in minimal seed.
- [x] **EXP2-05 Relation/accord expansion**: Define how relations/accords are added for new subfamilies with manual scores, gap rationale for absent entries, and scores in [0,1].
- [x] **EXP2-06 Validation gates**: Define v1-vs-v2-expanded comparison metrics including family_count, subfamily_count, seed descriptors, corpus descriptors, review_queue, graph edges, graph density, generic pressure, zero-frequency seeds, alias target quality and determinism/schema.
- [x] **EXP2-07 Promotion readiness criteria**: Discuss (but not execute) future criteria for v2 to become default: minimum group coverage, graph coverage, alias quality, review_queue reduction, generic pressure reduction, zero hard failures, acceptable soft warnings.

## Phase 10 Context-Gathering Requirements

**Status:** complete. Phase 10 executed four plans; v2 Round 3 remains candidate-only and defaults remain v1.

- [x] **EXP3-01 Expansion scope**: Decide whether Round 3 includes `amber_resinous`, `animalic` and `fresh_spice`, or only a subset; decide whether additional gourmand review is deferred to Round 4.
- [x] **EXP3-02 Amber/resinous curation**: Discuss candidate subfamilies `amber` and `balsamic_resin`, including descriptors `amber`, `resinous`, `labdanum`, `benzoin` and `balsamic` with explicit handling for generic/semantic duplication risk.
- [x] **EXP3-03 Animalic curation**: Discuss candidate subfamilies `musky` and `leathery`, including canonical decisions for `musk` vs `musky` and review treatment for `animal`, `ambrette` and `civet`.
- [x] **EXP3-04 Fresh spice gap**: Decide whether `fresh_spice` remains deferred or receives concrete approved descriptor coverage such as `anise`; review `anisic` carefully before any disposition.
- [x] **EXP3-05 Manual approval and workbook policy**: Preserve Phase 8/9 manual approval workflow, reuse `candidate-review.md`, and define Round 3 IDs `r3-approval-*`, `r3-relation-*`, `r3-accord-*`, `r3-alias-cleanup-*` and `r3-defer-*`.
- [x] **EXP3-06 Alias cleanup policy**: Decide how to handle `musk`/`musky`, possible new aliases, and the legacy `ylang ylang -> ylang_ylang` soft finding without automatic alias changes.
- [x] **EXP3-07 Relation/accord expansion**: Define which approved subfamilies require relation/accord records or explicit gaps, with manual scores in [0,1], no placeholder `score: 0`, and existing endpoints only.
- [x] **EXP3-08 Validation gates and promotion boundaries**: Define v1-vs-v2-round-3 comparison metrics, preserve hard/soft gates, confirm Phase 10 does not promote v2 or alter `DEFAULT_PATHS`.

## Phase 11 Context-Gathering Requirements

**Status:** complete; documentation-only execution. Phase 11 completed readiness/planning only and did not authorize or perform default switch, code changes, seed/data changes, compiled artifact changes, `DEFAULT_PATHS` changes, official `data/compiled/v2`, or v2 promotion.

- [x] **PROMO-01 Promotion scope**: Decide whether Phase 11 is readiness/planning only or whether any default switch must be deferred to a separate Phase 12.
- [x] **PROMO-02 Readiness criteria**: Define minimum criteria before v2 can become default, including hard failures, determinism, protected file auditability, approved curation, graph coverage, review queue, zero-frequency seeds, migration/rollback documentation and final human approval.
- [x] **PROMO-03 Remaining soft findings**: Decide how to handle `ylang ylang -> ylang_ylang`, lower graph density, inherited zero-frequency seeds, review_queue 317, increased `seed_corpus_conflict` and pending/deferred Round 3 candidates.
- [x] **PROMO-04 Alias readiness**: Decide whether aliases with absent targets block promotion, require remediation, require an exception list, or can be accepted by explicit policy.
- [x] **PROMO-05 Graph readiness**: Decide whether lower graph density is acceptable with isolated subfamilies = 0 and define minimum edge coverage/gap policy per subfamily.
- [x] **PROMO-06 Review queue readiness**: Decide acceptable review_queue size, distribution, severity/type thresholds and rationale for increased `seed_corpus_conflict`.
- [x] **PROMO-07 Generated artifacts and default switch strategy**: Decide whether promotion should create `data/compiled/v2`, replace or preserve `data/compiled/v1`, introduce versioned output dirs, change CLI defaults, or change docs only.
- [x] **PROMO-08 Migration mechanics**: Identify files that would change in a future promotion, including `src/cli/parse_args.ts`, docs, default seed/relation/accord paths, output dir and version, and identify files that must never be removed.
- [x] **PROMO-09 Rollback strategy**: Define how to restore v1 defaults, preserve v1 inputs, keep compiled v1 reproducible, detect regressions after switch and validate rollback commands.
- [x] **PROMO-10 Validation gates and release process**: Define hard gates, soft gates, comparison steps, release checklist and final human approval required before any future promotion.

## Phase 12 Context-Gathering Requirements

**Status:** complete; closed. Phase 12 executed the controlled and reversible taxonomy seed v2 default switch after persisted approval and Gates 0 through 6. v2 is now the CLI/compiler default, official `data/compiled/v2` artifacts are present, v1 remains preserved, and rollback dry-run recorded `rollback_success: true`.

- [x] **SWITCH-01 Final approval**: Decide where final human approval will be persisted and which required fields must exist before any mutation.
- [x] **SWITCH-02 Execution scope**: Decide whether Phase 12 will execute the full default switch or only pre-switch validation.
- [x] **SWITCH-03 Readiness revalidation**: Decide which Phase 11 gates must be re-run before promotion, including typecheck, tests, build, explicit v1/v2 compiles, deterministic v2 comparison, protected-path audit and soft finding disposition.
- [x] **SWITCH-04 Expected diffs**: Define which files may change during the default switch and which files must never change.
- [x] **SWITCH-05 Generated_at policy**: Decide whether official v2 artifacts use a fixed approved timestamp or a real timestamp, and how determinism will be compared.
- [x] **SWITCH-06 Artifact publication**: Decide whether official `data/compiled/v2` artifacts are created and committed, and how they are compared to temporary v2 output without overwriting `data/compiled/v1`.
- [x] **SWITCH-07 Default paths switch**: Decide exact `DEFAULT_PATHS` changes for seedPath, relationsPath, accordsPath, outputDir and version.
- [x] **SWITCH-08 Protected v1 baseline**: Define preservation and audit requirements for v1 inputs and `data/compiled/v1` before, during and after any switch.
- [x] **SWITCH-09 Rollback execution**: Decide how rollback is tested or documented and define success criteria that do not depend only on git revert.
- [x] **SWITCH-10 Docs and release notes**: Decide which docs must communicate v2 defaults, validation results and rollback path.
- [x] **SWITCH-11 Commit strategy**: Decide how commits should separate final approval/preflight, artifact publication, default switch, docs/release notes and post-switch verification.

## Phase 13 Stabilization Requirements

**Status:** complete / closed. Phase 13 validated and stabilized the project after the Phase 12 v2 default promotion.

- [x] **POST-01 Consumer audit**: Identify and verify in-repo consumers that rely on CLI/compiler defaults, explicit paths, generated artifacts or documented default behavior after v2 promotion.
- [x] **POST-02 CLI default validation**: Verify default CLI behavior points to v2 coherently and remains reproducible without changing taxonomy source inputs.
- [x] **POST-03 Explicit v1 fallback**: Verify explicit v1 fallback commands and paths remain usable, documented and protected.
- [x] **POST-04 Artifact coherence**: Verify `data/compiled/v1/` and `data/compiled/v2/` artifacts are present, versioned, discoverable and not accidentally overwritten by stabilization work.
- [x] **POST-05 Documentation alignment**: Verify README, CLI docs, migration/release notes and planning docs describe v2 defaults and v1 fallback consistently.
- [x] **POST-06 Protected source policy**: Enforce no edits to `taxonomy-seed.v2.json`, `curated_relations.v2.json`, `accord_map.v2.json` or `descriptor_aliases.seed.json` during Phase 13.
- [x] **POST-07 graphify-out policy**: Decide and document whether `graphify-out/*` is archive-only, regenerable, ignored, or plan-gated after the default promotion.
- [x] **POST-08 Risk and Phase 14 backlog capture**: Capture post-promotion risks, consumer-adoption gaps and candidate backlog items for a future Phase 14 without executing curation.

## Phase 14 Context-Gathering Requirements

**Status:** complete / closed / read-only report-only. These requirements were satisfied by Phase 14 reports and shortlists only; they do not authorize curation, implementation, artifact regeneration, docs/help fixes, safety automation implementation or executable mutation.

- [x] **TRIAGE-01 Review queue reduction**: Decide whether review queue reduction is a v2.1 priority, what kinds of review items matter most, and what disposition rules are needed before execution planning.
- [x] **TRIAGE-02 Soft findings disposition**: Decide whether accepted soft findings remain policy-managed, should be cleaned up, or should become explicit v2.1 acceptance criteria.
- [x] **TRIAGE-03 Alias cleanup**: Decide how to handle alias cleanup candidates, including `ylang ylang -> ylang_ylang`, without adding/removing aliases during context gathering.
- [x] **TRIAGE-04 Graph quality**: Decide whether graph density, graph coverage, isolated endpoints, or relation confidence should drive future work.
- [x] **TRIAGE-05 Curation candidates**: Decide which future families, subfamilies, descriptors or promotions are candidates for v2.1 discussion without promoting anything yet.
- [x] **TRIAGE-06 Relations/accords quality**: Decide whether relation/accord cleanup, gap handling, scoring consistency or coverage expansion should be prioritized.
- [x] **TRIAGE-07 Docs/help cleanup**: Decide which non-blocking docs or CLI help cleanup items belong in v2.1 or a separate maintenance phase.
- [x] **TRIAGE-08 Graphify/generated artifact lifecycle**: Decide lifecycle policy for `graphify-out/*` and generated artifacts before any mutation or regeneration is authorized.
- [x] **TRIAGE-09 CI/release automation**: Decide whether CI, release checks, protected-path gates or automation improvements should precede future curation work.

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
| ARCH-01 | Phase 1 | Complete |
| ARCH-02 | Phase 1 | Complete |
| ARCH-03 | Phase 1 | Complete |
| ARCH-04 | Phase 1 | Complete |
| INPT-01 | Phase 2 | Complete |
| INPT-02 | Phase 2 | Complete |
| INPT-03 | Phase 2 | Complete |
| INPT-04 | Phase 2 | Complete |
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
| CUR-01 | Phase 8 | Complete via 08-02 |
| CUR-02 | Phase 8 | Complete via 08-02 |
| CUR-03 | Phase 8 | Complete via 08-02 |
| CUR-04 | Phase 8 | Context captured |
| CUR-05 | Phase 8 | Complete via 08-03 |
| CUR-06 | Phase 8 | Complete via 08-04 |
| CUR-07 | Phase 8 | Complete via 08-05 |
| EXP2-01 | Phase 9 | Complete via 09-01 / 09-02 |
| EXP2-02 | Phase 9 | Complete via 09-01 / 09-04 |
| EXP2-03 | Phase 9 | Complete via 09-01 / 09-02 |
| EXP2-04 | Phase 9 | Complete via 09-02 / 09-04 |
| EXP2-05 | Phase 9 | Completed in 09-03 |
| EXP2-06 | Phase 9 | Completed in 09-04 |
| EXP2-07 | Phase 9 | Completed in 09-04 |
| EXP3-01 | Phase 10 | Planned via 10-01 |
| EXP3-02 | Phase 10 | Completed via 10-02 seed curation |
| EXP3-03 | Phase 10 | Completed via 10-02 seed and musk/musky alias curation |
| EXP3-04 | Phase 10 | Completed via 10-02 fresh_spice/anise curation |
| EXP3-05 | Phase 10 | Completed through 10-03 workbook-first seed, alias, relation and accord policy |
| EXP3-06 | Phase 10 | Completed via 10-02 targeted alias cleanup |
| EXP3-07 | Phase 10 | Completed via 10-03 approved relation/accord application |
| EXP3-08 | Phase 10 | Completed via 10-04 validation |
| PROMO-01 | Phase 11 | Complete via 11-01 |
| PROMO-02 | Phase 11 | Complete via 11-01 |
| PROMO-03 | Phase 11 | Complete via 11-02 |
| PROMO-04 | Phase 11 | Complete via 11-02 |
| PROMO-05 | Phase 11 | Complete via 11-03 |
| PROMO-06 | Phase 11 | Complete via 11-03 |
| PROMO-07 | Phase 11 | Complete via 11-04 |
| PROMO-08 | Phase 11 | Complete via 11-04 |
| PROMO-09 | Phase 11 | Complete via 11-05 |
| PROMO-10 | Phase 11 | Complete via 11-05 |
| SWITCH-01 | Phase 12 | Complete via 12-01 |
| SWITCH-02 | Phase 12 | Complete via 12-01 / 12-05 |
| SWITCH-03 | Phase 12 | Complete via 12-02 |
| SWITCH-04 | Phase 12 | Complete via 12-02 / 12-03 / 12-04 / 12-05 |
| SWITCH-05 | Phase 12 | Complete via 12-02 / 12-03 |
| SWITCH-06 | Phase 12 | Complete via 12-03 |
| SWITCH-07 | Phase 12 | Complete via 12-04 |
| SWITCH-08 | Phase 12 | Complete via 12-04 / 12-05 |
| SWITCH-09 | Phase 12 | Complete via 12-05 |
| SWITCH-10 | Phase 12 | Complete via 12-05 |
| SWITCH-11 | Phase 12 | Complete via 12-05 |
| POST-01 | Phase 13 | Complete |
| POST-02 | Phase 13 | Complete |
| POST-03 | Phase 13 | Complete |
| POST-04 | Phase 13 | Complete |
| POST-05 | Phase 13 | Complete |
| POST-06 | Phase 13 | Complete |
| POST-07 | Phase 13 | Complete |
| POST-08 | Phase 13 | Complete |
| TRIAGE-01 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md and 14-REVIEW-QUEUE-TRIAGE.md |
| TRIAGE-02 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md |
| TRIAGE-03 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md and 14-03-SUMMARY.md |
| TRIAGE-04 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md |
| TRIAGE-05 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md and 14-REVIEW-QUEUE-TRIAGE.md |
| TRIAGE-06 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md |
| TRIAGE-07 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md and 14-DOCS-HELP-SHORTLIST.md |
| TRIAGE-08 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md and 14-CLOSURE.md |
| TRIAGE-09 | Phase 14 | Complete via 14-BACKLOG-MATRIX.md and 14-SAFETY-AUTOMATION-SHORTLIST.md |

**Coverage:**
- v1 requirements: 25 total
- Phase 8 requirements: 7 total (complete)
- Phase 9 requirements: 7 total (complete)
- Phase 10 requirements: 8 total (complete)
- Phase 11 requirements: 10 total (complete)
- Phase 12 requirements: 11 total (complete)
- Phase 13 requirements: 8 total (complete)
- Phase 14 context-gathering requirements: 9 total (complete / read-only report-only)
- Historical Phase 7 hardening requirements: 8 total (complete)
- Mapped to phases: 93
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-12*
*Last updated: 2026-05-26 after closing Phase 14 read-only/report-only hygiene*
