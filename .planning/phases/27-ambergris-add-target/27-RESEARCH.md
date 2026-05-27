# Phase 27 Research

## 1. Status do Target "ambergris"
- **`taxonomy-seed.v2.json`:** Não contém a chave "ambergris".
- **`data/compiled/v2/taxonomy.json`:** Não contém a chave "ambergris".

## 2. Status do Candidato "ambergri"
- **`data/compiled/v2/taxonomy.json`:** "ambergri" existe como `candidate` (corpus_derived: true) debaixo de `family = amber_resinous` e `subfamily = amber`, com uma frequência de 46.
- **`data/compiled/v2/similarity_matrix.json`:** Existem ocorrências de "ambergri" nas arestas de similaridade.

## 3. Estrutura do Target
A taxonomia seed v2 já possui a seguinte estrutura que receberá o novo descritor:
- **Family:** `amber_resinous`
- **Subfamily:** `amber`
- Atualmente, esta subfamily abriga o descritor curado `amber` e o candidato `ambergri` (entre outros candidatos como `cistus`, `dry`, `resinous`).

## 4. Análise de Impacto
- **Adição do target:** Como `ambergris` não existe na taxonomia, sua adição direta no seed criará a âncora necessária.
- **Isolamento da fase:** Conforme decisão (AMBERGRIS26-D-02), o mapeamento de alias (`ambergri` -> `ambergris`) **NÃO** será feito nesta fase. Esta fase foca exclusivamente no `add_target` de `ambergris`.
- **Compatibilidade:** O target será adicionado sem frequency properties manuais, assumindo o comportamento padrão do compilador para seed descriptors.
