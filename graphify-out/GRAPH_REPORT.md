# Graph Report - TaxonomySystem  (2026-05-13)

## Corpus Check
- 24 files · ~4,157 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 96 nodes · 161 edges · 22 communities (13 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0dc42cd7`
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

## God Nodes (most connected - your core abstractions)
1. `clamp01()` - 10 edges
2. `toFiniteNumber()` - 10 edges
3. `calculateVolatility()` - 8 edges
4. `calculateTenacity()` - 8 edges
5. `normalizeFinite()` - 8 edges
6. `weightedAverage()` - 7 edges
7. `mergeWeights()` - 6 edges
8. `normalize()` - 6 edges
9. `normalizeVaporPressure()` - 5 edges
10. `GSD Workflow Guide (Gemini)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `weightedAverage()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/weights.ts → src/utils.ts
- `calculateTenacity()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/tenacity.ts → src/utils.ts
- `normalize()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/normalization.ts → src/utils.ts
- `isUsableWeight()` --calls--> `toFiniteNumber()`  [EXTRACTED]
  src/engine/weights.ts → src/utils.ts
- `normalizeVaporPressure()` --calls--> `toFiniteNumber()`  [EXTRACTED]
  src/engine/volatility.ts → src/utils.ts

## Communities (22 total, 9 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.18
Nodes (10): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, ⚠️ ALIAS RULES, 🧠 DESIGN PRINCIPLES, ✅ DO, 🚫 DO NOT, 🎯 FINAL GOAL, ⚠️ IMPORTANT CONSTRAINT (+2 more)

### Community 1 - "Core Types"
Cohesion: 0.38
Nodes (7): classifyNote(), DEFAULT_TENACITY_WEIGHTS, isUsableWeight(), WeightedFeature, TenacityWeights, clamp01(), toFiniteNumber()

### Community 2 - "Weight Configuration"
Cohesion: 0.25
Nodes (7): CorpusMaterial, MaterialClassification, MaterialIdentifiers, MaterialIdentity, MaterialUsage, MolecularProperties, OlfactoryProfile

### Community 3 - "Tenacity Calculation"
Cohesion: 0.29
Nodes (6): CanonicalDescriptor, CompiledTaxonomy, DescriptorAliasMap, TaxonomyFamily, TaxonomyStats, TaxonomySubfamily

### Community 4 - "Engine Tests"
Cohesion: 0.48
Nodes (5): EngineOptions, EngineOutput, MaterialInput, NoteClassification, VolatilityWeights

### Community 5 - "Volatility Calculation"
Cohesion: 0.6
Nodes (4): NormalizationRange, normalize(), normalizeFinite(), normalizeVaporPressure()

### Community 6 - "Test Configuration"
Cohesion: 0.4
Nodes (4): SeedMetadata, TaxonomySeed, TaxonomySeedFamily, TaxonomySeedSubfamily

### Community 7 - "Community 7"
Cohesion: 0.4
Nodes (4): SimilarityDimension, SimilarityEdge, SimilarityGraph, SimilarityStats

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

### Community 9 - "Community 9"
Cohesion: 0.6
Nodes (5): calculateMaterialScores(), calculateTenacity(), calculateVolatility(), mergeWeights(), weightedAverage()

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (4): DEFAULT_VOLATILITY_WEIGHTS, limonene, material, muskLikeMaterial

## Knowledge Gaps
- **49 isolated node(s):** `descriptor`, `aliases`, `MolecularProperties`, `OlfactoryProfile`, `MaterialIdentifiers` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `🎯 OBJECTIVE` connect `Community 16` to `Utilities & Normalization`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `🥇 TOP-LEVEL FAMILIES` connect `Community 19` to `Utilities & Normalization`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `🥈 SUBFAMILY RULES` connect `Community 15` to `Utilities & Normalization`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `descriptor`, `aliases`, `MolecularProperties` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._