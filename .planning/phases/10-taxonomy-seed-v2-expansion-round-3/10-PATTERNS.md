# Phase 10: Taxonomy Seed v2 Expansion Round 3 - Pattern Map

**Mapped:** 2026-05-23  
**Files analyzed:** 8 target groups  
**Analogs found:** 8 / 8  
**Scope:** pattern guidance only; do not execute plans, tests, builds, compiles, or data generation during pattern mapping.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md` | curation workbook | event-driven/manual approval ledger | same file Phase 8/9 sections, especially lines 295-706 | exact |
| `data/taxonomy/taxonomy-seed.v2.json` | data model / seed config | CRUD/data mutation | `data/taxonomy/taxonomy-seed.v2.json` Phase 9 state lines 84-160 | exact |
| `data/taxonomy/descriptor_aliases.seed.json` | data config / alias map | transform/lookup | `data/taxonomy/descriptor_aliases.seed.json` lines 1-12 + alias test lines 162-173 | exact |
| `data/inference/curated_relations.v2.json` | data config / relation input | graph CRUD | `data/inference/curated_relations.v2.json` lines 46-80 | exact |
| `data/inference/accord_map.v2.json` | data config / accord input | graph CRUD | `data/inference/accord_map.v2.json` lines 40-72 | exact |
| `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md` | validation report | batch/reporting | `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/curation/v1-v2-comparison.md` lines 1-204 | exact |
| `src/tests/curation/*.test.ts` | test | request-response-style assertions over files | `src/tests/curation/taxonomy_seed_v2.test.ts`, `alias_seed_v2.test.ts`, `relation_accord_v2.test.ts`, `v1_v2_comparison.test.ts` | exact |
| Protected files: `data/taxonomy/taxonomy-seed.v1.json`, `data/inference/curated_relations.v1.json`, `data/inference/accord_map.v1.json`, `data/compiled/v1/**`, `src/cli/parse_args.ts` | protected input/defaults | no-write verification | `09-04-PLAN.md` lines 116-125 + `parse_args.ts` lines 15-24 | exact |

## Pattern Assignments

### `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md` (curation workbook, event-driven/manual approval ledger)

**Closest analog:** same workbook Phase 9 Round 2 section; plan analog `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-01-PLAN.md`.

**Required read_first files:**
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md`
- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md`
- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-RESEARCH.md`

**Workbook section pattern** (`candidate-review.md` lines 295-315):
```markdown
# Phase 09 / Round 2 Curation

Status: pending human curation. This Round 2 section records proposals only; no JSON data, compiled artifacts, aliases, relations, or accords may be changed until the relevant workbook entries are manually approved with rationale and evidence.

## Round 2 Guardrails

- `round: phase_09_round_2` identifies every Round 2 proposal below.
- `manual_approval: pending` means the entry is not approved and must not be promoted.
- `promotion_effect: none` applies to every pending proposal in this section.
- Corpus/review_queue evidence is support only and never substitutes for manual approval.
```

**Approval block pattern** (`candidate-review.md` lines 317-331):
```markdown
### r2-approval-001

- `approval_id`: r2-approval-001
- `round`: phase_09_round_2
- `family_id`: `fruity`
- `subfamily_id`: `tropical_fruit`
- `descriptor_id`: `pineapple`
- `manual_approval`: approved
- `primary_disposition`: promote_to_seed
- `rationale`: Approved manually ... Corpus/review_queue evidence supports prioritization only and does not define approval by itself.
- `evidence`: Evidence-ranked queue priority 8; review_queue[298] ... Corpus evidence is support only.
```

**Phase 10 constraints:** use `# Phase 10 / Round 3 Curation`; new IDs must be `r3-approval-*`, `r3-relation-*`, `r3-accord-*`, `r3-alias-cleanup-*`, and `r3-defer-*`; `round: phase_10_round_3`; initial proposal status should be `manual_approval: pending` unless a human has already persisted approval in the workbook.

**Executor pitfalls:** do not treat Phase 8 `approval-001` or Phase 9 `r2-*` as Round 3 approval; do not accept chat approval; do not create empty `fresh_spice`; do not reopen deferred ylang or broad floral cleanup.

**Verification assertions:** workbook contains Phase 10/Round 3 section; each mutation later has matching `r3-*` block with `round: phase_10_round_3`, approval/disposition, rationale, and evidence; pending blocks retain `promotion_effect: none`.

---

### `data/taxonomy/taxonomy-seed.v2.json` (data model / seed config, CRUD/data mutation)

**Closest analog:** Phase 9 v2 seed state in `data/taxonomy/taxonomy-seed.v2.json`.

**Required read_first files:**
- `data/taxonomy/taxonomy-seed.v2.json`
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md`
- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-CONTEXT.md`

**Family/subfamily append pattern** (`taxonomy-seed.v2.json` lines 84-160):
```json
{
  "id": "fruity",
  "name": "Fruity",
  "subfamilies": [
    {
      "id": "tropical_fruit",
      "name": "Tropical Fruit",
      "descriptors": [
        "pineapple",
        "banana"
      ]
    }
  ]
}
```

**Traceability test pattern** (`src/tests/curation/taxonomy_seed_v2.test.ts` lines 153-171):
```typescript
additions.forEach(addition => {
  const [familyId, subfamilyId, descriptorId] = addition.split('/')
  const approval = approvals.find(
    entry => entry.familyId === familyId && entry.subfamilyId === subfamilyId && entry.descriptorId === descriptorId,
  )
  expect(approval, `missing approved workbook entry for ${addition}`).toBeDefined()
  expect(approval?.rationale.length).toBeGreaterThan(0)
  expect(approval?.evidence.length).toBeGreaterThan(0)
})
```

**Phase 10 constraints:** add only approved `amber_resinous`, `animalic`, and conditional `fresh_spice` records from `r3-approval-*`; no empty subfamilies; no v1/default mutation; keep v2 candidate-only.

**Executor pitfalls:** duplicate descriptor `musk`/`musky`; generic leakage from `animal`, `resinous`, or `balsamic`; creating `fresh_spice` without `anise` or another concrete approved descriptor.

**Verification assertions:** `version` remains `2.0.0`; `validateSeed(v2).ok`; every new descriptor has an approved Round 3 workbook block; no global descriptor duplicates; v1 seed diff is empty.

---

### `data/taxonomy/descriptor_aliases.seed.json` (data config / alias map, transform/lookup)

**Closest analog:** existing alias map and `alias_seed_v2.test.ts` approval gate.

**Required read_first files:**
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md`

**Alias shape pattern** (`descriptor_aliases.seed.json` lines 1-12):
```json
{
  "jasmin": "jasmine",
  "orange flower": "orange_blossom",
  "ylang ylang": "ylang_ylang"
}
```

**Approved add_alias gate** (`src/tests/curation/alias_seed_v2.test.ts` lines 162-173):
```typescript
const approvedAliasEntries = parseApprovedAliasEntries(workbook)
const approvedAliasMap = Object.fromEntries(approvedAliasEntries.map(entry => [entry.alias, entry.canonical]))
const allowedAliases = { ...existingApprovedAliases, ...approvedAliasMap }

expect(approvedAliasEntries).toHaveLength(0)
expect(aliasSeed).toEqual(allowedAliases)
```

**Phase 10 constraints:** add aliases only from approved Round 3 `primary_disposition: add_alias` blocks with clear source/key, canonical target existing in v2 seed, rationale, and evidence; preserve all legacy aliases; do not remove/remap `ylang ylang -> ylang_ylang`.

**Executor pitfalls:** treating alias cleanup/defer as `add_alias`; adding alias to absent canonical target; adding `musk` and `musky` as duplicate primary descriptors instead of resolving canonical/alias policy.

**Verification assertions:** all new alias targets exist in v2 descriptors; alias keys are not primary descriptors; no candidate/deferred placeholder targets; if no approved `add_alias`, file is unchanged.

---

### `data/inference/curated_relations.v2.json` (data config / relation input, graph CRUD)

**Closest analog:** Phase 9 relation additions in `data/inference/curated_relations.v2.json`.

**Required read_first files:**
- `data/inference/curated_relations.v2.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md`

**Relation append pattern** (`curated_relations.v2.json` lines 46-80):
```json
{
  "source_subfamily_id": "herbal_green",
  "target_subfamily_id": "leafy_green",
  "relation": "same_family_tradition",
  "score": 0.85,
  "evidence": "manual_approval"
}
```

**Endpoint/score test pattern** (`src/tests/curation/relation_accord_v2.test.ts` lines 106-119, 128-132):
```typescript
for (const relation of relations) {
  expect(subfamilyIds.has(relation.source_subfamily_id), relation.source_subfamily_id).toBe(true)
  expect(subfamilyIds.has(relation.target_subfamily_id), relation.target_subfamily_id).toBe(true)
  expect(relation.score, `${relation.source_subfamily_id}->${relation.target_subfamily_id}`).not.toBe(0)
  expect(relation.evidence).toMatch(/manual|approved|phase_7|phase_8|workbook|fixture/u)
}
```

**Phase 10 constraints:** append only approved `r3-relation-*` records; endpoints must exist after seed update; score must be manual and in `[0,1]`; if no approval exists, document `relation_gap` in workbook, not JSON; no `score: 0` placeholders.

**Executor pitfalls:** adding relation before endpoint exists; connecting `fresh_spice` when absent; using corpus/co-occurrence as score source; writing to `.v1` relation input.

**Verification assertions:** relation input validates; every endpoint exists in v2 seed; every new Round 3 subfamily has relation or persisted relation gap; `curated_relations.v1.json` diff is empty.

---

### `data/inference/accord_map.v2.json` (data config / accord input, graph CRUD)

**Closest analog:** Phase 9 accord additions in `data/inference/accord_map.v2.json`.

**Required read_first files:**
- `data/inference/accord_map.v2.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md`

**Accord append pattern** (`accord_map.v2.json` lines 40-72):
```json
{
  "source_subfamily_id": "warm_spice",
  "target_subfamily_id": "vanilla",
  "accord": "strong_accord_pair",
  "score": 0.75,
  "reference": "manual_approval"
}
```

**Neutral missing pattern** (`src/tests/curation/relation_accord_v2.test.ts` lines 157-166):
```typescript
const accord = computeAccordCompatibility('vanilla', 'woody_mossy', accords)

expect(accord).toBeUndefined()
expect(JSON.stringify(accords)).not.toMatch(/"score":0(?:[,}])/u)
```

**Phase 10 constraints:** append only approved `r3-accord-*`; endpoints must exist; missing accords remain neutral/undefined and require workbook `accord_gap` if associated with a new subfamily; write only `.v2` input.

**Executor pitfalls:** score `0` as placeholder; `fresh_spice` accord when `fresh_spice` absent; using `reference` value not traceable to workbook/manual approval.

**Verification assertions:** accord input validates; all endpoints exist; scores are numbers in `[0,1]` and nonzero; every new Round 3 subfamily has accord or persisted accord gap; `accord_map.v1.json` diff is empty.

---

### `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md` (validation report, batch/reporting)

**Closest analog:** `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/curation/v1-v2-comparison.md`.

**Required read_first files:**
- `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/curation/v1-v2-comparison.md`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md`

**Report header/setup pattern** (`v1-v2-comparison.md` lines 1-22):
```markdown
# Phase 09 Plan 04: v1 Baseline vs v2 Candidate Comparison

**Status:** PASS — zero hard failures found.  
**Generated:** 2026-05-23  
**Scope:** validation report only; v2 remains an explicit candidate and is not promoted to default.

## Compilation Setup
```

**Hard gate pattern** (`v1-v2-comparison.md` lines 24-37):
```markdown
| Hard gate | Result | Evidence |
|---|---:|---|
| Schema invalid | PASS | Both CLI compiles completed ... |
| Default drift | PASS | `src/cli/parse_args.ts` defaults still point to v1 ... |
| Protected artifact mutation | PASS | `git diff --exit-code ...` returned 0. |

**Hard failures:** none.
```

**Metrics pattern:** copy Phase 9 report structure lines 39-155, replacing group metrics with Round 3: amber/resinous coverage, animalic coverage, conditional fresh spice status, approved-or-gap traceability, graph coverage, generic pressure, review queue quality, alias targeted cleanup quality, zero-frequency seeds, determinism/schema/defaults.

**Phase 10 constraints:** comparison outputs must be under `/tmp/opencode/taxonomy-phase10-comparison/`; do not create official `data/compiled/v2`; do not mutate v1/default files.

**Executor pitfalls:** using Phase 9 `/tmp` paths; presenting v2 as promoted; omitting deferred/gap status for absent `fresh_spice`; omitting protected file/default check.

**Verification assertions:** report exists; contains `Families`, `Subfamilies`, `Review queue`; includes Round 3 metrics and hard/soft gates; protected/default section says v1/default files unchanged.

---

### `src/tests/curation/*.test.ts` (test, assertion updates over files)

**Closest analogs:** current curation tests in `src/tests/curation/`.

**Required read_first files:**
- `src/tests/curation/taxonomy_seed_v2.test.ts`
- `src/tests/curation/alias_seed_v2.test.ts`
- `src/tests/curation/relation_accord_v2.test.ts`
- `src/tests/curation/v1_v2_comparison.test.ts`
- `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md`

**Import/path pattern** (`taxonomy_seed_v2.test.ts` lines 1-7, 39-42):
```typescript
import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const workbookPath = path.join(repoRoot, '.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md')
```

**Parser update pattern:** update hardcoded Round 2 parsers to include `r3-approval-*` only when Phase 10 assertions require it. Current seed parser accepts Phase 8/9 only (`taxonomy_seed_v2.test.ts` lines 91-93):
```typescript
const blocks = workbook.split(/\n### /).filter(block => block.startsWith('approval-') || block.startsWith('r2-approval-'))
```

**Alias pitfall pattern:** current alias test expects zero approved aliases (`alias_seed_v2.test.ts` lines 167-172). If Phase 10 approves targeted aliases, replace the fixed zero-length assertion with allowed-map comparison containing `r3` approved aliases.

**Constraints:** update tests only when fixed assertions block valid Round 3 changes; keep test style pure, deterministic, and file-based; do not add dependencies.

**Executor pitfalls:** broadening parsers so `r2-*` authorizes `r3`; allowing absent canonical targets; changing DEFAULT_PATHS expectations to v2.

**Verification assertions:** tests check `r3-*` traceability; default paths still v1; alias additions require approved `add_alias`; relation/accord endpoints exist and no `score: 0`.

---

### Protected files diff pattern (protected input/defaults, no-write verification)

**Closest analog:** `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md` and `src/cli/parse_args.ts`.

**Required read_first files:**
- `src/cli/parse_args.ts`
- `.planning/phases/09-taxonomy-seed-v2-expansion-round-2/09-04-PLAN.md`

**DEFAULT_PATHS protected pattern** (`src/cli/parse_args.ts` lines 15-24):
```typescript
export const DEFAULT_PATHS = {
  seedPath: 'data/taxonomy/taxonomy-seed.v1.json',
  aliasPath: 'data/taxonomy/descriptor_aliases.seed.json',
  corpusPath: 'data/enriched_materials.json',
  relationsPath: 'data/inference/curated_relations.v1.json',
  accordsPath: 'data/inference/accord_map.v1.json',
  noisePath: 'data/inference/semantic_noise.v1.json',
  outputDir: 'data/compiled/v1',
  version: '1.0.0',
} as const
```

**Diff check pattern** (`09-04-PLAN.md` lines 116-125):
```bash
git diff --exit-code data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts
```

**Constraints:** protected files must not be edited; v2 remains candidate-only; no default switch; no official `data/compiled/v2` sidecar by default.

**Executor pitfalls:** compiling to `data/compiled/v1`; changing `DEFAULT_PATHS` to v2; editing `.v1` inference files while copying `.v2` patterns.

**Verification assertions:** git diff for protected paths is empty; tests still assert `DEFAULT_PATHS.seedPath`, `relationsPath`, `accordsPath`, and `outputDir` point to v1.

## Shared Patterns

### Workbook-first authorization
**Source:** `10-CONTEXT.md` lines 20-28 and `candidate-review.md` lines 5-10.  
**Apply to:** seed, alias, relation, accord mutations.  
Executor must require persisted workbook approval/gap before data edits; chat approval and corpus evidence are insufficient.

### Round-specific ID guard
**Source:** `10-RESEARCH.md` lines 141-151.  
**Apply to:** all Phase 10 mutations.  
Require `round: phase_10_round_3` and `r3-*` IDs; historical `approval-*` and `r2-*` blocks are prior evidence only.

### Approved-or-gap graph coverage
**Source:** `10-CONTEXT.md` lines 153-161 and `relation_accord_v2.test.ts` lines 140-153.  
**Apply to:** `curated_relations.v2.json`, `accord_map.v2.json`, workbook gap entries.  
Every new subfamily needs relation/accord coverage or explicit gap; missing remains neutral/undefined.

### Candidate-only v2 boundary
**Source:** `10-CONTEXT.md` lines 238-262 and `parse_args.ts` lines 15-24.  
**Apply to:** all future plans.  
Do not promote v2, change defaults, overwrite `data/compiled/v1`, or mutate v1 inputs.

## No Analog Found

None. All target files have exact Phase 8/9 or current-code analogs.

## Metadata

**Analog search scope:** `.planning/phases/08-*`, `.planning/phases/09-*`, `data/taxonomy`, `data/inference`, `src/tests/curation`, `src/cli/parse_args.ts`  
**Files scanned/read:** 19  
**Pattern extraction date:** 2026-05-23
