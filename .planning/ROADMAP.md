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
- [x] **Phase 10: Taxonomy Seed v2 Expansion Round 3** - Third curated expansion for v2 seed completed; v2 remains candidate-only (completed 2026-05-24)
- [x] **Phase 11: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning** - Readiness audit and controlled default migration planning for v2; completed as documentation-only execution, no default switch (completed 2026-05-24)
- [x] **Phase 12: Taxonomy Seed v2 Default Switch Execution** - Controlled and reversible execution phase for promoting taxonomy seed v2 to default; completed with rollback validated (completed 2026-05-25)
- [x] **Phase 13: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption** - Validate and stabilize the project after the taxonomy seed v2 default promotion
- [x] **Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning** - Read-only/report-only triage of post-Phase 13 backlog for future v2.1 execution planning
- [x] **Phase 15: Post-Triage Safety Guards & Current-State Docs Cleanup** - Non-mutating local proof-only safety guard validation; completed without automation, curation, docs/help fixes or compile/smoke execution
- [x] **Phase 16: Permanent Safety Guard Implementation** - Permanent non-mutating local safety guard script (`scripts/check-safety-guards.sh`) implemented and validated; closed 2026-05-26
- [x] **Phase 17: Safety Guard Usability Wrapper** - Transform `scripts/check-safety-guards.sh` into an easy-to-run package script wrapper without modifying hooks, CI, data, compiled artifacts or Graphify (completed 2026-05-26)
- [x] **Phase 18: Docs/Help Current-State Cleanup** - Revisar e limpar a documentação e ajuda que descreve o estado atual do projeto (README.md) (completed 2026-05-26)
- [x] **Phase 19: Taxonomy v2.1 Curation Planning** - Planejamento de curadoria v2.1 com foco em alias cleanup e absent targets; planning_only / read_only_report_only, nenhuma curadoria executada (completed 2026-05-26)
- [x] **Phase 20: Alias Target Microcuration Execution** - Microcuradoria controlada Option 1 concluída: `petitgrain` adicionado ao seed v2 em `citrus/citrus_fresh`, traceability de aprovação resolvida, aliases preservados e artifacts oficiais não publicados (completed 2026-05-26)
- [x] **Phase 21: v2.1 Compiled Artifact Publication Planning** - Planejar validação em `/tmp` e publicação oficial gated dos artifacts compilados v2.1 em `data/compiled/v2` após a microcuradoria `petitgrain` (completed 2026-05-27)
- [x] **Phase 22: Review Queue Conflict Triage for v2.2** - Triage de 34 seed_corpus_conflict e definição de ações e prioridades para a curadoria da v2.2; planning_only / read_only_triage (completed 2026-05-27)
- [x] **Phase 23: v2.2 Microcuration Candidate Selection** - Microcuradoria controlada para adicionar `lemon_peel` como seed descriptor em `citrus/citrus_fresh`, validação de 7 invariantes e compilação oficial v2.2 (completed 2026-05-27)
- [x] **Phase 24: v2.3 Alias Candidate Planning** - Planejamento de alias candidate `cedar → cedarwood` para v2.3; planning_only / read_only_investigation; nenhuma mutação de dados autorizada (opened 2026-05-27)
- [x] **Phase 25: Cedar Alias Mutation Execution** - Mutation executada (completed 2026-05-27)
- [x] **Phase 26: Ambergri Alias Candidate** - Pivot planning (completed 2026-05-27)
- [x] **Phase 27: Ambergris Add Target Execution** - Executada (completed 2026-05-27)
- [x] **Phase 28: Ambergri Mutation** - Mutation executada (completed 2026-05-27)
- [x] **Phase 29: Clover / Clove Semantic Investigation** - Investigação concluída; clover ≠ clove, alias hypothesis rejected, disposition: defer. (completed 2026-05-27)
- [x] **Phase 30: Boi de Rose Manual Review Pack** - Investigação concluída; target ausente, disposition: add_target_needed. (completed 2026-05-27)

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

**Status**: complete; 4/4 plans executed.

Third curated expansion for `taxonomy-seed.v2.json`, using Phase 9 as the baseline. Phase 10 completed workbook approval, seed/alias curation, relation/accord approved-or-gap handling, and v1-v2 comparison validation. v2 remains candidate-only.

Hard boundaries:

- v2 remains candidate seed only; no promotion to default.
- `taxonomy-seed.v1.json` must not be edited.
- `data/compiled/v1/` must not be overwritten.
- Corpus/review_queue must not be promoted automatically.
- No aliases/relations/accords without approval/rationale/evidence in the workbook.
- No sidecar artifacts, compiled artifact changes or `DEFAULT_PATHS` changes were made. Seed/alias/relation/accord changes were limited to approved workbook entries.
- Plan 10-04 generated `curation/v1-v2-comparison.md`, recorded zero hard failures, verified curation tests and protected v1/default diffs, and confirmed no official `data/compiled/v2` artifact exists.

## Phase 11 Status Note: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning

**Status**: complete; documentation-only execution.

Phase 11 started from the approved post-Phase 10 baseline and concluded as documentation-only execution. It captured readiness/default migration decisions for a possible future `taxonomy-seed.v2.json` promotion, including readiness audit, soft finding policy, legacy alias exception policy, graph/review readiness, future migration proposal, rollback validation and release gates without executing the switch.

Hard boundaries:

- v2 remained candidate-only during Phase 11 execution.
- Executable plans were documentation-only and wrote only Phase 11 planning documents.
- No code, seed/data, compiled artifact, `DEFAULT_PATHS`, or official `data/compiled/v2` changes were authorized or performed.
- `taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json`, and `data/compiled/v1/` remain protected.
- Future promotion requires Phase 12 context, persisted human approval, readiness gates, migration mechanics, rollback validation, and an approved executable plan.

Post-Phase 10 baseline:

- Families: 3 -> 10.
- Subfamilies: 6 -> 18.
- Seed descriptors: 21 -> 39.
- Total compiled descriptors: 177 -> 303.
- Review queue: 427 -> 317.
- Input relations: 6 -> 14.
- Input accords: 5 -> 19.
- Compiled graph edges: 6 -> 13.
- Hard failures: none.
- v2 remains candidate-only.

Closing commit:

- `1f31b76 docs(phase-11): close validation for documentation-only execution`

## Phase 12 Status Note: Taxonomy Seed v2 Default Switch Execution

**Status**: complete; closed with v2 default active.

Phase 12 executed the controlled, reversible default switch from taxonomy seed v1 defaults to taxonomy seed v2 defaults after persisted final approval, explicit preflight gates and staged executable plans. The phase closed after rollback dry-run validation and release/tracking updates.

Phase 12 baseline from Phase 11:

- Phase 11 concluded readiness/migration planning only.
- Phase 12 promoted v2 to default after approval and gates.
- `DEFAULT_PATHS` now point to v2 seed, relation, accord, output and version values.
- `data/compiled/v1/` remains baseline/archive.
- Official `data/compiled/v2/` exists with exactly the three approved artifacts.
- `taxonomy-seed.v1.json`, `curated_relations.v1.json`, and `accord_map.v1.json` remain protected.
- v2 candidate has 10 families, 18 subfamilies, 39 seed descriptors, 303 total compiled descriptors, review_queue 317, input relations 14, input accords 19, compiled graph edges 13, isolated subfamilies 0, and no known hard failures in the last comparison report.

Final Phase 12 boundaries:

- Preserve protected v1 baseline files and v1 inputs.
- Keep `data/compiled/v2` as the official v2 artifact set.
- Do not claim Phase 11 accepted soft findings were resolved by the switch.
- Treat future curation or alias cleanup as separate work.

Phase 12 completed decisions `SWITCH-D-01` through `SWITCH-D-64` with Gate 0 through Gate 6 evidence.

## Phase 14 Status Note: Taxonomy v2.1 Backlog Triage & Curation Planning

**Status**: complete / closed; read-only/report-only execution.

Phase 14 completed read-only/report-only triage of the post-Phase 13 backlog and identified what should move to future executable v2.1 planning. It did not authorize or perform implementation, curation, descriptor promotion, alias cleanup, relation/accord edits, compiled artifact regeneration, Graphify mutation, docs/help fixes or safety automation implementation.

Completed report scope:

- Review queue reduction.
- Soft findings disposition / cleanup.
- Alias cleanup, including `ylang ylang -> ylang_ylang`.
- Graph density / graph coverage improvements.
- Future curation candidates / descriptor promotions.
- Relations/accords quality improvements.
- Docs/help cleanup that is non-blocking.
- Graphify / generated artifact lifecycle policy.
- CI/release process automation improvements.

Created artifacts:

- `14-BACKLOG-MATRIX.md`
- `14-REVIEW-QUEUE-TRIAGE.md`
- `14-DOCS-HELP-SHORTLIST.md`
- `14-SAFETY-AUTOMATION-SHORTLIST.md`
- `14-01-SUMMARY.md`
- `14-02-SUMMARY.md`
- `14-03-SUMMARY.md`
- `14-CLOSURE.md`

Not created:

- Alias manual-review pack was not created because it was not justified.
- Curation manual-review pack was not created because it was not justified.

Hard boundaries:

- Do not perform new taxonomy curation.
- Do not alter `data/taxonomy/taxonomy-seed.v2.json`.
- Do not alter `data/inference/curated_relations.v2.json`.
- Do not alter `data/inference/accord_map.v2.json`.
- Do not alter `data/taxonomy/descriptor_aliases.seed.json`.
- Do not alter `data/compiled/v1`.
- Do not alter `data/compiled/v2`.
- Do not alter `src/cli/parse_args.ts`.
- Treat `graphify-out/*` as protected unless a separate explicit plan authorizes graph regeneration or artifact mutation.
- Do not regenerate artifacts.
- Phase 15+ receives any real execution backlog under separate approval and validation gates.

## Phase 15 Status Note: Post-Triage Safety Guards & Current-State Docs Cleanup

**Status**: complete / closed; local_proof_only safety guard validation.

Phase 15 closed after non-mutating local proof-only validation of the immediate post-triage safety guard subset. It did not implement permanent automation, alter scripts/package scripts/hooks/CI, execute curation, apply docs/help fixes, run compile/smoke/typecheck/tests/build, mutate protected paths, remediate Graphify, or make a commit.

Completed proof scope:

- 15-01 protected diff guard PASS for `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, and `src/cli/parse_args.ts`.
- 15-01 Graphify guard REPORT_AND_FAIL accepted_with_policy for dirty `graphify-out/*` in the working tree.
- 15-02 Graphify staged guard PASS; no `graphify-out/*` staged.
- 15-02 protected paths staged guard PASS; no protected path staged.

Known policy state:

- Dirty `graphify-out/*` remains a known issue accepted_with_policy.
- Any Graphify cleanup, revert, regeneration, staging, commit or remediation requires separate explicit approval.
- Any permanent safety automation, docs/help cleanup, curation, compile/smoke validation, hook/CI or package-script change requires separate explicit approval.

## Phase 16 Status Note: Permanent Safety Guard Implementation

**Status**: context_gathering / not_ready_for_execution.

Phase 16 starts from the completed Phase 15 local proof-only guard validation. Its initial priority is a small permanent local safety guard implementation that preserves non-mutating behavior and protects the staging/commit boundary.

Initial implementation format selected during context capture:

- Local script only.

Initial guard scope:

- Check staged `graphify-out/*` and block any staged Graphify path.
- Check staged protected paths and block any staged path under `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, or `src/cli/parse_args.ts`.
- Check protected diff boundary for `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, and `src/cli/parse_args.ts`.
- Do not require `graphify-out/*` to be clean in the working tree.

Hard boundaries:

- Do not execute curation.
- Do not alter taxonomy seed, aliases, relations, accords, official artifacts, `DEFAULT_PATHS`, or `src/cli/parse_args.ts`.
- Do not clean, revert, regenerate, stage, unstage or commit `graphify-out/*`.
- Do not apply docs/help fixes in this phase.
- Do not run compile/smoke/typecheck/tests/build during context capture.
- Do not add package script wrappers, Git hooks or CI checks in the first front.

## Progress

**Execution Order:**
Completed phases executed in numeric order: 1 -> 2 -> ... -> 29 -> 30. v2 is the default and v1 remains preserved with rollback validated.

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
| 10. Taxonomy Seed v2 Expansion Round 3 | 4/4 | Complete   | 2026-05-24 |
| 11. Taxonomy Seed v2 Promotion Readiness & Default Migration Planning | 5/5 | Complete / documentation-only | 2026-05-24 |
| 12. Taxonomy Seed v2 Default Switch Execution | 5/5 | Complete / closed | 2026-05-25 |
| 13. Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption | 4/4 | Complete / closed | 2026-05-25 |
| 14. Taxonomy v2.1 Backlog Triage & Curation Planning | 3/3 | Complete / closed / read-only report-only | 2026-05-26 |
| 15. Post-Triage Safety Guards & Current-State Docs Cleanup | 2/2 | Complete / closed / local proof-only safety guard validation | 2026-05-26 |
| 16. Permanent Safety Guard Implementation | 1/1 | Complete / closed / local script only | 2026-05-26 |
| 17. Safety Guard Usability Wrapper | 1/1 | ✅ Complete / Closed | 2026-05-26 |
| 18. Docs/Help Current-State Cleanup | 1/1 | ✅ Complete / Closed | 2026-05-26 |
| 19. Taxonomy v2.1 Curation Planning | 1/1 | ✅ Complete / Closed / Planning only | 2026-05-26 |
| 20. Alias Target Microcuration Execution | 2/2 | ✅ Complete / Closed / Petitgrain add_target only | 2026-05-26 |
| 21. v2.1 Compiled Artifact Publication Planning | 1/1 | ✅ Complete / Closed | 2026-05-27 |
| 22. Review Queue Conflict Triage for v2.2 | 0/0 | ✅ Complete / Closed | 2026-05-27 |
| 23. v2.2 Microcuration Candidate Selection | 0/0 | ✅ Complete / Closed | 2026-05-27 |
| 24. v2.3 Alias Candidate Planning | 0/0 | ✅ Complete / Closed | 2026-05-27 |
| 25. Cedar Alias Mutation Execution | 0/0 | ✅ Complete / Closed | 2026-05-27 |
| 26. Ambergri Alias Candidate | 0/0 | ✅ Complete / Closed | 2026-05-27 |
| 27. Ambergris Add Target Execution | 0/0 | ✅ Complete / Closed | 2026-05-27 |
| 28. Ambergri Mutation | 0/0 | ✅ Complete / Closed | 2026-05-27 |
| 29. Clover Semantic Investigation | 1/1 | ✅ Complete / Closed | 2026-05-27 |
| 30. Boi de Rose Manual Review Pack | 1/1 | ✅ Complete / Closed / planning_only | 2026-05-27 |

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
**Status:** ✅ Complete; v2 remains candidate-only
**Plans:** 4/4 plans executed

Plans:

- [x] 10-01-PLAN.md — Workbook setup + approval checkpoint
- [x] 10-02-PLAN.md — Seed + targeted alias curation
- [x] 10-03-PLAN.md — Relations/accords approved-or-gap
- [x] 10-04-PLAN.md — Validation + comparison report

Execution result: Phase 10 completed with zero hard validation failures; v2 remains candidate-only and future default promotion requires a separate approved plan.

### Phase 11: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning

**Goal:** Evaluate whether the post-Phase 10 v2 candidate is ready for future promotion and plan a controlled default migration/rollback without executing it.
**Requirements**: PROMO-01, PROMO-02, PROMO-03, PROMO-04, PROMO-05, PROMO-06, PROMO-07, PROMO-08, PROMO-09, PROMO-10
**Depends on:** Phase 10
**Status:** ✅ Complete; documentation-only execution
**Plans:** 5/5 documentation-only plans complete

Initial context-gathering artifacts:

- [x] 11-DISCUSSION-LOG.md — Discussion log for readiness, migration and rollback decisions
- [x] 11-PREFLIGHT.md — Non-executable preflight boundary for Phase 11
- [x] 11-CONTEXT.md — Canonical context from PROMO-D-01 through PROMO-D-53
- [x] 11-RESEARCH.md — Planning research for readiness/migration-only scope
- [x] 11-PATTERNS.md — Pattern map for Phase 11 planning documents and protected-path checks
- [x] 11-VALIDATION.md — Nyquist validation contract for documentation-only execution

Plans:

- [x] 11-01-PLAN.md — Readiness audit (PROMO-01, PROMO-02)
- [x] 11-02-PLAN.md — Soft findings and legacy alias exception policy (PROMO-03, PROMO-04)
- [x] 11-03-PLAN.md — Graph and review queue readiness (PROMO-05, PROMO-06)
- [x] 11-04-PLAN.md — Migration/default-switch proposal documentation (PROMO-07, PROMO-08)
- [x] 11-05-PLAN.md — Rollback, validation, release gates and final approval policy (PROMO-09, PROMO-10)

Execution result: Phase 11 completed as documentation-only execution in commit `1f31b76`; no default switch, code/data/artifact mutation, official `data/compiled/v2`, or `DEFAULT_PATHS` change occurred.

### Phase 12: Taxonomy Seed v2 Default Switch Execution

**Goal:** Register and discuss a controlled, reversible execution phase for promoting taxonomy seed v2 to default, using Phase 11 as the required baseline.
**Requirements**: SWITCH-01, SWITCH-02, SWITCH-03, SWITCH-04, SWITCH-05, SWITCH-06, SWITCH-07, SWITCH-08, SWITCH-09, SWITCH-10, SWITCH-11
**Depends on:** Phase 11
**Status:** complete; closed with v2 default active
**Plans:** 5/5 plans complete

Initial context-gathering artifacts:

- [x] 12-DISCUSSION-LOG.md — Discussion log for default switch execution decisions
- [x] 12-PREFLIGHT.md — Non-executable preflight boundary for Phase 12
- [x] 12-CONTEXT.md — Canonical context from SWITCH-D-01 through SWITCH-D-64

Execution artifacts:

- [x] 12-FINAL-APPROVAL.md — Persisted human approval
- [x] 12-GATE-0-PREFLIGHT.md — Final approval and preflight
- [x] 12-GATE-1-PRE-SWITCH-REVALIDATION.md — Pre-switch revalidation
- [x] 12-GATE-2-V2-PUBLICATION.md — Official v2 artifact publication
- [x] 12-GATE-3-DEFAULT-PATHS-SWITCH.md — Atomic DEFAULT_PATHS switch
- [x] 12-GATE-4-POST-SWITCH-VALIDATION.md — Post-switch validation
- [x] 12-GATE-5-ROLLBACK-DRY-RUN.md — Rollback dry-run with `rollback_success: true`
- [x] 12-RELEASE-MIGRATION-NOTES.md — Release and migration notes
- [x] 12-GATE-6-FINAL-CLOSURE.md — Final closure

Plans:

- [x] 12-01-PLAN.md — Final approval and Gate 0 preflight
- [x] 12-02-PLAN.md — Gate 1 pre-switch revalidation
- [x] 12-03-PLAN.md — Gate 2 official v2 publication
- [x] 12-04-PLAN.md — Gate 3 default switch and Gate 4 post-switch validation
- [x] 12-05-PLAN.md — Gate 5 rollback dry-run and Gate 6 closure

### Phase 13: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption

**Goal:** Validate and stabilize the project after the Phase 12 promotion of taxonomy seed v2 to default, ensuring consumers, docs, CLI behavior, explicit v1 fallback, versioned artifacts and graphify artifact policy are coherent before any future curation or expansion work.
**Requirements**: POST-01, POST-02, POST-03, POST-04, POST-05, POST-06, POST-07, POST-08
**Depends on:** Phase 12
**Status:** complete / closed
**Plans:** 4 plans

Initial context-gathering artifacts:

- [x] 13-DISCUSSION-LOG.md — Discussion log for post-promotion stabilization scope
- [x] 13-CONTEXT.md — Initial canonical context and boundaries
- [x] 13-PREFLIGHT.md — Non-executable preflight boundary for Phase 13

Plans:

- [x] Plan 1: Verify consumers and default v2 smoke test
- [x] Plan 2: Verify explicit v1 fallback
- [x] Plan 3: Docs consistency and graphify artifact policy
- [x] Plan 4: Phase 14 backlog boundary and closure

### Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning

**Goal:** Gather context and decide which post-Phase 13 backlog areas should be prioritized for a future Taxonomy v2.1 evolution, without executing curation or altering taxonomy data/artifacts.
**Requirements**: TRIAGE-01, TRIAGE-02, TRIAGE-03, TRIAGE-04, TRIAGE-05, TRIAGE-06, TRIAGE-07, TRIAGE-08, TRIAGE-09
**Depends on:** Phase 13
**Status:** complete / closed / read-only report-only
**Plans:** 3/3 report-only plans complete

Initial context-gathering artifacts:

- [x] 14-DISCUSSION-LOG.md — Initial discussion log and scope queue for v2.1 backlog triage
- [x] 14-PREFLIGHT.md — Non-executable preflight boundary for Phase 14 context gathering
- [x] 14-CONTEXT.md — Canonical context from BACKLOG-D-01 through BACKLOG-D-225
- [x] 14-RESEARCH.md — Read-only planning research and baseline metrics
- [x] 14-PATTERNS.md — Report-only patterns and protected-path gates
- [x] 14-VALIDATION.md — Validation contract and closure status

Report-only execution artifacts:

- [x] 14-01-PLAN.md — Full-backlog matrix plan
- [x] 14-02-PLAN.md — Review queue triage plan
- [x] 14-03-PLAN.md — Optional pack/shortlist gate plan
- [x] 14-BACKLOG-MATRIX.md — Full backlog matrix
- [x] 14-REVIEW-QUEUE-TRIAGE.md — Dedicated review queue triage
- [x] 14-DOCS-HELP-SHORTLIST.md — Non-authorizing docs/help shortlist
- [x] 14-SAFETY-AUTOMATION-SHORTLIST.md — Non-authorizing safety automation shortlist
- [x] 14-01-SUMMARY.md — Plan 14-01 summary
- [x] 14-02-SUMMARY.md — Plan 14-02 summary
- [x] 14-03-SUMMARY.md — Plan 14-03 summary
- [x] 14-CLOSURE.md — Phase 14 closure

Not created because not justified:

- [x] Alias manual-review pack absent by design.
- [x] Curation manual-review pack absent by design.

### Phase 15: Post-Triage Safety Guards & Current-State Docs Cleanup

**Goal:** Transform a small, safe subset of Phase 14 outputs into controlled post-v2-default execution planning, prioritizing non-mutating operational safety guards before any docs/help cleanup or taxonomy curation work.
**Requirements**: SAFETY-01, SAFETY-02, SAFETY-03, DOCS-01
**Depends on:** Phase 14
**Status:** complete / closed / local proof-only safety guard validation
**Plans:** 2/2 plans complete

Phase artifacts:

- [x] 15-DISCUSSION-LOG.md — Initial priority decision and scope boundary
- [x] 15-PREFLIGHT.md — Non-executable preflight boundary for Phase 15 context gathering
- [x] 15-CONTEXT.md — Canonical context for post-triage safety guard prioritization
- [x] 15-VALIDATION.md — Validation contract and final local proof-only closure state
- [x] 15-CLOSURE.md — Phase 15 final closure

Plans:
- [x] 15-01-PLAN.md — Protected diff and Graphify report_and_fail local proof
- [x] 15-02-PLAN.md — Graphify staged and protected paths staged local proof

Execution summaries:

- [x] 15-01-SUMMARY.md — Protected diff PASS; Graphify REPORT_AND_FAIL accepted_with_policy
- [x] 15-02-SUMMARY.md — Graphify staged PASS; protected paths staged PASS

### Phase 16: Permanent Safety Guard Implementation

**Goal:** Transform Phase 15 safety guard proof results into a small permanent non-mutating local guard implementation that protects staged Graphify and protected-path boundaries before any package wrapper, hook or CI integration.
**Requirements**: GUARD16-01, GUARD16-02, GUARD16-03, GUARD16-04
**Depends on:** Phase 15
**Status:** complete / closed / local script only
**Plans:** 1/1 plans complete

Phase artifacts:

- [x] 16-DISCUSSION-LOG.md — Initial implementation-format decision
- [x] 16-PREFLIGHT.md — Non-executable preflight boundary for context capture
- [x] 16-CONTEXT.md — Canonical context for local script-only safety guard implementation
- [x] 16-RESEARCH.md — Guard design research
- [x] 16-PATTERNS.md — Pattern map for Phase 16
- [x] 16-VALIDATION.md — Nyquist validation contract; status: complete
- [x] 16-CLOSURE.md — Phase 16 final closure

Plans:
- [x] 16-01-PLAN.md — Implement local non-mutating safety guard script with validation proof

Execution summaries:
- [x] 16-01-SUMMARY.md — Real repo PASS proof; /tmp failure simulations SIM 1–4 + BONUS all passed

## Phase 16 Status Note: Permanent Safety Guard Implementation

**Status**: complete / closed; local_script_only.

Phase 16 delivered `scripts/check-safety-guards.sh`, a permanent non-mutating bash script that
blocks staged `graphify-out/*` and staged/dirty protected-path changes at the staging boundary.
The script was implemented without altering any package scripts, Git hooks, CI, `src/package.json`,
protected data/seed/compiled paths, or `graphify-out/*` content.

Completed proof scope:

- Real-repo PASS for both `./scripts/check-safety-guards.sh` and `bash scripts/check-safety-guards.sh`.
- Non-mutation proof: `git status --short` before/after runs was identical.
- /tmp simulations: GRAPHIFY_STAGED, PROTECTED_PATH_STAGED, PROTECTED_DIFF, report_all multi-violation, dirty-working-tree-allowed BONUS.

Known policy state carried forward:

- Dirty `graphify-out/*` in working tree remains `accepted_with_policy`; not blocked by guard.
- No Graphify cleanup, revert, regeneration, staging, commit or remediation was performed.
- Any future package-script wrapper, hook, CI integration, or graphify remediation requires a new phase and separate explicit approval.

---

### Phase 17: Safety Guard Usability Wrapper

**Goal:** Transform the script `scripts/check-safety-guards.sh` into an easy-to-run package script wrapper without modifying hooks, CI, data, compiled artifacts or Graphify.
**Requirements**: WRAPPER17-01, WRAPPER17-02
**Depends on:** Phase 16
**Status:** ✅ Complete / Closed
**Plans:** 1 plan complete

Phase artifacts:

- [x] 17-DISCUSSION-LOG.md — Priority decision and scope boundary
- [x] 17-PREFLIGHT.md — Non-executable preflight boundary for context capture
- [x] 17-CONTEXT.md — Canonical context for safety guard usability wrapper
- [x] 17-01-PLAN.md — Usability Wrapper plan
- [x] 17-01-SUMMARY.md — Usability Wrapper execution summary
- [x] 17-VALIDATION.md — Usability Wrapper Nyquist validation contract
- [x] 17-CLOSURE.md — Phase 17 closure report

Plans:

- [x] 17-01: Usability Wrapper Implementation

### Phase 18: Phase 18 — Docs/Help Current-State Cleanup

**Goal**: Revisar e corrigir a documentação e ajuda que descreve o estado atual do projeto (README.md), integrando informações sobre v1.0.0, v2 default, o safety guard local e seu wrapper npm.
**Depends on**: Phase 17
**Requirements**: DOCS18-01, DOCS18-02, DOCS18-03
**Status**: ✅ Complete / Closed
**Plans**: 1 plan complete

Plans:

- [x] 18-01: Current-state docs/help audit and cleanup

### Phase 19: Taxonomy v2.1 Curation Planning

**Goal:** Planejamento de curadoria v2.1 com foco em alias cleanup e absent targets, produzindo documentos de análise e plano de execução sem executar curadoria ou mutação de dados.
**Requirements**: CUR21-01, CUR21-02
**Depends on:** Phase 18
**Status:** ✅ Complete / Closed / Planning only / Read-only report-only
**Plans:** 1/1 plan (planning_only — no executable curation performed)

Phase artifacts:

- [x] 19-PREFLIGHT.md — Non-executable preflight boundary
- [x] 19-CONTEXT.md — Canonical context and scope decisions
- [x] 19-DISCUSSION-LOG.md — Discussion log for curation planning
- [x] 19-RESEARCH.md — Alias analysis research and baseline data
- [x] 19-PATTERNS.md — Pattern map for alias cleanup planning
- [x] 19-VALIDATION.md — Nyquist validation contract
- [x] 19-CLOSURE.md — Phase 19 closure

Plans:

- [x] 19-01-PLAN.md — Alias cleanup and absent target curation plan (deferred to Phase 20+)

Analysis results:

- 11 aliases analisados
- 2 absent targets confirmados: ylang ylang → ylang_ylang, petit grain → petitgrain
- Disposition recomendada: accepted_exception interino (ylang ylang), forte candidato add_target futuro (petit grain)
- Execução real diferida para Phase 20+ com allowlist, approval persistido, rollback e validação

## Phase 19 Status Note: Taxonomy v2.1 Curation Planning

**Status**: complete / closed; planning_only / read_only_report_only.

Phase 19 completed curation planning for the v2.1 alias cleanup / absent targets priority. No curation, compilation, code change, data mutation, artifact refresh or Graphify update was performed.

Mutation audit:

- `descriptor_aliases.seed.json`: zero changes.
- `taxonomy-seed.v2.json`: zero changes.
- `data/compiled/v1/`: zero changes.
- `data/compiled/v2/`: zero changes.
- `data/inference/`: zero changes.
- `graphify-out/*`: zero changes.

Findings:

- 11 aliases analisados no `descriptor_aliases.seed.json`.
- 2 absent targets confirmados: `ylang ylang` → `ylang_ylang` e `petit grain` → `petitgrain`.
- Disposition recomendada: `ylang ylang` → `ylang_ylang` como accepted_exception interino (candidato a add_target futuro); `petit grain` → `petitgrain` como forte candidato a add_target futuro.
- Execução real deve ir para Phase 20 ou fase posterior, com allowlist, approval persistido, rollback e validação.

### Phase 20: Alias Target Microcuration Execution

**Goal:** Executar uma microcuradoria controlada baseada na Phase 19 para adicionar `petitgrain` como descriptor curado no seed v2 em `citrus` / `citrus_fresh`, preservando `ylang ylang -> ylang_ylang` como `accepted_exception` interino.
**Requirements:** CUR20-01, CUR20-02, CUR20-03, CUR20-04, CUR20-05, CUR20-06, CUR20-07
**Depends on:** Phase 19
**Status:** ✅ Complete / Closed / Petitgrain add_target only
**Plans:** 2/2 plans complete

Phase artifacts:

- [x] 20-PREFLIGHT.md — Non-executable preflight boundary for Phase 20 planning
- [x] 20-CONTEXT.md — Canonical context for petitgrain add_target-only planning
- [x] 20-DISCUSSION-LOG.md — Discussion log for approved planning scope
- [x] 20-RESEARCH.md — Option 1 microcuration research and validation architecture
- [x] 20-PATTERNS.md — Pattern map for approval, seed-only mutation, rollback and validation
- [x] 20-VALIDATION.md — Nyquist validation record and final results
- [x] 20-FINAL-APPROVAL.md — Persisted approval for `petitgrain` add_target only
- [x] 20-CLOSURE.md — Phase 20 closure

Plans:

- [x] 20-01-PLAN.md — Petitgrain add_target-only execution gate plan
- [x] 20-02-PLAN.md — Modern approval traceability fix

Execution summaries:

- [x] 20-01-SUMMARY.md — `petitgrain` add_target applied, rollback exercised, aliases preserved
- [x] 20-02-SUMMARY.md — Approval traceability resolved and targeted tests passed

Execution results:

- Added `petitgrain` as a curated seed v2 descriptor.
- Target family: `citrus`.
- Target subfamily: `citrus_fresh`.
- Kept `descriptor_aliases.seed.json` unchanged.
- Kept `ylang ylang -> ylang_ylang` as `accepted_exception_interim`.
- Resolved approval traceability by teaching `taxonomy_seed_v2.test.ts` to recognize `20-FINAL-APPROVAL.md`.
- Targeted tests passed: 6 files / 26 tests.
- Final safety guard returns expected `PROTECTED_DIFF` for `taxonomy-seed.v2.json` because the protected seed mutation was approved.

Hard boundaries:

- No new curation beyond the approved `petitgrain` add_target.
- Do not alter `data/taxonomy/descriptor_aliases.seed.json`; it was preserved unchanged.
- Do not add `ylang_ylang`; it remains `accepted_exception_interim`.
- Do not alter or publish `data/compiled/v1` or `data/compiled/v2`; both remained unchanged.
- Do not alter `data/inference`; it remained unchanged.
- Do not alter `src/cli/parse_args.ts`, `scripts/check-safety-guards.sh`, or `src/package.json`.
- Keep `graphify-out/*` outside Phase 20 scope and outside commit scope.
- Do not execute official compile, artifact refresh, Graphify, or additional curation as part of closure.

### Phase 21: v2.1 Compiled Artifact Publication Planning

**Goal:** Planejar a publicação segura dos artifacts compilados v2.1 após a microcuradoria `petitgrain`, validando primeiro um compile explícito em `/tmp` e permitindo publicação oficial em `data/compiled/v2` somente após gates e aprovação persistida.
**Requirements:** PUB21-01, PUB21-02, PUB21-03, PUB21-04, PUB21-05, PUB21-06
**Depends on:** Phase 20
**Status:** ✅ Complete / Closed
**Plans:** 2 plans executed

Phase artifacts:

- [x] 21-CONTEXT.md — Canonical context for tmp-first v2.1 artifact publication planning
- [x] 21-DISCUSSION-LOG.md — Discussion log for the initial publication decision
- [x] 21-TMP-COMPILE-VALIDATION.md — Plan 21-01 output
- [x] 21-FINAL-APPROVAL.md — Plan 21-02 gate
- [x] 21-CLOSURE.md — Phase 21 closure report

Plans:

- [x] 21-01-PLAN.md — Tmp compile validation
- [x] 21-02-PLAN.md — Official `data/compiled/v2` publication gated on Plan 21-01 PASS

### Phase 22: Review Queue Conflict Triage for v2.2

**Goal:** Triagem dos 34 conflitos seed_corpus do review queue, classificação semântica e determinação de prioridades para a curadoria v2.2.
**Depends on:** Phase 21
**Status:** ✅ Complete / Closed / planning_only / read_only_triage
**Plans:** 1 plan executed

Phase artifacts:
- [x] 22-PREFLIGHT.md — Non-executable preflight boundary
- [x] 22-CONTEXT.md — Canonical context and phase boundary
- [x] 22-DISCUSSION-LOG.md — Discussion log for conflict triage scope
- [x] 22-RESEARCH.md — Full conflict inventory and semantic analysis
- [x] 22-PATTERNS.md — Classification schema and decision patterns
- [x] 22-01-PLAN.md — Seed corpus conflict decision matrix
- [x] 22-VALIDATION.md — Validation contract with totals reconciliation
- [x] 22-CLOSURE.md — Phase 22 closure report

Plans:
- [x] 22-01-PLAN.md — Seed corpus conflict decision matrix

### Phase 23: v2.2 Microcuration Candidate Selection

**Goal:** Executar a microcuradoria controlada de `lemon_peel` como `add_target` em `citrus/citrus_fresh` com base nas decisões da Phase 22 e no precedente da Phase 20, validando os 7 invariantes definidos.
**Depends on:** Phase 22
**Status:** ✅ Complete / Closed
**Plans:** 1 plan executed

Phase artifacts:
- [x] 23-PREFLIGHT.md — Non-executable preflight boundary
- [x] 23-CONTEXT.md — Canonical context and phase boundary
- [x] 23-DISCUSSION-LOG.md — Discussion log for approved planning scope
- [x] 23-RESEARCH.md — Option 1 microcuration research and validation architecture
- [x] 23-PATTERNS.md — Pattern map for approval, seed-only mutation, rollback and validation
- [x] 23-VALIDATION.md — Validation record and final results
- [x] 23-01-PLAN.md — execution plan with allowlist, waves, persisted approval gate
- [x] 23-CLOSURE.md — Phase 23 closure report

Plans:
- [x] 23-01-PLAN.md — `lemon_peel add_target` execution plan

### Phase 24: v2.3 Alias Candidate Planning

**Goal:** Investigar `cedar → cedarwood` como alias candidate para v2.3: prova de equivalência semântica, design de invariantes de validação e plano formal de alias mutation — sem executar nenhuma mutação de dados, compile ou publicação de artefatos.
**Depends on:** Phase 23
**Status:** ✅ Complete / Closed / planning_only
**Plans:** 1 plan executed

Phase artifacts:
- [x] 24-PREFLIGHT.md — Non-executable preflight boundary
- [x] 24-CONTEXT.md — Canonical context and phase boundary
- [x] 24-DISCUSSION-LOG.md — Discussion log for alias candidate scope
- [x] 24-RESEARCH.md — Semantic evidence research for `cedar`
- [x] 24-PATTERNS.md — Alias mutation patterns and invariant design
- [x] 24-VALIDATION.md — Validation contract for future execution phase
- [x] 24-01-PLAN.md — Formal alias candidate planning document
- [x] 24-CLOSURE.md — Phase 24 closure report

Plans:
- [x] 24-01-PLAN.md — `cedar → cedarwood` alias candidate investigation plan

### Phase 25: Cedar Alias Mutation Execution

**Goal:** Implementar a mutação em `descriptor_aliases.seed.json` para `cedar → cedarwood`, validando primeiro em `/tmp` antes de ser publicada oficialmente como V2.3.
**Depends on:** Phase 24
**Status:** ✅ Complete / Closed
**Plans:** 1 plan executed

### Phase 26: Ambergri Alias Candidate

**Goal:** Investigar e planejar a viabilidade do alias candidate `ambergri → ambergris`.
**Depends on:** Phase 25
**Status:** ✅ Complete / Closed / pivot_planning_complete
**Plans:** 1 plan executed

Phase artifacts:
- [x] 26-PREFLIGHT.md — Non-executable preflight boundary
- [x] 26-CONTEXT.md — Canonical context and phase boundary
- [x] 26-DISCUSSION-LOG.md — Discussion log
- [x] 26-RESEARCH.md — Semantic evidence research
- [x] 26-PATTERNS.md — Alias mutation patterns
- [x] 26-VALIDATION.md — Validation contract
- [x] 26-01-PLAN.md — Pivot plan
- [x] 26-CLOSURE.md — Phase 26 closure report

Plans:
- [x] 26-01-PLAN.md — Pivot plan confirming target absence

Pivot results:
- Alias direto `ambergri → ambergris` está bloqueado (target ausente).
- Estratégia aprovada: `add_target ambergris` primeiro.
- Classificação aprovada: `family = amber_resinous`, `subfamily = amber`.
- Mutação deferida para Phase 27+.
