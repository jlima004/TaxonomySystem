# Phase 20 — Preflight Gates

**Status:** Context Gathering / Not Ready for Execution

Este documento define os limites iniciais da Phase 20 antes de qualquer microcuradoria de alias target. A fase parte do planejamento fechado na Phase 19, mas ainda não autoriza mutação de dados, compilação, testes, smoke, typecheck ou build.

## Preflight Configuration

```yaml
phase: 20
slug: alias-target-microcuration-execution
name: Alias Target Microcuration Execution
status: planning_approved
execution_readiness: not_ready_for_execution
authorization_status: pending_explicit_approval
recommended_execution: option_1_petitgrain_add_target_only
```

## Objective

Executar uma microcuradoria controlada baseada no planejamento da Phase 19, priorizando a resolução do alias absent target `petit grain -> petitgrain` e preservando `ylang ylang -> ylang_ylang` como `accepted_exception` interino, salvo nova aprovação explícita.

## Mandatory Inputs

| Artifact | Required Use | Status |
|---|---|---|
| `.planning/phases/19-taxonomy-v2-1-curation-planning/19-CLOSURE.md` | Fonte de escopo fechado e carry-forward policy | Read during context gathering |
| `.planning/phases/19-taxonomy-v2-1-curation-planning/19-RESEARCH.md` | Evidência dos absent targets e corpus support | Read during context gathering |
| `.planning/phases/19-taxonomy-v2-1-curation-planning/19-PATTERNS.md` | Padrões de decisão, protected diff e rollback | Read during context gathering |
| `.planning/phases/19-taxonomy-v2-1-curation-planning/19-VALIDATION.md` | Gates de validação e readiness herdados | Read during context gathering |
| `.planning/phases/19-taxonomy-v2-1-curation-planning/19-01-PLAN.md` | Blueprint de execução futura | Read during context gathering |
| `scripts/check-safety-guards.sh` | Referência de guard não-mutante | Read during context gathering |
| `src/package.json` | Referência de scripts disponíveis, sem execução | Read during context gathering |

## Initial Decision Posture

| Option | Label | Preflight Disposition |
|---|---|---|
| 1 | `Petitgrain add_target only` | Approved for planning only; execution still pending explicit approval |
| 2 | `Petitgrain add_target + ylang accepted_exception documentation` | Acceptable expansion for closure documentation only, pending explicit approval |
| 3 | `Petitgrain + ylang add_target` | Not authorized; requires stronger curatorial approval for `ylang_ylang` |
| 4 | `Planning only` | Fallback if execution approval is withheld |

Phase 20 is now approved for planning Option 1 unless the user explicitly approves a different scope. This approval does not authorize execution or mutation.

## Hard Restrictions During Context Gathering

1. Do not alter data, compiled artifacts, inference files, CLI files, guard scripts, package scripts, or Graphify output.
2. Do not alter `data/compiled/v1` under any circumstance.
3. Do not publish or refresh `data/compiled/v2` without a future explicit plan and approval.
4. Do not alter `data/inference`.
5. Do not alter `src/cli/parse_args.ts`.
6. Do not alter `scripts/check-safety-guards.sh`.
7. Do not alter `src/package.json`.
8. Do not alter `graphify-out/*`.
9. Do not execute compile, smoke, typecheck, tests, or build during `context_gathering`.
10. Do not create `20-RESEARCH.md`, `20-PATTERNS.md`, `20-VALIDATION.md`, or `20-01-PLAN.md` until the context-gathering gate advances.

## Future Mutation Gate

Any future mutation requires all of the following before execution:

| Requirement | Status |
|---|---|
| Explicit allowlist of files allowed to change | Pending |
| Persisted curatorial approval | Pending |
| Rollback procedure documented | Pending |
| Validation plan documented | Pending |
| Protected diff policy documented | Pending |
| Execution plan artifact created and approved | Pending |

## Initially Allowed

These Phase 20 context artifacts were allowed during initial context gathering:

1. `20-PREFLIGHT.md`
2. `20-CONTEXT.md`
3. `20-DISCUSSION-LOG.md`

After the user approved Option 1 for planning only, `20-RESEARCH.md`, `20-PATTERNS.md`, `20-VALIDATION.md`, and `20-01-PLAN.md` became allowed planning artifacts. This still does not authorize data mutation or execution.

## Readiness Checklist

- [x] Phase 19 closure reviewed for carry-forward policy.
- [x] Phase 19 research reviewed for alias evidence.
- [x] Phase 19 patterns reviewed for decision and rollback constraints.
- [x] Phase 19 validation reviewed for readiness gates.
- [x] Phase 19 plan reviewed for execution blueprint.
- [x] Safety guard script reviewed as read-only reference.
- [x] `src/package.json` reviewed as read-only reference.
- [x] Phase 20 planning option approved: Option 1 only.
- [x] Allowlist defined in `20-01-PLAN.md` for future execution.
- [x] Rollback documented in `20-01-PLAN.md` and `20-VALIDATION.md`.
- [x] Validation plan documented in `20-VALIDATION.md`.
- [ ] Phase 20 marked ready for execution.

## Non-Authorization Statement

This preflight document does not authorize any data or code mutation. It only records the initial execution posture for Phase 20 and preserves the current state as `not_ready_for_execution`.
