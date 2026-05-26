---
status: pending_review
non_authorizing: true
phase: 19
slug: taxonomy-v2-1-curation-planning
created: 2026-05-26
protected_paths_touched: none
execution_readiness: not_ready_for_execution
---

# Phase 19 — Validation: Alias Cleanup / Absent Targets

## Validation Status

**Status Geral:** `pending_review` — Aguardando aprovação explícita do usuário.

A Phase 19 permanece `not_ready_for_execution` até que este documento e o `19-01-PLAN.md` sejam revisados e aprovados explicitamente.

## Validation Scope

### V-01: Research Completeness

| Check | Status | Evidence |
|-------|--------|----------|
| Todos os 11 aliases mapeados | ✅ PASS | `19-RESEARCH.md` — Alias Integrity Report |
| Targets presentes identificados (9) | ✅ PASS | Cruzamento com seed v2 descriptors |
| Targets ausentes identificados (2) | ✅ PASS | `ylang ylang → ylang_ylang`, `petit grain → petitgrain` |
| Evidência de corpus verificada | ✅ PASS | `petitgrain` como candidato freq 52; `ylang_ylang` ausente |
| Exceção legada documentada | ✅ PASS | `isPreservedLegacyAlias()` em `alias_seed_v2.test.ts` |
| Referências cruzadas Phase 14 | ✅ PASS | ALIAS-01, ALIAS-02, ALIAS-03 verificados |

### V-02: Pattern Completeness

| Check | Status | Evidence |
|-------|--------|----------|
| Categorias de alias definidas (A/B/C) | ✅ PASS | `19-PATTERNS.md` P-01 |
| Matriz de decisão template definida | ✅ PASS | `19-PATTERNS.md` P-02 |
| Critérios de evidência por disposition | ✅ PASS | `19-PATTERNS.md` P-03 |
| Padrão de validação de integridade | ✅ PASS | `19-PATTERNS.md` P-04 |
| Protected diff pattern | ✅ PASS | `19-PATTERNS.md` P-05 |
| Rollback pattern | ✅ PASS | `19-PATTERNS.md` P-06 |
| Execution scope decision pattern | ✅ PASS | `19-PATTERNS.md` P-07 |

### V-03: Plan Completeness

| Check | Status | Evidence |
|-------|--------|----------|
| Matriz de decisão preenchida | ✅ PASS | `19-01-PLAN.md` seção Decision Matrix |
| Critérios de evidência aplicados | ✅ PASS | `19-01-PLAN.md` seção Evidence Analysis |
| Validação de integridade definida | ✅ PASS | `19-01-PLAN.md` seção Target Integrity Validation |
| Rollback definido | ✅ PASS | `19-01-PLAN.md` seção Rollback Strategy |
| Protected diff checks definidos | ✅ PASS | `19-01-PLAN.md` seção Protected Diff Checks |
| Formato de saída decidido | ✅ PASS | `19-01-PLAN.md` seção Execution Scope Decision |

### V-04: Non-Mutation Compliance

| Check | Status | Evidence |
|-------|--------|----------|
| `descriptor_aliases.seed.json` não alterado | ✅ PASS | Leitura read-only apenas |
| `taxonomy-seed.v2.json` não alterado | ✅ PASS | Leitura read-only apenas |
| `curated_relations.v2.json` não alterado | ✅ PASS | Não acessado |
| `accord_map.v2.json` não alterado | ✅ PASS | Não acessado |
| `data/compiled/v1/*` não alterado | ✅ PASS | Leitura read-only apenas |
| `data/compiled/v2/*` não alterado | ✅ PASS | Leitura read-only apenas |
| `src/cli/parse_args.ts` não alterado | ✅ PASS | Não acessado |
| `scripts/check-safety-guards.sh` não alterado | ✅ PASS | Não acessado |
| `src/package.json` não alterado | ✅ PASS | Não acessado |
| `graphify-out/*` não alterado | ✅ PASS | Não acessado |
| Nenhuma compilação executada | ✅ PASS | Nenhum build/compile/smoke/typecheck rodado |
| Nenhuma curadoria executada | ✅ PASS | Planning only |

### V-05: Execution Gate

| Gate | Status | Condition |
|------|--------|-----------|
| `19-RESEARCH.md` revisado | ⏳ PENDING | Aguardando aprovação do usuário |
| `19-PATTERNS.md` revisado | ⏳ PENDING | Aguardando aprovação do usuário |
| `19-VALIDATION.md` revisado | ⏳ PENDING | Este documento — aguardando aprovação |
| `19-01-PLAN.md` revisado | ⏳ PENDING | Aguardando aprovação do usuário |
| Aprovação explícita obtida | ⏳ PENDING | Necessário antes de qualquer execução |

## Acceptance Criteria

Para que a Phase 19 seja considerada completa como fase de **planejamento**:

1. ✅ `19-RESEARCH.md` criado com pesquisa de integridade de aliases.
2. ✅ `19-PATTERNS.md` criado com padrões de curadoria e decisão.
3. ✅ `19-VALIDATION.md` criado com contrato de validação.
4. ✅ `19-01-PLAN.md` criado com matriz de decisão e plano de execução futura.
5. ⏳ Aprovação explícita do usuário para os 4 artefatos.
6. ❌ Nenhuma execução de curadoria autorizada nesta fase.

## Readiness Declaration

A Phase 19 **permanece `not_ready_for_execution`** até aprovação explícita. A fase é estritamente de planejamento. Qualquer execução de curadoria requer uma fase separada com:

- Allowlist explícita de arquivos a alterar
- Persisted curatorial approval para cada mutação
- Validation gates com before/after integrity checks
- Rollback testado e documentado
- Protected diff checks via `scripts/check-safety-guards.sh`

---

*Validation document: Phase 19 — Taxonomy v2.1 Curation Planning*
*Generated: 2026-05-26 (non-authorizing, pending review)*
