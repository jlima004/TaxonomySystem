# Phase 24: V2.3 Alias Candidate Planning - PATTERNS

## Padrões de Mutação de Alias (Alias Mutation Patterns)

Este documento formaliza os padrões arquiteturais que devem ser seguidos para a adição de aliases na Fase 25+ e subsequentes, garantindo integridade no processo de microcuradoria.

### Padrão de Absorção de Frequência (Frequency Absorption Pattern)
Quando um termo candidato de alta frequência (ex: `cedar`) é identificado como sinônimo direto de uma seed curada (ex: `cedarwood`), utilizamos a mutação de alias para absorver o candidato.
- **Mecanismo:** Adicionar `"candidato": "seed_curada"` ao arquivo `descriptor_aliases.seed.json`.
- **Efeito:** Durante a compilação, a frequência do candidato é somada à da seed. O candidato deixa de aparecer como um nó separado no arquivo `taxonomy.json` final, saindo da fila de revisão (`review_queue`).

### Padrão de Modificação Protegida (Gated Modification Pattern)
Qualquer alteração que altere o pipeline de compilação da V2, como a adição de aliases, deve seguir um padrão de validação preflight ("gated"):
1. **Modificação em isolamento:** Executar a modificação dos artefatos `seed.json` e a recompilação apontando para um diretório temporário, como `/tmp`.
2. **Afirmação de Invariantes (Invariant Assertions):** Antes de propagar os arquivos compilados para o local definitivo (`data/compiled/v2`), scripts de CI ou verificações manuais de QA devem provar que os invariantes foram respeitados.
3. **Commit Controlado:** Apenas após a validação no `/tmp` ser concluída com sucesso (sem violação de restrições), os arquivos são migrados de volta e commitados em `data/taxonomy/` e `data/compiled/v2/`.

### Padrão de Nomeclatura (Nomenclature Standard)
- Aliases que vêm do corpus devem estar todos em letras minúsculas.
- Espaços e caracteres especiais devem seguir a normalização padrão do sistema de NLP (ex: `cedar wood` mapeia para `cedarwood`, assim como `cedar`).
