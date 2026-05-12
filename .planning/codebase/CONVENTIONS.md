# Conventions

> Last mapped: 2026-05-12

## Code Style

### TypeScript
- **Strict mode** enabled with all strict compiler options
- **`noUncheckedIndexedAccess`** — prevents unsafe array/object access
- **`exactOptionalPropertyTypes`** — distinguishes `undefined` vs missing properties
- **No semicolons** — relies on ASI (all source files omit trailing semicolons)
- **Arrow functions** preferred — no `function` keyword used in source
- **Const assertions** — uses `as const satisfies` for type-safe constants

### Imports
- **Type-only imports** — `import type { ... }` for type imports
- **Barrel exports** — `engine/index.ts` re-exports all public API
- **Relative paths** — no path aliases configured

## Naming Patterns

| Element | Convention | Example |
|---------|-----------|---------|
| Functions | camelCase | `calculateVolatility`, `normalizeFinite` |
| Types/Interfaces | PascalCase | `MaterialInput`, `EngineOutput` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_VOLATILITY_WEIGHTS`, `NORMALIZATION_RANGES` |
| Files | snake_case.ts | `normalization.ts`, `weights.ts` |
| Directories | snake_case | `engine_calcula_tenacidade_volatilidade` |
| Type properties | snake_case | `vapor_pressure`, `molecular_weight` |

## Error Handling

- **No exceptions thrown** (except `RangeError` in `normalize()` for invalid range config)
- **Graceful degradation** — invalid/missing values produce neutral fallback (0.5)
- **`toFiniteNumber()`** — validates all numeric inputs before processing
- **`undefined` propagation** — missing features return `undefined`, filtered by `weightedAverage`
- **No `try/catch`** blocks anywhere — defensive validation at boundaries

## Patterns

### Weighted Feature Pattern
```typescript
type WeightedFeature = { value: number | undefined; weight: number }
const result = weightedAverage(features)  // auto-rebalances for missing
```

### Safe Normalization Pattern
```typescript
const normalized = normalizeFinite(rawValue, NORMALIZATION_RANGES.xlogp)
// Returns undefined if input is invalid, preserving "data unknown" semantics
```

### Options Merge Pattern
```typescript
const weights = mergeWeights(DEFAULT_WEIGHTS, customWeights)
// Defaults fill in missing custom values, validates each override
```

## Documentation Language

- **Code:** English (variable names, comments)
- **External docs:** Portuguese (`README.md`, `docs/*.md`)
- **Git messages:** English prefix conventions (`docs:`, `chore:`)
