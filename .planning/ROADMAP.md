# Roadmap: Olfactory Taxonomy System

## Overview

Este roadmap descreve o desenvolvimento do Taxonomy Builder v1, um sistema em Node.js/TypeScript (zero-dependency) que processa dados moleculares enriquecidos (PubChem) e seeds manuais para gerar um sistema semântico olfativo normalizado em arquivos JSON compilados (hierarquia, aliases, grafo esparso de similaridade).

## Phases

- [x] **Phase 1: Foundation** - Setup do projeto TypeScript, arquitetura puramente funcional e definição de tipos base
- [x] **Phase 2: Data Loaders** - Implementação de parsers e streaming para o corpus de 70MB e a taxonomy seed
- [x] **Phase 3: Normalization Pipeline** - Regras componíveis para normalização semântica (lowercase, trim, stemming, etc)
- [x] **Phase 4: Corpus Analysis** - Contagem de frequência, co-ocorrência e algoritmos de string similarity (alias detection)
- [x] **Phase 5: Inference Engine** - Inferência de similaridade multi-dimensional e clustering de descriptors
- [x] **Phase 6: Compilation & CLI** - Geração de artefatos JSON, schema validation e entry point executável (completed 2026-05-21)
- [x] **Phase 7: Data Quality & Inference Hardening** - Implemented and final-approved after post-implementation verification (completed 2026-05-22)
- [x] **Phase 8: Taxonomy Seed Expansion & Curation** - 08-04 complete; awaiting human review before 08-05 (completed 2026-05-23)
- [x] **Phase 9: Taxonomy Seed v2 Expansion Round 2** - Second curated expansion wave for v2 seed (completed; v2 remains candidate-only) (completed 2026-05-23)
- [ ] **Phase 10: Taxonomy Seed v2 Expansion Round 3** - Third curated expansion for v2 seed; 3/4 plans complete, v2 remains candidate-only

## Phase Details

### Phase 1: Foundation

**Goal**: Estabelecer os alicerces do projeto, garantindo tipagem rigorosa e zero runtime dependencies.
**Depends on**: Nothing
**Requirements**: ARCH-01, ARCH-02, ARCH-03, ARCH-04
**Success Criteria**:

  1. Types TS para materiais do corpus, seeds e taxonomias finais compilam sem erros
  2. Testes básicos usando Vitest rodam com sucesso
  3. Estrutura de pastas `src/` modularizada e pronta

**Plans**: 2 plans

Plans:

- [x] 01-01: Setup TypeScript, Vitest e arquitetura base
- [x] 01-02: Definição de Type Definitions (Domain Models)

### Phase 2: Data Loaders

**Goal**: Carregar com segurança e eficiência (streaming) a base de conhecimento inicial e o corpus bruto.
**Depends on**: Phase 1
**Requirements**: INPT-01, INPT-02, INPT-03, INPT-04
**Success Criteria**:

  1. JSON seed (dummy ou real) é validado e carregado
  2. Corpus de 70MB (`enriched_materials.json`) é lido via stream sem estourar o limite de RAM do V8
  3. Apenas campos olfativos relevantes são extraídos

**Plans**: TBD

Plans:

- [x] 02-01: Seed loader e validator
- [x] 02-02: Streaming parser para `enriched_materials.json`

### Phase 3: Normalization Pipeline

**Goal**: Normalizar agressivamente todos os descritores extraídos para sua forma canônica base.
**Depends on**: Phase 1
**Requirements**: NORM-01, NORM-02, NORM-03, NORM-04, NORM-05
**Success Criteria**:

  1. "Fresh Green" e "fresh-green" reduzem para o mesmo token (`fresh_green`)
  2. Funções puras cobrem todas as regras (plural, pontuação, trim, separators)
  3. Output satisfaz canonical charset `^[a-z0-9_]+$`
  4. Idempotency contract: `normalize(normalize(x)) === normalize(x)`
  5. Performance: 100k normalizações abaixo de threshold definido

**Plans**: TBD

Plans:

- [x] 03-01: Atomic normalizer functions (unicode, case, separators, punctuation, singularize)
- [x] 03-02: Pipeline composer, seed fix, trace tests e benchmarks

### Phase 4: Corpus Analysis

**Goal**: Extrair estatísticas vitais do corpus (frequências, overlaps) e sugerir aliases baseados em similaridade de strings.
**Depends on**: Phase 2, Phase 3
**Requirements**: ANAL-01, ANAL-02, ANAL-03, ANAL-04
**Success Criteria**:

  1. Matriz de co-ocorrência é gerada a partir dos dados do corpus
  2. Algoritmo de Levenshtein ou Jaro-Winkler identifica potenciais erros ortográficos (ex: "camomile" e "chamomile")

**Future Consideration**: Semantic stopwords removal (tokens genéricos como `note`, `nuance`, `effect`, `type`, `quality`) — filtragem semântica a avaliar nesta fase ou na Phase 5. Post-Phase 6 findings showed the real corpus also contains technical/textual noise in `olfactory.descriptors`, so any future hardening should happen before or at the analysis boundary rather than only during final compilation.
**Plans**: 2 plans

Plans:

- [x] 04-01-PLAN.md — Frequência e Co-ocorrência (ANAL-01, ANAL-02)
- [x] 04-02-PLAN.md — String similarity + alias detection (ANAL-03, ANAL-04)

### Phase 5: Inference Engine

**Goal**: Processar dados brutos do corpus + seed em um mapa semântico refinado, inferindo os graus de similaridade entre subfamílias.
**Depends on**: Phase 4
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04
**Success Criteria**:

  1. Sistema computa um score de similaridade usando pelo menos 2 dimensões (overlap semântico + tradição)
  2. Apenas scores > 0.25 são preservados (formando um grafo esparso)

**Plans**: 4 plans

Plans:
**Wave 1**

- [x] 05-01-PLAN.md — Merge de seed e corpus / Clustering básico (INFR-01, INFR-02)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 05-02-PLAN.md — Calculadoras dimensionais e inputs curados explícitos (INFR-03, INFR-04)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 05-03-PLAN.md — Composição de final_score e threshold estrito (INFR-03, INFR-04)

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 05-04-PLAN.md — Grafo esparso de similaridade multi-dimensional (INFR-03, INFR-04)

### Phase 6: Compilation & CLI

**Goal**: Unir tudo e materializar a taxonomia v1 pronta para ser consumida pela próxima camada de inteligência.
**Depends on**: Phase 5
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04
**Success Criteria**:

  1. Executar o CLI gera 3 arquivos (`taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`)
  2. Output segue rigidamente os schemas predefinidos (sem chaves undefined ou nulas em locais não permitidos)

**Plans**: TBD

Plans:

- [x] 06-01: Schema validation dos outputs
- [x] 06-02: Geradores JSON e CLI (process.argv)

**Post-Phase 6 Status Note**: Phase 6 is technically complete and generated valid deterministic v1 artifacts. Semantic review found data-quality limitations that should be addressed in a future, separately planned hardening phase: noisy descriptor ingestion, insufficient semantic noise coverage, permissive corpus candidate placement, alias canonicalization not applied before statistics, empty curated relation/accord inputs, empty similarity edges, underused review queue and a small seed taxonomy.

## Phase 7 Status Note: Data Quality & Inference Hardening

**Status**: implemented and final-approved; post-implementation verification and blocker corrections completed.

This phase preserves the current v1 artifact contract while hardening semantic quality before upper layers consume the taxonomy as reliable v1 data. Implementation added sanitation, alias-aware analysis, conservative placement, curated relation/accord bootstrap, review visibility and quality gates without adding runtime dependencies or sidecar artifacts by default.

Implemented goals:

- Sanitize descriptors before analysis.
- Expand semantic noise handling.
- Make analysis alias-aware.
- Harden corpus candidate placement.
- Bootstrap curated relations and accord map.
- Populate `review_queue` with actionable curation items.

Candidate future concerns also include artifact quality gates and future seed taxonomy expansion candidates such as Gourmand, Spicy, Green, Fruity, Animalic, Amber/Resinous, Marine/Ozonic, Musky and Leather/Tobacco.

## Phase 8 Status Note: Taxonomy Seed Expansion & Curation

**Status**: complete / verified.

This phase is separated from Phase 7. Phase 7 hardened the pipeline; Phase 8 is manual taxonomy curation and seed expansion. Phase 8 added `gourmand` family with `vanilla` subfamily and `vanilla` descriptor to `taxonomy-seed.v2.json`. v2 remains a candidate seed only; defaults remain v1.

Results:

- V1 baseline: 3 families, 6 subfamilies, 21 seed descriptors.
- V2 candidate: 4 families, 7 subfamilies, 22 seed descriptors.
- Review queue reduced from 427 to 403.
- Graph edges remained 6.
- `vanilla` has no relation/accord approved yet (accepted soft warning).
- `ylang ylang -> ylang_ylang` remains as legacy alias with absent target in minimal seed (accepted soft warning).

## Phase 9 Status Note: Taxonomy Seed v2 Expansion Round 2

**Status**: complete; 4/4 plans executed.

Second curated expansion wave for `taxonomy-seed.v2.json`. Phase 8 established the v2 candidate seed with a minimal first expansion (gourmand/vanilla). Phase 9 added green, fruity and spicy candidate coverage through manual curation, then validated v2 against v1 without promoting v2 to default.

Hard boundaries:

- v2 remains candidate seed only; no promotion to default.
- `taxonomy-seed.v1.json` must not be edited.
- `data/compiled/v1/` must not be overwritten.
- Corpus candidates must not be auto-promoted.
- No aliases/relations/accords without approval/rationale/evidence in the workbook.
- Plan 09-03 added approved v2 relation/accord inputs only for endpoints present in `taxonomy-seed.v2.json`; `fresh_spice` links remain pending because `fresh_spice` is absent.
- Plan 09-04 generated `curation/v1-v2-comparison.md`, recorded all 10 validation metrics, confirmed zero hard failures, confirmed relation_count=11 and accord_count=10 for v2 input files, and verified protected v1 artifacts plus CLI defaults remain unchanged.

## Phase 10 Status Note: Taxonomy Seed v2 Expansion Round 3

**Status**: in progress; 3/4 plans complete, ready for 10-04.

Third curated expansion for `taxonomy-seed.v2.json`, using Phase 9 as the baseline. Phase 10 has completed workbook approval, seed/alias curation, and relation/accord approved-or-gap handling; v1-v2 comparison validation remains.

Hard boundaries:

- v2 remains candidate seed only; no promotion to default.
- `taxonomy-seed.v1.json` must not be edited.
- `data/compiled/v1/` must not be overwritten.
- Corpus/review_queue must not be promoted automatically.
- No aliases/relations/accords without approval/rationale/evidence in the workbook.
- No sidecar artifacts, compiled artifact changes or `DEFAULT_PATHS` changes are authorized. Seed/alias changes are limited to approved workbook entries; remaining execution must continue to preserve v1/default boundaries.

## Progress

**Execution Order:**
Completed phases executed in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Phase 10 is in progress at 3/4 plans complete; future v2 default promotion requires a separate approved plan.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | ✅ Complete | 2026-05-13 |
| 2. Data Loaders | 2/2 | ✅ Complete | 2026-05-13 |
| 3. Normalization Pipeline | 2/2 | ✅ Complete | 2026-05-17 |
| 4. Corpus Analysis | 2/2 | ✅ Complete | 2026-05-18 |
| 5. Inference Engine | 4/4 | ✅ Complete | 2026-05-19 |
| 6. Compilation & CLI | 2/2 | Complete   | 2026-05-21 |
| 7. Data Quality & Inference Hardening | 4/4 | Complete   | 2026-05-22 |
| 8. Taxonomy Seed Expansion & Curation | 5/5 | ✅ Complete | 2026-05-23 |
| 9. Taxonomy Seed v2 Expansion Round 2 | 4/4 | Complete   | 2026-05-23 |
| 10. Taxonomy Seed v2 Expansion Round 3 | 3/4 | In Progress|  |

### Phase 7: Data Quality & Inference Hardening

**Goal:** Improve semantic data quality and inference confidence before treating `data/compiled/v1/` artifacts as a reliable olfactory taxonomy v1 for upper layers.
**Requirements**: DQ-01, DQ-02, DQ-03, DQ-04, DQ-05, DQ-06, DQ-07, DQ-08
**Depends on:** Phase 6
**Plans:** 4/4 plans complete

Plans:
**Wave 1**

- [x] 07-01-PLAN.md — Descriptor sanitation and semantic noise v2 (DQ-01, DQ-02)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 07-02-PLAN.md — Alias-aware pre-analysis statistics (DQ-03)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 07-03-PLAN.md — Conservative placement and review queue population (DQ-04, DQ-06, DQ-08)

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 07-04-PLAN.md — Curated relation/accord bootstrap and quality gates (DQ-05, DQ-06, DQ-07)

### Phase 8: Taxonomy Seed Expansion & Curation

**Goal:** Expand the curated taxonomy seed through manual curation, using Phase 7 corpus candidates and review queue as evidence only.
**Requirements**: CUR-01, CUR-02, CUR-03, CUR-04, CUR-05, CUR-06, CUR-07
**Depends on:** Phase 7
**Status:** ✅ Complete / Verified
**Plans:** 5/5 plans complete

Plans:

**Wave 1**

- [x] 08-01-PLAN.md — Manual curation workbook and review-only disposition guard (CUR-01, CUR-03, CUR-04)

**Wave 2** *(blocked on Wave 1 approval)*

- [x] 08-02-PLAN.md — Create `taxonomy-seed.v2.json` without editing v1 or switching defaults (CUR-01, CUR-02, CUR-03)

**Wave 3** *(blocked on Wave 2)*

- [x] 08-03-PLAN.md — Apply approved curated aliases for v2 canonical descriptors (CUR-05)
- [x] 08-04-PLAN.md — Create v2 curated relation and accord companion inputs (CUR-06)

**Wave 4** *(blocked on Waves 2-3)*

- [x] 08-05-PLAN.md — Deterministic v1-vs-v2 validation and hard/soft curation report (CUR-07)

### Phase 9: Taxonomy Seed v2 Expansion Round 2

**Goal:** Second curated expansion wave for `taxonomy-seed.v2.json`, adding more families/subfamilies/descriptors through manual curation before v2 promotion to default.
**Requirements**: EXP2-01, EXP2-02, EXP2-03, EXP2-04, EXP2-05, EXP2-06, EXP2-07
**Depends on:** Phase 8
**Status:** ✅ Complete; v2 remains candidate-only
**Plans:** 4/4 plans complete

Plans:

- [x] 09-01-PLAN.md — Workbook setup and Round 2 prioritization
- [x] 09-02-PLAN.md — Apply approved Round 2 seed and alias curation
- [x] 09-03-PLAN.md — Apply approved Round 2 relation and accord curation
- [x] 09-04-PLAN.md — Generate v1-vs-v2-expanded comparison validation report

### Phase 10: Taxonomy Seed v2 Expansion Round 3

**Goal:** Plan a third curated expansion wave for `taxonomy-seed.v2.json`, focusing on pending groups and explicit gaps while keeping v2 candidate-only.
**Requirements**: EXP3-01, EXP3-02, EXP3-03, EXP3-04, EXP3-05, EXP3-06, EXP3-07, EXP3-08
**Depends on:** Phase 9
**Status:** in progress; 3/4 plans complete, ready for 10-04
**Plans:** 3/4 plans executed

Plans:

- [x] 10-01-PLAN.md — Workbook setup + approval checkpoint
- [x] 10-02-PLAN.md — Seed + targeted alias curation
- [x] 10-03-PLAN.md — Relations/accords approved-or-gap
- [ ] 10-04-PLAN.md — Validation + comparison report

Execution gate: not ready until final preflight passes and workbook approvals are persisted.
