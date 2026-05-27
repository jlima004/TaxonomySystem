# Phase 25: Validation

## Objective
Garantir que a mutação `cedar → cedarwood` produza exatamente os resultados esperados sem regressões.

## Invariantes Mínimos (Checklist)

- [x] **INV-1:** `cedarwood` existe como seed curated em `woody/woody_dry`. (Verificado em `taxonomy-seed.v2.json`)
- [x] **INV-2:** `cedar` não existe como seed em `taxonomy-seed.v2.json`. (Verificado)
- [x] **INV-3:** `descriptor_aliases.seed.json` contém `cedar → cedarwood` exatamente uma vez. (Mutação inserida)
- [x] **INV-4:** `cedar` desaparece como candidate/review item após compile `/tmp`. (Nenhum item com `id="cedar"`)
- [x] **INV-5:** `cedarwood` absorve `cedar` com contagem consolidada pós-deduplicação. Expected: cedarwood frequency reflects alias absorption and is no lower than the deduplicated compiler result. Observed: 90 materials. PASS.
- [x] **INV-6:** `review_queue` reduz pela remoção do conflito `cedar`. (Conflitos reduzidos com sucesso).
- [x] **INV-7:** nenhum novo conflict inesperado acima do threshold documentado. (Quality Gate Status: PASS).
