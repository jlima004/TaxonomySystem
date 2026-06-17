# Olfactory Taxonomy System

## What This Is

Sistema computacional de taxonomia olfativa para uma plataforma de inteligência de fragrâncias baseada em IA. Constrói uma hierarquia semântica (families → subfamilies → descriptors) a partir de um corpus de materiais enriquecidos com dados moleculares PubChem, gerando artefatos JSON compilados e versionados que alimentam engines de similaridade, geração de acordes, busca semântica e sistemas de recomendação.

## Core Value

Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Engine de volatilidade/tenacidade com scores normalizados [0,1] — existing (`engine_calcula_tenacidade_volatilidade/`)
- ✓ Dataset de materiais enriquecido com propriedades PubChem (CID, SMILES, molecular weight, XLogP, TPSA, rotatable bonds) — existing (`data/enriched_materials.json`)
- ✓ Arquitetura funcional pura, zero-dependency, TypeScript strict — existing (padrão estabelecido)
- ✓ Pipeline de normalização de descriptors (lowercase, sem pontuação, sem duplicatas, agrupamento semântico) — validated in Phase 3 (`src/normalizer/`)
- ✓ Inferência de similaridade multi-dimensional (semântica + compatibilidade de acordes + tradição perfumística + aliases fracos) — validated in Phase 5 (`src/inference/`)
- ✓ Taxonomy Builder CLI que processa corpus + seed manual e gera artefatos compilados — validated in Phase 6 (`src/cli/`, `src/compiler/`)
- ✓ `taxonomy.json`, `descriptor_aliases.json` e `similarity_matrix.json` compilados, versionados e schema-validos — validated in Phase 6 (`data/compiled/v1/`)
- ✓ Schema validation all-or-nothing dos artefatos de saída — validated in Phase 6 (`src/compiler/validate_output.ts`)
- ✓ Pipeline hardening for descriptor sanitation, alias-aware analysis, conservative candidate placement, deterministic review queue and compile quality gates — validated in Phase 7
- ✓ Microcuration of Group B conflicts and v2.6 artifact stabilization — validated in v2.6
- ✓ Low_support candidate triage (275 inventoried, 30 selected) — v2.7
- ✓ Decision matrix production (6 promote_to_seed, 24 defer/reject) — v2.7
- ✓ CUR-02 guardrail-enforced seed mutation — v2.7
- ✓ v2.7 compiled artifact publication (324 descriptors, 269 review items) — v2.7
- ✓ Closure report with dynamic metrics from compiled JSON artifacts — v2.7
- ✓ INV-01, INV-02 (low-support inventory) — v2.8
- ✓ SEL-01, SEL-02 (Batch 2 selection) — v2.8
- ✓ DEC-01, DEC-02, DEC-03 (Batch 2 decision matrix) — v2.8
- ✓ CUR-01, CUR-02, CUR-03 (controlled mutation) — v2.8
- ✓ PUB-01, PUB-02, PUB-03 (artifact publication) — v2.8
- ✓ v2.8.0 compiled artifacts published (61 seed descriptors, 340 compiled, 256 review items, 18 aliases, 13 graph edges) — v2.8
- ✓ Closure report with published-JSON metrics — v2.8
- ✓ HYG-01, HYG-02, HYG-03 (alias target integrity gate, empty exception mechanism, and `ylang ylang → ylang_ylang` remediation) — v2.9
- ✓ v2.9.0 compiled artifacts published (341 compiled descriptors, 18 valid alias targets, 0 unresolved alias targets) — v2.9
- ✓ VER-01, VER-02 (retroactive Phase 50 verification closure with `50-VERIFICATION.md` and metadata trace) — v2.10
- ✓ GATE-01, GATE-02, GATE-03 (`verify:integrity` and `compile:quality` local guardrails; normal compile stays alias-gate-free) — v2.10
- ✓ TEST-01, TEST-02 (inventory tests reuse `validateAliasTargetIntegrity` directly; 390/390 suite green) — v2.10
- ✓ CI-01, CI-02, CI-03, CI-04 (GitHub Actions CI for install, typecheck, tests, and alias integrity proofs) — v2.10
- ✓ BOUND-01, BOUND-02, BOUND-03 (no seed/compiled mutation; no deferred-scope work opened) — v2.10
- ✓ GKG-01 (minimal olfactory knowledge graph schema/read-model contract from existing compiled artifacts only) — validated in Phase 55 (`src/graph_read_model/contract.ts`, `docs/olfactory_graph_contract.md`)
- ✓ GBLD-01 through GBLD-05 (pure in-memory `buildOlfactoryGraph` with deterministic ordering, contract IDs, and inline fixture coverage) — validated in Phase 56 (`src/graph_read_model/build_graph.ts`)
- ✓ GVAL-01, GVAL-02 (structured `validateOlfactoryGraph` plus live v2 baseline regression `10/18/341/18/13`) — validated in Phase 56 (`src/graph_read_model/validate_graph.ts`)
- ✓ GQRY-01 through GQRY-05 (typed in-memory query proofs for hierarchy, alias resolution, related descriptors, similarity neighborhoods, bridges, hubs, and agent/RAG-ready static envelopes) — validated in Phase 57 (`src/graph_read_model/query_graph.ts`)
- ✓ GVAL-03, GVAL-04, GVAL-05 (deterministic graph read-model CLI with atomic write, SHA-256 boundary mutation audit, Graphify isolation guard, and automatic GVAL-05 local guardrails: typecheck, tests, and integrity proofs) — validated in Phase 58 (`src/cli/graph_read_model.ts`)
- ✓ GKG-02 (deterministic read-only graph export via `graph:build` CLI to `data/read-models/olfactory-graph/v2.11/` without mutating seeds or compiled artifacts) — v2.11
- ✓ GKG-05 (future Neo4J mapping note in maintainer docs; milestone remained database-free and zero-heavy-dependency) — v2.11
- ✓ GDOC-01, GDOC-02, GDOC-03 (Portuguese maintainer guide, conceptual Neo4J mapping, derived-read-model disclaimer) — validated in Phase 59 (`docs/olfactory_graph_read_model.md`, `.planning/milestones/v2.11-CLOSURE.md`)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Harden graph read-model consumer safety for validated query-proof consumption
- [ ] Centralize graph contract constants and validation expectations to reduce drift risk
- [ ] Prove the sanctioned graph write path, boundary audit, and guardrail flow with automated sandboxed coverage
- [ ] Lock and document the stable agent-facing proof envelope contract for future Alquem.io agent/RAG consumers

## Current Milestone: v2.12 Graph Read Model Hardening & Agent Consumption Prep

**Goal:** Make the v2.11 graph read model harder to misuse, safer to consume, and better proven as a trusted substrate for future agent/RAG layers without expanding into runtime, database, or publication scope.

**Target features:**
- Fail-closed validation and misuse-resistant query consumption guardrails
- Contract constants as the single practical source of truth for IDs, invariant codes, and validation expectations
- Automated sandbox proof for sanctioned write path, boundary audit, Graphify isolation, and guardrail execution
- Stable agent-facing query-proof envelope contract with clear safe-exposure boundaries

## Current State

**Shipped:** v2.11 Olfactory Knowledge Graph Read Model — June 12, 2026

**Current:** Milestone v2.12 Graph Read Model Hardening & Agent Consumption Prep — Phase 61 complete (June 17, 2026).

**Phase 61 result:**
- Fail-closed query consumption boundary in `query_consumer.ts` with branded `ValidatedGraph` handle via `asValidatedGraph` and eight-method `ValidatedQueryConsumer`.
- Invalid or unvalidated graphs rejected before proof generation; validation errors preserved; handle misuse returns deterministic `graph_not_validated`.
- Proof envelope compatibility, missing-target semantics, live v2 baseline consumer regression, and source scope fences locked by tests.

**v2.11 result:**
- Static olfactory knowledge graph read model at `data/read-models/olfactory-graph/v2.11/` derived from protected compiled v2 artifacts only (10/18/341/18/13 baseline).
- Contract-first modules: `src/graph_read_model/` (contract, builder, validator, query proofs, writer, boundary audit) plus `graph:build` CLI with GVAL-05 guardrails.
- Eight fs-free query proof functions with live aggregate regression (floral_rose hub, five cross-family bridges).
- Portuguese maintainer guide (`docs/olfactory_graph_read_model.md`) with query examples, Neo4J mapping note, and derived-artifact disclaimer.
- Protected boundaries preserved: no seed/compiled/Graphify mutations; SHA-256 boundary audit on write path.
- All 22 milestone requirements satisfied; milestone audit status `tech_debt` with 7 accepted non-blocking items.

<details>
<summary>Previous milestone state (v2.11 in progress, archived)</summary>

**Shipped through Phase 58:** June 10, 2026

**Phase 58 result:**
- Implemented `graph:build` CLI orchestrating load, build, validate, write, boundary audit, and four sequential guardrails.
- Added `"graph:build"` NPM script to `package.json` and integration tests covering parameter combinations and output shapes.
- Graph writer validates paths against policy and contains graphify-out block. Boundary audit verifies protected sources and compiled artifacts using SHA-256 digests.

**Phase 57 result:**
- Implemented eight fs-free query functions in `query_graph.ts` with typed `GraphQueryProof` envelopes covering hierarchy, alias, related-descriptor, and similarity proofs.
- Added hybrid test coverage: 17 inline snapshot/determinism tests plus live aggregate regression over the full v2 catalog.

**Phase 56 result:**
- Implemented pure `buildOlfactoryGraph` and `validateOlfactoryGraph` modules with contract-aligned types, deterministic ordering, structured invariant errors, and 22 Vitest tests including live v2 baseline regression.

**Phase 55 result:**
- Locked `olfactory_graph_read_model.v1` plus exact node kinds, edge kinds, ID prefixes, required properties, boundary rules, and Phase 56 invariants in a static contract module.

</details>

<details>
<summary>Previous milestone state (v2.10, archived)</summary>

- Closed Phase 50 verification debt with retroactive `50-VERIFICATION.md` and `50-METADATA-TRACE.md` (HYG-02/HYG-03 formally auditable).
- Wired `verify:integrity` and `compile:quality` as local guardrails; normal `compile` remains alias-gate-free.
- Added GitHub Actions CI (Node 24) for `npm ci`, typecheck, tests, and `alias:integrity`/`verify:integrity` JSON proofs.
- Protected baseline preserved: 341 compiled descriptors, 18 valid alias targets, 0 unresolved targets; no taxonomy seed or compiled artifact changes.

</details>

<details>
<summary>Previous milestone state (v2.9, archived)</summary>

**Shipped:** v2.9 Alias Target Integrity & Descriptor Hygiene — June 6, 2026

- Resolved the `descriptor_aliases` target integrity gap (FUT-03) by adding curated seed descriptor `ylang_ylang` under `floral/floral_white` while preserving the legacy alias map.
- Published official `data/compiled/v2` artifacts with explicit `--version 2.9.0`; `DEFAULT_PATHS.version` remains `2.1.0`.
- Automated `alias:integrity` gate now passes with 341 compiled descriptors, 18 valid alias targets, and 0 unresolved targets.

</details>

## Next Milestone Goals

- Eliminate or reduce accepted v2.11 tech debt around contract drift, hardcoded prefixes/invariant codes, CLI write-path coverage, Graphify isolation proof, and documentation ordering
- Enforce validation-before-query and deterministic fail-closed behavior for graph proof consumers
- Define the existing query proof envelope as the only stable agent-facing contract for future Alquem.io agent/RAG consumption
- Preserve scope boundaries: no runtime agent execution, SaaS/API surface, Neo4J, Docker, database/export work, new graph domains, or taxonomy publication

### Known v1 Semantic Limitations

<!-- Post-Phase 7 findings. These do not invalidate the technical Phase 7 completion. -->

- Generated artifacts in `data/compiled/v1/` are deterministic, schema-valid and CLI-compilable, but they are not yet a final curated fragrance taxonomy.
- Current v1 seed has 3 families, 6 subfamilies and 21 seed descriptors; the v2 default has 10 families, 18 subfamilies and 39 seed descriptors.
- `taxonomy.json` v1 has 177 descriptors; v2 default has 303 descriptors.
- Corpus candidates remain review-required evidence and are not curated truth.
- `similarity_matrix.json` v1 has 6 edges; v2 default has 13 edges with all 18 subfamilies connected.
- `similarity_matrix.json.review_queue` has 317 items in v2 default (down from 427 in v1), mostly `corpus_candidate_low_support`.
- Remaining zero-frequency seed descriptors are `bitter_orange`, `sweet_orange`, and `tree_moss` (inherited from v1, no new zero-frequency seeds added in Round 3).
- Phase 12 executed the controlled and reversible default switch; v2 is now the CLI/compiler default. v1 remains preserved as baseline/archive with rollback validated.

### Resolved v2.8 Follow-ups

- `descriptor_aliases.seed.json` and the published `data/compiled/v2/descriptor_aliases.json`
  previously carried a dangling alias target: `"ylang ylang" -> "ylang_ylang"`.
  Phase 51 resolved FUT-03 by adding `ylang_ylang` as a curated seed target under
  `floral/floral_white` and publishing v2.9.0 artifacts with 0 unresolved alias targets.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- FUT-01: 243 remaining `corpus_candidate_low_support` items — deferred to future milestone; v2.10 is integrity hardening only
- FUT-02: 13 remaining `seed_corpus_conflict` items — deferred to future milestone; v2.10 is integrity hardening only
- New low-support promotions or Batch 3 opening — v2.10 does not perform curation triage
- Changes to `data/taxonomy/taxonomy-seed.v2.json` — forbidden by milestone scope
- New publication or mutation of `data/compiled/v2/*` artifacts — forbidden by milestone scope
- Graphify, scoring, UI, MVP or Knowledge Engine work — reserved for future milestones
- Neo4J, Docker, external databases or heavy graph dependencies — v2.11 starts from a static read model/export, not a graph database
- Mutating `data/taxonomy/descriptor_aliases.seed.json` or `data/taxonomy/alias_target_exceptions.v1.json` — forbidden by v2.11 scope
- Touching `graphify-out/**` or existing Graphify outputs — v2.11 graph read model is separate from Graphify
- Resolving `corpus_candidate_low_support`, `seed_corpus_conflict` or other curation queues — deferred scope remains deferred
- Normal compile path changes that make everyday compile heavier — prefer `compile:quality`, `safety:guard` or CI wiring
- v2.9 compiled artifact publication — only with explicit mutation/publication decision
- Curating all 259 remaining low_support items in one milestone — scoping bounds
- Automatic promotion based only on frequency — curation requires explicit decisions
- Reopening the 10 remaining seed_corpus_conflict items — focus is strictly low_support triage unless explicitly planned later
- Reconsidering candidates already explicitly decided in v2.7 — only allowed if they reappear unresolved as low_support in the current compiled v2.7 review_queue
- MVP, SaaS, Knowledge Engine, UI, Graphify or scoring redesign — reserved for future milestones
- Scores físico-químicos na taxonomia — vivem na Layer 3 (Derived Features), não na Layer 1 (semântica pura)
- Runtime APIs — Milestone v1 é "Builder first", APIs vêm depois
- Similarity Engine combinado (semantic + molecular + behavior) — futuro Layer 4 (Intelligence)
- Produto final (API SaaS, AI perfumer) — futuro Layer 5
- Modelagem química — engine existente já cobre propriedades moleculares
- Hierarquias excessivamente profundas — v1 prioriza clareza e utilidade computacional
- Completude acadêmica — foco pragmático operacional

## Context

### Arquitetura em 5 Camadas

```
Layer 1 — TAXONOMY (semântica pura)              ← ESTE PROJETO
Layer 2 — Molecular/Physchem (xlogp, tpsa, mw)   ← engine existente
Layer 3 — Derived Features (volatility, tenacity)  ← engine existente
Layer 4 — Intelligence (similarity, accord, rec)   ← futuro
Layer 5 — Product (API, SaaS, AI perfumer)         ← futuro
```

### Codebase Existente

- **Engine de volatilidade/tenacidade** em `engine_calcula_tenacidade_volatilidade/` — pacote npm independente, TypeScript strict, Vitest, 22 testes, arquitetura funcional pura
- **Dataset PubChem enriquecido** em `data/enriched_materials.json` (~70MB, gitignored) — pipeline offline TGSC & Scents & Flavors, 67.1% enrichment coverage
- **`src/`** — Taxonomy Builder TypeScript package with loaders, normalizer, analysis, inference, compiler, CLI, and Vitest coverage
- **`src/graph_read_model/`** — v2.11 static graph read model (contract, builder, validator, query proofs, writer, boundary audit)
- **v2.11 read model:** `data/read-models/olfactory-graph/v2.11/` — derived graph artifacts (not official compiled publication)
- **v2.9 artifacts:** `data/compiled/v2/` — 341 compiled descriptors, 18 valid alias targets, 0 unresolved targets (version 2.9.0)
- **CI:** `.github/workflows/ci.yml` — Node 24; install, typecheck, test, alias integrity proofs (390/390 tests under CI=true)
- **Local guardrails:** `verify:integrity`, `compile:quality` npm scripts in `src/package.json`
- Documentação do engine em português em `docs/`

### Abordagem Híbrida da Taxonomia

A taxonomia combina dois eixos:
1. **Estrutura manual** — families, subfamilies e canonical descriptors definidos por expertise perfumística
2. **Refinamento estatístico** — frequência, aliases, clusters e inferências derivadas do corpus de materiais

### Architecture Notes: Normalization, Sanitation And Curation

These notes describe current architecture boundaries and Phase 8 discussion boundaries.

- The current normalizer transforms input strings into canonical descriptor IDs.
- Sanitization decides whether a normalized string is a valid olfactive descriptor or technical/textual noise before statistics.
- Analysis receives descriptors that are sanitized and canonicalized through curated aliases where applicable.
- Inference consumes explicit noise and placement evidence instead of inferring curation quality from raw descriptor strings alone.
- The compiler should remain deterministic artifact materialization and must not become the curation layer.

### Entradas do Builder

- `enriched_materials.json` — corpus semântico (propriedades olfativas dos materiais, odor descriptions, usage categories)
- Manual taxonomy seed — definição manual da hierarquia base (families/subfamilies/descriptors canônicos)

### Saídas do Builder (JSONs compilados versionados)

- `taxonomy.json` — family → subfamily → descriptors
- `descriptor_aliases.json` — mapa de normalização
- `similarity_matrix.json` — sparse graph (adjacency list, threshold >0.25)

## Constraints

- **Stack**: Node.js + TypeScript — explicitamente solicitado, alinhado com engine existente
- **Convenções**: ESM modules, TypeScript strict (noUncheckedIndexedAccess, exactOptionalPropertyTypes), Vitest, zero-dependency approach
- **Estilo de código**: Arrow functions, no semicolons, snake_case files, camelCase functions, PascalCase types, UPPER_SNAKE_CASE constants
- **Arquitetura**: Funcional pura (sem classes, sem mutação de estado, sem side effects) — padrão do engine existente
- **Dados**: `enriched_materials.json` é ~70MB e gitignored — streaming/pagination necessário para processamento
- **Formato de similaridade**: Sparse graph (adjacência, NÃO matriz N²) — apenas pares com similarity >0.25
- **Dimensões de similaridade**: Multi-dimensional (semântica + compatibilidade de acordes + tradição perfumística + overlap de descriptors)
- **Taxonomia v1**: 12-20 families, 60-120 subfamilies, 300-800 descriptors normalizados

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Taxonomia NÃO contém scores físico-químicos | Separação de concerns — volatility/tenacity vivem na Layer 3. Similarity Engine futuro combina: semantic + molecular + behavior | — Pending |
| Taxonomia é híbrida (manual + estatística) | Estrutura manual garante qualidade semântica, refinamento estatístico do dataset garante cobertura e descobre aliases/clusters | — Pending |
| Builder first, Runtime depois | v1 gera JSONs compilados versionados. APIs e runtime vêm no próximo milestone | Validated in Phase 6 |
| Sparse similarity graph (adjacência, não N²) | Escala melhor com 60-120 subfamilies. Apenas pares relevantes (>0.25). Multi-dimensional | — Pending |
| Zero-dependency approach | Alinhado com engine existente. Sem bibliotecas externas em runtime | — Pending |
| Arquitetura funcional pura | Padrão estabelecido pelo engine. Funções puras, sem classes, sem mutação | — Pending |
| v1 artifacts remain structurally valid despite semantic noise | Phase 6 validated schemas, determinism and CLI behavior; data quality hardening is a future curation concern, not a retroactive Phase 6 failure | Logged after Phase 6 |
| Future hardening must not silently promote corpus evidence | Corpus candidates, alias merges, relation bootstraps and accord bootstraps require explicit curated inputs or review signals | Logged after Phase 6 |
| Phase 8 separates manual curation from pipeline hardening | Phase 7 resolved hardening concerns; seed expansion now requires expert/manual decisions before planning or implementation | Complete / verified |
| Phase 9 is a second curated expansion round, not v2 promotion | v2 promotion requires minimum group coverage, graph coverage, alias quality and zero hard failures; Phase 9 expands seed only | Complete / verified |
| Phase 10 executed third curated expansion round without v2 promotion | Added `amber_resinous`, `animalic` and `fresh_spice`/`anise` families, targeted `musky -> musk` alias, approved Round 3 relation/accord inputs, and validated v1-v2 with zero hard failures | Complete / verified |
| Phase 11 captures promotion readiness/default migration policy only | v2 remains candidate-only; PROMO-D-01 through PROMO-D-53 define strict readiness, soft finding dispositions, alias/graph/review queue gates, artifact strategy, migration mechanics, rollback and release process | Context captured |
| Phase 12 executed controlled and reversible default switch | v2 promoted to default after persisted approval, revalidation, official artifact publication, atomic `DEFAULT_PATHS` switch, post-switch validation and rollback dry-run. v1 preserved as baseline/archive | Complete / closed |
| Phase 14 opened v2.1 backlog triage as read-only/report-only work | Post-Phase 13 backlog areas were prioritized before any future v2.1 curation or process work. Source taxonomy files, compiled artifacts, `src/cli/parse_args.ts` and `graphify-out/*` remained protected | Complete / closed |
| Phase 15 starts post-triage safety guards and current-state docs cleanup as context gathering only | Phase 14 shortlists may feed future controlled execution, but the first priority is non-mutating safety automation guards. Docs/help cleanup remains separable, and all taxonomy data/artifact/default/Graphify boundaries remain protected | Active / not ready for execution |
| Phase 35 rebaseline separou 31 conflitos em Grupo A (13 noise/stopword) e Grupo B (18 microcuradoria) com guardrails contextuais | Noise/Stopword Pipeline é alto ROI mas regra deve ser contextual (escopo de substring conflict matching), não expurgo cego global. Tokens como `wood`, `fruit`, `sweet` podem ter valor semântico em outros contextos | Complete / closed |
| v2.7 batch bounded at 30 candidates to avoid over-curation | 275 candidates existed; 30 provided manageable scope for first curation batch | Complete / closed |
| v2.7 enforced D-36 default for missing natural subfamilies | sulfurous, roasted, buttery, bready, marine, alcoholic, coffee deferred because no subfamily existed | Complete / closed |
| v2.7 published via explicit `--version 2.7.0` without changing DEFAULT_PATHS | Kept CLI defaults unchanged; version override via explicit flag only | Complete / closed |
| v2.7 two-step publication: sandbox compile before official publish | Validation in `/tmp` first prevented broken artifacts from reaching `data/compiled/v2` | Complete / closed |
| v2.7 similarity matrix artifact version aligned post-review | Graph builder now accepts optional artifact version; `compileAll()` passes CLI `--version` value | Complete / closed |
| v2.8 continues low_support triage as bounded Batch 2 | Remaining 259 candidates are too large for one safe curation milestone; selection must prioritize evidence quality, semantic clarity, low polysemy and curation value | Complete / closed |
| v2.8 does not reconsider v2.7 explicit decisions unless still unresolved | Prevents churn and preserves Batch 1 decisions while allowing current compiled review_queue truth to surface unresolved items | Complete / closed |
| v2.8 Batch 2 fixed at exactly 40 candidates | Weighted evidence yield was bounded; 25–50 envelope preserved | Complete / closed |
| v2.8 publication stays explicit via `--version 2.8.0` | `DEFAULT_PATHS.version` remained `2.1.0` | Complete / closed |
| v2.8 closure metrics measured from published JSON | Not `/tmp` validation output | Complete / closed |
| v2.8 matrix row #4 (`cananga`) deferred to manual_review because no `ylang_ylang` seed target exists | Binds to legacy `ylang ylang` alias gap | Resolved in v2.9 via `ylang_ylang` add_target |
| v2.9 resolves the legacy `ylang ylang -> ylang_ylang` gap via add_target, not remap/drop/exception | Preserves the alias map, keeps exceptions empty, and makes the Phase 50 integrity gate pass with 341/18/0 | Complete / verified |
| v2.10 hardens integrity gates without curation or artifact mutation | The current `341/18/0` alias integrity state is already passing; this milestone protects it operationally through verification, local guardrails and CI rather than changing taxonomy truth | Complete / verified |
| v2.10 `verify:integrity` is the official local guardrail name | Phase 52 docs cite `alias:integrity`; Phase 53 established `verify:integrity` as the npm script entry point for local guardrail flows | Complete / verified |
| v2.10 CI uses dual integrity proofs | CI runs both `alias:integrity --json` and `verify:integrity --json`; duplicate precompile is latency-only tradeoff | Complete / verified |
| v2.10 stress benchmark uses environment-aware ceilings | Local default 1500ms; CI=true uses 3000ms — full suite 390/390 green under CI | Complete / verified |
| v2.11 starts with a static graph read model, not a graph database | The safe first layer is compiled artifacts → graph builder → graph export/proofs → query examples; Neo4J export can be designed later once the contract is stable | Phase 55 validated the contract-first boundary |
| v2.11 graph outputs must remain separate from official compiled artifacts | `data/compiled/v2/*` is protected baseline; graph export must be temporary or clearly separated so it cannot be mistaken for official taxonomy publication | Phase 55 locked sanctioned vs forbidden output paths |
| v2.11 may use compiled artifacts as read-only inputs but must not reopen curation | Graph nodes/edges can reflect existing compiled truth and review status; resolving low_support, conflicts or aliases is outside scope | Phase 55 locked exact allowed inputs and contract-only scope |
| v2.11 graph writer uses atomic write via tmp file and strict path checks | Output path policy restricts write path to the sanctioned read-model directory, explicitly rejecting forbidden prefixes | Phase 58 validated the atomic writer and path check |
| v2.11 boundary audit validates protected files with SHA-256 digests | Proves that source seeds and compiled artifacts are not mutated during the graph generation workflow | Phase 58 validated the boundary audit module |
| v2.11 graph workflow is fully isolated from graphify-out | Path guards block writing to or reading from any directory containing `graphify-out` | Phase 58 validated Graphify isolation |
| v2.11 CLI orchestrates sequential guardrail execution | Runs typecheck, tests, and integrity checks automatically to prevent regressions before finishing | Phase 58 validated GVAL-05 guardrails |
| v2.11 maintainer documentation in Portuguese with test-sourced examples | Operators need auditable docs tied to live regression evidence, not hand-written samples | Phase 59 validated GDOC-01 through GDOC-03 |
| v2.11 closure artifacts record 22/22 requirement traceability | Milestone close requires boundary audit summary and protected-scope evidence independent of code | Phase 59 validated milestone audit routing |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-17 after Phase 61 fail-closed query consumption*
