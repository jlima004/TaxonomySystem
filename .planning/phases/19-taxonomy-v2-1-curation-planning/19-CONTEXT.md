# Phase 19: Taxonomy v2.1 Curation Planning - Context

**Gathered:** 2026-05-26
**Status:** Context Gathering / Not Ready for Execution

## Phase Boundary

O objetivo desta fase é iniciar o ciclo de planejamento de curadoria para a versão v2.1 a partir do backlog pós-v1.0. Para garantir controle e rastreabilidade, escolhemos uma frente pequena, restrita e altamente validável como prioridade para esta fase de planejamento. O foco selecionado é a limpeza de aliases com targets ausentes (**Alias cleanup / absent targets**).

Durante o levantamento de contexto e o planejamento, nenhuma alteração será efetuada em arquivos protegidos ou no banco de dados taxonômicos.

## Initial Implementation Decisions

### Foco e Prioridade
- **curation19-D-01:** A prioridade inicial selecionada é a curadoria de **Alias cleanup / absent targets**, especificamente analisando casos de integridade de aliases onde os alvos declarados estão ausentes (como o caso conhecido `ylang ylang -> ylang_ylang` e `petit grain -> petitgrain`).
- **curation19-D-02:** Esta fase é estritamente de **planejamento (Planning Only)**. Nenhuma curadoria prática de sementes, aliases, relações ou acordos será executada ou consolidada antes da aprovação final de um plano de execução detalhado e das fases de pesquisa e validação.
- **curation19-D-03:** As restrições de não-mutação pós-v1.0 permanecem ativas. Estão bloqueados contra alterações: `data/taxonomy/*`, `data/inference/*`, `data/compiled/v1/*`, `data/compiled/v2/*`, `src/cli/parse_args.ts`, `scripts/check-safety-guards.sh` e `src/package.json`.
- **curation19-D-04:** Nenhuma alteração, limpeza, regeneração, staging ou commit será feita no diretório `graphify-out/*`.
- **curation19-D-05:** Durante a etapa de `context_gathering`, não serão executadas operações de build, typecheck, smoke tests, testes automatizados gerais ou compilação de taxonomia, a fim de respeitar os limites de não-execução e não-modificação de estado.

## Canonical References

### Backlog & Triage
- `.planning/future/POST-V1-RELEASE-BACKLOG.md` — Backlog geral pós-v1.0.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md` — Matriz de priorização de pendências da taxonomia v2.1 elaborada na Phase 14.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md` — Triagem detalhada da review queue v2.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CLOSURE.md` — Fechamento da Phase 14 de triagem.

### Release & Safety Guards
- `.planning/releases/v1.0.0-CLOSURE.md` — Registro de fechamento e conformidade da release v1.0.0.
- `scripts/check-safety-guards.sh` — Script de proteção e barreiras de segurança não-mutantes.
- `src/package.json` — Arquivo de scripts do projeto com o wrapper `safety:guard`.

## Deferred Ideas
As seguintes frentes de curadoria v2.1 estão formalmente postergadas para fases futuras ou etapas de execução subsequentes:
- **Review queue conflicts:** Resolução de conflitos de sementes com o corpus (`seed_corpus_conflict`).
- **Descriptor promotion candidates:** Análise e promoção de descritores candidatos de baixa sustentação (`corpus_candidate_low_support`).
- **Relations/accords quality:** Ajustes e auditoria de qualidade nas relações e acordos (`curated_relations.v2.json` e `accord_map.v2.json`).
- **Curation Execution:** Execução prática das mutações e regeração de compilações.

---

*Phase: 19 — Taxonomy v2.1 Curation Planning*
*Context gathered: 2026-05-26*
