# Phase 27 Validation

## Validation Gates

Esta fase adota os seguintes gates restritos de validação:

### 1. Preflight Gate (Antes do add_target)
- Validar se `ambergris` NÃO existe em `taxonomy-seed.v2.json`.
- Validar se `taxonomy-seed.v2.json` e todos os arquivos compilados estão limpos no repositório.

### 2. Approval Gate
- Confirmar que `27-FINAL-APPROVAL.md` existe e documenta explicitamente a permissão para adição de `ambergris` ao seed.

### 3. Execution Gate (Após o add_target)
- Confirmar que `taxonomy-seed.v2.json` possui `ambergris` no array da subfamily `amber`, family `amber_resinous`.
- Validar se nenhum outro arquivo (em particular, `descriptor_aliases.seed.json` e o `data/compiled/`) sofreu mutação.
- Rodar validações base:
  - `npm run check:types` e `npm run check:schema` devem passar.
  - `npm test` deve passar, demonstrando que a adição do target não quebrou os schemas ou as validações estritas de seed.
- Validar que o `check-safety-guards.sh` acusa corretamente `PROTECTED_DIFF` (pois a mutação no seed foi intencional).

### 4. Closure Gate
- Geração do documento de closure final consolidando que o target foi criado.
- Nenhum artefato do Graphify pode ser re-gerado nesta fase.
- Nenhum novo commit gerado ou merge automático (permanece no branch).
