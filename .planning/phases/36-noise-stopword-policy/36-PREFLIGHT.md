# Phase 36 — Preflight: Formal Noise/Stopword Policy for Substring Conflict Matching

**Phase:** 36 — Formal Noise/Stopword Policy for Substring Conflict Matching
**Execution Type:** planning_first / policy_design
**Baseline:** Post-v2.5.0 / Phase 35 complete
**Date:** 2026-05-28

## Scope Boundary

### IN SCOPE
- Definir política formal de noise/stopword para o escopo de **substring conflict matching** (seed_corpus_conflict)
- Classificar os 13 tokens do Grupo A com critérios explícitos
- Definir formato de configuração para a noise/stopword list contextual
- Estabelecer guardrails e critérios de aplicação
- Documentar design de implementação para fase futura (se necessário)

### OUT OF SCOPE — HARD BOUNDARIES
- ❌ NÃO aplicar mutações em `data/taxonomy/*`
- ❌ NÃO aplicar mutações em `data/compiled/*` (v1 ou v2)
- ❌ NÃO aplicar mutações em `data/inference/semantic_noise.v1.json`
- ❌ NÃO alterar `src/inference/seed_profile.ts` ou qualquer código-fonte
- ❌ NÃO alterar `src/cli/parse_args.ts`
- ❌ NÃO executar compilação, build ou testes
- ❌ NÃO alterar `graphify-out/*`
- ❌ NÃO tratar tokens do Grupo B (ficam para microcuradoria posterior)
- ❌ NÃO fazer expurgo global de tokens

## Guardrails

1. A stopword/noise policy NÃO é um expurgo global
2. Tokens como `wood`, `fruit`, `sweet`, `raw`, `black`, `apple`, `pine` podem ter valor semântico legítimo fora do escopo de substring conflict matching
3. Nenhum token deve ser removido da base, da taxonomia ou dos descritores apenas por estar no Grupo A
4. A política deve operar como **filtro/aceitação contextual** para falsos positivos de conflito, não como deleção de conhecimento
5. Casos do Grupo B devem permanecer fora do tratamento sistêmico

## Mutation Audit Checklist
- [ ] `data/taxonomy/*`: zero changes
- [ ] `data/compiled/*`: zero changes
- [ ] `data/inference/*`: zero changes
- [ ] `src/**/*.ts`: zero changes
- [ ] `graphify-out/*`: zero changes
- [ ] Build/compile: not executed
