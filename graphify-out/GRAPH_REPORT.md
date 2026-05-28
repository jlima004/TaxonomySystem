# Graph Report - TaxonomySystem  (2026-05-28)

## Corpus Check
- 137 files · ~39,427 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1101 nodes · 2880 edges · 47 communities (46 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f5839616`
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

## God Nodes (most connected - your core abstractions)
1. `normalizeDescriptor()` - 50 edges
2. `CorpusAnalysis` - 43 edges
3. `TaxonomySeed` - 40 edges
4. `encodePairKey()` - 26 edges
5. `buildSimilarityGraph()` - 23 edges
6. `compileAll()` - 23 edges
7. `runCompileCli()` - 21 edges
8. `ReviewQueueItem` - 20 edges
9. `DescriptorAliasSeed` - 20 edges
10. `SeedCorpusProfileResult` - 17 edges

## Surprising Connections (you probably didn't know these)
- `buildSimilarityGraph()` --calls--> `makeEmptyCuratedReviewItem()`  [EXTRACTED]
  src/inference/build_similarity_graph.ts → build_similarity_graph.ts
- `runCompileCli()` --calls--> `parseCompileArgs()`  [EXTRACTED]
  src/cli/compile.ts → cli/parse_args.ts
- `buildFixtureGraph()` --calls--> `buildSimilarityGraph()`  [INFERRED]
  src/tests/inference/build_similarity_graph.test.ts → src/inference/build_similarity_graph.ts
- `runPipeline()` --calls--> `removePunctuation()`  [EXTRACTED]
  tests/normalization/trace.test.ts → src/normalizer/remove_punctuation.ts
- `runPipeline()` --calls--> `singularize()`  [EXTRACTED]
  tests/normalization/trace.test.ts → src/normalizer/singularize.ts

## Communities (47 total, 1 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.05
Nodes (80): __dirname, __filename, loadFixture(), result, ScoringFixture, clamp01(), computeAliasEvidence(), descriptorSet() (+72 more)

### Community 1 - "Core Types"
Cohesion: 0.06
Nodes (74): compileAliases(), result, seed, compileAll(), CompileAllInputs, CompileAllOptions, CompileAllResult, analysis (+66 more)

### Community 2 - "Weight Configuration"
Cohesion: 0.05
Nodes (75): map, result, [a, b], AnalysisMaterial, cooccurrence, corpus, decoded, __dirname (+67 more)

### Community 3 - "Tenacity Calculation"
Cohesion: 0.06
Nodes (59): countBy(), countSubfamilies(), exists(), main(), NoiseConfig, printHelp(), printReviewSummary(), printValidationErrors() (+51 more)

### Community 4 - "Engine Tests"
Cohesion: 0.08
Nodes (26): start, testInputs, canonical, empties, terminals, variants, cases, first (+18 more)

### Community 5 - "Volatility Calculation"
Cohesion: 0.09
Nodes (50): accord, accordInput(), accordMapV2Path, accords, approvedRound3AccordPairs, approvedRound3RelationPairs, approvedSubfamilyIds, approvedV2SubfamilyIds() (+42 more)

### Community 6 - "Test Configuration"
Cohesion: 0.09
Nodes (26): CompileAliasesOptions, AliasLoadError, AliasParseError, AliasValidationError, validateAliasSeed(), loadTaxonomySeed(), SeedLoadError, SeedParseError (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (34): choosePlacement(), compileTaxonomy(), CompileTaxonomyOptions, CompileTaxonomyResult, getSupport(), Placement, sortLex(), analysis (+26 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (34): buildDescriptorClusters(), ClusterSignal, descriptorSimilarity(), getPairCount(), makeCorpusNativeClusters(), makeReviewQueue(), makeSeedAnchorClusters(), representativeDescriptors() (+26 more)

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (25): calculateMaterialScores(), classifyNote(), NormalizationRange, normalize(), normalizeFinite(), calculateTenacity(), calculateVolatility(), normalizeVaporPressure() (+17 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (30): AnalysisMaterial, candidates, __dirname, __filename, frequency, hasPair(), loadFixture(), pair (+22 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (26): approvals, APPROVED_ROUND_3_SEED_PATHS, approvedRound3Entries, approvedRound3Paths, ApprovedSeedEntry, assertApprovedExpansionTraceability(), countSeedEntries(), DEFERRED_IDS (+18 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (27): buildSeedCorpusProfiles(), CorpusNoiseSuggestionOptions, DescriptorClusterOptions, scoreSemanticNoise(), SeedCorpusProfileOptions, SemanticNoiseOptions, suggestCorpusSemanticNoise(), analysis (+19 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (23): aliasSeed, AliasSeedFixture, aliasSeedPath, allowedAliases, approvedAliasEntries, ApprovedAliasEntry, approvedAliasMap, approvedRound3Aliases (+15 more)

### Community 14 - "Community 14"
Cohesion: 0.07
Nodes (26): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, 🧠 3. SIMILARITY MATRIX, ⚠️ ALIAS RULES, code:txt (family), code:txt (floral), code:txt (floral_white), code:txt (powdery) (+18 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (24): 1. Core Types & Validation Refactor, 2. Immutability & Hardening Loaders, 3. Alias Seed System & Descriptor Registry, 4. Tests & Invariants (Edge Cases e Performance), Automated Tests, code:ts (export type DescriptorNode = {), [MODIFY] `src/loader/seed_loader.ts` & `src/loader/corpus_loader.ts`, [MODIFY] `src/loader/seed_validator.ts` (+16 more)

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (22): Calcula Formula Engine, code:bash (npm install), code:bash (npm test), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateVolatility, calculateTenacity } from './sr), code:ts (import { classifyNote } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine') (+14 more)

### Community 17 - "Community 17"
Cohesion: 0.1
Nodes (20): API Reference, `calculateMaterialScores(input, options?)`, `calculateTenacity(input, customWeights?)`, `calculateVolatility(input, customWeights?)`, `classifyNote(volatilityScore)`, code:ts (type MaterialInput = {), code:ts (type EngineOutput = {), code:ts (calculateMaterialScores(input: MaterialInput, options?: Engi) (+12 more)

### Community 18 - "Community 18"
Cohesion: 0.1
Nodes (19): Alias cleanup, Candidate prioritization, Decisões que a Phase 09 deve capturar, Direção recomendada para Phase 09, Expansion scope, Manual approval workflow, Phase 09: Taxonomy Seed v2 Expansion Round 2, Prioridade 1 — Green (+11 more)

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (18): 🏗️ Arquitetura em Camadas, code:bash (# Instalar dependências (typescript, vitest)), code:bash (# Se o script tiver permissão de execução), code:bash (# Executar a partir do diretório /src/), Como Executar, 🚀 Como Funciona o Builder, Current Taxonomy Status, Escopo das Checagens do Guard (+10 more)

### Community 20 - "Community 20"
Cohesion: 0.28
Nodes (13): accordMap, buildFixtureGraph(), curatedRelations, __dirname, edges, emitted, __filename, FixtureAliasCandidate (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.26
Nodes (12): AnalysisMaterial, corpus, __dirname, expected, __filename, frequency, fullFrequency, loadTinyCorpus() (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.32
Nodes (8): analysis, corpus, start, createMulberry32(), GenerateOptions, generateSyntheticCorpus(), SyntheticMaterial, VOCABULARY

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (11): 1) Material leve e volatil, 2) Material pesado e tenaz, 3) Dados faltantes, 4) Pesos customizados, 5) Classificacao de nota, code:ts (import { calculateVolatility } from '../src/engine'), code:ts (import { calculateTenacity } from '../src/engine'), code:ts (import { calculateMaterialScores } from '../src/engine') (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (10): Arquitetura, Decisoes de Robustez, Modulos, `src/engine/index.ts`, `src/engine/normalization.ts`, `src/engine/tenacity.ts`, `src/engine/volatility.ts`, `src/engine/weights.ts` (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.36
Nodes (8): CorpusMaterial, MaterialClassification, MaterialIdentifiers, MaterialIdentity, MaterialUsage, MolecularProperties, OlfactoryProfile, SemanticMaterial

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (6): Checklist rapido, code:bash (npm test), Comandos de verificacao, Garantias funcionais, Resultado esperado, Validacao

### Community 27 - "Community 27"
Cohesion: 0.53
Nodes (4): keys1, keys2, obj1, obj2

### Community 28 - "Community 28"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

## Knowledge Gaps
- **159 isolated node(s):** `SeedSubfamily`, `SeedFamily`, `TaxonomySeedFixture`, `ApprovedAliasEntry`, `AliasSeedFixture` (+154 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `normalizeDescriptor()` connect `Community 8` to `Utilities & Normalization`, `Weight Configuration`, `Engine Tests`, `Community 10`, `Community 21`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `TaxonomySeed` connect `Core Types` to `Utilities & Normalization`, `Test Configuration`, `Community 7`, `Community 8`, `Community 10`, `Community 12`, `Community 20`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `CorpusAnalysis` connect `Community 7` to `Utilities & Normalization`, `Core Types`, `Weight Configuration`, `Community 8`, `Community 12`, `Community 20`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `SeedSubfamily`, `SeedFamily`, `TaxonomySeedFixture` to the rest of the system?**
  _159 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Utilities & Normalization` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Core Types` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Weight Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._