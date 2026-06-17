# Phase 62: Sanctioned CLI Boundary Proofs - Research

**Researched:** 2026-06-17
**Domain:** Sandboxed non-dry-run graph workflow proof, deterministic boundary evidence, and measured Graphify isolation
**Confidence:** HIGH

## User Constraints (from CONTEXT.md)

Source: `.planning/phases/62-sanctioned-cli-boundary-proofs/62-CONTEXT.md` copied as the locked upstream contract for Phase 62. [VERIFIED: local codebase]

### Locked Decisions

## Implementation Decisions

### Internal Orchestrator And Thin CLI
- **D-01:** A arquitetura da Phase 62 deve seguir `orquestrador interno + CLI fina`, mantendo a CLI publica apenas como porta de composicao do workflow sancionado.
- **D-02:** A CLI publica nao deve expor as oito query proofs como comandos, nem ganhar acesso privilegiado a `query_graph.ts`.
- **D-03:** O `graph.json` gerado continua sendo dado cru quando relido; qualquer consumo de query posterior deve reentrar obrigatoriamente por `asValidatedGraph -> createValidatedQueryConsumer`.
- **D-04:** O orquestrador interno pode consumir builder, validator, writer, auditoria de fronteira e executor de guardrails, mas nao deve retornar um novo "proof da CLI" nem ampliar o envelope publico existente.
- **D-05:** A assinatura conceitual travada para o workflow interno e `runSanctionedGraphWorkflow({ outputDir, dryRun, guardrailExecutor })`.

### Guardrails Without Recursion
- **D-06:** O orquestrador deve receber `GuardrailExecutor` como dependencia funcional simples, sem classe, sem estado global e sem branch especial por ambiente de teste.
- **D-07:** A composicao publica da CLI continua injetando o executor real e deve seguir executando os quatro guardrails na ordem atual: `typecheck`, `test`, `alias:integrity`, `verify:integrity`.
- **D-08:** No teste sandboxado da Phase 62, deve existir um executor hibrido que roda `typecheck`, `alias:integrity` e `verify:integrity` de verdade, mas intercepta apenas o passo `test` com evidencia local e deterministica para impedir invocacao recursiva da propria suite.
- **D-09:** A evidencia substituta do passo recursivo deve ser explicita e nao pode fingir execucao real da suite; o teste deve provar que o orquestrador solicitou os quatro guardrails, que tres rodaram de verdade e que `test` foi interceptado pelo executor injetado.
- **D-10:** Qualquer guardrail com falha deve interromper o fluxo antes da geracao/publicacao do artefato no sandbox.

### Measured Graphify Isolation
- **D-11:** O isolamento de `graphify-out/**` deve ser provado por medicao de harness, nao por campos declarativos como `graphify_out_accesses: 0`.
- **D-12:** O harness da Phase 62 deve capturar snapshots antes e depois de `graphify-out/**` usando inventario ordenado de arquivos e hashes deterministas de conteudo, com caminhos relativos normalizados e comparacao estavel.
- **D-13:** Diretorio ausente e um estado valido e deterministico, representado como inventario vazio.
- **D-14:** Qualquer criacao, remocao, renomeacao ou alteracao de conteudo sob `graphify-out/**` deve falhar o teste.
- **D-15:** O snapshot pode incluir `size_bytes` e um `aggregate_sha256` do diretorio, mas deve ignorar metadados instaveis como `mtime`, permissoes e ordem retornada pelo filesystem.

### Forbidden Path Rejection
- **D-16:** O `outputDir` deve ser parametro explicito do orquestrador interno; a CLI publica nao ganha `--out`.
- **D-17:** No non-dry-run, a composicao publica injeta apenas o destino sancionado; no dry-run, nenhum writer e acionado.
- **D-18:** A validacao de caminho deve acontecer antes dos guardrails e antes de qualquer escrita, para evitar trabalho desnecessario e efeitos parciais.
- **D-19:** Tentativas de caminho proibido devem retornar um resultado interno tipado `forbidden_path` no boundary do workflow, sem criar tipo publico novo no graph read model.
- **D-20:** A CLI fina deve traduzir `forbidden_path` para `stderr` estavel, `exit code != 0`, ausencia de `graph.json` e ausencia de mutacao; o teste de forbidden path pode chamar o orquestrador diretamente com destino proibido, sem simular parsing nem criar uma "CLI de teste".

### Sanctioned Evidence And Public Behavior
- **D-21:** A evidencia sancionada obrigatoria da Phase 62 deve combinar `exit code + stderr/stdout + arquivo sandbox + medicoes`, sem criar novo contrato publico.
- **D-22:** No caso sancionado de sucesso, o teste deve provar `exitCode === 0`, `stderr` vazio, `stdout` compativel com o comportamento atual da CLI, e que no modo `--json` a saida atual continua parseavel sem campos novos inventados pela Phase 62.
- **D-23:** No caso de sucesso, `graph.json` deve existir apenas no destino permitido dentro do sandbox, ser legivel e poder reentrar pelo fluxo `asValidatedGraph -> createValidatedQueryConsumer`.
- **D-24:** No caso de sucesso, snapshots de inventario e hashes de `graphify-out/**` devem permanecer identicos, nenhum forbidden path pode ser criado/removido/modificado, e os quatro guardrails devem ter sido solicitados com substituicao explicita apenas do passo recursivo `test` no harness.
- **D-25:** No caso de `forbidden_path` ou guardrail reprovado, o teste deve provar `exitCode !== 0`, mensagem deterministica em `stderr`, ausencia de sucesso enganoso em `stdout`, ausencia de `graph.json`, ausencia de mutacao fora dos caminhos permitidos e interrupcao antes da geracao do artefato.
- **D-26:** Verificacoes de `stdout`/`stderr` devem usar marcadores estaveis, nao snapshots integrais de texto humano; a evidencia mais forte continua sendo o JSON atual da CLI combinado com comportamento de processo, arquivo real no sandbox e medicoes independentes do harness.

### the agent's Discretion
Nenhuma area relevante foi delegada para decisao livre do agente. O boundary da CLI, a estrategia de evidencia e a regra de reentrada por `ValidatedGraph -> createValidatedQueryConsumer` ficaram explicitamente travados nesta discussao.

## Project Constraints

- Responder ao usuario em Portugues do Brasil. [VERIFIED: AGENTS.md]
- O projeto segue TypeScript estrito, ESM, Vitest e arquitetura funcional pura. [VERIFIED: `.planning/PROJECT.md`, `src/package.json`]
- `graphify-out/**` esta sujo no worktree atual e deve permanecer fora de qualquer mutacao/commit de fase. [VERIFIED: `git status --short`]

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GVAL-08 | Maintainer can run an automated sandboxed proof of the sanctioned non-dry-run graph workflow, including pre-write guardrails, graph write, and boundary audit, without mutating protected taxonomy or compiled inputs. [VERIFIED: `.planning/REQUIREMENTS.md`] | Extract the workflow from `runGraphBuildCli` into an internal orchestrator with injectable `GuardrailExecutor`, then prove it in a temp sandbox using a hybrid executor. [VERIFIED: `src/cli/graph_read_model.ts`, `62-CONTEXT.md`] |
| GVAL-09 | Maintainer can inspect measured evidence from sanctioned tests that the graph workflow remains isolated from `graphify-out/**`, rather than relying only on declarative zero-access reporting. [VERIFIED: `.planning/REQUIREMENTS.md`] | Add a deterministic directory snapshot helper in test scope and compare pre/post `graphify-out/**` inventories around the sandboxed workflow. [VERIFIED: `src/graph_read_model/boundary_audit.ts`, `62-CONTEXT.md`] |
| GVAL-10 | Maintainer can inspect deterministic boundary-audit proof outputs covering protected-file integrity, sanctioned output destination, and forbidden-path rejection behavior for misuse scenarios. [VERIFIED: `.planning/REQUIREMENTS.md`] | Introduce an internal typed result for `forbidden_path`, keep CLI JSON shape stable on success, and test both sanctioned success and forbidden-path failure evidence. [VERIFIED: `src/cli/graph_read_model.ts`, `src/graph_read_model/write_graph.ts`, `62-CONTEXT.md`] |

## Summary

Phase 62 is primarily an orchestration and proof-hardening phase, not a graph-schema or query phase. The current CLI already has the sanctioned operational sequence, but it is too monolithic for safe sandbox proofing: it hardcodes guardrail execution, returns `graphify_out_accesses: 0` declaratively, and only exposes forbidden-path behavior through `GraphWriteError` exceptions. [VERIFIED: `src/cli/graph_read_model.ts`, `src/graph_read_model/boundary_audit.ts`, `src/graph_read_model/write_graph.ts`]

The safest path is to extract an internal workflow boundary in `src/cli/`, keeping `src/graph_read_model/` as pure or domain-oriented modules. That boundary should own output-path validation, build/validate/guardrail/write/audit sequencing, and injectable guardrail execution, while the public CLI remains a thin adapter that resolves sanctioned output paths and translates internal results to `stdout`/`stderr`/exit code. [VERIFIED: `62-CONTEXT.md`, `src/cli/graph_read_model.ts`]

Measured Graphify isolation should stay in test/harness scope, not in the production boundary-audit contract. The production audit still proves protected-file digests and sanctioned output location, while the Phase 62 harness independently snapshots `graphify-out/**` before and after the sandboxed run. This satisfies D-11..D-15 without inventing new public JSON fields. [VERIFIED: `62-CONTEXT.md`, `src/graph_read_model/boundary_audit.ts`, `docs/olfactory_graph_read_model.md`]

**Primary recommendation:** split the phase into two waves. Wave 0 extracts the internal workflow and deterministic result surface; Wave 1 adds the sandbox harness, hybrid guardrail executor, measured `graphify-out/**` isolation, and CLI proof coverage.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Internal sanctioned workflow orchestration | `src/cli/` internal module | Public CLI adapter | The workflow coordinates IO, process execution, and output policy; it should not live in pure graph modules. [VERIFIED: `src/cli/graph_read_model.ts`, `62-CONTEXT.md`] |
| Output-path rejection | `src/graph_read_model/write_graph.ts` | Internal workflow result translation | `validateOutputPath` already owns the policy and should remain the single enforcement point, while the workflow converts rejections into typed boundary results. [VERIFIED: `src/graph_read_model/write_graph.ts`] |
| Protected-file integrity audit | `src/graph_read_model/boundary_audit.ts` | Internal workflow | Existing digest capture/compare logic already proves protected-file stability. [VERIFIED: `src/graph_read_model/boundary_audit.ts`] |
| Measured `graphify-out/**` isolation | Test harness helper | CLI/workflow tests | This is a proof concern, not a production runtime concern. [VERIFIED: `62-CONTEXT.md`] |
| Query-safe reentry of generated artifact | `query_consumer.ts` | Sandbox proof tests | Phase 61 already locked `asValidatedGraph -> createValidatedQueryConsumer`; Phase 62 only needs to prove the generated file can reenter that path. [VERIFIED: `src/graph_read_model/query_consumer.ts`, `src/tests/graph_read_model/query_live_baseline.test.ts`] |

## Existing Code Reality

### What already exists
- `runGraphBuildCli` currently performs load -> build -> validate -> write -> boundary audit -> guardrails in that order; Phase 62 must not preserve that order because D-10/D-25 require guardrail failures to stop before artifact generation. [VERIFIED: `src/cli/graph_read_model.ts`, `62-CONTEXT.md`]
- `runGuardrails` already encodes the sanctioned four-step order `typecheck`, `test`, `alias:integrity`, `verify:integrity`. [VERIFIED: `src/cli/graph_read_model.ts`]
- `validateOutputPath` already rejects forbidden prefixes and any path containing `graphify-out`. [VERIFIED: `src/graph_read_model/write_graph.ts`]
- `runBoundaryAudit` already proves protected-file integrity with deterministic SHA-256 digests, but still reports `graphify_out_accesses: 0` statically. [VERIFIED: `src/graph_read_model/boundary_audit.ts`]
- Existing CLI tests only cover `--help`, `--json`, `--dry-run`, and flag policy, not sanctioned non-dry-run sandbox proofs. [VERIFIED: `src/tests/cli/graph_read_model.test.ts`]

### Gaps Phase 62 must close
- There is no internal workflow seam to inject a hybrid guardrail executor. [VERIFIED: `src/cli/graph_read_model.ts`]
- There is no deterministic measured snapshot of `graphify-out/**`; current proof is declarative only. [VERIFIED: `src/graph_read_model/boundary_audit.ts`, `src/tests/graph_read_model/boundary_audit.test.ts`]
- Forbidden-path misuse is only observable as a thrown `GraphWriteError`, not as a typed workflow result boundary. [VERIFIED: `src/graph_read_model/write_graph.ts`, `src/cli/graph_read_model.ts`]
- No test currently proves a non-dry-run write flow in a sandbox plus successful reentry through `asValidatedGraph -> createValidatedQueryConsumer`. [VERIFIED: `src/tests/cli/graph_read_model.test.ts`, `src/tests/graph_read_model/live_artifact_baseline.test.ts`, `src/tests/graph_read_model/query_live_baseline.test.ts`]

## Recommended Project Structure

```text
src/cli/
├── graph_read_model.ts                # thin public CLI adapter (kept)
└── sanctioned_graph_workflow.ts       # new internal workflow seam

src/tests/cli/
├── graph_read_model.test.ts           # existing public CLI behavior
└── sanctioned_graph_workflow.test.ts  # new sandboxed workflow proof

src/tests/helpers/
└── directory_snapshot.ts              # deterministic graphify-out snapshot helper
```

The exact filenames may vary, but the boundary should remain: production orchestration stays under `src/cli/`; measured harness helpers stay under tests. [INFERENCE from `62-CONTEXT.md` and current module responsibilities]

## Pattern 1: Internal Workflow Result Union

**What:** Replace ad-hoc CLI-only branching with a typed internal result that distinguishes sanctioned success, `forbidden_path`, validation failure, audit failure, and guardrail failure. [INFERENCE from current `runGraphBuildCli` control flow]

**When to use:** Use inside the new internal workflow seam so tests can inspect failure modes without scraping CLI text first. The public CLI still maps those results to the existing process behavior. [VERIFIED: `62-CONTEXT.md`, `src/cli/graph_read_model.ts`]

**Example shape:**
```typescript
type RunSanctionedGraphWorkflowResult =
  | { ok: true; outputPath: string; boundaryAudit: BoundaryAuditResult | null; guardrails: GuardrailsResult | null }
  | { ok: false; reason: 'forbidden_path'; error: GraphWriteError }
  | { ok: false; reason: 'guardrail_failed'; outputPath: string; boundaryAudit: BoundaryAuditResult; guardrails: GuardrailsResult }
  | { ok: false; reason: 'validation_failed' | 'audit_failed' | 'input_failed'; message: string }
```

## Pattern 2: Hybrid Guardrail Executor

**What:** A functional dependency that receives the guardrail definition and decides whether to run the real command or inject explicit evidence for the recursive `test` step. [VERIFIED: `62-CONTEXT.md`]

**When to use:** Use only in sandbox tests; the public CLI still injects the real executor. [VERIFIED: `62-CONTEXT.md`]

**Example behavior:**
```typescript
if (guardrail.name === 'test') {
  return {
    name: 'test',
    exitCode: 0,
    output: 'recursive test invocation prevented',
    execution_mode: 'injected_test_evidence',
  }
}
return runRealGuardrail(guardrail)
```

## Pattern 3: Deterministic Directory Snapshot in Test Scope

**What:** Snapshot helper that records normalized relative paths, `sha256`, `size_bytes`, and an aggregate digest for a directory tree. [VERIFIED: `62-CONTEXT.md`]

**When to use:** Use around `graphify-out/**` in workflow-proof tests. Treat missing directory as `exists: false` with an empty inventory. [VERIFIED: `62-CONTEXT.md`]

**Example shape:**
```typescript
type DirectorySnapshot = {
  exists: boolean
  files: Array<{ relative_path: string; sha256: string; size_bytes: number }>
  aggregate_sha256: string
}
```

## Anti-Patterns to Avoid

- **Do not add `--out` to the public CLI.** D-16 explicitly forbids it. [VERIFIED: `62-CONTEXT.md`, `src/tests/cli/graph_read_model.test.ts`]
- **Do not move query consumption into the CLI.** Phase 61 already locked query reentry behind `asValidatedGraph -> createValidatedQueryConsumer`. [VERIFIED: `62-CONTEXT.md`, `src/graph_read_model/query_consumer.ts`]
- **Do not treat `graphify_out_accesses: 0` as sufficient evidence.** Requirement GVAL-09 requires measured proof. [VERIFIED: `.planning/REQUIREMENTS.md`, `62-CONTEXT.md`]
- **Do not fake a full `npm test` pass in sandbox.** The injected proof must state that recursive invocation was prevented. [VERIFIED: `62-CONTEXT.md`]
- **Do not put sandbox-only snapshot fields into the public CLI JSON contract.** D-21 and D-22 require public behavior stability. [VERIFIED: `62-CONTEXT.md`, `docs/olfactory_graph_read_model.md`]

## Common Pitfalls

### Pitfall 1: Validating the output path too late

**What goes wrong:** The workflow runs guardrails or writes temp files before rejecting a forbidden path.  
**Why it happens:** `validateOutputPath` is currently buried inside `writeGraphOutput`, so a naive orchestrator extraction may preserve the wrong sequencing.  
**How to avoid:** Make forbidden-path rejection an explicit pre-write pre-guardrail step in the internal workflow. [VERIFIED: `62-CONTEXT.md`, `src/graph_read_model/write_graph.ts`]

### Pitfall 2: Polluting pure graph modules with orchestration concerns

**What goes wrong:** Guardrail execution, sandbox plumbing, or CLI text rendering leak into `src/graph_read_model/`.  
**Why it happens:** The current CLI file already mixes several responsibilities, and extraction can drift toward the wrong folder.  
**How to avoid:** Keep the new workflow seam under `src/cli/` and leave graph modules focused on build/validate/write/audit primitives. [INFERENCE from current code structure]

### Pitfall 3: Measuring `graphify-out/**` through production code

**What goes wrong:** The production boundary-audit contract grows test-only fields or directory crawling unrelated to its core responsibility.  
**Why it happens:** Requirement GVAL-09 can tempt an implementation to patch `BoundaryAuditResult` directly.  
**How to avoid:** Put directory snapshotting in test helpers and keep production JSON stable. [VERIFIED: `62-CONTEXT.md`, `docs/olfactory_graph_read_model.md`]

## Verification Direction

The phase should be planned around four observable proofs:

1. Internal workflow success in sandbox writes only to the allowed sandbox destination and returns deterministic boundary evidence.
2. Hybrid guardrail execution proves the four steps were requested in order, with explicit interception only for `test`.
3. `graphify-out/**` snapshots remain bitwise stable before and after the sandbox run.
4. Forbidden-path misuse fails before guardrails/write, yields deterministic CLI-visible behavior, and leaves no artifact behind.

---
*Phase: 62-Sanctioned CLI Boundary Proofs*
*Context gathered: 2026-06-17*
