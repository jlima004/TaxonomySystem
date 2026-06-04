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

## Task 3 — Baseline and official compile preparation

- **Baseline source:** current published `data/compiled/v2/*.json` before overwrite
- **Guard command:** `bash scripts/check-safety-guards.sh`
- **DEFAULT_PATHS guard:** `grep -n "version: '2.1.0'" src/cli/parse_args.ts`

### Baseline metrics

```json
{
  "versions": ["2.7.0", "2.7.0", "2.7.0"],
  "family_count": 10,
  "subfamily_count": 18,
  "seed_descriptor_count": 49,
  "compiled_descriptor_count": 324,
  "alias_count": 18,
  "graph_edge_count": 13,
  "review_queue_total": 269,
  "review_queue_by_type": {
    "corpus_candidate_low_support": 259,
    "seed_corpus_conflict": 10
  },
  "review_queue_by_severity": {
    "medium": 269
  },
  "validation_status": "ok",
  "quality_gate_status": "PASS",
  "generated_at": [
    "2026-06-02T20:49:04.282Z",
    "2026-06-02T20:49:04.282Z",
    "2026-06-02T20:49:04.282Z"
  ]
}
```

### Protected-boundary pre-publication hash manifest

```text
74968c3a85f16180324124b62548491809ac9e7b4d133abeabe847f815cb8ca3  data/taxonomy/taxonomy-seed.v1.json
4f5252af5b106025e4deb7f51100afaa131033b49bc0d6a74c7390658ff11144  data/taxonomy/descriptor_aliases.seed.json
bf9b37e377850c61c39b5bcc048a0a8fd618d8570fdd0605688fa2e439d013b7  data/inference/accord_map.v1.json
28dfa28f2cb3e214b30c578fb86ae103c1fa31d621e3925894fbcc3efa84798e  data/inference/accord_map.v2.json
f6b24000cb7445a8262456e97f1e9ef276627b1f36f997c1fc4cb1ee10b48232  data/inference/conflict_stopwords.v1.json
d4f67edbec9a67736458e7f5348a75799983a39736d96c78bd49c0a7794a3714  data/inference/curated_relations.v1.json
b586d5666df8657bf62f73d45812586ebbb4420c07705423c67e80994241958f  data/inference/curated_relations.v2.json
5de70c989186a9187744d47226be94d088b24d74a09571b9c3b6fd271ff4a0d6  data/inference/semantic_noise.v1.json
976e7d6576c350164ca8360c4b4c4824e593b9429896e0a1b1bdb2f63b663ad1  data/compiled/v1/descriptor_aliases.json
7500a84a6ce8d5cbe2963347c43e314a7fa2273528e4439e8de1814d9a768e1f  data/compiled/v1/similarity_matrix.json
9df09661a556494211e910f95ffb8ad84cc579296bbc4007af831767289633c7  data/compiled/v1/taxonomy.json
7b4e5cc87810d169e7f186591a6ef75bf18067af55c460df6eb6e4580d3fefa1  src/cli/parse_args.ts
6bd341cfd6bab05a47018bee4a2be31c0c28b21339ee1a2598b90729e74c3bd0  src/package.json
3f00b9f510c2eeefe9360339444c64622ed1574bdb07e02f63450da66a04d63a  src/package-lock.json
```

### Guard output

```text
PASS
25:  version: '2.1.0',
```

### Acceptance Criteria Evidence

- Baseline metrics were captured before any overwrite of `data/compiled/v2/*.json`.
- All three baseline artifact versions were `2.7.0`.
- The pre-publication hash manifest covered every D-48-CR06 protected path group.
- `bash scripts/check-safety-guards.sh` exited `0` before official publication.
- `src/cli/parse_args.ts` preserved the exact `DEFAULT_PATHS.version` value `2.1.0`.

## Task 4 — Official compile to `data/compiled/v2`

- **Command:** `cd src && npm run compile -- --version 2.8.0`

### Output

```text
> taxonomy-builder@0.1.0 precompile
> npm run build


> taxonomy-builder@0.1.0 build
> tsc


> taxonomy-builder@0.1.0 compile
> node dist/cli/compile.js --version 2.8.0

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
  ✓ ../data/compiled/v2/taxonomy.json
  ✓ ../data/compiled/v2/descriptor_aliases.json
  ✓ ../data/compiled/v2/similarity_matrix.json

Compilation complete
```

### Immediate post-compile verification

```text
OFFICIAL_VERSIONS_OK
data/compiled/v2/descriptor_aliases.json
data/compiled/v2/similarity_matrix.json
data/compiled/v2/taxonomy.json
```

### Acceptance Criteria Evidence

- Official compile used the default output resolution path with no `--out` and no `--output`.
- Compile stdout reported `validation_status=ok` and `quality_gate_status=PASS`.
- All three canonical `data/compiled/v2/*.json` artifacts were overwritten as one set.
- Immediate post-compile JSON parsing confirmed all three published artifact versions are `2.8.0`.
