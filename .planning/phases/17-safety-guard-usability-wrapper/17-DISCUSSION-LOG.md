# Phase 17 — Discussion Log: Safety Guard Usability Wrapper

## 2026-05-26: Escolha de Priorização de Escopo

### Contexto
O usuário solicitou o início da Phase 17 pós-v1.0 com o objetivo de tornar o script `scripts/check-safety-guards.sh` mais fácil de executar localmente, mantendo restrições de não alteração de hooks, CI, dados taxonômicos, artefatos ou Graphify. Foi apresentada uma lista de 5 opções de priorização:
1. package script wrapper para o guard;
2. docs/help cleanup;
3. CI check opcional;
4. Graphify lifecycle policy;
5. v2.1 curation planning.

### Decisão
- **Decisão:** Priorizar a Opção 1: **package script wrapper para o guard**.
- **Fundamentação:**
  - O objetivo explícito da fase é "transformar o script em uma ferramenta mais fácil de executar". Um script wrapper no `src/package.json` (como `npm run guard`) atende a isso perfeitamente de forma direta e sem fricção.
  - As opções 2, 4 e 5 são de escopo documental ou de dados que não afetam a facilidade direta de execução do guarda de segurança.
  - A opção 3 (CI check) adicionaria complexidade externa desnecessária antes do atalho local estar consolidado.
  - As opções 2, 3, 4 e 5 serão mantidas como "Deferred Ideas" no arquivo de contexto para possíveis iterações subsequentes.
- **Impacto:**
  - O arquivo `src/package.json` será a única alteração de código/configuração prevista para adicionar o atalho do script.
  - Nenhum hook local do git será alterado nesta fase.
  - O status inicial está configurado como `context_gathering` e `not_ready_for_execution` até que o plano de implementação seja aprovado pelo usuário.

## 2026-05-26: Registro de Especificação do Wrapper

### Contexto
O usuário forneceu instruções explícitas de escopo e restrições antes do planejamento da Phase 17.

### Decisão
- **Nome do script de package:** `safety:guard`
- **Comando candidato:** `bash ../scripts/check-safety-guards.sh`
- **Preservação de exit code:** O wrapper deve manter/repassar o exit code exato do script original.
- **Restrição de não mutação:** Não alterar hooks, CI, Graphify, data/taxonomy, data/inference, data/compiled/v1, data/compiled/v2 ou src/cli/parse_args.ts.
