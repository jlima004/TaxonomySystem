# Phase 21 — Final Approval — Official v2.1 Artifact Publication

- **Approval ID**: `APPROVAL-21-02`
- **Artifact Version**: `2.1.0`
- **Generated At**: `2026-05-26T00:00:00.000Z`
- **Output Directory**: `data/compiled/v2`
- **Status**: `APPROVED`
- **Approved By**: User (Explicit approval on 2026-05-27)

---

## Statement of No New Curation

Como parte da governança estrita estabelecida para esta fase, declaramos que **nenhuma nova curadoria** ou alteração em dados brutos de sementes, aliases ou relações foi efetuada durante esta publicação oficial. A alteração reflete apenas a promoção e compilação final dos dados herdados da Fase 20 (incluindo `petitgrain` adicionado no seed v2).

---

## Allowlist of Modified Files

Esta publicação oficial e atualização de versão padrão estão autorizadas a modificar estritamente os seguintes arquivos:

- `.planning/phases/21-v2-1-compiled-artifact-publication-planning/21-FINAL-APPROVAL.md` (Este arquivo de aprovação)
- `data/compiled/v2/taxonomy.json` (Compilado oficial v2.1.0)
- `data/compiled/v2/descriptor_aliases.json` (Compilado oficial v2.1.0)
- `data/compiled/v2/similarity_matrix.json` (Compilado oficial v2.1.0)
- `src/cli/parse_args.ts` (Apenas a alteração de `DEFAULT_PATHS.version` para `"2.1.0"`)
- `src/tests/cli/parse_args.test.ts` (Ajuste de teste para a versão padrão `"2.1.0"`)
- `src/tests/curation/v1_v2_comparison.test.ts` (Ajuste de teste para a versão padrão `"2.1.0"`)
- `21-02-SUMMARY.md` e `21-VALIDATION.md` (Artefatos de fechamento de fase, se necessários)

Nenhum outro arquivo ou caminho protegido está autorizado a sofrer modificações.

---

## Rollback Plan

Caso ocorra qualquer erro de compilação ou falha em testes de integração durante a publicação:
1. Reverteremos a alteração em `src/cli/parse_args.ts` restaurando a versão original.
2. Reverteremos qualquer alteração nos arquivos de teste.
3. Descartaremos os arquivos JSON gerados em `data/compiled/v2` executando `git checkout -- data/compiled/v2`.
4. Atualizaremos este arquivo de aprovação para registrar a falha de publicação ou o removeremos se a fase for inteiramente adiada.
