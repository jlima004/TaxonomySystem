# Architecture

> Last mapped: 2026-05-12

## Pattern

**Functional pipeline / Pure computation engine**

The codebase follows a purely functional architecture — no classes, no state mutations, no side effects. Functions take inputs and return deterministic outputs.

## Layers

```
MaterialInput → Normalization → Weighted Average → Score Clamping → EngineOutput
```

1. **Input Layer** (`types.ts`) — Type-safe material data structures
2. **Utilities** (`utils.ts`) — Pure helper functions (`clamp01`, `toFiniteNumber`)
3. **Normalization** (`engine/normalization.ts`) — Min-max normalization with defined ranges
4. **Domain Calculations** (`engine/volatility.ts`, `engine/tenacity.ts`) — Score computation
5. **Weight Management** (`engine/weights.ts`) — Default weights, merging, weighted averages
6. **Public API** (`engine/index.ts`) — Barrel exports, `calculateMaterialScores`, `classifyNote`

## Data Flow

```
MaterialInput
  ├── physchem.vapor_pressure → normalizeVaporPressure() → weightedAverage()
  ├── physchem.molecular_weight → normalizeFinite() → weightedAverage()
  ├── molecular.xlogp → normalizeFinite() → weightedAverage()
  ├── molecular.rotatable_bonds → normalizeFinite() → weightedAverage()
  └── molecular.tpsa → normalizeFinite() → tpsaPenalty
                                                ↓
                              ┌── volatility_score (0..1)
                              └── tenacity_score (0..1)
```

## Key Abstractions

### `weightedAverage(features)` — Core computation primitive
- Accepts array of `{value, weight}` pairs
- Filters out undefined/invalid values
- Rebalances weights dynamically for missing features
- Returns clamped `[0, 1]` value or fallback (0.5)

### `normalizeFinite(value, range)` — Safe normalization
- Validates input is finite number
- Applies min-max normalization within defined range
- Returns `undefined` for invalid inputs (propagates "missing data")

### `mergeWeights(defaults, custom)` — Configuration override
- Merges custom weight overrides into defaults
- Validates each weight is a usable (finite, non-negative) number

## Entry Points

| Entry Point | Purpose |
|-------------|---------|
| `engine_calcula_tenacidade_volatilidade/src/engine/index.ts` | Main barrel export — all public API |

## Component Boundaries

```
TaxonomySystem/
├── engine_calcula_tenacidade_volatilidade/   # Self-contained Node+TS package
│   └── src/
│       ├── types.ts                          # Shared type definitions
│       ├── utils.ts                          # Pure utility functions
│       └── engine/                           # Core computation module
│           ├── index.ts                      # Public API surface
│           ├── normalization.ts              # Min-max normalization
│           ├── volatility.ts                 # Volatility score calculation
│           ├── tenacity.ts                   # Tenacity score calculation
│           └── weights.ts                    # Weight management
├── data/                                     # Data assets (gitignored)
│   └── enriched_materials.json               # PubChem enriched dataset
└── src/                                      # Empty — future taxonomy system code
```

## Key Observations

- **No dependency injection** — functions are directly imported
- **No configuration files** — constants are hardcoded in `normalization.ts` and `weights.ts`
- **No I/O** — engine never reads files or makes network calls
- **Graceful degradation** — missing data produces neutral scores (0.5) instead of errors
