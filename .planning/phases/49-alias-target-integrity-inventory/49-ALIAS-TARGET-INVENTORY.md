# Phase 49 Alias Target Integrity Inventory

## 1. Sources Inspected

- `data/taxonomy/descriptor_aliases.seed.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/taxonomy.json`

## 2. Method

This inventory was produced by directly reading the three JSON sources, comparing the seed alias dictionary against the compiled `aliases` dictionary key by key, and resolving every alias target against the compiled descriptor ID set extracted from `data/compiled/v2/taxonomy.json` via `families[].subfamilies[].descriptors[].id`.

## 3. Summary Counts

| Metric | Value |
|--------|-------|
| Seed aliases audited | 18 |
| Compiled aliases audited | 18 |
| Seed == Compiled | ✅ identical |
| Compiled descriptor IDs | 340 |
| Valid alias targets | 17 |
| Dangling alias targets | 1 |
| Mutations applied | 0 |

## 4. Seed vs Compiled Alias Equivalence

The alias mapping dictionary in `data/taxonomy/descriptor_aliases.seed.json` is dictionary-identical to the `aliases` dictionary in `data/compiled/v2/descriptor_aliases.json`.

## 5. Valid Alias Targets Table

| Alias | Target | Status |
|-------|--------|--------|
| ambergri | ambergris | ✅ Valid |
| banana_ripe_banana | banana | ✅ Valid |
| boi_de_rose | rosewood | ✅ Valid |
| bois_de_rose | rosewood | ✅ Valid |
| cedar | cedarwood | ✅ Valid |
| cedar wood | cedarwood | ✅ Valid |
| jasmin | jasmine | ✅ Valid |
| musky | musk | ✅ Valid |
| oak moss | oakmoss | ✅ Valid |
| orange blossom | orange_blossom | ✅ Valid |
| orange flower | orange_blossom | ✅ Valid |
| orange_bitter_orange | bitter_orange | ✅ Valid |
| orangeflower | orange_blossom | ✅ Valid |
| patchouly | patchouli | ✅ Valid |
| petit grain | petitgrain | ✅ Valid |
| rose_red_rose | rose | ✅ Valid |
| sandal wood | sandalwood | ✅ Valid |

## 6. Dangling Alias Targets Table

| Alias | Target | Status | Classification |
|-------|--------|--------|---------------|
| ylang ylang | ylang_ylang | ❌ Dangling | remediation_required |

## 7. Near-match / Descriptor Context

`ylang` exists in `data/compiled/v2/taxonomy.json` with the following compiled properties:

- `id: "ylang"`
- `source: "corpus"`
- `frequency: 41`
- `status: "candidate"`
- `review_required: true`
- `corpus_derived: true`

`ylang` is a corpus candidate, not a curated descriptor, and is semantically distinct from the expected target `ylang_ylang`.

`ylang_ylang` does not appear anywhere in the compiled taxonomy or in `data/taxonomy/taxonomy-seed.v2.json`.

## 8. Candidate Exception Classification

The D-02 classification framework defines three categories: `remediation_required`, `possible_exception_candidate`, and `invalid_or_noise_candidate`.

`ylang ylang -> ylang_ylang` is classified as `remediation_required` because:

- The alias `ylang ylang` is a semantically valid olfactory ingredient name.
- The target `ylang_ylang` does not exist in any compiled source.
- `ylang` (corpus candidate) is not equivalent to `ylang_ylang` (expected target).
- There is no documented evidence of intentional absence, so this is not a `possible_exception_candidate`.

## 9. Completeness Proof

All 18 aliases from both seed and compiled sources have been verified. 17 resolve to valid compiled descriptor IDs. 1 (`ylang ylang -> ylang_ylang`) is dangling. 18/18 aliases audited = 100% coverage.

## 10. Zero-Mutation Statement

Nenhum arquivo de dados, seed ou compiled foi modificado durante a execucao desta fase. Este inventario e estritamente read-only. Nenhuma decisao de remediacao e tomada nesta fase.

## 11. Handoff to Phase 50/51

- Phase 50 (Alias Target Integrity Automation): Will implement the automated validation gate and exception policy support.
- Phase 51 (Legacy Alias Remediation): Will resolve `ylang ylang -> ylang_ylang` and any other dangling targets confirmed in this inventory, using the Phase 50 gate as proof.
