---
status: read_only_report_only
non_authorizing: true
phase: 19
slug: taxonomy-v2-1-curation-planning
created: 2026-05-26
protected_paths_touched: none
---

# Phase 19 — Patterns: Alias Cleanup / Absent Targets

## Pattern Map

Este documento identifica os padrões de curadoria, decisão e proteção aplicáveis à limpeza de aliases com targets ausentes.

## P-01: Alias Target Categories

A pesquisa revelou **3 categorias distintas** de relação alias → target na taxonomia atual:

### Categoria A: Target Curado (PRESENT)

```
alias → target ∈ seed_v2_descriptors
```

- 9 dos 11 aliases se enquadram aqui.
- Sem ação necessária: integridade verificada.
- Exemplos: `jasmin → jasmine`, `patchouly → patchouli`, `musky → musk`.

### Categoria B: Target Ausente — Sem Existência Compilada (ORPHAN)

```
alias → target ∉ seed_v2_descriptors ∧ target ∉ compiled_descriptors
```

- **1 caso:** `ylang ylang → ylang_ylang`.
- O target não existe em nenhum nível: nem seed, nem corpus compilado.
- Mantido exclusivamente por exceção legada no teste.
- Decisões possíveis: add_target (seed), remap_target, remove_alias, accepted_exception, defer.

### Categoria C: Target Ausente — Existe como Candidato de Corpus (CORPUS_CANDIDATE)

```
alias → target ∉ seed_v2_descriptors ∧ target ∈ compiled_descriptors(source="corpus")
```

- **1 caso:** `petit grain → petitgrain`.
- O target existe como candidato compilado (`source: "corpus"`, `status: "candidate"`, freq 52).
- O alias resolve para um descritor que está no pipeline mas não é verdade curada.
- Decisões possíveis: promote_target (seed), remap_target, remove_alias, accepted_exception, defer.

## P-02: Decision Matrix Template

Para cada alias com target ausente, a decisão deve ser classificada em exatamente um dos seguintes dispositions:

| Disposition | Significado | Pré-requisitos |
|-------------|-------------|----------------|
| `add_target` | Adicionar o target como descritor curado no seed v2 | Evidência olfativa, família/subfamília aprovada, persisted curatorial approval |
| `remap_target` | Alterar o target do alias para um descritor existente | Equivalência semântica comprovada, evidência de uso |
| `remove_alias` | Remover o alias do `descriptor_aliases.seed.json` | Justificativa de que o alias não é necessário, impacto zero ou documentado |
| `accepted_exception` | Manter o alias com target ausente como exceção documentada | Política explícita, prazo de revisão definido |
| `defer` | Adiar a decisão para uma fase futura | Evidência insuficiente para decisão |

## P-03: Evidence Criteria Pattern

Cada decisão deve ser sustentada por **critérios de evidência** específicos:

### Para `add_target`
- [ ] O descritor é um ingrediente/nota olfativa reconhecido na indústria
- [ ] Existe frequência de corpus (>0) ou referência curatorial externa
- [ ] Existe família e subfamília adequada no seed v2
- [ ] Não há conflito com descritores existentes
- [ ] Aprovação curatorial persistida

### Para `remap_target`
- [ ] Existe um descritor seed existente semanticamente equivalente
- [ ] A equivalência é documentável com evidência de uso
- [ ] O remapeamento não cria ambiguidade
- [ ] O novo target é um descritor curado (`status: "curated"`)

### Para `remove_alias`
- [ ] O alias não é utilizado em contexto de normalização real
- [ ] A remoção não causa regressão em normalização de corpus
- [ ] A remoção é rastreável e reversível

### Para `accepted_exception`
- [ ] A exceção é explicitamente documentada com rationale
- [ ] A mecânica de exceção no teste é preservada
- [ ] Um prazo de revisão futura é definido

### Para `defer`
- [ ] A evidência disponível é insuficiente para decisão informada
- [ ] Não há blocker de integridade imediato
- [ ] O estado atual não degrada a qualidade do sistema

## P-04: Target Integrity Validation Pattern

A validação de integridade de targets deve cobrir:

```
Para cada alias (a → t) em descriptor_aliases.seed.json:
  IF t ∈ seed_v2_descriptors:
    PASS (integridade verificada)
  ELSE IF isPreservedLegacyAlias(a, t):
    PASS_WITH_EXCEPTION (exceção legada aceita)
  ELSE:
    FAIL (target ausente sem exceção)
```

Estado atual: 9 PASS, 2 PASS_WITH_EXCEPTION, 0 FAIL.

## P-05: Protected Diff Pattern

Qualquer execução futura deve respeitar:

| Path | Proteção | Guard |
|------|----------|-------|
| `data/taxonomy/descriptor_aliases.seed.json` | Bloqueado na Phase 19 (planning only) | `scripts/check-safety-guards.sh` |
| `data/taxonomy/taxonomy-seed.v2.json` | Bloqueado na Phase 19 | `scripts/check-safety-guards.sh` |
| `data/compiled/v1/*` | Imutável permanente | `scripts/check-safety-guards.sh` |
| `data/compiled/v2/*` | Bloqueado na Phase 19 | `scripts/check-safety-guards.sh` |
| `data/inference/*` | Bloqueado na Phase 19 | `scripts/check-safety-guards.sh` |
| `src/cli/parse_args.ts` | Bloqueado na Phase 19 | `scripts/check-safety-guards.sh` |
| `graphify-out/*` | Bloqueado permanente | `scripts/check-safety-guards.sh` |

## P-06: Rollback Pattern

Se uma execução futura de curadoria de alias for autorizada, o rollback deve:

1. Preservar cópia do `descriptor_aliases.seed.json` antes da mutação.
2. Garantir que o rollback restaura o estado exato pré-mutação.
3. Não alterar nenhum outro arquivo protegido durante o rollback.
4. Verificar que os testes de alias passam após o rollback.
5. Verificar que o safety guard script passa após o rollback.

## P-07: Execution Scope Decision Pattern

A fase de planejamento deve concluir com uma decisão explícita sobre o formato de saída:

| Opção | Descrição |
|-------|-----------|
| **Report-only** | Phase 19 gera apenas um relatório de decisão e evidências; execução fica para fase futura |
| **Manual review pack** | Phase 19 gera um pacote de revisão com opções e riscos para aprovação humana; execução em fase futura |
| **Microcuradoria futura** | Phase 19 define plano completo de microcuradoria com allowlist, validation gates e rollback, para execução numa fase subsequente aprovada |

---

*Patterns document: Phase 19 — Taxonomy v2.1 Curation Planning*
*Generated: 2026-05-26 (read-only, non-authorizing)*
