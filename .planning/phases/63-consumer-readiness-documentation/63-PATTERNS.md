# Phase 63: Consumer Readiness Documentation - Pattern Map

**Mapped:** 2026-06-17
**Files analyzed:** 12 required sources + phase context/research
**Analogs found:** 7 / 7 expected files

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `docs/olfactory_graph_read_model.md` | documentation | transform | `docs/olfactory_graph_read_model.md` current guide | exact |
| `docs/olfactory_graph_contract.md` | documentation, normative reference | transform | `docs/olfactory_graph_contract.md` static contract | reference-only |
| `src/graph_read_model/types.ts` | model/contract | transform | `GraphQueryProof` and proof result types | reference-only |
| `src/graph_read_model/query_consumer.ts` | service/facade | request-response | `asValidatedGraph` + `createValidatedQueryConsumer` | reference-only |
| `src/graph_read_model/query_graph.ts` | utility/query primitive | request-response | eight pure query proof functions | reference-only |
| `src/cli/graph_read_model.ts` | CLI/controller | request-response, file-I/O | `graph:build` help/rendering | reference-only |
| `src/cli/sanctioned_graph_workflow.ts` | service/orchestrator | batch, file-I/O | `runSanctionedGraphWorkflow` | reference-only |
| `src/tests/graph_read_model/query_graph.test.ts` | test/example anchor | request-response | proof shape expectations | reference-only |
| `src/tests/graph_read_model/query_consumer.test.ts` | test/example anchor | request-response | fail-closed consumer tests | reference-only |
| `src/tests/cli/sanctioned_graph_workflow.test.ts` | test/example anchor | batch, file-I/O | CLI boundary proof tests | reference-only |

## Pattern Assignments

### `docs/olfactory_graph_read_model.md` (documentation, transform)

**Analog:** `docs/olfactory_graph_read_model.md`

**Current guide pattern to preserve and reorganize** (lines 3-7):
```markdown
> `data/read-models/olfactory-graph/v2.11/graph.json` é um read model derivado para consulta, documentação e consumo futuro por agentes/RAG. Ele não é um artefato oficial de publicação da taxonomia compilada, não promove nenhuma verdade curatorial nova e não substitui nem altera `data/compiled/v2/*`.

Este guia é a referência operacional para mantenedores que precisam entender como o grafo olfativo v2.11 é gerado, validado e usado como evidência estática.
```

**Required edit pattern:** keep this as the guide surface, but reorder it into the Phase 63 canonical hierarchy:
1. Escopo, audiência e fences.
2. Mapa do fluxo completo.
3. Workflow operacional `graph:build`.
4. Validação sancionada.
5. `ValidatedGraph`.
6. Consumer fail-closed.
7. Envelope seguro para agent/RAG.
8. Erros e missing targets.
9. Exemplos canônicos e antipadrões.
10. Referências normativas e provas automatizadas.

**Existing drift to fix:** the current guide jumps from output artifact to future Neo4J note before finishing the operational lifecycle (lines 38-48), then resumes `graph:build` at line 102. Reorder, do not broaden scope.

**Out-of-scope pattern to preserve** (lines 30-36):
```markdown
- `graphify-out/**` como entrada ou saída;
- `data/enriched_materials.json` como quarto insumo de produção;
- qualquer runtime, API, SaaS, banco de dados ou agente em execução.
```

**Example pattern to preserve, relabel, and place later** (lines 191-204):
```markdown
As oito provas abaixo são exemplos estáveis para consumo humano e futuro uso por agentes/RAG.

| GQRY requirement | Function name | `query_kind` | Example params | Source test |
```

Planner guidance: examples must be labeled `Canonico`, `Ilustrativo`, or `Proibido`. Canonical examples should be backed by the listed tests, not invented.

---

### `docs/olfactory_graph_contract.md` (documentation, normative reference)

**Analog:** `docs/olfactory_graph_contract.md`

**Scope fence to cite, not duplicate wholesale** (lines 3-6):
```markdown
Este documento fixa o contrato estático do read model olfativo v2.11. Phase 55 é estritamente contract-only: não implementa builder, loader, writer, CLI, generated graph JSON, query proof, structural validator, boundary audit hashing, Graphify integration, Neo4J/database integration ou runtime integration.
```

**Input/output boundaries** (lines 64-83):
```markdown
The only allowed production inputs are:
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

Forbidden output prefixes:
  - `data/compiled/`
  - `data/taxonomy/`
  - `data/inference/`
  - `graphify-out/`
```

**Graphify separation** (lines 95-97):
```markdown
`graphify-out/**` is navigation-only context and is neither a production input nor an output for the v2.11 olfactory graph read model.
```

Planner guidance: use this as the normative contract reference in the guide footer and fences. Do not turn Phase 63 into a schema rewrite.

---

### `src/graph_read_model/types.ts` (model/contract, transform)

**Analog:** `GraphQueryProof` and proof result types in `src/graph_read_model/types.ts`

**Proof envelope contract** (lines 114-144):
```typescript
export type GraphQueryKind =
  | 'descriptors_by_family'
  | 'descriptors_by_subfamily'
  | 'alias_resolution_path'
  | 'descriptor_to_family_path'
  | 'related_descriptors'
  | 'similarity_neighborhood'
  | 'cross_family_bridges'
  | 'similarity_hub'

export type GraphQueryProof<TKind extends GraphQueryKind, TParams, TResult> = {
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}
```

**Normative field table the guide should include:**

| Field | Classification | Consumer rule |
|-------|----------------|---------------|
| `query_kind` | seguro e estável | Discriminate first; route parser and proof interpretation from it. |
| `params` | seguro com cautela | Use only to correlate response with request; not independent semantic evidence. |
| `result` | seguro e principal | Authoritative payload for agent/RAG consumption by `query_kind`; empty/null can be valid. |
| `path` | seguro condicional de proveniência | Optional provenance/explanation only; never confidence, ranking, authorization, or completeness. |

Planner guidance: no new envelope keys, no `ok/error` inside successful query proofs, no future metadata unless code contract changes in another phase.

---

### `src/graph_read_model/query_consumer.ts` (service/facade, request-response)

**Analog:** `src/graph_read_model/query_consumer.ts`

**Imports/surface pattern** (lines 1-25):
```typescript
import { SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE } from './contract.js'
import {
  getCrossFamilyBridges,
  getDescriptorToFamilyPath,
  getDescriptorsByFamily,
  getDescriptorsBySubfamily,
  getRelatedDescriptors,
  getSimilarityHub,
  getSimilarityNeighborhood,
  resolveAliasPath,
} from './query_graph.js'
import { validateSanctionedV211Graph } from './validate_graph.js'
import { makeGraphNotValidatedError } from './validation_errors.js'
```

**ValidatedGraph brand and sanctioned creation** (lines 27-37, 68-82):
```typescript
const VALIDATED_GRAPH_BRAND = Symbol('ValidatedGraphBrand')

export type ValidatedGraph = {
  readonly [VALIDATED_GRAPH_BRAND]: typeof VALIDATED_GRAPH_BRAND
  readonly graph: OlfactoryGraph
  readonly validation_profile_id: typeof SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE.profile_id
}

export const asValidatedGraph = (graph: OlfactoryGraph): AsValidatedGraphResult => {
  const validation = validateSanctionedV211Graph(graph)

  if (!validation.ok) {
    return { ok: false, errors: validation.errors }
  }

  const validatedGraph: ValidatedGraph = {
    [VALIDATED_GRAPH_BRAND]: VALIDATED_GRAPH_BRAND,
    graph,
    validation_profile_id: SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE.profile_id,
  }

  return { ok: true, graph: validatedGraph }
}
```

**Fail-closed consumer creation** (lines 84-108):
```typescript
export const createValidatedQueryConsumer = (
  validatedGraph: ValidatedGraph,
): CreateValidatedQueryConsumerResult => {
  if (!isValidatedGraph(validatedGraph)) {
    return {
      ok: false,
      error: makeGraphNotValidatedError('validated graph handle required'),
    }
  }

  const { graph } = validatedGraph

  const consumer: ValidatedQueryConsumer = {
    getDescriptorsByFamily: (familyId: string) => getDescriptorsByFamily(graph, familyId),
    getDescriptorsBySubfamily: (subfamilyId: string) => getDescriptorsBySubfamily(graph, subfamilyId),
    resolveAliasPath: (alias: string) => resolveAliasPath(graph, alias),
    getDescriptorToFamilyPath: (descriptorId: string) => getDescriptorToFamilyPath(graph, descriptorId),
    getRelatedDescriptors: (descriptorId: string) => getRelatedDescriptors(graph, descriptorId),
    getSimilarityNeighborhood: (subfamilyId: string) => getSimilarityNeighborhood(graph, subfamilyId),
    getCrossFamilyBridges: () => getCrossFamilyBridges(graph),
    getSimilarityHub: () => getSimilarityHub(graph),
  }

  return { ok: true, consumer }
}
```

Planner guidance: document only this sanctioned path. Do not recommend casts, manual brand construction, `createValidatedQueryConsumerFromGraph`, `OrThrow` helpers, or direct `query_graph.ts` usage for agent/RAG integrations.

---

### `src/graph_read_model/query_graph.ts` (utility/query primitive, request-response)

**Analog:** `src/graph_read_model/query_graph.ts`

**Low-level proof pattern without validation boundary** (lines 112-132):
```typescript
export const getDescriptorsByFamily = (
  graph: OlfactoryGraph,
  familyId: string,
): DescriptorsByFamilyProof => ({
  query_kind: 'descriptors_by_family',
  params: { family_id: familyId },
  result: {
    descriptors: collectDescriptors(graph, node => node.properties.family_id === familyId),
  },
})
```

**Missing target is success proof, not system error** (lines 134-147, 193-205, 479-491):
```typescript
if (!aliasNode) {
  return {
    query_kind: 'alias_resolution_path',
    params: { alias },
    result: { target_descriptor_id: null },
  }
}

if (!descriptorNode || descriptorNode.kind !== 'descriptor') {
  return {
    query_kind: 'descriptor_to_family_path',
    params: { descriptor_id: descriptorId },
    result: { family_id: null, subfamily_id: null },
  }
}

if (!descriptorNode || descriptorNode.kind !== 'descriptor') {
  return {
    query_kind: 'related_descriptors',
    params: { descriptor_id: descriptorId },
    result: { descriptors: [] },
  }
}
```

**Path appears only where produced by specific proof kinds** (lines 180-190, 219-231):
```typescript
return {
  query_kind: 'alias_resolution_path',
  params: { alias },
  result: { target_descriptor_id: String(descriptorNode.properties.descriptor_id) },
  path: [
    toPathSegment(aliasNode),
    toPathSegment(descriptorNode),
    toPathSegment(subfamilyNode),
    toPathSegment(familyNode),
  ],
}
```

Planner guidance: cite `query_graph.ts` as the source of exact proof semantics, while making clear it is a primitive layer that assumes a trusted graph. Future consumers should enter through `query_consumer.ts`.

---

### `src/cli/graph_read_model.ts` (CLI/controller, request-response + file-I/O)

**Analog:** `src/cli/graph_read_model.ts`

**Public help text with known ordering drift** (lines 47-77):
```typescript
stdout.log(`graph:build — Olfactory Knowledge Graph Read Model Builder

Workflow:
  1. Load compiled v2 inputs (taxonomy, aliases, similarity)
  2. Build in-memory OlfactoryGraph
  3. Validate graph with sanctioned v2.11 wrapper
  4. Write graph.json to sanctioned output path
  5. Run SHA-256 boundary audit on protected files (GVAL-03)
  6. Run GVAL-05 guardrails: typecheck, test, alias:integrity, verify:integrity

Notes:
  - No --out flag for official writes (prevents accidental mutation)
  - Boundary audit proof prints to stdout, not persisted to disk
  - graph:build does NOT invoke query functions
`)
```

**Structured JSON shape** (lines 173-190):
```typescript
stdout.log(
  JSON.stringify(
    {
      ok: true,
      graph_output: result.graph_output,
      boundary_audit: result.boundary_audit,
      guardrails: result.guardrails,
    },
    null,
    2,
  ),
)
```

Planner guidance: the guide may show `graph:build --dry-run`, `graph:build`, and `--json`, but must end the CLI section at build/validation/guardrail/write/audit behavior. It must not document CLI query commands, and it must use `src/cli/sanctioned_graph_workflow.ts` rather than this help excerpt for precise operation order.

---

### `src/cli/sanctioned_graph_workflow.ts` (service/orchestrator, batch + file-I/O)

**Analog:** `runSanctionedGraphWorkflow` in `src/cli/sanctioned_graph_workflow.ts`

**Guardrail order** (lines 46-51):
```typescript
export const SANCTIONED_GUARDRAIL_DEFINITIONS: readonly GuardrailDefinition[] = [
  { name: 'typecheck', args: ['run', 'typecheck'] },
  { name: 'test', args: ['run', 'test'] },
  { name: 'alias:integrity', args: ['run', 'alias:integrity', '--', '--json'] },
  { name: 'verify:integrity', args: ['run', 'verify:integrity', '--', '--json'] },
]
```

Planner guidance: treat this help as public CLI surface and option/JSON wording reference only. Its displayed order currently says `build -> validate -> write -> audit -> guardrails`, which diverges from the internal sanctioned workflow. For operational order in Phase 63 documentation, do not copy the obsolete help order; use `src/cli/sanctioned_graph_workflow.ts` and Phase 62 tests as the source of truth, and record the help mismatch as follow-up if it remains visible.

**Normative workflow sequence** (lines 180-243, 244-311):
```typescript
export const runSanctionedGraphWorkflow = async (
  options: RunSanctionedGraphWorkflowOptions,
): Promise<SanctionedWorkflowResult> => {
  const pathValidation = validateOutputPathOrForbidden(outputDir)
  if (!pathValidation.ok) {
    return { ok: false, reason: pathValidation.reason, message: pathValidation.message }
  }

  if (!dryRun) {
    const protectedFiles = await discoverProtectedFiles(baseDir)
    preDigests = await capturePreDigests(protectedFiles)
  }

  input = await loadGraphInputs(baseDir)
  graph = buildOlfactoryGraph(input)

  const validationResult = validateSanctionedV211Graph(graph)
  if (!validationResult.ok) {
    return { ok: false, reason: 'validation_failed', message: summary }
  }

  if (!skipGuardrails && !dryRun) {
    guardrailsResult = guardrailExecutor(SANCTIONED_GUARDRAIL_DEFINITIONS, { srcDir })
  }

  outputPath = await writeGraphOutput(graph, outputDir)

  if (!dryRun && preDigests !== undefined) {
    auditResult = await runBoundaryAudit(outputPath, baseDir, preDigests)
  }

  return { ok: true, graph_output: outputPath, boundary_audit: auditResult, guardrails: guardrailsResult }
}
```

Planner guidance: document trust transition precisely. Non-dry-run validates the output path, captures pre-digests, loads/builds/validates the graph, runs guardrails before writing, writes `graph.json`, then runs the boundary audit. Dry-run uses temp output and skips boundary audit/guardrails. If `src/cli/graph_read_model.ts` help still presents write/audit before guardrails, classify that as documentation/technical follow-up only; do not alter code or make the guide follow the obsolete order in Phase 63.

---

### `src/graph_read_model/validation_errors.ts` (utility/error vocabulary, transform)

**Analog:** `src/graph_read_model/validation_errors.ts`

**JSON-safe error factory** (lines 29-55):
```typescript
export const makeGraphValidationError = (
  code: GraphValidationErrorCode,
  path: string,
  message: string,
  options: GraphValidationErrorOptions = {},
): GraphValidationError => {
  const normalizedOptions: Parameters<typeof makeGraphError>[3] = {}
  const invariantId = resolveInvariantId(code, options.invariant_id)

  return makeGraphError(code, path, message, normalizedOptions)
}
```

**Consumer misuse error** (lines 217-226):
```typescript
export const makeGraphNotValidatedError = (reason: string): GraphValidationError =>
  makeGraphValidationError(
    'graph_not_validated',
    '$',
    `graph must be validated before query consumption: ${reason}`,
    {
      expected: { validated_graph: true },
      actual: { reason },
    },
  )
```

Planner guidance: error section must separate:
- invalid validated graph: structural/profile errors from validation;
- missing validation proof: `graph_not_validated`;
- missing target: successful proof with `result` empty or `null`.

## Shared Patterns

### Canonical Trust Flow

**Source:** `63-CONTEXT.md`, `src/cli/sanctioned_graph_workflow.ts`, `src/graph_read_model/query_consumer.ts`, `src/tests/cli/sanctioned_graph_workflow.test.ts`

**Apply to:** `docs/olfactory_graph_read_model.md`

```text
graph:build
  -> graph.json cru
  -> asValidatedGraph(graph)
  -> createValidatedQueryConsumer(validatedGraph)
  -> GraphQueryProof { query_kind, params, result, path? }
```

**Trust labels to use in prose:**
- `graph:build`: sanctioned build/validation/guardrail/write/audit workflow, not query runtime.
- `graph.json cru`: raw `OlfactoryGraph` when re-read from disk; prior build does not carry an in-memory validation handle.
- `asValidatedGraph(graph)`: only sanctioned source of `ValidatedGraph`.
- `createValidatedQueryConsumer(validatedGraph)`: only documented consumer integration path.
- `GraphQueryProof`: successful proof envelope; it does not contain validation status.

### CLI Boundary And Graphify Isolation

**Source:** `src/cli/graph_read_model.ts` lines 73-77; `src/tests/cli/sanctioned_graph_workflow.test.ts` lines 137-223 and 308-332.

```typescript
expect(boundaryAudit?.graphify_out_accesses).toBe(0)
expect(snapshotsEqual(graphifyBefore, graphifyAfter)).toBe(true)

const validated = asValidatedGraph(graph)
expect(validated.ok).toBe(true)

const consumerResult = createValidatedQueryConsumer(validated.graph)
expect(consumerResult.ok).toBe(true)
```

Apply this as the guide's operational bridge: CLI produces/audits the artifact; consumption re-enters through validation and consumer creation.

### Proof Envelope Compatibility

**Source:** `src/tests/graph_read_model/query_consumer.test.ts` lines 157-167 and 305-308.

```typescript
const keys = Object.keys(proof).sort()
expect(keys).not.toContain('ok')
expect(keys).not.toContain('error')
expect(keys).not.toContain('errors')
expect(keys).not.toContain('validated')

for (const key of keys) {
  expect(['query_kind', 'params', 'result', 'path']).toContain(key)
}
```

Apply this to keep examples from adding status fields to success proofs.

### Missing Target Semantics

**Source:** `src/tests/graph_read_model/query_consumer.test.ts` lines 311-351 and `src/tests/graph_read_model/query_graph.test.ts` lines 280-290, 477-487.

```typescript
expect(consumer.getDescriptorsByFamily('missing_family')).toEqual({
  query_kind: 'descriptors_by_family',
  params: { family_id: 'missing_family' },
  result: { descriptors: [] },
})

expect(unknownAliasProof).toEqual({
  query_kind: 'alias_resolution_path',
  params: { alias: 'unknown_alias' },
  result: { target_descriptor_id: null },
})
expect(unknownAliasProof.path).toBeUndefined()
```

Apply this in the errors/missing-target section and in examples.

### Source Scope Fences

**Source:** `src/tests/graph_read_model/query_consumer.test.ts` lines 354-374.

```typescript
expect(consumerSource).not.toContain('createValidatedQueryConsumerFromGraph')
expect(consumerSource).not.toContain('assertValidatedGraph')
expect(consumerSource).not.toContain('createValidatedQueryConsumerOrThrow')
expect(consumerSource).not.toContain('fromGraph(')
expect(consumerSource).not.toContain('node:fs')
expect(consumerSource).not.toContain('graphify-out')
expect(consumerSource).not.toContain('neo4j')
expect(consumerSource).not.toContain('api/')
expect(consumerSource).not.toContain('data/read-models')

expect(queryGraphSource).not.toContain('ValidatedGraph')
expect(queryGraphSource).not.toContain('graph_not_validated')
expect(queryGraphSource).not.toContain('validateSanctionedV211Graph')
```

Apply this as documentation-risk guidance: examples should not imply runtime, filesystem, Graphify, Neo4J, API, or raw-graph shortcut scope.

## Expected File Work

| File | Expected Action | Role | Data Flow | Notes |
|------|-----------------|------|-----------|-------|
| `docs/olfactory_graph_read_model.md` | Modify | documentation | transform | Primary and likely only edit target. Reorder, harden fences, add envelope matrix, examples, anti-pattern checklist. |
| `.planning/phases/63-consumer-readiness-documentation/63-PATTERNS.md` | Create | planning artifact | transform | This file. |
| `docs/olfactory_graph_contract.md` | Do not modify unless a typo-only cross-reference is absolutely necessary | documentation | transform | Prefer reference-only. |
| `src/**` production files | Do not modify | code | various | Contracts are normative sources, not implementation targets. |
| `src/tests/**` | Prefer no modification | test | request-response/batch | Existing tests are anchors; add tests only if planner explicitly requires doc content checks. |
| `graphify-out/**` | Do not touch | external/navigation artifact | none | Explicit phase fence. |

## Risks Of Pattern Drift

| Risk | Drift Symptom | Stay-Documental Recommendation |
|------|---------------|--------------------------------|
| Raw artifact becomes trusted by prose | Guide says `graph.json` is ready for query after `graph:build` | Always insert `graph.json cru -> asValidatedGraph(graph)` before consumer examples. |
| CLI becomes query runtime | Examples suggest `graph:build` executes proof queries | Keep CLI section limited to build/write/audit/guardrails; repeat "does NOT invoke query functions". |
| `ValidatedGraph` is fabricated | Snippets use `as ValidatedGraph`, object literals, or brand access | Show only `const validated = asValidatedGraph(graph)` and branch on `validated.ok`. |
| Consumer shortcut appears official | Guide mentions `createValidatedQueryConsumerFromGraph`, `fromGraph`, or `OrThrow` path | Use only `createValidatedQueryConsumer(validated.graph)` as canonical. |
| Envelope is enriched by documentation | Examples add `ok`, `errors`, `validated`, confidence, ranking, or metadata | Copy the exact `{ query_kind, params, result, path? }` shape from `types.ts` and tests. |
| `path` becomes authoritative | Guide ranks or authorizes answers from `path` | Classify `path` as optional provenance-only and subordinate to `result`. |
| Missing target becomes failure | Empty arrays/nulls are placed in error taxonomy | Put missing targets under "successful empty/null proof", separate from validation errors and `graph_not_validated`. |
| Graphify/Neo4J scope reopens | Guide expands conceptual notes into integration steps | Keep Graphify and Neo4J as explicit non-scope references only. |

## No Analog Found

None. Phase 63 is a documentation hardening phase over existing contracts and tests. No new runtime, service, API, database, Graphify, or persisted-proof analog should be introduced.

## Metadata

**Analog search scope:** `docs/`, `src/graph_read_model/`, `src/cli/`, `src/tests/graph_read_model/`, `src/tests/cli/`
**Files scanned:** 110 files under focused scope; stopped after strong analog set
**Pattern extraction date:** 2026-06-17

## PATTERN MAPPING COMPLETE
