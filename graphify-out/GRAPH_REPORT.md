# Graph Report - TaxonomySystem  (2026-05-21)

## Corpus Check
- 120 files · ~28,570 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 726 nodes · 1266 edges · 52 communities (51 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f044750a`
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
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]

## God Nodes (most connected - your core abstractions)
1. `CorpusAnalysis` - 17 edges
2. `TaxonomySeed` - 17 edges
3. `normalizeDescriptor()` - 16 edges
4. `clamp01()` - 16 edges
5. `toFiniteNumber()` - 16 edges
6. `findAliasCandidates()` - 12 edges
7. `normalizeFinite()` - 12 edges
8. `encodePairKey()` - 11 edges
9. `weightedAverage()` - 11 edges
10. `calculateVolatility()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `buildSeedCorpusProfiles()` --calls--> `scoreSemanticNoise()`  [EXTRACTED]
  seed_profile.ts → noise.ts
- `buildSeedCorpusProfiles()` --calls--> `suggestCorpusSemanticNoise()`  [EXTRACTED]
  seed_profile.ts → noise.ts
- `runPipeline()` --calls--> `collapseUnderscores()`  [EXTRACTED]
  tests/normalization/trace.test.ts → normalizer/collapse_underscores.ts
- `runPipeline()` --calls--> `normalizeCase()`  [EXTRACTED]
  tests/normalization/trace.test.ts → normalizer/normalize_case.ts
- `runPipeline()` --calls--> `normalizeSeparators()`  [EXTRACTED]
  tests/normalization/trace.test.ts → normalizer/normalize_separators.ts

## Communities (52 total, 1 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.05
Nodes (47): compileAliases(), CompileAliasesOptions, result, seed, compileAll(), CompileAllInputs, CompileAllOptions, CompileAllResult (+39 more)

### Community 1 - "Core Types"
Cohesion: 0.1
Nodes (25): start, testInputs, canonical, empties, terminals, variants, cases, first (+17 more)

### Community 2 - "Weight Configuration"
Cohesion: 0.08
Nodes (25): AliasLoadError, AliasParseError, AliasValidationError, loadAliasSeed(), validateAliasSeed(), loadTaxonomySeed(), SeedLoadError, SeedParseError (+17 more)

### Community 3 - "Tenacity Calculation"
Cohesion: 0.24
Nodes (25): calculateMaterialScores(), classifyNote(), NormalizationRange, normalize(), normalizeFinite(), calculateTenacity(), calculateVolatility(), normalizeVaporPressure() (+17 more)

### Community 4 - "Engine Tests"
Cohesion: 0.1
Nodes (27): computeAccordCompatibility(), __dirname, __filename, loadFixture(), result, ScoringFixture, assertNonEmptyString(), clamp01() (+19 more)

### Community 5 - "Volatility Calculation"
Cohesion: 0.07
Nodes (26): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, 🧠 3. SIMILARITY MATRIX, ⚠️ ALIAS RULES, code:txt (family), code:txt (floral), code:txt (floral_white), code:txt (powdery) (+18 more)

### Community 6 - "Test Configuration"
Cohesion: 0.08
Nodes (24): 1. Core Types & Validation Refactor, 2. Immutability & Hardening Loaders, 3. Alias Seed System & Descriptor Registry, 4. Tests & Invariants (Edge Cases e Performance), Automated Tests, code:ts (export type DescriptorNode = {), [MODIFY] `src/loader/seed_loader.ts` & `src/loader/corpus_loader.ts`, [MODIFY] `src/loader/seed_validator.ts` (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (18): inputs, score, buildDescriptorToFamilies(), buildSeedCanonicalSet(), buildSeedPairSet(), buildTaxonomyDescriptorSet(), findAliasCandidates(), intersects() (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (22): Calcula Formula Engine, code:bash (npm install), code:bash (npm test), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateVolatility, calculateTenacity } from './sr), code:ts (import { classifyNote } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine') (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (16): countSubfamilies(), exists(), main(), NoiseConfig, printHelp(), printValidationErrors(), resolveOutputDir(), resolveReadablePath() (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.1
Nodes (20): API Reference, `calculateMaterialScores(input, options?)`, `calculateTenacity(input, customWeights?)`, `calculateVolatility(input, customWeights?)`, `classifyNote(volatilityScore)`, code:ts (type MaterialInput = {), code:ts (type EngineOutput = {), code:ts (calculateMaterialScores(input: MaterialInput, options?: Engi) (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (15): loadCorpus(), mapOlfactoryProfile(), mapToSemanticMaterial(), __dirname, __filename, fixtures_dir, keys, malformedPath (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.16
Nodes (17): analysis, AnalysisMaterial, descriptors, lexSorted, parsed, path, pathA, pathB (+9 more)

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (14): CorpusNoiseSuggestionOptions, looksLikeCorpusNoiseSuggestion(), scoreSemanticNoise(), SemanticNoiseOptions, suggestCorpusSemanticNoise(), toNormalizedSet(), buildSeedCorpusProfiles(), collectSeedDescriptors() (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (14): buildSeedCorpusProfiles(), CorpusNoiseSuggestionOptions, DescriptorClusterOptions, scoreSemanticNoise(), SeedCorpusProfileOptions, SemanticNoiseOptions, suggestCorpusSemanticNoise(), analysis (+6 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (14): clampScore(), combineScores(), DEFAULT_SCORE_WEIGHTS, DIMENSION_KEYS, shouldKeepEdge(), AccordCompatibilityEvidence, DescriptorClusterEvidence, DimensionScore (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (13): [a, b], AnalysisMaterial, cooccurrence, corpus, decoded, __dirname, expected, __filename (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (12): AnalysisMaterial, computeCoOccurrence(), computeFrequencyAndCoOccurrence(), FrequencyAndCoOccurrence, toSortedDescriptorSet(), AnalysisMaterial, computeDescriptorFrequency(), AliasCandidate (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.16
Nodes (12): analysis, corpus, start, AliasCandidateOptions, AnalysisMaterial, analyzeCorpus(), AnalyzeCorpusOptions, createMulberry32() (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.24
Nodes (12): decodePairKey(), buildDescriptorClusters(), ClusterSignal, descriptorSimilarity(), getPairCount(), makeCorpusNativeClusters(), makeReviewQueue(), makeSeedAnchorClusters() (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (12): buildFixtureGraph(), __dirname, edges, emitted, __filename, FixtureAliasCandidate, graph, loadFixture() (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (10): AnalysisMaterial, corpus, __dirname, expected, __filename, frequency, fullFrequency, subset (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (9): analysis, __dirname, __filename, first, result, second, SeedFixture, seedProfile (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (10): analysis, first, profileResult, result, second, seedCluster, buildDescriptorClusters(), DescriptorClusterOptions (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.3
Nodes (11): buildSimilarityGraph(), BuildSimilarityGraphOptions, buildSubfamilyProfiles(), computeCooccurrenceSupport(), getDescriptorCooccurrence(), graphDimensions(), makeAliasReviewItem(), makeCorpusSupportMap() (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.17
Nodes (9): AnalysisMaterial, candidates, __dirname, __filename, frequency, pair, taxonomySeed, withoutSeed (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.17
Nodes (11): 1) Material leve e volatil, 2) Material pesado e tenaz, 3) Dados faltantes, 4) Pesos customizados, 5) Classificacao de nota, code:ts (import { calculateVolatility } from '../src/engine'), code:ts (import { calculateTenacity } from '../src/engine'), code:ts (import { calculateMaterialScores } from '../src/engine') (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (10): 🏗️ Arquitetura em Camadas, code:bash (# Instalar dependências (typescript, vitest)), 🚀 Como Funciona o Builder, Current v1 Status, 📂 Estrutura do Projeto, Executando o Projeto, 🎯 Objetivo (Core Value), Olfactory Taxonomy System (+2 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (9): AnalysisMaterial, __dirname, __filename, first, result, second, snapshot, withAlias (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (10): Arquitetura, Decisoes de Robustez, Modulos, `src/engine/index.ts`, `src/engine/normalization.ts`, `src/engine/tenacity.ts`, `src/engine/volatility.ts`, `src/engine/weights.ts` (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (8): edge, score, ReviewQueueItem, SimilarityDimension, SimilarityEdge, SimilarityEdgeEvidence, SimilarityGraph, SimilarityStats

### Community 31 - "Community 31"
Cohesion: 0.22
Nodes (7): analysis, corpus, dry, profileResult, seed, taxonomy, SeedCorpusProfileResult

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (8): CorpusMaterial, MaterialClassification, MaterialIdentifiers, MaterialIdentity, MaterialUsage, MolecularProperties, OlfactoryProfile, SemanticMaterial

### Community 33 - "Community 33"
Cohesion: 0.25
Nodes (6): __dirname, __filename, result, right, ScoringFixture, DescriptorProfile

### Community 34 - "Community 34"
Cohesion: 0.25
Nodes (6): __dirname, __filename, leftSnapshot, result, rightSnapshot, ScoringFixture

### Community 35 - "Community 35"
Cohesion: 0.29
Nodes (6): Checklist rapido, code:bash (npm test), Comandos de verificacao, Garantias funcionais, Resultado esperado, Validacao

### Community 36 - "Community 36"
Cohesion: 0.53
Nodes (4): SeedMetadata, TaxonomySeed, TaxonomySeedFamily, TaxonomySeedSubfamily

### Community 37 - "Community 37"
Cohesion: 0.6
Nodes (4): clamp01(), computeAliasEvidence(), descriptorSet(), AliasEvidenceScore

### Community 38 - "Community 38"
Cohesion: 0.7
Nodes (4): clamp01(), computeSemanticOverlap(), profileWeights(), SemanticOverlapScore

### Community 39 - "Community 39"
Cohesion: 0.4
Nodes (4): keys1, keys2, obj1, obj2

### Community 40 - "Community 40"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

## Knowledge Gaps
- **284 isolated node(s):** `🎯 Objetivo (Core Value)`, `🏗️ Arquitetura em Camadas`, `📂 Estrutura do Projeto`, `code:bash (# Instalar dependências (typescript, vitest))`, `🛠️ Regras e Convenções do Repositório` (+279 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `normalizeDescriptor()` connect `Core Types` to `Community 7`, `Community 13`, `Community 17`, `Community 21`, `Community 24`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `TaxonomySeed` connect `Community 36` to `Utilities & Normalization`, `Weight Configuration`, `Community 7`, `Community 13`, `Community 14`, `Community 20`, `Community 22`, `Community 24`, `Community 25`, `Community 31`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `CorpusAnalysis` connect `Community 23` to `Utilities & Normalization`, `Community 12`, `Community 13`, `Community 14`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 22`, `Community 24`, `Community 31`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `🎯 Objetivo (Core Value)`, `🏗️ Arquitetura em Camadas`, `📂 Estrutura do Projeto` to the rest of the system?**
  _284 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Utilities & Normalization` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Core Types` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Weight Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._