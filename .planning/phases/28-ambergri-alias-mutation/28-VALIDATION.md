# Phase 28 Validation — Ambergri Alias Mutation

A validação requer a compilação inicial num diretório temporário para garantir que as restrições da fase sejam mantidas.

## Passos de Validação
1. Modificar `descriptor_aliases.seed.json` para adicionar `"ambergri": "ambergris"`.
2. Rodar a compilação da taxonomia de modo que o resultado vá ou seja validado em `/tmp`.
3. Validar nos artefatos gerados (ou pós execução de testes):
   - [x] INV-3: PASS — `descriptor_aliases.seed.json` contém ambergri → ambergris exatamente uma vez.
   - [x] INV-4: PASS — ambergri desapareceu como candidate/review item.
   - [x] INV-5: PASS — ambergris aparece como curated no taxonomy.json gerado.
   - [x] INV-6: PASS — item ambergri resolvido sem alias órfão.
   - [x] INV-7: PASS — nenhum novo conflict inesperado.

Se as validações em `/tmp` e na suite de testes (`npm test`) passarem, estará seguro publicar em `data/compiled/v2`.
