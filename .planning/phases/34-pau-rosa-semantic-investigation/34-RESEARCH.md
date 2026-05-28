# Phase 34: Pau Rosa Semantic Investigation - Research

## Investigação de Dados (Read-Only)

### 1. Ausência do Termo nas Bases Atuais
Uma busca no diretório `data/` confirmou que `pau_rosa` e `pau-rosa` **não existem** atualmente em:
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/similarity_matrix.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`

### 2. Análise Semântica (Português)
- **Tradução:** `rosewood` (inglês) ou `bois_de_rose` (francês) é traduzido literalmente para `pau_rosa` ou `pau-rosa`.
- **Botânica/Perfumaria:** Refere-se normalmente à *Aniba rosaeodora*, madeira nativa da Amazônia da qual se extrai o óleo essencial rico em linalol.
- **Polissemia/Ambiguidade:** No Brasil, o nome "pau-rosa" pode ser popularmente aplicado a outras espécies de madeiras de lei, como *Physocalymma scaberrimum*, *Tipuana tipu* ou árvores do gênero *Dalbergia*. Se essas outras madeiras entrarem no contexto de fragrâncias (ou em reviews generalistas que poluam o corpus), um mapeamento automático (alias) pode gerar clusters semanticamente impuros.

### 3. Conclusão da Pesquisa
Sendo um termo ausente no momento e contendo um potencial de ambiguidade (polissemia) inerente a termos regionais e populares da botânica brasileira, o tratamento automatizado preventivo via alias é desaconselhado sem evidências estritas de uso no corpus.
