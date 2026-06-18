<!-- generated-by: gsd-doc-writer -->
# Olfactory Taxonomy System

Sistema em TypeScript para construir, validar e publicar uma taxonomia olfativa determinística — a camada semântica que organiza famílias, subfamílias, descritores, aliases e relações de similaridade.

O repositório contém dois componentes:

- o **Taxonomy Builder**, responsável pelo pipeline principal e pelos artefatos compilados;
- o **engine de tenacidade e volatilidade**, mantido como pacote independente em `engine_calcula_tenacidade_volatilidade/`.

O projeto é privado, funcional, executado offline e não expõe API HTTP, serviço SaaS, banco de dados ou runtime de agentes.

## Visão geral

O Taxonomy Builder transforma seeds curatoriais e um corpus enriquecido em três artefatos oficiais:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

A hierarquia principal é:

```text
Family
└── Subfamily
    └── Descriptor
```

O pipeline também produz um **read model de grafo derivado**, estático e somente leitura:

```text
data/read-models/olfactory-graph/v2.11/graph.json
```

Esse grafo facilita consultas e futuros consumidores agent/RAG, mas não substitui os artefatos compilados nem cria nova verdade curatorial.

## Estado atual

O milestone **v2.12 — Graph Read Model Hardening & Agent Consumption Prep** foi concluído em 18 de junho de 2026. O projeto aguarda a definição do próximo milestone.

Snapshot dos artefatos versionados atuais:

| Métrica | Valor |
|---|---:|
| Famílias | 10 |
| Subfamílias | 18 |
| Descritores | 341 |
| Aliases | 18 |
| Relações de similaridade entre subfamílias | 13 |
| Nós no read model | 387 |
| Arestas no read model | 390 |

O compilador continua usando `2.1.0` em `DEFAULT_PATHS.version`. Releases posteriores foram publicadas com `--version`, sem alterar esse default histórico.

## Arquitetura

```text
Seeds + corpus enriquecido
          │
          ▼
       Loaders
          │
          ▼
     Normalização
          │
          ▼
       Análise
          │
          ▼
      Inferência
          │
          ▼
      Compilação
          │
          ├── taxonomy.json
          ├── descriptor_aliases.json
          └── similarity_matrix.json
                    │
                    ▼
            Graph Read Model
                    │
                    ▼
                graph.json
```

Principais módulos:

| Caminho | Responsabilidade |
|---|---|
| `src/loader/` | Carregamento e validação de seeds, aliases e corpus |
| `src/normalizer/` | Normalização determinística de descritores |
| `src/analyzer/` | Frequência, coocorrência, aliases candidatos e similaridade textual |
| `src/inference/` | Perfis, clusters, evidências e grafo de similaridade |
| `src/compiler/` | Compilação, validação all-or-nothing e escrita dos artefatos |
| `src/cli/` | CLIs de compilação, integridade e geração do read model |
| `src/graph_read_model/` | Contrato, builder, validação, queries, consumer e auditoria de fronteira |
| `src/tests/` | Testes Vitest unitários, de integração, regressão e invariantes |
| `docs/` | Contrato e guia operacional do read model |
| `.planning/` | Roadmap, requisitos, decisões e histórico de milestones |

O núcleo compilado usa apenas APIs nativas do Node.js em runtime. TypeScript, Vitest e tipos do Node são dependências de desenvolvimento.

## Requisitos

- Node.js 24 recomendado, para reproduzir o ambiente da CI;
- npm;
- `data/enriched_materials.json` somente para recompilar a taxonomia completa.

O corpus enriquecido é grande e não é versionado no Git. Os testes, typecheck, validações de integridade e o read model existente podem ser usados sem ele.

## Instalação

```bash
git clone https://github.com/jlima004/TaxonomySystem.git
cd TaxonomySystem
npm ci --prefix src
```

O engine independente possui instalação própria:

```bash
npm ci --prefix engine_calcula_tenacidade_volatilidade
```

## Início rápido

Valide o checkout sem alterar artefatos de dados:

```bash
npm --prefix src run typecheck
npm --prefix src test
npm --prefix src run verify:integrity -- --json
npm --prefix src run graph:build -- --dry-run
```

O dry-run escreve em um diretório temporário exclusivo do processo e não modifica o read model oficial.

## Comandos principais

Todos os comandos abaixo podem ser executados a partir da raiz do repositório.

| Comando | Descrição |
|---|---|
| `npm ci --prefix src` | Instala exatamente as dependências do lockfile |
| `npm --prefix src run build` | Compila TypeScript para `src/dist/` |
| `npm --prefix src run typecheck` | Verifica tipos sem emitir arquivos |
| `npm --prefix src test` | Executa a suíte Vitest |
| `npm --prefix src run test:watch` | Executa testes em modo interativo |
| `npm --prefix src run compile` | Compila os artefatos v2 usando os caminhos padrão |
| `npm --prefix src run compile:quality` | Compila em `/tmp`, imprime métricas e executa o gate de aliases |
| `npm --prefix src run alias:integrity -- --json` | Gera a prova de integridade dos targets de aliases |
| `npm --prefix src run verify:integrity -- --json` | Executa a verificação de integridade usada pela CI |
| `npm --prefix src run graph:build` | Gera o read model no caminho sancionado e executa guardrails |
| `npm --prefix src run graph:build -- --dry-run` | Gera o grafo somente em diretório temporário |
| `npm --prefix src run graph:build -- --json` | Imprime a prova estruturada do workflow |
| `npm --prefix src run safety:guard` | Audita staging e caminhos protegidos sem mutar a árvore de trabalho |

### Compilação da taxonomia

A compilação completa requer o corpus em `data/enriched_materials.json`:

```bash
npm --prefix src run compile
```

Para publicar uma versão explícita:

```bash
npm --prefix src run compile -- --version 2.10.0
```

Os defaults e todas as flags disponíveis estão em `src/cli/parse_args.ts` e podem ser consultados com:

```bash
npm --prefix src run compile -- --help
```

## Graph Read Model

O read model `olfactory_graph_read_model.v1` é construído exclusivamente a partir dos três artefatos compilados v2. Ele contém:

- nós `family`, `subfamily`, `descriptor` e `alias`;
- arestas `contains_subfamily`, `contains_descriptor`, `resolves_to` e `similar_to`;
- IDs globais tipados, como `family:floral` e `descriptor:floral`;
- validação estrutural e de baseline;
- oito query proofs tipadas;
- auditoria SHA-256 dos arquivos protegidos.

O fluxo de confiança para consumo programático é:

```text
graph:build
  → graph.json cru
  → asValidatedGraph(graph)
  → createValidatedQueryConsumer(validatedGraph)
  → query proof
```

As queries retornam envelopes tipados no formato:

```typescript
{
  query_kind,
  params,
  result,
  path?
}
```

O consumer é fail-closed: um grafo cru ou inválido não deve produzir proofs. Alvos inexistentes, porém, continuam sendo resultados válidos com payload vazio ou nulo — não erros sistêmicos.

Leia:

- [Contrato do grafo](docs/olfactory_graph_contract.md)
- [Guia operacional e consumer readiness](docs/olfactory_graph_read_model.md)

## Segurança e integridade

O repositório protege os seguintes caminhos contra alterações acidentais:

- `data/taxonomy/`
- `data/inference/`
- `data/compiled/v1/`
- `data/compiled/v2/`
- `src/cli/parse_args.ts`

O safety guard também bloqueia arquivos de `graphify-out/` no staging. Alterações locais geradas pelo Graphify são permitidas, mas não devem entrar em commits do projeto.

Execute a auditoria local com:

```bash
bash scripts/check-safety-guards.sh
```

O script é estritamente não mutante: ele apenas inspeciona o estado do Git e retorna `PASS` ou uma lista de violações.

## CI

O workflow `.github/workflows/ci.yml` roda em pushes e pull requests para `master` com Node.js 24:

1. instalação via `npm ci`;
2. typecheck;
3. testes;
4. prova de integridade de aliases;
5. verificação de integridade.

## Escopo e limites

Este repositório entrega a **Layer 1 — taxonomia semântica** do domínio olfativo. Permanecem fora do escopo atual:

- API ou SaaS;
- runtime de agentes;
- banco de dados e Neo4j;
- promoção automática de candidatos curatoriais;
- modelagem físico-química dentro da taxonomia;
- substituição dos artefatos compilados pelo read model.

O engine em `engine_calcula_tenacidade_volatilidade/` cobre cálculos físico-químicos e derivados, mas continua desacoplado do Taxonomy Builder.

## Planejamento

O histórico de decisões e entregas está em:

- [Visão e requisitos do projeto](.planning/PROJECT.md)
- [Roadmap](.planning/ROADMAP.md)
- [Estado atual](.planning/STATE.md)
- [Milestones arquivados](.planning/milestones/)

O próximo ciclo deve ser aberto explicitamente pelo workflow de novo milestone, preservando os limites de curadoria, runtime e publicação até que sejam incluídos no escopo.
