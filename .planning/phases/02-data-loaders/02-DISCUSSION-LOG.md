# Phase 2: Data Loaders - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-13
**Phase:** 02-data-loaders
**Areas discussed:** Estratégia de streaming, Schema do seed, Campos a extrair, Localização dos dados

---

## Estratégia de Streaming do Corpus

| Option | Description | Selected |
|--------|-------------|----------|
| JSON.parse + readFile | Carregar tudo de uma vez com `fs.promises.readFile` + `JSON.parse` | ✓ |
| Streaming incremental | Parser JSON streaming custom zero-dep | |
| Streaming com lib | Usar jsonstream ou similar | |

**User's choice:** JSON.parse simples, encapsulado atrás de interface assíncrona para future-proofing.
**Notes:** V8 lida bem com 70MB. Streaming é complexidade desnecessária agora. A interface `loadCorpus(path): Promise<CorpusMaterial[]>` permite troca futura sem breaking changes.

---

## Schema e Validação do Taxonomy Seed

| Option | Description | Selected |
|--------|-------------|----------|
| Manual + versionado + validação profunda | Seed curado manualmente, validação runtime rigorosa | ✓ |
| Manual + validação superficial | Apenas shape check | |
| Gerado automaticamente | Inferido do corpus | |

**User's choice:** Manual, versionado, validação profunda com mensagens descritivas.
**Notes:** Taxonomia é knowledge base curada, NÃO inferida. O arquivo é a fonte semântica principal. Erros devem ser explícitos (ex: `Invalid subfamily name: expected snake_case, received: "Floral White"`). Sem fail silently ou coercion agressiva.

---

## Campos a Extrair do Corpus

| Option | Description | Selected |
|--------|-------------|----------|
| Filtrar na leitura | Extrair apenas campos olfativos/semânticos durante o parse | ✓ |
| Carregar tudo | Carregar objeto completo e filtrar depois | |

**User's choice:** Filtrar na leitura. Apenas identity (name, canonical_name, aliases) e olfactory (descriptors, primary_type, odor_description).
**Notes:** O taxonomy builder é um semantic extraction system, não um molecular engine. Campos physchem/molecular/safety/solubility pertencem à feature layer, não à taxonomy layer.

---

## Localização dos Dados e Paths

| Option | Description | Selected |
|--------|-------------|----------|
| Paths parametrizados | Loaders recebem path como argumento | ✓ |
| Paths hardcoded | Constantes definidas no código | |
| Config file | Paths definidos em arquivo de configuração | |

**User's choice:** Paths sempre parametrizados, nunca hardcoded. `loadCorpus(path)`, `loadTaxonomySeed(path)`.
**Notes:** Estrutura recomendada: `data/corpus/` e `data/taxonomy/`. Versionamento no nome do arquivo (`taxonomy-seed.v1.json`). Paths relativos à raiz do projeto.

---

## Agent's Discretion

- Estrutura interna dos módulos de validação
- Organização de arquivos dentro de `src/loader/`
- Pattern para mensagens de erro

## Deferred Ideas

None — discussion stayed within phase scope.
