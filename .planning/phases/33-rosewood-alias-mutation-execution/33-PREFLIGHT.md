# Phase 33: Rosewood High-Confidence Alias Mutation Execution - Preflight

## Checklist
- [x] O seed `rosewood` existe em `woody / woody_dry`.
- [ ] Confirmação de que as mutações `boi_de_rose` e `bois_de_rose` são seguras e de alta confiança.
- [ ] Confirmação de que `boi` e `pau_rosa` estão bloqueados para esta fase.
- [ ] Confirmação do estado do sistema de planejamento.

## Invariantes
- INV-1: rosewood existe como seed em woody / woody_dry.
- INV-2: descriptor_aliases.seed.json contém boi_de_rose → rosewood exatamente uma vez.
- INV-3: descriptor_aliases.seed.json contém bois_de_rose → rosewood exatamente uma vez.
- INV-4: boi permanece sem alias e em defer/manual_review.
- INV-5: pau_rosa permanece sem mutação.
- INV-6: compile /tmp remove boi_de_rose como candidate/review item.
- INV-7: compiled v2 oficial só é publicado se /tmp PASS.
