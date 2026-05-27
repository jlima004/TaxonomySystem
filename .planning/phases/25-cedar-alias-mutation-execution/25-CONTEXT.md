# Phase 25: Context

## Objective
Executar a mutação curada de alias `cedar → cedarwood` em `descriptor_aliases.seed.json`, validar em `/tmp`, e publicar artifacts oficiais v2.3 apenas se todos os invariantes passarem.

## Base Obrigatória
- `.planning/phases/24-v2-3-alias-candidate-planning/24-CLOSURE.md`
- `.planning/phases/24-v2-3-alias-candidate-planning/24-RESEARCH.md`
- `.planning/phases/24-v2-3-alias-candidate-planning/24-PATTERNS.md`
- `.planning/phases/24-v2-3-alias-candidate-planning/24-VALIDATION.md`
- `.planning/phases/24-v2-3-alias-candidate-planning/24-01-PLAN.md`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/similarity_matrix.json`

## Invariantes Mínimos
- **INV-1:** `cedarwood` existe como seed curated em `woody/woody_dry`.
- **INV-2:** `cedar` não existe como seed em `taxonomy-seed.v2.json`.
- **INV-3:** `descriptor_aliases.seed.json` contém `cedar → cedarwood` exatamente uma vez.
- **INV-4:** `cedar` desaparece como candidate/review item após compile `/tmp`.
- **INV-5:** `cedarwood` absorve frequência de `cedar`; esperado >= 100.
- **INV-6:** `review_queue` reduz pela remoção do conflito `cedar`.
- **INV-7:** nenhum novo conflict inesperado acima do threshold documentado.
