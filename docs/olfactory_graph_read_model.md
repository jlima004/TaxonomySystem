# Guia operacional do read model olfativo v2.11

> **Fence global (D-16, D-17):** Este guia documenta um graph read model **estatico, read-only e zero-dependency**. Ele nao define runtime de agente, API, servico HTTP, banco de dados, Neo4J, Graphify, publicacao automatica, persistencia de proofs nem comandos publicos de query. `graph:build` e um workflow de build/validacao/escrita/auditoria; `graph.json` relido e apenas artefato cru ate passar por `asValidatedGraph(graph)`; queries futuras devem usar `createValidatedQueryConsumer(validatedGraph)`; e os exemplos deste guia nao constituem novas APIs alem das superficies ja implementadas.

> ⚠️ **Read model derivado — nao e publicacao oficial da taxonomia**
>
> `data/read-models/olfactory-graph/v2.11/graph.json` e um read model derivado para consulta, documentacao e consumo futuro por agentes/RAG. Ele nao e um artefato oficial de publicacao da taxonomia compilada, nao promove nenhuma verdade curatorial nova e nao substitui nem altera `data/compiled/v2/*`. A verdade operacional da Layer 1 continua nos artefatos compilados protegidos e nas fontes curatoriais ja existentes.

Este guia e a referencia operacional para mantenedores que precisam entender como o grafo olfativo v2.11 e gerado, validado e consumido como evidencia estatica. O contrato completo de schema, invariantes, prefixos e limites permanece em [`docs/olfactory_graph_contract.md`](./olfactory_graph_contract.md); este documento resume o fluxo de uso e aponta para as provas existentes, sem duplicar todas as tabelas do contrato.

## 1. Escopo, audiencia e fences

O read model `olfactory_graph_read_model.v1` organiza a taxonomia olfativa compilada em uma forma de grafo estatico, com nos e relacoes derivados de artefatos v2 ja protegidos.

- **Nos:** `family`, `subfamily`, `descriptor`, `alias`.
- **Relacoes:** `contains_subfamily`, `contains_descriptor`, `resolves_to`, `similar_to`.
- **IDs globais:** prefixos `family:`, `subfamily:`, `descriptor:` e `alias:` preservam a diferenca entre tipos que compartilham nomes ou IDs brutos.
- **Semantica:** o grafo reflete a taxonomia compilada existente; ele nao resolve filas curatoriais, nao promove candidatos e nao recalcula similaridade.

**Entradas permitidas:**

| Entrada permitida | Papel no grafo |
|-------------------|----------------|
| `data/compiled/v2/taxonomy.json` | Fonte de `family`, `subfamily`, `descriptor`, `contains_subfamily` e `contains_descriptor`. |
| `data/compiled/v2/descriptor_aliases.json` | Fonte de nos `alias` e edges `resolves_to`. |
| `data/compiled/v2/similarity_matrix.json` | Fonte de edges `similar_to` entre subfamilias, preservando `score`, `dimensions`, `evidence` e `final_score` quando presente. |

**Fora de escopo:**

- `data/taxonomy/**` como fonte de mutacao ou curadoria;
- `data/inference/**` como camada de inferencia nova;
- `graphify-out/**` como entrada ou saida;
- `data/enriched_materials.json` como quarto insumo de producao;
- qualquer runtime, API, SaaS, banco de dados, Neo4J, Graphify ou agente em execucao.

**Artefato de saida:** `data/read-models/olfactory-graph/v2.11/graph.json`

O arquivo segue a forma pura `OlfactoryGraph`:

```json
{
  "schema_version": "olfactory_graph_read_model.v1",
  "nodes": [],
  "edges": [],
  "stats": {}
}
```

`/tmp` pode ser usado apenas para suporte de verificacao, por exemplo em dry runs. Saidas sob `data/compiled/`, `data/taxonomy/`, `data/inference/` ou `graphify-out/` sao proibidas pelo contrato e pelos testes do writer.

Para detalhes normativos como propriedades obrigatorias, formato de edge ID, invariantes estruturais e prefixos proibidos, use o contrato estatico: [`docs/olfactory_graph_contract.md`](./olfactory_graph_contract.md).

## 2. Mapa do fluxo completo

O ciclo de vida do artefato segue uma cadeia de confianca explicita. O guia ensina primeiro o workflow de producao do artefato, depois a fronteira de validacao que transforma dados crus em handle reutilizavel, e so entao o consumo via proofs tipadas. Essa ordem impede que `graph:build`, `graph.json` ou o consumer sejam lidos isoladamente como runtime, API ou servico publico.

**Cadeia de confianca:**

```
graph:build -> graph.json cru -> asValidatedGraph -> createValidatedQueryConsumer -> query proof
```

| Etapa | Status de confianca | O que acontece |
|-------|---------------------|----------------|
| `graph:build` | Workflow sancionado | Carrega inputs, constroi, valida, executa guardrails, escreve e audita. |
| `graph.json` cru | Artefato nao confiavel | Reler o arquivo produz um `OlfactoryGraph` cru sem prova de validacao. |
| `asValidatedGraph(graph)` | Fronteira de confianca | Executa `validateSanctionedV211Graph(graph)` e, se ok, retorna um handle `ValidatedGraph` brandado. |
| `createValidatedQueryConsumer(validatedGraph)` | Consumer fail-closed | Aceita apenas `ValidatedGraph`; rejeita handles nao validados com `graph_not_validated`. |
| Query proof | Resultado tipado | Retorna `{ query_kind, params, result, path? }` com semantica estavel por `query_kind`. |

## 3. Workflow operacional graph:build

> **Fence local (D-19):** `graph:build` e um workflow de build/validacao/escrita/auditoria. A CLI nao e runtime de query nem expoe as oito query proofs como comandos publicos.

O comando documentado para o mantenedor e:

```bash
npm --prefix src run graph:build
```

### Dry-run

```bash
npm --prefix src run graph:build -- --dry-run
```

Em modo `--dry-run`, `graph:build` escreve o artefato em um diretorio temporario unico por processo (`$TMPDIR/graph-read-model-dry-run-<pid>/`), pula a auditoria de fronteira e pula guardrails. Util para inspecao rapida sem efeitos colaterais.

### Non-dry-run: ordem operacional normativa

A ordem real de execucao no non-dry-run vem de `src/cli/sanctioned_graph_workflow.ts` (`runSanctionedGraphWorkflow`) e dos testes em `src/tests/cli/sanctioned_graph_workflow.test.ts`:

1. **Validar caminho de saida** — rejeita prefixos proibidos (`forbidden_path`).
2. **Capturar pre-digests SHA-256** — snapshot dos arquivos protegidos antes de qualquer operacao.
3. **Carregar inputs compilados v2** — `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`.
4. **Construir** `OlfactoryGraph` em memoria.
5. **Validar** com `validateSanctionedV211Graph(graph)` usando `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`.
6. **Executar guardrails GVAL-05** — `typecheck`, `test`, `alias:integrity`, `verify:integrity`.
7. **Escrever** `graph.json` no caminho sancionado.
8. **Executar auditoria de fronteira** SHA-256 sobre arquivos protegidos comparando com pre-digests.

> **Nota de divergencia documental/tecnica (follow-up):** O texto de help publico em `src/cli/graph_read_model.ts` (`printHelp`) descreve a ordem como `load -> build -> validate -> write -> audit -> guardrails`, o que diverge da ordem real implementada em `sanctioned_graph_workflow.ts` onde guardrails executam **antes** da escrita e a auditoria de fronteira executa **depois** da escrita. A ordem normativa e a do codigo (`sanctioned_graph_workflow.ts`), nao a do help text. A correcao do help text e um follow-up tecnico fora do escopo da Phase 63 (documentacao nao altera codigo).

### Contrato JSON publico

Para inspecao automatizada, `--json` imprime uma prova estruturada com estes campos de topo:

```json
{
  "ok": true,
  "graph_output": "data/read-models/olfactory-graph/v2.11/graph.json",
  "boundary_audit": { "ok": true, "protected_files": [], "graphify_out_accesses": 0, "output_written": "...", "forbidden_prefix_rejections": [] },
  "guardrails": { "passed": true, "results": [] }
}
```

Os quatro campos de topo — `ok`, `graph_output`, `boundary_audit`, `guardrails` — sao o contrato publico da CLI. A prova de fronteira e impressa no stdout e nao cria sidecars de auditoria. A CLI nao invoca nem expoe funcoes de query.

## 4. Validacao sancionada

> **Fence local (D-19):** Leitura de `graph.json` nao prova validacao. O arquivo relido e um `OlfactoryGraph` cru; a prova de validacao so existe apos sucesso de `asValidatedGraph(graph)` ou `validateSanctionedV211Graph(graph)`.

A validacao sancionada usa `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE` como baseline autoritativo. `validateSanctionedV211Graph(graph)` em `src/graph_read_model/validate_graph.ts` executa validacao estrutural e profile-aware, retornando `{ ok, errors, warnings }` com erros tipados e JSON-safe definidos em `src/graph_read_model/validation_errors.ts`.

```typescript
import { validateSanctionedV211Graph } from './validate_graph.js'

const result = validateSanctionedV211Graph(graph)
if (!result.ok) {
  // result.errors: readonly GraphValidationError[]
  // cada erro possui code, path, message, e opcionalmente invariant_id, expected, actual
}
```

Os erros de validacao sao deterministas e JSON-safe; eles incluem `code` (vocabulario tipado), `path` (JSON path), `message` (descricao legivel), e campos opcionais `invariant_id`, `expected` e `actual` para diagnostico estruturado.

## 5. ValidatedGraph

> **Fence local (D-19):** `ValidatedGraph` nao pode ser fabricado manualmente. Nao use cast, objeto manual ou acesso a marca interna. A unica origem sancionada e o sucesso de `asValidatedGraph(graph)`.

`asValidatedGraph(graph)` em `src/graph_read_model/query_consumer.ts` executa `validateSanctionedV211Graph(graph)` e, se valido, retorna um handle brandado `ValidatedGraph`. O brand e um `Symbol` privado que impede fabricacao externa.

```typescript
import { asValidatedGraph } from './query_consumer.js'

const validated = asValidatedGraph(graph)
if (validated.ok) {
  // validated.graph: ValidatedGraph — handle reutilizavel
} else {
  // validated.errors: readonly GraphValidationError[]
}
```

O `ValidatedGraph` carrega `graph` (o `OlfactoryGraph` original) e `validation_profile_id` (o perfil sancionado usado). Este handle e o unico argumento aceito por `createValidatedQueryConsumer`.

## 6. Consumer fail-closed

> **Fence local (D-19):** O consumer exige `createValidatedQueryConsumer(validatedGraph)`. Nao existe atalho como `createValidatedQueryConsumerFromGraph` nem acesso direto a `query_graph.ts` para integracoes agent/RAG.

`createValidatedQueryConsumer(validatedGraph)` em `src/graph_read_model/query_consumer.ts` verifica a marca interna do `ValidatedGraph`. Se o argumento nao for um handle validado, retorna `{ ok: false, error }` com `graph_not_validated`. Se valido, retorna `{ ok: true, consumer }` com oito metodos de query.

```typescript
import { createValidatedQueryConsumer } from './query_consumer.js'

const consumerResult = createValidatedQueryConsumer(validated.graph)
if (!consumerResult.ok) {
  // consumerResult.error.code === 'graph_not_validated'
}

const consumer = consumerResult.consumer
// consumer.getDescriptorsByFamily(familyId)
// consumer.getDescriptorsBySubfamily(subfamilyId)
// consumer.resolveAliasPath(alias)
// consumer.getDescriptorToFamilyPath(descriptorId)
// consumer.getRelatedDescriptors(descriptorId)
// consumer.getSimilarityNeighborhood(subfamilyId)
// consumer.getCrossFamilyBridges()
// consumer.getSimilarityHub()
```

Os oito metodos delegam para as primitives de `query_graph.ts`, mas o consumer encapsula a fronteira de confianca. Integracoes futuras agent/RAG devem usar este consumer, nao as funcoes de `query_graph.ts` diretamente.

## 7. Envelope seguro para agent/RAG

> **Fence local (D-19):** O envelope de proof nao e resposta de API, evento de runtime nem registro de banco de dados. Ele e um objeto TypeScript tipado retornado em memoria pelo consumer.

Cada query retorna um `GraphQueryProof<TKind, TParams, TResult>` com quatro campos:

```typescript
{
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}
```

O consumidor deve discriminar primeiro por `query_kind` e so entao interpretar `params`, `result` e `path` (D-05).

### Matriz de classificacao do envelope

| Campo | Classificacao | Uso permitido | Leitura proibida |
|-------|---------------|---------------|------------------|
| `query_kind` | **seguro e estavel** | Roteamento, selecao de parser, interpretacao do tipo de proof. | Nao ignorar nem substituir por heuristicas. |
| `params` | **seguro com cautela** | Correlacionar a resposta com a consulta executada; eco normalizado da solicitacao. | Nao tratar como evidencia semantica independente; nao inferir fatos ausentes do `result`. |
| `result` | **seguro e principal** | Payload autoritativo para consumo agent/RAG, respeitando o schema especifico de cada `query_kind`. `result` vazio ou `null` continua sendo resposta valida, nao falha sistemica. | Nao descartar; nao substituir por `path` ou `params`. |
| `path` | **seguro condicional de proveniencia** | Quando presente: explicacao, rastreabilidade e apresentacao do percurso no grafo. | Ausencia nunca e erro; conteudo nunca substitui `result` nem define confianca, ranking, autorizacao ou completude. |

> **Fence local (D-19, D-10):** `path` e proveniencia opcional apenas. Nenhum dos quatro campos pode ser enriquecido, reinterpretado silenciosamente ou presumido como expansivel pelo consumer; metadados futuros so entram no envelope por mudanca explicita de contrato.

### Query kinds e presenca de `path`

| `query_kind` | `path` presente? | Fonte de teste |
|--------------|-------------------|----------------|
| `descriptors_by_family` | nao | `query_graph.test.ts` |
| `descriptors_by_subfamily` | nao | `query_graph.test.ts` |
| `alias_resolution_path` | sim | `query_graph.test.ts` |
| `descriptor_to_family_path` | sim | `query_graph.test.ts` |
| `related_descriptors` | nao | `query_graph.test.ts` |
| `similarity_neighborhood` | nao | `query_graph.test.ts` |
| `cross_family_bridges` | nao | `query_graph.test.ts` |
| `similarity_hub` | nao | `query_graph.test.ts` |

## 8. Erros e missing targets

A documentacao de erros preserva tres casos distintos (D-13):

### Caso 1: Grafo invalido — erros estruturais/profile detalhados

Quando `asValidatedGraph(graph)` falha, retorna `{ ok: false, errors }` com erros tipados:

```typescript
// Ilustrativo
const validated = asValidatedGraph(graphInvalido)
// validated.ok === false
// validated.errors = [
//   { code: 'profile_baseline_mismatch', path: '$.stats.families',
//     message: 'sanctioned profile expected families=10, got 0',
//     expected: { families: 10 }, actual: { families: 0 } }
// ]
```

Cada erro possui `code` (tipado como `GraphValidationErrorCode`), `path`, `message`, e opcionalmente `invariant_id`, `expected`, `actual`.

### Caso 2: Ausencia de prova de validacao — `graph_not_validated`

Quando `createValidatedQueryConsumer` recebe um argumento que nao e um `ValidatedGraph` autentico:

```typescript
// Ilustrativo
const consumerResult = createValidatedQueryConsumer(objetoFabricado as any)
// consumerResult.ok === false
// consumerResult.error.code === 'graph_not_validated'
// consumerResult.error.message === 'graph must be validated before query consumption: validated graph handle required'
```

Este caso e distinto de um grafo que falhou validacao: aqui o grafo sequer passou pelo processo de validacao.

### Caso 3: Alvo inexistente — proof de sucesso com `result` vazio ou nulo

Quando o consumer recebe uma query com um alvo que nao existe no grafo, o retorno e uma proof de sucesso valida, nao um erro:

```typescript
// Ilustrativo
const proof = consumer.resolveAliasPath('alias_inexistente')
// proof.query_kind === 'alias_resolution_path'
// proof.params === { alias: 'alias_inexistente' }
// proof.result === { target_descriptor_id: null }
// proof.path === undefined
```

Para queries que retornam listas:

```typescript
// Ilustrativo
const proof = consumer.getDescriptorsByFamily('familia_inexistente')
// proof.result === { descriptors: [] }
```

> **Fence local:** Missing target nao e falha do sistema. `result` com `null`, array vazio ou estrutura vazia e uma resposta valida do grafo validado, indicando que o alvo solicitado nao existe na taxonomia compilada.

## 9. Exemplos canonicos e antipatrones

### 9.1 Sequencia canonica de exemplos (D-12)

#### `graph:build --dry-run`

**Canonico** — Producao de artefato em modo dry-run para inspecao.

```bash
npm --prefix src run graph:build -- --dry-run
# Escreve em $TMPDIR/graph-read-model-dry-run-<pid>/
# Pula auditoria de fronteira e guardrails
```

#### graph:build non-dry-run com boundary audit

**Canonico** — Producao completa do artefato com validacao, guardrails, escrita e auditoria.

```bash
npm --prefix src run graph:build -- --json
# Retorna JSON com { ok, graph_output, boundary_audit, guardrails }
```

Apos a execucao, `boundary_audit.ok` confirma que arquivos protegidos nao foram mutados e `guardrails.passed` confirma que typecheck, testes, integridade de aliases e verificacao passaram.

#### Leitura de `graph.json` como `OlfactoryGraph` cru

**Canonico** — O arquivo relido e dados crus sem prova de validacao.

```typescript
import { readFileSync } from 'node:fs'
import type { OlfactoryGraph } from './graph_read_model/types.js'

const graph: OlfactoryGraph = JSON.parse(
  readFileSync('data/read-models/olfactory-graph/v2.11/graph.json', 'utf8')
)
// graph e um OlfactoryGraph cru — nao tem prova de validacao
```

#### `asValidatedGraph(graph)` com sucesso

**Canonico** — Transicao de artefato cru para handle validado.

```typescript
import { asValidatedGraph } from './graph_read_model/query_consumer.js'

const validated = asValidatedGraph(graph)
if (validated.ok) {
  // validated.graph: ValidatedGraph — agora confiavel
}
```

#### `asValidatedGraph(graph)` com erro detalhado de validacao

**Canonico** — Falha de validacao retorna erros estruturados.

```typescript
const validated = asValidatedGraph(grafoInvalido)
if (!validated.ok) {
  for (const err of validated.errors) {
    console.error(`[${err.code}] ${err.path}: ${err.message}`)
    // ex: [profile_baseline_mismatch] $.stats.families: sanctioned profile expected families=10, got 0
  }
}
```

#### `createValidatedQueryConsumer(validatedGraph)`

**Canonico** — Criacao do consumer a partir do handle validado.

```typescript
import { createValidatedQueryConsumer } from './graph_read_model/query_consumer.js'

const consumerResult = createValidatedQueryConsumer(validated.graph)
if (consumerResult.ok) {
  const consumer = consumerResult.consumer
  // consumer expoe oito metodos de query
}
```

#### Query feliz interpretada por `query_kind`

**Canonico** — Fonte: `src/tests/graph_read_model/query_graph.test.ts`

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

O consumidor discrimina por `query_kind` (`alias_resolution_path`), extrai `result.target_descriptor_id` como payload autoritativo, e opcionalmente usa `path` para explicacao de proveniencia.

#### Tentativa de contorno — `graph_not_validated`

**Canonico** — Fonte: `src/tests/graph_read_model/query_consumer.test.ts`

```typescript
const consumerResult = createValidatedQueryConsumer({} as any)
// consumerResult.ok === false
// consumerResult.error.code === 'graph_not_validated'
```

Handles nao validados sao rejeitados antes de qualquer query.

#### `missing target` retornando proof de sucesso valida

**Canonico** — Fonte: `src/tests/graph_read_model/query_consumer.test.ts`

```typescript
const proof = consumer.resolveAliasPath('unknown_alias')
// proof === {
//   query_kind: 'alias_resolution_path',
//   params: { alias: 'unknown_alias' },
//   result: { target_descriptor_id: null }
// }
// proof.path === undefined
```

Resultado valido: `target_descriptor_id: null` indica que o alias nao existe na taxonomia. Isso nao e um erro.

### 9.2 Mais exemplos de query proofs

Os exemplos abaixo foram transcritos dos objetos esperados em `src/tests/graph_read_model/query_graph.test.ts`; `src/tests/graph_read_model/query_live_baseline.test.ts` serve como evidencia de escala agregada: 10 familias percorridas, 18 aliases resolvidos, 5 bridges entre familias no catalogo completo e hub `floral_rose` com grau 3.

**Ilustrativo** — `descriptors_by_family` para `woody`:

```json
{
  "query_kind": "descriptors_by_family",
  "params": { "family_id": "woody" },
  "result": {
    "descriptors": [
      { "id": "agarwood", "graph_id": "descriptor:agarwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" },
      { "id": "cedarwood", "graph_id": "descriptor:cedarwood", "status": "curated", "review_required": false, "corpus_derived": false, "source": "seed" }
    ]
  }
}
```

(Recorte: o resultado real para `woody` possui 18 descriptors; o array completo esta nos testes.)

**Ilustrativo** — `descriptor_to_family_path` para `cedarwood`:

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

**Ilustrativo** — `similarity_hub`:

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

**Ilustrativo** — `cross_family_bridges` (recorte do fixture):

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
      }
    ]
  }
}
```

### 9.3 Antipatrones obrigatorios

**Proibido** — Nao consultar `graph.json` cru diretamente para queries:

```typescript
// PROIBIDO: graph.json cru nao tem prova de validacao
const graph = JSON.parse(readFileSync('graph.json', 'utf8'))
const proof = getDescriptorsByFamily(graph, 'woody') // SEM fronteira de confianca
```

**Proibido** — Nao expor ou interpretar query pela CLI:

A CLI `graph:build` nao invoca funcoes de query. Nao tente executar queries via CLI nem interprete `graph:build --json` como um resultado de query.

**Proibido** — Nao exigir que `path` exista sempre:

`path` e opcional e presente apenas em `alias_resolution_path` e `descriptor_to_family_path`. Queries como `descriptors_by_family`, `similarity_neighborhood`, `cross_family_bridges` e `similarity_hub` nao retornam `path`.

**Proibido** — Nao inferir fatos apenas de `path`:

`path` e proveniencia/explicacao. `result` e o payload autoritativo. Nao use `path` para definir confianca, ranking, autorizacao ou completude.

**Proibido** — Nao tratar `result` vazio como falha:

`result` com `null`, array vazio ou estrutura vazia e uma proof de sucesso valida indicando que o alvo nao existe na taxonomia compilada.

**Proibido** — Nao interpretar o guia como contrato de runtime/API/DB/Neo4J/Graphify/publicacao:

Este guia documenta um read model estatico. Ele nao define endpoints, servicos, jobs de importacao, integracoes com Neo4J/Graphify, publicacao automatica nem persistencia de proofs.

**Proibido** — Nao fabricar `ValidatedGraph`:

```typescript
// PROIBIDO: cast, objeto manual ou acesso a marca interna
const fake = { graph, validation_profile_id: '...' } as any
const consumer = createValidatedQueryConsumer(fake) // -> graph_not_validated
```

A unica origem sancionada de `ValidatedGraph` e o sucesso de `asValidatedGraph(graph)`.

**Proibido** — Nao usar `query_graph.ts` diretamente em integracoes agent/RAG:

As funcoes de `query_graph.ts` sao primitives internas de baixo nivel que pressupoem grafo confiavel. Integracoes futuras devem usar `createValidatedQueryConsumer(validatedGraph)`.

## 10. Referencias normativas e provas automatizadas

### Documentacao e contratos

- [`docs/olfactory_graph_contract.md`](./olfactory_graph_contract.md) — Contrato normativo do read model: schema, node/edge kinds, output boundary, prefixos proibidos, zero-dependency/estatico/sem runtime.
- `src/graph_read_model/types.ts` — Define `OlfactoryGraph`, `GraphQueryProof`, `GraphQueryKind`, `PathSegment`, tipos de resultado e erros de validacao.
- `src/graph_read_model/query_consumer.ts` — Define `ValidatedGraph`, `asValidatedGraph`, `createValidatedQueryConsumer` e os oito metodos do consumer.
- `src/graph_read_model/validate_graph.ts` — Define `validateSanctionedV211Graph` e o fluxo de validacao estrutural/profile-aware.
- `src/graph_read_model/validation_errors.ts` — Define `makeGraphNotValidatedError` e o vocabulario de erros tipados JSON-safe.
- `src/cli/graph_read_model.ts` — Define o workflow publico `graph:build`, flags `--json`, `--dry-run`, `--help` e nota de que a CLI nao invoca query functions.
- `src/cli/sanctioned_graph_workflow.ts` — Define `runSanctionedGraphWorkflow` com a ordem operacional normativa: validate path -> pre-digests -> load -> build -> validate -> guardrails -> write -> boundary audit.

### Suites Vitest como provas automatizadas

| Arquivo de teste | Prova operacional |
|------------------|-------------------|
| `src/tests/graph_read_model/query_graph.test.ts` | Formas de proof por `query_kind`, presenca/ausencia de `path`, missing-target como proof valida. |
| `src/tests/graph_read_model/query_consumer.test.ts` | Fronteira `ValidatedGraph -> createValidatedQueryConsumer`, comportamento `graph_not_validated`, ausencia de atalhos. |
| `src/tests/graph_read_model/query_live_baseline.test.ts` | Consumo do baseline vivo via consumer validado: 10 familias, 18 aliases, 5 bridges, hub `floral_rose`. |
| `src/tests/cli/graph_read_model.test.ts` | CLI `graph:build`: `--help`, `--json`, `--dry-run`, contrato JSON e politica de output. |
| `src/tests/cli/sanctioned_graph_workflow.test.ts` | Workflow sancionado: dry-run, non-dry-run, boundary audit, Graphify isolation, re-entrada por consumer. |
| `src/tests/graph_read_model/write_graph.test.ts` | Writer path policy, rejeicao de prefixos proibidos, output atomico. |

### Comandos de validacao

```bash
TMPDIR=/tmp npm --prefix src run typecheck
TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/cli/graph_read_model.test.ts tests/graph_read_model/write_graph.test.ts
TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts
```

### Nota conceitual para Neo4J futuro

Esta nota e apenas um mapa conceitual para uma exportacao futura. A v2.11 nao entrega banco de dados, runtime, API, driver, job de importacao, CSV, Cypher executavel, Docker ou testes de integracao com Neo4J. Qualquer materializacao em banco pertence a requisitos futuros como `GDB-01`/`GDB-02` e deve preservar o contrato estatico do read model.

| Graph node kind | Label conceitual | Graph edge kind | Relationship type conceitual |
|-----------------|------------------|-----------------|------------------------------|
| `family` | `Family` | `contains_subfamily` | `CONTAINS_SUBFAMILY` |
| `subfamily` | `Subfamily` | `contains_descriptor` | `CONTAINS_DESCRIPTOR` |
| `descriptor` | `Descriptor` | `resolves_to` | `RESOLVES_TO` |
| `alias` | `Alias` | `similar_to` | `SIMILAR_TO` |

### Checklist de nao-escopo (D-20)

- [ ] Nao expor query pela CLI
- [ ] Nao consultar graph.json cru
- [ ] Nao fabricar ValidatedGraph
- [ ] Nao usar query_graph.ts diretamente em integracoes
- [ ] Nao exigir path
- [ ] Nao tratar missing target como falha
- [ ] Nao interpretar este guia como runtime/API/DB/Neo4J/Graphify/publicacao
