# Phase 19 — Discussion Log: Taxonomy v2.1 Curation Planning

## 2026-05-26: Escolha da Frente de Curadoria Prioritária

### Contexto
O usuário solicitou o início da Phase 19: "Taxonomy v2.1 Curation Planning". O objetivo central é iniciar o ciclo de planejamento da curadoria v2.1 com base no backlog pós-v1.0, escolhendo uma frente de trabalho pequena, rastreável e altamente validável para um planejamento preciso. Foram avaliadas 5 opções de priorização de curadoria:
1. **Alias cleanup / absent targets** (Recomendada): focar em aliases cujo target está ausente na taxonomia.
2. **Review queue conflicts**: focar em conflitos do tipo `seed_corpus_conflict`.
3. **Descriptor promotion candidates**: selecionar candidatos do corpus para promoção formal.
4. **Relations/accords quality**: auditar e refinar relações/acordos existentes.
5. **Planning only**: limitar a Phase 19 estritamente ao planejamento abstrato geral de curadoria sem foco específico.

### Decisão
- **Decisão:** Priorizar a Opção 1: **Alias cleanup / absent targets**.
- **Fundamentação:**
  - Esta frente aborda problemas de integridade bem definidos e de escopo delimitado (como os casos históricos conhecidos de `ylang ylang -> ylang_ylang` e `petit grain -> petitgrain` mapeados na matriz de backlog da Phase 14).
  - É uma tarefa puramente estrutural e lógica, de fácil validação automatizada de integridade (os alvos devem existir ou ser definidos com regras claras de exceção), minimizando a ambiguidade curatorial antes de partirmos para modificações em larga escala.
  - As outras frentes (2, 3 e 4) envolvem alto risco curatorial ou julgamento semântico complexo que exigem um nível de maturidade e de ferramentas de visualização ainda não consolidados no planejamento v2.1.
- **Impacto no Planejamento:**
  - A pesquisa inicial da fase (`19-RESEARCH.md`) e os padrões de curadoria (`19-PATTERNS.md`) focarão exclusivamente nas regras de integridade de aliases e na validação de alvos ausentes.
  - A execução posterior (em uma fase dedicada à ação) será planejada especificamente para corrigir apenas os aliases ausentes mapeados e validados, mantendo todos os outros arquivos e dados taxonômicos protegidos.

### Restrições Rígidas
- Reitera-se a proibição estrita de mutação de qualquer dado de taxonomia (`data/taxonomy/*`), inferência (`data/inference/*`), compilação (`data/compiled/*`), segurança (`scripts/check-safety-guards.sh`), comandos CLI ou dependências/scripts de pacote (`src/package.json`) durante todo o processo de levantamento de contexto e planejamento.
- Nenhum commit, stage ou limpeza no diretório `graphify-out/*` será efetuado.
- Nenhuma rotina de compilação, typecheck ou testes será rodada no workspace atual enquanto a fase estiver com status `context_gathering`.
