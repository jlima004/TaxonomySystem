# Stack

> Last mapped: 2026-05-12

## Languages

| Language | Usage | Files |
|----------|-------|-------|
| TypeScript | Primary — engine logic, types, tests | `engine_calcula_tenacidade_volatilidade/src/**/*.ts` |
| JSON | Data storage (enriched materials dataset) | `data/enriched_materials.json` |
| Markdown | Documentation, prompts | `*.md`, `docs/*.md` |

## Runtime

- **Node.js** 20+ (specified in README)
- **npm** 10+
- **ESM modules** (`"type": "module"` in package.json)

## TypeScript Configuration

- **Target:** ES2022
- **Module:** ESNext with Bundler resolution
- **Strict mode:** Full (`strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **Output:** `dist/` directory with declarations
- **Config location:** `engine_calcula_tenacidade_volatilidade/tsconfig.json`

## Dependencies

### Production
None — zero runtime dependencies. Pure TypeScript engine.

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.8.0 | TypeScript compiler |
| `vitest` | ^3.2.0 | Test runner |

## Build System

- **Type checking:** `tsc --noEmit` (no output, validation only)
- **Testing:** `vitest run` (single run) / `vitest` (watch mode)
- **No bundler** — uses native ESM imports

## Data Assets

| File | Size | Description |
|------|------|-------------|
| `data/enriched_materials.json` | ~70MB | PubChem-enriched material dataset (gitignored) |

## Key Observations

- **Zero-dependency engine** — no runtime packages, pure TypeScript math
- **ESM-only** — uses `import/export` throughout, no CommonJS
- **Strict TypeScript** — aggressive type safety with `exactOptionalPropertyTypes`
- **No build step for execution** — TypeScript runs through Vitest without transpilation
