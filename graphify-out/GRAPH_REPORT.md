# Graph Report - TaxonomySystem  (2026-06-10)

## Corpus Check
- 170 files · ~69,374 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1643 nodes · 4198 edges · 90 communities (88 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f29420d7`
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
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]

## God Nodes (most connected - your core abstractions)
1. `normalizeDescriptor()` - 50 edges
2. `CorpusAnalysis` - 43 edges
3. `TaxonomySeed` - 40 edges
4. `SimilarityGraph` - 28 edges
5. `encodePairKey()` - 26 edges
6. `CompiledTaxonomy` - 26 edges
7. `validateOlfactoryGraph()` - 25 edges
8. `CompiledAliases` - 25 edges
9. `buildSimilarityGraph()` - 23 edges
10. `runCompileCli()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `buildSimilarityGraph()` --calls--> `makeEmptyCuratedReviewItem()`  [EXTRACTED]
  src/inference/build_similarity_graph.ts → build_similarity_graph.ts
- `buildFixtureGraph()` --calls--> `buildSimilarityGraph()`  [INFERRED]
  src/tests/inference/build_similarity_graph.test.ts → src/inference/build_similarity_graph.ts
- `resolveAliasPath()` --calls--> `findInboundEdge()`  [EXTRACTED]
  src/graph_read_model/query_graph.ts → query_graph.ts
- `getDescriptorToFamilyPath()` --calls--> `findInboundEdge()`  [EXTRACTED]
  src/graph_read_model/query_graph.ts → query_graph.ts
- `runPipeline()` --calls--> `removePunctuation()`  [EXTRACTED]
  tests/normalization/trace.test.ts → src/normalizer/remove_punctuation.ts

## Communities (90 total, 2 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.05
Nodes (60): AnalysisMaterial, corpus, __dirname, expected, __filename, frequency, fullFrequency, loadTinyCorpus() (+52 more)

### Community 1 - "Core Types"
Cohesion: 0.06
Nodes (77): compileAliases(), CompileAliasesOptions, result, seed, compileAll(), CompileAllInputs, CompileAllOptions, CompileAllResult (+69 more)

### Community 2 - "Weight Configuration"
Cohesion: 0.05
Nodes (85): exists(), GraphBuildArgs, GuardrailResult, GuardrailsResult, loadGraphInputs(), main(), parseGraphBuildArgs(), printHelp() (+77 more)

### Community 3 - "Tenacity Calculation"
Cohesion: 0.06
Nodes (58): countBy(), countSubfamilies(), exists(), main(), NoiseConfig, printHelp(), printReviewSummary(), printValidationErrors() (+50 more)

### Community 4 - "Engine Tests"
Cohesion: 0.06
Nodes (63): encodePairKey(), choosePlacement(), compileTaxonomy(), CompileTaxonomyOptions, CompileTaxonomyResult, getSupport(), Placement, sortLex() (+55 more)

### Community 5 - "Volatility Calculation"
Cohesion: 0.06
Nodes (50): CliArgs, exists(), main(), parseArgs(), printHelp(), resolveReadablePath(), runAliasIntegrityCli(), emptyExceptionPolicy (+42 more)

### Community 6 - "Test Configuration"
Cohesion: 0.1
Nodes (24): AliasLoadError, AliasParseError, AliasValidationError, validateAliasSeed(), loadTaxonomySeed(), SeedLoadError, SeedParseError, SeedValidationError (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (43): approvals, APPROVED_PHASE_42_SEED_PATHS, APPROVED_PHASE_47_SEED_PATHS, APPROVED_ROUND_3_SEED_PATHS, approvedPaths, approvedRound3Entries, approvedRound3Paths, ApprovedSeedEntry (+35 more)

### Community 8 - "Community 8"
Cohesion: 0.24
Nodes (25): calculateMaterialScores(), classifyNote(), NormalizationRange, normalize(), normalizeFinite(), calculateTenacity(), calculateVolatility(), normalizeVaporPressure() (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (34): aliasSeed, AliasSeedFixture, aliasSeedPath, allowedAliases, approvedAliasEntries, ApprovedAliasEntry, approvedAliasMap, approvedPhase38Aliases (+26 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (35): accord, accordInput(), accordMapV2Path, accords, approvedRound3AccordPairs, approvedRound3RelationPairs, approvedSubfamilyIds, approvedV2SubfamilyIds() (+27 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (27): buildSimilarityGraph(), BuildSimilarityGraphOptions, buildSubfamilyProfiles(), computeCooccurrenceSupport(), getDescriptorCooccurrence(), graphDimensions(), makeAliasReviewItem(), makeCorpusSupportMap() (+19 more)

### Community 12 - "Community 12"
Cohesion: 0.16
Nodes (31): aliasNodeId(), buildNodeIndex(), collapseNeighborhoodEntries(), collectDescriptors(), compareCrossFamilyBridgeItems(), compareDescriptorProofItems(), compareSimilarityNeighborhoodEntries(), DESCRIPTOR_SOURCES (+23 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (27): baseInput, buildValidatedWoodyGraph(), cedarwoodRelatedDescriptors, first, floralRoseDescriptors, floralRoseNeighbors, floralRoseProof, floralWhiteDescriptors (+19 more)

### Community 14 - "Community 14"
Cohesion: 0.13
Nodes (20): clamp01(), computeAliasEvidence(), descriptorSet(), __dirname, __filename, leftSnapshot, loadFixture(), result (+12 more)

### Community 15 - "Community 15"
Cohesion: 0.07
Nodes (26): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, 🧠 3. SIMILARITY MATRIX, ⚠️ ALIAS RULES, code:txt (family), code:txt (floral), code:txt (floral_white), code:txt (powdery) (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.19
Nodes (18): inputs, score, buildDescriptorClusters(), ClusterSignal, descriptorSimilarity(), getPairCount(), makeCorpusNativeClusters(), makeReviewQueue() (+10 more)

### Community 17 - "Community 17"
Cohesion: 0.08
Nodes (24): 1. Core Types & Validation Refactor, 2. Immutability & Hardening Loaders, 3. Alias Seed System & Descriptor Registry, 4. Tests & Invariants (Edge Cases e Performance), Automated Tests, code:ts (export type DescriptorNode = {), [MODIFY] `src/loader/seed_loader.ts` & `src/loader/corpus_loader.ts`, [MODIFY] `src/loader/seed_validator.ts` (+16 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): Calcula Formula Engine, code:bash (npm install), code:bash (npm test), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateVolatility, calculateTenacity } from './sr), code:ts (import { classifyNote } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine'), code:ts (import { calculateMaterialScores } from './src/engine') (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (21): AliasResolutionPathProof, AliasResolutionPathResult, CrossFamilyBridgeItem, CrossFamilyBridgesProof, DescriptorProofItem, DescriptorsByFamilyProof, DescriptorsByFamilyResult, DescriptorsBySubfamilyProof (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.27
Nodes (15): computeAccordCompatibility(), assertNonEmptyString(), assertScore(), clamp01(), isNonEmptyString(), isRecord(), makeSubfamilyPairKey(), validateAccordMapInput() (+7 more)

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (16): DEFAULT_PLACEMENT_THRESHOLDS, normalizeFrequency(), scoreCandidatePlacement(), decision, AccordCompatibilityEvidence, AccordCompatibilityScore, CandidatePlacementDecision, CandidatePlacementDecisionReason (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.24
Nodes (17): analysis, AnalysisMaterial, descriptors, lexSorted, parsed, path, pathA, pathB (+9 more)

### Community 23 - "Community 23"
Cohesion: 0.1
Nodes (20): 10. Zero-Dependency / Static Contract Rules, 11. Phase 56 Invariant Handoff, 12. Expected Baseline Stats, 13. Zero-Mutation Statement, 1. Scope, 2. Schema Version, 3. Node Contract, 4. Edge Contract (+12 more)

### Community 24 - "Community 24"
Cohesion: 0.1
Nodes (20): API Reference, `calculateMaterialScores(input, options?)`, `calculateTenacity(input, customWeights?)`, `calculateVolatility(input, customWeights?)`, `classifyNote(volatilityScore)`, code:ts (type MaterialInput = {), code:ts (type EngineOutput = {), code:ts (calculateMaterialScores(input: MaterialInput, options?: Engi) (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.32
Nodes (18): GraphNodeKind, combineGraphResults(), GraphValidationResult, makeGraphError(), buildNodeIndex(), countEdgesByKind(), countNodesByKind(), deriveStatsFromGraph() (+10 more)

### Community 26 - "Community 26"
Cohesion: 0.19
Nodes (18): aliasEntries, bridgesProof, cedarProof, cedarwoodPathProof, compiledPaths, familyIds, graph, hubProof (+10 more)

### Community 27 - "Community 27"
Cohesion: 0.1
Nodes (19): Alias cleanup, Candidate prioritization, Decisões que a Phase 09 deve capturar, Direção recomendada para Phase 09, Expansion scope, Manual approval workflow, Phase 09: Taxonomy Seed v2 Expansion Round 2, Prioridade 1 — Green (+11 more)

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (12): map, result, buildCuratedAliasMap(), canonicalizeDescriptor(), CuratedAliasAuditEntry, CuratedAliasCanonicalizationResult, hasMapContent(), AnalysisMaterial (+4 more)

### Community 29 - "Community 29"
Cohesion: 0.26
Nodes (15): AliasCandidateOptions, buildDescriptorToFamilies(), buildSeedCanonicalSet(), buildSeedPairSet(), buildTaxonomyDescriptorSet(), findAliasCandidates(), intersects(), isMultiToken() (+7 more)

### Community 30 - "Community 30"
Cohesion: 0.2
Nodes (15): [a, b], AnalysisMaterial, cooccurrence, corpus, decoded, __dirname, expected, __filename (+7 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (18): 🏗️ Arquitetura em Camadas, code:bash (cd src), code:bash (# Se o script tiver permissão de execução), code:bash (# Executar a partir do diretório /src/), Como Executar, 🚀 Como Funciona o Builder, Current Taxonomy Status, Escopo das Checagens do Guard (+10 more)

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (16): BuildOlfactoryGraphInput, GraphEdge, GraphNode, GraphStats, aliasNode, cloneGraph(), descriptorNode, duplicate (+8 more)

### Community 33 - "Community 33"
Cohesion: 0.27
Nodes (14): accordMap, buildFixtureGraph(), curatedRelations, __dirname, edges, emitted, __filename, FixtureAliasCandidate (+6 more)

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (13): AnalysisMaterial, corpus, direct, __dirname, __filename, first, loadFixture(), result (+5 more)

### Community 35 - "Community 35"
Cohesion: 0.38
Nodes (13): aliasNodeId(), buildAliasNodesAndEdges(), buildOlfactoryGraph(), buildSimilarityEdgeProperties(), buildSimilarityEdges(), buildTaxonomyNodesAndEdges(), compareGraphEdges(), compareGraphNodes() (+5 more)

### Community 36 - "Community 36"
Cohesion: 0.26
Nodes (10): first, input, result, second, DEFAULT_DESCRIPTOR_SANITIZER_RULES, DescriptorSanitizerAuditEntry, DescriptorSanitizerInput, DescriptorSanitizerResult (+2 more)

### Community 37 - "Community 37"
Cohesion: 0.31
Nodes (9): analysis, corpus, start, analyzeCorpus(), createMulberry32(), GenerateOptions, generateSyntheticCorpus(), SyntheticMaterial (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.28
Nodes (11): AnalysisMaterial, candidates, __dirname, __filename, frequency, hasPair(), loadFixture(), pair (+3 more)

### Community 39 - "Community 39"
Cohesion: 0.15
Nodes (12): 10. Zero-Mutation Statement, 11. Handoff to Phase 50/51, 1. Sources Inspected, 2. Method, 3. Summary Counts, 4. Seed vs Compiled Alias Equivalence, 5. Valid Alias Targets Table, 6. Dangling Alias Targets Table (+4 more)

### Community 40 - "Community 40"
Cohesion: 0.15
Nodes (13): r3-relation-001, r3-relation-002, r3-relation-003, r3-relation-004, r3-relation-005, r3-relation-006, r3-relation-007, r3-relation-008 (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.15
Nodes (13): r3-accord-001, r3-accord-002, r3-accord-003, r3-accord-004, r3-accord-005, r3-accord-006, r3-accord-007, r3-accord-008 (+5 more)

### Community 42 - "Community 42"
Cohesion: 0.17
Nodes (11): 1) Material leve e volatil, 2) Material pesado e tenaz, 3) Dados faltantes, 4) Pesos customizados, 5) Classificacao de nota, code:ts (import { calculateVolatility } from '../src/engine'), code:ts (import { calculateTenacity } from '../src/engine'), code:ts (import { calculateMaterialScores } from '../src/engine') (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (11): r2-approval-001, r2-approval-002, r2-approval-003, r2-approval-004, r2-approval-005, r2-approval-006, r2-approval-007, r2-approval-008 (+3 more)

### Community 44 - "Community 44"
Cohesion: 0.18
Nodes (11): r3-approval-001, r3-approval-002, r3-approval-003, r3-approval-004, r3-approval-005, r3-approval-006, r3-approval-007, r3-approval-008 (+3 more)

### Community 45 - "Community 45"
Cohesion: 0.18
Nodes (10): Arquitetura, Decisoes de Robustez, Modulos, `src/engine/index.ts`, `src/engine/normalization.ts`, `src/engine/tenacity.ts`, `src/engine/volatility.ts`, `src/engine/weights.ts` (+2 more)

### Community 46 - "Community 46"
Cohesion: 0.36
Nodes (8): CorpusMaterial, MaterialClassification, MaterialIdentifiers, MaterialIdentity, MaterialUsage, MolecularProperties, OlfactoryProfile, SemanticMaterial

### Community 47 - "Community 47"
Cohesion: 0.2
Nodes (9): Added to Conflict Stopwords (7 items), Aliased to Seed (3 items), Compiler Status, Deferred Items (Requires Manual Review), Execution Overview, Impact & Metrics, Low-support impact, Mutations Applied (Wave 2) (+1 more)

### Community 48 - "Community 48"
Cohesion: 0.2
Nodes (10): r3-defer-001, r3-defer-002, r3-defer-003, r3-defer-004, r3-defer-005, r3-defer-006, r3-defer-007, r3-defer-008 (+2 more)

### Community 49 - "Community 49"
Cohesion: 0.36
Nodes (8): edgeSortKeys, first, graph, input, makeMinimalInput(), nodeSortKeys, second, similarityEdge

### Community 50 - "Community 50"
Cohesion: 0.5
Nodes (6): __dirname, __filename, loadFixture(), result, ScoringFixture, CuratedTraditionRelation

### Community 51 - "Community 51"
Cohesion: 0.5
Nodes (6): __dirname, __filename, loadFixture(), result, ScoringFixture, CuratedAccordReference

### Community 52 - "Community 52"
Cohesion: 0.39
Nodes (5): AnalysisMaterial, CoOccurrenceEdge, CoOccurrenceMap, FrequencyEntry, FrequencyMap

### Community 53 - "Community 53"
Cohesion: 0.22
Nodes (9): approval-001, Approval Ledger, Deferred / Out-Of-Scope Groups, Deterministic Evidence Ranking Procedure, Evidence-Ranked Queue — Priority Only, Guardrails, No-Evidence Rows, Official Review Buckets And Dispositions (+1 more)

### Community 54 - "Community 54"
Cohesion: 0.22
Nodes (9): Phase 10 / Round 3 Curation, r3-alias-cleanup-001, r3-alias-cleanup-002, r3-alias-cleanup-003, r3-alias-cleanup-004, r3-alias-cleanup-005, Round 3 Alias Cleanup Ledger — Pending, Round 3 Guardrails (+1 more)

### Community 55 - "Community 55"
Cohesion: 0.29
Nodes (6): Before-State Proof, Boundary Confirmations, Decision, Phase 51 Safe-Fit Rationale: `ylang_ylang`, Placement Rationale, Safe-Fit Affirmation

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (7): r2-relation-001, r2-relation-002, r2-relation-003, r2-relation-004, r2-relation-005, r2-relation-006, Round 2 Relation Proposals — Pending

### Community 57 - "Community 57"
Cohesion: 0.29
Nodes (7): amber_resinous, animalic, fruity, gourmand, green, In-Scope Candidate Groups, spicy

### Community 58 - "Community 58"
Cohesion: 0.29
Nodes (7): r2-accord-001, r2-accord-002, r2-accord-003, r2-accord-004, r2-accord-005, r2-accord-006, Round 2 Accord Proposals — Pending

### Community 59 - "Community 59"
Cohesion: 0.29
Nodes (6): Checklist rapido, code:bash (npm test), Comandos de verificacao, Garantias funcionais, Resultado esperado, Validacao

### Community 60 - "Community 60"
Cohesion: 0.73
Nodes (4): clamp01(), computeSemanticOverlap(), profileWeights(), SemanticOverlapScore

### Community 61 - "Community 61"
Cohesion: 0.53
Nodes (4): keys1, keys2, obj1, obj2

### Community 62 - "Community 62"
Cohesion: 0.33
Nodes (6): r2-defer-001, r2-defer-002, r2-defer-003, r2-defer-004, r2-defer-005, Round 2 Deferred Candidate Ledger — Pending

### Community 63 - "Community 63"
Cohesion: 0.33
Nodes (5): Phase 09 / Round 2 Curation, Priority Groups And Subfamilies, r2-alias-cleanup-01, Round 2 Alias Cleanup Ledger — Deferred, Round 2 Guardrails

### Community 64 - "Community 64"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

### Community 65 - "Community 65"
Cohesion: 0.4
Nodes (4): Autorizo, Confirmação, Não autorizo, Phase 31 Final Approval

### Community 66 - "Community 66"
Cohesion: 0.4
Nodes (4): Decision Matrix, Execution Summary for Phase 47, Phase 46 Batch 2 Decision Matrix, Zero-Mutation Confirmation

### Community 67 - "Community 67"
Cohesion: 0.4
Nodes (4): Allowlist, Approved Scope, Blocked Paths, Phase 20 Final Approval - Petitgrain Add Target Only

### Community 70 - "Community 70"
Cohesion: 0.5
Nodes (3): 41-DECISION-MATRIX, Decision Matrix, Execution Summary for Phase 42

### Community 71 - "Community 71"
Cohesion: 0.5
Nodes (4): accord-gap-approval-001-vanilla, Relation/Accord Ledger For Seed v2, relation-gap-approval-001-vanilla, retained-v1-manual-bootstrap

## Knowledge Gaps
- **301 isolated node(s):** `DESCRIPTOR_STATUSES`, `DESCRIPTOR_SOURCES`, `GraphBuildArgs`, `GuardrailResult`, `GuardrailsResult` (+296 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SimilarityGraph` connect `Core Types` to `Community 32`, `Community 33`, `Weight Configuration`, `Community 35`, `Community 11`, `Community 13`, `Community 49`, `Community 19`, `Community 26`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `normalizeDescriptor()` connect `Utilities & Normalization` to `Community 34`, `Community 11`, `Community 52`, `Community 28`, `Community 29`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `TaxonomySeed` connect `Engine Tests` to `Utilities & Normalization`, `Community 33`, `Core Types`, `Test Configuration`, `Community 38`, `Community 11`, `Community 29`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `DESCRIPTOR_STATUSES`, `DESCRIPTOR_SOURCES`, `GraphBuildArgs` to the rest of the system?**
  _301 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Utilities & Normalization` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Core Types` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Weight Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._