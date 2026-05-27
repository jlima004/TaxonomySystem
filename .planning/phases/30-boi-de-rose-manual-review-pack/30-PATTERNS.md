# Phase 30 — Boi de Rose Manual Review Pack : Patterns

## Metodologia de Investigação Semântica
Segue o padrão estabelecido na Phase 29: primeiro resolver a semântica, depois decidir disposition.
1. **Verificação de Existência:** Consultar a taxonomia compilada e matrizes de similaridade (modo read-only).
2. **Análise de Contexto:** Avaliar as categorias atuais de `boi_de_rose` (se existir) vs `bois_de_rose` e `rosewood`.
3. **Resolução Semântica:** Determinar a correta classificação antes de decidir a disposition (mutação de alias, adição de seed, etc).

## Constraints do Sistema
- Não inferir relações sem consultar os arquivos do sistema.
- Qualquer alteração será realizada em uma fase de execução (mutation) futura, após aprovação do planejamento desta fase.
