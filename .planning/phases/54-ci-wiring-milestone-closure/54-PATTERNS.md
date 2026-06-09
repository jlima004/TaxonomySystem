# Phase 54: CI Wiring & Milestone Closure - Pattern Map

**Mapped:** 2026-06-08
**Files analyzed:** 8
**Analogs found:** 7 / 8

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `.github/workflows/ci.yml` | config | event-driven batch | No in-repo workflow; use `src/package.json` + `54-RESEARCH.md` workflow example | no-analog |
| `src/tests/analysis/stress.test.ts` | test | batch transform/performance | `src/tests/normalization/benchmark.test.ts` + same file current structure | exact |
| `src/package.json` | config | batch command orchestration | `src/package.json` existing scripts | exact-preserve |
| `.planning/phases/54-ci-wiring-milestone-closure/54-SUMMARY.md` | documentation | batch audit/report | `.planning/phases/53-alias-integrity-gate-hardening/53-03-SUMMARY.md` | role-match |
| `.planning/phases/54-ci-wiring-milestone-closure/54-VERIFICATION.md` | documentation | batch audit/report | `.planning/phases/53-alias-integrity-gate-hardening/53-VERIFICATION.md` | role-match |
| `.planning/phases/54-ci-wiring-milestone-closure/54-VALIDATION.md` | documentation | batch validation | `.planning/phases/54-ci-wiring-milestone-closure/54-VALIDATION.md` draft | exact |
| `.planning/phases/54-ci-wiring-milestone-closure/54-UAT.md` | documentation | request-response/manual validation | `.planning/phases/53-alias-integrity-gate-hardening/53-UAT.md` | role-match |
| `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md` | config/documentation | batch milestone state | Existing same files | exact-preserve/update-after-proof |

## Pattern Assignments

### `.github/workflows/ci.yml` (config, event-driven batch)

**Analog:** No existing `.github/workflows/*` file exists. Use repository command contracts from `src/package.json` and the greenfield workflow shape from `54-RESEARCH.md`.

**Trigger/job pattern** (`54-RESEARCH.md` lines 195-219):
```yaml
name: CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  src:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm ci --prefix src
      - run: npm --prefix src run typecheck
      - run: npm --prefix src test
      - run: npm --prefix src run alias:integrity -- --json
      - run: npm --prefix src run verify:integrity -- --json
```

**Command source of truth** (`src/package.json` lines 6-17):
```json
"scripts": {
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "precompile": "npm run build",
  "compile": "node dist/cli/compile.js",
  "compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report --out /tmp/phase53-compile-quality && node dist/cli/alias_integrity.js",
  "safety:guard": "bash ../scripts/check-safety-guards.sh",
  "test": "vitest run",
  "test:watch": "vitest",
  "alias:integrity": "npm run precompile && node dist/cli/alias_integrity.js",
  "verify:integrity": "npm run precompile && node dist/cli/alias_integrity.js"
}
```

**Validation pattern:** Do not create wrapper scripts or mutate `compile`; workflow should consume these commands exactly.

---

### `src/tests/analysis/stress.test.ts` (test, batch transform/performance)

**Analog:** `src/tests/analysis/stress.test.ts` current structure; supporting performance benchmark analog `src/tests/normalization/benchmark.test.ts`.

**Imports pattern** (`src/tests/analysis/stress.test.ts` lines 1-4):
```typescript
import { performance } from 'node:perf_hooks'
import { describe, expect, it } from 'vitest'
import { analyzeCorpus } from '../../analyzer/analyze_corpus.js'
import { generateSyntheticCorpus } from './_fixtures/generate.js'
```

**Core benchmark pattern** (`src/tests/analysis/stress.test.ts` lines 8-18):
```typescript
describe('analysis stress benchmark', () => {
  it('analyzes 5k synthetic materials under CI-safe ceiling', () => {
    const corpus = generateSyntheticCorpus({ materials: 5000, seed: 42 })

    const start = performance.now()
    const analysis = analyzeCorpus(corpus)
    const elapsed = performance.now() - start

    expect(analysis.frequency.size).toBeGreaterThan(0)
    expect(analysis.cooccurrence.size).toBeGreaterThan(0)
    expect(elapsed).toBeLessThan(CI_SAFE_ANALYSIS_5K_CEILING_MS)
```

**Auditable log pattern** (`src/tests/analysis/stress.test.ts` lines 20-23):
```typescript
console.log(
  `analysis(5k): ${elapsed.toFixed(2)}ms ` +
    `(ceiling ${CI_SAFE_ANALYSIS_5K_CEILING_MS}ms)`,
)
```

**Supporting performance-test style** (`src/tests/normalization/benchmark.test.ts` lines 20-29):
```typescript
const iterations = 100_000
const start = performance.now()

for (let i = 0; i < iterations; i++) {
  normalizeDescriptor(testInputs[i % testInputs.length] ?? '')
}

const elapsed = performance.now() - start
expect(elapsed).toBeLessThan(5000)
console.log(`100k normalizations: ${elapsed.toFixed(2)}ms (${(iterations / elapsed * 1000).toFixed(0)} ops/sec)`)
```

**Planner note:** Preserve the positive assertions (`frequency`, `cooccurrence`) and benchmark purpose. Prefer an explicit `CI`-aware ceiling constant or CI load constant with log output naming the active ceiling/load.

---

### `src/package.json` (config, batch command orchestration)

**Analog:** Existing file; Phase 54 should normally read/preserve it rather than modify it.

**Compile isolation pattern** (`src/package.json` lines 7-16):
```json
"build": "tsc",
"typecheck": "tsc --noEmit",
"precompile": "npm run build",
"compile": "node dist/cli/compile.js",
"compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report --out /tmp/phase53-compile-quality && node dist/cli/alias_integrity.js",
"safety:guard": "bash ../scripts/check-safety-guards.sh",
"test": "vitest run",
"alias:integrity": "npm run precompile && node dist/cli/alias_integrity.js",
"verify:integrity": "npm run precompile && node dist/cli/alias_integrity.js"
```

**Script wiring test pattern** (`src/tests/cli/alias_integrity.test.ts` lines 146-162):
```typescript
it('exposes alias:integrity and verify:integrity without wiring into default test, build, or compile scripts', async () => {
  const pkg = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8')) as {
    scripts: Record<string, string>
  }

  for (const key of requiredScriptKeys) {
    expect(pkg.scripts[key], `missing scripts.${key}`).toBeDefined()
  }

  expect(pkg.scripts['alias:integrity']).toMatch(/alias_integrity\.js/)
  expect(pkg.scripts['verify:integrity']).toMatch(/alias_integrity\.js/)
  expect(pkg.scripts['verify:integrity']).toMatch(/precompile/)
  expect(pkg.scripts.test).not.toMatch(/alias:integrity|verify:integrity/)
  expect(pkg.scripts.build).not.toMatch(/alias:integrity|verify:integrity/)
  expect(pkg.scripts.compile).not.toMatch(/alias:integrity|verify:integrity|compile:quality/)
  expect(pkg.scripts['precompile']).not.toMatch(/alias:integrity|verify:integrity/)
})
```

---

### `.planning/phases/54-ci-wiring-milestone-closure/54-SUMMARY.md` (documentation, batch audit/report)

**Analog:** `.planning/phases/53-alias-integrity-gate-hardening/53-03-SUMMARY.md`

**Frontmatter pattern** (lines 1-15):
```yaml
---
phase: 53-alias-integrity-gate-hardening
plan: 03
subsystem: testing
tags: [verification, alias-integrity, boundary-proof]

requires:
  - phase: 53-01
    provides: verify:integrity and compile:quality script wiring
provides:
  - Complete Phase 53 proof package with boundary diff verification
affects: [phase-54-ci-wiring]
---
```

**Verification result table pattern** (lines 42-55):
```markdown
## Verification Results

| Check | Result |
|-------|--------|
| Focused regression (3 test files) | PASS (14 tests) |
| typecheck | PASS |
| alias:integrity --json | PASS 341/18/0 |
| verify:integrity --json | PASS 341/18/0 |
| Full suite | PASS (390/390) |
| Static compile isolation | PASS (`node dist/cli/compile.js`) |
| Boundary diff | PASS (no forbidden staged/unstaged changes) |
```

**Boundary notes pattern** (lines 64-68):
```markdown
## Boundary Notes

- No staged graphify-out changes
- Preexisting unstaged graphify-out dirty state not claimed as Phase 53 work
- No changes to data/taxonomy, data/compiled/v2, .github, scoring, UI, or knowledge-engine
```

**Phase 54 adaptation:** `.github/workflows/**` should be listed as intentional/limited CI scope, not forbidden.

---

### `.planning/phases/54-ci-wiring-milestone-closure/54-VERIFICATION.md` (documentation, batch audit/report)

**Analog:** `.planning/phases/53-alias-integrity-gate-hardening/53-VERIFICATION.md`

**Frontmatter pattern** (lines 1-11):
```yaml
---
phase: 53
status: passed
requirements_verified:
  - GATE-01
  - GATE-02
  - GATE-03
verification_date: 2026-06-09
---
```

**Must-have evidence table pattern** (lines 17-25):
```markdown
## Must-Haves

| Requirement | Verdict | Evidence |
|-------------|---------|----------|
| GATE-01 | PASS | `verify:integrity` and `compile:quality` include alias proof; `compile` unchanged |
| GATE-02 | PASS | `alias:integrity -- --json` and `verify:integrity -- --json` return PASS 341/18/0 |
| GATE-03 | PASS | Temp-fixture FAIL test preserves exit code 1 for unresolved targets |
```

**Proof commands pattern** (lines 27-34):
```bash
npm --prefix src run verify:integrity -- --json   # PASS 341/18/0
npm --prefix src run compile:quality              # exit 0, /tmp/phase53-compile-quality
npm --prefix src run compile -- --out /tmp/phase53-compile-smoke  # exit 0
npm --prefix src test                             # 390/390
```

**Phase 54 adaptation:** Required proof commands are `npm ci --prefix src`, `typecheck`, `test`, `alias:integrity -- --json`, `verify:integrity -- --json`, plus boundary proof.

---

### `.planning/phases/54-ci-wiring-milestone-closure/54-VALIDATION.md` (documentation, batch validation)

**Analog:** Existing Phase 54 validation draft.

**Validation infrastructure pattern** (`54-VALIDATION.md` lines 16-24):
```markdown
## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest via `src/vitest.config.ts` |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `npm --prefix src test -- tests/analysis/stress.test.ts` |
| **Full suite command** | `npm --prefix src test` |
```

**Per-task verification map pattern** (`54-VALIDATION.md` lines 39-46):
```markdown
| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
| 54-01-01 | 01 | 1 | CI-03 | T-54-01 | Stress test remains a performance-regression guard while becoming CI-safe | focused test | `npm --prefix src test -- tests/analysis/stress.test.ts` | ✅ | ⬜ pending |
| 54-02-01 | 02 | 2 | CI-01, CI-02, CI-03, CI-04 | T-54-02 | CI uses lockfile install and existing npm guardrails only | static/source | Source assertions against `.github/workflows/*.yml` | ❌ W0 | ⬜ pending |
| 54-03-01 | 03 | 3 | BOUND-01, BOUND-02, BOUND-03 | T-54-04 | Protected taxonomy, compiled, Graphify, scoring, UI, MVP, and Knowledge Engine scopes remain untouched/unclaimed | boundary audit | `git diff --name-only` and `git diff --cached --name-only` over protected paths | ✅ | ⬜ pending |
```

---

### `.planning/phases/54-ci-wiring-milestone-closure/54-UAT.md` (documentation, request-response/manual validation)

**Analog:** `.planning/phases/53-alias-integrity-gate-hardening/53-UAT.md`

**Manual test case pattern** (`53-UAT.md` lines 15-28 from grep context):
```markdown
### 1. verify:integrity Local Guardrail

expected: Run `npm --prefix src run verify:integrity -- --json` from repo root. Exits 0 with JSON PASS showing 341/18/0.

### 2. Normal Compile Isolation

expected: Run `npm --prefix src run compile -- --out /tmp/phase53-uat-smoke`. Exits 0. Terminal output shows only compile activity — no alias integrity proof or verify:integrity invocation.
```

**Phase 54 adaptation:** Present one UAT check at a time for CI workflow presence/remote run, locked command proof, boundary proof, and milestone audit routing.

---

### `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md` (config/documentation, batch milestone state)

**Analog:** Existing same files; update only after proof per D-25.

**Roadmap phase row pattern** (`.planning/ROADMAP.md` lines 81-83):
```markdown
- [x] **Phase 52: Retroactive Verification Closure** - Fechar a dívida documental da Phase 50 e tornar HYG-02/HYG-03 formalmente auditáveis. Completed 2026-06-06.
- [x] **Phase 53: Alias Integrity Gate Hardening** - Integrar `alias:integrity` em um guardrail local apropriado, sem quebrar compile normal. (completed 2026-06-09)
- [ ] **Phase 54: CI Wiring & Milestone Closure** - Adicionar/verificar GitHub Actions ou CI equivalente, rodar typecheck/test/alias integrity, e fechar v2.10.
```

**Requirements status pattern** (`.planning/REQUIREMENTS.md` lines 27-38):
```markdown
### CI Wiring

- [ ] **CI-01**: Maintainer can run GitHub Actions or equivalent CI that installs `src` package dependencies reproducibly.
- [ ] **CI-02**: CI verifies `npm --prefix src run typecheck`.
- [ ] **CI-03**: CI verifies `npm --prefix src test`.
- [ ] **CI-04**: CI verifies `npm --prefix src run alias:integrity -- --json`.

### Scope Protection

- [ ] **BOUND-01**: Reviewer can confirm v2.10 makes no changes to `data/taxonomy/taxonomy-seed.v2.json`.
- [ ] **BOUND-02**: Reviewer can confirm v2.10 does not publish or mutate `data/compiled/v2/*`.
- [ ] **BOUND-03**: Reviewer can confirm v2.10 does not open FUT-01, FUT-02, Graphify, scoring, UI, MVP or Knowledge Engine work.
```

**State current-position pattern** (`.planning/STATE.md` lines 23-31):
```markdown
**Current focus:** Phase 54 — ci wiring & milestone closure

## Current Position

Phase: 54
Plan: Not started
Status: Ready to plan
Last activity: 2026-06-09
```

## Shared Patterns

### Phase 53 Boundary Diff Proof, Adapted for Phase 54
**Source:** `.planning/phases/53-alias-integrity-gate-hardening/53-03-PLAN.md` lines 117-128 and `54-RESEARCH.md` lines 243-272  
**Apply to:** `54-VERIFICATION.md`, `54-SUMMARY.md`, final closure plan, and any boundary audit script/command.
```bash
set -e
graphify_staged=$(git diff --cached --name-only -- graphify-out 2>/dev/null)
if [ -n "$graphify_staged" ]; then
  printf "staged graphify-out forbidden changes:\n%s\n" "$graphify_staged"
  exit 1
fi

for mode in unstaged staged; do
  if [ "$mode" = staged ]; then
    files=$(git diff --cached --name-only -- \
      data/taxonomy/taxonomy-seed.v2.json \
      data/taxonomy/descriptor_aliases.seed.json \
      data/taxonomy/alias_target_exceptions.v1.json \
      data/compiled/v2 src/scoring src/ui src/knowledge-engine 2>/dev/null)
  else
    files=$(git diff --name-only -- \
      data/taxonomy/taxonomy-seed.v2.json \
      data/taxonomy/descriptor_aliases.seed.json \
      data/taxonomy/alias_target_exceptions.v1.json \
      data/compiled/v2 src/scoring src/ui src/knowledge-engine 2>/dev/null)
  fi
  if [ -n "$files" ]; then
    printf "%s forbidden changes:\n%s\n" "$mode" "$files"
    exit 1
  fi
done
```
**Phase 54 difference:** Do not include `.github` in the forbidden-path list. Instead, separately assert `.github` changes are limited to `.github/workflows/<ci>.yml`.

### Non-Mutating Safety Guard Style
**Source:** `scripts/check-safety-guards.sh` lines 15-17, 32-41, 66-72  
**Apply to:** boundary proof commands and closure artifacts.
```bash
# This script is NON-MUTATING. It never runs git add, git reset, git checkout,
# git clean, or git rm. It only reads repository state.

GRAPHIFY_STAGED=$(git diff --cached --name-only -- graphify-out)
if [ -n "$GRAPHIFY_STAGED" ]; then
  echo "GRAPHIFY_STAGED: the following graphify-out paths are staged for commit:" >&2
  VIOLATIONS=1
fi

if [ "$VIOLATIONS" -eq 0 ]; then
  echo "PASS"
  exit 0
else
  exit 1
fi
```

### Alias JSON Baseline Proof
**Source:** `src/tests/cli/alias_integrity.test.ts` lines 176-194 and `50-VERIFICATION.md` lines 42-50  
**Apply to:** workflow steps, verification artifacts, UAT, milestone audit evidence.
```typescript
expect(jsonOut).toEqual(
  expect.objectContaining({
    status: 'PASS',
    seed_alias_count: 18,
    compiled_descriptor_count: 341,
    valid_target_count: 18,
    unresolved_target_count: 0,
    unresolved: [],
  }),
)
```

### Vitest Test Discovery
**Source:** `src/vitest.config.ts` lines 1-7  
**Apply to:** stress test verification and full-suite CI expectation.
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts']
  }
})
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.github/workflows/ci.yml` | config | event-driven batch | Repository currently has no `.github/workflows/*`; use research example plus existing npm command contracts. |

## Metadata

**Analog search scope:** `.github/workflows/*`, `src/tests/**/*.test.ts`, `src/package.json`, `src/vitest.config.ts`, `scripts/check-safety-guards.sh`, `.planning/phases/52-*`, `.planning/phases/53-*`, `.planning/{ROADMAP,STATE,REQUIREMENTS}.md`  
**Files scanned:** 14 direct reads plus glob/grep result sets  
**Pattern extraction date:** 2026-06-08
