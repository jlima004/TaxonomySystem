# Phase 39: Taxonomy v2.6 Stabilization & Closure - Plan

## Objective
Validar, publicar e documentar o fechamento dos artefatos v2.6 após a microcuradoria da Phase 38. Não deve executar nova curadoria semântica; o foco é estrito na estabilização, validação, publicação e documentação dos resultados consolidados da v2.6.

## Sequence

### Wave 1 — Final Validation
- Rodar compile final da taxonomia.
- Validar invariantes da taxonomia (não pode haver violações).
- Confirmar aliases compilados.
- Confirmar `conflict_stopwords` final.
- Confirmar `review_queue` final com exatamente 283 total, 275 `low_support` e 8 `seed_corpus_conflict`.

### Wave 2 — v2.6 Closure/Rebaseline Report
- Gerar relatório v2.6 (`39-CLOSURE.md` ou `39-SUMMARY.md`) contendo as pre/post metrics da Phase 38.
- Explicar o delta de -3 `low_support` (de 278 para 275) como efeito colateral intencional da normalização de aliases durante a microcuradoria.
- Listar explicitamente os 8 conflitos restantes como deferidos (`manual_review`).
- Confirmar que não houve nova curadoria semântica ou alteração de decisões na Phase 39.

### Wave 3 — Publication Readiness
- Preparar publicação/tag se exigido pelo fluxo GSD.
- Atualizar `STATE.md`, `ROADMAP.md` e `PROJECT.md` conforme as exigências do fluxo.

## Acceptance Criteria
- **Phase 39 must not change semantic taxonomy decisions; it only validates, publishes, and documents the v2.6 baseline.**
- O comando de build (`npm run compile` ou equivalente) deve passar limpo.
- As contagens de métricas no relatório devem corresponder aos resultados de validação (283 total, 275 low_support, 8 conflicts).
- Nenhum arquivo de dados semânticos (`taxonomy.yaml`, `aliases.yaml`, etc) é alterado nesta fase.
