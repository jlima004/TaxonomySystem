# Guia operacional do read model olfativo v2.11

> ⚠️ **Read model derivado — não é publicação oficial da taxonomia**
>
> `data/read-models/olfactory-graph/v2.11/graph.json` é um read model derivado para consulta, documentação e consumo futuro por agentes/RAG. Ele não é um artefato oficial de publicação da taxonomia compilada, não promove nenhuma verdade curatorial nova e não substitui nem altera `data/compiled/v2/*`. A verdade operacional da Layer 1 continua nos artefatos compilados protegidos e nas fontes curatoriais já existentes.

Este guia é a referência operacional para mantenedores que precisam entender como o grafo olfativo v2.11 é gerado, validado e usado como evidência estática. O contrato completo de schema, invariantes, prefixos e limites permanece em [`docs/olfactory_graph_contract.md`](./olfactory_graph_contract.md); este documento resume o fluxo de uso e aponta para as provas existentes, sem duplicar todas as tabelas do contrato.

## 1. Escopo do read model

O read model `olfactory_graph_read_model.v1` organiza a taxonomia olfativa compilada em uma forma de grafo estático, com nós e relações derivados de artefatos v2 já protegidos.

- **Nós:** `family`, `subfamily`, `descriptor`, `alias`.
- **Relações:** `contains_subfamily`, `contains_descriptor`, `resolves_to`, `similar_to`.
- **IDs globais:** prefixos `family:`, `subfamily:`, `descriptor:` e `alias:` preservam a diferença entre tipos que compartilham nomes ou IDs brutos.
- **Semântica:** o grafo reflete a taxonomia compilada existente; ele não resolve filas curatoriais, não promove candidatos e não recalcula similaridade.

Para detalhes normativos como propriedades obrigatórias, formato de edge ID, invariantes estruturais e prefixos proibidos, use o contrato estático: [`docs/olfactory_graph_contract.md`](./olfactory_graph_contract.md).

## 2. Entradas permitidas e limites protegidos

O workflow de produção lê apenas os artefatos compilados v2 já sancionados:

| Entrada permitida | Papel no grafo |
|-------------------|----------------|
| `data/compiled/v2/taxonomy.json` | Fonte de `family`, `subfamily`, `descriptor`, `contains_subfamily` e `contains_descriptor`. |
| `data/compiled/v2/descriptor_aliases.json` | Fonte de nós `alias` e edges `resolves_to`. |
| `data/compiled/v2/similarity_matrix.json` | Fonte de edges `similar_to` entre subfamílias, preservando `score`, `dimensions`, `evidence` e `final_score` quando presente. |

Ficam fora do escopo operacional deste read model:

- `data/taxonomy/**` como fonte de mutação ou curadoria;
- `data/inference/**` como camada de inferência nova;
- `graphify-out/**` como entrada ou saída;
- `data/enriched_materials.json` como quarto insumo de produção;
- qualquer runtime, API, SaaS, banco de dados ou agente em execução.

## 3. Artefato de saída

O caminho sancionado para o artefato estático é:

```text
data/read-models/olfactory-graph/v2.11/graph.json
```

## 9. Nota conceitual para Neo4J futuro

Esta seção é apenas um mapa conceitual para uma exportação futura. A v2.11 não entrega banco de dados, runtime, API, driver, job de importação, CSV, Cypher executável, Docker ou testes de integração com Neo4J. Qualquer materialização em banco pertence a requisitos futuros como `GDB-01`/`GDB-02` e deve preservar o contrato estático do read model.

### 9.1 Nós do grafo → labels conceituais

| Graph node kind | Label conceitual em Neo4J | Orientação de propriedades |
|-----------------|---------------------------|----------------------------|
| `family` | `Family` | Manter `id` com prefixo `family:` e preservar o ID bruto como propriedade de domínio. |
| `subfamily` | `Subfamily` | Manter `id` com prefixo `subfamily:` e preservar vínculo com `family_id`. |
| `descriptor` | `Descriptor` | Manter `id` com prefixo `descriptor:` e preservar metadados de status, revisão e origem. |
| `alias` | `Alias` | Manter `id` com prefixo `alias:` e preservar o alvo em `target_descriptor_id`. |

### 9.2 Edges do grafo → relationship types conceituais

| Graph edge kind | Relationship type conceitual | Semântica preservada |
|-----------------|------------------------------|----------------------|
| `contains_subfamily` | `CONTAINS_SUBFAMILY` | Família contém subfamília compilada. |
| `contains_descriptor` | `CONTAINS_DESCRIPTOR` | Subfamília contém descriptor compilado. |
| `resolves_to` | `RESOLVES_TO` | Alias compilado resolve para descriptor alvo. |
| `similar_to` | `SIMILAR_TO` | Similaridade entre subfamílias preservando `score`, `dimensions`, `evidence` e `final_score` quando presente. |

### 9.3 Prefixos de ID → orientação de propriedades

| Prefixo global | Tipo protegido | Orientação futura |
|----------------|----------------|-------------------|
| `family:` | `family` | Usar como identidade global de nó; não remover prefixo ao importar. |
| `subfamily:` | `subfamily` | Usar como identidade global de nó e manter relação explícita com família. |
| `descriptor:` | `descriptor` | Usar como identidade global de nó para evitar colisões com aliases ou subfamílias. |
| `alias:` | `alias` | Usar como identidade global de nó; resolução deve continuar vindo de `resolves_to`. |

## 10. Recapitulação de fronteiras

Phase 59 documenta e fecha evidência; não cria novas capacidades de grafo. O escopo final permanece:

- `docs/olfactory_graph_read_model.md` é o guia operacional único; o contrato normativo continua em `docs/olfactory_graph_contract.md`.
- Exemplos de `query_kind` vêm de `src/tests/graph_read_model/query_graph.test.ts`, não de uma execução nova contra `graph.json`.
- Artefatos persistidos de provas de consulta continuam fora de escopo; os exemplos permanecem embutidos neste guia e rastreados aos testes.
- Neo4J permanece apenas como mapeamento conceitual, sem materialização técnica.
- `graphify-out/**` permanece desacoplado do read model v2.11.
- `data/taxonomy/**`, `data/compiled/v2/**` e `data/inference/**` não são mutados por documentação, fechamento ou consulta.
- `data/read-models/olfactory-graph/v2.11/graph.json` é um read model derivado, não publicação oficial da taxonomia e não upgrade de verdade curatorial.

O arquivo segue a forma pura `OlfactoryGraph`:

```json
{
  "schema_version": "olfactory_graph_read_model.v1",
  "nodes": [],
  "edges": [],
  "stats": {}
}
```

`/tmp` pode ser usado apenas para suporte de verificação, por exemplo em dry runs. Saídas sob `data/compiled/`, `data/taxonomy/`, `data/inference/` ou `graphify-out/` são proibidas pelo contrato e pelos testes do writer.

## 4. Workflow do operador: `graph:build`

O comando documentado para o mantenedor é:

```bash
npm --prefix src run graph:build
```

O help da CLI (`src/cli/graph_read_model.ts`) descreve o fluxo oficial:

1. Carregar os inputs compilados v2 (`taxonomy`, `aliases`, `similarity`).
2. Construir o `OlfactoryGraph` em memória.
3. Validar o grafo com `validateSanctionedV211Graph(graph)`.
4. Escrever `graph.json` no caminho sancionado.
5. Executar auditoria SHA-256 de fronteira sobre arquivos protegidos.
6. Rodar os guardrails GVAL-05: `typecheck`, `test`, `alias:integrity`, `verify:integrity`.

O wrapper sancionado usa `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE` como baseline autoritativo do artefato `v2.11`. Esta etapa documenta apenas o workflow de build/validação; o comportamento fail-closed de consumo de query permanece fora do escopo da Phase 60.

Para inspeção automatizada, `--json` imprime uma prova estruturada com estes campos de topo:

```json
{
  "ok": true,
  "graph_output": "data/read-models/olfactory-graph/v2.11/graph.json",
  "boundary_audit": {
    "ok": true,
    "protected_files": [
      {
        "path": "data/taxonomy/taxonomy-seed.v2.json",
        "unchanged": true,
        "sha256_before": "...",
        "sha256_after": "..."
      }
    ],
    "graphify_out_accesses": 0,
    "output_written": "data/read-models/olfactory-graph/v2.11/graph.json",
    "forbidden_prefix_rejections": []
  },
  "guardrails": {
    "passed": true,
    "results": [
      {
        "name": "typecheck",
        "exitCode": 0,
        "output": "..."
      }
    ]
  }
}
```

O exemplo acima é um recorte representativo para documentação: os campos de topo vêm da CLI, enquanto listas internas podem variar conforme a execução. A prova de fronteira é impressa no stdout e não cria sidecars de auditoria.

## 5. Evidência canônica de regressão

As provas de regressão são os testes existentes; Phase 59 apenas indexa e explica o que eles já cobrem.

| Arquivo de teste | Prova operacional |
|------------------|-------------------|
| `src/tests/graph_read_model/live_artifact_baseline.test.ts` | `build + validate` a partir do catálogo v2 vivo e confirma `baseline stats` 10/18/341/18/13. |
| `src/tests/graph_read_model/query_live_baseline.test.ts` | Executa `aggregate query` proofs sobre o catálogo completo e valida escala de famílias, aliases, bridges e hub. |
| `src/tests/graph_read_model/write_graph.test.ts` | Cobre `writer path` policy, rejeição de prefixos proibidos e `atomic output` com formato determinístico. |
| `src/tests/graph_read_model/boundary_audit.test.ts` | Prova comportamento de auditoria `SHA-256`, detecção de mutação e isolamento de `graphify-out/**`. |
| `src/tests/cli/graph_read_model.test.ts` | Verifica `CLI integration` para `graph:build`, `--help`, `--json`, `--dry-run` e política de output. |

## 6. Linha de base `GRAPH_EXPECTED_BASELINE_STATS`

Os números abaixo vêm de `GRAPH_EXPECTED_BASELINE_STATS` em `src/graph_read_model/contract.ts` e são confirmados por regressão em `src/tests/graph_read_model/live_artifact_baseline.test.ts`.

| Métrica | Valor esperado | Campo em `GRAPH_EXPECTED_BASELINE_STATS` | Teste de regressão | O que prova |
|---------|----------------|------------------------------------------|--------------------|-------------|
| Famílias | `10` | `families` | `live_artifact_baseline.test.ts` | O grafo preserva a contagem de famílias do baseline v2 protegido. |
| Subfamílias | `18` | `subfamilies` | `live_artifact_baseline.test.ts` | A hierarquia compilada família → subfamília permanece completa. |
| Descritores | `341` | `descriptors` | `live_artifact_baseline.test.ts` | Nenhum descriptor compilado desaparece durante a projeção para grafo. |
| Aliases | `18` | `aliases` | `live_artifact_baseline.test.ts` | Os aliases compilados continuam resolvidos como edges `resolves_to`. |
| Similaridades de subfamília | `13` | `subfamily_similarity_edges` | `live_artifact_baseline.test.ts` | A matriz de similaridade continua representada apenas como edges `similar_to` entre subfamílias. |

## 7. Validação operacional

Para uma checagem de documentação e regressão sem escrever novo artefato oficial, mantenedores podem usar os testes direcionados já existentes:

```bash
npm --prefix src run typecheck
npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/graph_read_model/write_graph.test.ts tests/graph_read_model/boundary_audit.test.ts tests/cli/graph_read_model.test.ts
```

Esses comandos provam que o código citado por este guia ainda compila, que as query proofs estáveis continuam determinísticas e que o read model preserva o baseline protegido.

## 8. Query proofs copiadas dos testes

As oito provas abaixo são exemplos estáveis para consumo humano e futuro uso por agentes/RAG. Elas foram transcritas dos objetos esperados em `src/tests/graph_read_model/query_graph.test.ts`; `src/tests/graph_read_model/query_live_baseline.test.ts` serve apenas como evidência de escala agregada: 10 famílias percorridas, 18 aliases resolvidos, 5 bridges entre famílias no catálogo completo e hub `floral_rose` com grau 3.

| GQRY requirement | Function name | `query_kind` | Example params | Source test |
|------------------|---------------|--------------|----------------|-------------|
| GQRY descriptors por família | `getDescriptorsByFamily` | `descriptors_by_family` | `{ "family_id": "woody" }` | `src/tests/graph_read_model/query_graph.test.ts` |
| GQRY descriptors por subfamília | `getDescriptorsBySubfamily` | `descriptors_by_subfamily` | `{ "subfamily_id": "woody_dry" }` | `src/tests/graph_read_model/query_graph.test.ts` |
| GQRY resolução de alias | `resolveAliasPath` | `alias_resolution_path` | `{ "alias": "cedar" }` | `src/tests/graph_read_model/query_graph.test.ts` |
| GQRY caminho descriptor → família | `getDescriptorToFamilyPath` | `descriptor_to_family_path` | `{ "descriptor_id": "cedarwood" }` | `src/tests/graph_read_model/query_graph.test.ts` |
| GQRY descriptors relacionados | `getRelatedDescriptors` | `related_descriptors` | `{ "descriptor_id": "cedarwood" }` | `src/tests/graph_read_model/query_graph.test.ts` |
| GQRY vizinhança de similaridade | `getSimilarityNeighborhood` | `similarity_neighborhood` | `{ "subfamily_id": "floral_rose" }` | `src/tests/graph_read_model/query_graph.test.ts` |
| GQRY bridges entre famílias | `getCrossFamilyBridges` | `cross_family_bridges` | `{}` | `src/tests/graph_read_model/query_graph.test.ts` |
| GQRY hub de similaridade | `getSimilarityHub` | `similarity_hub` | `{}` | `src/tests/graph_read_model/query_graph.test.ts` |

### 8.1 `descriptors_by_family`

Exemplo para `getDescriptorsByFamily(graph, "woody")`: retorna os 18 descriptors da família `woody`, ordenados por `id`, preservando status, origem e flags de revisão.

```json
{
  "query_kind": "descriptors_by_family",
  "params": { "family_id": "woody" },
  "result": {
    "descriptors": [
      { "id": "agarwood", "graph_id": "descriptor:agarwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "camphoreous", "graph_id": "descriptor:camphoreous", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "cashew", "graph_id": "descriptor:cashew", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "cedarwood", "graph_id": "descriptor:cedarwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "copaiba", "graph_id": "descriptor:copaiba", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "coriander", "graph_id": "descriptor:coriander", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "earthy", "graph_id": "descriptor:earthy", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "oakmoss", "graph_id": "descriptor:oakmoss", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "patchouli", "graph_id": "descriptor:patchouli", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "pine", "graph_id": "descriptor:pine", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "rooty", "graph_id": "descriptor:rooty", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "rosewood", "graph_id": "descriptor:rosewood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "sandalwood", "graph_id": "descriptor:sandalwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "sawdust", "graph_id": "descriptor:sawdust", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "thujonic", "graph_id": "descriptor:thujonic", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "tree_moss", "graph_id": "descriptor:tree_moss", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "vetiver", "graph_id": "descriptor:vetiver", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "woody", "graph_id": "descriptor:woody", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" }
    ]
  }
}
```

### 8.2 `descriptors_by_subfamily`

Exemplo para `getDescriptorsBySubfamily(graph, "woody_dry")`: recorta os 16 descriptors da subfamília `woody_dry` com a mesma ordenação determinística.

```json
{
  "query_kind": "descriptors_by_subfamily",
  "params": { "subfamily_id": "woody_dry" },
  "result": {
    "descriptors": [
      { "id": "agarwood", "graph_id": "descriptor:agarwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "camphoreous", "graph_id": "descriptor:camphoreous", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "cashew", "graph_id": "descriptor:cashew", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "cedarwood", "graph_id": "descriptor:cedarwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "copaiba", "graph_id": "descriptor:copaiba", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "coriander", "graph_id": "descriptor:coriander", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "earthy", "graph_id": "descriptor:earthy", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "patchouli", "graph_id": "descriptor:patchouli", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "pine", "graph_id": "descriptor:pine", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "rooty", "graph_id": "descriptor:rooty", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "rosewood", "graph_id": "descriptor:rosewood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "sandalwood", "graph_id": "descriptor:sandalwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "sawdust", "graph_id": "descriptor:sawdust", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "thujonic", "graph_id": "descriptor:thujonic", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "vetiver", "graph_id": "descriptor:vetiver", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "woody", "graph_id": "descriptor:woody", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" }
    ]
  }
}
```

### 8.3 `alias_resolution_path`

Exemplo para `resolveAliasPath(graph, "cedar")`: mostra o alias, o descriptor resolvido e o caminho hierárquico até família.

```json
{
  "query_kind": "alias_resolution_path",
  "params": { "alias": "cedar" },
  "result": { "target_descriptor_id": "cedarwood" },
  "path": [
    { "graph_id": "alias:cedar", "kind": "alias" },
    { "graph_id": "descriptor:cedarwood", "kind": "descriptor" },
    { "graph_id": "subfamily:woody_dry", "kind": "subfamily", "name": "Dry Woods" },
    { "graph_id": "family:woody", "kind": "family", "name": "Woody" }
  ]
}
```

### 8.4 `descriptor_to_family_path`

Exemplo para `getDescriptorToFamilyPath(graph, "cedarwood")`: parte do descriptor e retorna subfamília e família, com path explícito.

```json
{
  "query_kind": "descriptor_to_family_path",
  "params": { "descriptor_id": "cedarwood" },
  "result": { "family_id": "woody", "subfamily_id": "woody_dry" },
  "path": [
    { "graph_id": "descriptor:cedarwood", "kind": "descriptor" },
    { "graph_id": "subfamily:woody_dry", "kind": "subfamily", "name": "Dry Woods" },
    { "graph_id": "family:woody", "kind": "family", "name": "Woody" }
  ]
}
```

### 8.5 `related_descriptors`

Exemplo para `getRelatedDescriptors(graph, "cedarwood")`: retorna outros descriptors da mesma subfamília, excluindo o próprio `cedarwood`.

```json
{
  "query_kind": "related_descriptors",
  "params": { "descriptor_id": "cedarwood" },
  "result": {
    "descriptors": [
      { "id": "agarwood", "graph_id": "descriptor:agarwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "camphoreous", "graph_id": "descriptor:camphoreous", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "cashew", "graph_id": "descriptor:cashew", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "copaiba", "graph_id": "descriptor:copaiba", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "coriander", "graph_id": "descriptor:coriander", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "earthy", "graph_id": "descriptor:earthy", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "patchouli", "graph_id": "descriptor:patchouli", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "pine", "graph_id": "descriptor:pine", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "rooty", "graph_id": "descriptor:rooty", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "rosewood", "graph_id": "descriptor:rosewood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "sandalwood", "graph_id": "descriptor:sandalwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "sawdust", "graph_id": "descriptor:sawdust", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "thujonic", "graph_id": "descriptor:thujonic", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" },
      { "id": "vetiver", "graph_id": "descriptor:vetiver", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "woody", "graph_id": "descriptor:woody", "status": "candidate", "review_required": true, "corpus_derived": true, "source": "corpus" }
    ]
  }
}
```

### 8.6 `similarity_neighborhood`

Exemplo para `getSimilarityNeighborhood(graph, "floral_rose")`: lista vizinhos bidirecionais já colapsados, ordenados por score efetivo.

```json
{
  "query_kind": "similarity_neighborhood",
  "params": { "subfamily_id": "floral_rose" },
  "result": {
    "neighbors": [
      {
        "neighbor_id": "woody_dry",
        "neighbor_graph_id": "subfamily:woody_dry",
        "score": 0.3055555555555556,
        "final_score": 0.3055555555555556,
        "dimensions": { "semantic_overlap": 0, "tradition": 0.65, "accord_compatibility": 0.75 },
        "evidence": { "cooccurrence_support": 21, "curated_relation": "cross_family_tradition_bridge", "accord_reference": "strong_accord_pair" },
        "direction": "outbound"
      },
      {
        "neighbor_id": "woody_mossy",
        "neighbor_graph_id": "subfamily:woody_mossy",
        "score": 0.2972222222222222,
        "final_score": 0.2972222222222222,
        "dimensions": { "semantic_overlap": 0, "tradition": 0.65, "accord_compatibility": 0.7 },
        "evidence": { "curated_relation": "cross_family_tradition_bridge", "accord_reference": "compatible_accord_pair" },
        "direction": "outbound"
      },
      {
        "neighbor_id": "floral_white",
        "neighbor_graph_id": "subfamily:floral_white",
        "score": 0.2833333333333333,
        "final_score": 0.2833333333333333,
        "dimensions": { "semantic_overlap": 0, "tradition": 0.85 },
        "evidence": { "cooccurrence_support": 25, "curated_relation": "same_family_tradition" },
        "direction": "outbound"
      }
    ]
  }
}
```

### 8.7 `cross_family_bridges`

Exemplo para `getCrossFamilyBridges(graph)`: no fixture mínimo, retorna duas bridges entre `floral` e `woody`; no catálogo vivo, `query_live_baseline.test.ts` confirma 5 bridges.

```json
{
  "query_kind": "cross_family_bridges",
  "params": {},
  "result": {
    "bridges": [
      {
        "source_subfamily_id": "floral_rose",
        "target_subfamily_id": "woody_dry",
        "source_family_id": "floral",
        "target_family_id": "woody",
        "score": 0.3055555555555556,
        "final_score": 0.3055555555555556,
        "dimensions": { "semantic_overlap": 0, "tradition": 0.65, "accord_compatibility": 0.75 },
        "evidence": { "cooccurrence_support": 21, "curated_relation": "cross_family_tradition_bridge", "accord_reference": "strong_accord_pair" }
      },
      {
        "source_subfamily_id": "floral_rose",
        "target_subfamily_id": "woody_mossy",
        "source_family_id": "floral",
        "target_family_id": "woody",
        "score": 0.2972222222222222,
        "final_score": 0.2972222222222222,
        "dimensions": { "semantic_overlap": 0, "tradition": 0.65, "accord_compatibility": 0.7 },
        "evidence": { "curated_relation": "cross_family_tradition_bridge", "accord_reference": "compatible_accord_pair" }
      }
    ]
  }
}
```

### 8.8 `similarity_hub`

Exemplo para `getSimilarityHub(graph)`: seleciona `floral_rose` por maior grau, com desempate lexicográfico determinístico.

```json
{
  "query_kind": "similarity_hub",
  "params": {},
  "result": {
    "hub": {
      "subfamily_id": "floral_rose",
      "graph_id": "subfamily:floral_rose",
      "family_id": "floral",
      "degree": 3
    }
  }
}
```
