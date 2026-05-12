# Structure

> Last mapped: 2026-05-12

## Directory Layout

```
TaxonomySystem/
├── .agent/                              # GSD agent skills and config
├── .agents/                             # GSD agent workflows
├── .git/                                # Git repository
├── .gitignore                           # Ignores: node_modules, dist, data/enriched_materials.json
├── .graphifyignore                      # Knowledge graph exclusions
├── .vscode/                             # VS Code settings
├── data/
│   └── enriched_materials.json          # 70MB PubChem-enriched material dataset (gitignored)
├── engine_calcula_tenacidade_volatilidade/
│   ├── .gitignore                       # Engine-specific ignores
│   ├── README.md                        # Engine documentation with tutorial
│   ├── docs/
│   │   ├── API.md                       # API reference
│   │   ├── ARQUITETURA.md               # Architecture docs (Portuguese)
│   │   ├── EXEMPLOS.md                  # Usage examples
│   │   └── VALIDACAO.md                 # Validation docs
│   ├── node_modules/                    # Engine dependencies
│   ├── package.json                     # calcula-formula-engine v0.1.0
│   ├── package-lock.json                # Lock file
│   ├── tsconfig.json                    # TypeScript strict config
│   ├── vitest.config.ts                 # Vitest configuration
│   └── src/
│       ├── types.ts                     # MaterialInput, EngineOutput, Weight types
│       ├── utils.ts                     # clamp01, toFiniteNumber utilities
│       ├── engine/
│       │   ├── index.ts                 # Public API barrel export
│       │   ├── normalization.ts         # Min-max normalization with defined ranges
│       │   ├── volatility.ts            # Volatility score calculation
│       │   ├── tenacity.ts              # Tenacity score calculation
│       │   └── weights.ts              # Default weights and weighted average
│       └── tests/
│           └── engine.test.ts           # 22 test cases
├── graphify-out/                        # Knowledge graph output
├── prompt.md                            # Taxonomy system design prompt
└── src/                                 # Empty — future taxonomy system code
```

## Key Locations

| Purpose | Path |
|---------|------|
| Engine source | `engine_calcula_tenacidade_volatilidade/src/` |
| Engine tests | `engine_calcula_tenacidade_volatilidade/src/tests/` |
| Engine docs | `engine_calcula_tenacidade_volatilidade/docs/` |
| Data assets | `data/` |
| Future taxonomy code | `src/` (currently empty) |
| Design prompt | `prompt.md` |

## Naming Conventions

- **Files:** `snake_case.ts` for source files
- **Directories:** `snake_case` for modules
- **Exports:** `camelCase` for functions, `PascalCase` for types
- **Constants:** `UPPER_SNAKE_CASE` for ranges and defaults
- **Documentation:** Portuguese language in docs/, English in code

## Package Structure

The project is a **monorepo-style** layout with:
- **Root level:** Project-wide config, data, and future taxonomy system
- **`engine_calcula_tenacidade_volatilidade/`:** Independent npm package with its own `package.json`
- **`src/`:** Reserved for the taxonomy system (empty, awaiting implementation)
