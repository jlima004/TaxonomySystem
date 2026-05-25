# Phase 12 Release and Migration Notes

**Status:** released. Phase 12 promotes taxonomy seed v2 to the CLI/compiler default after staged approval, validation, official artifact publication, post-switch validation, and rollback dry-run validation.

## What Changed

`DEFAULT_PATHS` now point to the v2 taxonomy inputs and official v2 output directory:

| Field | Current default |
|-------|-----------------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v2.json` |
| `relationsPath` | `data/inference/curated_relations.v2.json` |
| `accordsPath` | `data/inference/accord_map.v2.json` |
| `outputDir` | `data/compiled/v2` |
| `version` | `2.0.0` |

Preserved defaults:

| Field | Value |
|-------|-------|
| `aliasPath` | `data/taxonomy/descriptor_aliases.seed.json` |
| `corpusPath` | `data/enriched_materials.json` |
| `noisePath` | `data/inference/semantic_noise.v1.json` |

## Official Artifacts

The official v2 artifact set is:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

`data/compiled/v1` remains preserved as the v1 baseline/archive. The v2 promotion did not physically replace or remove `data/compiled/v1`.

Protected v1 inputs remain preserved:

- `data/taxonomy/taxonomy-seed.v1.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/accord_map.v1.json`

## Rollback

Rollback to v1 defaults was validated in a temporary worktree and recorded in `12-GATE-5-ROLLBACK-DRY-RUN.md` with `rollback_success: true`.

Validated rollback defaults are:

| Field | Rollback value |
|-------|----------------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` |
| `outputDir` | `data/compiled/v1` |
| `version` | `1.0.0` |

The rollback dry-run also validated explicit v1 compile to `/tmp/opencode/taxonomy-phase12-switch/rollback-v1-validation` without deleting `data/compiled/v2`.

## Explicit V1 Fallback

Consumers that need v1 can still use explicit CLI paths:

```bash
npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase12-switch/rollback-v1-validation --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z
```

This fallback is intentionally explicit. The default compile now writes v2 artifacts to `data/compiled/v2`.

## Approval and Soft Findings

The promotion was approved by `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md`.

Phase 11 accepted soft findings remain accepted with policy and are not claimed resolved by Phase 12. The legacy alias exception `ylang ylang -> ylang_ylang` remains accepted under the documented exception policy.

Known accepted soft findings include lower graph density due to wider v2 coverage, review queue size/distribution, inherited zero-frequency seeds, increased `seed_corpus_conflict`, and pending/deferred curation candidates. These remain documented release tradeoffs, not blockers for this approved switch.

## Validation Evidence

- Gate 0: `12-GATE-0-PREFLIGHT.md`
- Gate 1: `12-GATE-1-PRE-SWITCH-REVALIDATION.md`
- Gate 2: `12-GATE-2-V2-PUBLICATION.md`
- Gate 3: `12-GATE-3-DEFAULT-PATHS-SWITCH.md`
- Gate 4: `12-GATE-4-POST-SWITCH-VALIDATION.md`
- Gate 5: `12-GATE-5-ROLLBACK-DRY-RUN.md`
- Gate 6: `12-GATE-6-FINAL-CLOSURE.md`

## Non-Goals

- v1 was not removed.
- v2 did not physically replace `data/compiled/v1`.
- Accepted soft findings were not claimed resolved.
- No new taxonomy curation was performed during release documentation.
