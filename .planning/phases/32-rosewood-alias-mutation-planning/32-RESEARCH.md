# Phase 32 — Rosewood Alias Mutation Planning : Research

## Objetivo
Analisar as evidências no sistema taxonômico e matriz de similaridade para os candidatos a alias para `rosewood`.

## Foco Principal (Alta Confiança)

### 1. `boi_de_rose`
- **Fenômeno Semântico:** Tradução literal ou variação regional truncada de "bois de rose" (Pau-rosa).
- **Evidência:** Presente na matriz de similaridade. O termo é claramente derivado do francês "bois de rose" (Rosewood), frequentemente truncado em dados brutos para "boi de rose" devido a ausência de revisão ou erro de digitação.
- **Decisão:** Alta confiança para mutação de alias `boi_de_rose` → `rosewood`.

### 2. `bois_de_rose`
- **Fenômeno Semântico:** Nome original em francês, amplamente utilizado na perfumaria clássica para se referir a Rosewood.
- **Evidência:** Termo da indústria clássica, inequivocamente associado e traduzido como `rosewood`.
- **Decisão:** Alta confiança para mutação de alias `bois_de_rose` → `rosewood`.

## Foco Secundário (Apenas Leitura/Evidência)

### `pau_rosa`
- **Fenômeno Semântico:** Tradução direta para o português de "rosewood".
- **Evidência:** Termo que pode aparecer no corpus lusófono. Exige validação adicional antes de aprovar a mutação, a fim de garantir que não haja colisões ou polissemia não intencional (outras madeiras chamadas pau-rosa) no contexto específico da base de dados.
- **Decisão:** Média confiança. Não será incluído no Plan 01 de mutação. Depende de investigações futuras ou revisões manuais nos artefatos.

### `boi`
- **Fenômeno Semântico:** Truncamento extremo do termo "boi(s) de rose".
- **Risco:** Altíssimo risco de colisões semânticas. "Boi", isoladamente, remete ao animal em português, podendo colidir com descritores animálicos se houver expansão futura da taxonomia, ou simplesmente gerar agrupamentos ruidosos (falsos positivos).
- **Decisão:** Permanecer explicitamente fora do escopo de mutação e de mapeamentos automáticos. Deve ser classificado estritamente como `defer/manual_review`.
