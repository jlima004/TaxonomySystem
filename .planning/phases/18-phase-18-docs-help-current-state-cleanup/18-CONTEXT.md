# Phase 18: Docs/Help Current-State Cleanup - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Revisar e corrigir apenas documentação/ajuda que descreve o estado atual do projeto, garantindo alinhamento com v1.0.0, v2 default, safety guard implementado e wrapper npm disponível.

</domain>

<decisions>
## Implementation Decisions

### Scope boundaries
- **D-01:** A Phase 18 será estritamente limitada a docs/help current-state cleanup.
- **D-02:** Apenas documentação que descreve o estado atual pode ser corrigida (ex: README principal, documentação de uso, instruções de execução local, etc.).
- **D-03:** Documentação histórica correta (como closures de fases anteriores, ADRs antigas) deve ser totalmente preservada e não alterada.
- **D-04:** O escopo inclui a revisão do README, docs de uso e instruções de uso do safety guard e seu wrapper (`npm run safety:guard`).
- **D-05:** O escopo exclui explicitamente qualquer tipo de curadoria de dados, Graphify lifecycle, hooks, CI, artifacts oficiais de dados/taxonomia e mudanças em scripts do `package.json`.
- **D-06:** Qualquer modificação realizada nesta fase deve ser estritamente documental e não-mutante em relação a dados e códigos protegidos.

### the agent's Discretion
- A formatação textual e o estilo explicativo dos documentos atualizados.
- A reestruturação de trechos explicativos no `README.md` principal para tornar o fluxo de uso da taxonomia v2 (e execução do safety guard) mais compreensível.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Base & Context
- `.planning/future/POST-V1-RELEASE-BACKLOG.md` — Backlog de infraestrutura e curadoria pós-v1
- `.planning/releases/v1.0.0-CLOSURE.md` — Documento de fechamento do Milestone v1.0.0
- `src/package.json` — Manifest do pacote contendo o wrapper `safety:guard`

### Safety Guard Context
- `.planning/phases/16-permanent-safety-guard-implementation/16-CLOSURE.md` — Fechamento da Fase 16 (implementação do safety guard)
- `.planning/phases/17-safety-guard-usability-wrapper/17-CLOSURE.md` — Fechamento da Fase 17 (wrapper do safety guard)
- `scripts/check-safety-guards.sh` — Script do safety guard local

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/check-safety-guards.sh`: Script executável para checar guards de segurança.
- `src/package.json`: Contém o script `safety:guard` mapeado para o wrapper npm.

### Established Patterns
- As documentações devem usar referências relativas corretas e seguir as diretrizes do GSD.

### Integration Points
- `README.md` na raiz do projeto é o principal ponto de documentação que deve ser atualizado para referenciar o estado atual (v2 default e `npm run safety:guard`).

</code_context>

<deferred>
## Deferred Ideas

- Nova rodada de curadoria ou expansão de taxonomia (Phase 19+).
- Graphify lifecycle cleanup/regeneration.
- Integração de Git hooks ou CI para o safety guard.

</deferred>

---

*Phase: 18-phase-18-docs-help-current-state-cleanup*
*Context gathered: 2026-05-26*
