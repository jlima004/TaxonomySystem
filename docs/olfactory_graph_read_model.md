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
3. Validar a estrutura do grafo.
4. Escrever `graph.json` no caminho sancionado.
5. Executar auditoria SHA-256 de fronteira sobre arquivos protegidos.
6. Rodar os guardrails GVAL-05: `typecheck`, `test`, `alias:integrity`, `verify:integrity`.

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
