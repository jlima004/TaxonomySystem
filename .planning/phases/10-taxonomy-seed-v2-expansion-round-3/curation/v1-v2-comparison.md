# Phase 10 Plan 04: v1 Baseline vs v2 Round 3 Candidate Comparison

**Status:** PASS - zero hard failures found.  
**Generated:** 2026-05-24  
**Scope:** validation report only; v2 remains candidate and is not promoted to default.

## Compilation Setup

Both compiles were run with explicit input paths, explicit output directories under `/tmp/opencode/taxonomy-phase10-comparison/`, and a fixed timestamp. No CLI default output path was used.

| Compile | Seed | Relations | Accords | Output directory | Version | generated_at |
|---|---|---|---|---|---|---|
| v1 baseline | `data/taxonomy/taxonomy-seed.v1.json` | `data/inference/curated_relations.v1.json` | `data/inference/accord_map.v1.json` | `/tmp/opencode/taxonomy-phase10-comparison/v1-baseline` | `1.0.0` | `2026-01-01T00:00:00.000Z` |
| v2 candidate | `data/taxonomy/taxonomy-seed.v2.json` | `data/inference/curated_relations.v2.json` | `data/inference/accord_map.v2.json` | `/tmp/opencode/taxonomy-phase10-comparison/v2-candidate` | `2.0.0-round-3-candidate` | `2026-01-01T00:00:00.000Z` |

Outputs generated in both temporary directories:

- `taxonomy.json`
- `descriptor_aliases.json`
- `similarity_matrix.json`

Protected/default artifacts were not used as output targets. `data/compiled/v1/**` remains the official baseline and was not altered. No official `data/compiled/v2` artifact was created.

## Hard Gate Results

| Hard gate | Result | Evidence |
|---|---:|---|
| Schema invalid | PASS | Both CLI compiles completed with `validation_status=ok` and `quality_gate_status=PASS`. |
| Nondeterminism | PASS | v2 was recompiled to `/tmp/opencode/taxonomy-phase10-comparison/v2-candidate-repeat`; `cmp -s` matched all three generated JSON artifacts. |
| Hard/pattern-excludes in taxonomy | PASS | `cd src && npm test -- tests/curation/` passed 5 files and 28 tests. |
| Alias contamination | PASS | Both compiles reported `0 alias candidates`; v2 aliases contain only the existing curated aliases plus approved `musky -> musk`. |
| Auto-promotion without manual approval | PASS | New Round 3 seed, alias, relation, and accord changes trace to approved `r3-*` workbook blocks only. |
| Default drift | PASS | `src/cli/parse_args.ts` defaults still point to v1 seed, v1 relations, v1 accords, and `data/compiled/v1`. |
| Protected mutation | PASS | `git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` returned 0. |
| Curated change without workbook traceability | PASS | Curation tests assert approved Round 3 positive records and pending Round 3 negative records for seed, alias, relation, and accord inputs. |

**Hard failures:** none.

## 10 Validation Metrics

### 1. Coverage Counts

| Metric | v1 baseline | v2 candidate | Delta |
|---|---:|---:|---:|
| Families | 3 | 10 | +7 |
| Subfamilies | 6 | 18 | +12 |
| Total compiled descriptors | 177 | 303 | +126 |
| Seed descriptors | 21 | 39 | +18 |
| Corpus-derived candidates | 156 | 264 | +108 |
| Candidate/seed ratio | 7.43 | 6.77 | -0.66 |

The Round 3 candidate adds `amber_resinous`, `animalic`, and `fresh_spice` family coverage on top of the Phase 8/9 v2 candidate.

### 2. amber/resinous coverage

| Subfamily | Seed descriptors | Corpus candidates | Status |
|---|---|---:|---|
| `amber` | `amber` | 15 | Present through approved `r3-approval-001`. |
| `balsamic_resin` | `benzoin`, `labdanum` | 0 | Present through approved `r3-approval-003` and `r3-approval-004`; generic `resinous` and `balsamic` remain absent. |

Amber/resinous relation coverage is present through approved `r3-relation-001` (`amber` to `balsamic_resin`). Accord coverage is present through approved bridges from `balsamic_resin`/`amber` to `vanilla`, `woody_dry`, and `warm_spice`; pending `r3-accord-001` remains absent.

### 3. animalic coverage

| Subfamily | Seed descriptors | Corpus candidates | Status |
|---|---|---:|---|
| `musky` | `ambrette`, `musk` | 8 | Present through approved `r3-approval-006` and `r3-approval-008`; `musky` is an alias, not a duplicate primary descriptor. |
| `leathery` | `leathery` | 4 | Present through approved `r3-approval-009`; `leather` remains pending alias cleanup only. |

Animalic relation coverage is present through approved `r3-relation-006` (`musky` to `leathery`). Accord coverage is present through approved `musky` and `leathery` bridges to `floral_rose`, `vanilla`, `woody_dry`, and `balsamic_resin`; pending `r3-accord-006` remains absent.

### 4. fresh spice status

| Subfamily | Seed descriptors | Corpus candidates | Status |
|---|---|---:|---|
| `fresh_spice` | `anise` | 7 | Present through approved `r3-approval-010`; no empty `fresh_spice` endpoint was created. |

Fresh spice relation coverage is present through approved `r3-relation-011` (`fresh_spice` to `warm_spice`). Accord coverage is present through approved `r3-accord-012` (`fresh_spice` to `citrus_fresh`). Pending fresh/warm accord `r3-accord-011` and fresh/citrus relation `r3-relation-012` remain absent.

### 5. Approved-Or-Gap Traceability

| Area | Traceability result |
|---|---|
| Round 3 seed additions | Approved `r3-approval-001`, `r3-approval-003`, `r3-approval-004`, `r3-approval-006`, `r3-approval-008`, `r3-approval-009`, and `r3-approval-010` are present and tested. |
| Round 3 pending/generic seed candidates | `resinous`, `balsamic`, `musky`, `animal`, `civet`, and `anisic` remain absent or deferred as workbook-only findings. |
| Round 3 alias cleanup | Approved `r3-alias-cleanup-001` is applied as `musky -> musk`; pending `leather`, `ambery`, `balsamic resin`, and legacy ylang cleanup are absent/deferred. |
| Round 3 relations | Approved `r3-relation-001`, `r3-relation-006`, and `r3-relation-011` are applied; all pending relation proposals remain absent. |
| Round 3 accords | Approved `r3-accord-002`, `r3-accord-003`, `r3-accord-004`, `r3-accord-005`, `r3-accord-007`, `r3-accord-008`, `r3-accord-009`, `r3-accord-010`, and `r3-accord-012` are applied; all pending accord proposals remain absent. |
| Gap requirement | No Round 3 `relation_gap` or `accord_gap` entries are needed because every new Round 3 subfamily has at least one approved relation and one approved accord. |

### 6. Graph Coverage

| Metric | v1 baseline | v2 candidate | Delta |
|---|---:|---:|---:|
| Input relation_count | 6 | 14 | +8 |
| Input accord_count | 5 | 19 | +14 |
| Compiled graph edges | 6 | 13 | +7 |
| Graph density | 0.4000 | 0.0850 | -0.3150 |
| Isolated subfamilies | 0 | 0 | 0 |

Density decreases because v2 adds many subfamilies faster than compiled edge count, but all 18 v2 subfamilies participate in at least one compiled graph edge.

### 7. Generic Pressure

| Subfamily | v1 corpus candidates | v2 corpus candidates | Interpretation |
|---|---:|---:|---|
| `floral_rose` | 76 | 51 | Reduced by 25 after specific green, fruity, spicy, amber/resinous, animalic, and fresh spice coverage. |
| `citrus_fresh` | 33 | 23 | Reduced by 10. |
| `woody_dry` | 16 | 8 | Reduced by 8. |
| `amber` | - | 15 | New specific amber endpoint absorbs amber/resinous pressure. |
| `balsamic_resin` | - | 0 | New curated seed-only endpoint; generic `resinous` and `balsamic` were not promoted. |
| `musky` | - | 8 | New specific animalic endpoint absorbs musky pressure while `musky` itself remains alias-only. |
| `leathery` | - | 4 | New specific animalic endpoint. |
| `fresh_spice` | - | 7 | New concrete endpoint created only after approved `anise`. |
| `warm_spice` | - | 19 | Existing Phase 9 endpoint remains active and now links to fresh spice. |

The original overloaded v1 buckets continue to shed generic pressure. New v2 buckets absorb relevant corpus candidates without treating corpus evidence as curated truth.

### 8. Review Queue Quality

| Metric | v1 baseline | v2 candidate | Delta |
|---|---:|---:|---:|
| Review queue total | 427 | 317 | -110 |
| Medium severity items | 427 | 317 | -110 |
| `corpus_candidate_low_support` | 410 | 284 | -126 |
| `seed_corpus_conflict` | 17 | 33 | +16 |

The queue is smaller and more focused. The seed-corpus-conflict increase is an expected soft finding caused by adding curated low/zero-frequency seed truth that still requires manual rationale rather than automatic corpus confirmation.

### 9. Alias Targeted Cleanup Quality

| Metric | v1 baseline | v2 candidate | Status |
|---|---:|---:|---|
| Alias mappings | 11 | 11 | Same curated alias seed used for both compiles. |
| Alias candidates generated by compile | 0 | 0 | No contamination. |
| Round 3 approved alias additions | 1 | 1 | `musky -> musk` is applied and tested. |
| Legacy `ylang ylang -> ylang_ylang` | target absent in v1/v2 seed | target absent in v2 seed | Soft finding/deferred cleanup retained by explicit workbook defer entry. |

Targeted cleanup quality is acceptable for candidate validation. No pending Round 3 alias cleanup was applied.

### 10. Zero-Frequency Seeds

| v2 zero-frequency seed | Origin | Status |
|---|---|---|
| `citrus/citrus_bitter/bitter_orange` | inherited v1 seed | Soft finding retained. |
| `citrus/citrus_fresh/sweet_orange` | inherited v1 seed | Soft finding retained. |
| `woody/woody_mossy/tree_moss` | inherited v1 seed | Soft finding retained. |

No new Round 3 zero-frequency seed was introduced in the compiled candidate output.

### 11. Determinism, Schema, And Defaults

| Check | v1 baseline | v2 candidate | Result |
|---|---|---|---|
| Fixed timestamp | `2026-01-01T00:00:00.000Z` | `2026-01-01T00:00:00.000Z` | PASS |
| CLI compile exit code | 0 | 0 | PASS |
| Validation status | `ok` | `ok` | PASS |
| Quality gate status | `PASS` | `PASS` | PASS |
| Repeated v2 compile byte comparison | n/a | taxonomy, aliases, and similarity outputs match | PASS |
| Curation tests | n/a | `cd src && npm test -- tests/curation/` passed 28 tests | PASS |

## Protected File And Default-Drift Checks

| Constraint | Result |
|---|---|
| `data/compiled/v1/**` was not altered | PASS |
| `data/taxonomy/taxonomy-seed.v1.json` was not altered | PASS |
| `data/inference/curated_relations.v1.json` was not altered | PASS |
| `data/inference/accord_map.v1.json` was not altered | PASS |
| `src/cli/parse_args.ts` still points defaults to v1 | PASS |
| No official `data/compiled/v2` artifact exists | PASS |
| v2 remains candidate, not default | PASS |

`DEFAULT_PATHS` still use:

- `seedPath: data/taxonomy/taxonomy-seed.v1.json`
- `relationsPath: data/inference/curated_relations.v1.json`
- `accordsPath: data/inference/accord_map.v1.json`
- `outputDir: data/compiled/v1`
- `version: 1.0.0`

## Soft Findings

| Finding | Severity | Disposition |
|---|---|---|
| `ylang ylang -> ylang_ylang` alias target absent in v2 | Soft | Deferred legacy alias cleanup; no automatic alias removal or seed addition. |
| Graph density lower in v2 | Soft | Expected from expanding subfamilies; no isolated subfamilies remain. |
| Some inherited zero-frequency seeds remain | Soft | Inherited v1 seed issue; no new Round 3 zero-frequency seeds introduced. |
| v2 review queue still has 317 items | Soft | Candidate is improved but not default-ready; queue remains a curation surface. |
| Seed-corpus-conflict count increased | Soft | Accepted because curated seed truth can be low-frequency and must be justified by workbook approvals. |
| Pending Round 3 candidates remain | Soft | `resinous`, `balsamic`, `musky`, `animal`, `civet`, `anisic`, and pending aliases/relations/accords remain documented only. |

## Future Promotion Readiness Criteria Only

Phase 10 does not promote v2. A future default switch must satisfy all of these criteria in a separate plan:

| # | Criterion | Required future proof |
|---:|---|---|
| 1 | Coverage minimum | Curator accepts the v2 family/subfamily/descriptor coverage as default-ready. |
| 2 | Curation traceability | Every curated entry maps to approval ID, rationale, and evidence. |
| 3 | Alias quality | No absent alias targets unless explicitly accepted by policy. |
| 4 | Graph coverage | Every subfamily has relation/accord coverage or an approved gap rationale. |
| 5 | Review queue improvement | Queue remains reduced and more actionable than v1. |
| 6 | Generic pressure reduction | Overloaded v1 buckets remain relieved by specific curated subfamilies. |
| 7 | Zero hard failures | Compile, schema, tests, protected file checks, and default-drift checks pass. |
| 8 | Soft warnings acceptable | All warnings are documented with explicit disposition. |
| 9 | Deterministic migration plan | Future plan includes diff, default switch, rollback, and v1 archival strategy. |
| 10 | Human approval final | Curator explicitly approves the default switch. |

## Conclusion

The v2 Round 3 candidate passes validation as a candidate-only expansion. It adds amber/resinous coverage, animalic coverage, and concrete fresh spice status through approved Round 3 workbook entries, reduces review queue volume by 110 items, preserves v1/default files, creates no official v2 compiled artifact, and reports zero hard failures. v2 remains candidate-only and future promotion criteria are documentation only.
