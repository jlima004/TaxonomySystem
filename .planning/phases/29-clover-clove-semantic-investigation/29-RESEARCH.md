# Phase 29 Research — Clover vs Clove

## Hipótese
Na Phase 22, `clover` (frequência 13 no corpus, classificado pelo modelo sob `floral_rose` em compilados) gerou um conflito do tipo `seed_corpus_conflict` com o seed `clove` (`spicy / warm_spice`). A hipótese levantada foi que `clover` poderia ser um *alias* (misspelling) de `clove`.

## Investigação Botânica e Olfativa
1. **Clove (Cravo-da-índia)**
   - *Botânica*: _Syzygium aromaticum_
   - *Perfil Olfativo*: Especiaria quente, aromática, intensa, rica em eugenol.
   - *Taxonomia atual*: Seed descriptor oficial em `spicy / warm_spice`.

2. **Clover (Trevo / Sweet Clover)**
   - *Botânica*: Gêneros _Trifolium_ e _Melilotus_
   - *Perfil Olfativo*: Nota verde, herbal, levemente doce e floral, com nuances de feno recém-cortado (devido à presença de cumarina) e aspectos de fougère.
   - *Taxonomia atual*: Corpus descriptor (candidate), atualmente clusterizado em `floral / floral_rose`.

## Análise do Conflito
O alerta de conflito na matriz de similaridade (Phase 22) baseia-se em similaridade ortográfica/lexical forte (`clover` contém `clove` integralmente, variando em apenas uma letra). Entretanto, do ponto de vista semântico e olfativo, os dois ingredientes não possuem qualquer relação. Trata-se de um **falso positivo lexical**.

## Conclusão
`clover` **NÃO** deve ser tratado como alias nem misspelling de `clove`. É um **descritor distinto** e autônomo. O tratamento adequado é remover sua suspeita de alias e classificá-lo como um descritor legítimo de corpus a ser avaliado em fase própria de curadoria de notas florais/verdes.
