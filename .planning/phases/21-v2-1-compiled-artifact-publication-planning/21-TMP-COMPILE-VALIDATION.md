# Phase 21 Plan 01 - Tmp Compile Validation Results

Este documento registra a validação e compilação em ambiente temporário (`/tmp`) da taxonomia v2.1 após a adição do descritor `petitgrain` sob a subfamília `citrus/citrus_fresh` na Fase 20.

**Status Final: PASS**

---

## 1. Comando Executado

A compilação foi executada a partir do diretório `src/` utilizando caminhos explícitos para isolar os artefatos oficiais de qualquer mutação acidental:

```bash
node dist/cli/compile.js \
  --seed ../data/taxonomy/taxonomy-seed.v2.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --corpus ../data/enriched_materials.json \
  --relations ../data/inference/curated_relations.v2.json \
  --accords ../data/inference/accord_map.v2.json \
  --noise ../data/inference/semantic_noise.v1.json \
  --out /tmp/taxonomy-phase21-v2-1-compile \
  --version 2.1.0 \
  --generated-at 2026-05-26T00:00:00.000Z \
  --quality-report
```

---

## 2. Caminhos dos Outputs Temporários

Os três arquivos foram gerados com sucesso no diretório `/tmp`:

- [x] `/tmp/taxonomy-phase21-v2-1-compile/taxonomy.json`
- [x] `/tmp/taxonomy-phase21-v2-1-compile/descriptor_aliases.json`
- [x] `/tmp/taxonomy-phase21-v2-1-compile/similarity_matrix.json`

---

## 3. Comparação de Métricas (Métrica Local vs. Oficial v2.0.0)

A tabela abaixo compara as propriedades métricas do novo compilado v2.1.0 temporário contra o compilado oficial v2.0.0 atual (`data/compiled/v2/`):

| Métrica / Propriedade | Compilado Atual (v2.0.0) | Compilado Novo (/tmp - v2.1.0) | Análise / Variação |
| :--- | :--- | :--- | :--- |
| **Versão do Artefato** | `2.0.0` | `2.1.0` | **+0.1.0** (Correto - atualização menor devido a novos dados de seed) |
| **Data de Geração** | `2026-01-01T00:00:00.000Z` | `2026-05-26T00:00:00.000Z` | Timestamp fixo e determinístico aplicado com sucesso |
| **Famílias de Seed** | `10` | `10` | Estável (Sem novos grupos de alta hierarquia) |
| **Subfamílias de Seed** | `18` | `18` | Estável |
| **Total de Descritores** | `303` | `305` | **+2** descritores. Reflete a inclusão bem-sucedida de `petitgrain` e seu desdobramento na taxonomia final |
| **Mapeamento de Aliases** | `11` | `11` | Estável (Sinônimos curados inalterados) |
| **Arestas de Similaridade**| `13` | `13` | Estável (Grafo limpo de similaridades mantido) |
| **Itens na Fila de Revisão**| `317` | `316` | **-1** item. A adição de `petitgrain` ao seed removeu seu estado pendente na fila de revisão, validando a curadoria |
| **Status do Quality Gate** | `PASS` | `PASS` | Sem violações de integridade, sem erros no compilador |

---

## 4. Warnings & Avisos Encontrados

O compilador reportou **3 warnings** de severidade média na fila de revisão:
- `seed_corpus_conflict`: Conflitos residuais de frequências/presença que já estavam documentados e aceitos por política.
- `corpus_candidate_low_support`: Candidatos de baixa frequência que permanecem para futura curadoria.

Nenhum desses avisos é impeditivo (`blocking`) para publicação. Eles respeitam as decisões de governança anteriores.

---

## 5. Auditoria de Mutação e Proteção de Caminhos

Após a validação, foi verificado o estado de git do repositório:
- O diretório oficial `data/compiled/v2` está **100% limpo** (sem diffs).
- Os caminhos protegidos (`data/taxonomy/`, `data/inference/`, `src/cli/parse_args.ts`, `src/package.json` e `scripts/check-safety-guards.sh`) permaneceram intocados.
- O único estado modificado no repositório são arquivos em `graphify-out/*` (modificados antes desta sessão, aceitos por política).

---

## 6. Conclusão da Validação

> [!NOTE]
> **Resultado da Validação: PASS**
>
> A taxonomia baseada nos novos dados da Fase 20 compila de forma limpa, é semanticamente válida e adere a todos os critérios de qualidade e governança. O repositório está pronto para a publicação oficial dos artefatos em `data/compiled/v2` através do **Plan 21-02**.
