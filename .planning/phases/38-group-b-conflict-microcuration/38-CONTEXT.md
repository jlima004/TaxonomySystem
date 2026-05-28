# Phase 38: Group B Conflict Microcuration - Context

**Gathered:** 2026-05-28
**Status:** Ready for planning

## Phase Boundary

Triage and resolve the 18 remaining Group B `seed_corpus_conflict` items from Phase 35. 
The immediate execution goal is to produce a decision matrix for these 18 Group B conflicts before any data mutation occurs. 
Execution should only apply changes when the disposition is safe and explicit (e.g., promote/add target, alias mutation, alias guard/reject alias, normalize variant, defer/manual_review, or no-op with rationale).

## Implementation Decisions

### Microcuration Matrix
- **D-01:** Produzir uma matriz de decisão cobrindo todos os 18 conflitos do Grupo B antes de aplicar qualquer mutação nos artefatos ou taxonomias base.
- **D-02:** A execução deve ser estritamente controlada. Alterações só serão aplicadas se a disposição elaborada na matriz for "segura e explícita". 
- **D-03:** Qualquer item com incerteza ou complexidade semântica não trivial (onde a disposição não é óbvia) deve ser deferido (manual_review) em vez de arriscar uma mutação insegura.

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project and Phase Documentation
- `.planning/PROJECT.md` — Project definition, boundaries, and current state.
- `.planning/REQUIREMENTS.md` — Phase 38 microcuration requirements (CUR-01 to CUR-04).

## Existing Code Insights

### Reusable Assets
- Curation scripts used in previous microcurations (e.g., Phase 20, 23).
- Similarity inference and taxonomy compilation pipeline for evaluating impacts of specific resolutions.

### Established Patterns
- All seed changes must be manual and targeted.
- Corpus candidates are not automatically promoted.

## Specific Ideas

- The user explicitly requested: "produzir uma matriz de decisão dos 18 conflitos Grupo B antes de qualquer mutação. A execução só deve aplicar mudanças quando a disposição for segura e explícita."

## Deferred Ideas

None — discussion stayed within phase scope

---

*Phase: 38-Group B Conflict Microcuration*
*Context gathered: 2026-05-28*
