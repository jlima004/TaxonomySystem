# Phase 42: Low-Support Microcuration Execution - Pattern Map

**Mapped:** 2026-06-02
**Files analyzed:** 5
**Analogs found:** 5 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `data/taxonomy/taxonomy-seed.v2.json` | model / seed data | CRUD / data mutation | `data/taxonomy/taxonomy-seed.v2.json` existing family/subfamily descriptor arrays | exact |
| `src/tests/curation/taxonomy_seed_v2.test.ts` | test | request-response / validation | `src/tests/curation/taxonomy_seed_v2.test.ts` existing approval-traceability helpers | exact |
| `src/tests/curation/review_dispositions.test.ts` | test | transform / validation | `src/tests/curation/review_dispositions.test.ts` existing no-promotion evidence guards | exact |
| `.planning/phases/42-low-support-microcuration-execution/42-SUMMARY.md` | documentation | batch / closeout | `.planning/phases/41-low-support-batch-decision-matrix/41-01-SUMMARY.md` | role-match |
| `.planning/phases/42-low-support-microcuration-execution/42-VERIFICATION.md` | documentation | batch / verification | `.planning/phases/41-low-support-batch-decision-matrix/41-VERIFICATION.md` | role-match |

## Pattern Assignments

### `data/taxonomy/taxonomy-seed.v2.json` (model / seed data, CRUD / data mutation)

**Analog:** `data/taxonomy/taxonomy-seed.v2.json`

**Existing target topology pattern** (lines 101-110):
```json
{
  "id": "green",
  "name": "Green",
  "subfamilies": [
    {
      "id": "herbal_green",
      "name": "Herbal Green",
      "descriptors": [
        "basil"
      ]
    }
  ]
}
```

**Warm spice descriptor-array pattern** (lines 150-161):
```json
{
  "id": "spicy",
  "name": "Spicy",
  "subfamilies": [
    {
      "id": "warm_spice",
      "name": "Warm Spice",
      "descriptors": [
        "cinnamon",
        "clove",
        "allspice"
      ]
    }
  ]
}
```

**Balsamic resin target pattern** (lines 165-183):
```json
{
  "id": "amber_resinous",
  "name": "Amber Resinous",
  "subfamilies": [
    {
      "id": "balsamic_resin",
      "name": "Balsamic Resin",
      "descriptors": [
        "labdanum",
        "benzoin"
      ]
    }
  ]
}
```

**Fresh spice target pattern** (lines 208-217):
```json
{
  "id": "fresh_spice",
  "name": "Fresh Spice",
  "subfamilies": [
    {
      "id": "fresh_spice",
      "name": "Fresh Spice",
      "descriptors": [
        "anise"
      ]
    }
  ]
}
```

**Apply to Phase 42:** append only these descriptors to the existing arrays; do not create families/subfamilies:
```json
{
  "fresh_spice/fresh_spice": ["peppermint", "spearmint"],
  "green/herbal_green": ["rosemary"],
  "spicy/warm_spice": ["cumin", "caraway"],
  "amber_resinous/balsamic_resin": ["opoponax"]
}
```

---

### `src/tests/curation/taxonomy_seed_v2.test.ts` (test, request-response / validation)

**Analog:** `src/tests/curation/taxonomy_seed_v2.test.ts`

**Imports pattern** (lines 1-8):
```typescript
import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateSeed } from '../../loader/seed_validator.js'
import { DEFAULT_PATHS } from '../../cli/parse_args.js'
import { resolveExistingPath } from '../helpers/resolve_existing_path.js'
```

**Seed type/data-shape pattern** (lines 10-40):
```typescript
type SeedSubfamily = {
  readonly id: string
  readonly name: string
  readonly descriptors: readonly string[]
}

type SeedFamily = {
  readonly id: string
  readonly name: string
  readonly subfamilies: readonly SeedSubfamily[]
}

type TaxonomySeedFixture = {
  readonly version: string
  readonly metadata: {
    readonly created_at: string
    readonly author: string
    readonly description: string
  }
  readonly families: readonly SeedFamily[]
}
```

**Approval parsing pattern** (lines 125-166):
```typescript
const parseApprovedSeedEntries = (workbook: string): ApprovedSeedEntry[] => {
  const blocks = workbook
    .split(/\n### /)
    .filter(block => block.startsWith('approval-') || block.startsWith('r2-approval-') || block.startsWith('r3-approval-'))

  return blocks.flatMap(block => {
    const field = (name: string): string | undefined => {
      const match = block.match(new RegExp('- `' + name + '`: ?(?:`([^`]+)`|([^\n]+))'))
      return (match?.[1] ?? match?.[2])?.trim()
    }

    const approvalId = field('approval_id') ?? block.split('\n', 1)[0]?.trim()
    const familyId = field('family_id')
    const subfamilyId = field('subfamily_id')
    const descriptorId = field('descriptor_id')
    const manualApproval = field('manual_approval')
    const primaryDisposition = field('primary_disposition')

    if (familyId === undefined || subfamilyId === undefined || descriptorId === undefined || approvalId === undefined || manualApproval !== 'approved' || primaryDisposition !== 'promote_to_seed') {
      return []
    }

    return [{ approvalId, round, familyId, subfamilyId, descriptorId, rationale, evidence }]
  })
}
```

**Validation/error assertion pattern** (lines 239-267):
```typescript
const assertLowerSnakeCaseAscii = (seed: TaxonomySeedFixture): void => {
  seed.families.forEach(family => {
    expect(family.id).toMatch(snakeCaseAscii)
    family.subfamilies.forEach(subfamily => {
      expect(subfamily.id).toMatch(snakeCaseAscii)
      subfamily.descriptors.forEach(descriptor => expect(descriptor).toMatch(snakeCaseAscii))
    })
  })
}

const assertNoGlobalDescriptorDuplicates = (seed: TaxonomySeedFixture): void => {
  const seen = new Set<string>()
  seed.families.forEach(family => {
    family.subfamilies.forEach(subfamily => {
      subfamily.descriptors.forEach(descriptor => {
        expect(seen.has(descriptor), `duplicate descriptor: ${descriptor}`).toBe(false)
        seen.add(descriptor)
      })
    })
  })
}
```

**Core v2 seed invariant pattern** (lines 351-403):
```typescript
it('validates taxonomy-seed.v2.json when present', async () => {
  if (!existsSync(v2SeedPath)) {
    return
  }

  const [v1, v2, workbook, phase20Approval, phase31Approval] = await Promise.all([
    readJson<TaxonomySeedFixture>(v1SeedPath),
    readJson<TaxonomySeedFixture>(v2SeedPath),
    readFile(workbookPath, 'utf8'),
    readFile(phase20ApprovalPath, 'utf8'),
    readFile(phase31ApprovalPath, 'utf8'),
  ])

  expect(v2.version).toBe('2.0.0')
  expect(validateSeed(v2).ok).toBe(true)
  assertNoDeferredIds(v2)
  assertLowerSnakeCaseAscii(v2)
  assertNoGlobalDescriptorDuplicates(v2)
  assertNoEmptySubfamilies(v2)
  assertApprovedExpansionTraceability(v1, v2, approvals)
})
```

**Apply to Phase 42:** add a minimal Phase 42 approval traceability mechanism if the six new descriptors become v2-v1 additions. Keep style: type-only imports where needed, ESM `.js` import suffixes, `as const` literal arrays, no semicolons.

---

### `src/tests/curation/review_dispositions.test.ts` (test, transform / validation)

**Analog:** `src/tests/curation/review_dispositions.test.ts`

**Imports pattern** (lines 1-7):
```typescript
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildSeedGapReviewItems, sortReviewQueue } from '../../compiler/review_queue.js'
import type { ReviewQueueItem } from '../../types/inference.js'
import { resolveExistingPath } from '../helpers/resolve_existing_path.js'
```

**Evidence-only mutation guard pattern** (lines 37-54):
```typescript
it('requires evidence-ranked queue fields and no-promotion effect', async () => {
  const workbook = await readWorkbook()

  for (const field of [
    'frequency_signal',
    'review_type',
    'conflict_severity',
    'placement_ambiguity',
    'overloaded_subfamily_impact',
    'priority_rationale',
    'promotion_effect: none',
  ]) {
    expect(workbook).toContain(field)
  }

  expect(workbook).toContain('Ranking is priority-only')
  expect(workbook).toContain('cannot mutate curated JSON')
})
```

**No curated JSON mutation shape pattern** (lines 56-89):
```typescript
it('keeps review queue sorting deterministic evidence without returning seed mutations', () => {
  const items: ReviewQueueItem[] = [/* review-only evidence */]

  const first = sortReviewQueue(items)
  const second = sortReviewQueue([...items].reverse())

  expect(first).toEqual(second)
  expect(first[0]).toMatchObject({
    type: 'corpus_candidate_low_support',
    suggested_action: 'review_candidate_placement',
    evidence: { candidate_frequency: 271, placement_score: 0.46 },
  })
  expect(first[0]).not.toHaveProperty('families')
  expect(first[0]).not.toHaveProperty('descriptors')
})
```

**Apply to Phase 42:** if this test is modified, copy the `not.toHaveProperty('families')` / `not.toHaveProperty('descriptors')` pattern to prove non-approved evidence rows cannot emit seed mutations. Do not add alias or compiled artifact assertions here unless planner chooses this file as the minimal guard location.

---

### `.planning/phases/42-low-support-microcuration-execution/42-SUMMARY.md` (documentation, batch / closeout)

**Analog:** `.planning/phases/41-low-support-batch-decision-matrix/41-01-SUMMARY.md`

**Frontmatter pattern** (lines 1-18):
```yaml
---
phase: 41
plan: 01
subsystem: "taxonomy-decisions"
tags: ["curation", "low-support", "batch"]
tech-stack.added: []
key-files.created: 
  - ".planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md"
key-decisions:
  - "Approved promote_to_seed for 6 candidates (peppermint, rosemary, cumin, spearmint, caraway, opoponax) that map perfectly to existing subfamilies."
requirements-completed:
  - CUR-01
duration: "5 min"
completed: "2026-05-29T17:51:30Z"
---
```

**Body pattern** (lines 20-33):
```markdown
# Phase 41 Plan 01: Low-Support Batch Decision Matrix Summary

Decision matrix produced for 30 candidates with 6 promote_to_seed targets and strict deferrals for missing subfamilies.

**Duration**: 5 minutes
**Start/End time**: 2026-05-29T17:49:00Z - 2026-05-29T17:51:30Z
**Tasks completed**: 5
**Files modified**: 1

## Deviations from Plan

None - plan executed exactly as written.

Phase complete, ready for next step.
```

**Apply to Phase 42:** list only authorized modified/created files. Explicitly state that `descriptor_aliases.seed.json` and `data/compiled/v2/*` were not modified.

---

### `.planning/phases/42-low-support-microcuration-execution/42-VERIFICATION.md` (documentation, batch / verification)

**Analog:** `.planning/phases/41-low-support-batch-decision-matrix/41-VERIFICATION.md`

**Frontmatter and verdict pattern** (lines 1-16):
```yaml
---
status: passed
phase: 41-low-support-batch-decision-matrix
started: "2026-05-29T17:52:00Z"
updated: "2026-05-29T17:52:30Z"
---
```
```markdown
# Phase 41 Verification Report

## Goal Verification
**Goal:** Produce a formal decision matrix for the selected candidate batch.
**Requirement IDs:** CUR-01

**Verdict:** PASSED
```

**Checklist pattern** (lines 17-28):
```markdown
## Success Criteria
1. **Every selected candidate has an explicit disposition in the matrix.**
   - [x] Verified: All 30 items have a disposition (`promote_to_seed`, `reject`, `defer_manual_review`, or `needs_external_reference`).

## Must-Haves Checklist
- [x] `41-DECISION-MATRIX.md` captures dispositions for exactly 30 candidates
- [x] Zero mutations to taxonomy files occur in Phase 41
- [x] `mutation_allowed=true` is strictly gated by complete targets and valid existing subfamilies
```

**Automated checks pattern** (lines 29-36):
```markdown
## Automated Checks
```bash
grep -c "^| [0-9]" .planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md
# Output: 30

git diff --name-only origin/main | grep -v ".planning/"
# Output: (empty)
```
```

**Apply to Phase 42:** record the focused curation test command, safety guard command, and explicit protected-diff checks:
```bash
cd src && npm run test -- tests/curation/taxonomy_seed_v2.test.ts tests/curation/review_dispositions.test.ts
cd src && npm run safety:guard
git diff -- data/taxonomy/descriptor_aliases.seed.json data/compiled/v2
```

## Shared Patterns

### Matrix-Gated Mutation Authority
**Source:** `.planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md` lines 21-31  
**Apply to:** `taxonomy-seed.v2.json`, traceability tests, summary, verification
```markdown
| 06 | peppermint | high_value | targeted | promote_to_seed | fresh_spice | fresh_spice | peppermint | true | Clear note with exact fit in fresh_spice. | freq: 56 | Add peppermint seed | |
| 07 | rosemary | high_value | targeted | promote_to_seed | green | herbal_green | rosemary | true | Clear herbal note fitting herbal_green perfectly. | freq: 54 | Add rosemary seed | |
| 10 | cumin | high_value | targeted | promote_to_seed | spicy | warm_spice | cumin | true | Clear spice note fitting warm_spice. | freq: 40 | Add cumin seed | |
| 13 | spearmint | high_value | targeted | promote_to_seed | fresh_spice | fresh_spice | spearmint | true | Clear mint note fitting fresh_spice. | freq: 31 | Add spearmint seed | |
| 14 | caraway | high_value | targeted | promote_to_seed | spicy | warm_spice | caraway | true | Clear spice note fitting warm_spice. | freq: 25 | Add caraway seed | |
| 15 | opoponax | high_value | targeted | promote_to_seed | amber_resinous | balsamic_resin | opoponax | true | Clear resin note fitting balsamic_resin perfectly. | freq: 22 | Add opoponax seed | |
```

### Seed Validation
**Source:** `src/loader/seed_validator.ts` lines 5-8 and 93-110  
**Apply to:** `taxonomy_seed_v2.test.ts` and any temporary audit logic
```typescript
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const isSnakeCase = (s: string): boolean => /^[a-z][a-z0-9_]*$/.test(s)

export const validateSeed = (data: unknown): ValidationResult<TaxonomySeed> => {
  const errors: ValidationError[] = []
  // ...
  if (!Array.isArray(sObj.descriptors) || sObj.descriptors.length === 0) {
    errors.push(makeError(`${subfamilyPath} > descriptors`, 'non-empty array', Array.isArray(sObj.descriptors) ? 'empty array' : typeof sObj.descriptors))
  } else {
    const descriptorsSet = new Set<string>()
    sObj.descriptors.forEach((desc: unknown, dIdx: number) => {
      if (!isNonEmptyString(desc)) errors.push(makeError(descPath, 'non-empty string', String(desc)))
      else if (!isSnakeCase(desc as string)) errors.push(makeError(descPath, 'snake_case string', desc as string))
      else if (descriptorsSet.has(desc as string)) errors.push(makeError(descPath, 'unique descriptor in subfamily', desc as string))
      else descriptorsSet.add(desc as string)
    })
  }
}
```

### Test Runner and Safety Guard Commands
**Source:** `src/package.json` lines 6-14  
**Apply to:** implementation validation and `42-VERIFICATION.md`
```json
"scripts": {
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "safety:guard": "bash ../scripts/check-safety-guards.sh",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

### Protected Files Not To Edit
**Source:** `42-CONTEXT.md` lines 57-63 and scope guardrails  
**Apply to:** all plans and closeout docs
```markdown
- `data/taxonomy/descriptor_aliases.seed.json` — Read-only guard reference for this phase; no Phase 42 alias mutation is authorized.
- `data/compiled/v2/similarity_matrix.json` — Read-only historical source of low_support evidence; not mutation authority.
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Existing curation invariant and approval-traceability checks around v2 seed additions.
- `src/tests/curation/review_dispositions.test.ts` — Existing pattern proving frequency/ranking evidence is priority-only and cannot mutate curated JSON.
```

## No Analog Found

None. All expected Phase 42 files have direct or close role-match analogs in the repository.

## Metadata

**Analog search scope:** `data/taxonomy/`, `src/tests/curation/`, `src/loader/`, `src/package.json`, `.planning/phases/41-low-support-batch-decision-matrix/`  
**Files scanned:** 10 primary files plus phase context/research/validation inputs  
**Pattern extraction date:** 2026-06-02
