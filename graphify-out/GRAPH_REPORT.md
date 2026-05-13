# Graph Report - TaxonomySystem  (2026-05-13)

## Corpus Check
- 32 files · ~6,228 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 134 nodes · 206 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `405d86f1`
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
10. `validate_seed()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `isUsableWeight()` --calls--> `toFiniteNumber()`  [EXTRACTED]
  src/engine/weights.ts → src/utils.ts
- `weightedAverage()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/weights.ts → src/utils.ts
- `calculateTenacity()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/tenacity.ts → src/utils.ts
- `normalize()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/normalization.ts → src/utils.ts
- `classifyNote()` --calls--> `clamp01()`  [EXTRACTED]
  src/engine/index.ts → src/utils.ts

## Communities (13 total, 1 thin omitted)

### Community 0 - "Utilities & Normalization"
Cohesion: 0.2
Nodes (25): calculateMaterialScores(), classifyNote(), NormalizationRange, normalize(), normalizeFinite(), calculateTenacity(), calculateVolatility(), normalizeVaporPressure() (+17 more)

### Community 1 - "Core Types"
Cohesion: 0.07
Nodes (26): 🧠 1. TAXONOMY STRUCTURE, 🔄 2. DESCRIPTOR ALIAS SYSTEM, 🧠 3. SIMILARITY MATRIX, ⚠️ ALIAS RULES, code:txt (family), code:txt (floral), code:txt (floral_white), code:txt (powdery) (+18 more)

### Community 2 - "Weight Configuration"
Cohesion: 0.13
Nodes (12): load_taxonomy_seed(), SeedLoadError, SeedParseError, SeedValidationError, __dirname, __filename, fixtures_dir, malformedPath (+4 more)

### Community 3 - "Tenacity Calculation"
Cohesion: 0.21
Nodes (9): is_non_empty_string(), validate_seed(), make_error(), make_result(), ValidationError, ValidationResult, invalid, result (+1 more)

### Community 4 - "Engine Tests"
Cohesion: 0.22
Nodes (9): load_corpus(), map_olfactory_profile(), map_to_corpus_material(), __dirname, __filename, fixtures_dir, keys, malformedPath (+1 more)

### Community 5 - "Volatility Calculation"
Cohesion: 0.25
Nodes (7): CorpusMaterial, MaterialClassification, MaterialIdentifiers, MaterialIdentity, MaterialUsage, MolecularProperties, OlfactoryProfile

### Community 6 - "Test Configuration"
Cohesion: 0.29
Nodes (6): CanonicalDescriptor, CompiledTaxonomy, DescriptorAliasMap, TaxonomyFamily, TaxonomyStats, TaxonomySubfamily

### Community 7 - "Community 7"
Cohesion: 0.4
Nodes (4): SimilarityDimension, SimilarityEdge, SimilarityGraph, SimilarityStats

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (4): Available Workflow Commands, GSD Workflow Guide (Gemini), Key Artifacts, Project Context

## Knowledge Gaps
- **61 isolated node(s):** `__filename`, `__dirname`, `fixtures_dir`, `keys`, `malformedPath` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validate_seed()` connect `Tenacity Calculation` to `Weight Configuration`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `fixtures_dir` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Weight Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._