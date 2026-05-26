# Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning - Pattern Map

**Mapped:** 2026-05-26  
**Files analyzed:** 12 target files/artifact classes  
**Analogs found:** 12 / 12  
**Scope:** pattern map only. This file does **not** authorize validation planning, executable planning, curation, descriptor promotion, alias mutation, relation/accord mutation, official artifact regeneration, `DEFAULT_PATHS` edits, Graphify mutation or compile/smoke execution.

Phase 14 remains `context_captured / not_ready_for_execution`.

## File Classification

| New/Modified File or Artifact Class | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `14-BACKLOG-MATRIX.md` | full backlog triage matrix | transform/reporting | `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` backlog boundary; `11-soft-findings-alias-policy.md` disposition ledger | exact |
| `14-REVIEW-QUEUE-TRIAGE.md` | dedicated review_queue report | read-only artifact analysis/reporting | `11-graph-review-readiness.md`; `10/curation/v1-v2-comparison.md`; `src/types/inference.ts` | exact |
| `14-ALIAS-MANUAL-REVIEW-PACK.md` optional | manual decision pack | evidence-first classification | `11-soft-findings-alias-policy.md`; `src/tests/curation/alias_seed_v2.test.ts` | exact |
| `14-CURATION-MANUAL-REVIEW-PACK.md` optional | manual candidate decision pack | workbook-style curation evidence | `candidate-review.md` workflow as validated by `taxonomy_seed_v2.test.ts` | role-match |
| Soft findings matrix section | policy re-disposition | disposition ledger | `11-soft-findings-alias-policy.md` | exact |
| Alias cleanup matrix section | target-integrity triage | read-only data comparison | `alias_seed_v2.test.ts` absent-target and legacy exception helpers | exact |
| Graph quality matrix section | graph policy/audit | read-only metrics/reporting | `11-graph-review-readiness.md`; `relation_accord_v2.test.ts` graph gates | exact |
| Relations/accords matrix section | endpoint/score/rationale audit | read-only input audit | `relation_accord_v2.test.ts` | exact |
| Docs/help cleanup shortlist | current-state docs audit | repository search/reporting | `13-01-CONSUMER-INVENTORY.md`; `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` | exact |
| Graphify/generated artifact lifecycle row | generated artifact policy | contamination control | `13-03-GENERATED-ARTIFACT-POLICY.md`; `13-PATTERNS.md` | exact |
| Safety automation shortlist | non-mutating guard candidates | no-write verification | `13-RESEARCH.md` protected diff and smoke patterns | exact |
| Protected diff / `/tmp` compile planning | validation guard | no-write verification + temp file-I/O | `12-PATTERNS.md`; `13-PATTERNS.md`; `v1_v2_comparison.test.ts` | exact |

## Pattern Assignments

### `14-BACKLOG-MATRIX.md` (full backlog triage matrix, transform/reporting)

**Analogs:** `13-04-RELEASE-CONFIDENCE-CHECKLIST.md`, `11-soft-findings-alias-policy.md`, `13-PATTERNS.md`.

**Core shape to copy:** structured rows with explicit evidence, status/disposition and non-authorization language.

```markdown
| item | source_evidence | classification | why_not_phase_13 | suggested_future_phase | blocker_status |
|---|---|---|---|---|---|
| Review queue reduction and distribution/severity improvement. | `11-CONTEXT.md` review queue readiness/disposition guidance; `13-CONTEXT.md` deferred ideas. | follow_up_phase_14 | Phase 13 routes review queue work to Phase 14+ unless a true stabilization blocker is proven. | Phase 14 curation/readiness backlog. | not_blocker |
```

**Phase 14 adaptation:** expand the row shape to the required `14-CONTEXT.md` fields: `id`, `area`, `item`, `source_evidence`, `impact`, `risk`, `risk_reason`, `required_evidence`, `mutation_type`, `protected_paths_touched`, `approval_required`, `validation_required`, `dependencies`, `suggested_phase`, `disposition`, `rationale`.

**Planner use:** create the matrix before any shortlist. The matrix must cover the full known backlog, not only likely execution candidates. It must not authorize execution.

---

### `14-REVIEW-QUEUE-TRIAGE.md` (dedicated review_queue report, read-only artifact analysis/reporting)

**Analogs:** `11-graph-review-readiness.md`, `10/curation/v1-v2-comparison.md`, `src/types/inference.ts`, `src/compiler/review_queue.ts`.

**Review item schema:**

```typescript
export type InferenceReviewItem = {
  readonly type: string
  readonly severity: 'low' | 'medium' | 'high'
  readonly affected: {
    readonly descriptor?: string
    readonly subfamily?: string
    readonly family?: string
    readonly input?: string
    readonly artifact?: string
  }
  readonly evidence: Readonly<Record<string, unknown>>
  readonly suggested_action: string
  readonly confidence?: number
  readonly source?: InferenceDescriptorSource | 'curated' | 'alias'
  readonly reason?: string
}
```

**Sorting pattern:** `src/compiler/review_queue.ts` sorts by `type`, severity rank, affected JSON and stable evidence JSON. The future report should preserve deterministic grouping/sampling by sorting first.

**Current baseline groups:**

| Queue Type | Count | Required Treatment |
|---|---:|---|
| `corpus_candidate_low_support` | 284 | Group by recurrence, subfamily/family, reason and evidence. No auto-promotion. |
| `seed_corpus_conflict` | 33 | Attention group. No auto-fix, no auto-blocker. |

**Planner use:** future report sections should be summary metrics, type-specific triage, traceable samples, recommendations and guardrails. Full 317-item line-by-line classification is not required for first triage.

---

### Optional `14-ALIAS-MANUAL-REVIEW-PACK.md` (manual decision pack, evidence-first classification)

**Analogs:** `11-soft-findings-alias-policy.md`, `src/tests/curation/alias_seed_v2.test.ts`.

**Existing alias integrity helper pattern:**

```typescript
const existingApprovedAliases: AliasSeedFixture = {
  'ylang ylang': 'ylang_ylang',
  'petit grain': 'petitgrain',
}

const isPreservedLegacyAlias = (alias: string, target: string): boolean => existingApprovedAliases[alias] === target
```

**Phase 14 adaptation:** the context treats `ylang ylang -> ylang_ylang` as the known legacy case and `petit grain -> petitgrain` as a new discovery to classify. The future matrix should distinguish:

- target exists in v2 seed;
- target absent but accepted legacy exception;
- target absent and needs more evidence;
- possible equivalent existing target;
- future add/remap/remove/keep options with approval and validation requirements.

**Planner use:** only create a pack if the matrix shows row-level triage is insufficient for human semantic decisions. The pack must not add, remove or remap aliases.

---

### Optional `14-CURATION-MANUAL-REVIEW-PACK.md` (manual candidate decision pack, workbook-style curation evidence)

**Analog:** Phase 8-10 `candidate-review.md` workflow as validated by `src/tests/curation/taxonomy_seed_v2.test.ts`.

**Approval traceability pattern:** approved seed entries require `manual_approval: approved`, `primary_disposition: promote_to_seed`, `family_id`, `subfamily_id`, `descriptor_id`, rationale and evidence.

**Phase 14 adaptation:** optional pack candidates should satisfy the safety filter from `14-CONTEXT.md`:

- existing family;
- existing subfamily;
- clear descriptor semantics;
- no alias cleanup dependency;
- no relation/accord dependency;
- no conflict with seed truth;
- traceable evidence;
- objective validation.

**Planner use:** do not create an empty pack. Do not promote descriptors. Use the pack only to prepare future human decisions.

---

### Soft Findings Matrix Section (policy re-disposition, disposition ledger)

**Analog:** `11-soft-findings-alias-policy.md`.

**Pattern to reuse:** every finding gets an explicit disposition, rationale, policy and blocker status. No soft finding remains implicit.

**Phase 14 known soft findings:**

- `ylang ylang -> ylang_ylang` legacy alias exception.
- Low graph density.
- Inherited zero-frequency seeds.
- `review_queue` 317.
- Increased `seed_corpus_conflict`.
- Pending/deferred candidates.
- Absent-target aliases where applicable.
- Documented relation/accord gaps.

**Planner use:** represent each in `14-BACKLOG-MATRIX.md`. Use `blocker_if_unresolved` only for integrity, artifact/default safety, rollback, schema, determinism or future validation risk.

---

### Alias Cleanup Matrix Section (target-integrity triage, read-only data comparison)

**Analog:** `alias_seed_v2.test.ts`.

**Reusable gate pattern:** collect v2 seed descriptors, then test alias targets against that set or a documented exception list.

```typescript
Object.entries(aliasSeed).forEach(([alias, target]) => {
  expect(
    descriptors.has(target) || isPreservedLegacyAlias(alias, target),
    `${alias} points to absent canonical target ${target} without approved legacy preservation`,
  ).toBe(true)
})
```

**Phase 14 adaptation:** future matrix rows should not treat compile success as enough. Alias cleanup requires target integrity, persisted approval, rationale, source evidence and allowlist.

---

### Graph Quality Matrix Section (graph policy/audit, read-only metrics/reporting)

**Analogs:** `11-graph-review-readiness.md`, `relation_accord_v2.test.ts`, `similarity_matrix.json` stats.

**Coverage-over-density pattern:** low density can remain accepted with policy when all subfamilies participate and gaps have rationale. Artificial edges to increase density are prohibited.

**Current metric pattern:**

| Metric | v2 Current |
|---|---:|
| subfamilies | 18 |
| edges | 13 |
| density | 0.08496732026143791 |

**Planner use:** graph rows should focus on endpoint validity, score validity, rationale/evidence and whether any concrete gap exists. Do not set a density target as a primary gate.

---

### Relations/Accords Matrix Section (endpoint/score/rationale audit, read-only input audit)

**Analog:** `src/tests/curation/relation_accord_v2.test.ts`.

**Reusable gates:**

```typescript
for (const relation of relations) {
  expect(subfamilyIds.has(relation.source_subfamily_id), relation.source_subfamily_id).toBe(true)
  expect(subfamilyIds.has(relation.target_subfamily_id), relation.target_subfamily_id).toBe(true)
  expect(relation.score, `${relation.source_subfamily_id}->${relation.target_subfamily_id}`).not.toBe(0)
}

for (const accord of accords) {
  expect(subfamilyIds.has(accord.source_subfamily_id), accord.source_subfamily_id).toBe(true)
  expect(subfamilyIds.has(accord.target_subfamily_id), accord.target_subfamily_id).toBe(true)
  expect(accord.score, `${accord.source_subfamily_id}->${accord.target_subfamily_id}`).not.toBe(0)
}
```

**Phase 14 adaptation:** classify 14 relations and 19 accords as audit-quality rows or grouped findings. Do not tune scores or fill gaps without full graph gates and persisted approval.

---

### Docs/Help Cleanup Shortlist (current-state docs audit, repository search/reporting)

**Analogs:** `13-01-CONSUMER-INVENTORY.md`, `13-04-RELEASE-CONFIDENCE-CHECKLIST.md`.

**Pattern to reuse:** current-state docs that miscommunicate defaults or fallback can be candidates; historical docs that accurately record prior state remain preserved.

**Potential known candidates from Phase 13:** CLI help title wording and ROADMAP progress/status drift were non-blocking follow-ups.

**Planner use:** future docs/help matrix rows should include current-state surface, evidence, why it matters, whether code help changes are needed, and required tests. No direct docs/help fix without a plan.

---

### Graphify/Generated Artifact Lifecycle Row (generated artifact policy, contamination control)

**Analogs:** `13-03-GENERATED-ARTIFACT-POLICY.md`, `13-PATTERNS.md`.

**Pattern to reuse:** Graphify artifacts are protected/plan-gated and are not authoritative taxonomy correctness evidence.

```markdown
Preexisting changes in `graphify-out/*` do not block the phase by themselves, but they cannot enter commits without an explicit plan.
Regeneration or mutation of `graphify-out/*` requires its own plan, allowlist and diff policy.
```

**Planner use:** future matrix row should classify lifecycle choices as backlog-first. Do not decide `versioned`, `local_only`, `ignored` or `archive_only` unless the triage shows a concrete operational problem.

---

### Safety Automation Shortlist (non-mutating guard candidates, no-write verification)

**Analogs:** `13-RESEARCH.md`, `13-PATTERNS.md`, `12-PATTERNS.md`.

**Priority guard candidates from Phase 14 context:**

- Protected diff check.
- Tmp-only compile guard.
- `graphify-out/*` staging/commit guard.
- `DEFAULT_PATHS` v2 assertion.
- Explicit v1 fallback assertion.

**Planner use:** safety automation rows should prefer small, deterministic, removable checks that do not alter data, official artifacts, defaults or Graphify output.

---

### Protected Diff / `/tmp` Compile Planning (validation guard, no-write verification + temp file-I/O)

**Analogs:** `12-PATTERNS.md`, `13-PATTERNS.md`, `v1_v2_comparison.test.ts`, `src/cli/compile.ts`.

**Protected diff pattern:**

```bash
git diff --exit-code -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

**Future-only smoke pattern:**

```bash
cd src && npm run compile -- \
  --out /tmp/opencode/taxonomy-phase14-smoke/default-v2 \
  --generated-at 2026-01-01T00:00:00.000Z
```

**Planner use:** describe compile commands only until `14-VALIDATION.md` and a specific plan authorize execution. Never use official output directories for exploratory smoke validation.

## Shared Patterns

### Research/Pattern Boundary

Apply to this step and any downstream consumer of these files:

```markdown
Research and pattern mapping do not authorize validation, plans, curation, data mutation, artifact regeneration, code edits or Graphify mutation.
```

### Risk-First Disposition

Impact does not outrank risk. High-impact/high-risk rows defer to Phase 15+ unless they are true blockers. Low-mutation, clear-validation, reversible rows can become candidates only after validation and plan approval.

### Evidence-First Curation

Corpus evidence is support-only. Curated seed/inference/alias files are authoritative inputs. Review queue candidates remain review-only until persisted approval and future execution gates exist.

### Protected Path Policy

Protected by default:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1/**`
- `data/compiled/v2/**`
- `src/cli/parse_args.ts`
- `graphify-out/*`

### No New Dependencies

Use existing Node/npm/TypeScript/Vitest and Git tooling. Do not install packages for Phase 14 triage.

### Optional Artifacts Need Justification

Optional manual-review packs are created only when the matrix or review_queue report shows a clear need. Do not create empty or artificial packs.

## Anti-Patterns To Avoid

- Creating `14-BACKLOG-MATRIX.md` before preserving `14-CONTEXT.md` risk-first vocabulary and required fields.
- Creating `14-REVIEW-QUEUE-TRIAGE.md` as a mutation plan instead of a report.
- Treating `seed_corpus_conflict` as an automatic blocker or automatic seed correction.
- Treating `corpus_candidate_low_support` as automatic promotion backlog.
- Running bare `npm run compile` or writing official artifacts during triage.
- Staging or modifying `graphify-out/*` with planning docs.
- Adding a dedicated graph/relations/docs/CI artifact by default when `14-CONTEXT.md` says matrix-first.

## No Analog Found

None. Every Phase 14 target artifact and guard has a direct analog in Phase 11-13 planning artifacts, existing curation tests, CLI compile behavior, review queue schema, or protected-path patterns.

## Metadata

**Analog search scope:** `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration`, `.planning/phases/12-taxonomy-seed-v2-default-switch-execution`, `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption`, `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning`, `src/cli`, `src/compiler`, `src/types`, `src/tests/curation`, `data/compiled/v2`, `data/taxonomy`, `data/inference`.  
**Files created by this step:** `14-RESEARCH.md`, this file.  
**Compile/smoke commands run:** none.  
**Curation/data/artifact mutation:** none intended or authorized.  
**Pattern extraction date:** 2026-05-26.
