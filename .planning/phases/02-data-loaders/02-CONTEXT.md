# Phase 2: Data Loaders - Context

**Gathered:** 2026-05-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Carregar com segurança e eficiência a base de conhecimento inicial (taxonomy seed JSON curado manualmente) e o corpus bruto (`enriched_materials.json`, ~70MB, 33.742 materiais). Produzir funções puras que retornam dados tipados prontos para consumo pelas fases subsequentes (normalização, análise).

</domain>

<decisions>
## Implementation Decisions

### Estratégia de Carregamento do Corpus
- **D-01:** Usar `JSON.parse` + `fs.promises.readFile` — NÃO implementar streaming incremental agora. O V8 lida com 70MB sem problemas.
- **D-02:** Encapsular atrás de interface assíncrona (`loadCorpus(path): Promise<CorpusMaterial[]>`) para permitir troca futura por streaming sem quebrar consumidores.
- **D-03:** NÃO implementar parser JSON streaming custom, tokenizer incremental, ou state machine parser. Complexidade desnecessária neste momento.

### Schema e Validação do Taxonomy Seed
- **D-04:** `taxonomy-seed.json` será manual, curado, pequeno, explícito, legível e versionado. É knowledge base curada, NÃO inferida automaticamente.
- **D-05:** O contrato oficial é o type `TaxonomySeed` definido em `src/types/seed.ts`.
- **D-06:** Implementar validação runtime PROFUNDA com mensagens descritivas. Exemplo: `Invalid subfamily name: expected snake_case, received: "Floral White"`. NÃO fazer validação superficial, fail silently, ou coercion automática agressiva.

### Campos a Extrair do Corpus
- **D-07:** Filtrar campos relevantes JÁ NA LEITURA. A taxonomy layer é um semantic extraction system, NÃO um molecular engine.
- **D-08:** Extrair APENAS:
  - `identity`: name, canonical_name, aliases
  - `olfactory`: descriptors, primary_type, odor_description
  - Campos meta quando disponíveis (sources, confidence)
- **D-09:** IGNORAR nesta fase: physchem, molecular, safety, solubility, text. Esses pertencem à feature layer, NÃO à taxonomy layer.

### Localização dos Dados e Paths
- **D-10:** Paths SEMPRE parametrizados, NUNCA hardcoded. Loaders recebem path como argumento: `loadCorpus(path)`, `loadTaxonomySeed(path)`.
- **D-11:** Estrutura de dados recomendada:
  ```
  data/
    corpus/
      enriched_materials.json
    taxonomy/
      taxonomy-seed.v1.json
  ```
- **D-12:** Paths relativos à raiz do projeto. Versionamento no nome do arquivo (`taxonomy-seed.v1.json`) para suportar futuras versões.

### Agent's Discretion
- Estrutura interna dos módulos de validação (composição de validators)
- Escolha de pattern para mensagens de erro (string literal vs template)
- Organização de arquivos dentro de `src/loader/`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Domain Types (Phase 1 output)
- `src/types/corpus.ts` — Define `CorpusMaterial`, `OlfactoryProfile`, `MolecularProperties` e demais tipos do corpus
- `src/types/seed.ts` — Define `TaxonomySeed`, `TaxonomySeedFamily`, `TaxonomySeedSubfamily` — contrato oficial do seed
- `src/types/index.ts` — Barrel exports de todos os tipos

### Data Files
- `data/enriched_materials.json` — Corpus bruto (~70MB, 33.742 materiais, array JSON)

### Project References
- `.planning/ROADMAP.md` §Phase 2 — Goal, requirements (INPT-01 a INPT-04), success criteria
- `.planning/REQUIREMENTS.md` §Input Processing — INPT-01 a INPT-04
- `.planning/HANDOFF.md` — Convenções de código (sem semicolons, arrow functions, ESM, `type` not `interface`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/corpus.ts` → `CorpusMaterial` type: O loader deve retornar `CorpusMaterial[]` (ou subset filtrado)
- `src/types/seed.ts` → `TaxonomySeed` type: O validator deve verificar conformidade com este type
- `src/loader/.gitkeep` → Diretório já existe, pronto para receber os módulos

### Established Patterns
- ESM modules (`"type": "module"` em package.json)
- TypeScript strict mode (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Zero runtime dependencies — tudo built-in (fs, path do Node.js)
- Pure functions, arrow functions, sem semicolons
- `type` (não `interface`), snake_case properties, PascalCase tipos
- `import type` para type-only imports, `readonly` arrays
- Vitest para testes em `src/tests/`

### Integration Points
- `src/loader/` → módulo destino para os loaders
- `src/tests/` → testes de integração/unitários dos loaders
- `data/` → fonte dos arquivos de entrada (corpus + seed futuro)

</code_context>

<specifics>
## Specific Ideas

- O corpus real tem campos extras (`text`, `physchem`, `solubility`) que NÃO existem nos types — o loader deve fazer mapeamento seletivo
- Cada material no corpus segue o shape `CorpusMaterial` mas com propriedades adicionais — filtrar na leitura
- O seed será criado manualmente com versionamento explícito no nome do arquivo
- Mensagens de erro de validação devem ser extremamente descritivas (field path + expected + received)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 2-Data Loaders*
*Context gathered: 2026-05-13*
