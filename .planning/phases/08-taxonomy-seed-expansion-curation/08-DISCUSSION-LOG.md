# Phase 8: Taxonomy Seed Expansion & Curation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions will be captured in `08-CONTEXT.md` after discussion produces enough stable decisions.

**Date:** 2026-05-22
**Phase:** 08-taxonomy-seed-expansion-curation
**Status:** active_for_context_gathering
**Execution readiness:** not_ready_for_execution
**Areas proposed:** Taxonomy scope, Seed versioning, Curation rules, Candidate review workflow, Alias expansion, Relation/accord expansion, Validation and quality gates

---

## Phase Boundary

Phase 8 is separate from Phase 7. Phase 7 was pipeline hardening; Phase 8 is manual taxonomy curation and seed expansion.

Phase 8 may discuss expanding curated families, subfamilies and descriptors; creating `taxonomy-seed.v2.json`; reviewing corpus candidates as suggestions; using `similarity_matrix.json.review_queue` as evidence; expanding `descriptor_aliases.seed.json`; expanding `curated_relations.v1.json` and `accord_map.v1.json`; and defining acceptance criteria for a more useful olfactive taxonomy v1.

Phase 8 must not auto-promote corpus candidates, treat review queue evidence as curated truth, create families or subfamilies by heuristic, change compiled artifacts during discussion, add runtime dependencies, perform external scraping/enrichment, or mix review-only evidence into seed truth.

---

## Post-Phase 7 Starting Context

Phase 7 completed and passed verification.

Verified commands and checks:

- `npm run typecheck` passed.
- `npm test` passed with 48 files / 345 tests.
- `npm run build` passed.
- `npm run compile -- --generated-at 2026-01-01T00:00:00.000Z` passed.
- `npm run compile:quality -- --generated-at 2026-01-01T00:00:00.000Z` passed.

Current artifact observations:

- `taxonomy.json` has 3 families, 6 subfamilies and 177 descriptors.
- Seed descriptor count is 21.
- Corpus candidate count is 156.
- `taxonomy.json` has no hard/pattern-exclude descriptors.
- `descriptor_aliases.json` has 10 authoritative aliases.
- New curated aliases include `jasmin -> jasmine`, `orangeflower -> orange_blossom`, and `orange blossom -> orange_blossom`.
- `jasmine` and `orange_blossom` now receive canonicalized frequency.
- `similarity_matrix.json.edges.length = 6`.
- `similarity_matrix.json.review_queue.length = 427`.
- Review queue type distribution is `corpus_candidate_low_support: 410` and `seed_corpus_conflict: 17`.

Known limitations to discuss:

- Curated relation and accord inputs are still a minimal bootstrap.
- Sparse graph is non-empty but low coverage.
- Seed descriptors with frequency 0 remain: `bitter_orange`, `sweet_orange`, `tree_moss`.
- Corpus candidates remain review-required and are not curated truth.
- The current seed is small and forces many candidates into a few generic subfamilies.
- `floral_rose`, `citrus_fresh` and `woody_dry` still absorb substantial evidence.

---

## Initial Discussion Prompt

Which areas do you want to discuss for Phase 8: Taxonomy Seed Expansion & Curation? Select all that apply.

| Option | Area | Description | Recommended |
|--------|------|-------------|-------------|
| 1 | Taxonomy scope | Quais families/subfamilies entram no seed expandido. | yes |
| 2 | Seed versioning | Criar `taxonomy-seed.v2.json` ou atualizar `taxonomy-seed.v1.json` com migração controlada. | yes |
| 3 | Curation rules | Critérios para um descriptor, family ou subfamily virar curated seed truth. | yes |
| 4 | Candidate review workflow | Como usar review_queue/corpus candidates da Phase 7 como evidência review-only sem auto-promover. | yes |
| 5 | Alias expansion | Quais aliases curados entram junto com novos descriptors. | yes |
| 6 | Relation/accord expansion | Como atualizar curated_relations e accord_map para novas subfamilies. | yes |
| 7 | Validation and quality gates | Como medir que o novo seed melhorou taxonomy.json, descriptor_aliases.json e similarity_matrix.json. | yes |

**Initial recommendation:** discuss all areas: 1, 2, 3, 4, 5, 6 and 7.

**User selection:** All areas.

Next discussion order:

1. Taxonomy scope
2. Seed versioning
3. Curation rules
4. Candidate review workflow
5. Alias expansion
6. Relation/accord expansion
7. Validation and quality gates

---

## Decision Capture Rules

Use decision IDs `CUR-D-01`, `CUR-D-02`, `CUR-D-03`, and so on.

Until `08-CONTEXT.md` exists, this log records proposed areas, alternatives and discussion notes only. No decision in this file authorizes implementation.

---

## Candidate Scope For Discussion

Recommended first discussion target: minimal manual expansion rather than a complete taxonomy.

Candidate families/subfamilies to discuss:

- `gourmand`: `vanilla`, `caramel`, `chocolate`, `nutty`
- `spicy`: `warm_spice`, `fresh_spice`
- `green`: `leafy_green`, `herbal_green`
- `fruity`: `red_fruit`, `tropical_fruit`, `orchard_fruit`
- `amber_resinous`: `amber`, `balsamic_resin`
- `animalic`: `musky`, `leathery`

Possible later-phase families:

- `marine_ozonic`
- `tobacco`
- `powdery`
- `aldehydic`
- `medicinal_camphoraceous`
- `earthy_mineral`
- `smoky`

---

## Taxonomy Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal expansion | Add a small, priority set of curated families/subfamilies; keep corpus evidence review-only. | yes |
| Existing families only | Add subfamilies/descriptors only inside the current 3 families. | |
| Full useful seed | Attempt a broader v1 taxonomy in one phase. | |
| Discussion only | Do not decide scope yet. | |

**User's choice:** Minimal expansion.

**Decisions:**

- **CUR-D-01:** Phase 8 adotará minimal expansion como estratégia inicial de taxonomy scope.
- **CUR-D-02:** A expansão será manual/curada; corpus evidence e review_queue serão usados apenas como sinais de priorização.
- **CUR-D-03:** A fase não buscará uma full useful taxonomy completa de uma vez.

**Notes:** The first expansion should reduce pressure on broad current subfamilies, especially `floral_rose`, `citrus_fresh`, and `woody_dry`, without creating seed truth from corpus evidence.

### Initial Candidate Groups

| Group | Candidate subfamilies | Selected for discussion |
|-------|-----------------------|-------------------------|
| `gourmand` | `vanilla`, `caramel`, `chocolate`, `nutty` | yes |
| `spicy` | `warm_spice`, `fresh_spice` | yes |
| `green` | `leafy_green`, `herbal_green` | yes |
| `fruity` | `red_fruit`, `tropical_fruit`, `orchard_fruit` | yes |
| `amber_resinous` | `amber`, `balsamic_resin` | yes |
| `animalic` | `musky`, `leathery` | yes |

**User's choice:** All recommended groups enter discussion as candidates.

**Decisions:**

- **CUR-D-04:** O primeiro seed expandido discutirá os groups `gourmand`, `spicy`, `green`, `fruity`, `amber_resinous` e `animalic` como candidatos iniciais.
- **CUR-D-05:** A seleção desses groups para discussão não implica inclusão automática; cada family/subfamily/descriptor ainda precisará passar por curadoria manual.

### Deferred Family Candidates

| Option | Description | Selected |
|--------|-------------|----------|
| Defer all | Keep later families out of the initial Phase 8 seed expansion scope. | yes |
| Discuss later | Revisit them after the seven primary discussion areas. | |
| Include selected | Include some now if evidence/need is clear. | |

**Deferred families:** `marine_ozonic`, `tobacco`, `powdery`, `aldehydic`, `medicinal_camphoraceous`, `earthy_mineral`, `smoky`.

**Decisions:**

- **CUR-D-06:** `marine_ozonic`, `tobacco`, `powdery`, `aldehydic`, `medicinal_camphoraceous`, `earthy_mineral` e `smoky` ficam deferidas para fase/subfase posterior.
- **CUR-D-07:** A Phase 8 inicial prioriza o conjunto mínimo recomendado e registra as demais categorias como future taxonomy expansion candidates.

---

## Seed Versioning

| Option | Description | Selected |
|--------|-------------|----------|
| Create v2 | Create `taxonomy-seed.v2.json` as the new curated expanded seed; preserve v1 as baseline. | yes |
| Update v1 | Edit `taxonomy-seed.v1.json` directly. | |
| Draft file first | Create `taxonomy-seed.expanded-draft.json` before promoting to v2. | |
| Discussion only | Do not decide versioning yet. | |

**User's choice:** Create `taxonomy-seed.v2.json`.

**Decisions:**

- **CUR-D-08:** Phase 8 criará `taxonomy-seed.v2.json` como novo seed expandido e curado.
- **CUR-D-09:** `taxonomy-seed.v1.json` será preservado como baseline e não será editado pela Phase 8.
- **CUR-D-10:** Loaders/CLI/compiler devem continuar usando seed path parametrizável para permitir comparação v1 vs v2.

**Notes:** `taxonomy-seed.expanded-draft.json` is not mandatory unless execution later needs a temporary working area. Compiled artifact versioning is not decided here; artifacts may keep existing metadata until a later metadata/versioning decision.

### Migration Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Controlled migration | Preserve v1, create v2 explicitly, and require diff/review before official v2 compilation/default change. | yes |
| Replace default | Make v2 the default immediately after curation. | |
| Parallel only | Keep v1/v2 side-by-side without default migration path. | |
| Decide later | Defer migration policy. | |

**User's choice:** Controlled migration.

**Decisions:**

- **CUR-D-11:** A Phase 8 usará migração controlada para `taxonomy-seed.v2.json`.
- **CUR-D-12:** Nenhuma troca de default para v2 acontece automaticamente nesta fase.
- **CUR-D-13:** v2 só poderá virar default após diff/review e validação comparativa contra v1.

**Validation comparison candidates:** `family_count`, `subfamily_count`, seed descriptor count, corpus candidate count, zero-frequency seed descriptors, similarity edges count, review queue distribution, absence of hard/pattern-excludes, and artifact determinism.

---

## Curation Rules

| Option | Description | Selected |
|--------|-------------|----------|
| Manual approval | Entry into seed requires explicit manual approval; corpus/review evidence never approves alone. | yes |
| Rationale required | Each new entry needs a short rationale. | yes |
| Evidence required | Each new entry needs supporting evidence; corpus/review evidence remains review-only. | yes |
| Source optional | Allow manual entry without detailed source/evidence. | |
| Frequency threshold | Require minimum corpus frequency for seed truth. | |
| Batch approval | Approve whole groups without individual rationale. | |

**User's choice:** Manual approval, rationale required, and evidence required.

**Decisions:**

- **CUR-D-14:** Toda entrada no seed exige aprovação manual explícita.
- **CUR-D-15:** Toda entrada nova exige rationale curto.
- **CUR-D-16:** Toda entrada nova exige evidência de apoio, mas corpus evidence permanece review-only.
- **CUR-D-17:** Frequência corpus não é condição obrigatória para curated seed truth.
- **CUR-D-18:** Batch approval sem rationale individual não é permitido para o primeiro seed expandido.

**Supporting evidence may include:** manual curatorial knowledge, corpus frequency, review queue signals, relation to existing descriptors, and traditional perfumery usage. Corpus evidence supports the decision but never becomes curated truth by itself.

### Naming And ID Rules

| Rule | Selected |
|------|----------|
| lowercase | yes |
| snake_case | yes |
| stable ID | yes |
| ASCII/no accents | yes |
| no aliases as primary descriptors | yes |

**User's choice:** All canonical rules.

**Decisions:**

- **CUR-D-19:** IDs canônicos do seed devem ser lowercase, snake_case e ASCII/no accents.
- **CUR-D-20:** IDs canônicos são estáveis e só mudam com migração explícita.
- **CUR-D-21:** Aliases não podem ser descriptors principais; devem apontar para um canonical claro via alias map.

**Notes:** The canonical descriptor should represent the most stable curated concept, not necessarily the most frequent corpus spelling.

### Corpus And Review Queue Evidence Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Support only | Corpus/review queue can prioritize and support review but never approve seed truth alone. | yes |
| Soft threshold | High frequency creates strong recommendation but still needs approval. | |
| Hard threshold | Require minimum frequency. | |
| Ignore corpus | Do not use corpus/review queue initially. | |

**User's choice:** Support only.

**Decisions:**

- **CUR-D-22:** Corpus frequency e review_queue são sinais de suporte/priorização, não critérios automáticos de aprovação.
- **CUR-D-23:** Frequência alta não promove descriptor para seed sem aprovação manual.
- **CUR-D-24:** Frequência baixa ou zero não bloqueia entrada curada quando houver rationale suficiente.
- **CUR-D-25:** Review_queue será usada como fila de investigação curatorial, não como curated truth.

---

## Candidate Review Workflow

### Review Buckets

| Bucket | Description | Selected |
|--------|-------------|----------|
| New descriptor candidate | Valid olfactive descriptor candidate for a current or new subfamily. | yes |
| Alias candidate | Variant/spelling/common form of an existing canonical descriptor. | yes |
| Subfamily gap | Valid term that does not fit current subfamilies well. | yes |
| Family gap | Term points to an underrepresented olfactive area. | yes |
| Relation/accord gap | Review signal indicates missing curated relation or accord entry. | yes |
| Reject/defer | Generic, ambiguous, noisy, unreliable or out of initial scope. | yes |

**User's choice:** All recommended buckets.

**Decisions:**

- **CUR-D-26:** A curadoria da Phase 8 classificará review_queue/corpus candidates em buckets explícitos.
- **CUR-D-27:** Os buckets oficiais são new descriptor candidate, alias candidate, subfamily gap, family gap, relation/accord gap e reject/defer.
- **CUR-D-28:** Classificação de candidate não equivale a promoção automática; toda mudança curada exige aprovação manual.
- **CUR-D-29:** Cada item revisado deve ter uma classificação principal e pode ter hipóteses secundárias quando necessário.

### Review Prioritization

| Option | Description | Selected |
|--------|-------------|----------|
| Evidence-ranked queue | Rank by frequency, review type, conflict severity, placement ambiguity and overloaded-subfamily impact. | yes |
| Frequency only | Sort mainly by corpus frequency. | |
| Conflicts first | Review `seed_corpus_conflict` before low-support items. | |
| Manual ordering | Curator chooses order without formal ranking. | |

**User's choice:** Evidence-ranked queue.

**Decisions:**

- **CUR-D-30:** A fila de revisão será priorizada por evidence-ranked queue.
- **CUR-D-31:** O ranking usará frequência, tipo de review, severidade de conflito, ambiguidade de placement e impacto em subfamilies sobrecarregadas.
- **CUR-D-32:** Ranking alto não implica promoção automática; serve apenas para ordenar investigação curatorial.
- **CUR-D-33:** Frequency-only e conflicts-only não serão usados como estratégia principal de priorização.

**Suggested priority order:** `seed_corpus_conflict`; obvious alias candidates that may resolve zero-frequency seed descriptors; high-frequency candidates in overloaded subfamilies; candidates with placement ambiguity; low-support/high-frequency candidates; relation/accord gaps; generic or ambiguous reject/defer items.

### Review Outcomes

| Outcome | Meaning | Selected |
|---------|---------|----------|
| `promote_to_seed` | Candidate approved for curated seed entry with clear target. | yes |
| `add_alias` | Candidate becomes curated alias for a canonical descriptor. | yes |
| `create_gap` | Candidate records a structured family/subfamily/descriptor gap. | yes |
| `relation_gap` | Candidate records missing curated relation or accord evidence. | yes |
| `reject` | Candidate is invalid, noisy, generic or out of taxonomy. | yes |
| `defer` | Candidate may be valid but is outside initial Phase 8 scope. | yes |

**User's choice:** Explicit disposition.

**Decisions:**

- **CUR-D-34:** Todo candidate revisado deve receber disposition estruturada obrigatória.
- **CUR-D-35:** Outcomes válidos são `promote_to_seed`, `add_alias`, `create_gap`, `relation_gap`, `reject` e `defer`.
- **CUR-D-36:** Toda disposition exige rationale e preserva evidence.
- **CUR-D-37:** Disposition não executa automaticamente alterações; mudanças em seed/aliases/relations/accords continuam controladas e auditáveis.

---

## Alias Expansion

### Alias Acceptance Criteria

| Criterion | Selected |
|-----------|----------|
| Clear canonical descriptor | yes |
| Manual approval | yes |
| Rationale/evidence | yes |
| Reject/defer ambiguous aliases | yes |
| Auto-promote from alias candidates | no |
| Frequency decides canonical | no |

**User's choice:** Alias requires clear canonical descriptor, manual approval, rationale/evidence, and no unresolved ambiguity.

**Decisions:**

- **CUR-D-38:** Alias só entra em `descriptor_aliases.seed.json` quando houver canonical descriptor claro.
- **CUR-D-39:** Alias exige aprovação manual explícita.
- **CUR-D-40:** Alias exige rationale/evidence.
- **CUR-D-41:** Alias ambíguo deve ser rejeitado ou deferido até canonical ser resolvido.
- **CUR-D-42:** Alias candidates e frequência corpus nunca promovem aliases automaticamente.

**Accepted examples:** `jasmin -> jasmine`, `orangeflower -> orange_blossom`, `orange blossom -> orange_blossom`.

**Ambiguous examples:** `wood -> cedarwood` should not be automatic; `ylang -> ylang_ylang` needs manual confirmation.

### Canonical Choice

| Option | Description | Selected |
|--------|-------------|----------|
| Curated stable concept | Canonical is the most stable curated olfactive concept. | yes |
| Most frequent spelling | Corpus frequency decides canonical automatically. | |
| Shortest ID | Shortest/cleanest ID wins. | |
| Decide case-by-case | No general principle. | |

**User's choice:** Curated stable concept.

**Decisions:**

- **CUR-D-43:** O canonical é o conceito curado mais estável, não necessariamente a grafia mais frequente.
- **CUR-D-44:** Frequência corpus pode informar a decisão, mas não define canonical automaticamente.
- **CUR-D-45:** IDs curtos/limpos não vencem se forem semanticamente ambíguos.
- **CUR-D-46:** Mudança de canonical ID exige migração explícita.

### Alias Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Curate with descriptors | Review obvious aliases in the same curation block as approved descriptors. | yes |
| Separate pass | Add descriptors first, aliases later. | |
| Only existing aliases | Do not expand aliases initially. | |
| Decide later | Defer timing policy. | |

**User's choice:** Curate with descriptors.

**Decisions:**

- **CUR-D-47:** Aliases óbvios devem ser revisados junto com novos descriptors aprovados.
- **CUR-D-48:** A aprovação de um descriptor não aprova aliases automaticamente.
- **CUR-D-49:** Aliases ambíguos ficam defer/reject até canonical claro.
- **CUR-D-50:** Cada bloco curatorial pode incluir descriptor, aliases, rationale e evidence.

---

## Relation/Accord Expansion

### Relations Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Minimum relations | Each new subfamily considers minimal manual relations/accords; justified absence becomes a gap. | yes |
| Required relations | Every new subfamily requires at least one curated relation. | |
| Optional only | Relations are optional and can be added later. | |
| No relations now | Do not expand curated relations initially. | |

**User's choice:** Minimum relations.

**Decisions:**

- **CUR-D-51:** Cada nova subfamily deve considerar curated relations/accords mínimos no mesmo bloco da seed expansion.
- **CUR-D-52:** A ausência de relation/accord não bloqueia automaticamente a entrada quando houver justificativa.
- **CUR-D-53:** Ausências justificadas devem virar relation_gap/accord_gap review items.
- **CUR-D-54:** Relations/accords seguem manuais; corpus evidence apoia, mas não define sozinho.

### Accord Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Expand with seed | Review plausible accords for new subfamilies in the same curation block. | yes |
| Relations first | Update curated_relations now; defer accord_map. | |
| Optional gaps | Record accord gaps only. | |
| No accord changes | Do not change accord_map in Phase 8. | |

**User's choice:** Expand with seed.

**Decisions:**

- **CUR-D-55:** O `accord_map` deve ser expandido junto com o seed v2.
- **CUR-D-56:** Accords novos exigem score manual, rationale/evidence e aprovação curatorial.
- **CUR-D-57:** Corpus/co-occurrence pode apoiar evidence, mas não cria accord automaticamente.
- **CUR-D-58:** Ausência de accord plausível não bloqueia subfamily, mas deve ser registrada como gap/review quando relevante.

### Score And Evidence Rules

| Rule | Selected |
|------|----------|
| Manual scores only | yes |
| Rationale required | yes |
| Evidence preserved | yes |
| No heuristic generation | yes |
| Corpus scores allowed | no |
| Default neutral missing | yes |

**User's choice:** Manual scores, rationale, preserved evidence, no heuristic generation, neutral/undefined missing data.

**Decisions:**

- **CUR-D-59:** Scores de curated_relations e accord_map são manuais, não derivados automaticamente do corpus.
- **CUR-D-60:** Cada relation/accord exige rationale curto.
- **CUR-D-61:** Evidence deve ser preservada, incluindo corpus signals quando úteis, mas sempre como suporte.
- **CUR-D-62:** Relations/accords não são gerados por heurística automática.
- **CUR-D-63:** Missing relation/accord permanece neutral/undefined, não zero.
- **CUR-D-64:** Scores devem ser normalizados em [0, 1] e revisáveis.

---

## Validation And Quality Gates

### Quality Metrics

| Metric Area | Description | Selected |
|-------------|-------------|----------|
| Coverage counts | `family_count`, `subfamily_count`, seed descriptor count, corpus candidate count, candidate/seed ratio. | yes |
| Generic pressure | Candidate concentration in overloaded subfamilies such as `floral_rose`, `citrus_fresh`, `woody_dry`. | yes |
| Zero-frequency seeds | Count, reduce where possible, and justify remaining seed descriptors with frequency 0. | yes |
| Graph coverage | `edges.length`, density, connected subfamilies, curated relation/accord coverage. | yes |
| Review queue quality | Total, type/severity distribution, lower ambiguity, more actionable items. | yes |
| Alias quality | Authoritative-only aliases, clear canonical targets, no automatic candidates. | yes |
| Determinism/schema | Schema-valid deterministic artifacts with fixed `generated_at`; no default sidecars; zero runtime dependencies. | yes |

**User's choice:** All recommended metrics.

**Decisions:**

- **CUR-D-65:** A Phase 8 validará seed v2 com comparação v1 vs v2.
- **CUR-D-66:** Métricas obrigatórias incluem coverage, generic pressure, zero-frequency seeds, graph coverage, review_queue quality, alias quality e determinism/schema.
- **CUR-D-67:** Regressões devem ser documentadas com rationale.
- **CUR-D-68:** Quality metrics não substituem curadoria manual; servem para validar impacto da expansão.

### Hard Gates

| Hard Gate | Selected |
|-----------|----------|
| Schema invalid | yes |
| Nondeterminism | yes |
| Hard/pattern-excludes in taxonomy | yes |
| Alias candidate contamination | yes |
| Auto-promotion without manual approval | yes |
| Empty graph always fails | no |
| Any warning fails | no |

**User's choice:** Core hard gates.

**Decisions:**

- **CUR-D-69:** Hard failures da Phase 8 incluem schema invalid, nondeterminism, hard/pattern-excludes em taxonomy, alias contamination e auto-promotion.
- **CUR-D-70:** Empty graph não é hard failure universal; vira warning high quando houver curated inputs que deveriam gerar edges.
- **CUR-D-71:** Warnings/review_queue items não falham por padrão; são parte esperada do workflow curatorial.

### Soft Gates

| Soft Gate | Selected |
|-----------|----------|
| Remaining zero-frequency seeds | yes |
| Sparse graph | yes |
| High review_queue count | yes |
| Deferred gaps | yes |
| Ambiguous candidates | yes |
| No soft gates | no |

**User's choice:** Recommended soft gates.

**Decisions:**

- **CUR-D-72:** Zero-frequency seeds, sparse graph, high review_queue count, deferred gaps e ambiguous candidates são soft warnings/review findings.
- **CUR-D-73:** Soft warnings não falham a build por padrão.
- **CUR-D-74:** Soft warnings devem orientar revisão curatorial e promoção controlada do seed v2.
- **CUR-D-75:** Ambiguidades só viram erro se forem promovidas sem aprovação manual.

---

## Deferred Until Planning/Execution Approval

- `08-01-PLAN.md`
- `08-VALIDATION.md`
- `08-PATTERNS.md`
- `08-RESEARCH.md`
- Code changes
- Compiled artifact changes

`08-CONTEXT.md` was created after initial discussion captured decisions `CUR-D-01` through `CUR-D-75`.
