---
status: planning_only
non_authorizing: true
phase: 24
slug: v2-3-alias-candidate-planning
created: 2026-05-27
protected_paths_touched: none
execution_readiness: not_ready_for_execution
---

# Phase 24 — Preflight: v2.3 Alias Candidate Planning

## Boundary Declaration

Esta fase é **planning-only** e **não executa nenhuma mutação de dados**. Não há autorização para:

- Alterar `data/taxonomy/descriptor_aliases.seed.json`
- Alterar `data/taxonomy/taxonomy-seed.v2.json`
- Alterar `data/compiled/v1/*`
- Alterar `data/compiled/v2/*`
- Alterar `data/inference/*`
- Alterar `src/cli/parse_args.ts`
- Executar compile oficial
- Publicar artefatos
- Rodar Graphify
- Executar curadoria de qualquer tipo

## Candidato Único Autorizado

**`cedar → cedarwood`** — alias candidate da Phase 22 (corpus_count 83, HIGH evidence).

- Target `cedarwood` já existe no seed v2 em `woody/woody_dry`.
- Mutação real do arquivo `descriptor_aliases.seed.json` está **diferida** para a fase de execução posterior (Phase 25+).
- Esta fase produz apenas: RESEARCH.md, PATTERNS.md, VALIDATION.md, PLAN.md.

## Candidatos Explicitamente Fora de Escopo

| Candidato | Motivo |
|---|---|
| `clover → clove` | Fora do escopo — Phase 26+ |
| `ambergri → ambergris` | Fora do escopo — Phase 26+ |
| qualquer outro item da Phase 22 | Fora do escopo |

## Artefatos Esperados

- [ ] `24-PREFLIGHT.md` (este documento)
- [ ] `24-CONTEXT.md` ✅ gerado
- [ ] `24-DISCUSSION-LOG.md` ✅ gerado
- [ ] `24-RESEARCH.md` — pesquisa de evidência semântica de `cedar`
- [ ] `24-PATTERNS.md` — padrões de alias mutation e invariantes
- [ ] `24-VALIDATION.md` — contrato de validação para a fase de execução futura
- [ ] `24-01-PLAN.md` — plano formal de alias planning

## Fase de Execução

A execução real (`cedar → cedarwood` mutation + compile + publicação v2.3) fica gated para **Phase 25+**, exigindo:
1. Aprovação persistida em `25-FINAL-APPROVAL.md`
2. Prova de equivalência semântica (da RESEARCH.md desta fase)
3. Allowlist explícita no script de safety guard
4. Validação de 5+ invariantes em `/tmp` antes de publicação oficial
