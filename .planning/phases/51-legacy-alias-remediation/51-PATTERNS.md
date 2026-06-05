# Phase 51: Legacy Alias Remediation - Pattern Map

**Mapped:** 2026-06-05
**Files analyzed:** 4 (1 data mutation, 1 artifact regeneration set, 2 test updates)
**Analogs found:** 4 / 4

> Narrow, internal data-hygiene phase. Every touched surface has a concrete in-repo
> analog. No new code is written — the work is one seed string, a re-compile/publish,
> and two test-expectation updates. Locked boundary (D-51-21..D-51-27) is a hard
> constraint: `descriptor_aliases.seed.json`, `alias_target_exceptions.v1.json`,
> `DEFAULT_PATHS`, relations/accords, scoring, Graphify, and UI stay untouched;
> `DEFAULT_PATHS.version` stays byte-identical at `2.1.0`.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `data/taxonomy/taxonomy-seed.v2.json` | model (curated seed data) | transform / file-I/O | In-file `floral_white.descriptors` peers + `petitgrain` (Ph20) / `lemon_peel` (Ph23) `add_target` | exact |
| `data/compiled/v2/{taxonomy,descriptor_aliases,similarity_matrix}.json` | config (generated artifacts) | batch / file-I/O | Phase 48 two-step compile/publish (`48-01-PLAN.md`, `48-VERIFICATION.md`) | exact |
| `src/tests/inventory/alias_target_inventory.test.ts` | test | data assertion | itself (mirror existing assertion structure) | exact (self) |
| `src/tests/cli/alias_integrity.test.ts` | test | data assertion | itself (mirror existing assertion structure) | exact (self) |

## Pattern Assignments

### `data/taxonomy/taxonomy-seed.v2.json` (model, transform/file-I/O)

**Analog:** in-file `floral/floral_white` block — peers are the structural analog;
`petitgrain` (Phase 20) and `lemon_peel` (Phase 23) are the curation precedent
(alias preserved, missing target added — never remap).

**Current `floral_white` block** (`data/taxonomy/taxonomy-seed.v2.json` lines 13-27):

```13:27:data/taxonomy/taxonomy-seed.v2.json
        {
          "id": "floral_white",
          "name": "White Floral",
          "descriptors": [
            "jasmine",
            "tuberose",
            "gardenia",
            "orange_blossom",
            "lily_of_the_valley",
            "freesia",
            "osmanthus",
            "elderflower",
            "linden_flower"
          ]
        },
```

**Exact mutation pattern** — descriptors are plain strings; append `"ylang_ylang"`
after `"linden_flower"` (single added element, comma after `"linden_flower"`):

```json
          "descriptors": [
            "jasmine",
            "tuberose",
            "gardenia",
            "orange_blossom",
            "lily_of_the_valley",
            "freesia",
            "osmanthus",
            "elderflower",
            "linden_flower",
            "ylang_ylang"
          ]
```

**Do NOT:** touch `descriptor_aliases.seed.json` (D-51-05), add an exception
(D-51-03/14), touch or promote the corpus candidate `ylang` (D-51-02/08/26),
create a new family/subfamily (D-51-09), or use stretch placement (D-51-07).
Per D-51-15 the executor must document the white-floral safe-fit rationale in a
phase artifact **before** mutating; per D-51-16 halt to a manual-review checkpoint
if safe fit cannot be confirmed.

---

### `data/compiled/v2/{taxonomy,descriptor_aliases,similarity_matrix}.json` (config, batch/file-I/O)

**Analog:** Phase 48 explicit-version two-step publish. Artifacts are **regenerated,
never hand-edited** — the gate reads compiled IDs, so publication is mandatory after
the seed edit (D-51-20, Pitfall 2). `DEFAULT_PATHS` unchanged (D-51-21).

**Two-step compile/publish pattern** (from `48-01-PLAN.md` lines 156-158, 213-218 and
`48-VERIFICATION.md` lines 99-100, 263) — substitute version `2.9.0`:

```bash
# Run from the src/ package. precompile (tsc) runs automatically.
cd src

# (1) Sandbox compile — validation only, discarded. Use --out (NOT --output).
rm -rf /tmp/phase51-compile-validate && \
  npm run compile -- --version 2.9.0 --out /tmp/phase51-compile-validate --generated-at 2026-06-05T00:00:00Z

# (2) Official publish — NO --out; resolveOutputDir writes to ../data/compiled/v2.
npm run compile -- --version 2.9.0
```

**Version-alignment verification pattern** (mirror `48-01-PLAN.md` line 215, retarget `2.9.0`):

```bash
cd .. && node -e "const fs=require('fs'); for (const p of ['data/compiled/v2/taxonomy.json','data/compiled/v2/descriptor_aliases.json','data/compiled/v2/similarity_matrix.json']) { const j=JSON.parse(fs.readFileSync(p,'utf8')); if (j.version !== '2.9.0') throw new Error(p + ' version mismatch: ' + j.version); }"
```

**Expected compiled shape of the new descriptor** — a curated seed string compiles to
an object like its peer `jasmine` (`data/compiled/v2/taxonomy.json` lines 1158-1165):

```1158:1165:data/compiled/v2/taxonomy.json
            {
              "id": "jasmine",
              "source": "seed",
              "frequency": 135,
              "status": "curated",
              "review_required": false,
              "corpus_derived": false
            },
```

After publish, `ylang_ylang` appears as `{ "id": "ylang_ylang", "source": "seed",
"status": "curated", ... }`, making the alias target resolve. The alias map stays at
18 entries (regenerated, content unchanged). `data/compiled/v1/*` stays byte-identical.

**Do NOT:** pass `--output` (rejected as `Unknown option`); pass `--out` to the
official publish; edit compiled JSON by hand; bump `DEFAULT_PATHS.version`.

---

### `src/tests/inventory/alias_target_inventory.test.ts` (test, data assertion)

**Analog:** itself — update the pre-remediation locked counts in place; mirror the
existing assertion structure exactly.

**Counts assertion to update** (`src/tests/inventory/alias_target_inventory.test.ts` lines 74-97):

```74:97:src/tests/inventory/alias_target_inventory.test.ts
  it('audits live alias data with 18 seed/compiled entries, 340 descriptors, 17 valid, 1 dangling', async () => {
    const [seedAliases, compiled, taxonomy] = await Promise.all([
      readJson<AliasSeed>(seedAliasPath),
      readJson<CompiledAliases>(compiledAliasPath),
      readJson<CompiledTaxonomy>(compiledTaxonomyPath),
    ])
    const compiledAliases = compiled.aliases
    const descriptorIds = collectCompiledDescriptorIds(taxonomy)

    expect(Object.keys(seedAliases)).toHaveLength(18)
    expect(Object.keys(compiledAliases)).toHaveLength(18)
    expect(seedAliases).toEqual(compiledAliases)
    expect(descriptorIds.size).toBe(340)

    const valid = Object.fromEntries(
      Object.entries(seedAliases).filter(([, target]) => descriptorIds.has(target)),
    )
    const dangling = Object.fromEntries(
      Object.entries(seedAliases).filter(([, target]) => !descriptorIds.has(target)),
    )

    expect(Object.keys(valid)).toHaveLength(17)
    expect(dangling).toEqual({ 'ylang ylang': 'ylang_ylang' })
  })
```

**Required post-remediation edits** (keep structure; flip the locked numbers/expectations):
- `descriptorIds.size` → `341` (was `340`).
- `valid` length → `18` (was `17`).
- `dangling` → `{}` (was `{ 'ylang ylang': 'ylang_ylang' }`).
- Update the `it(...)` title to the post-remediation state (341 descriptors, 18 valid, 0 dangling).
- Alias-count assertions (`18` seed/compiled, `seedAliases).toEqual(compiledAliases`)
  stay unchanged — the alias map is untouched (D-51-05).

**Near-match assertion block to update** (`src/tests/inventory/alias_target_inventory.test.ts` lines 132-137):

```132:137:src/tests/inventory/alias_target_inventory.test.ts
    const compiledIds = collectCompiledDescriptorIds(taxonomy)
    const seedIds = collectSeedDescriptorIds(taxonomySeed)

    expect(compiledIds.has('ylang_ylang')).toBe(false)
    expect(seedIds.has('ylang_ylang')).toBe(false)
    expect(compiledIds.has('ylang')).toBe(true)
```

**Required edits:** flip `compiledIds.has('ylang_ylang')` and
`seedIds.has('ylang_ylang')` to `toBe(true)`. Keep `compiledIds.has('ylang')` →
`true` (corpus candidate `ylang` remains a separate descriptor, D-51-26). The
`ylang` source/status/review_required/corpus_derived assertions (lines 121-130) and
the inventory-artifact section checks (lines 99-108) stay unchanged — they assert the
locked Phase 49 inventory document, not the live post-remediation counts.

---

### `src/tests/cli/alias_integrity.test.ts` (test, data assertion)

**Analog:** itself — only the single "runs against real data" live-data case flips;
the temp-fixture PASS/FAIL cases and the npm-wiring/`--help` cases must stay untouched.

**Live-data case to update** (`src/tests/cli/alias_integrity.test.ts` lines 76-91):

```76:91:src/tests/cli/alias_integrity.test.ts
  it('runs against real data, outputs JSON, and exits 1 with expected ylang ylang failure', async () => {
    const exitCode = await runAliasIntegrityCli(['--json'])
    expect(exitCode).toBe(1)

    const jsonStr = consoleLogSpy.mock.calls[0]?.[0]
    expect(jsonStr).toBeDefined()
    const jsonOut = JSON.parse(jsonStr as string)
    expect(jsonOut.status).toBe('FAIL')
    expect(jsonOut.unresolved_target_count).toBe(1)
    expect(jsonOut.unresolved[0]).toEqual(
      expect.objectContaining({
        alias: 'ylang ylang',
        target: 'ylang_ylang',
      }),
    )
  })
```

**Required post-remediation edits** (keep the `runAliasIntegrityCli(['--json'])` +
`consoleLogSpy` + `JSON.parse` structure; flip the FAIL expectations to PASS):
- `exitCode` → `toBe(0)` (was `1`).
- `jsonOut.status` → `'PASS'` (was `'FAIL'`).
- `jsonOut.unresolved_target_count` → `0` (was `1`).
- Replace the `jsonOut.unresolved[0]` object-containing assertion with an empty-array
  assertion, e.g. `expect(jsonOut.unresolved).toHaveLength(0)`.
- Update the `it(...)` title to reflect exit 0 / PASS / no `ylang ylang` failure.

**Leave unchanged (still valid after remediation):**

```150:154:src/tests/cli/alias_integrity.test.ts
  it('supports --json output through the CLI entry invoked by alias:integrity script', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const exitCode = await runAliasIntegrityCli(['--json'])
    expect(exitCode).toBe(1)
```

> CAUTION: this wiring test (lines 150-171) also asserts `exitCode).toBe(1)` against
> live data. After remediation it must flip to `toBe(0)` as well, otherwise the suite
> fails. The shape-only `expect.objectContaining({ status, seed_alias_count, ... })`
> assertion stays valid (fields are still present at PASS). The temp-fixture
> `lemony: 'lemon'` PASS case (lines 94-110), the `bad_alias` FAIL case (lines 112-133),
> the `--help` case (lines 70-74), and the npm-script-wiring case (lines 138-148) are
> all independent of the live `ylang_ylang` state and must NOT be modified.

---

## Shared Patterns

### `add_target` curation (preserve alias, add the missing descriptor)
**Source:** `petitgrain` (Phase 20, `citrus/citrus_fresh`) / `lemon_peel` (Phase 23),
cited in `51-CONTEXT.md` Curation Precedents.
**Apply to:** the seed mutation. Resolve a dangling alias by adding its target
descriptor to curated seed as a plain string — never by remapping the alias, adding
an exception, or dropping the alias.

### Two-step explicit-version publish, defaults untouched
**Source:** `.planning/phases/48-v2-8-artifact-publication-closure/48-01-PLAN.md` (lines 156, 213) and `48-VERIFICATION.md` (lines 99-100, 263).
**Apply to:** the `data/compiled/v2/*` regeneration. Sandbox-compile to `/tmp` with
`--out`, then official publish with default output resolution; both carry
`--version 2.9.0`. `DEFAULT_PATHS` (incl. `version: '2.1.0'`) stays byte-identical.

### State-locked test update (flip evidence, preserve structure)
**Source:** the two test files themselves.
**Apply to:** both test updates. Phases 49/50 encoded the pre-remediation state as
locked expectations; remediation intentionally invalidates them. Update only the
numeric/boolean expectations and titles tied to the live `ylang_ylang` resolution —
preserve all helper functions, fixtures, and unrelated assertions verbatim.

### Deterministic before/after proof gate
**Source:** `src/cli/alias_integrity.ts` via `npm run alias:integrity [-- --json]` (Phase 50).
**Apply to:** the proof chain. Before mutation: exit 1, 1 unresolved
`ylang ylang -> ylang_ylang`. After publish: exit 0, 341 descriptors, 18 valid, 0
unresolved. Do not hand-roll a diff script.

## No Analog Found

None. Every touched surface maps to a concrete in-repo analog (in-file peers, the
Phase 48 publish precedent, and the test files themselves).

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| — | — | — | All four surfaces have exact analogs. |

## Metadata

**Analog search scope:** `data/taxonomy/`, `data/compiled/v2/`, `src/tests/{inventory,cli}/`, `.planning/phases/48-v2-8-artifact-publication-closure/`
**Files scanned:** seed (floral_white block), compiled taxonomy (jasmine peer shape), 2 test files, Phase 48 plan/verification/research
**Pattern extraction date:** 2026-06-05
