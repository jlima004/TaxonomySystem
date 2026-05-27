# Phase 26: Preflight Research - `ambergri` / `ambergris`

## Objetivo
Investigar o status do candidato `ambergri` e do pretenso seed `ambergris` na taxonomia atual, visando validar se a operação de mutação de alias direta (`ambergri` -> `ambergris`) é viável neste momento.

## Descobertas (Findings)

### 1. `ambergri` na Taxonomia e Matriz
- **`data/compiled/v2/taxonomy.json`**: Encontrado!
  - `id`: "ambergri"
  - `source`: "corpus"
  - `frequency`: 46
  - `status`: "candidate"
  - `review_required`: true
- **`data/compiled/v2/similarity_matrix.json`**: Encontrado! (Aparece como `descriptor` e `corpus_descriptor`).

### 2. `ambergris` como Seed Válido
- **`data/taxonomy/taxonomy-seed.v2.json`**: Não encontrado.
- **`data/compiled/v2/taxonomy.json`**: Não encontrado.
- **Conclusão**: `ambergris` **não existe** atualmente como um target/seed válido na taxonomia. 

### 3. Aliases Existentes
- **`data/taxonomy/descriptor_aliases.seed.json`**: Nem `ambergri` nem `ambergris` existem atualmente como aliases neste arquivo.

## Resumo e Impacto no Escopo
- `ambergri` está na fila de revisão (candidate) e foi derivado do corpus (provavelmente um truncamento ou extração base de "ambergris").
- `ambergris` está ausente do sistema.
- Como `ambergris` **não existe como seed**, não é possível mapear `ambergri` diretamente para ele neste momento (violação do invariante target-must-exist).

Nenhuma alteração nos dados ou artefatos do sistema foi executada durante o preflight.
