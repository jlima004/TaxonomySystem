# Phase 35 — Context: Review Queue Inventory

**Date:** 2026-05-28
**Baseline:** Post-v2.5.0 (Phase 34 complete)

## Overall Review Queue State
Total items na review queue (`data/compiled/v2/similarity_matrix.json`): **309**

| Type | Count |
|---|---|
| `corpus_candidate_low_support` | 278 |
| `seed_corpus_conflict` | 31 |

*(Na Phase 22, tínhamos 316 itens no total: 282 low_support, 34 conflitos. O total caiu em 7 itens devido às curadorias executadas nas Phases 23 a 34).*

## Seed-Corpus Conflict Tracking

### Conflitos que Desapareceram (Resolvidos / Promovidos)
Quatro (4) itens de conflito da baseline da Phase 22 foram eliminados por ações recentes:
1. `ambergri` (conflitava com `amber`) — Resolvido: Mutado para `ambergris` (agora um target próprio).
2. `cedar` (conflitava com `cedarwood`) — Resolvido: Alias mutado para `cedarwood`.
3. `boi_de_rose` (conflitava com `rose`) — Resolvido: Tratado na curadoria de rosewood (mutação aplicada/resolvida).
4. `lemon_peel` (conflitava com `lemon`) — Resolvido: Promovido a seed target independente.

### Novos Conflitos Introduzidos
Um (1) novo conflito surgiu como consequência natural de uma promoção a seed:
1. `peel` (conflita com `lemon_peel`): Ao promover `lemon_peel` a seed, o token de corpus genérico `peel` (que já existia) se tornou um conflito de substring. Similar ao caso de `grain` vs `petitgrain`. Classificação primária: `accepted_with_policy` (noise artifact).

### Conflitos Remanescentes (31 itens)

#### Grupo A — Provável noise/stopword/policy artifact (13 tokens)
Tokens unigramas hipergenéricos cuja presença na lista de conflitos é artefato de substring matching, não de ambiguidade semântica real. Candidatos a tratamento em lote via Noise/Stopword Pipeline:

`sweet`, `fruit`, `berry`, `wood`, `peel`, `leaf`, `grain`, `raw`, `black`, `bitter`, `orange`, `apple`, `pine`

#### Grupo B — Resíduos que merecem microcuradoria ou decisão explícita (18 itens)
Casos onde há sobreposição semântica real entre targets/aliases, ou compostos que precisam de decisão sobre identidade taxonômica:

| Conflito | Contexto |
|---|---|
| `clover` vs `clove` | Semântica distinta (trevo vs cravo), exige alias guard |
| `lemongrass` vs `lemon` | Target composto legítimo, requer decisão de identidade |
| `rosemary` vs `rose` | Semântica distinta (alecrim vs rosa), exige alias guard |
| `grapefruit_peel` | Composto legítimo, avaliar promoção ou alias |
| `banana_peel` | Composto legítimo, avaliar promoção ou alias |
| `melon_rind` | Composto legítimo, avaliar promoção ou alias |
| `watermelon` | Target composto com `melon`, avaliar identidade |
| `watermelon_rind` | Composto legítimo, avaliar promoção ou alias |
| `tomato` | Conflita com `tomato_leaf`, avaliar identidade |
| `orange_bitter_orange` | Variante de `bitter_orange`, avaliar normalização |
| `rose_dried_rose` | Variante de `rose`, avaliar promoção ou alias |
| `rose_red_rose` | Variante de `rose`, avaliar promoção ou alias |
| `rose_tea_rose` | Variante de `rose`, avaliar promoção ou alias |
| `lily` | Conflito legítimo com `lily_of_the_valley` |
| `grape` | Conflito com `grapefruit`, substring |
| `melon_unripe_melon` | Variante de `melon`, avaliar normalização |
| `banana_ripe_banana` | Variante de `banana`, avaliar normalização |
| `banana_unripe_banana` | Variante de `banana`, avaliar normalização |

#### Referência: Mapa detalhado por seed target
Os conflitos abaixo permanecem ativos, aguardando tratamento (aceitação formal, noise list, ou mutação):
- **bitter_orange** (3): bitter, orange, orange_bitter_orange
- **grapefruit** (3): fruit, grape, grapefruit_peel
- **petitgrain** (1): grain
- **lemon** (1): lemongrass (lemon_peel resolvido)
- **lemon_peel** (1): peel (NOVO conflito de substring)
- **sweet_orange** (1): sweet
- **rose** (4): rose_dried_rose, rose_red_rose, rose_tea_rose, rosemary (boi_de_rose resolvido)
- **lily_of_the_valley** (1): lily
- **melon** (4): melon_rind, melon_unripe_melon, watermelon, watermelon_rind
- **blackberry** (2): berry, black
- **strawberry** (1): raw
- **pineapple** (2): apple, pine
- **banana** (3): banana_peel, banana_ripe_banana, banana_unripe_banana
- **tomato_leaf** (2): leaf, tomato
- **clove** (1): clover
- **cedarwood** (1): wood (cedar resolvido)

## Low-Support Queue (278 itens)
A fila caiu de 282 para 278. Esta é a fila primária de "long tail". Não requer triagem de conflito de substring, mas representa volume massivo para curadoria.
