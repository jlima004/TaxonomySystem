# Graph Report - TaxonomySystem  (2026-05-22)

## Corpus Check
- 135 files · ~36,121 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 937 nodes · 1921 edges · 51 communities (47 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f830a634`
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

## God Nodes (most connected - your core abstractions)
1. `CorpusAnalysis` - 34 edges
2. `TaxonomySeed` - 32 edges
3. `normalizeDescriptor()` - 22 edges
4. `compileAll()` - 20 edges
5. `buildSimilarityGraph()` - 18 edges
6. `clamp01()` - 16 edges
7. `toFiniteNumber()` - 16 edges
8. `runCompileCli()` - 15 edges
9. `ReviewQueueItem` - 15 edges
10. `encodePairKey()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `compileAll()` --calls--> `compileTaxonomy()`  [EXTRACTED]
  src/compiler/compile_all.ts → compiler/compile_taxonomy.ts
- `buildSimilarityGraph()` --calls--> `makeEmptyCuratedReviewItem()`  [EXTRACTED]
  src/inference/build_similarity_graph.ts → build_similarity_graph.ts
- `buildSimilarityGraph()` --calls--> `computeTraditionScore()`  [EXTRACTED]
  src/inference/build_similarity_graph.ts → tradition_score.ts
- `runCompileCli()` --calls--> `parseCompileArgs()`  [EXTRACTED]
  src/cli/compile.ts → parse_args.ts
- `compileAll()` --calls--> `runArtifactQualityGates()`  [EXTRACTED]
  src/compiler/compile_all.ts → compiler/quality_gates.ts

## Communities (51 total, 4 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.08
Nodes (52): compileAliases(), CompileAliasesOptions, result, seed, compileAll(), CompileAllInputs, CompileAllOptions, CompileAllResult (+44 more)

### Community 1 - "Core Types"
Cohesion: 0.06
Nodes (54): computeAccordCompatibility(), __dirname, __filename, loadFixture(), result, ScoringFixture, assertNonEmptyString(), clamp01() (+46 more)

### Community 2 - "Weight Configuration"
Cohesion: 0.06
Nodes (44): countBy(), countSubfamilies(), exists(), main(), NoiseConfig, printHelp(), printReviewSummary(), printValidationErrors() (+36 more)

### Community 3 - "Tenacity Calculation"
Cohesion: 0.09
Nodes (46): buildSimilarityGraph(), BuildSimilarityGraphOptions, buildSubfamilyProfiles(), computeCooccurrenceSupport(), getDescriptorCooccurrence(), graphDimensions(), makeAliasReviewItem(), makeCorpusSupportMap() (+38 more)

### Community 4 - "Engine Tests"
Cohesion: 0.05
Nodes (38): analysis, first, profileResult, result, second, seedCluster, buildDescriptorClusters(), buildSeedCorpusProfiles() (+30 more)

### Community 5 - "Volatility Calculation"
Cohesion: 0.1
Nodes (25): start, testInputs, canonical, empties, terminals, variants, cases, first (+17 more)

### Community 6 - "Test Configuration"
Cohesion: 0.08
Nodes (25): AliasLoadError, AliasParseError, AliasValidationError, loadAliasSeed(), validateAliasSeed(), loadTaxonomySeed(), SeedLoadError, SeedParseError (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (25): calculateMaterialScores(), classifyNote(), NormalizationRange, normalize(), normalizeFinite(), calculateTenacity(), calculateVolatility(), normalizeVaporPressure() (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (30): clamp01(), computeAliasEvidence(), descriptorSet(), __dirname, __filename, leftSnapshot, result, rightSnapshot (+22 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (26): accord, accordInput(), accordMapV2Path, accords, approvedSubfamilyIds, curatedRelationsV2Path, __dirname, __filename (+18 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (22): choosePlacement(), compileTaxonomy(), CompileTaxonomyOptions, CompileTaxonomyResult, getSupport(), Placement, sortLex(), analysis (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.07
Nodes (26): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, 🧠 3. SIMILARITY MATRIX, ⚠️ ALIAS RULES, code:txt (family), code:txt (floral), code:txt (floral_white), code:txt (powdery) (+18 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (19): aliasSeed, AliasSeedFixture, aliasSeedPath, allowedAliases, approvedAliasEntries, ApprovedAliasEntry, approvedAliasMap, compiled (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (24): 1. Core Types & Validation Refactor, 2. Immutability & Hardening Loaders, 3. Alias Seed System & Descriptor Registry, 4. Tests & Invariants (Edge Cases e Performance), Automated Tests, code:ts (export type DescriptorNode = {), [MODIFY] `src/loader/seed_loader.ts` & `src/loader/corpus_loader.ts`, [MODIFY] `src/loader/seed_validator.ts` (+16 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (17): approvals, ApprovedSeedEntry, assertApprovedExpansionTraceability(), countSeedEntries(), DEFERRED_IDS, descriptorKeys(), fixtureV1, fixtureV2 (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (22): Calcula Formula Engine, code:bash (npm install), code:bash (npm test), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateVolatility, calculateTenacity } from './sr), code:ts (import { classifyNote } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine') (+14 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (18): inputs, score, buildDescriptorToFamilies(), buildSeedCanonicalSet(), buildSeedPairSet(), buildTaxonomyDescriptorSet(), findAliasCandidates(), intersects() (+10 more)

### Community 17 - "Community 17"
Cohesion: 0.1
Nodes (20): API Reference, `calculateMaterialScores(input, options?)`, `calculateTenacity(input, customWeights?)`, `calculateVolatility(input, customWeights?)`, `classifyNote(volatilityScore)`, code:ts (type MaterialInput = {), code:ts (type EngineOutput = {), code:ts (calculateMaterialScores(input: MaterialInput, options?: Engi) (+12 more)

### Community 18 - "Community 18"
Cohesion: 0.23
Nodes (14): combineResults(), findNullsDeep(), makeCompilerError(), isNonEmptyString(), isNonNegativeNumber(), isNumberInRange(), artifacts, data (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (14): AnalysisMaterial, candidates, __dirname, __filename, frequency, pair, taxonomySeed, withoutSeed (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.16
Nodes (17): analysis, AnalysisMaterial, descriptors, lexSorted, parsed, path, pathA, pathB (+9 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (14): [a, b], AnalysisMaterial, cooccurrence, corpus, decoded, __dirname, expected, __filename (+6 more)

### Community 22 - "Community 22"
Cohesion: 0.23
Nodes (14): AnalysisMaterial, corpus, direct, __dirname, __filename, first, loadFixture(), result (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.3
Nodes (12): argvFor(), corpus, descriptors, fixtureCorpus, lemon, lemony, logSpy, seed (+4 more)

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (10): buildCuratedAliasMap(), canonicalizeDescriptor(), CuratedAliasAuditEntry, CuratedAliasCanonicalizationResult, hasMapContent(), AnalysisMaterial, computeCoOccurrence(), computeFrequencyAndCoOccurrence() (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.15
Nodes (10): AnalysisMaterial, corpus, __dirname, expected, __filename, frequency, fullFrequency, subset (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.18
Nodes (10): first, input, result, second, DEFAULT_DESCRIPTOR_SANITIZER_RULES, DescriptorSanitizerAuditEntry, DescriptorSanitizerInput, DescriptorSanitizerResult (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (11): 1) Material leve e volatil, 2) Material pesado e tenaz, 3) Dados faltantes, 4) Pesos customizados, 5) Classificacao de nota, code:ts (import { calculateVolatility } from '../src/engine'), code:ts (import { calculateTenacity } from '../src/engine'), code:ts (import { calculateMaterialScores } from '../src/engine') (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (10): 🏗️ Arquitetura em Camadas, code:bash (# Instalar dependências (typescript, vitest)), 🚀 Como Funciona o Builder, Current v1 Status, 📂 Estrutura do Projeto, Executando o Projeto, 🎯 Objetivo (Core Value), Olfactory Taxonomy System (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (10): Arquitetura, Decisoes de Robustez, Modulos, `src/engine/index.ts`, `src/engine/normalization.ts`, `src/engine/tenacity.ts`, `src/engine/volatility.ts`, `src/engine/weights.ts` (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.24
Nodes (8): analysis, corpus, start, createMulberry32(), GenerateOptions, generateSyntheticCorpus(), SyntheticMaterial, VOCABULARY

### Community 31 - "Community 31"
Cohesion: 0.22
Nodes (8): CorpusMaterial, MaterialClassification, MaterialIdentifiers, MaterialIdentity, MaterialUsage, MolecularProperties, OlfactoryProfile, SemanticMaterial

### Community 32 - "Community 32"
Cohesion: 0.25
Nodes (6): __dirname, __filename, first, items, second, workbookPath

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (6): Checklist rapido, code:bash (npm test), Comandos de verificacao, Garantias funcionais, Resultado esperado, Validacao

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (4): keys1, keys2, obj1, obj2

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (3): AliasCandidateOptions, AnalysisMaterial, AnalyzeCorpusOptions

## Knowledge Gaps
- **334 isolated node(s):** `seedV1`, `seedV2`, `corpus`, `aliasSeed`, `noiseConfig` (+329 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `normalizeDescriptor()` connect `Volatility Calculation` to `Tenacity Calculation`, `Community 8`, `Community 16`, `Community 19`, `Community 24`, `Community 25`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `TaxonomySeed` connect `Utilities & Normalization` to `Tenacity Calculation`, `Engine Tests`, `Test Configuration`, `Community 8`, `Community 10`, `Community 16`, `Community 19`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `CorpusAnalysis` connect `Utilities & Normalization` to `Core Types`, `Tenacity Calculation`, `Community 36`, `Engine Tests`, `Community 8`, `Community 10`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `seedV1`, `seedV2`, `corpus` to the rest of the system?**
  _334 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Utilities & Normalization` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Core Types` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Weight Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._