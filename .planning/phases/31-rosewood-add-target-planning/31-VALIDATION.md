# Phase 31 Validation

## Validation Gates

Esta fase de planejamento adota os seguintes gates restritos de validação:

### 1. Preflight Gate (Antes do add_target)
- Validar se `rosewood` NÃO existe em `taxonomy-seed.v2.json`.
- Validar se `taxonomy-seed.v2.json` e todos os arquivos compilados estão limpos no repositório.

### 2. Approval Gate
- Confirmar que `31-FINAL-APPROVAL.md` existe e documenta explicitamente a permissão para adição de `rosewood` ao seed (será gerado na transição para a fase de execução).

### 3. Execution Gate (Após o add_target)
- Confirmar que `taxonomy-seed.v2.json` possui `rosewood` no array da subfamily `woody_dry`, family `woody`.
- Validar se nenhum outro arquivo (em particular, `descriptor_aliases.seed.json` e o diretório `data/compiled/`) sofreu mutação.
- Rodar validações base:
  - `npm run check:types` e `npm run check:schema` devem passar.
  - `npm run test` deve passar, atestando que a adição do target manteve a integridade do schema v2.
- Validar que o `check-safety-guards.sh` acusa corretamente `PROTECTED_DIFF`.

### 4. Closure Gate
- Geração do documento de closure final consolidando a adição do target.
- Os aliases derivados (`boi_de_rose`, `bois_de_rose`, `boi`, etc.) não devem ser mapeados ou resolvidos nesta fase.
- Nenhuma execução de compilação ou publicação (`npm run build`, `publish`).
- Graphify não deve ser atualizado (`graphify update .` não será rodado).
