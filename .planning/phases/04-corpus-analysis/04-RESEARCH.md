# Phase 4 Research: Corpus Analysis

**Researched:** 2026-05-17
**Domain:** Single-pass corpus statistics + custom lexical similarity for alias detection
**Confidence:** HIGH (escopo é puramente algorítmico, zero dependências externas, todos os contratos travados em CONTEXT.md)
**Language note:** Discussão em pt-BR; identificadores, código e termos técnicos em inglês — alinhado a `04-CONTEXT.md` e `03-01-SUMMARY.md`.

---

<user_constraints>

## User Constraints (from 04-CONTEXT.md)

### Locked Decisions

- **ANAL-D-01** Frequência e co-occurrence DEVEM ser calculadas exclusivamente de `CorpusMaterial.olfactory.descriptors`. Demais campos textuais ficam FORA do escopo.
- **ANAL-D-02** `identity.aliases` NÃO contribui para estatísticas, co-occurrence, nem alias candidates.
- **ANAL-D-03** Descriptors normalizados DEVEM ser deduplicados por material (document frequency, não term frequency) antes da contagem.
- **Implícito (D-21 da Phase 3)** Outputs vazios (`""`) do normalizer DEVEM ser descartados antes da contagem.
- **ANAL-D-04** Cada par no mesmo material contribui com weight binário **+1** após dedup. Sem ponderação local.
- **ANAL-D-05** Pares são symmetric e armazenados em ordem lexicográfica canônica (`a < b`). Half-matrix.
- **ANAL-D-06** Representação interna sparse `Map<pair_key, count>`. Export como edge list (`Array<{a, b, count}>`). PROIBIDO matriz densa N×N.
- **ANAL-D-07** SEM threshold mínimo de frequência durante counting. Filtering downstream.
- **ANAL-D-08** Alias candidate generation usa **normalized Levenshtein similarity** como métrica lexical primária (`1 - distance / max(len)`).
- **ANAL-D-09** Multi-token descriptors (snake_case com múltiplos segmentos) DEVEM ser comparados com dois sinais: whole-string Levenshtein normalizado + token overlap (Jaccard sobre split em `_`).
- **ANAL-D-10** Precision over recall. Substring containment standalone NÃO pode ser sinal de similaridade.
- **ANAL-D-11** Defaults high-precision (`score >= 0.90`). Output são apenas sugestões — NUNCA auto-merge.
- **ANAL-D-12** Semantic stopwords (`note`, `nuance`, `effect`, `type`, `quality`) NÃO removidos na Phase 4. Deferido para Phase 5.
- **ANAL-D-13** APIs retornam estruturas puras em memória (`readonly`). Persistência é OPCIONAL e desacoplada.
- **ANAL-D-14** Exports opcionais vivem em `data/analysis/` com versão explícita no nome: `descriptor_frequency.v1.json`, `descriptor_cooccurrence.v1.json`, `alias_candidates.v1.json`.
- **ANAL-D-15** Todos os exports deterministicamente ordenados (descriptors lex; alias candidates por score desc + lex tiebreaker).
- **ANAL-D-16** Alias candidate pool: apenas descriptors com `frequency >= 2` por default; threshold configurável; aplicado APENAS na suggestion generation (NUNCA na contagem base).
- **ANAL-D-17** Self-pairs `(A,A)` NUNCA são emitidos.
- **ANAL-D-18** Complexidade linear sobre o corpus para frequency + co-occurrence (single pass). Sem matrizes densas. Benchmarks via `performance.now()` em Vitest com thresholds CI-safe apenas para regression detection (não hard contract).

### Claude's Discretion

- **Área 4** (estrutura do output de alias suggestions) — recomendações concretas neste documento (§Alias Candidate Generation).
- **Pair key encoding** dentro de `Map<pair_key, count>` (`"a|b"`, `"a::b"`, tuple-like, nested map) — recomendação concreta com rationale (§Frequency & Co-occurrence Implementation).
- **Organização interna de `src/analyzer/`** — sugestão concreta com base na estrutura já apontada em CONTEXT.
- **Quais helpers derivados expor** (PMI, NPMI, Jaccard sobre o sparse map) — recomendação: NÃO expor na Phase 4; deferido para Phase 5.
- **Quantidade exata de entradas no benchmark e thresholds CI específicos** — recomendação concreta (§Validation Architecture).

### Deferred Ideas (OUT OF SCOPE)

- **Semantic stopwords** → Phase 5 (ANAL-D-12).
- **PMI / NPMI / conditional probabilities como output canônico** → derivadas opcionais, provavelmente úteis na Phase 5.
- **Auto-merge de alias candidates** → out of scope (ANAL-D-11). Workflow de merge fica para Phase 6 ou pós-milestone.
- **Cluster detection** → Phase 5 (INFR-02).
- **Pair key encoding** → decisão de PLAN (recomendada aqui).

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **ANAL-01** | Analyzer counts frequency of each normalized descriptor in corpus | §Frequency & Co-occurrence — single-pass `Map<string, number>`, dedup por material, normalização no entry, `""` descartado. |
| **ANAL-02** | Analyzer builds co-occurrence matrix for descriptors | §Frequency & Co-occurrence — sparse `Map<pair_key, number>`, pairs canônicos lex, binary +1, sem self-pairs, export como edge list ordenada. |
| **ANAL-03** | String similarity algorithm implemented (Levenshtein/Jaro-Winkler) | §String Similarity Algorithms — Levenshtein two-row DP, normalized similarity, token Jaccard, substring-only rejection; Jaro-Winkler descartado como primário por D-08, opcional como helper diagnóstico (não recomendado). |
| **ANAL-04** | Alias detector identifies candidate aliases using string similarity | §Alias Candidate Generation — pool `freq >= 2`, length bucketing, gates anti-substring, exclusão de pares já no `descriptor_aliases.seed.json`, output ordenado por score desc + lex. |

</phase_requirements>

---

## Summary

- A Phase 4 é puramente algorítmica e sem dependências runtime novas: tudo cabe em Node built-ins, alinhado com a doutrina zero-dependency do projeto (PROJECT.md).
- O caminho ótimo é **um único `analyzeCorpus(corpus, options)`** que percorre o corpus uma vez e compartilha o descriptor-set deduplicado entre frequência e co-occurrence, satisfazendo ANAL-D-18 sem materializar matriz densa. Alias candidates são computados em segundo estágio, em cima do `FrequencyMap` final.
- Para co-occurrence, **sparse `Map<string, number>` flat com pair key `"a|b"`** é a escolha recomendada — o charset canônico (`^[a-z0-9_]+$`, Phase 3 D-09/D-20) impede colisão com `|`, e a estrutura é mais simples e mais leve em memória do que `Map<string, Map<string, number>>` ou tuple-keyed Maps.
- A camada de similaridade lexical é **Levenshtein two-row DP em TypeScript puro** (≈30 linhas) com `Uint16Array` reutilizado dentro de cada chamada; um pre-filter por bucket de comprimento torna o pairwise `O(N²)` tratável mesmo se o pool com freq ≥ 2 chegar a alguns milhares de descriptors.
- Combiner multi-token recomendado: `lev_norm` é o score primário, **gating duro contra substring-only false positives** (`rose ⊂ rosewood`) e gate por `token_jaccard >= 0.5` quando ambos têm ≥2 tokens — consistente com ANAL-D-10 (precision over recall).
- Persistência é estritamente opcional (ANAL-D-13). `src/analyzer/export.ts` aplica ordenação determinística + `fs.promises.mkdir({ recursive: true })`. Sem timestamps no payload (quebraria byte-for-byte diffability exigida por ANAL-D-15).

**Primary recommendation:** Implementar dois módulos primários (`src/analyzer/frequency_cooccurrence.ts` em single-pass + `src/analyzer/alias_candidates.ts` em segundo estágio), suportados por `src/analyzer/similarity/{levenshtein,token_overlap}.ts` puros, orquestrados por `src/analyzer/index.ts` via `analyzeCorpus`, com export opcional desacoplado em `src/analyzer/export.ts`.

---

## Architectural Responsibility Map

A Phase 4 é puramente uma camada de domínio (analytics) dentro do builder. Não há cliente browser, frontend server, CDN, ou banco de dados envolvido — apenas Node.js single-process. O mapa abaixo organiza por **módulo de responsabilidade** (em vez de tier arquitetural), que é o eixo relevante para este projeto.

| Capability | Primary Module | Secondary Module | Rationale |
|------------|----------------|------------------|-----------|
| Single-pass frequency + co-occurrence extraction | `src/analyzer/frequency_cooccurrence.ts` | — | ANAL-D-18 exige single pass — compartilhar o descriptor-set dedup'd entre as duas contagens evita rework. |
| Descriptor normalization at entry | `src/normalizer/normalize_descriptor.ts` (Phase 3) | — | Phase 4 NÃO duplica normalização (ANAL-D-23 implicit; ver `<specifics>` do CONTEXT). |
| Lexical similarity primitives (Levenshtein) | `src/analyzer/similarity/levenshtein.ts` | — | Pure `(a,b) => number`, sem estado, sem dependências. |
| Token overlap (Jaccard) | `src/analyzer/similarity/token_overlap.ts` | — | Pure helper para multi-token descriptors (ANAL-D-09). |
| Alias candidate generation | `src/analyzer/alias_candidates.ts` | similarity helpers + loaders | Consome `FrequencyMap`, `TaxonomySeed?`, `DescriptorAliasSeed?` via injection — sem coupling de IO. |
| Optional persistence (filesystem) | `src/analyzer/export.ts` | `node:fs/promises` | Desacoplado da computação (ANAL-D-13). |
| Family annotation lookup | `src/analyzer/alias_candidates.ts` (in-process) | `src/loader/seed_loader.ts` (one-time setup) | Mapa `descriptor → family[]` construído uma vez antes do pairwise scan. |
| Top-level orchestration | `src/analyzer/index.ts` (`analyzeCorpus`) | — | Único entry point pública; encapsula ordem das fases. |

---

## Frequency & Co-occurrence Implementation

### Single-pass algorithm shape (ANAL-01 + ANAL-02 + ANAL-D-18)

```typescript
// Esqueleto algorítmico — NÃO é código final, é a forma recomendada
const computeFrequencyAndCoOccurrence = (
  corpus: readonly { readonly olfactory: { readonly descriptors: readonly string[] } }[]
): {
  readonly frequency: ReadonlyMap<string, number>
  readonly cooccurrence: ReadonlyMap<string, number>  // key = `${a}|${b}`, a < b
} => {
  const frequency = new Map<string, number>()
  const cooccurrence = new Map<string, number>()

  for (const material of corpus) {
    // 1. Normalize + drop empties + dedup → descriptor-set único do material
    const set = new Set<string>()
    for (const raw of material.olfactory.descriptors) {
      const canonical = normalizeDescriptor(raw)
      if (canonical.length > 0) set.add(canonical)
    }

    if (set.size === 0) continue

    // 2. Sort once → estabiliza ordenação canônica para pair generation
    const sorted = [...set].sort()

    // 3. Frequency increment (document frequency: +1 per material per unique descriptor)
    for (const d of sorted) {
      frequency.set(d, (frequency.get(d) ?? 0) + 1)
    }

    // 4. Pair generation (i < j garante canonical lex order ANAL-D-05 + sem self-pairs ANAL-D-17)
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i]!
      for (let j = i + 1; j < sorted.length; j++) {
        const b = sorted[j]!
        const key = `${a}|${b}`
        cooccurrence.set(key, (cooccurrence.get(key) ?? 0) + 1)
      }
    }
  }

  return { frequency, cooccurrence }
}
```

**Por que essa forma:**

- **Single pass** sobre o corpus → linear em `|corpus|`, satisfaz ANAL-D-18 [VERIFIED: CONTEXT.md ANAL-D-18].
- **Dedup com `Set`** antes de incrementar → document frequency (ANAL-D-03), e elimina necessidade de re-dedup para pair generation.
- **Sort uma vez por material**, depois indexação `i < j` → gera pares já em ordem canônica lex (ANAL-D-05); evita comparação `a < b` por par; elimina self-pairs estruturalmente (ANAL-D-17).
- **Empty drop no entry** (`canonical.length > 0`) → cumpre o "implícito" do CONTEXT (descriptors inválidos não poluem stats).
- **Reutilização do `Set`/`sorted`** elimina alocações desnecessárias entre frequency e co-occurrence.

### Pair-key encoding (Claude's Discretion)

**Opções consideradas:**

| Opção | Vantagem | Desvantagem | Adequação ao charset canônico |
|-------|----------|-------------|-------------------------------|
| **`"${a}\|${b}"`** ← **RECOMENDADO** | Legível em logs/exports, debuggável, baixo overhead | Colide se `\|` aparecer em descriptor | **Seguro:** charset `^[a-z0-9_]+$` proíbe `\|` (Phase 3 D-09/D-20) |
| `"${a}\u0000${b}"` | Sempre seguro contra colisão | Ilegível em logs; tooling JSON pode mal-serializar | Funciona |
| `"${a}::${b}"` | Legível | Mais bytes por entrada vs `\|` | Funciona (`:` proibido pelo charset) |
| Tuple wrapper `{a, b}` como key | Type-safe | `Map` faz reference equality — keys são objetos distintos a cada lookup; precisa stringificar de qualquer jeito | Pior dos mundos |
| Nested `Map<string, Map<string, number>>` | Iteração agrupada por outer descriptor | ~80B overhead por outer key (Map header); dois lookups por incremento; pior densidade de cache | Não recomendado para sparse pair counts em ~milhares de entradas |

**Recomendação:** `"${a}|${b}"` flat `Map<string, number>`, com comentário no módulo justificando que o charset canônico (`^[a-z0-9_]+$`) garante ausência de colisão. Adicionar `assertCanonical(a)` debug-only via util é opcional — defer para o PLAN.

**Decode helper:** `decodePairKey(key: string): readonly [string, string]` via `key.indexOf('|')` (não `split`, que aloca array extra desnecessariamente em hot path de export).

### Sparse map operations — tradeoffs em escala real

Estimativa from corpus shape (~33.742 materiais × 5–15 descriptors típicos):

- Total descriptor occurrences ≈ 33.742 × ~10 = ~337k (pre-dedup).
- Unique descriptors normalizados esperados: **~1.000–8.000** (long tail; muitos com freq=1).
- Pares únicos no co-occurrence map: limite superior teórico ~N²/2 mas na prática sparse — esperar **~50k–500k entradas** no `Map`.

Para esse volume, `Map<string, number>` flat:

- ~50 bytes por entrada (key string + Number + Map slot overhead em V8) → ~25 MB no pior caso (500k entradas). Aceitável.
- Lookup `O(1)` amortizado.
- Iteração ordem de inserção; ordenação para export é `O(K log K)` aplicada uma vez no boundary.

`Map<string, Map<string, number>>` aninhado para o mesmo volume:

- Cada outer key adiciona ~80B de Map header → +80B × N (~8.000) = ~640 KB extra de overhead estrutural, mais pressão de cache em iteração full.
- Iteração por outer key é mais rápida quando você quer "vizinhos de A" — mas o caso de uso da Phase 4 é varredura completa para export, não lookup por descriptor → ganho não materializa.

**Decisão:** flat `Map<string, number>` com pair key.

### Empty-string descriptor handling at the boundary

`normalizeDescriptor("")` retorna `""` (Phase 3 D-21, validado em `src/tests/normalization/property.test.ts`). Phase 4 DEVE filtrar `canonical.length > 0` **antes** de adicionar ao `Set` do material. Isto é o que o CONTEXT chama de "implícito" — formalizar explicitamente como teste de contrato.

### Deterministic export shape (edge list)

```typescript
// Frequency export — sorted lex by descriptor
type FrequencyEntry = { readonly descriptor: string; readonly count: number }
const exportFrequency = (m: ReadonlyMap<string, number>): readonly FrequencyEntry[] =>
  [...m.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([descriptor, count]) => ({ descriptor, count }))

// Co-occurrence export — sorted by (a, b)
type CoOccurrenceEdge = { readonly a: string; readonly b: string; readonly count: number }
const exportCoOccurrence = (m: ReadonlyMap<string, number>): readonly CoOccurrenceEdge[] =>
  [...m.entries()]
    .map(([key, count]) => {
      const sep = key.indexOf('|')
      return { a: key.slice(0, sep), b: key.slice(sep + 1), count }
    })
    .sort((x, y) => (x.a < y.a ? -1 : x.a > y.a ? 1 : x.b < y.b ? -1 : x.b > y.b ? 1 : 0))
```

JSON.stringify a essa edge list é byte-deterministic dada a ordem das chaves (`a, b, count` em ordem de inserção do object literal).

---

## String Similarity Algorithms (ANAL-03)

### Levenshtein distance — two-row DP

Implementação canônica em TypeScript puro, sem dependências, sem estado mutável de módulo:

```typescript
// Source: classical two-row DP (Levenshtein 1966). [CITED: en.wikipedia.org/wiki/Levenshtein_distance]
const levenshteinDistance = (a: string, b: string): number => {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  // Garantir b é o menor → aloca min(m,n) memória
  const [short, long] = a.length <= b.length ? [a, b] : [b, a]
  const m = short.length
  const n = long.length

  // Dois rows alternados via Uint16Array (descriptors são curtos — len < 256 facilmente)
  let prev = new Uint16Array(m + 1)
  let curr = new Uint16Array(m + 1)
  for (let i = 0; i <= m; i++) prev[i] = i

  for (let j = 1; j <= n; j++) {
    curr[0] = j
    const bj = long.charCodeAt(j - 1)
    for (let i = 1; i <= m; i++) {
      const cost = short.charCodeAt(i - 1) === bj ? 0 : 1
      const del = (prev[i] ?? 0) + 1
      const ins = (curr[i - 1] ?? 0) + 1
      const sub = (prev[i - 1] ?? 0) + cost
      curr[i] = Math.min(del, ins, sub)
    }
    const tmp = prev; prev = curr; curr = tmp
  }

  return prev[m] ?? 0
}
```

**Complexidade:** `O(m·n)` tempo, `O(min(m,n))` memória.

**Decisões de implementação:**

- `Uint16Array` (não array nativo) → ~4× menos memória, sem boxing de Numbers, melhor cache locality. Descriptors normalizados são `[a-z0-9_]+`, comprimentos típicos 4–25, raramente >40 → cabem em `Uint16` (max 65535).
- Alocação **por chamada**, não buffer compartilhado de módulo → preserva pureza funcional (padrão estabelecido em PROJECT.md / convenção do engine). Pairwise scan é `O(N²)` chamadas no pior caso; com pool ~freq≥2 ~1k–3k e length-bucketing, total comparações ~1M–5M → alocação por chamada é aceitável (V8 reutiliza heap rapidamente).
- `charCodeAt` evita criação de substring por caracter.
- `??` defensivo apenas para satisfazer `noUncheckedIndexedAccess` do `tsconfig.json` (PROJECT.md).

### Normalized Levenshtein similarity

```typescript
const levenshteinSimilarity = (a: string, b: string): number => {
  const max = Math.max(a.length, b.length)
  if (max === 0) return 1  // ambos vazios → similaridade 1 (caso impossível pós-filter, mas matematicamente correto)
  return 1 - levenshteinDistance(a, b) / max
}
```

**Edge cases definidas:**

| `a` | `b` | distance | max | similarity | Justificativa |
|-----|-----|----------|-----|------------|---------------|
| `""` | `""` | 0 | 0 | **1** | Identidade trivial. Nunca ocorre em produção (empties filtrados no boundary). |
| `""` | `"rose"` | 4 | 4 | **0** | `1 − 4/4 = 0`. Idêntico ao retorno se diferentes completos. |
| `"camomile"` | `"chamomile"` | 1 | 9 | **0.888…** | Caso canônico do ROADMAP. **Não passa o threshold 0.90.** Ver §Alias Candidate Generation para tratamento. |
| `"rose"` | `"rosewood"` | 4 | 8 | **0.5** | Substring; abaixo do threshold de qualquer modo. |

**ATENÇÃO sobre o caso canônico:** `camomile↔chamomile` tem similaridade `≈0.889` — **abaixo de 0.90**. Duas opções para garantir que o caso canônico do ROADMAP seja detectado:

1. **Baixar threshold default para `0.85`** — ainda high-precision, conserva intent de ANAL-D-11; documentar trade-off.
2. **Manter `0.90` como default** e tratar `camomile↔chamomile` como caso testado via parâmetro custom no test fixture.

**Recomendação:** **opção 2** — manter `0.90` (ANAL-D-11 é explícito sobre defaults high-precision); o teste do caso canônico exercita o threshold configurável (`{ minScore: 0.85 }`) e documenta no PLAN que defaults conservadores podem perder casos de borda como `camomile↔chamomile`. O PLAN deve decidir explicitamente — esta é uma tensão entre ANAL-D-11 (defaults conservadores) e o ROADMAP success criterion ("identifica `camomile`↔`chamomile`"). Sugestão concreta: PLAN documenta que o critério do ROADMAP é satisfeito **com threshold configurável** (ANAL-D-11 permite "thresholds configurable").

### Token overlap (Jaccard) — multi-token signal

```typescript
const tokenOverlapSimilarity = (a: string, b: string): number => {
  const ta = new Set(a.split('_'))
  const tb = new Set(b.split('_'))
  let intersection = 0
  for (const t of ta) if (tb.has(t)) intersection++
  const union = ta.size + tb.size - intersection
  if (union === 0) return 1
  return intersection / union
}
```

**Aplicabilidade:** Para `lily_of_the_valley` vs `lily_of_valley` → `ta={lily,of,the,valley}`, `tb={lily,of,valley}` → Jaccard `3/4 = 0.75`. Lev_norm: `1 − 3/19 ≈ 0.842`. Combinados com regra abaixo, ambos passam o gate.

Para `rose` vs `rosewood` → tokens singleton diferentes → Jaccard `0/2 = 0`. Combined com lev_norm `0.5` → rejeitado.

### Combiner rule (whole-string + token overlap)

Regra recomendada (ANAL-D-09 + ANAL-D-10):

```typescript
const isSubstringOnly = (a: string, b: string): boolean => {
  if (a === b) return false
  const [s, l] = a.length <= b.length ? [a, b] : [b, a]
  return l.includes(s)  // s é substring contígua de l
}

const TOKEN_OVERLAP_FLOOR = 0.5  // applies only when both have >= 2 tokens

const shouldEmitCandidate = (
  a: string,
  b: string,
  minScore: number,
): { emit: boolean; score: number; algo: 'lev_norm' | 'lev_norm+tokens'; tokenOverlap: number | null } => {
  const score = levenshteinSimilarity(a, b)
  if (score < minScore) return { emit: false, score, algo: 'lev_norm', tokenOverlap: null }

  // ANAL-D-10: substring containment standalone não é sinal
  // Se um é substring contígua do outro E o score é "alto-mas-não-quase-identidade", rejeita
  if (isSubstringOnly(a, b) && score < 0.97) {
    return { emit: false, score, algo: 'lev_norm', tokenOverlap: null }
  }

  const aMulti = a.includes('_')
  const bMulti = b.includes('_')
  if (aMulti && bMulti) {
    const tokenOverlap = tokenOverlapSimilarity(a, b)
    if (tokenOverlap < TOKEN_OVERLAP_FLOOR) {
      return { emit: false, score, algo: 'lev_norm+tokens', tokenOverlap }
    }
    return { emit: true, score, algo: 'lev_norm+tokens', tokenOverlap }
  }

  return { emit: true, score, algo: 'lev_norm', tokenOverlap: null }
}
```

**Rationale:**

- `lev_norm` é sempre o score primário (ANAL-D-08).
- `isSubstringOnly` + `score < 0.97` rejeita `rose↔rosewood` (`score=0.5`, substring → reject) e ainda admite `chamomile↔camomile` (`score=0.889`, NÃO é substring contígua → passa o gate de substring).
  - Edge: `rosewood↔rosewoods` (plural) é `score≈0.94`, substring, mas seria pego pelo singularizer da Phase 3 antes de chegar aqui.
- Gate de token Jaccard `>= 0.5` aplica APENAS quando ambos têm `_` → não penaliza pares single-token legítimos.

### Por que Jaro-Winkler é mencionado no ROADMAP mas Levenshtein é o lock

ROADMAP §Phase 4 success criteria menciona "Levenshtein ou Jaro-Winkler". ANAL-D-08 trava Levenshtein como primário. **Recomendação:**

- **NÃO expor Jaro-Winkler na Phase 4** — adicionaria código sem justificativa de uso (ANAL-D-11 está coberto por Levenshtein normalizado).
- Se houver demanda futura (Phase 6 review tooling), implementar como helper diagnóstico isolado em `src/analyzer/similarity/jaro_winkler.ts` sem entrar no pipeline default de alias candidates.
- Defer a decisão para Phase 6 / pós-milestone; manter Phase 4 minimal.

### Performance de pairwise similarity

Custo total de pairwise scan ≈ `N²/2 × O(m·n)` onde `N` = pool freq≥2 e `m,n` ≈ 5–25.

| N (pool) | Pares brutos | Após length-bucketing | Tempo estimado |
|----------|--------------|----------------------|----------------|
| 500 | 124.750 | ~25k | < 100ms |
| 1.000 | 499.500 | ~100k | < 400ms |
| 3.000 | 4.498.500 | ~900k | < 4s |
| 5.000 | 12.497.500 | ~2.5M | ~10s |

**Length-bucketing é mandatório** para N > ~1.500. Detalhes em §Alias Candidate Generation.

---

## Alias Candidate Generation (ANAL-04)

### Pool restriction (ANAL-D-16)

Apenas descriptors com `frequency >= options.minFrequency` (default `2`) entram no pool de comparação pairwise. Isso elimina o long tail de descriptors típicos com freq=1 que dominam o pool em corpus reais sem agregar precision (descriptors únicos raramente são variações ortográficas de outros — são, na maioria, ruído ou hapax legomena).

**Confirmação:** O filtro aplica APENAS ao pool de candidatos, NUNCA à contagem base de frequência ou co-occurrence (ANAL-D-16 explícito). O `FrequencyMap` retornado por `computeFrequencyAndCoOccurrence` permanece com TODOS os descriptors.

### Length bucketing pre-filter

`lev_norm >= threshold` implica `dist <= (1 − threshold) × max(len_a, len_b)`, e como `dist >= |len_a − len_b|`, podemos descartar pares onde `|len_a − len_b| > (1 − threshold) × max(len_a, len_b)`.

Para `threshold = 0.90`, isso significa: pares cuja diferença absoluta de comprimento exceda 10% do maior comprimento são rejeitados antes do Levenshtein.

```typescript
const findAliasCandidates = (
  frequency: ReadonlyMap<string, number>,
  options: AliasCandidateOptions
): readonly AliasCandidate[] => {
  const minFreq = options.minFrequency ?? 2
  const minScore = options.minScore ?? 0.90

  // 1. Filter pool
  const pool: { readonly word: string; readonly freq: number }[] = []
  for (const [word, freq] of frequency) {
    if (freq >= minFreq) pool.push({ word, freq })
  }

  // 2. Bucket by length
  const byLen = new Map<number, typeof pool>()
  for (const p of pool) {
    const L = p.word.length
    if (!byLen.has(L)) byLen.set(L, [])
    byLen.get(L)!.push(p)
  }
  const lens = [...byLen.keys()].sort((a, b) => a - b)

  // 3. Pairwise scan only within bucket pairs (L_i, L_j) where (L_j − L_i) <= (1 − minScore) * L_j
  const candidates: AliasCandidate[] = []
  for (let i = 0; i < lens.length; i++) {
    const li = lens[i]!
    const bucketI = byLen.get(li)!
    for (let j = i; j < lens.length; j++) {
      const lj = lens[j]!
      const maxLen = Math.max(li, lj)
      if (lj - li > (1 - minScore) * maxLen) break  // buckets are sorted; no later j qualifies
      const bucketJ = byLen.get(lj)!
      // Compare bucketI × bucketJ (intra-bucket: avoid (a,a) by i < j when same bucket)
      // [... emission logic with shouldEmitCandidate + exclusões abaixo ...]
    }
  }

  // 4. Sort by score desc, lex tiebreaker (ANAL-D-15)
  return candidates.sort((x, y) =>
    y.score !== x.score ? y.score - x.score
    : x.a < y.a ? -1 : x.a > y.a ? 1
    : x.b < y.b ? -1 : x.b > y.b ? 1
    : 0
  )
}
```

**Efeito do bucketing:** Para pool N=3.000 com distribuição típica de comprimentos (mediana ~10, std ~5), reduz comparações de ~4.5M para ~500k–900k (5–9× speedup). Mantém 100% de recall do que passaria o threshold final.

### Output schema (recomendação)

```typescript
export type AliasCandidate = {
  readonly a: string                    // sempre lex menor (consistência com co-occurrence)
  readonly b: string                    // sempre lex maior
  readonly score: number                // lev_norm em [0, 1]
  readonly algo: 'lev_norm' | 'lev_norm+tokens'
  readonly frequencies: {
    readonly a: number
    readonly b: number
  }
  readonly token_overlap?: number       // presente quando algo === 'lev_norm+tokens'
  readonly families?: {                 // soft signal (ANAL-D-10 spirit: review humano)
    readonly a: readonly string[]
    readonly b: readonly string[]
  }
  readonly suggested_canonical?: string // aplicação da hierarquia seed > frequency > lexicographic
  readonly cross_family?: boolean       // helper derivado para revisão humana
}
```

**Por que esses campos:**

- `a, b` em ordem lex → consistente com co-occurrence (ANAL-D-05), evita confusão.
- `score` separado de `algo` → quem consome pode reordenar por `algo` se quiser auditar.
- `algo` discriminant naming: `'lev_norm'` e `'lev_norm+tokens'` (NÃO `'lev'` ou `'lev_norm_only'`) — explicitamente nomeia o que está ativo. Curtinho, snake_case-friendly.
- `frequencies` plural — útil para o reviewer humano priorizar pares high-freq.
- `token_overlap` opcional (presente apenas no algo combinado).
- `families` opcional — só populado se `options.taxonomySeed` injetado.
- `suggested_canonical` opcional — só populado se `options.aliasSeed` injetado (precisa do seed para resolver hierarquia).
- `cross_family` opcional — derivável de `families` mas pre-computado para conveniência de revisão.

### Canonical alias direction (`seed > frequency > lexicographic`)

```typescript
const pickCanonical = (
  a: string,
  b: string,
  freqA: number,
  freqB: number,
  aliasSeed: ReadonlyMap<string, string> | undefined,
  taxonomySeedDescriptors: ReadonlySet<string> | undefined,
): string => {
  // 1. SEED: se um é canonical do seed e outro não → canonical vence
  if (taxonomySeedDescriptors) {
    const aInSeed = taxonomySeedDescriptors.has(a)
    const bInSeed = taxonomySeedDescriptors.has(b)
    if (aInSeed !== bInSeed) return aInSeed ? a : b
  }
  // 2. SEED ALIAS MAP: se um é VALOR (canonical) do alias seed e outro não
  if (aliasSeed) {
    const canonicals = new Set(aliasSeed.values())  // pré-computado no caller
    const aIsCanonical = canonicals.has(a)
    const bIsCanonical = canonicals.has(b)
    if (aIsCanonical !== bIsCanonical) return aIsCanonical ? a : b
  }
  // 3. FREQUENCY: mais frequente vence
  if (freqA !== freqB) return freqA > freqB ? a : b
  // 4. LEXICOGRAPHIC: menor vence (determinismo final)
  return a < b ? a : b
}
```

**Nota:** No PLAN, pré-computar `Set(aliasSeed.values())` e `taxonomySeedDescriptors` UMA vez antes do pairwise scan, não a cada chamada.

### Family annotation

Construir mapa one-time antes do pairwise scan:

```typescript
const buildDescriptorToFamilies = (seed: TaxonomySeed): ReadonlyMap<string, readonly string[]> => {
  const m = new Map<string, string[]>()
  for (const fam of seed.families) {
    for (const sub of fam.subfamilies) {
      for (const raw of sub.descriptors) {
        const canonical = normalizeDescriptor(raw)
        if (canonical.length === 0) continue
        const list = m.get(canonical) ?? []
        if (!list.includes(fam.id)) list.push(fam.id)
        m.set(canonical, list)
      }
    }
  }
  return m
}
```

**Importante:** Aplica `normalizeDescriptor` nos descriptors do seed também — Phase 3 D-23 garante idempotency, então é safe mesmo se o seed já estiver normalizado. Não confiar que o seed esteja canônico (princípio análogo à orientação para o corpus em `<specifics>` de CONTEXT.md).

`cross_family = !families.a.some(fam => families.b.includes(fam))`. Pares cross-family são **soft signal** — não rejeitam o candidato, apenas anotam para revisão humana (ANAL-D-10 prefere precision mas mantém a decisão humana fora de hard-rules cross-family).

### Exclusão de pares já no `descriptor_aliases.seed.json`

`loadAliasSeed(path)` retorna `DescriptorAliasSeed = Record<string, string>` (mapping `raw → canonical`). Para excluir candidates já cobertos:

```typescript
const buildSeedPairSet = (aliasSeed: DescriptorAliasSeed): ReadonlySet<string> => {
  const pairs = new Set<string>()
  for (const [raw, canonical] of Object.entries(aliasSeed)) {
    const rawN = normalizeDescriptor(raw)
    const canN = normalizeDescriptor(canonical)
    if (rawN.length === 0 || canN.length === 0 || rawN === canN) continue
    const [lo, hi] = rawN < canN ? [rawN, canN] : [canN, rawN]
    pairs.add(`${lo}|${hi}`)
  }
  return pairs
}
```

**Por que normalizar o seed:** O seed atual contém formas raw (`"orange flower"`, `"oak moss"`) que normalizam para `"orange_blossom"`, `"oakmoss"` etc. — comparações pairwise são em formas canônicas, então o set de exclusão precisa estar em forma canônica também. Validei isso lendo `data/taxonomy/descriptor_aliases.seed.json` (apenas 7 entradas hoje; padrão raw→canonical).

**Acoplamento:** Phase 4 consome `loadAliasSeed` (já existente em `src/loader/alias_loader.ts`), NÃO faz parsing nem assume schema. Se Phase 6 mudar o formato do seed, apenas o loader muda — Phase 4 fica desacoplada (ANAL-D-13 spirit).

### High-precision default threshold (ANAL-D-11)

Defaults concretos:

```typescript
export type AliasCandidateOptions = {
  readonly minFrequency?: number      // default 2 (ANAL-D-16)
  readonly minScore?: number          // default 0.90 (ANAL-D-11)
  readonly tokenOverlapFloor?: number // default 0.5
  readonly substringRejectScore?: number // default 0.97 (limiar acima do qual substring é aceita como near-identical)
  readonly aliasSeed?: DescriptorAliasSeed       // optional injection
  readonly taxonomySeed?: TaxonomySeed           // optional injection
}
```

Todos os defaults exportados como UPPER_SNAKE_CASE constants no mesmo módulo para visibilidade em diff/code-review.

---

## Top-level Orchestration & Types

### `analyzeCorpus(corpus, options)` — recommended

```typescript
export type CorpusAnalysis = {
  readonly frequency: ReadonlyMap<string, number>
  readonly cooccurrence: ReadonlyMap<string, number>  // key = `${a}|${b}`, a < b
  readonly aliasCandidates: readonly AliasCandidate[]
}

export type AnalyzeCorpusOptions = {
  readonly aliasCandidates?: AliasCandidateOptions  // se undefined, alias step é skipped (retorna [])
}

export const analyzeCorpus = (
  corpus: readonly { readonly olfactory: { readonly descriptors: readonly string[] } }[],
  options?: AnalyzeCorpusOptions,
): CorpusAnalysis => {
  const { frequency, cooccurrence } = computeFrequencyAndCoOccurrence(corpus)
  const aliasCandidates = options?.aliasCandidates
    ? findAliasCandidates(frequency, options.aliasCandidates)
    : []
  return { frequency, cooccurrence, aliasCandidates }
}
```

**Pros (recomendados):**

- Single entry point → CLI da Phase 6 e Phase 5 inference layer consomem um único call.
- Single pass para frequência + co-occurrence é mandatório (ANAL-D-18); orchestrar reforça isso por contrato.
- Alias candidates opt-in via options → permite Phase 5 consumir só `frequency`/`cooccurrence` sem custo de `O(N²)`.

**Cons + mitigação:**

- Couples three concerns → mitigado por exportar `computeFrequencyAndCoOccurrence` e `findAliasCandidates` separadamente para testes unitários e uso composicional.

**Input typing — recomendação:** Aceitar tipo estrutural mínimo `readonly { readonly olfactory: { readonly descriptors: readonly string[] } }[]` em vez de `CorpusMaterial[]` ou `SemanticMaterial[]`. Isso permite tests usarem fixtures minimais sem montar `MaterialIdentifiers`/`MaterialClassification`/`MolecularProperties` completos. Para callers reais, `loadCorpus` (que retorna `readonly SemanticMaterial[]`) satisfaz o shape estrutural automaticamente — TypeScript verifica.

### Types module: `src/types/analysis.ts` (novo)

```typescript
// src/types/analysis.ts
export type FrequencyMap = ReadonlyMap<string, number>

export type CoOccurrenceMap = ReadonlyMap<string, number>
// pair_key encoding: `${a}|${b}` where a < b lexicographically
// charset canônico (^[a-z0-9_]+$, Phase 3 D-09/D-20) garante ausência de colisão com '|'

export type CoOccurrenceEdge = {
  readonly a: string
  readonly b: string
  readonly count: number
}

export type FrequencyEntry = {
  readonly descriptor: string
  readonly count: number
}

export type AliasCandidate = {
  readonly a: string
  readonly b: string
  readonly score: number
  readonly algo: 'lev_norm' | 'lev_norm+tokens'
  readonly frequencies: {
    readonly a: number
    readonly b: number
  }
  readonly token_overlap?: number
  readonly families?: {
    readonly a: readonly string[]
    readonly b: readonly string[]
  }
  readonly suggested_canonical?: string
  readonly cross_family?: boolean
}

export type CorpusAnalysis = {
  readonly frequency: FrequencyMap
  readonly cooccurrence: CoOccurrenceMap
  readonly aliasCandidates: readonly AliasCandidate[]
}
```

Adicionar `export type { ... } from './analysis.ts'` em `src/types/index.ts` para participar do barrel pattern (consistente com convenção atual).

### Internal module layout (recomendado)

```
src/analyzer/
├── index.ts                              # barrel: analyzeCorpus, helpers públicos
├── frequency_cooccurrence.ts             # computeFrequencyAndCoOccurrence (single pass)
├── alias_candidates.ts                   # findAliasCandidates, pickCanonical, buildDescriptorToFamilies, buildSeedPairSet
├── similarity/
│   ├── levenshtein.ts                    # levenshteinDistance, levenshteinSimilarity
│   └── token_overlap.ts                  # tokenOverlapSimilarity
├── pair_key.ts                           # encodePairKey, decodePairKey (small but isolates the encoding decision)
└── export.ts                             # exportFrequency, exportCoOccurrence, exportAliasCandidates, writeAnalysisArtifacts
```

Convenções aplicadas (PROJECT.md):

- snake_case filenames.
- `export const` arrow functions (no semicolons).
- `import type` para imports apenas de tipos.
- Zero dependências runtime; apenas `node:fs/promises` e `node:path` em `export.ts`.

---

## Persistence Layer (Optional)

ANAL-D-13 estabelece que persistência é OPCIONAL e desacoplada. ANAL-D-14 define paths e versionamento. ANAL-D-15 exige determinismo.

### Module shape

```typescript
// src/analyzer/export.ts
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const writeJsonDeterministic = async (path: string, payload: unknown): Promise<void> => {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(payload, null, 2) + '\n', 'utf8')
}

export const exportFrequencyJson = async (
  frequency: FrequencyMap,
  path: string,  // e.g., 'data/analysis/descriptor_frequency.v1.json'
): Promise<void> => {
  const entries = [...frequency.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([descriptor, count]) => ({ descriptor, count }))
  await writeJsonDeterministic(path, { version: 1, entries })
}

export const exportCoOccurrenceJson = async (
  cooccurrence: CoOccurrenceMap,
  path: string,
): Promise<void> => {
  const edges: CoOccurrenceEdge[] = []
  for (const [key, count] of cooccurrence) {
    const sep = key.indexOf('|')
    edges.push({ a: key.slice(0, sep), b: key.slice(sep + 1), count })
  }
  edges.sort((x, y) => (x.a < y.a ? -1 : x.a > y.a ? 1 : x.b < y.b ? -1 : x.b > y.b ? 1 : 0))
  await writeJsonDeterministic(path, { version: 1, edges })
}

export const exportAliasCandidatesJson = async (
  candidates: readonly AliasCandidate[],
  path: string,
): Promise<void> => {
  // candidates já vem ordenado por findAliasCandidates (ANAL-D-15)
  await writeJsonDeterministic(path, { version: 1, candidates })
}

export const writeAnalysisArtifacts = async (
  analysis: CorpusAnalysis,
  baseDir = 'data/analysis',
): Promise<void> => {
  await Promise.all([
    exportFrequencyJson(analysis.frequency, `${baseDir}/descriptor_frequency.v1.json`),
    exportCoOccurrenceJson(analysis.cooccurrence, `${baseDir}/descriptor_cooccurrence.v1.json`),
    exportAliasCandidatesJson(analysis.aliasCandidates, `${baseDir}/alias_candidates.v1.json`),
  ])
}
```

**Decisões importantes:**

- **NÃO incluir timestamp no payload** (`generated_at` etc.) → quebra byte-for-byte determinism exigida por ANAL-D-15 e prejudica diffability via git. Se proveniência for necessária, expor em arquivo paralelo `data/analysis/.manifest.json` ou via git log.
- `JSON.stringify(payload, null, 2)` → indentação 2 spaces, ordem de keys do objeto literal preservada por V8 (deterministic dado o source).
- Trailing newline `+ '\n'` → convenção POSIX, evita git warnings.
- `mkdir({ recursive: true })` → satisfaz "criar diretório se ausente" (CONTEXT gotchas).
- `Promise.all` em `writeAnalysisArtifacts` → IO paralelo (3 arquivos pequenos).
- Funções de export NÃO consomem `CorpusAnalysis` agregado por default (exceto a função conveniente `writeAnalysisArtifacts`) → permite exportar individualmente.

**Boundary:** `export.ts` é o ÚNICO módulo do analyzer que toca `node:fs/promises`. Toda lógica analítica permanece pura.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.0 (devDependency em `src/package.json`) |
| Config file | `src/vitest.config.ts` (existente — confirmar; estabelecido em Phase 1) |
| Quick run command | `npm --prefix src exec vitest run src/tests/analysis/` |
| Full suite command | `npm --prefix src run test` (= `vitest run`) |
| Build check | `npm --prefix src run build` (= `tsc --noEmit`) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| **ANAL-01** | Conta frequência de cada descriptor normalizado no corpus | unit + property | `npm --prefix src exec vitest run src/tests/analysis/frequency.test.ts` | ❌ Wave 0 |
| **ANAL-01** | Drop de empties pós-normalização | unit | (same file) | ❌ Wave 0 |
| **ANAL-01** | Dedup por material (document frequency) | unit + property | (same file) | ❌ Wave 0 |
| **ANAL-02** | Constrói co-occurrence sparse map | unit + property | `npm --prefix src exec vitest run src/tests/analysis/cooccurrence.test.ts` | ❌ Wave 0 |
| **ANAL-02** | Pares em ordem lex canônica (a < b) | property | (same file) | ❌ Wave 0 |
| **ANAL-02** | Self-pairs nunca emitidos (ANAL-D-17) | property | (same file) | ❌ Wave 0 |
| **ANAL-02** | Commutativity: count(a,b) === count(b,a) (decorre de D-05) | property | (same file) | ❌ Wave 0 |
| **ANAL-02** | Nenhuma entrada com count === 0 no export | property | (same file) | ❌ Wave 0 |
| **ANAL-03** | Levenshtein two-row DP retorna distance correta | unit | `npm --prefix src exec vitest run src/tests/analysis/similarity.test.ts` | ❌ Wave 0 |
| **ANAL-03** | `levenshteinSimilarity` retorna [0,1]; edges cases (empty, identidade) | unit | (same file) | ❌ Wave 0 |
| **ANAL-03** | Token Jaccard correto para multi-token | unit | (same file) | ❌ Wave 0 |
| **ANAL-03** | Substring-only rejection (rose↔rosewood) | unit | (same file) | ❌ Wave 0 |
| **ANAL-04** | Detecta `camomile↔chamomile` com threshold configurado em 0.85 | unit (fixture) | `npm --prefix src exec vitest run src/tests/analysis/alias_candidates.test.ts` | ❌ Wave 0 |
| **ANAL-04** | Exclui pares já cobertos por `descriptor_aliases.seed.json` | unit (fixture) | (same file) | ❌ Wave 0 |
| **ANAL-04** | Default `minFrequency = 2`, `minScore = 0.90` | unit | (same file) | ❌ Wave 0 |
| **ANAL-04** | Sort: score desc, lex tiebreaker | property | (same file) | ❌ Wave 0 |
| **ANAL-04** | `suggested_canonical` aplica `seed > freq > lex` | unit | (same file) | ❌ Wave 0 |
| **D-13** | `analyzeCorpus` retorna estruturas readonly puras | unit | `npm --prefix src exec vitest run src/tests/analysis/orchestration.test.ts` | ❌ Wave 0 |
| **D-13** | Sem mutação do input corpus | property | (same file) | ❌ Wave 0 |
| **D-14/D-15** | Export determinístico byte-for-byte; mkdir recursivo | unit | `npm --prefix src exec vitest run src/tests/analysis/export.test.ts` | ❌ Wave 0 |
| **D-18** | `analyzeCorpus` em 5k materiais sintéticos < 500ms (CI-safe; hard ceiling 2s) | perf (`performance.now()`) | `npm --prefix src exec vitest run src/tests/analysis/stress.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm --prefix src exec vitest run src/tests/analysis/` (suite scoped — < 5s esperado).
- **Per wave merge:** `npm --prefix src run test` (full suite).
- **Phase gate:** Full suite + build (`tsc --noEmit`) green antes de `/gsd-verify-work`.

### Property tests recomendados (canônicos para Phase 4)

1. **Frequency monotonicity sobre subsets:** Para qualquer subset `S ⊆ corpus`, `freq_S(d) <= freq_corpus(d)` para todo descriptor `d`.
2. **Sum invariant:** `sum(freq.values()) === sum(material → |dedup(descriptors)|)` para o corpus inteiro.
3. **Commutativity of co-occurrence:** `cooccurrence("${a}|${b}") === cooccurrence("${a}|${b}")` (trivial pelo storage; teste cobre que o storage é correto).
4. **No zero-count entries no export:** todos os valores em `frequency` e `cooccurrence` são `>= 1`.
5. **No self-pairs:** Para todo key em `cooccurrence`, `decode(key).a !== decode(key).b`.
6. **Idempotency sob normalização aplicada:** `analyzeCorpus(corpus)` === `analyzeCorpus(corpusComDescriptorsJáNormalizados)` — Phase 3 D-23 garante normalizeDescriptor idempotente; Phase 4 valida que aplicar normalização externa não muda o resultado.
7. **Determinism re-run:** Duas chamadas consecutivas de `analyzeCorpus(corpus)` produzem objetos com mesmo conteúdo; exports byte-for-byte iguais.

### Canonical fixtures (`src/tests/fixtures/analysis/`)

Estrutura sugerida:

```
src/tests/fixtures/analysis/
├── tiny_corpus.json              # 5–10 materiais cobrindo:
│                                  #   - dedup dentro do material
│                                  #   - multi-token (lily_of_the_valley)
│                                  #   - empties pós-normalize
│                                  #   - descriptors single-token frequentes
├── camomile_corpus.json          # materiais que ressuscitam camomile/chamomile
├── substring_trap_corpus.json    # rose, rosewood, sandalwood, sandal_wood
├── seed_excluded_corpus.json     # pares que JÁ existem em descriptor_aliases.seed.json
└── perf_corpus_5k.json           # 5.000 materiais sintéticos com distribuição realista
```

Geração de `perf_corpus_5k.json`: script utilitário em `src/tests/analysis/_fixtures/generate.ts` (não comitado se for grande; ou gerado in-test via seed determinístico).

### Performance benchmark (Vitest)

```typescript
// src/tests/analysis/stress.test.ts (esqueleto)
import { describe, it, expect } from 'vitest'
import { analyzeCorpus } from '../../analyzer/index.js'
import { generateSyntheticCorpus } from './_fixtures/generate.js'

describe('analyzeCorpus performance', () => {
  it('processes 5k synthetic materials under 500ms (CI-safe)', () => {
    const corpus = generateSyntheticCorpus({ materials: 5000, seed: 42 })
    const start = performance.now()
    const analysis = analyzeCorpus(corpus, { aliasCandidates: { minFrequency: 2, minScore: 0.90 } })
    const elapsed = performance.now() - start
    expect(analysis.frequency.size).toBeGreaterThan(0)
    expect(elapsed).toBeLessThan(2000)  // hard ceiling 2s; baseline esperado ~500ms
  })

  it('frequency+cooccurrence (sem alias step) em 5k materiais < 200ms', () => {
    const corpus = generateSyntheticCorpus({ materials: 5000, seed: 42 })
    const start = performance.now()
    analyzeCorpus(corpus)  // sem opções de alias → skip
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(500)  // single pass deve ser muito rápido
  })
})
```

**Rationale para thresholds:**

- ANAL-D-18: "thresholds CI-safe apenas para detectar regressions severas (não como hard performance contract)".
- Baseline esperado em hardware comum ~100–500ms para 5k materiais. Hard ceiling 2s detecta regressão >4× (ex.: alguém acidentalmente trocar `Map` por `Object` ou matrizar densamente).
- Sem alias step (`analyzeCorpus(corpus)` sem options): apenas single-pass freq+cooc, target 200ms, ceiling 500ms.
- **PLAN deve calibrar** o threshold após primeira run real local; o número é negociável dentro da banda "≤ 2s".

### Wave 0 Gaps

- [ ] `src/types/analysis.ts` — definir `FrequencyMap`, `CoOccurrenceMap`, `CoOccurrenceEdge`, `FrequencyEntry`, `AliasCandidate`, `CorpusAnalysis`.
- [ ] `src/types/index.ts` — adicionar re-exports do analysis types.
- [ ] `src/analyzer/pair_key.ts` — encode/decode helpers + acceptance test.
- [ ] `src/analyzer/similarity/levenshtein.ts` + tests.
- [ ] `src/analyzer/similarity/token_overlap.ts` + tests.
- [ ] `src/analyzer/frequency_cooccurrence.ts` + tests.
- [ ] `src/analyzer/alias_candidates.ts` + tests.
- [ ] `src/analyzer/export.ts` + tests.
- [ ] `src/analyzer/index.ts` (barrel + `analyzeCorpus`) + tests.
- [ ] `src/tests/analysis/` diretório + 6 arquivos de teste por concern + fixtures.
- [ ] `src/tests/analysis/_fixtures/generate.ts` — gerador de corpus sintético determinístico.
- [ ] Framework install — **N/A** (Vitest já instalado, confirmado em `src/package.json`).

---

## Security Domain

Phase 4 é puramente computacional, sem network, auth, sessions, ou trust boundaries novos. Aplicabilidade ASVS:

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | partial | Corpus e seed loaders (Phase 2) já validam JSON shape. Phase 4 assume input válido vindo dos loaders; aplica `normalizeDescriptor` como camada de saneamento adicional. |
| V6 Cryptography | no | — |
| V12 Files & Resources | low | `export.ts` escreve em paths injetados pelo caller. Risco: caller passar path arbitrário. Mitigação: documentar contrato (paths relativos a workspace) e confiar no caller (CLI da Phase 6) para gating de path. |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Path traversal via export path malicioso | Tampering | Caller-side validation; documentar que `export.ts` aceita paths confiáveis (Phase 6 CLI gate). |
| ReDoS via regex em normalization | DoS | N/A — Phase 4 não introduz regex novos; Phase 3 já validou os regex existentes contra ReDoS via `removePunctuation` (charset class, sem backtracking). |
| Memory exhaustion em corpus malicioso | DoS | Single-pass sparse map é linear em |corpus|; pior caso de pair generation é `O(k²)` por material (k = descriptors). Para `k ≤ 50` (worst case documentado em CONTEXT), 1250 pares/material → ainda linear no total. Mitigação: cap opcional `maxDescriptorsPerMaterial` no PLAN se profiling mostrar abuso. |

Sem novos endpoints, secrets, ou cross-boundary data flows. **Recomendação:** Skip Phase 4 do security review formal (`/gsd-secure-phase`) — não há mitigation a verificar além das já cobertas por Phase 2 (input validation) e Phase 3 (normalization).

---

## Don't Hand-Roll

Na verdade, a Phase 4 **deve** hand-roll quase tudo — é o ponto de PROJECT.md (zero runtime dependencies). A pergunta correta é "o que estamos hand-rolling que está bem testado em libraries externas, e por que vale a pena hand-rollar?":

| Problema | Library externa típica | Por que hand-rollar é OK aqui |
|----------|----------------------|-------------------------------|
| Levenshtein distance | `fastest-levenshtein`, `js-levenshtein` | Implementação two-row DP é ~30 linhas, bem documentada (Wikipedia [CITED: en.wikipedia.org/wiki/Levenshtein_distance]). Zero-dep doutrina do projeto. Sem features além das que precisamos. |
| Jaccard set similarity | `set-similarity` | Trivial: 5 linhas com `Set`. Library externa seria overkill. |
| Sparse co-occurrence map | `graphology`, `ml-sparse-matrix` | Nossa estrutura é uma `Map<string, number>` flat — graphology adiciona conceitos de nós/edges que não precisamos. |
| Deterministic JSON serialization | `json-stable-stringify`, `safe-stable-stringify` | Determinismo aqui é responsabilidade do nosso código (sorted entries antes do `JSON.stringify`); arrays e objects literais bastam. |
| Multiset / Counter | `mnemonist`, `collections` | `Map<string, number>` nativo é suficiente; ergonomia perdida é mínima. |

**Anti-pattern explícito a evitar:**

- **NÃO** importar `lodash`, `ramda` ou qualquer utility lib só para `sortBy`/`groupBy` — viola PROJECT.md zero-dep.
- **NÃO** "otimizar prematuramente" com bitsets, bloom filters, ou inverted indexes — corpus de 33k materiais não justifica complexidade adicional dado que single-pass + length-bucketing já entrega < 2s.
- **NÃO** materializar matriz densa de similaridade `N²` antes de aplicar threshold — viola ANAL-D-06/D-18 e estoura memória.

---

## Runtime State Inventory

Phase 4 é **greenfield** (novo subsistema `src/analyzer/`, novos arquivos opcionais em `data/analysis/`). Sem rename/refactor/migration. **Skip** — esta seção não se aplica.

---

## Environment Availability

Phase 4 não introduz dependências externas além das já presentes:

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Toolchain | ✓ | (estabelecido por Phase 1) | — |
| TypeScript | Build (`tsc --noEmit`) | ✓ | ^5.8.0 | — |
| Vitest | Tests | ✓ | ^3.2.0 | — |
| `node:fs/promises` (built-in) | `src/analyzer/export.ts` | ✓ | Node built-in | — |
| `node:path` (built-in) | `src/analyzer/export.ts` | ✓ | Node built-in | — |

Nenhuma dependência externa nova. PLAN não precisa de install step.

---

## Risks & Open Questions

### Risco 1: Worst-case pair generation em descriptor-sets grandes

**O que pode dar errado:** Materiais com `k = 50+` descriptors únicos geram `k(k-1)/2 = 1.225+` pares — `Map.set` calls em um único material. Se o corpus tail tiver mil materiais assim, são ~1.2M `Map.set` extras por chunk.

**Quantificação:** Distribuição típica TGSC/SF tem mediana 5–8 descriptors/material; cauda longa pode chegar a 30–50 em materiais complexos (extratos naturais). Pior caso de `k = 100` em 100 materiais → 495k pares extras → mainstream V8 absorbe em < 100ms.

**Mitigação:** PLAN deve adicionar property test que computa `max descriptor-set size` sobre o corpus real (one-off) e documenta o valor; se > 100, considerar cap opcional. **Não bloquear na Phase 4** — só monitorar.

### Risco 2: Substring-only false-positives concretos

Pares específicos que o gate `isSubstringOnly + score < 0.97` precisa rejeitar:

- `rose ⊂ rosewood`, `rosemary`, `rosehip` — todos `score < 0.9`, mas substring; rejeitados pelo threshold ANTES do gate, mas o gate adiciona defesa em profundidade.
- `wood ⊂ rosewood, sandalwood, cedarwood` — `score ~0.5`, todos rejeitados.
- `mint ⊂ peppermint, spearmint` — `score ~0.5`, todos rejeitados.
- `green ⊂ evergreen` — `score ~0.625`, substring → rejeitado.
- **Caso ambíguo:** `oakmoss ⊂ oakmosses` — `score = 0.875`, substring contígua, < 0.97 → **rejeitado pelo gate**. Mas isso é uma forma plural que o singularizer da Phase 3 já deveria ter colapsado para `oakmoss` antes de chegar aqui. PLAN deve incluir teste defensivo: se Phase 3 falhar em singularizar uma forma, o gate evita a sugestão errada (que coincidentemente seria a sugestão certa, mas pelo motivo errado).

### Risco 3: Determinism sob diferentes iteration orders

**O que pode dar errado:** `Map` iteration é ordem de inserção em V8 — `Map` iteration de duas runs sobre o mesmo corpus produz a mesma ordem **somente se** o corpus iteration order é estável. O loader já lê JSON array em ordem deterministic, mas se algum dia trocarmos por stream parser, a ordem pode mudar.

**Mitigação:**

- `frequency` e `cooccurrence` são `Map`s — internamente ordem de inserção, MAS o export sempre re-ordena antes de serializar (sort lex). Por design, o output JSON é byte-for-byte estável.
- Test explícito: `analyzeCorpus(corpus) → exportar → JSON.stringify`; run 2× e comparar bytes.
- Property test: `analyzeCorpus(shuffled(corpus))` produz mesmo `frequency`/`cooccurrence` que `analyzeCorpus(corpus)` (Map content equality, não iteration order).

### Risco 4: Memory ceiling do alias candidate output

Pool freq≥2 com N=5.000 e threshold=0.90 → após length-bucketing, ~2.5M comparações; output esperado em corpus realista: ~50–500 pares (alta precisão filtra agressivamente). Cada `AliasCandidate` ~300 bytes → ~150 KB. **Não é um problema**.

Worst case ataque: corpus malicioso com muitas variações ortográficas leves → output pode chegar a ~5k–10k pares. Ainda < 5MB. **Não é um problema**.

### Risco 5: Compartilhar vs computar dedup'd descriptor-set duas vezes

**Decisão:** **compartilhar** dentro do mesmo material (entre frequency increment e pair generation), como mostrado no esqueleto. Custo de compartilhar = zero (mesma loop iteration); custo de não compartilhar = 2× normalização + 2× dedup por material = ~2× tempo.

**NÃO** compartilhar entre `computeFrequencyAndCoOccurrence` e `findAliasCandidates` — a segunda opera no pool filtrado por frequência, computado APÓS o single pass. Sem compartilhamento útil.

### Open Question 1: Threshold default 0.90 vs detecção de `camomile↔chamomile`

**O que sabemos:** ANAL-D-11 trava default = 0.90. ROADMAP success criterion menciona `camomile↔chamomile` (score ≈ 0.889).

**O que está unclear:** Se o "success criterion" exige detecção COM defaults ou apenas com threshold configurado.

**Recomendação:** PLAN documenta explicitamente que o caso é detectado COM threshold customizado (e.g., `0.85`); testa ambos: (a) default 0.90 → não detecta; (b) `{ minScore: 0.85 }` → detecta. Aceita a tensão entre defaults conservadores e o success criterion verbatim. **Não tentar resolver baixando o default sem revisitar ANAL-D-11 com o usuário.**

### Open Question 2: Substring-rejection threshold (0.97)

O número `0.97` em `substring_reject_score` é uma escolha calibrada para deixar passar plurais/derivações triviais (que Phase 3 já deveria normalizar) e rejeitar substring-only pairs. **Recomendação:** PLAN testa com fixtures e ajusta — `0.95` ou `0.97` são igualmente defensáveis.

### Open Question 3: Helpers derivados (PMI, NPMI, Jaccard sobre o sparse map)

CONTEXT lista como "deferred ideas" mas também como Claude's Discretion. **Recomendação:** NÃO expor na Phase 4. Implementar quando Phase 5 precisar. Phase 5 pode importar `cooccurrence` + `frequency` do `CorpusAnalysis` e calcular helpers em seu próprio módulo. Manter Phase 4 minimal e focada.

---

## Recommendations Summary

| Decision Area | CONTEXT Anchor | Recommendation |
|---------------|----------------|----------------|
| Single-pass orchestration | ANAL-D-18 | `analyzeCorpus(corpus, options)` em `src/analyzer/index.ts`; compartilhar dedup'd descriptor-set entre frequency e cooccurrence; alias step é segundo estágio. |
| Pair key encoding | Claude's Discretion | Flat `Map<string, number>` com key `"${a}\|${b}"` (charset canônico garante ausência de colisão). |
| Empty descriptor handling | Implícito (D-21) | Filtrar `canonical.length > 0` antes de adicionar ao descriptor-set do material. |
| Levenshtein implementation | ANAL-D-08 | Two-row DP com `Uint16Array`, alocação por chamada (preserva pureza), ~30 linhas. |
| Normalized similarity edge case | ANAL-D-08 | `max === 0 → 1`; nunca ocorre em produção devido ao filtro de empties. |
| Multi-token combiner | ANAL-D-09 + D-10 | `lev_norm` primário + gate de substring-only + gate de token Jaccard ≥ 0.5 (quando ambos multi-token). |
| Substring rejection | ANAL-D-10 | `isSubstringOnly(a, b) && score < 0.97 → reject` (defense in depth). |
| Default threshold | ANAL-D-11 | `minScore = 0.90`; testar `camomile↔chamomile` com `minScore = 0.85` e documentar trade-off. |
| Jaro-Winkler | Mention only in ROADMAP | NÃO implementar. ANAL-D-08 trava Levenshtein como primário. Defer Jaro-Winkler para pós-milestone. |
| Pool restriction | ANAL-D-16 | `minFrequency = 2` default; aplicado APENAS ao alias step. |
| Pairwise scan optimization | ANAL-D-18 | Length-bucketing pre-filter: `|len_a − len_b| ≤ (1 − minScore) × max(len)`. |
| Alias output schema | Claude's Discretion | `{a, b, score, algo, frequencies, token_overlap?, families?, suggested_canonical?, cross_family?}` em ordem lex `a < b`. |
| `algo` discriminant | Claude's Discretion | `'lev_norm'` \| `'lev_norm+tokens'`. |
| Canonical direction | Claude's Discretion (CONTEXT spec) | `seed > frequency > lexicographic`, implementado em `pickCanonical`. |
| Family annotation | Claude's Discretion (CONTEXT spec) | Map descriptor → family.id[] construído via `buildDescriptorToFamilies(seed)` UMA vez; output é soft signal (sem hard reject). |
| Seed exclusion | (implicit from D-13) | `loadAliasSeed` → normalizar e construir `Set<pair_key>`; pares no set são pulados. |
| Sort do output | ANAL-D-15 | Score desc, lex tiebreaker em `(a, b)`. |
| Types module | (new) | `src/types/analysis.ts` com `FrequencyMap`, `CoOccurrenceMap`, `CoOccurrenceEdge`, `AliasCandidate`, `CorpusAnalysis`. Re-export em `src/types/index.ts`. |
| Module layout | Claude's Discretion | 8 arquivos em `src/analyzer/` (index, frequency_cooccurrence, alias_candidates, similarity/{levenshtein,token_overlap}, pair_key, export). |
| Persistence | ANAL-D-13 + D-14 + D-15 | `src/analyzer/export.ts` desacoplado; `JSON.stringify(payload, null, 2) + '\n'`; sem timestamps no payload; `mkdir({ recursive: true })`. |
| Helpers derivados (PMI etc.) | Claude's Discretion | NÃO expor na Phase 4. Defer para Phase 5. |
| Performance threshold | ANAL-D-18 | Benchmark 5k materiais sintéticos: target ~500ms (sem alias) / ~1s (com alias); hard ceiling 2s. CI-safe, não hard contract. |
| Test framework | (existing) | Vitest 3.2.0, no install needed. |
| Security review | — | Skip — sem trust boundaries novos. |

---

## Sources

### Primary (HIGH confidence)

- **CONTEXT.md** (`.planning/phases/04-corpus-analysis/04-CONTEXT.md`) — All 18 locked ANAL-D-* decisions. [VERIFIED: read this session]
- **REQUIREMENTS.md** (`.planning/REQUIREMENTS.md`) — ANAL-01..04 verbatim, traceability table. [VERIFIED: read this session]
- **PROJECT.md** (`.planning/PROJECT.md`) — Stack constraints, conventions, sparse-graph rationale. [VERIFIED: read this session]
- **Phase 3 normalizer** (`src/normalizer/normalize_descriptor.ts`, `src/normalizer/index.ts`) — Pipeline contracts, idempotency, charset `^[a-z0-9_]+$`, empty output handling. [VERIFIED: read this session]
- **Phase 3 SUMMARY** (`.planning/phases/03-normalization-pipeline/03-01-SUMMARY.md`) — Test patterns to mirror. [VERIFIED: read this session]
- **`src/loader/corpus_loader.ts`** — `loadCorpus(path): Promise<readonly SemanticMaterial[]>`. Important: returns `SemanticMaterial`, NOT `CorpusMaterial`. Analyzer input typing recomendado é estrutural-mínimo. [VERIFIED: read this session]
- **`src/loader/alias_loader.ts`** — `loadAliasSeed(path): Promise<DescriptorAliasSeed>`. [VERIFIED: read this session]
- **`src/types/corpus.ts`, `seed.ts`, `alias.ts`, `registry.ts`, `index.ts`** — Domain type shapes. [VERIFIED: read this session]
- **`data/taxonomy/descriptor_aliases.seed.json`** — Current shape (raw → canonical, 7 entries). [VERIFIED: read this session]
- **`src/package.json`** — Vitest 3.2.0, TypeScript 5.8.0, no runtime dependencies. [VERIFIED: read this session]
- **`.planning/config.json`** — `nyquist_validation: true`, `code_review: true`. [VERIFIED: read this session]

### Secondary (MEDIUM confidence)

- **Levenshtein two-row DP** — Classical algorithm (Wagner-Fischer 1974). [CITED: en.wikipedia.org/wiki/Levenshtein_distance] — implementação two-row é folklore CS, correta em referências canônicas.
- **Jaccard similarity** — Coeficiente clássico, definição não-ambígua. [CITED: en.wikipedia.org/wiki/Jaccard_index]
- **V8 Map performance characteristics** — Heap overhead de `Map` (~80B header) e iteração ordem de inserção. [CITED: V8 source / ECMAScript spec §24.1]

### Tertiary (LOW confidence — assumed)

- **`Uint16Array` ser mais rápido que `Array<number>` em V8 hot loops** [ASSUMED]: padrão folklore, validado em múltiplos benchmarks de bibliotecas como `fastest-levenshtein`, mas não medido neste sessão.
- **Estimativa de unique descriptors no corpus (~1k–8k)** [ASSUMED]: extrapolação de 33.742 materiais × ~5–15 descriptors com long-tail típico. PLAN deve confirmar com one-off measurement.

---

## Package Legitimacy Audit

Phase 4 **não instala packages externos** — projeto é zero-runtime-dependency (PROJECT.md constraint) e Vitest 3.2.0 já é devDependency existente desde Phase 1. Sem slopcheck necessário.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| — | — | — | — | — | — | No new packages required |

**Packages removed:** none
**Packages flagged as suspicious:** none

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Dense N×N similarity matrix | Sparse `Map<pair_key, count>` | Locked em ANAL-D-06 | Memory linear em pares observados, não em N². |
| Jaro-Winkler (mentioned in ROADMAP) | Normalized Levenshtein + token Jaccard | Locked em ANAL-D-08 / D-09 | Levenshtein lida bem com typos (camomile↔chamomile) e é mais previsível em multi-token snake_case. |
| Auto-merge de aliases | Suggestions only, human-in-the-loop | Locked em ANAL-D-11 | Phase 4 é analítica; merge é workflow de Phase 6. |
| Single concatenated artifact | 3 arquivos versionados separados | Locked em ANAL-D-14 | Diffability granular; cada artefato evolui independente. |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Unique descriptors normalizados esperados ~1k–8k em ~33k materiais | §String Similarity (Performance) | Se for muito maior (>20k), pool freq≥2 inflado → pairwise mais caro. Mitigação: length-bucketing escala bem; PLAN pode adicionar cap defensivo. |
| A2 | `Uint16Array` no Levenshtein é materialmente mais rápido que `Array<number>` em V8 | §String Similarity | Se for igual, sem impacto funcional. Otimização preventiva consistente com folklore. |
| A3 | Pares com descriptor-set max ≈ 50 são raros mas existem na cauda | §Risks | Se for max=200+, worst case fica caro. PLAN deve medir uma vez no corpus real. |
| A4 | Substring-rejection threshold de `0.97` calibrado bem para o caso `oakmoss/oakmosses` | §Combiner rule | Se calibração errada, plurais não-normalizados passam ou casos legítimos são rejeitados. Mitigação: tunable via option, testado com fixtures. |
| A5 | V8 preserva insertion order em `Map` iteration (formal: yes, by spec) | §Risks (Determinism) | Não é assumption — é spec ECMAScript §24.1. Mantido como assumption defensiva. |

---

## Metadata

**Confidence breakdown:**

- **Standard stack:** HIGH — zero-dependency confirmado por PROJECT.md + `src/package.json`; Vitest 3.2.0 + TS 5.8.0 já presentes.
- **Architecture (module layout, types, orchestration):** HIGH — derivado mecanicamente de ANAL-D-1..18 + Claude's Discretion areas; nenhum ponto contradiz CONTEXT.
- **Algorithms (Levenshtein, Jaccard, substring rule):** HIGH — algoritmos clássicos, bem documentados, ~30 linhas cada; combiner rule é a única decisão original, claramente justificada por ANAL-D-09/D-10.
- **Performance estimates:** MEDIUM — baseadas em estimativas plausíveis do corpus shape (~33k materiais), mas não medidas no corpus real. PLAN deve calibrar.
- **Pitfalls:** HIGH — riscos identificados são técnicos e testáveis (worst-case pair generation, determinism, threshold calibration).
- **Test plan:** HIGH — espelha padrão Phase 3 + adiciona property tests específicos para invariants Phase 4.

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (30 dias — escopo é algorítmico estável, sem mudanças de stack esperadas).

---

## RESEARCH COMPLETE

Pesquisa concluída para Phase 4 (Corpus Analysis): todas as ANAL-D-1..18 decisões mapeadas para recomendações implementáveis; áreas de Claude's Discretion resolvidas com rationale; Validation Architecture pronta para gerar VALIDATION.md; sem packages externos, sem trust boundaries novos, sem dependências de runtime adicionais.
