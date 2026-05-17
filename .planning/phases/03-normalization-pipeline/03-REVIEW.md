---
phase: 03-normalization-pipeline
reviewed: 2026-05-17T23:31:10Z
depth: standard
files_reviewed: 20
files_reviewed_list:
  - src/normalizer/normalize_unicode.ts
  - src/normalizer/normalize_case.ts
  - src/normalizer/normalize_separators.ts
  - src/normalizer/remove_punctuation.ts
  - src/normalizer/collapse_underscores.ts
  - src/normalizer/trim_underscores.ts
  - src/normalizer/singularize.ts
  - src/normalizer/irregular_plurals.ts
  - src/normalizer/normalize_descriptor.ts
  - src/normalizer/index.ts
  - src/normalizer/text_normalizer.ts
  - src/tests/normalization/unicode.test.ts
  - src/tests/normalization/case.test.ts
  - src/tests/normalization/separators.test.ts
  - src/tests/normalization/punctuation.test.ts
  - src/tests/normalization/singularize.test.ts
  - src/tests/normalization/trace.test.ts
  - src/tests/normalization/property.test.ts
  - src/tests/normalization/convergence.test.ts
  - src/tests/normalization/benchmark.test.ts
findings:
  critical: 1
  warning: 1
  info: 0
  total: 2
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-05-17T23:31:10Z
**Depth:** standard
**Files Reviewed:** 20
**Status:** issues_found

## Summary

Reviewed the normalization pipeline implementation, concern-specific tests, convergence/property coverage, benchmark, and the normalized taxonomy seed. Build and scoped normalization tests pass, but the plural fallback still corrupts valid singular fragrance descriptors ending in `s`, which violates descriptor normalization correctness despite the current idempotency and charset tests.

Verification run:

- `npm --prefix "/home/jlima/Projetos/TaxonomySystem/src" run build` - passed
- `npm --prefix "/home/jlima/Projetos/TaxonomySystem/src" exec vitest run src/tests/normalization/` - passed, 11 files and 96 tests

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Generic trailing-s fallback corrupts valid singular descriptors

**File:** `src/normalizer/singularize.ts:29`

**Issue:** The final fallback strips any trailing `s` from words longer than two characters unless they end in `ss`. The protected set covers a few known false plurals (`gas`, `iris`, `citrus`, etc.), but it is not sufficient for perfume-domain descriptors. Common singular raw descriptors such as `lotus` and `osmanthus` normalize to `lotu` and `osmanthu`, respectively. Those outputs are deterministic and pass the canonical charset invariant, so this bug silently creates wrong descriptor keys and can prevent seed/corpus terms from converging to their intended canonical descriptor.

**Fix:**

```ts
const NON_PLURAL_TERMINALS = new Set([
  'gas',
  'iris',
  'citrus',
  'anis',
  'lotus',
  'osmanthus',
  // existing protected terminals...
])

const singularizeToken = (word: string): string => {
  const irregular = lookupIrregularPlural(word)
  if (irregular !== undefined) return irregular

  if (NON_PLURAL_TERMINALS.has(word)) return word
  if (word.endsWith('us')) return word

  if (word.endsWith('ies') && word.length > 3) return word.slice(0, -3) + 'y'
  if (/(sses|xes|zes|ches|shes)$/.test(word)) return word.slice(0, -2)
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 2) return word.slice(0, -1)

  return word
}
```

Add regression coverage for both the atomic function and full pipeline, for example `singularize('lotus') === 'lotus'`, `singularize('osmanthus') === 'osmanthus'`, and `normalizeDescriptor('Lotus') === 'lotus'`.

## Warnings

### WR-01: Protected-terminal tests only cover the implementation's current whitelist

**File:** `src/tests/normalization/singularize.test.ts:20-29`

**Issue:** The singularization tests assert the current protected terminal list but do not include realistic perfume-domain singular terms outside that list. This allowed the trailing-`s` fallback defect in `singularize` to pass all normalization, property, trace, and convergence tests. Because the property tests only assert idempotency, determinism, and charset shape, semantically wrong outputs such as `lotu` still look valid to the suite.

**Fix:** Add representative negative cases for singular descriptors that end in `s`, and include at least one full-pipeline assertion so the public `normalizeDescriptor` behavior is covered:

```ts
expect(singularize('lotus')).toBe('lotus')
expect(singularize('osmanthus')).toBe('osmanthus')
expect(normalizeDescriptor('Lotus')).toBe('lotus')
expect(normalizeDescriptor('Osmanthus')).toBe('osmanthus')
```

---

_Reviewed: 2026-05-17T23:31:10Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
