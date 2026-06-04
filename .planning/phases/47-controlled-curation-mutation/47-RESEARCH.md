# Phase 47: Controlled Curation Mutation — Research

**Researched:** 2026-06-03
**Scope:** Internal repository artifacts only (no external research)

> **Historical note:** This Phase 47 document used `--output` in one compile command example. The actual CLI flag verified in `src/cli/parse_args.ts` is `--out` (`--output` is not supported). Phase 48 and later publication workflows must use `--out`.

## RESEARCH COMPLETE

## 1. Current Seed File Shape

**File:** `data/taxonomy/taxonomy-seed.v2.json`

| Metric | Value |
|--------|-------|
| Version | `2.0.0` |
| Families | 10 |
| Subfamilies | 18 |
| Total seed descriptors | **49** |
| metadata.created_at | `2026-05-23T00:00:00Z` |
| metadata.author | `Taxonomy Team` |
| metadata.description | `Expanded curated olfactory taxonomy seed v2 - Phase 10 Round 3 manual curation` |

**After Phase 47 mutation:** 49 + 12 = **61 seed descriptors expected**.

### Subfamily Descriptor Counts (Pre-Mutation Baseline)

| Family | Subfamily | Current Descriptors | Phase 47 Additions |
|--------|-----------|--------------------:|-------------------:|
| floral | floral_white | 5 (jasmine, tuberose, gardenia, orange_blossom, lily_of_the_valley) | +4 (freesia, osmanthus, elderflower, linden_flower) → **9** |
| floral | floral_rose | 3 | 0 |
| woody | woody_dry | 5 (cedarwood, vetiver, patchouli, sandalwood, rosewood) | +1 (agarwood) → **6** |
| woody | woody_mossy | 2 | 0 |
| citrus | citrus_fresh | 6 (lemon, bergamot, sweet_orange, grapefruit, petitgrain, lemon_peel) | +1 (tangerine) → **7** |
| citrus | citrus_bitter | 3 | 0 |
| gourmand | vanilla | 1 | 0 |
| green | herbal_green | 2 | 0 |
| green | leafy_green | 1 | 0 |
| fruity | tropical_fruit | 2 | 0 |
| fruity | red_fruit | 2 | 0 |
| fruity | orchard_fruit | 1 | 0 |
| spicy | warm_spice | 5 (cinnamon, clove, allspice, cumin, caraway) | +5 (carrot_seed, cardamom, saffron, cubeb, mace) → **10** |
| amber_resinous | amber | 2 | 0 |
| amber_resinous | balsamic_resin | 3 (labdanum, benzoin, opoponax) | +1 (tolu) → **4** |
| animalic | musky | 2 | 0 |
| animalic | leathery | 1 | 0 |
| fresh_spice | fresh_spice | 3 | 0 |

## 2. Target Path Validation

All 12 approved targets validated against `taxonomy-seed.v2.json`:

| Matrix ID | Descriptor | Family | Subfamily | Family Exists | Subfamily Exists | Already Present |
|:---------:|-----------|--------|-----------|:----:|:----:|:----:|
| 05 | carrot_seed | spicy | warm_spice | ✓ | ✓ | ✗ |
| 10 | freesia | floral | floral_white | ✓ | ✓ | ✗ |
| 11 | cardamom | spicy | warm_spice | ✓ | ✓ | ✗ |
| 14 | tangerine | citrus | citrus_fresh | ✓ | ✓ | ✗ |
| 15 | saffron | spicy | warm_spice | ✓ | ✓ | ✗ |
| 20 | osmanthus | floral | floral_white | ✓ | ✓ | ✗ |
| 21 | cubeb | spicy | warm_spice | ✓ | ✓ | ✗ |
| 22 | elderflower | floral | floral_white | ✓ | ✓ | ✗ |
| 29 | mace | spicy | warm_spice | ✓ | ✓ | ✗ |
| 30 | linden_flower | floral | floral_white | ✓ | ✓ | ✗ |
| 32 | agarwood | woody | woody_dry | ✓ | ✓ | ✗ |
| 37 | tolu | amber_resinous | balsamic_resin | ✓ | ✓ | ✗ |

**Result:** All 12 target paths reference existing family+subfamily nodes. None of the 12 descriptors are already present in the seed file. Zero new families or subfamilies needed.

## 3. Decision Matrix Structure

**File:** `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md`

- 40 total rows (ids 01–40)
- 12 rows with `mutation_allowed=true` and `disposition=promote_to_seed`
- 28 rows with `mutation_allowed=false` and `phase47_instruction=none`
- 0 rows with `add_alias` disposition
- `phase47_instruction` literal format: `add_seed target_family=<family> target_subfamily=<subfamily> descriptor=<descriptor>`

The 12 executable rows (ids: 05, 10, 11, 14, 15, 20, 21, 22, 29, 30, 32, 37) each have mechanical `phase47_instruction` values that can be parsed directly.

## 4. Available Tooling

### Package Scripts (from `src/package.json`)

| Script | Command |
|--------|---------|
| `typecheck` | `tsc --noEmit` |
| `test` | `vitest run` |
| `compile` | `node dist/cli/compile.js` |
| `safety:guard` | `bash ../scripts/check-safety-guards.sh` |
| `build` | `tsc` |
| `precompile` | `npm run build` |

### Binaries Confirmed

- `src/node_modules/.bin/tsc` → available ✓
- `src/node_modules/.bin/vitest` → available ✓
- `src/dist/cli/compile.js` → exists ✓

### Safety Guard

- `scripts/check-safety-guards.sh` — Phase 16 non-mutating guard
- Exit 0 = PASS, Exit 1 = FAIL
- Checks: staged `graphify-out/*`, staged protected paths, working-tree protected diffs
- Dirty `graphify-out/*` in working tree is `accepted_with_policy`

## 5. Sandbox Compile Command

Based on Phase 43 v2.7 precedent and `src/cli/parse_args.ts` defaults:

```bash
# Step 1: Build TypeScript (required before compile)
cd src && npm run build

# Step 2: Sandbox compile to /tmp
node dist/cli/compile.js \
  --seed ../data/taxonomy/taxonomy-seed.v2.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --corpus ../data/corpus \
  --relations ../data/inference/curated_relations.v2.json \
  --accords ../data/inference/curated_accords.v2.json \
  --output /tmp/compile-2.8-validate/ \
  --version 2.8.0
```

**Key flags:**
- `--version 2.8.0` sets the output version string
- `--output /tmp/compile-2.8-validate/` writes to temp directory (sandbox only)
- Input paths are explicit to match Phase 43 two-step precedent

**Success criteria from compile output:**
- Zero hard failures
- Capture: family count, subfamily count, seed descriptor count, total compiled descriptor count, review_queue count, graph edge count

## 6. Phase 42 / Phase 23 Precedent Pattern

The direct JSON Edit pattern for adding seed descriptors:
1. Open `data/taxonomy/taxonomy-seed.v2.json`
2. Navigate to `families[].subfamilies[]` where `id` matches `target_subfamily`
3. Append `descriptor` string to the end of the `descriptors` array
4. No other fields changed (no version bump, no metadata change, no key additions)

**Phase 42 applied:** peppermint, rosemary, cumin, spearmint, caraway, opoponax (6 descriptors)
**Phase 23 applied:** lemon_peel (1 descriptor)
**Phase 47 will apply:** 12 descriptors following the same pattern

## 7. Protected Boundaries Summary

### Allow-list (D-47-18)
- `data/taxonomy/taxonomy-seed.v2.json` (12 atomic additions only)
- `.planning/phases/47-controlled-curation-mutation/*`
- `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md` (bookkeeping)

### Block-list (D-47-19)
- `data/compiled/*`
- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/*`
- `src/cli/parse_args.ts`
- `src/**` (all source)
- `graphify-out/*`
- `package.json`, `package-lock.json`, `pnpm-lock.yaml`

## 8. Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Wrong descriptor appended to wrong subfamily | Parser assertion (D-47-08) verifies all 12 at exact paths |
| Extra modifications slip in | `git diff --name-only` allow-list assertion (D-47-21) |
| Safety guard fails due to dirty graphify-out | Only staged files trigger failure; dirty working tree is accepted_with_policy |
| Sandbox compile fails | Capture stderr/stdout; zero hard failures is the only gate — warnings are informational |
| tsc unavailable | Skip with documented note per D-47-13; binary confirmed available |

---

*Research type: internal_only*
*Research date: 2026-06-03*
