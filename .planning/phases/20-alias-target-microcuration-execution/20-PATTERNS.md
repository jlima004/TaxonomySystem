# Phase 20: Alias Target Microcuration Execution - Pattern Map

**Mapped:** 2026-05-26  
**Files analyzed:** 5 future create/modify/verify targets  
**Analogs found:** 5 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `.planning/phases/20-alias-target-microcuration-execution/20-FINAL-APPROVAL.md` | config / approval artifact | event-driven governance | `src/tests/curation/taxonomy_seed_v2.test.ts` approval parser + Phase 19 readiness docs | role-match |
| `data/taxonomy/taxonomy-seed.v2.json` | model / seed data | CRUD data mutation | existing `data/taxonomy/taxonomy-seed.v2.json` citrus family block | exact |
| `data/taxonomy/descriptor_aliases.seed.json` | model / seed data | no-op / request-response validation | existing `descriptor_aliases.seed.json` + `alias_seed_v2.test.ts` | exact |
| `.planning/phases/20-alias-target-microcuration-execution/20-01-PLAN.md` | planning document | batch execution plan | `19-PATTERNS.md`, `19-01-PLAN.md`, `20-RESEARCH.md` | role-match |
| Optional `/tmp/taxonomy-phase20-v2-compile/*` | temporary artifact | batch file-I/O | `src/cli/parse_args.ts` CLI defaults/override pattern | exact |

## Pattern Assignments

### `.planning/phases/20-alias-target-microcuration-execution/20-FINAL-APPROVAL.md` (config / approval artifact, event-driven governance)

**Analog:** `src/tests/curation/taxonomy_seed_v2.test.ts` and Phase 19 readiness docs

**Approval parser field pattern** (`src/tests/curation/taxonomy_seed_v2.test.ts` lines 124-153):

```typescript
const approvalId = field('approval_id') ?? block.split('\n', 1)[0]?.trim()
const round = field('round')
const familyId = field('family_id')
const subfamilyId = field('subfamily_id')
const descriptorId = field('descriptor_id')
const manualApproval = field('manual_approval')
const primaryDisposition = field('primary_disposition')
const rationale = field('rationale')
const evidence = field('evidence')

if (
  familyId === undefined ||
  subfamilyId === undefined ||
  descriptorId === undefined ||
  approvalId === undefined ||
  manualApproval !== 'approved' ||
  primaryDisposition !== 'promote_to_seed' ||
  rationale === undefined ||
  rationale.length === 0 ||
  evidence === undefined ||
  evidence.length === 0
) {
  return []
}
```

**Apply to Phase 20 approval artifact:** use line-oriented fields matching this convention:

```markdown
- `approval_id`: `phase20-petitgrain-add-target-approval`
- `manual_approval`: `approved`
- `primary_disposition`: `promote_to_seed`
- `family_id`: `citrus`
- `subfamily_id`: `citrus_fresh`
- `descriptor_id`: `petitgrain`
- `alias_preserved`: `petit grain -> petitgrain`
- `ylang_policy`: `accepted_exception_interim`
- `publication_boundary`: `no official data/compiled/v2 publication`
- `rationale`: `Resolve corpus-backed absent alias target by adding canonical descriptor to seed truth.`
- `evidence`: `compiled v2 candidate frequency 52; seed v2 absence; existing alias mapping already present.`
```

**Readiness gate pattern** (`19-VALIDATION.md` lines 93-101):

```markdown
A Phase 19 **permanece `not_ready_for_execution`** até aprovação explícita. A fase é estritamente de planejamento. Qualquer execução de curadoria requer uma fase separada com:

- Allowlist explícita de arquivos a alterar
- Persisted curatorial approval para cada mutação
- Validation gates com before/after integrity checks
- Rollback testado e documentado
- Protected diff checks via `scripts/check-safety-guards.sh`
```

---

### `data/taxonomy/taxonomy-seed.v2.json` (model / seed data, CRUD data mutation)

**Analog:** current seed v2 family/subfamily shape in `data/taxonomy/taxonomy-seed.v2.json`

**Imports pattern:** n/a — JSON seed data.

**Current target insertion location** (`data/taxonomy/taxonomy-seed.v2.json` lines 60-72):

```json
{
  "id": "citrus",
  "name": "Citrus",
  "subfamilies": [
    {
      "id": "citrus_fresh",
      "name": "Fresh Citrus",
      "descriptors": [
        "lemon",
        "bergamot",
        "sweet_orange",
        "grapefruit"
      ]
    },
```

**Future seed-only mutation pattern:** add exactly one descriptor under `citrus/citrus_fresh` after explicit approval; preserve JSON formatting and append unless the plan defines a different order:

```diff
 "descriptors": [
   "lemon",
   "bergamot",
   "sweet_orange",
-  "grapefruit"
+  "grapefruit",
+  "petitgrain"
 ]
```

**Evidence for `petitgrain` promotion** (`data/compiled/v2/taxonomy.json` lines 531-536):

```json
{
  "id": "petitgrain",
  "source": "corpus",
  "frequency": 52,
  "status": "candidate",
  "review_required": true,
  "corpus_derived": true
}
```

**Seed descriptor integrity pattern** (`src/tests/curation/taxonomy_seed_v2.test.ts` lines 291-298):

```typescript
expect(v2.version).toBe('2.0.0')
expect(validateSeed(v2).ok).toBe(true)
expect(v2.families.map(family => family.id).every(id => IN_SCOPE_FAMILIES.includes(id as (typeof IN_SCOPE_FAMILIES)[number]))).toBe(true)
assertNoDeferredIds(v2)
assertLowerSnakeCaseAscii(v2)
assertNoGlobalDescriptorDuplicates(v2)
assertNoEmptySubfamilies(v2)
assertApprovedExpansionTraceability(v1, v2, approvals)
```

**Helper constraints to preserve** (`src/tests/curation/taxonomy_seed_v2.test.ts` lines 88, 177-195):

```typescript
const snakeCaseAscii = /^[a-z][a-z0-9_]*$/

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

const assertNoEmptySubfamilies = (seed: TaxonomySeedFixture): void => {
  seed.families.forEach(family => {
    family.subfamilies.forEach(subfamily => {
      expect(subfamily.descriptors.length, `${family.id}/${subfamily.id} must not be empty`).toBeGreaterThan(0)
    })
  })
}
```

---

### `data/taxonomy/descriptor_aliases.seed.json` (model / seed data, no-op validation)

**Analog:** current alias seed and alias curation test.

**No alias mutation pattern for Option 1** (`data/taxonomy/descriptor_aliases.seed.json` lines 7-8):

```json
"ylang ylang": "ylang_ylang",
"petit grain": "petitgrain",
```

For Option 1, leave this file unchanged. The intended alias already exists and should become target-valid through seed descriptor presence, not through alias mutation.

**`ylang ylang -> ylang_ylang` accepted_exception_interim preservation** (`src/tests/curation/alias_seed_v2.test.ts` lines 38-45):

```typescript
const existingApprovedAliases: AliasSeedFixture = {
  'jasmin': 'jasmine',
  'orange flower': 'orange_blossom',
  'orange blossom': 'orange_blossom',
  'orangeflower': 'orange_blossom',
  'oak moss': 'oakmoss',
  'ylang ylang': 'ylang_ylang',
  'petit grain': 'petitgrain',
```

**Alias target integrity pattern** (`src/tests/curation/alias_seed_v2.test.ts` lines 79, 132-144):

```typescript
const isPreservedLegacyAlias = (alias: string, target: string): boolean => existingApprovedAliases[alias] === target

it('requires every new alias target to exist as a seed v2 descriptor', async () => {
  const [aliasSeed, v2Seed] = await Promise.all([
    readJson<AliasSeedFixture>(aliasSeedPath),
    readJson<TaxonomySeedFixture>(v2SeedPath),
  ])
  const descriptors = collectDescriptors(v2Seed)

  Object.entries(aliasSeed).forEach(([alias, target]) => {
    expect(
      descriptors.has(target) || isPreservedLegacyAlias(alias, target),
      `${alias} points to absent canonical target ${target} without approved legacy preservation`,
    ).toBe(true)
  })
})
```

**Alias key and target guard pattern** (`src/tests/curation/alias_seed_v2.test.ts` lines 147-174):

```typescript
Object.keys(aliasSeed).forEach(alias => {
  expect(descriptors.has(alias), `${alias} must remain an alias, not a primary descriptor`).toBe(false)
})

Object.entries(aliasSeed).forEach(([alias, target]) => {
  expect(target, `${alias} must not point to candidate placeholder`).not.toBe('candidate')
  expect(deferredCanonicalTargets.has(target), `${alias} points to deferred canonical target ${target}`).toBe(false)
  expect(
    descriptors.has(target) || isPreservedLegacyAlias(alias, target),
    `${alias} points to ambiguous or absent canonical target ${target} without approved legacy preservation`,
  ).toBe(true)
})
```

---

### `.planning/phases/20-alias-target-microcuration-execution/20-01-PLAN.md` (planning document, batch execution plan)

**Analog:** `19-PATTERNS.md`, `19-01-PLAN.md`, `20-RESEARCH.md`.

**Decision matrix pattern** (`19-PATTERNS.md` lines 52-62):

```markdown
| Disposition | Significado | Pré-requisitos |
|-------------|-------------|----------------|
| `add_target` | Adicionar o target como descritor curado no seed v2 | Evidência olfativa, família/subfamília aprovada, persisted curatorial approval |
| `remap_target` | Alterar o target do alias para um descritor existente | Equivalência semântica comprovada, evidência de uso |
| `remove_alias` | Remover o alias do `descriptor_aliases.seed.json` | Justificativa de que o alias não é necessário, impacto zero ou documentado |
| `accepted_exception` | Manter o alias com target ausente como exceção documentada | Política explícita, prazo de revisão definido |
| `defer` | Adiar a decisão para uma fase futura | Evidência insuficiente para decisão |
```

**Phase 20 fixed dispositions:**

| Alias | Disposition | Mutation |
|---|---|---|
| `petit grain -> petitgrain` | `add_target` | Add `petitgrain` to seed v2 only |
| `ylang ylang -> ylang_ylang` | `accepted_exception_interim` | No seed or alias mutation |

**Rollback snapshot/restore pattern** (`19-01-PLAN.md` lines 140-157):

```markdown
### Pré-condições

Antes de qualquer mutação em uma fase de execução futura:

1. **Snapshot:** Copiar `descriptor_aliases.seed.json` para backup rastreável.
2. **Snapshot:** Se `add_target` for executado, copiar `taxonomy-seed.v2.json` para backup.
3. **Baseline metrics:** Registrar contagem de aliases, targets, descritores seed.

### Procedimento de Rollback

1. Restaurar `descriptor_aliases.seed.json` do snapshot.
2. Se `taxonomy-seed.v2.json` foi alterado, restaurar do snapshot.
3. Verificar que `git diff` contra o estado pré-mutação é vazio para os arquivos afetados.
4. Executar `npm run safety:guard` para confirmar que o guard passa.
5. Executar testes de alias (`alias_seed_v2.test.ts`) para confirmar que passam.
6. **NÃO** recompilar artefatos oficiais durante rollback; usar apenas `/tmp` compile se necessário.
```

**Phase 20 rollback adaptation:** snapshot/restore only `data/taxonomy/taxonomy-seed.v2.json` for Option 1; `descriptor_aliases.seed.json` must have no delta, but can still be included in preflight checksum/diff evidence.

**Protected diff / allowlist pattern** (`scripts/check-safety-guards.sh` lines 54-64):

```bash
PROTECTED_DIFF=$(git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts)
if [ -n "$PROTECTED_DIFF" ]; then
  echo "PROTECTED_DIFF: the following protected paths have uncommitted working-tree changes:" >&2
  while IFS= read -r line; do
    echo "  $line" >&2
  done <<< "$PROTECTED_DIFF"
  echo "$POLICY_LINE" >&2
  VIOLATIONS=1
fi
```

**Expected guard behavior after intentional seed mutation:** after adding `petitgrain`, `npm run safety:guard` is expected to fail with `PROTECTED_DIFF` for `data/taxonomy/taxonomy-seed.v2.json`. The execution plan must use an allowlist diff audit instead of treating that failure as unexpected.

**Non-mutating guard contract** (`scripts/check-safety-guards.sh` lines 15-16):

```bash
# This script is NON-MUTATING. It never runs git add, git reset, git checkout,
# git clean, or git rm. It only reads repository state.
```

**Script reference pattern** (`src/package.json` lines 6-14):

```json
"scripts": {
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "precompile": "npm run build",
  "compile": "node dist/cli/compile.js",
  "compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report",
  "safety:guard": "bash ../scripts/check-safety-guards.sh",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

---

### Optional `/tmp/taxonomy-phase20-v2-compile/*` (temporary artifact, batch file-I/O)

**Analog:** `src/cli/parse_args.ts`.

**Default publication path to avoid** (`src/cli/parse_args.ts` lines 15-24):

```typescript
export const DEFAULT_PATHS = {
  seedPath: 'data/taxonomy/taxonomy-seed.v2.json',
  aliasPath: 'data/taxonomy/descriptor_aliases.seed.json',
  corpusPath: 'data/enriched_materials.json',
  relationsPath: 'data/inference/curated_relations.v2.json',
  accordsPath: 'data/inference/accord_map.v2.json',
  noisePath: 'data/inference/semantic_noise.v1.json',
  outputDir: 'data/compiled/v2',
  version: '2.0.0',
} as const
```

**Override flag pattern** (`src/cli/parse_args.ts` lines 33-43):

```typescript
const FLAG_TO_KEY = {
  '--seed': 'seedPath',
  '--aliases': 'aliasPath',
  '--corpus': 'corpusPath',
  '--relations': 'relationsPath',
  '--accords': 'accordsPath',
  '--noise': 'noisePath',
  '--out': 'outputDir',
  '--version': 'version',
  '--generated-at': 'generatedAt',
} as const
```

**`/tmp` compile-only pattern:** if compile validation is needed in future execution, use explicit `--out /tmp/taxonomy-phase20-v2-compile` and verify official `data/compiled/v2` has no diff. Do not run default `npm run compile` for this phase because defaults publish to `data/compiled/v2`.

## Shared Patterns

### Future Option 1 allowlist

**Apply to:** `20-01-PLAN.md`, future execution checklist.

| Path | Disposition |
|---|---|
| `.planning/phases/20-alias-target-microcuration-execution/20-FINAL-APPROVAL.md` | Required before mutation |
| `data/taxonomy/taxonomy-seed.v2.json` | Only data mutation: add `petitgrain` under `citrus/citrus_fresh` |
| `data/taxonomy/descriptor_aliases.seed.json` | Must remain unchanged for Option 1 |
| `data/compiled/v2/*` | Publication banned without separate explicit plan |
| `data/compiled/v1/*`, `data/inference/*`, `src/cli/parse_args.ts`, `scripts/check-safety-guards.sh`, `src/package.json`, `graphify-out/*` | Out of scope |

### Alias target integrity

**Source:** `alias_seed_v2.test.ts` lines 139-144 and 166-173.  
**Apply to:** alias validation section of future plan.

```typescript
descriptors.has(target) || isPreservedLegacyAlias(alias, target)
```

Expected after Option 1: `petit grain -> petitgrain` passes by descriptor presence; `ylang ylang -> ylang_ylang` remains `accepted_exception_interim` via legacy preservation.

### Seed descriptor integrity

**Source:** `taxonomy_seed_v2.test.ts` lines 291-298.  
**Apply to:** future validation commands/checklist.

Key invariants: `version` remains `2.0.0`; `petitgrain` matches lower snake-case ASCII; descriptor appears once globally; `citrus/citrus_fresh` remains non-empty; family is in scope; approval traceability is documented.

### Safety guard usage

**Source:** `scripts/check-safety-guards.sh` lines 15-17 and 54-64.  
**Apply to:** future execution plan and rollback.

Use guard before mutation and after rollback/no-protected-diff state. After intentional seed mutation, expect `PROTECTED_DIFF` and perform an explicit allowlist diff audit that permits only `data/taxonomy/taxonomy-seed.v2.json`.

### Official compiled artifact ban

**Source:** `src/cli/parse_args.ts` lines 15-24; `ROADMAP.md` lines 776-781.  
**Apply to:** optional compile validation.

Do not publish or refresh `data/compiled/v2`. Compile validation, if used, must be explicitly directed to `/tmp` with `--out` and excluded from committed artifacts.

## No Analog Found

No files lack an analog. Phase 20 is a constrained data/planning microcuration and all required patterns map to existing seed JSON, curation tests, safety guard, CLI flag parsing, or Phase 19 planning docs.

## Metadata

**Analog search scope:** required Phase 20 docs; Phase 19 planning docs; `data/taxonomy`; `data/compiled/v2`; `src/tests/curation`; `scripts`; `src/cli`; `src/package.json`.  
**Files scanned/read:** 18  
**Pattern extraction date:** 2026-05-26  
**Project instructions:** no root `AGENTS.md` found.  
**Project skill index sampled:** `.agents/skills/gsd-plan-phase/SKILL.md`.
