# Phase 28 Patterns — Ambergri Alias Mutation

## Padrão de Mutação de Alias
A adição do alias ocorrerá no arquivo `data/taxonomy/descriptor_aliases.seed.json`:
```json
{
  ...
  "ambergri": "ambergris"
}
```

## Padrão de Compilação
- A compilação deve ser executada primeiro num diretório de teste (`/tmp/taxonomy_v2_compile`).
- A versão a ser gerada deve ser obrigatoriamente `2.4.0`.
- O timestamp de geração (`generated_at`) deve ser fixado em `2026-05-27T00:00:00.000Z`.
- **Regras:** Usar somente comandos e flags oficiais do compilador para direcionar o output para `/tmp`. Não modificar scripts de compilação nem manipular manualmente os outputs gerados.
- **Graphify:** Permanece fora do escopo desta fase.

## Padrões de Artefatos Gerados
Após a compilação, esperamos:
1. `ambergri` desaparecerá da lista de descriptors da taxonomia gerada e do `review_queue`.
2. `ambergris` assumirá a frequência e dados correspondentes provenientes do corpus base, ganhando o status de `curated`.
