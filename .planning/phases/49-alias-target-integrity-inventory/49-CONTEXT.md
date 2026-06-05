# Phase 49: Alias Target Integrity Inventory - Context

**Gathered:** 2026-06-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Auditar `descriptor_aliases.seed.json`, `descriptor_aliases.json` (compiled) e `taxonomy.json` (compiled) para produzir o documento `49-ALIAS-TARGET-INVENTORY.md` — inventário evidence-heavy, read-only, que lista todos os alias targets, separa os válidos dos dangling, classifica o(s) dangling por tipo de risco, e prova completude.

Zero mutation. Nenhuma decisão de remediação é tomada nesta fase.

</domain>

<decisions>
## Implementation Decisions

### D-01 — Estrutura do relatório de saída

O arquivo `49-ALIAS-TARGET-INVENTORY.md` deve conter as seguintes seções, nesta ordem:

1. **Sources Inspected** — listar os três arquivos auditados com caminho relativo completo
2. **Method** — descrever como o inventário foi produzido (leitura direta dos JSON, comparação de keys, lookup de descriptor IDs)
3. **Summary Counts** — tabela de contagem: seed aliases, compiled aliases, descriptor IDs, válidos, dangling
4. **Seed vs Compiled Alias Equivalence** — afirmar explicitamente se são idênticos ou divergem (incluir diff se divergirem)
5. **Valid Alias Targets Table** — tabela completa de aliases válidos: `alias → target`, status OK
6. **Dangling Alias Targets Table** — tabela de aliases cujo target não existe nos descriptor IDs compilados
7. **Near-match / Descriptor Context** — para cada dangling, listar variantes próximas presentes na taxonomia (ex.: `ylang` existe como corpus candidate, mas `ylang_ylang` não existe)
8. **Candidate Exception Classification** — classifica cada dangling sem aprovar remediação (ver D-02)
9. **Completeness Proof** — declaração numérica de que todos os aliases foram verificados
10. **Zero-Mutation Statement** — afirmação explícita de que nenhum arquivo foi modificado
11. **Handoff to Phase 50/51** — pointer para o gate automatizado (Phase 50) e remediação (Phase 51)

### D-02 — Critério de classificação de candidatos a exceção

Phase 49 classifica dangling targets em uma das três categorias, **sem aprovar nenhuma exceção**. Aprovação pertence às fases 50/51 após existir policy/gate formal.

| Categoria | Definição |
|-----------|-----------|
| `remediation_required` | O alias é semanticamente válido mas o target não existe → precisa de add_target ou correção no alias |
| `possible_exception_candidate` | O alias pode ser deliberadamente mapeado para um target ausente por razão conhecida (ex.: planejamento futuro) |
| `invalid_or_noise_candidate` | O alias e/ou target são ruídos sem valor semântico claro |

**Classificação de `ylang ylang → ylang_ylang`:** `remediation_required`
- O alias é semanticamente correto (ylang ylang é um ingrediente olfativo legítimo)
- O target `ylang_ylang` não existe em nenhuma fonte (seed v2, compiled taxonomy)
- `ylang` existe apenas como corpus candidate com `review_required: true` — não é equivalente ao target esperado `ylang_ylang`
- Não classificar como `possible_exception_candidate` sem evidência de intenção documentada

### D-03 — Escopo da busca por dangling

Fontes a auditar (exatamente estas três):
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/taxonomy.json`

Verificação narrow permitida:
- Confirmar se dangling targets aparecem em `data/taxonomy/taxonomy-seed.v2.json` ou no compiled taxonomy
- Confirmar se seed e compiled aliases são idênticos

**Fora de escopo:**
- Não expandir para low_support, conflict matrices, scoring, curation matrices, graphify
- Não auditar outros campos além de `aliases[alias] → target` vs `descriptor.id`

### D-04 — Prova de completude

O inventário deve provar completude com as seguintes asserções numéricas explícitas:

| Métrica | Valor esperado |
|---------|---------------|
| Seed aliases auditados | 18 |
| Compiled aliases auditados | 18 |
| Seed == Compiled | ✅ idênticos |
| Descriptor IDs compilados | 340 |
| Alias targets válidos | 17 |
| Alias targets dangling | 1 |
| Mutations aplicadas | 0 |

O relatório deve declarar: "Nenhuma decisão de remediação é tomada nesta fase."

### D-05 — Zero mutation absoluta

Nenhum arquivo de dados, seed ou compiled pode ser modificado durante a execução desta fase. O executor deve operar em modo somente-leitura sobre todos os arquivos de dados.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Fontes de dados auditadas

- `data/taxonomy/descriptor_aliases.seed.json` — 18 aliases, dict `{alias: target}`. Fonte seed, idêntica ao compiled.
- `data/compiled/v2/descriptor_aliases.json` — artifact compilado v2.8.0, schema_version 1. `aliases` é um dict com 18 entradas idênticas ao seed.
- `data/compiled/v2/taxonomy.json` — 340 descriptor IDs distribuídos em 10 families. Fonte de verdade dos IDs válidos.

### Contexto do ylang (near-match crítico)

- `ylang_ylang` (target do alias) **NÃO existe** em nenhuma fonte: não em `taxonomy-seed.v2.json`, não em `data/compiled/v2/taxonomy.json`
- `ylang` **EXISTE** em `data/compiled/v2/taxonomy.json` como: `source: "corpus"`, `status: "candidate"`, `frequency: 41`, `review_required: true` — corpus candidate, não curated
- O target esperado pelo alias (`ylang_ylang`) é semânticamente distinto de `ylang`

### Referências de planejamento

- `.planning/ROADMAP.md` — Fase 49 definida na linha 61; milestone v2.9 (Phases 49–51)
- `.planning/STATE.md` — FUT-03 registrado: "descriptor_aliases target integrity (ylang ylang → ylang_ylang)"
- Fases dependentes: Phase 50 (gate automatizado), Phase 51 (remediação)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- O executor pode usar Python puro para carregar e cruzar os JSONs — sem dependências externas além da stdlib. O padrão já foi estabelecido nas fases anteriores de curation.
- Os compiled JSONs têm estrutura estável (`families[].subfamilies[].descriptors[].id` para taxonomy; `aliases` dict direto para descriptor_aliases).

### Established Patterns
- **Zero mutation pattern:** fases de inventário (ex.: Phase 44) operam em modo read-only, sem commits de dados, apenas produzindo artifacts de relatório.
- **Evidence-heavy reporting:** fases de auditoria (ex.: Phase 46 Decision Matrix) incluem contagens explícitas, tabelas com status, e provas de completude antes de passar para execução.

### Integration Points
- O resultado `49-ALIAS-TARGET-INVENTORY.md` será lido pelo planner da Phase 50 para definir o gate de validação automatizado.
- A classificação `remediation_required` de `ylang ylang` alimenta diretamente a Phase 51 (remediação).

</code_context>

<specifics>
## Specific Ideas

- O usuário quer o relatório "evidence-heavy" — cada claim numérico deve ter um fundamento direto nos dados (não apenas afirmações).
- A seção "Near-match / Descriptor Context" deve mostrar explicitamente que `ylang` existe mas é distinto de `ylang_ylang`, para documentar por que não basta apontar para `ylang`.
- A seção "Handoff" deve ser concisa: um pointer simples para Phase 50 (gate) e Phase 51 (fix), sem antecipar decisões de design desses gates.

</specifics>

<deferred>
## Deferred Ideas

- **Busca ampla de dangling em outros arquivos seed** (ex.: taxonomy-seed.v2.json, low_support matrices) — fora do escopo desta fase. Phase 49 audita apenas aliases.
- **Aprovação de exceção para `ylang ylang → ylang_ylang`** — pertence à Phase 50/51 após existir gate formal.
- **Decisão de add_target vs. correção de alias** — pertence à Phase 51 (Legacy Alias Remediation).

None from prior phases — discussion stayed within phase scope.

</deferred>

---

*Phase: 49-Alias-Target-Integrity-Inventory*
*Context gathered: 2026-06-05*
