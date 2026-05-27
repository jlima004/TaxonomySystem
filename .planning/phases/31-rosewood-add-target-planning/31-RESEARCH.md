# Phase 31 - Rosewood Research

## Perguntas e Respostas

**1. rosewood existe atualmente como seed, alias, candidate ou review item?**
Não. Uma busca exaustiva nos artefatos da taxonomia (`taxonomy-seed.v2.json`, `taxonomy.json`, `similarity_matrix.json`, aliases, etc.) revela que `rosewood` não existe atualmente no sistema em nenhuma destas categorias.

**2. bois_de_rose existe atualmente em algum artifact?**
Não. O termo exato `bois_de_rose` não foi encontrado nos dados compilados atuais, matriz de similaridade ou candidatos.

**3. boi_de_rose e boi continuam como candidates?**
Sim. Tanto `boi_de_rose` quanto `boi` constam como *candidates* gerados pelo corpus na v2 da taxonomia compilada (`data/compiled/v2/taxonomy.json`). Atualmente, eles estão equivocadamente mapeados na subfamília `floral_rose`.

**4. woody / woody_dry é a classificação correta para rosewood?**
Sim, do ponto de vista olfativo e taxonômico, `rosewood` (Aniba rosaeodora/pau-rosa) é uma nota amadeirada e a subfamília `woody_dry` (dentro da família `woody`) é a classificação adequada, não devendo ficar atrelado aos florais apenas pelo nome.

**5. existe algum seed próximo já presente, como cedarwood, sandalwood, guaiacwood etc., que confirme o padrão de nomenclatura?**
Sim. No `taxonomy-seed.v2.json`, dentro da família `woody` > subfamília `woody_dry`, já existem os seeds `cedarwood` e `sandalwood`. Isso confirma que o uso do sufixo `-wood` (e não apenas "rose wood" separado) é o padrão estabelecido no sistema para essas madeiras.

**6. quais aliases futuros devem ser preparados, mas não executados agora?**
Na próxima fase, os seguintes mapeamentos deverão ser tratados:
- `boi_de_rose` → `rosewood` (resolvendo a anomalia do candidate atual em floral_rose).
- `bois_de_rose` → `rosewood` (prevenção para variações comuns na perfumaria).
- `pau_rosa` → `rosewood` (nome comum em português, se futuramente detectado).
- `boi` → defer/manual_review (é muito curto e truncado, com alto risco de colisão semântica com outras palavras dependendo do contexto do corpus).
