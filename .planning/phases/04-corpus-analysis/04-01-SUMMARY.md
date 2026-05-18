---
phase: 04-corpus-analysis
plan: 04-01
subsystem: analyzer-core
tags: [typescript, vitest, frequency, cooccurrence, determinism]

requires:
  - phase: 03-normalization-pipeline
    provides: normalizeDescriptor canonicalization and charset guarantees
provides:
  - Frequency and co-occurrence analyzer primitives
  - Single-pass `analyzeCorpus` orchestrator baseline
  - Deterministic JSON exporters for analysis artifacts
  - Phase 4 analysis fixtures and stress benchmark harness
affects: [analyzer, types, tests]

tech-stack:
  added: []
  patterns:
    - Sparse map-based co-occurrence with canonical pair keys
    - Document-frequency counting with per-material descriptor dedup
    - Byte-deterministic JSON export ordering

key-files:
  created:
    - src/types/analysis.ts
    - src/analyzer/pair_key.ts
    - src/analyzer/frequency.ts
    - src/analyzer/cooccurrence.ts
    - src/analyzer/analyze_corpus.ts
    - src/analyzer/export.ts
    - src/analyzer/index.ts
    - src/tests/analysis/frequency.test.ts
    - src/tests/analysis/cooccurrence.test.ts
    - src/tests/analysis/orchestration.test.ts
    - src/tests/analysis/export.test.ts
    - src/tests/analysis/stress.test.ts
    - src/tests/analysis/_fixtures/generate.ts
    - src/tests/fixtures/analysis/tiny_corpus.json
  modified:
    - src/types/index.ts

requirements-completed: [ANAL-01, ANAL-02]

duration: 14 min
completed: 2026-05-18
---

# Phase 4 Plan 04-01 Summary

Core corpus-analysis primitives are implemented and verified: frequency counting, sparse co-occurrence generation, single-pass orchestration, and deterministic exports.

## Highlights

- Implemented `computeDescriptorFrequency`, `computeCoOccurrence`, and `computeFrequencyAndCoOccurrence` with normalization-aware dedup rules.
- Added pair-key encoder/decoder (`a|b`, `a < b`) and enforced self-pair rejection.
- Added `analyzeCorpus` orchestration contract returning `{ frequency, cooccurrence, aliasCandidates }`.
- Added deterministic exporters with stable lexical ordering for descriptors and edge lists.
- Added analysis fixture generator, tiny fixture corpus, and stress benchmark for 5k materials.

## Verification

- `npm --prefix src run build` - passed
- `npm --prefix src exec vitest run src/tests/analysis/` - passed

## Notes

- No runtime dependencies were added.
- Analysis APIs remain pure and in-memory; persistence is explicit via exporter functions.
