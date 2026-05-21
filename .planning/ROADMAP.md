# Roadmap: Olfactory Taxonomy System

## Overview

Este roadmap descreve o desenvolvimento do Taxonomy Builder v1, um sistema em Node.js/TypeScript (zero-dependency) que processa dados moleculares enriquecidos (PubChem) e seeds manuais para gerar um sistema semântico olfativo normalizado em arquivos JSON compilados (hierarquia, aliases, grafo esparso de similaridade).

## Phases

- [x] **Phase 1: Foundation** - Setup do projeto TypeScript, arquitetura puramente funcional e definição de tipos base
- [x] **Phase 2: Data Loaders** - Implementação de parsers e streaming para o corpus de 70MB e a taxonomy seed
- [x] **Phase 3: Normalization Pipeline** - Regras componíveis para normalização semântica (lowercase, trim, stemming, etc)
- [x] **Phase 4: Corpus Analysis** - Contagem de frequência, co-ocorrência e algoritmos de string similarity (alias detection)
- [x] **Phase 5: Inference Engine** - Inferência de similaridade multi-dimensional e clustering de descriptors
- [ ] **Phase 6: Compilation & CLI** - Geração de artefatos JSON, schema validation e entry point executável

## Phase Details

### Phase 1: Foundation

**Goal**: Estabelecer os alicerces do projeto, garantindo tipagem rigorosa e zero runtime dependencies.
**Depends on**: Nothing
**Requirements**: ARCH-01, ARCH-02, ARCH-03, ARCH-04
**Success Criteria**:

  1. Types TS para materiais do corpus, seeds e taxonomias finais compilam sem erros
  2. Testes básicos usando Vitest rodam com sucesso
  3. Estrutura de pastas `src/` modularizada e pronta

**Plans**: 2 plans

Plans:

- [x] 01-01: Setup TypeScript, Vitest e arquitetura base
- [x] 01-02: Definição de Type Definitions (Domain Models)

### Phase 2: Data Loaders

**Goal**: Carregar com segurança e eficiência (streaming) a base de conhecimento inicial e o corpus bruto.
**Depends on**: Phase 1
**Requirements**: INPT-01, INPT-02, INPT-03, INPT-04
**Success Criteria**:

  1. JSON seed (dummy ou real) é validado e carregado
  2. Corpus de 70MB (`enriched_materials.json`) é lido via stream sem estourar o limite de RAM do V8
  3. Apenas campos olfativos relevantes são extraídos

**Plans**: TBD

Plans:

- [x] 02-01: Seed loader e validator
- [x] 02-02: Streaming parser para `enriched_materials.json`

### Phase 3: Normalization Pipeline

**Goal**: Normalizar agressivamente todos os descritores extraídos para sua forma canônica base.
**Depends on**: Phase 1
**Requirements**: NORM-01, NORM-02, NORM-03, NORM-04, NORM-05
**Success Criteria**:

  1. "Fresh Green" e "fresh-green" reduzem para o mesmo token (`fresh_green`)
  2. Funções puras cobrem todas as regras (plural, pontuação, trim, separators)
  3. Output satisfaz canonical charset `^[a-z0-9_]+$`
  4. Idempotency contract: `normalize(normalize(x)) === normalize(x)`
  5. Performance: 100k normalizações abaixo de threshold definido

**Plans**: TBD

Plans:

- [x] 03-01: Atomic normalizer functions (unicode, case, separators, punctuation, singularize)
- [x] 03-02: Pipeline composer, seed fix, trace tests e benchmarks

### Phase 4: Corpus Analysis

**Goal**: Extrair estatísticas vitais do corpus (frequências, overlaps) e sugerir aliases baseados em similaridade de strings.
**Depends on**: Phase 2, Phase 3
**Requirements**: ANAL-01, ANAL-02, ANAL-03, ANAL-04
**Success Criteria**:

  1. Matriz de co-ocorrência é gerada a partir dos dados do corpus
  2. Algoritmo de Levenshtein ou Jaro-Winkler identifica potenciais erros ortográficos (ex: "camomile" e "chamomile")

**Future Consideration**: Semantic stopwords removal (tokens genéricos como `note`, `nuance`, `effect`, `type`, `quality`) — filtragem semântica a avaliar nesta fase ou na Phase 5.
**Plans**: 2 plans

Plans:

- [x] 04-01-PLAN.md — Frequência e Co-ocorrência (ANAL-01, ANAL-02)
- [x] 04-02-PLAN.md — String similarity + alias detection (ANAL-03, ANAL-04)

### Phase 5: Inference Engine

**Goal**: Processar dados brutos do corpus + seed em um mapa semântico refinado, inferindo os graus de similaridade entre subfamílias.
**Depends on**: Phase 4
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04
**Success Criteria**:

  1. Sistema computa um score de similaridade usando pelo menos 2 dimensões (overlap semântico + tradição)
  2. Apenas scores > 0.25 são preservados (formando um grafo esparso)

**Plans**: 4 plans

Plans:
**Wave 1**

- [x] 05-01-PLAN.md — Merge de seed e corpus / Clustering básico (INFR-01, INFR-02)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 05-02-PLAN.md — Calculadoras dimensionais e inputs curados explícitos (INFR-03, INFR-04)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 05-03-PLAN.md — Composição de final_score e threshold estrito (INFR-03, INFR-04)

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 05-04-PLAN.md — Grafo esparso de similaridade multi-dimensional (INFR-03, INFR-04)

### Phase 6: Compilation & CLI

**Goal**: Unir tudo e materializar a taxonomia v1 pronta para ser consumida pela próxima camada de inteligência.
**Depends on**: Phase 5
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04
**Success Criteria**:

  1. Executar o CLI gera 3 arquivos (`taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`)
  2. Output segue rigidamente os schemas predefinidos (sem chaves undefined ou nulas em locais não permitidos)

**Plans**: TBD

Plans:

- [x] 06-01: Schema validation dos outputs
- [ ] 06-02: Geradores JSON e CLI (process.argv)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | ✅ Complete | 2026-05-13 |
| 2. Data Loaders | 2/2 | ✅ Complete | 2026-05-13 |
| 3. Normalization Pipeline | 2/2 | ✅ Complete | 2026-05-17 |
| 4. Corpus Analysis | 2/2 | ✅ Complete | 2026-05-18 |
| 5. Inference Engine | 4/4 | ✅ Complete | 2026-05-19 |
| 6. Compilation & CLI | 1/2 | In Progress|  |
