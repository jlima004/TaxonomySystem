# Phase 48 Verification Report

This report captures exact commands, gate results, metrics, diffs, hashes, and closure evidence for Phase 48 publication and closure.

## Task 1 — Pre-publication stability gate (WR-01)

- **Fixture check:** `PASS`
- **Fixture path:** `src/tests/fixtures/curation/46-DECISION-MATRIX.md`
- **Command:** `test -f src/tests/fixtures/curation/46-DECISION-MATRIX.md && printf 'FIXTURE_OK\n' && cd src && npm run test`

### Output

```text
FIXTURE_OK

> taxonomy-builder@0.1.0 test
> vitest run


 RUN  v3.2.4 /home/jlima/Projetos/TaxonomySystem/src

 ✓ tests/stress.test.ts (1 test) 345ms
   ✓ Performance Limits (Stress Test) > should load and process 50,000 instances under 1.5 seconds  343ms
stdout | tests/normalization/benchmark.test.ts > normalization benchmark > normalizes 100k descriptors under CI-safe threshold
100k normalizations: 344.80ms (290022 ops/sec)

 ✓ tests/normalization/benchmark.test.ts (1 test) 353ms
   ✓ normalization benchmark > normalizes 100k descriptors under CI-safe threshold  351ms
stdout | tests/analysis/stress.test.ts > analysis stress benchmark > analyzes 5k synthetic materials under CI-safe ceiling
analysis(5k): 756.27ms (ceiling 1500ms)

 ✓ tests/analysis/stress.test.ts (1 test) 772ms
   ✓ analysis stress benchmark > analyzes 5k synthetic materials under CI-safe ceiling  771ms
 ✓ tests/curation/v1_v2_comparison.test.ts (5 tests) 94ms
 ✓ tests/cli/compile.test.ts (5 tests) 95ms
 ✓ tests/curation/review_dispositions.test.ts (5 tests) 35ms
 ✓ tests/curation/taxonomy_seed_v2.test.ts (7 tests) 63ms
 ✓ tests/analysis/export.test.ts (4 tests) 52ms
 ✓ tests/compiler/compile_all.test.ts (12 tests) 48ms
 ✓ tests/corpus_loader.test.ts (10 tests) 21ms
 ✓ tests/analysis/orchestration.test.ts (11 tests) 42ms
 ✓ tests/analysis/cooccurrence.test.ts (7 tests) 38ms
 ✓ tests/curation/relation_accord_v2.test.ts (6 tests) 49ms
 ✓ tests/inference/seed_profile.test.ts (6 tests) 34ms
 ✓ tests/curation/alias_seed_v2.test.ts (6 tests) 45ms
 ✓ tests/analysis/alias_candidates.test.ts (8 tests) 34ms
 ✓ tests/inference/build_similarity_graph.test.ts (8 tests) 43ms
 ✓ tests/inference/descriptor_clusters.test.ts (4 tests) 24ms
 ✓ tests/compiler/compile_taxonomy.test.ts (9 tests) 27ms
 ✓ tests/inference/noise.test.ts (6 tests) 44ms
 ✓ tests/compiler/quality_gates.test.ts (2 tests) 22ms
 ✓ tests/seed_validator.test.ts (8 tests) 13ms
 ✓ tests/seed_loader.test.ts (4 tests) 18ms
 ✓ tests/compiler/validate_output.test.ts (45 tests) 41ms
 ✓ tests/compiler/compile_aliases.test.ts (5 tests) 24ms
 ✓ tests/analysis/alias_canonicalization.test.ts (4 tests) 18ms
 ✓ tests/cli/parse_args.test.ts (12 tests) 8ms
 ✓ tests/inference/semantic_overlap.test.ts (2 tests) 26ms
 ✓ tests/inference/tradition_score.test.ts (4 tests) 12ms
 ✓ tests/smoke.test.ts (1 test) 5ms
 ✓ tests/types.test.ts (9 tests) 14ms
 ✓ tests/inference/accord_compatibility.test.ts (3 tests) 12ms
 ✓ tests/analysis/frequency.test.ts (6 tests) 24ms
 ✓ tests/normalization/convergence.test.ts (7 tests) 14ms
 ✓ tests/inference/alias_evidence.test.ts (4 tests) 19ms
 ✓ tests/normalization/index.test.ts (2 tests) 7ms
 ✓ tests/normalization/trace.test.ts (64 tests) 14ms
 ✓ tests/normalization/singularize.test.ts (5 tests) 7ms
 ✓ tests/analysis/descriptor_sanitizer.test.ts (17 tests) 9ms
 ✓ tests/semantic_invariants.test.ts (4 tests) 14ms
 ✓ tests/analysis/similarity.test.ts (5 tests) 7ms
 ✓ tests/normalization.test.ts (3 tests) 6ms
 ✓ tests/normalization/property.test.ts (7 tests) 10ms
 ✓ tests/inference/placement_scoring.test.ts (4 tests) 5ms
 ✓ tests/normalization/case.test.ts (3 tests) 7ms
 ✓ tests/normalization/punctuation.test.ts (5 tests) 8ms
 ✓ tests/inference/final_score.test.ts (6 tests) 6ms
 ✓ tests/normalization/separators.test.ts (4 tests) 8ms
 ✓ tests/normalization/unicode.test.ts (3 tests) 7ms
 ✓ tests/normalization/irregular_plurals.test.ts (3 tests) 8ms
 ✓ tests/inference/seed_expansion_review.test.ts (1 test) 4ms
 ✓ tests/determinism.test.ts (1 test) 9ms
 ✓ tests/immutability.test.ts (1 test) 3ms

 Test Files  53 passed (53)
      Tests  376 passed (376)
   Start at  13:31:53
   Duration  8.53s (transform 1.14s, setup 0ms, collect 4.09s, tests 2.67s, environment 16ms, prepare 5.63s)
```

### Acceptance Criteria Evidence

- `test -f src/tests/fixtures/curation/46-DECISION-MATRIX.md` exited `0`.
- `cd src && npm run test` exited `0` and invoked `vitest run` via `src/package.json`.
- No source, package, fixture, or compiled artifact files were modified by this task.

## Task 2 — Sandbox compile in `/tmp`

- **Sandbox directory:** `/tmp/compile-2.8-validate`
- **Command:** `rm -rf /tmp/compile-2.8-validate && cd src && npm run precompile && npm run compile -- --version 2.8.0 --out /tmp/compile-2.8-validate --generated-at 2026-06-04T00:00:00.000Z`

### Output

```text
> taxonomy-builder@0.1.0 precompile
> npm run build


> taxonomy-builder@0.1.0 build
> tsc


> taxonomy-builder@0.1.0 precompile
> npm run build


> taxonomy-builder@0.1.0 build
> tsc


> taxonomy-builder@0.1.0 compile
> node dist/cli/compile.js --version 2.8.0 --out /tmp/compile-2.8-validate --generated-at 2026-06-04T00:00:00.000Z

Taxonomy Compiler — v2 default

  Loading inputs...
  ✓ Seed: 10 families, 18 subfamilies
  ✓ Aliases: 18 curated mappings
  ✓ Corpus: 33742 materials
  ✓ Relations: 14 curated
  ✓ Accords: 19 curated
  ✓ Noise: 15 downweighted descriptors
  ✓ Stopwords: 20 approved conflict stopwords
  Analyzing corpus...
  ✓ Analysis: 640 unique descriptors, 0 alias candidates
  Compiling...
  ✓ Taxonomy: 10 families, 340 descriptors
  ✓ Aliases: 18 mappings
  ✓ Similarity: 13 edges
  Review summary:
    total=256
    review_items_by_severity={"medium":256}
    review_items_by_type={"corpus_candidate_low_support":243,"seed_corpus_conflict":13}
    severity={"medium":256}
    type={"corpus_candidate_low_support":243,"seed_corpus_conflict":13}
    validation_status=ok
    quality_gate_status=PASS
  Writing outputs...
  ✓ /tmp/compile-2.8-validate/taxonomy.json
  ✓ /tmp/compile-2.8-validate/descriptor_aliases.json
  ✓ /tmp/compile-2.8-validate/similarity_matrix.json

Compilation complete
```

### Parsed sandbox metrics

```json
{
  "versions": ["2.8.0", "2.8.0", "2.8.0"],
  "family_count": 10,
  "subfamily_count": 18,
  "seed_descriptor_count": 61,
  "compiled_descriptor_count": 340,
  "alias_count": 18,
  "graph_edge_count": 13,
  "review_queue_total": 256,
  "review_queue_by_type": {
    "corpus_candidate_low_support": 243,
    "seed_corpus_conflict": 13
  },
  "review_queue_by_severity": {
    "medium": 256
  },
  "generated_at": [
    "2026-06-04T00:00:00.000Z",
    "2026-06-04T00:00:00.000Z",
    "2026-06-04T00:00:00.000Z"
  ]
}
```

### Acceptance Criteria Evidence

- Command used `--out /tmp/compile-2.8-validate` and did not use `--output`.
- Command did not use `--quality-report`.
- All three `/tmp/compile-2.8-validate/*.json` artifacts were created.
- Compile stdout reported `validation_status=ok` and `quality_gate_status=PASS`.
- Parsed sandbox JSON confirmed all artifact versions are `2.8.0` and the sandbox metrics align with the expected v2.8 publication candidate state.
- Repo working tree gained no new tracked changes from sandbox publication work; only `/tmp` outputs were created outside the repo.
