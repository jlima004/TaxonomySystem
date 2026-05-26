---
status: read_only_report_only
non_authorizing: true
phase: 19
slug: taxonomy-v2-1-curation-planning
created: 2026-05-26
protected_paths_touched: none
---

# Phase 19 — Research: Alias Cleanup / Absent Targets

## Objective

Identificar todos os aliases em `descriptor_aliases.seed.json` cujo target canônico está ausente do seed v2 (`taxonomy-seed.v2.json`), documentar a evidência disponível para cada caso e fornecer os dados necessários para a construção da matriz de decisão no plano de execução.

## Methodology

1. Leitura estritamente read-only de `data/taxonomy/descriptor_aliases.seed.json` (11 entradas).
2. Extração do conjunto completo de descritores do seed v2 (39 descritores em 10 famílias / 18 subfamílias).
3. Cruzamento de cada target de alias contra o conjunto de descritores v2.
4. Inspeção de `data/compiled/v2/taxonomy.json` para verificar se os targets ausentes existem como descritores de corpus.
5. Inspeção de `src/tests/curation/alias_seed_v2.test.ts` para documentar a mecânica de exceção legada.
6. Cruzamento com `14-BACKLOG-MATRIX.md` (ALIAS-01, ALIAS-02, ALIAS-03).

## Alias Integrity Report

### Full Alias Map vs. Seed v2 Descriptors

| # | Alias | Target | No Seed v2? | Status |
|---|-------|--------|-------------|--------|
| 1 | `jasmin` | `jasmine` | ✅ Presente | OK |
| 2 | `orange flower` | `orange_blossom` | ✅ Presente | OK |
| 3 | `orange blossom` | `orange_blossom` | ✅ Presente | OK |
| 4 | `orangeflower` | `orange_blossom` | ✅ Presente | OK |
| 5 | `oak moss` | `oakmoss` | ✅ Presente | OK |
| 6 | `patchouly` | `patchouli` | ✅ Presente | OK |
| 7 | `cedar wood` | `cedarwood` | ✅ Presente | OK |
| 8 | `sandal wood` | `sandalwood` | ✅ Presente | OK |
| 9 | `musky` | `musk` | ✅ Presente | OK |
| 10 | `ylang ylang` | `ylang_ylang` | ❌ **Ausente** | ABSENT TARGET |
| 11 | `petit grain` | `petitgrain` | ❌ **Ausente** | ABSENT TARGET |

**Resumo:** 9/11 aliases com targets presentes; **2 aliases com targets ausentes**.

### Análise Detalhada dos Targets Ausentes

#### Case 1: `ylang ylang -> ylang_ylang`

| Atributo | Valor |
|----------|-------|
| Alias key | `ylang ylang` |
| Target declarado | `ylang_ylang` |
| Presente no seed v1? | ❌ Não |
| Presente no seed v2? | ❌ Não |
| Presente no compiled v1 taxonomy? | ❌ Não encontrado como descritor |
| Presente no compiled v2 taxonomy? | ❌ Não encontrado como descritor |
| Frequência no corpus | Não detectada como descritor compilado |
| Exceção legada no teste? | ✅ Sim — `isPreservedLegacyAlias()` em `alias_seed_v2.test.ts` L79 |
| Referências anteriores | Phase 8 soft warning, Phase 11 legacy alias exception policy, Phase 14 ALIAS-01, `README.md` L102 |
| Origem provável | Alias curatorial herdado de fase anterior à criação formal do seed v2 |

**Diagnóstico:** `ylang_ylang` é um target completamente órfão — não existe como descritor em nenhum seed, nem como candidato de corpus em nenhuma compilação. O alias é mantido exclusivamente pela exceção legada no teste. Há forte evidência de normalização (`ylang-ylang` normaliza para `ylang_ylang` via regra de separadores), mas o descritor nunca foi formalmente curado.

#### Case 2: `petit grain -> petitgrain`

| Atributo | Valor |
|----------|-------|
| Alias key | `petit grain` |
| Target declarado | `petitgrain` |
| Presente no seed v1? | ❌ Não |
| Presente no seed v2? | ❌ Não |
| Presente no compiled v1 taxonomy? | ✅ Sim — `source: "corpus"`, `status: "candidate"`, freq 52, subfamily `citrus_fresh` |
| Presente no compiled v2 taxonomy? | ✅ Sim — `source: "corpus"`, `status: "candidate"`, freq 52, subfamily `citrus_fresh` |
| Frequência no corpus | 52 (suporte moderado) |
| Exceção legada no teste? | ✅ Sim — `isPreservedLegacyAlias()` em `alias_seed_v2.test.ts` L79 |
| Referências anteriores | Phase 14 ALIAS-02, `alias_seed_v2.test.ts` L45 |
| Origem provável | Alias curatorial herdado; o target existe como candidato de corpus mas nunca foi promovido a seed |

**Diagnóstico:** `petitgrain` existe como descritor compilado derivado de corpus com frequência 52 na subfamília `citrus_fresh`. Entretanto, **não está no seed** — é um candidato de corpus (`review_required: true`). O alias aponta para um descritor que é compilado pelo pipeline mas não é um descritor curado/seed. Isso cria uma ambiguidade: o alias resolve para um candidato, não para uma verdade curada.

## Mecânica de Exceção Legada

O arquivo `alias_seed_v2.test.ts` implementa uma exceção explícita:

```typescript
const isPreservedLegacyAlias = (alias: string, target: string): boolean =>
  existingApprovedAliases[alias] === target
```

Onde `existingApprovedAliases` inclui os 10 aliases originais (antes da adição de `musky -> musk` na Round 3). Essa mecânica permite que aliases com targets ausentes do seed passem nas validações de integridade:

- Teste `requires every new alias target to exist as a seed v2 descriptor` (L132-145)
- Teste `rejects candidate, deferred, ambiguous, or absent canonical targets` (L159-174)

Ambos os testes usam `descriptors.has(target) || isPreservedLegacyAlias(alias, target)` como condição de sucesso.

**Implicação:** A exceção foi desenhada como mecanismo temporário durante as expansões de seed (Phase 8-10), mas nunca foi formalmente revisada ou removida.

## Referências Cruzadas com Phase 14

### ALIAS-01 (ylang ylang -> ylang_ylang)

- **Disposition:** `defer_phase_15`
- **Mutation type:** `alias_add_remove_remap`
- **Required evidence:** Target should-exist review, equivalent target search, prior policy review, impact assessment
- **Approval required:** `persisted_curatorial_approval`
- **Validation:** Alias target integrity, seed descriptor presence or documented exception, protected diff

### ALIAS-02 (petit grain -> petitgrain)

- **Disposition:** `defer_phase_15`
- **Mutation type:** `alias_add_remove_remap`
- **Required evidence:** Target should-exist review, semantic equivalent target search, usage evidence
- **Approval required:** `persisted_curatorial_approval`
- **Validation:** Alias target integrity, protected diff, `/tmp` compile if executed

### ALIAS-03 (manual review pack)

- **Disposition:** `follow_up_later`
- **Rationale:** Criar apenas se matrix/report mostrar que decisões semânticas humanas não podem ser capturadas row-level.
- **Status para Phase 19:** A pesquisa revela que os 2 casos são suficientemente distintos para decisão individual na matriz; manual review pack provavelmente não é necessário.

## Dados Complementares

### Descritores Próximos no Seed v2

Para contexto de possíveis remapeamentos:

- **Para `ylang_ylang`:** Não há equivalente próximo curado. Os descritores florais curados são `jasmine`, `gardenia`, `geranium`, `rose`, `peony`, `tuberose`, `lily_of_the_valley`, `orange_blossom`. Ylang-ylang é um ingrediente olfativo distinto com perfil floral-tropical.
- **Para `petitgrain`:** O target existe como candidato compilado com freq 52 na `citrus_fresh`. Os descritores seed curados em `citrus_fresh` são `bergamot`, `grapefruit`, `lemon`, `sweet_orange`. Petitgrain é obtido das folhas de cítricos (citrus bigarade) e tem perfil verde-cítrico.

### Testes Existentes Relevantes

| Arquivo | Cobertura |
|---------|-----------|
| `alias_seed_v2.test.ts` | Validação de alias seed v2, exceção legada, target integrity com bypass |
| `normalization.test.ts` | Normalização de `ylang-ylang` → `ylang_ylang` (regra de separadores) |
| `normalization/index.test.ts` | Mapping `ylang-ylang` → `ylang_ylang` |
| `normalization/punctuation.test.ts` | Remoção de pontuação em `ylang_ylang` |

---

*Research document: Phase 19 — Taxonomy v2.1 Curation Planning*
*Generated: 2026-05-26 (read-only, non-authorizing)*
