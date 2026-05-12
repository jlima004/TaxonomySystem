# Stack Research — Olfactory Taxonomy System

> Researched: 2026-05-12

## Recomendação: Zero-Dependency TypeScript Puro

O projeto já possui uma constraint explícita de **zero-dependency approach** alinhada com o engine existente. A pesquisa confirma que isso é viável para o escopo do Builder v1.

### Mantido do Engine Existente

| Componente | Escolha | Rationale |
|-----------|---------|-----------|
| Runtime | Node.js 20+ | Já estabelecido, ESM nativo |
| Linguagem | TypeScript 5.8+ strict | Padrão do projeto |
| Test Runner | Vitest 3.2+ | Já configurado no engine |
| Module System | ESM (`"type": "module"`) | Padrão do projeto |

### Novo para o Taxonomy System

| Componente | Escolha | Rationale |
|-----------|---------|-----------|
| String similarity | Implementação própria (Levenshtein/Jaro-Winkler) | Zero-dep constraint. São ~50 linhas cada. Pacotes npm como `fastest-levenshtein` e `jaro-winkler` existem, mas são triviais de implementar inline |
| JSON Schema validation | TypeScript type guards + Zod (única exceção possível) | Type guards são zero-dep. Zod é justificável se validação de input externo for crítica |
| CLI | `process.argv` parsing manual ou `commander` | Para o builder CLI. `commander` é leve se necessário |
| Streaming JSON | Implementação própria com `readline` + `JSON.parse` por chunk | Para processar o arquivo de 70MB sem carregar tudo em memória |

### Decisões de Stack Confirmadas pela Pesquisa

1. **NÃO usar NestJS/Express** — o Builder é um CLI/pipeline, não um servidor
2. **NÃO usar MongoDB/PostgreSQL** — output são JSONs compilados, não um banco de dados
3. **NÃO usar LangChain/transformers.js** — a similaridade é computada por regras + heurísticas, não embeddings (v1)
4. **NÃO usar vector databases** — sparse graph em JSON é suficiente para 60-120 subfamilies

### Alternativas Consideradas e Rejeitadas

| Alternativa | Por que rejeitada |
|------------|-------------------|
| `ml-distance` para cosine similarity | Trivial de implementar (~10 linhas). Não justifica dependência |
| `natural` (NLP library) | Pesado demais. Precisamos apenas de stemming básico e string distance |
| `hnswlib-node` (ANN search) | Overengineering para ~100 subfamilies. Brute-force é O(N²) mas N=100 |
| Zod para schema validation | **Possível exceção** — avaliar se type guards nativos são suficientes |

## Confidence

- **Alta** — Stack é praticamente pré-definida pelo projeto. Pesquisa confirma que zero-dep é viável.
- **Risco baixo** — String similarity algorithms são bem documentados e triviais de implementar.
