# Phase 8: Taxonomy Seed Expansion & Curation - Context

**Gathered:** 2026-05-22
**Status:** Context captured; ready for research/planning only; not ready for execution

<domain>
## Phase Boundary

Phase 8 is manual taxonomy seed expansion and curation. It is separate from Phase 7, which hardened the pipeline. Phase 8 may later plan changes to curated seed inputs, curated aliases, curated relations and accord map, but this context file does not authorize implementation.

Phase 8 must preserve seed authority, review-only corpus evidence and zero auto-promotion. Corpus candidates, review queue items, frequency, co-occurrence and placement evidence can prioritize and support human review, but they never become curated truth without manual approval, rationale and evidence.

Phase 8 must not add runtime dependencies, perform external scraping/enrichment, create families or subfamilies by heuristic, mix review queue evidence into seed truth, silently change defaults, or alter compiled artifacts without a later executable plan and validation path.

</domain>

<decisions>
## Canonical Decisions

Downstream planning and research must use only the decision IDs in this `08-CONTEXT.md` as canonical. `08-DISCUSSION-LOG.md` preserves alternatives and audit trail.

### Taxonomy Scope

- **CUR-D-01:** Phase 8 adotará minimal expansion como estratégia inicial de taxonomy scope.
- **CUR-D-02:** A expansão será manual/curada; corpus evidence e review_queue serão usados apenas como sinais de priorização.
- **CUR-D-03:** A fase não buscará uma full useful taxonomy completa de uma vez.
- **CUR-D-04:** O primeiro seed expandido discutirá os groups `gourmand`, `spicy`, `green`, `fruity`, `amber_resinous` e `animalic` como candidatos iniciais.
- **CUR-D-05:** A seleção desses groups para discussão não implica inclusão automática; cada family/subfamily/descriptor ainda precisará passar por curadoria manual.
- **CUR-D-06:** `marine_ozonic`, `tobacco`, `powdery`, `aldehydic`, `medicinal_camphoraceous`, `earthy_mineral` e `smoky` ficam deferidas para fase/subfase posterior.
- **CUR-D-07:** A Phase 8 inicial prioriza o conjunto mínimo recomendado e registra as demais categorias como future taxonomy expansion candidates.

Initial candidate groups:

- `gourmand`: `vanilla`, `caramel`, `chocolate`, `nutty`
- `spicy`: `warm_spice`, `fresh_spice`
- `green`: `leafy_green`, `herbal_green`
- `fruity`: `red_fruit`, `tropical_fruit`, `orchard_fruit`
- `amber_resinous`: `amber`, `balsamic_resin`
- `animalic`: `musky`, `leathery`

### Seed Versioning

- **CUR-D-08:** Phase 8 criará `taxonomy-seed.v2.json` como novo seed expandido e curado.
- **CUR-D-09:** `taxonomy-seed.v1.json` será preservado como baseline e não será editado pela Phase 8.
- **CUR-D-10:** Loaders/CLI/compiler devem continuar usando seed path parametrizável para permitir comparação v1 vs v2.
- **CUR-D-11:** A Phase 8 usará migração controlada para `taxonomy-seed.v2.json`.
- **CUR-D-12:** Nenhuma troca de default para v2 acontece automaticamente nesta fase.
- **CUR-D-13:** v2 só poderá virar default após diff/review e validação comparativa contra v1.

### Curation Rules

- **CUR-D-14:** Toda entrada no seed exige aprovação manual explícita.
- **CUR-D-15:** Toda entrada nova exige rationale curto.
- **CUR-D-16:** Toda entrada nova exige evidência de apoio, mas corpus evidence permanece review-only.
- **CUR-D-17:** Frequência corpus não é condição obrigatória para curated seed truth.
- **CUR-D-18:** Batch approval sem rationale individual não é permitido para o primeiro seed expandido.
- **CUR-D-19:** IDs canônicos do seed devem ser lowercase, snake_case e ASCII/no accents.
- **CUR-D-20:** IDs canônicos são estáveis e só mudam com migração explícita.
- **CUR-D-21:** Aliases não podem ser descriptors principais; devem apontar para um canonical claro via alias map.
- **CUR-D-22:** Corpus frequency e review_queue são sinais de suporte/priorização, não critérios automáticos de aprovação.
- **CUR-D-23:** Frequência alta não promove descriptor para seed sem aprovação manual.
- **CUR-D-24:** Frequência baixa ou zero não bloqueia entrada curada quando houver rationale suficiente.
- **CUR-D-25:** Review_queue será usada como fila de investigação curatorial, não como curated truth.

### Candidate Review Workflow

- **CUR-D-26:** A curadoria da Phase 8 classificará review_queue/corpus candidates em buckets explícitos.
- **CUR-D-27:** Os buckets oficiais são new descriptor candidate, alias candidate, subfamily gap, family gap, relation/accord gap e reject/defer.
- **CUR-D-28:** Classificação de candidate não equivale a promoção automática; toda mudança curada exige aprovação manual.
- **CUR-D-29:** Cada item revisado deve ter uma classificação principal e pode ter hipóteses secundárias quando necessário.
- **CUR-D-30:** A fila de revisão será priorizada por evidence-ranked queue.
- **CUR-D-31:** O ranking usará frequência, tipo de review, severidade de conflito, ambiguidade de placement e impacto em subfamilies sobrecarregadas.
- **CUR-D-32:** Ranking alto não implica promoção automática; serve apenas para ordenar investigação curatorial.
- **CUR-D-33:** Frequency-only e conflicts-only não serão usados como estratégia principal de priorização.
- **CUR-D-34:** Todo candidate revisado deve receber disposition estruturada obrigatória.
- **CUR-D-35:** Outcomes válidos são `promote_to_seed`, `add_alias`, `create_gap`, `relation_gap`, `reject` e `defer`.
- **CUR-D-36:** Toda disposition exige rationale e preserva evidence.
- **CUR-D-37:** Disposition não executa automaticamente alterações; mudanças em seed/aliases/relations/accords continuam controladas e auditáveis.

### Alias Expansion

- **CUR-D-38:** Alias só entra em `descriptor_aliases.seed.json` quando houver canonical descriptor claro.
- **CUR-D-39:** Alias exige aprovação manual explícita.
- **CUR-D-40:** Alias exige rationale/evidence.
- **CUR-D-41:** Alias ambíguo deve ser rejeitado ou deferido até canonical ser resolvido.
- **CUR-D-42:** Alias candidates e frequência corpus nunca promovem aliases automaticamente.
- **CUR-D-43:** O canonical é o conceito curado mais estável, não necessariamente a grafia mais frequente.
- **CUR-D-44:** Frequência corpus pode informar a decisão, mas não define canonical automaticamente.
- **CUR-D-45:** IDs curtos/limpos não vencem se forem semanticamente ambíguos.
- **CUR-D-46:** Mudança de canonical ID exige migração explícita.
- **CUR-D-47:** Aliases óbvios devem ser revisados junto com novos descriptors aprovados.
- **CUR-D-48:** A aprovação de um descriptor não aprova aliases automaticamente.
- **CUR-D-49:** Aliases ambíguos ficam defer/reject até canonical claro.
- **CUR-D-50:** Cada bloco curatorial pode incluir descriptor, aliases, rationale e evidence.

### Relation/Accord Expansion

- **CUR-D-51:** Cada nova subfamily deve considerar curated relations/accords mínimos no mesmo bloco da seed expansion.
- **CUR-D-52:** A ausência de relation/accord não bloqueia automaticamente a entrada quando houver justificativa.
- **CUR-D-53:** Ausências justificadas devem virar relation_gap/accord_gap review items.
- **CUR-D-54:** Relations/accords seguem manuais; corpus evidence apoia, mas não define sozinho.
- **CUR-D-55:** O `accord_map` deve ser expandido junto com o seed v2.
- **CUR-D-56:** Accords novos exigem score manual, rationale/evidence e aprovação curatorial.
- **CUR-D-57:** Corpus/co-occurrence pode apoiar evidence, mas não cria accord automaticamente.
- **CUR-D-58:** Ausência de accord plausível não bloqueia subfamily, mas deve ser registrada como gap/review quando relevante.
- **CUR-D-59:** Scores de curated_relations e accord_map são manuais, não derivados automaticamente do corpus.
- **CUR-D-60:** Cada relation/accord exige rationale curto.
- **CUR-D-61:** Evidence deve ser preservada, incluindo corpus signals quando úteis, mas sempre como suporte.
- **CUR-D-62:** Relations/accords não são gerados por heurística automática.
- **CUR-D-63:** Missing relation/accord permanece neutral/undefined, não zero.
- **CUR-D-64:** Scores devem ser normalizados em [0, 1] e revisáveis.

### Validation And Quality Gates

- **CUR-D-65:** A Phase 8 validará seed v2 com comparação v1 vs v2.
- **CUR-D-66:** Métricas obrigatórias incluem coverage, generic pressure, zero-frequency seeds, graph coverage, review_queue quality, alias quality e determinism/schema.
- **CUR-D-67:** Regressões devem ser documentadas com rationale.
- **CUR-D-68:** Quality metrics não substituem curadoria manual; servem para validar impacto da expansão.
- **CUR-D-69:** Hard failures da Phase 8 incluem schema invalid, nondeterminism, hard/pattern-excludes em taxonomy, alias contamination e auto-promotion.
- **CUR-D-70:** Empty graph não é hard failure universal; vira warning high quando houver curated inputs que deveriam gerar edges.
- **CUR-D-71:** Warnings/review_queue items não falham por padrão; são parte esperada do workflow curatorial.
- **CUR-D-72:** Zero-frequency seeds, sparse graph, high review_queue count, deferred gaps e ambiguous candidates são soft warnings/review findings.
- **CUR-D-73:** Soft warnings não falham a build por padrão.
- **CUR-D-74:** Soft warnings devem orientar revisão curatorial e promoção controlada do seed v2.
- **CUR-D-75:** Ambiguidades só viram erro se forem promovidas sem aprovação manual.

</decisions>

<validation_context>
## Post-Phase 7 Baseline

Phase 7 completed and passed verification.

Known baseline facts:

- `npm run typecheck` passed.
- `npm test` passed with 48 files / 345 tests.
- `npm run build` passed.
- `npm run compile -- --generated-at 2026-01-01T00:00:00.000Z` passed.
- `npm run compile:quality -- --generated-at 2026-01-01T00:00:00.000Z` passed.
- `taxonomy.json` has 3 families, 6 subfamilies and 177 descriptors.
- Seed descriptor count is 21.
- Corpus candidate count is 156.
- `taxonomy.json` has no hard/pattern-exclude descriptors.
- `descriptor_aliases.json` has 10 authoritative aliases.
- New curated aliases include `jasmin -> jasmine`, `orangeflower -> orange_blossom`, and `orange blossom -> orange_blossom`.
- `jasmine` and `orange_blossom` receive canonicalized frequency.
- `similarity_matrix.json.edges.length = 6`.
- `similarity_matrix.json.review_queue.length = 427`.
- Review queue type distribution is `corpus_candidate_low_support: 410` and `seed_corpus_conflict: 17`.
- Remaining zero-frequency seed descriptors are `bitter_orange`, `sweet_orange`, and `tree_moss`.
- The current seed remains small and puts pressure on `floral_rose`, `citrus_fresh`, and `woody_dry`.

</validation_context>

<canonical_refs>
## Canonical References

Downstream agents must read these before planning or implementing.

- `.planning/ROADMAP.md` - Phase 8 registration and non-executable status.
- `.planning/STATE.md` - current project state and Phase 8 status.
- `.planning/REQUIREMENTS.md` - CUR-01 through CUR-07 context-gathering requirements.
- `.planning/PROJECT.md` - project scope, constraints and Phase 8 active boundary.
- `.planning/phases/08-taxonomy-seed-expansion-curation/08-DISCUSSION-LOG.md` - audit trail and alternatives considered.
- `.planning/phases/08-taxonomy-seed-expansion-curation/08-PREFLIGHT.md` - non-executable preflight status.
- `.planning/phases/07-data-quality-inference-hardening/07-CONTEXT.md` - seed authority, review-only corpus evidence and Phase 7 hardening decisions.
- `.planning/phases/07-data-quality-inference-hardening/07-VERIFICATION.md` - passed verification baseline.
- `data/taxonomy/taxonomy-seed.v1.json` - baseline seed to preserve.
- `data/taxonomy/descriptor_aliases.seed.json` - authoritative curated alias input.
- `data/inference/curated_relations.v1.json` - curated relations input.
- `data/inference/accord_map.v1.json` - accord map input.
- `data/compiled/v1/taxonomy.json` - compiled taxonomy baseline.
- `data/compiled/v1/descriptor_aliases.json` - authoritative alias artifact baseline.
- `data/compiled/v1/similarity_matrix.json` - sparse graph and review queue baseline.

</canonical_refs>

<next_steps>
## Planning Boundary

The next valid GSD step is research/planning for Phase 8. Do not execute implementation until an executable plan exists and is approved.

No Phase 8 plan exists at the time this context is created.

</next_steps>
