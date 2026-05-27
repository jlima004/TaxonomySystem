# Phase 32 — Rosewood Alias Mutation Planning : Validation

## Critérios de Validação para a Mutação (Planejamento)

1. **Validação de `rosewood` (Pré-requisito):**
   - Confirmar que `rosewood` foi consolidado como um *seed descriptor* válido em `taxonomy-seed.v2.json` durante a Fase 31.

2. **Validação da Mutação `boi_de_rose` e `bois_de_rose`:**
   - Adicionar os mapeamentos em `descriptor_aliases.seed.json`:
     - `"boi_de_rose": "rosewood"`
     - `"bois_de_rose": "rosewood"`
   - Confirmar que a compilação ocorre sem erros (`check:types`, `check:schema`).
   - Validar que ambos os termos agora resolvem diretamente para a identidade taxonômica canônica de `rosewood` e deixam de constar como candidatos avulsos não-atribuídos.

3. **Invariantes de Segurança (Safety Checks):**
   - INV-3: Nenhuma alteração nas strings da seed canônica; as únicas alterações permitidas neste fluxo estão em `descriptor_aliases.seed.json`.
   - INV-4: Não alterar referências ou estruturas de outras famílias.
   - INV-5: `pau_rosa` e `boi` **não** devem sofrer mutações durante a execução do Plan 01. Devem permanecer isolados de mapeamentos automáticos até revisões futuras.
