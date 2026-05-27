# Phase 31 Patterns

## 1. Padrão de Microcuradoria de Target (add_target)
A adição de um seed descriptor baseia-se nos princípios validados na Phase 20 e 27:
- O novo descriptor (`rosewood`) será adicionado apenas em `data/taxonomy/taxonomy-seed.v2.json`.
- A inserção ocorrerá na família `woody`, subfamília `woody_dry`.
- Nenhuma outra família ou subfamília deve ser alterada.
- O campo será adicionado na array de descriptores como string.
- Nenhuma mutação ocorrerá em arquivos compilados (`data/compiled/v1/`, `data/compiled/v2/`) nesta fase.
- Não há manipulação do `descriptor_aliases.seed.json` (resolução de aliases como `boi_de_rose` ficará para a fase 32).

## 2. Padrão de Rastreador de Aprovação
Como estabelecido nas microcuradorias anteriores:
- Toda microcuradoria do v2 deve ser autorizada por um documento explícito de aprovação final: `31-FINAL-APPROVAL.md`.
- Os testes de segurança (especificamente `taxonomy_seed_v2.test.ts`) validarão se existe o approval file correspondente à fase de edição.

## 3. Padrão de Validação e Segurança
- O safety guard local (`check-safety-guards.sh`) identificará que `taxonomy-seed.v2.json` foi modificado e acusará PROTECTED_DIFF.
- A fase conterá passos de pré-validação (`check:types`, `check:schema`, `test:all`) para garantir que o schema permanece válido.
- Compilação do dicionário ou publicação de artefatos **não será executada**.
- Execução do Graphify **não será rodada**.
