# Testing

> Last mapped: 2026-05-12

## Framework

- **Vitest** ^3.2.0
- **Configuration:** `engine_calcula_tenacidade_volatilidade/vitest.config.ts`
- **Runner:** `npm test` → `vitest run` (single pass), `npm run test:watch` → `vitest` (watch mode)

## Test Structure

```
engine_calcula_tenacidade_volatilidade/src/tests/
└── engine.test.ts   # 22 test cases, single comprehensive test file
```

## Test Categories

Based on the test file, tests cover:

1. **Happy path** — standard material calculations produce expected scores
2. **Missing data** — empty inputs produce neutral fallback (0.5)
3. **Invalid values** — NaN, negative vapor pressure, non-numeric strings are handled
4. **Custom weights** — weight overrides change scoring behavior
5. **Edge cases** — extreme values, boundary conditions
6. **Note classification** — volatility score → TOP NOTE / HEART / BASE mapping
7. **Clamping** — output always in [0, 1] range

## Mocking

- **No mocking used** — all functions are pure, no external dependencies to mock
- **No test fixtures files** — test data defined inline in test cases
- **No setup/teardown** — each test is independent

## Coverage

- **22 tests** in single file
- **Coverage tool:** Not explicitly configured (Vitest has built-in c8/istanbul support)
- **Coverage command:** Not in package.json scripts

## Key Observations

- **Pure function testing** — straightforward input→output assertions
- **Single test file** — may need splitting as codebase grows
- **No integration tests** — engine is standalone, no I/O to test
- **Portuguese documentation** refers to validation docs at `docs/VALIDACAO.md`
