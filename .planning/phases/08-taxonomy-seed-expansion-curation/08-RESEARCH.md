# Phase 8: Taxonomy Seed Expansion & Curation - Research

**Researched:** 2026-05-22  
**Domain:** Manual olfactory taxonomy seed curation, versioned JSON inputs, TypeScript compiler validation  
**Confidence:** HIGH for project architecture and validation constraints; MEDIUM for external fragrance-family taxonomy support; LOW for descriptor-level candidate completeness

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

Copied verbatim from `.planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md` lines 17-127. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

#### Taxonomy Scope

- **CUR-D-01:** Phase 8 adotará minimal expansion como estratégia inicial de taxonomy scope.
- **CUR-D-02:** A expansão será manual/curada; corpus evidence e review_queue serão usados apenas como sinais de priorização.
- **CUR-D-03:** A fase não buscará uma full useful taxonomy completa de uma vez.
- **CUR-D-04:** O primeiro seed expandido discutirá os groups `gourmand`, `spicy`, `green`, `fruity`, `amber_resinous` e `animalic` como candidatos iniciais.
- **CUR-D-05:** A seleção desses groups para discussão não implica inclusão automática; cada family/subfamily/descriptor ainda precisará passar por curadoria manual.
- **CUR-D-06:** `marine_ozonic`, `tobacco`, `powdery`, `aldehydic`, `medicinal_camphoraceous`, `earthy_mineral` e `smoky` ficam deferidas para fase/subfase posterior.
- **CUR-D-07:** A Phase 8 inicial prioriza o conjunto mínimo recomendado e registra as demais categorias como future taxonomy expansion candidates.

Initial candidate groups:

- `gourmand`: `vanilla`, `caramel`, `chocolate`, `nutty`
- `spicy`: `warm_spice`, `fresh_spice`
- `green`: `leafy_green`, `herbal_green`
- `fruity`: `red_fruit`, `tropical_fruit`, `orchard_fruit`
- `amber_resinous`: `amber`, `balsamic_resin`
- `animalic`: `musky`, `leathery`

#### Seed Versioning

- **CUR-D-08:** Phase 8 criará `taxonomy-seed.v2.json` como novo seed expandido e curado.
- **CUR-D-09:** `taxonomy-seed.v1.json` será preservado como baseline e não será editado pela Phase 8.
- **CUR-D-10:** Loaders/CLI/compiler devem continuar usando seed path parametrizável para permitir comparação v1 vs v2.
- **CUR-D-11:** A Phase 8 usará migração controlada para `taxonomy-seed.v2.json`.
- **CUR-D-12:** Nenhuma troca de default para v2 acontece automaticamente nesta fase.
- **CUR-D-13:** v2 só poderá virar default após diff/review e validação comparativa contra v1.

#### Curation Rules

- **CUR-D-14:** Toda entrada no seed exige aprovação manual explícita.
- **CUR-D-15:** Toda entrada nova exige rationale curto.
- **CUR-D-16:** Toda entrada nova exige evidência de apoio, mas corpus evidence permanece review-only.
- **CUR-D-17:** Frequência corpus não é condição obrigatória para curated seed truth.
- **CUR-D-18:** Batch approval sem rationale individual não é permitido para o primeiro seed expandido.
- **CUR-D-19:** IDs canônicos do seed devem ser lowercase, snake_case e ASCII/no accents.
- **CUR-D-20:** IDs canônicos são estáveis e só mudam com migração explícita.
- **CUR-D-21:** Aliases não podem ser descriptors principais; devem apontar para um canonical claro via alias map.
- **CUR-D-22:** Corpus frequency e review_queue são sinais de suporte/priorização, não critérios automáticos de aprovação.
- **CUR-D-23:** Frequência alta não promove descriptor para seed sem aprovação manual.
- **CUR-D-24:** Frequência baixa ou zero não bloqueia entrada curada quando houver rationale suficiente.
- **CUR-D-25:** Review_queue será usada como fila de investigação curatorial, não como curated truth.

#### Candidate Review Workflow

- **CUR-D-26:** A curadoria da Phase 8 classificará review_queue/corpus candidates em buckets explícitos.
- **CUR-D-27:** Os buckets oficiais são new descriptor candidate, alias candidate, subfamily gap, family gap, relation/accord gap e reject/defer.
- **CUR-D-28:** Classificação de candidate não equivale a promoção automática; toda mudança curada exige aprovação manual.
- **CUR-D-29:** Cada item revisado deve ter uma classificação principal e pode ter hipóteses secundárias quando necessário.
- **CUR-D-30:** A fila de revisão será priorizada por evidence-ranked queue.
- **CUR-D-31:** O ranking usará frequência, tipo de review, severidade de conflito, ambiguidade de placement e impacto em subfamilies sobrecarregadas.
- **CUR-D-32:** Ranking alto não implica promoção automática; serve apenas para ordenar investigação curatorial.
- **CUR-D-33:** Frequency-only e conflicts-only não serão usados como estratégia principal de priorização.
- **CUR-D-34:** Todo candidate revisado deve receber disposition estruturada obrigatória.
- **CUR-D-35:** Outcomes válidos são `promote_to_seed`, `add_alias`, `create_gap`, `relation_gap`, `reject` e `defer`.
- **CUR-D-36:** Toda disposition exige rationale e preserva evidence.
- **CUR-D-37:** Disposition não executa automaticamente alterações; mudanças em seed/aliases/relations/accords continuam controladas e auditáveis.

#### Alias Expansion

- **CUR-D-38:** Alias só entra em `descriptor_aliases.seed.json` quando houver canonical descriptor claro.
- **CUR-D-39:** Alias exige aprovação manual explícita.
- **CUR-D-40:** Alias exige rationale/evidence.
- **CUR-D-41:** Alias ambíguo deve ser rejeitado ou deferido até canonical ser resolvido.
- **CUR-D-42:** Alias candidates e frequência corpus nunca promovem aliases automaticamente.
- **CUR-D-43:** O canonical é o conceito curado mais estável, não necessariamente a grafia mais frequente.
- **CUR-D-44:** Frequência corpus pode informar a decisão, mas não define canonical automaticamente.
- **CUR-D-45:** IDs curtos/limpos não vencem se forem semanticamente ambíguos.
- **CUR-D-46:** Mudança de canonical ID exige migração explícita.
- **CUR-D-47:** Aliases óbvios devem ser revisados junto com novos descriptors aprovados.
- **CUR-D-48:** A aprovação de um descriptor não aprova aliases automaticamente.
- **CUR-D-49:** Aliases ambíguos ficam defer/reject até canonical claro.
- **CUR-D-50:** Cada bloco curatorial pode incluir descriptor, aliases, rationale e evidence.

#### Relation/Accord Expansion

- **CUR-D-51:** Cada nova subfamily deve considerar curated relations/accords mínimos no mesmo bloco da seed expansion.
- **CUR-D-52:** A ausência de relation/accord não bloqueia automaticamente a entrada quando houver justificativa.
- **CUR-D-53:** Ausências justificadas devem virar relation_gap/accord_gap review items.
- **CUR-D-54:** Relations/accords seguem manuais; corpus evidence apoia, mas não define sozinho.
- **CUR-D-55:** O `accord_map` deve ser expandido junto com o seed v2.
- **CUR-D-56:** Accords novos exigem score manual, rationale/evidence e aprovação curatorial.
- **CUR-D-57:** Corpus/co-occurrence pode apoiar evidence, mas não cria accord automaticamente.
- **CUR-D-58:** Ausência de accord plausível não bloqueia subfamily, mas deve ser registrada como gap/review quando relevante.
- **CUR-D-59:** Scores de curated_relations e accord_map são manuais, não derivados automaticamente do corpus.
- **CUR-D-60:** Cada relation/accord exige rationale curto.
- **CUR-D-61:** Evidence deve ser preservada, incluindo corpus signals quando úteis, mas sempre como suporte.
- **CUR-D-62:** Relations/accords não são gerados por heurística automática.
- **CUR-D-63:** Missing relation/accord permanece neutral/undefined, não zero.
- **CUR-D-64:** Scores devem ser normalizados em [0, 1] e revisáveis.

#### Validation And Quality Gates

- **CUR-D-65:** A Phase 8 validará seed v2 com comparação v1 vs v2.
- **CUR-D-66:** Métricas obrigatórias incluem coverage, generic pressure, zero-frequency seeds, graph coverage, review_queue quality, alias quality e determinism/schema.
- **CUR-D-67:** Regressões devem ser documentadas com rationale.
- **CUR-D-68:** Quality metrics não substituem curadoria manual; servem para validar impacto da expansão.
- **CUR-D-69:** Hard failures da Phase 8 incluem schema invalid, nondeterminism, hard/pattern-excludes em taxonomy, alias contamination e auto-promotion.
- **CUR-D-70:** Empty graph não é hard failure universal; vira warning high quando houver curated inputs que deveriam gerar edges.
- **CUR-D-71:** Warnings/review_queue items não falham por padrão; são parte esperada do workflow curatorial.
- **CUR-D-72:** Zero-frequency seeds, sparse graph, high review_queue count, deferred gaps e ambiguous candidates são soft warnings/review findings.
- **CUR-D-73:** Soft warnings não falham a build por padrão.
- **CUR-D-74:** Soft warnings devem orientar revisão curatorial e promoção controlada do seed v2.
- **CUR-D-75:** Ambiguidades só viram erro se forem promovidas sem aprovação manual.

### the agent's Discretion

No separate `## the agent's Discretion` section exists in `08-CONTEXT.md`; research discretion is limited to planning patterns that obey CUR-D-01 through CUR-D-75. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)

`marine_ozonic`, `tobacco`, `powdery`, `aldehydic`, `medicinal_camphoraceous`, `earthy_mineral` and `smoky` are deferred to a later phase/subphase. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CUR-01 | Decide which curated families, subfamilies and descriptors should be considered for the first manually expanded seed. [CITED: .planning/REQUIREMENTS.md] | Plan one manual curation wave around the six initial candidate groups and preserve defer list as future candidates. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| CUR-02 | Decide whether Phase 8 should create `taxonomy-seed.v2.json`, update `taxonomy-seed.v1.json`, or maintain a draft expansion file first. [CITED: .planning/REQUIREMENTS.md] | Create `data/taxonomy/taxonomy-seed.v2.json`; do not edit v1 or switch defaults automatically. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| CUR-03 | Define criteria for curated truth, naming, and evidence. [CITED: .planning/REQUIREMENTS.md] | Require per-entry manual approval, rationale, evidence, lowercase snake_case ASCII IDs, and explicit migration for ID changes. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| CUR-04 | Define review-only use of Phase 7 candidates and `review_queue`. [CITED: .planning/REQUIREMENTS.md] | Use an evidence-ranked queue and mandatory disposition records; never execute dispositions automatically. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| CUR-05 | Define manually curated alias expansion. [CITED: .planning/REQUIREMENTS.md] | Add aliases only when a clear canonical descriptor exists, with explicit approval/rationale/evidence. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| CUR-06 | Define curated relation and accord expansion with manual scores. [CITED: .planning/REQUIREMENTS.md] | Expand `curated_relations` and `accord_map` together with seed v2, keep missing entries neutral/undefined, and normalize manual scores to [0,1]. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| CUR-07 | Define validation and quality gates. [CITED: .planning/REQUIREMENTS.md] | Compare v1 vs v2 using schema/determinism, hard/soft gate separation, review queue quality, alias quality, graph coverage, and regression rationale. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

No `./AGENTS.md` file exists in the repository root, so no AGENTS.md-specific directives were found. [VERIFIED: codebase read]

No project-local `.claude/skills/**/SKILL.md` or `.agents/skills/**/SKILL.md` files were found, so no project-local skill patterns apply. [VERIFIED: codebase glob]

## Summary

Phase 8 should be planned as a data-curation and validation phase, not as an inference automation phase. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] The current project is a Node.js/TypeScript taxonomy builder with zero runtime dependencies, functional architecture, versioned JSON inputs, and a CLI that already accepts parametrized seed, alias, relations, accord, corpus, noise, output, version, and deterministic generated-at paths. [CITED: .planning/ROADMAP.md] [VERIFIED: codebase read]

The planner should split work into (1) curation workbooks/templates and evidence extraction, (2) creation of `taxonomy-seed.v2.json`, (3) curated alias/relation/accord input expansion, and (4) comparative validation against the Phase 7 baseline. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] Baseline facts include 3 families, 6 subfamilies, 177 compiled descriptors, 21 seed descriptors, 156 corpus candidates, 10 authoritative aliases, 6 similarity edges, and 427 review queue items. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

External fragrance-family sources support the existence of families such as Green, Fruity, Amber, Woods, Citrus, Water, Floral, and Gourmand as industry classification concepts, but sources also warn that fragrance family classification is not universally agreed. [CITED: https://www.fragrancesoftheworld.com/FragranceWheel] [CITED: https://perfumesociety.org/fragrance-families/] Therefore Phase 8 must preserve manual rationale and avoid treating external taxonomy names or corpus frequencies as automatic truth. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

**Primary recommendation:** Plan a conservative, auditable v2 seed expansion with explicit curation records, no new runtime dependencies, no default switch, and a mandatory v1-vs-v2 compile/quality comparison before any v2 promotion. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Curated taxonomy seed expansion | Versioned data input (`data/taxonomy`) | Loader/compiler validation | `taxonomy-seed.v1.json` is a manual hierarchy input and `validateSeed` validates structure, IDs, uniqueness, and descriptors. [VERIFIED: codebase read] |
| Candidate evidence review | Curation workflow/documentation | Compiler review queue | Corpus candidates and review queue are evidence only and must not mutate curated truth. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| Alias expansion | Versioned alias seed input | Analysis canonicalization and compiled alias output | `descriptor_aliases.seed.json` is loaded as curated input and `compileAliases` emits authoritative aliases. [VERIFIED: codebase read] |
| Relation/accord expansion | Versioned inference data inputs | Similarity graph builder | `curated_relations.v1.json` and `accord_map.v1.json` feed `buildSimilarityGraph` through `compileAll`. [VERIFIED: codebase read] |
| v1-vs-v2 comparison | CLI/compiler validation | Tests and manual review | CLI has parametrized input paths and deterministic `--generated-at`, allowing side-by-side compiled output comparisons. [VERIFIED: codebase read] |
| Hard/soft quality gates | Compiler validation | Human curation review | `runArtifactQualityGates` returns hard errors and warnings separately. [VERIFIED: codebase read] |

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Node.js | v24.14.0 available locally | Run ESM compiler CLI and tests | Existing project runtime/package tooling is Node/npm. [VERIFIED: local command] |
| TypeScript | project uses `^5.8.0`; npm latest observed 6.0.3 modified 2026-04-16 | Strict typechecking and build | Project scripts use `tsc`; TypeScript strict mode enables strict type checking options. [VERIFIED: codebase read] [VERIFIED: npm registry] [CITED: /microsoft/typescript] |
| Vitest | project uses `^3.2.0`; npm latest observed 4.1.7 modified 2026-05-20 | Existing automated tests | Project scripts use `vitest run`; Vitest docs show `describe`, `it`, `expect`, and CLI execution patterns. [VERIFIED: codebase read] [VERIFIED: npm registry] [CITED: /vitest-dev/vitest] |
| Native JSON files | n/a | Seed, aliases, curated relations, accord map, compiled artifacts | Current loaders and compiler consume and emit JSON without runtime packages. [VERIFIED: codebase read] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| npm | 11.9.0 available locally | Run project scripts and npm registry checks | Use for `npm run typecheck`, `npm test`, `npm run build`, `npm run compile`, and package version verification. [VERIFIED: local command] |
| `slopcheck` | Installed but npm package checking unavailable in this invocation | Package legitimacy audit | Not required for Phase 8 if no new packages are installed; current slopcheck invocation scanned PyPI, not npm, so do not use its PyPI verdict for npm packages. [VERIFIED: local command] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native JSON curated inputs | YAML/CSV curation spreadsheets | JSON matches existing loader/compiler contracts; CSV/YAML would require conversion or new tooling. [VERIFIED: codebase read] |
| Manual curation records | Automatic promotion from corpus candidates | Automatic promotion violates CUR-D-14, CUR-D-22, CUR-D-23, CUR-D-28, and CUR-D-42. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| Existing Vitest tests | New test framework | Existing project already uses Vitest and has 48 test files / 345 tests passing after Phase 7. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |

**Installation:**

```bash
# No new runtime or dev packages should be installed for Phase 8.
cd src && npm install # only if restoring existing lockfile dependencies in a fresh checkout
```

**Version verification:**

`npm view typescript version time.modified`, `npm view vitest version time.modified`, and `npm view @types/node version time.modified` were run from `src/`. [VERIFIED: npm registry]

## Package Legitimacy Audit

Phase 8 should not install external packages. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] The audit below covers existing development packages only because the phase should rely on the current stack. [VERIFIED: codebase read]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `typescript` | npm | existing project dev dependency | not checked | official Microsoft project via Context7 | not applicable for npm in this environment | Existing dependency only; no new install recommended. [VERIFIED: codebase read] [CITED: /microsoft/typescript] |
| `vitest` | npm | existing project dev dependency | not checked | official Vitest project via Context7 | not applicable for npm in this environment | Existing dependency only; no new install recommended. [VERIFIED: codebase read] [CITED: /vitest-dev/vitest] |
| `@types/node` | npm | existing project dev dependency | not checked | DefinitelyTyped package, registry-confirmed | not applicable for npm in this environment | Existing dependency only; no new install recommended. [VERIFIED: codebase read] [VERIFIED: npm registry] |

**Packages removed due to slopcheck [SLOP] verdict:** none; no new packages are recommended. [VERIFIED: codebase read]  
**Packages flagged as suspicious [SUS]:** none for npm; slopcheck in this environment checked PyPI and produced irrelevant results for npm packages. [VERIFIED: local command]

## Architecture Patterns

### System Architecture Diagram

```text
Manual curator decisions
  |
  v
Curation record/workbook (descriptor + aliases + rationale + evidence + disposition)
  |
  +--> taxonomy-seed.v2.json --------------------+
  |                                               |
  +--> descriptor_aliases.seed.json updates ------+--> compile CLI with explicit paths
  |                                               |    --seed taxonomy-seed.v1.json -> baseline output
  +--> curated_relations.v2.json / accord_map.v2.json
                                                   |
                                                   v
Phase 7 compiler pipeline (load -> analyze -> compile -> validate)
                                                   |
                                                   v
v1 vs v2 comparison: schema/determinism, coverage, generic pressure,
zero-frequency seeds, graph coverage, review_queue quality, alias quality
                                                   |
                                                   v
Human gate: approve v2 as candidate or revise curation records
```

### Recommended Project Structure

```text
data/
├── taxonomy/
│   ├── taxonomy-seed.v1.json          # preserve baseline
│   ├── taxonomy-seed.v2.json          # new curated expansion
│   └── descriptor_aliases.seed.json   # curated alias map; update only with approved aliases
├── inference/
│   ├── curated_relations.v1.json      # preserve baseline
│   ├── curated_relations.v2.json      # recommended v2 companion if relations expand
│   ├── accord_map.v1.json             # preserve baseline
│   └── accord_map.v2.json             # recommended v2 companion if accords expand
└── compiled/
    ├── v1/                            # preserve Phase 7 baseline artifacts
    └── v2-candidate/                  # explicit output path for validation only

.planning/phases/08-taxonomy-seed-expansion-curation/
├── 08-RESEARCH.md
├── 08-PLAN.md                         # future executable plan
└── curation/                          # optional planning artifact area, not compiled runtime input
    ├── candidate-review.md
    └── v1-v2-comparison.md
```

### Pattern 1: Versioned Seed Without Default Switch

**What:** Create a new seed file and compile it only through explicit `--seed` path arguments. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**When to use:** Every Phase 8 validation run. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Example:**

```bash
# Source: src/cli/compile.ts help and parse args [VERIFIED: codebase read]
cd src
npm run compile -- \
  --seed ../data/taxonomy/taxonomy-seed.v2.json \
  --relations ../data/inference/curated_relations.v2.json \
  --accords ../data/inference/accord_map.v2.json \
  --out ../data/compiled/v2-candidate \
  --version 2.0.0 \
  --generated-at 2026-01-01T00:00:00.000Z
```

### Pattern 2: Curatorial Block Per Approved Change

**What:** Treat each promoted descriptor/subfamily/family as a reviewable block containing canonical ID, aliases, rationale, evidence, disposition, and relation/accord follow-up. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**When to use:** Before editing `taxonomy-seed.v2.json`, `descriptor_aliases.seed.json`, `curated_relations.v2.json`, or `accord_map.v2.json`. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Example:**

```json
{
  "canonical_id": "vanilla",
  "bucket": "new descriptor candidate",
  "disposition": "promote_to_seed",
  "target_family": "gourmand",
  "target_subfamily": "vanilla",
  "approval": "manual_required",
  "rationale": "Short human rationale required before implementation.",
  "evidence": {
    "corpus_frequency": "review-only signal",
    "review_queue_items": ["preserve item IDs or descriptors when available"],
    "external_reference": "optional"
  },
  "aliases": [],
  "relation_accord_followup": "consider same-block curated relation/accord or create relation_gap"
}
```

### Pattern 3: Hard Gates vs Soft Review Findings

**What:** Hard failures block compile/promotion; soft warnings guide revision but do not fail by default. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**When to use:** All v1-vs-v2 validation reporting. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Example:**

```text
Hard failures: schema invalid, nondeterminism, hard/pattern-excludes in taxonomy,
alias contamination, auto-promotion.

Soft findings: zero-frequency seeds, sparse graph, high review_queue count,
deferred gaps, ambiguous candidates.
```

### Anti-Patterns to Avoid

- **Auto-promoting corpus candidates:** Violates explicit manual approval and review-only decisions. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
- **Editing `taxonomy-seed.v1.json`:** Violates the preserved baseline decision. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
- **Switching compiler defaults to v2 in Phase 8:** Violates no-automatic-default-switch decision. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
- **Using frequency-only ranking:** Explicitly rejected as primary prioritization. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
- **Representing missing relation/accord as score 0:** Project semantics require missing relation/accord to remain neutral/undefined, not zero. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON schema/shape validation | New validator framework | Existing `validateSeed`, alias validation, `validateAllOutputs`, and `runArtifactQualityGates` | Existing code already validates seed structure, output contracts, and hard/soft artifact gates. [VERIFIED: codebase read] |
| Corpus candidate promotion | Heuristic auto-promoter | Manual curation block + disposition | Auto-promotion violates Phase 8 decisions. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| v1-vs-v2 execution harness | New runner/package | Existing CLI with explicit paths and deterministic `--generated-at` | CLI already supports the necessary input and output path flags. [VERIFIED: codebase read] |
| Review queue sorting primitives | Ad hoc nondeterministic sorting | Existing deterministic `sortReviewQueue` plus planned curation ranking layer | Existing review queue sorting is stable by type, severity, affected JSON, and evidence JSON. [VERIFIED: codebase read] |
| Package-based taxonomy enrichment | External scraping/enrichment | Manual evidence references only | Phase 8 forbids external scraping/enrichment. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |

**Key insight:** Phase 8 risk is not algorithmic complexity; the risk is losing curation provenance and accidentally converting evidence into truth. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

## Runtime State Inventory

This phase is a versioned data migration/curation phase, so runtime state categories were reviewed. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | No project database/datastore state was found in Phase 8 scope; curated truth lives in JSON files under `data/`. [VERIFIED: codebase glob/read] | Code/data edit only; no DB migration. [VERIFIED: codebase read] |
| Live service config | None found; project is a local builder/CLI with JSON inputs and no runtime API service in scope. [CITED: .planning/REQUIREMENTS.md] [VERIFIED: codebase read] | None. |
| OS-registered state | None found; no systemd/pm2/Task Scheduler references were found in scoped files. [VERIFIED: codebase glob/read] | None. |
| Secrets/env vars | None found for Phase 8; CLI uses file path flags, not secret/env-var config, for seed/alias/relation/accord input selection. [VERIFIED: codebase read] | None. |
| Build artifacts | Existing compiled baseline artifacts live in `data/compiled/v1/`; Phase 8 should write candidate outputs only to an explicit v2 candidate directory. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] | Use explicit `--out ../data/compiled/v2-candidate`; preserve v1 artifacts. [VERIFIED: codebase read] |

## Common Pitfalls

### Pitfall 1: Treating Candidate Evidence as Curated Truth

**What goes wrong:** Corpus candidates or review queue items are copied directly into seed/aliases/relations/accords. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Why it happens:** The Phase 7 review queue contains useful evidence and may look actionable. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**How to avoid:** Require one curatorial block and explicit manual approval per change. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Warning signs:** A diff adds many descriptors without per-entry rationale or uses corpus frequency as the only justification. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

### Pitfall 2: Default Path Drift

**What goes wrong:** v2 becomes the default seed during Phase 8. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Why it happens:** A developer updates default paths instead of passing explicit CLI flags. [VERIFIED: codebase read]  
**How to avoid:** Keep defaults unchanged and compile v2 with explicit `--seed`, `--relations`, `--accords`, and `--out`. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] [VERIFIED: codebase read]  
**Warning signs:** `parse_args.ts` or default path constants change in a curation-only plan. [VERIFIED: codebase read]

### Pitfall 3: Duplicate or Ambiguous Canonical IDs

**What goes wrong:** A descriptor appears in multiple subfamilies or an alias is promoted as a primary descriptor. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Why it happens:** Per-subfamily seed validation checks duplicate descriptors inside a subfamily, while global descriptor ownership still needs curation discipline. [VERIFIED: codebase read]  
**How to avoid:** Add a Phase 8 validation task for global descriptor uniqueness and alias-canonical collision checks. [VERIFIED: codebase read]  
**Warning signs:** `descriptor_aliases.seed.json` maps an alias to a canonical ID that is absent from v2 seed, or seed contains both alias and canonical as descriptors. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

### Pitfall 4: Over-Optimizing External Taxonomy Completeness

**What goes wrong:** The plan attempts a full professional fragrance taxonomy instead of the minimal curated expansion. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Why it happens:** External fragrance family systems vary and are not universally agreed. [CITED: https://perfumesociety.org/fragrance-families/]  
**How to avoid:** Treat external sources as support for curation rationale, not as implementation scope. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]  
**Warning signs:** Deferred groups such as marine_ozonic or smoky appear in Phase 8 implementation tasks. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

## Code Examples

### Existing Seed Shape

```json
// Source: data/taxonomy/taxonomy-seed.v1.json [VERIFIED: codebase read]
{
  "version": "1.0.0",
  "metadata": {
    "created_at": "2026-05-13T00:00:00Z",
    "author": "Taxonomy Team",
    "description": "Initial Olfactory Taxonomy Seed v1.1 - snake_case fix"
  },
  "families": [
    {
      "id": "floral",
      "name": "Floral",
      "subfamilies": [
        { "id": "floral_white", "name": "White Floral", "descriptors": ["jasmine"] }
      ]
    }
  ]
}
```

### Existing Curated Relation Shape

```json
// Source: data/inference/curated_relations.v1.json [VERIFIED: codebase read]
{
  "source_subfamily_id": "floral_rose",
  "target_subfamily_id": "floral_white",
  "relation": "same_family_tradition",
  "score": 0.85,
  "evidence": "manual_phase_7_bootstrap"
}
```

### Existing Accord Shape

```json
// Source: data/inference/accord_map.v1.json [VERIFIED: codebase read]
{
  "source_subfamily_id": "citrus_fresh",
  "target_subfamily_id": "floral_white",
  "accord": "compatible_accord_pair",
  "score": 0.7,
  "reference": "manual_phase_7_bootstrap"
}
```

### Vitest Pattern

```typescript
// Source: /vitest-dev/vitest README via Context7 [CITED: /vitest-dev/vitest]
import { describe, expect, it } from 'vitest'

describe('curated seed v2 validation', () => {
  it('keeps seed ids lowercase snake_case', () => {
    expect('amber_resinous').toMatch(/^[a-z][a-z0-9_]*$/)
  })
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Small v1 seed only | Manual v2 seed expansion with review-only corpus evidence | Phase 8 context captured 2026-05-22 | Planner must add curation provenance and v1-vs-v2 validation, not automatic promotion. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| Empty or minimal relation/accord coverage | Manually bootstrapped Phase 7 relations/accords and Phase 8 expansion | Phase 7 completed 2026-05-22 | New subfamilies should consider relation/accord coverage in the same curatorial block. [CITED: .planning/STATE.md] [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| Ambiguous `Oriental` family terminology | `Ambrée` / amber-resinous framing | Current Perfume Society page fetched 2026-05-22 | `amber_resinous` is a safer project label than legacy terminology. [CITED: https://perfumesociety.org/fragrance-families/ambree/] |

**Deprecated/outdated:**

- Using `Oriental` as a project family label should be avoided because The Perfume Society identifies it as outdated and offensive to many and says it has replaced it with `ambrée`. [CITED: https://perfumesociety.org/fragrance-families/ambree/]
- Automatically derived relation/accord scores are out of scope because Phase 8 requires manual scores. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The first v2 curation can be represented with optional planning-only curation markdown/workbook files before editing JSON. [ASSUMED] | Architecture Patterns | Planner may need to use only JSON and tests if documentation artifacts are considered overhead. |
| A2 | Global descriptor uniqueness across all subfamilies should be added as a Phase 8-specific validation concern. [ASSUMED] | Common Pitfalls / Validation Architecture | If the domain intentionally allows multi-placement descriptors, this check should become warning or manual review instead of hard failure. |
| A3 | Candidate subfamily names from context map directly to family IDs/subfamily IDs in seed v2. [ASSUMED] | Standard Stack / Architecture Patterns | User may prefer different canonical grouping names after manual curation. |

## Open Questions (RESOLVED)

1. **RESOLVED — Should relation/accord v2 files be mandatory whenever `taxonomy-seed.v2.json` is created?**
   - What we know: Each new subfamily must consider curated relations/accords, but absence does not block when justified. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
   - What's unclear: Whether the plan should always create `curated_relations.v2.json` and `accord_map.v2.json`, or update only when new entries are approved. [ASSUMED]
   - Resolution: Phase 8 plans must create v2 companion files when v2 seed expansion is executed, but the files contain only applicable v1 carry-forward records plus approved manual v2 records. Missing relation/accord coverage is represented in the curation workbook as `relation_gap`/accord-gap rationale, not as fake scores or blocking absence. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
2. **RESOLVED — Where should durable curation rationale live?**
   - What we know: Current seed schema has only family/subfamily/descriptors and metadata; relation/accord files store short evidence/reference strings. [VERIFIED: codebase read]
   - What's unclear: Whether rationale should be embedded in new JSON schema fields, stored in a sidecar curation log, or only in planning docs. [ASSUMED]
   - Resolution: Durable Phase 8 rationale/evidence lives in `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md` as the approval ledger. Curated JSON schemas remain unchanged unless a later explicit plan evolves them; every JSON addition must trace back to an approved workbook entry with individual rationale and evidence. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
3. **RESOLVED — How many descriptors per candidate subfamily should be accepted in the first v2?**
   - What we know: Phase 8 is minimal expansion and not a full taxonomy. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
   - What's unclear: Exact descriptor list requires human curation. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
   - Resolution: No fixed count is authorized by research. The executable plan must block before data edits until the curator explicitly approves the exact family/subfamily/descriptor entries in the workbook. `taxonomy-seed.v2.json` must expand beyond v1 only through those approved entries; if no entries are approved, dependent data-edit plans cannot proceed. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | CLI compile/test execution | ✓ | v24.14.0 | None needed. [VERIFIED: local command] |
| npm | Script execution and registry checks | ✓ | 11.9.0 | None needed. [VERIFIED: local command] |
| TypeScript | `npm run typecheck` / `npm run build` | ✓ via project dependency | `^5.8.0` in package.json; npm latest observed 6.0.3 | Use existing lockfile/install. [VERIFIED: codebase read] [VERIFIED: npm registry] |
| Vitest | `npm test` | ✓ via project dependency | `^3.2.0` in package.json; npm latest observed 4.1.7 | Use existing tests; do not add framework. [VERIFIED: codebase read] [VERIFIED: npm registry] |
| slopcheck | Package legitimacy gate | Partial | installed, but scanned PyPI for npm package names | Skip package installs; if new npm packages are proposed later, verify with npm registry and official docs. [VERIFIED: local command] |

**Missing dependencies with no fallback:** none identified for research/planning. [VERIFIED: local command]  
**Missing dependencies with fallback:** none identified for Phase 8 if no new packages are installed. [VERIFIED: local command]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (`^3.2.0` in project; latest observed 4.1.7). [VERIFIED: codebase read] [VERIFIED: npm registry] |
| Config file | `src/vitest.config.ts` includes `tests/**/*.test.ts`. [VERIFIED: codebase read] |
| Quick run command | `cd src && npm test -- tests/seed_validator.test.ts tests/compiler/quality_gates.test.ts` [VERIFIED: codebase read] |
| Full suite command | `cd src && npm run typecheck && npm test && npm run build` [VERIFIED: codebase read] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| CUR-01 | v2 seed contains only manually approved minimal-scope groups/descriptors and preserves defer list outside seed. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] | unit/data validation | `cd src && npm test -- tests/seed_validator.test.ts` plus new v2-specific test | ❌ Wave 0 |
| CUR-02 | v1 is unchanged, v2 compiles through explicit path, defaults unchanged. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] | integration/CLI | `cd src && npm test -- tests/cli/parse_args.test.ts tests/cli/compile.test.ts` plus snapshot/hash check | ✅ partial / ❌ Wave 0 |
| CUR-03 | All new entries have lowercase snake_case ASCII IDs and curation rationale/evidence in sidecar or approved schema. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] | unit/data validation | new `tests/curation/taxonomy_seed_v2.test.ts` | ❌ Wave 0 |
| CUR-04 | Review queue evidence is classified/dispositioned without auto-promotion. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] | unit/data validation | new `tests/curation/review_dispositions.test.ts` | ❌ Wave 0 |
| CUR-05 | New aliases point to clear canonical seed descriptors and aliases are not primary descriptors. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] | unit/data validation | `cd src && npm test -- tests/compiler/compile_aliases.test.ts` plus new alias-seed v2 checks | ✅ partial / ❌ Wave 0 |
| CUR-06 | Relation/accord scores are manual, normalized [0,1], and missing entries are gap/neutral not zero. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] | unit/integration | `cd src && npm test -- tests/inference/tradition_score.test.ts tests/inference/accord_compatibility.test.ts` plus v2 data checks | ✅ partial / ❌ Wave 0 |
| CUR-07 | v1-vs-v2 compile comparison reports hard and soft gates separately. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] | integration/smoke | `cd src && npm run compile:quality -- --generated-at 2026-01-01T00:00:00.000Z` plus v2 explicit-path comparison | ✅ partial / ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `cd src && npm run typecheck && npm test -- <changed-test-files>` [VERIFIED: codebase read]
- **Per wave merge:** `cd src && npm run typecheck && npm test && npm run build` [VERIFIED: codebase read]
- **Phase gate:** Full suite green plus deterministic `npm run compile -- --generated-at 2026-01-01T00:00:00.000Z` and explicit v2 compile/quality report. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] [VERIFIED: codebase read]

### Wave 0 Gaps

- [ ] `src/tests/curation/taxonomy_seed_v2.test.ts` — covers CUR-01, CUR-02, CUR-03. [ASSUMED]
- [ ] `src/tests/curation/review_dispositions.test.ts` — covers CUR-04. [ASSUMED]
- [ ] `src/tests/curation/alias_seed_v2.test.ts` — covers CUR-05. [ASSUMED]
- [ ] `src/tests/curation/relation_accord_v2.test.ts` — covers CUR-06. [ASSUMED]
- [ ] `src/tests/curation/v1_v2_comparison.test.ts` or documented CLI smoke procedure — covers CUR-07. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No runtime API/user auth in Phase 8 scope. [CITED: .planning/REQUIREMENTS.md] |
| V3 Session Management | no | No sessions in Phase 8 scope. [CITED: .planning/REQUIREMENTS.md] |
| V4 Access Control | yes, repository/process level | Require human approval checkpoints before curated truth changes. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| V5 Input Validation | yes | Existing seed/output validation plus new curation data checks for IDs, aliases, and score bounds. [VERIFIED: codebase read] |
| V6 Cryptography | no | No cryptographic operations in Phase 8 scope. [CITED: .planning/REQUIREMENTS.md] |

### Known Threat Patterns for Versioned JSON Curation

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unreviewed corpus candidate becomes curated descriptor | Tampering | Manual approval, rationale, evidence, and no auto-promotion. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| Alias contamination maps to `candidate` or absent canonical | Tampering | Alias seed validation and hard gate for candidate canonical contamination. [VERIFIED: codebase read] |
| Nondeterministic artifacts hide curation diffs | Repudiation | Use deterministic `--generated-at` and compare v1 vs v2. [VERIFIED: codebase read] [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |
| External scraping injects unreviewed taxonomy content | Tampering | External scraping/enrichment is forbidden in Phase 8. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md` — locked Phase 8 decisions CUR-D-01 through CUR-D-75 and Phase 7 baseline. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md]
- `.planning/REQUIREMENTS.md` — CUR-01 through CUR-07 requirement definitions. [CITED: .planning/REQUIREMENTS.md]
- `.planning/STATE.md` — Phase 8 status and project decision history. [CITED: .planning/STATE.md]
- `.planning/ROADMAP.md` — Phase 8 registration, Phase 7 dependency, and zero-runtime-dependency project description. [CITED: .planning/ROADMAP.md]
- Codebase files: `src/cli/compile.ts`, `src/loader/seed_validator.ts`, `src/compiler/compile_all.ts`, `src/compiler/quality_gates.ts`, `src/compiler/review_queue.ts`, `src/types/*.ts`, `data/taxonomy/*.json`, `data/inference/*.json`. [VERIFIED: codebase read]
- Context7 `/vitest-dev/vitest` — Vitest CLI/test examples. [CITED: /vitest-dev/vitest]
- Context7 `/microsoft/typescript` — TypeScript strict mode examples. [CITED: /microsoft/typescript]

### Secondary (MEDIUM confidence)

- `https://www.fragrancesoftheworld.com/FragranceWheel` — current Fragrances of the World wheel page showing families including Amber, Green, Fruity, Citrus, Water, Woods, Floral, and others. [CITED: https://www.fragrancesoftheworld.com/FragranceWheel]
- `https://perfumesociety.org/fragrance-families/` — Perfume Society overview of fragrance families and caveat that classification is not universally agreed. [CITED: https://perfumesociety.org/fragrance-families/]
- `https://perfumesociety.org/fragrance-families/gourmand/` — Gourmand notes including caramel, chocolate, coffee, almonds, vanilla, spices, and amber. [CITED: https://perfumesociety.org/fragrance-families/gourmand/]
- `https://perfumesociety.org/fragrance-families/fresh/` — Fresh family subgroups including fresh green and fresh fruity. [CITED: https://perfumesociety.org/fragrance-families/fresh/]
- `https://perfumesociety.org/fragrance-families/ambree/` — Ambrée terminology replacing legacy Oriental terminology. [CITED: https://perfumesociety.org/fragrance-families/ambree/]

### Tertiary (LOW confidence)

- Assumed planning-side curation sidecar file structure and exact Wave 0 test filenames. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — existing package.json, local versions, npm registry checks, and Context7 docs support the stack. [VERIFIED: codebase read] [VERIFIED: local command] [VERIFIED: npm registry] [CITED: /vitest-dev/vitest] [CITED: /microsoft/typescript]
- Architecture: HIGH — Phase 8 decisions and code paths clearly define versioned inputs, explicit CLI paths, and compiler validation. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] [VERIFIED: codebase read]
- Pitfalls: HIGH for project-specific pitfalls; MEDIUM for external fragrance taxonomy pitfalls because classification systems vary. [CITED: .planning/phases/08-taxonomy-seed-expansion-curation/08-CONTEXT.md] [CITED: https://perfumesociety.org/fragrance-families/]

**Research date:** 2026-05-22  
**Valid until:** 2026-06-21 for project architecture; 2026-05-29 for npm latest-version observations. [ASSUMED]
