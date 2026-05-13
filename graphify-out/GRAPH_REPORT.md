# Graph Report - TaxonomySystem  (2026-05-13)

## Corpus Check
- 32 files · ~6,228 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 233 nodes · 436 edges · 21 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b8ddcbeb`
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

## God Nodes (most connected - your core abstractions)
1. `clamp01()` - 16 edges
2. `toFiniteNumber()` - 16 edges
3. `normalizeFinite()` - 12 edges
4. `weightedAverage()` - 11 edges
5. `calculateVolatility()` - 11 edges
6. `calculateTenacity()` - 11 edges
7. `validate_seed()` - 10 edges
8. `mergeWeights()` - 10 edges
9. `normalize()` - 9 edges
10. `MaterialInput` - 8 edges

## Surprising Connections (you probably didn't know these)
- `load_taxonomy_seed()` --calls--> `validate_seed()`  [EXTRACTED]
  src/loader/seed_loader.ts → src/loader/seed_validator.ts
- `validate_seed()` --calls--> `make_result()`  [EXTRACTED]
  src/loader/seed_validator.ts → src/loader/types.ts
- `validate_seed()` --calls--> `make_error()`  [EXTRACTED]
  src/loader/seed_validator.ts → src/loader/types.ts
- `weightedAverage()` --calls--> `clamp01()`  [EXTRACTED]
  engine_calcula_tenacidade_volatilidade/src/engine/weights.ts → engine_calcula_tenacidade_volatilidade/src/utils.ts
- `calculateTenacity()` --calls--> `clamp01()`  [EXTRACTED]
  engine_calcula_tenacidade_volatilidade/src/engine/tenacity.ts → engine_calcula_tenacidade_volatilidade/src/utils.ts

## Communities (21 total, 0 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.24
Nodes (25): calculateMaterialScores(), classifyNote(), NormalizationRange, normalize(), normalizeFinite(), calculateTenacity(), calculateVolatility(), normalizeVaporPressure() (+17 more)

### Community 1 - "Core Types"
Cohesion: 0.07
Nodes (26): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, 🧠 3. SIMILARITY MATRIX, ⚠️ ALIAS RULES, code:txt (family), code:txt (floral), code:txt (floral_white), code:txt (powdery) (+18 more)

### Community 2 - "Weight Configuration"
Cohesion: 0.09
Nodes (22): Calcula Formula Engine, code:bash (npm install), code:bash (npm test), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateVolatility, calculateTenacity } from './sr), code:ts (import { classifyNote } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine') (+14 more)

### Community 3 - "Tenacity Calculation"
Cohesion: 0.1
Nodes (20): API Reference, `calculateMaterialScores(input, options?)`, `calculateTenacity(input, customWeights?)`, `calculateVolatility(input, customWeights?)`, `classifyNote(volatilityScore)`, code:ts (type MaterialInput = {), code:ts (type EngineOutput = {), code:ts (calculateMaterialScores(input: MaterialInput, options?: Engi) (+12 more)

### Community 4 - "Engine Tests"
Cohesion: 0.19
Nodes (12): load_taxonomy_seed(), SeedLoadError, SeedParseError, SeedValidationError, __dirname, __filename, fixtures_dir, malformedPath (+4 more)

### Community 5 - "Volatility Calculation"
Cohesion: 0.18
Nodes (11): load_corpus(), map_olfactory_profile(), map_to_corpus_material(), __dirname, __filename, fixtures_dir, keys, malformedPath (+3 more)

### Community 6 - "Test Configuration"
Cohesion: 0.29
Nodes (10): is_non_empty_string(), is_snake_case(), validate_seed(), make_error(), make_result(), ValidationError, ValidationResult, invalid (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (11): 1) Material leve e volatil, 2) Material pesado e tenaz, 3) Dados faltantes, 4) Pesos customizados, 5) Classificacao de nota, code:ts (import { calculateVolatility } from '../src/engine'), code:ts (import { calculateTenacity } from '../src/engine'), code:ts (import { calculateMaterialScores } from '../src/engine') (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (10): Arquitetura, Decisoes de Robustez, Modulos, `src/engine/index.ts`, `src/engine/normalization.ts`, `src/engine/tenacity.ts`, `src/engine/volatility.ts`, `src/engine/weights.ts` (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.39
Nodes (7): CorpusMaterial, MaterialClassification, MaterialIdentifiers, MaterialIdentity, MaterialUsage, MolecularProperties, OlfactoryProfile

### Community 10 - "Community 10"
Cohesion: 0.43
Nodes (6): CanonicalDescriptor, CompiledTaxonomy, DescriptorAliasMap, TaxonomyFamily, TaxonomyStats, TaxonomySubfamily

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (6): Checklist rapido, code:bash (npm test), Comandos de verificacao, Garantias funcionais, Resultado esperado, Validacao

### Community 12 - "Community 12"
Cohesion: 0.53
Nodes (4): SimilarityDimension, SimilarityEdge, SimilarityGraph, SimilarityStats

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

## Knowledge Gaps
- **57 isolated node(s):** `code:txt (family)`, `⚠️ IMPORTANT CONSTRAINT`, `📦 REQUIRED OUTPUTS`, `🧠 1. TAXONOMY STRUCTURE`, `code:txt (floral)` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validate_seed()` connect `Test Configuration` to `Engine Tests`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `code:txt (family)`, `⚠️ IMPORTANT CONSTRAINT`, `📦 REQUIRED OUTPUTS` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Weight Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Tenacity Calculation` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._