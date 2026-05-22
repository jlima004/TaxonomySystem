# Phase 8: Taxonomy Seed Expansion & Curation - Pattern Map

**Mapped:** 2026-05-22
**Files analyzed:** 11 new/modified files
**Analogs found:** 11 / 11

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `data/taxonomy/taxonomy-seed.v2.json` | config/data input | CRUD, file-I/O | `data/taxonomy/taxonomy-seed.v1.json` | exact |
| `data/taxonomy/descriptor_aliases.seed.json` | config/data input | transform, file-I/O | `data/taxonomy/descriptor_aliases.seed.json` | exact-existing |
| `data/inference/curated_relations.v2.json` | config/data input | event/graph transform, file-I/O | `data/inference/curated_relations.v1.json` | exact |
| `data/inference/accord_map.v2.json` | config/data input | event/graph transform, file-I/O | `data/inference/accord_map.v1.json` | exact |
| `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md` | documentation/curation sidecar | batch, request-response manual review | `.planning/phases/08-taxonomy-seed-expansion-curation/08-VALIDATION.md` | role-match |
| `.planning/phases/08-taxonomy-seed-expansion-curation/curation/v1-v2-comparison.md` | documentation/validation sidecar | batch, file-I/O | `.planning/phases/08-taxonomy-seed-expansion-curation/08-VALIDATION.md` | role-match |
| `src/tests/curation/taxonomy_seed_v2.test.ts` | test | CRUD, file-I/O validation | `src/tests/seed_validator.test.ts` | exact |
| `src/tests/curation/review_dispositions.test.ts` | test | event-driven/review queue validation | `src/tests/inference/seed_expansion_review.test.ts` | exact |
| `src/tests/curation/alias_seed_v2.test.ts` | test | transform validation | `src/tests/compiler/compile_aliases.test.ts` | role-match |
| `src/tests/curation/relation_accord_v2.test.ts` | test | graph transform validation | `src/tests/inference/tradition_score.test.ts`, `src/tests/inference/accord_compatibility.test.ts` | exact |
| `src/tests/curation/v1_v2_comparison.test.ts` | test | CLI/file-I/O integration | `src/tests/cli/compile.test.ts`, `src/tests/cli/parse_args.test.ts` | exact |

## Pattern Assignments

### `data/taxonomy/taxonomy-seed.v2.json` (config/data input, CRUD + file-I/O)

**Analog:** `data/taxonomy/taxonomy-seed.v1.json`

**Seed envelope and metadata pattern** (lines 1-8):
```json
{
  "version": "1.0.0",
  "metadata": {
    "created_at": "2026-05-13T00:00:00Z",
    "author": "Taxonomy Team",
    "description": "Initial Olfactory Taxonomy Seed v1.1 - snake_case fix"
  },
  "families": [
```

**Family/subfamily/descriptors pattern** (lines 9-23):
```json
{
  "id": "floral",
  "name": "Floral",
  "subfamilies": [
    {
      "id": "floral_white",
      "name": "White Floral",
      "descriptors": [
        "jasmine",
        "tuberose",
        "gardenia",
        "orange_blossom",
        "lily_of_the_valley"
      ]
    }
  ]
}
```

**Validation constraints to preserve:** `src/loader/seed_validator.ts` validates non-empty metadata, snake_case IDs, globally unique subfamily IDs, and unique descriptors per subfamily (lines 5-7, 36-117).

```typescript
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const isSnakeCase = (s: string): boolean => /^[a-z][a-z0-9_]*$/.test(s)
```

```typescript
if (!Array.isArray(obj.families) || obj.families.length === 0) {
  errors.push(makeError('families', 'non-empty array', Array.isArray(obj.families) ? 'empty array' : typeof obj.families))
} else {
  const familyIds = new Set<string>()
  const globalSubfamilyIds = new Set<string>()
```

---

### `data/taxonomy/descriptor_aliases.seed.json` (config/data input, transform + file-I/O)

**Analog:** `data/taxonomy/descriptor_aliases.seed.json`

**Curated alias map pattern** (lines 1-12):
```json
{
  "jasmin": "jasmine",
  "orange flower": "orange_blossom",
  "orange blossom": "orange_blossom",
  "orangeflower": "orange_blossom",
  "oak moss": "oakmoss",
  "ylang ylang": "ylang_ylang",
  "petit grain": "petitgrain",
  "patchouly": "patchouli",
  "cedar wood": "cedarwood",
  "sandal wood": "sandalwood"
}
```

**Validation pattern:** `src/loader/alias_validator.ts` expects `Record<string,string>` and rejects circular/long alias chains (lines 5-21, 27-53).

```typescript
export const validateAliasSeed = (data: unknown, maxDepth: number = 1): ValidationResult<DescriptorAliasSeed> => {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return makeResult([makeError('root', 'Record<string, string>', Array.isArray(data) ? 'array' : typeof data)])
  }
```

```typescript
while (current !== undefined && seed[current] !== undefined) {
  if (visited.has(current)) {
    errors.push(makeError(`alias[${key}]`, 'non-circular reference', `circular reference at ${current}`))
    break
  }
```

---

### `data/inference/curated_relations.v2.json` (config/data input, graph transform + file-I/O)

**Analog:** `data/inference/curated_relations.v1.json`

**Input envelope and relation object pattern** (lines 1-10):
```json
{
  "version": "1.0.0",
  "relations": [
    {
      "source_subfamily_id": "floral_rose",
      "target_subfamily_id": "floral_white",
      "relation": "same_family_tradition",
      "score": 0.85,
      "evidence": "manual_phase_7_bootstrap"
    }
  ]
}
```

**Manual score validation pattern:** `src/inference/curated_input_validation.ts` enforces non-empty IDs and score in `[0,1]` (lines 17-21, 33-53).

```typescript
const assertScore = (score: unknown, path: string): number => {
  if (typeof score !== 'number' || Number.isNaN(score) || score < 0 || score > 1) {
    throw new Error(`${path} score must be a number in [0,1]`)
  }
  return score
}
```

```typescript
return input.relations.map((relation, index): CuratedTraditionRelation => {
  if (!isRecord(relation)) {
    throw new Error(`relations[${index}] must be an object`)
  }

  return {
    source_subfamily_id: assertNonEmptyString(relation.source_subfamily_id, `relations[${index}].source_subfamily_id`),
    target_subfamily_id: assertNonEmptyString(relation.target_subfamily_id, `relations[${index}].target_subfamily_id`),
    relation: assertNonEmptyString(relation.relation, `relations[${index}].relation`),
    score: assertScore(relation.score, `relations[${index}]`),
    ...(relation.evidence !== undefined ? { evidence: assertNonEmptyString(relation.evidence, `relations[${index}].evidence`) } : {}),
  }
})
```

---

### `data/inference/accord_map.v2.json` (config/data input, graph transform + file-I/O)

**Analog:** `data/inference/accord_map.v1.json`

**Input envelope and accord object pattern** (lines 1-10):
```json
{
  "version": "1.0.0",
  "accords": [
    {
      "source_subfamily_id": "citrus_fresh",
      "target_subfamily_id": "floral_white",
      "accord": "compatible_accord_pair",
      "score": 0.7,
      "reference": "manual_phase_7_bootstrap"
    }
  ]
}
```

**Accord validation pattern:** `src/inference/curated_input_validation.ts` mirrors relations and preserves optional `reference` (lines 56-77).

```typescript
export const validateAccordMapInput = (input: AccordMapInput): readonly CuratedAccordReference[] => {
  if (!isRecord(input) || !isNonEmptyString(input.version)) {
    throw new Error('accord map input must include version')
  }
  if (!Array.isArray(input.accords)) {
    throw new Error('accord map input accords must be an array')
  }
```

```typescript
return {
  source_subfamily_id: assertNonEmptyString(accord.source_subfamily_id, `accords[${index}].source_subfamily_id`),
  target_subfamily_id: assertNonEmptyString(accord.target_subfamily_id, `accords[${index}].target_subfamily_id`),
  accord: assertNonEmptyString(accord.accord, `accords[${index}].accord`),
  score: assertScore(accord.score, `accords[${index}]`),
  ...(accord.reference !== undefined ? { reference: assertNonEmptyString(accord.reference, `accords[${index}].reference`) } : {}),
}
```

---

### `.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md` (documentation/curation sidecar, batch manual review)

**Analog:** `.planning/phases/08-taxonomy-seed-expansion-curation/08-VALIDATION.md`

**Frontmatter + status pattern** (lines 1-8):
```markdown
---
phase: 08
slug: taxonomy-seed-expansion-curation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-22
---
```

**Manual verification table pattern** (lines 60-67):
```markdown
## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Approve initial descriptor/subfamily/family set for `gourmand`, `spicy`, `green`, `fruity`, `amber_resinous`, and `animalic`. | CUR-01, CUR-03 | The project explicitly requires manual curation; corpus evidence is not sufficient. | Review curation sidecar entries and confirm every promoted entry has approval, rationale, and evidence. |
| Approve alias canonical ownership. | CUR-05 | Ambiguous aliases require human semantic judgment. | Confirm each alias points to one clear canonical v2 descriptor and does not duplicate a primary descriptor. |
| Approve relation/accord gaps or manual scores. | CUR-06 | Missing relation/accord is neutral unless a curator chooses a score. | Review every new subfamily's relation/accord block and confirm either a manual score in [0,1] or an explicit gap rationale. |
```

---

### `.planning/phases/08-taxonomy-seed-expansion-curation/curation/v1-v2-comparison.md` (documentation/validation sidecar, batch + file-I/O)

**Analog:** `.planning/phases/08-taxonomy-seed-expansion-curation/08-VALIDATION.md`

**Validation infrastructure pattern** (lines 16-24):
```markdown
## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Vitest (`^3.2.0`) |
| Config file | `src/vitest.config.ts` |
| Quick run command | `cd src && npm test -- tests/seed_validator.test.ts tests/compiler/quality_gates.test.ts` |
| Full suite command | `cd src && npm run typecheck && npm test && npm run build` |
| Estimated runtime | TBD by executor on first run |
```

**Sampling/phase gate pattern** (lines 28-33):
```markdown
## Sampling Rate

- After every task commit: run the fastest changed-file or focused Vitest command listed in the task.
- After every plan wave: run `cd src && npm run typecheck && npm test && npm run build`.
- Before `/gsd-verify-work`: full suite must be green and v1-vs-v2 compile comparison must be documented.
- Max feedback latency: executor must report actual runtime after first focused and full runs.
```

---

### `src/tests/curation/taxonomy_seed_v2.test.ts` (test, CRUD + file-I/O validation)

**Analog:** `src/tests/seed_validator.test.ts`

**Imports pattern** (lines 1-2):
```typescript
import { describe, expect, it } from "vitest";
import { validateSeed } from "../loader/seed_validator.js";
```

**Valid seed fixture pattern** (lines 5-26):
```typescript
it("valid seed returns ok=true", () => {
  const valid = {
    version: "1.0.0",
    metadata: { created_at: "now", author: "test", description: "test" },
    families: [
      {
        id: "test_family",
        name: "Test Family",
        subfamilies: [
          {
            id: "test_subfamily",
            name: "Test Sub",
            descriptors: ["desc"],
          },
        ],
      },
    ],
  };
  const result = validateSeed(valid);
  expect(result.ok).toBe(true);
  expect(result.errors).toHaveLength(0);
});
```

**Negative validation pattern** (lines 61-80):
```typescript
it("family.id non-snake_case -> error with expected: snake_case", () => {
  const invalid = {
    version: "1",
    metadata: { created_at: "now", author: "t", description: "t" },
    families: [
      {
        id: "Not Snake",
        name: "test",
        subfamilies: [{ id: "test", name: "test", descriptors: ["test"] }],
      },
    ],
  };
  const result = validateSeed(invalid);
  expect(result.ok).toBe(false);
  expect(
    result.errors.some(
      (e) => e.path === "Family test (id)" && e.expected.includes("snake_case"),
    ),
  ).toBe(true);
});
```

---

### `src/tests/curation/review_dispositions.test.ts` (test, review queue validation)

**Analog:** `src/tests/inference/seed_expansion_review.test.ts`

**Imports and review-only assertion pattern** (lines 1-17):
```typescript
import { describe, expect, it } from 'vitest'
import { buildSeedGapReviewItems } from '../../compiler/review_queue.js'

describe('buildSeedGapReviewItems', () => {
  it('emits review-only seed taxonomy gap suggestions for high-frequency generic candidates', () => {
    const items = buildSeedGapReviewItems([
      {
        descriptor: 'generic_fresh_note',
        corpus_count: 30,
        reason: 'placement_score_below_threshold',
      },
    ])

    expect(items.some(item => item.type === 'seed_taxonomy_gap_suggestion' || item.type === 'corpus_candidate_high_frequency_generic')).toBe(true)
    expect(items[0]?.suggested_action).toBe('review_seed_taxonomy_gap')
  })
})
```

**Core review queue sort pattern:** `src/compiler/review_queue.ts` sorts deterministically and keeps review items as evidence (lines 17-28, 30-47).

```typescript
export const sortReviewQueue = (items: readonly ReviewQueueItem[]): ReviewQueueItem[] => {
  return [...items].sort((left, right) => {
    if (left.type !== right.type) return left.type.localeCompare(right.type)
    const leftSeverity = severityRank(left.severity)
    const rightSeverity = severityRank(right.severity)
    if (leftSeverity !== rightSeverity) return leftSeverity - rightSeverity
    const leftAffected = JSON.stringify(left.affected)
    const rightAffected = JSON.stringify(right.affected)
    if (leftAffected !== rightAffected) return leftAffected.localeCompare(rightAffected)
    return stableEvidence(left.evidence).localeCompare(stableEvidence(right.evidence))
  })
}
```

---

### `src/tests/curation/alias_seed_v2.test.ts` (test, transform validation)

**Analog:** `src/tests/compiler/compile_aliases.test.ts`

**Imports pattern** (lines 1-2):
```typescript
import { describe, expect, it } from 'vitest'
import { compileAliases } from '../../compiler/compile_aliases.js'
```

**Sorted authoritative aliases pattern** (lines 9-12):
```typescript
it('sorts aliases alphabetically by key', () => {
  const result = compileAliases({ z: 'y', a: 'b', m: 'n' }, { generatedAt: '2026-01-01T00:00:00.000Z' })
  expect(Object.keys(result.aliases)).toEqual(['a', 'm', 'z'])
})
```

**No corpus candidate promotion pattern** (lines 18-22):
```typescript
it('does not add corpus alias candidates', () => {
  const result = compileAliases({ curated: 'canonical' }, { generatedAt: '2026-01-01T00:00:00.000Z' })
  expect(result.aliases).toEqual({ curated: 'canonical' })
  expect(result.aliases).not.toHaveProperty('candidate')
})
```

**CLI integration alias authority pattern:** `src/tests/cli/compile.test.ts` confirms compiled aliases come only from curated seed (lines 133-143).

```typescript
it('keeps authoritative descriptor_aliases artifact sourced from curated seed only', async () => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined)
  const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-alias-artifact-')))

  await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)

  const aliasesArtifact = await readFile(join(paths.out, 'descriptor_aliases.json'), 'utf8')
  expect(aliasesArtifact).toContain('"lemony"')
  expect(aliasesArtifact).not.toContain('"camomile"')
  expect(aliasesArtifact).not.toContain('"chamomile"')
})
```

---

### `src/tests/curation/relation_accord_v2.test.ts` (test, graph transform validation)

**Analogs:** `src/tests/inference/tradition_score.test.ts`, `src/tests/inference/accord_compatibility.test.ts`

**Relation imports and fixture loading pattern** (`tradition_score.test.ts` lines 1-20):
```typescript
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeTraditionScore } from '../../inference/index.js'
import type { CuratedTraditionRelation } from '../../types/inference.js'

type ScoringFixture = {
  readonly relations: readonly CuratedTraditionRelation[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const leftId = 'floral:white_floral'
const rightId = 'citrus:fresh_citrus'

const loadFixture = async (): Promise<ScoringFixture> => {
  const content = await readFile(join(__dirname, '../fixtures/inference/scoring_dimensions.json'), 'utf8')
  return JSON.parse(content) as ScoringFixture
}
```

**Separated evidence and no corpus override pattern** (`tradition_score.test.ts` lines 22-48):
```typescript
it('preserves curated relation, seed proximity, and corpus support as separated evidence', async () => {
  const fixture = await loadFixture()
  const result = computeTraditionScore(leftId, rightId, {
    curatedRelations: { version: '1.0.0', relations: fixture.relations },
    seedProximity: new Map([[`${leftId}|${rightId}`, 0.6]]),
    corpusSupport: new Map([[`${leftId}|${rightId}`, 0.4]]),
  })

  expect(result?.id).toBe('tradition')
  expect(result?.score).toBe(0.7)
  expect(result?.evidence.curated_relation).toMatchObject({ relation: 'traditional_pairing', score: 0.7 })
  expect(result?.evidence.seed_proximity).toBe(0.6)
  expect(result?.evidence.corpus_support).toBe(0.4)
})
```

**Missing accord remains undefined pattern** (`accord_compatibility.test.ts` lines 34-40):
```typescript
it('returns undefined for missing accord entries instead of zero', async () => {
  const fixture = await loadFixture()
  const result = computeAccordCompatibility('woody:dry_woods', 'gourmand:vanilla', { version: '1.0.0', accords: fixture.accords })

  expect(result).toBeUndefined()
  expect(result).not.toBe(0)
})
```

**Malformed input and score bounds pattern** (`accord_compatibility.test.ts` lines 42-54):
```typescript
it('rejects malformed accord input maps before scoring', () => {
  expect(() => computeAccordCompatibility(leftId, rightId, { version: '', accords: [] })).toThrow(/version/)
  expect(() => computeAccordCompatibility(leftId, rightId, { version: '1.0.0', accords: 'bad' } as never)).toThrow(/array/)
  expect(() => computeAccordCompatibility(leftId, rightId, { version: '1.0.0', accords: [42] } as never)).toThrow(/accords\[0\] must be an object/)
  expect(() => computeAccordCompatibility(leftId, rightId, {
    version: '1.0.0',
    accords: [{ source_subfamily_id: leftId, target_subfamily_id: '', accord: 'bad', score: 0.5 }],
  })).toThrow(/non-empty string/)
  expect(() => computeAccordCompatibility(leftId, rightId, {
    version: '1.0.0',
    accords: [{ source_subfamily_id: leftId, target_subfamily_id: rightId, accord: 'bad', score: -0.1 }],
  })).toThrow(/\[0,1\]/)
})
```

---

### `src/tests/curation/v1_v2_comparison.test.ts` (test, CLI/file-I/O integration)

**Analogs:** `src/tests/cli/compile.test.ts`, `src/tests/cli/parse_args.test.ts`

**CLI test imports and fixture writers** (`compile.test.ts` lines 1-20):
```typescript
import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runCompileCli } from '../../cli/compile.js'

const writeJson = (path: string, value: unknown): Promise<void> => writeFile(path, `${JSON.stringify(value)}\n`, 'utf8')
```

**Explicit path argv pattern** (`compile.test.ts` lines 51-60):
```typescript
const argvFor = (paths: Awaited<ReturnType<typeof writeFixtures>>): string[] => [
  '--seed', paths.seed,
  '--aliases', paths.aliases,
  '--corpus', paths.corpus,
  '--relations', paths.relations,
  '--accords', paths.accords,
  '--noise', paths.noise,
  '--out', paths.out,
  '--generated-at', '2026-01-01T00:00:00.000Z',
]
```

**Compile, output, quality summary assertion pattern** (`compile.test.ts` lines 67-81):
```typescript
it('loads inputs and writes all compiled outputs', async () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
  const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-valid-')))

  await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)

  await expect(readFile(join(paths.out, 'taxonomy.json'), 'utf8')).resolves.toContain('fresh_citrus')
  await expect(readFile(join(paths.out, 'descriptor_aliases.json'), 'utf8')).resolves.toContain('lemony')
  await expect(readFile(join(paths.out, 'similarity_matrix.json'), 'utf8')).resolves.toContain('review_queue')
  expect(logSpy.mock.calls.flat().join('\n')).toContain('Review summary:')
  expect(logSpy.mock.calls.flat().join('\n')).toContain('review_items_by_severity=')
  expect(logSpy.mock.calls.flat().join('\n')).toContain('review_items_by_type=')
  expect(logSpy.mock.calls.flat().join('\n')).toContain('validation_status=ok')
  expect(logSpy.mock.calls.flat().join('\n')).toContain('quality_gate_status=PASS')
})
```

**Parse explicit path flags pattern** (`parse_args.test.ts` lines 29-32):
```typescript
it('parses all path flags', () => {
  const result = parseCompileArgs(['--seed', 's', '--aliases', 'a', '--corpus', 'c', '--relations', 'r', '--accords', 'ac'])
  expect(result).toMatchObject({ seedPath: 's', aliasPath: 'a', corpusPath: 'c', relationsPath: 'r', accordsPath: 'ac' })
})
```

## Shared Patterns

### No Authentication / No Runtime Service
**Source:** `08-RESEARCH.md` security domain lines 540-550.  
**Apply to:** All Phase 8 files.  
Phase 8 has no API, users, sessions, or runtime auth. Access control is repository/process-level manual approval before curated truth changes.

### Explicit CLI Paths, No Default Switch
**Source:** `src/cli/parse_args.ts` lines 15-24 and `src/cli/compile.ts` lines 21-30, 109-115.  
**Apply to:** `taxonomy-seed.v2.json`, v2 relations/accords, and v1-v2 comparison tests.

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

```typescript
const seedPath = await resolveReadablePath(args.seedPath)
const aliasPath = await resolveReadablePath(args.aliasPath)
const corpusPath = await resolveReadablePath(args.corpusPath)
const relationsPath = await resolveReadablePath(args.relationsPath)
const accordsPath = await resolveReadablePath(args.accordsPath)
const noisePath = await resolveReadablePath(args.noisePath)
const outputDir = resolveOutputDir(args.outputDir)
```

### Hard Errors vs Soft Warnings
**Source:** `src/compiler/quality_gates.ts` lines 20-81 and `src/tests/compiler/quality_gates.test.ts` lines 77-95.  
**Apply to:** v1-v2 comparison sidecar and `v1_v2_comparison.test.ts`.

```typescript
const errors = [] as ReturnType<typeof makeCompilerError>[]
const warnings = [] as ReturnType<typeof makeCompilerError>[]
```

```typescript
if (curatedRelationsCount === 0) warnings.push(makeCompilerError('similarity', 'EMPTY_CURATED_RELATIONS', '$.review_queue', 'curated relations input is empty'))
if (accordMapCount === 0) warnings.push(makeCompilerError('similarity', 'EMPTY_ACCORD_MAP', '$.review_queue', 'accord map input is empty'))
if ((curatedRelationsCount > 0 || accordMapCount > 0) && similarity.edges.length === 0) {
  warnings.push(makeCompilerError('similarity', 'CURATED_INPUT_WITHOUT_EDGES', '$.edges', 'curated graph inputs are non-empty but no similarity edges were emitted'))
}

return {
  ok: errors.length === 0,
  errors,
  warnings,
}
```

### Review Queue Is Evidence, Not Promotion
**Source:** `src/compiler/compile_all.ts` lines 66-82 and `src/compiler/review_queue.ts` lines 30-47.  
**Apply to:** curation sidecars and `review_dispositions.test.ts`.

```typescript
const similarity: SimilarityGraph = {
  ...similarityBase,
  review_queue: sortReviewQueue([
    ...profileResult.review_queue,
    ...compiledTaxonomy.placement_review_queue,
    ...buildSeedGapReviewItems(
      compiledTaxonomy.placement_review_queue
        .filter(item => item.type === 'corpus_candidate_high_frequency_generic')
        .map(item => ({
          descriptor: item.affected.descriptor ?? '',
          corpus_count: Number(item.evidence.candidate_frequency ?? 0),
          reason: String(item.reason ?? item.evidence.reason ?? 'high_frequency_generic'),
        })),
    ),
    ...similarityBase.review_queue,
  ]),
}
```

### Vitest + ESM Import Style
**Source:** current test files.  
**Apply to:** all new tests under `src/tests/curation/`.

```typescript
import { describe, expect, it } from 'vitest'
import { compileAll } from '../../compiler/compile_all.js'
```

Use `.js` extensions in relative TypeScript imports, Node built-ins via `node:` specifiers, and deterministic `generatedAt` values in compile tests.

## No Analog Found

All inferred Phase 8 files have close analogs in the current codebase. The curation sidecars have documentation analogs rather than exact compiled-runtime analogs; planner should keep them planning-only unless a later approved plan evolves runtime schemas.

## Metadata

**Analog search scope:** `data/**/*.json`, `src/**/*.ts`, `.planning/phases/**/*.md`  
**Files scanned:** 100+ TypeScript paths from glob, 9 JSON data files, planning phase markdown files  
**Pattern extraction date:** 2026-05-22
