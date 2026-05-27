# Phase 27 Patterns

## 1. Padrão de Microcuradoria de Target (add_target)
A adição de um seed descriptor baseia-se nos princípios validados na Phase 20:
- O novo descriptor será adicionado apenas em `data/taxonomy/taxonomy-seed.v2.json`.
- Nenhuma outra família ou subfamília deve ser alterada.
- O campo será adicionado na array de descriptores (como string ou objeto, seguindo o padrão atual do arquivo, que usa array de strings no `taxonomy-seed.v2.json`).
- Nenhuma mutação ocorrerá em arquivos compilados (`data/compiled/v1/`, `data/compiled/v2/`) nesta fase.
- Não há manipulação do `descriptor_aliases.seed.json`.

## 2. Padrão de Rastreador de Aprovação
Como introduzido na Phase 20:
- Toda microcuradoria do v2 deve ser autorizada por um documento explícito de aprovação final: `27-FINAL-APPROVAL.md`.
- Os testes de segurança (especificamente `taxonomy_seed_v2.test.ts`) validarão se existe o approval file correspondente à fase de edição.

## 3. Padrão de Validação e Segurança
- O safety guard local (`check-safety-guards.sh`) identificará que `taxonomy-seed.v2.json` foi modificado.
- A fase conterá passos de pré-validação (`typecheck`, `test:all`) para garantir que o schema permanece válido.
- Compilação não será executada.
- Testes específicos (e.g. `27-target-validation`) serão rodados para confirmar que `ambergris` foi inserido na subfamília `amber`.
