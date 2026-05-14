# Phase 3: Normalization Pipeline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14
**Phase:** 03-normalization-pipeline
**Areas discussed:** Pipeline architecture, Pluralization, Seed fix + hyphens, normalizeText decomposition, Alias integration, Test organization, Canonical charset, Consecutive underscores, Empty output, Numeric semantics, Pipeline order, Idempotency, Benchmarks, Semantic stopwords

---

## Pipeline Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Array reduce (composable) | `pipeline.reduce((acc, fn) => fn(acc), input)` — cada step é `(s: string) => string` | ✓ |
| Named rule objects | `{ name, transform }` com metadata/logging | |
| Monolithic function | Tudo inline num único `normalize()` | |

**User's choice:** Array reduce composable. Cada step deve ser deterministic, stateless, synchronous, side-effect free.
**Notes:** Evitar monolithic normalize(). A composição via reduce é o pattern ideal para v1. Sem overhead de wrappers com metadata.

---

## Pluralization Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Dictionary-first + fallback | Camada 1: curated dictionary; Camada 2: regras mínimas (ies→y, es→"", s→"") | ✓ |
| Algorithmic (Porter-like) | Stemmer baseado em regras morfológicas | |
| npm package (pluralize) | Biblioteca externa | |

**User's choice:** Dictionary-first. Curated dictionary para irregulares do domínio perfumístico + fallback com 3 suffix rules mínimas.
**Notes:** NÃO usar npm package — estamos construindo semantic infrastructure e domain normalization layer. O domínio é limitado e controlável.

---

## Seed Fix + Hyphen Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Fix seed + universal `→ _` | Corrigir seed para snake_case puro; todos separadores (espaço, hyphen, slash, múltiplos) → `_` | ✓ |
| Preservar hyphens | Manter hyphens em compostos como ylang-ylang | |
| Configurable | Flag para escolher comportamento | |

**User's choice:** SIM, fixar seed permanentemente. Universal separator normalization — todo separator (espaço, hyphen, slash, múltiplos) → `_`.
**Notes:** `"orange blossom"` → `"orange_blossom"`, `"ylang-ylang"` → `"ylang_ylang"`. Sem exceções.

---

## normalizeText Decomposition

| Option | Description | Selected |
|--------|-------------|----------|
| Decompor em funções atômicas | Quebrar em `normalizeUnicode()`, `normalizeCase()`, `normalizeSeparators()`, `removePunctuation()`, etc. | ✓ |
| Manter intacto (wrapper legado) | `normalizeText` fica como está, pipeline novo é separado | |
| Substituir inteiramente | Um único pipeline serve tudo | |

**User's choice:** Decompor em funções atômicas. A ORDEM das etapas deve ser EXPLÍCITA E TESTADA.
**Notes:** Funções atômicas recomendadas: `normalizeUnicode()`, `normalizeCase()`, `normalizeSeparators()`, `removePunctuation()`, `collapseUnderscores()`, `trimUnderscores()`, `singularize()`.

---

## Alias Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Ignorar nesta fase | Signature pura `(input: string) => string` | ✓ |
| Parametrizar signature | `(input: string, aliases?: Map) => string` | |

**User's choice:** Ignorar aliases nesta fase, MAS com preparação arquitetural. A função deve continuar `(input: string) => string`. NÃO fazer `(input, aliases)`.
**Notes:** Separação fundamental: `normalization != aliasing != taxonomy resolution`. Cada camada tem seu domínio.

---

## Test Organization

| Option | Description | Selected |
|--------|-------------|----------|
| Arquivos separados por concern | `tests/normalization/` com arquivos individuais por step | ✓ |
| Expandir normalization.test.ts | Tudo num único arquivo | |

**User's choice:** Arquivos separados. Estrutura: `tests/normalization/{lowercase,unicode,separators,punctuation,pluralization,determinism}.test.ts`
**Notes:** Incluir "normalization trace tests" que validam step-by-step a transformação completa.

---

## Canonical Descriptor Charset (User-Initiated)

**User recommendation:** Definir desde já o canonical descriptor charset: `^[a-z0-9_]+$`
**Notes:** Isso formaliza o contrato de saída do normalizer e pode ser usado como invariante nos testes.

---

## Agent's Discretion

- Organização interna dos módulos no `src/normalizer/`
- Escolha de nomes exatos para as funções atômicas
- Formato das mensagens de erro/warning do normalizer
- Quantidade exata de entradas no irregular plurals dictionary

---

## Refinements (Second Round — 2026-05-14)

User-initiated refinements after initial discussion. All accepted and incorporated.

### 1. Consecutive Underscores — Formal Rule
**User's refinement:** Formalizar que múltiplos separadores consecutivos SEMPRE colapsam para um único `_`.
**Example:** `fresh---green///woody` → `fresh_green_woody`
**Notes:** `collapseUnderscores()` já existia no plano, mas agora é regra formal documentada.

### 2. Empty Output Prevention
**User's refinement:** Definir o comportamento quando input é composto apenas de caracteres removidos.
**Example:** `"!!!"` → `""`
**Notes:** Downstream consumers devem tratar string vazia como descriptor descartável.

### 3. Numeric Semantics — Explicit Documentation
**User's refinement:** Documentar explicitamente que números são permitidos no canonical charset.
**Rationale:** Aldehydes (`c12`, `c14`, `c18`), musks, ionones são frequentes no domínio perfumístico.
**Notes:** O regex `^[a-z0-9_]+$` já permitia, mas agora está documentado como decisão intencional.

### 4. Pipeline Order Formalization
**User's refinement:** Singularization DEVE ocorrer DEPOIS da separator normalization. Ordem canônica: unicode → case → separator → punctuation → underscore collapse → trim underscores → singularize.
**Notes:** Incorporado como D-22 no context.

### 5. Idempotency as Formal Contract
**User's refinement:** `normalize(normalize(x)) === normalize(x)` é CONTRATO, não apenas teste.
**Notes:** FUNDAMENTAL para estabilidade do pipeline. Incorporado como D-23.

### 6. Benchmark Micro-Tests
**User's refinement:** Incluir testes de performance — 100k normalizações abaixo de um threshold.
**Rationale:** O pipeline processará dezenas de milhares de descriptors.
**Notes:** Incorporado como D-24.

### 7. Semantic Stopwords — Future Note
**User's refinement:** Tokens como `note`, `nuance`, `effect`, `type`, `quality` são ruído semântico.
**Decision:** NÃO nesta fase. Documentar no roadmap como future consideration.
**Notes:** Stopwords são filtragem semântica, não normalização sintática.

---

## Deferred Ideas

- **Semantic Stopwords** — Filtragem de tokens genéricos (note, nuance, effect, type, quality). Pertence à Phase 4/5, não à normalização. Documentado no ROADMAP.
