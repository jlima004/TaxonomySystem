# Plan 36-01 Summary: Substring Conflict Stopword Policy Definition

## Execution Summary

O plano **36-01: Substring Conflict Stopword Policy Definition** foi executado com sucesso. Trata-se de uma fase de design de política (`policy_design`) sem mutação de código, dados de taxonomia ou artefatos compilados. Todos os artefatos definidos como must-haves e critérios de aceitação foram criados e validados.

---

## Tasks Status

### Task 1: Create 36-PREFLIGHT.md (✅ PASS)
- **Ação:** Criação do documento preflight estabelecendo os limites rígidos do escopo da fase.
- **Entregável:** [.planning/phases/36-noise-stopword-policy/36-PREFLIGHT.md](file:///.planning/phases/36-noise-stopword-policy/36-PREFLIGHT.md)
- **Status:** Concluído. O escopo restringe qualquer alteração de código ou taxonomia nesta fase, exigindo apenas o design da política.

### Task 2: Create 36-CONTEXT.md with complete analysis (✅ PASS)
- **Ação:** Análise detalhada do mecanismo de conflito por substring (`seed_profile.ts:175`), separação do mecanismo de downweight existente (`semantic_noise.v1.json`) e classificação dos 13 tokens do Grupo A.
- **Entregável:** [.planning/phases/36-noise-stopword-policy/36-CONTEXT.md](file:///.planning/phases/36-noise-stopword-policy/36-CONTEXT.md)
- **Status:** Concluído. Os 13 tokens foram listados e divididos em Categoria 1 (Safe Noise), Categoria 2 (Moderate Noise) e Categoria 3 (Caution).

### Task 3: Create 36-POLICY-DRAFT.md (✅ PASS)
- **Ação:** Redação da política formal com critérios cumulativos de inclusão, formato JSON da nova configuração `conflict_stopwords.v1.json`, guardrails de implementação técnica para fases futuras e mitigação de riscos.
- **Entregável:** [.planning/phases/36-noise-stopword-policy/36-POLICY-DRAFT.md](file:///.planning/phases/36-noise-stopword-policy/36-POLICY-DRAFT.md)
- **Status:** Concluído. O ROI projetado é a eliminação de 14 dos 31 conflitos ativos na review queue (redução de 45%).

### Task 4: Create 36-DISCUSSION-LOG.md (✅ PASS)
- **Ação:** Registro do log de discussões técnicas sobre o mecanismo, critérios aplicados e o debate específico sobre tokens limítrofes (`orange`, `apple`, `pine`).
- **Entregável:** [.planning/phases/36-noise-stopword-policy/36-DISCUSSION-LOG.md](file:///.planning/phases/36-noise-stopword-policy/36-DISCUSSION-LOG.md)
- **Status:** Concluído.

### Task 5: Verify all deliverables and mutation audit (✅ PASS)
- **Ação:** Verificação de auditoria de mutação.
- **Resultados:**
  - `data/taxonomy/*`: zero changes (pass)
  - `data/compiled/*`: zero changes (pass)
  - `data/inference/*`: zero changes (pass)
  - `src/**/*.ts`: zero changes (pass)
  - `graphify-out/*`: zero changes (pass)
  - Sem execuções de compilação ou testes no ambiente ativo.

---

## Key Deliverables & Decisions

1. **Escopo Focado em Conflitos:** A política atua de forma cirúrgica na supressão de `seed_corpus_conflict` quando gerados por substring matching incidental, sem afetar scoring, taxonomia ou aliases.
2. **Formato Declarativo Independente:** Definição do formato de `data/inference/conflict_stopwords.v1.json` contendo metadados detalhados de rationale, aprovação e controle de revisão por token.
3. **Tratamento de Tokens Caution (`orange`, `apple`, `pine`):** Incluídos condicionalmente com a propriedade `"requires_review": true`, de forma a disparar nova avaliação se houver proposta futura de promoção destes unigramas.
