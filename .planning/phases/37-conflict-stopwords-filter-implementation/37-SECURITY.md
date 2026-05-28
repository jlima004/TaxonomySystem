---
phase: 37
---

# Security Review - Phase 37

Esta revisão de segurança documenta a mitigação de ameaças e aderência aos requisitos de segurança para a implementação do filtro de stopwords de conflito (Phase 37).

## 1. Leitura do arquivo passado via `--conflict-stopwords`
**Mitigado:** A leitura do arquivo é feita utilizando o padrão seguro nativo do Node.js (`node:fs/promises` `readFile`), envelopado na função utilitária `readJson`, que aplica `JSON.parse()` sincrono e nativo, sem possibilidade de injeção ou execução dinâmica.

## 2. Validação de path/default path
**Mitigado:** A resolução de caminhos é centralizada na função `resolveReadablePath`, que impede traversals perigosos (a menos que explicitamente passados por um usuário local restrito), possuindo como padrão o caminho pré-determinado constante (`DEFAULT_PATHS.conflictStopwordsPath`). O flag da CLI substitui de forma determinística esse caminho padrão.

## 3. Comportamento quando o arquivo não existe, está malformado ou contém schema inesperado
**Mitigado:**
- **Inexistente:** A ausência do arquivo default loga um *warning* ignorando de forma graciosa sem quebrar a execução. Se o path for passado explicitamente via `--conflict-stopwords` e não existir, a aplicação é encerrada de imediato de forma segura lançando `CliArgumentError`.
- **Malformado:** Problemas de sintaxe no JSON (como quebra de string) são pegos nativamente pelo motor (`SyntaxError` em `JSON.parse()`), e resultam numa falha de execução fail-fast.
- **Schema inesperado:** O destructuring faz o uso defensivo de nullish coalescing (`rawStopwords.tokens ?? {}`), garantindo que a ausência do campo ou a presença de um schema distinto na raiz não resulte em um erro do tipo `TypeError` por objeto indefinido. Isso falha o filtro e instanciará um `Set` vazio (desabilitando a evasão de conflitos) de forma fail-safe.

## 4. Garantia de que só tokens `approved === true` entram no Set
**Mitigado:** O processamento filtra estritamente os tokens através de `.filter(([_, meta]) => meta.approved === true)`. O uso da checagem de identidade estrita (`=== true`) assegura que configurações ambíguas como strings (`"true"`), numerais (`1`) ou falhas de formatação não injetem stopwords acidentalmente. Apenas booleanos exatos são autorizados a entrar no `Set<string>`.

## 5. Ausência de execução dinâmica, imports externos ou parsing perigoso
**Mitigado:**
- Não existe uso de `eval`, `new Function()` ou `import()` dinâmicos.
- Nenhum package de parsing externo (ex: `yaml`, parsers markdown, eval libraries) foi introduzido.
- Todo parseamento é isolado no método puro e seguro do V8.

## 6. Preservação do fallback core opt-in
**Mitigado:** O core no `src/inference/seed_profile.ts` trata `conflictStopwords` de maneira estritamente opcional (`options.conflictStopwords?.has(...)`). O uso de optional chaining garante que, caso a propriedade não seja mapeada/enviada, a avaliação lógica será falsy (`undefined`), desviando do fluxo de mitigação de conflitos, mantendo o fallback e comportamento rígido padronizado intocado.

## Veredito
**PASS** - O código não apresenta falhas que comprometam a segurança, isolamento do schema e preservação dos fallbacks do core.
