# Phase 34: Pau Rosa Semantic Investigation - Patterns

## Padrões de Tratamento para Termos Lusófonos e Traducionais

1. **Priorização Canônica:** A taxonomia padroniza os descritores de ingredientes canônicos preferencialmente em inglês para garantir interoperabilidade global (ex: `rosewood`).
2. **Aliases Interlinguísticos Seguros:** Traduções diretas e inequívocas em outras línguas recebem alias para o descritor canônico (ex: `bois_de_rose` -> `rosewood`).
3. **Tratamento de Polissemia (Edge Case):** Termos que carregam polissemia regional ou popular (ex: `pau_rosa` podendo referir-se a múltiplas espécies que não a *Aniba rosaeodora* da perfumaria) requerem validação pragmática (frequência e contexto no corpus). Em caso de incerteza e ausência no corpus atual, o termo é categorizado como `defer/manual_review` para evitar envenenamento semântico por falsos positivos.
