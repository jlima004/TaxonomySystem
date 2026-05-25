gate_1_result: pass
phase: 12-taxonomy-seed-v2-default-switch-execution
plan: 02
checked_at: 2026-05-25T01:49:20Z
phase11_evidence_used_as_historical_only: true
source_validation_exit: 0
temporary_v1_compile_exit: 0
temporary_v2_compile_exit: 0
temporary_v2_repeat_compile_exit: 0
v2_deterministic_cmp: true
data_compiled_v2_absent: true
default_paths_remain_v1: true
protected_paths_clean: true
soft_findings_disposition: accepted_with_policy
legacy_alias_exception_policy: accepted
isolated_subfamilies: 0
review_queue_distribution_recorded: true
review_queue_acceptability: accepted_or_documented
official_artifact_publication: not_started
default_paths_switch: not_started

# Phase 12 Gate 1 Pre-Switch Revalidation

Gate 1 was executed against the current repository state. Phase 10/11 evidence remains historical context only; it was not used as a substitute for current validation.

This gate did not publish official v2 artifacts, did not create `data/compiled/v2`, did not run a default compile to official paths, did not change `DEFAULT_PATHS`, and did not edit source, tests, seed/input JSON, or `data/compiled/v1`.

## Source/Test/Build Gate

Command:

```bash
cd src && npm run typecheck && npm test && npm run build
```

Result: pass, exit 0.

Evidence summary:

- `npm run typecheck`: pass.
- `npm test`: pass, 53 test files and 373 tests passed.
- `npm run build`: pass.

## Temporary Compile Gate

Generated-at policy: fixed timestamp `2026-01-01T00:00:00.000Z`.

Temporary root:

```text
/tmp/opencode/taxonomy-phase12-switch
```

Commands:

```bash
cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase12-switch/v1-baseline --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z
```

```bash
cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v2.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v2.json --accords ../data/inference/accord_map.v2.json --out /tmp/opencode/taxonomy-phase12-switch/v2-candidate --version 2.0.0 --generated-at 2026-01-01T00:00:00.000Z
```

```bash
cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v2.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v2.json --accords ../data/inference/accord_map.v2.json --out /tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat --version 2.0.0 --generated-at 2026-01-01T00:00:00.000Z
```

Result: pass, all three compile commands exited 0 and wrote only temporary outputs under `/tmp/opencode/taxonomy-phase12-switch`.

## Temporary Output Metadata

`/tmp/opencode/taxonomy-phase12-switch/v1-baseline`:

| File | Bytes | SHA-256 |
|------|------:|---------|
| `taxonomy.json` | 43548 | `9df09661a556494211e910f95ffb8ad84cc579296bbc4007af831767289633c7` |
| `descriptor_aliases.json` | 466 | `b18be557a1d3a509985328b360827ae75983c6b03238107166b2061db3e18b1c` |
| `similarity_matrix.json` | 291223 | `7500a84a6ce8d5cbe2963347c43e314a7fa2273528e4439e8de1814d9a768e1f` |

`/tmp/opencode/taxonomy-phase12-switch/v2-candidate`:

| File | Bytes | SHA-256 |
|------|------:|---------|
| `taxonomy.json` | 76048 | `6c3e00a9b4fbb1744e02e0073b34179150a390447a7fc6057e113012d66449a1` |
| `descriptor_aliases.json` | 466 | `9ca7aa3d77a611a54f2d17b69d3f7d0c71cb57ee8587b45aa51d49eb711f0a6e` |
| `similarity_matrix.json` | 217510 | `3e607e3c0da6b06d28a2a28d60761a7069a12f707da37f920c802821e637c121` |

`/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat`:

| File | Bytes | SHA-256 |
|------|------:|---------|
| `taxonomy.json` | 76048 | `6c3e00a9b4fbb1744e02e0073b34179150a390447a7fc6057e113012d66449a1` |
| `descriptor_aliases.json` | 466 | `9ca7aa3d77a611a54f2d17b69d3f7d0c71cb57ee8587b45aa51d49eb711f0a6e` |
| `similarity_matrix.json` | 217510 | `3e607e3c0da6b06d28a2a28d60761a7069a12f707da37f920c802821e637c121` |

## Determinism Gate

Commands:

```bash
cmp -s /tmp/opencode/taxonomy-phase12-switch/v2-candidate/taxonomy.json /tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat/taxonomy.json
cmp -s /tmp/opencode/taxonomy-phase12-switch/v2-candidate/descriptor_aliases.json /tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat/descriptor_aliases.json
cmp -s /tmp/opencode/taxonomy-phase12-switch/v2-candidate/similarity_matrix.json /tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat/similarity_matrix.json
```

Result: pass. All three v2 candidate files are byte-identical to the repeat output.

## Graph/Review Queue Gate

The v2 candidate was checked from `/tmp/opencode/taxonomy-phase12-switch/v2-candidate/taxonomy.json` and `/tmp/opencode/taxonomy-phase12-switch/v2-candidate/similarity_matrix.json`.

Result: pass.

```json
{
  "isolated_subfamilies": 0,
  "review_queue_total": 317,
  "by_type": {
    "corpus_candidate_low_support": 284,
    "seed_corpus_conflict": 33
  },
  "by_severity": {
    "medium": 317
  },
  "edge_count": 13
}
```

Review queue entries expose `type` and `severity`. The accepted Phase 11 soft findings and legacy alias exception policy remain accepted with policy; this Gate 1 report does not claim those soft findings are resolved.

## Protected Path and Absence Gates

Official v2 absence check:

```bash
test ! -d data/compiled/v2
```

Result: pass. `data/compiled/v2` is still absent.

Current `DEFAULT_PATHS` v1 assertion:

```bash
node -e "const fs=require('fs'); const s=fs.readFileSync('src/cli/parse_args.ts','utf8'); const expected=[\"seedPath: 'data/taxonomy/taxonomy-seed.v1.json'\",\"relationsPath: 'data/inference/curated_relations.v1.json'\",\"accordsPath: 'data/inference/accord_map.v1.json'\",\"outputDir: 'data/compiled/v1'\",\"version: '1.0.0'\"]; for (const x of expected) { if (!s.includes(x)) { console.error(x); process.exit(1); } }"
```

Result: pass. The five `DEFAULT_PATHS` fields still point to v1.

Protected diff command:

```bash
git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json src/cli/parse_args.ts
```

Result: pass. Protected v1 artifacts, seed inputs, v2 inputs, alias seed, relation/accord inputs, and `src/cli/parse_args.ts` have no diff.

## Working Tree Note

The worktree still contains preexisting unrelated dirty entries under `graphify-out/*`. Gate 1 did not modify those files and did not touch protected paths.

## Gate Outcome

Gate 1 result: pass.

Plan 12-03 remains blocked unless this Gate 1 evidence is intentionally used for the next staged publication step. Gate 1 itself did not create official v2 artifacts or switch defaults.
