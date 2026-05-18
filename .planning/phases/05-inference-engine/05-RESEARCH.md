# Phase 5: Inference Engine - Research

**Researched:** 2026-05-18
**Domain:** TypeScript zero-runtime-dependency semantic inference over curated taxonomy seed + Phase 4 corpus analytics
**Confidence:** HIGH for project constraints and code integration; MEDIUM for heuristic scoring defaults that are user-locked but not yet empirically tuned

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Seed Authority & Corpus Inference
- **INFR-D-01:** O seed manual é a fonte curada de verdade (`curated truth`) e NUNCA deve ser sobrescrito automaticamente por evidência do corpus.
- **INFR-D-02:** Phase 5 pode criar `inferred descriptors`, `inferred clusters` e `candidate relations` a partir do corpus quando houver frequência suficiente e evidência estatística relevante.
- **INFR-D-03:** Todo item inferido do corpus DEVE ser marcado explicitamente como `inferred`, `corpus_derived` ou `candidate` e mantido separado do seed.
- **INFR-D-04:** Descriptors inferidos NÃO são promovidos automaticamente para a taxonomia curada. Eles podem aparecer em outputs paralelos como `inferred_descriptors`, `suggested_nodes`, `candidate_relations` ou `review_queue`.
- **INFR-D-05:** Conflitos entre seed e corpus viram itens estruturados de `review_queue`, não mutações automáticas.
- **INFR-D-06:** Clustering deve seguir abordagem híbrida: seed-anchored quando houver âncora clara, mas permitindo buckets/grupos inferidos para corpus-native clusters fortes que ainda precisam de revisão.
- **INFR-D-07:** Alias candidates da Phase 4 são apenas weak evidence. Nunca fazer auto-merge de alias candidates em canonical descriptors.

#### Semantic Noise
- **INFR-D-08:** Semantic noise (`note`, `nuance`, `effect`, `type`, `quality`, etc.) deve ser downweighted, não removido. A inferência preserva traceability e reduz influência no scoring/clustering.
- **INFR-D-09:** A lista inicial de ruído semântico deve ser híbrida: curated noise list explícita + sugestões corpus-derived para revisão. Sugestões do corpus não são auto-aplicadas sem review.
- **INFR-D-10:** Seed descriptors têm exceção contra downweight automático. Se um seed descriptor coincidir com heurística de ruído, preservar o peso semântico e emitir audit warning/review signal.
- **INFR-D-11:** Decisions de downweight/noise devem ser expostas em audit/review output com termo, peso aplicado e motivo.

#### Similarity Dimensions
- **INFR-D-12:** `tradition_score` em v1 combina três sinais separados: curated relations, seed proximity e corpus support.
- **INFR-D-13:** Curated relations e seed proximity têm prioridade sobre corpus evidence quando houver conflito. Corpus support sozinho não redefine tradição curada.
- **INFR-D-14:** Sinais de tradition NÃO devem ser misturados de forma opaca. Cada edge deve preservar dimension scores separados para revisão.
- **INFR-D-15:** `accord compatibility` começa em v1 como curated accord map. Co-occurrence pode apoiar a decisão, mas não define accord compatibility sozinho.
- **INFR-D-16:** O `final_score` deve ser configurável por weights puros/opcionais. Default esperado: semantic-primary, com tradition/accord como modificadores significativos.
- **INFR-D-17:** Missing curated data para tradition/accord é `neutral`/`undefined`, não penalidade e não zero automático.

#### Explainability & Review Outputs
- **INFR-D-18:** Similarity edges devem carregar evidence summary compacto: final score, dimension scores e evidências resumidas como shared descriptors, co-occurrence support e curated relation/accord reference quando existir.
- **INFR-D-19:** Descriptor clusters devem incluir cluster evidence: representative descriptors, seed anchor quando houver, corpus support e resumo do motivo de membership.
- **INFR-D-20:** `review_queue` deve guardar explicação rica, conflitos e sugestões de curadoria. Itens devem identificar tipo, descriptors/subfamilies afetados, evidência e suggested action.
- **INFR-D-21:** Phase 5 pode manter ambos: campos compactos e estáveis em edges/clusters para consumo futuro, e review data rica para auditoria/tuning. Phase 6 decide o limite final dos artifacts públicos.

#### Scoring Defaults & Sparse Graph
- **INFR-D-22:** Default score weights v1 devem ser semantic-primary: `semantic_overlap = 0.50`, `tradition = 0.25`, `accord_compatibility = 0.15`, `alias_evidence = 0.10`. Weights devem ser configuráveis via pure options.
- **INFR-D-23:** Todos os dimension scores e o `final_score` DEVEM ser normalizados para escala `[0, 1]`.
- **INFR-D-24:** Missing optional curated dimensions são `undefined`/neutral. O cálculo do final score DEVE renormalizar pesos sobre as dimensões disponíveis e NUNCA tratar missing curated data como zero automático.
- **INFR-D-25:** Similarity graph v1 emite apenas sparse edges com `final_score > 0.25` por default. O threshold é estrito: edges com `final_score === 0.25` são excluídas por default. O threshold é configurável e aplicado depois do final scoring, não dentro dos calculators individuais de dimensão.
- **INFR-D-26:** Curated tradition/accord data deve ser input explícito de dados, não hardcoded dentro das scoring functions.

### the agent's Discretion
- Escolha exata dos thresholds para "frequência suficiente" e "evidência estatística relevante", desde que defaults sejam determinísticos, testáveis e documentados.
- Shape exato de `review_queue`, `inferred_descriptors`, `candidate_relations` e cluster evidence, desde que preserve as informações exigidas acima.
- Fórmula exata de combinação ponderada, desde que respeite os default weights em INFR-D-22, renormalização em INFR-D-24 e dimension scores separados.
- Organização interna dos módulos em `src/inference/` ou equivalente.

### Deferred Ideas (OUT OF SCOPE)
- Auto-promotion of inferred descriptors into the seed remains out of scope.
- Automatic taxonomy rewrites remain out of scope.
- Full trace explainability is not default v1; compact evidence summaries plus rich review queue are enough for this phase.
- Final public artifact boundary belongs to Phase 6.
- Advanced graph clustering beyond v1 descriptor clustering remains out of scope.
- Accord generation is out of scope; Phase 5 consumes curated accord data instead of generating it automatically.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFR-01 | Seed hierarchy merged with corpus frequency data | Use `TaxonomySeed` + `CorpusAnalysis.frequency`; preserve seed as curated truth and emit corpus/inferred data separately. [VERIFIED: codebase `.planning/REQUIREMENTS.md`, `src/types/seed.ts`, `src/types/analysis.ts`, `05-CONTEXT.md`] |
| INFR-02 | Descriptors clustered based on co-occurrence and similarity | Use Phase 4 sparse co-occurrence pair keys and similarity primitives; implement deterministic seed-anchored + corpus-native buckets. [VERIFIED: codebase `src/analyzer/cooccurrence.ts`, `src/analyzer/similarity/*`, `05-CONTEXT.md`] |
| INFR-03 | Similarity inference computes semantic overlap between subfamilies | Build subfamily descriptor profiles, compute weighted overlap over seed descriptors plus corpus evidence, and retain dimension scores. [VERIFIED: codebase `src/types/similarity.ts`, `05-CONTEXT.md`] |
| INFR-04 | Similarity inference incorporates accord compatibility and tradition | Add explicit curated data inputs for tradition/accord and combine available dimensions with weight renormalization. [VERIFIED: codebase `05-CONTEXT.md`, `.planning/PROJECT.md`] |
</phase_requirements>

## Summary

Phase 5 should add a pure `src/inference/` layer that consumes Phase 4's `CorpusAnalysis` in memory, never by mandatory file IO, and produces reviewable inference structures plus a sparse subfamily similarity graph. [VERIFIED: codebase `.planning/phases/04-corpus-analysis/04-CONTEXT.md`, `src/analyzer/analyze_corpus.ts`, `05-CONTEXT.md`] The core planning split should match the roadmap: Plan 05-01 builds seed/corpus merge, noise weighting, and descriptor clustering; Plan 05-02 builds multi-dimensional subfamily scoring and thresholded graph output. [VERIFIED: codebase `.planning/ROADMAP.md`]

No runtime packages should be added. [VERIFIED: codebase `.planning/PROJECT.md`, `src/package.json`] Existing Phase 4 assets already provide normalized frequency, sparse co-occurrence, alias candidates, Levenshtein, token Jaccard, pair-key helpers, deterministic export patterns, and tests. [VERIFIED: codebase `src/analyzer/*`, `src/tests/analysis/*`] The highest-risk planning point is not algorithm availability; it is preserving the boundary between curated seed truth and corpus-derived candidates while keeping every score explainable and deterministic. [VERIFIED: codebase `05-CONTEXT.md`]

**Primary recommendation:** Implement deterministic pure inference calculators with explicit option/data inputs, compact evidence summaries on graph edges, and rich review outputs for candidates/conflicts/noise rather than mutating the seed. [VERIFIED: codebase `05-CONTEXT.md`, `.planning/PROJECT.md`]

## Project Constraints (from AGENTS.md)

No `AGENTS.md` file exists at repository root, so no additional AGENTS directives were found. [VERIFIED: codebase read attempt returned file-not-found]

Project-local skill directories `.claude/skills/` and `.agents/skills/` were not present. [VERIFIED: codebase glob]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Merge seed hierarchy with corpus frequency | Backend / offline builder | Database / Storage as future artifact persistence | This project is a builder-first Node/TypeScript pipeline producing JSON artifacts, not a runtime API. [VERIFIED: codebase `.planning/PROJECT.md`, `.planning/ROADMAP.md`] |
| Descriptor clustering | Backend / offline builder | — | Clustering is pure computation over seed + Phase 4 maps and should live in `src/inference/`. [VERIFIED: codebase `05-CONTEXT.md`] |
| Multi-dimensional subfamily similarity | Backend / offline builder | — | Scoring combines semantic/tradition/accord/alias dimensions and emits sparse graph edges for Phase 6. [VERIFIED: codebase `05-CONTEXT.md`, `src/types/similarity.ts`] |
| Curated tradition/accord data | Database / Storage as versioned JSON inputs | Backend / offline builder validates/consumes | Decisions require explicit data inputs such as `data/inference/curated_relations.v1.json` and `accord_map.v1.json`, not hardcoded calculators. [VERIFIED: codebase `05-CONTEXT.md`] |
| Review queue and audit evidence | Backend / offline builder | Database / Storage as future exported artifacts | Phase 5 creates reviewable structures; Phase 6 decides public artifact boundaries. [VERIFIED: codebase `05-CONTEXT.md`] |

## Standard Stack

### Core

| Library / Runtime | Version | Purpose | Why Standard |
|-------------------|---------|---------|--------------|
| Node.js | local `v24.14.0` | Execute ESM TypeScript tooling and future builder scripts | Current environment runs the existing test/build toolchain. [VERIFIED: local command] |
| TypeScript | locked `5.9.3`; npm latest `6.0.3` modified 2026-04-16 | Strict type checking with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` | Project uses TS strict mode in `src/tsconfig.json`. [VERIFIED: codebase + npm registry] |
| Vitest | locked `3.2.4`; npm latest `4.1.6` modified 2026-05-11 | Unit/stress/property tests | Existing config includes `tests/**/*.test.ts`; Vitest supports `defineConfig`, `describe`, `it`, and `expect`. [VERIFIED: codebase + npm registry] [CITED: https://github.com/vitest-dev/vitest/blob/main/README.md] |
| Node built-ins only | N/A | File IO in later compiler/export work; no runtime deps for inference | Zero runtime dependencies are a project constraint. [VERIFIED: codebase `.planning/PROJECT.md`, `src/package.json`] |

### Supporting

| Existing Module | Version | Purpose | When to Use |
|-----------------|---------|---------|-------------|
| `src/analyzer/analyze_corpus.ts` | local | Top-level Phase 4 source of `frequency`, `cooccurrence`, `aliasCandidates` | Feed inference from in-memory analytics. [VERIFIED: codebase] |
| `src/analyzer/pair_key.ts` | local | Decode sparse co-occurrence keys `${a}|${b}` | Any score using descriptor pair co-occurrence. [VERIFIED: codebase] |
| `src/analyzer/similarity/token_overlap.ts` | local | Token Jaccard primitive | Alias/descriptor lexical overlap only; do not confuse with subfamily semantic overlap. [VERIFIED: codebase] |
| `src/normalizer/normalize_descriptor.ts` | local | Canonical descriptor normalization | Normalize any curated relation/accord descriptor references before lookup. [VERIFIED: codebase] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Handwritten deterministic clustering | `ml-kmeans`, graph/community packages | Rejected for v1 because project requires zero runtime dependencies and small taxonomy scale. [VERIFIED: codebase `.planning/PROJECT.md`] |
| Persisted Phase 4 JSONs as mandatory inputs | Direct `CorpusAnalysis` function input | Rejected as default because Phase 4 states persistence is optional and computation APIs return pure in-memory structures. [VERIFIED: codebase `.planning/phases/04-corpus-analysis/04-CONTEXT.md`] |
| Dense similarity matrix | Sparse adjacency graph | Rejected because v1 output requires sparse graph with threshold `>0.25`. [VERIFIED: codebase `.planning/PROJECT.md`, `05-CONTEXT.md`] |

**Installation:**
```bash
# No runtime install for Phase 5.
# Existing dev toolchain already lives under src/package.json.
```

**Version verification:**
```bash
cd src
npm view typescript version time.modified
npm view vitest version time.modified
npm view @types/node version time.modified
```

## Package Legitimacy Audit

Phase 5 should not install external runtime packages. [VERIFIED: codebase `.planning/PROJECT.md`, `src/package.json`] Existing dev dependencies were verified via npm registry and package lock, but no new package legitimacy gate is required unless a later plan proposes new installs. [VERIFIED: npm registry + codebase `src/package-lock.json`]

| Package | Registry | Locked Version | Latest Checked | Source Repo | slopcheck | Disposition |
|---------|----------|----------------|----------------|-------------|-----------|-------------|
| `typescript` | npm | 5.9.3 | 6.0.3 | official npm package | Not run — no install proposed | Existing dev dependency only |
| `vitest` | npm | 3.2.4 | 4.1.6 | official docs via Context7 | Not run — no install proposed | Existing dev dependency only |
| `@types/node` | npm | 25.7.0 | 25.9.0 | DefinitelyTyped package | Not run — no install proposed | Existing dev dependency only |

**Packages removed due to slopcheck [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** none.

## Architecture Patterns

### System Architecture Diagram

```text
TaxonomySeed + DescriptorAliasSeed + CorpusAnalysis
        |
        v
Normalize/Index seed descriptors and Phase 4 maps
        |
        +--> Seed/corpus merge profile builder
        |       |-- seed descriptors stay source='seed'
        |       |-- corpus-only descriptors become inferred/candidate
        |       '-- conflicts/noise warnings -> review_queue
        |
        +--> Descriptor clustering
        |       |-- seed-anchored clusters when descriptor links to seed
        |       '-- corpus-native clusters when co-occurrence support passes threshold
        |
        +--> Subfamily scoring
                |-- semantic_overlap dimension
                |-- tradition dimension from explicit curated relations + seed proximity + corpus support
                |-- accord_compatibility from explicit accord map
                '-- alias_evidence weak modifier
        |
        v
Weighted final_score with available-dimension renormalization
        |
        v
Filter final_score > threshold (default 0.25)
        |
        v
SimilarityGraph + InferenceReviewOutput for Phase 6
```

### Recommended Project Structure

```text
src/
├── inference/
│   ├── index.ts                    # barrel exports
│   ├── types.ts                    # inference-only evidence/review types if not placed in src/types
│   ├── seed_profile.ts             # seed + frequency merge, descriptor indexing
│   ├── noise.ts                    # downweight rules + audit warnings
│   ├── descriptor_clusters.ts      # seed-anchored and corpus-native clusters
│   ├── semantic_overlap.ts         # subfamily semantic dimension
│   ├── tradition_score.ts          # curated/seed/corpus tradition signals
│   ├── accord_compatibility.ts     # curated accord map scoring
│   ├── alias_evidence.ts           # weak alias candidate dimension
│   ├── final_score.ts              # weight renormalization + thresholding
│   └── build_similarity_graph.ts   # orchestration to SimilarityGraph
├── types/
│   ├── inference.ts                # stable exported inference/review types
│   └── similarity.ts               # extend evidence-capable sparse edge shape
└── tests/
    └── inference/                  # unit/property/stress tests for Phase 5
```

### Pattern 1: Pure Option-Driven Calculators

**What:** Each dimension calculator accepts explicit data/options and returns normalized score plus evidence. [VERIFIED: codebase `05-CONTEXT.md`]

**When to use:** Use for `semantic_overlap`, `tradition_score`, `accord_compatibility`, `alias_evidence`, and final scoring. [VERIFIED: codebase `05-CONTEXT.md`]

**Example:**
```typescript
// Source: project pattern from src/analyzer/analyze_corpus.ts + INFR-D-22/24/25
export type ScoreWeights = Readonly<Record<'semantic_overlap' | 'tradition' | 'accord_compatibility' | 'alias_evidence', number>>

export const combineScores = (
  dimensions: Readonly<Record<string, number | undefined>>,
  weights: ScoreWeights,
): number => {
  let weightedSum = 0
  let availableWeight = 0

  for (const [id, score] of Object.entries(dimensions)) {
    const weight = weights[id as keyof ScoreWeights] ?? 0
    if (score !== undefined) {
      weightedSum += score * weight
      availableWeight += weight
    }
  }

  return availableWeight === 0 ? 0 : weightedSum / availableWeight
}
```

### Pattern 2: Deterministic Sparse Pair Iteration

**What:** Generate unique subfamily pairs once, sort lexicographically, score, then filter `final_score > 0.25`. [VERIFIED: codebase `src/analyzer/pair_key.ts`, `05-CONTEXT.md`]

**When to use:** Similarity graph construction and descriptor-pair lookups. [VERIFIED: codebase `src/types/similarity.ts`]

**Example:**
```typescript
// Source: project pattern from src/analyzer/cooccurrence.ts and pair_key.ts
export const buildPairs = (ids: readonly string[]): readonly (readonly [string, string])[] => {
  const sorted = [...ids].sort((a, b) => a.localeCompare(b))
  const pairs: (readonly [string, string])[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]
    if (a === undefined) continue
    for (let j = i + 1; j < sorted.length; j++) {
      const b = sorted[j]
      if (b !== undefined) pairs.push([a, b])
    }
  }
  return pairs
}
```

### Anti-Patterns to Avoid

- **Mutating the seed with corpus discoveries:** violates curated-truth decisions; emit inferred/candidate/review outputs instead. [VERIFIED: codebase `05-CONTEXT.md`]
- **Treating missing tradition/accord as zero:** violates neutral/undefined rule and will under-score under-curated pairs. [VERIFIED: codebase `05-CONTEXT.md`]
- **Filtering semantic noise out of evidence maps:** decisions require downweighting plus audit trace, not removal. [VERIFIED: codebase `05-CONTEXT.md`]
- **Hardcoding perfumery tradition/accord inside functions:** decisions require explicit input data files/options. [VERIFIED: codebase `05-CONTEXT.md`]
- **Using dense N² matrix as emitted artifact:** project output is sparse adjacency. [VERIFIED: codebase `.planning/PROJECT.md`, `src/types/similarity.ts`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Corpus frequency/co-occurrence extraction | New analyzer pass | `analyzeCorpus` / `computeFrequencyAndCoOccurrence` | Phase 4 already implemented and tested it. [VERIFIED: codebase] |
| Pair key parsing | Ad hoc string splitting everywhere | `decodePairKey` / `encodePairKey` | Existing key format is documented and collision-safe for canonical descriptors. [VERIFIED: codebase `src/types/analysis.ts`, `src/analyzer/pair_key.ts`] |
| Alias evidence | Automatic alias merge | Treat `AliasCandidate` as weak dimension/review evidence | Locked decisions prohibit auto-merge. [VERIFIED: codebase `05-CONTEXT.md`] |
| Test framework | Custom harness | Vitest | Existing 181 tests pass with Vitest; docs confirm TypeScript test support. [VERIFIED: local command] [CITED: https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/writing-tests.md] |

**Key insight:** v1 needs transparent, deterministic heuristics over small curated structures more than sophisticated dependencies; the planner should allocate work to type contracts, evidence shape, tests, and boundary preservation. [VERIFIED: codebase `.planning/PROJECT.md`, `05-CONTEXT.md`]

## Common Pitfalls

### Pitfall 1: Seed/corpus authority leak
**What goes wrong:** Corpus-only descriptors overwrite or silently enter curated seed descriptors. [VERIFIED: codebase `05-CONTEXT.md`]
**Why it happens:** Merge code treats source maps as one canonical registry. [ASSUMED]
**How to avoid:** Keep `source: 'seed' | 'corpus' | 'inferred'` or explicit candidate flags in output types. [VERIFIED: codebase `src/types/taxonomy.ts`, `05-CONTEXT.md`]
**Warning signs:** Tests assert only counts/scores, not source labels or review items. [ASSUMED]

### Pitfall 2: Missing data becomes accidental penalty
**What goes wrong:** A pair lacking accord/tradition entries receives `0`, suppressing valid semantic edges. [VERIFIED: codebase `05-CONTEXT.md`]
**Why it happens:** Numeric defaults are easier than `undefined` optionals under strict TS. [ASSUMED]
**How to avoid:** Dimension calculators return `undefined` for missing optional curated dimensions; `combineScores` renormalizes by available weights. [VERIFIED: codebase `05-CONTEXT.md`]

### Pitfall 3: Noise removal breaks traceability
**What goes wrong:** Generic terms disappear, making audit and review impossible. [VERIFIED: codebase `05-CONTEXT.md`]
**Why it happens:** Phase 4 deferred semantic stopwords, so Phase 5 may be tempted to filter them early. [VERIFIED: codebase `.planning/phases/04-corpus-analysis/04-CONTEXT.md`]
**How to avoid:** Apply weights and emit audit records containing term, weight, and reason. [VERIFIED: codebase `05-CONTEXT.md`]

### Pitfall 4: Threshold applied inside dimensions
**What goes wrong:** Individual calculators suppress evidence before final weighted scoring. [VERIFIED: codebase `05-CONTEXT.md`]
**Why it happens:** Developers optimize sparse output too early. [ASSUMED]
**How to avoid:** Compute all dimension evidence first, combine, then apply strict `final_score > 0.25`. [VERIFIED: codebase `05-CONTEXT.md`]

## Code Examples

### Vitest Unit Test Pattern
```typescript
// Source: Context7 / Vitest README + existing src/tests/analysis/*.test.ts
import { describe, expect, it } from 'vitest'

describe('final score', () => {
  it('renormalizes over available dimensions', () => {
    expect(combineScores(
      { semantic_overlap: 0.5, tradition: undefined, accord_compatibility: undefined, alias_evidence: 0.25 },
      { semantic_overlap: 0.5, tradition: 0.25, accord_compatibility: 0.15, alias_evidence: 0.1 },
    )).toBeCloseTo(((0.5 * 0.5) + (0.25 * 0.1)) / 0.6)
  })
})
```

### Strict Threshold Pattern
```typescript
// Source: INFR-D-25
export const shouldKeepEdge = (finalScore: number, threshold = 0.25): boolean => {
  return finalScore > threshold
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Semantic stopword removal during analysis | Preserve all descriptors in Phase 4; downweight/audit noise in Phase 5 | Phase 4 decision ANAL-D-12 and Phase 5 decisions INFR-D-08..11 | Plan tests for weighting and warnings, not deletion. [VERIFIED: codebase] |
| Single opaque similarity score | Dimension scores + evidence summary + final score | Phase 5 decisions INFR-D-14 and INFR-D-18 | Similarity edges need expanded evidence shape. [VERIFIED: codebase] |
| Mandatory persisted analysis artifacts | Pure in-memory `CorpusAnalysis`, optional persistence | Phase 4 decision ANAL-D-13 | Phase 5 API should accept structures, not paths only. [VERIFIED: codebase] |

**Deprecated/outdated:**
- Auto-promoting alias candidates to canonical descriptors is out of scope and conflicts with Phase 4/5 decisions. [VERIFIED: codebase `.planning/phases/04-corpus-analysis/04-CONTEXT.md`, `05-CONTEXT.md`]
- Dense matrix output is out of scope; sparse graph output is required. [VERIFIED: codebase `.planning/PROJECT.md`, `src/types/similarity.ts`]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Implementation bugs are likely to come from accidentally mixing seed and corpus registries. | Common Pitfalls | Planner may under-test source-label preservation. |
| A2 | Numeric defaults may tempt developers to use zero for missing optional dimensions. | Common Pitfalls | Planner may miss undefined/renormalization test cases. |
| A3 | Developers may optimize sparse output too early by thresholding inside dimensions. | Common Pitfalls | Planner may produce edges with missing evidence or non-reviewable scoring. |

## Open Questions (RESOLVED)

1. **What exact data shape should curated relations and accord map use?**
   - RESOLVED: Phase 5 will create explicit minimal versioned JSON inputs under `data/inference/`, not hardcoded calculator constants. [VERIFIED: codebase `05-CONTEXT.md`]
   - RESOLVED schema for `data/inference/curated_relations.v1.json`: `{ "version": "1.0.0", "relations": [] }`, where future relation entries are objects with `source_subfamily_id`, `target_subfamily_id`, `relation`, optional `score`, and optional `evidence`. [ASSUMED: schema chosen under agent discretion]
   - RESOLVED schema for `data/inference/accord_map.v1.json`: `{ "version": "1.0.0", "accords": [] }`, where future accord entries are objects with `source_subfamily_id`, `target_subfamily_id`, `accord`, optional `score`, and optional `reference`. [ASSUMED: schema chosen under agent discretion]
   - Resolution impact: Plan 05-02 owns these minimal data files and type/evidence contracts; Plan 05-03 consumes them only through explicit function inputs. [VERIFIED: revised plans]
2. **What thresholds define corpus-native cluster strength?**
   - RESOLVED: Defaults are deterministic and option-driven: `minCorpusFrequency: 2`, `minCoOccurrence: 2`, and `minSimilarity: 0.55` for descriptor-level lexical/token similarity membership. [ASSUMED: defaults chosen under agent discretion]
   - RESOLVED: Co-occurrence and similarity are both membership signals for INFR-02; tests must prove a descriptor can join a cluster by co-occurrence support and another can join by similarity support when co-occurrence alone is insufficient. [VERIFIED: revised Plan 05-01]
   - RESOLVED: Corpus-derived semantic noise suggestions are review-only: frequent generic corpus terms may be emitted as `review_queue`/noise audit suggestions with `auto_applied: false`, but only the curated noise list drives automatic downweighting unless the user later reviews and promotes a suggestion. [VERIFIED: `05-CONTEXT.md` INFR-D-09]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Build/test/runtime scripts | ✓ | v24.14.0 | None needed. [VERIFIED: local command] |
| npm | Existing scripts and registry checks | ✓ | 11.9.0 | None needed. [VERIFIED: local command] |
| TypeScript compiler | `npm run build` | ✓ | 5.9.3 local lock / npm latest 6.0.3 | Use locked project version for implementation. [VERIFIED: local command + npm registry] |
| Vitest | `npm test` | ✓ | 3.2.4 local lock / npm latest 4.1.6 | Use existing project version. [VERIFIED: local command + npm registry] |
| `data/enriched_materials.json` | Full corpus integration/stress tests | ✓ | file present | Unit fixtures if full corpus is too slow. [VERIFIED: codebase glob] |

**Missing dependencies with no fallback:** none found. [VERIFIED: local commands]

**Missing dependencies with fallback:** none found. [VERIFIED: local commands]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 locked; latest 4.1.6 checked. [VERIFIED: local command + npm registry] |
| Config file | `src/vitest.config.ts` includes `tests/**/*.test.ts`. [VERIFIED: codebase] |
| Quick run command | `cd src && npm test -- tests/inference/final_score.test.ts` after Wave 0 creates files. [ASSUMED] |
| Full suite command | `cd src && npm run build && npm test` — build passed; tests passed 28 files / 181 tests. [VERIFIED: local command] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| INFR-01 | Seed descriptors remain curated while corpus frequency attaches as evidence and corpus-only descriptors become candidates | unit | `cd src && npm test -- tests/inference/seed_profile.test.ts` | ❌ Wave 0 |
| INFR-02 | Descriptor clustering creates seed-anchored clusters and reviewable corpus-native clusters from co-occurrence | unit/property | `cd src && npm test -- tests/inference/descriptor_clusters.test.ts` | ❌ Wave 0 |
| INFR-03 | Semantic overlap between subfamilies is normalized `[0,1]` and deterministic | unit/property | `cd src && npm test -- tests/inference/semantic_overlap.test.ts` | ❌ Wave 0 |
| INFR-04 | Tradition/accord/alias dimensions combine with weight renormalization and preserve dimension evidence | unit | `cd src && npm test -- tests/inference/final_score.test.ts` | ❌ Wave 0 |
| INFR-04 + success criteria | Similarity graph retains only edges with `final_score > 0.25`, excluding exactly `0.25` | unit | `cd src && npm test -- tests/inference/build_similarity_graph.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** run the new concern test file, then `npm run build`. [ASSUMED]
- **Per wave merge:** `cd src && npm run build && npm test`. [VERIFIED: local command]
- **Phase gate:** full suite green before `/gsd-verify-work`. [ASSUMED]

### Wave 0 Gaps
- [ ] `src/tests/inference/seed_profile.test.ts` — covers INFR-01. [ASSUMED]
- [ ] `src/tests/inference/descriptor_clusters.test.ts` — covers INFR-02. [ASSUMED]
- [ ] `src/tests/inference/semantic_overlap.test.ts` — covers INFR-03. [ASSUMED]
- [ ] `src/tests/inference/final_score.test.ts` — covers INFR-04 and INFR-D-22/24/25. [ASSUMED]
- [ ] `src/tests/inference/build_similarity_graph.test.ts` — covers sparse graph success criterion. [ASSUMED]
- [ ] Fixture files under `src/tests/fixtures/inference/` for seed/corpus conflict, noise, missing accord/tradition, and exact-threshold edge. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Offline builder has no auth surface in Phase 5. [VERIFIED: codebase `.planning/PROJECT.md`] |
| V3 Session Management | no | No runtime API/session in scope. [VERIFIED: codebase `.planning/PROJECT.md`] |
| V4 Access Control | no | No multi-user runtime authorization in scope. [VERIFIED: codebase `.planning/PROJECT.md`] |
| V5 Input Validation | yes | Validate/normalize curated relation and accord inputs with pure validators before scoring. [VERIFIED: codebase `05-CONTEXT.md`, `src/normalizer/normalize_descriptor.ts`] |
| V6 Cryptography | no | No secrets/crypto in Phase 5. [VERIFIED: codebase `.planning/PROJECT.md`] |

### Known Threat Patterns for TypeScript Offline Builder

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed JSON/inference data causing invalid scores | Tampering | Strict validators, normalized descriptor IDs, `[0,1]` score checks. [VERIFIED: codebase `05-CONTEXT.md`] |
| Resource exhaustion from dense graph/matrix construction | Denial of Service | Generate unique sparse pairs and filter to adjacency output; do not emit dense matrices. [VERIFIED: codebase `.planning/PROJECT.md`, `05-CONTEXT.md`] |
| Unreviewable corpus-derived mutations | Tampering | Separate inferred/candidate outputs and review queue, never seed mutation. [VERIFIED: codebase `05-CONTEXT.md`] |

## Sources

### Primary (HIGH confidence)
- `05-CONTEXT.md` — locked Phase 5 decisions, boundaries, code context, output expectations.
- `.planning/REQUIREMENTS.md` — INFR-01 through INFR-04.
- `.planning/ROADMAP.md` — Phase 5 split and success criteria.
- `.planning/PROJECT.md` — stack, zero-dependency, sparse graph, pure functional architecture.
- `src/analyzer/*`, `src/types/*`, `src/tests/analysis/*` — actual Phase 4 implementation and established patterns.
- Local commands: `npm run build` passed; `npm test` passed 28 test files / 181 tests.
- npm registry checks: `npm view typescript`, `npm view vitest`, `npm view @types/node`.
- Context7 `/vitest-dev/vitest` — Vitest config and test API snippets.

### Secondary (MEDIUM confidence)
- None used beyond primary verified project sources and official/Context7 Vitest documentation.

### Tertiary (LOW confidence)
- Assumptions listed in the Assumptions Log about likely implementation failure modes and suggested initial threshold strategy.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — project stack and versions verified from codebase, lockfile, local commands, npm registry, and Context7 Vitest docs.
- Architecture: HIGH — Phase 5 context and prior phase contracts explicitly define boundaries and integration points.
- Pitfalls: MEDIUM — most risks derive from locked decisions; causal explanations are implementation-risk assumptions.

**Research date:** 2026-05-18
**Valid until:** 2026-06-17 for project-specific architecture; re-check npm/tool versions before dependency changes.
