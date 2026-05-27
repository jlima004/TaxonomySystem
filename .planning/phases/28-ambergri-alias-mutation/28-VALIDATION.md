# Phase 28 Validation — Ambergri Alias Mutation

A validação requer a compilação inicial num diretório temporário para garantir que as restrições da fase sejam mantidas.

## Passos de Validação
1. Modificar `descriptor_aliases.seed.json` para adicionar `"ambergri": "ambergris"`.
2. Rodar a compilação da taxonomia de modo que o resultado vá ou seja validado em `/tmp`.
3. Validar nos artefatos gerados (ou pós execução de testes):
   - [ ] INV-3: `descriptor_aliases.seed.json` contém `ambergri → ambergris` exatamente uma vez.
   - [ ] INV-4: `ambergri` desapareceu de `taxonomy.json` como candidate e de `review_queue`.
   - [ ] INV-5: `ambergris` aparece como `curated` no `taxonomy.json` gerado.
   - [ ] INV-6: O item `ambergri` do review_queue foi resolvido (nenhum alias órfão).
   - [ ] INV-7: Nenhum novo conflict inesperado ocorreu além do planejado.

Se as validações em `/tmp` e na suite de testes (`npm test`) passarem, estará seguro publicar em `data/compiled/v2`.
