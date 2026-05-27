# Phase 24: V2.3 Alias Candidate Planning - VALIDATION

## Critérios de Validação e Invariantes

Durante a Fase 25+, quando a mutação for executada no ambiente isolado (`/tmp`), o script de validação deverá provar formalmente as seguintes asserções antes que qualquer `commit` seja autorizado:

### 1. Invariante: Destino Válido (Target Validity)
- **Regra:** O `target` de uma entrada no `descriptor_aliases.seed.json` não pode apontar para o vácuo ou para outro alias.
- **Teste (QA):** Buscar `cedarwood` em `data/taxonomy/taxonomy-seed.v2.json`. Deve existir um nó com a string `"cedarwood"` e o valor esperado. O teste falha caso a seed não seja encontrada.

### 2. Invariante: Unicidade de Alias (Alias Uniqueness)
- **Regra:** Uma mesma chave (`cedar`) não pode aparecer duas vezes no dicionário JSON `descriptor_aliases.seed.json` com valores diferentes.
- **Teste (QA):** Validar o parse JSON estrito do arquivo ou varrer para garantir que `cedar` aponta unicamente para `cedarwood`.

### 3. Invariante: Exclusão Mútua (Mutual Exclusion)
- **Regra:** Um conceito (ex: `cedar`) não pode existir simultaneamente como uma seed independente no `taxonomy-seed.v2.json` e como chave do `descriptor_aliases.seed.json`.
- **Teste (QA):** Varredura no `taxonomy-seed.v2.json` afirmando que `cedar` **NÃO** existe como um nó curado.

### 4. Validação do Output Compilado (Post-Compile Checks)
O processo deve rodar o pipeline de compilação direcionado a uma pasta temporária (ex: `/tmp/tax_build/`). O arquivo resultante `/tmp/tax_build/taxonomy.json` deve ser inspecionado:
1. **Absorção Bem-Sucedida:** `cedar` não pode aparecer na listagem como um nó de "status": "candidate".
2. **Incremento de Frequência:** O nó `cedarwood` no JSON final deve ter sua frequência acrescida em relação ao valor anterior. Espera-se que passe de `17` para, no mínimo, `100` (17 + 83 ocorrências de cedar).
3. **Redução da Fila de Revisão:** A métrica global de nós pendentes de revisão (`review_queue`) deve registrar um decréscimo efetivo correspondente à absorção de `cedar`.

Apenas com sucesso em todos os quatro passos, o desenvolvedor ou o workflow GSD estará autorizado a migrar os dados do `/tmp` e efetivar a publicação na V2.3.
