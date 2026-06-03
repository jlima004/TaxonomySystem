# Phase 47: Controlled Curation Mutation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 47-controlled-curation-mutation
**Areas discussed:** Mutation mechanism, Validation flow, Protected-boundary guardrails, Plan structure

---

## Mutation mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Direct JSON edit | Use Edit on `data/taxonomy/taxonomy-seed.v2.json`. One Edit per add_seed (12 atomic Edits). Insert the new descriptor string at the end of the existing descriptors array of the matching subfamily. No new key, no new subfamily, no metadata/version/author/timestamp changes. | |
| Read-parse-rewrite script | Small TypeScript or Python script in `/tmp` that loads the seed, validates, applies 12 mechanical add_seed ops from a parseable input, and writes a new seed file. Heavier surface; offers built-in order-preserving semantics. | |
| Both: direct edit + parser check | Direct edit on the seed file, then a small inline Python parser assertion verifying exactly 12 additions landed at the right paths, no extras, no removals, no metadata drift. | ✓ |

**User's choice:** "Choose option 3: Both direct edit + parser check. Apply the 12 add_seed rows by direct JSON edit to `data/taxonomy/taxonomy-seed.v2.json`, preserving ordering, version, metadata, and unrelated fields. Then run an inline parser assertion to prove exactly those 12 descriptors were added at the approved paths and nothing else changed."

**Notes:** Matches Phase 23/25/27/33/42 precedent. The inline parser mirrors the Phase 46 inline Python parser style (no committed helper script).

---

## Validation flow

| Option | Description | Selected |
|--------|-------------|----------|
| Typecheck + vitest + /tmp sandbox compile (Recommended) | After 12 JSON edits: (1) `tsc --noEmit` on `src/`, (2) `vitest run` full suite, (3) sandbox compile in `/tmp` with explicit `--version 2.8.0` writing to `/tmp/compile-2.8-validate`, capture stderr/stdout + zero-hard-failures assertion. No writes to `data/compiled/v2/`. | ✓ |
| Typecheck + vitest only | Run `tsc --noEmit` and `vitest run` only. Skip `/tmp` sandbox compile. | |
| Scoped curation tests + sandbox compile | Run only curation-scoped vitest files plus `/tmp` sandbox compile. | |

**User's choice:** "Choose option 1: Typecheck + vitest + /tmp sandbox compile. After the 12 JSON seed edits, run `tsc --noEmit` if available, run the full vitest suite, and run a sandbox compile with explicit `--version 2.8.0` to `/tmp/compile-2.8-validate`. Capture compile metrics and assert no hard failures, but do not write or publish anything to `data/compiled/v2`; Phase 48 owns official artifact publication."

**Notes:** Mirrors the v2.7 Phase 42 → Phase 43 two-step pattern. Phase 47 owns mutation + sandbox validation only; Phase 48 owns publication.

---

## Protected-boundary guardrails

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal allow-list + Phase 16 guard + diff check (Recommended) | Allow-list: only `data/taxonomy/taxonomy-seed.v2.json` and Phase 47 planning/closure artifacts (47-CONTEXT.md, 47-01-PLAN.md, 47-01-SUMMARY.md, 47-VERIFICATION.md), plus roadmap/state/requirements for phase bookkeeping. Pre- and post-task: run `scripts/check-safety-guards.sh` (Phase 16) and final `git diff --name-only` assertion. | ✓ |
| Block-list only (more permissive) | Block-list of explicitly forbidden paths. Less safe because it allows touching other unrelated files by accident. | |
| Minimal allow-list + parser + diff (no Phase 16) | Same as recommended but skip `scripts/check-safety-guards.sh` and rely solely on the inline diff assertion. | |

**User's choice:** "Choose option 1: Minimal allow-list + Phase 16 guard + diff check. Phase 47 may touch only `data/taxonomy/taxonomy-seed.v2.json` and Phase 47 planning/closure artifacts, plus roadmap/state/requirements only for phase bookkeeping. Run `scripts/check-safety-guards.sh` before and after mutation, then run a final `git diff --name-only` assertion proving the allow-list is exhaustive. No `data/compiled`, `taxonomy-seed.v1`, `descriptor_aliases.seed`, `src`, Graphify, scoring, inference, package, UI, MVP, SaaS, or Knowledge Engine files may change."

**User's verbatim forbidden list (locked):**
- `data/compiled/*`
- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/*`
- `src/cli/parse_args.ts`
- `src/*`
- `graphify-out/*`
- `package.json`
- `package-lock.json` / `pnpm-lock.yaml`
- MVP/SaaS/Knowledge Engine/UI files

**User's verbatim verification flow (locked):**
1. Run `scripts/check-safety-guards.sh` before mutation.
2. Apply only the 12 approved seed additions to `taxonomy-seed.v2.json`.
3. Run parser assertion proving exactly 12 additions and no alias/compiled/source drift.
4. Run `scripts/check-safety-guards.sh` again.
5. Run `git diff --name-only` and assert every changed path is in the allow-list.

---

## Plan structure

| Option | Description | Selected |
|--------|-------------|----------|
| Single plan: 47-01 (Recommended) | One `47-01-PLAN.md` covering parse → extract → confirm → 12 edits → parser verify → safety guard → tsc/vitest/sandbox compile → VERIFICATION.md → SUMMARY.md. | ✓ |
| Two plans: 47-01 mutation, 47-02 validation | 47-01 = mutation only. 47-02 = validation. | |
| Three plans (mutation / validation / closure) | 47-01 mutation, 47-02 typecheck+vitest, 47-03 /tmp sandbox compile + closure report. | |

**User's choice:** "Single plan: 47-01" with the explicit 10-step flow:

```
47-01:
1. Parsear 46-DECISION-MATRIX.md.
2. Extrair somente as 12 rows mutation_allowed=true.
3. Confirmar que todas são promote_to_seed.
4. Aplicar 12 direct JSON edits em data/taxonomy/taxonomy-seed.v2.json.
5. Verificar exatamente 12 adições, nos paths corretos.
6. Confirmar zero alias mutation.
7. Rodar safety guard + protected diff.
8. Rodar tsc --noEmit, vitest run e sandbox compile em /tmp.
9. Registrar métricas em 47-VERIFICATION.md.
10. Criar 47-01-SUMMARY.md.
```

**Notes:** Locked as D-47-23, D-47-24 in CONTEXT.md. v2.7 Phase 42 was 2 plans, Phase 43 was 1 plan; this scope is closer to Phase 43 (validation + mutation, no publish).

---

## the agent's Discretion

- Exact Python parser snippet shape in 47-01 plan (must produce D-47-08 and D-47-21 assertions, otherwise free).
- Whether to commit the 12 edits as 12 atomic commits or batch them into one plan-level commit (atomicity at instruction level is required).
- Whether to add per-row commit messages that include the matrix id (e.g. `phase47(05): add carrot_seed to warm_spice`) for traceability.

## Deferred Ideas

None — discussion stayed within phase scope. The 6 lock points in the user prompt (12 promote_to_seed, zero add_alias, ignore 28 non-executable, no artifact publish, no Graphify/scoring/UI/KE/MVP, compile/tests as validation only) are all preserved as D-47-01 through D-47-06 in CONTEXT.md.

The remaining 28 non-executable matrix rows remain on the review queue and are not part of Phase 47. They will be reconsidered only in future batches with explicit planning (FUT-01, FUT-02 in REQUIREMENTS.md).
