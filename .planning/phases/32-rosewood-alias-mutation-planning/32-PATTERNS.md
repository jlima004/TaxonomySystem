# Phase 32 — Rosewood Alias Mutation Planning : Patterns

## Padrões Identificados

### 1. Variação Regional e Erros de Digitação
- **Padrão:** `bois de rose` (Francês correto) -> `boi de rose` (Truncamento / Erro ortográfico ou fonético que omite o "s" final).
- **Mapeamento:** Ambos mapeiam para a mesma identidade olfativa canônica, `rosewood`, resolvendo inconsistências de grafia nos raw data.

### 2. Equivalência Multi-idioma na Perfumaria
- **Padrão:** O uso intercalado de `rosewood` (Inglês) e `bois de rose` (Francês) na indústria.
- **Tratamento:** O sistema estabelece `rosewood` como o `seed` canônico principal. As variações consagradas em outros idiomas, que possuam semântica perfeitamente alinhada e exclusiva (sem risco de colisões), podem ser promovidas a alias para `rosewood`.

### 3. Truncamento Perigoso / Colisão de Domínio
- **Padrão:** `boi`
- **Tratamento:** O truncamento extremo compromete a coesão léxica. Termos extremamente curtos que constituem palavras válidas em outros contextos semânticos (neste caso, animal / gado em português) devem ser rejeitados do mapeamento automático para preservar a segurança da tipagem do domínio olfativo.
