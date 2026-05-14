# Phase 3: Normalization Pipeline - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Normalizar agressivamente todos os descritores extraídos para sua forma canônica base. Produzir um pipeline composável de funções puras que transforma qualquer string de descritor bruto (com espaços, hyphens, diacríticos, plurais, pontuação) em sua forma canônica `snake_case` determinística. O normalizer NÃO resolve aliases — essa responsabilidade pertence à camada de análise (Phase 4).

**Separação fundamental:** `normalization != aliasing != taxonomy resolution`

</domain>

<decisions>
## Implementation Decisions

### Pipeline Architecture
- **D-01:** Usar composable array reduce — `pipeline.reduce((acc, fn) => fn(acc), input)`. Cada step é uma função `(input: string) => string`.
- **D-02:** Cada step DEVE ser: deterministic, stateless, synchronous, side-effect free.
- **D-03:** NÃO usar monolithic normalize(). NÃO usar named rule objects com metadata/logging. Array reduce puro para v1.

### Pluralization Strategy
- **D-04:** Dictionary-first. Camada 1: curated dictionary de irregulares do domínio perfumístico (`{ "woods": "wood", "mosses": "moss", "leaves": "leaf" }`).
- **D-05:** Camada 2: fallback com regras mínimas de suffix stripping — `ies → y`, `es → ""`, `s → ""`.
- **D-06:** NÃO usar npm package. Estamos construindo semantic infrastructure e domain normalization layer.

### Separators & Snake Case
- **D-07:** Todo separator (espaço, hyphen, slash, múltiplos separators) normaliza para `_` (underscore). Universal, sem exceções.
- **D-08:** Fix obrigatório do `taxonomy-seed.v1.json` — corrigir descriptors com espaço para `snake_case` (`"orange blossom"` → `"orange_blossom"`, `"lily of the valley"` → `"lily_of_the_valley"`).
- **D-19:** Múltiplos separadores consecutivos SEMPRE colapsam para um único `_`. Exemplo: `fresh---green///woody` → `fresh_green_woody`. Isso é regra formal, não apenas implementação.

### Canonical Descriptor Charset
- **D-09:** O contrato canônico de saída do normalizer é: `^[a-z0-9_]+$`. Todo output do `normalizeDescriptor` DEVE satisfazer esse pattern (quando input não é vazio).
- **D-10:** Essa regex serve como invariante de teste e validação downstream.
- **D-20:** Números SÃO semanticamente permitidos. Termos como `aldehyde_c12`, `c14`, `c18`, `5_methyl` são válidos e frequentes no domínio perfumístico (aldehydes, musks, ionones). O charset `[a-z0-9_]` é intencional.
- **D-21:** Empty output prevention: quando o input é composto exclusivamente por caracteres removidos (e.g., `"!!!"` → `""`), o normalizer retorna string vazia `""`. Downstream consumers devem tratar string vazia como "descriptor inválido/descartável".

### normalizeText Decomposition
- **D-11:** Decompor `normalizeText` existente em funções atômicas reutilizáveis: `normalizeUnicode()`, `normalizeCase()`, `normalizeSeparators()`, `removePunctuation()`, `collapseUnderscores()`, `trimUnderscores()`, `singularize()`.
- **D-12:** A ORDEM das etapas deve ser EXPLÍCITA E TESTADA. O pipeline composer define a sequência.
- **D-13:** `normalizeText` original pode ser mantido temporariamente como preset/compat, mas a API pública canônica é `normalizeDescriptor`.
- **D-22:** Ordem canônica obrigatória do pipeline (singularization DEPOIS de separator normalization):
  1. `normalizeUnicode()` — NFD decomposition, diacritic removal, ligature expansion
  2. `normalizeCase()` — lowercase
  3. `normalizeSeparators()` — spaces, hyphens, slashes → `_`
  4. `removePunctuation()` — strip non-alphanumeric/non-underscore
  5. `collapseUnderscores()` — multiple `_` → single `_`
  6. `trimUnderscores()` — remove leading/trailing `_`
  7. `singularize()` — plural → singular (MUST run on already-separated tokens)

### Alias Integration
- **D-14:** O normalizer IGNORA aliases nesta fase. A function signature permanece pura: `(input: string) => string`. NÃO parametrizar com alias map.
- **D-15:** Preparação arquitetural apenas — o design permite que alias resolution seja plugada depois como uma etapa separada no pipeline da Phase 4.

### Test Organization
- **D-16:** Testes em arquivos separados por concern dentro de `src/tests/normalization/` — um arquivo por step (lowercase, unicode, separators, punctuation, pluralization).
- **D-17:** Incluir "normalization trace tests" — testes que validam a transformação step-by-step (e.g., `"Fresh-Green!!!"` → lowercase → separator → punctuation → final).
- **D-18:** Incluir testes de propriedade: idempotency (`normalize(normalize(x)) === normalize(x)`), determinism, canonical charset invariant.

### Idempotency Contract
- **D-23:** Idempotency é CONTRATO FORMAL, não apenas teste. `normalizeDescriptor(normalizeDescriptor(x)) === normalizeDescriptor(x)` para qualquer input. Isso é fundamental para garantir estabilidade do pipeline em múltiplas passagens e DEVE ser documentado e testado explicitamente.

### Performance Contract
- **D-24:** Incluir benchmark micro-tests. O pipeline será executado sobre dezenas de milhares de descriptors. Asserção de performance: 100k normalizações abaixo de um threshold de tempo (a definir na implementação, ex: < 500ms). Testar via Vitest com `performance.now()`.

### Agent's Discretion
- Organização interna dos módulos em `src/normalizer/`
- Nomes exatos das funções atômicas
- Formato das mensagens de erro/warning
- Quantidade de entradas no irregular plurals dictionary
- Decisão sobre manter ou não `normalizeText` como compat export

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Domain Types (Phase 1 output)
- `src/types/taxonomy.ts` — Define `CanonicalDescriptor`, `TaxonomySubfamily` — consumers do descriptor normalizado
- `src/types/seed.ts` — Define `TaxonomySeed` — hierarquia seed com descriptors a normalizar
- `src/types/alias.ts` — Define `DescriptorAliasSeed` — type do alias map (NÃO usar nesta phase)
- `src/types/registry.ts` — Define `DescriptorNode`, `DescriptorRegistry` — consumers futuros

### Existing Normalizer Code
- `src/normalizer/text_normalizer.ts` — `normalizeText()` existente (NFD, diacritics, ligatures, punctuation, lowercase, trim) — **DECOMPOSE THIS**
- `src/tests/normalization.test.ts` — 3 testes existentes para `normalizeText`

### Loader Code (Phase 2 output)
- `src/loader/seed_validator.ts` — `isSnakeCase` regex e `validateSeed` — referência para canonical charset
- `src/loader/alias_loader.ts` — `loadAliasSeed` — carrega aliases (não usar no normalizer)
- `src/loader/alias_validator.ts` — `validateAliasSeed` — valida chains (não usar no normalizer)

### Data Files
- `data/taxonomy/taxonomy-seed.v1.json` — Seed real com descriptors a corrigir para snake_case
- `data/taxonomy/descriptor_aliases.seed.json` — Alias seed (referência, NÃO integrar no normalizer)

### Project References
- `.planning/ROADMAP.md` §Phase 3 — Goal, requirements (NORM-01 to NORM-05), success criteria
- `.planning/REQUIREMENTS.md` §Normalization — NORM-01 to NORM-05
- `.planning/PROJECT.md` §Constraints — Coding style conventions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/normalizer/text_normalizer.ts` → `normalizeText()`: Base para decomposição. Já implementa NFD + diacritics + ligatures + punctuation + lowercase + trim.
- `src/loader/seed_validator.ts` → `isSnakeCase`: Regex `/^[a-z][a-z0-9_]*$/` — referência para canonical charset validation.
- `src/tests/normalization.test.ts` → 3 testes existentes que cobrem diacritics, ligatures, punctuation — devem migrar ou ser expandidos.

### Established Patterns
- ESM modules (`"type": "module"` em package.json)
- TypeScript strict mode (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Zero runtime dependencies — tudo built-in (fs, path do Node.js)
- Pure functions, arrow functions, sem semicolons
- `type` (não `interface`), snake_case properties, PascalCase tipos, camelCase functions
- `import type` para type-only imports, `readonly` arrays
- Vitest para testes em `src/tests/`

### Integration Points
- `src/normalizer/` → módulo destino para todo o pipeline
- `src/tests/normalization/` → nova subpasta de testes por concern
- `data/taxonomy/taxonomy-seed.v1.json` → arquivo a corrigir

### Bug Encontrado na Discussão
- O seed v1 contém descriptors com espaços (`"orange blossom"`, `"lily of the valley"`, `"sweet orange"`, `"bitter orange"`, `"tree moss"`) que falham no `isSnakeCase` check do validator.
- Correção: fix o seed para `snake_case` puro como parte do plano 03-01.

</code_context>

<specifics>
## Specific Ideas

- O pipeline de normalização deve produzir output que satisfaz `^[a-z0-9_]+$` — o canonical charset é o contrato de saída
- Trace tests permitem debugar cada step do pipeline isoladamente
- O irregular plurals dictionary pode ser expandido incrementalmente conforme novos termos do corpus aparecem na Phase 4
- `normalizeText` original pode ser mantido como `_legacyNormalizeText` ou simplesmente deletado após decomposição

</specifics>

<deferred>
## Deferred Ideas

### Semantic Stopwords (Future — NOT this phase)
Tokens genéricos como `note`, `nuance`, `effect`, `type`, `quality` são ruído semântico que provavelmente precisarão ser removidos do pipeline em fases futuras. Esses stopwords não são normalization (que é sintática) — são filtragem semântica e pertencem à camada de análise (Phase 4) ou inferência (Phase 5). Documentado no ROADMAP como future consideration.

</deferred>

---

*Phase: 3-Normalization Pipeline*
*Context gathered: 2026-05-14*
