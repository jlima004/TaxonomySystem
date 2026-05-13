# Taxonomy System Hardening (Phase 2 -> Phase 3)

Este plano reflete a arquitetura final consolidada com todos os detalhamentos técnicos para garantir segurança morfológica, performance linear e tipagem intransigente antes da normalização da Phase 3.

## User Review Required

Nenhuma ação obstrutiva. Aguardando a aprovação final para executar as refatorações.

## Resoluções de Arquitetura (Feedback Aplicado)

1. **Separação de Domínio (Semantic vs Molecular)**: A camada molecular continua atada ao `CorpusMaterial`. O loader semântico exportará apenas views `SemanticMaterial`.
2. **Stress Test via Runtime**: Mock in-memory de 50.000 instâncias será feito nativamente na Vitest para testes de integridade estrutural E temporal (tempo-limite).
3. **Migração Canônica**: A seed da taxonomia (`taxonomy-seed.v1.json`) foi limpa para a representação base (`snake_case`).
4. **Ownership e Evolução**: Inclusão de lógicas futuras visando source/sensory descriptors division, além da aceitação/resolução de descriptors multi-familiares baseada na topologia olfativa natural.

---

## Proposed Changes

### 1. Core Types & Validation Refactor

#### [MODIFY] `src/loader/types.ts`
- Alterar `ValidationResult` para `ValidationResult<T>`.
- Renomear métodos base para `makeError` e `makeResult` e adicionar hierarquias nos paths dos erros (`Family > Subfamily`).

#### [MODIFY] `src/loader/seed_validator.ts`
- Implementar `ValidationResult<TaxonomySeed>` limitando coerce.
- Enriquecer as paths de erro ("Family floral > Subfamily floral_white: descriptor must be snake_case").
- Detecção estrita de `descriptor` (rejeitar duplicatas intrafamiliares). Colisões extrafamiliares sofrem deferimento (estratégia passiva de ownership para topologias complexas).
- `camelCase` default para funções TS exportadas.

#### [MODIFY] `src/types/corpus.ts`
- Exportar `SemanticMaterial` contendo exclusivamente `identity`, `olfactory`, `organoleptic`, e `meta`.

---

### 2. Immutability & Hardening Loaders

#### [MODIFY] `src/loader/seed_loader.ts` & `src/loader/corpus_loader.ts`
- Renomeação padronizada para `loadTaxonomySeed` e `loadCorpus`.
- Garantir `readonly` (deep-readonly pattern) de array e objetos para os objetos retornados, abdicando do overhead de `Object.freeze`.
- O `loadCorpus` realizará mapping seletivo e estrito, retornando coleções de `SemanticMaterial`.

---

### 3. Alias Seed System & Descriptor Registry

Novos recursos infraestruturais para unificação semântica em todo o corpus e seeds.

#### [NEW] `data/taxonomy/descriptor_aliases.seed.json`
- Dicionário chave-valor com normalizações básicas de grafia e espaçamento (`"orange flower": "orange_blossom"`).

#### [NEW] `src/types/alias.ts` e `src/types/registry.ts`
- Definir os tipos primitivos em `alias.ts`.
- **Implementar o novo Registry**: Criar `src/types/registry.ts` com a definição do grafo node-based:
  ```ts
  export type DescriptorNode = {
    readonly id: string;
    readonly canonical: string;
    readonly aliases: readonly string[];
    readonly family_refs: readonly string[];
    readonly occurrence_count: number;
  };
  export type DescriptorRegistry = ReadonlyMap<string, DescriptorNode>;
  ```

#### [NEW] `src/loader/alias_validator.ts`
- `validateAliasSeed`: Função de detecção circular com **proteção de Chains Longas** — O validador irá rejeitar resoluções com depth profunda (ex: A -> B -> C -> D -> E -> F). Uma chain de alias deve resolver no seu canonical form imediatamente ou em depth máxima aceitável estritamente controlada (ex: `max_depth = 1`).

#### [NEW] `src/loader/alias_loader.ts`
- `loadAliasSeed`: Leitura file-system e parsing assíncrono blindado.

---

### 4. Tests & Invariants (Edge Cases e Performance)

Baterias de teste reforçadas incorporando normalizações linguísticas.

#### [NEW] `tests/normalization.test.ts`
- **Unicode e Punctuation Normalization (Locale Edge Cases)**: Testes para a conversão de caracteres diacríticos e acentuados baseados em locales estrangeiros (ex: `frühling` -> `fruhling`, `cœur` -> `coeur`, `ñ` -> `n`, `ü` -> `u`, e stripping de pontuações indesejadas).

#### [NEW] `tests/semantic_invariants.test.ts`
- Checagem em validador e alias loader testando chains longas bloqueadas, e ciclos (indiretos e diretos).

#### [NEW] `tests/determinism.test.ts`
- **Strict Deterministic Ordering**: Arrays e objetos subjacentes mantêm saídas padronizadas consistentes não importando o hash de runtime da execução V8 atual.

#### [NEW] `tests/immutability.test.ts`
- Assignment block check (`readonly` compiler checks) e impossibilidade de deleção indevida nos mapas do taxonomy.

#### [NEW] `tests/stress.test.ts`
- Mock com Vitest Runtime Mocker (10k-50k instances).
- **Tempo Limite de Performance**: Adicionadas asserções para o **TEMPO** além de heap/stack, forçando que o carregamento e inicialização das 50k entidades ocorram abaixo de um delta de segundos (Ex: `< 1.5 seconds`).

## Verification Plan

### Automated Tests
- Extensa bateria do `vitest run` aferindo assertividade temporal de grandes matrizes.
- Tipagem via `tsc --noEmit` cobrindo o DeepReadonly pattern.
