# Pitfalls Research — Olfactory Taxonomy System

> Researched: 2026-05-12

## Riscos Identificados

### 🔴 Alto Risco

#### 1. Qualidade dos descriptors no corpus
**Problema**: `enriched_materials.json` vem de TGSC + Scents & Flavors. Os odor descriptions podem ser inconsistentes, multilíngues, ou usar terminologia não-padrão.
**Mitigação**: Inspeção manual dos campos de odor antes de construir a pipeline. Normalização agressiva. Fallback para seed manual quando corpus é ambíguo.

#### 2. Dimensões de similaridade com pesos arbitrários
**Problema**: A combinação de 4 dimensões (semantic, accord, tradition, overlap) com pesos fixos pode produzir rankings contra-intuitivos.
**Mitigação**: Começar com pesos iguais (0.25 cada). Exportar dimensões individuais no JSON para permitir tuning posterior. Incluir breakdown por dimensão na saída.

### 🟡 Médio Risco

#### 3. Alias detection com falsos positivos
**Problema**: String similarity pode considerar "musk" e "musky" como aliases quando são semanticamente diferentes (substantivo vs adjetivo com nuance diferente).
**Mitigação**: Threshold conservador. Lista de exceções. Review manual dos aliases detectados.

#### 4. Escopo creep nas families
**Problema**: 12-20 families parece simples, mas a fronteira entre families é subjetiva. "amber" vs "resinous"? "smoky" vs "leather"?
**Mitigação**: Seguir o prompt.md como guia. Documentar rationale para cada boundary decision. Permitir que descriptors pertençam a múltiplas subfamilies (cross-references).

#### 5. Memory pressure com 70MB JSON
**Problema**: `JSON.parse()` de 70MB aloca ~200-300MB. Com processamento, pode atingir 500MB+.
**Mitigação**: Streaming obrigatório. Extrair apenas campos necessários durante o parse. Não manter o corpus inteiro em memória.

### 🟢 Baixo Risco

#### 6. Subfamilies sem descriptors suficientes
**Problema**: Algumas subfamilies do seed podem ter poucos descriptors no corpus (ex: "green_galbanum" é muito específico).
**Mitigação**: Relatório de cobertura. Minimum threshold de descriptors por subfamily. Sugestão de merge para subfamilies thin.

#### 7. Formato do similarity graph
**Problema**: Adjacency list com keys "a::b" pode ter problemas de lookup (precisa testar "a::b" E "b::a").
**Mitigação**: Normalizar a ordem das keys (alphabetical). Documentar a convenção claramente.

## Anti-Patterns a Evitar

1. **NÃO carregar corpus inteiro em memória** → streaming
2. **NÃO hardcodar families na lógica** → families vêm do seed JSON
3. **NÃO usar regex para normalization** → pipeline explícita de transformações
4. **NÃO gerar N² matrix** → sparse graph com threshold
5. **NÃO misturar build-time e runtime concerns** → Builder gera JSONs, runtime consome
6. **NÃO ignorar descriptors raros** → logar mas não descartar (podem ser valiosos para nichos)

## Lessons from Similar Systems

- **Pyrfume** (Python): Usa PCA + clustering para reduzir dimensionalidade olfativa. Interessante para v2 mas overengineering para v1.
- **Michael Edwards Wheel**: Boa referência para adjacência/tradição mas muito simplificado para IA.
- **GoodScents/Leffingwell**: Datasets de referência. Verificar se nosso corpus tem cobertura similar.

## Confidence

- **Alta** — Riscos são gerenciáveis com as mitigações propostas
- **Ponto crítico** — Qualidade dos odor descriptions no corpus é o maior unknown. Recomendo inspeção manual cedo.
