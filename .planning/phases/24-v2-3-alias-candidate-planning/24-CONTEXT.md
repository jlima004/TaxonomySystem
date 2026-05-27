# Phase 24: v2.3 Alias Candidate Planning - Context

**Gathered:** 2026-05-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Planning-only investigation of `cedar → cedarwood` as the primary alias candidate for v2.3. The phase produces research documents and a formal alias plan (RESEARCH.md, PATTERNS.md, VALIDATION.md, PLAN.md) that demonstrate semantic equivalence, define allowlist + approval requirements, and specify the alias mutation contract — without executing any data mutation, compile, or artifact publication.

**In scope:**
- Read-only investigation of `cedar` corpus evidence (frequency, context, co-occurrence)
- Semantic equivalence analysis: is `cedar` a shortened form of `cedarwood` or a semantically distinct descriptor?
- Alias integrity check design: what invariants must hold after the alias mutation?
- Formal plan for `descriptor_aliases.seed.json` mutation (`cedar → cedarwood`)
- Approval gate specification and allowlist definition

**Out of scope:**
- Any mutation of `data/taxonomy/taxonomy-seed.v2.json`
- Any mutation of `data/taxonomy/descriptor_aliases.seed.json`
- Any mutation of `data/compiled/v1/*` or `data/compiled/v2/*`
- Any mutation of `data/inference/*`
- Any mutation of `src/cli/parse_args.ts`
- Compile or official artifact publication (gated until Phase 25+)
- Investigation of `clover`, `ambergri`, or any other Phase 22 deferred candidates
- Adding `cedar` as a seed descriptor (add_target disposition)

</domain>

<decisions>
## Implementation Decisions

### Escopo de Candidatos

- **CEDAR24-D-01:** Escopo restrito a `cedar → cedarwood` apenas — o candidato mais forte da Phase 22 (corpus_count 83, HIGH evidence, target seed existente em `woody/woody_dry`).
- **CEDAR24-D-02 (de GR-01):** `clover` e `ambergri` ficam fora do escopo da Phase 24. Podem ser reavaliados em fases posteriores se evidência adicional surgir.

### Natureza da Curadoria

- **CEDAR24-D-03 (CEDAR24-D-01 original):** Tratar `cedar` como alias candidate para `cedarwood`, não como add_target inicial. A hipótese é que `cedar` é uma forma curta normalizada de `cedarwood` (não um descritor olfativo distinto).
- **CEDAR24-D-04 (CEDAR24-D-02 original):** A ação planejada é uma alias mutation: adicionar `"cedar": "cedarwood"` em `descriptor_aliases.seed.json`.
- **CEDAR24-D-05 (CEDAR24-D-03 original):** Não adicionar `cedar` como seed descriptor separado sem evidência forte de que o corpus usa `cedar` como nota distinta de `cedarwood`. A pesquisa deve provar equivalência antes de qualquer execução.
- **CEDAR24-D-06 (CEDAR24-D-04 original):** A execução futura exige prova de equivalência semântica, alias integrity check, allowlist e approval persistido.

### Formato de Execução

- **CEDAR24-D-07:** Formato planning-only — mesma estrutura da Phase 22. Nenhuma mutação de dados, compilação ou publicação de artefatos é autorizada nesta fase.

### Decisões Herdadas das Fases Anteriores

- Alias candidates são evidência fraca; canonical IDs não são alterados sem aprovação explícita e persistida.
- `descriptor_aliases.seed.json` é o ponto de entrada correto para aliases curados (canonicalização pré-análise).
- Padrão de execução microcuration requer: seed/alias-only mutation + approval persistida + invariantes de validação (mínimo 5 invariantes verificados).
- `ylang ylang → ylang_ylang` permanece `accepted_exception_interim` — não é escopo desta fase.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Decisões da Phase 22 (origem dos candidatos)

- `.planning/phases/22-review-queue-conflict-triage-v2-2/22-01-PLAN.md` — Decision matrix completa; seção `alias_candidate (2 items)` define `cedar → cedarwood` como candidato forte e `clover → clove` como debatível; seção LOW Risk / cedarwood anchor
- `.planning/phases/22-review-queue-conflict-triage-v2-2/22-RESEARCH.md` — Inventário completo de conflitos e análise semântica original

### Contexto e Closure da Phase 23 (baseline v2.2)

- `.planning/phases/23-v2-2-microcuration-candidate-selection/23-CLOSURE.md` — Estado final pós-lemon_peel; seeds em `citrus_fresh` = 6; `peel` gerou novo conflito esperado
- `.planning/phases/23-v2-2-microcuration-candidate-selection/23-01-PLAN.md` — Padrão de execução de microcuradoria (invariantes, allowlist, approval gate)

### Padrão de Alias Curado (precedente)

- `.planning/phases/19-taxonomy-v2-1-curation-planning/19-01-PLAN.md` — Análise original de aliases; estabelece padrão de absent target vs. alias candidate
- `.planning/phases/20-alias-target-microcuration-execution/20-FINAL-APPROVAL.md` — Padrão de approval persistido
- `.planning/phases/20-alias-target-microcuration-execution/20-01-PLAN.md` — Padrão de execução (rollback, invariantes, gate)

### Arquivos de Dados (somente leitura nesta fase)

- `data/taxonomy/descriptor_aliases.seed.json` — Arquivo alvo da alias mutation futura; somente leitura agora
- `data/taxonomy/taxonomy-seed.v2.json` — Confirmar que `cedarwood` existe em `woody/woody_dry` antes de planejar o alias
- `data/compiled/v2/similarity_matrix.json` — Evidência de conflitos/review_queue para `cedar`

### Guardrails

- `.planning/STATE.md` §Decisions — Decisões acumuladas de todas as fases, incluindo políticas de alias
- `scripts/check-safety-guards.sh` — Guard script a ser consultado na validação

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `data/taxonomy/descriptor_aliases.seed.json` — arquivo curado de aliases; formato `{ "source": "target" }`; somente leitura nesta fase, alvo de mutação em fase posterior
- `data/taxonomy/taxonomy-seed.v2.json` — confirmar existência de `cedarwood` em `woody/woody_dry` (pre-requisito para alias)
- `scripts/validate_phase23.py` — padrão de script de validação de invariantes; servirá como referência para o script de validação da Phase 25

### Established Patterns

- **Alias mutation pattern:** adicionar entry `"cedar": "cedarwood"` em `descriptor_aliases.seed.json`; target deve existir no seed antes da mutation
- **Invariant set:** mínimo 5 invariantes verificados (target é seed, source removido do review_queue, seeds pré-existentes intactos, novos conflitos ≤ threshold)
- **Approval gate:** `24-FINAL-APPROVAL.md` persistido antes de qualquer execução real
- **Allowlist guard:** `scripts/check-safety-guards.sh` deve retornar PROTECTED_DIFF esperado para `descriptor_aliases.seed.json` após mutation autorizada

### Integration Points

- `descriptor_aliases.seed.json` → compilador TypeScript (`src/compiler/`) → `descriptor_aliases.json` compilado
- Alias mutation afeta: canonicalização pré-análise, review_queue (elimina conflito `cedar`), e possivelmente grafo de similaridade
- `cedarwood` já é seed em `woody/woody_dry` — é o target canônico; alias apenas mapeia forma curta para o canonical ID

</code_context>

<specifics>
## Specific Ideas

- A decisão CEDAR24-D-06 exige explicitamente: "prova de equivalência semântica" antes de execução. A RESEARCH.md deve incluir análise de co-ocorrência e contexto de uso de `cedar` no corpus (está sendo usado como `cedarwood` ou como nota distinta?).
- Padrão de invariantes da Phase 23 é o modelo de referência — adaptar para alias mutation (ao invés de add_target).
- O novo conflito esperado após alias mutation: `cedar` desaparece do review_queue porque passa a ser canonicalizado para `cedarwood`.

</specifics>

<deferred>
## Deferred Ideas

- `clover → clove`: alias candidate MEDIUM do Phase 22. Deferido — investigação semântica (misspelling vs. descritor distinto) exige pesquisa separada. Candidato para Phase 26+.
- `ambergri → ambergris`: valid_variant MEDIUM do Phase 22, anotado como "possível alias candidate v2.3+". Deferido — suporte moderado mas não urgente. Candidato para Phase 26+.
- `cedar` como `add_target`: descartado como opção inicial (CEDAR24-D-05). Pode ser reavaliado se a pesquisa revelar que o corpus usa `cedar` como nota distinta de `cedarwood`.
- Compilação e publicação oficial v2.3: gated até Phase 25+, após execução real ser aprovada e validada.

</deferred>

---

*Phase: 24-v2-3-alias-candidate-planning*
*Context gathered: 2026-05-27*
