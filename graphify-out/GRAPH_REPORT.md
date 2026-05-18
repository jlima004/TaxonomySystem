# Graph Report - TaxonomySystem  (2026-05-17)

## Corpus Check
- 64 files · ~9,874 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 328 nodes · 561 edges · 25 communities (24 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d120c2f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Utilities & Normalization|Utilities & Normalization]]
- [[_COMMUNITY_Core Types|Core Types]]
- [[_COMMUNITY_Weight Configuration|Weight Configuration]]
- [[_COMMUNITY_Tenacity Calculation|Tenacity Calculation]]
- [[_COMMUNITY_Engine Tests|Engine Tests]]
- [[_COMMUNITY_Volatility Calculation|Volatility Calculation]]
- [[_COMMUNITY_Test Configuration|Test Configuration]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `clamp01()` - 16 edges
2. `toFiniteNumber()` - 16 edges
3. `normalizeFinite()` - 12 edges
4. `weightedAverage()` - 11 edges
5. `calculateVolatility()` - 11 edges
6. `calculateTenacity()` - 11 edges
7. `mergeWeights()` - 10 edges
8. `normalizeDescriptor()` - 9 edges
9. `normalize()` - 9 edges
10. `runPipeline()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `runPipeline()` --calls--> `collapseUnderscores()`  [EXTRACTED]
  tests/normalization/trace.test.ts → normalizer/collapse_underscores.ts
- `runPipeline()` --calls--> `normalizeCase()`  [EXTRACTED]
  tests/normalization/trace.test.ts → normalizer/normalize_case.ts
- `runPipeline()` --calls--> `normalizeSeparators()`  [EXTRACTED]
  tests/normalization/trace.test.ts → normalizer/normalize_separators.ts
- `runPipeline()` --calls--> `normalizeUnicode()`  [EXTRACTED]
  tests/normalization/trace.test.ts → normalizer/normalize_unicode.ts
- `runPipeline()` --calls--> `removePunctuation()`  [EXTRACTED]
  tests/normalization/trace.test.ts → normalizer/remove_punctuation.ts

## Communities (25 total, 1 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.07
Nodes (29): AliasLoadError, AliasParseError, AliasValidationError, loadAliasSeed(), validateAliasSeed(), loadTaxonomySeed(), SeedLoadError, SeedParseError (+21 more)

### Community 1 - "Core Types"
Cohesion: 0.1
Nodes (25): start, testInputs, canonical, empties, terminals, variants, cases, first (+17 more)

### Community 2 - "Weight Configuration"
Cohesion: 0.24
Nodes (25): calculateMaterialScores(), classifyNote(), NormalizationRange, normalize(), normalizeFinite(), calculateTenacity(), calculateVolatility(), normalizeVaporPressure() (+17 more)

### Community 3 - "Tenacity Calculation"
Cohesion: 0.07
Nodes (26): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, 🧠 3. SIMILARITY MATRIX, ⚠️ ALIAS RULES, code:txt (family), code:txt (floral), code:txt (floral_white), code:txt (powdery) (+18 more)

### Community 4 - "Engine Tests"
Cohesion: 0.08
Nodes (24): 1. Core Types & Validation Refactor, 2. Immutability & Hardening Loaders, 3. Alias Seed System & Descriptor Registry, 4. Tests & Invariants (Edge Cases e Performance), Automated Tests, code:ts (export type DescriptorNode = {), [MODIFY] `src/loader/seed_loader.ts` & `src/loader/corpus_loader.ts`, [MODIFY] `src/loader/seed_validator.ts` (+16 more)

### Community 5 - "Volatility Calculation"
Cohesion: 0.09
Nodes (22): Calcula Formula Engine, code:bash (npm install), code:bash (npm test), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateVolatility, calculateTenacity } from './sr), code:ts (import { classifyNote } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine') (+14 more)

### Community 6 - "Test Configuration"
Cohesion: 0.11
Nodes (15): loadCorpus(), mapOlfactoryProfile(), mapToSemanticMaterial(), __dirname, __filename, fixtures_dir, keys, malformedPath (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (20): API Reference, `calculateMaterialScores(input, options?)`, `calculateTenacity(input, customWeights?)`, `calculateVolatility(input, customWeights?)`, `classifyNote(volatilityScore)`, code:ts (type MaterialInput = {), code:ts (type EngineOutput = {), code:ts (calculateMaterialScores(input: MaterialInput, options?: Engi) (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (11): 1) Material leve e volatil, 2) Material pesado e tenaz, 3) Dados faltantes, 4) Pesos customizados, 5) Classificacao de nota, code:ts (import { calculateVolatility } from '../src/engine'), code:ts (import { calculateTenacity } from '../src/engine'), code:ts (import { calculateMaterialScores } from '../src/engine') (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (10): Arquitetura, Decisoes de Robustez, Modulos, `src/engine/index.ts`, `src/engine/normalization.ts`, `src/engine/tenacity.ts`, `src/engine/volatility.ts`, `src/engine/weights.ts` (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (8): CorpusMaterial, MaterialClassification, MaterialIdentifiers, MaterialIdentity, MaterialUsage, MolecularProperties, OlfactoryProfile, SemanticMaterial

### Community 11 - "Community 11"
Cohesion: 0.43
Nodes (6): CanonicalDescriptor, CompiledTaxonomy, DescriptorAliasMap, TaxonomyFamily, TaxonomyStats, TaxonomySubfamily

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (6): Checklist rapido, code:bash (npm test), Comandos de verificacao, Garantias funcionais, Resultado esperado, Validacao

### Community 13 - "Community 13"
Cohesion: 0.53
Nodes (4): SimilarityDimension, SimilarityEdge, SimilarityGraph, SimilarityStats

### Community 14 - "Community 14"
Cohesion: 0.4
Nodes (4): keys1, keys2, obj1, obj2

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

## Knowledge Gaps
- **119 isolated node(s):** `IRREGULAR_PLURALS`, `PIPELINE`, `NON_PLURAL_TERMINALS`, `testInputs`, `start` (+114 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `IRREGULAR_PLURALS`, `PIPELINE`, `NON_PLURAL_TERMINALS` to the rest of the system?**
  _119 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Utilities & Normalization` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Core Types` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Tenacity Calculation` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Engine Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Volatility Calculation` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Test Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._