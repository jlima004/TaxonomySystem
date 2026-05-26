# Phase 17: safety-guard-usability-wrapper - Context

**Gathered:** 2026-05-26
**Status:** Context Gathering / Not Ready for Execution

## Phase Boundary

O objetivo desta fase é transformar o script `scripts/check-safety-guards.sh` em uma ferramenta mais fácil de executar no dia a dia do desenvolvimento local. O foco principal é a criação de um package script wrapper (ex: `npm run guard`) sem alterar hooks de git automáticos, CI, dados taxonômicos, artefatos oficiais ou o Graphify.

## Initial Implementation Decisions

### Foco e Prioridade
- **wrapper17-D-01:** A prioridade inicial selecionada é a implementação do **package script wrapper para o guard** no `src/package.json`.
- **wrapper17-D-02:** Não serão alterados Git hooks locais ou automáticos (como pre-commit hooks mutantes) nesta fase.
- **wrapper17-D-03:** Não serão alterados scripts ou pipelines de Integração Contínua (CI) neste momento.
- **wrapper17-D-04:** As restrições rígidas pós-v1.0 permanecem em vigor: não alterar `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2` e `src/cli/parse_args.ts`.
- **wrapper17-D-05:** Nenhuma ação de limpeza, reversão, regeneração ou commit será realizada em `graphify-out/*`.

### Escopo de Wrapper
- **wrapper17-D-06:** O wrapper deve chamar o script `scripts/check-safety-guards.sh` de forma limpa a partir de `src/package.json`.
- **wrapper17-D-07:** O comando deve retornar o mesmo código de saída (exit code) do script original para preservar a integridade das validações.
- **wrapper17-D-08:** O nome do package script deve ser `safety:guard`.
- **wrapper17-D-09:** O comando candidato a ser mapeado é `bash ../scripts/check-safety-guards.sh`.
- **wrapper17-D-10:** Não alterar hooks, CI, Graphify, data/taxonomy, data/inference, data/compiled/v1, data/compiled/v2 ou src/cli/parse_args.ts.

## Canonical References

### Phase 16 closure and script
- `scripts/check-safety-guards.sh` — O script original implementado na fase 16.
- `.planning/phases/16-permanent-safety-guard-implementation/16-CLOSURE.md` — Relatório de fechamento da fase anterior.

### Project tracking
- `.planning/ROADMAP.md` — Roadmap global com o escopo da fase.
- `.planning/STATE.md` — Status do projeto.

## Deferred Ideas
- Hook `pre-commit` opcional ou automatizado.
- Verificação em CI opcional.
- Limpeza e revisão de documentação de ajuda (`docs/help cleanup`).
- Ciclo de vida do Graphify (`graphify-out/*` policy).
- Planejamento de curadoria para a versão v2.1.

---

*Phase: 17-safety-guard-usability-wrapper*
*Context gathered: 2026-05-26*
