# PRD Técnico — Alquem.io

**Produto:** Alquem.io  
**Versão do documento:** 0.2  
**Status:** Draft técnico  
**Categoria:** SaaS de inteligência olfativa com agente de IA  
**Plataforma inicial:** Aplicação web responsiva  
**Idioma inicial:** Português brasileiro  
**Arquitetura principal:** Chat → Agente → Tools → RAGgraph → PostgreSQL + pgvector + Neo4j  
**Estratégia de lançamento:** MVP vertical baseado em Golden Dataset

----------

# 1. Visão do produto

A **Alquem.io** será uma plataforma SaaS de inteligência olfativa voltada para criação, análise e desenvolvimento de fragrâncias.

O usuário interagirá com um agente de IA por meio de um chat. O agente será capaz de consultar matérias-primas, comparar ingredientes, sugerir substitutos, gerar direções olfativas, estruturar acordes e analisar fórmulas.

O agente não responderá apenas com o conhecimento paramétrico do modelo de linguagem. Ele utilizará **tools especializadas** conectadas a um motor de conhecimento proprietário denominado **RAGgraph**.

O RAGgraph combinará:

-   PostgreSQL para dados canônicos e transacionais;
    
-   pgvector para recuperação semântica;
    
-   Neo4j para relações e travessias de grafo;
    
-   TaxonomySystem para taxonomia e curadoria;
    
-   documentos técnicos e regulatórios;
    
-   regras de confiança e proveniência;
    
-   mecanismos de ranqueamento e composição de evidências.
    

Arquitetura conceitual:

```text
Usuário
  ↓
Frontend SaaS
  ↓
API de conversação
  ↓
Orquestrador do agente
  ↓
Tools especializadas
  ↓
RAGgraph
  ├── PostgreSQL
  ├── pgvector
  ├── Neo4j
  ├── TaxonomySystem
  ├── Document Store
  └── Rules Engine
  ↓
Pacote de evidências
  ↓
Resposta estruturada
  ↓
Chat

```

----------

# 2. Objetivo do MVP

O MVP deverá provar que a Alquem.io consegue responder tarefas olfativas reais com mais precisão, estrutura e rastreabilidade do que um modelo genérico de linguagem.

O MVP deverá validar cinco capacidades principais:

1.  Consultar uma matéria-prima.
    
2.  Comparar duas ou mais matérias-primas.
    
3.  Encontrar substitutos.
    
4.  Gerar uma direção olfativa a partir de um briefing.
    
5.  Analisar uma fórmula básica.
    

O Neo4j fará parte do MVP desde o início para representar e consultar relações entre materiais, descritores, famílias, subfamílias, aplicações, acordes, restrições e substituições.

----------

# 3. Princípios técnicos

## 3.1 O modelo de linguagem não é a fonte de verdade

O modelo de linguagem será responsável por:

-   interpretar intenção;
    
-   extrair entidades;
    
-   decidir quais tools utilizar;
    
-   organizar resultados;
    
-   gerar explicações;
    
-   manter contexto conversacional.
    

O modelo não será a fonte primária para:

-   CAS;
    
-   INCI;
    
-   aliases;
    
-   propriedades físico-químicas;
    
-   famílias canônicas;
    
-   relações de substituição;
    
-   dados regulatórios;
    
-   status de curadoria;
    
-   proveniência.
    

----------

## 3.2 O agente acessa conhecimento apenas por tools

O agente não poderá executar SQL ou Cypher arbitrários.

Toda consulta deverá acontecer por meio de tools tipadas, versionadas e validadas.

Cada tool deverá possuir:

-   schema de entrada;
    
-   schema de saída;
    
-   autorização;
    
-   validação;
    
-   timeout;
    
-   logs;
    
-   tracing;
    
-   tratamento de erros;
    
-   política de confiança;
    
-   versão explícita.
    

----------

## 3.3 PostgreSQL e Neo4j terão responsabilidades diferentes

### PostgreSQL

Será a fonte principal para:

-   dados canônicos de materiais;
    
-   usuários;
    
-   organizações;
    
-   projetos;
    
-   conversas;
    
-   mensagens;
    
-   fórmulas;
    
-   documentos;
    
-   fontes;
    
-   proveniência;
    
-   curadoria;
    
-   auditoria;
    
-   configurações;
    
-   billing futuro.
    

### Neo4j

Será a fonte principal para:

-   relações semânticas;
    
-   caminhos entre entidades;
    
-   similaridades;
    
-   compatibilidade entre materiais;
    
-   relações entre famílias e descritores;
    
-   acordes;
    
-   substituições;
    
-   aplicações;
    
-   restrições;
    
-   travessias de múltiplos saltos;
    
-   subgrafos usados pelas tools.
    

### pgvector

Será utilizado para:

-   busca semântica;
    
-   recuperação de documentos;
    
-   similaridade textual;
    
-   interpretação de briefings;
    
-   recuperação de descrições olfativas;
    
-   busca aproximada por intenção sensorial.
    

----------

## 3.4 Identificadores compartilhados

Uma mesma entidade deverá possuir o mesmo identificador lógico no PostgreSQL e no Neo4j.

Exemplo:

```text
PostgreSQL:
materials.id = "mat_iso_e_super"

Neo4j:
(:Material {id: "mat_iso_e_super"})

```

O identificador do domínio não deverá depender do ID interno do Neo4j.

----------

## 3.5 Curadoria explícita

Toda entidade ou relação relevante deverá possuir um estado de curadoria.

```ts
type CurationStatus =
  | 'raw'
  | 'candidate'
  | 'curated'
  | 'needs_review'
  | 'rejected'
  | 'deprecated'

```

Relações candidatas não poderão ser apresentadas como fatos consolidados sem indicação de incerteza.

----------

## 3.6 Proveniência obrigatória

Toda relação ou dado técnico importante deverá permitir rastrear sua origem.

```ts
type Provenance = {
  sourceId: string
  sourceType:
    | 'tgsc'
    | 'scents_flavors'
    | 'pubchem'
    | 'anvisa'
    | 'ifra'
    | 'supplier'
    | 'internal'
    | 'manual_curation'

  sourceReference?: string
  importedAt: string
  reviewedAt?: string
  reviewerId?: string
}

```

----------

# 4. Escopo do MVP

## 4.1 Funcionalidades incluídas

-   autenticação;
    
-   chat com streaming;
    
-   histórico de conversas;
    
-   projetos;
    
-   Golden Dataset;
    
-   busca por materiais;
    
-   perfil técnico de material;
    
-   comparação;
    
-   substituição;
    
-   direção olfativa;
    
-   análise básica de fórmula;
    
-   busca semântica;
    
-   travessias no Neo4j;
    
-   evidências e proveniência;
    
-   status de curadoria;
    
-   feedback do usuário;
    
-   logs de tool calls;
    
-   painel administrativo mínimo;
    
-   pipeline de sincronização PostgreSQL → Neo4j.
    

## 4.2 Fora do escopo inicial

-   garantia regulatória;
    
-   laudos oficiais;
    
-   ERP;
    
-   estoque;
    
-   marketplace;
    
-   colaboração empresarial avançada;
    
-   aplicativo móvel nativo;
    
-   otimização matemática completa de fórmulas;
    
-   dosagem final autônoma;
    
-   integração em tempo real com fornecedores;
    
-   multi-região;
    
-   graph data science avançado em produção;
    
-   recomendação autônoma sem revisão humana.
    

----------

# 5. Arquitetura de alto nível

```text
┌─────────────────────────────────────────────┐
│                 Frontend                    │
│ React + TypeScript                          │
│ Chat, projetos, materiais e fórmulas        │
└──────────────────────┬──────────────────────┘
                       │ HTTPS / Streaming
┌──────────────────────▼──────────────────────┐
│                API Gateway                  │
│ Auth, rate limit, tenant e validação        │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│            Conversation Service             │
│ Histórico, contexto e sessões               │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              Agent Orchestrator             │
│ Prompt, tools, políticas e retries          │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│                Tools Layer                  │
│ Search, Profile, Compare, Substitute        │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              RAGgraph Engine                │
│ Resolução, planejamento e evidências        │
└──────────┬────────────┬────────────┬────────┘
           │            │            │
┌──────────▼───┐ ┌──────▼─────┐ ┌────▼────────┐
│ PostgreSQL   │ │  pgvector  │ │   Neo4j     │
│ Canonical DB │ │ Semantic   │ │ Graph DB    │
└──────────────┘ └────────────┘ └─────────────┘

```

----------

# 6. Stack recomendada

## Frontend
    
-   React;
    
-   TypeScript;
    
-   Tailwind CSS;
    
-   Radix UI ou shadcn/ui;
    
-   Vercel AI SDK ou protocolo próprio de streaming;
    
-   TanStack Query quando necessário.
    

## Backend

-   Node.js;
    
-   TypeScript;
    
-   Fastify;
    
-   Zod;
    
-   Drizzle ORM;
    
-   Neo4j JavaScript Driver;
    
-   OpenTelemetry;
    
-   Pino para logs estruturados.
    

## Persistência

-   Supabase PostgreSQL;
    
-   pgvector;
    
-   Neo4j AuraDB ou instância Neo4j dedicada;
    
-   Cloudflare R2 ou S3 ou Supabase Storage para documentos;
    
-   Redis opcional para cache e filas.
    

## Agente

-   OpenAI API ou Anthropic ou DeepSeek;
    
-   tool calling nativo;
    
-   prompts versionados;
    
-   fallback entre modelos;
    
-   tracing de agentes;
    
-   políticas de custo e timeout.
    

## Infraestrutura

-   Vercel ou Netlify para frontend;
    
-   Railway, Fly.io ou serviço equivalente para backend;
    
-   Supabase para PostgreSQL e autenticação;
    
-   Neo4j AuraDB para o grafo;
    
-   GitHub Actions para CI/CD.
    

## Observabilidade

-   Sentry;
    
-   PostHog;
    
-   OpenTelemetry;
    
-   logs estruturados;
    
-   dashboard interno de qualidade.
    

----------

# 7. Arquitetura de dados

## 7.1 PostgreSQL como sistema canônico

O PostgreSQL armazenará o estado canônico das entidades.

Tabelas principais:

```text
users
organizations
memberships
projects
conversations
messages
agent_runs
tool_calls

materials
material_aliases
material_identifiers
material_descriptors
material_applications

descriptors
families
subfamilies
applications
accords
restrictions

documents
document_chunks
sources
provenance_records

curation_reviews
knowledge_relations
graph_sync_events
feedback
evaluation_cases

```

A tabela `knowledge_relations` manterá uma representação auditável das relações que serão publicadas no Neo4j.

----------

## 7.2 Neo4j como banco de relações

O Neo4j armazenará um grafo derivado das entidades canônicas e das relações aprovadas ou candidatas.

O grafo não substituirá o PostgreSQL para dados transacionais.

Ele será otimizado para:

-   encontrar vizinhanças;
    
-   explorar caminhos;
    
-   calcular similaridade;
    
-   encontrar materiais relacionados;
    
-   buscar substitutos;
    
-   identificar conexões indiretas;
    
-   recuperar subgrafos relevantes para o agente.
    

----------

# 8. Modelo do grafo

## 8.1 Tipos de nós

```text
Material
Descriptor
Family
Subfamily
Application
Accord
Restriction
ChemicalClass
Source

```

## 8.2 Exemplos de propriedades de nós

### Material

```ts
type MaterialNode = {
  id: string
  canonicalName: string
  cas?: string
  materialType?: string
  curationStatus: CurationStatus
  confidenceScore?: number
  updatedAt: string
}

```

### Descriptor

```ts
type DescriptorNode = {
  id: string
  name: string
  status: CurationStatus
  source: 'seed' | 'corpus' | 'manual'
}

```

### Application

```ts
type ApplicationNode = {
  id: string
  name: string
}

```

----------

## 8.3 Tipos de relações

```text
(Material)-[:HAS_DESCRIPTOR]->(Descriptor)

(Material)-[:BELONGS_TO_FAMILY]->(Family)

(Material)-[:BELONGS_TO_SUBFAMILY]->(Subfamily)

(Subfamily)-[:BELONGS_TO_FAMILY]->(Family)

(Material)-[:SIMILAR_TO]->(Material)

(Material)-[:CAN_SUBSTITUTE]->(Material)

(Material)-[:USED_IN]->(Application)

(Material)-[:HAS_RESTRICTION]->(Restriction)

(Material)-[:BELONGS_TO_CHEMICAL_CLASS]->(ChemicalClass)

(Material)-[:PART_OF_ACCORD]->(Accord)

(Accord)-[:COMPATIBLE_WITH]->(Accord)

(Descriptor)-[:RELATED_TO]->(Descriptor)

(Descriptor)-[:BELONGS_TO_SUBFAMILY]->(Subfamily)

(Source)-[:SUPPORTS]->(Material)

```

----------

## 8.4 Propriedades das relações

```ts
type GraphRelationship = {
  relationId: string
  weight?: number
  confidenceScore?: number
  curationStatus: CurationStatus
  sourceIds: string[]
  generatedBy?: string
  createdAt: string
  updatedAt: string
}

```

Exemplo:

```cypher
(:Material {id: 'mat_a'})
-[:SIMILAR_TO {
  relationId: 'rel_123',
  weight: 0.82,
  confidenceScore: 0.74,
  curationStatus: 'candidate'
}]->
(:Material {id: 'mat_b'})

```

----------

# 9. Constraints e índices do Neo4j

O MVP deverá criar constraints para IDs únicos.

```cypher
CREATE CONSTRAINT material_id_unique
IF NOT EXISTS
FOR (n:Material)
REQUIRE n.id IS UNIQUE;

```

Constraints equivalentes deverão existir para:

-   Descriptor;
    
-   Family;
    
-   Subfamily;
    
-   Application;
    
-   Accord;
    
-   Restriction;
    
-   ChemicalClass;
    
-   Source.
    

Índices deverão ser criados para:

-   `Material.canonicalName`;
    
-   `Material.cas`;
    
-   `Material.curationStatus`;
    
-   `Descriptor.name`;
    
-   `Family.name`;
    
-   `Application.name`.
    

Busca textual principal continuará no PostgreSQL, mas índices no Neo4j poderão apoiar consultas específicas de grafo.

----------

# 10. TaxonomySystem

O TaxonomySystem permanecerá como fonte versionada para:

-   famílias;
    
-   subfamílias;
    
-   descritores;
    
-   aliases;
    
-   similaridades;
    
-   stopwords;
    
-   conflitos;
    
-   review queue;
    
-   decisões de curadoria.
    

Artefatos compilados:

```text
taxonomy.json
descriptor_aliases.json
similarity_matrix.json

```

Pipeline:

```text
Seed
+ Corpus
+ Aliases
+ Relações
+ Acordes
+ Stopwords
        ↓
Compile
        ↓
Validation
        ↓
Quality gates
        ↓
compiled/v2
        ↓
Ingestão no PostgreSQL
        ↓
Projeção no Neo4j

```

O compile da taxonomia não deverá escrever diretamente no Neo4j.

Primeiro os resultados serão validados e persistidos no PostgreSQL. Depois, um processo de publicação atualizará o grafo.

----------

# 11. Sincronização PostgreSQL → Neo4j

## 11.1 Estratégia do MVP

O MVP utilizará sincronização assíncrona e idempotente.

```text
Alteração canônica no PostgreSQL
        ↓
Registro em graph_sync_events
        ↓
Worker de sincronização
        ↓
MERGE no Neo4j
        ↓
Confirmação do evento

```

## 11.2 Evento de sincronização

```ts
type GraphSyncEvent = {
  id: string
  entityType:
    | 'material'
    | 'descriptor'
    | 'family'
    | 'subfamily'
    | 'application'
    | 'accord'
    | 'restriction'
    | 'relationship'

  entityId: string
  operation: 'upsert' | 'delete' | 'deprecate'
  payloadVersion: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  attempts: number
  lastError?: string
  createdAt: string
  processedAt?: string
}

```

## 11.3 Requisitos

-   eventos idempotentes;
    
-   retries com backoff;
    
-   dead-letter queue;
    
-   reconciliação periódica;
    
-   logs de divergência;
    
-   suporte a reprocessamento;
    
-   checksum ou versão por entidade;
    
-   ausência de escrita direta pelo agente.
    

----------

# 12. Reconciliação dos bancos

O sistema deverá possuir um job de reconciliação capaz de verificar:

-   nós ausentes;
    
-   nós duplicados;
    
-   relações ausentes;
    
-   relações desatualizadas;
    
-   entidades órfãs;
    
-   divergência de status;
    
-   divergência de versão;
    
-   relações rejeitadas ainda presentes.
    

Exemplo de relatório:

```ts
type GraphReconciliationReport = {
  missingNodes: number
  staleNodes: number
  missingRelationships: number
  staleRelationships: number
  orphanNodes: number
  status: 'ok' | 'warning' | 'failed'
}

```

----------

# 13. Golden Dataset

## 13.1 Objetivo

Criar um núcleo de materiais com qualidade suficiente para demonstrar e validar o produto.

## 13.2 Meta inicial

```text
200 a 500 materiais prioritários

```

## 13.3 Critérios de inclusão

-   relevância comercial;
    
-   frequência de uso;
    
-   importância olfativa;
    
-   cobertura de famílias;
    
-   utilidade em substituições;
    
-   presença em sabonetes, velas, cosméticos ou perfumaria;
    
-   disponibilidade de dados confiáveis.
    

## 13.4 Requisitos para publicação no grafo

Um material Golden deverá possuir:

-   nome canônico;
    
-   CAS ou justificativa de ausência;
    
-   aliases revisados;
    
-   descritores;
    
-   família;
    
-   subfamília, quando aplicável;
    
-   descrição olfativa;
    
-   aplicações;
    
-   fontes;
    
-   status de curadoria;
    
-   confiança;
    
-   pelo menos uma relação válida no grafo.
    

----------

# 14. RAGgraph

## 14.1 Definição

O RAGgraph será o motor de recuperação híbrida da Alquem.io.

Ele combinará:

```text
Entity Resolution
+ Structured Retrieval
+ Vector Retrieval
+ Graph Traversal
+ Rule Filtering
+ Evidence Ranking

```

## 14.2 Pipeline

```text
Pergunta do usuário
  ↓
Classificação de intenção
  ↓
Extração de entidades
  ↓
Resolução de entidades
  ↓
Planejamento de recuperação
  ↓
PostgreSQL + pgvector + Neo4j
  ↓
Filtros de curadoria
  ↓
Ranqueamento
  ↓
Pacote de evidências
  ↓
Tool output
  ↓
Agente

```

## 14.3 Planejamento de recuperação

O motor deverá decidir quais fontes consultar.

Exemplo:

### Pergunta simples

> Qual é o CAS do Iso E Super?

Consulta:

```text
PostgreSQL

```

### Pergunta semântica

> Quero materiais com sensação limpa, transparente e floral.

Consultas:

```text
pgvector
+ PostgreSQL
+ Neo4j

```

### Pergunta relacional

> Quais materiais amadeirados podem substituir outro material mantendo boa compatibilidade com acordes florais?

Consultas:

```text
Neo4j
+ PostgreSQL
+ regras de curadoria

```

----------

# 15. Saída padronizada do RAGgraph

```ts
type KnowledgeResult<T> = {
  data: T

  confidence: 'high' | 'medium' | 'low'
  confidenceScore: number

  curationStatus?: CurationStatus

  warnings: string[]

  evidence: Array<{
    sourceId: string
    sourceType: string
    reference?: string
  }>

  graphEvidence?: Array<{
    path: string[]
    relationshipTypes: string[]
    score?: number
  }>

  retrieval: {
    usedPostgres: boolean
    usedVector: boolean
    usedGraph: boolean
  }
}

```

----------

# 16. Entity Resolution

A resolução deverá seguir esta prioridade:

```text
CAS exato
→ identificador técnico
→ nome canônico
→ alias curado
→ alias candidato
→ busca textual
→ busca semântica

```

Regras:

-   CAS válido tem prioridade.
    
-   Alias rejeitado não participa da resolução automática.
    
-   Alias candidato deve reduzir confiança.
    
-   Termos ambíguos exigem desambiguação.
    
-   Múltiplos resultados devem ser explicitados.
    
-   O Neo4j não será utilizado como primeira camada de resolução por nome.
    
-   A entidade será resolvida no PostgreSQL antes da travessia do grafo.
    

----------

# 17. Tools do MVP

## 17.1 `search_materials`

Responsável por localizar matérias-primas.

Fontes:

-   PostgreSQL Full Text Search;
    
-   trigram;
    
-   pgvector;
    
-   Neo4j para filtros relacionais opcionais.
    

```ts
type SearchMaterialsInput = {
  query: string
  limit?: number
  application?: string
  familyId?: string
  descriptorIds?: string[]
}

type SearchMaterialsOutput = KnowledgeResult<{
  materials: Array<{
    id: string
    canonicalName: string
    cas?: string
    family?: string
    descriptors: string[]
    curationStatus: CurationStatus
  }>
}>

```

----------

## 17.2 `get_material_profile`

Recupera o perfil completo de um material.

Fontes:

-   PostgreSQL para dados canônicos;
    
-   Neo4j para relações;
    
-   pgvector para documentos relacionados.
    

Saída:

-   identidade;
    
-   CAS;
    
-   aliases;
    
-   propriedades;
    
-   descritores;
    
-   família;
    
-   aplicações;
    
-   materiais similares;
    
-   acordes;
    
-   restrições;
    
-   fontes;
    
-   confiança.
    

----------

## 17.3 `compare_materials`

Compara dois ou mais materiais.

```ts
type CompareMaterialsInput = {
  materialIds: string[]

  dimensions?: Array<
    | 'olfactory'
    | 'volatility'
    | 'tenacity'
    | 'applications'
    | 'physchem'
    | 'regulatory'
    | 'graph_relations'
  >
}

```

O Neo4j deverá recuperar:

-   descritores compartilhados;
    
-   famílias compartilhadas;
    
-   vizinhanças;
    
-   caminhos semânticos;
    
-   compatibilidade com acordes;
    
-   aplicações em comum.
    

----------

## 17.4 `find_substitutes`

Essa tool utilizará Neo4j obrigatoriamente.

```ts
type FindSubstitutesInput = {
  materialId: string
  application?: string
  desiredDescriptors?: string[]
  excludedMaterialIds?: string[]
  maxCandidates?: number
}

```

Pipeline:

```text
Material original
  ↓
Perfil canônico
  ↓
Descritores e família
  ↓
Vizinhança no Neo4j
  ↓
Relações SIMILAR_TO e CAN_SUBSTITUTE
  ↓
Compatibilidade de aplicação
  ↓
Restrições
  ↓
Ranqueamento
  ↓
Candidatos

```

Saída:

```ts
type SubstituteCandidate = {
  materialId: string
  score: number
  sharedDescriptors: string[]
  sharedFamilies: string[]
  graphPaths: string[][]
  differences: string[]
  warnings: string[]
  confidence: 'high' | 'medium' | 'low'
}

```

----------

## 17.5 `generate_olfactory_direction`

```ts
type GenerateOlfactoryDirectionInput = {
  brief: string
  application?: string
  targetAudience?: string
  costPreference?: 'low' | 'medium' | 'premium'
  exclusions?: string[]
}

```

Pipeline:

-   interpretar briefing;
    
-   buscar descritores semanticamente;
    
-   mapear descritores no Neo4j;
    
-   identificar famílias e subfamílias;
    
-   buscar materiais associados;
    
-   identificar acordes compatíveis;
    
-   aplicar filtros de aplicação;
    
-   retornar direção olfativa.
    

Saída:

```ts
type OlfactoryDirection = {
  concept: string
  families: string[]
  descriptors: string[]
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
  candidateMaterials: string[]
  accordSuggestions: string[]
  warnings: string[]
  nextTests: string[]
}

```

----------

## 17.6 `analyze_formula`

```ts
type FormulaItem = {
  materialId?: string
  materialName: string
  percentage: number
}

type AnalyzeFormulaInput = {
  items: FormulaItem[]
  application?: string
}

```

O Neo4j será utilizado para:

-   mapear distribuição por famílias;
    
-   mapear descritores dominantes;
    
-   identificar clusters;
    
-   verificar compatibilidade;
    
-   identificar redundância;
    
-   encontrar lacunas;
    
-   sugerir conexões alternativas.
    

Saída:

-   soma da fórmula;
    
-   materiais não resolvidos;
    
-   distribuição por família;
    
-   distribuição por descritor;
    
-   concentração de clusters;
    
-   possíveis excessos;
    
-   possíveis lacunas;
    
-   alertas;
    
-   sugestões de testes.
    

----------

## 17.7 `get_graph_context`

Tool interna para recuperar um subgrafo limitado.

```ts
type GetGraphContextInput = {
  entityId: string
  entityType: string
  relationshipTypes?: string[]
  maxDepth?: number
  maxNodes?: number
}

```

Regras:

-   `maxDepth` limitado;
    
-   `maxNodes` limitado;
    
-   consultas pré-definidas;
    
-   ausência de Cypher livre;
    
-   timeout obrigatório;
    
-   logs de duração e quantidade de nós.
    

----------

## 17.8 `get_regulatory_context`

```ts
type RegulatoryContextInput = {
  materialId: string
  application?: string
  region?: 'BR' | 'EU' | 'US' | 'GLOBAL'
}

```

O Neo4j poderá conectar:

```text
Material
→ HAS_RESTRICTION
→ Restriction
→ APPLIES_TO
→ Application

```

A resposta deverá ser apresentada como contexto técnico, nunca como garantia legal.

----------

# 18. Consultas Cypher controladas

O backend deverá possuir um catálogo de queries aprovadas.

Exemplos:

-   recuperar vizinhança de um material;
    
-   recuperar descritores associados;
    
-   recuperar caminhos até uma família;
    
-   recuperar candidatos de substituição;
    
-   recuperar acordes compatíveis;
    
-   recuperar aplicações;
    
-   recuperar restrições;
    
-   recuperar materiais com relações em comum.
    

Exemplo conceitual:

```cypher
MATCH (source:Material {id: $materialId})
MATCH (source)-[:HAS_DESCRIPTOR]->(descriptor:Descriptor)
MATCH (candidate:Material)-[:HAS_DESCRIPTOR]->(descriptor)
WHERE candidate.id <> source.id
OPTIONAL MATCH (candidate)-[:USED_IN]->(application:Application)
WITH candidate,
     count(DISTINCT descriptor) AS sharedDescriptors,
     collect(DISTINCT application.id) AS applications
RETURN candidate.id AS materialId,
       sharedDescriptors,
       applications
ORDER BY sharedDescriptors DESC
LIMIT $limit

```

Todas as queries deverão usar parâmetros.

Interpolação manual de valores em Cypher será proibida.

----------

# 19. Motor de substituição

## 19.1 Critérios de score

O score inicial poderá combinar:

```text
similaridade de descritores
+ família e subfamília
+ distância no grafo
+ volatilidade
+ tenacidade
+ aplicação
+ compatibilidade de acorde
+ restrições
+ evidência curada

```

Exemplo:

```text
final_score =
  0.25 × descriptor_similarity
+ 0.15 × family_similarity
+ 0.15 × graph_proximity
+ 0.10 × volatility_similarity
+ 0.10 × application_compatibility
+ 0.10 × accord_compatibility
+ 0.10 × curated_evidence
+ 0.05 × regulatory_compatibility

```

Os pesos deverão ser configuráveis e avaliados por testes.

## 19.2 Regras

-   relação `CAN_SUBSTITUTE` curada recebe prioridade;
    
-   relação candidata exige aviso;
    
-   material com restrição incompatível deve ser removido ou penalizado;
    
-   ausência de dados reduz confiança;
    
-   similaridade não implica substituição equivalente;
    
-   aplicação deve influenciar o resultado.
    

----------

# 20. Orquestração do agente

## 20.1 Responsabilidades

O agente deverá:

1.  identificar intenção;
    
2.  extrair entidades;
    
3.  resolver entidades;
    
4.  selecionar tools;
    
5.  validar parâmetros;
    
6.  executar tools;
    
7.  interpretar evidências;
    
8.  solicitar esclarecimento;
    
9.  gerar resposta;
    
10.  declarar confiança;
    
11.  registrar execução.
    

## 20.2 Política de tools

O agente deverá usar tools quando a pergunta envolver:

-   material específico;
    
-   CAS;
    
-   alias;
    
-   comparação;
    
-   substituição;
    
-   fórmula;
    
-   aplicação;
    
-   acordo;
    
-   restrição;
    
-   propriedades técnicas.
    

## 20.3 Limites

O agente não poderá:

-   inventar CAS;
    
-   gerar Cypher livre;
    
-   afirmar conformidade legal;
    
-   ocultar baixa confiança;
    
-   transformar relação candidata em fato;
    
-   recomendar substituto sem contexto quando a aplicação for relevante.
    

----------

# 21. Prompt do sistema

O prompt do agente deverá ser versionado.

Estrutura:

```text
Identidade do agente
Escopo
Regras de tool calling
Política de uso do grafo
Política de confiança
Formato das respostas
Política regulatória
Política de segurança
Tratamento de ausência de dados
Tom de voz

```

Regra obrigatória:

```text
O agente nunca deve citar uma relação recuperada do Neo4j
como fato consolidado quando curationStatus não for "curated".

```

----------

# 22. API

## 22.1 Endpoints principais

```text
POST   /api/v1/chat
GET    /api/v1/conversations
GET    /api/v1/conversations/:id

POST   /api/v1/projects
GET    /api/v1/projects/:id

GET    /api/v1/materials/search
GET    /api/v1/materials/:id

POST   /api/v1/tools/compare
POST   /api/v1/tools/substitutes
POST   /api/v1/tools/olfactory-direction
POST   /api/v1/tools/analyze-formula

POST   /api/v1/feedback

GET    /api/v1/admin/graph-sync
POST   /api/v1/admin/graph-reconcile

```

## 22.2 Erros

```ts
type ApiError = {
  code: string
  message: string
  requestId: string
  details?: Record<string, unknown>
}

```

----------

# 23. Frontend

## 23.1 Rotas

```text
/login
/chat
/chat/[conversationId]
/projects
/projects/[projectId]
/materials
/materials/[materialId]
/formulas
/formulas/[formulaId]
/settings
/admin/curation

```

## 23.2 Componentes

-   ChatMessage;
    
-   MessageComposer;
    
-   ToolExecutionStatus;
    
-   IngredientCard;
    
-   FormulaAnalysisCard;
    
-   OlfactoryPyramidCard;
    
-   SubstituteComparisonTable;
    
-   GraphEvidenceCard;
    
-   ConfidenceBadge;
    
-   EvidenceList;
    
-   SourceCard;
    
-   ProjectSidebar;
    
-   MaterialSearch;
    
-   FeedbackControl.
    

## 23.3 Evidência de grafo

A UI poderá apresentar de forma simplificada:

```text
Iso E Super
→ possui descritor
→ woody

woody
← compartilhado por
← material candidato

```

O usuário não precisará visualizar o grafo completo, mas poderá entender por que uma recomendação foi produzida.

----------

# 24. Segurança

## 24.1 Acesso ao Neo4j

-   credenciais armazenadas em secret manager;
    
-   usuário de aplicação com permissões mínimas;
    
-   leitura separada de escrita;
    
-   sem acesso direto pelo frontend;
    
-   sem Cypher vindo do usuário;
    
-   timeouts;
    
-   limites de profundidade;
    
-   limites de resultados;
    
-   queries parametrizadas;
    
-   auditoria de queries.
    

## 24.2 Prompt injection

Documentos recuperados serão tratados como dados, nunca como instruções.

Medidas:

-   delimitação de conteúdo;
    
-   allowlist de tools;
    
-   validação Zod;
    
-   consultas pré-definidas;
    
-   bloqueio de URLs arbitrárias;
    
-   bloqueio de SQL e Cypher livres;
    
-   sanitização;
    
-   limitação de arquivos.
    

## 24.3 Multi-tenant

Dados compartilhados da base olfativa poderão ser globais.

Dados privados, como fórmulas e projetos, permanecerão no PostgreSQL com isolamento por usuário ou organização.

Caso relações privadas de clientes sejam armazenadas no Neo4j futuramente, deverão possuir `tenantId` obrigatório e filtros em todas as queries.

----------

# 25. Observabilidade

## 25.1 Eventos

```text
conversation_started
message_sent
agent_run_started
tool_called
tool_succeeded
tool_failed

graph_query_started
graph_query_succeeded
graph_query_failed
graph_sync_started
graph_sync_completed
graph_sync_failed
graph_reconciliation_failed

low_confidence_returned
material_not_found
formula_analyzed
feedback_submitted

```

## 25.2 Trace do agente

```ts
type AgentTrace = {
  requestId: string
  conversationId: string
  model: string
  promptVersion: string

  toolCalls: string[]
  graphQueries: string[]

  latencyMs: number
  graphLatencyMs?: number
  vectorLatencyMs?: number
  postgresLatencyMs?: number

  inputTokens: number
  outputTokens: number
  estimatedCost: number

  finalConfidence?: number
}

```

----------

# 26. Métricas técnicas

## Disponibilidade

Meta inicial:

```text
99,0%

```

## Latência

-   busca simples: p95 abaixo de 1,5 segundo;
    
-   perfil de material: p95 abaixo de 2,5 segundos;
    
-   consulta de grafo simples: p95 abaixo de 1 segundo;
    
-   substituição: p95 abaixo de 4 segundos;
    
-   agente com uma tool: p95 abaixo de 8 segundos;
    
-   agente com múltiplas tools: p95 abaixo de 15 segundos.
    

## Métricas do grafo

-   quantidade de nós;
    
-   quantidade de relações;
    
-   relações por tipo;
    
-   nós órfãos;
    
-   eventos de sync pendentes;
    
-   divergências PostgreSQL/Neo4j;
    
-   latência Cypher;
    
-   taxa de timeout;
    
-   profundidade média das travessias;
    
-   resultados retornados por query;
    
-   proporção de relações curadas e candidatas.
    

----------

# 27. Testes

## 27.1 Testes unitários

-   normalização;
    
-   aliases;
    
-   cálculo de score;
    
-   regras de confiança;
    
-   schemas;
    
-   construção de eventos de sync;
    
-   mapeamento de entidades para nós;
    
-   mapeamento de relações.
    

## 27.2 Integração PostgreSQL

-   ingestão;
    
-   constraints;
    
-   transações;
    
-   outbox de eventos;
    
-   proveniência.
    

## 27.3 Integração Neo4j

-   criação de nós;
    
-   criação de relações;
    
-   idempotência com `MERGE`;
    
-   atualização;
    
-   remoção lógica;
    
-   constraints;
    
-   índices;
    
-   queries controladas;
    
-   timeout;
    
-   reconciliação.
    

## 27.4 Testes de contrato

-   schemas das tools;
    
-   compatibilidade agente/tools;
    
-   compatibilidade RAGgraph/Neo4j;
    
-   versionamento de payloads.
    

## 27.5 End-to-end

1.  Usuário pesquisa material.
    
2.  Usuário abre perfil.
    
3.  Usuário compara materiais.
    
4.  Usuário solicita substitutos.
    
5.  Usuário fornece briefing.
    
6.  Usuário analisa fórmula.
    
7.  Usuário salva projeto.
    
8.  Relação curada é publicada no Neo4j.
    
9.  Relação rejeitada deixa de ser usada.
    
10.  Falha de sync é recuperada.
    

## 27.6 Evals de IA

Critérios:

-   correção;
    
-   uso adequado de tools;
    
-   groundedness;
    
-   fidelidade às evidências;
    
-   interpretação correta de relações;
    
-   clareza;
    
-   transparência de confiança;
    
-   ausência de alucinação.
    

----------

# 28. CI/CD

Pipeline:

```text
lint
→ typecheck
→ unit tests
→ PostgreSQL integration tests
→ Neo4j integration tests
→ taxonomy validation
→ graph schema validation
→ build
→ security scan
→ deploy preview
→ smoke tests
→ production

```

O ambiente de CI deverá subir instâncias temporárias de:

-   PostgreSQL;
    
-   Neo4j.
    

----------

# 29. Ambientes

```text
local
development
staging
production

```

Cada ambiente deverá ter:

-   PostgreSQL separado;
    
-   Neo4j separado;
    
-   credenciais próprias;
    
-   buckets separados;
    
-   logs separados;
    
-   configurações de modelo separadas.
    

Não será permitido que desenvolvimento ou staging escreva no grafo de produção.

----------

# 30. Cache

Cache recomendado para:

-   taxonomia;
    
-   aliases;
    
-   perfil de material;
    
-   vizinhanças frequentes;
    
-   resultados de consultas de grafo;
    
-   documentos;
    
-   embeddings.
    

Tecnologias:

-   Redis;
    
-   cache em memória;
    
-   cache por versão de grafo;
    
-   materialized views no PostgreSQL.
    

A chave de cache deverá considerar:

-   ID da entidade;
    
-   versão da taxonomia;
    
-   versão do grafo;
    
-   status de curadoria;
    
-   filtros de aplicação.
    

----------

# 31. Riscos técnicos

## 31.1 Divergência PostgreSQL/Neo4j

Mitigação:

-   outbox;
    
-   eventos idempotentes;
    
-   reconciliação;
    
-   versionamento;
    
-   dashboards;
    
-   retries.
    

## 31.2 Complexidade operacional precoce

Mitigação:

-   Neo4j gerenciado;
    
-   escopo reduzido do grafo;
    
-   queries controladas;
    
-   esquema simples;
    
-   ausência de GDS avançado no primeiro release.
    

## 31.3 Relações de baixa qualidade

Mitigação:

-   status de curadoria;
    
-   confiança;
    
-   proveniência;
    
-   filtros;
    
-   revisão manual;
    
-   não promover automaticamente relações críticas.
    

## 31.4 Consultas Cypher caras

Mitigação:

-   profundidade limitada;
    
-   limite de nós;
    
-   índices;
    
-   timeout;
    
-   catálogo de queries;
    
-   métricas;
    
-   profiling.
    

## 31.5 Agente interpretar caminho como causalidade

Mitigação:

-   tool output estruturado;
    
-   prompt explícito;
    
-   diferença entre relação e evidência;
    
-   apresentação de confiança;
    
-   evals.
    

----------

# 32. Workflow de desenvolvimento

## Etapa 1 — Fundação

-   monorepo;
    
-   TypeScript;
    
-   CI;
    
-   Supabase;
    
-   autenticação;
    
-   Neo4j;
    
-   migrations;
    
-   constraints;
    
-   observabilidade.
    

## Etapa 2 — Modelo canônico

-   schema PostgreSQL;
    
-   entidades;
    
-   relações;
    
-   proveniência;
    
-   curadoria;
    
-   Golden Dataset.
    

## Etapa 3 — Graph Schema

-   nós;
    
-   relações;
    
-   constraints;
    
-   índices;
    
-   mapeadores;
    
-   queries controladas.
    

## Etapa 4 — Sincronização

-   outbox;
    
-   worker;
    
-   retries;
    
-   reconciliação;
    
-   dashboards.
    

## Etapa 5 — RAGgraph

-   entity resolver;
    
-   busca textual;
    
-   pgvector;
    
-   graph retrieval;
    
-   evidence ranking.
    

## Etapa 6 — Tools

-   search;
    
-   profile;
    
-   compare;
    
-   substitutes;
    
-   direction;
    
-   formula analysis;
    
-   regulatory context.
    

## Etapa 7 — Agente

-   prompt;
    
-   tool calling;
    
-   streaming;
    
-   confiança;
    
-   fallback;
    
-   tracing.
    

## Etapa 8 — Frontend

-   chat;
    
-   cards;
    
-   histórico;
    
-   projetos;
    
-   fórmulas;
    
-   feedback;
    
-   evidências de grafo.
    

## Etapa 9 — Evals e piloto

-   benchmark;
    
-   casos de regressão;
    
-   usuários reais;
    
-   melhoria de relações;
    
-   ajuste de pesos.
    

----------

# 33. Roadmap técnico

## Milestone T1 — Core Data

Entregas:

-   PostgreSQL;
    
-   schema canônico;
    
-   ingestão;
    
-   taxonomia;
    
-   aliases;
    
-   Golden Dataset.
    

Critério de saída:

-   materiais prioritários consultáveis;
    
-   dados com proveniência;
    
-   validação automática.
    

----------

## Milestone T2 — Neo4j Foundation

Entregas:

-   ambiente Neo4j;
    
-   graph schema;
    
-   constraints;
    
-   índices;
    
-   mapeadores;
    
-   dados iniciais publicados.
    

Critério de saída:

-   nós e relações do Golden Dataset disponíveis;
    
-   consultas Cypher controladas funcionais;
    
-   zero duplicação por ID.
    

----------

## Milestone T3 — Graph Sync

Entregas:

-   outbox;
    
-   worker;
    
-   retries;
    
-   dead-letter;
    
-   reconciliação;
    
-   logs.
    

Critério de saída:

-   atualizações no PostgreSQL refletidas no Neo4j;
    
-   reprocessamento idempotente;
    
-   divergência detectável.
    

----------

## Milestone T4 — RAGgraph MVP

Entregas:

-   entity resolution;
    
-   PostgreSQL retrieval;
    
-   pgvector;
    
-   Neo4j traversal;
    
-   evidence ranking.
    

Critério de saída:

-   consultas híbridas retornam evidências estruturadas.
    

----------

## Milestone T5 — Tools MVP

Entregas:

-   `search_materials`;
    
-   `get_material_profile`;
    
-   `compare_materials`;
    
-   `find_substitutes`;
    
-   `generate_olfactory_direction`;
    
-   `analyze_formula`.
    

Critério de saída:

-   tools testáveis, versionadas e observáveis.
    

----------

## Milestone T6 — Agent MVP

Entregas:

-   prompt;
    
-   orquestração;
    
-   tool calling;
    
-   streaming;
    
-   confiança;
    
-   tracing.
    

Critério de saída:

-   agente resolve os cinco fluxos principais.
    

----------

## Milestone T7 — SaaS MVP

Entregas:

-   login;
    
-   chat;
    
-   histórico;
    
-   projetos;
    
-   cards;
    
-   feedback;
    
-   evidência de grafo.
    

Critério de saída:

-   produto demonstrável para clientes e investidores.
    

----------

## Milestone T8 — Piloto

Entregas:

-   usuários reais;
    
-   evals;
    
-   painel de curadoria;
    
-   telemetria;
    
-   expansão do Golden Dataset;
    
-   refinamento das relações.
    

Critério de saída:

-   uso recorrente;
    
-   feedback mensurável;
    
-   baseline de qualidade.
    

----------

# 34. Critérios de aceite do MVP

O MVP estará pronto quando:

1.  O usuário conseguir autenticar-se.
    
2.  O usuário conseguir iniciar e retomar conversas.
    
3.  O agente executar tools reais.
    
4.  Os materiais forem resolvidos por nome, CAS e alias.
    
5.  O PostgreSQL armazenar os dados canônicos.
    
6.  O pgvector realizar busca semântica.
    
7.  O Neo4j estiver integrado em produção.
    
8.  O Golden Dataset estiver publicado no grafo.
    
9.  O perfil de material utilizar dados do PostgreSQL e relações do Neo4j.
    
10.  A comparação utilizar relações do grafo.
    
11.  A substituição utilizar o Neo4j obrigatoriamente.
    
12.  A direção olfativa combinar vetor, dados estruturados e grafo.
    
13.  A análise de fórmula gerar contexto relacional.
    
14.  As respostas exibirem confiança.
    
15.  Relações candidatas forem identificadas como candidatas.
    
16.  Todas as tool calls forem registradas.
    
17.  Todas as consultas ao Neo4j forem rastreadas.
    
18.  O pipeline de sincronização for idempotente.
    
19.  O processo de reconciliação estiver funcional.
    
20.  O usuário puder enviar feedback.
    
21.  Os fluxos principais tiverem testes automatizados.
    
22.  O sistema não apresentar contexto regulatório como garantia legal.
    

----------

# 35. Definição técnica de pronto

Uma feature será considerada pronta quando possuir:

-   requisitos implementados;
    
-   schemas validados;
    
-   testes unitários;
    
-   testes de integração PostgreSQL;
    
-   testes de integração Neo4j;
    
-   logs;
    
-   tracing;
    
-   tratamento de erros;
    
-   documentação;
    
-   métricas;
    
-   revisão de segurança;
    
-   deploy em staging;
    
-   smoke tests;
    
-   aceite de produto.
    

----------

# 36. Decisões arquiteturais

## ADR-001

PostgreSQL será a fonte de verdade canônica e transacional.

## ADR-002

Neo4j fará parte obrigatória do MVP.

## ADR-003

Neo4j será a fonte operacional para relações e travessias.

## ADR-004

pgvector será utilizado para recuperação semântica.

## ADR-005

O agente não poderá executar SQL ou Cypher livre.

## ADR-006

O acesso ao conhecimento ocorrerá por tools tipadas.

## ADR-007

PostgreSQL e Neo4j compartilharão IDs de domínio.

## ADR-008

A sincronização será assíncrona, idempotente e auditável.

## ADR-009

O TaxonomySystem permanecerá versionado em Git.

## ADR-010

Corpus amplo e Golden Dataset serão tratados separadamente.

## ADR-011

Proveniência e confiança serão obrigatórias.

## ADR-012

Todas as tool calls e consultas de grafo serão registradas.

## ADR-013

Relações candidatas não serão tratadas como fatos consolidados.

## ADR-014

Graph Data Science avançado ficará fora do primeiro release, mas o schema deverá permitir sua adoção futura.

----------

# 37. Stack final recomendada para o MVP

```text
Frontend
React + TypeScript + Tailwind CSS

Backend
Fastify + TypeScript + Zod

Auth
Supabase Auth

Banco canônico
Supabase PostgreSQL

Busca vetorial
pgvector

Banco de grafo
Neo4j AuraDB

Taxonomia
TaxonomySystem + JSON compilado

Sincronização
PostgreSQL Outbox + Worker TypeScript

Agente
OpenAI ou Anthropic ou DeepSeek com tool calling

Documentos
Cloudflare R2 ou Supabase Storage

Cache
Redis opcional

Observabilidade
Sentry + PostHog + OpenTelemetry

CI/CD
GitHub Actions

Deploy
Vercel/Netlify + Railway/Fly.io + Supabase + Neo4j AuraDB

```

----------

# 38. Resumo técnico

A arquitetura do Alquem.io seguirá esta separação:

```text
Chat
  ↓
Agente
  ↓
Tools
  ↓
RAGgraph
  ├── PostgreSQL
  ├── pgvector
  ├── Neo4j
  ├── Taxonomia
  └── Documentos

```

O modelo de linguagem será responsável pela interpretação e pela comunicação.

As tools representarão as capacidades do produto.

O PostgreSQL armazenará as entidades canônicas e transacionais.

O pgvector recuperará contexto semântico.

O Neo4j representará as relações olfativas e permitirá travessias que sustentam comparação, substituição, acordes e análise de fórmulas.

O TaxonomySystem manterá coerência semântica, versionamento e curadoria.

A sincronização entre PostgreSQL e Neo4j será explícita, auditável e idempotente.

O diferencial técnico da Alquem.io será a combinação de:

```text
Base olfativa proprietária
+ taxonomia curada
+ recuperação semântica
+ grafo Neo4j
+ tools especializadas
+ agente de IA
+ feedback de uso

```

O Neo4j não será uma evolução futura opcional. Ele será parte da fundação do MVP e do motor RAGgraph desde a primeira versão comercial demonstrável.