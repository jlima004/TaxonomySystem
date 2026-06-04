# Requirements: Olfactory Taxonomy System v2.9

**Defined:** 2026-06-04
**Core Value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## v2.9 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Alias Integrity Resolution

- [ ] **HYG-01**: Resolver o alias dangling `ylang ylang -> ylang_ylang`, decidindo explicitamente entre adicionar um target curado, remover/drop do alias com rationale, ou registrar exceção permanente documentada.
- [ ] **HYG-02**: Criar um gate automatizado de integridade de aliases que valide todos os targets de `descriptor_aliases.seed.json` contra os descriptors presentes no output compilado da taxonomia, falhando quando houver target inexistente sem exceção documentada.
- [ ] **HYG-03**: Definir o mecanismo de exceções documentadas para aliases intencionalmente não resolvidos, permitindo lista vazia e exigindo rationale explícita para qualquer exceção.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Low-Support Curation

- **FUT-01**: Curate the 243 remaining `corpus_candidate_low_support` items from the Batch 2 leftovers.
- **FUT-02**: Curate the 13 remaining `seed_corpus_conflict` items from v2.7 leftovers.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| FUT-01: 243 `corpus_candidate_low_support` | Deferred to future milestone. v2.9 is alias hygiene only. |
| FUT-02: 13 `seed_corpus_conflict` | Deferred to future milestone. v2.9 is alias hygiene only. |
| Novas promoções de low-support | Batch 3 não será aberto durante v2.9; escopo fechado. |
| Artifact publication v2.9 sem curadoria explícita | Publicar v2.9 só se houver decisão clara de mutation, não em default. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HYG-01 | Phase [N] | Pending |
| HYG-02 | Phase [N] | Pending |
| HYG-03 | Phase [N] | Pending |

**Coverage:**
- v2.9 requirements: 3 total
- Mapped to phases: 0
- Unmapped: 3 ⚠️

---
*Requirements defined: 2026-06-04*
*Last updated: 2026-06-04 after initial definition*
