# Phase 57: Query Proofs - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-10
**Phase:** 57-Query Proofs
**Areas discussed:** Layout do módulo, Formato das provas, Semântica de vizinhança, Related descriptors, Seleção de exemplos, Estratégia de testes

---

## Operator Pre-Locks (before area selection)

**User's choice:** Hard exclusions provided at command start
**Notes:** Phase 57 must consume OlfactoryGraph in memory; no CLI, writer, data/read-models output, Neo4J, Graphify, runtime/API/SaaS, Material nodes, new scoring/similarity, or taxonomy/compiled/inference mutation. Focus = deterministic query proofs, not infrastructure.

---

## Layout do módulo

| Option | Description | Selected |
|--------|-------------|----------|
| Um único `query_graph.ts` | Espelha build/validate; queries puras num só lugar | ✓ |
| Split por categoria | `query_descriptors.ts`, `query_aliases.ts`, `query_similarity.ts` | |
| Core + helpers | `query_graph.ts` + `query_indexes.ts` | |

| Option | Description | Selected |
|--------|-------------|----------|
| Funções nomeadas por prova | `getDescriptorsByFamily()`, `resolveAliasPath()`, etc. | ✓ |
| Traversal genérico | `walkEdges`, `findNodesByKind` nos testes | |
| Query builder fluente | `createGraphQueries(graph).descriptors.byFamily(id)` | |

| Option | Description | Selected |
|--------|-------------|----------|
| Assume graph validado | Queries recebem graph pós-validate; testes garantem | ✓ |
| Auto-valida internamente | Cada query chama validate | |
| Sem pré-condição | Comportamento indefinido se inválido | |

| Option | Description | Selected |
|--------|-------------|----------|
| Índices efêmeros por chamada | Map temporário; graph sem índices persistidos | ✓ |
| Linear scan | Sem índices; filtra arrays | |
| Index builder compartilhado | `buildGraphIndex(graph)` passado entre queries | |

**User's choice:** Single module, named functions, assume validated graph, ephemeral indexes per call.

---

## Formato das provas

| Option | Description | Selected |
|--------|-------------|----------|
| Objeto tipado de prova | `{ query_kind, params, result, path }` em types.ts | ✓ |
| Nodes/edges crus | Arrays filtrados de GraphNode/GraphEdge | |
| Apenas paths | Arrays de IDs percorridos | |

| Option | Description | Selected |
|--------|-------------|----------|
| Ordenação explícita e testada | Regra fixa; build+query 2x → deep equal | ✓ |
| Herdar ordem do graph | Passthrough da ordem do OlfactoryGraph | |
| Set sem ordem | Testes ignoram ordem | |

| Option | Description | Selected |
|--------|-------------|----------|
| Propriedades relevantes ao GQRY | status, review_required, corpus_derived, source; similarity score/dimensions/evidence | ✓ |
| Mínimo — apenas IDs | |
| Propriedades completas | Todo properties copiado | |

| Option | Description | Selected |
|--------|-------------|----------|
| Campo `query_kind` estável | descriptors_by_family, alias_resolution_path, etc. | ✓ |
| Nome da função basta | Sem campo extra | |
| ID de prova único | proof:descriptors_by_family:woody | |

**User's choice:** Typed proof objects with stable query_kind; GQRY-relevant properties only; explicit deterministic sorting with build+query twice tests.

---

## Semântica de vizinhança

| Option | Description | Selected |
|--------|-------------|----------|
| 1-hop apenas | Vizinhos diretos via similar_to | ✓ |
| 2-hop | Vizinhos dos vizinhos | |
| Profundidade configurável | Parâmetro depth | |

| Option | Description | Selected |
|--------|-------------|----------|
| Grau de conexão (degree) | Mais edges similar_to; empate por id | ✓ |
| Score-weighted | Soma dos scores incidentes | |
| Hub fixo por exemplar | Subfamílias conhecidas apenas | |

| Option | Description | Selected |
|--------|-------------|----------|
| Edge cross-family direta | similar_to entre subfamílias de famílias diferentes | ✓ |
| Caminho via similarity | 2-hop indireto | |
| Ambos | Direta + indireta | |

| Option | Description | Selected |
|--------|-------------|----------|
| Score desc, depois id | Usa score/final_score existente | ✓ |
| Apenas por id | Ignora score | |
| Por family_id, depois id | Agrupa por família | |

**User's choice:** 1-hop neighborhoods; hub = max degree; cross-family bridge = direct similar_to across families; sort by score desc then id.

---

## Related descriptors

| Option | Description | Selected |
|--------|-------------|----------|
| Mesma subfamília | Compartilham subfamily_id; exclui self | ✓ |
| Mesma família | Todos sob family_id | |
| Dois níveis | same_subfamily + same_family separados | |

| Option | Description | Selected |
|--------|-------------|----------|
| Todos os status | Inclui curated e corpus_derived; mostra status no resultado | ✓ |
| Apenas curated | Exclui corpus_derived/review_required | |
| Grupos separados | curated e review_required em arrays distintos | |

| Option | Description | Selected |
|--------|-------------|----------|
| Cadeia completa com nomes | descriptor → subfamily → family | ✓ |
| IDs apenas | |
| Edge traversal | Lista de edges percorridos | |

| Option | Description | Selected |
|--------|-------------|----------|
| Sem limite | Todos da subfamília; ordenar por id | ✓ |
| Top N | Limitar por frequency | |
| Amostra fixa | Apenas exemplares conhecidos | |

**User's choice:** Same-subfamily related descriptors; all statuses; full named path chain; no limit with lexicographic sort.

---

## Seleção de exemplos

| Option | Description | Selected |
|--------|-------------|----------|
| Representativas + agregados | Inline exemplars + live aggregate catalog | ✓ |
| Apenas representativas | Exemplares fixos sem varrer baseline | |
| Exaustivo | Prova individual para cada entidade | |

| Option | Description | Selected |
|--------|-------------|----------|
| IDs do baseline v2 | woody, alias real, subfamília cross-family; hardcoded | ✓ |
| Fixtures sintéticos mínimos | Independentes do baseline | |
| Agent decide | Planner escolhe | |

| Option | Description | Selected |
|--------|-------------|----------|
| Catálogo completo no live | 10 families, 18 aliases, all neighborhoods, 1 hub, all bridges | ✓ |
| Apenas stats | Contagens sem conteúdo | |
| Spot-check | Amostra parcial | |

| Option | Description | Selected |
|--------|-------------|----------|
| Mapeamento 1:1 GQRY → funções | Documentado no CONTEXT/plano | ✓ |
| Agrupado | Funções combinam GQRYs | |
| Test-driven | Sem mapeamento formal | |

**User's choice:** Hybrid coverage; stable v2 IDs in inline fixtures; full aggregate catalog in live regression; explicit GQRY-to-function mapping (corrected in CONTEXT.md to align GQRY-03/04 with REQUIREMENTS).

---

## Estratégia de testes

| Option | Description | Selected |
|--------|-------------|----------|
| Híbrido | Inline fixtures + live regression read-only | ✓ |
| Apenas inline | Sem artifacts live | |
| Apenas live | Sem fixtures sintéticos | |

| Option | Description | Selected |
|--------|-------------|----------|
| Snapshot + estrutural | Inline snapshot exato; live counts + ordenação + amostras | ✓ |
| Snapshot completo no live | JSON.stringify de todo catálogo | |
| Apenas estrutural | Shape/counts sem snapshots | |

| Option | Description | Selected |
|--------|-------------|----------|
| build+validate+query 2x | Deep equal; espelha Phase 56 | ✓ |
| query 2x no mesmo graph | Sem rebuild | |
| Ambos | Rebuild e re-query | |

| Option | Description | Selected |
|--------|-------------|----------|
| `query_graph.test.ts` + `query_live_baseline.test.ts` | Espelha padrão Phase 56 | ✓ |
| Um único arquivo | Inline + live juntos | |
| Um arquivo por query | Split por query | |

**User's choice:** Hybrid tests; snapshot+structural assertions; build+validate+query twice determinism; two test files mirroring Phase 56.

---

## Agent Discretion

- Exact TypeScript types per `result` payload variant
- Specific inline exemplar IDs beyond woody / cross-family hints
- Internal helper sharing between family/subfamily descriptor queries
- `path` undefined vs empty array for non-traversal queries

## Deferred Ideas

- CLI, writer, read-models output — Phase 58
- Boundary audit — Phase 58
- Maintainer docs with query examples — Phase 59
- Multi-hop similarity, same-family related tier, Material nodes, agent runtime — future milestones
