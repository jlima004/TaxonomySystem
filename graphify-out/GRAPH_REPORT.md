# Graph Report - TaxonomySystem  (2026-05-12)

## Corpus Check
- 16 files · ~3,456 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 66 nodes · 137 edges · 16 communities (8 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d3afca1`
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
- `isUsableWeight()` --calls--> `toFiniteNumber()`  [EXTRACTED]
  src/engine/weights.ts → src/utils.ts
- `weightedAverage()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/weights.ts → src/utils.ts
- `calculateTenacity()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/tenacity.ts → src/utils.ts
- `normalizeVaporPressure()` --calls--> `toFiniteNumber()`  [EXTRACTED]
  src/engine/volatility.ts → src/utils.ts
- `normalizeFinite()` --calls--> `toFiniteNumber()`  [EXTRACTED]
  src/engine/normalization.ts → src/utils.ts

## Communities (16 total, 8 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.18
Nodes (10): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, ⚠️ ALIAS RULES, 🧠 DESIGN PRINCIPLES, ✅ DO, 🚫 DO NOT, 🎯 FINAL GOAL, ⚠️ IMPORTANT CONSTRAINT (+2 more)

### Community 1 - "Core Types"
Cohesion: 0.5
Nodes (5): EngineOptions, EngineOutput, MaterialInput, NoteClassification, TenacityWeights

### Community 2 - "Weight Configuration"
Cohesion: 0.5
Nodes (7): calculateMaterialScores(), normalizeFinite(), calculateTenacity(), calculateVolatility(), normalizeVaporPressure(), mergeWeights(), weightedAverage()

### Community 3 - "Tenacity Calculation"
Cohesion: 0.48
Nodes (5): classifyNote(), NormalizationRange, normalize(), clamp01(), toFiniteNumber()

### Community 4 - "Engine Tests"
Cohesion: 0.33
Nodes (5): DEFAULT_TENACITY_WEIGHTS, DEFAULT_VOLATILITY_WEIGHTS, isUsableWeight(), WeightedFeature, VolatilityWeights

### Community 5 - "Volatility Calculation"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

### Community 6 - "Test Configuration"
Cohesion: 0.5
Nodes (3): limonene, material, muskLikeMaterial

## Knowledge Gaps
- **26 isolated node(s):** `Project Context`, `Available Workflow Commands`, `Key Artifacts`, `code:txt (family)`, `⚠️ IMPORTANT CONSTRAINT` (+21 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `🎯 OBJECTIVE` connect `Community 13` to `Utilities & Normalization`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `🥇 TOP-LEVEL FAMILIES` connect `Community 10` to `Utilities & Normalization`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `🥈 SUBFAMILY RULES` connect `Community 11` to `Utilities & Normalization`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `Project Context`, `Available Workflow Commands`, `Key Artifacts` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._