# Phase 29 Patterns

## 1. False Positive Lexical Conflict (Substring/Edit Distance)
Quando o sistema reporta conflito entre descritores baseando-se em similaridade ortográfica forte (ex: `clove` vs `clover`), mas a análise semântica comprova origens botânicas e perfis olfativos fundamentalmente distintos.
- **Ação Padrão**: Rejeitar a hipótese de alias. Descartar o conflito como falso positivo, classificando o item como `semantic_mismatch` em relação ao anchor seed, e preservar a identidade do descritor do corpus.

## 2. Legitimacy of Distinct Descriptor
Quando um candidato do corpus possui frequência baixa ou moderada (ex: `clover` = 13 ocorrências) mas representa inequivocamente uma nota perfumística real (trevo / sweet clover / feno).
- **Ação Padrão**: Manter como candidato legítimo do corpus. Por possuir suporte o suficiente para não ser ruído descartável e por possuir identidade clara, ele é preservado na taxonomia não-oficial e diferido (`defer`) para avaliação normal de curadoria, sem exigir promoção emergencial ou descarte imediato.
