Você vai iniciar a Phase 09 do projeto TaxonomySystem.

# Phase 09: Taxonomy Seed v2 Expansion Round 2

Objetivo:
Registrar formalmente e iniciar context gathering/discussão para uma segunda rodada de expansão curada do `taxonomy-seed.v2.json`.

Contexto:
A Phase 8 foi concluída e aprovada.

Estado pós-Phase 8:
- `taxonomy-seed.v2.json` existe como candidate seed.
- v2 não é default.
- `taxonomy-seed.v1.json` foi preservado.
- `data/compiled/v1/` foi preservado.
- `src/cli/parse_args.ts` continua apontando defaults para v1.
- `08-VALIDATION.md` está com `nyquist_compliant: true` e `wave_0_complete: true`.
- `v1-v2-comparison.md` existe e documenta:
  - hard failures: none
  - soft warnings: alias quality, graph coverage, sparse v2 expansion
- Phase 8 adicionou apenas:
  - family: `gourmand`
  - subfamily: `vanilla`
  - descriptor: `vanilla`

Resultado Phase 8:
- V1 baseline:
  - 3 families
  - 6 subfamilies
  - 21 seed descriptors
- V2 candidate:
  - 4 families
  - 7 subfamilies
  - 22 seed descriptors
- Review queue reduziu de 427 para 403.
- Graph edges permaneceram 6.
- `vanilla` não tem relation/accord aprovado ainda, e isso foi aceito como soft warning.
- `ylang ylang -> ylang_ylang` segue como alias legado com target ausente no seed mínimo, também aceito como soft warning.

Objetivo da Phase 09:
Fazer uma segunda rodada de expansão curada do seed v2, adicionando mais families/subfamilies/descriptors aprovados manualmente antes de qualquer promoção do v2 para default.

Importante:
Phase 09 NÃO deve promover v2 para default.
Phase 09 NÃO deve editar `taxonomy-seed.v1.json`.
Phase 09 NÃO deve sobrescrever `data/compiled/v1`.
Phase 09 NÃO deve promover corpus candidates automaticamente.
Phase 09 NÃO deve alterar aliases/relations/accords sem approval/rationale/evidence no workbook.

---

# Tarefa 1 — Registrar Phase 09 no GSD

Atualize os arquivos de tracking/planejamento para reconhecer formalmente a nova fase.

Arquivos esperados a revisar/atualizar:
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`, se necessário

Nome sugerido:
`Phase 09: Taxonomy Seed v2 Expansion Round 2`

Slug sugerido:
`09-taxonomy-seed-v2-expansion-round-2`

Status inicial:
`context_gathering`
`not_ready_for_execution`

Não criar planos executáveis ainda.
Não implementar código.
Não alterar seed/data files.
Não alterar artifacts compilados.

---

# Tarefa 2 — Criar estrutura inicial da Phase 09

Criar diretório:

`.planning/phases/09-taxonomy-seed-v2-expansion-round-2/`

Criar inicialmente:

- `09-DISCUSSION-LOG.md`
- `09-PREFLIGHT.md`

Criar `09-CONTEXT.md` somente depois da discussão inicial capturar decisões suficientes.

Não criar ainda:
- `09-01-PLAN.md`
- `09-RESEARCH.md`
- `09-PATTERNS.md`
- `09-VALIDATION.md`

até que a discussão/context gathering esteja concluída.

---

# Tarefa 3 — Iniciar discussão da Phase 09

Faça a primeira pergunta:

"Which areas do you want to discuss for Phase 09: Taxonomy Seed v2 Expansion Round 2? Select all that apply."

Opções:

1. All areas
Recommended: discutir scope, candidate prioritization, approval workflow, alias cleanup, relation/accord expansion, validation gates, and promotion readiness boundaries.

2. Expansion scope
Quais groups/subfamilies entram na segunda rodada do seed v2.

3. Candidate prioritization
Como priorizar candidates a partir do `candidate-review.md` e `v1-v2-comparison.md`.

4. Manual approvals
Como aprovar mais entries no workbook sem auto-promotion.

5. Alias cleanup
Como tratar aliases legados, especialmente targets ausentes como `ylang_ylang`.

6. Relation/accord expansion
Como adicionar relations/accords para novas subfamilies, especialmente `vanilla`.

7. Validation gates
Como comparar v1 vs v2-expanded e medir melhoria.

8. Promotion readiness
Quais critérios futuros seriam necessários para tornar v2 default, sem fazer isso agora.

9. Type your own answer

Recomendação inicial:
Selecionar 1. All areas.

---

# Direção recomendada para Phase 09

A Phase 09 deve priorizar expansão curada nos grupos ainda pendentes da Phase 8:

## Prioridade 1 — Green

Subfamilies candidatas:
- `herbal_green`
- `leafy_green`

Candidates/evidence possíveis:
- `basil`
- `wintergreen`
- `tea_green_tea`
- `tomato_leaf`
- `minty`, se escopo green/fresh permitir

## Prioridade 2 — Fruity

Subfamilies candidatas:
- `tropical_fruit`
- `orchard_fruit`
- `red_fruit`

Candidates/evidence possíveis:
- `pineapple`
- `banana`
- `melon`
- `strawberry`
- `blackberry`

## Prioridade 3 — Spicy

Subfamilies candidatas:
- `warm_spice`
- `fresh_spice`

Candidates/evidence possíveis:
- `cinnamon`
- `clove`
- `anise`
- `anisic`
- `allspice`
- `warm`

## Prioridade 4 — Amber/resinous

Subfamilies candidatas:
- `balsamic_resin`
- `amber`

Candidates/evidence possíveis:
- `resinous`
- `labdanum`
- `benzoin`
- `amber`
- `balsamic`

## Prioridade 5 — Animalic

Subfamilies candidatas:
- `musky`
- `leathery`

Candidates/evidence possíveis:
- `musk`
- `leathery`
- `ambrette`
- `civet`
- `animal`

---

# Decisões que a Phase 09 deve capturar

Use IDs de decisão:

`R2-D-01`, `R2-D-02`, `R2-D-03`, ...

Capturar decisões sobre:

## Expansion scope

- Quantos groups entram nesta rodada.
- Se a Phase 09 deve adicionar todos os grupos pendentes ou apenas 2–3 grupos.
- Se `vanilla` deve receber relation/accord agora.
- Se aliases legados ausentes entram no escopo ou ficam deferidos.

## Candidate prioritization

- Priorizar por review_queue reduction.
- Priorizar por generic pressure em `floral_rose`.
- Priorizar por high-frequency candidates.
- Priorizar por subfamilies planejadas na Phase 8.
- Priorizar por graph coverage.

## Manual approval workflow

- Cada nova entrada precisa continuar com:
  - `manual_approval: approved`
  - `primary_disposition: promote_to_seed`
  - family/subfamily/descriptor concreto
  - rationale
  - evidence
- Aprovação no chat não basta; precisa ser persistida no workbook.

## Alias cleanup

- `ylang ylang -> ylang_ylang` deve ser:
  - corrigido agora?
  - deferido?
  - exigir canonical seed entry?
  - exigir approval específico?
- Nenhum alias deve ser removido automaticamente.

## Relation/accord expansion

- Cada nova subfamily deve ter:
  - relation/accord manual aprovado, ou
  - explicit gap rationale.
- Scores devem ser manuais em [0,1].
- Missing relation/accord continua neutral/undefined.

## Validation gates

- Comparar v1 vs v2-expanded.
- Medir:
  - family_count
  - subfamily_count
  - seed descriptors
  - corpus descriptors
  - review_queue count
  - graph edges
  - graph density
  - generic pressure em `floral_rose`
  - zero-frequency seeds
  - alias target quality
  - determinism/schema

## Promotion readiness

Não promover v2 nesta fase.
Apenas discutir critérios futuros para promoção:
- cobertura mínima de groups
- graph coverage mínima
- aliases sem targets ausentes
- redução relevante da review_queue
- redução de generic pressure
- hard failures zero
- soft warnings aceitáveis

---

# Resultado esperado desta interação

A IA deve:

1. Registrar formalmente Phase 09 no GSD.
2. Criar estrutura inicial de context gathering.
3. Não criar planos executáveis ainda.
4. Não alterar código.
5. Não alterar seed/data/artifact files.
6. Iniciar discussão com a pergunta de seleção de áreas.
7. Usar Phase 8 como baseline.
8. Manter v2 como candidate seed, não default.

Saída esperada:
- Liste arquivos de tracking atualizados.
- Confirme que Phase 09 foi registrada apenas para context gathering.
- Confirme que nenhuma implementação foi feita.
- Faça a primeira pergunta:
  "Which areas do you want to discuss for Phase 09: Taxonomy Seed v2 Expansion Round 2?"