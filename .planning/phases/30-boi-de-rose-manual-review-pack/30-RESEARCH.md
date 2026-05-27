# Phase 30 — Boi de Rose Manual Review Pack : Research

## Objetivo da Pesquisa
Confirmar se `boi_de_rose` é:
1. erro/variante de bois_de_rose;
2. candidato a alias;
3. descriptor próprio;
4. corpus artifact;
5. defer/manual_review.

A hipótese principal registrada está correta: `boi_de_rose` provavelmente é uma forma truncada/erro de `bois_de_rose`, termo associado a pau-rosa / rosewood, mas isso ainda precisa ser confirmado nos artifacts antes de qualquer decisão.

## Escopo Aprovado
Investigar, em modo read-only:
- presença de boi_de_rose em data/compiled/v2/taxonomy.json;
- presença de boi_de_rose em data/compiled/v2/similarity_matrix.json;
- presença de bois_de_rose;
- presença de rosewood;
- presença de pau_rosa, se houver normalização multilíngue;
- se boi_de_rose aparece como candidate, seed, alias ou review item;
- se existe target seed adequado para eventual alias;
- se o termo está em floral_rose por erro de clusterização;
- se deveria pertencer a woody, floral, amber/resinous ou ficar deferido.

## Restrições
Não alterar:
- data/taxonomy/*
- data/compiled/*
- data/inference/*
- src/*
- scripts/*
- graphify-out/*

Não executar:
- curadoria
- compile
- Graphify
- artifact publication

## Achados

1. **Ausência do Target**: Os termos `bois_de_rose`, `rosewood` e `pau_rosa` **não existem** em nenhuma base de dados (`data/compiled/v2/taxonomy.json`, `taxonomy-seed.v2.json`, `descriptor_aliases.seed.json`).
2. **Presença do Termo**: `boi_de_rose` existe como `candidate` de source `corpus` (frequência 33) no `data/compiled/v2/taxonomy.json` (e no v1). Há também o candidato truncado `boi` (frequência 16).
3. **Erro de Clusterização**: O termo `boi_de_rose` foi classificado erroneamente na subfamília `floral_rose` por causa do sufixo lexical "rose", mas semanticamente refere-se a pau-rosa (madeira/woody).
4. **Viabilidade do Alias**: O termo é um erro/typo claro ou variante francófona sem 's' de `bois_de_rose` / `rosewood`. Porém, o alvo não existe na taxonomia.

## Disposition

**add_target_needed**

**Justificativa**: A hipótese inicial de erro/variante para `bois_de_rose` / `rosewood` está correta. No entanto, o target seed (`rosewood` ou `bois_de_rose`) não está presente na taxonomia. Como o target correto não existe, não é possível criar a relação de alias neste momento. É necessário criar uma phase prévia para adicionar `rosewood` na categoria adequada (possivelmente `woody`) antes de efetuar a mutação de alias para o termo `boi_de_rose`.
