# Graph Report - TaxonomySystem  (2026-05-12)

## Corpus Check
- 15 files · ~3,310 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 34 nodes · 107 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `492dc83a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Utilities & Normalization|Utilities & Normalization]]
- [[_COMMUNITY_Core Types|Core Types]]
- [[_COMMUNITY_Weight Configuration|Weight Configuration]]
- [[_COMMUNITY_Tenacity Calculation|Tenacity Calculation]]
- [[_COMMUNITY_Engine Tests|Engine Tests]]
- [[_COMMUNITY_Volatility Calculation|Volatility Calculation]]

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
10. `MaterialInput` - 4 edges

## Surprising Connections (you probably didn't know these)
- `weightedAverage()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/weights.ts → src/utils.ts
- `calculateTenacity()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/tenacity.ts → src/utils.ts
- `isUsableWeight()` --calls--> `toFiniteNumber()`  [EXTRACTED]
  src/engine/weights.ts → src/utils.ts
- `normalizeFinite()` --calls--> `toFiniteNumber()`  [EXTRACTED]
  src/engine/normalization.ts → src/utils.ts
- `calculateVolatility()` --calls--> `mergeWeights()`  [EXTRACTED]
  src/engine/volatility.ts → src/engine/weights.ts

## Communities (7 total, 1 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.4
Nodes (7): classifyNote(), NormalizationRange, normalize(), normalizeVaporPressure(), isUsableWeight(), clamp01(), toFiniteNumber()

### Community 1 - "Core Types"
Cohesion: 0.6
Nodes (4): EngineOptions, EngineOutput, MaterialInput, NoteClassification

### Community 2 - "Weight Configuration"
Cohesion: 0.33
Nodes (5): DEFAULT_TENACITY_WEIGHTS, DEFAULT_VOLATILITY_WEIGHTS, WeightedFeature, TenacityWeights, VolatilityWeights

### Community 3 - "Tenacity Calculation"
Cohesion: 0.7
Nodes (4): normalizeFinite(), calculateTenacity(), mergeWeights(), weightedAverage()

### Community 4 - "Engine Tests"
Cohesion: 0.5
Nodes (3): limonene, material, muskLikeMaterial

## Knowledge Gaps
- **5 isolated node(s):** `WeightedFeature`, `NormalizationRange`, `limonene`, `material`, `muskLikeMaterial`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toFiniteNumber()` connect `Utilities & Normalization` to `Core Types`, `Weight Configuration`, `Tenacity Calculation`, `Engine Tests`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `clamp01()` connect `Utilities & Normalization` to `Core Types`, `Weight Configuration`, `Tenacity Calculation`, `Engine Tests`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `calculateVolatility()` connect `Volatility Calculation` to `Utilities & Normalization`, `Core Types`, `Tenacity Calculation`, `Engine Tests`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `WeightedFeature`, `NormalizationRange`, `limonene` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._