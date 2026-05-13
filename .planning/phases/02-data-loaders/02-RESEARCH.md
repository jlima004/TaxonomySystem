# Phase 2: Data Loaders — Research

**Researched:** 2026-05-13
**Phase:** 02-data-loaders
**Requirements:** INPT-01, INPT-02, INPT-03, INPT-04

## 1. Corpus Schema Analysis (Real Data)

### Top-Level Keys (consistent across all 33,742 items)

```
id, identity, classification, olfactory, text, physchem, solubility, usage, safety, meta, molecular
```

### Schema Mismatch: Real vs `CorpusMaterial` Type

| Campo | No Type? | No Corpus? | Notas |
|-------|----------|------------|-------|
| `text` | ✗ | ✓ | Objeto com `general_description` — ignorar (D-09) |
| `physchem` | ✗ | ✓ | 3.610 itens com dados — ignorar (D-09) |
| `solubility` | ✗ | ✓ | Campo extra — ignorar (D-09) |
| `safety` | ✗ | ✓ | 4.097 itens com dados — ignorar (D-09) |
| `meta` | ✗ | ✓ | Todos os 33.742 itens têm `sources`, `source_urls`, `confidence_score` |
| `olfactory.flavor_description` | ✗ | ✓ | Campo extra no olfactory — não presente no type |

**Decisão necessária:** O type `CorpusMaterial` não inclui `text`, `physchem`, `solubility`, `safety`, `meta`. O loader deve:
1. Fazer mapeamento seletivo — extrair APENAS os campos do type
2. O campo `meta` (especialmente `confidence_score`) pode ser útil para ponderação futura → capturar via extensão opcional

### Olfactory Sub-Keys (presença real)

```
descriptors, primary_type, odor_description, descriptor_sources, flavor_description
```

- `flavor_description` existe no corpus mas NÃO no type `OlfactoryProfile` — ignorar na leitura
- `descriptor_sources` presente em TODOS os 33.742 itens (sempre preenchido)

## 2. Cobertura Olfativa do Corpus

| Métrica | Valor |
|---------|-------|
| Total de materiais | 33.742 |
| Com dados olfativos (algum) | 6.842 (20.3%) |
| Com descriptors não-vazios | 6.589 (19.5%) |
| Com primary_type | 5.550 (16.4%) |
| Com odor_description | 5.086 (15.1%) |
| SEM nenhum dado olfativo | 26.900 (79.7%) |
| Descriptors únicos | 701 |
| Primary types únicos | ~140 |

**Insight crítico:** 80% do corpus NÃO tem dados olfativos. O loader deve filtrar materiais sem dados olfativos para evitar processar 27K itens vazios nas fases subsequentes.

### Top 20 Descriptors por Frequência

```
fruity:1564, green:1517, floral:1487, sweet:1459, woody:1329,
herbal:1183, spicy:978, citrus:695, fresh:629, balsamic:626,
waxy:515, fatty:501, tropical:392, earthy:367, rose:355,
oily:323, minty:321, powdery:282, nutty:271, phenolic:249
```

## 3. Performance: JSON.parse para 67MB

### Medições Reais

| Métrica | Valor |
|---------|-------|
| Tamanho do arquivo | 67 MB |
| RSS após parse | 334 MB |
| Heap Used | 260 MB |
| Heap Total | 329 MB |
| Ratio arquivo→heap | ~3.9x |

### Análise

- **67MB arquivo → 260MB heap** é esperado (strings em JS usam UTF-16 = 2x, mais overhead de objetos)
- O limite default do V8 é 4GB (Node 20+), então 334MB RSS é confortável
- `JSON.parse` é a abordagem mais rápida — C++ nativo no V8
- **Confirmação: D-01 (JSON.parse simples) é a decisão correta** — sem necessidade de streaming

### Riscos Mitigados

1. **OOM:** Impossível com 334MB RSS vs 4GB limit
2. **Parse lento:** `JSON.parse` é O(n) nativo em C++, ~2-3 segundos para 67MB
3. **GC pressure:** Pico único, GC pode reclamar ~200MB após filtragem seletiva

## 4. Estratégia de Implementação: Corpus Loader

### Abordagem Recomendada

```
readFile(path, 'utf8') → JSON.parse() → map(filterFields) → CorpusMaterial[]
```

### Filtragem de Campos (D-07, D-08, D-09)

O raw JSON tem 11 campos top-level. O type `CorpusMaterial` espera 6:
- `id` ✓
- `identity` ✓ (mapear direto)
- `classification` ✓ (mapear direto)
- `olfactory` ✓ (excluir `flavor_description`)
- `usage` ✓ (mapear direto)
- `molecular` ✓ (mapear direto, geralmente vazio `{}`)

**Excluir:** `text`, `physchem`, `solubility`, `safety`, `meta`

### Interface Pública

```typescript
const load_corpus: (path: string) => Promise<readonly CorpusMaterial[]>
```

- Assíncrona por design (D-02) — futura troca por streaming sem breaking change
- `readonly` array no retorno (convenção do projeto)
- Path parametrizado (D-10)

## 5. Estratégia de Implementação: Seed Loader

### Schema do `TaxonomySeed` (de `src/types/seed.ts`)

```typescript
type TaxonomySeed = {
  version: string
  metadata: SeedMetadata        // created_at, author, description
  families: TaxonomySeedFamily[] // id, name, subfamilies[]
}
```

### Validação Profunda (D-06) — Regras

| Regra | Campo | Validação |
|-------|-------|-----------|
| R1 | `version` | string semver válida (ex: `"1.0.0"`) |
| R2 | `metadata.created_at` | ISO 8601 date string |
| R3 | `metadata.author` | string não-vazia |
| R4 | `metadata.description` | string não-vazia |
| R5 | `families` | array não-vazio |
| R6 | `families[].id` | snake_case, único entre families |
| R7 | `families[].name` | string não-vazia |
| R8 | `families[].subfamilies` | array não-vazio |
| R9 | `subfamilies[].id` | snake_case, único global (entre todas as subfamilies) |
| R10 | `subfamilies[].name` | string não-vazia |
| R11 | `subfamilies[].descriptors` | array não-vazio de strings |
| R12 | Cross-ref | Nenhum descriptor duplicado dentro da mesma subfamily |

### Pattern de Validação

Usar abordagem funcional com `Result` type:

```typescript
type ValidationError = {
  readonly path: string       // ex: "families[0].subfamilies[1].id"
  readonly expected: string   // ex: "snake_case string"
  readonly received: string   // ex: "Floral White"
}

type ValidationResult = {
  readonly ok: boolean
  readonly errors: readonly ValidationError[]
}
```

- Coletar TODOS os erros (não fail-fast) para feedback completo
- Mensagens descritivas com path completo (D-06)
- Zero coercion — rejeitar dados malformados

### Interface Pública

```typescript
const load_taxonomy_seed: (path: string) => Promise<TaxonomySeed>
// Throws com ValidationError[] se inválido
```

## 6. Estrutura de Arquivos

```
src/loader/
  corpus_loader.ts       — loadCorpus(path) → Promise<CorpusMaterial[]>
  seed_loader.ts         — loadTaxonomySeed(path) → Promise<TaxonomySeed>
  seed_validator.ts      — validateSeed(data) → ValidationResult
  types.ts               — ValidationError, ValidationResult (tipos locais do loader)
  index.ts               — barrel exports

src/tests/
  corpus_loader.test.ts  — testes unitários do corpus loader
  seed_loader.test.ts    — testes unitários do seed loader
  seed_validator.test.ts — testes do validador (rules R1-R12)
```

## 7. Dependências e Riscos

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| `flavor_description` no olfactory não está no type | Baixa | Ignorar na filtragem — campo não utilizado pela taxonomy layer |
| 80% do corpus sem dados olfativos | Média | Decidir: filtrar no loader ou deixar para fases subsequentes? Recomendação: retornar TODOS, filtrar na fase de análise (manter loader como leitor fiel) |
| Campo `meta` potencialmente útil (confidence_score) | Baixa | Não extrair agora — pode ser adicionado ao type depois se necessário |
| Seed JSON não existe ainda | Baixa | Criar fixture de teste minimal para validação; seed real é manual (D-04) |

## 8. Validation Architecture

### Test Strategy

**Corpus Loader:**
- Teste com fixture pequena (3-5 materiais) cobrindo variações de campos
- Teste de filtragem — campos extras (`text`, `physchem`) ausentes no output
- Teste de tipo — output satisfaz `CorpusMaterial[]`
- Teste de path inexistente → erro gracioso
- Teste com JSON malformado → erro claro

**Seed Validator:**
- Teste por regra (R1-R12) — cada regra com caso válido e inválido
- Teste de acumulação — múltiplos erros num único seed
- Teste de path em mensagens — "families[0].subfamilies[1].id"
- Teste de unicidade — ids duplicados detectados

**Seed Loader:**
- Teste de integração — load + validate happy path
- Teste de rejeição — seed inválido com erros descritivos

## RESEARCH COMPLETE
